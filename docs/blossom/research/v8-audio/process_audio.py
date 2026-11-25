"""Reproduce the nine CC0 derivatives; run after all originals finish downloading.
No generative audio, denoiser, or musical material is added to the field recordings.
"""
from pathlib import Path
import sys, hashlib, json, wave, math, shutil
sys.path.insert(0, str(Path(__file__).parents[2] / 'tools' / 'python-deps'))
import av
import numpy as np

RESEARCH = Path(__file__).parent
OUTPUT = RESEARCH.parents[3] / 'spring-letter' / 'public' / 'assets' / 'foley-v8'
RATE = 22050
CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def decode(path, max_seconds=None):
    result=[]
    with av.open(str(path)) as container:
        stream=container.streams.audio[0]
        info={'sampleRate':stream.codec_context.sample_rate,'channels':stream.codec_context.channels,'codec':stream.codec_context.name,'bytes':path.stat().st_size,'durationSeconds':float(stream.duration*stream.time_base) if stream.duration else None}
        resampler=av.AudioResampler(format='fltp',layout='mono',rate=RATE)
        count=0
        for frame in container.decode(audio=0):
            for converted in resampler.resample(frame):
                samples=converted.to_ndarray()[0].copy()
                result.append(samples);count+=len(samples)
            if max_seconds and count>=max_seconds*RATE:break
        else:
            for converted in resampler.resample(None):result.append(converted.to_ndarray()[0].copy())
    return np.concatenate(result).astype(np.float64), info

def pcm_write(name, samples):
    data=np.clip(np.rint(samples*32767),-32768,32767).astype('<i2')
    path=OUTPUT/name
    with wave.open(str(path),'wb') as output:
        output.setnchannels(1);output.setsampwidth(2);output.setframerate(RATE);output.writeframes(data.tobytes())
    decoded=data.astype(np.float64)/32768
    derivative_rms=float(np.sqrt(np.mean(np.diff(decoded)**2)))
    return {'file':name,'processedSha256':sha(path),'bytes':path.stat().st_size,'format':'PCM16 WAV','sampleRate':RATE,'channels':1,'durationSeconds':len(data)/RATE,'peakDbFS':20*math.log10(max(abs(decoded))+1e-12),'rmsDbFS':20*math.log10(np.sqrt(np.mean(decoded**2))+1e-12),'dcOffset':float(decoded.mean()),'loopSeamJump':float(abs(decoded[0]-decoded[-1])),'loopSeamJumpToRmsDerivative':float(abs(decoded[0]-decoded[-1]))/(derivative_rms+1e-12)}

def normalize(samples,target_rms,peak_limit):
    samples=samples-samples.mean()
    gain=min(target_rms/(np.sqrt(np.mean(samples**2))+1e-12),peak_limit/(max(abs(samples))+1e-12))
    return samples*gain,gain

def one_shot(source, name):
    samples,info=decode(source)
    nonquiet=np.flatnonzero(abs(samples)>max(abs(samples))*10**(-45/20))
    first=max(0,int(nonquiet[0]) - round(.008*RATE));last=min(len(samples),int(nonquiet[-1])+round(.025*RATE))
    if name=='stone-turn.wav':last=min(last,first+round(.24*RATE))
    samples=samples[first:last]
    attack=round(.001*RATE);release=round(.016*RATE)
    samples[:attack]*=np.linspace(0,1,attack);samples[-release:]*=np.linspace(1,0,release)
    samples,gain=normalize(samples,.16,.72)
    record=pcm_write(name,samples)
    return record|{'sourceFile':str(source.relative_to(RESEARCH)),'sourceSha256':sha(source),'sourceFormat':info,'author':'Kenney','sourcePage':'https://kenney.nl/assets/impact-sounds','downloadUrl':'https://kenney.nl/download-link/6173736574732f696d706163742d736f756e6473','license':'CC0-1.0','licenseUrl':CC0,'processing':{'resample':'FFmpeg libswresample via PyAV 19.0.2, mono 22050 Hz','trimStartSeconds':first/RATE,'trimEndSeconds':last/RATE,'relativeSilenceThresholdDb':-45,'gainLinear':gain,'edgeFadeSeconds':[.001,.016],'loop':False}}

