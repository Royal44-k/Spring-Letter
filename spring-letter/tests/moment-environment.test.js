import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createMomentEnvironment} from '../src/moment-environment.js';

const inventory=group=>{
 const geometries=new Set(),materials=new Set(),instances=new Set(),arrays=new Set();let draws=0;
 group.traverse(object=>{
  if(object.geometry){geometries.add(object.geometry);for(const attribute of Object.values(object.geometry.attributes))arrays.add(attribute.array);if(object.geometry.index)arrays.add(object.geometry.index.array);}
  if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);draws+=object.material.transparent&&object.material.side===THREE.DoubleSide&&!object.material.forceSinglePass?2:1;}
  if(object.isInstancedMesh){instances.add(object);arrays.add(object.instanceMatrix.array);if(object.instanceColor)arrays.add(object.instanceColor.array);}
 });return {geometries,materials,instances,arrays,draws};
};
function assertClear(group,box){
 group.updateWorldMatrix(true,true);const instance=new THREE.Matrix4(),transform=new THREE.Matrix4(),triangle=new THREE.Triangle();
 group.traverse(object=>{
  if(!object.isMesh)return;const geometry=object.geometry,position=geometry.attributes.position,index=geometry.index,count=index?index.count:position.count;
  for(let item=0;item<(object.isInstancedMesh?object.count:1);item++){
   if(object.isInstancedMesh){object.getMatrixAt(item,instance);transform.multiplyMatrices(object.matrixWorld,instance);}else transform.copy(object.matrixWorld);
   for(let i=0;i<count;i+=3){
    triangle.a.fromBufferAttribute(position,index?index.getX(i):i).applyMatrix4(transform);
    triangle.b.fromBufferAttribute(position,index?index.getX(i+1):i+1).applyMatrix4(transform);
    triangle.c.fromBufferAttribute(position,index?index.getX(i+2):i+2).applyMatrix4(transform);
    assert.equal(box.intersectsTriangle(triangle),false,object.name+' instance '+item+' intrudes into the interaction volume');
   }
  }
 });
}

for(const id of ['rain','tide'])test(id+' environment appears only during focus and stays outside framing and picking APIs',()=>{
 const environment=createMomentEnvironment(id);try{
  assert.deepEqual(environment.group.position.toArray(),[0,0,0]);assert.equal(environment.group.visible,false);
  assert.equal(environment.bounds,undefined);assert.equal(environment.cameraOffset,undefined);assert.equal(environment.pointer,undefined);assert.equal(environment.action,undefined);
  environment.update(4,.016,{active:true});assert.equal(environment.group.visible,true);
  const state=inventory(environment.group);assert.ok(state.draws<=15,id+' uses '+state.draws+' draw passes');assert.ok(state.instances.size>=3);
  const ray=new THREE.Raycaster(new THREE.Vector3(0,4,7),new THREE.Vector3(0,-.35,-1).normalize());assert.deepEqual(ray.intersectObject(environment.group,true),[],'environment cannot capture input intended for the stage');
  const before=[...state.materials].filter(material=>material.uniforms?.uTime).map(material=>material.uniforms.uTime.value);
  environment.update(100,.1,{active:false});assert.equal(environment.group.visible,false);
  assert.deepEqual([...state.materials].filter(material=>material.uniforms?.uTime).map(material=>material.uniforms.uTime.value),before,'hidden scenery has no animation work');
 }finally{environment.dispose();}
});

test('greenhouse ground extends past the optical stage while every triangle leaves the flower sheets clear',()=>{
 const environment=createMomentEnvironment('rain');try{
  const floor=environment.group.getObjectByName('environment-wooden-floor');assert.ok(floor.isInstancedMesh);floor.computeBoundingBox();
  assert.ok(floor.boundingBox.min.z<-25&&floor.boundingBox.max.z>7);assert.ok(floor.boundingBox.min.x<-10&&floor.boundingBox.max.x>10);assert.ok(floor.boundingBox.max.y<-.3);
  assert.ok(environment.group.getObjectByName('environment-greenhouse-frame'));assert.ok(environment.group.getObjectByName('environment-copper-lanterns'));
  const shader={vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};floor.material.onBeforeCompile(shader);
  assert.ok(shader.vertexShader.includes('vGardenPosition=gardenPosition.xyz;'));assert.ok(shader.fragmentShader.includes('float grain='));
  const clear=new THREE.Box3(new THREE.Vector3(-2.5,.4,-.8),new THREE.Vector3(2.5,3.5,1.2));
  for(const time of [0,4,12]){environment.update(time,.05,{active:true});assertClear(environment.group,clear);}
 }finally{environment.dispose();}
});

