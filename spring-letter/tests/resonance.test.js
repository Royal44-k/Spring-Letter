import test from 'node:test';
import assert from 'node:assert/strict';
import {RESONANCE_ROUTES,createResonanceState,attemptResonance,stepResonance,serializeResonance,cancelResonance,resonanceNodePosition,resonanceNodeOpen,resonanceHazards,resonanceContext} from '../src/resonance-model.js';
import {supportAt} from '../src/layout.js';
import {createState} from '../src/game-model.js';
import {createResonance} from '../src/resonance.js';

const progress={p1:{solved:true},bridge:{solved:true}};
function start(id='dawn',saved){const route=RESONANCE_ROUTES.find(r=>r.id===id),player={x:route.x,z:route.z};return {state:attemptResonance(createResonanceState(saved),player,progress).state,player,route};}
function walk(sim,target,{dash=false}={}){let signals=[];for(let i=0;i<200;i++){const point=typeof target==='function'?target():target,dx=point.x-sim.player.x,dz=point.z-sim.player.z,d=Math.hypot(dx,dz);if(d<.15)break;const amount=Math.min(d,(dash?5.5:3.4)*.05);sim.player={x:sim.player.x+dx/d*amount,z:sim.player.z+dz/d*amount};const next=stepResonance(sim.state,{player:sim.player,progress,dashing:dash},.05);sim.state=next.state;signals.push(...next.signals);if(!sim.state.run)break;}return signals;}
function collect(sim,id,dash=false){const node=sim.route.nodes[id];return walk(sim,()=>resonanceNodePosition(sim.route,node,sim.state.run.elapsed),{dash});}

