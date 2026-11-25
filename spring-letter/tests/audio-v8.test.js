import test from 'node:test';
import assert from 'node:assert/strict';
import {createAudio} from '../src/audio-engine.js';
import * as score from '../src/audio-score.js';

class Param {
 constructor(v=0){this.value=v;}
 setValueAtTime(v){this.value=v;} linearRampToValueAtTime(v){this.value=v;}
 exponentialRampToValueAtTime(v){this.value=v;} setTargetAtTime(v){this.value=v;}
 cancelScheduledValues(){} cancelAndHoldAtTime(){}
}
class Node {
 constructor(){for(const p of ['gain','frequency','Q','pan','playbackRate','threshold','knee','ratio','attack','release'])this[p]=new Param();this.connections=[];this.started=[];}
 connect(n){this.connections.push(n);} disconnect(){this.connections=[];}
 start(...args){this.started.push(args);} stop(){this.stopped=true;}
}
class Context {
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=1000;this.destination=new Node();this.nodes=[];Context.last=this;}
 node(){const n=new Node();this.nodes.push(n);return n;}
 createGain(){return this.node();}createBufferSource(){return this.node();}createBiquadFilter(){return this.node();}createStereoPanner(){return this.node();}createConvolver(){return this.node();}createOscillator(){return this.node();}createDynamicsCompressor(){return this.node();}
 createBuffer(channels,length,rate){return{duration:length/rate,getChannelData:()=>new Float32Array(length)};}
 decodeAudioData(bytes){return Promise.resolve({duration:20,url:new TextDecoder().decode(bytes)});}
 resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}
}
async function setup(fn){
 const oldWindow=globalThis.window,oldFetch=globalThis.fetch;
 globalThis.window={AudioContext:Context};globalThis.fetch=async url=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(url).buffer});
 const audio=createAudio();try{audio.unlock();await audio.ready();await fn(audio,Context.last);}finally{audio.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;}
}
const sources=c=>c.nodes.filter(n=>n.buffer?.url&&n.started.length);
const foley=c=>sources(c).filter(n=>n.buffer.url.includes('/foley-v8/'));

test('recorded birds and river have one loop each across repeated unlock, pause and mute',async()=>setup(async(a,c)=>{
 const loops=()=>foley(c).filter(n=>n.loop);
 assert.equal(loops().length,2);
 assert.ok(loops().some(n=>n.buffer.url.endsWith('/birds-loop.wav')));
 assert.ok(loops().some(n=>n.buffer.url.endsWith('/river-loop.wav')));
 for(let i=0;i<8;i++){
  a.unlock();a.pause(true);assert.equal(c.state,'suspended');a.pause(false);await Promise.resolve();
  a.setMuted(true);assert.equal(a.event('letter-turn'),false);a.setMuted(false);a.update(.05,{});
 }
 assert.equal(loops().length,2);assert.equal(a.getStats().persistentSources,3);
 a.dispose();assert.ok(loops().every(n=>n.stopped));assert.equal(a.getStats().persistentSources,0);
}));

test('walking selects varied recordings for its actual surface and stops when stationary',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(const material of ['grass','stone']){
  const start=foley(c).length;
  for(let i=0;i<100;i++){c.currentTime+=.1;a.update(.1,{moving:true,speed:3.15,groundMaterial:material});}
  const steps=foley(c).slice(start).filter(n=>!n.loop).map(n=>n.buffer.url.split('/').pop());
  assert.ok(steps.length>=15);assert.ok(steps.every(file=>file.startsWith(material+'-')));assert.ok(new Set(steps).size>=3);
  assert.ok(steps.every((file,i)=>!i||file!==steps[i-1]));
 }
 const count=foley(c).length;for(let i=0;i<20;i++)a.update(.1,{moving:false});assert.equal(foley(c).length,count);
}));

test('stone tile rotation plays recorded contact and respects the effects slider',async()=>setup(async(a,c)=>{
 a.event('letter-turn',{tile:2});const contact=foley(c).find(n=>n.buffer.url.endsWith('/stone-turn.wav'));
 assert.ok(contact);assert.ok(!contact.loop);
 a.setMix({sfx:0});const before=foley(c).length;a.event('letter-turn',{tile:3});assert.equal(foley(c).length,before);
}));

test('river proximity changes its level independently from music, while ambience fader gates both loops',async()=>setup(async(a,c)=>{
 a.setMix({music:0,ambience:.6});a.update(.05,{nearWater:0,zone:'garden'});
 const river=foley(c).find(n=>n.buffer.url.endsWith('/river-loop.wav'));
 const level=river.connections[0];const far=level.gain.value;
 a.update(.05,{nearWater:1});assert.ok(level.gain.value>far*2);
 const ambience=level.connections[0];assert.equal(ambience.gain.value,.6);
 a.setMix({ambience:0});assert.equal(ambience.gain.value,0);
 a.setMuted(true);const count=foley(c).length;for(let i=0;i<30;i++)a.update(.1,{moving:true});assert.equal(foley(c).length,count);
}));

test('a 130 ms press produces an early step, then stationary frames remain silent',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(let i=0;i<13;i++){c.currentTime+=.01;a.update(.01,{moving:true,speed:3.15,groundMaterial:'stone'});}
 const steps=foley(c).filter(n=>!n.loop);
 assert.equal(steps.length,1,'short movement should have a first footfall');
 assert.ok(steps[0].started[0][0]>=.10&&steps[0].started[0][0]<=.15,'first footfall arrives around 100–150 ms');
 for(let i=0;i<100;i++){c.currentTime+=.01;a.update(.01,{moving:false});}
 assert.equal(foley(c).filter(n=>!n.loop).length,1,'standing still must not emit delayed footsteps');
}));

