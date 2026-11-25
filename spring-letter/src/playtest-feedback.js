const choices=Object.freeze({
 familiarity:Object.freeze({new:'不太熟悉',sometimes:'能完成基本操作',often:'比较熟练'}),
 continueInterest:Object.freeze({yes:'愿意',unsure:'说不准',no:'暂时不'}),
 favorite:Object.freeze({'light-collage':'花光暗房 · 拼叠光影','paper-flight':'纸翼渡风 · 乘风飞行','sound-composition':'回声织信 · 自由作曲','flower-particles':'花朵与花尘','wind-chase':'追风与花灵',exploration:'漫游与庭院探索','letters-story':'来信与故事','music-atmosphere':'声音与氛围',none:'暂时没有特别喜欢的环节'}),
});
const endings=['memory+season','memory+voyage','season+voyage'];
const letters=['rain','wind','tide'];
const gardenNames={rain:'雨庭',wind:'风庭',tide:'潮庭'};
const error=(field,text)=>({ok:false,field,error:text});
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);

/** Explicit export builder: does not read browser state, storage or the network. */
export function buildFeedback(answers,summary){
 if(!plain(answers))return error('answers','请先填写你自己的体验。');
 for(const key of Object.keys(choices))if(typeof answers[key]!=='string'||!Object.hasOwn(choices[key],answers[key]))return error(key,({familiarity:'请选择你对游戏操作的熟悉程度。',continueInterest:'请选择是否愿意继续类似旅途；说不准也可以。',favorite:'请选择一个环节；暂时没有喜欢的也可以。'})[key]);
 if(!Number.isInteger(answers.clarity)||answers.clarity<1||answers.clarity>5)return error('clarity','请用 1–5 描述你对这段旅途操作的理解程度。');
 if(answers.notes!==undefined&&typeof answers.notes!=='string')return error('notes','建议请使用文字填写。');
 const notes=(answers.notes||'').trim();if(Array.from(notes).length>800)return error('notes','建议最多 800 字，请略作删减后再预览。');
 if(!plain(summary)||typeof summary.version!=='string'||summary.version.length>32||!/^\d+\.\d+\.\d+(?:[-.][a-zA-Z0-9]+)*$/.test(summary.version))return error('summary','版本信息暂时不可用，请回到旅途后重试。');
 if(!Number.isFinite(summary.playedSeconds)||summary.playedSeconds<0||summary.playedSeconds>Number.MAX_SAFE_INTEGER)return error('summary','游玩时长暂时不可用，请回到旅途后重试。');
 if(!Number.isInteger(summary.chapter)||summary.chapter<0||summary.chapter>4||!Array.isArray(summary.letters)||!['light','balanced','delicate'].includes(summary.quality))return error('summary','旅途摘要暂时不完整，请回到旅途后重试。');
 if(summary.ending!==null&&summary.ending!==undefined&&!endings.includes(summary.ending))return error('summary','结尾信息暂时不可用，请回到旅途后重试。');
 const viewport=summary.viewport;if(!plain(viewport)||!['width','height'].every(key=>Number.isFinite(viewport[key])&&viewport[key]>=1&&viewport[key]<=32768))return error('summary','画面尺寸暂时不可用，请回到旅途后重试。');
 return {ok:true,data:{format:'spring-letter-playtest',schemaVersion:2,answers:{familiarity:answers.familiarity,continueInterest:answers.continueInterest,favorite:answers.favorite,clarity:answers.clarity,notes},session:{version:summary.version,playedSeconds:Math.floor(summary.playedSeconds),letters:letters.filter(id=>summary.letters.includes(id)),chapter:summary.chapter,ending:summary.ending??null,quality:summary.quality,viewport:{width:Math.floor(viewport.width),height:Math.floor(viewport.height)}}}};
}

