import test from 'node:test';
import assert from 'node:assert/strict';
import {createState} from '../src/game-model.js';

const module = await import('../src/save-service.js').catch(()=>({}));
const {createSaveService,ARCHIVE_KEY,PREVIOUS_KEY,RECOVERY_KEY,LEGACY_KEYS,ARCHIVE_FORMAT,MAX_ARCHIVE_BYTES}=module;
const storage=()=>{const map=new Map();return {map,getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};};
const journey=(changes={})=>JSON.stringify({...createState(),started:true,...changes});

test('a new journey is committed as one archive and remains available to a fresh service',()=>{
 assert.equal(typeof module.createSaveService,'function','the protective save service must exist');
 const memory=storage(),service=module.createSaveService(memory,{now:()=>1000});
 assert.equal(service.read().status,'empty');
 const raw=journey();assert.equal(service.commit({journey:raw},{reason:'new-journey'}).ok,true);
 const loaded=module.createSaveService(memory).read();
 assert.equal(loaded.status,'ready');assert.equal(loaded.data.journey,raw);assert.equal(loaded.summary.started,true);
});

test('all legacy slots migrate without read-side writes and preserve unknown journey content',()=>{
 const memory=storage(),data={journey:journey({letters:{version:1,entries:{},delivered:['rain'],draft:'后来者的春天'}}),preferences:JSON.stringify({muted:true,musicVolume:.2}),resonance:JSON.stringify({version:1,records:{dawn:{best:500,completions:1,grade:2,most:6}}}),beforeLetter:journey({p1:{solved:true}})};
 for(const [part,key] of Object.entries(LEGACY_KEYS))memory.setItem(key,data[part]);
 const service=createSaveService(memory);assert.equal(service.read().status,'legacy');assert.equal(memory.map.has(ARCHIVE_KEY),false);
 assert.equal(service.commit({}).ok,true);assert.deepEqual(service.read().data,data);
 assert.deepEqual(JSON.parse(service.read().data.journey).letters,{version:1,entries:{},delivered:['rain'],draft:'后来者的春天'});
});

test('new journey preserves the whole previous journey and undo can restore every slot',()=>{
 const memory=storage(),service=createSaveService(memory);const old={journey:journey({p1:{solved:true}}),preferences:'{"muted":true}',resonance:'{"version":1,"records":{}}',beforeLetter:journey()};
 service.commit(old,{reason:'new-journey'});service.commit({journey:journey(),beforeLetter:null},{reason:'new-journey'});
 assert.equal(service.inspectBackup().data.journey,old.journey);
 assert.equal(service.restoreBackup().ok,true);assert.deepEqual(service.read().data,old);
 assert.equal(service.inspectBackup().data.beforeLetter,null,'restore itself retains the replaced journey as undo');
});

test('ordinary saving rolls recovery forward but never erases the fixed previous journey',()=>{
 const service=createSaveService(storage());const old=journey(),fresh=journey({p1:{solved:true}}),next=journey({p1:{solved:true},wind:{solved:true}});
 service.commit({journey:old},{reason:'new-journey'});service.commit({journey:fresh},{reason:'new-journey'});service.commit({journey:next});
 assert.equal(service.inspectBackup().data.journey,old);assert.equal(service.inspectBackup('recovery').data.journey,fresh);
});

test('two tabs cannot silently save an already stale state, even after status read',()=>{
 const memory=storage(),a=createSaveService(memory),b=createSaveService(memory);a.read();b.read();
 assert.equal(a.commit({journey:journey()}).ok,true);assert.equal(b.read().status,'ready');const before=memory.getItem(ARCHIVE_KEY);
 assert.equal(b.commit({journey:journey({p1:{solved:true}})}).code,'conflict');assert.equal(memory.getItem(ARCHIVE_KEY),before);
 assert.equal(b.reload().status,'ready');assert.equal(b.commit({journey:journey({p1:{solved:true}})}).ok,true);
 assert.equal(a.commit({journey:journey()}).code,'conflict');
});

test('empty, unreadable, unavailable and future saves are distinct and read never erases them',()=>{
 for(const [raw,status] of [['{bad','invalid'],[JSON.stringify({format:ARCHIVE_FORMAT,version:2,data:{}}),'unsupported']]){
  const memory=storage();memory.setItem(ARCHIVE_KEY,raw);const service=createSaveService(memory);assert.equal(service.read().status,status);
  assert.equal(service.commit({journey:journey()}).ok,false);assert.equal(memory.getItem(ARCHIVE_KEY),raw);assert.equal(JSON.parse(service.exportRaw().text).archive,raw);
 }
 const unavailable=createSaveService({getItem(){throw Error('access denied');}});assert.equal(unavailable.read().status,'unavailable');assert.equal(unavailable.commit({journey:journey()}).code,'unavailable');
});

