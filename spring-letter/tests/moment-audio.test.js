import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudio} from '../src/audio-engine.js';

class Param {
 constructor(value=0){this.value=value;this.events=[];}
 setValueAtTime(value,time){this.value=value;this.events.push(['set',value,time]);}
 linearRampToValueAtTime(value,time){this.value=value;this.events.push(['linear',value,time]);}
 exponentialRampToValueAtTime(value,time){this.value=value;this.events.push(['exponential',value,time]);}
 setTargetAtTime(value,time,constant){this.value=value;this.events.push(['target',value,time,constant]);}
 cancelScheduledValues(){} cancelAndHoldAtTime(){}
}
class AudioNode {
 constructor(kind){this.kind=kind;for(const key of ['gain','frequency','Q','pan','playbackRate','threshold','knee','ratio','attack','release'])this[key]=new Param();this.connections=[];this.started=[];this.stops=[];}
 connect(node){this.connections.push(node);} disconnect(){this.connections=[];}
 start(...args){this.started.push(args);} stop(time){this.stops.push(time);}
}
class FakeAudio {
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=8000;this.destination=new AudioNode('destination');this.nodes=[];FakeAudio.last=this;}
 node(kind){const node=new AudioNode(kind);this.nodes.push(node);return node;}
 createGain(){return this.node('gain');} createBufferSource(){return this.node('source');}
 createBiquadFilter(){return this.node('filter');} createStereoPanner(){return this.node('pan');}
 createConvolver(){return this.node('convolver');} createDynamicsCompressor(){return this.node('compressor');}
 createBuffer(channels,length,rate){const data=Array.from({length:channels},()=>new Float32Array(length));return {duration:length/rate,getChannelData:index=>data[index]};}
 decodeAudioData(bytes){const url=new TextDecoder().decode(bytes);return FakeAudio.failDecode?.(url)?Promise.reject(Error('invalid audio data')):Promise.resolve({duration:20,url});}
 resume(){this.state='running';return Promise.resolve();} suspend(){this.state='suspended';return Promise.resolve();} close(){this.state='closed';return Promise.resolve();}
}
async function setup(run,{failFetch=()=>false,failDecode=()=>false,beforeReady}={}){
 const oldWindow=globalThis.window,oldFetch=globalThis.fetch;
 globalThis.window={AudioContext:FakeAudio};FakeAudio.failDecode=failDecode;
 globalThis.fetch=async url=>({ok:!failFetch(url),status:404,arrayBuffer:async()=>new TextEncoder().encode(url).buffer});
 const audio=createAudio();
 try{audio.unlock();await beforeReady?.(audio,FakeAudio.last);await audio.ready();await run(audio,FakeAudio.last);}
 finally{audio.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;FakeAudio.failDecode=null;}
}
const sources=(context,start=0)=>context.nodes.slice(start).filter(node=>node.kind==='source'&&node.started.length&&!node.loop);
const channel=source=>source.connections[0].connections[0].connections[0];

test('composition uses the requested recorded instrument, pitch, gain and spatial position',async()=>setup(async(audio,context)=>{
 for(const [instrument,midi,root,pan]of [['piano',67,60,-.7],['harp',76,72,0],['flute',81,72,.7]]){
  const before=context.nodes.length;
  assert.equal(audio.event('compose-note',{instrument,midi,gain:.17,pan,duration:.58}),true);
  const [source]=sources(context,before);assert.ok(source.buffer.url.endsWith(instrument==='harp'?'/harp-high.wav':'/'+instrument+'.wav'));
  assert.equal(source.playbackRate.value,2**((midi-root)/12));
  const envelope=source.connections[0];assert.equal(Math.max(...envelope.gain.events.map(event=>event[1])),.17);
  assert.equal(envelope.connections[0].pan.value,pan);assert.equal(channel(source).gain.value,.88);
  assert.ok(source.stops[0]-source.started[0][0]<=.60);assert.equal(source.loop,undefined);
 }
 assert.equal(audio.getStats().fallbackNotes,0);assert.equal(audio.getStats().scheduledNotes,3);assert.equal(audio.getStats().hasOutput,true);
}));

