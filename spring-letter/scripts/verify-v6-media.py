"""Decode actual exported frames; bind the result to G and the recording bytes."""
from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
import json
import re
import shutil
import sys
import uuid

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'evidence'


def digest(file):
    with Path(file).open('rb') as stream:
        result = sha256()
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()


def now():
    return datetime.now(timezone.utc).isoformat()


def candidate_identity():
    manifest_file = EVIDENCE / 'v6-build-candidate-g.json'
    manifest = json.loads(manifest_file.read_text(encoding='utf-8'))
    directory = Path(manifest['outDir']).resolve()
    assert directory == (ROOT / '.qa-v6/candidate-g').resolve()
    html_file = directory / 'index.html'
    html = html_file.read_text(encoding='utf-8')
    entry = re.search(r'<script\b[^>]*\bsrc="([^" ]+\.js)"[^>]*>', html).group(1)
    style = re.search(r'<link\b[^>]*\bhref="([^" ]+\.css)"[^>]*>', html).group(1)
    assert entry == manifest['entry'] == '/assets/index-BAJMaxNn.js'
    identity = {'candidate': 'candidate-g', 'manifestFile': manifest_file.relative_to(ROOT).as_posix(),
                'manifestSha256': digest(manifest_file), 'indexSha256': digest(html_file),
                'entry': entry, 'styleBuild': style}
    for key, asset in (('entrySha256', entry), ('styleSha256', style)):
        assert re.fullmatch(r'/assets/[a-zA-Z0-9_.-]+', asset)
        item = next(item for item in manifest['dist'] if item['path'] == asset[1:])
        file = directory / item['path']
        assert file.stat().st_size == item['bytes']
        assert digest(file) == item['sha256']
        identity[key] = item['sha256']
    return identity


def validate_report(report, expected, video_hash, video_bytes):
    """Pure guards: tests must never label synthetic bytes as decoded footage."""
    assert report['success'] is True and report['uncut'] is True
    assert report['audioRecorded'] is False and not report.get('failure')
    assert report.get('errors') == [] and report.get('requestsFailed') == []
    assert report['candidate'] == expected, 'Recording candidate identity differs'
    build = report['build']
    for key in ('entry', 'styleBuild', 'entrySha256', 'styleSha256'):
        assert build[key] == expected[key], 'Wrong recording asset: ' + key
    assert build['finalEntry'] == build['entry']
    assert build['finalStyleBuild'] == build['styleBuild']
    assert report['file'] == 'spring-letter-v6-uncut-silent.webm'
    assert report['fileBytes'] == video_bytes and video_bytes > 1000
    assert report['fileSha256'] == video_hash, 'Video differs from the browser export'
    assert report['viewport'] == [1440, 900]
    assert report['openingElapsedMs'] >= 47000


def copy_actual_artifacts(attempt, names):
    copies, previous = [], []
    for name in names:
        assert Path(name).name == name and '/' not in name and '\\' not in name
        source, destination = attempt / name, EVIDENCE / name
        if destination.exists():
            backup = attempt / 'previous-canonical' / name
            backup.parent.mkdir(parents=True, exist_ok=True)
            assert not backup.exists()
            shutil.copyfile(destination, backup)
            assert digest(backup) == digest(destination)
            previous.append({'file': name, 'retained': backup.relative_to(ROOT).as_posix(),
                             'sha256': digest(backup)})
        shutil.copyfile(source, destination)
        assert digest(source) == digest(destination)
        copies.append({'file': name, 'source': source.relative_to(ROOT).as_posix(),
                       'canonical': destination.relative_to(ROOT).as_posix(),
                       'bytes': source.stat().st_size, 'sha256': digest(source)})
    record = {'date': now(), 'copies': copies, 'previous': previous,
              'scope': 'Byte copies of this actual decode attempt; prior canonical results retained.'}
    (attempt / 'copy-manifest.json').write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding='utf-8')


