import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createState,serialize,restore,commitLetter,SAVE_KEY} from '../src/game-model.js';
import {createSaveService,ARCHIVE_KEY} from '../src/save-service.js';
import {atlasComplete} from '../src/atlas-model.js';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const begin=source.indexOf('function depart('),production=source.slice(begin,source.indexOf('\nfunction ',begin+1));
const routeBegin=source.indexOf('function continueToCoast('),productionRoute=source.slice(routeBegin,source.indexOf('\nfunction ',routeBegin+1));
const rewindBegin=source.indexOf('function rewindLetter('),productionRewind=source.slice(rewindBegin,source.indexOf('\nfunction ',rewindBegin+1));
const finishBegin=source.indexOf('function finishVoyage(');assert.ok(finishBegin>=0,'completion uses a named production transaction');
const productionFinish=source.slice(finishBegin,source.indexOf('\nfunction ',finishBegin+1));
const saveBegin=source.indexOf('function save('),productionSave=source.slice(saveBegin,source.indexOf('\nfunction ',saveBegin+1));
const coastStart=source.indexOf('voyage=createVoyageController('),onStartBegin=source.indexOf('onStart:()=>{',coastStart)+'onStart:()=>{'.length;
const productionOnStart='function resumeCoast(){'+source.slice(onStartBegin,source.indexOf('},onExit:',onStartBegin))+'}';
function fixture(){
 const map=new Map(),storage={getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
 const service=createSaveService(storage),state=createState();state.started=true;state.p1.solved=state.wind.solved=state.bridge.solved=true;state.cores=['memory','season'];state.letters.entries.rain.choice='tree';
 // These tests isolate the existing coastal transaction, after the new route.
 state.atlas.blooms=[1,1,1];state.atlas.stars=[0,1,2,3,4,0,5,2];state.atlas.meadowCheckpoint=4;state.atlas.completed=['conservatory','observatory','meadow'];
 service.commit({journey:serialize(state)});const signals=[],failures=[];
 const context={state,createState,serialize,restore,commitLetter,structuredClone,SAVE_KEY,storageGet:key=>key===SAVE_KEY+':before-letter'?service.read().data?.beforeLetter:null,saveService:service,resonance:{persist:()=>' {"version":1,"records":{}}'},voyage:{start:()=>signals.push(['voyage-start'])},lastSaveResult:null,time:100,endingRevealAt:0,toast:text=>signals.push(['toast',text]),exitFocus:()=>signals.push(['exit']),closeModal:()=>signals.push(['close']),delivery:{restoreCarried:id=>signals.push(['carried',id])},audio:{chime:()=>signals.push(['chime'])},storyDirector:{playFarewell:()=>signals.push(['farewell'])},caption:()=>signals.push(['caption']),savePanel:{notifyFailure:r=>failures.push(r),show:()=>signals.push(['save-panel'])}};
 Object.assign(context,{atlas:null,atlasComplete,mode:'play',syncStorageNotice(){},clearInput(){},focus:null,scatterTarget:0,scatter:0,flowerCycle:{reset(){},state:{}},flowerState:null,setNight(){},$:()=>({hidden:false,textContent:''}),document:{body:{classList:{add(){}}}}});
 vm.createContext(context);vm.runInContext([production,productionRoute,productionFinish,productionRewind,productionSave,productionOnStart].join('\n'),context);return {context,storage,service,signals,failures};
}
function arriveAtDawn(f){
 const v=f.context.state.voyage;v.stage='complete';v.letter={recipient:'未来收到这封信的人',body:'愿海风带来一个开花的清晨。',sealed:true,sealKind:'iris'};
 v.oldRead=v.predecessor=true;v.ropes=[true,true];v.sail=1;v.distance=150;v.boat={x:3,z:-179,heading:0,speed:0};v.player={x:3,z:-179};
}
function complete(f){f.context.depart();arriveAtDawn(f);assert.equal(f.context.finishVoyage(),true);}

test('departing atomically saves the pre-letter checkpoint before opening the coast and does not grant an ending',()=>{
 const f=fixture(),before=serialize(f.context.state);f.context.depart();const archive=f.service.read();
 assert.equal(archive.data.beforeLetter,before);assert.equal(archive.data.journey,before);assert.equal(f.context.state.ending,null);assert.equal(f.context.state.lettersSent,null);
 assert.equal(f.context.endingRevealAt,0);assert.ok(f.signals.some(([name])=>name==='voyage-start'));assert.ok(!f.signals.some(([name])=>name==='farewell'));
});

test('a failed departure write leaves live progress and the previous archive untouched and does not open the coast',()=>{
 const f=fixture(),before=f.storage.getItem(ARCHIVE_KEY),live=serialize(f.context.state),write=f.storage.setItem;
 f.storage.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');return write(key,value);};f.context.depart();
 assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.context.endingRevealAt,0);assert.equal(f.failures[0].code,'write');assert.ok(!f.signals.some(([name])=>['voyage-start','farewell','chime','exit'].includes(name)));assert.ok(f.signals.some(([name])=>name==='save-panel'));
});

