"""Decode a real browser capture; preserve packet presentation times across suspension.
No browser, generated arrangement, normalization, or listening claim is involved.
"""
from pathlib import Path
from fractions import Fraction
import sys, json, math, hashlib, shutil
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'docs/blossom/tools/python-deps'))
import av

CAPTURE=Path(sys.argv[1]) if len(sys.argv)>1 else Path(json.loads((ROOT/'evidence/v7-audio/latest-capture.json').read_text(encoding='utf-8'))['directory'])
CAPTURE=CAPTURE.resolve()
OUT=ROOT/'evidence/v7-audio'
source=CAPTURE/'game-output.webm'
capture=json.loads((CAPTURE/'capture.json').read_text(encoding='utf-8'))
c=capture['capture']; marks={m['label']:m for m in c['marks']}
RATE=48000
db=lambda value:20*math.log10(value) if value>0 else None
def stats(data):
    if not data.size:return {'sampleFrames':0,'empty':True}
    x=data.astype(np.float64);a=np.abs(x);peak=float(a.max());rms=float(np.sqrt(np.mean(x*x)))
    return {'sampleFrames':int(data.shape[1]),'sampleValues':int(data.size),'secondsOfSamples':data.shape[1]/RATE,
            'peak':peak,'peakDbFS':db(peak),'rms':rms,'rmsDbFS':db(rms),
            'clippedValuesAtOrAbove1':int((a>=1).sum()),'nearFullScaleValuesAtOrAbove0999':int((a>=.999).sum()),
            'exactZeroValues':int((data==0).sum()),'exactZeroFraction':float((data==0).mean()),
            'channelRms':[float(v) for v in np.sqrt(np.mean(x*x,axis=1))],
            'channelDcMean':[float(v) for v in x.mean(axis=1)],
            'crestFactorDb':db(peak/rms) if rms else None}

decoded=[];packets=[]
with av.open(source) as container:
    stream=container.streams.audio[0]
    stream_info={'codec':stream.codec_context.name,'sampleRate':stream.codec_context.sample_rate,
                 'channels':stream.codec_context.channels,'layout':stream.codec_context.layout.name,
                 'timeBase':str(stream.time_base),'containerDurationSeconds':container.duration/1e6 if container.duration else None}
    for packet in container.demux(stream):
        if packet.size:packets.append({'pts':packet.pts,'dts':packet.dts,'filePosition':packet.pos,'seconds':float(packet.pts*packet.time_base) if packet.pts is not None else None,'durationSeconds':float(packet.duration*packet.time_base),'bytes':packet.size})
        for frame in packet.decode():
            assert frame.format.name=='fltp' and frame.layout.name=='stereo' and frame.sample_rate==RATE
            decoded.append((float(frame.pts*frame.time_base),frame.to_ndarray().copy()))
assert decoded,'No audio frames decoded'
pcm=np.concatenate([data for _,data in decoded],axis=1)
first=decoded[0][0];last=decoded[-1][0]+decoded[-1][1].shape[1]/RATE
gaps=[];jitter=[]
for i in range(1,len(decoded)):
    previous_end=decoded[i-1][0]+decoded[i-1][1].shape[1]/RATE
    gap=decoded[i][0]-previous_end
    if abs(gap)>.05:gaps.append({'previousFrameEnd':previous_end,'nextFrameStart':decoded[i][0],'gapSeconds':gap,'frameIndex':i})
    else:jitter.append(gap)

def region(start,end):
    """Select only decoded samples whose own frame PTS overlaps this media interval.
    Do not invent zero-valued PCM for timestamps where the suspended context emits no packets.
    """
    pieces=[]
    for pts,data in decoded:
        lo=max(0,math.ceil((start-pts)*RATE-1e-6));hi=min(data.shape[1],math.floor((end-pts)*RATE+1e-6))
        if hi>lo:pieces.append(data[:,lo:hi])
    selected=np.concatenate(pieces,axis=1) if pieces else np.empty((2,0),dtype=np.float32)
    return {'startMediaSeconds':start,'endMediaSeconds':end,'requestedPresentationSeconds':end-start,
            'decodedCoverageSeconds':selected.shape[1]/RATE,**stats(selected)}