test('future journey schema is rejected inside a valid archive, without changing current data',()=>{
 const memory=storage(),service=createSaveService(memory);service.commit({journey:journey()});const before=memory.getItem(ARCHIVE_KEY);
 const invalid=JSON.stringify({format:ARCHIVE_FORMAT,version:1,data:{journey:JSON.stringify({...createState(),version:2})}});
 assert.equal(service.previewImport(invalid).code,'unsupported');assert.equal(service.importArchive(invalid).code,'unsupported');assert.equal(memory.getItem(ARCHIVE_KEY),before);
});

test('a broken original can only be replaced explicitly and its exact bytes remain backed up',()=>{
 const memory=storage();memory.setItem(ARCHIVE_KEY,'{broken');const service=createSaveService(memory);service.read();
 assert.equal(service.commit({journey:journey()}).ok,false);assert.equal(service.commit({journey:journey()},{reason:'new-journey'}).ok,true);
 assert.equal(JSON.parse(memory.getItem(PREVIOUS_KEY)).archive,'{broken');assert.equal(service.inspectBackup().code,'invalid');
});

test('import previews are read-only and valid imports back up all previous local content',()=>{
 const source=createSaveService(storage(),{now:()=>1000});source.commit({journey:journey({p1:{solved:true},letters:{version:1,entries:{},selected:'tide'}}),preferences:'{"muted":true}',resonance:'{"version":1,"records":{}}'});
 const exported=source.exportArchive();const memory=storage(),target=createSaveService(memory);target.commit({journey:journey()});const before=memory.getItem(ARCHIVE_KEY);
 const preview=target.previewImport(exported.text);assert.equal(preview.ok,true);assert.equal(preview.summary.chapter,1);assert.equal(memory.getItem(ARCHIVE_KEY),before);
 assert.equal(target.importArchive(exported.text).ok,true);assert.deepEqual(target.read().data,source.read().data);assert.equal(target.inspectBackup().summary.chapter,0);
});

test('archive size, depth and dangerous object keys are bounded before writing anything',()=>{
 const service=createSaveService(storage());const wrap=data=>JSON.stringify({format:ARCHIVE_FORMAT,version:1,data});
 assert.equal(service.previewImport(' '.repeat(MAX_ARCHIVE_BYTES+1)).code,'oversize');
 let nested={};for(let i=0;i<40;i++)nested={child:nested};
 assert.equal(service.previewImport(wrap({journey:journey({letters:nested})})).code,'invalid');
 const malicious=JSON.stringify({format:ARCHIVE_FORMAT,version:1,data:{journey:journey(),preferences:'{"__proto__":{"polluted":true}}'}});
 assert.equal(service.previewImport(malicious).code,'invalid');assert.equal({}.polluted,undefined);
 for(const data of [[],null,{journey:42},{journey:'[]'},{journey:'{"version":1}'},{journey:journey(),resonance:'{"version":99,"records":{}}'}])assert.equal(service.previewImport(wrap(data)).ok,false);
});

test('backup quota failure prevents new-journey replacement',()=>{
 const memory=storage(),service=createSaveService(memory);service.commit({journey:journey()});const before=memory.getItem(ARCHIVE_KEY),write=memory.setItem;
 memory.setItem=(key,value)=>{if(key===PREVIOUS_KEY)throw Error('quota');write(key,value);};
 assert.equal(service.commit({journey:journey({p1:{solved:true}})},{reason:'new-journey'}).code,'backup');assert.equal(memory.getItem(ARCHIVE_KEY),before);
});

test('primary write failure is reported while the previous valid archive stays intact',()=>{
 const memory=storage(),service=createSaveService(memory);service.commit({journey:journey()});const before=memory.getItem(ARCHIVE_KEY),write=memory.setItem;
 memory.setItem=(key,value)=>{if(key===ARCHIVE_KEY)throw Error('quota');write(key,value);};
 assert.equal(service.commit({journey:journey({p1:{solved:true}})}).code,'write');assert.equal(memory.getItem(ARCHIVE_KEY),before);assert.equal(service.inspectBackup('recovery').data.journey,journey());
});

test('legacy mirror failures do not misreport the successfully committed authoritative save',()=>{
 const memory=storage(),write=memory.setItem;memory.setItem=(key,value)=>{if(key===LEGACY_KEYS.journey)throw Error('quota');write(key,value);};
 const service=createSaveService(memory),result=service.commit({journey:journey()});assert.equal(result.ok,true);assert.equal(result.warnings.length,1);assert.equal(result.warnings[0].part,'journey');
 assert.equal(createSaveService(memory).read().data.journey,journey());
});

test('an intervening write during backup creation is detected before replacing the archive',()=>{
 const memory=storage(),service=createSaveService(memory);service.commit({journey:journey()});const write=memory.setItem;
 const external=JSON.stringify({format:ARCHIVE_FORMAT,version:1,revision:10,data:{journey:journey({p1:{solved:true}})}});
 memory.setItem=(key,value)=>{write(key,value);if(key===RECOVERY_KEY)write(ARCHIVE_KEY,external);};
 assert.equal(service.commit({journey:journey({p1:{solved:false}})}).code,'conflict');assert.equal(memory.getItem(ARCHIVE_KEY),external);
});

