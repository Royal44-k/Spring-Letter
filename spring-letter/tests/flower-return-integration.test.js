import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createState} from '../src/game-model.js';
import {updateFlowerLesson} from '../src/flower-lesson.js';
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const start=source.indexOf('function updatePlay('),handler=source.slice(start,source.indexOf('\nfunction ',start+1));
function fixture(){
 const state=createState(),c={state,resonance:null,focus:null,flowerState:{phase:'solid'},gesture:{active:false},strokeMotion:{value:0},playerHeight:0,autoFlowerEntered:true,quiet:0,saveClock:0,displayBloom:1,updateFlowerLesson};
 c.world={player:{position:{set(){}}}};c.audio={chime(){c.chimes++;},note(){}};c.chimes=0;c.movePlayer=c.caption=c.discoverSilently=c.save=c.updateUI=()=>{};c.lerp=(a,b,t)=>a+(b-a)*t;
 vm.createContext(c);vm.runInContext(handler,c);return c;
}
test('the learned flower opens the route on its natural return even after leaving near-view',()=>{
 const c=fixture();Object.assign(c.state.p1,{broken:true,ink:1.2});c.updatePlay(1/60);
 assert.equal(c.state.p1.solved,true);assert.equal(c.chimes,1);c.updatePlay(1/60);assert.equal(c.chimes,1);
});
test('wandering gestures cannot earn an unlearned flower lesson',()=>{
 const c=fixture();c.flowerState.phase='drifting';c.gesture.active=true;c.strokeMotion.value=12;
 for(let i=0;i<180;i++)c.updatePlay(1/60);c.flowerState.phase='solid';c.updatePlay(1/60);
 assert.equal(c.state.p1.ink,0);assert.equal(c.state.p1.solved,false);
});