test('repeated quick taps cannot exceed the audio-clock footstep rate limit',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(let tap=0;tap<20;tap++){
  for(let i=0;i<13;i++){c.currentTime+=.01;a.update(.01,{moving:true,speed:3.15,groundMaterial:'grass'});}
  c.currentTime+=.01;a.update(.01,{moving:false});
 }
 const steps=foley(c).filter(n=>!n.loop),times=steps.map(n=>n.started[0][0]);
 assert.ok(steps.length>=8,'repeated deliberate taps remain responsive');
 assert.ok(times.every((t,i)=>i===0||t-times[i-1]>=.16-1e-9),'no pair of footsteps is closer than 160 ms');
 const before=steps.length;
 // Rendering can advance while the audio clock does not. It must not queue
 // repeated footfalls at the same audio time, even after multiple stop/start edges.
 for(let i=0;i<20;i++){a.update(.01,{moving:false});a.update(.15,{moving:true});}
 assert.ok(foley(c).filter(n=>!n.loop).length<=before+1,'a frozen audio clock may admit one already eligible step, never repeated ones');
}));

test('continuous walking keeps normal half-second strides after the early first step',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(let i=0;i<220;i++){c.currentTime+=.01;a.update(.01,{moving:true,speed:3.15,groundMaterial:'stone'});}
 const times=foley(c).filter(n=>!n.loop).map(n=>n.started[0][0]);
 assert.ok(times[0]<=.15);assert.ok(times.length>=5);
 assert.ok(times.every((time,i)=>i===0||Math.abs(time-times[i-1]-.5)<.02),'early feedback must not accelerate sustained gait');
}));

test('single-frame movement flicker cannot trigger footsteps',async()=>setup(async(a,c)=>{
 a.setMix({music:0});
 for(let i=0;i<90;i++){
  c.currentTime+=1/60;a.update(1/60,{moving:true,speed:3.15,groundMaterial:'stone'});
  c.currentTime+=1/60;a.update(1/60,{moving:false});
 }
 assert.equal(foley(c).filter(n=>!n.loop).length,0);
}));

test('old and new tide choices share pitches but place the harp answer half a beat apart in every bar',()=>{
 for(let bar=0;bar<16;bar++){
  const scene={letter:'tide',zone:'pool',letterConnected:true};
  const old=score.scoreBar(bar,{...scene,letterChoice:'old'}),fresh=score.scoreBar(bar,{...scene,letterChoice:'new'});
  const voices=part=>part.notes.filter(note=>Math.abs(note.pan)===.55);
  const a=voices(old),b=voices(fresh);
  assert.notDeepEqual(old.notes,fresh.notes,'choice must change composed rhythm in bar '+bar);
  assert.deepEqual(a.map(n=>[n.instrument,n.midi]),b.map(n=>[n.instrument,n.midi]));
  assert.deepEqual(a.map(n=>n.beat),[0,0]);assert.deepEqual(b.map(n=>n.beat),[0,.5]);
  assert.deepEqual(a.map(n=>n.gain),b.map(n=>n.gain));
  assert.ok(b.every(n=>n.duration>0&&n.beat+n.duration<=fresh.beats));
  const energy=b.reduce((sum,n)=>sum+n.gain*n.gain*n.duration,0);
  assert.ok(energy<=.075**2*1.5+.085**2*1.7,'choice does not raise the previous tide voice energy budget');
 }
});

test('tide reply motif keeps four pitches and gains while new choice leaves space before each harp answer',()=>{
 assert.equal(typeof score.tideReplyScore,'function');
 const old=score.tideReplyScore('old'),fresh=score.tideReplyScore('new');
 assert.deepEqual(old.map(n=>n.midi),[62,69,74,81]);assert.deepEqual(old.map(n=>n.midi),fresh.map(n=>n.midi));
 assert.deepEqual(old.map(n=>n.beat),[0,0,1.5,1.5]);assert.deepEqual(fresh.map(n=>n.beat),[0,.5,1.5,2]);
 assert.deepEqual(old.map(n=>n.gain),fresh.map(n=>n.gain));
 assert.ok(fresh.every(n=>n.gain<=.29&&n.duration>0&&n.beat+n.duration<=3));
});

test('reply event schedules the chosen tide rhythm without adding persistent audio nodes',async()=>setup(async(a,c)=>{
 const count=a.getStats().persistentNodes,begin=c.nodes.length;
 a.event('letter-reply',{id:'tide',choice:'old'});
 const old=c.nodes.slice(begin).filter(n=>n.buffer?.url&&n.started.length);
 const boundary=c.nodes.length;a.event('letter-reply',{id:'tide',choice:'new'});
 const fresh=c.nodes.slice(boundary).filter(n=>n.buffer?.url&&n.started.length);
 assert.equal(old.length,4);assert.equal(fresh.length,4);
 assert.equal(old[0].started[0][0],old[1].started[0][0]);
 assert.ok(fresh[1].started[0][0]-fresh[0].started[0][0]>.4);
 assert.deepEqual(old.map(n=>n.buffer.url),fresh.map(n=>n.buffer.url));
 assert.equal(a.getStats().persistentNodes,count);assert.equal(a.getStats().persistentSources,3);
}));
