import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createMoments,restoreMoments,safeArtwork,momentText,momentLetter} from '../src/moments-state.js';
import {createState,serialize,restore,commitLetter} from '../src/game-model.js';
import {LETTERS,createLetters,restoreLetters} from '../src/letter-model.js';
import {createSaveService,ARCHIVE_KEY,ARCHIVE_FORMAT} from '../src/save-service.js';
import {postcardLines} from '../src/postcard.js';
import {RAIN_PANES,createRainDraft,restoreRainDraft,evaluateRainDraft} from '../src/moment-rain.js';
import {restoreWindState} from '../src/moment-wind.js';
import {createTideScore,editTideNote,startTidePlayback,stepTidePlayback,tideDraft,restoreTideScore,tideScoreReady} from '../src/moment-tide.js';

const copy=value=>JSON.parse(JSON.stringify(value));
const storage=()=>{const map=new Map();return {map,getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};};
const envelope=data=>JSON.stringify({format:ARCHIVE_FORMAT,version:1,savedAt:1234,data});
const windDraft=()=>({version:1,distance:29,x:.8,y:3.1,vx:0,vy:0,gate:2,checkpoint:2,launched:false,completed:false,misses:1,elapsed:14,recover:0,lastMiss:null});
const tideArtwork=()=>{const score=createTideScore();editTideNote(score,0,0,true);editTideNote(score,1,2,true);editTideNote(score,2,5,true);startTidePlayback(score);for(let i=0;i<110;i++)stepTidePlayback(score,.05);assert.equal(tideScoreReady(score),true);return tideDraft(score);};
const rainArtwork=()=>{const draft=createRainDraft();for(const p of RAIN_PANES)draft.positions[p.id]={x:p.target[0],y:p.target[1]};return draft;};
function withArtwork(){const s=createState();s.started=true;s.moments.entries.wind.draft=windDraft();s.moments.entries.tide={completed:true,draft:tideArtwork()};Object.assign(s.letters.entries.tide,{choice:'new',edition:2,artwork:tideArtwork(),read:true});return s;}

test('new moment state owns three independent unfinished drafts and never aliases another journey',()=>{
 const a=createMoments(),b=createMoments();assert.deepEqual(Object.keys(a.entries),['rain','wind','tide']);
 for(const id of ['rain','wind','tide'])assert.deepEqual(a.entries[id],{draft:null,completed:false});
 a.entries.rain.draft={version:1,x:2};a.entries.wind.completed=true;
 assert.equal(b.entries.rain.draft,null);assert.equal(b.entries.wind.completed,false);assert.equal(a.entries.tide.completed,false);
});

test('restoring moments copies artwork, accepts only explicit completion and ignores unknown gardens',()=>{
 const input={version:1,entries:{rain:{draft:{version:1,points:[[1,2,3]]},completed:1},wind:{draft:windDraft(),completed:true},tide:null,extra:{completed:true}}};
 const result=restoreMoments(input);assert.equal(result.entries.rain.completed,false);assert.equal(result.entries.wind.completed,true);assert.deepEqual(result.entries.tide,{draft:null,completed:false});assert.equal(result.entries.extra,undefined);
 input.entries.rain.draft.points[0][0]=900;assert.equal(result.entries.rain.draft.points[0][0],1);
 for(const bad of [null,[],{},false,{version:2,entries:input.entries}])assert.deepEqual(restoreMoments(bad),createMoments());
});

test('artwork snapshotting bounds records and handles cyclic or nonserializable values without retaining references',()=>{
 const cyclic={};cyclic.self=cyclic;const malicious={toJSON(){throw Error('invalid artwork');}};
 for(const bad of [cyclic,malicious,1n,undefined,()=>0])assert.equal(safeArtwork(bad),null);
 assert.equal(safeArtwork('x'.repeat(23997)).length,23997);assert.equal(safeArtwork('x'.repeat(23998)),null);
 const original={notes:[0,null,{voice:'glass',tone:3}]},snapshot=safeArtwork(original);original.notes[2].tone=7;assert.equal(snapshot.notes[2].tone,3);
});

