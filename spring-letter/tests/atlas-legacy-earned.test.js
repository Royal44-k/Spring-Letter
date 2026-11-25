import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {restore,serialize} from '../src/game-model.js';
import {atlasCommand} from '../src/atlas-model.js';
import {createSaveService} from '../src/save-service.js';

// Actual keyboard/pointer-earned v0.8 archives, frozen with source hashes. No
// progress is manufactured for this compatibility test.
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/v11-earned-archives.json',import.meta.url),'utf8'));
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};
const earned=s=>({ending:s.ending,lettersSent:s.lettersSent??null,letter:s.voyage.letter,stage:s.voyage.stage,predecessor:s.voyage.predecessor,oldRead:s.voyage.oldRead,ropes:s.voyage.ropes,sail:s.voyage.sail,distance:s.voyage.distance});

for(const [name,{archive}] of Object.entries(fixtures))test(`${name}: real v0.8 sealed letter and earned voyage survive independent maps and archive round trip`,()=>{
 const old=JSON.parse(archive.data.journey);assert.equal(old.atlas,undefined);assert.equal(old.voyage.letter.sealed,true);
 const service=createSaveService(memory());assert.equal(service.importArchive(JSON.stringify(archive)).ok,true);
 let game=restore(service.read().data.journey);assert.deepEqual(earned(game),earned(old));
 assert.deepEqual(game.atlas.visited,[]);assert.deepEqual(game.atlas.completed,[]);
 for(const id of ['conservatory','observatory','meadow']){
  game.atlas=atlasCommand(game.atlas,'enter',{id}).state;
  assert.equal(service.commit({journey:serialize(game)}).ok,true);
  game=restore(service.read().data.journey);assert.equal(game.atlas.location,id);assert.deepEqual(earned(game),earned(old));
  game.atlas=atlasCommand(game.atlas,'leave').state;
 }
 assert.deepEqual(game.atlas.visited,['conservatory','observatory','meadow']);assert.deepEqual(game.atlas.completed,[]);
 assert.equal(service.commit({journey:serialize(game)}).ok,true);
 assert.equal(service.read().data.beforeLetter,archive.data.beforeLetter,'visits do not rewrite the pre-letter checkpoint');
 const second=createSaveService(memory());assert.equal(second.importArchive(service.exportArchive().text).ok,true);
 const final=restore(second.read().data.journey);assert.deepEqual(earned(final),earned(old));assert.equal(final.atlas.location,null);
 assert.equal(second.read().data.beforeLetter,archive.data.beforeLetter);
});
