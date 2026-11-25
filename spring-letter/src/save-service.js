import {LETTERS} from './letter-model.js';
import {ATLAS_LOCATIONS} from './atlas-content.js';
import {restoreAtlasState} from './atlas-model.js';

/** Local, single-key authoritative saves. No network, DOM or gameplay mutation.
 * read() establishes a baseline only once; reload() deliberately accepts a newer
 * archive. All results are explicit: an unreadable save is never an empty save.
 */
export const ARCHIVE_KEY='spring-letter:archive:v1';
export const PREVIOUS_KEY='spring-letter:archive:previous:v1';
export const RECOVERY_KEY='spring-letter:archive:recovery:v1';
export const ARCHIVE_FORMAT='spring-letter-archive';
export const MAX_ARCHIVE_BYTES=1024*1024;
export const LEGACY_KEYS=Object.freeze({journey:'spring-letter:journey:v1',preferences:'spring-letter:preferences:v1',resonance:'spring-letter:resonance:v1',beforeLetter:'spring-letter:journey:v1:before-letter'});
const fields=Object.keys(LEGACY_KEYS),emptyData=()=>Object.fromEntries(fields.map(key=>[key,null]));
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const size=value=>new TextEncoder().encode(value).byteLength;
const failure=(code,error)=>({ok:false,code,error});
const messages={invalid:'这份春信的内容不完整，原文件仍被保留。',unsupported:'这份春信来自较新的版本，请用对应版本打开。',unavailable:'浏览器暂时无法访问本地存档。',conflict:'另一页面已经保存了新进度。请先重新读取，或导出当前旅途。',write:'保存没有完成，上一份有效春信仍被保留。',backup:'备份未能保存，替换已停止。',empty:'这里还没有可恢复的旅途。',oversize:'春信文件超过 1 MiB，无法导入。'};
function problem(code){return failure(code,messages[code]||messages.invalid);}
function safeTree(value){
 const queue=[[value,0]];let count=0;
 while(queue.length){const [node,depth]=queue.pop();if(depth>32||++count>50000)return false;
  if(node&&typeof node==='object')for(const [key,child] of Object.entries(node)){
   if(['__proto__','prototype','constructor'].includes(key))return false;
   queue.push([child,depth+1]);
  }
 }
 return true;
}
function parse(raw,max=MAX_ARCHIVE_BYTES){
 if(typeof raw!=='string')return problem('invalid');
 if(size(raw)>max)return problem('oversize');
 try{const value=JSON.parse(raw);return safeTree(value)?{ok:true,value}:problem('invalid');}catch{return problem('invalid');}
}
function validatePart(name,raw){
 if(raw===null)return {ok:true};
 const result=parse(raw);if(!result.ok)return result;
 const value=result.value;if(!plain(value))return problem('invalid');
 if(name==='preferences'){
  if(value.version!==undefined&&value.version!==1)return problem('unsupported');
 }else{
  if(value.version!==1)return problem(Number.isInteger(value.version)&&value.version>1?'unsupported':'invalid');
  if(name==='resonance'){if(!plain(value.records))return problem('invalid');}
  else {
   if(typeof value.started!=='boolean'||!plain(value.player)||!plain(value.p1)||!plain(value.wind)||!plain(value.bridge)||!Array.isArray(value.cores)||value.cores.length!==2)return problem('invalid');
   if(value.atlas!==undefined&&value.atlas!==null){
    if(!plain(value.atlas))return problem('invalid');
    if(value.atlas.version!==1)return problem(Number.isInteger(value.atlas.version)&&value.atlas.version>1?'unsupported':'invalid');
   }
   // A journey may retain its version while a nested subsystem evolves. Do not
   // let restoreLetters turn a newer letter book into a fresh empty one.
   for(const field of ['letters','lettersSent','moments'])if(value[field]!==undefined&&value[field]!==null){
    const letters=value[field];if(!plain(letters))return problem('invalid');
    if(letters.version!==1)return problem(Number.isInteger(letters.version)&&letters.version>1?'unsupported':'invalid');
    if(!plain(letters.entries))return problem('invalid');
    for(const id of ['rain','wind','tide']){
     const entry=letters.entries[id];if(!plain(entry))continue;
     if(field!=='moments'&&entry.edition!==undefined&&entry.edition!==1&&entry.edition!==2)return problem(Number.isInteger(entry.edition)&&entry.edition>2?'unsupported':'invalid');
     const draft=field==='moments'?entry.draft:entry.artwork;
     if(draft!==undefined&&draft!==null){if(!plain(draft))return problem('invalid');if(JSON.stringify(draft).length>=24000)return problem('oversize');if(draft.version!==1)return problem(Number.isInteger(draft.version)&&draft.version>1?'unsupported':'invalid');}
    }
   }
  }
 }
 return {ok:true};
}
function validateData(value){
 if(!plain(value)||!Object.hasOwn(value,'journey'))return problem('invalid');
 const data=emptyData();let bytes=0;
 for(const key of fields){const raw=value[key]??null;const result=validatePart(key,raw);if(!result.ok)return {...result,part:key};data[key]=raw;bytes+=raw?size(raw):0;}
 if(bytes>MAX_ARCHIVE_BYTES)return problem('oversize');
 return {ok:true,data};
}
function inspectEnvelope(raw){
 const parsed=parse(raw);if(!parsed.ok)return parsed;const envelope=parsed.value;
 if(!plain(envelope)||envelope.format!==ARCHIVE_FORMAT)return problem('invalid');
 if(envelope.version!==1)return problem(Number.isInteger(envelope.version)&&envelope.version>1?'unsupported':'invalid');
 const valid=validateData(envelope.data);return valid.ok?{...valid,envelope}:valid;
}
function summarize(data,savedAt=null){
 const journey=data.journey?JSON.parse(data.journey):{},record=data.resonance?JSON.parse(data.resonance):{};
 const chapter=journey.ending?4:journey.bridge?.solved?3:journey.wind?.solved?2:journey.p1?.solved?1:0;
 const letterReplies=LETTERS.filter(letter=>{const entry=journey.letters?.entries?.[letter.id];return plain(entry)&&letter.goals.some(goal=>goal.id===entry.choice);}).length;
 const atlas=restoreAtlasState(journey.atlas),map=ATLAS_LOCATIONS.find(place=>place.id===atlas.location);
 return {started:journey.started===true,chapter,chapterLabel:map?.title||['初庭 · 春风未起','风廊 · 有人同行','花桥 · 写一段路','终庭 · 待寄的信','春信已寄出'][chapter],atlasLocation:atlas.location,atlasCompleted:atlas.completed.length,ending:typeof journey.ending==='string'?journey.ending:null,letterReplies,branches:Object.values(journey.story?.branches||{}).filter(v=>v===true).length,exploration:Object.values(journey.exploration||{}).filter(v=>v?.done===true).length,resonanceCompletions:Object.values(record.records||{}).reduce((sum,r)=>sum+(Number.isSafeInteger(r?.completions)&&r.completions>0?r.completions:0),0),savedAt};
}
export function previewImport(text){
 const valid=inspectEnvelope(text);if(!valid.ok)return valid;
 return {ok:true,data:valid.data,summary:summarize(valid.data,valid.envelope.savedAt??null)};
}
export function createSaveService(storage,{now=()=>Date.now()}={}){
 let baseline,baselineData=null;
 function snapshot(){
  try{
   const archive=storage.getItem(ARCHIVE_KEY),legacy=emptyData();
   if(archive===null)for(const key of fields)legacy[key]=storage.getItem(LEGACY_KEYS[key]);
   return {ok:true,archive,legacy,token:archive===null?'legacy:'+JSON.stringify(legacy):'archive:'+archive};
  }catch{return problem('unavailable');}
 }
 function inspect(snap){
  if(!snap.ok)return {...snap,status:'unavailable',data:null,summary:null};
  if(snap.archive!==null){const valid=inspectEnvelope(snap.archive);return valid.ok?{ok:true,status:'ready',data:valid.data,summary:summarize(valid.data,valid.envelope.savedAt??null),revision:Number.isSafeInteger(valid.envelope.revision)?valid.envelope.revision:0}:{...valid,status:valid.code,data:null,summary:null};}
  if(fields.every(key=>snap.legacy[key]===null))return {ok:true,status:'empty',data:emptyData(),summary:summarize(emptyData()),revision:0};
  const valid=validateData(snap.legacy);return valid.ok?{ok:true,status:'legacy',data:valid.data,summary:summarize(valid.data),revision:0}:{...valid,status:valid.code,data:null,summary:null};
 }
 function read(){const snap=snapshot(),result=inspect(snap);if(baseline===undefined&&snap.ok){baseline=snap.token;baselineData=result.ok?{...result.data}:null;}try{result.backupAvailable=storage.getItem(PREVIOUS_KEY)!==null;result.recoveryAvailable=storage.getItem(RECOVERY_KEY)!==null;}catch{result.backupAvailable=result.recoveryAvailable=false;}return result;}
 function reload(){baseline=undefined;baselineData=null;return read();}
 function backupValue(snap,reason){return JSON.stringify({format:'spring-letter-backup',version:1,savedAt:now(),reason,archive:snap.archive,legacy:snap.legacy});}
 function inspectBackup(kind='previous'){
  const key=kind==='recovery'?RECOVERY_KEY:PREVIOUS_KEY;let raw;
  try{raw=storage.getItem(key);}catch{return problem('unavailable');}
  if(raw===null)return problem('empty');
  const parsed=parse(raw,MAX_ARCHIVE_BYTES*3);if(!parsed.ok)return parsed;
  const b=parsed.value;if(!plain(b)||b.format!=='spring-letter-backup'||b.version!==1||!(typeof b.archive==='string'||b.archive===null)||!plain(b.legacy))return problem('invalid');
  const result=inspect({ok:true,archive:b.archive,legacy:b.legacy});
  return {...result,backupAt:b.savedAt,reason:b.reason};
 }
 function commit(patch={}, {reason='autosave'}={}){
  const snap=snapshot();if(!snap.ok)return snap;
  if(baseline===undefined)baseline=snap.token;
  if(snap.token!==baseline)return problem('conflict');
  const current=inspect(snap),destructive=['new-journey','import','restore'].includes(reason);
  if(baselineData===null&&current.ok)baselineData={...current.data};
  if(!current.ok&&!destructive)return current;
  if(!plain(patch)||Object.keys(patch).some(key=>!fields.includes(key)))return problem('invalid');
  const validated=validateData({...current.data,...patch,journey:Object.hasOwn(patch,'journey')?patch.journey:current.data?.journey??null});
  if(!validated.ok)return validated;
  // A corrupt/future archive may only be replaced by an explicit complete import
  // or new-journey operation after its original bytes have been backed up.
  if(!current.ok&&(!Object.hasOwn(patch,'journey')||validated.data.journey===null))return problem('invalid');
  // Opening a second cover page must not create a false stale-writer conflict
  // merely by reapplying identical settings. Never skip the baseline check above.
  if(reason==='autosave'&&current.status==='ready'&&fields.every(key=>validated.data[key]===current.data[key]))return {ok:true,code:'unchanged',data:validated.data,summary:current.summary,revision:current.revision,warnings:[]};
  const envelope={format:ARCHIVE_FORMAT,version:1,revision:(current.revision||0)+1,savedAt:now(),reason,data:validated.data};
  const raw=JSON.stringify(envelope);if(size(raw)>MAX_ARCHIVE_BYTES)return problem('oversize');
  const hasOriginal=snap.archive!==null||fields.some(key=>snap.legacy[key]!==null);
  const backup=hasOriginal?backupValue(snap,reason):null;
  try{if(backup&&destructive)storage.setItem(PREVIOUS_KEY,backup);if(backup&&current.ok)storage.setItem(RECOVERY_KEY,backup);}catch{return problem('backup');}
  // Compare again after backup writes. localStorage has no cross-tab CAS: this is
  // stale-writer detection, not a claim of an inter-process transaction lock.
  const latest=snapshot();if(!latest.ok)return latest;if(latest.token!==baseline)return problem('conflict');
  try{storage.setItem(ARCHIVE_KEY,raw);}catch{return problem('write');}
  baseline='archive:'+raw;baselineData={...validated.data};const warnings=[];
  // Legacy mirrors are compatibility exports, never the authority after commit.
  for(const key of fields)try{if(validated.data[key]===null)storage.removeItem(LEGACY_KEYS[key]);else storage.setItem(LEGACY_KEYS[key],validated.data[key]);}catch{warnings.push({code:'legacy-mirror',part:key,error:'主存档已保存，但旧版兼容副本未能写入。'});}
  return {ok:true,code:'saved',data:validated.data,summary:summarize(validated.data,envelope.savedAt),revision:envelope.revision,warnings};
 }
 function exportArchive(patch){
  const current=read();if(patch===undefined&&!current.ok)return current;
  if(patch!==undefined&&(!plain(patch)||Object.keys(patch).some(key=>!fields.includes(key))))return problem('invalid');
  const valid=validateData(patch===undefined?current.data:{...(baselineData||current.data||emptyData()),...patch});if(!valid.ok)return valid;
  // Explicit patches allow an unsaved in-memory journey to be rescued even when
  // storage is unavailable or another tab owns the latest local revision.
  const text=JSON.stringify({format:ARCHIVE_FORMAT,version:1,savedAt:now(),data:valid.data});if(size(text)>MAX_ARCHIVE_BYTES)return problem('oversize');
  return {ok:true,text,filename:'春信存档-'+new Date(now()).toISOString().slice(0,10)+'.json',summary:summarize(valid.data,now())};
 }
 function exportRaw(){const snap=snapshot();if(!snap.ok)return snap;return {ok:true,text:JSON.stringify({format:'spring-letter-recovery-copy',version:1,savedAt:now(),archive:snap.archive,legacy:snap.legacy},null,2),filename:'春信原始备份-'+new Date(now()).toISOString().slice(0,10)+'.json'};}
 function importArchive(text){const preview=previewImport(text);if(!preview.ok)return preview;return commit(preview.data,{reason:'import'});}
 function restoreBackup(kind='previous'){const backup=inspectBackup(kind);if(!backup.ok)return backup;return commit(backup.data,{reason:'restore'});}
 return {read,reload,commit,previewImport,importArchive,exportArchive,exportRaw,inspectBackup,restoreBackup};
}