test('a conflicting tab cannot be overwritten by sending a letter or by a partial checkpoint commit',()=>{
 const f=fixture(),other=createSaveService(f.storage);other.read();other.commit({preferences:'{"muted":true}'});const before=f.storage.getItem(ARCHIVE_KEY);
 f.context.depart();assert.equal(f.failures[0].code,'conflict');assert.equal(f.context.state.ending,null);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.context.endingRevealAt,0);
 assert.ok(!f.signals.some(([name])=>name==='voyage-start'));
});

test('revisiting the coast preserves the first pre-letter checkpoint rather than replacing it with mid-voyage progress',()=>{
 const f=fixture(),before=serialize(f.context.state);f.context.depart();f.context.state.voyage.stage='writing';f.context.state.voyage.letter.body='尚未封缄的新句子';
 f.context.depart();const archive=f.service.read();assert.equal(archive.data.beforeLetter,before);assert.equal(JSON.parse(archive.data.journey).voyage.letter.body,'尚未封缄的新句子');
});

test('finishing freezes the exact replies and personal letter after the completion transaction, retaining the original checkpoint',()=>{
 const f=fixture(),before=serialize(f.context.state);f.context.depart();arriveAtDawn(f);assert.equal(f.context.finishVoyage(),true);const archive=f.service.read(),saved=JSON.parse(archive.data.journey);
 assert.equal(archive.data.beforeLetter,before);assert.equal(saved.ending,'memory+season');assert.equal(saved.lettersSent.entries.rain.choice,'tree');assert.equal(saved.voyage.letter.recipient,'未来收到这封信的人');assert.equal(saved.voyage.stage,'complete');
 assert.equal(f.context.state.ending,'memory+season');f.context.state.letters.entries.rain.choice='shoot';assert.equal(f.context.state.lettersSent.entries.rain.choice,'tree');
 const stored=f.storage.getItem(ARCHIVE_KEY);assert.equal(f.context.finishVoyage(),true);assert.equal(f.storage.getItem(ARCHIVE_KEY),stored,'replaying the ending must not rewrite the completed archive');
});

test('a premature completion request cannot freeze replies or create an ending',()=>{
 const f=fixture();f.context.depart();f.context.state.voyage.stage='sailing';const before=f.storage.getItem(ARCHIVE_KEY),live=serialize(f.context.state);
 assert.equal(f.context.finishVoyage(),false);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(serialize(f.context.state),live);
});

test('completion quota failure cannot assign a live ending or replace the authoritative archive',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const before=f.storage.getItem(ARCHIVE_KEY),live=serialize(f.context.state),write=f.storage.setItem;
 f.storage.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');return write(key,value);};assert.equal(f.context.finishVoyage(),false);
 assert.equal(f.failures[0].code,'write');assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.context.state.lettersSent,null);assert.ok(f.signals.some(([name])=>name==='save-panel'));
});

test('completion conflicts preserve both the other tab archive and this tab live unsent state',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const live=serialize(f.context.state),other=createSaveService(f.storage);other.read();other.commit({preferences:'{"muted":true}'});const before=f.storage.getItem(ARCHIVE_KEY);
 assert.equal(f.context.finishVoyage(),false);assert.equal(f.failures[0].code,'conflict');assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.context.state.ending,null);
});

test('legacy completed journeys acquire an independent reply snapshot instead of changing when later replies are added',()=>{
 const old=createState();old.started=true;old.p1.solved=old.wind.solved=old.bridge.solved=true;old.cores=['memory','voyage'];old.ending='memory+voyage';delete old.letters;delete old.lettersSent;
 const revived=restore(JSON.stringify(old));assert.ok(revived.lettersSent);assert.equal(revived.lettersSent.entries.rain.choice,null);
 revived.letters.entries.rain.choice='shoot';assert.equal(revived.lettersSent.entries.rain.choice,null);assert.equal(restore(serialize(revived)).lettersSent.entries.rain.choice,null);
});

test('rewinding clears the ending only after saving and retains the exact original before-letter checkpoint',()=>{
 const f=fixture(),checkpoint=serialize(f.context.state);complete(f);f.context.state.settings.muted=true;f.signals.length=0;
 f.context.rewindLetter();const archive=f.service.read();
 assert.equal(f.context.state.ending,null);assert.equal(f.context.state.lettersSent,null);assert.equal(f.context.state.settings.muted,true);assert.equal(f.context.endingRevealAt,0);
 assert.equal(archive.data.beforeLetter,checkpoint);assert.equal(JSON.parse(archive.data.journey).ending,null);assert.equal(JSON.parse(archive.data.preferences).muted,true);
 assert.ok(f.signals.some(([name])=>name==='carried'));assert.ok(f.signals.some(([name])=>name==='close'));
});

