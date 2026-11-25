import test from 'node:test';
import assert from 'node:assert/strict';
import {createTravelController} from '../src/navigation.js';

const close=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('a held strafe stays on its intended line while the following camera turns',()=>{
 const c=createTravelController();let yaw=0,x=0,z=0;
 for(let i=0;i<300;i++){
  const d=c.movement(1,0,yaw);x+=d.x/60;z+=d.z/60;
  c.observe(d.x/60,d.z/60,1/60);yaw=c.turn(1/60,{azimuth:yaw});
 }
 close(x,5);close(z,0);assert.ok(Math.abs(yaw+Math.PI/2)<.1);
});
test('releasing and choosing a new direction takes the current camera as a new reference',()=>{
 const c=createTravelController();c.movement(1,0,0);c.movement(0,0,1);
 const d=c.movement(0,1,Math.PI/2);close(d.x,-1);close(d.z,0);
});
test('manual orbit immediately owns the view and rebases a held walking gesture',()=>{
 const c=createTravelController();c.movement(0,1,0);c.orbit();
 const d=c.movement(0,1,Math.PI/2);close(d.x,-1);
 for(let i=0;i<60;i++){c.observe(-.05,0,1/60);close(c.turn(1/60,{azimuth:1}),1);}
});
test('idle view and an interaction do not recenter themselves',()=>{
 const c=createTravelController();c.observe(.1,0,.05);
 for(let i=0;i<100;i++){c.observe(0,0,.02);close(c.turn(.02,{azimuth:1}),1);}
 for(let i=0;i<100;i++){c.observe(.02,0,.02);close(c.turn(.02,{azimuth:1,blocked:true}),1);}
});
test('explicit recenter works while idle, turns by the shortest arc and respects a speed cap',()=>{
 const c=createTravelController();c.observe(.001,.05,.05);c.recenter();
 let yaw=3.12;const initial=yaw;
 for(let i=0;i<180;i++){const next=c.turn(1/60,{azimuth:yaw});assert.ok(Math.abs(next-yaw)<=1.45/60+1e-8);yaw=next;}
 assert.ok(yaw>initial&&yaw<3.2);
});
test('automatic follow can be disabled without disabling deliberate recenter',()=>{
 const c=createTravelController();for(let i=0;i<100;i++){c.observe(.02,0,.02);close(c.turn(.02,{azimuth:0,enabled:false}),0);}
 c.recenter();assert.ok(c.turn(.02,{azimuth:0,enabled:false})<0);
});
test('diagonal input is normalized and zero/nonfinite elapsed time cannot poison the view',()=>{
 const c=createTravelController(),d=c.movement(1,1,.5);close(Math.hypot(d.x,d.z),1);
 c.observe(NaN,0,.02);assert.ok(Number.isFinite(c.turn(NaN,{azimuth:.5})));
 close(c.turn(0,{azimuth:.5}),.5);
});
