import test from 'node:test';
import assert from 'node:assert/strict';
import { createVoyageState, restoreVoyageState, voyageCommand, stepVoyage, voyageStageInfo, voyageTideLevel, voyageGroundHeight, TIDE_STONES, BOAT_DOCK } from '../src/voyage-model.js';
import * as voyageModel from '../src/voyage-model.js';

const command = (s, c, p) => { const r = voyageCommand(s, c, p); assert.equal(r.ok, true, `${c}: ${r.reason}`); return r.state; };
function written() {
  let s = command(createVoyageState(), 'begin');
  s = command(s, 'write', {recipient:'远方的你', body:'愿有人与你一起看春天。'});
  return command(command(s, 'seal'), 'leave-desk');
}
function readyToSail() {
  let s = written(); s.player = {x:0,z:-13};
  s = command(command(s, 'read-old'), 'take-old');
  s.player = {x:0,z:-24}; s = stepVoyage(s,.016).state;
  assert.equal(s.stage,'island'); s.player = {...BOAT_DOCK};
  s = command(s,'board'); s = command(s,'untie',{side:0}); s = command(s,'untie',{side:1});
  for(let i=0;i<6;i++) s=command(s,'hoist',{amount:.2});
  return s;
}

test('a personal letter requires both fields, preserves Unicode, and seals only deliberately',()=>{
  const base = createVoyageState(), s = command(base,'begin');
  assert.equal(base.stage,'idle'); assert.equal(s.stage,'writing');
  assert.equal(voyageCommand(s,'seal').ok,false);
  let draft=command(s,'write',{recipient:'  ',body:'内容'});
  assert.equal(voyageCommand(draft,'seal').ok,false);
  draft=command(draft,'write',{recipient:'🌸'.repeat(70),body:'风\u0000\n'+ '海'.repeat(700),sealKind:'iris'});
  assert.equal(Array.from(draft.letter.recipient).length,60);
  assert.equal(Array.from(draft.letter.body).length,600);
  assert.equal(draft.letter.body.includes('\u0000'),false);
  assert.equal(draft.letter.sealKind,'iris');
  assert.equal(voyageCommand(draft,'leave-desk').ok,false);
  const sealed=command(draft,'seal'); assert.equal(sealed.letter.sealed,true);
  assert.equal(command(sealed,'write',{body:'重新写一段'}).letter.sealed,false);
  assert.equal(command(sealed,'leave-desk').stage,'tide');
  assert.equal(voyageCommand(sealed,'write',{body:{html:'bad'}}).ok,false);
});

test('tide route is connected, has safe waiting places, and walking normalizes diagonal speed',()=>{
  for(let i=1;i<TIDE_STONES.length;i++) {
    const a=TIDE_STONES[i-1],b=TIDE_STONES[i];
    assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<a.radius+b.radius-.1);
  }
  assert.equal(TIDE_STONES.find(s=>s.oldLetter).z,-13);
  assert.ok(TIDE_STONES.filter(s=>s.high).length>=4);
  const start=written(), one=stepVoyage(start,.05,{right:1}), diagonal=stepVoyage(start,.05,{right:100,forward:100});
  assert.ok(Math.abs(Math.hypot(one.state.player.x-start.player.x,one.state.player.z-start.player.z)-Math.hypot(diagonal.state.player.x-start.player.x,diagonal.state.player.z-start.player.z))<1e-10);
  assert.equal(start.player.x,0); assert.equal(start.player.z,5);
  for(const clock of [-100,0,9,Infinity,NaN,1e10])assert.ok(voyageTideLevel(clock)>=0&&voyageTideLevel(clock)<=1);
});