windows={}
for duration in [.1,1.0]:
    values=[]
    for start in np.arange(0,last-duration+.001,duration):
        values.append(region(round(float(start),4),round(float(start+duration),4)))
    rms=np.array([w['rms'] for w in values if w.get('sampleFrames')]);nonzero=rms[rms>0]
    windows[str(duration)]={'windowSeconds':duration,'windowCount':len(values),
       'rmsPercentilesIncludingSilence':{str(p):float(np.percentile(rms,p)) for p in [0,10,50,90,95,100]},
       'nonzeroRmsDbFSPercentiles':{str(p):db(float(np.percentile(nonzero,p))) for p in [10,50,90,95,100]},
       'windows':values}

wall_start=c['start']['performanceMs'];wall_stop=c['stopped']['performanceMs']
wall_duration=(wall_stop-wall_start)/1000
ctx_start=c['start']['contexts'][0]['currentTime'];ctx_stop=c['stopped']['contexts'][0]['currentTime']
mute_start=marks['mute-active']['recordingWallSeconds'];unmute_request=marks['unmute-request-before-click']['recordingWallSeconds']
# The mute interval precedes context suspension. Leave >1 s for the exponential
# master fade, compressor/Opus residue, plus timestamp jitter; stop before unmute.
mute_guard=[mute_start+1.1,unmute_request-.2]
mute=region(*mute_guard)
# Project engineering acceptance floor, fixed independently of the measured
# residual: <= -100 dBFS sample peak and <= -120 dBFS RMS. This is not an
# audibility standard. Keep the existing +1.1/-0.2 s guard; do not trim to zeros.
MUTE_PEAK_LIMIT=10**(-100/20)
MUTE_RMS_LIMIT=10**(-120/20)
mute_windows=[]
for start in np.arange(mute_guard[0],mute_guard[1]-.00001,.1):
    mute_windows.append(region(float(start),min(float(start)+.1,mute_guard[1])))
mute_checks={'peakWithinLimit':mute.get('peak',math.inf)<=MUTE_PEAK_LIMIT,
             'wholeIntervalRmsWithinLimit':mute.get('rms',math.inf)<=MUTE_RMS_LIMIT,
             'every100msWindowRmsWithinLimit':all(w.get('rms',math.inf)<=MUTE_RMS_LIMIT for w in mute_windows),
             'nonemptyDecodedCoverage':bool(mute.get('sampleFrames'))}
pause_start=marks['pause-active'];pause_end=marks['pause-ended']
suspended=[s for s in c['samples'] if s['contexts'][0]['state']=='suspended']
pause_range=(min(s['recordingWallSeconds'] for s in suspended),max(s['recordingWallSeconds'] for s in suspended))
pause_context_values=[s['contexts'][0]['currentTime'] for s in suspended]
chunks=[e for e in c['events'] if e['type']=='chunk']
chunk_origin=chunks[0]['performanceMs']
chunk_residuals=[(e['performanceMs']-chunk_origin-e['timecode'])/1000 for e in chunks]
chunk_packet_alignment=[];cumulative_bytes=0
for chunk in chunks:
    cumulative_bytes+=chunk['bytes']
    contained=[p for p in packets if p['filePosition'] is not None and 0<=p['filePosition']<cumulative_bytes]
    if contained:
        packet=contained[-1];wall=(chunk['performanceMs']-wall_start)/1000
        end=packet['seconds']+packet['durationSeconds']
        chunk_packet_alignment.append({'arrivalWallSeconds':wall,'cumulativeBytes':cumulative_bytes,
          'lastPacketPresentationEndSeconds':end,'packetEndMinusArrivalWallSeconds':end-wall})
prepause_marks=[m for m in c['marks'] if m['recordingWallSeconds']<=marks['pause-request-before-settings']['recordingWallSeconds']]
prepause_clock_residuals=[m['contexts'][0]['currentTime']-ctx_start-m['recordingWallSeconds'] for m in prepause_marks]
mark_projection=[]
for name,m in marks.items():
    mark_projection.append({'label':name,'wallSeconds':m['recordingWallSeconds'],
      'contextSeconds':m['contexts'][0]['currentTime'],'contextDeltaSinceRecording':m['contexts'][0]['currentTime']-ctx_start,
      'contextState':m['contexts'][0]['state']})

mark_time=lambda label:marks[label]['recordingWallSeconds']
sections=[('garden-still',.3,mark_time('garden-footsteps-start')),
          ('garden-footsteps',mark_time('garden-footsteps-start'),mark_time('garden-footsteps-end')),
          ('challenge',mark_time('challenge-start'),mark_time('challenge-cancelled')),
          ('flower-and-wind',mark_time('flower-solid'),mark_time('flower-rest')),
          ('mute-stable',*mute_guard),
          ('after-unmute',mark_time('unmute-active')+.5,mark_time('pause-request-before-settings')-.2),
          ('after-pause',mark_time('pause-ended')+.6,last-.2)]
