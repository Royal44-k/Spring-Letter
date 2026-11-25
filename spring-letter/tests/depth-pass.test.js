import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from 'three';import {GardenDepthPass} from '../src/depth-pass.js';
test('optional contact-depth failure restores scene visibility and renderer state',()=>{
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera();const points=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial());
 const glass=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshPhysicalMaterial({transmission:.8}));scene.add(points,glass);
 const originalOverride=new THREE.MeshBasicMaterial();scene.overrideMaterial=originalOverride;
 const originalTarget={},targetColor=new THREE.Color('#304050');let target=originalTarget,color=targetColor.clone(),alpha=.7;
 const renderer={shadowMap:{autoUpdate:true,needsUpdate:false},autoClear:true,getRenderTarget:()=>target,setRenderTarget:v=>target=v,getClearColor:out=>out.copy(color),getClearAlpha:()=>alpha,setClearColor:(c,a)=>{color.copy(c);if(a!==undefined)alpha=a;}};
 const pass=new GardenDepthPass(scene,camera);pass._renderOverride=()=>{scene.overrideMaterial=new THREE.MeshNormalMaterial();renderer.autoClear=false;target={};throw Error('simulated driver failure');};
 const warn=console.warn;console.warn=()=>{};try{pass.render(renderer,{},{});}finally{console.warn=warn;}
 assert.equal(points.visible,true);assert.equal(glass.visible,true);assert.equal(scene.overrideMaterial,originalOverride);assert.equal(renderer.autoClear,true);assert.equal(target,originalTarget);assert.equal(alpha,.7);assert.equal(pass.failed,true);assert.equal(pass.enabled,false);assert.equal(pass._visibilityCache.length,0);
 assert.deepEqual(renderer.shadowMap,{autoUpdate:true,needsUpdate:false});
 pass.dispose();points.geometry.dispose();points.material.dispose();glass.geometry.dispose();glass.material.dispose();originalOverride.dispose();
});