test('rewind quota failure preserves the current ending, live state and saved checkpoint',()=>{
 const f=fixture();complete(f);const before=f.storage.getItem(ARCHIVE_KEY),live=serialize(f.context.state),reveal=f.context.endingRevealAt,write=f.storage.setItem;f.signals.length=0;
 f.storage.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');return write(key,value);};f.context.rewindLetter();
 assert.equal(f.failures[0].code,'write');assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.context.endingRevealAt,reveal);
 assert.ok(!f.signals.some(([name])=>['carried','close','exit','caption'].includes(name)));
});

test('rewind conflict cannot switch the player to another tab checkpoint even though status reads see it',()=>{
 const f=fixture();complete(f);const live=serialize(f.context.state),other=createSaveService(f.storage);other.read();
 const different=restore(f.service.read().data.beforeLetter);different.cores=['season','voyage'];different.letters.entries.rain.choice='shoot';
 other.commit({beforeLetter:serialize(different)});const before=f.storage.getItem(ARCHIVE_KEY);f.signals.length=0;
 f.context.rewindLetter();assert.equal(f.failures[0].code,'conflict');assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);
 assert.ok(!f.signals.some(([name])=>['carried','close','exit','caption'].includes(name)));
});

test('revisiting a completed coast retries the failed final transaction once after storage recovers',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const checkpoint=f.service.read().data.beforeLetter,write=f.storage.setItem;
 f.storage.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');return write(key,value);};assert.equal(f.context.finishVoyage(),false);
 f.storage.setItem=write;const commit=f.service.commit;let attempts=0;f.service.commit=(...args)=>{attempts++;return commit(...args);};
 f.context.resumeCoast();assert.equal(attempts,1);assert.equal(f.context.state.ending,'memory+season');assert.equal(f.context.state.lettersSent.entries.rain.choice,'tree');assert.equal(f.service.read().data.beforeLetter,checkpoint);
 f.context.resumeCoast();assert.equal(attempts,1,'an already finalized ending needs no retry');
});

test('ordinary autosave finalizes a pending completed voyage in its single atomic write',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const checkpoint=f.service.read().data.beforeLetter,commit=f.service.commit;let attempts=0;
 f.service.commit=(...args)=>{attempts++;return commit(...args);};const result=f.context.save();
 assert.equal(result.ok,true);assert.equal(attempts,1);assert.equal(f.context.state.ending,'memory+season');assert.equal(JSON.parse(f.service.read().data.journey).lettersSent.entries.rain.choice,'tree');assert.equal(f.service.read().data.beforeLetter,checkpoint);
});

test('resume and autosave cannot resolve an unacknowledged cross-tab conflict by overwriting it',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const other=createSaveService(f.storage);other.read();other.commit({preferences:'{"muted":true}'});const before=f.storage.getItem(ARCHIVE_KEY),live=serialize(f.context.state),commit=f.service.commit;let attempts=0;
 f.service.commit=(...args)=>{attempts++;return commit(...args);};f.context.resumeCoast();assert.equal(attempts,1);assert.equal(f.context.lastSaveResult.code,'conflict');assert.equal(serialize(f.context.state),live);
 const result=f.context.save();assert.equal(attempts,2,'one attempt per explicit boundary, with no recursive retry');assert.equal(result.code,'conflict');assert.equal(serialize(f.context.state),live);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);
});

test('restoring a saved complete voyage without the final snapshot finishes at the next coastal entry',()=>{
 const f=fixture();f.context.depart();arriveAtDawn(f);const checkpoint=f.service.read().data.beforeLetter;
 f.service.commit({journey:serialize(f.context.state)});f.context.state=restore(f.service.reload().data.journey);assert.equal(f.context.state.voyage.stage,'complete');assert.equal(f.context.state.ending,null);
 f.context.resumeCoast();assert.equal(f.context.state.ending,'memory+season');assert.equal(f.service.read().data.beforeLetter,checkpoint);
});

test('rewinding a completed imported journey without a usable checkpoint clears the coastal completion before autosaving',()=>{
 for(const beforeLetter of [null,serialize(createState())]){
  const f=fixture();complete(f);f.service.commit({beforeLetter});f.context.rewindLetter();
  assert.equal(f.context.state.voyage.stage,'idle');assert.equal(f.context.state.ending,null);assert.equal(f.context.state.lettersSent,null);
  assert.equal(f.context.save().ok,true);assert.equal(f.context.state.ending,null,'ordinary save cannot undo the intentional rewind');
  const saved=JSON.parse(f.service.read().data.journey);assert.equal(saved.voyage.stage,'idle');assert.equal(saved.ending,null);
 }
});
