"""Decode an actual v9 browser recording, retaining PTS and independent clocks.

Usage: python -X utf8 scripts/analyze-v9-actual-audio.py CAPTURE_DIRECTORY
Writes analysis.json, analysis.md and first-score-original-volume.mp3 beside
the original recording. No browser, generated score, normalization or music
replacement is used. Measurement does not constitute human listening review.
"""
from pathlib import Path
from fractions import Fraction
import argparse
import hashlib
import json
import math
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT.parent / 'docs/blossom/tools/python-deps'))
import av
import numpy as np

MUTE_START_GUARD = 1.1
MUTE_END_GUARD = .2
MUTE_PEAK_DB = -100.0
MUTE_RMS_DB = -120.0
SIGNAL_RMS_FLOOR_DB = -70.0
SIGNAL_PEAK_FLOOR_DB = -50.0


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def db(value):
    return 20 * math.log10(value) if value > 0 else None


def level_stats(data, rate):
    if not data.size:
        return {'empty': True, 'sampleFrames': 0, 'sampleValues': 0,
                'decodedCoverageSeconds': 0.0}
    values = data.astype(np.float64)
    assert np.isfinite(values).all(), 'Non-finite decoded PCM must not be concealed'
    absolute = np.abs(values)
    peak = float(absolute.max())
    rms = float(np.sqrt(np.mean(values * values)))
    return {'sampleFrames': int(data.shape[1]), 'sampleValues': int(data.size),
            'decodedCoverageSeconds': data.shape[1] / rate,
            'peak': peak, 'peakDbFS': db(peak), 'rms': rms, 'rmsDbFS': db(rms),
            'clippedValuesAtOrAbove1': int((absolute >= 1).sum()),
            'nearFullScaleValuesAtOrAbove0999': int((absolute >= .999).sum()),
            'exactZeroValues': int((values == 0).sum()),
            'exactZeroFraction': float((values == 0).mean()),
            'channelRms': [float(v) for v in np.sqrt(np.mean(values * values, axis=1))],
            'channelDcMean': [float(v) for v in values.mean(axis=1)]}


