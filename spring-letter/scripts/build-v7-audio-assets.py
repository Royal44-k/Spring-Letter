"""Prepare seven CC0 VSCO samples. No generation service or copied score."""
from pathlib import Path
import sys, json, hashlib, wave
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'docs/blossom/tools/python-deps'))
import av
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'.tools/v7-audio/raw'
OUT=ROOT/'public/assets/audio'
OUT.mkdir(parents=True,exist_ok=True)
tree=json.loads((RAW.parent/'source-tree.json').read_text(encoding='utf-8-sig'))
sources=json.loads((RAW.parent/'download-manifest.json').read_text(encoding='utf-8-sig'))
limits={'harp-low':6.0,'harp-high':4.5,'piano':5.0,'flute':4.5,'cello':5.0,'pizz':2.5,'triangle':2.0}
records=[]
for name,limit in limits.items():
    file=RAW/(name+'.wav'); original=file.read_bytes()
    source=next(s for s in sources if s['file']==file.name)
    blob=next(t for t in tree['tree'] if t['path']==source['path'])
    actual_git=hashlib.sha1(b'blob '+str(len(original)).encode()+b'\0'+original).hexdigest()
    assert actual_git==blob['sha'],f'Git blob mismatch: {name}'
    resampler=av.AudioResampler(format='fltp',layout='mono',rate=22050)
    chunks=[]
    with av.open(file) as container:
        for frame in container.decode(audio=0):
            for out in resampler.resample(frame): chunks.append(out.to_ndarray().reshape(-1))
        for out in resampler.resample(None): chunks.append(out.to_ndarray().reshape(-1))
    data=np.concatenate(chunks); data-=data.mean()
    peak=np.max(np.abs(data)); assert peak>1e-5
    audible=np.flatnonzero(np.abs(data)>peak*.012)
    start=max(0,int(audible[0]) - 110)
    data=data[start:start+round(limit*22050)]
    data*=.76/max(np.max(np.abs(data)),1e-6)
    data[:110]*=np.linspace(0,1,110)
    fade=min(4410,len(data)//4); data[-fade:]*=np.linspace(1,0,fade)
    segment=data[int(.15*22050):int(1.6*22050)]
    fft=np.abs(np.fft.rfft(segment*np.hanning(len(segment)),n=131072))
    freqs=np.fft.rfftfreq(131072,1/22050); fft[(freqs<40)|(freqs>3000)]=0
    peaks=[]
    for _ in range(5):
        index=int(np.argmax(fft)); peaks.append(round(float(freqs[index]),2)); fft[max(0,index-15):index+16]=0
    output=OUT/(name+'.wav')
    with wave.open(str(output),'wb') as out:
        out.setnchannels(1); out.setsampwidth(2); out.setframerate(22050)
        out.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
    records.append({**source,'originalGitBlob':actual_git,'processedFile':output.relative_to(ROOT/'public').as_posix(),'processedBytes':output.stat().st_size,'processedSha256':hashlib.sha256(output.read_bytes()).hexdigest(),'seconds':len(data)/22050,'sampleRate':22050,'channels':1,'peak':float(np.max(np.abs(data))),'rms':float(np.sqrt(np.mean(data**2))),'spectrumPeaksHz':peaks})
for source,dest in [('LICENSE.txt','VSCO-CC0.txt'),('README.txt','VSCO-README.txt')]:
    (OUT/dest).write_bytes((RAW/source).read_bytes())
manifest={'license':'CC0-1.0','repository':'https://github.com/sgossner/VSCO-2-CE','authors':'Recorded by Sam Gossner & Simon Dalzell; sample cutting by Elan Hickler / Soundemote','processing':'Original Git blob verified, mono resample 22050Hz PCM16, leading silence trim, gentle attack and tail fade, peak normalization. Original composition is separate from these instrument recordings.','files':records}
(OUT/'sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))
