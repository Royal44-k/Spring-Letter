import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWindState,restoreWindState,windCommand,stepWindFlight,windField,WIND_GATES,WIND_LIMITS,createWindMoment} from '../src/moment-wind.js';

function fly(state,seconds,input){const events=[];for(let i=0;i<Math.round(seconds*60);i++){const result=stepWindFlight(state,1/60,typeof input==='function'?input(state):input);state=result.state;events.push(...result.events);}return {state,events};}
function pointRay(point){const origin=new THREE.Vector3(12,8,-4),target=new THREE.Vector3(...point);return new THREE.Raycaster(origin,target.sub(origin).normalize());}

test('paper wing requires an intentional launch; no wall timer or zero-delta advancement',()=>{
 const state=createWindState();assert.deepEqual(fly(state,20,{}).state,state);
 const flying=windCommand(state,'launch');assert.equal(state.launched,false);assert.equal(flying.launched,true);
 assert.deepEqual(stepWindFlight(flying,0,{x:1}).state,flying);assert.deepEqual(stepWindFlight(flying,NaN,{x:1}).state,flying);
 assert.ok(stepWindFlight(flying,400,{}).state.distance<=WIND_LIMITS.speed*.05);
});

test('five differently shaped/located gates require spatial steering, not elapsed time',()=>{
 const idle=fly(windCommand(createWindState(),'launch'),70,{});
 assert.equal(idle.state.completed,false);assert.ok(idle.state.misses>0);assert.equal(idle.state.gate,0);
 const flown=fly(windCommand(createWindState(),'launch'),40,state=>({target:WIND_GATES[state.gate]||WIND_GATES.at(-1)}));
 assert.equal(flown.state.completed,true);assert.equal(flown.state.gate,5);assert.equal(flown.state.misses,0);assert.equal(flown.state.launched,false);
 assert.deepEqual(flown.events.filter(e=>e.type==='gate').map(e=>e.id),WIND_GATES.map(g=>g.id));assert.equal(flown.events.filter(e=>e.type==='finish').length,1);
 assert.deepEqual(fly(flown.state,10,{x:1,y:1}).state,flown.state);
});

test('missing an elevated gate restores the earned safe point without deleting earlier gates',()=>{
 let state=windCommand(createWindState(),'launch');state=fly(state,5.5,{target:WIND_GATES[0]}).state;
 assert.equal(state.gate,1);const failed=fly(state,7.5,{target:{x:-2.6,y:.56}});
 assert.ok(failed.events.some(e=>e.type==='miss'));assert.equal(failed.state.gate,1);assert.equal(failed.state.checkpoint,1);assert.equal(failed.state.completed,false);assert.ok(failed.state.distance>=13&&failed.state.distance<20);
 const landed=windCommand(failed.state,'land');assert.equal(landed.launched,false);assert.equal(landed.distance,13);assert.equal(landed.x,WIND_GATES[0].x);assert.equal(landed.y,WIND_GATES[0].y);
});

test('diamond corner misses even when it fits an ellipse; braking changes travel rather than scores',()=>{
 const start={...windCommand(createWindState(),'launch'),gate:2,checkpoint:2,distance:42.99,x:WIND_GATES[2].x+.68*WIND_GATES[2].rx,y:WIND_GATES[2].y+.68*WIND_GATES[2].ry};
 assert.ok(stepWindFlight(start,.02,{}).events.some(e=>e.type==='miss'));
 const normal=fly(windCommand(createWindState(),'launch'),2,{}).state,braked=fly(windCommand(createWindState(),'launch'),2,{brake:true}).state;
 assert.ok(Math.abs(braked.distance/normal.distance-.3)<1e-8);assert.equal(braked.misses,0);
 assert.ok(windField(22,1,.8).y>0);assert.equal(windField(22,1,-2.5).y,0);assert.ok(windField(38,1,0).x>0);assert.ok(windField(55,1,0).x<0);
});

test('restore keeps bounded earned progress and deliberately clears held motion',()=>{
 const first=fly(windCommand(createWindState(),'launch'),9,{target:WIND_GATES[0]}).state;
 const restored=restoreWindState({...first,vx:Infinity,vy:NaN,launched:true});assert.equal(restored.gate,1);assert.equal(restored.launched,false);assert.equal(restored.vx,0);assert.equal(restored.vy,0);assert.ok(Number.isFinite(restored.x));
 assert.deepEqual(restoreWindState({version:2,gate:5,completed:true}),createWindState());
 const invalid=restoreWindState({version:1,gate:5,completed:false,distance:999,x:Infinity,y:NaN});assert.equal(invalid.completed,false);assert.equal(invalid.gate,4);assert.ok(invalid.distance<72);
 const complete=fly(windCommand(createWindState(),'launch'),40,state=>({target:WIND_GATES[state.gate]||WIND_GATES.at(-1)})).state;
 assert.equal(restoreWindState(complete).completed,true);assert.equal(restoreWindState(complete).launched,false);
});