test('legacy rotor progress retains its own replies but never pre-completes the new experiences',()=>{
 const old=createState();delete old.moments;old.started=true;old.p1.solved=old.wind.solved=true;
 old.letters.entries.rain.choice='tree';old.letters.entries.wind.choice='sail';old.letters.entries.rain.turns.b=3;
 const restored=restore(JSON.stringify(old));assert.deepEqual(restored.moments,createMoments());
 assert.equal(restored.letters.entries.rain.choice,'tree');assert.equal(restored.letters.entries.wind.choice,'sail');assert.equal(restored.letters.entries.rain.turns.b,3);
 assert.equal(restored.letters.entries.rain.edition,undefined);assert.equal(postcardLines(restored.letters)[0].choice,'先浇老树');
});

test('journey round trips retain an unfinished flight and committed composition as distinct copied records',()=>{
 const s=withArtwork(),restored=restore(serialize(s));assert.deepEqual(restored.moments,s.moments);assert.deepEqual(restored.letters.entries.tide.artwork,s.letters.entries.tide.artwork);assert.equal(restored.letters.entries.tide.edition,2);
 restored.moments.entries.tide.draft.notes[0][0]=false;
 assert.equal(restored.letters.entries.tide.artwork.notes[0][0],true);assert.equal(s.moments.entries.tide.draft.notes[0][0],true);
 restored.letters.entries.tide.artwork.notes[1][1]=true;assert.equal(s.letters.entries.tide.artwork.notes[1][1],false);
});

test('all real activity drafts survive archive restoration and remain usable by their respective stage rules',()=>{
 const s=withArtwork();s.moments.entries.rain.draft=rainArtwork();const service=createSaveService(storage());assert.equal(service.commit({journey:serialize(s)}).ok,true);
 const restored=restore(service.read().data.journey);assert.equal(evaluateRainDraft(restoreRainDraft(restored.moments.entries.rain.draft)).ready,true);
 const wind=restoreWindState(restored.moments.entries.wind.draft);assert.equal(wind.gate,2);assert.equal(wind.distance,29);assert.equal(wind.launched,false);
 assert.equal(tideScoreReady(restoreTideScore(restored.moments.entries.tide.draft)),true);assert.equal(tideScoreReady(restoreTideScore(restored.letters.entries.tide.artwork)),true);
});

test('edition two records preserve valid replies and artworks without converting old choices',()=>{
 const letters=createLetters();Object.assign(letters.entries.rain,{choice:'tree',read:true});Object.assign(letters.entries.wind,{choice:'lamp',edition:2,artwork:windDraft()});Object.assign(letters.entries.tide,{choice:'injected',edition:2,artwork:tideArtwork()});
 const restored=restoreLetters(letters),rows=postcardLines(restored);
 assert.equal(restored.entries.rain.edition,undefined);assert.equal(restored.entries.wind.edition,2);assert.deepEqual(restored.entries.wind.artwork,windDraft());assert.equal(restored.entries.tide.choice,null);
 assert.equal(rows[0].title,LETTERS[0].title);assert.equal(rows[0].choice,'先浇老树');assert.equal(rows[1].title,momentText('wind').title);assert.equal(rows[1].choice,momentText('wind').goals[0].title);assert.equal(rows[2].written,false);
 const model=momentLetter(LETTERS[1],restored.entries.wind);assert.equal(model.replies.lamp,momentText('wind').replies.lamp);assert.equal(model.x,LETTERS[1].x);assert.equal(LETTERS[1].title,'夜渡之前');
});

test('unwritten entries describe the current experiences while actual old replies retain their original language',()=>{
 for(const letter of LETTERS){assert.equal(momentLetter(letter,{choice:null}).title,momentText(letter.id).title,letter.id+' must not offer an obsolete rotor task');assert.equal(momentLetter(letter,{choice:letter.goals[0].id}).title,letter.title);}
});

test('sending a spring letter freezes edition and artwork independently from later edits or restarts',()=>{
 const s=withArtwork();s.p1.solved=s.wind.solved=s.bridge.solved=true;s.cores=['memory','voyage'];assert.equal(commitLetter(s).ok,true);
 const sent=copy(s.lettersSent);s.letters.entries.tide.choice='old';s.letters.entries.tide.artwork.notes[0][0]=false;s.moments.entries.tide.draft.notes[0][0]=false;
 assert.deepEqual(s.lettersSent,sent);assert.equal(s.lettersSent.entries.tide.edition,2);assert.equal(postcardLines(s.lettersSent)[2].choice,momentText('tide').goals[1].title);
 const reopened=restore(serialize(s));assert.deepEqual(reopened.lettersSent,sent);assert.equal(postcardLines(reopened.lettersSent)[2].choice,momentText('tide').goals[1].title);
});