test('composition fades only music to zero, preserves preferences and ambience, and resumes without a queue',async()=>setup(async(audio,context)=>{
 audio.setMix({music:.73,sfx:.64,ambience:.61});audio.update(.05,{zone:'pool',nearWater:.8});
 const music=channel(sources(context).find(source=>source.buffer.url?.includes('/audio/')));
 const river=context.nodes.find(node=>node.buffer?.url?.endsWith('/river-loop.wav'));
 const riverLevel=river.connections[0],ambient=riverLevel.connections[0],level=riverLevel.gain.value;
 context.currentTime=.2;audio.update(.05,{composing:true});
 assert.equal(music.gain.value,0);assert.deepEqual(music.gain.events.at(-1),['linear',0,.52]);
 assert.equal(ambient.gain.value,.61);assert.equal(riverLevel.gain.value,level);assert.equal(river.stops.length,0);
 const before=sources(context).length;
 context.currentTime=120;audio.update(.05,{composing:true});assert.equal(sources(context).length,before);assert.equal(audio.getStats().queuedNotes,0);
 assert.equal(audio.event('compose-note',{instrument:'piano',midi:60,gain:.12}),true);assert.equal(sources(context).length,before+1);
 context.currentTime=122;audio.update(.05,{composing:false});
 assert.ok(music.gain.value>0);assert.ok(sources(context).length>before+1);assert.equal(audio.getStats().missedSchedules,0);
 assert.deepEqual(audio.getStats().mix,{music:.73,sfx:.64,ambience:.61});
}));

test('invalid composition values are bounded, and an explicitly silent note is not reported as played',async()=>setup(async(audio,context)=>{
 const before=context.nodes.length;
 assert.equal(audio.event('compose-note',{instrument:'unknown',midi:1000,duration:99,gain:8,pan:-8}),true);
 const source=sources(context,before)[0];assert.ok(source.buffer.url.endsWith('/piano.wav'));assert.equal(source.playbackRate.value,8);
 assert.equal(source.connections[0].connections[0].pan.value,-1);assert.equal(Math.max(...source.connections[0].gain.events.map(event=>event[1])),.3);
 assert.ok(source.stops[0]<=4.02);
 const index=context.nodes.length;assert.equal(audio.event('compose-note',{midi:NaN,pan:NaN,duration:NaN,gain:NaN}),true);
 const defaults=sources(context,index)[0];assert.equal(defaults.playbackRate.value,2**(9/12));assert.equal(defaults.connections[0].connections[0].pan.value,0);
 const count=audio.getStats().scheduledNotes;assert.equal(audio.event('compose-note',{gain:0}),false);assert.equal(audio.getStats().scheduledNotes,count);
}));

test('pause, mute and the effects slider suppress recorded and fallback notes without delayed playback',async()=>setup(async(audio,context)=>{
 audio.update(.02,{composing:true});assert.equal(audio.event('compose-note',{instrument:'flute'}),true);
 audio.pause(true);assert.equal(audio.getStats().voices,0);
 const count=sources(context).length;assert.equal(audio.event('compose-note',{instrument:'flute'}),false);assert.equal(audio.event('moment-reply'),false);
 context.currentTime=99;audio.update(.05,{composing:true});assert.equal(sources(context).length,count);
 audio.pause(false);await Promise.resolve();audio.update(.05,{composing:true});assert.equal(sources(context).length,count);
 audio.setMuted(true);assert.equal(audio.event('compose-note'),false);audio.setMuted(false);
 audio.setMix({sfx:0});assert.equal(audio.event('compose-note'),false);assert.equal(audio.event('moment-reply'),false);assert.equal(sources(context).length,count);
 audio.setMix({sfx:.5});assert.equal(audio.event('compose-note',{instrument:'flute'}),true);assert.equal(sources(context).length,count+1);
},{failFetch:url=>url.endsWith('/flute.wav')}));

test('mute ramps the actual master parameter to exact zero in 60 ms and unmute never replays discarded notes',async()=>setup(async(audio,context)=>{
 audio.update(.02,{zone:'pool'});assert.ok(audio.getStats().queuedNotes>0);
 assert.equal(audio.event('compose-note',{instrument:'harp',midi:76,gain:.16}),true);
 const master=channel(sources(context).at(-1)).connections[0];assert.ok(master.gain.value>0);
 context.currentTime=2.25;const beforeEvents=master.gain.events.length;
 audio.setMuted(true);
 assert.deepEqual(master.gain.events.slice(beforeEvents),[['linear',0,2.31]],'mute uses an exact linear endpoint, not an asymptotic setTargetAtTime tail');
 assert.equal(master.gain.value,0);assert.equal(audio.getStats().voices,0);assert.equal(audio.getStats().queuedNotes,0);
 const count=sources(context).length,scheduled=audio.getStats().scheduledNotes;
 for(let i=0;i<30;i++){context.currentTime+=1;audio.update(.05,{composing:true});assert.equal(audio.event('compose-note',{instrument:'piano'}),false);}
 assert.equal(master.gain.value,0);assert.equal(sources(context).length,count);assert.equal(audio.getStats().scheduledNotes,scheduled);
 const restoredAt=context.currentTime;audio.setMuted(false);
 assert.deepEqual(master.gain.events.at(-1),['target',.8,restoredAt,.06],'unmute retains the normal gentle recovery');
 audio.update(.05,{composing:true});assert.equal(sources(context).length,count,'discarded foreground and BGM queues stay discarded');
 assert.equal(audio.event('compose-note',{instrument:'flute',midi:74,gain:.12}),true);
 assert.equal(sources(context).length,count+1);assert.ok(sources(context).at(-1).started[0][0]>=restoredAt);
 assert.equal(audio.getStats().queuedNotes,0);
}));

