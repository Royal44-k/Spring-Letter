"""Verify actual distributed audio and complete original decoding, without playback."""
from process_audio import RESEARCH, OUTPUT, sha, av, np
from pathlib import Path
import json, zipfile, wave

manifest=json.loads((OUTPUT/'sources.json').read_text(encoding='utf8'))
processed=[]
for record in manifest['assets']:
    path=OUTPUT/record['file']
    assert sha(path)==record['processedSha256']
    assert sha(RESEARCH/record['sourceFile'])==record['sourceSha256']
    with wave.open(str(path),'rb') as wav:
        assert (wav.getnchannels(),wav.getsampwidth(),wav.getframerate())==(1,2,22050)
        samples=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2')
        assert len(samples)==wav.getnframes()
        assert np.max(np.abs(samples.astype(np.int32)))<32767
        assert abs(len(samples)/22050-record['durationSeconds'])<1e-8
        if record['processing']['loop']:
            assert len(samples)==20*22050
            assert record['loopSeamJumpToRmsDerivative']<3
        processed.append({'file':path.name,'hashVerified':True,'sampleFrames':len(samples),'clippedSamples':0})
with zipfile.ZipFile(RESEARCH/'kenney_impact-sounds.zip') as archive:
    assert archive.testzip() is None
originals=[]
for filename,expected_bytes in [('birds-isaiah658_0.ogg',544669),('park_ambience_river.wav',99072736)]:
    path=RESEARCH/filename
    assert path.stat().st_size==expected_bytes
    with av.open(str(path)) as container:
        count=0
        for frame in container.decode(audio=0):count+=frame.samples
        rate=container.streams.audio[0].codec_context.sample_rate
        duration=float(container.streams.audio[0].duration*container.streams.audio[0].time_base)
        assert abs(count/rate-duration)<.03
        originals.append({'file':filename,'bytes':expected_bytes,'sha256':sha(path),'completeDecode':True,'sampleFrames':count,'sampleRate':rate,'decodedDurationSeconds':count/rate})
for evidence in manifest['evidence']:assert sha(RESEARCH/evidence['file'])==evidence['sha256']
assert 'CC0 1.0 Universal' in (OUTPUT/'CC0-1.0.txt').read_text(encoding='utf8')
total=sum(path.stat().st_size for path in OUTPUT.iterdir() if path.is_file())
assert total<2_000_000
result={'passed':True,'audioBytes':manifest['totalAudioBytes'],'totalPackBytesIncludingProvenance':total,'budgetBytes':2_000_000,'kenneyZipCrcVerified':True,'sourcePageEvidenceHashesVerified':True,'originals':originals,'processed':processed,'humanListening':False,'browserOrGpuUsed':False}
(RESEARCH/'verification.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
print(json.dumps(result,indent=2))
