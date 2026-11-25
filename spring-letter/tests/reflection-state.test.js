import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWaterReflection} from '../src/water-reflection.js';

// Exercise the real Reflector callback and matrices, with only the GPU call
// replaced. A driver/render exception must not poison the next scene draw.
function setup(throwDuringDraw=false){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1.6,.1,160);
 camera.position.set(0,3,6);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const water=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:{}}));
 const visibleExcluded=new THREE.Group(),alreadyHidden=new THREE.Group();alreadyHidden.visible=false;
 scene.add(water,visibleExcluded,alreadyHidden);
 const originalTarget=new THREE.WebGLRenderTarget(640,360);originalTarget.texture.name='main-render-target';
 originalTarget.viewport.set(12,18,640,360);originalTarget.scissor.set(7,9,500,280);originalTarget.scissorTest=true;
 let target=originalTarget,draws=0,cubeFace=3,mipmapLevel=2,scissorTest=true;
 const viewport=new THREE.Vector4(12,18,640,360),scissor=new THREE.Vector4(7,9,500,280);
 const logicalViewport=new THREE.Vector4(0,0,1920,1080),logicalScissor=new THREE.Vector4(0,0,1920,1080);let logicalScissorTest=false;
 const renderer={
  xr:{enabled:true},shadowMap:{enabled:true,autoUpdate:true,needsUpdate:false},autoClear:true,
  getRenderTarget:()=>target,setRenderTarget:(value,face=0,mip=0)=>{target=value;cubeFace=face;mipmapLevel=mip;viewport.copy(value?value.viewport:logicalViewport);scissor.copy(value?value.scissor:logicalScissor);scissorTest=value?value.scissorTest:logicalScissorTest;},
  getActiveCubeFace:()=>cubeFace,getActiveMipmapLevel:()=>mipmapLevel,
  getViewport:out=>out.copy(logicalViewport),setViewport:value=>{logicalViewport.copy(value);viewport.copy(value);},
  getScissor:out=>out.copy(logicalScissor),setScissor:value=>{logicalScissor.copy(value);scissor.copy(value);},
  getScissorTest:()=>logicalScissorTest,setScissorTest:value=>{logicalScissorTest=value;scissorTest=value;},
  state:{buffers:{depth:{setMask(){}}},viewport:value=>viewport.copy(value)},clear(){},
  render(){draws++;assert.equal(water.visible,false);assert.equal(visibleExcluded.visible,false);
   if(throwDuringDraw)throw Error('simulated reflection draw failure');},
 };
 const reflection=createWaterReflection({renderer,scene,camera,water,exclude:[visibleExcluded,alreadyHidden]});
 return {scene,renderer,reflection,water,visibleExcluded,alreadyHidden,originalTarget,
  snapshot:()=>({target,xr:renderer.xr.enabled,shadow:{...renderer.shadowMap},draws,cubeFace,mipmapLevel,viewport:viewport.toArray(),scissor:scissor.toArray(),scissorTest}),
  dispose(){reflection.dispose();water.geometry.dispose();water.material.dispose();originalTarget.dispose();},
 };
}

test('successful reflection returns control to the main target and preserves exclusions',()=>{
 const fixture=setup();
 try{
  fixture.reflection.update('balanced',true);
  const result=fixture.snapshot();
  assert.equal(result.draws,1);assert.equal(result.target,fixture.originalTarget);
  assert.equal(result.xr,true);assert.deepEqual(result.shadow,{enabled:true,autoUpdate:true,needsUpdate:false});
  assert.equal(fixture.water.visible,true);assert.equal(fixture.visibleExcluded.visible,true);assert.equal(fixture.alreadyHidden.visible,false);
 }finally{fixture.dispose();}
});

for(const field of ['target','xr','shadow','viewport'])test(`failed reflection restores ${field} before the next main draw`,()=>{
 const fixture=setup(true),warn=console.warn;console.warn=()=>{};let caught;
 try{
  try{fixture.reflection.update('balanced',true);}catch(error){caught=error;}
  if(caught)assert.match(caught.message,/simulated reflection draw failure/);
  const result=fixture.snapshot();assert.equal(result.draws,1);
  assert.equal(fixture.water.visible,true);assert.equal(fixture.visibleExcluded.visible,true);assert.equal(fixture.alreadyHidden.visible,false);
  if(field==='target')assert.equal(result.target,fixture.originalTarget);
  if(field==='xr')assert.equal(result.xr,true);
  if(field==='shadow')assert.deepEqual(result.shadow,{enabled:true,autoUpdate:true,needsUpdate:false});
  if(field==='viewport'){
   assert.equal(result.cubeFace,3);assert.equal(result.mipmapLevel,2);
   assert.deepEqual(result.viewport,[12,18,640,360]);assert.deepEqual(result.scissor,[7,9,500,280]);assert.equal(result.scissorTest,true);
  }
 }finally{console.warn=warn;fixture.dispose();}
});

test('first reflection waits for primary-render shadow maps, then resumes without rebuilding them',()=>{
 const fixture=setup(),light=new THREE.DirectionalLight();light.castShadow=true;fixture.scene.add(light);
 try{
  fixture.reflection.update('balanced',true);
  assert.equal(fixture.snapshot().draws,0,'reflection must not sample an unallocated PCF shadow texture');
  assert.equal(fixture.water.material.uniforms.uReflectionAmount.value,0);
  // The main scene owns shadow allocation. Simulate completion of that draw.
  light.shadow.map=new THREE.WebGLRenderTarget(4,4);
  fixture.reflection.update('balanced',true);
  assert.equal(fixture.snapshot().draws,1);assert.equal(fixture.water.material.uniforms.uReflectionAmount.value,1);
  assert.equal(fixture.renderer.shadowMap.autoUpdate,true);assert.equal(fixture.renderer.shadowMap.needsUpdate,false);
 }finally{light.shadow.map?.dispose();fixture.dispose();}
});

test('light mode never starts an auxiliary draw or mutates renderer state',()=>{
 const fixture=setup(),before=fixture.snapshot();
 try{fixture.reflection.update('light',true);assert.deepEqual(fixture.snapshot(),before);assert.equal(fixture.water.material.uniforms.uReflectionAmount.value,0);}
 finally{fixture.dispose();}
});

test('optional reflection draw failure disables reflection and allows subsequent frames',()=>{
 const fixture=setup(true),warn=console.warn;console.warn=()=>{};
 try{
  assert.doesNotThrow(()=>fixture.reflection.update('balanced',true));
  assert.equal(fixture.reflection.enabled,false);assert.equal(fixture.water.material.uniforms.uReflectionAmount.value,0);
  assert.doesNotThrow(()=>fixture.reflection.update('balanced',true));assert.equal(fixture.snapshot().draws,1);
 }finally{console.warn=warn;fixture.dispose();}
});
