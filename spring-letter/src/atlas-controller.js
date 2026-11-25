import * as THREE from 'three';
import {createAtlasWorld} from './atlas-world.js';
import {atlasCommand,stepAtlas,atlasStatus,atlasComplete} from './atlas-model.js';
import {ATLAS_LOCATIONS,atlasLocation,ATLAS_STARS,ATLAS_NOTES,STAR_ROUTE} from './atlas-content.js';
import {fitAtlasStarCamera} from './atlas-camera.js';
import {createTravelController} from './navigation.js';
import './atlas.css';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const makeButton=(id,text)=>{const b=el('button','',text);b.type='button';b.id=id;return b;};

/** Owns only the new places. No garden coordinates or previous letter progress. */
export function createAtlasController({getState,onStart,onExit,onSave,onSound,onContinue,onMap,onPhoto,onSettings,onRead}){
 const world=createAtlasWorld(),held=new Set(),touch=new Map(),travel=createTravelController();
 let studyView=null,studySize='',active=false,drag=null,walkTarget=null,cam=null,yaw=0,pitch=.42,radius=12,saveTime=0,uiTime=0,notice='',noticeAge=0,entryAge=0,moving=false,lastLocation=null;
 const projected=new THREE.Vector3(),groundPoint=new THREE.Vector3(),groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
 const root=el('section','atlas-ui');root.id='atlas-ui';root.hidden=true;root.setAttribute('aria-label','远方驿路');root.setAttribute('tabindex','-1');
 const head=el('header','atlas-heading');head.innerHTML='<small id="atlas-eyebrow"></small><h2 id="atlas-title"></h2><p id="atlas-subtitle"></p>';root.append(head);
 const toolbar=el('nav','atlas-toolbar');toolbar.setAttribute('aria-label','地图控制');
 for(const [id,text,action] of [['atlas-map','驿路地图 M',()=>onMap?.()],['atlas-photo','留一帧',()=>onPhoto?.()],['atlas-settings','暂停',()=>onSettings?.()],['atlas-return','回花庭',()=>stop()]]){const b=makeButton(id,text);b.onclick=action;toolbar.append(b);}root.append(toolbar);
 const guide=el('aside','atlas-guide');guide.innerHTML='<small id="atlas-place-number"></small><h3 id="atlas-objective"></h3><p id="atlas-hint"></p><div class="atlas-progress"><i id="atlas-progress-fill"></i></div><p id="atlas-status" role="status" aria-live="polite"></p>';root.append(guide);
 const actions=el('div','atlas-actions');
 const special=makeButton('atlas-special','按住 · 招蝶');special.dataset.hold='action';
 special.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();special.setPointerCapture(e.pointerId);touch.set(e.pointerId,'action');sync();};
 for(const k of ['pointerup','pointercancel','lostpointercapture'])special.addEventListener(k,e=>{touch.delete(e.pointerId);sync();});
 special.onkeydown=e=>{if(['Space','Enter'].includes(e.code)){e.preventDefault();held.add('Space');sync();}};special.onkeyup=e=>{if(['Space','Enter'].includes(e.code)){e.preventDefault();held.delete('Space');sync();}};special.onblur=()=>{held.delete('Space');sync();};
 const primaryButton=makeButton('atlas-primary','靠近 · E');primaryButton.onclick=()=>primary();
 const recenterButton=makeButton('atlas-recenter','镜头回正 C');recenterButton.onclick=recenter;
 actions.append(special,primaryButton,recenterButton);root.append(actions);
 const starBar=el('div','atlas-star-tools');starBar.id='atlas-star-tools';starBar.hidden=true;
 const starHint=el('p','','描过亮起的星点，留下你的航路。');starBar.append(starHint);
 const starKeys=el('div','atlas-star-keys');for(const star of ATLAS_STARS){const b=makeButton('atlas-star-'+star.id,String(star.id+1));b.setAttribute('aria-label','连接第 '+(star.id+1)+' 颗星');b.onclick=()=>command('star',{id:star.id});starKeys.append(b);}starBar.append(starKeys);
 const undo=makeButton('atlas-undo','撤回一笔');undo.onclick=()=>command('undo');const lookDown=makeButton('atlas-look-down','回到石阶');lookDown.onclick=()=>command('exit-study');starBar.append(undo,lookDown);root.append(starBar);
 const complete=el('aside','atlas-complete');complete.id='atlas-complete';complete.hidden=true;complete.innerHTML='<small>收进春信的行囊</small><h3 id="atlas-reward"></h3><p id="atlas-reward-copy"></p>';
 const next=makeButton('atlas-next','下一处风景 →');next.onclick=continueJourney;complete.append(next);root.append(complete);
 const pad=el('div','atlas-touch-pad');pad.setAttribute('aria-label','行走方向');for(const [key,label] of [['forward','↑'],['left','←'],['back','↓'],['right','→']]){const b=makeButton('atlas-move-'+key,label);b.setAttribute('aria-label',({forward:'向前走',left:'向左走',back:'向后走',right:'向右走'})[key]);b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);touch.set(e.pointerId,key);};for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,e=>touch.delete(e.pointerId));pad.append(b);}root.append(pad);
 const footer=el('div','atlas-footer','WASD 行走 · 拖动环看 · C 回正 · 滚轮远近 · M 地图');root.append(footer);
 const labels=el('div','atlas-star-labels');labels.setAttribute('aria-hidden','true');const starLabels=ATLAS_STARS.map(s=>{const n=el('span','atlas-star-label',String(s.id+1));labels.append(n);return n;});root.append(labels);
 document.body.append(root);
 const $=id=>root.querySelector('#'+id),state=()=>getState().atlas;
 function cancel(){held.clear();touch.clear();drag=null;walkTarget=null;travel.reset();}
 function recenter(){yaw=0;pitch=.42;radius=12;travel.recenter();}
 function persist(){saveTime=0;onSave?.();}
 function tell(text){notice=text||'';noticeAge=5;}
 function processEvents(events=[]){for(const event of events){
  if(event.type==='bloom'){onSound?.('collect');tell('蝶停下来了。一丛花，记住了你的耐心。');persist();}
  else if(event.type==='star'){onSound?.('compose-note',{instrument:'harp',midi:67+state().stars.length*2,duration:1.2,gain:.10});persist();}
  else if(event.type==='complete'){onSound?.('complete');cancel();persist();}
  else if(event.type==='checkpoint'){onSound?.('collect');tell('脚下的花岛记住了你。落空也会回到这里。');persist();}
  else if(event.type==='recover'){cancel();tell('风把你送回了最近的花岛。调整方向，再来一次。');persist();}
  else if(event.type==='jump')onSound?.('jump');
 }}
 function command(type,payload={}){const result=atlasCommand(state(),type,payload);if(result.ok===false){if(result.reason)tell(result.reason);return false;}getState().atlas=result.state;processEvents(result.events);if(['study','exit-study','read-note','undo'].includes(type))persist();sync();if(type==='exit-study')root.focus({preventScroll:true});return true;}
 function nearbyNote(){return (ATLAS_NOTES[state().location]||[]).find(n=>Math.hypot(n.x-state().player.x,n.z-state().player.z)<2.5);}
 function primary(){if(!active)return;const note=nearbyNote();if(note){if(command('read-note',{id:note.id}))onRead?.(note);return;}if(state().location==='observatory'){if(state().stargazing)command('exit-study');else if(command('study'))cancel();}else tell(atlasStatus(state()).hint);}
 function continueJourney(){if(!active||!state().completed.includes(state().location))return;const i=ATLAS_LOCATIONS.findIndex(l=>l.id===state().location);if(i<2)start(ATLAS_LOCATIONS[i+1].id,{resume:true});else if(atlasComplete(state())){stop({silent:true});onContinue?.();}else{tell('还有一处风景没有收好。地图会带你回去。');onMap?.();}}
 function start(id,{resume=true}={}){if(!ATLAS_LOCATIONS.some(l=>l.id===id))id=ATLAS_LOCATIONS.find(l=>!state().completed.includes(l.id))?.id||ATLAS_LOCATIONS[0].id;cancel();if(!command('enter',{id,resume}))return false;active=true;world.group.visible=true;world.setLocation(id);root.hidden=false;root.dataset.location=id;root.classList.remove('arriving');void root.offsetWidth;root.classList.add('arriving');document.body.classList.add('atlas-active');recenter();notice='';noticeAge=0;entryAge=0;lastLocation=id;onStart?.();world.update(0,0,{...state(),settings:getState().settings});persist();sync(true);root.focus({preventScroll:true});return true;}
 function stop({preserveLocation=false,silent=false}={}){if(!active)return;cancel();active=false;root.hidden=true;world.group.visible=false;document.body.classList.remove('atlas-active');if(!preserveLocation){getState().atlas=atlasCommand(state(),'leave').state;persist();}if(!silent)onExit?.();}
 function controls(){const set=new Set([...held,...touch.values()]);let right=(set.has('KeyD')||set.has('ArrowRight')||set.has('right')?1:0)-(set.has('KeyA')||set.has('ArrowLeft')||set.has('left')?1:0),forward=(set.has('KeyW')||set.has('ArrowUp')||set.has('forward')?1:0)-(set.has('KeyS')||set.has('ArrowDown')||set.has('back')?1:0);
  const action=set.has('Space')||set.has('action');if(walkTarget&&!right&&!forward&&!state().stargazing){const dx=walkTarget.x-state().player.x,dz=walkTarget.z-state().player.z,d=Math.hypot(dx,dz);if(d<.25)walkTarget=null;else return {right:dx/d,forward:-dz/d,call:action,jump:action,run:false};}
  const dir=travel.movement(right,forward,yaw);return {right:dir.x,forward:-dir.z,run:set.has('ShiftLeft')||set.has('ShiftRight'),call:action,jump:action};}
 function sync(force=false){if(!active)return;const s=state(),l=atlasLocation(s.location),status=atlasStatus(s),done=s.completed.includes(s.location),note=nearbyNote();
  $('atlas-eyebrow').textContent=l.eyebrow;$('atlas-title').textContent=l.title;$('atlas-subtitle').textContent=l.subtitle;
  $('atlas-place-number').textContent='远方驿路 · '+(ATLAS_LOCATIONS.indexOf(l)+1)+' / 3';$('atlas-objective').textContent=status.objective||l.objective;$('atlas-hint').textContent=status.hint||l.description;
  $('atlas-progress-fill').style.width=clamp(status.progress||0,0,1)*100+'%';$('atlas-status').textContent=noticeAge>0?notice:note?'靠近了「'+note.title+'」· E 读一读':'';
  special.hidden=s.location==='observatory';special.textContent=s.location==='meadow'?'按住 · 起跳 / 花伞':'按住 · 招蝶';special.setAttribute('aria-pressed',String(held.has('Space')||[...touch.values()].includes('action')));
  primaryButton.hidden=!note&&s.location!=='observatory';primaryButton.textContent=note?'读一读 · E':s.stargazing?'回到石阶 · E':'仰望星空 · E';
  starHint.textContent=done?'星路已经收好。带上它，继续云上的旅程。':'描过亮起的星点，留下你的航路。';lookDown.textContent=done?'收好星路，回到石阶':'回到石阶';starBar.hidden=!s.stargazing;root.classList.toggle('stargazing',s.stargazing);root.classList.toggle('entered',entryAge>7);
  starKeys.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('expected',status.nextStar===i);b.setAttribute('aria-current',status.nextStar===i?'step':'false');});undo.disabled=!s.stars.length||done;
  complete.hidden=!done||s.stargazing;$('atlas-reward').textContent=l.reward+'，已经收好';$('atlas-reward-copy').textContent={conservatory:'有些回应，需要先停下来等待。',observatory:'远方不再只是远方，它有了方向。',meadow:'这一次，轮到你写下想说的话。'}[s.location];next.textContent=s.location==='meadow'?'带着三处风景，走向海岸 →':'去往'+ATLAS_LOCATIONS[ATLAS_LOCATIONS.indexOf(l)+1].title+' →';
 }
 function starAt(e){if(!cam)return null;let best=null,dist=42;for(const s of ATLAS_STARS){projected.set(s.x,s.y,s.z).project(cam);if(projected.z>1||projected.z< -1)continue;const d=Math.hypot((projected.x*.5+.5)*innerWidth-e.clientX,(-projected.y*.5+.5)*innerHeight-e.clientY);if(d<dist){best=s.id;dist=d;}}return best;}
 const api={group:world.group,get active(){return active;},start,stop,cancel,primary,recover(){command('recover');cancel();persist();},
  handleKey(e){if(!active)return false;const down=e.type!=='keyup';if(!down){const wasHeld=held.delete(e.code);return wasHeld;}if(e.target?.isContentEditable||e.target?.closest?.('input,textarea,select'))return false;if(['Space','Enter'].includes(e.code)&&e.target?.closest?.('button,a,summary'))return false;
   if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code)){if(down)held.add(e.code);else held.delete(e.code);walkTarget=null;return true;}
   if(!down)return false;if(e.repeat)return ['KeyE','KeyC','KeyM','KeyR','Escape','Backspace'].includes(e.code);
   if(e.code==='KeyE'){primary();return true;}if(e.code==='KeyC'){recenter();return true;}if(e.code==='KeyM'){onMap?.();return true;}if(e.code==='Escape'){if(state().stargazing)command('exit-study');else onSettings?.();return true;}
   if(['Backspace','KeyZ'].includes(e.code)&&state().stargazing){command('undo');return true;}if(/^Digit[1-6]$/.test(e.code)&&state().stargazing){command('star',{id:Number(e.code.slice(-1))-1});return true;}return false;
  },
  pointer(phase,raycaster,e){if(!active)return;if(phase==='down'){drag={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,orbit:e.button!==0||!state().stargazing,lastStar:null,button:e.button};walkTarget=null;if(!drag.orbit){const id=starAt(e);if(id!==null){command('star',{id});if(drag)drag.lastStar=id;}}return;}
   if(!drag||drag.id!==e.pointerId)return;if(phase==='move'){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved||=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5;
    if(drag.orbit&&drag.moved&&!state().stargazing){yaw-=dx*.004;pitch=clamp(pitch+dy*.003,.16,1.05);travel.orbit();}else if(!drag.orbit&&state().stargazing){const id=starAt(e);if(id!==null&&id!==drag.lastStar){command('star',{id});if(drag)drag.lastStar=id;}}
    if(drag){drag.x=e.clientX;drag.y=e.clientY;}return;}
   if(phase==='up'){if(!drag.moved&&drag.button===0&&!state().stargazing&&state().location!=='meadow'){groundPlane.constant=-state().player.y;if(raycaster.ray.intersectPlane(groundPlane,groundPoint))walkTarget={x:groundPoint.x,z:groundPoint.z};}drag=null;}
  },
  zoom(delta){radius=clamp(radius*Math.exp(delta*.0005),7,22);},
  camera(aspect=1.5){const s=state(),p=s.player;if(s.stargazing){const size=innerWidth+'x'+innerHeight;if(size!==studySize){studyView=fitAtlasStarCamera(innerWidth,innerHeight);studySize=size;}return studyView;}const r=radius*(aspect<.8?1.25:1),flat=r*Math.cos(pitch);return {position:[p.x+Math.sin(yaw)*flat,p.y+1.2+r*Math.sin(pitch),p.z+Math.cos(yaw)*flat],target:[p.x,p.y+1.3,p.z-1.1],fov:48,far:360};},
  update(time,dt,{camera,interactive=true}={}){if(!active)return;cam=camera;const before=state();if(interactive){const input=controls(),result=stepAtlas(before,dt,input);getState().atlas=result.state;moving=Math.hypot(state().player.x-before.player.x,state().player.z-before.player.z)>.0001;travel.observe(state().player.x-before.player.x,state().player.z-before.player.z,dt);processEvents(result.events);}
   entryAge+=dt;noticeAge=Math.max(0,noticeAge-dt);saveTime+=dt;uiTime+=dt;
   // Camera follows a stable travel basis; manual orbit is retained until moving again.
   if(!state().stargazing&&!drag)yaw=travel.turn(dt,{azimuth:yaw,enabled:getState().settings.autoCamera!==false,reducedMotion:getState().settings.reducedMotion});
   world.update(time,dt,{...state(),settings:getState().settings});if(saveTime>4)persist();if(uiTime>.12){sync();uiTime=0;}
   labels.hidden=!state().stargazing; if(state().stargazing&&cam)ATLAS_STARS.forEach((s,i)=>{projected.set(s.x,s.y,s.z).project(cam);const n=starLabels[i];n.hidden=projected.z>1;n.style.left=(projected.x*.5+.5)*innerWidth+'px';n.style.top=(-projected.y*.5+.5)*innerHeight+'px';n.classList.toggle('expected',STAR_ROUTE[state().stars.length]===i);});
  },
  musicState(){return {atlas:active?state().location:null,atlasProgress:active?atlasStatus(state()).progress:0,...(active?{moving:moving&&state().player.grounded,speed:moving?3:0,groundMaterial:state().location==='observatory'?'stone':'grass',nearWater:state().location==='conservatory'?.7:0}: {})};},
  theme(){return atlasLocation(state().location);},
  snapshot(){return {active,state:structuredClone(state()),status:atlasStatus(state()),camera:{yaw,pitch,radius},held:[...held],touch:[...touch.values()],world:world.snapshot()};},
  dispose(){stop({silent:true,preserveLocation:true});world.dispose();root.remove();}
 };return api;
}
