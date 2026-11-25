import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudio} from '../src/audio-engine.js';

// Web Audio is external to Node. Record calls at its graph/scheduler boundary;
// assertions concern the real engine's routes, values and source lifetimes.
class Param{
 constructor(value=0){this.value=value;this.events=[];}
 setValueAtTime(v,t){assert.ok(Number.isFinite(v)&&Number.isFinite(t));this.value=v;this.events.push([v,t]);}
 linearRampToValueAtTime(v,t){this.setValueAtTime(v,t);}exponentialRampToValueAtTime(v,t){this.setValueAtTime(v,t);}setTargetAtTime(v,t){this.setValueAtTime(v,t);}
 cancelScheduledValues(){}cancelAndHoldAtTime(){}
}
class Node{
 constructor(kind){this.kind=kind;for(const p of ['gain','frequency','Q','pan','playbackRate','threshold','knee','ratio','attack','release'])this[p]=new Param();this.connections=[];this.started=[];this.stops=[];}
 connect(n){this.connections.push(n);}disconnect(){this.connections=[];}start(...args){this.started.push(args);}stop(t){this.stops.push(t);}
}
class Context{
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=1000;this.destination=new Node('destination');this.nodes=[];Context.last=this;}
 node(kind){const n=new Node(kind);this.nodes.push(n);return n;}
 createGain(){return this.node('gain');}createBufferSource(){return this.node('source');}createBiquadFilter(){return this.node('filter');}createStereoPanner(){return this.node('pan');}createConvolver(){return this.node('convolver');}createDynamicsCompressor(){return this.node('compressor');}
 createBuffer(channels,length,rate){return{duration:length/rate,getChannelData:()=>new Float32Array(length)};}
 decodeAudioData(bytes){return Promise.resolve({duration:20,url:new TextDecoder().decode(bytes)});}
 resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}
}
async function setup(run){
 const oldWindow=globalThis.window,oldFetch=globalThis.fetch;
 globalThis.window={AudioContext:Context};globalThis.fetch=async url=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(url).buffer});
 const audio=createAudio();try{audio.unlock();await audio.ready();await run(audio,Context.last);}finally{audio.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;}
}
const voices=c=>c.nodes.filter(n=>n.kind==='source'&&n.started.length&&!n.loop);
const loop=(c,name)=>c.nodes.find(n=>n.loop&&n.buffer?.url?.endsWith('/'+name+'-loop.wav'));

test('entering, switching and leaving maps retires old music and effects before the new phrase',async()=>setup(async(a,c)=>{
 a.update(.02,{voyage:'sailing'});a.event('compose-note',{instrument:'flute',duration:4});
 for(const atlas of ['conservatory','observatory','meadow',null]){
  const previous=voices(c),before=a.getStats().scheduledNotes;c.currentTime+=.6;
  a.update(.02,{atlas});
  assert.ok(previous.every(n=>n.stops.at(-1)<=c.currentTime+.3),'no prior scene voice survives the transition');
  assert.ok(a.getStats().scheduledNotes>before,'new map starts without waiting for the old bar');
  assert.equal(a.getStats().scene.atlas,atlas);
  assert.equal(a.getStats().scene.voyage,atlas?null:'sailing');
  a.event('compose-note',{instrument:'harp',duration:4});
 }
}));

