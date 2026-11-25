import test from 'node:test';
import assert from 'node:assert/strict';
import {createVoyageWorld,createVoyagePetalGeometry} from '../src/voyage-world.js';
import {PerspectiveCamera,Vector3,Raycaster} from 'three';
import {BOAT_MOORING,JETTY,voyageGroundHeight} from '../src/voyage-model.js';

test('voyage world geometry stays finite through shore, tide, sailing and dawn',()=>{
 const world=createVoyageWorld();
 for(const stage of ['writing','tide','island','rigging','sailing','dawn','complete']){
  const view={stage,player:{x:0,z:-13},boat:{x:3,z:-80,heading:.2,speed:2},tide:.8,sail:1,ropes:[true,true],progress:.6,blooms:[{x:2,z:-60,kind:'lily',age:4},{x:-2,z:-59,kind:'iris',age:1}],quality:'balanced',sealed:true,predecessor:true};
  world.update(16,.016,view);
  for(const aspect of [.46,1.6,2.2])assert.ok([...world.camera(view,aspect).position,...world.camera(view,aspect).target].every(Number.isFinite));
  world.group.traverse(o=>{if(o.geometry){for(const value of o.geometry.attributes.position.array)assert.ok(Number.isFinite(value),o.name+' has nonfinite geometry');}assert.ok(o.matrix.elements.every(Number.isFinite));});
 }
 for(const id of ['seal','old-letter','rope-left','rope-right','halyard'])assert.ok(world.interactables.some(v=>v.id===id));
 const snap=world.snapshot();assert.ok(snap.flowerSpecies>=3);assert.ok(snap.meshes<220,'world must use batched vegetation');
 world.dispose();world.dispose();
});

test('only a completed departure moves the presentation boat and pulls the camera back',()=>{
 const world=createVoyageWorld(),base={stage:'dawn',boat:{x:2,z:-179,heading:.3,speed:0},player:{x:2,z:-179},tide:.5,progress:1,sail:1,departureAge:20};
 world.update(4,.016,base);assert.equal(world.snapshot().boat[2],-179);
 const started={...base,stage:'complete',departureAge:0},departed={...started,departureAge:20};
 world.update(4,.016,started);assert.equal(world.snapshot().boat[2],-179);
 const near=world.camera(started,1.6);world.update(24,.016,departed);assert.equal(world.snapshot().boat[2],-189);
 const far=world.camera(departed,1.6);assert.ok(far.position[1]>near.position[1]);
 world.update(100,.016,{...departed,departureAge:500});assert.equal(world.snapshot().boat[2],-199);
 assert.equal(base.boat.z,-179,'cinematic departure must not mutate earned navigation state');world.dispose();
});

test('seed choices give flower sea distinct restrained palettes without changing flower forms',()=>{
 const world=createVoyageWorld(),base={stage:'sailing',boat:{x:0,z:-80,heading:0,speed:2},player:{x:0,z:-80}};
 world.update(10,.016,{...base,purposes:['memory','season']});const one=world.snapshot();
 world.update(10,.016,{...base,purposes:['season','voyage']});const two=world.snapshot();
 assert.notDeepEqual(one.palette,two.palette);assert.equal(one.flowerSpecies,two.flowerSpecies);world.dispose();
});

test('dense mixed sea blooms keep the balanced geometry budget bounded',()=>{
 const world=createVoyageWorld();world.update(18,.016,{stage:'sailing',boat:{x:0,z:-100},quality:'balanced',blooms:Array.from({length:96},(_,i)=>({x:(i%7)-3,z:-100+(i%19),kind:['lily','lotus','iris'][i%3],age:8}))});
 const snapshot=world.snapshot();assert.ok(snapshot.triangles<1000000,JSON.stringify(snapshot));assert.ok(snapshot.flowers>60);world.dispose();
});

test('small sea petals use one smooth membrane without competing duplicate layers',()=>{
 const g=createVoyagePetalGeometry(.62,.16,.35,-.31),p=g.attributes.position,n=g.attributes.normal,{rows,columns,layers}=g.userData.surface;
 assert.equal(layers,1);assert.equal(p.count,(rows+1)*(columns+1));assert.equal(g.index.count,rows*columns*6);
 for(let i=0;i<n.count;i++){const normal=new Vector3().fromBufferAttribute(n,i);assert.ok(normal.length()>.99&&normal.length()<1.01,'all smooth normals, including collapsed tips, remain normalized');assert.ok(normal.y>0,'top membrane orientation is coherent');}
 g.dispose();
});

test('dawn and final pullback keep the sun visible above an upper-third horizon',()=>{
 const world=createVoyageWorld();for(const stage of ['dawn','complete'])for(const age of [0,20,60])for(const aspect of [.46,1.6,2.2]){
  const view={stage,departureAge:age,boat:{x:0,z:-179,heading:0,speed:0},progress:1},frame=world.camera(view,aspect),camera=new PerspectiveCamera(48,aspect,.1,1800);camera.position.fromArray(frame.position);camera.lookAt(new Vector3(...frame.target));camera.updateMatrixWorld(true);
  const z=stage==='complete'?-179-Math.min(20,age*.5):-179,sun=new Vector3(.05,.105,-1).normalize().multiplyScalar(1200).add(new Vector3(0,0,z)).project(camera),horizon=new Vector3(0,0,z-1200).project(camera);
  assert.ok(Math.abs(sun.x)<.9&&sun.y>.12&&sun.y<.85,JSON.stringify({stage,age,aspect,sun}));assert.ok(horizon.y>.15&&horizon.y<.60,JSON.stringify({stage,age,aspect,horizon}));
 }world.dispose();
});

test('moored boat floats outside island terrain at hull, deck and stern sample points',()=>{
 const world=createVoyageWorld();world.update(0,.016,{stage:'rigging',tide:.3,sail:.3});world.group.updateMatrixWorld(true);
 const boat=world.group.getObjectByName('cens-little-post-boat'),terrain=[];world.group.traverse(o=>{if(o.name==='rounded-salt-island'||o.name==='island-bank')terrain.push(o);});
 assert.ok(terrain.length>=2);const ray=new Raycaster();
 for(const [x,z]of [[0,0],[-.85,0],[.85,0],[0,2.4],[0,-2.75],[-.4,1.8],[.4,1.8]]){
  const p=new Vector3(x,0,z).applyMatrix4(boat.matrixWorld);ray.set(new Vector3(p.x,8,p.z),new Vector3(0,-1,0));const hit=ray.intersectObjects(terrain,false);assert.equal(hit.length,0,'island covers boat at '+JSON.stringify({x:p.x,z:p.z,hits:hit.map(h=>h.point.toArray())}));
 }
 assert.ok(Math.abs(world.snapshot().boat[0]-BOAT_MOORING.x)<.001);world.dispose();
});

test('jetty planks support the modeled island boarding route at one continuous height',()=>{
 const world=createVoyageWorld();world.group.updateMatrixWorld(true);const jetty=world.group.getObjectByName('island-jetty'),ray=new Raycaster(),z=(JETTY.minZ+JETTY.maxZ)/2;
 assert.ok(jetty);for(let i=0;i<10;i++){
  const x=JETTY.minX+(i+.5)*(JETTY.maxX-JETTY.minX)/10;ray.set(new Vector3(x,8,z),new Vector3(0,-1,0));const hits=ray.intersectObject(jetty,false);
  assert.ok(hits.length,'missing walking plank '+i);assert.ok(Math.abs(hits[0].point.y-(JETTY.height+.06))<.001);assert.equal(voyageGroundHeight({x,z}),JETTY.height);
 }world.dispose();
});