test('all authored motes, moving extrema, nests and gusts stay on available main islands',()=>{
 const game=createState();game.p1.solved=game.wind.solved=game.bridge.solved=true;
 for(const route of RESONANCE_ROUTES){assert.ok(supportAt(route.x,route.z,game));for(let t=0;t<route.duration;t+=.31){for(const node of route.nodes){const p=resonanceNodePosition(route,node,t);assert.ok(supportAt(p.x,p.z,game),`${route.id} node ${node.id}`);}for(const h of resonanceHazards(route,t))assert.ok(supportAt(h.x,h.z,game));}}
});
test('later nests respect actual main progression; distant E cannot start',()=>{
 const state=createResonanceState();assert.equal(attemptResonance(state,{x:3,z:-12},{}).ok,false);assert.equal(attemptResonance(state,{x:3,z:-42},progress).ok,true);assert.equal(attemptResonance(state,{x:0,z:0},progress).ok,false);assert.equal(state.run,null);
});
test('five silver motes make a bankable first route, but only returning and E earns the clear',()=>{
 const sim=start();for(const id of [0,1,2,3,4])collect(sim,id);assert.equal(sim.state.run.collected.length,5);assert.equal(sim.state.records.dawn.completions,0);
 assert.equal(attemptResonance(sim.state,sim.player,progress).ok,false);walk(sim,sim.route);const done=attemptResonance(sim.state,sim.player,progress);
 assert.equal(done.ok,true);assert.equal(done.state.run,null);assert.equal(done.signals[0].type,'complete');assert.equal(done.signals[0].first,true);assert.equal(done.state.records.dawn.completions,1);assert.ok(done.state.records.dawn.best>500);
 const restored=createResonanceState(serializeResonance(done.state));assert.deepEqual(restored.records,done.state.records);assert.equal(restored.run,null);assert.equal(restored.result,null);
});
test('golden drifting motes require a moving dash, grant energy, and cannot be farmed twice',()=>{
 const sim=start();collect(sim,5,false);assert.ok(!sim.state.run.collected.includes(5));let signals=[];
 signals.push(...walk(sim,{x:-2.8,z:4.2},{dash:true}));signals.push(...collect(sim,5,true));assert.ok(sim.state.run.collected.includes(5));const picked=signals.filter(s=>s.type==='collect'&&s.node===5);assert.equal(picked.length,1);assert.equal(picked[0].refill,.32);
 const score=sim.state.run.score;collect(sim,5,true);assert.equal(sim.state.run.score,score);
});
test('walking a full route gives a distinct complete-harmony reward and best survives a weaker replay',()=>{
 const sim=start();for(const id of [0,6,1,2,7,3,4,5])collect(sim,id,true);walk(sim,sim.route,{dash:true});const full=attemptResonance(sim.state,sim.player,progress);assert.equal(full.state.records.dawn.grade,3);assert.equal(full.state.records.dawn.most,8);
 const replay=start('dawn',serializeResonance(full.state));for(const id of [0,1,2,3,4])collect(replay,id);walk(replay,replay.route);const next=attemptResonance(replay.state,replay.player,progress);assert.equal(next.signals[0].first,false);assert.equal(next.state.records.dawn.completions,2);assert.equal(next.state.records.dawn.grade,3);assert.ok(next.state.records.dawn.best>=full.state.records.dawn.best);
});
test('standing still, pausing or discontinuous teleporting cannot silently harvest motes',()=>{
 const sim=start();const node=sim.route.nodes[0];sim.state.run.previous={x:node.x,z:node.z};sim.player={x:node.x,z:node.z};let next=stepResonance(sim.state,{player:sim.player,dashing:true},.05);assert.equal(next.state.run.collected.length,0);
 next=stepResonance(sim.state,{player:sim.player,interactive:false},.1);assert.equal(next.state.run.elapsed,0);assert.equal(next.state.run.previous,null);const resume=stepResonance(next.state,{player:sim.player,dashing:true},.05);assert.equal(resume.state.run.collected.length,0);
 sim.state.run.previous={x:-4,z:1};assert.equal(stepResonance(sim.state,{player:sim.player,dashing:true},.05).state.run.collected.length,0);
});
test('swept crossing catches a flower between two rendered positions',()=>{
 const sim=start();sim.state.run.previous={x:5.8,z:1.6};const next=stepResonance(sim.state,{player:{x:3.8,z:1.6}},.05);assert.ok(next.state.run.collected.includes(0));
});
test('gusts break a chain without deleting carried flowers; dashing protects the chain',()=>{
 const sim=start('crosswind');const hazard=resonanceHazards(sim.route,.05)[0];sim.state.run.combo=4;sim.state.run.collected=[0];sim.state.run.previous={x:hazard.x,z:hazard.z};
 const hit=stepResonance(sim.state,{player:hazard},.05);assert.equal(hit.state.run.combo,0);assert.deepEqual(hit.state.run.collected,[0]);assert.equal(hit.signals[0].type,'bump');
 const protectedRun=stepResonance(sim.state,{player:hazard,dashing:true},.05);assert.equal(protectedRun.state.run.combo,4);assert.equal(protectedRun.signals.some(s=>s.type==='bump'),false);
});
test('timeout and explicit cancellation preserve earned best and never clear the main game',()=>{
 const sim=start();const external=createState(),copy=JSON.stringify(external);sim.state.records.dawn={best:1200,completions:1,grade:2,most:6};sim.state.run.elapsed=74.98;
 const expired=stepResonance(sim.state,{player:sim.player,progress:external},.05);assert.equal(expired.signals[0].type,'timeout');assert.equal(expired.state.run,null);assert.equal(expired.state.records.dawn.best,1200);assert.equal(JSON.stringify(external),copy);
 const cancelled=cancelResonance(sim.state);assert.equal(cancelled.state.records.dawn.best,1200);assert.equal(cancelled.state.run,null);
});
test('invalid saves and paused transient routes do not manufacture completion',()=>{
 for(const raw of ['oops','null','[]',JSON.stringify({version:2,records:{dawn:{best:1000}}})])assert.equal(createResonanceState(raw).records.dawn.best,0);
 const restored=createResonanceState({version:1,records:{dawn:{best:100000,grade:99,completions:0,most:1000}},run:{id:'dawn',collected:[0,1,2,3,4]}});assert.equal(restored.records.dawn.grade,0);assert.equal(restored.records.dawn.best,0);assert.equal(restored.run,null);
});
test('only final-garden golden crowns have timing windows, and every window is at least 2.6 seconds',()=>{
 for(const route of RESONANCE_ROUTES)for(const node of route.nodes){let open=0;for(let i=0;i<4200;i++)if(resonanceNodeOpen(route,node,i*.001))open++;if(route.id==='homeward'&&node.kind==='swift'){assert.ok(open>=2600&&open<3000);}else assert.equal(open,4200);}
 const sim=start('homeward'),node=sim.route.nodes[5];
 for(const wanted of [false,true]){const t=Array.from({length:42},(_,i)=>i*.1).find(t=>(Math.sin((t+.05)*Math.PI*2/4.2+node.phase)>.85)===wanted&&(wanted||Math.sin((t+.05)*Math.PI*2/4.2+node.phase)<-.85));sim.state.run.elapsed=t;const p=resonanceNodePosition(sim.route,node,t+.05);sim.state.run.previous={x:p.x-.2,z:p.z};const next=stepResonance(sim.state,{player:{x:p.x+.2,z:p.z},dashing:true},.05);assert.equal(next.state.run.collected.includes(node.id),wanted);}
});
test('both later gardens support complete moving routes and return-to-nest resolution',()=>{
 for(const id of ['crosswind','homeward']){const sim=start(id);for(const node of sim.route.nodes){for(let retry=0;retry<8&&!sim.state.run.collected.includes(node.id);retry++){collect(sim,node.id,node.kind==='swift');if(!sim.state.run.collected.includes(node.id)){for(let i=0;i<40&&sim.state.run.escort?.near===false;i++)sim.state=stepResonance(sim.state,{player:sim.player},.05).state;const p=resonanceNodePosition(sim.route,node,sim.state.run.elapsed);walk(sim,{x:p.x*.78,z:sim.route.cz+(p.z-sim.route.cz)*.78});}}assert.ok(sim.state.run.collected.includes(node.id),`${id} ${node.id}`);}walk(sim,sim.route,{dash:true});const result=attemptResonance(sim.state,sim.player,progress);assert.equal(result.ok,true);assert.equal(result.state.records[id].grade,3);assert.equal(result.state.records[id].most,sim.route.nodes.length);}
});