test('export, preview and import preserve both partial drafts and committed artworks in journey and checkpoint',()=>{
 const memory=storage(),service=createSaveService(memory),journey=serialize(withArtwork()),checkpoint=createState();checkpoint.started=true;
 checkpoint.moments.entries.wind.draft={...windDraft(),distance:13,gate:1,checkpoint:1};
 const beforeLetter=serialize(checkpoint);assert.equal(service.commit({journey,beforeLetter}).ok,true);const before=new Map(memory.map),exported=service.exportArchive();assert.equal(exported.ok,true);
 const preview=service.previewImport(exported.text);assert.equal(preview.ok,true);assert.deepEqual(memory.map,before);assert.equal(preview.data.journey,journey);assert.equal(preview.data.beforeLetter,beforeLetter);
 const other=createSaveService(storage());assert.equal(other.importArchive(exported.text).ok,true);assert.equal(other.read().data.journey,journey);assert.equal(other.read().data.beforeLetter,beforeLetter);
});

test('future moments container versions are rejected in active journeys and rewind checkpoints without writes',()=>{
 for(const part of ['journey','beforeLetter']){const memory=storage(),service=createSaveService(memory),base=serialize(createState());service.commit({journey:base});const before=new Map(memory.map),future=createState();future.moments.version=2;
  const text=envelope({journey:base,[part]:serialize(future)});assert.equal(service.previewImport(text).code,'unsupported');assert.equal(service.importArchive(text).code,'unsupported');assert.deepEqual(memory.map,before);
 }
});

test('future known draft schemas cannot import successfully and then disappear when a stage restores',()=>{
 for(const part of ['journey','beforeLetter'])for(const id of ['rain','wind','tide']){const memory=storage(),service=createSaveService(memory),base=serialize(createState());service.commit({journey:base});const before=new Map(memory.map),future=createState();future.moments.entries[id].draft={version:2,preserved:'from a newer edition'};
  const text=envelope({journey:base,[part]:serialize(future)});assert.equal(service.previewImport(text).code,'unsupported',part+'.moments.entries.'+id+'.draft');assert.equal(service.importArchive(text).ok,false);assert.deepEqual(memory.map,before);
 }
});

test('future reply editions and artwork versions cannot be silently downgraded to legacy text',()=>{
 for(const part of ['journey','beforeLetter'])for(const field of ['letters','lettersSent'])for(const futureKind of ['edition','artwork']){const memory=storage(),service=createSaveService(memory),base=serialize(createState());service.commit({journey:base});const before=new Map(memory.map),future=createState();future[field]=createLetters();Object.assign(future[field].entries.rain,{choice:'tree',edition:futureKind==='edition'?3:2,artwork:{version:futureKind==='artwork'?2:1}});
  const text=envelope({journey:base,[part]:serialize(future)});assert.equal(service.previewImport(text).code,'unsupported',part+'.'+field+'.'+futureKind);assert.equal(service.importArchive(text).ok,false);assert.deepEqual(memory.map,before);
 }
});

test('an oversized known artwork is rejected before import rather than silently disappearing during restore',()=>{
 const empty={version:1,payload:''},over={...empty,payload:'春'.repeat(24000-JSON.stringify(empty).length)},within={...empty,payload:'春'.repeat(23999-JSON.stringify(empty).length)};
 assert.equal(JSON.stringify(over).length,24000);assert.equal(JSON.stringify(within).length,23999);
 for(const part of ['journey','beforeLetter'])for(const field of ['moments','letters','lettersSent']){
  const memory=storage(),service=createSaveService(memory),base=serialize(createState());service.commit({journey:base});const before=new Map(memory.map),journey=createState();journey[field]??=createLetters();const entry=journey[field].entries.rain;
  if(field==='moments')entry.draft=over;else Object.assign(entry,{edition:2,choice:'tree',artwork:over});
  const text=envelope({journey:base,[part]:serialize(journey)});assert.equal(service.previewImport(text).code,'oversize',part+'.'+field);assert.equal(service.importArchive(text).ok,false);assert.deepEqual(memory.map,before);
  if(field==='moments')entry.draft=within;else entry.artwork=within;
  assert.equal(service.previewImport(envelope({journey:base,[part]:serialize(journey)})).ok,true,'a record under the artwork limit remains accepted');
 }
});

