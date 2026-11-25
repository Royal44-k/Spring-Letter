import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWorld} from '../src/world.js';
import {createLandscape} from '../src/landscape.js';
import {createGardenAtmosphere,loadGardenSurfaces} from '../src/atmosphere-garden.js';

test('garden sky owns one background draw and releases its resources exactly once',()=>{
 const sky=createGardenAtmosphere(),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera();scene.add(sky.object);
 camera.position.set(3,2,-19);sky.update(10,camera,.4,.1);assert.deepEqual(sky.object.position.toArray(),[3,2,-19]);
 let geometry=0,material=0;sky.object.geometry.addEventListener('dispose',()=>geometry++);sky.object.material.addEventListener('dispose',()=>material++);
 sky.dispose();sky.dispose();camera.position.x=99;sky.update(20,camera);
 assert.equal(geometry,1);assert.equal(material,1);assert.equal(sky.object.parent,null);assert.equal(sky.object.position.x,3);
});

test('CC0 surfaces change shading, not world topology, navigation or existing shared maps',async()=>{
 const world=createWorld(),landscape=createLandscape(),textures=[];
 const loader={loadAsync:async()=>{const t=new THREE.Texture();textures.push(t);return t;}};
 const before=[];world.group.traverse(o=>before.push([o,o.position.toArray(),o.geometry]));
 const targets=structuredClone(world.targets),support=landscape.supportAt(-12,-1);
 const previous=new Map();world.group.traverse(o=>{if(o.material&&!Array.isArray(o.material))previous.set(o.material,{hook:o.material.onBeforeCompile,key:o.material.customProgramCacheKey,normal:o.material.normalMap});});
 const controller=await loadGardenSurfaces({world,landscape,loader,renderer:{capabilities:{getMaxAnisotropy:()=>16}}});
 assert.ok(controller.applied>=6);assert.equal(textures.length,4);
 assert.equal(textures[0].colorSpace,THREE.SRGBColorSpace);assert.equal(textures[2].colorSpace,THREE.NoColorSpace);
 assert.ok(textures.every(t=>t.anisotropy===8));
 for(const [o,position,geometry] of before){assert.deepEqual(o.position.toArray(),position);assert.equal(o.geometry,geometry);}
 assert.deepEqual(world.targets,targets);assert.deepEqual(landscape.supportAt(-12,-1),support);
 const counts=new Map();textures.forEach(t=>t.addEventListener('dispose',()=>counts.set(t,(counts.get(t)||0)+1)));
 controller.dispose();controller.dispose();assert.equal(controller.snapshot().loaded,false);
 for(const [m,p] of previous){assert.equal(m.onBeforeCompile,p.hook);assert.equal(m.customProgramCacheKey,p.key);assert.equal(m.normalMap,p.normal);}
 assert.equal(counts.size,4);assert.ok([...counts.values()].every(n=>n===1));world.dispose();landscape.dispose();
});

test('partial texture failure disposes all successful loads without installing material hooks',async()=>{
 const material=new THREE.MeshStandardMaterial();material.name='garden-earth';const oldHook=material.onBeforeCompile;
 const group=new THREE.Group();group.add(new THREE.Mesh(new THREE.PlaneGeometry(),material));const loaded=[];
 const loader={loadAsync:async url=>{if(url.includes('normal'))throw Error('network unavailable');const t=new THREE.Texture();t.userData.disposals=0;t.addEventListener('dispose',()=>t.userData.disposals++);loaded.push(t);return t;}};
 await assert.rejects(loadGardenSurfaces({world:{group},loader}),/did not load/);
 assert.equal(material.onBeforeCompile,oldHook);assert.equal(loaded.length,3);assert.ok(loaded.every(t=>t.userData.disposals===1));
 group.children[0].geometry.dispose();material.dispose();
});

test('new opening meadow leaves the hero, starting route and cup-table interaction clear',()=>{
 const world=createWorld(),matrix=new THREE.Matrix4(),position=new THREE.Vector3();
 try{
  for(const name of ['opening-meadow-grass','opening-wild-grass','opening-shore-stones','opening-meadow-stems']){
   const roots=world.group.getObjectByName(name);assert.ok(roots?.isInstancedMesh);
   for(let i=0;i<roots.count;i++){
    roots.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);
    assert.ok(Math.hypot(position.x,position.z)<6.651);
    for(const [x,z,r] of [[0,0,4.7],[0,6,2.2],[-3.7,4.5,1.2],[-5,1,1.15]])assert.ok(Math.hypot(position.x-x,position.z-z)>r,`${name} must keep the approach clear`);
   }
  }
 }finally{world.dispose();}
});

test('light quality preserves all meadow clumps and restores detail without reallocating geometry',()=>{
 const world=createWorld(),matrix=new THREE.Matrix4(),position=new THREE.Vector3();
 try{
  const grass=world.group.getObjectByName('opening-meadow-grass'),geometry=grass.geometry;
  const hearts=world.group.getObjectByName('opening-meadow-hearts');
  world.update(1,.016,{settings:{quality:'light',reducedMotion:true}});
  assert.equal(grass.count,96);assert.equal(hearts.visible,false);
  const represented=new Set(),clumps=[[5.8,1.7],[4.6,-4.4],[-4.4,-4.7],[-5.5,3.4]];
  for(let i=0;i<grass.count;i++){
   grass.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);
   clumps.forEach(([x,z],j)=>{if(Math.hypot(position.x-x,position.z-z)<.8)represented.add(j);});
  }
  assert.equal(represented.size,4);
  world.update(2,.016,{settings:{quality:'delicate'}});
  assert.equal(grass.count,192);assert.equal(hearts.visible,true);assert.equal(grass.geometry,geometry);
 }finally{world.dispose();}
});
