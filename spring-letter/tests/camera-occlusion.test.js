import test from 'node:test';import assert from 'node:assert/strict';import * as THREE from 'three';
import {createCameraOcclusion} from '../src/camera-occlusion.js';
test('only masonry between the view and its subject fades, then returns as the view clears',()=>{
 const material=new THREE.MeshStandardMaterial({transparent:true}),wall=new THREE.Mesh(new THREE.BoxGeometry(1,3,.4),material);wall.position.set(0,1,-2);wall.updateMatrixWorld();
 const camera=new THREE.PerspectiveCamera();camera.position.set(0,1,-5);const target=new THREE.Vector3(0,1,0),occlusion=createCameraOcclusion([wall]);
 for(let i=0;i<60;i++)occlusion.update(1/60,camera,target);assert.ok(material.opacity<.18);assert.equal(material.depthWrite,false);
 camera.position.set(5,1,0);for(let i=0;i<60;i++)occlusion.update(1/60,camera,target);assert.ok(material.opacity>.99);assert.equal(material.depthWrite,true);wall.geometry.dispose();material.dispose();
});

test('an off-centre flower bed stays visible even when the traveller ray is clear',()=>{
 const material=new THREE.MeshStandardMaterial({transparent:true}),wall=new THREE.Mesh(new THREE.BoxGeometry(.5,3,.4),material);wall.position.set(1.2,1,-2);wall.updateMatrixWorld();
 const camera=new THREE.PerspectiveCamera();camera.position.set(0,1,-5);const target=new THREE.Vector3(0,1,0),flower=new THREE.Vector3(2,1,0),occlusion=createCameraOcclusion([wall]);
 for(let i=0;i<60;i++)occlusion.update(1/60,camera,target);assert.ok(material.opacity>.99);
 for(let i=0;i<60;i++)occlusion.update(1/60,camera,target,true,[flower]);assert.ok(material.opacity<.18);
 wall.geometry.dispose();material.dispose();
});
