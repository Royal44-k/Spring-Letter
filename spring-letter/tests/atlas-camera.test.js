import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from 'three';
import {ATLAS_STARS} from '../src/atlas-content.js';

const moduleUrl=new URL('../src/atlas-camera.js',import.meta.url);
for(const [width,height] of [[360,800],[390,844],[844,390],[1440,900]]){
 test(`star camera keeps all six labelled stars inside the usable ${width} x ${height} region`,async()=>{
  assert.ok(existsSync(moduleUrl),'the responsive star camera must exist');
  const {fitAtlasStarCamera}=await import(moduleUrl);
  const before=structuredClone(ATLAS_STARS),frame=fitAtlasStarCamera(width,height);
  const camera=new THREE.PerspectiveCamera(frame.fov,width/height,.1,frame.far);
  camera.position.fromArray(frame.position);camera.lookAt(new THREE.Vector3(...frame.target));camera.updateMatrixWorld();
  const points=ATLAS_STARS.map(star=>{
   const point=new THREE.Vector3(star.x,star.y,star.z).project(camera);
   assert.ok(point.z>-1&&point.z<1,'each star is within the near/far frustum');
   return {x:(point.x+1)*width/2,y:(1-point.y)*height/2};
  });
  const bounds={left:48+27,right:width-48-27,top:(height<=500?115:130)+27,bottom:height-(height<=500?95:200)-27};
  for(const [i,p] of points.entries()){
   assert.ok(p.x>=bounds.left-1e-6&&p.x<=bounds.right+1e-6,`star ${i} label x=${p.x} leaves ${bounds.left}..${bounds.right}`);
   assert.ok(p.y>=bounds.top-1e-6&&p.y<=bounds.bottom+1e-6,`star ${i} label y=${p.y} leaves ${bounds.top}..${bounds.bottom}`);
  }
  const usedWidth=(Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x)))/(bounds.right-bounds.left);
  const usedHeight=(Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y)))/(bounds.bottom-bounds.top);
  assert.ok(Math.max(usedWidth,usedHeight)>.9,'fit must retain useful click targets, not just shrink the sky arbitrarily');
  assert.deepEqual(ATLAS_STARS,before,'fitting must not alter shared geography');
  assert.deepEqual(fitAtlasStarCamera(width,height),frame,'fitting is deterministic');
 });
}

for(const [width,height] of [[150,200],[320,220],[200,100]])test(`resizing to ${width} x ${height} keeps a finite camera and visible stars`,async()=>{
 const {fitAtlasStarCamera}=await import(moduleUrl);
 const frame=fitAtlasStarCamera(width,height);
 assert.ok([...frame.position,...frame.target,frame.fov,frame.far].every(Number.isFinite));
 const camera=new THREE.PerspectiveCamera(frame.fov,width/height,.1,frame.far);
 camera.position.fromArray(frame.position);camera.lookAt(new THREE.Vector3(...frame.target));camera.updateMatrixWorld();
 for(const star of ATLAS_STARS){const p=new THREE.Vector3(star.x,star.y,star.z).project(camera);assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1&&p.z>-1&&p.z<1);}
});

test('unmeasured or invalid viewport sizes use a finite fallback camera',async()=>{
 const {fitAtlasStarCamera}=await import(moduleUrl);
 for(const [width,height] of [[undefined,undefined],[NaN,Infinity],[0,-1]]){
  const frame=fitAtlasStarCamera(width,height);
  assert.ok([...frame.position,...frame.target,frame.fov,frame.far].every(Number.isFinite));
 }
});
