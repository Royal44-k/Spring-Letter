import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,updateBloom,stepWind,setStructure,allocateCore,commitLetter,serialize,restore} from '../src/game-model.js';
import {supportAt} from '../src/layout.js';

test('half-open hold unlocks the first path; full bloom does not',()=>{
 const s=createState();for(let i=0;i<90;i++)updateBloom(s,1,1/60);assert.equal(s.p1.solved,false);
 for(let i=0;i<50;i++)updateBloom(s,.52,1/60);assert.equal(s.p1.solved,true);
});
test('leaving the optical window resets hold, and background time cannot solve it',()=>{
 const s=createState();for(let i=0;i<24;i++)updateBloom(s,.52,1/60);
 updateBloom(s,.8,1/60);assert.equal(s.p1.hold,0);updateBloom(s,.52,120);assert.equal(s.p1.solved,false);
});
test('game model exposes deliberate wind attraction and escape preserves the flower state',()=>{
 const s=createState();s.p1.solved=true;s.bloom=.56;
 stepWind(s,{pointer:{x:-2.5,z:2},bloom:.56},.05);assert.ok(s.wind.vx>0);assert.equal(s.wind.touched,true);
 s.wind.x=8;stepWind(s,{pointer:null,bloom:.56},.05);assert.equal(s.wind.x,-3);assert.equal(s.wind.z,2);assert.equal(s.wind.returns,1);assert.equal(s.bloom,.56);
});
test('an untouched light cannot silently complete the wind puzzle',()=>{
 const s=createState();s.p1.solved=true;s.wind.x=3;s.wind.z=-2;
 for(let i=0;i<90;i++)stepWind(s,{pointer:null,released:i===0,bloom:.5},1/60);
 assert.equal(s.wind.solved,false);
});
test('a deliberately delivered light can settle into the receiving flower',()=>{
 const s=createState();s.p1.solved=true;s.wind.x=3;s.wind.z=-2;s.wind.touched=true;
 for(let i=0;i<90;i++)stepWind(s,{pointer:null,released:i===0,bloom:.5},1/60);
 assert.equal(s.wind.solved,true);
});
test('both inner and outer routes stay still until the player explicitly guides the seed',()=>{
 for(const z of [-1.1,2.9]){const s=createState();s.p1.solved=true;s.wind.x=-.4;s.wind.z=z;s.wind.time=2;for(let i=0;i<120;i++)stepWind(s,{pointer:null},1/60);assert.equal(s.wind.x,-.4);assert.equal(s.wind.z,z);assert.equal(s.wind.touched,false);}
});
test('guidance is stable across ordinary frame rates and cannot cut through the stone center',()=>{
 const positions=[];
 for(const hz of [30,60,144]){const s=createState();s.p1.solved=true;for(let i=0;i<hz;i++)stepWind(s,{pointer:{x:-2,z:2}},1/hz);positions.push(s.wind.x);}
 assert.ok(Math.max(...positions)-Math.min(...positions)<.025);
 const s=createState();s.p1.solved=true;s.wind.x=-1;s.wind.z=0;for(let i=0;i<240;i++)stepWind(s,{pointer:{x:1,z:0}},1/60);assert.ok(Math.hypot(s.wind.x,s.wind.z)>=.88);assert.ok(s.wind.x<0);
});
test('escape clears touched and cannot silently deliver a returned light',()=>{
 const s=createState();s.p1.solved=true;s.wind.x=4.79;s.wind.vx=3;s.wind.touched=true;s.wind.hold=.7;
 stepWind(s,{pointer:null,bloom:.52},.05);
 assert.equal(s.wind.x,-3);assert.equal(s.wind.z,2);assert.equal(s.wind.touched,false);assert.equal(s.wind.hold,0);
 assert.equal(s.wind.returns,1);assert.equal(s.wind.vx,0);assert.equal(s.wind.vz,0);
 s.wind.x=3;s.wind.z=-2;
 for(let i=0;i<90;i++)stepWind(s,{pointer:null,bloom:.52},1/60);
 assert.equal(s.wind.solved,false,'arrival after a return still requires deliberate contact');
});
test('continued effective force cannot complete the receiving-flower hold',()=>{
 const s=createState();s.p1.solved=true;s.wind.x=3;s.wind.z=-2;s.wind.touched=true;
 for(let i=0;i<90;i++)stepWind(s,{pointer:{x:s.wind.x-.6,z:s.wind.z},bloom:.52},1/60);
 assert.equal(s.wind.solved,false);assert.equal(s.wind.hold,0);
});
test('a deliberate release is caught visibly without a hidden speed requirement',()=>{
 const s=createState();s.p1.solved=true;s.wind.x=2.9;s.wind.z=-2;s.wind.vx=1.5;s.wind.touched=true;
 stepWind(s,{pointer:null,released:true,bloom:.52},.05);
 assert.ok(s.wind.hold>0,'the flower starts catching as soon as the player releases inside its ring');
 assert.equal(s.wind.solved,false,'catching still animates before completion');
 for(let i=0;i<150;i++)stepWind(s,{pointer:null,bloom:.52},1/60);
 assert.equal(s.wind.solved,true);
});
test('occupied bridge cannot be recalled or replaced; request does not queue',()=>{
 const s=createState();s.wind.solved=true;assert.equal(setStructure(s,'bridge_am').ok,true);
 s.bridge.support='bridge_am';assert.equal(setStructure(s,'none').ok,false);assert.equal(s.bridge.structure,'bridge_am');
 s.bridge.support=null;s.bridge.platform='M';assert.equal(s.bridge.structure,'bridge_am');
 assert.equal(setStructure(s,'bridge_mf').ok,true);
});
test('shield cannot be removed while the dependent leaf path carries the player',()=>{
 const s=createState();s.wind.solved=true;s.bridge.platform='R';setStructure(s,'shield_rm');s.bridge.support='leaf_rm';
 assert.equal(setStructure(s,'none').ok,false);assert.equal(s.bridge.structure,'shield_rm');
});
test('every safe platform has a valid return route; remote disconnected build is rejected',()=>{
 const s=createState();s.wind.solved=true;s.bridge.platform='F';
 assert.equal(setStructure(s,'shield_rm').ok,false);assert.equal(setStructure(s,'bridge_mf').ok,true);
 s.bridge.platform='M';assert.equal(setStructure(s,'shield_rm').ok,true);
 s.bridge.platform='R';assert.equal(setStructure(s,'bridge_am').ok,false);
});
test('two cores cannot occupy one purpose and previews do not commit an ending',()=>{
 const s=createState();s.bridge.solved=true;assert.equal(allocateCore(s,0,'memory').ok,true);
 assert.equal(allocateCore(s,1,'memory').ok,false);assert.deepEqual(s.cores,['memory',null]);assert.equal(s.ending,null);
 assert.equal(commitLetter(s).ok,false);assert.equal(allocateCore(s,1,'season').ok,true);
 assert.equal(allocateCore(s,0,'voyage').ok,true);assert.equal(s.ending,null);
 assert.equal(commitLetter(s).ok,true);assert.equal(s.ending,'season+voyage');
 assert.equal(allocateCore(s,0,'memory').ok,false);
});
test('all three intended endings are reachable without a hidden third core',()=>{
 for(const pair of [['memory','season'],['memory','voyage'],['season','voyage']]){
  const s=createState();s.bridge.solved=true;allocateCore(s,0,pair[0]);allocateCore(s,1,pair[1]);
  assert.equal(commitLetter(s).ok,true);assert.equal(s.ending,pair.join('+'));
 }
});
test('a valid save preserves puzzle state and core identity through restore',()=>{
 const s=createState();s.p1.solved=true;s.wind.solved=true;s.bridge.solved=true;s.bridge.platform='M';s.bridge.structure='bridge_mf';
 allocateCore(s,0,'memory');allocateCore(s,1,'voyage');const r=restore(serialize(s));
 assert.equal(r.bridge.structure,'bridge_mf');assert.equal(r.bridge.platform,'M');assert.deepEqual(r.cores,['memory','voyage']);assert.equal(r.ending,null);
});
test('malformed, future and forged progress saves restore to coherent safe state',()=>{
 for(const raw of ['{broken','null','[]','{"version":999,"ending":"all"}'])assert.equal(restore(raw).p1.solved,false);
 const r=restore(JSON.stringify({version:1,p1:{solved:false},wind:{solved:true},bridge:{solved:true},cores:['memory','memory'],ending:'memory+memory',player:{x:1e99,z:-1e99}}));
 assert.equal(r.wind.solved,false);assert.equal(r.bridge.solved,false);assert.deepEqual(r.cores,[null,null]);assert.equal(r.ending,null);assert.ok(Math.abs(r.player.x)<10);
});

