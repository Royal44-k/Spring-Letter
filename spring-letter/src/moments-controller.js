import {Group,Vector3} from 'three';
import {LETTERS,letterById,letterUnlocked,completedLetters} from './letter-model.js';
import {letterWaypoint} from './letter-wayfinding.js';
import {createRainMoment} from './moment-rain.js';
import {createWindMoment} from './moment-wind.js';
import {createTideMoment} from './moment-tide.js';
import {createMomentEnvironment} from './moment-environment.js';
import {createMoments,momentText,safeArtwork} from './moments-state.js';
import {createTouchButtonActivator} from './touch-buttons.js';
import './letter-ui.css';
import './moments.css';

export function createLetterController({getState,onFocus,onExit,onSave,onReply,onCommit,onSound,onBook,onContinue}){
 const group=new Group(),stages={rain:createRainMoment({onSound}),wind:createWindMoment({onSound}),tide:createTideMoment({onSound})},environments={rain:createMomentEnvironment('rain'),tide:createMomentEnvironment('tide')};
 for(const l of LETTERS){stages[l.id].group.position.set(l.x,l.y||1.4,l.z);group.add(stages[l.id].group);const env=environments[l.id];if(env){env.group.position.copy(stages[l.id].group.position);group.add(env.group);}}
 let activeId=null,nearId=null,trackedId='rain',manualTrack=false,hint='',lastUI='',lastDraft='',wayAt=-1,waypoint=null,wayId=null,expanded=true;
 const heldDirections=new Map(),suppressDirectionClicks=new Set();
 const panel=document.createElement('section');panel.id='letter-panel';panel.className='moments-panel';panel.hidden=true;panel.innerHTML='<div class="moment-heading"><div><small id="moment-kicker"></small><h2 id="moment-title"></h2></div><button id="moment-close" aria-label="离开当前体验">收起 ×</button></div><p id="moment-status" role="status"></p><div class="moment-progress" aria-hidden="true"><i></i></div><div id="moment-controls"></div><div class="moment-foot"><details id="moment-note"><summary>这封来信与操作方法</summary><p id="moment-note-text"></p><p id="moment-rule"></p></details><button id="moment-hint">一点提示 H</button></div><p id="moment-help" role="status"></p><div id="moment-choices"></div><button id="moment-next" hidden>收好回信，继续上路 →</button>';
 const post=document.createElement('aside');post.id='letter-post';post.className='moment-post';post.hidden=true;post.innerHTML='<small>送春人的旅途</small><h3></h3><p></p><button id="moment-enter">走近看看 · E</button><button id="moment-book">来信册 ↗</button>';
 const marker=document.createElement('div');marker.id='letter-target';marker.hidden=true;marker.innerHTML='<b></b><span></span>';document.body.append(panel,post,marker);
 const $=id=>panel.querySelector('#'+id),point=new Vector3();
 const introduction=document.createElement('p');introduction.id='moment-introduction';introduction.className='moment-introduction';panel.querySelector('.moment-heading').after(introduction);
 const instructions=document.createElement('p');instructions.id='moment-instructions';$('moment-status').after(instructions);
 const tools=document.createElement('div');tools.id='moment-tools';$('moment-status').after(tools);tools.append(instructions,panel.querySelector('.moment-progress'),$('moment-controls'),panel.querySelector('.moment-foot'),$('moment-help'));
 const outcomeActions=document.createElement('div');outcomeActions.className='moment-outcome-actions';panel.append(outcomeActions);outcomeActions.append($('moment-choices'),$('moment-next'));
 const editButton=document.createElement('button');editButton.id='moment-edit';editButton.textContent='展开操作';$('moment-close').before(editButton);editButton.onclick=()=>{expanded=!expanded;};
 function state(){const s=getState();s.moments??=createMoments();return s;}
 function syncDraft(){if(!activeId)return;const d=safeArtwork(stages[activeId].snapshot().draft),raw=JSON.stringify(d);if(raw!==lastDraft){state().moments.entries[activeId].draft=d;lastDraft=raw;onSave();}}
 function cancel(){touchButtons.cancel();for(const direction of new Set(heldDirections.values()))stages.wind.action(direction,false);heldDirections.clear();if(activeId){stages[activeId].pointer('cancel');if(activeId==='tide')stages.tide.action('stop');}}
 function enter(id){const s=state(),l=letterById(id);if(!letterUnlocked(l,s)||Math.hypot(s.player.x-l.x,s.player.z-l.z)>4.3)return false;activeId=id;expanded=!s.moments.entries[id].completed;trackedId=id;manualTrack=false;hint='';lastUI='';stages[id].restore(s.moments.entries[id].draft);lastDraft=JSON.stringify(s.moments.entries[id].draft);s.letters.entries[id].read=true;onFocus(id);return true;}
 function exit(){cancel();syncDraft();activeId=null;hint='';panel.hidden=true;onExit();}
 function next(){const s=state(),current=activeId;const after=LETTERS.find(l=>letterUnlocked(l,s)&&!s.moments.entries[l.id].completed);if(after)trackedId=after.id;manualTrack=false;exit();wayAt=-1;onContinue?.(current,after?.id||null);}
 function action(id,value){if(!activeId)return;stages[activeId].action(id,value);hint='';syncDraft();lastUI='';}
 function commit(choice){if(!activeId)return;const snap=stages[activeId].snapshot();if(!snap.ready){hint='先完成眼前这一段，再把它写进春信。';return;}syncDraft();const result=onCommit(activeId,choice,safeArtwork(snap.draft));if(!result?.ok){hint='回信尚未保存。请先处理旅途存档提示，再试一次。';return;}hint='这次的春天，已经留在你的信里。';expanded=false;onReply(activeId,choice,{text:momentText(activeId).replies[choice]});lastUI='';}
 const touchButtons=createTouchButtonActivator({activate:b=>{if(b.dataset.mAction)action(b.dataset.mAction,b.dataset.value);if(b.dataset.commit)commit(b.dataset.commit);}});
 panel.addEventListener('pointerdown',e=>{touchButtons.pointer('down',e);const b=e.target.closest('button');if(activeId!=='wind'||!b||b.disabled||!['left','right','up','down'].includes(b.dataset.mAction)||heldDirections.has(e.pointerId))return;e.preventDefault();const direction=b.dataset.mAction;heldDirections.set(e.pointerId,direction);suppressDirectionClicks.add(direction);b.setPointerCapture(e.pointerId);stages.wind.action(direction,true);});
 panel.addEventListener('pointermove',e=>touchButtons.pointer('move',e));
 panel.addEventListener('pointerup',e=>touchButtons.pointer('up',e));
 panel.addEventListener('pointercancel',e=>touchButtons.pointer('cancel',e));
 const releaseButton=e=>{const direction=heldDirections.get(e.pointerId);if(!direction)return;heldDirections.delete(e.pointerId);if(![...heldDirections.values()].includes(direction))stages.wind.action(direction,false);syncDraft();};
 panel.addEventListener('pointerup',releaseButton);panel.addEventListener('pointercancel',releaseButton);panel.addEventListener('lostpointercapture',releaseButton,true);
 panel.addEventListener('click',e=>{if(touchButtons.shouldSuppressClick(e))return;const b=e.target.closest('button');if(!b)return;if(suppressDirectionClicks.has(b.dataset.mAction)&&e.detail>0){suppressDirectionClicks.delete(b.dataset.mAction);return;}if(b.dataset.mAction)action(b.dataset.mAction,b.dataset.value);if(b.dataset.commit)commit(b.dataset.commit);});
 $('moment-close').onclick=exit;$('moment-hint').onclick=()=>{hint=activeId?stages[activeId].snapshot().hint:'';};$('moment-next').onclick=next;
 post.querySelector('#moment-enter').onclick=()=>nearId&&enter(nearId);post.querySelector('#moment-book').onclick=onBook;
 function updateUI(mode,focus,challengeActive){
  const s=state();panel.hidden=!activeId||mode!=='play';document.body.classList.toggle('letter-focus',!!activeId);document.body.classList.toggle('moment-focus',!!activeId);document.body.dataset.moment=activeId||'';
  if(activeId){const text=momentText(activeId),snap=stages[activeId].snapshot(),e=s.moments.entries[activeId],key=JSON.stringify([activeId,snap.controls,snap.ready,e.completed,s.letters.entries[activeId].choice]);
   tools.hidden=e.completed&&!expanded;editButton.hidden=!e.completed;editButton.textContent=expanded?'收起操作':'再玩一会儿';panel.classList.toggle('moment-compact',tools.hidden);
   $('moment-title').textContent=text.title;$('moment-kicker').textContent=({rain:'01 / 花光暗房',wind:'02 / 纸翼渡风',tide:'03 / 回声织信'})[activeId];$('moment-status').textContent=snap.status||snap.hint||text.rule;panel.querySelector('.moment-progress i').style.width=Math.round((snap.progress||0)*100)+'%';$('moment-help').textContent=hint;
   introduction.textContent=({rain:'“我想记住的不是房子，是有人在窗边等春天。” — 禾',wind:'“有些话，走路送不到。替我让这封信摸一摸风。” — 阿渡',tide:'旧杯声在这里停下了。游絮在空白里，等一段属于你的回答。'})[activeId];
   instructions.textContent=({rain:'拖住透光花笺，叠向幕上的留影 · 1 / 2 / 3 选片，方向键微调',wind:'拖住纸翼，或按住 WASD / 方向键升降转向 · 空格收翼缓行',tide:'点触或拖过乐器，让不同声音相互回应 · 听完这一遍，再决定寄向哪里'})[activeId];
   if(key!==lastUI&&!heldDirections.size){lastUI=key;$('moment-note-text').textContent=text.sender+'：'+text.note;$('moment-rule').textContent=text.rule;
    $('moment-controls').replaceChildren(...(snap.controls||[]).map(c=>{const b=document.createElement('button');b.textContent=c.label;b.dataset.mAction=c.id;if(c.value!=null)b.dataset.value=String(c.value);b.disabled=!!c.disabled;b.classList.toggle('selected',!!(c.selected||c.active||c.pressed));b.setAttribute('aria-pressed',String(!!(c.selected||c.active||c.pressed)));return b;}));
    $('moment-choices').replaceChildren(...(snap.ready?text.goals:[]).map(g=>{const b=document.createElement('button');b.dataset.commit=g.id;b.textContent=g.title;b.classList.toggle('chosen',e.completed&&s.letters.entries[activeId].choice===g.id);return b;}));$('moment-next').hidden=!e.completed;
   }
  }
  const target=letterById(nearId||trackedId),doneAll=LETTERS.every(l=>s.moments.entries[l.id].completed);post.hidden=mode!=='play'||!!focus||challengeActive||(!nearId&&doneAll);if(!post.hidden){post.querySelector('h3').textContent=momentText(target.id).title;post.querySelector('p').textContent=nearId?({rain:'光在玻璃里等你。抓住一片花笺，看看另一面的世界。',wind:'岸边有一只还没起飞的纸翼。',tide:'水面留着八拍空白。来写一段自己的春声。'})[nearId]:'循路标走近，按 E 开始。';post.querySelector('#moment-enter').hidden=!nearId;}
 }
 function reset(){cancel();touchButtons.reset();activeId=null;nearId=null;manualTrack=false;const s=state();for(const id of Object.keys(stages))stages[id].restore(s.moments.entries[id].draft);trackedId=LETTERS.find(l=>!s.moments.entries[l.id].completed)?.id||'rain';lastUI='';}
 reset();
 return {group,get activeId(){return activeId;},get selectedId(){return activeId?stages[activeId].snapshot().selected:null;},get nearId(){return nearId;},get trackedId(){return trackedId;},enter,exit,reset,cancel,commit,
  track(id){if(letterById(id)){trackedId=id;manualTrack=true;wayAt=-1;}},
  pointer(type,ray,e){if(!activeId)return false;const handled=stages[activeId].pointer(type,ray,e);if(type==='up'){if(handled)expanded=true;syncDraft();}return handled;},
  pick(ray){return this.pointer('down',ray);},burst(){if(activeId){action('play');return true;}return false;},
  handleKey(event){if(!activeId)return false;if(event.type!=='keyup'&&event.target?.matches?.('input,select,textarea'))return false;if(event.code==='KeyH'&&event.type!=='keyup'){hint=stages[activeId].snapshot().hint;expanded=true;return true;}if(event.code==='KeyE'||event.code==='Escape')return false;const used=stages[activeId].key(event);if(used&&event.type!=='keyup')expanded=true;if(event.type==='keyup')syncDraft();return !!used;},
  cameraOffset(){return activeId?stages[activeId].cameraOffset:null;},
  bounds(){if(!activeId)return null;const stage=stages[activeId],b=stage.bounds,o=stage.group.position;return {min:b.min.map((v,i)=>v+o.getComponent(i)),max:b.max.map((v,i)=>v+o.getComponent(i))};},
  frameRect(w,h){const r=panel.getBoundingClientRect();return {left:w<701?12:35,right:w-(w<701?12:35),top:h<500?68:w<701?90:100,bottom:Math.max(h*.42,r.top-16)};},
  musicState(){return {letter:activeId,letterChoice:activeId?state().letters.entries[activeId].choice:null,letterConnected:activeId?stages[activeId].snapshot().ready:false,composing:activeId==='tide'};},
  update(time,dt,{mode,focus,palette,reducedMotion,quality,challengeActive,camera,heightAt}){const s=state();nearId=mode==='play'&&!focus&&!challengeActive?LETTERS.find(l=>letterUnlocked(l,s)&&Math.hypot(s.player.x-l.x,s.player.z-l.z)<3.9)?.id||null:null;if(!activeId&&!manualTrack&&s.moments.entries[trackedId].completed)trackedId=LETTERS.find(l=>letterUnlocked(l,s)&&!s.moments.entries[l.id].completed)?.id||trackedId;
   group.visible=mode==='play'||mode==='opening';for(const [id,stage]of Object.entries(stages)){stage.group.visible=!activeId||activeId===id;stage.update(time,dt,{active:activeId===id&&mode==='play',palette,reducedMotion,quality,completed:s.moments.entries[id].completed,choice:s.letters.entries[id].edition===2?s.letters.entries[id].choice:null});environments[id]?.update(time,dt,{active:activeId===id&&mode==='play',palette,reducedMotion});if(activeId===id){const snap=stage.snapshot();if(!snap.dragging)s.moments.entries[id].draft=safeArtwork(snap.draft);}}
   updateUI(mode,focus,challengeActive);const all=LETTERS.every(l=>s.moments.entries[l.id].completed),bridge=all&&!s.bridge.solved&&!manualTrack,guidance=bridge?'bridge':trackedId;marker.hidden=mode!=='play'||!!focus||challengeActive||(!bridge&&all&&!manualTrack)||!letterUnlocked(letterById(trackedId),s);
   if(!marker.hidden&&camera){if(time-wayAt>.15||wayId!==guidance){waypoint=letterWaypoint(guidance,s.player,s);wayAt=time;wayId=guidance;}if(waypoint){const p=waypoint.target;point.set(p.x,(heightAt?.(p.x,p.z)?.height??.12)+1.15,p.z).project(camera);let x=(point.x*.5+.5)*innerWidth,y=(-point.y*.5+.5)*innerHeight;if(point.z>1)x=x<innerWidth/2?innerWidth-90:90;x=Math.max(95,Math.min(innerWidth-95,x));y=Math.max(145,Math.min(innerHeight-240,y));const box=post.getBoundingClientRect();if(!post.hidden&&x<box.right+90&&y<box.bottom+50)y=box.bottom+60;marker.style.left=x+'px';marker.style.top=y+'px';marker.querySelector('b').textContent=bridge?'借桥的旧石台':({rain:'花光暗房',wind:'纸翼渡风',tide:'回声织信'})[trackedId];marker.querySelector('span').textContent=nearId===trackedId?'走近看看 · E':waypoint.label+' · '+Math.ceil(waypoint.distance)+' 步';}}
  },
  snapshot(){return {activeId,nearId,trackedId,selectedId:activeId?stages[activeId].snapshot().selected:null,completed:LETTERS.filter(l=>state().moments.entries[l.id].completed).map(l=>l.id),stages:Object.fromEntries(Object.entries(stages).map(([id,v])=>[id,v.snapshot()]))};},
  dispose(){cancel();touchButtons.dispose();Object.values(stages).forEach(s=>s.dispose());Object.values(environments).forEach(s=>s.dispose());panel.remove();post.remove();marker.remove();}
 };
}
