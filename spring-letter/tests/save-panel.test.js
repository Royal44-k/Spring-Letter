import test from 'node:test';
import assert from 'node:assert/strict';
import {createSavePanel} from '../src/save-panel.js';
import {createSaveService,ARCHIVE_KEY} from '../src/save-service.js';
import {createState} from '../src/game-model.js';

const raw=solved=>JSON.stringify({...createState(),started:true,p1:{solved}});
function fixture(options={}){
 const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 const service=createSaveService(storage);service.commit({journey:raw(false)});
 const dialog={open:false},nodes=new Map(),messages=[];let loaded=0;
 globalThis.document={getElementById:id=>nodes.get(id)};
 const openModal=html=>{for(const node of nodes.values())node.isConnected=false;nodes.clear();for(const match of html.matchAll(/id="([^"]+)"/g))nodes.set(match[1],{isConnected:true,closest:()=>dialog,textContent:'',disabled:false,value:''});dialog.open=true;};
 const closeModal=()=>{dialog.open=false;};
 const panel=createSavePanel({service,openModal,closeModal,getPayload:()=>({journey:raw(false)}),onLoaded:()=>loaded++,toast:text=>messages.push(text),...options});
 const exported=()=>{const other=createSaveService({getItem:()=>null,setItem(){},removeItem(){}});return other.exportArchive({journey:raw(true)}).text;};
 return {service,storage,values,panel,nodes,dialog,messages,exported,get loaded(){return loaded;}};
}

test('new journey cancellation calls no destructive callback and leaves the saved archive intact',()=>{
 const f=fixture(),before=f.storage.getItem(ARCHIVE_KEY);let starts=0;f.panel.confirmNew(()=>starts++);
 assert.equal(starts,0);f.nodes.get('save-confirm-no').onclick();assert.equal(starts,0);assert.equal(f.dialog.open,false);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);
 f.panel.confirmNew(()=>starts++);f.nodes.get('save-confirm-yes').onclick();assert.equal(starts,1);
});

test('file preview is read-only, cancel keeps progress, and explicit confirmation loads the imported archive once',async()=>{
 const f=fixture(),text=f.exported(),before=f.storage.getItem(ARCHIVE_KEY);f.panel.show();
 const choose=async()=>{const input=f.nodes.get('save-import-file');input.files=[{size:new TextEncoder().encode(text).length,text:async()=>text}];await input.onchange({target:input});};
 await choose();assert.equal(f.nodes.get('save-confirm-title').textContent,'接回这封春信？');assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.loaded,0);
 f.nodes.get('save-confirm-no').onclick();assert.equal(f.storage.getItem(ARCHIVE_KEY),before);
 await choose();const confirm=f.nodes.get('save-confirm-yes');confirm.onclick();assert.equal(f.loaded,1);assert.equal(f.service.read().summary.chapter,1);assert.equal(f.service.inspectBackup().summary.chapter,0);confirm.onclick();assert.equal(f.loaded,1);
});

test('closing a dialog while a file is reading prevents late preview or import',async()=>{
 const f=fixture(),before=f.storage.getItem(ARCHIVE_KEY);let finish;f.panel.show();const input=f.nodes.get('save-import-file');input.files=[{size:100,text:()=>new Promise(resolve=>finish=resolve)}];
 const pending=input.onchange({target:input});f.nodes.get('save-panel-close').onclick();finish(f.exported());await pending;
 assert.equal(f.dialog.open,false);assert.equal(f.loaded,0);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);assert.equal(f.nodes.has('save-confirm-title'),false);
});

test('a newer tab save during import preview stays protected and the dialog explains the conflict',async()=>{
 const f=fixture();f.panel.show();const input=f.nodes.get('save-import-file');input.files=[{size:100,text:async()=>f.exported()}];await input.onchange({target:input});
 const other=createSaveService(f.storage);other.read();other.commit({journey:raw(true)});const before=f.storage.getItem(ARCHIVE_KEY);
 f.nodes.get('save-confirm-yes').onclick();assert.equal(f.loaded,0);assert.match(f.nodes.get('save-confirm-error').textContent,/另一页面/);assert.equal(f.nodes.get('save-confirm-yes').disabled,false);assert.equal(f.storage.getItem(ARCHIVE_KEY),before);
});

