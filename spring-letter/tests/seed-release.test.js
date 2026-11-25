import test from 'node:test';import assert from 'node:assert/strict';
import {createState} from '../src/game-model.js';
import {stepWind} from '../src/wind-flow.js';
import {createExplorationState,stepExploration,EXPLORATION_ANCHORS,SEED_GATES} from '../src/exploration-model.js';
const main=()=>{const s=createState();s.p1.solved=true;Object.assign(s.wind,{x:3,z:-2,touched:true});return s;};
const side=()=>{const s=createExplorationState();Object.assign(s.wind,{stage:3,touched:true,seed:{...SEED_GATES[2],vx:0,vz:0}});return s;};
const input={player:EXPLORATION_ANCHORS.wind,progress:{p1:{solved:true},wind:{solved:true}},gesture:{active:false,released:false}};
test('no actual release means pinch and idle cannot finish either seed journey',()=>{
 const s=main();for(let i=0;i<120;i++)stepWind(s,{pointer:null,released:false,cancelled:i===0},1/60);assert.equal(s.wind.solved,false);
 let e=side();for(let i=0;i<120;i++)e=stepExploration(e,{...input,interactive:i>=60},1/60).state;assert.equal(e.wind.done,false);assert.equal(e.wind.stage,3);
});
test('canceling a partly caught seed preserves position and checkpoints without later idle completion',()=>{
 const s=main();for(let i=0;i<12;i++)stepWind(s,{pointer:null,released:i===0},1/60);assert.ok(s.wind.hold>0);stepWind(s,{cancelled:true},0);for(let i=0;i<120;i++)stepWind(s,{},1/60);assert.equal(s.wind.solved,false);assert.equal(s.wind.hold,0);
 let e=side();for(let i=0;i<12;i++)e=stepExploration(e,{...input,gesture:{active:false,released:i===0}},1/60).state;assert.ok(e.wind.hold>0);e=stepExploration(e,{...input,interactive:false},1/60).state;for(let i=0;i<120;i++)e=stepExploration(e,input,1/60).state;assert.equal(e.wind.done,false);assert.equal(e.wind.stage,3);assert.equal(e.wind.hold,0);
});
test('one genuine release starts a gentle catch that continues without repeating the pulse',()=>{
 const s=main();stepWind(s,{released:true},1/60);for(let i=0;i<60;i++)stepWind(s,{},1/60);assert.equal(s.wind.solved,true);
 let e=side();e=stepExploration(e,{...input,gesture:{active:false,released:true}},1/60).state;for(let i=0;i<60;i++)e=stepExploration(e,input,1/60).state;assert.equal(e.wind.done,true);
});