test('crosswind silver waits for the escort, catches up gently, and requires a real shared crossing',()=>{
 const sim=start('crosswind'),signals=collect(sim,2,true);
 assert.equal(sim.state.run.collected.includes(2),false,'rushing ahead cannot collect a silver flower alone');
 assert.ok(signals.some(s=>s.type==='hint'&&s.reason==='escort'),'the refusal explains whom to wait for');
 assert.ok(sim.state.run.escort.distance>2);assert.equal(sim.state.run.escort.near,false);assert.match(resonanceContext(sim.state,sim.player,progress).hint,/游絮/);
 const earned=[...sim.state.run.collected];
 for(let i=0;i<60;i++)sim.state=stepResonance(sim.state,{player:sim.player},.05).state;
 assert.equal(sim.state.run.escort.near,true);assert.deepEqual(sim.state.run.collected,earned,'catching up while stationary never harvests or drops flowers');
 walk(sim,{x:1.2,z:sim.player.z});collect(sim,2);assert.ok(sim.state.run.collected.includes(2));
});

test('crosswind escort follows a normal walk, pauses with the player, and never mutates the prior state',()=>{
 const sim=start('crosswind');collect(sim,0);assert.ok(sim.state.run.collected.includes(0));assert.ok(sim.state.run.escort,'crosswind owns a living escort');assert.equal(sim.state.run.escort.near,true);
 const before=JSON.stringify(sim.state),paused=stepResonance(sim.state,{player:{x:sim.player.x-2,z:sim.player.z},interactive:false},.1);
 assert.equal(JSON.stringify(sim.state),before);assert.deepEqual(paused.state.run.escort,sim.state.run.escort);assert.equal(paused.state.run.elapsed,sim.state.run.elapsed);
 const next=stepResonance(sim.state,{player:{x:sim.player.x-.2,z:sim.player.z}},.05);
 assert.equal(JSON.stringify(sim.state),before);assert.notEqual(next.state.run.escort,sim.state.run.escort);
 assert.ok(Number.isFinite(next.state.run.escort.x)&&Number.isFinite(next.state.run.escort.z));
 assert.ok(supportAt(next.state.run.escort.x,next.state.run.escort.z,{p1:{solved:true},wind:{solved:true},bridge:{solved:true}}));
});