test('repeated automatic save failures produce a single toast until the reason changes',()=>{
 const f=fixture();for(let i=0;i<20;i++)f.panel.notifyFailure({ok:false,code:'conflict'});assert.equal(f.messages.length,1);
 f.panel.notifyFailure({ok:false,code:'write',error:'保存没有完成'});assert.equal(f.messages.length,2);
});

test('write failures offer temporary play only after explicit confirmation and leave disk untouched',()=>{
 let temporary=false,attempts=0;
 const f=fixture({isTemporary:()=>temporary,onTemporary:()=>{attempts++;temporary=true;return {ok:true};}}),before=new Map(f.values);
 f.panel.notifyFailure({ok:false,code:'write',error:'磁盘写入失败'});f.panel.show();
 assert.equal(f.nodes.get('save-enter-temporary')?.hidden,false,'a failed write must remain actionable even when the old archive can be read');
 assert.match(f.nodes.get('save-current-status').textContent,/尚未保存/);
 f.nodes.get('save-enter-temporary').onclick();assert.equal(attempts,0);assert.match(f.nodes.get('save-confirm-description').textContent,/关闭后.*丢失/);
 f.nodes.get('save-confirm-no').onclick();assert.equal(attempts,0);assert.deepEqual(f.values,before);
 f.nodes.get('save-enter-temporary').onclick();const confirm=f.nodes.get('save-confirm-yes');confirm.onclick();confirm.onclick();
 assert.equal(attempts,1);assert.equal(f.dialog.open,false,'successful switching hands control to the game without reloading it');assert.equal(f.loaded,0);f.panel.show();
 assert.equal(f.nodes.get('save-temporary-notice').hidden,false);assert.match(f.nodes.get('save-temporary-notice').textContent,/仅在本页.*关闭后丢失.*导出/);
 assert.doesNotMatch(f.nodes.get('save-current-status').textContent,/本机.*已保存/);assert.equal(f.nodes.get('save-enter-temporary').hidden,true);assert.deepEqual(f.values,before);
});

test('unavailable reads expose a cancellable temporary entry without attempting storage writes',()=>{
 let switched=0;const f=fixture({onTemporary:()=>{switched++;}}),before=new Map(f.values);
 f.storage.getItem=()=>{throw Error('blocked');};f.storage.setItem=f.storage.removeItem=()=>{throw Error('must not write');};
 f.panel.show();assert.equal(f.nodes.get('save-enter-temporary')?.hidden,false);assert.equal(switched,0);
 const stale=f.nodes.get('save-enter-temporary');f.nodes.get('save-panel-close').onclick();stale.onclick();assert.equal(switched,0);assert.equal(f.dialog.open,false);assert.deepEqual(f.values,before);
});

test('temporary callback failures retain the confirmation and allow a retry',()=>{
 let attempts=0;const f=fixture({onTemporary:()=>{attempts++;return {ok:false,error:'暂时无法开启临时旅途'};}});
 f.panel.notifyFailure({ok:false,code:'backup'});f.panel.show();assert.equal(f.nodes.get('save-enter-temporary')?.hidden,false);
 f.nodes.get('save-enter-temporary').onclick();f.nodes.get('save-confirm-yes').onclick();
 assert.equal(attempts,1);assert.equal(f.nodes.get('save-confirm-yes').disabled,false);assert.match(f.nodes.get('save-confirm-error').textContent,/无法开启/);assert.equal(f.nodes.has('save-panel-view'),false);
});

test('failure deduplication does not erase the temporary option and old callers need no callback',()=>{
 const f=fixture();for(let i=0;i<10;i++)f.panel.notifyFailure({ok:false,code:'write',error:'配额不足'});
 assert.equal(f.messages.length,1);f.panel.show();assert.equal(f.nodes.get('save-enter-temporary')?.hidden,true);
});

test('temporary mode and letter reply counts are visible when reopening the panel',()=>{
 const f=fixture({isTemporary:()=>true});const state={...createState(),started:true};state.letters.entries.rain.choice='tree';state.letters.entries.wind.choice='sail';
 f.service.commit({journey:JSON.stringify(state)});f.panel.show();
 assert.equal(f.nodes.get('save-temporary-notice')?.hidden,false);assert.match(f.nodes.get('save-current-chapter').textContent,/2\s*\/\s*3.*庭院回信/);
 assert.doesNotMatch(f.nodes.get('save-current-chapter').textContent,/座春庭/);assert.doesNotMatch(f.nodes.get('save-current-time').textContent,/上次保存/);
});
