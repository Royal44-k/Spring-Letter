import test from 'node:test';
import assert from 'node:assert/strict';
import {createStrokeMotion} from '../src/stroke-motion.js';

// The caller supplies distance per render step; an input event can span several
// such steps. These fixtures preserve the actual travelled distance per second.
function simulate(rafHz,inputHz,speed,{reversing=false}={}){
 const motion=createStrokeMotion(),dt=1/rafHz,interval=1/inputHz;
 let nextEvent=interval,lastEvent=0,position=0,previous=0,direction=1,scatter=0;
 const tail=[];
 for(let frame=1;frame<=rafHz*5;frame++){
  const time=frame*dt;
  while(nextEvent<=time+1e-10){
   position+=direction*speed*(nextEvent-lastEvent);
   if(reversing)direction*=-1;
   lastEvent=nextEvent;nextEvent+=interval;
  }
  const energy=motion.update(Math.abs(position-previous)/dt,dt);previous=position;
  const unit=Math.max(0,Math.min(1,(energy-1.1)/4.4));
  const target=unit*unit*(3-2*unit);
  scatter+=(target-scatter)*(1-Math.exp(-3.8*dt));
  if(time>=4)tail.push(scatter);
 }
 return {min:Math.min(...tail),max:Math.max(...tail),motion,scatter};
}

for(const rafHz of [60,90,144])test(`slow and fast strokes stay distinct at ${rafHz} Hz rendering`,()=>{
 for(const inputHz of [10,20,30,60]){
  const slow=simulate(rafHz,inputHz,.8),fast=simulate(rafHz,inputHz,20);
  assert.ok(slow.max<.005,`${rafHz}/${inputHz} Hz slow scatter ${slow.max}`);
  assert.ok(fast.min>.95,`${rafHz}/${inputHz} Hz fast scatter ${fast.min}`);
 }
});

test('a sparse fast sample retains its travel before the direction vector would be capped',()=>{
 const motion=createStrokeMotion();
 const impulse=motion.update(120,1/60);
 assert.ok(impulse>12&&impulse<=18,'clamping raw speed to 18 before integration loses the sampled distance');
 const gap=motion.update(0,1/60);
 assert.ok(gap>10&&gap<impulse,'one empty event frame must decay rather than erase the fast stroke');
});

test('alternating stroke directions keep fast scalar motion instead of cancelling it',()=>{
 for(const rafHz of [60,90,144]){
  const reversed=simulate(rafHz,20,20,{reversing:true});
  assert.ok(reversed.min>.95,`${rafHz} Hz reversing scatter ${reversed.min}`);
 }
});

test('release and explicit cancellation remove energy before a new slow stroke',()=>{
 const motion=createStrokeMotion();motion.update(100,1);
 assert.equal(motion.value,18);
 assert.equal(motion.update(NaN,Infinity,false),0);assert.equal(motion.value,0);
 assert.equal(motion.update(0,1/60),0,'re-activation cannot revive the previous stroke');
 for(let i=0;i<60;i++)assert.ok(motion.update(.8,1/60)<1.1);
 motion.update(100,1);motion.reset();assert.equal(motion.value,0);
 assert.equal(motion.update(0,1/60),0);
});

test('invalid speeds decay safely, invalid clocks hold state, and finite extremes stay bounded',()=>{
 const motion=createStrokeMotion();
 for(const raw of [NaN,Infinity,-Infinity,'20',null,{},-20])assert.equal(motion.update(raw,1/60),0);
 motion.update(20,.1);const before=motion.value;
 for(const dt of [0,-1,NaN,Infinity,-Infinity,'1',null])assert.equal(motion.update(100,dt),before);
 const decayed=motion.update(NaN,.1);assert.ok(decayed>=0&&decayed<before);
 for(const [raw,dt] of [[Number.MAX_VALUE,.01],[Number.MAX_VALUE,Number.MAX_VALUE],[0,Number.MAX_VALUE]]){
  const result=motion.update(raw,dt);assert.ok(Number.isFinite(result)&&result>=0&&result<=18);
 }
 assert.equal(motion.value,0);
});

test('continuous motion integrates by elapsed seconds across render rates',()=>{
 for(const rafHz of [60,90,144]){
  const motion=createStrokeMotion();let elapsed=0;
  while(elapsed<.25){const dt=Math.min(1/rafHz,.25-elapsed);motion.update(10,dt);elapsed+=dt;}
  assert.ok(Math.abs(motion.value-8.646647167633873)<1e-10,`${rafHz} Hz produced ${motion.value}`);
 }
});

test('independent gestures do not share their temporal energy',()=>{
 const first=createStrokeMotion(),second=createStrokeMotion();
 first.update(100,.2);assert.equal(second.value,0);
 second.update(.8,.1);first.reset();assert.ok(second.value>0&&second.value<1.1);
});

test('regular 5 Hz input remains usable but has little fast-stroke threshold margin',()=>{
 for(const rafHz of [60,90,144]){
  const slow=simulate(rafHz,5,.8),fast=simulate(rafHz,5,20);
  assert.ok(slow.max<.005,`${rafHz}/5 Hz slow scatter ${slow.max}`);
  assert.ok(fast.min>.95,`${rafHz}/5 Hz fast scatter ${fast.min}`);
 }
});
