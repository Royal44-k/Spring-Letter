import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createTideMoment,createTideScore,restoreTideScore,tideDraft,tideScoreCounts,tideScoreReady,tideSignature,editTideNote,startTidePlayback,stopTidePlayback,stepTidePlayback,TIDE_STEP_SECONDS} from '../src/moment-tide.js';

const threeNotes=()=>{const s=createTideScore();editTideNote(s,0,0);editTideNote(s,1,2);editTideNote(s,0,4);return s;};
function listen(s,dt=.02){const events=[];startTidePlayback(s);for(let i=0;i<1000&&s.playing;i++)events.push(...stepTidePlayback(s,dt));return events;}
function rayAt(moment,voice,beat){const t=moment.snapshot().targets.find(t=>t.voice===voice&&t.beat===beat),p=new THREE.Vector3(...t.position);return new THREE.Raycaster(p.clone().add(new THREE.Vector3(0,0,10)),new THREE.Vector3(0,0,-1));}
const resources=group=>{const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});return {geometries,materials};};

test('personal composition requires diversity, three notes and a full listening pass',()=>{
 const s=createTideScore();assert.equal(startTidePlayback(s),false);assert.deepEqual(tideScoreCounts(s),{notes:0,voices:0});
 editTideNote(s,0,0);editTideNote(s,0,2);editTideNote(s,0,4);listen(s);assert.equal(tideScoreReady(s),false,'three notes in one voice do not satisfy the dialogue');
 editTideNote(s,1,2);assert.equal(tideScoreReady(s),false);startTidePlayback(s);
 for(let i=0;i<200;i++)stepTidePlayback(s,.02);assert.equal(tideScoreReady(s),false,'four seconds is not a complete eight-beat phrase');
 while(s.playing)stepTidePlayback(s,.02);assert.equal(tideScoreReady(s),true);assert.equal(s.playCount,2);
});

test('actual score timing is deterministic with sparse beats and has no repeated note emissions',()=>{
 const a=threeNotes(),b=threeNotes();const notes=events=>events.filter(e=>e.type==='note');
 assert.deepEqual(notes(listen(a,.016)),[{type:'note',voice:0,beat:0},{type:'note',voice:1,beat:2},{type:'note',voice:0,beat:4}]);
 assert.deepEqual(notes(listen(b,.05)),[{type:'note',voice:0,beat:0},{type:'note',voice:1,beat:2},{type:'note',voice:0,beat:4}]);
 assert.deepEqual(stepTidePlayback(a,1),[]);assert.equal(a.playCount,1);assert.equal(b.playCount,1);assert.equal(tideSignature(a.notes),tideSignature(b.notes));
});

test('editing invalidates a listened phrase and cancellation cannot complete it',()=>{
 const s=threeNotes();listen(s);assert.equal(tideScoreReady(s),true);editTideNote(s,2,7);assert.equal(s.heardSignature,null);assert.equal(tideScoreReady(s),false);
 startTidePlayback(s);stepTidePlayback(s,.02);stopTidePlayback(s);for(let i=0;i<100;i++)stepTidePlayback(s,.1);assert.equal(tideScoreReady(s),false);
 assert.equal(editTideNote(s,NaN,3),false);assert.equal(editTideNote(s,2,8),false);assert.equal(editTideNote(s,0,0,true),false);
});

test('missing, future, nonfinite and forged drafts restore to bounded data without starting playback',()=>{
 const s=threeNotes();listen(s);const draft=tideDraft(s),restored=restoreTideScore(draft);assert.equal(tideScoreReady(restored),true);assert.equal(restored.playing,false);
 draft.notes[0][0]=false;assert.equal(restored.notes[0][0],true);assert.equal(tideScoreReady(restoreTideScore(draft)),false,'changed score cannot reuse old listening proof');
 assert.deepEqual(restoreTideScore({version:2}),createTideScore());assert.deepEqual(restoreTideScore(null),createTideScore());
 const bad=restoreTideScore({version:1,notes:[[1,true,'yes'],null,[false]],selectedVoice:Infinity,selectedBeat:-99,playCount:1e200,heardSignature:'wrong'});
 assert.deepEqual(tideScoreCounts(bad),{notes:1,voices:1});assert.equal(bad.selectedBeat,0);assert.equal(bad.selectedVoice,0);assert.equal(bad.playCount,9999);assert.equal(bad.heardSignature,null);
 const unfinished=threeNotes();startTidePlayback(unfinished);for(const dt of [NaN,Infinity,-1,0])assert.deepEqual(stepTidePlayback(unfinished,dt),[]);assert.equal(unfinished.elapsed,0);stepTidePlayback(unfinished,1000);assert.ok(unfinished.elapsed<=.1);
});