test('world ray drag uses the translated local flight plane and release/cancel relinquish input',()=>{
 const moment=createWindMoment();moment.group.position.set(12,2.8,-16);moment.update(0,0,{active:true});moment.action('launch');
 const from=moment.snapshot().flight.world;assert.equal(moment.pointer('down',pointRay(from),{pointerId:7,button:0}),true);
 assert.equal(moment.pointer('down',pointRay(from),{pointerId:8,button:0}),false,'a second finger cannot steal the active drag');
 const to=[from[0]+1,from[1]+.7,from[2]];assert.equal(moment.pointer('move',pointRay(to),{pointerId:8}),false);assert.equal(moment.pointer('move',pointRay(to),{pointerId:7}),true);
 for(let i=0;i<60;i++)moment.update(i/60,1/60,{active:true});assert.ok(moment.snapshot().flight.x>.75);assert.ok(moment.snapshot().flight.y>2.1);
 assert.equal(moment.pointer('up',pointRay(to),{pointerId:7}),true);assert.equal(moment.snapshot().input.dragging,false);
 moment.key({code:'KeyD',type:'keydown'});moment.pointer('cancel',null,{});assert.deepEqual(moment.snapshot().input.held,[]);assert.equal(moment.snapshot().flight.launched,false);
 moment.dispose();
});

test('keyboard release, touch button pulses and inactive state never retain flight input',()=>{
 const moment=createWindMoment();moment.update(0,0,{active:true});moment.key({type:'keydown',code:'Enter'});moment.key({type:'keydown',code:'KeyA'});
 for(let i=0;i<20;i++)moment.update(i/60,1/60,{active:true});assert.ok(moment.snapshot().flight.x<-.1);
 moment.key({type:'keyup',code:'KeyA'});assert.deepEqual(moment.snapshot().input.held,[]);
 const button={matches:selector=>selector.split(',').includes('button')};assert.equal(moment.key({type:'keydown',code:'KeyD',target:button}),true,'steering works after keyboard activation of the launch button');assert.equal(moment.key({type:'keydown',code:'Space',target:button}),false,'native button activation keeps Space');
 moment.key({type:'keyup',code:'KeyD',target:{matches:()=>true}});assert.deepEqual(moment.snapshot().input.held,[],'keyup clears ownership even after focus moves');
 moment.action('brake');assert.equal(moment.snapshot().input.brake,true);moment.update(1,.02,{active:false});assert.equal(moment.snapshot().flight.launched,false);assert.equal(moment.snapshot().input.brake,false);
 const distance=moment.snapshot().flight.distance;for(let i=0;i<60;i++)moment.update(i,.02,{active:false});assert.equal(moment.snapshot().flight.distance,distance);
 moment.update(2,0,{active:true});moment.action('launch');moment.action('right');for(let i=0;i<20;i++)moment.update(i/60,1/60,{active:true});assert.ok(moment.snapshot().flight.x>-.2);
 moment.dispose();
});

test('the 3D experience owns bounded resources, finite geometry and idempotent cleanup',()=>{
 const moment=createWindMoment();let triangles=0;const seen=new Set(),disposals=new Map();moment.group.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);if(o.isInstancedMesh)seen.add(o);if(o.geometry)seen.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){seen.add(m);for(const key of ['map','bumpMap'])if(m[key])seen.add(m[key]);}});
 assert.ok(triangles>1000&&triangles<5000,`rendered triangles ${triangles}`);
 assert.ok(moment.snapshot().resources.meshCount<=36,'clouds, ornamental petals and harbour objects are batched instead of adding dozens of draw calls');
 for(const r of seen)r.addEventListener('dispose',()=>disposals.set(r,(disposals.get(r)||0)+1));
 const resources=moment.snapshot().resources;for(let i=0;i<600;i++)moment.update(i/60,1/60,{active:true,reducedMotion:i%2===0});assert.deepEqual(moment.snapshot().resources,resources);
 moment.group.traverse(o=>{for(const v of o.geometry?.attributes.position?.array||[])assert.ok(Number.isFinite(v));});
 moment.restore({version:1,x:NaN,y:Infinity});assert.equal(moment.snapshot().ready,false);assert.ok(moment.snapshot().controls.some(c=>c.id==='launch'));
 moment.dispose();moment.dispose();for(const r of seen)assert.equal(disposals.get(r),1);assert.equal(moment.group.children.length,0);
});