test('rising water returns only to a high checkpoint without losing the letter',()=>{
  let s=written();const high=TIDE_STONES[3];s.player={x:high.x,z:high.z};
  s=stepVoyage(s,.016).state;assert.equal(s.checkpoint,4);
  s.player={x:TIDE_STONES[4].x,z:TIDE_STONES[4].z};s.tideClock=9;
  const result=stepVoyage(s,.016);
  assert.ok(result.events.some(e=>e.type==='recover'));assert.equal(result.state.recoveries,1);
  assert.deepEqual(result.state.player,{x:high.x,z:high.z});
  assert.deepEqual(result.state.letter,s.letter);assert.equal(result.state.letter.sealed,true);
  assert.equal(s.recoveries,0);
});

test('old letter requires actual proximity and reading; distant island cannot skip it',()=>{
  let s=written();assert.equal(voyageCommand(s,'read-old').ok,false);assert.equal(voyageCommand(s,'take-old').ok,false);
  s.player={x:0,z:-13};assert.equal(voyageCommand(s,'take-old').ok,false);
  s=command(s,'read-old');assert.equal(s.oldRead,true);assert.equal(s.predecessor,false);
  s=command(s,'take-old');assert.equal(s.predecessor,true);
  s.player={x:0,z:-24};s=stepVoyage(s,.016).state;assert.equal(s.stage,'island');
  const noLetter=written();noLetter.player={x:0,z:-24};assert.notEqual(stepVoyage(noLetter,.016).state.stage,'island');
});

test('boarding, ropes and sail each have real prerequisites and replay-safe events',()=>{
  let s=written();assert.equal(voyageCommand(s,'board').ok,false);
  s.player={x:0,z:-13};s=command(command(s,'read-old'),'take-old');s.player={x:0,z:-24};s=stepVoyage(s,.016).state;
  assert.equal(voyageCommand(s,'board').ok,false);s.player={...BOAT_DOCK};s=command(s,'board');
  assert.equal(voyageCommand(s,'launch').ok,false);
  assert.equal(voyageCommand(s,'untie',{side:2}).ok,false);
  s=command(s,'untie',{side:0});assert.deepEqual(s.ropes,[true,false]);
  assert.equal(voyageCommand(s,'untie',{side:0}).events.length,0);
  s=command(s,'untie',{side:1});s=command(s,'hoist',{amount:100});assert.ok(s.sail<=.25,'one drag event cannot hoist the whole sail');
  assert.equal(voyageCommand(s,'launch').ok,false);
  s=readyToSail();const launched=voyageCommand(s,'launch');assert.equal(launched.ok,true);assert.equal(launched.state.stage,'sailing');
});

test('sailing responds to steering, trim and brake, grows diverse finite flowers, and pauses at dawn',()=>{
  const launch=command(readyToSail(),'launch'), base=JSON.stringify(launch);
  let s=launch;
  for(let i=0;i<200;i++)s=stepVoyage(s,.05,{steer:1,trim:.5,scatter:true}).state;
  assert.ok(s.boat.x>BOAT_DOCK.x);assert.ok(s.boat.heading<=.7);assert.ok(s.distance>0);
  assert.ok(s.flowers.length>0&&s.flowers.length<=96);
  assert.ok(new Set(s.flowers.map(f=>f.kind)).size>=3);
  assert.equal(JSON.stringify(launch),base);
  const fast=stepVoyage(s,.05),slow=stepVoyage(s,.05,{brake:true});assert.ok(fast.state.boat.speed>slow.state.boat.speed);
  for(let i=0;i<2000&&s.stage==='sailing';i++)s=stepVoyage(s,.05,{steer:-1,scatter:true}).state;
  assert.equal(s.stage,'dawn');assert.equal(s.distance,150);assert.equal(s.boat.speed,0);
  assert.equal(stepVoyage(s,.05,{forward:1}).state.stage,'dawn');
  s=command(s,'depart');assert.equal(s.stage,'complete');assert.equal(voyageCommand(s,'depart').events.length,0);
});