test('three maps reuse the same loops with distinct habitats and no stale ocean or water bleed',async()=>setup(async(a,c)=>{
 a.setMix({music:.61,sfx:.43,ambience:.57});
 const persistent=a.getStats().persistentNodes,river=loop(c,'river'),birds=loop(c,'birds');
 const dry=river.connections.find(n=>n.kind==='gain'),sea=river.connections.find(n=>n.kind==='filter').connections[0];
 const wind=c.nodes.find(n=>n.loop&&!n.buffer?.url).connections[0].connections[0];
 const snapshots={};
 a.update(.02,{voyage:'sailing',voyageSpeed:3,nearWater:1,night:1});
 for(const atlas of ['conservatory','observatory','meadow']){
  c.currentTime+=1;a.update(.02,{atlas});
  snapshots[atlas]={water:dry.gain.value,birds:birds.connections[0].gain.value,wind:wind.gain.value};
  assert.equal(sea.gain.value,0,'atlas must silence the old ocean send');
  assert.equal(a.getStats().persistentSources,3);assert.equal(a.getStats().persistentNodes,persistent);
 }
 assert.ok(snapshots.conservatory.water>snapshots.observatory.water*3);
 assert.ok(snapshots.conservatory.birds>snapshots.observatory.birds*3);
 assert.equal(snapshots.meadow.water,0,'clouds are not a river');
 assert.ok(snapshots.meadow.wind>snapshots.observatory.wind*2);
 assert.deepEqual(a.getStats().mix,{music:.61,sfx:.43,ambience:.57});
 a.setMix({ambience:0});assert.equal(dry.connections[0].gain.value,0);
}));

test('atlas follows pause, mute and channel volumes while actual ground movement still emits footsteps',async()=>setup(async(a,c)=>{
 a.update(.15,{atlas:'observatory',voyage:'sailing',moving:true,speed:3.15,groundMaterial:'stone'});
 assert.ok(voices(c).some(n=>n.buffer?.url?.includes('/stone-')),'retained ocean state cannot suppress walking in the ruins');
 a.pause(true);assert.equal(a.getStats().voices,0);const count=voices(c).length;
 c.currentTime=99;a.update(.1,{atlas:'meadow'});assert.equal(voices(c).length,count);
 a.pause(false);await Promise.resolve();a.setMuted(true);a.update(.1,{moving:false});assert.equal(voices(c).length,count);
 a.setMuted(false);a.setMix({music:0,sfx:0});a.update(.1,{atlas:'conservatory',moving:true});
 assert.equal(voices(c).length,count);assert.equal(a.getStats().missedSchedules,0);
 a.setMix({music:.5,sfx:.4});c.currentTime+=.2;a.update(.15,{atlas:'meadow',groundMaterial:'grass'});
 assert.ok(voices(c).slice(count).some(n=>n.buffer?.url?.includes('/grass-')));
}));

test('atlas progress does not restart its phrase, repeated switching stays bounded',async()=>setup(async(a,c)=>{
 a.update(.02,{atlas:'conservatory'});const old=voices(c),stops=old.map(n=>n.stops.length);
 c.currentTime=.1;a.update(.02,{atlasProgress:.8});
 assert.deepEqual(old.map(n=>n.stops.length),stops);
 for(let i=0;i<70;i++){c.currentTime+=.3;a.update(.02,{atlas:['conservatory','observatory','meadow'][i%3],atlasProgress:i%3/2});}
 assert.ok(a.getStats().voices<=48);assert.ok(a.getStats().queuedNotes<=12);assert.equal(a.getStats().persistentSources,3);
}));

test('map collect and completion stay gentle',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(const atlas of ['conservatory','observatory','meadow']){
  a.update(.02,{atlas});
  for(const event of ['collect','complete']){
   const count=voices(c).length;assert.equal(a.event(event,{combo:4}),true);
   const notes=voices(c).slice(count).filter(n=>n.buffer?.url?.includes('/audio/'));
   assert.ok(notes.length>0&&notes.length<=4);
   assert.ok(notes.every(n=>Math.max(...n.connections[0].gain.events.map(e=>e[0]))<=.18));
   assert.ok(notes.every(n=>!n.buffer.url.endsWith('/triangle.wav')));
  }
 }
}));

test('jump gives one short audible gesture instead of retriggering on held input',async()=>setup(async(a,c)=>{
 a.update(.02,{atlas:'meadow'});c.currentTime=10;const count=voices(c).length;
 assert.equal(a.event('jump'),true);assert.ok(voices(c).length>count);
 for(let i=0;i<90;i++)assert.equal(a.event('jump'),false);
 c.currentTime+=1;a.setMix({sfx:0});assert.equal(a.event('jump'),false);
}));
