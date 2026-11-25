import test from 'node:test';
import assert from 'node:assert/strict';
import {updateFlowerLesson,flowerLessonHint} from '../src/flower-lesson.js';
const fresh=()=>({p1:{solved:false,hold:0}});
test('a static flower or unattended burst cannot complete the first journey',()=>{
 const s=fresh();for(let i=0;i<100;i++)updateFlowerLesson(s,{phase:'solid',energy:18,active:true},.05);
 assert.equal(s.p1.solved,false);
 updateFlowerLesson(s,{phase:'breaking'},.05);updateFlowerLesson(s,{phase:'drifting'},.05);updateFlowerLesson(s,{phase:'solid'},.05);
 assert.equal(s.p1.solved,false);
});
test('a deliberate brush through the drifting flower and its natural return open the way',()=>{
 const s=fresh();updateFlowerLesson(s,{phase:'breaking'},.05);
 for(let i=0;i<50;i++)updateFlowerLesson(s,{phase:'drifting',energy:2,active:true},.02);
 assert.equal(s.p1.solved,false);updateFlowerLesson(s,{phase:'returning'},.02);assert.equal(s.p1.solved,false);
 assert.equal(updateFlowerLesson(s,{phase:'solid'},.02),true);assert.equal(s.p1.solved,true);
 assert.equal(updateFlowerLesson(s,{phase:'solid'},.02),false);
});
test('hints describe the missing action and solved older saves remain solved',()=>{
 const s=fresh();assert.match(flowerLessonHint(s,'solid'),/花心/);
 updateFlowerLesson(s,{phase:'breaking'},.02);assert.match(flowerLessonHint(s,'drifting'),/拖动/);
 s.p1.solved=true;assert.match(flowerLessonHint(s,'solid'),/路/);
});
test('paused or invalid elapsed time does not earn brush progress',()=>{
 const s=fresh();updateFlowerLesson(s,{phase:'breaking'},.02);
 for(const dt of [0,-1,NaN,Infinity])updateFlowerLesson(s,{phase:'drifting',energy:10,active:true},dt);
 assert.equal(s.p1.ink,0);
});
