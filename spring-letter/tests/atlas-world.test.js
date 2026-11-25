import test from 'node:test';
import assert from 'node:assert/strict';
import {Raycaster,Vector3,Matrix4} from 'three';
import {createAtlasWorld} from '../src/atlas-world.js';
import {ATLAS_LOCATIONS,CLOUD_ISLANDS,STAR_ROUTE} from '../src/atlas-content.js';
import {atlasGroundHeight} from '../src/atlas-model.js';

test('atlas switches independent environments and only animates the active location',()=>{
 const world=createAtlasWorld();assert.equal(world.group.visible,false);
 for(const place of ATLAS_LOCATIONS){
  world.setLocation(place.id);world.update(3,.016,{player:place.spawn});
  const snap=world.snapshot();assert.equal(snap.location,place.id);
  assert.deepEqual(snap.visibleLocations,[place.id]);assert.ok(snap.landmarks.length>=4);
  assert.ok(snap.meshes<155,JSON.stringify(snap));assert.ok(snap.triangles<360000,JSON.stringify(snap));
 }
 const old=world.group.getObjectByName('conservatory-butterflies');const before=old.position.clone();
 world.update(20,.016,{player:{x:8,y:1,z:-3},butterfly:{x:20,z:20,trust:1}});
 assert.ok(old.position.equals(before));world.dispose();
});

test('all authored positions, normals and transforms stay finite under malformed presentation input',()=>{
 const world=createAtlasWorld();
 for(const place of ATLAS_LOCATIONS){
  world.setLocation(place.id);
  for(const t of [0,10,Number.MAX_VALUE,NaN,Infinity])world.update(t,NaN,{player:{x:NaN,y:Infinity,z:undefined},butterfly:{x:NaN,z:Infinity,trust:NaN},blooms:[NaN,Infinity,-1],stars:[0,1,2],stargazing:true});
 }
 world.group.updateMatrixWorld(true);
 world.group.traverse(o=>{
  for(const key of ['position','normal'])if(o.geometry?.attributes[key])assert.ok(o.geometry.attributes[key].array.every(Number.isFinite),`${o.name} ${key}`);
  assert.ok(o.matrixWorld.elements.every(Number.isFinite),`${o.name} transform`);
  if(o.isInstancedMesh)assert.ok(o.instanceMatrix.array.every(Number.isFinite),`${o.name} instance`);
 });world.dispose();
});

test('cloud islands have real flat land at shared elevations and no terrain fills the gaps',()=>{
 const world=createAtlasWorld();world.setLocation('meadow');world.group.updateMatrixWorld(true);
 const ground=[];world.group.traverse(o=>{if(o.userData.atlasWalkSurface)ground.push(o);});
 const ray=new Raycaster();
 for(const island of CLOUD_ISLANDS){
  ray.set(new Vector3(island.x,20,island.z),new Vector3(0,-1,0));
  const hits=ray.intersectObjects(ground,false).filter(h=>h.object.userData.location==='meadow');
  assert.ok(hits.length,`island ${island.id} has no visible support`);assert.ok(Math.abs(hits[0].point.y-island.height)<.002);
 }
 for(const [x,z] of [[6,1],[-5,-5],[4,-18],[4,-30]]){
  assert.ok(!CLOUD_ISLANDS.some(i=>((x-i.x)/i.rx)**2+((z-i.z)/i.rz)**2<=1),'gap fixture is on an island');
  ray.set(new Vector3(x,20,z),new Vector3(0,-1,0));
  assert.equal(ray.intersectObjects(ground,false).filter(h=>h.object.userData.location==='meadow').length,0);
 }world.dispose();
});

test('star path reflects actual traced nodes and world updates do not accumulate objects',()=>{
 const world=createAtlasWorld();world.setLocation('observatory');
 world.update(0,.016,{player:{x:0,y:0,z:-18},stars:[0,1,2],stargazing:true});
 assert.equal(world.snapshot().tracedSegments,2);const before=world.snapshot().objects;
 for(let i=0;i<60;i++)world.update(i,.016,{stars:STAR_ROUTE,stargazing:true,player:{x:0,y:0,z:-18}});
 assert.equal(world.snapshot().tracedSegments,STAR_ROUTE.length-1);assert.equal(world.snapshot().objects,before);world.dispose();
});