test('world-space pointer targets pick all three shapes and drag stroke undoes as one operation',()=>{
 const m=createTideMoment(),scene=new THREE.Group();scene.position.set(7,3,-2);scene.add(m.group);m.group.position.set(-12,1.4,-29);
 try{
  const a=rayAt(m,0,0),b=rayAt(m,1,3),c=rayAt(m,2,6);
  assert.equal(m.pointer('down',a,{button:0}),true);m.pointer('move',a,{buttons:1});assert.equal(m.snapshot().noteCount,1,'same object cannot be toggled repeatedly in one stroke');
  m.pointer('move',b,{buttons:1});m.pointer('move',c,{buttons:1});m.pointer('up',c);assert.equal(m.snapshot().noteCount,3);assert.equal(m.snapshot().voiceCount,3);
  assert.equal(m.action('undo'),true);assert.equal(m.snapshot().noteCount,0);
  m.pointer('down',b,{button:0});m.pointer('cancel');m.pointer('move',c,{buttons:1});assert.equal(m.snapshot().noteCount,1);
  m.pointer('down',a,{button:2});assert.equal(m.snapshot().noteCount,1);assert.equal(m.pointer('down',new THREE.Raycaster(new THREE.Vector3(100,100,100),new THREE.Vector3(0,0,-1)),{button:0}),false);
 }finally{m.dispose();}
});

test('a second touch cannot steal, paint or end the current real-ray stroke',()=>{
 const m=createTideMoment();m.update(0,0,{active:true});
 try{
  const a=rayAt(m,0,0),b=rayAt(m,1,3),c=rayAt(m,2,6);
  assert.equal(m.pointer('down',a,{pointerId:11,button:0,buttons:1}),true);
  assert.equal(m.pointer('down',b,{pointerId:22,button:0,buttons:1}),false);
  assert.equal(m.pointer('move',b,{pointerId:22,buttons:1}),false);
  assert.equal(m.pointer('up',b,{pointerId:22,buttons:0}),false);
  assert.equal(m.snapshot().noteCount,1);
  assert.equal(m.pointer('move',b,{pointerId:11,buttons:1}),true);
  m.pointer('move',a,{pointerId:11,buttons:1});m.pointer('move',b,{pointerId:11,buttons:1});
  assert.equal(m.snapshot().noteCount,2,'each note changes only once in the owning stroke');
  assert.equal(m.pointer('up',b,{pointerId:11,buttons:0}),true);
  assert.equal(m.pointer('move',c,{pointerId:11,buttons:1}),false);
  assert.equal(m.action('undo'),true);assert.equal(m.snapshot().noteCount,0,'one undo removes the complete owned stroke');
 }finally{m.dispose();}
});

test('global cancellation releases touch ownership and pointer-less mouse strokes remain usable',()=>{
 const m=createTideMoment();m.update(0,0,{active:true});
 try{
  const a=rayAt(m,0,0),b=rayAt(m,1,3),c=rayAt(m,2,6);
  m.pointer('down',a,{pointerId:11,button:0,buttons:1});
  assert.equal(m.pointer('cancel'),true);
  assert.equal(m.pointer('move',b,{pointerId:11,buttons:1}),false);
  assert.equal(m.pointer('up',a,{pointerId:11,buttons:0}),false);
  assert.equal(m.pointer('down',b,{pointerId:22,button:0,buttons:1}),true);
  assert.equal(m.pointer('up',b,{pointerId:22,buttons:0}),true);
  assert.equal(m.snapshot().noteCount,2);m.action('undo');assert.equal(m.snapshot().noteCount,1);
  assert.equal(m.pointer('down',b,{button:0}),true);m.pointer('move',c,{buttons:1});
  assert.equal(m.pointer('up'),true);assert.equal(m.snapshot().noteCount,3);
  m.action('undo');assert.equal(m.snapshot().noteCount,1);
 }finally{m.dispose();}
});

