import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreBar,scoreScene,SAMPLE_BANK} from '../src/audio-score.js';
import {createAudio} from '../src/audio.js';
class Param {
 constructor(v=0){this.value=v;this.events=[];}
 setValueAtTime(v,t){this.value=v;this.events.push([v,t]);}
 linearRampToValueAtTime(v,t){this.setValueAtTime(v,t);}
 exponentialRampToValueAtTime(v,t){this.setValueAtTime(v,t);}
 setTargetAtTime(v,t){this.setValueAtTime(v,t);}
 cancelScheduledValues(){} cancelAndHoldAtTime(){}
}
class Node {
 constructor(){this.gain=new Param();this.frequency=new Param();this.Q=new Param();this.pan=new Param();this.playbackRate=new Param(1);this.connections=[];this.started=[];}
 connect(n){this.connections.push(n);} disconnect(){this.connections=[];}
 start(...args){this.started.push(args);} stop(){this.stopped=true;}
}
class Context {
 constructor(){this.state='running';this.currentTime=0;this.sampleRate=1000;this.destination=new Node();this.nodes=[];Context.last=this;}
 node(){const n=new Node();this.nodes.push(n);return n;}
 createGain(){return this.node();}createBufferSource(){return this.node();}createBiquadFilter(){return this.node();}createStereoPanner(){return this.node();}createConvolver(){return this.node();}createOscillator(){return this.node();}
 createDynamicsCompressor(){const n=this.node();for(const p of ['threshold','knee','ratio','attack','release'])n[p]=new Param();return n;}
 createBuffer(channels,length,rate){return{duration:length/rate,getChannelData:()=>new Float32Array(length)};}
 decodeAudioData(){return Promise.resolve({duration:5});}
 resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}
}
async function setup(fn,{baseURI}={}){
 const oldWindow=globalThis.window,oldFetch=globalThis.fetch,oldDocument=globalThis.document,urls=[];
 if(baseURI)globalThis.document={baseURI};globalThis.window={AudioContext:Context};globalThis.fetch=async url=>{urls.push(url);return {ok:true,arrayBuffer:async()=>new ArrayBuffer(16)};};
 const audio=createAudio();try{audio.unlock();await audio.ready();await fn(audio,Context.last,urls);}finally{audio.dispose();globalThis.window=oldWindow;globalThis.fetch=oldFetch;globalThis.document=oldDocument;}
}
test('sample requests stay beside a nested iframe index instead of the host root',async()=>setup(async(a,c,urls)=>{
 assert.equal(urls.length,16);assert.ok(urls.every(url=>url.startsWith('https://host.example/games/spring/assets/')));assert.equal(a.getStats().loadedSamples.length,7);assert.equal(a.getStats().loadedFoley.length,9);
},{baseURI:'https://host.example/games/spring/index.html?embed=1'}));
test('authored score has harmonic movement, rests and materially distinct challenge orchestration',()=>{
 const bars=Array.from({length:16},(_,i)=>scoreBar(i,{}));
 assert.ok(new Set(bars.map(b=>b.notes.find(n=>n.instrument==='cello').midi)).size>=5);
 assert.ok(!bars[0].notes.some(n=>n.instrument==='flute'));assert.ok(bars[6].notes.some(n=>n.instrument==='flute'));
 assert.ok(scoreBar(4,{challengeActive:true}).notes.some(n=>n.instrument==='pizz'));
 assert.ok(scoreScene({challengeActive:true}).bpm>scoreScene({}).bpm);
 for(const bar of bars)for(const note of bar.notes){assert.ok(SAMPLE_BANK[note.instrument]);assert.ok(note.beat>=0&&note.beat<3&&note.duration>0);}
});
test('unlock is idempotent and audio clock schedules notes even with a tiny render delta',async()=>setup(async(a,c)=>{
 const count=c.nodes.length;a.unlock();await a.ready();assert.equal(c.nodes.length,count);assert.equal(a.getStats().loadedSamples.length,7);
 a.update(.001,{});assert.ok(a.getStats().queuedNotes>0);const before=a.getStats().scheduledNotes;c.currentTime=1.3;a.update(.001,{});assert.ok(a.getStats().scheduledNotes>before);
}));
test('pause and mute clear all foreground voices and do not replay a backlog on resume',async()=>setup(async(a,c)=>{
 a.update(.05,{challengeActive:true});a.event('collect',{combo:4});assert.ok(a.getStats().voices>0);
 a.pause(true);assert.equal(a.getStats().voices,0);assert.equal(a.getStats().queuedNotes,0);assert.equal(c.state,'suspended');
 assert.equal(a.event('complete'),false);c.currentTime+=100;a.update(.05,{});assert.equal(a.getStats().voices,0);
 a.pause(false);await Promise.resolve();a.update(.016,{});assert.ok(a.getStats().voices>0);assert.equal(a.getStats().missedSchedules,0);
 a.setMuted(true);assert.equal(a.getStats().voices,0);assert.equal(a.note(),false);
}));
test('event storms stay bounded and dispose disconnects every persistent node',async()=>setup(async(a)=>{
 for(let i=0;i<200;i++)a.event('complete');assert.ok(a.getStats().voices<=a.getStats().voiceLimit);
 a.dispose();assert.equal(a.getStats().voices,0);assert.equal(a.getStats().persistentNodes,0);assert.equal(a.getStats().persistentSources,0);assert.equal(a.unlock(),false);
}));
test('independent mix persists before unlock and reverb uses post-fader paths',async()=>setup(async(a,c)=>{
 a.setMix({music:0,sfx:.4,ambience:.2});a.update(.05,{});assert.deepEqual(a.getStats().mix,{music:0,sfx:.4,ambience:.2});
 // No per-note send bypass: sample nodes ultimately feed a channel fader, whose
 // output supplies both the destination path and the room send.
 const channels=c.nodes.filter(n=>n.connections.length===2);assert.ok(channels.length>=2);
 assert.ok(channels.some(n=>n.gain.value===0));
 a.setMix({music:2,sfx:-1,ambience:NaN});assert.deepEqual(a.getStats().mix,{music:1,sfx:0,ambience:0});
}));