export function createPlaytestFeedback({openModal,closeModal,getSummary,toast}){
 let generation=0;
 const $=id=>document.getElementById(id);
 const active=(view,token)=>generation===token&&view?.isConnected&&view.closest('dialog')?.open===true;
 function close(){generation++;closeModal();}
 const options=key=>'<option value="">请选择</option>'+Object.entries(choices[key]).map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
 function form(draft={}){
  const token=++generation;
  openModal('<section id="feedback-form-view"><small>一份自愿留下的试玩记录</small><h2>这段旅途，感觉如何？</h2><p>答案没有标准。可以随时退出，不会影响旅途。仅在你确认后下载本地 JSON，不上传、不自动发送。</p><form id="feedback-form" novalidate><label class="option" for="feedback-familiarity">对游戏操作的熟悉程度</label><select id="feedback-familiarity" required>'+options('familiarity')+'</select><label class="option" for="feedback-interest">愿不愿继续类似的旅途？</label><select id="feedback-interest" required>'+options('continueInterest')+'</select><label class="option" for="feedback-favorite">最喜欢哪个环节？</label><select id="feedback-favorite" required>'+options('favorite')+'</select><label class="option" for="feedback-clarity">对这段旅途操作的理解程度</label><select id="feedback-clarity" required><option value="">请选择</option><option value="1">1 · 还没弄明白</option><option value="2">2 · 仍有些困惑</option><option value="3">3 · 基本理解</option><option value="4">4 · 比较清楚</option><option value="5">5 · 非常清楚</option></select><label class="option" for="feedback-notes">卡在哪，或最想改什么？（可空）</label><textarea id="feedback-notes" class="feedback-notes" rows="5" maxlength="800" aria-describedby="feedback-notes-help"></textarea><p id="feedback-notes-help" class="muted">最多 800 字。请不要填写姓名、联系方式或其他个人信息。</p><p id="feedback-form-error" role="status" aria-live="polite"></p><div class="row"><button type="submit" class="primary">先预览记录</button><button type="button" id="feedback-form-cancel">暂不填写，回到旅途</button></div></form></section>');
  const view=$('feedback-form-view');
  for(const [field,id] of Object.entries({familiarity:'feedback-familiarity',continueInterest:'feedback-interest',favorite:'feedback-favorite',clarity:'feedback-clarity',notes:'feedback-notes'}))if(draft[field]!==undefined)$(id).value=String(draft[field]);
  $('feedback-form-cancel').onclick=()=>{if(active(view,token))close();};
  $('feedback-form').onsubmit=event=>{
   event.preventDefault();if(!active(view,token))return;
   const answers={familiarity:$('feedback-familiarity').value,continueInterest:$('feedback-interest').value,favorite:$('feedback-favorite').value,clarity:Number($('feedback-clarity').value),notes:$('feedback-notes').value};
   let result;try{result=buildFeedback(answers,getSummary());}catch{result=error('summary','旅途摘要暂时不可用，请稍后再试；没有保存或发送任何内容。');}
   if(!result.ok){$('feedback-form-error').textContent=result.error;const field={familiarity:'feedback-familiarity',continueInterest:'feedback-interest',favorite:'feedback-favorite',clarity:'feedback-clarity',notes:'feedback-notes'}[result.field];if(field)$(field).focus();return;}
   preview(result.data);
  };
 }
 function preview(data){
  const token=++generation,text=JSON.stringify(data,null,2);
  openModal('<section id="feedback-preview-view"><small>还没有下载，也没有发送</small><h2>看看你准备留下的记录</h2><div class="journal-entry"><p id="feedback-preview-answers"></p><p id="feedback-preview-notes" class="feedback-verbatim"></p></div><div class="journal-entry"><h3>附带的旅途摘要</h3><p id="feedback-preview-session"></p><p class="muted">只附带版本、游玩时长、已回信庭院、章节、结尾、画质和视口大小。不读取身份、浏览器标识、IP 或存档原文。</p><details><summary>查看将下载的全部字段</summary><pre id="feedback-preview-json" class="feedback-json"></pre></details></div><p>这是你的本地文件。是否保留、是否另行分享，都由你决定；游戏不会上传它。</p><p id="feedback-download-status" role="status" aria-live="polite"></p><div class="row"><button id="feedback-download" class="primary">下载试玩记录</button><button id="feedback-back">回去修改</button><button id="feedback-preview-cancel">不保存，回到旅途</button></div></section>');
  const view=$('feedback-preview-view'),a=data.answers,s=data.session;
  $('feedback-preview-answers').textContent=`操作熟悉程度：${choices.familiarity[a.familiarity]}。继续类似旅途：${choices.continueInterest[a.continueInterest]}。最喜欢：${choices.favorite[a.favorite]}。操作理解程度：${a.clarity} / 5。`;
  $('feedback-preview-notes').textContent=a.notes||'没有填写补充建议。';
  $('feedback-preview-session').textContent=`版本 ${s.version} · 游玩 ${s.playedSeconds} 秒 · ${s.chapter===4?'春信已寄出':'第 '+(s.chapter+1)+' 幕'} · 已回信：${s.letters.map(id=>gardenNames[id]).join('、')||'无'} · 结尾：${s.ending||'尚未寄出'} · 画质 ${s.quality} · 视口 ${s.viewport.width} × ${s.viewport.height}。`;
  $('feedback-preview-json').textContent=text;
  $('feedback-back').onclick=()=>{if(active(view,token))form(a);};$('feedback-preview-cancel').onclick=()=>{if(active(view,token))close();};
  $('feedback-download').onclick=()=>{
   if(!active(view,token))return;let link,url;
   try{url=URL.createObjectURL(new Blob([text],{type:'application/json;charset=utf-8'}));link=document.createElement('a');link.href=url;link.download='春信试玩记录-'+s.version+'.json';document.body.append(link);link.click();$('feedback-download-status').textContent='记录已交给浏览器下载，没有上传或发送。';toast?.('试玩记录已交给浏览器下载。');}
   catch{$('feedback-download-status').textContent='浏览器未能下载文件。可以检查下载权限后再试，或取消；没有发送任何内容。';}
   finally{link?.remove();if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
  };
 }
 return {show:()=>form()};
}