test('keyboard edits, voice selection and native button keys remain distinct',()=>{
 const m=createTideMoment();try{
  assert.equal(m.key({code:'Digit2'}),true);m.key({code:'ArrowRight'});m.key({code:'Enter'});assert.equal(m.snapshot().draft.notes[1][1],true);
  m.key({code:'Enter',repeat:true});assert.equal(m.snapshot().draft.notes[1][1],true);
  assert.equal(m.key({code:'Space',target:{matches:()=>true}}),false);assert.equal(m.key({code:'Space',type:'keyup'}),false);assert.equal(m.snapshot().playing,false);
  m.key({code:'Space'});assert.equal(m.snapshot().playing,true);m.key({code:'Space',repeat:true});assert.equal(m.snapshot().playing,true);
  m.key({code:'Space'});assert.equal(m.snapshot().playing,false);m.key({code:'Delete'});assert.equal(m.snapshot().noteCount,0);m.key({code:'KeyZ'});assert.equal(m.snapshot().noteCount,1);
 }finally{m.dispose();}
});

test('full playback produces the requested instruments and inactivity freezes the listening cursor',()=>{
 const sounds=[],m=createTideMoment({onSound:(kind,payload)=>sounds.push({kind,...payload})});try{
  m.action('toggle',{voice:0,beat:0});m.action('toggle',{voice:1,beat:2});m.action('toggle',{voice:2,beat:5});sounds.length=0;m.action('play');
  m.update(0,.05,{active:true});const before=m.snapshot();for(let i=0;i<200;i++)m.update(i,.05,{active:false});assert.deepEqual(m.snapshot().draft,before.draft);assert.equal(m.snapshot().playhead,before.playhead);assert.equal(sounds.length,1);
  for(let i=0;i<120;i++)m.update(i*.05,.05,{active:true,reducedMotion:true});assert.equal(m.snapshot().ready,true);
  assert.deepEqual(sounds.map(s=>s.instrument),['piano','harp','flute']);assert.ok(sounds.every(s=>s.kind==='compose-note'&&s.preview===false&&Number.isFinite(s.midi)&&s.gain>0));
  const saved=m.snapshot().draft;m.restore(saved);assert.equal(m.snapshot().ready,true);assert.equal(m.snapshot().playing,false);assert.equal(m.snapshot().canUndo,false);
  m.action('toggle',{voice:1,beat:4});assert.equal(m.snapshot().ready,false);
 }finally{m.dispose();}
});

test('geometry remains inside framing bounds, resources stay fixed and dispose once',()=>{
 const m=createTideMoment();const before=resources(m.group),counts=new Map([...before.geometries,...before.materials].map(r=>[r,0]));
 m.group.traverse(object=>{if(object.isInstancedMesh)counts.set(object,0);});
 for(const [r] of counts)r.addEventListener('dispose',()=>counts.set(r,counts.get(r)+1));
 const box=new THREE.Box3().setFromObject(m.group,true);for(let axis=0;axis<3;axis++){assert.ok(box.min.getComponent(axis)>=m.bounds.min[axis]-.01);assert.ok(box.max.getComponent(axis)<=m.bounds.max[axis]+.01);}
 for(let i=0;i<360;i++){if(i%20===0)m.action('toggle',{voice:i%3,beat:i%8});if(i===40)m.action('play');m.update(i/60,1/60,{active:true});}
 const after=resources(m.group);assert.deepEqual(after.geometries,before.geometries);assert.deepEqual(after.materials,before.materials);
 m.dispose();m.dispose();assert.ok([...counts.values()].every(n=>n===1));assert.equal(m.group.children.length,0);assert.equal(m.action('play'),false);
});

test('all staggered instrument centres still pick their own note after world transforms',()=>{
 const m=createTideMoment(),world=new THREE.Group();world.position.set(5,1,-8);world.rotation.y=.18;world.add(m.group);m.group.position.set(-12,1.4,-29);
 try{
  for(const target of m.snapshot().targets){
   m.action('clear');const p=new THREE.Vector3(...target.position),direction=new THREE.Vector3(0,0,-1).transformDirection(world.matrixWorld);
   const ray=new THREE.Raycaster(p.clone().addScaledVector(direction,-10),direction);
   assert.equal(m.pointer('down',ray,{button:0}),true,target.id);m.pointer('up');
   const snap=m.snapshot();assert.equal(snap.noteCount,1,target.id);assert.equal(snap.draft.notes[target.voice][target.beat],true,target.id);
  }
 }finally{m.dispose();}
});