test('restoration rejects malformed progress and restores earned stages without stale velocity',()=>{
  for(const data of [null,[],{version:2},{version:1,stage:'complete'},{version:1,stage:'sailing',letter:{sealed:true}}]) {
    const s=restoreVoyageState(data);assert.ok(['idle','writing'].includes(s.stage));assert.equal(s.boat.speed,0);
  }
  let s=written();s.player={x:0,z:-13};s=command(command(s,'read-old'),'take-old');s=stepVoyage(s,.016).state;
  const loaded=restoreVoyageState({...s,player:{x:NaN,z:Infinity},tideClock:NaN});
  assert.equal(loaded.stage,'tide');assert.deepEqual(loaded.player,{x:0,z:-13});assert.equal(loaded.predecessor,true);
  const sailing=command(readyToSail(),'launch');sailing.distance=51;sailing.boat={x:8,z:-80,heading:.4,speed:8};
  const resumed=restoreVoyageState(sailing);assert.equal(resumed.stage,'sailing');assert.equal(resumed.distance,51);assert.equal(resumed.boat.speed,0);assert.equal(resumed.boat.heading,.4);
  const illegal=restoreVoyageState({...sailing,ropes:[true,false]});assert.equal(illegal.stage,'rigging');
});

test('nonfinite input cannot poison movement; paused updates do not advance tide or sailing',()=>{
  for(const dt of [0,-5,NaN,Infinity])assert.deepEqual(stepVoyage(written(),dt,{right:Infinity,forward:NaN}).state,written());
  let s=command(readyToSail(),'launch');s=command(s,'pause');const p=stepVoyage(s,.05,{steer:1});assert.deepEqual(p.state,s);assert.equal(p.events.length,0);
  s=command(s,'resume');const before=s.elapsed;s=stepVoyage(s,1e9,{steer:Infinity,trim:NaN}).state;
  assert.ok(s.elapsed-before<=.05000001);assert.ok([s.boat.x,s.boat.z,s.boat.heading,s.boat.speed,s.distance].every(Number.isFinite));
  const info=voyageStageInfo(s);assert.equal(info.stage,'sailing');assert.ok(info.title&&info.hint);
});

test('a complete tide crossing and boarding is reachable through movement and commands only',()=>{
  let s=written(),steps=0;
  function tick(input={}){s=stepVoyage(s,.05,input).state;assert.ok(++steps<4000,'route must not deadlock');}
  function walkTo(target){
    while(Math.hypot(s.player.x-target.x,s.player.z-target.z)>.18){
      const x=target.x-s.player.x,z=target.z-s.player.z,len=Math.hypot(x,z);
      tick({right:x/len,forward:-z/len});
      assert.equal(s.recoveries,0,'the connected dry trail must not unexpectedly drop the player');
    }
  }
  for(const [i,stone] of TIDE_STONES.entries()){
    if(!stone.high&&TIDE_STONES[i-1]?.high)while(voyageTideLevel(s)>.2)tick();
    walkTo(stone);
    if(stone.oldLetter)s=command(command(s,'read-old'),'take-old');
  }
  walkTo({x:0,z:-24.3});assert.equal(s.stage,'island');
  walkTo({x:5,z:-27.4});walkTo({x:7,z:-27.4});s=command(s,'board');assert.equal(s.stage,'rigging');
  assert.deepEqual(s.player,{x:7.8,z:-29});assert.deepEqual(s.boat,{x:7.8,z:-29,heading:0,speed:0});
  assert.ok(steps>200,'crossing requires traversal, not a sequence of instant buttons');
  assert.equal(voyageGroundHeight({x:0,z:1}),.9);assert.equal(voyageGroundHeight(TIDE_STONES[1]),.36);
  assert.equal(voyageGroundHeight(TIDE_STONES[5]),.95);assert.equal(voyageGroundHeight({x:0,z:-26}),.9);
});

