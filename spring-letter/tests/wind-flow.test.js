import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../src/game-model.js';
import {stepWind} from '../src/wind-flow.js';
const fresh=()=>{const s=createState();s.p1.solved=true;return s;};
const run=(s,n,input)=>{for(let i=0;i<n;i++)stepWind(s,input,1/60);};
test('idle seed stays in its cup; invalid and distant pointers cannot deliver it',()=>{
 const s=fresh();for(const pointer of [null,{x:NaN,z:0},{x:999,z:999}])run(s,600,{pointer});
 assert.equal(s.wind.solved,false);assert.equal(s.wind.touched,false);assert.equal(s.wind.x,-3);assert.equal(s.wind.z,2);
});
test('held pen attracts seed, then release brakes it instead of reversing the interaction',()=>{
 const s=fresh();run(s,60,{pointer:{x:-2,z:2}});assert.ok(s.wind.x>-2.5);const x=s.wind.x;
 run(s,60,{});assert.ok(s.wind.x>=x);assert.ok(Math.hypot(s.wind.vx,s.wind.vz)<.01);
});
test('an ordinary outer route reaches the visible flower and needs release before delivery',()=>{
 const s=fresh();for(const point of [{x:-3,z:2},{x:-1,z:2},{x:1,z:2},{x:3,z:1},{x:3,z:-1},{x:3,z:-2}])run(s,150,{pointer:point});
 assert.ok(Math.hypot(s.wind.x-3,s.wind.z+2)<.3);assert.equal(s.wind.solved,false);
 run(s,60,{released:true});assert.equal(s.wind.solved,true);assert.deepEqual([s.wind.x,s.wind.z],[3,-2]);
});
test('intentional release at flower edge catches even a fast seed; mere arrival without contact does not',()=>{
 const s=fresh();Object.assign(s.wind,{x:2.2,z:-2,vx:3,vz:0,touched:true});run(s,60,{released:true});assert.equal(s.wind.solved,true);
 const idle=fresh();Object.assign(idle.wind,{x:3,z:-2});run(idle,180,{});assert.equal(idle.wind.solved,false);
});
test('boundary returns visibly reset contact history; paused or invalid time cannot integrate',()=>{
 const s=fresh();Object.assign(s.wind,{x:6,z:1,touched:true});stepWind(s,{},1/60);assert.equal(s.wind.returns,1);assert.equal(s.wind.touched,false);assert.equal(s.wind.x,-3);
 const before={...s.wind};for(const dt of [0,-1,Infinity,NaN])stepWind(s,{pointer:{x:-2,z:2}},dt);assert.deepEqual(s.wind,before);
});