test('sound ripples, trajectories and instrument glow use fixed bounded buffers',()=>{
 const m=createTideMoment();try{
  const water=m.group.getObjectByName('tide-water'),traces=m.group.getObjectByName('tide-sounding-trails'),before=resources(m.group);
  const instruments=m.group.children.filter(object=>object.name.startsWith('tide-instruments-'));
  assert.equal(instruments.length,3);assert.ok(instruments.every(object=>object.isInstancedMesh&&object.count===8));
  assert.ok(instruments.every(object=>object.geometry.getAttribute('aEcho').count===8));
  for(const object of instruments){
   const shader={vertexShader:THREE.ShaderLib.physical.vertexShader,fragmentShader:THREE.ShaderLib.physical.fragmentShader};object.material.onBeforeCompile(shader);
   assert.ok(shader.vertexShader.includes('vEcho = aEcho;'));assert.ok(shader.fragmentShader.includes('diffuseColor.rgb * vEcho;'));
  }
  const uniforms=water.material.uniforms,echoBuffer=uniforms.uEchoes.value,traceArray=traces.geometry.getAttribute('position').array;
  assert.equal(echoBuffer.length,12);assert.equal(traceArray.length,12*12*3);
  for(let i=0;i<420;i++){
   if(i%3===0)m.action('voice-'+['cup','harp','wind'][(i/3)%3]);
   m.update(i/60,1/60,{active:true});
   assert.ok(m.snapshot().presentation.echoes<=12);
  }
  assert.equal(uniforms.uEchoes.value,echoBuffer);assert.equal(traces.geometry.getAttribute('position').array,traceArray);
  assert.ok(traceArray.every(Number.isFinite));assert.ok(traces.geometry.getAttribute('aLife').array.some(value=>value>0));
  assert.deepEqual(resources(m.group),before);
  const visibleDraws=m.group.children.filter(object=>object.geometry&&object.visible&&object.material?.visible!==false);assert.ok(visibleDraws.length<=22,'stage presentation stays within 22 draw objects');
  m.update(20,.05,{active:true,reducedMotion:true});assert.equal(uniforms.uTime.value,0);assert.equal(uniforms.uMotion.value,0);
  assert.ok(traces.geometry.getAttribute('aLife').array.every(value=>value===0));
 }finally{m.dispose();}
});

test('committed home and distant replies have different water traces without changing the composition or resources',()=>{
 const m=createTideMoment(),score=threeNotes();listen(score);m.restore(tideDraft(score));
 try{
  const original=m.snapshot().draft,before=resources(m.group),line=m.group.getObjectByName('tide-reply-current');
  for(let i=0;i<100;i++)m.update(i*.05,.05,{active:true,choice:'old',completed:true});
  assert.equal(m.snapshot().presentation.reply,'old');assert.equal(line.visible,true);assert.ok(line.material.opacity>0);
  const home=Array.from(line.geometry.attributes.position.array);assert.ok(Math.max(...home.filter((_,i)=>i%3===0))>2.5);
  for(let i=0;i<100;i++)m.update(5+i*.05,.05,{active:true,choice:'new',completed:true});
  assert.equal(m.snapshot().presentation.reply,'new');const distant=Array.from(line.geometry.attributes.position.array);assert.notDeepEqual(distant,home);
  assert.ok(Math.min(...distant.filter((_,i)=>i%3===2))<-2,'distant reply travels toward the back of the water');
  assert.deepEqual(m.snapshot().draft,original);assert.equal(m.snapshot().ready,true);assert.deepEqual(resources(m.group),before);
  m.update(20,.05,{active:true,choice:'new',completed:false});assert.equal(line.visible,false);assert.equal(m.snapshot().presentation.reply,null);assert.deepEqual(m.snapshot().draft,original);
  for(const object of m.group.children)if(object.isInstancedMesh)object.computeBoundingBox();
  const box=new THREE.Box3().setFromObject(m.group,true);for(let axis=0;axis<3;axis++){assert.ok(box.min.getComponent(axis)>=m.bounds.min[axis]-.01);assert.ok(box.max.getComponent(axis)<=m.bounds.max[axis]+.01);}
 }finally{m.dispose();}
});
