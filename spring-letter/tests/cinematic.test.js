import test from 'node:test';
import assert from 'node:assert/strict';
import {createCinematicLayer} from '../src/cinematic.js';

function layer(){const value=createCinematicLayer();assert.ok(value?.group?.isGroup,'cinematic layer must expose a Three scene group');return value;}
function freeze(value){if(value&&typeof value==='object'){Object.freeze(value);Object.values(value).forEach(freeze);}return value;}

test('visual updates never change gameplay state and invalid frame values remain finite',()=>{
 const c=layer(),state=freeze({player:{x:-5,z:-29},progress:3,night:true,reducedMotion:false,branches:{rhythm:false,light:false,memory:false},opening:0});
 try{for(let i=0;i<90;i++)c.update(i/30,1/30,state);c.update(NaN,Infinity,{...state,opening:NaN});c.group.traverse(o=>{assert.ok([...o.position.toArray(),...o.scale.toArray(),...o.quaternion.toArray()].every(Number.isFinite));if(o.geometry)for(const n of o.geometry.getAttribute('position').array)assert.ok(Number.isFinite(n));});assert.equal(state.branches.memory,false);}finally{c.dispose();}
});

test('each optional reward appears only for its completed branch and can restore a save',()=>{
 const c=layer();try{
  c.update(0,0,{branches:{}});assert.equal(c.group.getObjectByName('rhythm-third-cup').visible,false);assert.equal(c.group.getObjectByName('light-return-letter').visible,false);assert.equal(c.group.getObjectByName('memory-new-shoot').visible,false);
  c.update(10,.016,{branches:{rhythm:true,light:false,memory:false}});assert.equal(c.group.getObjectByName('rhythm-third-cup').visible,true);assert.equal(c.group.getObjectByName('light-return-letter').visible,false);
  c.update(20,.016,{branches:{rhythm:false,light:true,memory:true}});assert.equal(c.group.getObjectByName('rhythm-third-cup').visible,false);assert.equal(c.group.getObjectByName('light-return-letter').visible,true);assert.equal(c.group.getObjectByName('memory-new-shoot').visible,true);
 }finally{c.dispose();}
});

test('branch targets are finite and independent of visual animation; memory flower responds to comparison',()=>{
 const c=layer();try{
  const targets=structuredClone(c.branchTargets);assert.equal(targets.light.length,3);
  for(const point of [...targets.light,targets.rhythm,targets.memory])assert.ok([point.x,point.y,point.z].every(Number.isFinite));
  const petals=c.group.getObjectByName('memory-comparison-petals');
  c.update(0,0,{memoryBloom:0});const closed=Array.from(petals.instanceMatrix.array);
  c.update(1,.016,{memoryBloom:1,lightFound:[true,false,true],beatValue:1,beatPulse:1,opening:.5,lightSweep:{x:NaN,y:Infinity,z:0}});
  assert.notDeepEqual(Array.from(petals.instanceMatrix.array),closed);
  assert.deepEqual(c.branchTargets,targets);
  assert.deepEqual(c.group.getObjectByName('light-revealed-words').material.userData.found.toArray(),[1,0,1]);
 }finally{c.dispose();}
});

test('separate scenes own their mutable materials',()=>{
 const a=layer(),b=layer();try{const original=b.group.getObjectByName('branch-guide-lights').material.opacity;a.update(3,.1,{night:true,progress:4,branches:{rhythm:true}});assert.equal(b.group.getObjectByName('branch-guide-lights').material.opacity,original);const resources=new Set();a.group.traverse(o=>{if(o.material)resources.add(o.material);});b.group.traverse(o=>{if(o.material)assert.equal(resources.has(o.material),false);});}finally{a.dispose();b.dispose();}
});

test('owned geometries, materials and textures are released once despite repeated disposal',()=>{
 const c=layer(),resources=new Set();c.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of o.material?[o.material].flat():[]){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});let count=0;for(const r of resources)r.addEventListener('dispose',()=>count++);c.dispose();c.dispose();assert.equal(count,resources.size);assert.doesNotThrow(()=>c.update(1,.016,{}));
});