section_stats=[{'name':name,**region(a,b)} for name,a,b in sections]

# A straight 55-second excerpt before any context suspension. Original gain is
# preserved; no loudness normalization, music replacement, editing, or fades.
preview=pcm[:,:55*RATE]
mp3=OUT/'game-audio.mp3';OUT.mkdir(parents=True,exist_ok=True)
with av.open(mp3,'w',format='mp3') as container:
    stream=container.add_stream('libmp3lame',rate=RATE);stream.bit_rate=192000;stream.layout='stereo'
    for offset in range(0,preview.shape[1],1152):
        frame=av.AudioFrame.from_ndarray(preview[:,offset:offset+1152].copy(),format='fltp',layout='stereo')
        frame.sample_rate=RATE;frame.pts=offset;frame.time_base=Fraction(1,RATE)
        for packet in stream.encode(frame):container.mux(packet)
    for packet in stream.encode(None):container.mux(packet)
with av.open(mp3) as container:mp3_frames=list(container.decode(audio=0))
mp3_pcm=np.concatenate([f.to_ndarray() for f in mp3_frames],axis=1)
preview_copy=ROOT.parent/'docs/blossom/media/v7/game-audio.mp3';preview_copy.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(mp3,preview_copy)
global_stats=stats(pcm)
report={
 'source':{'file':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
           'captureJson':str(CAPTURE/'capture.json'),'expectedBundle':capture.get('expectedJs'),'assets':capture.get('assets'),
           'capturePassed':capture['passed'],'captureErrors':capture['errors'],'consoleErrors':capture['consoleErrors'],'recorderErrors':c['errors']},
 'scope':{'actualBrowserMixedOutput':True,'offlineArrangement':False,'listeningPerformed':False,
          'method':'Full PyAV Opus decode into float32 PCM; amplitude statistics on decoded samples. Per-region selections follow each frame PTS, never a naïve concatenated wall timeline.',
          'limitations':['Sample peaks are not oversampled true peaks. RMS dBFS is not LUFS, and does not establish perceived balance or musical quality.',
                         'Opus is lossy. The analysis describes decoded recording output, not an independently measured analogue speaker output.',
                         'MediaRecorder timestamps jitter at millisecond scale. Mute is tested in a deliberately guarded interior before the pause; unfilled pause PTS gaps are reported as absent packets, not measured digital silence.']},
 'decode':{'library':'PyAV '+av.__version__,'stream':stream_info,'frames':len(decoded),'packets':len(packets),
           'firstFramePtsSeconds':first,'lastFrameEndSeconds':last,'sumDecodedSampleSeconds':pcm.shape[1]/RATE,
           'presentationSpanSeconds':last-first,'largeTimestampGaps':gaps,
           'ordinaryFrameTimestampJitterSeconds':{'min':min(jitter),'max':max(jitter),'median':float(np.median(jitter))}},
 'levels':global_stats,'sections':section_stats,'shortWindows':windows,
 'clockAlignment':{'recordingWallSeconds':wall_duration,'recordingAudioContextDeltaSeconds':ctx_stop-ctx_start,
                   'wallMinusPresentationEndSeconds':wall_duration-last,'contextDeltaMinusDecodedSeconds':ctx_stop-ctx_start-pcm.shape[1]/RATE,
                   'firstChunkArrivalSinceStartSeconds':(chunk_origin-wall_start)/1000,
                   'chunkTimecodeMinusRelativeArrivalResidualSeconds':{'min':min(chunk_residuals),'max':max(chunk_residuals),'median':float(np.median(chunk_residuals))},
                   'prepauseContextDeltaMinusWallSeconds':{'min':min(prepause_clock_residuals),'max':max(prepause_clock_residuals)},
                   'chunkPacketAlignment':chunk_packet_alignment,
                   'alignmentReview':'Before suspension, AudioContext delta closely tracks recording-wall time; packet PTS preserves the recorded presentation timeline. Packet end precedes chunk delivery by roughly one Opus frame. That delivery lag is recorded, not misused as a timestamp-origin shift. The unchanged 1.1/0.2-second mute guard is much wider than millisecond jitter.',
                   'interpretation':'WebM PTS retains the pause gap; concatenated decoded PCM removes it. Chunk timecode starts at the first chunk arrival, about one second after recording starts, so it is not a zero-based audio sample timestamp.',
                   'marks':mark_projection},
 'mute':{'requestBeforeClickWallSeconds':marks['mute-request-before-click']['recordingWallSeconds'],
         'observedMutedWallSeconds':mute_start,'unmuteRequestBeforeClickWallSeconds':unmute_request,
         'guardedMediaInterval':mute_guard,'stableWindow':mute,
         'guardRule':{'afterObservedMuteSeconds':1.1,'beforeUnmuteRequestSeconds':.2,'unchangedFromExactZeroCheck':True},
         'engineeringThreshold':{'version':1,'samplePeakDbFSMax':-100,'samplePeakLinearMax':MUTE_PEAK_LIMIT,
                                 'rmsDbFSMax':-120,'rmsLinearMax':MUTE_RMS_LIMIT,
                                 'rmsScope':'Full guarded interval and every 100 ms subwindow, including a shorter final window.',
                                 'status':'Explicit project acceptance floor for decoded recording residual, not an audibility or mastering standard.'},
         'exactZeroDiagnostic':{'allValuesZero':mute.get('exactZeroFraction')==1,'fraction':mute.get('exactZeroFraction')},
         'guarded100msWindows':mute_windows,'thresholdChecks':mute_checks,
         'passed':all(mute_checks.values()),
         'interpretation':'Judge the fixed guarded interval against the declared peak/RMS engineering floor. Preserve exact-zero fraction separately: passing does not mean every sample is zero. Tiny decaying residual is consistent with gain smoothing and Opus residue; these measurements do not independently identify its cause or replace a listening review.'},
 'pause':{'suspendedSampleCount':len(suspended),'observedSuspendedWallRange':pause_range,
          'suspendedContextTimeRange':[min(pause_context_values),max(pause_context_values)],
          'pauseActiveMark':pause_start['recordingWallSeconds'],'pauseEndedMark':pause_end['recordingWallSeconds'],
          'pauseEndedMarkContextState':pause_end['contexts'][0]['state'],
          'passed':max(pause_context_values)-min(pause_context_values)<.000001 and len(gaps)==1 and gaps[0]['gapSeconds']>3,
          'interpretation':f"AudioContext stayed fixed while suspended. The recorder emitted no packets through a {gaps[0]['gapSeconds']:.3f}-second presentation gap. The pause-ended flag may precede actual async context resumption; captured context states are retained. Absence of packets is not represented as fabricated silence samples."},
 'engineBudget':capture.get('observed'),
 'preview':{'file':str(mp3),'copy':str(preview_copy),'sha256':hashlib.sha256(mp3.read_bytes()).hexdigest(),
            'bytes':mp3.stat().st_size,'encoder':'libmp3lame via local PyAV','bitRate':192000,'channels':2,'sampleRate':RATE,
            'sourceSampleIntervalSeconds':[0,55],'decodedMp3Levels':stats(mp3_pcm),
            'gainProcessing':'None; first 55 seconds at captured gain, no normalization or offline score mixing.',
            'content':'Garden theme and ambience 0–18 s; footsteps 18–22 s; dawn chase/collection 22–37 s; flower burst and dragging roughly 40–55 s.'}
}
report['checks']={'allFramesDecoded':True,'sampleClippingAbsent':global_stats['clippedValuesAtOrAbove1']==0,
                  'stableMuteWithinDeclaredThreshold':report['mute']['passed'],'suspendedClockAndPacketGapConsistent':report['pause']['passed'],
                  'mp3Decoded55Seconds':abs(mp3_pcm.shape[1]/RATE-55)<.01,'mp3SampleClippingAbsent':report['preview']['decodedMp3Levels']['clippedValuesAtOrAbove1']==0}
