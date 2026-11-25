import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreBar,scoreScene,SAMPLE_BANK} from '../src/audio-score.js';

const maps=['conservatory','observatory','meadow'];
const cycle=(atlas,extra={})=>Array.from({length:16},(_,bar)=>scoreBar(bar,{atlas,...extra}));

test('a visited atlas map takes precedence over a retained voyage, old letter and ending',()=>{
 for(const atlas of maps){
  const scene={atlas,voyage:'sailing',letter:'rain',ended:true,zone:'garden'};
  assert.equal(scoreScene(scene).atlas,atlas);
  assert.equal(scoreScene(scene).voyage,undefined);
  assert.equal(scoreBar(0,scene).atlas,atlas);
  assert.notEqual(scoreScene(scene).title,scoreScene({voyage:'sailing'}).title);
 }
});

test('each map has its own written pitch and rhythm sequence rather than a timbre swap',()=>{
 const phrases=maps.map(atlas=>cycle(atlas).map(bar=>bar.notes.map(n=>[n.midi,n.beat,n.duration])));
 for(let i=0;i<phrases.length;i++)for(let j=i+1;j<phrases.length;j++)assert.notDeepEqual(phrases[i],phrases[j]);
 const warm=cycle('conservatory'),night=cycle('observatory'),cloud=cycle('meadow');
 assert.ok(warm.some(b=>b.notes.some(n=>n.instrument==='pizz')),'warm wood plucks');
 assert.ok(warm.some(b=>b.notes.some(n=>n.instrument==='flute')),'occasional flute answer');
 assert.ok(warm.filter(b=>!b.notes.some(n=>n.instrument==='flute')).length>=8,'flute has breathing room');
 assert.ok(night.every(b=>b.notes.every(n=>n.instrument==='piano'||n.instrument==='harp')));
 assert.ok(cloud.every(b=>b.beats===3),'cloud movement is in three');
 assert.ok(cloud.every(b=>b.notes.length>=5),'cloud motion persists through the phrase');
 assert.ok(night[0].bpm<warm[0].bpm&&warm[0].bpm<cloud[0].bpm);
});

test('observatory leaves whole silent bars even after progress and never uses a sustained drone',()=>{
 for(const atlasProgress of [0,1]){
  const bars=cycle('observatory',{atlasProgress});
  assert.ok(bars.filter(b=>b.notes.length===0).length>=8);
  assert.ok(bars.some(b=>b.notes.some(n=>n.midi>=79)),'small glasslike upper answer');
  for(const bar of bars)for(const note of bar.notes)assert.ok(note.beat+note.duration<=bar.beats,'no note fills the next silent bar');
 }
});

test('atlas scores stay finite, quiet and bounded for restored malformed progress and indices',()=>{
 for(const atlas of maps)for(const progress of [NaN,Infinity,-10,0,.5,1,10])for(const index of [-99,NaN,Infinity,0,7,15,40]){
  const bar=scoreBar(index,{atlas,atlasProgress:progress,speed:Infinity,moving:true});
  assert.ok(Number.isFinite(bar.bpm)&&bar.bpm>40&&bar.bpm<110);
  assert.ok(bar.notes.length<=12);
  for(const n of bar.notes){
   assert.ok(Object.hasOwn(SAMPLE_BANK,n.instrument));
   for(const key of ['midi','beat','duration','gain','pan'])assert.ok(Number.isFinite(n[key]),key);
   assert.ok(n.midi>=40&&n.midi<=86&&n.gain>0&&n.gain<=.2);
   assert.ok(n.beat>=0&&n.beat<bar.beats&&n.duration>0&&n.duration<=4);
   assert.ok(Math.abs(n.pan)<=.6);
  }
 }
});

test('absent or unknown atlas leaves every old zone and voyage score unchanged',()=>{
 for(const scene of [{zone:'garden'},{zone:'wind',challengeActive:true},{letter:'tide',letterChoice:'new'},{voyage:'writing'},{voyage:'sailing'}]){
  for(const atlas of [undefined,null,'missing','__proto__',{}])for(let i=0;i<16;i++)assert.deepEqual(scoreBar(i,{...scene,atlas}),scoreBar(i,scene));
 }
});
