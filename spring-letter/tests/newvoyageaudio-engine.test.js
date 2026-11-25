import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudio} from '../src/audio-engine.js';

class Param{
 constructor(value=0){this.value=value;this.events=[];}
 setValueAtTime(value,time){assert.ok(Number.isFinite(value)&&Number.isFinite(time));this.value=value;this.events.push([value,time]);}
 linearRampToValueAtTime(v,t){this.setValueAtTime(v,t);} exponentialRampToValueAtTime(v,t){this.setValueAtTime(v,t);} setTargetAtTime(v,t){this.setValueAtTime(v,t);}
 cancelScheduledValues(){} cancelAndHoldAtTime(){}
}
class Node{
 constructor(kind){this.kind=kind;for(const key of ['gain','frequency','Q','pan','playbackRate','threshold','knee','ratio','attack','release'])this[key]=new Param();this.connections=[];this.started=[];this.stops=[];}
 connect(node){this.connections.push(node);}disconnect(){this.connections=[];}
 start(...args){this.started.push(args);}stop(time){this.stops.push(time);}
}
class Context{
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=1000;this.destination=new Node('destination');this.nodes=[];Context.last=this;}
 node(kind){const node=new Node(kind);this.nodes.push(node);return node;}
 createGain(){return this.node('gain');}createBufferSource(){return this.node('source');}createBiquadFilter(){return this.node('filter');}createStereoPanner(){return this.node('pan');}createConvolver(){return this.node('convolver');}createDynamicsCompressor(){return this.node('compressor');}
 createBuffer(channels,length,rate){return{duration:length/rate,getChannelData:()=>new Float32Array(length)};}
 decodeAudioData(bytes){return Promise.resolve({duration:20,url:new TextDecoder().decode(bytes)});}
 resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}
}
async function setup(run){
 const oldWindow=globalThis.window,oldFetch=globalThis.fetch;globalThis.window={AudioContext:Context};globalThis.fetch=async url=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(url).buffer});
 const audio=createAudio();try{audio.unlock();await audio.ready();await run(audio,Context.last);}finally{audio.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;}
}
const sources=(c,start=0)=>c.nodes.slice(start).filter(n=>n.kind==='source'&&n.started.length&&!n.loop);
const events=['voyage-seal','paper-open','rope-release','sail-hoist','wave-step','sea-bloom','departure'];

test('all voyage events are audible, throttled on the audio clock, bounded, and suppressed by pause/mute/effects zero',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(const type of events){
  c.currentTime+=3;const start=c.nodes.length;
  assert.equal(a.event(type,{pan:NaN,progress:Infinity}),true,type);
  assert.ok(sources(c,start).length>0,type+' must produce sound');
  for(let i=0;i<90;i++)assert.equal(a.event(type),false,type+' must throttle duplicate frames');
 }
 assert.ok(a.getStats().voices<=48);
 const count=sources(c).length;
 a.pause(true);assert.equal(a.getStats().voices,0);for(const type of events)assert.equal(a.event(type),false);
 a.pause(false);await Promise.resolve();a.setMuted(true);for(const type of events)assert.equal(a.event(type),false);
 a.setMuted(false);a.setMix({sfx:0});c.currentTime+=3;for(const type of events)assert.equal(a.event(type),false);
 assert.equal(sources(c).length,count);a.dispose();assert.equal(a.getStats().persistentNodes,0);assert.equal(a.getStats().persistentSources,0);
}));

test('maritime ambience filters the existing river loop without multiplying loops or changing user volumes',async()=>setup(async(a,c)=>{
 const river=c.nodes.find(n=>n.buffer?.url?.endsWith('/river-loop.wav'));
 const filter=river.connections.find(n=>n.kind==='filter');assert.ok(filter,'existing recording needs a filtered maritime send');
 assert.equal(filter.type,'lowpass');const sea=filter.connections[0];assert.equal(sea.gain.value,0);
 const persistent=a.getStats().persistentNodes;
 a.setMix({music:.7,sfx:.4,ambience:.6});
 for(let i=0;i<40;i++){c.currentTime+=.2;a.update(.1,{voyage:'sailing',voyageSpeed:3,voyageProgress:.5,moving:true,groundMaterial:'water'});}
 assert.ok(sea.gain.value>0);assert.ok(filter.frequency.value<900);
 assert.equal(a.getStats().persistentSources,3);assert.equal(a.getStats().persistentNodes,persistent);
 assert.deepEqual(a.getStats().mix,{music:.7,sfx:.4,ambience:.6});
 assert.equal(sources(c).filter(n=>n.buffer?.url?.includes('/stone-')).length,0,'boat motion is not walking');
 assert.equal(a.getStats().scene.voyage,'sailing');
 a.update(.1,{voyage:null,moving:false});assert.equal(sea.gain.value,0);
}));

test('a stage change within the same shore zone retires old notes and schedules the new stage immediately',async()=>setup(async(a,c)=>{
 a.update(.02,{voyage:'writing'});const old=sources(c).filter(n=>n.buffer?.url?.includes('/audio/'));assert.ok(old.length);
 const before=a.getStats().scheduledNotes;c.currentTime=.5;a.update(.02,{voyage:'tide'});
 assert.ok(a.getStats().scheduledNotes>before);assert.equal(a.getStats().musicTitle,'潮水替人留白');
 assert.ok(old.every(n=>n.stops.at(-1)<=.81),'writing notes cannot continue through the tide scene');
 a.pause(true);assert.equal(a.getStats().queuedNotes,0);c.currentTime=99;a.pause(false);await Promise.resolve();a.update(.02,{voyage:'dawn',voyageSpeed:NaN,voyageProgress:Infinity});
 assert.equal(a.getStats().missedSchedules,0);assert.equal(a.getStats().scene.voyage,'dawn');assert.ok(a.getStats().queuedNotes<=24);
}));

test('explicit wet steps use contact foley and breath while rate limiting frame storms',async()=>setup(async(a,c)=>{
 const start=c.nodes.length;a.event('wave-step');const wet=sources(c,start);
 assert.ok(wet.some(n=>n.buffer?.url?.includes('/stone-')));assert.ok(wet.some(n=>!n.buffer?.url));
 c.currentTime=.1;assert.equal(a.event('wave-step'),false);c.currentTime=.5;assert.equal(a.event('wave-step'),true);
}));