def loop(source,name,start,author,page,direct):
    # 22-second input, 2-second equal-power tail/head overlap -> 20-second loop.
    samples,info=decode(source,start+22.05)
    samples=samples[round(start*RATE):round((start+22)*RATE)]
    assert len(samples)==22*RATE, 'Source does not contain complete requested region'
    n=2*RATE;t=np.linspace(0,np.pi/2,n,endpoint=True)
    overlap=samples[-n:]*np.cos(t)+samples[:n]*np.sin(t)
    samples=np.concatenate([samples[n:-n],overlap])
    samples,gain=normalize(samples,.13,.63)
    record=pcm_write(name,samples)
    return record|{'sourceFile':source.name,'sourceSha256':sha(source),'sourceFormat':info,'author':author,'sourcePage':page,'downloadUrl':direct,'license':'CC0-1.0','licenseUrl':CC0,'processing':{'resample':'FFmpeg libswresample via PyAV 19.0.2, mono 22050 Hz','sourceRegionSeconds':[start,start+22],'crossfadeSeconds':2,'crossfadeCurve':'equal power: tail*cos(t) + head*sin(t), t from 0 to pi/2; overlap placed at end, first sample continues head after crossfade','gainLinear':gain,'loop':True}}

def main():
    assert (RESEARCH/'park_ambience_river.wav').stat().st_size==99072736, 'Wait for the complete original river download before final provenance hashing'
    OUTPUT.mkdir(parents=True,exist_ok=True)
    records=[]
    for surface,source_surface in [('grass','grass'),('stone','concrete')]:
        for index in range(3):
            record=one_shot(RESEARCH/'kenney'/'Audio'/f'footstep_{source_surface}_{index:03}.ogg',f'{surface}-{index}.wav')
            record['usage']='Grass footstep' if surface=='grass' else 'Concrete footstep used for hard stone path; original is not labeled natural stone.'
            records.append(record)
    record=one_shot(RESEARCH/'kenney'/'Audio'/'impactMining_000.ogg','stone-turn.wav')
    record['usage']='Mining impact used as short stone-tile contact; not a field recording of a rotating stone.'
    records.append(record)
    records.append(loop(RESEARCH/'birds-isaiah658_0.ogg','birds-loop.wav',3,'isaiah658','https://opengameart.org/content/ambient-bird-sounds','https://opengameart.org/sites/default/files/birds-isaiah658_0.ogg'))
    records.append(loop(RESEARCH/'park_ambience_river.wav','river-loop.wav',12,'Thimras (Eike Germann)','https://opengameart.org/content/park-ambiences','https://opengameart.org/sites/default/files/park_ambience_river.wav'))
    manifest={'schemaVersion':1,'retrievedDate':'2026-11-21','license':'CC0-1.0','processingTool':{'python':sys.version.split()[0],'pyav':av.__version__,'numpy':np.__version__},'originalArchive':{'file':'kenney_impact-sounds.zip','bytes':(RESEARCH/'kenney_impact-sounds.zip').stat().st_size,'sha256':sha(RESEARCH/'kenney_impact-sounds.zip'),'downloadLinkEvidence':'kenney-download-response.json'},'evidence':[{ 'file':name,'sha256':sha(RESEARCH/name)} for name in ['kenney-impact-sounds.html','ambient-bird-sounds.html','park-ambiences.html','thimras.html','kenney-download-response.json']],'totalAudioBytes':sum(r['bytes'] for r in records),'listeningVerification':'No human listening claimed. Decoding, sample level, clipping and boundary measurements only. Author descriptions identify the two ambient inputs as field recordings.','assets':records}
    (OUTPUT/'sources.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    shutil.copyfile(RESEARCH/'kenney'/'License.txt',OUTPUT/'Kenney-License.txt')
    print(json.dumps({'totalAudioBytes':manifest['totalAudioBytes'],'assets':[{k:r[k] for k in ['file','durationSeconds','peakDbFS','rmsDbFS','loopSeamJump']} for r in records]},indent=2))

if __name__=='__main__':main()
