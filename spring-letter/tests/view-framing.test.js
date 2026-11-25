import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,Vector3} from 'three';
import {frameBounds,surfaceBounds} from '../src/view-framing.js';
import {createBouquet} from '../src/botany.js';
import {createViewRig} from '../src/navigation.js';

test('all four flower silhouettes fit above or beside controls, including rotated portrait views',()=>{
 const flower=createBouquet({seed:17});
 for(const form of ['lily','lotus','iris','dahlia']){
  flower.setForm(form);const bounds=surfaceBounds(flower.sampleSurface(8192));
  for(const [width,height,rect] of [[390,844,{left:18,right:372,top:80,bottom:400}],[1440,900,{left:50,right:1070,top:100,bottom:800}],[844,390,{left:25,right:540,top:65,bottom:320}]]){
   for(const yaw of [0,.55,Math.PI,4.5]){
    const direction={x:Math.sin(yaw),y:.2,z:Math.cos(yaw)},frame=frameBounds(bounds,{direction,fov:40,width,height,rect});
    const camera=new PerspectiveCamera(40,width/height,.1,200);camera.position.copy(frame.target).add(frame.offset);camera.lookAt(frame.target);camera.updateMatrixWorld(true);
    for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]){
     const p=new Vector3(x,y,z).project(camera),px=(p.x+1)*width/2,py=(1-p.y)*height/2;
     assert.ok(px>=rect.left-.01&&px<=rect.right+.01&&py>=rect.top-.01&&py<=rect.bottom+.01,`${form} ${width}x${height} yaw ${yaw}: ${px},${py}`);
    }
   }
  }
 }
 flower.dispose();
});

test('responsive framing preserves a deliberate zoom ratio without cumulative drift',()=>{
 const rig=createViewRig();rig.select('flower',{x:0,y:0,z:8});rig.fit(16);assert.equal(rig.state.radius,16);
 rig.zoom(-200);const ratio=rig.state.radius/16;rig.fit(20);assert.ok(Math.abs(rig.state.radius-20*ratio)<1e-8);
 for(let i=0;i<100;i++)rig.fit(20);assert.ok(Math.abs(rig.state.radius-20*ratio)<1e-8);
});
