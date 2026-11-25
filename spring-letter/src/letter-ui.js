import './letter-ui.css';
import {LETTERS,letterById,letterUnlocked,evaluateLetter,tilePorts} from './letter-model.js';

const GARDENS={rain:'雨庭',wind:'风庭',tide:'潮庭'};
const SHORT_SENDERS={rain:'禾',wind:'阿渡',tide:'岑 / 游絮'};
const WISHES={rain:'老树和新芽，先照料一处。',wind:'护种帆和迎客灯，先修好一件。',tide:'让两种声音相遇，再留下一声。'};
const NEXT_STEPS=Object.freeze({
 rain:Object.freeze({target:'rain',label:'收好回信 · 去听雨春庭',hint:'循路标回到初庭，再沿左岸石路走向听雨春庭。'}),
 wind:Object.freeze({target:'wind',label:'收好回信 · 去逆风春庭',hint:'沿石路回到主庭，再循路标走向右岸的信亭。'}),
 tide:Object.freeze({target:'tide',label:'收好回信 · 去回声春庭',hint:'沿主路继续向北，再循路标走向回声春庭。'}),
 bridge:Object.freeze({target:'bridge',label:'收好回信 · 回旧台织桥',hint:'循路标回到旧台，借花尘织桥，继续走向彼岸。'}),
 garden:Object.freeze({target:'garden',label:'收好回信 · 回到庭院',hint:'回到庭院，看看留下的照料，或继续沿主路走。'}),
});
export function letterNextStep(state,id){
 const index=LETTERS.findIndex(letter=>letter.id===id),entries=state?.letters?.entries;
 const answered=letter=>letter.goals.some(goal=>goal.id===entries?.[letter.id]?.choice);
 if(index<0||!answered(LETTERS[index]))return null;
 const next=[...LETTERS.slice(index+1),...LETTERS.slice(0,index)].find(letter=>!answered(letter)&&letterUnlocked(letter,state));
 if(next)return NEXT_STEPS[next.id];
 return LETTERS.every(answered)&&!state.bridge?.solved?NEXT_STEPS.bridge:NEXT_STEPS.garden;
}
const SIDES=['上','右','下','左'];
const PORT_POINTS=[[32,7],[57,32],[32,57],[7,32]];
const escape=text=>String(text??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const leaf='<svg viewBox="0 0 44 60" fill="none" aria-hidden="true"><path d="M21 53C3 40 6 15 34 6c5 21 1 40-13 47Z"/><path d="m14 59 15-43M22 35 13 25m6 20 12-7m-5-14 8-6"/></svg>';

/** A quiet edge of the 3D garden. All progress and puzzle decisions stay in the model. */
export function mountLetterUI({onOpen,onClose,onRotate,onUndo,onHint,onBook,onCommit,onSelect,onContinue}={}){
 const post=document.createElement('section');
 post.id='letter-post';post.hidden=true;post.setAttribute('aria-label','庭院来信');
 post.innerHTML=`<div class="letter-post-top"><span class="letter-post-label">旧信 · 新的照料</span><button type="button" data-letter-action="book" aria-label="打开来信册">信册 <span aria-hidden="true">↗</span></button></div><div class="letter-post-main"><div class="letter-post-leaf">${leaf}</div><div><small id="letter-post-place"></small><h2 id="letter-post-title"></h2></div></div><p id="letter-post-route"></p><div class="letter-post-bottom"><div class="letter-stamps" aria-label="三封来信的进度">${LETTERS.map(l=>`<span class="letter-stamp" data-stamp="${l.id}"><b>${GARDENS[l.id][0]}</b><small>待启</small></span>`).join('')}</div><button type="button" id="letter-open" data-letter-action="open" hidden><kbd>E</kbd><span>读信</span></button></div>`;

 const panel=document.createElement('aside');
 panel.id='letter-panel';panel.hidden=true;panel.setAttribute('aria-labelledby','letter-title');
 panel.innerHTML=`
  <div class="letter-panel-head">
   <div class="letter-heading"><small id="letter-place"></small><h2 id="letter-title"></h2></div>
   <div class="letter-head-actions"><button type="button" id="letter-fold" data-letter-action="fold" aria-label="折起信纸" aria-controls="letter-content" aria-expanded="true"><span aria-hidden="true">⌄</span></button><button type="button" id="letter-close" data-letter-action="close" aria-label="收起信纸，回到庭院" title="回到庭院 · E"><span aria-hidden="true">×</span></button></div>
  </div>
  <button type="button" id="letter-origin-open" data-letter-action="read-note" aria-controls="letter-note" aria-expanded="false" hidden><b id="letter-sender-short"></b><span id="letter-wish-short"></span><small>全文 <span aria-hidden="true">›</span></small></button>
  <div id="letter-tabs" class="letter-tabs" role="tablist" aria-label="来信操作" hidden>
   <button type="button" id="letter-tab-turn" role="tab" data-letter-action="show-turn" aria-controls="letter-work" aria-selected="true">转石</button>
   <button type="button" id="letter-tab-reply" role="tab" data-letter-action="show-reply" aria-controls="letter-choice-section" aria-selected="false" tabindex="-1">回信 <span id="letter-tab-ready"></span></button>
  </div>
  <div id="letter-content" class="letter-panel-body">
   <div id="letter-work" class="letter-panel-scroll" role="tabpanel" aria-labelledby="letter-tab-turn">
    <div class="letter-origin"><p id="letter-sender"></p><details id="letter-note"><summary><span id="letter-note-preview"></span><span class="letter-note-toggle">全文 <i aria-hidden="true">＋</i></span></summary><p></p></details></div>
    <section class="letter-rule"><span class="letter-section-label">转石 · 接续叶脉</span><p id="letter-rule"></p><p id="letter-stone-guidance"><span class="letter-guidance-full">点另一块叶脉石，选中并转动；细暗的石片是固定的。</span><span class="letter-guidance-short">点另一块石，选中并转动；细暗石片固定。</span></p></section>
    <section class="letter-stone-tools" aria-label="转动叶脉石">
     <div class="letter-selected"><svg id="letter-direction" viewBox="0 0 64 64" role="img"><title>叶脉石的沟槽方向</title><rect x="3" y="3" width="58" height="58" rx="13"/><g class="letter-direction-ports"></g><circle cx="32" cy="32" r="3"/></svg><div><b id="letter-selected-name"></b><span id="letter-selected-ports"></span></div></div>
     <div class="letter-turn-buttons"><button type="button" id="letter-turn-left" data-letter-action="left"><span aria-hidden="true">↶</span> 逆时针</button><button type="button" id="letter-turn-right" data-letter-action="right"><span aria-hidden="true">↷</span> 顺时针</button></div>
     <div class="letter-small-actions"><button type="button" id="letter-undo" data-letter-action="undo">撤销 <kbd>Z</kbd></button><button type="button" id="letter-hint-button" data-letter-action="hint">一点提示 <kbd>H</kbd></button></div><p id="letter-hint" hidden></p>
    </section>
    <details id="letter-help"><summary>选石与操作 <span aria-hidden="true">＋</span></summary><div id="letter-tile-picker" class="letter-tile-picker" role="group" aria-label="选择叶脉石"></div><p>点画面中的石头转动；方向键选石，Enter 转动。</p><p>碰一碰源花，或 <kbd>F</kbd> 借一阵花尘。</p></details>
   </div>
   <section id="letter-choice-section" class="letter-choices" role="tabpanel" aria-labelledby="letter-tab-reply">
    <div id="letter-next" hidden><button type="button" id="letter-continue" data-letter-action="continue"></button><p id="letter-next-reply" aria-label="你写下的回信"></p><p id="letter-next-route"></p><small class="letter-next-review">向下查看回信与改写选项 <span aria-hidden="true">↓</span></small></div>
    <div class="letter-choice-heading"><span class="letter-section-label">回信 · 把春天留给谁</span><span id="letter-flow-status"></span></div>
    <div id="letter-choices"></div>
    <details id="letter-reply" hidden><summary class="letter-reply-heading"><span class="letter-section-label">你留下的回信</span><span>已记入信册 <i aria-hidden="true">＋</i></span></summary><p id="letter-reply-text"></p><p id="letter-reward"></p><p class="letter-rechoose">想重选：接通另一座花池，再点它写信。回信会替换，两种选择的能力奖励相同。</p></details>
    <div class="letter-panel-foot"><button type="button" data-letter-action="book">翻看来信册 ↗</button><span>接通后，亲手写信。</span></div>
   </section>
  </div>`;

 const live=document.createElement('div');live.id='letter-live';live.className='letter-sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');
 document.body.append(post,panel,live);
 const refs=Object.fromEntries([...post.querySelectorAll('[id]'),...panel.querySelectorAll('[id]')].map(node=>[node.id,node]));
 const stamps=Object.fromEntries([...post.querySelectorAll('[data-stamp]')].map(node=>[node.dataset.stamp,node]));
 let current=null,postKey='',panelKey='',contentId=null,announced='',folded=false,lastVisibility='',page='turn',previousReady=null,previousChoice=null;
 const narrow=window.matchMedia('(max-width:700px)');
 let pickerButtons=[],choiceButtons=[];
 function announce(text){if(text!==announced){announced=text;live.textContent=text;}}
 function setFold(value){folded=value;refs['letter-content'].hidden=value;refs['letter-tabs'].hidden=value||!narrow.matches;refs['letter-origin-open'].hidden=value||!narrow.matches;panel.classList.toggle('is-folded',value);refs['letter-fold'].setAttribute('aria-expanded',String(!value));refs['letter-fold'].setAttribute('aria-label',value?'展开信纸':'折起信纸');}
 function setPage(value,scroll=false){
  page=value;panel.dataset.page=value;refs['letter-tabs'].hidden=folded||!narrow.matches;refs['letter-origin-open'].hidden=folded||!narrow.matches;
  refs['letter-work'].hidden=narrow.matches&&value!=='turn';refs['letter-choice-section'].hidden=narrow.matches&&value!=='reply';
  for(const name of ['turn','reply']){const button=refs[`letter-tab-${name}`];button.setAttribute('aria-selected',String(name===value));button.tabIndex=name===value?0:-1;}
  if(scroll)refs[value==='reply'?'letter-choice-section':'letter-work'].scrollTop=0;
 }
 function resize(){setPage(page);}
 narrow.addEventListener('change',resize);
 function tabKey(event){
  if(!event.target.matches('[role="tab"]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();setPage(event.key==='Home'?'turn':event.key==='End'?'reply':page==='turn'?'reply':'turn',true);refs[`letter-tab-${page}`].focus({preventScroll:true});
 }
 refs['letter-tabs'].addEventListener('keydown',tabKey);
 function noteToggle(){refs['letter-origin-open'].setAttribute('aria-expanded',String(refs['letter-note'].open));}
 refs['letter-note'].addEventListener('toggle',noteToggle);
 function click(event){
  const button=event.target.closest('button');if(!button||button.disabled)return;
  event.stopPropagation();
  if(button.dataset.tile){onSelect?.(button.dataset.tile);return;}
  if(button.dataset.commit){onCommit?.(button.dataset.commit);return;}
  const action=button.dataset.letterAction;
  if(action==='open'&&current?.nearId)onOpen?.(current.nearId);
  else if(action==='close')onClose?.();
  else if(action==='left')onRotate?.(-1);
  else if(action==='right')onRotate?.(1);
  else if(action==='undo')onUndo?.();
  else if(action==='hint')onHint?.();
  else if(action==='book')onBook?.();
  else if(action==='fold')setFold(!folded);
  else if(action==='show-turn')setPage('turn',true);
  else if(action==='show-reply')setPage('reply',true);
  else if(action==='read-note'){
   setPage('turn');refs['letter-note'].open=true;noteToggle();
   const work=refs['letter-work'],origin=refs['letter-sender'];work.scrollTop+=origin.getBoundingClientRect().top-work.getBoundingClientRect().top-8;
  }
  else if(action==='continue'&&letterNextStep(current?.state,current?.activeId)){
   if(onContinue)onContinue(current.activeId);else onClose?.();
  }
 }
 post.addEventListener('click',click);panel.addEventListener('click',click);
 function configureLetter(letter,entry){
  contentId=letter.id;panel.dataset.letter=letter.id;previousReady=null;previousChoice=entry.choice;setFold(false);setPage('turn',true);
  refs['letter-title'].textContent=letter.title;
  refs['letter-sender'].textContent=`来自 ${letter.sender}`;
  refs['letter-sender-short'].textContent=SHORT_SENDERS[letter.id];refs['letter-wish-short'].textContent=WISHES[letter.id];
  refs['letter-origin-open'].setAttribute('aria-label',`来自${letter.sender}。${WISHES[letter.id]}打开完整来信`);
  refs['letter-note'].querySelector('p').textContent=letter.note;
  refs['letter-note-preview'].textContent=letter.note.match(/^[^。！？]+[。！？]?/)?.[0]||letter.note;
  refs['letter-note'].open=false;refs['letter-help'].open=false;refs['letter-reply'].open=!!entry.choice;
  refs['letter-rule'].textContent=letter.rule;
  refs['letter-tile-picker'].innerHTML=letter.tiles.filter(tile=>!tile.locked).map(tile=>`<button type="button" data-tile="${escape(tile.id)}" aria-label="选择叶脉石 ${escape(tile.id.toUpperCase())}" aria-pressed="false">${escape(tile.id.toUpperCase())}</button>`).join('');
  pickerButtons=[...refs['letter-tile-picker'].querySelectorAll('button')];
  refs['letter-choices'].innerHTML=letter.goals.map(goal=>`<button type="button" class="letter-choice" data-commit="${escape(goal.id)}" disabled><span class="letter-choice-mark" aria-hidden="true">${leaf}</span><span class="letter-choice-copy"><b>${escape(goal.title)}</b><span>${escape(goal.detail)}</span><small>接通后写信</small></span></button>`).join('');
  choiceButtons=[...refs['letter-choices'].querySelectorAll('button')];
  refs['letter-reward'].textContent=letter.reward;
  refs['letter-work'].scrollTop=0;refs['letter-choice-section'].scrollTop=0;
 }
 return {
  update(value){
   current=value;const {state,mode,focus,activeId,selectedId,nearId,trackedId,hint='',canUndo=false,challengeActive=false}=value;
   const entries=state?.letters?.entries;if(!entries)return;
   const active=mode==='play'&&focus==='letter'&&!!letterById(activeId);
   const roaming=mode==='play'&&!focus&&!challengeActive&&(!!nearId||LETTERS.some(letter=>!entries[letter.id]?.choice));
   const visibility=`${active}:${roaming}`;
   if(visibility!==lastVisibility){lastVisibility=visibility;panel.hidden=!active;post.hidden=!roaming;document.body.classList.toggle('letter-focus',active);if(active){setFold(false);setPage('turn',true);previousReady=null;}else panelKey='';if(!roaming)postKey='';}
   if(roaming){
    const unlocked=LETTERS.filter(letter=>letterUnlocked(letter,state));
    const unfinished=unlocked.filter(letter=>!entries[letter.id]?.choice);
    const target=letterById(nearId)||unfinished.find(letter=>letter.id===trackedId)||unfinished[0]||unlocked.find(letter=>letter.id===trackedId)||unlocked[0]||LETTERS[0];
    const key=JSON.stringify([target.id,nearId,LETTERS.map(letter=>[letterUnlocked(letter,state),entries[letter.id]?.choice])]);
    if(key!==postKey){
     postKey=key;const count=LETTERS.filter(letter=>entries[letter.id]?.choice).length,near=nearId===target.id;
     refs['letter-post-place'].textContent=`${GARDENS[target.id]} · ${entries[target.id]?.choice?'已回信':near?'就在身旁':'一封来信在等你'}`;
     refs['letter-post-title'].textContent=count===LETTERS.length&&!near?'三封回信，三处春天':target.title;
     refs['letter-post-route'].textContent=near?(entries[target.id]?.choice?'看看留下的照料，也可以重新写信。':'转动叶脉石，替寄信人照料一处生活。'):count===LETTERS.length?'还可以回到庭院，看看你留下的照料。':`循着${GARDENS[target.id]}的信亭走，走近后读信。`;
     refs['letter-open'].hidden=!near;refs['letter-open'].querySelector('span').textContent=entries[target.id]?.choice?'回看':'读信';
     for(const letter of LETTERS){const done=!!entries[letter.id]?.choice,available=letterUnlocked(letter,state),stamp=stamps[letter.id];stamp.dataset.state=done?'done':available?'open':'locked';stamp.classList.toggle('is-current',letter.id===target.id);stamp.querySelector('small').textContent=done?'已回':available?'待回':'待启';stamp.setAttribute('aria-label',`${GARDENS[letter.id]}：${done?'已回信':available?'可以前往':'旅途继续后开启'}`);stamp.title=`${letter.title} · ${done?'已回信':available?'可以前往':'旅途继续后开启'}`;}
     if(near)announce(`${GARDENS[target.id]}，${target.title}。按 E ${entries[target.id]?.choice?'回看':'读信'}。`);
    }
   }
   if(!active)return;
   const letter=letterById(activeId),entry=entries[activeId];if(!entry)return;
   const key=JSON.stringify([activeId,selectedId,entry.turns,LETTERS.map(item=>entries[item.id]?.choice),state.p1?.solved,state.wind?.solved,state.bridge?.solved,state.ending,hint,canUndo]);if(key===panelKey)return;panelKey=key;
   if(contentId!==activeId)configureLetter(letter,entry);
   const evaluation=evaluateLetter(letter,entry),tile=letter.tiles.find(item=>item.id===selectedId),ports=tile?tilePorts(tile,entry.turns[tile.id]):[];
   const directionText=ports.map(port=>SIDES[port]).join(' · '),name=tile?`叶脉石 ${tile.id.toUpperCase()}`:'先选择一块叶脉石';
   refs['letter-place'].textContent=`${GARDENS[letter.id]}来信${entry.choice?' · 已回信':''}`;
   refs['letter-selected-name'].textContent=name;refs['letter-selected-ports'].textContent=tile?`沟槽朝向 ${directionText}${tile.locked?' · 固定':''}`:'点石头，或用下方字母选择';
   refs['letter-direction'].setAttribute('aria-label',tile?`${name}，沟槽朝向${directionText}`:'尚未选择叶脉石');
   refs['letter-direction'].querySelector('.letter-direction-ports').innerHTML=ports.map(port=>`<path d="M32 32L${PORT_POINTS[port].join(' ')}"/>`).join('');
   for(const button of pickerButtons)button.setAttribute('aria-pressed',String(button.dataset.tile===selectedId));
   refs['letter-turn-left'].disabled=refs['letter-turn-right'].disabled=!tile||tile.locked;
   refs['letter-undo'].disabled=!canUndo;
   refs['letter-hint'].hidden=!hint;refs['letter-hint'].textContent=hint;
   const readyNames=letter.goals.filter(goal=>evaluation.ready.includes(goal.id)).map(goal=>goal.title);
   const status=evaluation.leaks.length?'旧井漏风':evaluation.ready.length?(evaluation.ready.includes(entry.choice)?'已记入信册':'已接通 · 可写信'):letter.requiredSources===2&&Object.values(evaluation.goalSources).some(sources=>sources.length)?'还等另一处泉眼':'接通后写信';
   refs['letter-flow-status'].textContent=status;refs['letter-flow-status'].classList.toggle('is-ready',evaluation.ready.length>0);
   refs['letter-tab-ready'].textContent=evaluation.ready.length?(evaluation.ready.includes(entry.choice)?'已回':'可写'):'';
   for(const button of choiceButtons){const id=button.dataset.commit,ready=evaluation.ready.includes(id),chosen=entry.choice===id;button.disabled=!ready;button.classList.toggle('is-chosen',chosen);button.setAttribute('aria-pressed',String(chosen));button.querySelector('small').textContent=ready?(chosen?'已记入信册 · 可再写 ↗':'写下这封回信 ↗'):(chosen?'已回信 · 接通后可再写':'接通后写信');}
   refs['letter-reply'].hidden=!entry.choice;refs['letter-reply-text'].textContent=letter.replies[entry.choice]||'';
   const nextStep=letterNextStep(state,activeId),choiceChanged=entry.choice&&entry.choice!==previousChoice;
   refs['letter-next'].hidden=!nextStep;
   if(nextStep){
    const reply=letter.replies[entry.choice]||'';
    refs['letter-continue'].textContent=nextStep.label;refs['letter-next-route'].textContent=nextStep.hint;refs['letter-next'].dataset.destination=nextStep.target;
    refs['letter-next-reply'].textContent=reply.match(/^[^。！？]+[。！？]?/)?.[0]||reply;
   }
   if(choiceChanged){refs['letter-reply'].open=true;setPage('reply',true);}
   previousChoice=entry.choice;
   // Announce and reveal a newly connected outlet once. Stable ready states never seize scrolling.
   if(previousReady===false&&evaluation.ready.length>0){
    const focusWillHide=narrow.matches&&refs['letter-work'].contains(document.activeElement);
    setPage('reply',true);
    if(focusWillHide)refs['letter-tab-reply'].focus({preventScroll:true});
   }
   previousReady=evaluation.ready.length>0;
   announce(hint||`${name}${tile?`，沟槽朝向${directionText}`:''}。${status}${readyNames.length?`，可以选择${readyNames.join('，或')}并写信`:''}。`);
  },
  dispose(){post.removeEventListener('click',click);panel.removeEventListener('click',click);refs['letter-tabs'].removeEventListener('keydown',tabKey);refs['letter-note'].removeEventListener('toggle',noteToggle);narrow.removeEventListener('change',resize);post.remove();panel.remove();live.remove();document.body.classList.remove('letter-focus');}
 };
}
