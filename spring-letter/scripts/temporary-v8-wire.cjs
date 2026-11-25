const fs=require('node:fs'),p=require('node:path').join(__dirname,'../src/main.js');let s=fs.readFileSync(p,'utf8');function r(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,60));s=s.replace(a,b);}
r("import {createSaveService,LEGACY_KEYS}","import {createStorageBackend} from './storage-backend.js';\nimport {createSaveService,LEGACY_KEYS,ARCHIVE_KEY}");
r("const saveService=createSaveService({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v),removeItem:k=>localStorage.removeItem(k)});","const storageBackend=createStorageBackend(()=>localStorage),saveService=createSaveService(storageBackend.storage);");
r("return localStorage.getItem(key);","return storageBackend.storage.getItem(key);");
r("if(!lastSaveResult.ok)savePanel?.notifyFailure(lastSaveResult);return lastSaveResult;","if(!lastSaveResult.ok)savePanel?.notifyFailure(lastSaveResult);syncStorageNotice();return lastSaveResult;");
r("function showLetters(){",`function syncStorageNotice(){
 const el=$('storage-notice');if(!el)return;
 const failed=lastSaveResult?.ok===false;el.hidden=!storageBackend.temporary&&!failed;
 el.textContent=storageBackend.temporary?'临时旅途 · 关闭页面前请导出':failed?'此页进度尚未保存 · 查看与导出':'';
 el.onclick=()=>savePanel.show();
}
function enterTemporaryPlay(){
 if(storageBackend.temporary)return {ok:true};
 const rescue=saveService.exportArchive(currentPayload());if(!rescue.ok)return rescue;
 storageBackend.enterTemporary({[ARCHIVE_KEY]:rescue.text});saveService.reload();lastSaveResult={ok:true,code:'temporary'};syncStorageNotice();
 if(mode==='cover'||mode==='gallery')setTimeout(()=>startGame(!!restore(storageGet(SAVE_KEY)).started),0);
 return {ok:true};
}
function showLetters(){`);
r("if(!result.ok){savePanel.notifyFailure(result);return;}}\n resetPresentation();","if(!result.ok){lastSaveResult=result;savePanel.notifyFailure(result);syncStorageNotice();savePanel.show();return result;}}\n resetPresentation();");
r("savePanel=createSavePanel({service:saveService,openModal,closeModal,getPayload:currentPayload,toast,","savePanel=createSavePanel({service:saveService,openModal,closeModal,getPayload:currentPayload,toast,isTemporary:()=>storageBackend.temporary,onTemporary:enterTemporaryPlay,");
r("saveStatus:{status:saveService.read().status,","saveStatus:{temporary:storageBackend.temporary,status:saveService.read().status,");
r("window.addEventListener('beforeunload',save);","window.addEventListener('beforeunload',e=>{save();if(storageBackend.temporary&&state.started){e.preventDefault();e.returnValue='';}});");
fs.writeFileSync(p,s);
