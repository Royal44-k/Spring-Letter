import test from 'node:test';
import assert from 'node:assert/strict';
import {movementVector,createViewRig} from '../src/navigation.js';
test('forward and strafing follow the rotated view without diagonal speed gain',()=>{
  assert.deepEqual(movementVector(0,1,0),{x:0,z:-1});
  const rotated=movementVector(0,1,Math.PI/2);assert.ok(Math.abs(rotated.x+1)<1e-9);assert.ok(Math.abs(rotated.z)<1e-9);
  const diagonal=movementVector(1,1,.45);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-1)<1e-9);
});
test('orbit persists through mode changes and supports full turns with bounded zoom and pitch',()=>{
  const rig=createViewRig();rig.select('roam',{x:0,y:4,z:8});rig.drag(1600,999);rig.zoom(-99999);const before=rig.state;
  assert.ok(before.azimuth<-Math.PI*2);assert.equal(before.elevation,1.36);assert.equal(before.radius,3.2);
  rig.select('flower',{x:4,y:2,z:6});rig.drag(100,30);rig.select('roam',{x:0,y:1,z:1});assert.deepEqual(rig.state,before);
  const offset=rig.offset();assert.ok(Math.abs(Math.hypot(offset.x,offset.y,offset.z)-3.2)<1e-9);
});
