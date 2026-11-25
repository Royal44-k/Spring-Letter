import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlowerCycle} from '../src/flower-cycle.js';
function tick(c,seconds,input={}){for(let n=0;n<Math.ceil(seconds*60);n++)c.update(1/60,input);return c.state;}
test('one burst releases, lingers after release and restores without another input',()=>{
 const c=createFlowerCycle();c.update(1/60,{burst:true});tick(c,.8);assert.equal(c.state.phase,'drifting');
 tick(c,2);assert.equal(c.state.dispersion,1);tick(c,5);assert.equal(c.state.phase,'returning');assert.ok(c.state.dispersion>.9);
 tick(c,5.2);assert.equal(c.state.phase,'solid');assert.equal(c.state.dispersion,0);assert.equal(c.state.cycles,1);
});
test('slow adornment never shatters a solid flower; sustained fast input does not restart forever',()=>{
 const c=createFlowerCycle();tick(c,4,{active:true,energy:2});assert.equal(c.state.cycles,0);
 tick(c,30,{active:true,energy:12});assert.equal(c.state.phase,'solid');assert.equal(c.state.cycles,1);
 tick(c,.5,{active:false});tick(c,.1,{active:true,energy:12});assert.equal(c.state.cycles,2);
});
test('adornment extends drift to a finite ceiling and keeps slow restoration',()=>{
 const c=createFlowerCycle();c.update(.01,{burst:true});tick(c,10,{active:true,energy:2});assert.equal(c.state.phase,'drifting');
 tick(c,12,{active:true,energy:2});assert.equal(c.state.phase,'solid');assert.equal(c.state.cycles,1);
});
test('pause freezes phase; release/cancel continues restoration; reduced motion preserves discovery time',()=>{
 const c=createFlowerCycle();c.update(.01,{burst:true});tick(c,2);const before=c.state;
 tick(c,20,{paused:true,active:true,energy:12,burst:true});assert.deepEqual(c.state,before);
 tick(c,12,{reducedMotion:true});assert.equal(c.state.phase,'solid');
});
test('invalid time and input remain finite; reset cancels residue and edge-triggered held burst',()=>{
 const c=createFlowerCycle();c.update(NaN,{energy:Infinity});assert.equal(c.state.phase,'solid');
 tick(c,30,{burst:true});assert.equal(c.state.cycles,1);assert.equal(c.state.phase,'solid');
 c.reset();assert.equal(c.state.dispersion,0);assert.equal(c.state.age,0);
 c.update(.01,{burst:true});assert.equal(c.state.phase,'breaking');
});
test('real elapsed lifecycle time gives the same gentle return on a 10 or 60 fps device',()=>{
 const durations=[10,15,30,60].map(fps=>{const c=createFlowerCycle();let seconds=0;c.update(0,{burst:true});while(c.state.phase!=='solid'&&seconds<30){c.update(1/fps);seconds+=1/fps;}return seconds;});
 assert.ok(durations.every(value=>value>=12.7-.001&&value<=12.8+.001));
});