test('the island boarding point and offshore boat mooring are distinct and joined by a supported jetty',()=>{
  assert.deepEqual(BOAT_DOCK,{x:7,z:-27.4});
  assert.deepEqual(voyageModel.BOAT_MOORING,{x:7.8,z:-29});
  assert.deepEqual(voyageModel.JETTY,{minX:4.8,maxX:7.2,minZ:-28.05,maxZ:-26.75,height:.9});
  const s=createVoyageState();assert.deepEqual({x:s.boat.x,z:s.boat.z},{x:7.8,z:-29});
  for(const x of [4.8,5,6,7,7.2])for(const z of [-28.05,-27.4,-26.75])assert.equal(voyageGroundHeight({x,z}),.9);
  assert.equal(voyageGroundHeight({x:7.21,z:-27.4}),.08,'the end of the jetty does not become walkable ocean');
  assert.equal(voyageGroundHeight({x:7,z:-28.06}),.08);
  assert.equal(voyageGroundHeight({x:7,z:-26.74}),.08);
  assert.equal(voyageGroundHeight({x:7.8,z:-29}),.08,'the actual boat floats beyond the land support');
});

test('old rigging saves move to the corrected mooring without resetting ropes or sail; sailed routes keep their x coordinate',()=>{
  const rigging=readyToSail();rigging.boat={x:3,z:-29,heading:.4,speed:2};rigging.player={x:3,z:-29};rigging.ropes=[true,false];rigging.sail=.62;
  const resumed=restoreVoyageState(rigging);
  assert.equal(resumed.stage,'rigging');assert.deepEqual(resumed.boat,{x:7.8,z:-29,heading:0,speed:0});assert.deepEqual(resumed.player,{x:7.8,z:-29});
  assert.deepEqual(resumed.ropes,[true,false]);assert.equal(resumed.sail,.62);assert.deepEqual(resumed.letter,rigging.letter);assert.equal(resumed.predecessor,true);
  const sailing=command(readyToSail(),'launch');sailing.distance=12;sailing.boat={x:3,z:-41,heading:.2,speed:4};
  const atSea=restoreVoyageState(sailing);assert.equal(atSea.boat.x,3);assert.equal(atSea.boat.z,-41);assert.equal(atSea.boat.speed,0);
  const next=stepVoyage(atSea,.05).state;assert.equal(next.boat.z,-29-next.distance);
});

test('reloaded letters, checkpoints and bouquets are normalized without granting unrelated future progress',()=>{
  const writing=restoreVoyageState({version:1,stage:'writing',oldRead:true,predecessor:true,ropes:[true,true],sail:1,checkpoint:11});
  assert.equal(writing.predecessor,false);assert.equal(writing.checkpoint,0);assert.deepEqual(writing.ropes,[false,false]);
  const start=command(readyToSail(),'launch');start.stage='complete';start.distance=NaN;
  const noDawn=restoreVoyageState(start);assert.equal(noDawn.stage,'sailing');assert.equal(noDawn.distance,0);
  start.distance=150;start.flowers=Array.from({length:150},(_,i)=>({x:1e8,z:-1e8,kind:i%2?'iris':'lotus',age:Infinity}));
  start.flowers.push({x:NaN,z:0,kind:'lily'});
  const complete=restoreVoyageState(start);assert.equal(complete.stage,'complete');assert.equal(complete.flowers.length,96);
  assert.ok(complete.flowers.every(f=>Number.isFinite(f.x+f.z+f.age)&&Math.abs(f.x)<=32));
});

test('a sealed draft can be reopened only at the desk and direct sail trim is finite and sea-only',()=>{
  let s=command(createVoyageState(),'begin');s=command(s,'write',{recipient:'未来',body:'我仍想补上一句。'});s=command(s,'seal');
  s=command(s,'unseal');assert.equal(s.letter.sealed,false);assert.equal(s.letter.body,'我仍想补上一句。');
  s=command(s,'seal');s=command(s,'leave-desk');assert.equal(voyageCommand(s,'unseal').ok,false);
  assert.equal(voyageCommand(s,'trim',{value:.5}).ok,false);
  s=command(readyToSail(),'launch');s=command(s,'trim',{value:2});assert.equal(s.trim,1);
  assert.equal(voyageCommand(s,'trim',{value:NaN}).ok,false);assert.equal(voyageCommand(s,'trim',{value:'-.5'}).ok,false);
  s=command(s,'trim',{value:-.35});assert.equal(s.trim,-.35);
});