test('visible walking surfaces match the greenhouse floor and observatory rise',()=>{
 const world=createAtlasWorld();world.group.updateMatrixWorld(true);const ray=new Raycaster();
 for(const [id,samples]of [['conservatory',[[0,10,0],[-15,-20,0],[16,14,0]]],['observatory',[[0,10,0],[0,-14,.9],[0,-18,1.8],[14,-24,1.8]]]]){
  const surfaces=[];world.group.getObjectByName(`atlas-${id}`).traverse(o=>{if(o.userData.atlasWalkSurface)surfaces.push(o);});
  for(const [x,z,height]of samples){ray.set(new Vector3(x,20,z),new Vector3(0,-1,0));const hits=ray.intersectObjects(surfaces,false);assert.ok(hits.length,`${id} missing support at ${x},${z}`);assert.ok(Math.abs(hits[0].point.y-height)<.002);}
 }world.dispose();
});

test('large entrance masonry and fallen columns leave the central walking corridor clear',()=>{
 const world=createAtlasWorld();world.group.updateMatrixWorld(true);const ray=new Raycaster();
 for(const [id,name]of [['observatory','observatory-broken-horseshoe-colonnade'],['conservatory','conservatory-entrance-portal']]){
  for(let z=13;z>=-25;z-=.5)for(const x of [-2,0,2]){
   ray.set(new Vector3(x,18,z),new Vector3(0,-1,0));const ground=atlasGroundHeight(id,x,z);
   assert.ok(!ray.intersectObject(world.group.getObjectByName(name),true).some(hit=>hit.point.y>ground+.35),`${id} blocks the corridor at ${x},${z}`);
  }
 }world.dispose();
});

test('the courier opens a physical parasol only during cloud-island gliding',()=>{
 const world=createAtlasWorld();world.setLocation('meadow');world.update(1,.016,{player:{x:5,y:3,z:0,gliding:true}});assert.equal(world.snapshot().parasol,true);
 const parasol=world.group.getObjectByName('atlas-open-flower-parasol');assert.equal(parasol.position.y,4.85);assert.ok(parasol.children.some(o=>o.name==='atlas-eight-lobed-parasol-canopy'));
 world.update(2,.016,{player:{x:5,y:0,z:0,gliding:false}});assert.equal(world.snapshot().parasol,false);world.dispose();
});

test('light density lowers geometry while retaining living flowers on every cloud island',()=>{
 const world=createAtlasWorld();world.setLocation('meadow');world.update(1,.016,{settings:{quality:'balanced'}});const full=world.snapshot().triangles;
 world.update(1,.016,{settings:{quality:'light'}});assert.ok(world.snapshot().triangles<full*.75);
 const flowers=world.group.getObjectByName('meadow-coral-cups-petals'),matrix=new Matrix4(),seen=new Set();
 for(let i=0;i<flowers.count;i++){flowers.getMatrixAt(i,matrix);const p=new Vector3().setFromMatrixPosition(matrix);const island=CLOUD_ISLANDS.find(island=>((p.x-island.x)/island.rx)**2+((p.z-island.z)/island.rz)**2<=1);if(island)seen.add(island.id);}
 assert.equal(seen.size,5);world.update(2,.016,{settings:{quality:'balanced'}});assert.equal(world.snapshot().triangles,full);world.dispose();
});

test('atlas releases owned geometry, materials, textures and lights exactly once',()=>{
 const world=createAtlasWorld(),resources=new Set();
 world.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});
 const calls=new Map();for(const resource of resources)resource.addEventListener('dispose',()=>calls.set(resource,(calls.get(resource)||0)+1));
 world.dispose();world.dispose();for(const resource of resources)assert.equal(calls.get(resource),1,resource.name||resource.type);
 assert.equal(world.group.children.length,0);
});