test('paper, scenery parallax and gate response remain visual only and preserve the same flight decisions',()=>{
 const a=createWindMoment(),b=createWindMoment(),palette={high:'#bc548a',low:'#234b64',accent:'#dfa669'};
 assert.equal(a.group.getObjectByName('wind-horizon').visible,false,'the immersive horizon cannot become a huge wall during outdoor roaming');
 for(const m of [a,b]){m.update(0,0,{active:true});m.action('launch');m.action('left');}
 assert.equal(a.group.getObjectByName('wind-horizon').visible,true);
 const clouds=a.group.getObjectByName('wind-cloud-banks'),matrix=new THREE.Matrix4();clouds.getMatrixAt(0,matrix);const initialZ=matrix.elements[14],initialGateZ=a.group.getObjectByName('wind-gate-petal').position.z;
 for(let i=0;i<60;i++){a.update(i/60,1/60,{active:true,palette});b.update(i/60,1/60,{active:true,reducedMotion:true,palette:{high:'#557fa7',low:'#2f634a',accent:'#f0c083'}});}
 assert.deepEqual(a.snapshot().draft,b.snapshot().draft,'palette and reduced motion cannot change collision or checkpoint progress');clouds.getMatrixAt(0,matrix);const cloudTravel=matrix.elements[14]-initialZ,gateTravel=a.group.getObjectByName('wind-gate-petal').position.z-initialGateZ;assert.ok(cloudTravel>0&&cloudTravel<gateTravel,'the distant cloud bank moves more slowly than the nearby gate');
 const wing=a.group.getObjectByName('paper-wing');assert.ok(wing.rotation.x>0,'the paper presents its folded upper face to the forward camera');assert.equal(wing.children.find(x=>x.isMesh).material.map.image.width,64);
 a.restore({...createWindState(),distance:11.99,x:WIND_GATES[0].x,y:WIND_GATES[0].y});a.update(0,0,{active:true});a.action('launch');for(let i=0;i<3;i++)a.update(i*.02,.02,{active:true});assert.equal(a.snapshot().flight.gate,1);assert.equal(a.group.getObjectByName('wind-gate-response').visible,true);
 for(let i=0;i<100;i++)a.update(i/60,1/60,{active:true});assert.equal(a.group.getObjectByName('wind-gate-response').visible,false);assert.equal(a.snapshot().flight.gate,1,'a fading visual response cannot grant another gate');
 for(const m of [a,b]){m.group.traverse(o=>{if(o.instanceMatrix)for(const v of o.instanceMatrix.array)assert.ok(Number.isFinite(v));});m.dispose();}
});

test('only a committed reply reveals either a lit harbour or a real protective sail, without changing the flight draft',()=>{
 const moment=createWindMoment(),before=moment.snapshot().draft,resources=moment.snapshot().resources;
 moment.update(0,.02,{active:true,choice:'lamp',completed:true});assert.deepEqual(moment.snapshot().draft,before);assert.equal(moment.snapshot().presentation.choice,null,'an old choice cannot bypass the current flight');
 const finished=fly(windCommand(createWindState(),'launch'),40,state=>({target:WIND_GATES[state.gate]||WIND_GATES.at(-1)})).state;moment.restore(finished);const frozen=moment.snapshot().draft;
 moment.update(0,.02,{active:true,choice:'lamp',completed:false});assert.equal(moment.snapshot().presentation.harbourVisible,false,'finishing alone does not choose a destination');
 moment.update(0,.02,{active:true,choice:'lamp',completed:true});assert.deepEqual(moment.snapshot().presentation,{choice:'lamp',harbourVisible:true,lampVisible:true,sailVisible:false});
 const lamps=moment.group.getObjectByName('wind-reply-lamp'),sail=moment.group.getObjectByName('wind-reply-sail');assert.ok(lamps.children.some(o=>o.isInstancedMesh&&o.material?.isMeshBasicMaterial),'the lamp reply includes actual lit lanterns');
 moment.update(.02,.02,{active:true,choice:'sail',completed:true});const canopy=moment.group.getObjectByName('wind-protective-sail'),start=canopy.scale.x;assert.equal(sail.visible,true);assert.equal(lamps.visible,false);
 for(let i=0;i<60;i++)moment.update(i/60,1/60,{active:true,choice:'sail',completed:true});assert.ok(canopy.scale.x>start);assert.equal(canopy.scale.x,1,'the seed-protecting canopy fully unfolds');
 assert.deepEqual(moment.snapshot().draft,frozen);assert.deepEqual(moment.snapshot().resources,resources);
 moment.update(2,0,{active:false,choice:'invalid',completed:true});assert.equal(moment.snapshot().presentation.harbourVisible,false);moment.dispose();
});