test('conflicted or unavailable storage can still export an explicit current in-memory journey without writing',()=>{
 const memory=storage(),a=createSaveService(memory),b=createSaveService(memory);a.read();b.read();a.commit({journey:journey()});
 const current=journey({p1:{solved:true}}),before=memory.getItem(ARCHIVE_KEY);
 assert.equal(b.commit({journey:current}).code,'conflict');
 const exported=b.exportArchive({journey:current});assert.equal(exported.ok,true);assert.equal(b.previewImport(exported.text).data.journey,current);assert.equal(memory.getItem(ARCHIVE_KEY),before);
 const denied=createSaveService({getItem(){throw Error('blocked');}});assert.equal(denied.exportArchive({journey:current}).ok,true);
});

test('future nested letter schemas cannot be silently downgraded by gameplay restoration',()=>{
 const memory=storage(),service=createSaveService(memory);service.commit({journey:journey()});const before=memory.getItem(ARCHIVE_KEY);
 for(const field of ['letters','lettersSent'])for(const part of ['journey','beforeLetter']){
  const text=JSON.stringify({format:ARCHIVE_FORMAT,version:1,data:{journey:journey(),[part]:journey({[field]:{version:2,entries:{}}})}});
  assert.equal(service.previewImport(text).code,'unsupported',`${part}.${field}`);assert.equal(service.importArchive(text).ok,false);assert.equal(memory.getItem(ARCHIVE_KEY),before);
 }
 const legacy=JSON.parse(journey());delete legacy.letters;delete legacy.lettersSent;
 assert.equal(service.previewImport(JSON.stringify({format:ARCHIVE_FORMAT,version:1,data:{journey:JSON.stringify(legacy)}})).ok,true);
});

test('unchanged cover preferences do not create a new revision or invalidate another playing tab',()=>{
 const memory=storage(),a=createSaveService(memory);a.commit({journey:journey(),preferences:'{"muted":false}'});
 const b=createSaveService(memory);b.read();const before=new Map(memory.map);
 const result=b.commit({preferences:'{"muted":false}'});assert.equal(result.ok,true);assert.equal(result.code,'unchanged');assert.deepEqual(memory.map,before);
 assert.equal(a.commit({journey:journey({p1:{solved:true}})}).ok,true);
 assert.equal(b.commit({journey:journey({p1:{solved:true}})}).code,'conflict','matching proposed data cannot silently accept another tab baseline');
});

test('exporting a conflicted in-memory journey retains its own accepted checkpoint rather than another tab checkpoint',()=>{
 const memory=storage(),a=createSaveService(memory),aCheckpoint=journey({p1:{solved:true},discoveries:['leaf']});
 a.commit({journey:journey(),beforeLetter:aCheckpoint});const b=createSaveService(memory);b.read();
 const bCheckpoint=journey({p1:{solved:true},discoveries:['protocol']});b.commit({journey:journey({p1:{solved:true}}),beforeLetter:bCheckpoint});
 assert.equal(a.read().data.beforeLetter,bCheckpoint,'read reports the latest disk without accepting it');
 const rescue=a.exportArchive({journey:journey()});assert.equal(a.previewImport(rescue.text).data.beforeLetter,aCheckpoint);
 assert.equal(a.previewImport(a.exportArchive().text).data.beforeLetter,bCheckpoint,'a plain export explicitly uses the latest disk');
 a.reload();assert.equal(a.previewImport(a.exportArchive({journey:journey()}).text).data.beforeLetter,bCheckpoint);
});

test('archive summaries count only the three known gardens with a valid reply choice',()=>{
 const service=createSaveService(storage()),letters={version:1,entries:{rain:{choice:'tree'},wind:{choice:'sail'},tide:{choice:'invented'},unknown:{choice:'old'}}};
 const result=service.commit({journey:journey({letters})});assert.equal(result.ok,true);assert.equal(result.summary.letterReplies,2);
 letters.entries.tide.choice='new';assert.equal(service.previewImport(service.exportArchive({journey:journey({letters})}).text).summary.letterReplies,3);
 for(const entries of [{rain:{choice:true},wind:{choice:1},tide:{choice:'tree'}},{rain:'tree',wind:null,tide:[]},{}]){
  const preview=service.previewImport(service.exportArchive({journey:journey({letters:{version:1,entries}})}).text);assert.equal(preview.summary.letterReplies,0);
 }
 const legacy=JSON.parse(journey());delete legacy.letters;assert.equal(service.previewImport(service.exportArchive({journey:JSON.stringify(legacy)}).text).summary.letterReplies,0);
});