test('water garden surrounds the sound stage at a lower level with no instrument obstruction',()=>{
 const environment=createMomentEnvironment('tide');try{
  const water=environment.group.getObjectByName('environment-water-garden');assert.equal(water.position.y,-.24);assert.ok(water.material.isShaderMaterial);assert.equal(water.geometry.type,'CircleGeometry');
  assert.ok(water.geometry.parameters.radius>=30);assert.ok(environment.group.getObjectByName('environment-lotus-leaves').count>=20);
  const clear=new THREE.Box3(new THREE.Vector3(-3.7,.26,-1.8),new THREE.Vector3(3.7,3.3,.8));
  for(const time of [0,8,22]){environment.update(time,.05,{active:true});assertClear(environment.group,clear);}
  const background=environment.group.getObjectByName('environment-distant-atmosphere');assert.equal(background.material.transparent,true);assert.equal(background.material.depthWrite,false);
  const positions=background.geometry.attributes.position;const depths=new Set(Array.from({length:positions.count},(_,index)=>positions.getZ(index).toFixed(2)));assert.ok(depths.size>10,'distant atmosphere is curved, not a rectangular board');
 }finally{environment.dispose();}
});

for(const id of ['rain','tide'])test(id+' animation and palette changes retain fixed resources and reduced motion is stationary',()=>{
 const environment=createMomentEnvironment(id);try{
  const before=inventory(environment.group);
  for(let i=0;i<600;i++)environment.update(i*.016,.016,{active:true,palette:i%2?['#d7b8cc']:{accent:'#9bc7cd'}});
  assert.deepEqual(inventory(environment.group),before);
  environment.update(1,.05,{active:true,reducedMotion:true});const matrices=[...before.instances].map(instance=>Array.from(instance.instanceMatrix.array));
  environment.update(40,.05,{active:true,reducedMotion:true});assert.deepEqual([...before.instances].map(instance=>Array.from(instance.instanceMatrix.array)),matrices);
  for(const material of before.materials)if(material.uniforms?.uTime)assert.equal(material.uniforms.uTime.value,0);
  environment.update(NaN,Infinity,{active:true,palette:{accent:'#not-a-color'}});
  for(const array of before.arrays)assert.ok(array.every(Number.isFinite));
  for(const material of before.materials)if(material.uniforms?.uTime)assert.ok(Number.isFinite(material.uniforms.uTime.value));
 }finally{environment.dispose();}
});

test('independent environments never share mutable GPU resources or modify a supplied palette',()=>{
 const a=createMomentEnvironment('tide'),b=createMomentEnvironment('tide');try{
  const first=inventory(a.group),second=inventory(b.group);for(const item of first.geometries)assert.equal(second.geometries.has(item),false);for(const item of first.materials)assert.equal(second.materials.has(item),false);
  const palette={accent:new THREE.Color('#dfa6b7')},original=palette.accent.clone();a.update(2,.016,{active:true,palette});assert.deepEqual(palette.accent,original);
  const aWater=a.group.getObjectByName('environment-water-garden'),bWater=b.group.getObjectByName('environment-water-garden');assert.notDeepEqual(aWater.material.uniforms.uAccent.value,bWater.material.uniforms.uAccent.value);
  a.dispose();b.update(6,.016,{active:true});assert.equal(b.group.visible,true);assert.ok(b.group.children.length>0);
 }finally{a.dispose();b.dispose();}
});

test('all retained geometry, material and instancing buffers are disposed exactly once',()=>{
 for(const id of ['rain','tide']){
  const environment=createMomentEnvironment(id),resources=inventory(environment.group),counts=new Map([...resources.geometries,...resources.materials,...resources.instances].map(item=>[item,0]));
  for(const resource of counts.keys())resource.addEventListener('dispose',()=>counts.set(resource,counts.get(resource)+1));
  environment.update(2,.05,{active:true});environment.dispose();environment.dispose();environment.update(10,.05,{active:true});
  assert.equal(environment.group.visible,false);assert.equal(environment.group.children.length,0);assert.ok([...counts.values()].every(count=>count===1));
 }
});

test('wind and unknown scenes have no added environment',()=>{
 for(const id of ['wind','unknown',undefined]){const environment=createMomentEnvironment(id);environment.update(1,.1,{active:true});assert.equal(environment.group.visible,false);assert.equal(environment.group.children.length,0);environment.dispose();}
});