const mainSource=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const commitBegin=mainSource.indexOf('function commitMoment('),productionCommit=mainSource.slice(commitBegin,mainSource.indexOf('\nfunction ',commitBegin+1));
function transactionFixture(){
 assert.ok(commitBegin>=0,'production moment commit must exist');const memory=storage(),service=createSaveService(memory),state=createState();state.started=true;state.player={x:-12,z:-1,safe:'garden'};
 const checkpoint=serialize(state);service.commit({journey:checkpoint,beforeLetter:checkpoint});const failures=[],signals=[];
 const context={state,serialize,restore,momentText,safeArtwork,saveService:service,lastSaveResult:null,savePanel:{notifyFailure:r=>failures.push(r),show:()=>signals.push('save-panel')}};
 context.currentPayload=()=>({journey:serialize(context.state),preferences:JSON.stringify(context.state.settings)});vm.createContext(context);vm.runInContext(productionCommit,context);return {memory,service,context,failures,signals,checkpoint};
}

test('a committed experience saves the new reply, artwork and progression together before publishing live state',()=>{
 const f=transactionFixture(),draft=rainArtwork(),originalX=draft.positions.tree.x;const result=f.context.commitMoment('rain','tree',draft);assert.equal(result.ok,true);
 const saved=restore(f.service.read().data.journey);assert.equal(saved.moments.entries.rain.completed,true);assert.deepEqual(saved.moments.entries.rain.draft,draft);assert.equal(saved.letters.entries.rain.choice,'tree');assert.equal(saved.letters.entries.rain.edition,2);assert.deepEqual(saved.letters.entries.rain.artwork,draft);assert.equal(saved.p1.solved,true);assert.ok(saved.discoveries.includes('leaf'));assert.equal(f.service.read().data.beforeLetter,f.checkpoint);
 assert.equal(f.context.state.player.x,-12);draft.positions.tree.x=99;assert.equal(f.context.state.letters.entries.rain.artwork.positions.tree.x,originalX);assert.equal(f.context.state.moments.entries.rain.draft.positions.tree.x,originalX);
});

test('failed or conflicting reply writes cannot award a new chapter or replace the existing artwork',()=>{
 for(const failure of ['quota','conflict']){const f=transactionFixture(),live=serialize(f.context.state);if(failure==='quota'){const write=f.memory.setItem;f.memory.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');write(key,value);};}else{const other=createSaveService(f.memory);other.read();other.commit({preferences:'{"muted":true}'});}
  const before=f.memory.getItem(ARCHIVE_KEY),result=f.context.commitMoment('rain','shoot',{version:1,plates:[]});assert.equal(result.ok,false);assert.equal(result.code,failure==='quota'?'write':'conflict');assert.equal(serialize(f.context.state),live);assert.equal(f.memory.getItem(ARCHIVE_KEY),before);assert.equal(f.failures[0].code,result.code);assert.deepEqual(f.signals,['save-panel']);
 }
});

test('reply transactions retain personal audio levels in live state and subsequent preference saves',()=>{
 const f=transactionFixture();Object.assign(f.context.state.settings,{musicVolume:.27,sfxVolume:.63,ambienceVolume:.81});
 const before=JSON.stringify(f.context.state.settings);
 assert.equal(f.context.commitMoment('rain','tree',rainArtwork()).ok,true);
 assert.equal(JSON.stringify(f.context.state.settings),before);
 assert.equal(f.service.read().data.preferences,before);
 assert.equal(f.service.commit(f.context.currentPayload()).ok,true);
 assert.equal(f.service.read().data.preferences,before);
});

test('unknown reply destinations never write a new revision or mutate live state',()=>{
 const f=transactionFixture(),before=new Map(f.memory.map),live=serialize(f.context.state);
 for(const [id,choice] of [['rain','sail'],['unknown','tree'],['wind',null]])assert.equal(f.context.commitMoment(id,choice,{version:1}).ok,false);
 assert.deepEqual(f.memory.map,before);assert.equal(serialize(f.context.state),live);
});