test('missing samples produce distinct finite fallback waveforms, reuse three buffers and release every voice',async()=>setup(async(audio,context)=>{
 const instruments=['piano','harp','flute'],buffers=[];
 for(const instrument of instruments){
  const before=context.nodes.length;assert.equal(audio.event('compose-note',{instrument,midi:72,gain:.15,duration:2}),true);
  const source=sources(context,before)[0],data=source.buffer.getChannelData(0);buffers.push(source.buffer);
  assert.equal(source.buffer.url,undefined);assert.ok(data.every(Number.isFinite));assert.ok(data.some(value=>Math.abs(value)>.05));assert.equal(data[0],0);
  assert.ok(source.stops[0]-source.started[0][0]<=1.22);assert.ok(!source.loop);
  source.onended();assert.equal(source.connections.length,0);
 }
 assert.equal(audio.getStats().voices,0);assert.equal(audio.getStats().fallbackNotes,3);assert.deepEqual(audio.getStats().fallbackInstruments,instruments);
 assert.notDeepEqual(buffers[0].getChannelData(0),buffers[1].getChannelData(0));assert.notDeepEqual(buffers[1].getChannelData(0),buffers[2].getChannelData(0));
 for(let i=0;i<80;i++){
  const before=context.nodes.length;assert.equal(audio.event('compose-note',{instrument:instruments[i%3],midi:60+i%12}),true);
  assert.equal(sources(context,before)[0].buffer,buffers[i%3]);
 }
 assert.ok(audio.getStats().voices<=audio.getStats().voiceLimit);assert.equal(audio.getStats().fallbackInstruments.length,3);
 audio.dispose();assert.equal(audio.getStats().voices,0);assert.equal(audio.getStats().persistentNodes,0);assert.deepEqual(audio.getStats().fallbackInstruments,[]);
 assert.ok(sources(context).every(source=>source.stops.length));assert.equal(audio.event('compose-note'),false);
},{failFetch:url=>url.includes('/audio/')}));

test('decode errors use fallback while successful instruments remain sampled',async()=>setup(async(audio,context)=>{
 assert.ok(audio.getStats().loadErrors.some(error=>error.startsWith('flute:')));
 const before=context.nodes.length;assert.equal(audio.event('compose-note',{instrument:'flute'}),true);assert.equal(audio.event('compose-note',{instrument:'harp'}),true);
 const notes=sources(context,before);assert.equal(notes[0].buffer.url,undefined);assert.ok(notes[1].buffer.url.endsWith('/harp-high.wav'));
 assert.equal(audio.getStats().fallbackNotes,1);
},{failDecode:url=>url.endsWith('/flute.wav')}));

test('a first gesture during asset loading sounds immediately and later gestures switch to the real sample',async()=>setup(async(audio,context)=>{
 const before=context.nodes.length;assert.equal(audio.event('compose-note',{instrument:'piano'}),true);
 assert.ok(sources(context,before)[0].buffer.url.endsWith('/piano.wav'));assert.equal(audio.getStats().fallbackNotes,1);
},{beforeReady:(audio,context)=>{
 const before=context.nodes.length;assert.equal(audio.event('compose-note',{instrument:'piano'}),true);
 assert.equal(sources(context,before)[0].buffer.url,undefined);assert.equal(audio.getStats().hasOutput,true);
}}));

test('moment reply is one short breath and one quiet harp note, including when its asset is unavailable',async()=>{
 for(const unavailable of [false,true])await setup(async(audio,context)=>{
  const before=context.nodes.length;assert.equal(audio.event('moment-reply',{id:'tide'}),true);
  const notes=sources(context,before);assert.equal(notes.length,2,'no four-note reply melody should replace the player composition');
  assert.ok(notes.every(source=>!source.loop&&source.stops[0]<context.currentTime+.52));
  const harp=notes[1];assert.equal(harp.playbackRate.value,1);assert.ok(harp.started[0][0]<context.currentTime+.08);
  assert.equal(Math.max(...harp.connections[0].gain.events.map(event=>event[1])),.06);
  assert.equal(audio.getStats().fallbackNotes,unavailable?1:0);assert.equal(audio.getStats().persistentSources,3);
 },{failFetch:url=>unavailable&&url.endsWith('/harp-high.wav')});
});
