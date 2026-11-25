import test from 'node:test';
import assert from 'node:assert/strict';
import {createStory,restoreStory,appendBeat,commitMotif,scanInscription,observeMemory,commitMemory} from '../src/story-model.js';
import {createState,restore,serialize} from '../src/game-model.js';

test('a personal six-beat phrase needs sound but has no prescribed cup pattern or final rest',()=>{
 const s=createStory();for(const n of [0,0,0,0,0,0])appendBeat(s,n);assert.equal(commitMotif(s).ok,false);assert.equal(s.branches.rhythm,false);
 s.motif=[];for(const n of [1,1,1,1,1,1])appendBeat(s,n);assert.equal(commitMotif(s).ok,true);assert.equal(restoreStory(s).branches.rhythm,true);assert.equal(appendBeat(s,2).ok,false);
 const t=createStory();for(const n of [0,2,0,2,1,0])appendBeat(t,n);assert.equal(commitMotif(t).ok,true);
});
test('motif rejects invalid inputs and overlong phrases without changing existing music',()=>{
 const s=createStory();for(const n of [NaN,-1,3,'1'])assert.equal(appendBeat(s,n).ok,false);assert.deepEqual(s.motif,[]);for(const n of [1,2,0,1,2,0])appendBeat(s,n);assert.equal(appendBeat(s,1).ok,false);assert.equal(s.motif.length,6);
});
test('each of three inscriptions requires sustained light; pointing elsewhere resets only the unfinished hold',()=>{
 const s=createStory();scanInscription(s,0,9);assert.equal(s.lightFound[0],false);for(let i=0;i<14;i++)scanInscription(s,0,.05);assert.equal(s.lightFound[0],true);for(let i=0;i<7;i++)scanInscription(s,1,.05);scanInscription(s,null,.05);assert.equal(s.lightHold[1],0);
 for(const id of [1,2])for(let i=0;i<15;i++)scanInscription(s,id,.05);assert.equal(s.branches.light,true);
});
test('memory requires seeing both contrasting states before choosing an intermediate living pose',()=>{
 const s=createStory();assert.equal(commitMemory(s,.5).ok,false);for(let i=0;i<15;i++)observeMemory(s,.05,.05);assert.equal(s.memorySeen.closed,true);assert.equal(commitMemory(s,.5).ok,false);for(let i=0;i<15;i++)observeMemory(s,.95,.05);assert.equal(s.memorySeen.open,true);assert.equal(commitMemory(s,1).ok,false);assert.equal(commitMemory(s,.46).ok,true);assert.equal(s.memoryBloom,.46);assert.equal(s.branches.memory,true);
});
test('corrupt stories cannot claim completed rewards, and a valid partial story can resume safely',()=>{
 const broken=restoreStory({branches:{rhythm:true,light:true,memory:true},motif:[9],lightFound:[true],memoryBloom:NaN});assert.deepEqual(broken.branches,{rhythm:false,light:false,memory:false});
 const s=createStory();s.introSeen=true;for(const n of [1,2,0,2,1,0])appendBeat(s,n);commitMotif(s);s.lightFound[0]=true;s.lightHold[1]=.3;const r=restoreStory(s);assert.equal(r.branches.rhythm,true);assert.deepEqual(r.lightFound,[true,false,false]);assert.equal(r.lightHold[1],0);assert.equal(r.introSeen,true);
});
test('story progress survives the existing version-one save without inventing core allocations or blocking old saves',()=>{
 const s=createState();s.story=createStory();for(const n of [1,2,0,2,1,0])appendBeat(s.story,n);commitMotif(s.story);const r=restore(serialize(s));assert.equal(r.story.branches.rhythm,true);assert.deepEqual(r.cores,[null,null]);const old=JSON.parse(serialize(s));delete old.story;old.p1.solved=true;assert.equal(restore(JSON.stringify(old)).story.introSeen,true);
});
