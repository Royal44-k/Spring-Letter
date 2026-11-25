import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreBar,scoreScene,SAMPLE_BANK} from '../src/audio-score.js';

const stages=['writing','tide','island','rigging','sailing','dawn','complete'];
test('coastal stages have distinct authored arrangements and ocean 6/8 keeps two groups of three',()=>{
 const music=stages.map(voyage=>scoreScene({voyage,letter:'rain',challengeActive:true}));
 assert.equal(new Set(music.map(s=>s.title)).size,7);
 assert.deepEqual(music.map(s=>s.zone),['shore','shore','shore','shore','ocean','ocean','ocean']);
 for(const voyage of ['sailing','dawn','complete'])assert.equal(scoreBar(0,{voyage}).beats,6);
 const sail=scoreBar(0,{voyage:'sailing',voyageSpeed:2});
 const harp=sail.notes.filter(n=>n.instrument==='harp');
 assert.deepEqual(harp.map(n=>n.beat),[0,1,2,3,4,5]);
 assert.ok(harp[0].gain>harp[1].gain&&harp[3].gain>harp[4].gain);
 assert.ok(scoreBar(0,{voyage:'writing'}).notes.length<=5);
 assert.ok(scoreBar(0,{voyage:'tide'}).notes.every(n=>n.beat<2));
 assert.ok(scoreBar(1,{voyage:'tide'}).notes.some(n=>n.instrument==='flute'&&n.beat>=1));
 assert.notDeepEqual(scoreBar(0,{voyage:'writing'}).notes,scoreBar(0,{voyage:'complete'}).notes);
});

test('voyage score is deterministic, finite and within sampled instrumental range even for invalid input',()=>{
 for(const voyage of stages)for(const index of [0,1,7,8,15,255,-17,NaN,Infinity])for(const speed of [0,1,3,NaN,Infinity,-99]){
  const input={voyage,voyageSpeed:speed,voyageProgress:speed},bar=scoreBar(index,input);
  assert.deepEqual(bar,scoreBar(index,input));
  assert.ok(Number.isFinite(bar.index));assert.ok(bar.bpm>=50&&bar.bpm<=160);
  assert.ok(bar.notes.length>0&&bar.notes.length<=24);
  let last=-1;
  for(const n of bar.notes){
   assert.ok(SAMPLE_BANK[n.instrument]);
   for(const field of ['midi','beat','duration','gain','pan'])assert.ok(Number.isFinite(n[field]),`${voyage}/${field}`);
   assert.ok(n.midi>=43&&n.midi<=86);assert.ok(n.beat>=0&&n.beat<bar.beats&&n.beat>=last);last=n.beat;
   assert.ok(n.duration>0&&n.duration<=8);assert.ok(n.gain>0&&n.gain<=.24);assert.ok(Math.abs(n.pan)<=.65);
  }
 }
 assert.deepEqual(scoreBar(2,{voyage:'invalid'}),scoreBar(2,{}));
 assert.deepEqual(scoreBar(2,{voyage:null}),scoreBar(2,{}));
});

test('the dawn cadence settles on the same D centre and speed changes colour rather than pitch',()=>{
 const still=scoreBar(0,{voyage:'sailing',voyageSpeed:0}),moving=scoreBar(0,{voyage:'sailing',voyageSpeed:3});
 assert.deepEqual(still.notes.filter(n=>n.instrument==='harp').map(n=>n.midi),moving.notes.filter(n=>n.instrument==='harp').map(n=>n.midi));
 assert.ok(moving.notes.filter(n=>n.instrument==='pizz').length>still.notes.filter(n=>n.instrument==='pizz').length);
 const cadence=scoreBar(7,{voyage:'dawn'});
 assert.equal(cadence.notes.find(n=>n.instrument==='cello').midi,50);
 assert.equal(cadence.notes.filter(n=>n.instrument==='flute').at(-1).midi,74);
 const energy=bar=>bar.notes.reduce((sum,n)=>sum+n.gain*n.gain*n.duration,0);
 assert.ok(energy(scoreBar(0,{voyage:'complete'}))<energy(scoreBar(0,{voyage:'dawn'})));
});