test('starting crosswind from the outer side of its nest still places the escort over walkable land',()=>{
 const player={x:3,z:-10.85},game={p1:{solved:true},wind:{solved:true},bridge:{solved:true}};assert.ok(supportAt(player.x,player.z,game));
 const result=attemptResonance(createResonanceState(),player,progress);assert.equal(result.ok,true);const e=result.state.run.escort;
 assert.ok(supportAt(e.x,e.z,game),'the visible companion cannot spawn over unsupported water');
});

test('crosswind gold can be pursued ahead of the escort and existing payload is never discarded',()=>{
 const sim=start('crosswind');collect(sim,0);const earned=[...sim.state.run.collected];collect(sim,7,true);
 assert.ok(sim.state.run.collected.includes(7));assert.ok(sim.state.run.escort,'gold pickup still has an independently moving escort');assert.equal(sim.state.run.escort.near,false);for(const id of earned)assert.ok(sim.state.run.collected.includes(id));
 assert.equal(createResonanceState(serializeResonance(sim.state)).run,null,'escort is transient, never revived from a save');
});

test('homeward silver asks for walking while gold still needs an open moving dash',()=>{
 const sim=start('homeward'),signals=collect(sim,0,true);assert.equal(sim.state.run.collected.includes(0),false);
 assert.ok(signals.some(s=>s.type==='hint'&&s.reason==='walking'));walk(sim,{x:3,z:-45.2});collect(sim,0);assert.ok(sim.state.run.collected.includes(0));
 collect(sim,5,false);assert.equal(sim.state.run.collected.includes(5),false);
 for(let i=0;i<8&&!sim.state.run.collected.includes(5);i++){walk(sim,{x:3,z:-47});collect(sim,5,true);}
 assert.ok(sim.state.run.collected.includes(5));assert.ok(sim.state.run.collected.includes(0));
});

test('world snapshots expose escort and each garden pickup rule without leaking mutable model state',()=>{
 const activity=createResonance();activity.update(0,0,{player:{x:3,z:-12},progress});activity.attempt();
 let s=activity.snapshot();assert.ok(s.escort,'escort is readable to a player-facing direction cue');assert.equal(s.escort.near,true);assert.equal(s.nodes[0].requiresEscort,true);assert.equal(s.nodes[0].available,true);s.escort.x=900;s.run.escort.x=900;assert.notEqual(activity.snapshot().escort.x,900);
 activity.cancel();activity.update(0,0,{player:{x:3,z:-42},progress});activity.attempt();activity.update(.05,.05,{player:{x:3.1,z:-42},progress,dashing:true});
 s=activity.snapshot();assert.equal(s.escort,null);assert.equal(s.nodes[0].requiresWalking,true);assert.equal(s.nodes[0].available,false);assert.equal(s.nodes[0].blockedReason,'walking');assert.equal(s.nodes[5].requiresDash,true);
 for(const o of activity.group.children)if(o.isInstancedMesh)for(let i=0;i<o.count*16;i++)assert.ok(Number.isFinite(o.instanceMatrix.array[i]));activity.dispose();
});
test('world view uses instancing, reports navigable targets, and releases each owned resource once',()=>{
 const activity=createResonance(),geometries=new Set(),materials=new Set(),textures=new Set();activity.group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material){materials.add(o.material);if(o.material.map)textures.add(o.material.map);}});
 let disposals=0;for(const resource of [...geometries,...materials,...textures])resource.addEventListener('dispose',()=>disposals++);
 activity.update(0,.016,{player:{x:3,z:4},progress});assert.equal(activity.context.atStart,true);assert.equal(activity.attempt().ok,true);activity.update(.1,.05,{player:{x:3.2,z:3.8},progress,dashing:true});const snap=activity.snapshot();assert.equal(snap.nodes.length,8);assert.equal(snap.stations.length,3);assert.equal(snap.active,true);assert.equal(snap.context.goal,5);
 for(const o of activity.group.children)if(o.isInstancedMesh){assert.ok(o.count>0);for(let i=0;i<o.count*16;i++)assert.ok(Number.isFinite(o.instanceMatrix.array[i]));}
 activity.cancel();assert.equal(activity.snapshot().active,false);activity.dispose();activity.dispose();assert.equal(disposals,geometries.size+materials.size+textures.size);assert.equal(activity.group.children.length,0);
});
