"""Offline audition from the exact authored score and local instrument samples.
This is an arrangement preview, not a recording of the browser audio engine.
"""
from pathlib import Path
import json, wave, hashlib
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence/v7-audio'; OUT.mkdir(parents=True,exist_ok=True)
score=json.loads((ROOT/'.tools/v7-audio/score.json').read_text(encoding='utf-8'))
RATE=22050
bank={}
for key,item in score['bank'].items():
    with wave.open(str(ROOT/'public/assets/audio'/item['file']),'rb') as w:
        assert w.getframerate()==RATE and w.getnchannels()==1
        bank[key]=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
def render(section):
    times=[]; t=0
    for bar in section['bars']:
        beat=60/bar['bpm']
        for note in bar['notes']: times.append((t+note['beat']*beat,note,note['duration']*beat))
        t+=3*beat
    output=np.zeros((int((t+4)*RATE),2),dtype=np.float64)
    for at,note,seconds in times:
        instrument=note['instrument']; source=bank[instrument]
        pitch=2**((note['midi']-score['bank'][instrument]['root'])/12)
        length=min(seconds,len(source)/RATE/pitch-.01)
        n=max(1,int(length*RATE)); audio=np.interp(np.arange(n)*pitch,np.arange(len(source)),source)
        sustained=instrument in ('flute','cello'); attack=min(.08 if sustained else .005,length*.2)
        release=min(.3 if sustained else .22,length*.35)
        env=np.ones(n); na=max(1,int(attack*RATE)); nr=max(1,int(release*RATE))
        env[:na]=np.linspace(0,1,na);env[-nr:]=np.linspace(1,0,nr)
        signal=audio*env*note['gain']*2.2*.82*.8
        pan=note['pan']; start=round(at*RATE)
        output[start:start+n,0]+=signal*np.sqrt((1-pan)/2)
        output[start:start+n,1]+=signal*np.sqrt((1+pan)/2)
    # A small room impression for audition; browser uses its own convolution.
    dry=output.copy()
    for delay,gain in [(.071,.12),(.113,.10),(.179,.07),(.257,.05),(.373,.025)]:
        shift=int(delay*RATE);output[shift:]+=dry[:-shift,::-1]*gain
    output[:2205]*=np.linspace(0,1,2205)[:,None];output[-RATE:]*=np.linspace(1,0,RATE)[:,None]
    return output,t
records=[];showcase=[]
def write(name,data):
    peak=float(np.max(np.abs(data)));assert peak<.99,(name,peak)
    file=OUT/name
    with wave.open(str(file),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((data*32767).astype('<i2').tobytes())
    records.append({'file':str(file.relative_to(ROOT)).replace('\\','/'),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'seconds':len(data)/RATE,'peak':peak,'rms':float(np.sqrt(np.mean(data**2))),'clippedSamples':int((np.abs(data)>=1).sum())})
for section in score['sections']:
    data,duration=render(section);write('music-'+section['name']+'.wav',data)
    start=int(duration*.25*RATE);clip=data[start:start+int(12*RATE)].copy()
    fade=int(.8*RATE);clip[:fade]*=np.linspace(0,1,fade)[:,None];clip[-fade:]*=np.linspace(1,0,fade)[:,None]
    showcase.append(clip)
write('spring-letter-music-showcase.wav',np.concatenate(showcase))
(OUT/'preview-analysis.json').write_text(json.dumps({'scope':'Offline audition of the actual 16-bar score and processed CC0 instruments; simple preview room echoes, not browser capture. No listening claim is inferred from waveform statistics.','sections':['garden 0–12s','wind challenge 12–24s','pool 24–36s','finale 36–48s'],'files':records},indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))
