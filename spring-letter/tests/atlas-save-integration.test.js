import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,restore,serialize} from '../src/game-model.js';
import {createSaveService,ARCHIVE_FORMAT} from '../src/save-service.js';
const api=await import('../src/atlas-model.js').catch(()=>({}));
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};};

test('old coastal and completed journeys gain unvisited maps without changing their letters or ending',()=>{
 const old=createState();delete old.atlas;old.started=true;old.p1.solved=old.wind.solved=old.bridge.solved=true;old.cores=['memory','season'];old.ending='memory+season';
 const s=restore(JSON.stringify(old));assert.equal(s.ending,'memory+season');assert.deepEqual(s.voyage,old.voyage);assert.ok(s.atlas);assert.equal(s.atlas.location,null);assert.deepEqual(s.atlas.completed,[]);assert.deepEqual(s.atlas.visited,[]);
});

test('normal journey serialization retains a mid-map position and every independent puzzle',()=>{
 assert.equal(typeof api.createAtlasState,'function');const s=createState();s.started=true;s.atlas=api.atlasCommand(api.createAtlasState(),'enter',{id:'observatory'}).state;
 s.atlas.player={x:0,y:1.8,z:-18,vy:0,grounded:true,gliding:false};s.atlas.stars=[0,1,2];s.atlas.blooms=[1,.4,0];s.atlas.meadowCheckpoint=2;
 const r=restore(serialize(s));assert.equal(r.atlas.location,'observatory');assert.equal(r.atlas.player.z,-18);assert.deepEqual(r.atlas.stars,[0,1,2]);assert.deepEqual(r.atlas.blooms,[1,.4,0]);assert.equal(r.atlas.meadowCheckpoint,2);
});

test('archive import rejects a future atlas schema in journeys and before-letter checkpoints',()=>{
 const service=createSaveService(storage());
 for(const part of ['journey','beforeLetter']){const raw=JSON.parse(serialize(createState()));raw.atlas={version:2};const data={journey:serialize(createState()),[part]:JSON.stringify(raw)};assert.equal(service.previewImport(JSON.stringify({format:ARCHIVE_FORMAT,version:1,data})).code,'unsupported');}
});

test('archive summary names the current new map and counts earned discoveries',()=>{
 const service=createSaveService(storage()),s=createState();s.started=true;s.atlas={version:1,location:'observatory',completed:['conservatory'],blooms:[1,1,1],visited:['conservatory','observatory']};
 const result=service.commit({journey:JSON.stringify(s)});assert.equal(result.ok,true);assert.equal(result.summary.chapterLabel,'沉星天文台');assert.equal(result.summary.atlasCompleted,1);
});

test('export and import retain a new-map visit beside a legacy sealed coastal letter',()=>{
 const s=createState();s.started=true;s.p1.solved=s.wind.solved=s.bridge.solved=true;s.cores=['memory','season'];
 s.voyage.stage='writing';s.voyage.letter={recipient:'明年的我',body:'窗前的花开了。\n请记得今天。',sealed:true,sealKind:'iris'};
 s.atlas=api.atlasCommand(s.atlas,'enter',{id:'conservatory'}).state;s.atlas.blooms=[1,.5,0];s.atlas.player.x=-6;
 const source=createSaveService(storage()),destination=createSaveService(storage());assert.equal(source.commit({journey:serialize(s)}).ok,true);
 assert.equal(destination.importArchive(source.exportArchive().text).ok,true);
 const loaded=restore(destination.read().data.journey);assert.deepEqual(loaded.voyage.letter,s.voyage.letter);assert.equal(loaded.voyage.stage,'writing');assert.equal(loaded.atlas.location,'conservatory');assert.equal(loaded.atlas.player.x,-6);assert.deepEqual(loaded.atlas.blooms,[1,.5,0]);
});