(OUT/'actual-analysis.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def d(v):return '−∞' if v is None else f'{v:.2f}'
lines=['# v7 游戏真实混音录音检查','',
       '本报告检查浏览器游戏实际输出。没有使用离线编曲样片替代实录，没有声称经过人工听感试听。','',
       f"- 原始实录：`{source.relative_to(ROOT).as_posix()}`；JS `{capture.get('expectedJs')}`。",
       f'- 全量解码：{len(decoded)} 帧、48 kHz 立体声；有效 PCM {pcm.shape[1]/RATE:.3f} 秒，媒体时间跨度 {last:.3f} 秒，录音墙钟 {wall_duration:.3f} 秒。',
       f"- 峰值：{global_stats['peak']:.6f}（{d(global_stats['peakDbFS'])} dBFS）；RMS {global_stats['rms']:.6f}（{d(global_stats['rmsDbFS'])} dBFS）；≥1.0 削波样本 {global_stats['clippedValuesAtOrAbove1']}。",
       '- RMS 是数字样本统计，不是 LUFS；峰值也不是过采样 true peak。这些结果不能代替听感、扬声器或耳机检查。','',
       '| 实录段落 | 媒体时间 / s | RMS dBFS | 峰值 dBFS |','|---|---:|---:|---:|']
for section in section_stats:lines.append(f"| {section['name']} | {section['startMediaSeconds']:.2f}–{section['endMediaSeconds']:.2f} | {d(section.get('rmsDbFS'))} | {d(section.get('peakDbFS'))} |")
lines+=['','## 静音与暂停','',
        f'静音状态在墙钟 {mute_start:.3f} 秒确认；恢复请求在 {unmute_request:.3f} 秒发出。固定检查规则仍为“确认静音后 1.1 秒至恢复请求前 0.2 秒”，本次对应媒体 {mute_guard[0]:.4f}–{mute_guard[1]:.4f} 秒，没有为了避开残留而移动窗口。',
        '', '工程静音验收阈值明确设为：样本峰值 ≤ −100 dBFS（1×10⁻⁵），整段及每个 100 ms 子窗的 RMS ≤ −120 dBFS（1×10⁻⁶，末尾不足 100 ms 也检查）。这是本项目对解码残留的固定验收线，不是听觉可感知性标准，也不等同于样本必须全零。',
        '', f"本次保护区峰值 {mute['peak']:.8g}（{d(mute['peakDbFS'])} dBFS），整段 RMS {mute['rms']:.8g}（{d(mute['rmsDbFS'])} dBFS）；最强 100 ms 子窗 RMS {d(db(max(w.get('rms',0) for w in mute_windows)))} dBFS。精确零比例为 {100*mute['exactZeroFraction']:.3f}%，全零诊断为 {mute['exactZeroFraction']==1}；工程阈值验收为 {'通过' if report['mute']['passed'] else '未通过'}。微量衰减残留与增益平滑及 Opus 残留相符，但统计本身不能独立判定其来源。",
        '', f'暂停前各标记的 AudioContext 相对时间与录音墙钟之差为 {min(prepause_clock_residuals)*1000:.2f} 至 {max(prepause_clock_residuals)*1000:.2f} ms。额外按文件字节位置将每个 MediaRecorder chunk 对上末尾音频包，确认约一帧的交付延迟没有被误用成时间原点偏移；逐 chunk 对应值见 JSON。', '',
        f'暂停采样中 AudioContext 保持在 {min(pause_context_values):.6f} 秒。WebM 在 {gaps[0]["previousFrameEnd"]:.3f}–{gaps[0]["nextFrameStart"]:.3f} 秒之间没有音频包（{gaps[0]["gapSeconds"]:.3f} 秒缺口）。因此，连续拼接的 PCM 只有 {pcm.shape[1]/RATE:.3f} 秒；媒体播放器时间仍有 {last:.3f} 秒。不能从暂停后的墙钟位置直接截取连续 PCM 并判断漏声。',
        '', '恢复按钮完成的标记早于 AudioContext 异步恢复；报告保留了该时刻仍为 suspended 的事实。暂停期间是没有音频包，未凭空补零并宣称测到了静默。',
        '', '## 试听文件','',
        f'`{mp3.relative_to(ROOT).as_posix()}` 是前 55 秒游戏实录，192 kbps MP3，原增益，无归一化、拼曲或替换音乐。包含庭园、脚步、追风拾取、花尘与风笔。复制到 `{preview_copy}`。',
        '', '这里只完成全量解码、音量和时钟核验；尚无人工听感试听结论。完整 100 ms / 1 s 短窗、资源状态与输出文件哈希见 `actual-analysis.json`。']
(OUT/'actual-analysis.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(json.dumps({'levels':global_stats,'checks':report['checks'],'mute':mute,'pause':report['pause'],'preview':report['preview']},ensure_ascii=False,indent=2))
assert all(report['checks'].values()),'One or more audio capture checks failed'