def main(directory):
    directory = directory.resolve()
    source = directory / 'game-output.webm'
    capture_file = directory / 'capture.json'
    capture = json.loads(capture_file.read_text(encoding='utf-8'))
    evidence = capture['capture']
    segments = {s['label']: s for s in capture['segments']}
    for label in ['stage-listen-1', 'muted-three-seconds', 'stage-listen-2']:
        assert label in segments, 'Missing recorded segment: ' + label
    assert capture.get('scope', {}).get('listeningPerformed') is False
    assert capture.get('scope', {}).get('gameAudioApiInvokedByTest') is False
    recorded_hash = next((f['sha256'] for f in capture['files']
                          if f['file'] == source.name), None)
    source_hash = sha256(source)
    assert recorded_hash == source_hash, 'Original recording does not match capture report SHA-256'

    frames, frame_timeline, packets = [], [], []
    with av.open(str(source)) as container:
        stream = container.streams.audio[0]
        rate = stream.codec_context.sample_rate
        channels = stream.codec_context.channels
        layout = stream.codec_context.layout.name
        stream_info = {'codec': stream.codec_context.name, 'sampleRate': rate,
                       'channels': channels, 'layout': layout,
                       'timeBase': str(stream.time_base),
                       'containerDurationSeconds': container.duration / 1e6 if container.duration else None}
        assert rate == 48000 and layout == 'stereo', 'Expected the captured 48 kHz stereo mix'
        for packet in container.demux(stream):
            if packet.size:
                packets.append({'pts': packet.pts, 'dts': packet.dts,
                                'timeBase': str(packet.time_base), 'filePosition': packet.pos,
                                'seconds': float(packet.pts * packet.time_base) if packet.pts is not None else None,
                                'durationSeconds': float(packet.duration * packet.time_base),
                                'bytes': packet.size})
            for frame in packet.decode():
                assert frame.pts is not None, 'Do not invent missing frame presentation times'
                assert frame.format.name == 'fltp' and frame.sample_rate == rate and frame.layout.name == layout
                pcm = frame.to_ndarray().copy()
                timestamp = float(frame.pts * frame.time_base)
                frames.append((timestamp, pcm))
                frame_timeline.append({'pts': frame.pts, 'timeBase': str(frame.time_base),
                                       'startSeconds': timestamp, 'samples': pcm.shape[1],
                                       'durationSeconds': pcm.shape[1] / rate})
    assert frames, 'No actual audio frames decoded'
    pcm = np.concatenate([data for _, data in frames], axis=1)
    start_pts = frames[0][0]
    end_pts = frames[-1][0] + frames[-1][1].shape[1] / rate
    gaps, frame_deltas = [], []
    for index in range(1, len(frames)):
        previous_end = frames[index - 1][0] + frames[index - 1][1].shape[1] / rate
        gap = frames[index][0] - previous_end
        frame_deltas.append(gap)
        if abs(gap) > .025:
            gaps.append({'previousFrameEnd': previous_end, 'nextFrameStart': frames[index][0],
                         'gapSeconds': gap, 'frameIndex': index})

    def select_region(start, end):
        """Select by each frame's own PTS, never by concatenated wall offset.

        Missing packets remain absent. No zero padding or silence substitution.
        """
        assert end > start, 'Non-positive measurement interval'
        pieces = []
        for timestamp, data in frames:
            low = max(0, math.ceil((start - timestamp) * rate - 1e-6))
            high = min(data.shape[1], math.floor((end - timestamp) * rate + 1e-6))
            if high > low:
                pieces.append(data[:, low:high])
        return np.concatenate(pieces, axis=1) if pieces else np.empty((channels, 0), dtype=np.float32)

    def region(start, end):
        selected = select_region(start, end)
        return {'startMediaSeconds': start, 'endMediaSeconds': end,
                'requestedPresentationSeconds': end - start,
                'containsLargePtsGap': any(g['gapSeconds'] > 0 and
                    g['previousFrameEnd'] < end and g['nextFrameStart'] > start for g in gaps),
                **level_stats(selected, rate)}

    section_stats = []
    for segment in capture['segments']:
        section_stats.append({'name': segment['label'],
                              'recordedStartContexts': segment['startContexts'],
                              'recordedEndContexts': segment['endContexts'],
                              **region(segment['startWallSeconds'], segment['endWallSeconds'])})
    mute_segment = segments['muted-three-seconds']
    mute_interval = [mute_segment['startWallSeconds'] + MUTE_START_GUARD,
                     mute_segment['endWallSeconds'] - MUTE_END_GUARD]
    assert mute_interval[1] - mute_interval[0] >= 1.5, 'Guard must not collapse into a cherry-picked silent tail'
    mute_stats = region(*mute_interval)
    mute_windows = []
    window_start = mute_interval[0]
    while window_start < mute_interval[1] - 1e-9:
        window_end = min(window_start + .1, mute_interval[1])
        mute_windows.append(region(window_start, window_end))
        window_start = window_end
    mute_peak_limit = 10 ** (MUTE_PEAK_DB / 20)
    mute_rms_limit = 10 ** (MUTE_RMS_DB / 20)
    mute_checks = {
        'fixedGuardAtLeast1Point5Seconds': mute_interval[1] - mute_interval[0] >= 1.5,
        'nonemptyCoverageAtLeast99Percent': mute_stats.get('decodedCoverageSeconds', 0) >= .99 * (mute_interval[1] - mute_interval[0]),
        'noLargePtsGapInsideGuard': not mute_stats['containsLargePtsGap'],
        'guardedPeakWithinLimit': mute_stats.get('peak', math.inf) <= mute_peak_limit,
        'wholeGuardedRmsWithinLimit': mute_stats.get('rms', math.inf) <= mute_rms_limit,
        'every100msRmsWithinLimit': all(w.get('rms', math.inf) <= mute_rms_limit for w in mute_windows),
    }
    worst_mute_window = max(mute_windows, key=lambda window: window.get('rms', math.inf))
    audible_sections = [section for section in section_stats if section['name'] in ['stage-listen-1', 'stage-listen-2']]
    presence_checks = {}
    for section in audible_sections:
        presence_checks[section['name']] = (section.get('rms', 0) > 10 ** (SIGNAL_RMS_FLOOR_DB / 20)
            and section.get('peak', 0) > 10 ** (SIGNAL_PEAK_FLOOR_DB / 20)
            and section.get('decodedCoverageSeconds', 0) > section['requestedPresentationSeconds'] * .95)

    origin = evidence['start']
    context_origin = origin['contexts'][0]['currentTime']
    wall_duration = (evidence['stopped']['performanceMs'] - origin['performanceMs']) / 1000
    marks = [{'label': mark['label'], 'wallSeconds': mark['recordingWallSeconds'],
              'performanceMs': mark['performanceMs'], 'contexts': mark['contexts'],
              'contextDeltaSinceRecording': mark['contexts'][0]['currentTime'] - context_origin,
              'contextDeltaMinusWallSeconds': mark['contexts'][0]['currentTime'] - context_origin - mark['recordingWallSeconds']}
             for mark in evidence['marks']]
    before_book = segments.get('book-saved-score-excerpt', {}).get('startWallSeconds', math.inf)
    pre_book_residuals = [mark['contextDeltaMinusWallSeconds'] for mark in marks
                          if mark['wallSeconds'] < before_book and mark['contexts'][0]['state'] == 'running']
    clock_matches_before_book = bool(pre_book_residuals) and max(abs(v) for v in pre_book_residuals) < .12
    chunks = [event for event in evidence['events'] if event['type'] == 'chunk']
    chunk_alignment, cumulative_bytes = [], 0
    for chunk in chunks:
        cumulative_bytes += chunk['bytes']
        available = [packet for packet in packets if packet['filePosition'] is not None
                     and packet['seconds'] is not None and packet['filePosition'] >= 0
                     and packet['filePosition'] + packet['bytes'] <= cumulative_bytes]
        wall = (chunk['performanceMs'] - origin['performanceMs']) / 1000
        packet_end = available[-1]['seconds'] + available[-1]['durationSeconds'] if available else None
        chunk_alignment.append({'arrivalWallSeconds': wall, 'timecodeMilliseconds': chunk['timecode'],
                                'bytes': chunk['bytes'], 'cumulativeBytes': cumulative_bytes,
                                'lastFullyDeliveredPacketEndSeconds': packet_end,
                                'packetEndMinusArrivalWallSeconds': packet_end - wall if packet_end is not None else None,
                                'contexts': chunk['contexts']})
    first_chunk_performance = chunks[0]['performanceMs'] if chunks else None
    chunk_time_residuals = [(chunk['performanceMs'] - first_chunk_performance - chunk['timecode']) / 1000 for chunk in chunks]
    suspended_observations = []
    for kind, observations in [('mark', evidence['marks']), ('sample', evidence['samples']), ('chunk', chunks)]:
        for item in observations:
            if any(c['state'] == 'suspended' for c in item['contexts']):
                suspended_observations.append({'kind': kind, 'label': item.get('label'),
                                               'wallSeconds': (item['performanceMs'] - origin['performanceMs']) / 1000,
                                               'contexts': item['contexts']})

    first_segment = segments['stage-listen-1']
    preview_bounds = [first_segment['startWallSeconds'], first_segment['endWallSeconds']]
    preview_region = region(*preview_bounds)
    assert not preview_region['containsLargePtsGap'], 'Refuse to hide a packet gap by splicing the preview'
    preview_pcm = select_region(*preview_bounds)
    preview_path = directory / 'first-score-original-volume.mp3'
    with av.open(str(preview_path), 'w', format='mp3') as container:
        stream = container.add_stream('libmp3lame', rate=rate)
        stream.bit_rate = 192000
        stream.layout = layout
        for offset in range(0, preview_pcm.shape[1], 1152):
            frame = av.AudioFrame.from_ndarray(preview_pcm[:, offset:offset + 1152].copy(), format='fltp', layout=layout)
            frame.sample_rate = rate
            frame.pts = offset
            frame.time_base = Fraction(1, rate)
            for packet in stream.encode(frame):
                container.mux(packet)
        for packet in stream.encode(None):
            container.mux(packet)
    with av.open(str(preview_path)) as container:
        preview_frames = list(container.decode(audio=0))
    assert preview_frames, 'Exported MP3 could not be decoded'
    decoded_preview = np.concatenate([frame.to_ndarray() for frame in preview_frames], axis=1)
    levels = level_stats(pcm, rate)
    mp3_levels = level_stats(decoded_preview, rate)
    engine_stats = [sample['audio'] for sample in evidence['samples'] if sample.get('audio')]
    checks = {
        'captureInputChecksPassed': capture.get('passed') is True,
        'originalWebmHashMatches': source_hash == recorded_hash,
        'sampleClippingAbsent': levels['clippedValuesAtOrAbove1'] == 0,
        'bothListensContainNonSilentSignal': len(presence_checks) == 2 and all(presence_checks.values()),
        'fixedMuteInteriorPassed': all(mute_checks.values()),
        'preBookAudioContextAndWallClocksAgreeWithin120ms': clock_matches_before_book,
        'allObservedInstrumentLoadsHealthy': bool(engine_stats) and all(len(s['loadedSamples']) == 7 and not s['loadErrors'] for s in engine_stats),
        'previewDecodedAndDurationRetained': abs(decoded_preview.shape[1] / rate - preview_pcm.shape[1] / rate) < .01,
        'previewSampleClippingAbsent': mp3_levels['clippedValuesAtOrAbove1'] == 0,
    }
    report = {
        'passed': all(checks.values()),
        'source': {'file': str(source), 'sha256': source_hash, 'bytes': source.stat().st_size,
                   'captureJson': str(capture_file), 'captureJsonSha256': sha256(capture_file),
                   'entry': capture.get('entry'), 'expectedJs': capture.get('expectedJs'),
                   'capturePassed': capture.get('passed'), 'provenance': capture.get('provenance')},
        'scope': {'actualBrowserMixedOutput': True, 'generatedArrangement': False,
                  'humanListeningPerformed': False, 'normalizationApplied': False,
                  'method': 'PyAV full decode and PTS-aware selection of original samples. No missing packets padded with zeros.',
                  'limitations': ['Sample peak is not oversampled true peak, and RMS dBFS is not LUFS.',
                                 'Non-silent PCM does not prove instrument balance, musical interest or perceptual audibility on every device.',
                                 'The source is lossy Opus, not independently measured analogue speaker output.',
                                 'MP3 is a lossy original-gain excerpt; codec conversion can slightly change sample peaks.']},
        'decode': {'library': 'PyAV ' + av.__version__, 'numpy': np.__version__, 'stream': stream_info,
                   'frames': len(frames), 'packets': len(packets), 'firstFramePtsSeconds': start_pts,
                   'lastFrameEndSeconds': end_pts, 'sumDecodedSampleSeconds': pcm.shape[1] / rate,
                   'presentationSpanSeconds': end_pts - start_pts, 'largePtsGapsOrOverlaps': gaps,
                   'frameDeltaRangeSeconds': [min(frame_deltas), max(frame_deltas)] if frame_deltas else [],
                   'frameTimeline': frame_timeline, 'packetTimeline': packets},
        'levels': levels, 'sections': section_stats,
        'signalPresence': {'peakFloorDbFS': SIGNAL_PEAK_FLOOR_DB, 'rmsFloorDbFS': SIGNAL_RMS_FLOOR_DB,
                           'status': 'Project signal-presence floor, not a psychoacoustic audibility standard or listening review.',
                           'checks': presence_checks},
        'mute': {'fullRecordedSegment': next(s for s in section_stats if s['name'] == 'muted-three-seconds'),
                 'fixedGuard': {'afterSegmentStartSeconds': MUTE_START_GUARD, 'beforeSegmentEndSeconds': MUTE_END_GUARD,
                               'adaptedToMeasuredResidual': False, 'mediaInterval': mute_interval},
                 'stableInterior': mute_stats, 'windows100ms': mute_windows, 'strongest100msWindow': worst_mute_window,
                 'engineeringLimits': {'samplePeakDbFSMax': MUTE_PEAK_DB, 'rmsDbFSMax': MUTE_RMS_DB,
                                       'peakLinearMax': mute_peak_limit, 'rmsLinearMax': mute_rms_limit,
                                       'scope': 'Entire fixed interior and every 100 ms subwindow, including the final shorter window.'},
                 'checks': mute_checks, 'passed': all(mute_checks.values()),
                 'interpretation': 'Report residual values even when nonzero. The fixed interior was not moved or shortened to obtain zero PCM.'},
        'clockAlignment': {'wallDurationSeconds': wall_duration,
                           'audioContextDeltaSeconds': evidence['stopped']['contexts'][0]['currentTime'] - context_origin,
                           'wallMinusLastMediaEndSeconds': wall_duration - end_pts,
                           'marks': marks, 'suspendedObservations': suspended_observations,
                           'preBookContextMinusWallRangeSeconds': [min(pre_book_residuals), max(pre_book_residuals)] if pre_book_residuals else [],
                           'chunks': chunk_alignment,
                           'chunkTimecodeRelativeArrivalResidualRangeSeconds': [min(chunk_time_residuals), max(chunk_time_residuals)] if chunk_time_residuals else [],
                           'interpretation': 'First-chunk timecode is not the audio start. Packet PTS and byte-delivery alignment are retained. Modal context suspension and any packet gaps remain distinct; absent packets are not measured silence.'},
        'engineObserved': capture.get('observed'), 'bookCancellationFromCapture': capture.get('bookCancellation'),
        'actualComposition': capture.get('composed'), 'afterListening': capture.get('afterListening'),
        'preview': {'file': str(preview_path), 'sha256': sha256(preview_path), 'bytes': preview_path.stat().st_size,
                    'encoder': 'libmp3lame via local PyAV', 'bitRate': 192000, 'sampleRate': rate, 'channels': channels,
                    'sourceSegment': 'stage-listen-1', 'sourceMediaInterval': preview_bounds,
                    'sourceDecodedSeconds': preview_pcm.shape[1] / rate, 'decodedMp3Levels': mp3_levels,
                    'gainProcessing': 'None. Direct original PCM excerpt; no normalization, fades, gain adjustment, supplementary music or score synthesis.'},
        'checks': checks,
    }
    (directory / 'analysis.json').write_text(json.dumps(report, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')
    def db_text(value):
        return '−∞' if value is None else f'{value:.2f}'
    rows = ['# v9 实际游戏混音录音分析', '',
            '本报告分析浏览器实际输出的录音，未用离线配乐替代。没有进行人工听感审查。', '',
            f"- 构建：`{capture.get('entry', {}).get('src')}`，SHA-256 `{capture.get('entry', {}).get('sha256')}`。",
            f'- 原始 WebM：`{source.name}`，SHA-256 `{source_hash}`。',
            f'- 录音墙钟 {wall_duration:.4f} 秒；媒体首 PTS {start_pts:.4f} 秒、末帧结束 {end_pts:.4f} 秒；实际解码样本 {pcm.shape[1] / rate:.4f} 秒。',
            f"- 全量解码样本峰值 {levels['peak']:.8g}（{db_text(levels['peakDbFS'])} dBFS），RMS {levels['rms']:.8g}（{db_text(levels['rmsDbFS'])} dBFS），绝对值 ≥1.0 的样本 {levels['clippedValuesAtOrAbove1']} 个。",
            '- “未达到数字满幅样本”不等同于证明模拟输出无失真；这里没有过采样 true-peak 或 LUFS 结论。', '',
            '| 实录段落 | 媒体区间 / 秒 | 有效解码 / 秒 | RMS dBFS | 峰值 dBFS |',
            '|---|---:|---:|---:|---:|']
    for section in section_stats:
        rows.append(f"| {section['name']} | {section['startMediaSeconds']:.4f}–{section['endMediaSeconds']:.4f} | {section['decodedCoverageSeconds']:.4f} | {db_text(section.get('rmsDbFS'))} | {db_text(section.get('peakDbFS'))} |")
    rows += ['', '## 固定静音保护区', '',
             f"完整静音段为 {mute_segment['startWallSeconds']:.4f}–{mute_segment['endWallSeconds']:.4f} 秒。检查严格采用开始后 **1.1 秒**至结束前 **0.2 秒**，即 **{mute_interval[0]:.4f}–{mute_interval[1]:.4f} 秒**；保留 {mute_interval[1] - mute_interval[0]:.4f} 秒，没有根据结果移动或裁窄区间。", '',
             f"保护区峰值 {mute_stats.get('peak', 0):.10g}（{db_text(mute_stats.get('peakDbFS'))} dBFS），RMS {mute_stats.get('rms', 0):.10g}（{db_text(mute_stats.get('rmsDbFS'))} dBFS）；精确零样本比例 {mute_stats.get('exactZeroFraction', 0) * 100:.6f}%。", '',
             f"既定工程线：样本峰值 ≤{MUTE_PEAK_DB:.0f} dBFS，整段及每个 100 ms 子窗 RMS ≤{MUTE_RMS_DB:.0f} dBFS（末尾短窗也检查）。该线是工程残留检查，不是听觉标准。结果：{'通过' if report['mute']['passed'] else '未通过'}。完整静音段和全部固定子窗数据都保存在 JSON。", '',
             f"最强子窗为 {worst_mute_window['startMediaSeconds']:.4f}–{worst_mute_window['endMediaSeconds']:.4f} 秒，RMS {db_text(worst_mute_window.get('rmsDbFS'))} dBFS。整段 RMS 是否达标：{mute_checks['wholeGuardedRmsWithinLimit']}；全部子窗是否达标：{mute_checks['every100msRmsWithinLimit']}。若只有子窗未达线，也如实保留失败，不改窗口或阈值。", '',
             '## 两段输出与时间轴', '',
             '两段听奏分别检查原始区间的解码覆盖和信号能量。通过表示两段均有明确非静默数字输出，不表示人工已听辨所有乐器、音乐平衡或情绪效果。', '',
             f"书册之前 AudioContext 相对时间减墙钟时间范围为 {min(pre_book_residuals) * 1000:.3f} 至 {max(pre_book_residuals) * 1000:.3f} ms。原始 PTS、音频包字节位置、MediaRecorder chunk timecode 和到达时间、AudioContext 状态均逐项保留。", '',
             f"记录到 {len(suspended_observations)} 条 suspended 观察，以及 {len(gaps)} 处大于 25 ms 的 PTS 间隙/重叠。书册播放前的短暂停留不能被简单拼接 PCM 时间轴抹掉；不存在的数据没有补零伪装成静音。", '',
             '## 原音量预览', '',
             f"[第一段实际乐谱 MP3]({preview_path.name})，取原始媒体 {preview_bounds[0]:.4f}–{preview_bounds[1]:.4f} 秒，共 {preview_pcm.shape[1] / rate:.4f} 秒有效样本，48 kHz 立体声、192 kbps。保持原增益，无归一化、补配乐、淡化或重编曲；MP3 编码本身有损。", '',
             f"机器核验汇总：{'通过' if report['passed'] else '未通过'}。该结论仅适用于上面标出的构建和录音；最终构建应将其录音目录作为同一脚本参数重新分析。**尚无人工听感结论。**", '']
    (directory / 'analysis.md').write_text('\n'.join(rows), encoding='utf-8')
    print(json.dumps({'passed': report['passed'], 'directory': str(directory), 'entry': capture.get('entry'),
                      'levels': levels, 'listens': [{k: s[k] for k in ['name', 'peakDbFS', 'rmsDbFS', 'decodedCoverageSeconds']} for s in audible_sections],
                      'mute': {'interval': mute_interval, **mute_stats}, 'checks': checks,
                      'preview': str(preview_path), 'humanListeningPerformed': False}, ensure_ascii=False, indent=2))
    return 0 if report['passed'] else 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('capture_directory', type=Path, help='Directory containing capture.json and game-output.webm')
    arguments = parser.parse_args()
    sys.exit(main(arguments.capture_directory))
