import {MAX_ARCHIVE_BYTES} from './save-service.js';

const names={empty:'还没有开始的旅途',ready:'本机春信已保存',legacy:'已找到旧版春信',invalid:'春信暂时无法读取',unsupported:'这份春信需要较新的版本',unavailable:'浏览器不允许访问本地存档',oversize:'春信文件超过读取限制'};
const dateLabel=value=>{const n=Number(value);return value!==null&&Number.isFinite(n)&&n>0?new Date(n).toLocaleString('zh-CN',{hour12:false}):'尚无保存时间记录';};
const summaryText=summary=>summary?.started?`${summary.chapterLabel} · ${summary.letterReplies||0} / 3 封庭院回信${summary.branches?' · '+summary.branches+' 段物件回声':''}`:'尚未开始的新旅途';

/** Dialog content only. Main owns replacing live gameplay after onLoaded.
 * No imported text enters innerHTML; only fixed local markup does.
 */
export function createSavePanel({service,openModal,closeModal,getPayload,onLoaded,toast,isTemporary=()=>false,onTemporary=null}){
 let generation=0,lastFailure='',storageFailure=null;
 const $=id=>document.getElementById(id);
 function active(view,token){return generation===token&&view?.isConnected&&view.closest('dialog')?.open===true;}
 function close(){generation++;closeModal();}
 function rememberFailure(result){if(['unavailable','write','backup'].includes(result?.code||result?.status))storageFailure=result;}
 function notifyFailure(result){
  if(result?.ok){lastFailure='';storageFailure=null;return;}
  rememberFailure(result);
  const message=result?.code==='conflict'?'另一页面已保存新进度。请在“存档与备份”导出当前旅途，或重新读取已保存旅途。':result?.error||'保存没有完成。请打开“存档与备份”保留当前旅途。';
  const key=(result?.code||result?.status||'unknown')+message;if(key===lastFailure)return;lastFailure=key;toast(message);
 }
 function download(result,feedback){
  if(!result?.ok){feedback(result?.error||'这份春信暂时无法导出。');return;}
  try{const blob=new Blob([result.text],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=result.filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback('春信已交给浏览器下载。请将 JSON 文件保存在你找得到的地方。');}
  catch{feedback('浏览器未能下载文件。请检查此页面的下载权限，再试一次。');}
 }
 function load(result){
  if(!result.ok){notifyFailure(result);return false;}
  lastFailure='';storageFailure=null;close();onLoaded(result);return true;
 }
 function reloadLoaded(){const result=service.reload();if(result.ok)load(result);return result;}
 function confirmation({title,description,summary,confirmLabel,run,back=show}){
  const token=++generation;
  openModal('<section id="save-confirm-view"><small>你的春信，由你保管</small><h2 id="save-confirm-title"></h2><p id="save-confirm-description"></p><div class="journal-entry"><p id="save-confirm-summary"></p></div><p id="save-confirm-error" role="status" aria-live="polite"></p><div class="row"><button id="save-confirm-yes" class="primary"></button><button id="save-confirm-no">取消，保留当前旅途</button></div></section>');
  const view=$('save-confirm-view');$('save-confirm-title').textContent=title;$('save-confirm-description').textContent=description;$('save-confirm-summary').textContent=summaryText(summary);$('save-confirm-yes').textContent=confirmLabel;
  $('save-confirm-no').onclick=()=>{if(active(view,token))back();};
  $('save-confirm-yes').onclick=()=>{if(!active(view,token))return;const button=$('save-confirm-yes');button.disabled=true;try{const result=run();if(result?.ok===false){rememberFailure(result);if(active(view,token)){$('save-confirm-error').textContent=result.error||'操作没有完成，当前旅途仍保留。';button.disabled=false;}}}catch{if(active(view,token)){$('save-confirm-error').textContent='操作没有完成，请保留当前旅途，再试一次。';button.disabled=false;}}};
 }
 function confirmNew(callback){
  const current=service.read();
  if(current.ok&&!current.summary?.started){callback();return;}
  confirmation({title:'另起一封春信？',description:current.ok?'当前旅途会先留作“上一封春信”，之后再开启新的旅途。声音、花型偏好与追风最好纪录可以保留。':'当前档案无法正常读取。只有原文件成功备份后，才会建立新的旅途；你也可以取消后先导出原始备份。',summary:current.summary,confirmLabel:'保留备份，重新出发',back:close,run:()=>{close();return callback();}});
 }
 function show(){
  const token=++generation,current=service.read(),previous=service.inspectBackup('previous'),recovery=service.inspectBackup('recovery'),temporary=isTemporary();
  openModal('<section id="save-panel-view"><small id="save-mode-label"></small><h2>存档与备份</h2><p id="save-temporary-notice" role="status" hidden></p><p id="save-current-status"></p><div class="row"><button id="save-enter-temporary" hidden>临时游玩，稍后导出</button></div><div class="journal-entry"><h3 id="save-current-chapter"></h3><p id="save-current-time"></p></div><p id="save-storage-note" class="muted"></p><div class="row"><button id="save-export" class="primary">导出当前旅途</button><button id="save-read-local">重新读取已保存旅途</button></div><div class="journal-entry"><h3>把春信带回来</h3><p id="save-import-note" class="muted"></p><label class="option" for="save-import-file">选择春信文件</label><input id="save-import-file" type="file" accept=".json,application/json" aria-label="选择要预览的春信存档 JSON 文件"></div><div class="journal-entry"><h3>仍为你留着的旅途</h3><p id="save-previous-summary"></p><button id="save-restore-previous">恢复上一封春信</button><p id="save-recovery-summary"></p><button id="save-restore-recovery">恢复最近一次有效保存</button></div><p id="save-panel-feedback" role="status" aria-live="polite"></p><div class="row"><button id="save-export-raw">导出原始备份</button><button id="save-panel-close">回到旅途</button></div></section>');
  const view=$('save-panel-view'),feedback=text=>{if(active(view,token))$('save-panel-feedback').textContent=text;};
  $('save-mode-label').textContent=temporary?'本页临时春信':'本机春信';
  $('save-temporary-notice').hidden=!temporary;$('save-temporary-notice').textContent='临时游玩：仅在本页，关闭后丢失；请导出当前旅途。';
  $('save-storage-note').textContent=temporary?'旅途只保留在当前页面的内存中。关闭或刷新页面后会丢失，请在离开前导出 JSON 文件。临时模式不会覆盖原有本机存档，也不会上传到服务器。':'旅途只保存在当前浏览器、当前网址中。清理浏览器数据或更换设备后不会自动带走。下载一份春信，可以在另一台设备上导入；不需要账号，也不会上传到服务器。';
  $('save-import-note').textContent=temporary?'选择 JSON 文件后先查看摘要，确认后只替换本页临时旅途。临时备份也会随页面关闭而丢失；请及时导出。文件不超过 1 MiB。':'选择 JSON 文件后先查看内容摘要，确认后才会替换。现有旅途会先留作备份。文件不超过 1 MiB。';
  $('save-current-status').textContent=temporary?(current.ok?'临时旅途已记在本页。':'本页临时记录暂时无法读取。'+(current.error||'')):current.ok&&storageFailure?'本页新进度尚未保存；本机仍保留上一份春信。'+(storageFailure.error||''):(names[current.status]||'春信状态待检查')+(current.ok?'':'。'+(current.error||'原文件仍被保留。'));
  $('save-current-chapter').textContent=current.ok?summaryText(current.summary):'未将读取失败当作新的旅途';$('save-current-time').textContent=current.ok?(temporary?'本页最近记录：':'上次保存：')+dateLabel(current.summary.savedAt):'可先导出当前旅途或原始备份，再尝试恢复。';
  $('save-enter-temporary').hidden=temporary||typeof onTemporary!=='function'||(current.ok&&!storageFailure);
  $('save-enter-temporary').onclick=()=>{
   if(!active(view,token)||isTemporary()||typeof onTemporary!=='function')return;
   confirmation({title:'先在本页继续旅途？',description:'临时旅途只放在本页内存中，关闭后会丢失，刷新页面也会丢失。请在离开前导出 JSON 文件。原有本机存档不会被此模式删除或覆盖；切换不会自动恢复持久保存。',summary:current.summary,confirmLabel:'知道会丢失，进入临时游玩',run:()=>{
    const result=onTemporary();if(result?.ok===false)return result;
    // The caller switches the backend and owns any queued cover-to-game transition.
    // Do not reload live gameplay or open another modal after this handoff.
    lastFailure='';storageFailure=null;close();return result||{ok:true};
   }});
  };
  $('save-previous-summary').textContent=previous.ok?'上一封：'+summaryText(previous.summary)+'。备份于 '+dateLabel(previous.backupAt):previous.code==='empty'?'尚无上一封春信。':previous.error||'上一封春信暂时不能读取。';
  $('save-recovery-summary').textContent=recovery.ok?'最近有效保存：'+summaryText(recovery.summary)+'。备份于 '+dateLabel(recovery.backupAt):recovery.code==='empty'?'开始旅途并保存后，这里会留下最近的一份。':recovery.error||'最近恢复点暂时不能读取。';
  $('save-restore-previous').disabled=!previous.ok;$('save-restore-recovery').disabled=!recovery.ok;$('save-read-local').disabled=!current.ok||!current.summary?.started;
  if(temporary){$('save-read-local').textContent='重新读取本页记录';$('save-restore-recovery').textContent='恢复本页最近一次记录';$('save-export-raw').textContent='导出本页原始记录';}
  $('save-export').onclick=()=>{if(!active(view,token))return;try{download(service.exportArchive(getPayload?.()),feedback);}catch{feedback('当前旅途暂时无法导出。原有本机存档仍被保留。');}};
  $('save-export-raw').onclick=()=>{if(active(view,token))download(service.exportRaw(),feedback);};
  $('save-panel-close').onclick=()=>{if(active(view,token))close();};
  $('save-read-local').onclick=()=>{if(!active(view,token))return;confirmation({title:temporary?'重新读取本页记录？':'重新读取本机春信？',description:temporary?'将读取本页最近记录的临时旅途。它仍只在此页面内，关闭或刷新后会丢失；你可以先取消并导出当前旅途。':'当前页面尚未保存的行动将被放下。若另一页面已经推进了旅途，会读取它最近保存的内容。你可以先取消并导出当前旅途。',summary:current.summary,confirmLabel:temporary?'读取本页临时旅途':'读取已保存的旅途',run:()=>{const result=service.reload();if(result.ok)load(result);return result;}});};
  for(const kind of ['previous','recovery'])$('save-restore-'+kind).onclick=()=>{if(!active(view,token))return;const backup=service.inspectBackup(kind);if(!backup.ok){feedback(backup.error);return;}confirmation({title:kind==='previous'?'回到上一封春信？':'恢复最近一次有效保存？',description:'当前旅途会先留作另一份备份。恢复后，你会回到这份春信的安全落脚点；声音与花型偏好也随整档一起恢复。',summary:backup.summary,confirmLabel:'保留当前备份，恢复',run:()=>{const result=service.restoreBackup(kind);return result.ok?reloadLoaded():result;}});};
  $('save-import-file').onchange=async event=>{
   if(!active(view,token))return;const input=event.target,file=input.files?.[0];if(!file)return;
   if(file.size>MAX_ARCHIVE_BYTES){feedback('这个文件超过 1 MiB。请选择由本作导出的春信 JSON 文件。');input.value='';return;}
   input.disabled=true;feedback('正在查看这封春信，还没有替换当前旅途。');
   let text;try{text=await file.text();}catch{if(active(view,token)){input.disabled=false;input.value='';feedback('没有读到这个文件。请重新选择，当前旅途没有改变。');}return;}
   if(!active(view,token))return;input.disabled=false;input.value='';const preview=service.previewImport(text);
   if(!preview.ok){feedback(preview.error||'这不是可以识别的春信存档。');return;}
   confirmation({title:'接回这封春信？',description:temporary?'文件已通过格式检查，目前尚未导入。确认后会替换本页临时旅途，并保留一份本页备份；它们在关闭页面后都会丢失，请及时导出。':'文件已通过格式检查，目前尚未导入。确认后会先备份本机旅途，再换成下面这封春信。',summary:preview.summary,confirmLabel:'保留备份，导入春信',run:()=>{const result=service.importArchive(text);return result.ok?reloadLoaded():result;}});
  };
 }
 return {show,confirmNew,notifyFailure};
}
