import test from 'node:test';
import assert from 'node:assert/strict';
import {createStoryDirector} from '../src/story-director.js';
import {createState} from '../src/game-model.js';

function fixture(){
 const nodes=new Map();
 globalThis.document={getElementById(id){if(!nodes.has(id))nodes.set(id,{style:{},hidden:true,textContent:''});return nodes.get(id);}};
 let state=createState(),ended=0,saves=0,replies=0;const notes=[];
 const director=createStoryDirector({getState:()=>state,audio:{note(...n){notes.push(n);},chime(){}},caption(){},toast(){},save(){saves++;},project(){},getLightTargets:()=>[],onReply(){replies++;},onOpeningStart(){},onOpeningEnd(){ended++;},onBranchStart(){}});
 return {director,nodes,notes,get replies(){return replies;},get state(){return state;},replace(s){state=s;},get ended(){return ended;},get saves(){return saves;}};
}

test('restored memory pose is presented immediately without reopening its branch',()=>{
 const f=fixture();f.director.exitBranch();const restored=createState();restored.story.memoryBloom=.38;f.replace(restored);
 assert.equal(f.director.presentation.memoryBloom,.38);restored.story.memoryBloom=.63;assert.equal(f.director.presentation.memoryBloom,.63);
});
test('cancelled opening is distinct from a watched or skipped opening',()=>{
 const f=fixture();f.director.startOpening();f.director.cancelOpening();assert.equal(f.director.opening,null);assert.equal(f.state.story.introSeen,false);assert.equal(f.ended,0);assert.equal(f.saves,0);
 f.director.startOpening();f.director.finishOpening();assert.equal(f.state.story.introSeen,true);assert.equal(f.ended,1);assert.equal(f.saves,1);assert.equal(f.nodes.get('opening').hidden,true);
});
test('all six opening scenes leave an existing journey and its decisions intact',()=>{
 const f=fixture();f.state.player={x:0,z:-43,safe:'finale'};f.state.p1.solved=true;f.state.bridge.solved=true;f.state.cores=['memory','season'];const before=structuredClone(f.state);
 f.director.startOpening();for(let i=0;i<6;i++){assert.equal(f.director.opening.index,i);f.director.nextOpening();}
 const after=structuredClone(f.state);after.story.introSeen=before.story.introSeen;assert.deepEqual(after,before);assert.equal(f.ended,1);
});

test('farewell answers actual notes once and cancellation stops pending reply',()=>{
 const f=fixture();f.state.companion.awakened=true;f.director.playFarewell();for(let i=0;i<70;i++)f.director.update(.05,{});
 assert.equal(f.notes.length,4);assert.equal(f.replies,1);for(let i=0;i<40;i++)f.director.update(.05,{});assert.equal(f.replies,1);
 f.director.playFarewell();f.director.update(.05,{});f.director.exitBranch();for(let i=0;i<80;i++)f.director.update(.05,{});assert.equal(f.replies,1);
 const quiet=fixture();quiet.director.playFarewell();for(let i=0;i<80;i++)quiet.director.update(.05,{});assert.equal(quiet.notes.length,3);assert.equal(quiet.replies,0);
});