def verify_media():
    # Heavy decoding is invoked only from main, after the GPU recording handoff.
    vendored = ROOT.parent / 'docs/blossom/tools/python-deps'
    if vendored.is_dir():
        sys.path.insert(0, str(vendored))
    import av
    from PIL import Image, ImageDraw

    attempt_id = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:8]
    attempt = EVIDENCE / 'v6-media-runs' / attempt_id
    attempt.mkdir(parents=True, exist_ok=False)
    report_file = EVIDENCE / 'v6-recording-verification.json'
    try:
        report_bytes = report_file.read_bytes()
        report = json.loads(report_bytes)
        expected = candidate_identity()
        assert report['file'] == 'spring-letter-v6-uncut-silent.webm'
        video = EVIDENCE / report['file']
        video_hash, video_bytes = digest(video), video.stat().st_size
        validate_report(report, expected, video_hash, video_bytes)
        retained = (ROOT / report['retainedDirectory']).resolve()
        assert retained.is_relative_to((EVIDENCE / 'v6-record-runs').resolve())
        assert retained.name == report['runId']
        assert (retained / report_file.name).read_bytes() == report_bytes
        assert digest(retained / report['file']) == video_hash
        copy_manifest = json.loads((EVIDENCE / 'v6-recording-copy-manifest.json').read_text(encoding='utf-8'))
        assert copy_manifest['runId'] == report['runId']
        assert copy_manifest['retainedDirectory'] == report['retainedDirectory']
        for name, expected_hash in ((report['file'], video_hash), (report_file.name, sha256(report_bytes).hexdigest())):
            item = next(item for item in copy_manifest['copies'] if item['file'] == name)
            assert item['sha256'] == expected_hash
            assert (ROOT / item['source']).resolve() == retained / name
            assert (ROOT / item['canonical']).resolve() == (EVIDENCE / name).resolve()

        frames, previous, first, last = 0, -1.0, None, None
        images, next_sample, last_frame = [], 0.0, None
        with av.open(str(video)) as container:
            assert len(container.streams.video) == 1
            assert len(container.streams.audio) == 0, 'The recording is explicitly silent'
            stream = container.streams.video[0]
            width, height = stream.codec_context.width, stream.codec_context.height
            assert [width, height] == report['viewport']
            for frame in container.decode(stream):
                assert frame.pts is not None and frame.time_base is not None
                assert not frame.is_corrupt, 'Decoder marked a corrupt video frame'
                assert [frame.width, frame.height] == report['viewport']
                seconds = float(frame.pts * frame.time_base)
                assert seconds > previous, 'Presentation timestamps must increase'
                previous = seconds
                first = seconds if first is None else first
                last = seconds
                frames += 1
                last_frame = frame
                if seconds >= next_sample:
                    picture = frame.to_image()
                    picture.thumbnail((360, 225))
                    images.append((seconds, picture.copy()))
                    next_sample += 15.0
            assert frames > 1000 and last - first > 90
            # Always include the real last frame, even between 15-second samples.
            if images[-1][0] != last:
                picture = last_frame.to_image()
                picture.thumbnail((360, 225))
                images.append((last, picture.copy()))

        assert digest(video) == video_hash, 'Video changed during decoding'
        assert report_file.read_bytes() == report_bytes, 'Recording report changed during decoding'
        columns, rows = 4, (len(images) + 3) // 4
        sheet = Image.new('RGB', (columns * 360, rows * 251), '#14121e')
        draw = ImageDraw.Draw(sheet)
        for index, (seconds, picture) in enumerate(images):
            x, y = (index % columns) * 360, (index // columns) * 251
            sheet.paste(picture, (x, y))
            draw.text((x + 8, y + 231), f'{int(seconds//60):02d}:{seconds%60:04.1f}', fill='#f0e8d9')
        sheet_name = 'v6-recording-decoded-contact.jpg'
        sheet.save(attempt / sheet_name, quality=88)
        result = {'date': now(), 'passed': True, 'file': report['file'], 'sha256': video_hash,
                  'bytes': video_bytes, 'dimensions': [width, height], 'decodedFrames': frames,
                  'firstTimestampSeconds': first, 'lastTimestampSeconds': last, 'audioStreams': 0,
                  'timestampsStrictlyIncreasing': True, 'corruptFrames': 0,
                  'contactSheet': sheet_name, 'contactSampleTimestamps': [seconds for seconds, _ in images],
                  'recordingReportSha256': sha256(report_bytes).hexdigest(),
                  'candidateManifestSha256': expected['manifestSha256'], 'build': report['build'],
                  'retainedDirectory': report['retainedDirectory'], 'decodeDirectory': attempt.relative_to(ROOT).as_posix(),
                  'decoder': {'library': 'PyAV', 'version': av.__version__},
                  'scope': 'Every actual WebM frame decoded with PyAV, with increasing presentation timestamps, constant dimensions and no decoder-marked corrupt frames. The browser export digest, retained originals, recording report digest and final G assets are all checked. The contact sheet uses actual 15-second samples plus the final decoded frame. This does not certify subjective visual quality, audio or exact wall-clock synchronization.'}
        (attempt / 'v6-media-decoding.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        copy_actual_artifacts(attempt, ['v6-media-decoding.json', sheet_name])
        print(json.dumps(result, ensure_ascii=False))
        return result
    except Exception as error:
        failure = {'date': now(), 'passed': False, 'error': repr(error),
                   'recordingReportSha256': digest(report_file) if report_file.is_file() else None,
                   'scope': 'Failed actual media verification attempt. No successful decode or replacement footage is claimed.'}
        (attempt / 'v6-media-decoding-failure.json').write_text(json.dumps(failure, ensure_ascii=False, indent=2), encoding='utf-8')
        raise


if __name__ == '__main__':
    verify_media()