test('restoration discards nonstring bridge shapes without coercing damaged JSON objects',()=>{
 for(const structure of [{toString:null},{toString:1,valueOf:null},{toString:[]},['bridge_am'],['shield_rm'],[],null,1,true]){
  const raw=JSON.stringify({version:1,p1:{solved:true},wind:{solved:true},bridge:{platform:'M',structure},player:{safe:'pool'}});
  let restored;assert.doesNotThrow(()=>{restored=restore(raw);},JSON.stringify(structure));
  assert.equal(restored.bridge.structure,'none');assert.equal(restored.bridge.platform,'M');
  assert.deepEqual(restored.player,{x:0,z:-32,safe:'pool'});
 }
});

test('restoration never treats inherited object property names as bridge shapes',()=>{
 for(const structure of ['__proto__','constructor','toString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','__defineGetter__']){
  const restored=restore(JSON.stringify({version:1,p1:{solved:true},wind:{solved:true},bridge:{structure}}));
  assert.equal(restored.bridge.structure,'none',structure);
  assert.equal(supportAt(0,-29,restored),null,'an invalid saved name must not create a crossing');
 }
});

test('valid saved bridge structures keep their physical crossings and remain gated by wind',()=>{
 for(const [structure,x,z,support] of [['none',0,-29,null],['bridge_am',0,-29,'bridge_am'],['bridge_mf',0,-35,'bridge_mf'],['shield_rm',-2.5,-30.5,'leaf_rm']]){
  const raw={version:1,p1:{solved:true},wind:{solved:true},bridge:{platform:'M',structure},player:{safe:'pool'}};
  const restored=restore(JSON.stringify(raw));
  assert.equal(restored.bridge.structure,structure);assert.equal(supportAt(x,z,restored)?.support??null,support);
  assert.deepEqual(restore(serialize(restored)),restored);
  raw.wind.solved=false;const locked=restore(JSON.stringify(raw));
  assert.equal(locked.bridge.structure,'none');assert.equal(supportAt(x,z,locked),null);
 }
});
