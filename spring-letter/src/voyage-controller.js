import * as THREE from 'three';
import {createVoyageWorld} from './voyage-world.js';
import {createVoyageState,voyageCommand,stepVoyage,voyageStageInfo,voyageTideLevel,BOAT_DOCK} from './voyage-model.js';
import {PREDECESSOR_LETTER,LETTER_BEGINNINGS,VOYAGE_CHAPTERS,voyageLetterText} from './voyage-content.js';
import {scorePreviewEvents} from './score-preview.js';
import {createTravelController} from './navigation.js';
import './voyage.css';

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const roman=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'];
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const button=(id,text,action)=>{const b=node('button','',text);b.id=id;b.type='button';if(action)b.dataset.vAction=action;return b;};

/** Scene, UI and input boundary for the earned coastal continuation. */
export function createVoyageController({getState,onStart,onExit,onSave,onSound,onComplete,onPhoto,onSettings,onBook,onMap}){
 const world=createVoyageWorld(),held=new Set(),touchHeld=new Map(),travel=createTravelController();
 let active=false,lastStage='',hint='',cameraRef=null,drag=null,steer=0,hoisting=false,orbitYaw=0,orbitPitch=0,cameraYaw=0,manualCamera=0,walkTarget=null,readOpen=false,endingOpen=true,sealDrag=null,suppressSealClick=false,saveElapsed=0,scoreTime=-1,scoreIndex=0,lastUi=0,lastView=null,departureAge=0;
 const pointerPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.9),point=new THREE.Vector3();
 const root=node('section','voyage-ui');root.id='voyage-ui';root.hidden=true;root.setAttribute('aria-label','海岸与远航');root.setAttribute('tabindex','-1');
 const heading=node('div','voyage-heading');heading.innerHTML='<small id="voyage-chapter"></small><h2 id="voyage-title"></h2><p id="voyage-subtitle"></p>';root.append(heading);
 const tools=node('div','voyage-tools');tools.append(button('voyage-bag','信袋 · 1 封','bag'),button('voyage-recenter','镜头回正 C','recenter'),button('voyage-settings','暂停与设置','settings'),button('voyage-return','重访花庭','return'));root.append(tools);const atlasMapButton=button('voyage-map','驿路地图');atlasMapButton.onclick=()=>onMap?.();tools.append(atlasMapButton);
 const instruction=node('div','voyage-instruction');instruction.innerHTML='<span id="voyage-status" role="status"></span><p id="voyage-help"></p><div class="voyage-track"><i id="voyage-progress"></i></div>';root.append(instruction);
 const editor=node('article','voyage-paper voyage-editor');editor.id='voyage-editor';editor.innerHTML='<small>潮汐邮局 · 亲笔</small><h3>这一次，写你自己的春天</h3><p id="voyage-paper-intro" class="voyage-paper-intro">读过别人的牵挂之后，你想把什么，告诉远方的人？</p><label for="voyage-recipient">收信人</label><input id="voyage-recipient" maxlength="60" autocomplete="off" placeholder="给未来的我，或一个正在想念的人"><label for="voyage-body">正文</label><textarea id="voyage-body" rows="5" maxlength="600" placeholder="不必写得漂亮。一句真心的话，就能启程。"></textarea><div class="voyage-ink-note"><span id="voyage-count">0 / 600</span><span>只保存在这次旅途中</span></div><details class="voyage-beginnings"><summary>借一句开头</summary><div id="voyage-beginnings"></div></details><div class="voyage-signature">弥<span>送春人</span></div><div class="voyage-seal-row"><button id="voyage-seal" type="button" aria-label="封好自己的信"><span class="wax-flower">✳</span><span>按下花印<br><small>也可拖入信封</small></span></button><div id="voyage-envelope" aria-label="等待封缄的信封"><i></i><span>待寄出的春信</span><b id="voyage-stamp" hidden>✳</b></div></div><p id="voyage-draft-status" role="status"></p><button id="voyage-leave-desk" type="button" class="voyage-primary" hidden>收好自己的信，走向潮脊 →</button>';
 root.append(editor);
 const actionPanel=node('div','voyage-action-panel');actionPanel.id='voyage-actions';root.append(actionPanel);
 const readPanel=node('article','voyage-paper voyage-old-letter');readPanel.id='voyage-old-letter';readPanel.hidden=true;readPanel.append(node('small','','退潮之后 · 岑留下的信'),node('h3','',PREDECESSOR_LETTER.recipient));for(const p of PREDECESSOR_LETTER.paragraphs)readPanel.append(node('p','',p));readPanel.append(node('div','voyage-signature',PREDECESSOR_LETTER.signature),button('voyage-take-old','把这封信也带上','take-old'));root.append(readPanel);
 readPanel.append(button('voyage-close-old','先合上，看看潮水','close-old'));
 const bag=node('article','voyage-paper voyage-bag');bag.id='voyage-bag-panel';bag.hidden=true;root.append(bag);
 const end=node('article','voyage-ending');end.id='voyage-ending';end.hidden=true;end.innerHTML='<small>花漾年华 · 待寄出的春信</small><h2>信尚未抵达，<br>春天已经上路。</h2><div class="voyage-end-rule"></div><p>两封信，一封旧些，一封刚刚写好。<br>岸边留着你种下的春天，船继续向东。</p><div class="voyage-end-letter"><small id="voyage-end-recipient"></small><p id="voyage-end-body"></p><i>弥 与 游絮，途中</i></div><div class="voyage-end-actions"></div><small class="voyage-end-foot">启程 · 拂晓<br>远方还没有回信。故事留在那里。</small>';
 end.querySelector('.voyage-end-actions').append(button('voyage-download','收好这两封信 ↓','download'),button('voyage-watch-sea','再看一会儿海','watch'),button('voyage-end-photo','留一帧远航','photo'),button('voyage-end-return','重访花庭','return'));root.append(end);
 const touch=node('div','voyage-touch');touch.id='voyage-touch';touch.setAttribute('aria-label','海岸触屏操作');touch.innerHTML='<button data-v-hold="forward" aria-label="向前">↑</button><div><button data-v-hold="left" aria-label="向左">←</button><button data-v-hold="back" aria-label="向后">↓</button><button data-v-hold="right" aria-label="向右">→</button></div>';root.append(touch);
 const marker=node('button','voyage-world-label');marker.id='voyage-world-label';marker.type='button';marker.hidden=true;root.append(marker);document.body.append(root);
 const $=id=>root.querySelector('#'+id);
 function state(){return getState().voyage??=(createVoyageState());}
 function persist(){onSave?.();saveElapsed=0;}
 function clear(){held.clear();touchHeld.clear();drag=null;steer=0;hoisting=false;if(sealDrag)suppressSealClick=true;sealDrag=null;$('voyage-seal').style.transform='';walkTarget=null;travel.reset();}
 function events(list=[]){for(const e of list){if(e.text)hint=e.text;if(e.type==='recover'){hint='潮水回来了。游絮把你带回最近的高石，信仍在身边。';walkTarget=null;onSound?.('wave-step');}if(e.type==='sail')onSound?.('sail-hoist');if(e.type==='flower')onSound?.('sea-bloom',{kind:e.kind});if(e.type==='complete')onComplete?.();}}
 function command(name,payload){const r=voyageCommand(state(),name,payload);if(!r.ok){hint=r.reason||'先完成眼前这一件事。';sync(true);return false;}getState().voyage=r.state;events(r.events);persist();sync(true);return true;}
 function draft(event){if(event?.isComposing||state().stage!=='writing'||state().letter.sealed)return;command('write',{recipient:$('voyage-recipient').value,body:$('voyage-body').value,sealKind:getState().settings.flowerForm==='iris'?'iris':getState().settings.flowerForm==='lotus'?'lotus':'lily'});for(const field of ['recipient','body']){const input=$('voyage-'+field);if(input.value!==state().letter[field])input.value=state().letter[field];}}
 $('voyage-recipient').addEventListener('input',draft);$('voyage-body').addEventListener('input',draft);
 $('voyage-recipient').addEventListener('compositionend',draft);$('voyage-body').addEventListener('compositionend',draft);
 const reopen=button('voyage-reopen','拆开，再改一笔','unseal');reopen.hidden=true;$('voyage-leave-desk').before(reopen);
 for(const [panel,label] of [[readPanel,'岑留下的信'],[bag,'送春人的信袋'],[end,'启程终章']]){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',label);panel.setAttribute('tabindex','-1');}
 LETTER_BEGINNINGS.forEach(text=>{const b=button('',text);b.addEventListener('click',()=>{if(state().letter.sealed)return;$('voyage-body').value=($('voyage-body').value?$('voyage-body').value+'\n':'')+text;draft();$('voyage-body').focus();});$('voyage-beginnings').append(b);});
 function seal(){draft();if(command('seal')){onSound?.('voyage-seal');hint='花印落下了。这封信已经有了你的名字。';sync(true);}}
 $('voyage-seal').addEventListener('click',e=>{if(e.detail!==0&&suppressSealClick){suppressSealClick=false;return;}if(!sealDrag)seal();});
 $('voyage-seal').addEventListener('pointerdown',e=>{if(state().letter.sealed||e.button!==0)return;suppressSealClick=false;sealDrag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);});
 $('voyage-seal').addEventListener('pointermove',e=>{if(!sealDrag||e.pointerId!==sealDrag.id)return;const dx=e.clientX-sealDrag.x,dy=e.clientY-sealDrag.y;if(Math.hypot(dx,dy)>8){sealDrag.moved=true;$('voyage-seal').style.transform=`translate(${dx}px,${dy}px)`;}});
 $('voyage-seal').addEventListener('pointerup',e=>{if(!sealDrag||e.pointerId!==sealDrag.id)return;const moved=sealDrag.moved,b=$('voyage-envelope').getBoundingClientRect();$('voyage-seal').style.transform='';sealDrag=null;suppressSealClick=moved;if(moved&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom)seal();});
 $('voyage-seal').addEventListener('pointercancel',()=>{$('voyage-seal').style.transform='';sealDrag=null;suppressSealClick=true;});
 $('voyage-leave-desk').onclick=()=>{if(command('leave-desk')){clear();onSound?.('paper-open');}};
 function showBag(){clear();bag.replaceChildren(node('small','','送春人的信袋'),node('h3','',state().predecessor?'一封亲笔，一封旧信':'一封尚在路上的信'));bag.append(node('h4','',`致 ${state().letter.recipient||'尚未落款的人'}`),node('p','voyage-bag-body',state().letter.body||'纸页仍在海岸的书桌上。'));if(state().predecessor){bag.append(node('h4','',PREDECESSOR_LETTER.recipient));PREDECESSOR_LETTER.paragraphs.forEach(p=>bag.append(node('p','',p)));bag.append(node('i','',PREDECESSOR_LETTER.signature));}const close=button('voyage-bag-close','收好信袋');close.onclick=()=>{bag.hidden=true;clear();sync(true);$('voyage-bag').focus();};bag.append(close);bag.hidden=false;sync(true);close.focus();onSound?.('paper-open');}
 function download(){const url=URL.createObjectURL(new Blob([voyageLetterText(state().letter)],{type:'text/plain;charset=utf-8'})),a=node('a');a.href=url;a.download='花漾年华-我的两封春信.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
 function primary(){if(readOpen||!bag.hidden||!end.hidden)return;const s=state();if(s.stage==='tide'){if(Math.hypot(s.player.x,s.player.z+13)<2.15&&!s.predecessor){if(command('read-old')){readOpen=true;clear();onSound?.('paper-open');sync(true);$('voyage-take-old').focus();}}else hint=s.predecessor?'继续沿露出的石脊走向小岛。':'旧邮亭在潮脊中段。先看水，再迈步。';}
  else if(s.stage==='island'){if(command('board'))clear();}
  else if(s.stage==='rigging'){if(s.ropes.every(Boolean)&&s.sail>=.999){if(command('launch')){clear();onSound?.('departure');scoreTime=0;scoreIndex=0;}}else hint='解开船头两侧缆绳，再沿桅杆向下拉索升帆。';}
  else if(s.stage==='dawn'){if(command('depart')){clear();onSound?.('departure');endingOpen=true;}}
  else if(s.stage==='complete'){endingOpen=true;sync(true);}sync(true);
 }
 function scatter(){command('scatter',{kind:state().letter.sealKind||'lily'});}
 function action(action){if(action==='return'){stop();onExit?.();}else if(action==='settings'){clear();onSettings?.();}else if(action==='bag')showBag();else if(action==='unseal'){if(command('unseal')){hint='花印轻轻拆开了。把还想说的话，留在这里。';sync(true);$('voyage-body').focus();}}else if(action==='recenter'){orbitYaw=orbitPitch=0;manualCamera=0;travel.recenter();}else if(action==='close-old'){readOpen=false;clear();sync(true);$('voyage-primary')?.focus();}else if(action==='take-old'){if(readOpen&&command('take-old')){readOpen=false;readPanel.hidden=true;clear();onSound?.('paper-open');sync(true);$('voyage-bag').focus();}}else if(action==='primary')primary();else if(action==='scatter')scatter();else if(action==='untie-left'||action==='untie-right'){if(command('untie',{side:action==='untie-left'?0:1}))onSound?.('rope-release');}else if(action==='download')download();else if(action==='watch'){endingOpen=false;sync(true);$('voyage-show-ending')?.focus();}else if(action==='photo')onPhoto?.();}
 root.addEventListener('click',e=>{const b=e.target.closest('[data-v-action]');const panel=readOpen?readPanel:!bag.hidden?bag:!end.hidden?end:null;if(b&&!b.disabled&&(!panel||panel.contains(b)))action(b.dataset.vAction);});
 root.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-v-hold]');if(!b||b.disabled)return;e.preventDefault();b.setPointerCapture(e.pointerId);touchHeld.set(e.pointerId,b.dataset.vHold);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(type,e=>touchHeld.delete(e.pointerId));
 marker.onclick=primary;
 function readControls(){const set=new Set([...held,...touchHeld.values()]);let right=(set.has('KeyD')||set.has('ArrowRight')||set.has('right')?1:0)-(set.has('KeyA')||set.has('ArrowLeft')||set.has('left')?1:0),forward=(set.has('KeyW')||set.has('ArrowUp')||set.has('forward')?1:0)-(set.has('KeyS')||set.has('ArrowDown')||set.has('back')?1:0);const s=state();if(walkTarget&&['tide','island'].includes(s.stage)&&!right&&!forward){const dx=walkTarget.x-s.player.x,dz=walkTarget.z-s.player.z,d=Math.hypot(dx,dz);if(d<.25)walkTarget=null;else return {right:dx/d,forward:-dz/d,run:false};}if(['tide','island'].includes(s.stage)){const dir=travel.movement(right,forward,cameraYaw);right=dir.x;forward=-dir.z;}
  return {right,forward,run:set.has('ShiftLeft')||set.has('ShiftRight'),steer:steer||right,trim:(set.has('KeyQ')?-1:0)+(set.has('KeyE')?1:0),hoist:(hoisting||set.has('hoist')||s.stage==='rigging'&&set.has('Space'))?1:0,brake:set.has('Space')&&s.stage==='sailing'||set.has('back')};}
 function makeActions(stage){actionPanel.replaceChildren();if(stage==='writing')return;
  if(stage==='tide'||stage==='island')actionPanel.append(button('voyage-primary',stage==='tide'?'读一读旧信 E':'登上岸边的船 E','primary'));
  if(stage==='rigging'){actionPanel.append(button('voyage-rope-left','解开左缆 1','untie-left'),button('voyage-rope-right','解开右缆 2','untie-right'));const h=button('voyage-hoist','按住，拉索升帆 Space');h.dataset.vHold='hoist';actionPanel.append(h,button('voyage-launch','让船接住风 →','primary'));}
  if(stage==='sailing'){const label=node('label','voyage-trim','帆角');const range=node('input');range.type='range';range.id='voyage-trim';range.min='-1';range.max='1';range.step='.01';range.value=state().trim||0;range.setAttribute('aria-label','调整船帆角度');range.oninput=()=>{command('trim',{value:Number(range.value)});};label.append(range);actionPanel.append(label,button('voyage-scatter','把花种留给海 F','scatter'));
   const hold=button('voyage-brake','收帆缓行');hold.dataset.vHold='back';actionPanel.append(hold);}
  if(stage==='dawn')actionPanel.append(button('voyage-depart','带着两封信，驶向曙光 →','primary'));
  if(stage==='complete')actionPanel.append(button('voyage-show-ending','回看启程的春信','primary'));
 }
 function sync(force=false){if(!active)return;const s=state(),info=voyageStageInfo(s),changed=s.stage!==lastStage;
  if(changed){lastStage=s.stage;hint='';orbitYaw=orbitPitch=0;manualCamera=0;travel.reset();makeActions(s.stage);document.body.dataset.voyage=s.stage;editor.hidden=s.stage!=='writing';$('voyage-recipient').value=s.letter.recipient;$('voyage-body').value=s.letter.body;if(s.stage==='writing'){$('voyage-paper-intro').textContent=['conservatory','observatory','meadow'].every(id=>getState().atlas?.completed?.includes(id))?'纸上还沾着雨林的花香。你曾循星辨路，也让风托住自己。现在，想把这一路的哪一刻，告诉远方的人？':'读过别人的牵挂之后，你想把什么，告诉远方的人？';$('voyage-recipient').focus({preventScroll:true});}else if(s.stage!=='complete')root.focus({preventScroll:true});if(s.stage==='complete'){endingOpen=true;departureAge=0;}}
  const chapter=s.stage==='writing'?5:s.stage==='tide'?6:['island','rigging'].includes(s.stage)?7:8;
  $('voyage-chapter').textContent=s.stage==='complete'?'CODA · 寄向远方':roman[chapter+3]+' / Ⅻ · '+(chapter<8?'潮汐与远航':'海上的春天');$('voyage-title').textContent=VOYAGE_CHAPTERS[chapter][0];$('voyage-subtitle').textContent=VOYAGE_CHAPTERS[chapter][1];
  $('voyage-bag').textContent='信袋 · '+(s.predecessor?2:1)+' 封';
  $('voyage-status').textContent=hint||info.hint||info.title||'';
  const hints={writing:'写收信人与正文，再把花印落在信封上。',tide:'WASD / 方向键走动 · Shift 轻跑 · 看潮水，退时走、涨时在高石等候 · E 读信',island:'沿岛岸寻找小舟 · WASD 走近 · E 登船 · 拖动环看',rigging:'拖开两侧缆结，向下拉桅杆的绳索 · 键盘 1 / 2 解缆，按住 Space 升帆',sailing:'A / D 掌舵 · Q / E 调帆 · F 撒花种 · Space 缓行 · 拖动掌舵，右键环看',dawn:'灯光已经在前方。停一停，再亲手把这程春天交给风。',complete:'船会继续往前。你可以带走这封信，也可以在海上多停留一会儿。'};
  $('voyage-help').textContent=hints[s.stage]||'';
  $('voyage-progress').style.width=((s.stage==='sailing'||s.stage==='dawn'||s.stage==='complete')?Math.min(100,(s.distance||0)/150*100):s.stage==='rigging'?((s.ropes.filter(Boolean).length+s.sail)/3)*100:s.stage==='tide'?Math.min(100,Math.max(0,-s.player.z/24*100)):s.letter.sealed?100:0)+'%';
  readPanel.hidden=!readOpen;end.hidden=!(s.stage==='complete'&&endingOpen);touch.hidden=!['tide','island','sailing'].includes(s.stage)||readOpen||!bag.hidden||!end.hidden;
  const blocked=readOpen||!bag.hidden||!end.hidden;for(const background of [heading,tools,editor,actionPanel,touch,marker])background.inert=blocked;
  if(changed&&s.stage==='complete')end.focus({preventScroll:true});
  if(s.stage==='writing'){$('voyage-count').textContent=Array.from(s.letter.body).length+' / 600';$('voyage-recipient').readOnly=$('voyage-body').readOnly=s.letter.sealed;$('voyage-seal').disabled=s.letter.sealed;$('voyage-stamp').hidden=!s.letter.sealed;$('voyage-envelope').classList.toggle('sealed',s.letter.sealed);$('voyage-leave-desk').hidden=!s.letter.sealed;$('voyage-reopen').hidden=!s.letter.sealed;$('voyage-draft-status').textContent=hint||(s.letter.sealed?'已封缄 · 信在你手中':'信会随旅途保存在本机。');}
  if(s.stage==='tide'&&$('voyage-primary')){$('voyage-primary').hidden=s.predecessor||Math.hypot(s.player.x,s.player.z+13)>2.15;}
  if(s.stage==='island'&&$('voyage-primary'))$('voyage-primary').disabled=Math.hypot(s.player.x-BOAT_DOCK.x,s.player.z-BOAT_DOCK.z)>1.9;
  if(s.stage==='rigging'){$('voyage-rope-left').disabled=s.ropes[0];$('voyage-rope-right').disabled=s.ropes[1];$('voyage-hoist').disabled=s.sail>=.999;$('voyage-hoist').textContent=s.sail>=.999?'花帆已经升起':'按住，拉索升帆 '+Math.round(s.sail*100)+'%';$('voyage-launch').disabled=!s.ropes.every(Boolean)||s.sail<.999;}
  if(s.stage==='complete'){$('voyage-end-recipient').textContent='收信人 · '+s.letter.recipient;$('voyage-end-body').textContent=s.letter.body;}
 }
 function setActive(value){active=value;root.hidden=!value;world.group.visible=value;document.body.classList.toggle('voyage-active',value);if(!value){delete document.body.dataset.voyage;marker.hidden=true;}lastStage='';}
 function start(){if(state().stage==='idle')command('begin');setActive(true);readOpen=false;bag.hidden=true;endingOpen=true;clear();onStart?.();sync(true);persist();}
 function stop(){clear();readOpen=false;bag.hidden=true;setActive(false);}
 function nearObject(e){if(!cameraRef)return null;const s=state();let nearest=null,dist=Infinity;for(const target of world.interactables||[]){if(s.stage==='rigging'&&(!['rope-left','rope-right','halyard'].includes(target.id)||target.id==='rope-left'&&s.ropes[0]||target.id==='rope-right'&&s.ropes[1]||target.id==='halyard'&&s.sail>=.999))continue;point.fromArray(target.position).project(cameraRef);if(point.z>1)continue;const d=Math.hypot(e.clientX-(point.x*.5+.5)*innerWidth,e.clientY-(-point.y*.5+.5)*innerHeight);if(d<Math.max(28,innerHeight*(target.radius||.18)/15)&&d<dist){nearest=target;dist=d;}}return nearest;}
 function pointer(type,ray,e){if(!active||readOpen||!bag.hidden||state().stage==='writing'||!end.hidden)return;if(type==='cancel'){clear();return;}
  if(type==='down'){const target=nearObject(e);drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false,object:target?.id,orbit:e.button!==0||!['sailing','rigging'].includes(state().stage)};return;}
  if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.moved||=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8;
  if(type==='move'){if(drag.orbit){if(drag.moved){orbitYaw-=dx*.006;orbitPitch=clamp(orbitPitch+dy*.005,-.45,.75);manualCamera=2.5;travel.orbit();}}else if(state().stage==='sailing')steer=clamp((e.clientX-drag.x)/120,-1,1);else if(state().stage==='rigging'&&drag.object==='halyard'&&dy>0){if(command('hoist',{amount:dy/260}))onSound?.('sail-hoist');}drag.lastX=e.clientX;drag.lastY=e.clientY;}
  if(type==='up'){if(state().stage==='rigging'&&e.button===0&&!drag.orbit&&drag.moved&&['rope-left','rope-right'].includes(drag.object)){if(command('untie',{side:drag.object==='rope-left'?0:1}))onSound?.('rope-release');}else if(!drag.moved&&['tide','island'].includes(state().stage)&&e.button===0){if(ray.ray.intersectPlane(pointerPlane,point))walkTarget={x:point.x,z:point.z};}else if(!drag.moved&&state().stage==='sailing'&&e.button===0)scatter();drag=null;steer=0;}
 }
 function handleKey(e){
  if(!active)return false;
  if(e.type==='keyup')return held.delete(e.code);
  if(e.code==='Escape'){clear();if(!bag.hidden)bag.hidden=true;else if(readOpen)readOpen=false;else onSettings?.();sync(true);return true;}
  const panel=readOpen?readPanel:!bag.hidden?bag:!end.hidden?end:null;
  if(panel){
   if(e.code==='Tab'){
    const controls=[...(panel.querySelectorAll?.('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]')||[])].filter(b=>!b.hidden);
    if(!controls.length)return false;const index=controls.indexOf(document.activeElement);
    controls[index<0?(e.shiftKey?controls.length-1:0):(index+(e.shiftKey?-1:1)+controls.length)%controls.length].focus();return true;
   }
   return !['Enter','Space'].includes(e.code)&&['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyE','KeyF','KeyQ','Digit1','Digit2','KeyB','KeyC'].includes(e.code);
  }
  if(e.target?.matches?.('input,textarea,select,[contenteditable="true"]'))return false;
  if(['Space','Enter'].includes(e.code)&&e.target?.closest?.('button, a, summary')&&!e.target.closest('[data-v-hold]'))return false;
  const motion=['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','KeyQ','KeyE'].includes(e.code);
  if(motion)held.add(e.code);
  if(e.repeat)return motion;
  if(e.code==='KeyC')action('recenter');else if(e.code==='KeyB')showBag();else if(e.code==='KeyE'&&state().stage!=='sailing')primary();else if(e.code==='KeyF'&&state().stage==='sailing')scatter();else if(e.code==='Digit1'&&state().stage==='rigging')action('untie-left');else if(e.code==='Digit2'&&state().stage==='rigging')action('untie-right');else if(e.code==='Enter'&&state().stage==='dawn')primary();else return motion;
  return true;
 }
 function view(){const s=state(),tide=voyageTideLevel(s);return {stage:s.stage,player:s.player,boat:s.boat,tide,sail:s.sail,ropes:s.ropes,trim:s.trim,progress:clamp((s.distance||0)/150,0,1),blooms:s.flowers,quality:getState().settings.quality,reducedMotion:getState().settings.reducedMotion,sealed:s.letter.sealed,predecessor:s.predecessor,letterSeal:s.letter.sealKind,departureAge,purposes:getState().cores};}
 function camera(aspect){const v=view(),framed=world.camera(v,aspect);const p=new THREE.Vector3(...framed.position),target=new THREE.Vector3(...framed.target),offset=p.clone().sub(target);
  if(['tide','island','rigging','sailing'].includes(state().stage)){const base=Math.atan2(offset.x,offset.z),radius=offset.length(),angle=base+orbitYaw;const elevation=clamp(Math.asin(offset.y/radius)+orbitPitch,.12,1.25);p.set(target.x+Math.sin(angle)*Math.cos(elevation)*radius,target.y+Math.sin(elevation)*radius,target.z+Math.cos(angle)*Math.cos(elevation)*radius);cameraYaw=angle;}
  return {position:p.toArray(),target:target.toArray()};}
 return {group:world.group,get active(){return active;},start,stop,reset:stop,cancel:clear,handleKey,pointer,camera,primary,
  update(time,dt,{camera:cam,interactive=true}={}){cameraRef=cam;if(!active)return;const old=state(),canMove=interactive&&!readOpen&&bag.hidden&&(end.hidden||old.stage==='complete');if(canMove){const input=readControls(),result=stepVoyage(old,dt,input);getState().voyage=result.state;events(result.events);const s=state();travel.observe(s.player.x-old.player.x,s.player.z-old.player.z,dt);if(s.stage!==old.stage){persist();clear();}if(s.stage==='sailing'&&scoreTime>=0){scoreTime+=dt;const notes=scorePreviewEvents(getState().letters.entries.tide);while(scoreIndex<notes.length&&notes[scoreIndex].at<=scoreTime){onSound?.('compose-note',{...notes[scoreIndex],gain:.10});scoreIndex++;}if(scoreTime>9)scoreTime=-1;}}
   const s=state();if(s.stage==='complete')departureAge+=Math.max(0,Math.min(.05,Number.isFinite(dt)?dt:0));lastView=view();world.update(time,dt,lastView);manualCamera=Math.max(0,manualCamera-dt);if(manualCamera===0&&!drag&&getState().settings.autoCamera!==false){orbitYaw*=Math.exp(-dt*.65);orbitPitch*=Math.exp(-dt*.65);}saveElapsed+=dt;if(saveElapsed>4)persist();if(time-lastUi>.1||s.stage!==lastStage){sync();lastUi=time;}
   marker.hidden=true;const goal=s.stage==='tide'&&!s.predecessor?{x:0,y:2.4,z:-13,text:'岑留下的旧邮亭'}:s.stage==='tide'?{x:0,y:1.8,z:-24,text:'退潮之后，登上小岛'}:s.stage==='island'?{x:BOAT_DOCK.x,y:2.5,z:BOAT_DOCK.z,text:'岸边的一叶舟'}:null;
   if(goal&&!readOpen&&bag.hidden&&cam){point.set(goal.x,goal.y,goal.z).project(cam);if(point.z<1&&Math.abs(point.x)<.9&&Math.abs(point.y)<.75){marker.hidden=false;marker.textContent=goal.text;marker.style.left=(point.x*.5+.5)*innerWidth+'px';marker.style.top=(-point.y*.5+.5)*innerHeight+'px';}}
  },
  snapshot(){return {active,stage:state().stage,state:structuredClone(state()),info:voyageStageInfo(state()),reading:readOpen,bagOpen:!bag.hidden,endingOpen,held:[...held],touchHeld:[...touchHeld.values()],drag:drag?{...drag}:null,view:lastView,cameraYaw,interactables:world.interactables.map(x=>({...x,position:[...x.position]})),world:world.snapshot()};},
  musicState(){const s=state();return {voyage:active?s.stage:null,voyageSpeed:active?s.boat.speed:0,voyageProgress:active?clamp((s.distance||0)/150,0,1):0};},
  dispose(){stop();world.dispose();root.remove();}
 };
}
