import test from 'node:test';
import assert from 'node:assert/strict';
import {LETTERS,createLetters,restoreLetters,evaluateLetter,rotateLetter,commitGardenLetter,completedLetters,letterUnlocked} from '../src/letter-model.js';

for(const letter of LETTERS){
 test(`${letter.id}: fresh board needs action and both choices are attainable`,()=>{
  const state=createLetters();assert.deepEqual(evaluateLetter(letter,state.entries[letter.id]).ready,[]);
  for(const goal of letter.goals){
   const attempt=createLetters(),e=attempt.entries[letter.id];
   assert.equal(commitGardenLetter(attempt,letter.id,goal.id).ok,false);
   for(const [id,turn]of Object.entries(letter.solutions[goal.id]))while(e.turns[id]!==turn)assert.ok(rotateLetter(attempt,letter.id,id));
   const before=JSON.stringify(attempt),result=evaluateLetter(letter,e);
   assert.ok(result.ready.includes(goal.id));assert.equal(JSON.stringify(attempt),before);
   assert.equal(e.choice,null,'preview never commits');
   assert.equal(commitGardenLetter(attempt,letter.id,goal.id).first,true);
   assert.equal(commitGardenLetter(attempt,letter.id,goal.id).first,false);
   assert.equal(restoreLetters(JSON.parse(JSON.stringify(attempt))).entries[letter.id].choice,goal.id);
  }
 });
 test(`${letter.id}: fixed stones and unknown inputs cannot create progress`,()=>{
  const s=createLetters(),before=JSON.stringify(s),fixed=letter.tiles.find(t=>t.locked);
  assert.equal(rotateLetter(s,letter.id,fixed.id),false);assert.equal(rotateLetter(s,letter.id,'missing'),false);assert.equal(commitGardenLetter(s,letter.id,'bogus').ok,false);assert.equal(JSON.stringify(s),before);
 });
 test(`${letter.id}: changing a completed route preserves reply until deliberate recommit`,()=>{
  const s=createLetters(),e=s.entries[letter.id],[first,second]=letter.goals;
  Object.assign(e.turns,letter.solutions[first.id]);commitGardenLetter(s,letter.id,first.id);
  Object.assign(e.turns,letter.solutions[second.id]);assert.equal(e.choice,first.id);
  const result=commitGardenLetter(s,letter.id,second.id);assert.ok(result.ok&&result.changed&&!result.first);assert.equal(e.choice,second.id);
 });
}
test('wind route cannot commit while its old well receives a live branch',()=>{
 const s=createLetters(),l=LETTERS[1],e=s.entries.wind;Object.assign(e.turns,l.solutions.lamp,{b:0});
 const result=evaluateLetter(l,e);assert.ok(result.goalSources.lamp.length);assert.ok(result.leaks.length);assert.deepEqual(result.ready,[]);assert.equal(commitGardenLetter(s,'wind','lamp').ok,false);
});
test('tide needs both sources; one connected source is only a preview',()=>{
 const s=createLetters(),l=LETTERS[2],e=s.entries.tide;Object.assign(e.turns,l.solutions.old,{d:1});
 const result=evaluateLetter(l,e);assert.equal(result.goalSources.old.length,1);assert.deepEqual(result.ready,[]);
});
test('restore rejects unknown schemas and clamps malformed per-entry values',()=>{
 assert.deepEqual(restoreLetters({version:2}),createLetters());
 const s=createLetters();s.entries.rain.turns={a:2,b:NaN,c:5,e:3};s.entries.rain.choice='bogus';s.entries.rain.moves=Infinity;
 const r=restoreLetters(s).entries.rain;assert.equal(r.turns.a,0);assert.equal(r.turns.b,0);assert.equal(r.turns.c,0);assert.equal(r.turns.e,3);assert.equal(r.choice,null);assert.equal(r.moves,0);
});
test('letter availability follows earned access and rewards count committed replies',()=>{
 const s=createLetters();assert.ok(letterUnlocked(LETTERS[0],{}));assert.ok(!letterUnlocked(LETTERS[1],{}));assert.ok(letterUnlocked(LETTERS[1],{p1:{solved:true}}));assert.ok(!letterUnlocked(LETTERS[2],{p1:{solved:true}}));assert.ok(letterUnlocked(LETTERS[2],{wind:{solved:true}}));assert.equal(completedLetters(s).length,0);
 Object.assign(s.entries.rain.turns,LETTERS[0].solutions.tree);assert.equal(completedLetters(s).length,0);commitGardenLetter(s,'rain','tree');assert.equal(completedLetters(s).length,1);
});
