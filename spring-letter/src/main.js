import {createAtlasController} from './atlas-controller.js';
import {ATLAS_LOCATIONS} from './atlas-content.js';
import {atlasComplete} from './atlas-model.js';
import {renderAtlasMap,JOURNEY_CHAPTERS,ROMAN_CHAPTERS} from './atlas-map.js';
import {createVoyageController} from './voyage-controller.js';
import {VOYAGE_CHAPTERS} from './voyage-content.js';
import {drawPostcard} from './postcard.js';
import {renderMomentKeepsake} from './moment-keepsake.js';
import {scorePreviewEvents,startScorePreview} from './score-preview.js';
import './style.css';
import {assetUrl} from './asset-url.js';
import {createStorageBackend} from './storage-backend.js';
import {createSaveService,LEGACY_KEYS,ARCHIVE_KEY} from './save-service.js';
import {createSavePanel} from './save-panel.js';
import {createPlaytestFeedback} from './playtest-feedback.js';
import {createLetterController} from './moments-controller.js';
import {momentLetter,momentText,safeArtwork} from './moments-state.js';
import {LETTERS,letterById,letterUnlocked,completedLetters} from './letter-model.js';
import './product-v8.css';
import {createDash} from './dash.js';
import {createResonance} from './resonance.js';
import {mountResonanceUI} from './resonance-ui.js';
import './experience-v6.css';
import './loading-scene.css';
import './flower-studio.css';
import {mountLoadingScene} from './loading-scene.js';
import {bindRenderLifecycle,computeRenderSize} from './render-lifecycle.js';
import {readPreferences,writePreferences} from './preferences.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createViewRig,createTravelController} from './navigation.js';
import {frameBounds,surfaceBounds} from './view-framing.js';
import {createFlowerCycle} from './flower-cycle.js';
import {FLOWER_FORMS,FLOWER_SERIES} from './flower-presets.js';
import {updateFlowerLesson,flowerLessonHint} from './flower-lesson.js';
import {createJourneyGuide} from './journey-guide.js';
import {createLandscape} from './landscape.js';
import {createExploration} from './exploration.js';
import {restartExploration,ECHO_SITES,cancelExplorationGuidance} from './exploration-model.js';
import {cancelSeedGuidance} from './wind-flow.js';
import {createGestureField} from './gesture-field.js';
import {createStrokeMotion} from './stroke-motion.js';
import {createGardenAtmosphere as createAtmosphere,loadGardenSurfaces} from './atmosphere-garden.js';
import {createCourier} from './courier.js';
import {createDelivery,deliveryIntent,LETTER_BEDS} from './delivery.js';
import {createBridgeWeaver} from './bridge-weaver.js';
import {GardenDepthPass} from './depth-pass.js';
import {createCameraOcclusion} from './camera-occlusion.js';
import {createHeroWeather} from './hero-weather.js';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {createBouquet} from './botany.js';
import {createSurfaceParticles} from './particles.js';
import {createWorld} from './world.js';
import {createWaterReflection} from './water-reflection.js';
import {createAudio} from './audio.js';
import {bindFullscreen} from './fullscreen.js';
import {createStoryDirector} from './story-director.js';
import {BRANCHES,ROLE_TEXT,personalReply,CHAPTER_LINES} from './story-content.js';
import {createCinematicLayer} from './cinematic.js';
import {createState,stepWind,setStructure,allocateCore,commitLetter,serialize,restore,SAVE_KEY} from './game-model.js';
import {supportAt,nearestSafe,PLATFORMS} from './layout.js';

const $=id=>document.getElementById(id),all=s=>[...document.querySelectorAll(s)];
const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const storageBackend=createStorageBackend(()=>localStorage),saveService=createSaveService(storageBackend.storage);
saveService.read();
let loadingScene,letterController,voyage,atlas,savePanel,playtestFeedback,lastSaveResult=null,keepsakePlayback=null;
let shaderPreparing=false;const warmedSeries=new Set();
let renderLifecycle,renderFailure=null,renderSize=null;
let gardenSurfaces,resonance,resonanceUI,touchDash=false,resonanceSlow=0;const dash=createDash();
const RESONANCE_KEY='spring-letter:resonance:v1';
function readResonance(){try{return JSON.parse(storageGet(RESONANCE_KEY)||'null');}catch{return null;}}
function resonanceSignals(signals=[]){for(const e of signals){audio.event?.(e.type,e);if(e.type==='collect'){dash.refill(e.refill||0);}if(e.type==='start'){dash.refill(1);flowerBurst=true;caption(e.text||'银色花灵可慢行接住，金色花灵需踏风。\n凑够以后，回花巢按 E；也可以再多接几枚。',8);}if(e.type==='bump'){resonanceSlow=e.slowFor||.55;caption('风结扰乱了连锁。换个方向，接住下一枚。',3);}if(e.type==='complete'){if(e.id==='dawn'&&!state.p1.solved){state.p1.solved=true;state.p1.hold=.8;discoverSilently('leaf');save();}if(e.id==='crosswind'&&!state.wind.solved){state.wind.solved=true;state.wind.hold=1;save();}dash.refill(1);caption(({dawn:'花灵把春光送进了沉睡的根。\n水下的旧路醒了，沿石弧去风廊吧。',crosswind:'散落的回声终于有了归处。\n游絮愿意与你同行。前方的断桥，等你写下一阵风。',homeward:'这一庭的新花，记得你带它们归来的路。\n现在，为两枚种核选一个愿意照料的未来。'})[e.id]+'  '+e.score+' 分',8);}if(e.type==='ready'||e.type==='hint')caption(e.text,5);if(e.type==='cancel'&&e.text)caption(e.text,4);if(e.type==='timeout')caption('风暂时歇了。回到花巢，再试一条不同的路。',6);if(e.type==='complete'||e.type==='timeout'){save();}}}
function attemptResonance(){if(mode!=='play'||focus||modalPaused)return;const r=resonance.attempt(state.player,state);if(r.ok)resonanceSignals(r.signals);else if(r.reason)toast(r.reason);}
let renderer,scene,camera,composer,orbit,bouquet,particles,world,environment,waterReflection,landscape,exploration,gestureField,atmosphere,courier,outdoorEnvironment,delivery,weaver,depthPass,cameraOcclusion,heroWeather;
let state=createState(),mode='cover',focus=null,galleryKind='flower',galleryReturnToJourney=false,night=false,activeCore=0,material='silver',variant='blush';
state.settings=readPreferences({getItem:storageGet},{reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});
loadingScene=mountLoadingScene($('loading'),{reducedMotion:state.settings.reducedMotion});
let chaseLight,chasing=false,storyDirector,cinematic,fullscreen,dustView=0,nightBlend=0,momentBlend=0;
const momentSky=new THREE.Color('#283c40'),momentSkyColors={rain:'#283c40',wind:'#36535b',tide:'#192e49'};
let time=0,lastTime=0,hidden=false,modalPaused=false,orbiting=false,autoRotate=false,scatterTarget=0,scatter=0,displayBloom=.9,captionUntil=0,toastTimer=0,saveClock=0,quiet=0,selectedShape='bridge_am',targetVisible=false;
const viewRig=createViewRig(),travel=createTravelController(),flowerCycle=createFlowerCycle();
const finaleSubjects=LETTER_BEDS.map(b=>new THREE.Vector3(b.x,1.1,b.z));
let chapterNoticeUntil=0,lastChapter=-1;
let flowerForm='lily',flowerBurst=false,deliveryTrigger=false,journeyGuide,flowerState=flowerCycle.state,autoFlowerEntered=false;
let flowerBounds={min:[-2,0,-2],max:[2,5,2]};
let penMode=false,playerHeight=.12,gestureLastActive=false,spaceHeld=false,pressOrigin={x:0,y:0};
const gesture={active:false,position:new THREE.Vector3(),velocity:new THREE.Vector3(),strength:0,mode:'auto',released:false};
const strokeMotion=createStrokeMotion();
const previousGesture=new THREE.Vector3(),gestureHit=new THREE.Vector3(),touchPoints=new Map();let pinchDistance=0,pinchCenter={x:0,y:0},hadPinch=false,canvasPointerId=null;
const ripplePlane=new THREE.Plane(new THREE.Vector3(0,1,0),.18);
let lastRipple=0;
let pointerDown=false,pointerMoved=false,pointerActive=false,startPointer={x:0,y:0},lastPointerMove=0;
const keys=new Set(),audio=createAudio(),pointerNDC=new THREE.Vector2(9,9),raycaster=new THREE.Raycaster(),waterPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.5),hit=new THREE.Vector3(),particlePointer=new THREE.Vector3(),cameraGoal=new THREE.Vector3(),lookGoal=new THREE.Vector3(),followLook=new THREE.Vector3(-1.1,1.9,0),lastPlayer=new THREE.Vector3();
let endingRevealAt=0;
let frameNumber=0,fullscreenWasActive=false,fullscreenExitedAt=-Infinity;
const frameTiming={longestMs:0,over50:0,over100:0,over1000:0};
const loadingTiming={totalMs:0,warmupMs:0,overlayHiddenMs:null};
const frameTimes=[],errors=[],flags={environment:false,contextLost:false},purposes={memory:'旧日的灯',season:'眼前的四季',voyage:'远方的春天'};
const journal={table:['两只杯子','桌上有两只杯子，第三个位置留着空。这里未必曾坐着第三个人，也可能一直在等一位未来的来客。水的回应，不必永远重复旧日的节拍。'],leaf:['归来的花','花尘散开以后，仍记得每一片花瓣的位置。你写下的风停了，光却没有离开。它回到花里，也落进了水下的路。'],echo:['第四声','旧日的杯纹敲出三拍。游絮却回了第四拍——它会记得你，也会拥有自己的节奏。'],protocol:['保形协议','风暴来临时，方舟选择保存。年复一年，花没有凋谢，也没有再生长。保护曾经拯救过这里；现在，等待也有了重量。']};

function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3600);}
function caption(text,duration=7){$('caption').textContent=text;$('caption').style.opacity='1';captionUntil=time+duration;}
function storageGet(key){const field=Object.entries(LEGACY_KEYS).find(([,v])=>v===key)?.[0];if(field)return saveService.read().data?.[field]||null;try{return storageBackend.storage.getItem(key);}catch{return null;}}
function currentPayload(){if(mode==='cover'||mode==='gallery')return {...saveService.read().data,preferences:JSON.stringify(state.settings)};return {journey:serialize(state),preferences:JSON.stringify(state.settings),resonance:resonance?.persist()||storageGet(RESONANCE_KEY)};}
function save(){
 const payload={preferences:JSON.stringify(state.settings)};let completed=null;
 if(mode==='play'||mode==='opening'){
  // A failed final write may leave a completed voyage in memory. Retry within
  // the ordinary single save transaction, without changing the live ending or
  // reopening a modal on every autosave. The archive's conflict guard still owns
  // whether this page is allowed to write.
  if(state.voyage?.stage==='complete'&&!state.ending){const candidate=structuredClone(state);if(commitLetter(candidate).ok)completed=candidate;}
  payload.journey=serialize(completed||state);if(resonance)payload.resonance=resonance.persist();
 }
 lastSaveResult=saveService.commit(payload);if(lastSaveResult.ok&&completed)state=completed;
 savePanel?.notifyFailure(lastSaveResult);syncStorageNotice();return lastSaveResult;
}
function renderBlocked(){return !!renderFailure||!!renderLifecycle?.blocked;}
function ensureRenderAvailable(){if(renderBlocked()||renderer?.getContext().isContextLost()){const error=new Error('图形上下文需要重新打开后重建。');error.code='RENDER_BLOCKED';throw error;}}
async function awaitRenderAsset(promise){
 const asset=await promise;
 if(renderBlocked()){for(const item of Array.isArray(asset)?asset:[asset])item?.dispose?.();ensureRenderAvailable();}
 return asset;
}
function renderDiagnostics(){return {lifecycle:renderLifecycle?.snapshot()||null,size:renderSize?{...renderSize}:null,failure:renderFailure?{...renderFailure}:null,blocked:renderBlocked()};}
function showRenderFailure(status){
 const restored=status?.phase==='restored';
 renderFailure={kind:status?.phase==='lost'||restored?'context':'initialization',message:status?.message||status?.statusMessage||'',restored};
 loadingScene?.dispose();$('loading').hidden=true;$('material-preparing').hidden=true;shaderPreparing=false;audio.pause(true);
 if($('modal').open)$('modal').close();modalPaused=false;
 for(const child of document.body.children)if(child!==$('failure')&&child.tagName!=='SCRIPT')child.inert=true;
 const failure=$('failure');failure.hidden=false;failure.inert=false;
 $('failure-title').textContent=restored?'图形设备已恢复，请重新打开花庭':'画面暂时中断了';
 const saved=status?.saveSucceeded===true?'当前旅途已保存。':status?.saveAttempted?'已尝试保存；建议先导出一份春信。':'原有存档仍保留；可以先导出备份。';
 $('failure-detail').textContent=renderFailure.kind==='context'?(restored?'浏览器已经恢复图形设备，但花瓣、倒影和粒子需要重新准备。':'图形设备在准备或绘制画面时中断。')+saved+' 页面已暂停，不会自动重开。':('画面未能完成准备。'+(renderFailure.message?'原因：'+renderFailure.message+'。':'')+saved);
 $('failure-note').textContent=storageBackend.temporary?'当前为临时旅途：重新打开会清空本页记录，请先导出。':'“重新打开花庭”会重新加载画面资源，不会清空本机存档。';
 $('failure-reload').focus({preventScroll:true});
}
function exportFailureArchive(){
 const feedback=$('failure-export-status');
 try{
  let result=saveService.exportArchive(currentPayload());
  if(!result.ok)result=saveService.exportRaw();
  if(!result.ok){feedback.textContent=result.error||'暂时无法导出，请保留本页。';return;}
  const url=URL.createObjectURL(new Blob([result.text],{type:'application/json;charset=utf-8'})),link=document.createElement('a');
  link.href=url;link.download=result.filename;$('failure').append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  feedback.textContent='春信已交给浏览器下载。确认文件保存后，再重新打开花庭。';
 }catch{feedback.textContent='浏览器暂时未能导出。请保留本页并检查下载权限。';}
}
function bindRenderFailureUI(){
 $('failure-reload').onclick=()=>location.reload();$('failure-export').onclick=exportFailureArchive;
 // The recovery surface is available even if asynchronous startup never ends.
 document.addEventListener('keydown',event=>{if(!renderBlocked())return;if(!event.target.closest?.('#failure')){event.preventDefault();event.stopImmediatePropagation();$('failure-reload').focus();return;}if(event.code==='Tab'){const buttons=[$('failure-reload'),$('failure-export')],index=buttons.indexOf(document.activeElement);event.preventDefault();buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}},true);
 for(const name of ['pointerdown','pointerup','pointermove','click'])document.addEventListener(name,event=>{if(renderBlocked()&&!event.target.closest?.('#failure')){event.preventDefault();event.stopImmediatePropagation();}},true);
 window.addEventListener('pagehide',event=>{if(!event.persisted)renderLifecycle?.dispose();});
 window.__SPRING_RENDER__=Object.freeze({snapshot:renderDiagnostics});
}
function syncStorageNotice(){
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
function stopSavedScore(){if(keepsakePlayback){const stop=keepsakePlayback;keepsakePlayback=null;stop();}}
function playSavedScore(entry,button){
 if(renderBlocked())return;
 if(keepsakePlayback){stopSavedScore();return;}if(state.settings.muted){toast('声音现在关闭了。先用右上角的声音开关，再听听这封信。');return;}
 const events=scorePreviewEvents(entry);if(!events.length)return;const label=button.textContent;audio.unlock();audio.pause(false);button.textContent='停一停 ■';button.setAttribute('aria-pressed','true');
 keepsakePlayback=startScorePreview(events,{play:e=>audio.event('compose-note',e),onBeat:beat=>button.parentElement?.querySelectorAll('[data-keepsake-beat]').forEach(g=>g.classList.toggle('sounding',Number(g.dataset.keepsakeBeat)===beat)),onEnd:()=>{button.textContent=label;button.setAttribute('aria-pressed','false');keepsakePlayback=null;audio.pause(true);if(!modalPaused&&!hidden&&!renderBlocked())audio.pause(false);}});
}
function showLetters(){
 const completed=completedLetters(state.letters),canTravel=!!state.letters.entries.wind.choice;
 openModal('<small>送春人的信册 · '+completed.length+' / 3 封回信</small><h2>有人把愿望留在这里</h2><p>这是岑尚未回复的旧来信。你可以替他们照料一处，也可以回来重新安排。每一种选择都留下自己的回应。</p><div class="letter-book">'+LETTERS.map(original=>{const e=state.letters.entries[original.id],l=momentLetter(original,e),unlocked=letterUnlocked(l,state);return '<article><small>'+l.sender+'</small><h3>'+(e.choice?'✉ ':'')+l.title+'</h3><p>'+l.note+'</p>'+renderMomentKeepsake(l.id,e)+(renderMomentKeepsake(l.id,e)?'<button data-save-artwork="'+l.id+'">收藏这一页 ↓</button>':'')+(l.id==='tide'&&e.edition===2&&scorePreviewEvents(e).length?'<button data-replay-score>听听这封信的春声 ▷</button>':'')+(e.choice?'<blockquote>'+l.replies[e.choice]+'</blockquote><p class="letter-benefit">'+l.reward+'</p>':'<p class="muted">'+(unlocked?'尚未回信 · '+l.rule:'前方的路醒来后，就能走到这里。')+'</p>')+'<div class="row"><button data-track-letter="'+l.id+'" '+(!unlocked||mode!=='play'?'disabled':'')+'>在花庭中寻找</button>'+(e.choice&&canTravel&&mode==='play'?'<button data-travel-letter="'+l.id+'">乘花尘前往</button>':'')+'</div></article>';}).join('')+'</div>'+(canTravel&&mode==='play'?'<button id="travel-home">乘花尘回初庭</button>':'')+'<p class="muted">花影、纸翼与春声，留下三种不同的回应。风廊还藏着一程可自由挑战的追风。</p>');
 all('[data-save-artwork]').forEach(b=>b.onclick=()=>{const id=b.dataset.saveArtwork,svg=renderMomentKeepsake(id,state.letters.entries[id]);if(!svg)return;const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='春信留影-'+({rain:'花光',wind:'纸翼',tide:'春声'})[id]+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);});
 all('[data-replay-score]').forEach(b=>b.onclick=()=>playSavedScore(state.letters.entries.tide,b));
 all('[data-track-letter]').forEach(b=>b.onclick=()=>{letterController.track(b.dataset.trackLetter);closeModal();exitFocus();caption('沿花庭图前往'+({rain:'左侧的听雨春庭',wind:'右侧的逆风春庭',tide:'旧台左侧的回声春庭'})[b.dataset.trackLetter]+'，靠近信台按 E。',6);});
 all('[data-travel-letter]').forEach(b=>b.onclick=()=>travelToLetter(b.dataset.travelLetter));if($('travel-home'))$('travel-home').onclick=()=>travelToLetter('home');
}
function travelToLetter(id){
 if(mode!=='play'||!state.letters.entries.wind.choice||resonance?.context.active){toast('先结束这一程追风，再乘花尘往返。');return;}
 if(delivery.carried!==null){toast('先把手中的种核安放好，再乘花尘出发。');return;}
 const l=letterById(id);if(id!=='home'&&(!l||!state.letters.entries[id].choice||!letterUnlocked(l,state)))return;
 closeModal();exitFocus();clearInput();state.player={x:l?l.x:0,z:l?l.z+2.5:5.5,safe:id==='wind'?'wind':id==='tide'?'pool':'garden'};state.bridge.support=null;if(id==='tide')state.bridge.platform='R';letterController.reset();travel.reset();viewRig.reset();dash.refill(1);document.body.classList.add('travelling');setTimeout(()=>document.body.classList.remove('travelling'),state.settings.reducedMotion?50:950);audio.chime();caption(l?momentText(l.id).title+'。你留下的回应，还在这里。':'回到了初庭。花仍记得最初的风。',5);save();
}
function letterRepliesHtml(letters=state.letters){return completedLetters(letters).map(original=>{const l=momentLetter(original,letters.entries[original.id]);return '<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>'+renderMomentKeepsake(l.id,letters.entries[l.id]);}).join('')||'<p class="muted">还有三封旧来信，等愿意绕远的人。</p>';}
function commitMoment(id,choice,draft){
 const text=momentText(id);if(!text?.goals.some(g=>g.id===choice))return {ok:false};
 const candidate=restore(serialize(state));candidate.player={...state.player};candidate.settings={...state.settings};candidate.moments.entries[id]={draft:safeArtwork(draft),completed:true};
 const entry=candidate.letters.entries[id];entry.choice=choice;entry.edition=2;entry.artwork=safeArtwork(draft);entry.read=true;
 if(id==='rain'){candidate.p1.solved=true;candidate.p1.hold=.8;if(!candidate.discoveries.includes('leaf'))candidate.discoveries.push('leaf');}
 if(id==='wind'){candidate.wind.solved=true;candidate.wind.hold=1;}
 const result=saveService.commit({...currentPayload(),journey:serialize(candidate)},{reason:'moment-reply'});lastSaveResult=result;
 if(!result.ok){savePanel.notifyFailure(result);savePanel.show();return result;}state=candidate;return result;
}
function onGardenReply(id,choice,result){
 if(id==='rain'&&!state.p1.solved){state.p1.solved=true;state.p1.hold=.8;discoverSilently('leaf');}
 if(id==='wind'&&!state.wind.solved){state.wind.solved=true;state.wind.hold=1;}
 dash.refill(1);audio.event?.('moment-reply',{id,choice});world.respond();caption(result.text,9);
}

function discover(id){if(state.discoveries.includes(id)){showJournal(id);return;}state.discoveries.push(id);audio.note(659,2,.25);caption(journal[id][1],9);save();}
function setNight(value){night=value;document.body.classList.toggle('night',night);$('night').textContent=night?'破晓':'入夜';}
function clearInput(){atlas?.cancel();voyage?.cancel();stopSavedScore();letterController?.cancel?.();touchDash=false;cancelSeedGuidance(state);state.exploration=cancelExplorationGuidance(state.exploration);gesture.released=false;deliveryTrigger=false;flowerBurst=false;weaver?.cancel();touchPoints.clear();pinchDistance=0;hadPinch=false;canvasPointerId=null;keys.clear();spaceHeld=false;pointerActive=false;pointerDown=false;orbiting=false;gesture.active=false;gesture.velocity.set(0,0,0);gestureLastActive=false;strokeMotion.reset();}
function setPenMode(value){penMode=value;for(const el of [$ ('wind-pen'),$('scatter')]){el?.setAttribute('aria-pressed',String(value));}document.body.classList.toggle('wind-pen',value);if(value)toast(matchMedia('(pointer:coarse)').matches?'按住并拖动写风；关闭风笔后单指环看，双指拖动环看，张合缩放。':'在场景里按住并拖动，风会沿着你的笔迹走；右键仍可环看。');}
function openModal(content){clearInput();$('modal-content').innerHTML=content;$('modal').showModal();modalPaused=true;audio.pause(true);}
function closeModal(){stopSavedScore();if($('modal').open)$('modal').close();modalPaused=false;audio.pause(hidden||renderBlocked());}
function visitAtlas(id){
 if(renderBlocked())return;if(mode==='cover'||mode==='gallery'){startGame(restore(storageGet(SAVE_KEY)).started);if(mode!=='play'&&mode!=='opening')return;}
 if(mode==='opening'){storyDirector.cancelOpening();mode='play';document.body.classList.remove('opening');}
 if(delivery.carried!==null){toast('先把手中的种核安放好，再去远方。');return;}
 closeModal();exitFocus();atlas.start(id);
}
function continueToCoast(){
 if(!state.bridge.solved||state.cores.some(c=>!c)){closeModal();exitFocus();caption('三处远方已经收好。回到花庭，完成旧来信与两枚种核，再去海岸写自己的信。',9);return;}
 closeModal();exitFocus();if(state.voyage.stage==='idle'&&!state.ending&&!atlasComplete(state.atlas))atlas.start();else voyage.start();
}
function showMap(){
 openModal(renderAtlasMap(state));all('[data-atlas-location]').forEach(b=>b.onclick=()=>visitAtlas(b.dataset.atlasLocation));
 $('map-flower-studio').onclick=()=>enterGallery();
 $('map-garden').onclick=()=>{closeModal();if(mode==='cover'||mode==='gallery')startGame(restore(storageGet(SAVE_KEY)).started);if(mode==='play')exitFocus();};
 if($('map-voyage'))$('map-voyage').onclick=continueToCoast;
}

function fieldAction(){
 const bridge=weaver?.context,bridgeBlocked=state.wind.solved&&state.bridge.support&&gesture.active;
 const c=delivery.context||((bridge?.available||bridgeBlocked)?{title:bridgeBlocked?'脚下的路仍在托住你':bridge.status==='ready'?'松手，让花尘成为路':'用一阵风，借一段花桥',detail:bridge.hint,progress:bridge.progress}:null);
 const visible=mode==='play'&&!focus&&!!c&&(!delivery.context||!['walk','carry'].includes(c.kind));
 $('field-action').hidden=!visible;
 const action=delivery.context?(['take','plant','lift','send'].includes(delivery.context.kind)?delivery.context.actionLabel:'查看指引'):null;
 $('focus-button').innerHTML='<kbd>E</kbd> '+(action|| (focus?'回到花庭':'靠近 · 细看'));
 if(!focus&&resonance?.context.atStart&&!['take','plant','lift','send'].includes(delivery.context?.kind))$('focus-button').innerHTML='<kbd>E</kbd> '+resonance.context.actionLabel;
 if(!focus&&letterController?.nearId)$('focus-button').innerHTML='<kbd>E</kbd> 走近看看 · 展开来信';
 if(!visible)return;
 $('field-title').textContent=c.title;$('field-hint').textContent=c.detail;
 $('field-progress').parentElement.hidden=!!delivery.context;
 $('field-progress').style.width=Math.round((c.progress||0)*100)+'%';
}
function requestInteraction(){
 if(modalPaused||mode!=='play')return;
 if(atlas?.active){atlas.primary();return;}
 if(voyage?.active){voyage.primary();return;}
 if(focus==='letter'){letterController.exit();return;}
 if(!focus&&resonance?.context.active){attemptResonance();return;}
 const intent=!focus?deliveryIntent(state,state.player,delivery.carried):null;
 if(intent&&['take','plant','lift','send'].includes(intent.kind)){deliveryTrigger=true;return;}
 if(!focus&&letterController?.nearId){letterController.enter(letterController.nearId);return;}
 if(!focus&&resonance?.context.atStart){attemptResonance();return;}
 if(intent){deliveryTrigger=true;return;}
 interact();
}
function confirmLetter(){
 if(state.cores.some(c=>!c)||state.ending)return;
 const chosen=LETTER_BEDS.filter(b=>state.cores.includes(b.purpose)),left=LETTER_BEDS.find(b=>!state.cores.includes(b.purpose));
 openModal('<small>寄出之前</small><h2>出发以后，岸边仍有春天</h2><div class="letter-preview">'+chosen.map(b=>'<article><i>✦</i><div><h3>'+b.title+'</h3><p>'+b.detail+'。</p></div></article>').join('')+'</div><p class="muted">'+left.title+'暂不持续。它留下的记忆仍在，同行者也仍会陪着你。</p><div class="row"><button id="send-confirm" class="primary">收好安排，去海岸写自己的信 →</button><button id="send-cancel">再想一想</button></div>');
 $('send-cancel').onclick=closeModal;$('send-confirm').onclick=()=>{closeModal();depart();};
}
function switchFlowerForm(id){
 const changed=bouquet.form!==id;flowerForm=bouquet.setForm(id);state.settings.flowerForm=flowerForm;
 if(changed){const samples=bouquet.sampleSurface(65536);flowerBounds=surfaceBounds(samples);particles.setSource(samples);}
 all('[data-form]').forEach(b=>{b.classList.toggle('active',b.dataset.form===flowerForm);b.setAttribute('aria-pressed',String(b.dataset.form===flowerForm));});save();
}
function switchFlowerSeries(id){
 const changed=bouquet.series!==id||bouquet.variant!=='blush';material=id;variant='blush';state.settings.flowerSeries=id;bouquet.setMaterial(id,variant);
 if(changed)particles.setColors(bouquet.sampleColors(65536));syncSurface();
 all('[data-material]').forEach(b=>{b.classList.toggle('active',b.dataset.material===id);b.setAttribute('aria-pressed',String(b.dataset.material===id));});save();
}
function shaderFamily(id){return id==='celadon'?'amber':id;}
async function compileForComposer(){ensureRenderAvailable();const previous=renderer.getRenderTarget();let pending;try{renderer.setRenderTarget(composer.readBuffer);pending=renderer.compileAsync(scene,camera);}finally{renderer.setRenderTarget(previous);}await pending;ensureRenderAvailable();}
async function warmCurrentFlower(){
 bouquet.setOpacity(1);await compileForComposer();waterReflection.update(state.settings.quality,true);composer.render();
 bouquet.setOpacity(.42);particles.object.visible=true;particles.update(0,time,{bloom:displayBloom,dispersion:.75,flow:.5,opacity:.7});
 await compileForComposer();waterReflection.update(state.settings.quality,true);composer.render();bouquet.setOpacity(1);warmedSeries.add(shaderFamily(material));
}
async function prepareFlowerSeries(id){
 if(renderBlocked()||shaderPreparing||!FLOWER_SERIES.some(p=>p.id===id))return;
 if(warmedSeries.has(shaderFamily(id))){switchFlowerSeries(id);return;}
 shaderPreparing=true;clearInput();audio.pause(true);$('material-preparing').hidden=false;
 try{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));ensureRenderAvailable();switchFlowerSeries(id);await warmCurrentFlower();}
 catch(e){if(!renderBlocked()){errors.push('Flower light: '+e.message);toast('这一系列的光泽暂未准备完整，可以切回已有花色。');}}
 finally{shaderPreparing=false;lastTime=0;$('material-preparing').hidden=true;audio.pause(hidden||modalPaused||renderBlocked());}
}
function releaseFlower(){
 if(focus==='letter'){letterController.burst();return;}
 if(focus!=='flower'&&mode!=='gallery')return;
 if(flowerState.phase!=='solid')return;
 flowerBurst=true;audio.event?.('burst');audio.note(392,1.4,.16);world.ripple(0,0,.8);
}
function explorationReply(){const e=state.exploration;return [e.rain.done?'雨留庭的悬花，记住了你画下的那一圈风。':null,e.wind.done?'在风过庭，你把一枚种子送进了避风的花巢。':null,e.tide.done?'在潮生庭，你听完了那些尚未被选择的愿望。':null].filter(Boolean).join('<br>');}
function updateExplorationUI(){const c=exploration.context,visible=false;$('exploration-hint').hidden=!visible;document.body.classList.toggle('in-side-garden',visible&&!state.exploration[c.key]?.done);if(!visible)return;$('garden-title').textContent=exploration.targets[c.key]?.title||'';$('garden-objective').textContent=c.objective;$('garden-hint').textContent=matchMedia('(pointer:coarse)').matches?(c.touchHint||c.hint):c.hint;$('garden-progress').style.width=Math.round(c.progress*100)+'%';$('replay-garden').hidden=!state.exploration[c.key]?.done;}
function showJournal(id){const ids=id?[id]:state.discoveries;openModal(`<small>旅途中留下的回声</small><h2>拾光册</h2><p>花记住形状，水记住声音。<br>你记下的，是它们之间的停顿。</p>${ids.length?ids.map(k=>`<div class="journal-entry"><h3>${journal[k][0]}</h3><p>${journal[k][1]}</p></div>`).join(''):'<p class="muted">靠近杯纹、叶片和旧台，按 E 倾听。</p>'}<div class="journal-entry"><h3>写进春信的回声</h3><p>${personalReply(state.story)}</p><p>${explorationReply()}</p><p>${resonance?Object.entries(resonance.snapshot().records).filter(([,r])=>r.completions).map(([id,r])=>({dawn:'第一阵春风',crosswind:'穿过回旋的风',homeward:'把远方带回来'}[id])+' · '+r.best+' 分 · '+r.grade+' 重和声').join('<br>'):''}</p>${state.exploration.tide.done?'<details class="echo-pages"><summary>潮生庭 · 三封未署名的信</summary>'+ECHO_SITES.map(e=>'<p>'+e.text+'</p>').join('')+'</details>':''}<p class="muted">${Object.entries(BRANCHES).map(([k,b])=>`${state.story.branches[k]?'✓':'○'} ${b.title}`).join('　')}</p></div><details class="journal-roles"><summary>旅途中相遇的生命</summary>${ROLE_TEXT}</details>${mode==='play'?'<button id="replay-opening">重看序章</button>':''}`);if($('replay-opening'))$('replay-opening').onclick=()=>{closeModal();exitFocus();storyDirector.startOpening();};}
function showPlayHelp(){openModal('<small>送春人的随身手册</small><h2>这一路，春天有不同的形状</h2><p><b>花光暗房</b> · 左岸的花房等着重新透进光。拖住玻璃花笺，与幕后留下的花影相遇；1 / 2 / 3 选片，方向键微调，Shift 放轻，Z 撤回。每一片归位，都会带回一部分花园。</p><p><b>纸翼渡风</b> · 起航后拖住纸翼，或按住 WASD / 方向键控制左右与升降，空格收翼缓行。穿过五道形状不同的风门；偏离会回到最近的安全点，可以慢慢练习。</p><p><b>回声织信</b> · 点触或拖过悬挂的乐器，留下自己的八拍回应。1 / 2 / 3 换声部，方向键选拍，Enter 留声，Space 试听。至少留下三音、两种声音，再完整听一遍；空白也是作品的一部分。</p><p>近看时按 E 收起。每段体验完成后，亲自选择回信的去处，才能留下这一版作品。风庭回信后，来信册可乘花尘往返已回信的花庭。</p><p>漫游用 WASD / 方向键，镜头跟随行走；拖动环看，C 回正，Shift 踏风。靠近主花按 E，轻触花心或 F 让花散成花尘，再拖动写风。</p><p>花桥：在石台按住 Space 拖动，沿光迹写路。种核：靠近花杯或花座按 E 拿起、安放、取回。安排好两处春天后，沿驿路穿过三处新地方，再去海岸写信。</p><p>雨幕温室：按住 Space 招蝶，放缓脚步，引蝶在三丛兰花边停留。沉星天文台：走到高台按 E 仰望，按光点顺序描星；松手可以停笔，Z 撤回，1–6 也可选星。云海花甸：Space 起跳并按住展开花伞，配合方向跨过岛间缺口。每次抵达新岛都会留下安全落脚点。</p><p>潮汐：退潮走低石，涨潮停高台。半途邮亭按 E 读岑的旧信，收好后登岛找船。船上 1 / 2 解缆，按住 Space 升帆，也可直接拖动缆绳与桅索。</p><p>出海后 A / D 掌舵，Q / E 调帆，F 撒花种，Space 缓行；触屏可使用方向键、帆角滑条和场景拖动。到曙光前亲手确认启程，结束页会保留你自己的原文。</p><div class="row"><button id="help-journal">查看旧日拾光</button><button id="help-save">旅途存档</button></div>');$('help-journal').onclick=()=>showJournal();$('help-save').onclick=()=>savePanel.show();}
function showSettings(){openModal(`<small>行走与声音</small><h2>以你的步调</h2><label class="option" for="quality-choice">画面密度</label><select id="quality-choice"><option value="light">轻盈 · 较低负担</option><option value="balanced">均衡 · 标准花尘</option><option value="delicate">细腻 · 更清晰的光</option></select><label class="option">镜头随行<input type="checkbox" id="camera-follow" ${state.settings.autoCamera!==false?'checked':''}></label><label class="option">轻缓动态<input type="checkbox" id="reduce-motion" ${state.settings.reducedMotion?'checked':''}></label><label class="option">配乐<input id="music-volume" type="range" min="0" max="1" step=".05" value="${state.settings.musicVolume??.75}"></label><label class="option">动作音效<input id="sfx-volume" type="range" min="0" max="1" step=".05" value="${state.settings.sfxVolume??.8}"></label><label class="option">环境声<input id="ambience-volume" type="range" min="0" max="1" step=".05" value="${state.settings.ambienceVolume??.55}"></label><label class="option">静音<input type="checkbox" id="mute-setting" ${state.settings.muted?'checked':''}></label><p class="muted">WASD 行走，Shift 踏风；靠近信亭按 E。雨庭拖动花笺叠光，风庭用方向键或拖动控制纸翼，潮庭点触乐器写下自己的旋律。镜头会跟着你的脚步转向。拖动可以临时环看，C 回到身后，滚轮拉近或远离。近看花时，轻触花心或按 F 让它化作花尘，再按住拖动写风。花尘会漂游片刻，再缓慢归形。旅途中按住 Space 拖动，或开启风笔 R。种核靠近后点按 E 拾起、安放和取回。</p><div class="row"><button id="save-manager">旅途存档</button><button id="help-play">行走手册</button><button id="playtest-feedback">留下试玩感受</button><button id="recover">回到最近的石台</button><button id="about">作品与来源</button></div>`);
 for(const [id,key] of [['music-volume','musicVolume'],['sfx-volume','sfxVolume'],['ambience-volume','ambienceVolume']])$(id).oninput=e=>{state.settings[key]=Number(e.target.value);syncSound();save();};
 $('save-manager').onclick=()=>savePanel.show();$('help-play').onclick=showPlayHelp;$('playtest-feedback').onclick=()=>playtestFeedback.show();
 $('camera-follow').onchange=e=>{state.settings.autoCamera=e.target.checked;save();};$('quality-choice').value=state.settings.quality;$('quality-choice').onchange=e=>{state.settings.quality=e.target.value;applyQuality();save();};$('reduce-motion').onchange=e=>{state.settings.reducedMotion=e.target.checked;save();};$('mute-setting').onchange=e=>{state.settings.muted=e.target.checked;syncSound();save();};$('recover').onclick=()=>{if(atlas?.active){closeModal();atlas.recover();return;}const p=nearestSafe(state);state.player.x=p.x;state.player.z=p.z;state.bridge.support=null;closeModal();exitFocus();toast('已回到最近的固定石台。');save();};$('about').onclick=()=>{openModal('<small>SPRING LETTER · 0.9.1 雨林 · 星台 · 云海</small><h2>一封信，一处新生活</h2><p>弥是一位新醒来的送春者。岑留下三封没有回复的旧来信，你在光里拼回花窗，乘纸翼穿过风廊，再把自己写下的春声寄向远方。</p><p>十二段主要旅程从花窗、风航、春声和花桥穿过雨幕温室、沉星天文台与云海花甸，再延伸到亲笔写信、潮汐登岛、解缆升帆与海上繁花。游戏在本机运行，进度保存在当前浏览器。没有账号、内购或联网收集。配乐使用七种免费许可真实乐器采样演奏原创乐段；场景、角色、花朵和机关为程序造型。</p><p>乐器：VSCO 2 Community Edition，Sam Gossner、Simon Dalzell；采样编辑 Elan Hickler / Soundemote（CC0）。环境与表面：Poly Haven，Sergej Majboroda、Greg Zaal、Rob Tuytel、Amal Kumar（CC0）。运行库：Three.js、Vite。</p><p>视觉研究参考用户提供的 ShiningBlossom 与 3D粒子效果。玩法研究包括 Flower、A Short Hike 与 SEASON 的公开创作资料。借鉴设计方法，没有打包它们的角色、音乐、模型或画面。</p><p><a href="./ASSET_SOURCES.md" target="_blank" rel="noopener">逐项素材来源</a> · <a href="./THIRD_PARTY_LICENSES.txt" target="_blank" rel="noopener">完整许可与鸣谢</a></p><p class="muted">当前是可独立游玩的艺术探索章节。商业表现、真实玩家接受度和更多设备的表现，仍需实际试玩验证。</p>');};
}
function syncSound(){audio.setMix?.({music:state.settings.musicVolume??.75,sfx:state.settings.sfxVolume??.8,ambience:state.settings.ambienceVolume??.55});audio.setMuted(state.settings.muted);$('sound').textContent=state.settings.muted?'音 · 关':'音 · 开';$('sound').setAttribute('aria-label',state.settings.muted?'打开声音':'关闭声音');}
function applyQuality(){if(renderBlocked())return;let scaleChanged=false;if(depthPass){const scale=state.settings.quality==='delicate'?.65:.5;scaleChanged=depthPass.resolutionScale!==scale;depthPass.enabled=!depthPass.failed&&state.settings.quality!=='light';depthPass.resolutionScale=scale;}particles?.setQuality(state.settings.quality==='light'?'low':'standard');gestureField?.setQuality(state.settings.quality==='light'?'low':'standard');resize(scaleChanged);}
function resetPresentation(){atlas?.stop({preserveLocation:true,silent:true});voyage?.stop();letterController?.reset();resonance?.cancel();dash.reset();flowerCycle.reset();flowerState=flowerCycle.state;travel.reset();endingRevealAt=0;delivery?.reset();storyDirector?.cancelOpening();storyDirector?.exitBranch();document.body.classList.remove('opening','branch-focus');$('nearby-branch').hidden=true;$('exploration-hint').hidden=true;$('field-action').hidden=true;clearInput();focus=null;autoRotate=false;scatterTarget=0;orbit.autoRotate=false;orbit.enabled=false;$('context').hidden=true;document.body.classList.remove('focus');$('auto-rotate').setAttribute('aria-pressed','false');}
function startGame(continued=false){
 if(renderBlocked())return;
 let preferences={...state.settings};if(continued){const r=saveService.reload();if(!r.ok){savePanel.notifyFailure(r);savePanel.show();return;}preferences=readPreferences({getItem:storageGet});}
 const raw=continued?storageGet(SAVE_KEY):null,candidate=continued?restore(raw):createState();candidate.settings=preferences;candidate.started=true;
 if(!continued){const result=saveService.commit({journey:serialize(candidate),preferences:JSON.stringify(preferences),resonance:resonance.persist(),beforeLetter:null},{reason:'new-journey'});if(!result.ok){lastSaveResult=result;savePanel.notifyFailure(result);syncStorageNotice();savePanel.show();return result;}}
 resetPresentation();mode='play';state=candidate;letterController?.reset();
 if(continued&&raw){try{const old=JSON.parse(raw).player,ground=old&&terrainAt(old.x,old.z);if(ground&&!ground.support){state.player={x:old.x,z:old.z,safe:ground.safe};if(ground.platform)state.bridge.platform=ground.platform;}}catch{}}
 resonance?.reset(readResonance());state.started=true;if(!state.p1.solved)state.bloom=Math.max(.82,state.bloom);delivery.restoreCarried(state.deliveryCarried,state);viewRig.reset();autoFlowerEntered=state.p1.solved;lastChapter=-1;switchFlowerForm(state.settings.flowerForm);switchFlowerSeries(state.settings.flowerSeries);setPenMode(false);displayBloom=state.bloom;document.body.classList.add('play');document.body.classList.remove('gallery');$('cover').hidden=true;$('hud').hidden=false;$('controls').hidden=false;$('gallery-tabs').hidden=true;world.group.visible=true;world.player.visible=true;bouquet.group.visible=true;syncSound();applyQuality();setNight(false);audio.unlock();caption(continued?(state.bridge.solved&&state.cores.some(v=>!v)?state.deliveryCarried!==null?'春信还在。那枚种核，仍在你的手中。':'春信还在。未安放的种核，在终庭入口等你。':'春信还在，花庭等你继续。'):'',7);$('touch-pad').hidden=!matchMedia('(pointer:coarse)').matches;save();updateUI();if(state.atlas.location)atlas.start(state.atlas.location,{resume:true});else if(!state.story.introSeen)storyDirector.startOpening();else if(state.bridge.solved&&(state.ending||state.voyage.stage!=='idle'))voyage.start();}
function showCover(){save();resetPresentation();galleryReturnToJourney=false;mode='cover';document.body.classList.remove('play','gallery');$('cover').hidden=false;$('hud').hidden=true;$('controls').hidden=true;$('gallery-tabs').hidden=true;$('touch-pad').hidden=true;world.group.visible=true;world.player.visible=false;bouquet.group.visible=true;$('caption').textContent='';const returning=restore(storageGet(SAVE_KEY)).started;$('continue').hidden=!returning;$('continue').classList.toggle('primary',returning);$('begin').classList.toggle('primary',!returning);$('begin').textContent=returning?'另起一封春信':'走进花庭 ↗';$('continue').style.order=returning?'-1':'';setNight(false);}
function enterGallery(kind='flower'){
 if(renderBlocked()||mode==='opening')return;
 closeModal();
 const switching=mode==='gallery',wasSettled=targetVisible,oldTarget=orbit.target.clone();
 if(!switching){
  // Pause the exact journey before leaving its map; the gallery only saves preferences.
  const saved=save();if(!saved.ok){savePanel.show();return;}
  galleryReturnToJourney=mode==='play';closeModal();resetPresentation();displayBloom=1;scatterTarget=0;
 }
 mode='gallery';galleryKind=kind;audio.unlock();document.body.classList.add('play','gallery');
 $('cover').hidden=true;$('hud').hidden=true;$('controls').hidden=false;$('gallery-tabs').hidden=false;$('touch-pad').hidden=true;
 world.player.visible=false;bouquet.group.visible=true;setNight(kind==='dust');openFocus('flower');
 $('gallery-back').hidden=false;$('gallery-back').textContent=galleryReturnToJourney?'回到刚才的旅途 ↗':'返回扉页 ↗';
 $('leave-focus').setAttribute('aria-label',galleryReturnToJourney?'回到刚才的旅途':'返回扉页');
 if(switching){targetVisible=wasSettled;orbit.target.copy(oldTarget);}
 syncGalleryViews();caption(kind==='dust'?'花色留在微尘里，风会记住你的笔迹。':'每一种花形，都有属于它的颜色与光。',5);
}
function syncGalleryViews(){all('[data-gallery]').forEach(b=>{const active=b.dataset.gallery===(mode==='gallery'?galleryKind:'flower');b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
function leaveGallery(){if(galleryReturnToJourney){const saved=save();if(!saved.ok){savePanel.show();return;}startGame(true);}else showCover();}

function openFocus(kind){focus=kind;clearInput();$('context').hidden=false;document.body.classList.add('focus');for(const k of ['flower','wind','pool','finale','branch'])$(k+'-controls').hidden=k!==kind;$('context-label').textContent={flower:mode==='gallery'?'一朵花的许多种生命':'第一幕 · 让春风经过',wind:'第二幕 · 风中的回信',pool:'第三幕 · 借一段花桥',finale:'第四幕 · 待寄出的春信'}[kind];orbit.enabled=false;targetVisible=true;$('surface-controls').hidden=mode!=='gallery'||galleryKind==='dust';if(kind==='flower'){$('flower-workbench').open=true;$('gallery-tabs').hidden=false;$('gallery-back').hidden=mode!=='gallery';$('context').scrollTop=0;syncGalleryViews();$('leave-focus').setAttribute('aria-label','退出近看');$('flower-practice').textContent=matchMedia('(pointer:coarse)').matches?'轻触花心，打散花瓣。按住拖动，给花尘一阵风；双指拖动环看，张合缩放。':'轻触花心或按 F，打散花瓣。按住拖动写风，右键环看。';$('bloom').value=Math.round((mode==='gallery'?displayBloom:state.bloom)*100);syncBloom();}if(kind==='pool'){selectedShape=state.bridge.platform==='M'?'bridge_mf':state.bridge.platform==='F'?'bridge_mf':'bridge_am';syncPool();}if(kind==='finale')syncCores();if(kind==='wind')$('wind-reset').hidden=state.wind.solved;}
function exitFocus(){if(focus==='atlas'){atlas.stop();focus=null;document.body.classList.remove('focus');return;}if(focus==='voyage'){voyage.stop();focus=null;document.body.classList.remove('focus');return;}if(focus==='letter'){letterController.exit();return;}storyDirector?.exitBranch();document.body.classList.remove('branch-focus');if(mode==='gallery'){leaveGallery();return;}focus=null;$('context').hidden=true;document.body.classList.remove('focus');orbit.enabled=false;autoRotate=false;orbit.autoRotate=false;clearInput();}
function interact(){if(mode!=='play')return;if(focus){exitFocus();return;}const branch=storyDirector.nearby();if(branch){storyDirector.openBranch(branch);return;}const p=state.player;const nearby=world.targets.filter(t=>t.kind==='discovery'&&Math.hypot(p.x-t.x,p.z-t.z)<1.8).sort((a,b)=>Math.hypot(p.x-a.x,p.z-a.z)-Math.hypot(p.x-b.x,p.z-b.z))[0];if(nearby){discover(nearby.id.replace('discover-',''));return;}if(Math.hypot(p.x,p.z)<8){openFocus('flower');caption('花还记得风。轻轻碰一碰它。',4);}else if(state.p1.solved&&Math.hypot(p.x,p.z+16)<7){openFocus('wind');caption('按住游光，把它引向远处的花杯。松手，它会慢慢停下。',5);}else if(state.bridge.solved&&p.z<-39){openFocus('finale');caption('保存、滋养、远行。\n两枚种核，写不尽三个愿望。',6);}else if(state.wind.solved&&p.z<-23){openFocus('pool');}else toast('向花庭深处走一走，再靠近细看。');}
function syncSurface(){const values=bouquet.setSurface?.()||{iridescence:.75,thickness:325,gloss:.81,radiance:.08};all('[data-surface]').forEach(el=>{el.value=values[el.dataset.surface];el.disabled=material==='lily'&&['iridescence','thickness'].includes(el.dataset.surface);});}
function syncBloom(){
 const b=mode==='gallery'?displayBloom:state.bloom;$('bloom-value').textContent=Math.round(b*100)+'%';
 $('bloom-hint').textContent=mode==='gallery'?(flowerState.phase==='solid'?'轻触花心，让这一朵花换一种生命。':flowerState.phase==='returning'?'光正慢慢回到花瓣里。':'沿花尘拖动，试试轻推、盘旋，或留下一道风。'):flowerLessonHint(state,flowerState.phase);
 $('flower-cycle-label').textContent={solid:'花的形体',breaking:'破开',drifting:'逐风而行',returning:'缓缓归形'}[flowerState.phase];
 $('flower-burst').disabled=flowerState.phase!=='solid';
}
function setBloom(value){const b=clamp(value,0,1);if(mode==='gallery')displayBloom=b;else state.bloom=b;$('bloom').value=Math.round(b*100);syncBloom();}
function syncPool(){$('platform-label').textContent=state.bridge.support?'正在花路上：结构承托着你，暂不能收回。':`当前石台：${{A:'此岸',R:'旧台',M:'中庭',F:'彼岸'}[state.bridge.platform]} · 用风笔从脚下的光环，沿亮点连向另一座台。下方按钮可辅助归形。`;all('[data-shape]').forEach(b=>b.classList.toggle('active',b.dataset.shape===state.bridge.structure));}
function shape(target){const result=setStructure(state,target);if(!result.ok){toast(result.reason);return;}selectedShape=target;audio.note(target==='none'?261:523,1.5,.3);toast(target==='none'?'花尘已回到你的身边。':'花尘凝成一段可走的路。');syncPool();save();}
function syncCores(){
 $('allocation').textContent=state.cores.map(c=>c?purposes[c]:'尚未安放').join(' · ');
 $('depart').disabled=false;$('depart').hidden=!!state.ending;$('review-letter').hidden=!state.ending;
}
function depart(){
 if(!state.bridge.solved||state.cores.some(c=>!c))return;
 const before=serialize(state),checkpoint=storageGet(SAVE_KEY+':before-letter')||before,saved=saveService.commit({journey:before,beforeLetter:checkpoint,preferences:JSON.stringify(state.settings),resonance:resonance.persist()});
 lastSaveResult=saved;if(!saved.ok){savePanel.notifyFailure(saved);savePanel.show();return;}
 exitFocus();audio.chime();continueToCoast();
}
function finishVoyage(){
 if(state.ending)return true;
 if(state.voyage.stage!=='complete')return false;
 const candidate=structuredClone(state),result=commitLetter(candidate);if(!result.ok){toast(result.reason);return false;}
 const saved=saveService.commit({journey:serialize(candidate),preferences:JSON.stringify(candidate.settings),resonance:resonance.persist()});lastSaveResult=saved;
 if(!saved.ok){savePanel.notifyFailure(saved);savePanel.show();return false;}
 state=candidate;return true;
}
function rewindLetter(){
 const checkpoint=restore(storageGet(SAVE_KEY+':before-letter')),candidate=checkpoint.bridge.solved?checkpoint:restore(serialize({...state,ending:null}));
 if(!checkpoint.bridge.solved)candidate.voyage=createState().voyage;
 candidate.atlas=structuredClone(state.atlas);candidate.settings={...state.settings};candidate.ending=null;candidate.lettersSent=null;
 const result=saveService.commit({journey:serialize(candidate),preferences:JSON.stringify(candidate.settings),resonance:resonance.persist()});lastSaveResult=result;
 if(!result.ok){savePanel.notifyFailure(result);savePanel.show();return;}
 state=candidate;endingRevealAt=0;delivery.restoreCarried(state.deliveryCarried,state);closeModal();exitFocus();caption('回到了启程前。靠近花座，可以把种核重新带走。',6);
}
function showEnding(){endingRevealAt=0;if(state.bridge.solved&&state.cores.every(Boolean))continueToCoast();}
function updateUI(){
 if(mode!=='play')return;
 const v=state.voyage,act=v?.stage==='complete'||v?.stage==='dawn'||v?.stage==='sailing'?8:v?.stage==='rigging'||v?.stage==='island'?7:v?.stage==='tide'?6:v?.stage==='writing'?5:!state.moments.entries.rain.completed?0:!state.moments.entries.wind.completed?1:!state.moments.entries.tide.completed?2:!state.bridge.solved?3:4;
 if(act!==lastChapter){lastChapter=act;chapterNoticeUntil=time+9;}document.body.classList.toggle('chapter-notice',time<chapterNoticeUntil);
 const routeAct=act>=5?act+3:act;$('act-number').textContent=ROMAN_CHAPTERS[routeAct];$('act-title').textContent=JOURNEY_CHAPTERS[routeAct][0];$('act-eyebrow').textContent='LETTERS ON THE WAY · '+(routeAct+1)+' / 12';
 $('objective').textContent=['沿左岸花径去听雨春庭，给禾的花窗重新透进光。','带着第一封回信，穿过风廊，去右岸试飞一只纸翼。','沿风廊尽头走向旧台，去左岸为未完的曲子写下回应。','回到借桥的石台，沿光迹写路，跨过断开的花庭。','亲手安放两枚种核，穿过温室、星台与云甸，再去海岸写自己的信。','在海岸留下自己的收信人、正文与花印。','观察涨退潮，去旧邮亭带上岑的信，再登小岛。','走到岛岸找到船，解开两根缆绳，亲手升帆。','把两封信带向晨光，让立体的花沿航迹开放。'][act];
 $('progress-fill').style.width=(v?.stage==='complete'?100:routeAct/12*100)+'%';updateExplorationUI();fieldAction();if(focus==='pool')syncPool();if(focus==='wind')$('wind-reset').hidden=state.wind.solved;const nearby=focus?null:storyDirector?.nearby();$('nearby-branch').hidden=!nearby;if(nearby)$('nearby-branch').querySelector('span').textContent=(state.story.branches[nearby]?'重访 · ':'')+BRANCHES[nearby].title;
}
function photo(){
 try{composer.render();const source=document.createElement('canvas');source.width=renderer.domElement.width;source.height=renderer.domElement.height;source.getContext('2d').drawImage(renderer.domElement,0,0);
  openModal('<small>这一程，值得留下</small><h2>带走一张春信</h2><p>把这一帧春光和你亲手留下的照料，一起存成图片。只在本机制作。</p><canvas id="postcard-preview" aria-label="包含当前风景与三庭回信选择的春信明信片"></canvas><div class="row"><button id="postcard-download" class="primary">保存春信明信片</button><button id="photo-download">只保存风景</button></div>');
  const card=drawPostcard($('postcard-preview'),source,state.ending?state.lettersSent:state.letters,{ended:state.ending});
  const download=(canvas,name)=>canvas.toBlob(blob=>{if(!blob){toast('图片尚未生成，请稍后再试。');return;}const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('春光已交给浏览器下载。');},'image/png');
  $('postcard-download').onclick=()=>download(card,'我的春信明信片.png');$('photo-download').onclick=()=>download(source,'我的一帧春光.png');
 }catch{toast('此浏览器无法导出画面，可以使用系统截图。');}
}

function resize(force=false){
 if(!renderer||!camera||!composer||renderBlocked())return;
 const gl=renderer.getContext(),maxDimension=Math.min(renderer.capabilities.maxTextureSize||4096,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)||4096);
 const next=computeRenderSize({width:innerWidth,height:innerHeight,devicePixelRatio,quality:state.settings.quality,maxDimension});
 if(force!==true&&renderSize&&next.width===renderSize.width&&next.height===renderSize.height&&next.pixelRatio===renderSize.pixelRatio)return;
 camera.aspect=next.width/next.height;camera.updateProjectionMatrix();
 // A transient 1 px viewport can need a density below one. Keep both real
 // backing dimensions nonzero while CSS and camera retain the visible aspect.
 const w=Math.max(next.width,Math.ceil(1/next.pixelRatio)),h=Math.max(next.height,Math.ceil(1/next.pixelRatio));
 renderer.setDrawingBufferSize(w,h,next.pixelRatio);
 if(renderSize?.pixelRatio!==next.pixelRatio){composer.setSize(1,1);composer.setPixelRatio(next.pixelRatio);}
 composer.setSize(w,h);renderSize={...next,bufferWidth:renderer.domElement.width,bufferHeight:renderer.domElement.height};
}
function setPointer(e){const rect=renderer.domElement.getBoundingClientRect();pointerNDC.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointerNDC,camera);return raycaster.ray.intersectPlane(waterPlane,hit);}
function setupInput(){

 $('cover-atlas').onclick=showMap;$('begin').onclick=()=>savePanel.confirmNew(()=>startGame());$('continue').onclick=()=>startGame(true);$('gallery').onclick=()=>enterGallery();$('flower-studio').onclick=()=>enterGallery();$('home').onclick=showCover;$('gallery-back').onclick=leaveGallery;all('[data-gallery]').forEach(b=>b.onclick=()=>enterGallery(b.dataset.gallery));$('night').onclick=()=>setNight(!night);$('sound').onclick=()=>{audio.unlock();state.settings.muted=!state.settings.muted;syncSound();save();};$('settings').onclick=showSettings;$('journal').onclick=showLetters;$('close-modal').onclick=closeModal;$('modal').addEventListener('cancel',e=>{e.preventDefault();closeModal();});$('leave-focus').onclick=()=>mode==='gallery'?leaveGallery():exitFocus();$('focus-button').onclick=requestInteraction;$('recenter-camera').onclick=()=>travel.recenter();$('flower-burst').onclick=releaseFlower;$('photo').onclick=photo;$('bloom').oninput=e=>setBloom(+e.target.value/100);$('scatter').onclick=()=>setPenMode(!penMode);$('wind-pen').onclick=()=>setPenMode(!penMode);$('map').onclick=showMap;$('replay-garden').onclick=()=>{const key=exploration.context.key;if(key){state.exploration=restartExploration(state.exploration,key);save();}};$('chase-light').onclick=()=>{chasing=!chasing;$('chase-light').setAttribute('aria-pressed',String(chasing));};all('[data-surface]').forEach(el=>el.oninput=()=>bouquet.setSurface?.({[el.dataset.surface]:Number(el.value)}));$('auto-rotate').onclick=()=>{autoRotate=!autoRotate;orbit.autoRotate=autoRotate;$('auto-rotate').setAttribute('aria-pressed',String(autoRotate));};all('[data-material]').forEach(b=>b.onclick=()=>prepareFlowerSeries(b.dataset.material));all('[data-form]').forEach(b=>b.onclick=()=>switchFlowerForm(b.dataset.form));$('wind-reset').onclick=()=>{if(state.wind.solved)return;Object.assign(state.wind,{x:-3,z:2,vx:0,vz:0,hold:0,touched:false});toast('光回到了最初的花杯。');};all('[data-shape]').forEach(b=>b.onclick=()=>shape(b.dataset.shape));$('depart').onclick=()=>{exitFocus();caption('带着种核走近花座，点按 E 安放。',5);};$('review-letter').onclick=showEnding;
 window.addEventListener('keydown',e=>{
  if(renderBlocked())return;
  if(e.altKey&&e.code==='Enter'){e.preventDefault();if(!e.repeat)fullscreen.toggle();return;}
  if(e.code==='Escape'&&fullscreen.isActive()){e.preventDefault();fullscreen.toggle();return;}if(e.code==='Escape'&&performance.now()-fullscreenExitedAt<300){e.preventDefault();return;}
  if($('modal').open)return;if(shaderPreparing){e.preventDefault();return;}
  // Retain the physical modifier while a form control has focus. It becomes a
  // canvas chord only on pointerdown; the focused control keeps its native keys.
  if(atlas?.active){if(atlas.handleKey(e))e.preventDefault();return;}
  if(voyage?.active){if(voyage.handleKey(e))e.preventDefault();return;}
  if(e.code==='Space')spaceHeld=true;
  if(e.code==='Escape'){e.preventDefault();if(storyDirector.opening)storyDirector.finishOpening();else if(focus)exitFocus();else showSettings();e.target.blur?.();return;}
  if(e.target.matches('input,select,textarea'))return;
  if(letterController?.handleKey(e)){e.preventDefault();return;}
  if(e.repeat)return;
  if(storyDirector.handleKey(e.code)){e.preventDefault();return;}
  if(e.code==='Space'&&e.target.matches('button'))return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  keys.add(e.code);if(e.code==='KeyE')requestInteraction();if(e.code==='KeyF')releaseFlower();if(e.code==='KeyC')travel.recenter();if(e.code==='KeyR')setPenMode(!penMode);if(e.code==='KeyM')showMap();
 });window.addEventListener('keyup',e=>{if(renderBlocked())return;if(atlas?.active){atlas.handleKey(e);return;}if(voyage?.active){voyage.handleKey(e);return;}letterController?.handleKey(e);keys.delete(e.code);if(e.code==='Space')spaceHeld=false;});
 all('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.move);});
 const canvas=renderer.domElement;canvas.tabIndex=0;document.addEventListener('click',e=>{if(e.detail>0)e.target.closest('button')?.blur();});canvas.addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('pointerdown',e=>{if(mode==='cover'||mode==='opening')return;e.preventDefault();if(atlas?.active){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();atlas.pointer('down',raycaster,e);return;}if(voyage?.active){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();voyage.pointer('down',raycaster,e);return;}if(focus==='letter'){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();if(e.button===0)letterController.pointer('down',raycaster,e);return;}if(spaceHeld)keys.add('Space');audio.unlock();if(e.pointerType==='touch'){touchPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touchPoints.size===2){const p=[...touchPoints.values()];pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);pinchCenter={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};hadPinch=true;gesture.active=false;gestureLastActive=false;gesture.released=false;cancelSeedGuidance(state);state.exploration=cancelExplorationGuidance(state.exploration);weaver?.cancel();}}canvas.setPointerCapture(e.pointerId);if(touchPoints.size<2)canvasPointerId=e.pointerId;pointerDown=true;pointerMoved=false;pressOrigin={x:e.clientX,y:e.clientY};startPointer={x:e.clientX,y:e.clientY};orbiting=e.button===2||!(penMode||keys.has('Space')||keys.has('KeyQ')||focus==='flower'||focus==='wind'||mode==='gallery');pointerActive=!orbiting;setPointer(e);canvas.focus({preventScroll:true});},true);
 canvas.addEventListener('pointermove',e=>{
  if(atlas?.active){setPointer(e);atlas.pointer('move',raycaster,e);return;}
  if(voyage?.active){setPointer(e);voyage.pointer('move',raycaster,e);return;}
  if(focus==='letter'){setPointer(e);letterController.pointer('move',raycaster,e);return;}
  if(e.pointerType==='touch'&&touchPoints.has(e.pointerId)){touchPoints.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touchPoints.size===2){const p=[...touchPoints.values()],distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(pinchDistance>5&&distance>5)viewRig.zoom(-Math.log(distance/pinchDistance)*1250);const center={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};viewRig.drag(center.x-pinchCenter.x,center.y-pinchCenter.y);travel.orbit();pinchCenter=center;pinchDistance=distance;pointerActive=false;return;}}
  const dx=e.clientX-startPointer.x,dy=e.clientY-startPointer.y;pointerMoved ||= pointerDown&&Math.hypot(e.clientX-pressOrigin.x,e.clientY-pressOrigin.y)>5;
  if(pointerDown&&orbiting){travel.orbit();viewRig.drag(dx,dy);pointerActive=false;}
  else {pointerActive=!e.shiftKey;if(pointerDown&&(penMode||keys.has('Space')||focus==='flower'||mode==='gallery')&&(focus==='flower'||mode==='gallery')&&flowerState.phase==='solid'&&Math.abs(dy)<24)setBloom((mode==='gallery'?displayBloom:state.bloom)-dy*.0025);}
  startPointer={x:e.clientX,y:e.clientY};setPointer(e);lastPointerMove=time;
  if(pointerActive&&focus!=='wind'&&time-lastRipple>.14&&raycaster.ray.intersectPlane(ripplePlane,hit)){world.ripple(hit.x,hit.z,.22);lastRipple=time;}
 });
 canvas.addEventListener('pointerleave',()=>{if(!pointerDown)pointerActive=false;});
 window.addEventListener('pointerup',e=>{if(atlas?.active){setPointer(e);atlas.pointer('up',raycaster,e);return;}if(voyage?.active){setPointer(e);voyage.pointer('up',raycaster,e);return;}if(focus==='letter'){setPointer(e);letterController.pointer('up',raycaster,e);return;}if(e.pointerId!==canvasPointerId&&!touchPoints.has(e.pointerId))return;touchPoints.delete(e.pointerId);if(e.target===canvas&&e.button!==2&&!pointerMoved&&!hadPinch&&(focus==='flower'||mode==='gallery')){raycaster.setFromCamera(pointerNDC,camera);if(raycaster.intersectObjects(bouquet.group.children,true).length)releaseFlower();}if(e.target===canvas&&!pointerMoved&&!hadPinch&&setPointer(e)&&raycaster.ray.intersectPlane(ripplePlane,hit)){world.ripple(hit.x,hit.z,.8);audio.note(290+Math.random()*80,.8,.12);}pointerDown=false;orbiting=false;if(!touchPoints.size){pinchDistance=0;hadPinch=false;canvasPointerId=null;}});
 canvas.addEventListener('wheel',e=>{if(atlas?.active){e.preventDefault();atlas.zoom(e.deltaY);return;}if(voyage?.active)return;if(mode==='cover'||mode==='opening')return;e.preventDefault();if(e.shiftKey&&(focus==='flower'||mode==='gallery'))setBloom((mode==='gallery'?displayBloom:state.bloom)-e.deltaY*.001);else viewRig.zoom(e.deltaY);},{passive:false});
 window.addEventListener('pointercancel',clearInput);window.addEventListener('blur',()=>{clearInput();hidden=true;audio.pause(true);save();});window.addEventListener('focus',()=>{hidden=document.hidden;lastTime=performance.now();audio.pause(hidden||modalPaused||renderBlocked());});document.addEventListener('visibilitychange',()=>{hidden=document.hidden;clearInput();lastTime=performance.now();audio.pause(hidden||modalPaused||renderBlocked());if(hidden)save();});window.addEventListener('beforeunload',e=>{save();if(storageBackend.temporary&&state.started){e.preventDefault();e.returnValue='';}});window.addEventListener('resize',resize);
}

function terrainAt(x,z){return supportAt(x,z,state)||landscape?.supportAt(x,z,state); }
function movePlayer(dt){
 if(focus==='atlas'||focus==='voyage'||focus==='flower'||focus==='wind'||focus==='branch'||focus==='letter'){dash.update(dt,{enabled:false});travel.observe(0,0,dt);return;}
 const right=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
 const direction=travel.movement(right,forward,viewRig.state.azimuth??0),wasDashing=dash.state.active;
 resonanceSlow=Math.max(0,resonanceSlow-dt);const speed=dash.update(dt,{moving:!!(right||forward),held:touchDash||keys.has('ShiftLeft')||keys.has('ShiftRight'),recoveryRate:state.letters.entries.rain.choice?1.5:1}).speed*(resonanceSlow>0?.55:1);if(dash.state.active&&!wasDashing)audio.event?.('dash');
 const dx=direction.x*dt*speed,dz=direction.z*dt*speed,p=state.player,oldX=p.x,oldZ=p.z;
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));for(let i=0;i<steps;i++){const sx=dx/steps,sz=dz/steps;let support=terrainAt(p.x+sx,p.z+sz);if(support){p.x+=sx;p.z+=sz;}else{support=terrainAt(p.x+sx,p.z);if(support)p.x+=sx;else if(terrainAt(p.x,p.z+sz))p.z+=sz;}}
 travel.observe(p.x-oldX,p.z-oldZ,dt);
 const ground=terrainAt(p.x,p.z);if(ground?.platform==='M'&&!state.story.seenChapters.includes(3)){state.story.seenChapters.push(3);discoverSilently('protocol');caption(CHAPTER_LINES[3].join('：'),8);save();}if(ground){playerHeight=lerp(playerHeight,ground.height??.12,1-Math.exp(-dt*12));p.safe=ground.safe;if(ground.platform)state.bridge.platform=ground.platform;state.bridge.support=ground.support||null;if(ground.platform==='F'&&!state.bridge.solved){state.bridge.solved=true;audio.chime();caption('风暴之后，这里只剩两枚能够萌发的种核。\n前方，三座花庭仍在等待。',8);save();}}
}
function updateCamera(dt){
 if(atlas?.active){const framed=atlas.camera(camera.aspect);camera.far=framed.far;camera.fov=THREE.MathUtils.damp(camera.fov,framed.fov,5,dt);camera.updateProjectionMatrix();cameraGoal.fromArray(framed.position);lookGoal.fromArray(framed.target);const blend=1-Math.exp(-dt*7);camera.position.lerp(cameraGoal,blend);followLook.lerp(lookGoal,blend);camera.lookAt(followLook);orbit.enabled=false;return;}
 if(voyage?.active){const framed=voyage.camera(camera.aspect);camera.far=1800;camera.fov=THREE.MathUtils.damp(camera.fov,48,4,dt);camera.updateProjectionMatrix();cameraGoal.fromArray(framed.position);lookGoal.fromArray(framed.target);const t=1-Math.exp(-dt*5);camera.position.lerp(cameraGoal,t);followLook.lerp(lookGoal,t);camera.lookAt(followLook);orbit.enabled=false;return;}
 if(camera.far!==160){camera.far=160;camera.updateProjectionMatrix();}
 const desiredFov=mode==='cover'||focus==='flower'||mode==='gallery'?40:dash.state.active&&!state.settings.reducedMotion?53:48;camera.fov=lerp(camera.fov,desiredFov,1-Math.exp(-dt*4));camera.updateProjectionMatrix();
 let key=null,offset=null;
 if(mode==='opening'&&storyDirector.opening){const shot=storyDirector.opening;cameraGoal.fromArray(shot.camera);lookGoal.fromArray(shot.target);if(state.settings.reducedMotion){cameraGoal.set(8,4.7,11);lookGoal.set(0,1.4,0);}}
 else if(mode==='cover'){cameraGoal.set(innerWidth<700?12:7.4,innerWidth<700?6.2:4.2,innerWidth<700?18:10.5);lookGoal.set(innerWidth<700?-.4:-1.8,innerWidth<700?4.1:1.95,0);}
 else if(focus==='letter'){
  const bounds=letterController.bounds(),panel=$('letter-panel')?.getBoundingClientRect(),portrait=innerWidth<701;
  const legacyRect=portrait?{left:20,right:innerWidth-20,top:90,bottom:Math.max(260,(panel?.top||innerHeight-310)-16)}:{left:45,right:Math.max(innerWidth*.45,(panel?.left||innerWidth-350)-45),top:100,bottom:innerHeight-70};
  const rect=letterController.frameRect?.(innerWidth,innerHeight)||legacyRect;const framed=frameBounds(bounds,{direction:letterController.cameraOffset?.()||{x:0,y:8.5,z:4.2},fov:48,width:innerWidth,height:innerHeight,rect});cameraGoal.copy(framed.target).add(framed.offset);lookGoal.copy(framed.target);
 }
 else if(focus==='flower'||mode==='gallery'){lookGoal.set(.35,2.3,0);key='flower';offset={x:4.45,y:1.45,z:7.2};}
 else if(focus==='branch'){const id=storyDirector.branch,b=BRANCHES[id],detail=id!=='rhythm';lookGoal.set(b.x+(innerWidth<700?0:detail?.55:1),detail?1.05:.9,b.z+(innerWidth<700?.65:id==='memory'?-.5:-.1));key='branch-'+id;offset={x:detail?-1.85:1.2,y:detail?1.3:2.5,z:detail?2.6:4.5};}
 else if(focus==='wind'){lookGoal.set(0,.2,-16);key='wind';offset={x:0,y:9.1,z:8.6};}
 else if(focus==='finale'||endingRevealAt&&state.ending){const wide=Math.max(1,Math.min(2,.8/camera.aspect));lookGoal.set(0,.8,-46);key=(focus==='finale'?'finale':'farewell')+(wide>1?'-portrait':'');offset={x:6.8*wide,y:6.2*wide,z:(focus==='finale'?10.2:-10.2)*wide};}
 else{const ahead=travel.state.movingTime>.2?.65:0,h=travel.state.heading;lookGoal.set(state.player.x-Math.sin(h)*ahead,playerHeight+1.12,state.player.z-Math.cos(h)*ahead);const portrait=innerWidth/innerHeight<.78,finale=state.bridge.solved&&state.player.z<-39;key=portrait?(finale?'roam-portrait-finale':'roam-portrait'):'roam';offset=portrait?(finale?{x:0,y:7,z:18.7}:{x:0,y:3.9,z:9.8}):{x:0,y:2.65,z:6.7};}
 if(key){
  viewRig.select(key,offset);
  if(key.startsWith('roam'))viewRig.orient(travel.turn(dt,{azimuth:viewRig.state.azimuth,enabled:state.settings.autoCamera!==false,blocked:orbiting||gesture.active,reducedMotion:state.settings.reducedMotion}));
  if(autoRotate)viewRig.rotate(dt*.11);
  if(key==='flower'){
   const panel=$('context').getBoundingClientRect(),portrait=innerWidth/innerHeight<.78;
   const rect=portrait?{left:22,right:innerWidth-22,top:78,bottom:Math.max(230,panel.top-24)}:{left:Math.max(24,innerWidth*.045),right:Math.max(innerWidth*.45,panel.left-28),top:Math.min(100,innerHeight*.19),bottom:innerHeight-88};
   const options={direction:viewRig.offset(),fov:40,width:innerWidth,height:innerHeight,rect};
   viewRig.fit(frameBounds(flowerBounds,options).radius);
   const breathing=1+scatter*.12,frame=frameBounds(flowerBounds,{...options,distance:viewRig.state.radius*breathing});
   lookGoal.copy(frame.target);cameraGoal.copy(frame.target).add(frame.offset);
  }else if(key==='roam-portrait-finale'){
   // A narrow view holds the small terminal garden together while its yaw still
   // follows travel. The player can compare all three futures without dragging.
   const options={direction:viewRig.offset(),fov:48,width:innerWidth,height:innerHeight,rect:{left:22,right:innerWidth-22,top:150,bottom:Math.max(350,innerHeight-255)}};
   const bounds={min:[-4,.0,-50.8],max:[4,2.6,-41.6]};
   viewRig.fit(frameBounds(bounds,options).radius);
   const frame=frameBounds(bounds,{...options,distance:viewRig.state.radius});lookGoal.copy(frame.target);cameraGoal.copy(frame.target).add(frame.offset);
  }else{const o=viewRig.offset();cameraGoal.set(lookGoal.x+o.x,lookGoal.y+o.y,lookGoal.z+o.z);}
 }
 const ground=terrainAt(cameraGoal.x,cameraGoal.z);cameraGoal.y=Math.max(cameraGoal.y,(ground?.height??-.18)+.6);
 const t=1-Math.exp(-dt*(state.settings.reducedMotion?14:orbiting?16:5));camera.position.lerp(cameraGoal,t);const actualGround=terrainAt(camera.position.x,camera.position.z);camera.position.y=Math.max(camera.position.y,(actualGround?.height??-.18)+.45);followLook.lerp(lookGoal,t);camera.lookAt(followLook);orbit.enabled=false;
}
function updateGesture(dt,cycleDt=dt){
 const eligible=(mode==='play'||mode==='gallery')&&focus!=='branch'&&focus!=='letter';
 gesture.active=eligible&&!orbiting&&touchPoints.size<2&&!hadPinch&&((pointerDown&&(penMode||keys.has('Space')||focus==='flower'||focus==='wind'||mode==='gallery'))||keys.has('KeyQ'));
 gesture.released=gestureLastActive&&!gesture.active;
 if(gesture.active){
  raycaster.setFromCamera(pointerNDC,camera);
  const hero=focus==='flower'||mode==='gallery';
  const plane=hero?new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(),new THREE.Vector3(0,2,0)):new THREE.Plane(new THREE.Vector3(0,1,0),-(exploration?.context?.key?(exploration.targets[exploration.context.key].y+.3):(state.wind.solved&&state.player.z<-23&&state.player.z>-40?.4:playerHeight+1.2)));
  if(Math.abs(pointerNDC.x)>2)gestureHit.set(0,2,0);else if(!raycaster.ray.intersectPlane(plane,gestureHit))gestureHit.copy(gesture.position);
  gesture.position.copy(gestureHit);if(gestureLastActive&&dt>0){
   gesture.velocity.subVectors(gesture.position,previousGesture).divideScalar(dt);
   // Integrate the scalar distance before the particle-force cap. Pointer events
   // arrive less often than RAF; capping those pulses first loses stroke energy.
   strokeMotion.update(gesture.velocity.length(),dt);
   gesture.velocity.clampLength(0,18);
  }else{gesture.velocity.set(0,0,0);strokeMotion.reset();}
  previousGesture.copy(gesture.position);gesture.strength=clamp(.55+gesture.velocity.length()*.035,.55,1.25);
 }else{gesture.velocity.multiplyScalar(Math.exp(-dt*6));gesture.strength*=Math.exp(-dt*4);strokeMotion.reset();}
 gestureLastActive=gesture.active;
 if(mode!=='opening'){flowerState=flowerCycle.update(cycleDt,{active:(focus==='flower'||mode==='gallery')&&gesture.active,energy:strokeMotion.value,burst:flowerBurst||((focus==='flower'||mode==='gallery')&&keys.has('KeyQ')),reducedMotion:state.settings.reducedMotion});flowerBurst=false;scatterTarget=flowerState.dispersion;}
 document.body.classList.toggle('drawing-wind',gesture.active);
}
function updatePlay(dt){state.playedSeconds=(state.playedSeconds||0)+dt;movePlayer(dt);world.player.position.set(state.player.x,playerHeight+.23,state.player.z);if(updateFlowerLesson(state,{phase:flowerState.phase,active:focus==='flower'&&gesture.active,energy:focus==='flower'?strokeMotion.value:0},dt)){audio.chime();caption('春风走过花尘。水下的路，也醒了。',7);discoverSilently('leaf');save();}if(focus==='flower')syncBloom();
 // Near-view is deliberate; walking past the flower never steals the camera.
 if(focus==='wind'&&!state.wind.solved){const was=state.wind.solved;raycaster.setFromCamera(pointerNDC,camera);const p=gesture.active&&!orbiting&&!hadPinch&&touchPoints.size<2&&raycaster.ray.intersectPlane(waterPlane,hit)?{x:hit.x,z:hit.z+16}:null;stepWind(state,{pointer:p,released:gesture.released,cancelled:hadPinch||touchPoints.size>1,bloom:state.bloom},dt);quiet=p?0:quiet+dt;if(!was&&state.wind.solved){audio.chime();caption('游光落进花杯，照亮了前方。\n一小簇花尘，开始跟着你走。',8);save();}}
 if(state.wind.solved&&!state.companion.awakened){quiet+=dt;if(quiet>.8){state.companion.awakened=true;state.companion.trust=1;discoverSilently('echo');audio.note(880,1.8,.25);save();}}
 displayBloom=lerp(displayBloom,state.bloom,1-Math.exp(-dt*7));saveClock+=dt;if(saveClock>5){saveClock=0;save();}updateUI();
}
function discoverSilently(id){if(!state.discoveries.includes(id))state.discoveries.push(id);}
let skyDay=new THREE.Color('#8faeb8'),skyNight=new THREE.Color('#21172f'),skyDust=new THREE.Color('#090612'),ambient,keyLight,rimLight,bloomPass;
function frame(now,scheduleNext=true){if(scheduleNext)requestAnimationFrame(frame);const raw=lastTime?(now-lastTime)/1000:0;lastTime=now;if(hidden||modalPaused||shaderPreparing||renderBlocked())return;const dt=Math.min(raw,.05);if(raw>0){frameNumber++;const ms=raw*1000;frameTiming.longestMs=Math.max(frameTiming.longestMs,ms);if(ms>50)frameTiming.over50++;if(ms>100)frameTiming.over100++;if(ms>=1000)frameTiming.over1000++;frameTimes.push(ms);if(frameTimes.length>1800)frameTimes.shift();}time+=dt;renderer.info.reset();
 const audioGround=mode==='play'?terrainAt(state.player.x,state.player.z):null;
 audio.update(dt,{...letterController.musicState(),...voyage?.musicState(),groundMaterial:audioGround?.landmark?'grass':'stone',nearWater:audioGround?.landmark?.startsWith('tide')?.85:audioGround?.landmark?.startsWith('rain')?.5:audioGround?.safe==='pool'?.95:audioGround?.support?.8:.25,moving:mode==='play'&&!focus&&travel.state.movingTime>0,speed:dash.state.speed,dashing:mode==='play'&&dash.state.active,challengeActive:!!resonance?.context.active,combo:resonance?.context.combo||0,flowerPhase:flowerState.phase,gestureActive:gesture.active,zone:mode==='play'?(state.player.z<-39?'finale':state.player.z<-23?'pool':state.player.z<-10?'wind':'garden'):'garden',night:nightBlend,opening:mode==='opening',branch:focus==='branch',ended:!!state.ending,...atlas?.musicState()});
 if(atlas?.active){
  state.playedSeconds=(state.playedSeconds||0)+dt;atlas.update(time,dt,{camera,interactive:mode==='play'});updateCamera(dt);
  for(const group of [world.group,cinematic.group,atmosphere.object,bouquet.group,particles.object,landscape.group,exploration.group,letterController.group,resonance.group,delivery.group,weaver.group,gestureField.group,journeyGuide.group,heroWeather.object,voyage.group])group.visible=false;
  const theme=atlas.theme();scene.background.set(theme.sky);scene.fog.color.set(theme.sky);scene.fog.density=theme.fog;scene.environmentIntensity=theme.id==='observatory'?.16:.45;
  ambient.visible=keyLight.visible=rimLight.visible=false;ambient.intensity=keyLight.intensity=rimLight.intensity=0;chaseLight.visible=false;bloomPass.strength=theme.bloom;depthPass.enabled=false;waterReflection?.update(state.settings.quality,false);cameraOcclusion.update(dt,camera,followLook,false,[]);composer.render();return;
 }
 ambient.visible=keyLight.visible=rimLight.visible=true;
 if(mode==='play'||mode==='opening')storyDirector.update(dt,{pointer:{x:(pointerNDC.x*.5+.5)*innerWidth,y:(-.5*pointerNDC.y+.5)*innerHeight},active:pointerActive,orbiting});
 // Physics stays bounded while a slow GPU does not lengthen the flower's wait.
 updateGesture(dt,Math.min(raw,.25));
 if(mode==='play'&&endingRevealAt&&time>=endingRevealAt){endingRevealAt=0;if(state.ending)showEnding();return;}
 if(mode==='play')updatePlay(dt);voyage?.update(time,dt,{camera,interactive:mode==='play'&&!modalPaused&&!hidden});if(mode==='gallery')syncBloom();else if(mode==='opening'){const shot=storyDirector.opening;if(shot){displayBloom=lerp(displayBloom,shot.bloom,1-Math.exp(-dt*2));scatterTarget=shot.scatter;}}else if(mode==='cover')displayBloom=lerp(displayBloom,1,dt*2);
 dustView=lerp(dustView,mode==='gallery'&&galleryKind==='dust'?1:0,1-Math.exp(-dt*2.1));nightBlend=lerp(nightBlend,night?1:0,1-Math.exp(-dt*2));
 resonanceSignals(resonance.update(time,dt,{player:state.player,progress:state,interactive:mode==='play'&&!focus,dashing:dash.state.active,reducedMotion:state.settings.reducedMotion}));resonance.group.visible=mode==='play'&&!focus;
 letterController.update(time,dt,{camera,heightAt:terrainAt,mode,focus,palette:bouquet.palette,reducedMotion:state.settings.reducedMotion,quality:state.settings.quality,challengeActive:!!resonance.context.active||!!resonance.context.atStart});
 document.body.classList.toggle('letter-led',mode==='play'&&!focus&&(!state.bridge.solved&&completedLetters(state.letters).length<3||!!letterController.nearId)&&!resonance.context.active);
 resonanceUI.update({forecast:!!state.letters.entries.tide.choice,context:resonance.context,snapshot:resonance.snapshot(),player:state.player,mode,focus,dash:dash.state,azimuth:viewRig.state.azimuth||0,deliveryAction:['take','plant','lift','send'].includes(deliveryIntent(state,state.player,delivery.carried)?.kind)});
 const signals=exploration.update(time,dt,{player:state.player,gesture,progress:state,exploration:state.exploration,reducedMotion:state.settings.reducedMotion,interactive:false});
 for(const signal of signals){if(signal.type==='complete'){audio.chime();caption(signal.first===false?'这一阵风，已经写进花庭。':signal.text||'又一座春庭，记起了生长的方向。',signal.first===false?3:8);save();}else if(signal.type==='memory'){caption(signal.text,7);audio.note(392+Math.random()*100,1.6,.16);save();}else if(signal.type==='checkpoint'||signal.type==='echo'){const dx=(signal.x??state.player.x)-state.player.x,dz=(signal.z??state.player.z)-state.player.z,angle=viewRig.state.azimuth||0,pan=clamp((dx*Math.cos(angle)-dz*Math.sin(angle))/4,-.8,.8);audio.note(signal.type==='echo'?440+(signal.step||0)*55:659,signal.type==='echo'?1.6:1,signal.type==='echo'?.04+(signal.proximity||0)*.12:.13,{pan,kind:'cup'});}else if(signal.type==='soft-return'&&signal.text)toast(signal.text);}
 const weaving=weaver.update(time,dt,{player:state.player,gesture,state,interactive:mode==='play'&&focus!=='branch'&&focus!=='flower'&&focus!=='wind'&&focus!=='letter'});
 for(const request of weaving){if(request.type==='construct'){const result=setStructure(state,request.shape);if(result.ok){selectedShape=request.shape;audio.event?.('bridge');audio.chime();caption('你写下的风，托起了脚下的路。',5);save();}else toast(result.reason);}}
 const deliveries=delivery.update(time,dt,{state,player:{...state.player,y:playerHeight+.23},trigger:deliveryTrigger,active:mode==='play'&&!focus});
 deliveryTrigger=false;
 for(const request of deliveries){if(request.type==='carry'){audio.note(523,1.4,.18);caption('一枚种核在你手中。\n走近花座，再决定把它留在哪里。',5);state.deliveryCarried=delivery.persistCarried();save();}else if(request.type==='allocate'){const result=allocateCore(state,request.id,request.purpose);if(result.ok){audio.event?.('plant',{purpose:request.purpose});audio.note(request.purpose?659:392,1.6,.16);state.deliveryCarried=delivery.persistCarried();caption(!request.purpose?'种核重新回到你手中。\n再走近一座你想照料的花庭。':state.cores.every(Boolean)?'两枚种核都已安放。\n沿着花粉走向启程台，看看这封春信。':'这一枚，已经在这里生根。\n入口的种核花杯里，还有一枚等你带走。',7);save();}}else if(request.type==='preview-send')confirmLetter();else if(request.type==='guide')toast(request.text);}
 landscape.update(time,dt,state);landscape.group.visible=mode!=='cover'&&mode!=='gallery'&&focus!=='letter'&&dustView<.995;exploration.group.visible=false;
 gestureField.update(dt,time,{gesture,reducedMotion:state.settings.reducedMotion,color:focus==='flower'||mode==='gallery'?bouquet.palette.high:'#d9b995',opacity:mode==='play'||mode==='gallery'?(focus==='flower'?.42:1):0});
 updateCamera(dt);cameraOcclusion.update(dt,camera,followLook,!voyage?.active&&(mode==='play'||mode==='gallery'),mode==='play'&&state.bridge.solved&&state.player.z<-39?finaleSubjects:[]);journeyGuide.update(time,dt,{state,mode,focus,camera,delivery,phase:flowerState.phase});scatter=lerp(scatter,scatterTarget,1-Math.exp(-dt*3.8));heroWeather.update(time,dt,{focused:mode==='cover'||focus==='flower',night:nightBlend,scatter:Math.max(scatter,dustView),gesture,reducedMotion:state.settings.reducedMotion});bouquet.setBloom(displayBloom);bouquet.setOpacity((1-dustView)*(1-THREE.MathUtils.smoothstep(scatter,0,.65)));bouquet.update(time);
 let localPointer=null;if(pointerActive&&!orbiting&&(focus==='flower'||mode==='gallery')){raycaster.setFromCamera(pointerNDC,camera);const facing=new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(),new THREE.Vector3(0,2,0));if(raycaster.ray.intersectPlane(facing,particlePointer)){bouquet.group.worldToLocal(particlePointer);localPointer=particlePointer;}}
 chaseLight.visible=chasing&&(focus==='flower'||mode==='gallery');if(chaseLight.visible){if(localPointer)chaseLight.position.copy(localPointer).add(new THREE.Vector3(0,0,2));else chaseLight.position.set(1,3,3);}particles.object.visible=scatter>.005||dustView>.001;particles.update(dt,time,{flow:flowerState.flow,bloom:displayBloom,dispersion:scatter,pointer:localPointer,night,reducedMotion:state.settings.reducedMotion,gesture,opacity:Math.max(dustView,THREE.MathUtils.smoothstep(scatter,0,.3))});
 const ink=THREE.MathUtils.smoothstep(scatter,.08,.8)*.94;document.body.classList.toggle('ink-scene',ink>.28||dustView>.3);atmosphere.update(time,camera,Math.max(nightBlend,ink),dustView);scene.background.copy(skyDay).lerp(skyNight,Math.max(nightBlend,ink)).lerp(skyDust,dustView);momentBlend=lerp(momentBlend,focus==='letter'?1:0,1-Math.exp(-dt*3));if(focus==='letter')momentSky.set(momentSkyColors[letterController.activeId]);scene.background.lerp(momentSky,momentBlend*.8);scene.fog.color.copy(scene.background);scene.fog.density=lerp(.009,.42,dustView);scene.environmentIntensity=lerp(.6,.055,Math.max(nightBlend,ink));ambient.intensity=lerp(.42,.055,Math.max(nightBlend,ink));keyLight.intensity=lerp(3,.16,Math.max(nightBlend,ink));rimLight.intensity=lerp(.38,1.25,Math.max(nightBlend,ink));bloomPass.strength=lerp(lerp(.15,.38,Math.max(nightBlend,ink)),.36,dustView);
 const lightZ=mode==='play'?focus==='letter'?letterById(letterController.activeId).z:focus==='flower'?0:focus==='wind'?-16:focus==='finale'?-46:state.player.z:0;const lightX=mode==='play'?(focus==='letter'?letterById(letterController.activeId).x:!focus?state.player.x:0):0;keyLight.position.set(lightX-7,8,lightZ+5);keyLight.target.position.set(lightX,0,lightZ);world.group.visible=dustView<.995&&focus!=='letter';world.water.material.uniforms.uDetail.value=focus==='flower'||mode==='gallery'?1:0;world.water.material.uniforms.uNight.value=Math.max(nightBlend,ink);world.update(time,dt,state);courier.update(time,dt,world.player.position,gesture.active,{dashing:dash.state.active});
 cinematic.group.visible=dustView<.995&&focus!=='letter';cinematic.update(time,dt,{player:mode==='opening'?{x:0,z:6}:state.player,progress:state.ending?4:state.bridge.solved?3:state.wind.solved?2:state.p1.solved?1:0,night:nightBlend,reducedMotion:state.settings.reducedMotion,branches:state.story.branches,opening:storyDirector.opening?.progress||0,lightFound:state.story.lightFound,memorySeen:state.story.memorySeen,...storyDirector.presentation});
 atmosphere.object.visible=focus!=='letter';bouquet.group.visible=focus!=='letter';
 // Respect visibility decided by each subsystem above; this focus can only
 // suppress it. Forcing true would reveal dormant bridges or empty trails.
 delivery.group.visible&&=mode==='play'&&!focus;
 weaver.group.visible&&=focus!=='letter';gestureField.group.visible&&=focus!=='letter';journeyGuide.group.visible&&=focus!=='letter';
 world.companion.visible=state.companion.awakened&&mode==='play'&&focus!=='branch'&&focus!=='letter';world.player.visible=(mode==='play'&&focus!=='branch'&&focus!=='letter')||(mode==='opening'&&(storyDirector.opening?.index??0)>=3);if(captionUntil&&time>captionUntil)$('caption').style.opacity='0';
 if(voyage?.active){for(const group of [world.group,cinematic.group,atmosphere.object,bouquet.group,particles.object,landscape.group,exploration.group,letterController.group,resonance.group,delivery.group,weaver.group,gestureField.group,journeyGuide.group,heroWeather.object])group.visible=false;scene.background.set('#a4bbc4');scene.fog.color.set('#a4bbc4');scene.fog.density=.002;ambient.intensity=keyLight.intensity=rimLight.intensity=0;bloomPass.strength=.2;}
 depthPass.enabled=!voyage?.active&&!depthPass.failed&&focus!=='letter'&&state.settings.quality!=='light'&&dustView<.1&&scatter<.15;waterReflection?.update(state.settings.quality,!voyage?.active&&dustView<.8&&focus!=='letter');composer.render();
}

async function init(){const loadingStartedAt=performance.now();bindRenderFailureUI();try{
 loadingScene.setStage('garden');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); 
 renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});renderLifecycle=bindRenderLifecycle({canvas:renderer.domElement,onPause:()=>{flags.contextLost=true;try{clearInput();}finally{audio.pause(true);}},onSave:save,onFailure:showRenderFailure,onRestored:status=>{flags.contextLost=false;showRenderFailure(status);}});ensureRenderAvailable();renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.info.autoReset=false;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.setClearColor('#e7e2ed');$('scene').append(renderer.domElement);scene=new THREE.Scene();scene.background=skyDay.clone();scene.fog=new THREE.FogExp2('#e7e2ed',.012);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,160);camera.position.set(7.4,4.2,10.5);camera.lookAt(followLook);ambient=new THREE.HemisphereLight('#dcecf2','#536b58',.42);scene.add(ambient);keyLight=new THREE.DirectionalLight('#fff5e2',3.2);keyLight.position.set(4,9,5);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1536,1536);Object.assign(keyLight.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.5,far:40});keyLight.shadow.bias=-.0005;keyLight.shadow.normalBias=.025;keyLight.shadow.radius=3;scene.add(keyLight,keyLight.target);rimLight=new THREE.DirectionalLight('#c1c9ff',1.6);rimLight.position.set(-5,4,-3);scene.add(rimLight);chaseLight=new THREE.PointLight('#ffeafa',9,12,2);chaseLight.visible=false;scene.add(chaseLight);
 composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));depthPass=new GardenDepthPass(scene,camera);composer.addPass(depthPass);bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.15,.45,1.0);composer.addPass(bloomPass);composer.addPass(new OutputPass());orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.dampingFactor=.07;orbit.enablePan=false;orbit.enableZoom=false;orbit.enabled=false;orbit.autoRotateSpeed=.35;orbit.maxPolarAngle=Math.PI*.48;
 world=createWorld();scene.add(world.group);
 savePanel=createSavePanel({service:saveService,openModal,closeModal,getPayload:currentPayload,toast,isTemporary:()=>storageBackend.temporary,onTemporary:enterTemporaryPlay,onLoaded:()=>{state.settings=readPreferences({getItem:storageGet});startGame(true);}});
 playtestFeedback=createPlaytestFeedback({openModal,closeModal,toast,getSummary:()=>({version:'0.9.1',playedSeconds:state.playedSeconds||0,letters:completedLetters(state.letters).map(l=>l.id),chapter:state.ending?4:state.bridge.solved?3:state.wind.solved?2:state.p1.solved?1:0,ending:state.ending,quality:state.settings.quality,viewport:{width:innerWidth,height:innerHeight}})});
 letterController=createLetterController({getState:()=>state,onFocus:()=>{clearInput();focus='letter';$('context').hidden=true;document.body.classList.add('focus');},onExit:()=>{focus=null;clearInput();document.body.classList.remove('focus','letter-focus');},onSave:save,onReply:onGardenReply,onCommit:commitMoment,onContinue:(from,next)=>{const nextLines={rain:'沿指路的叶片回到听雨春庭，禾的旧信还在。',wind:'回到初庭，沿水下石径穿过风廊，去岸边的逆风春庭。',tide:'沿风廊尽头的石径走向旧台，再循左岸小径去回声春庭。'};caption(next?nextLines[next]:!state.bridge.solved?'三封回信已经收好。沿指引回到借桥的旧石台，按住 Space 拖动，顺着光迹织出第一段花桥。':!state.ending?'回信已收好。继续走向穹顶，为两枚种核选择愿意照料的未来。':'回信已收好。你的春天仍在，可以慢慢走。',10);},onSound:(kind,payload={})=>{if(kind==='compose-note')audio.event(kind,payload);else if(kind.startsWith('light')){if(kind==='light-complete')audio.event('letter-connected',{id:'rain'});else audio.event('compose-note',{instrument:'harp',midi:kind==='light-place'?78:kind==='light-undo'?62:69,duration:.6,gain:kind==='light-place'?.14:.065,pan:payload.pan||0});}else if(kind.startsWith('wind'))audio.event(kind==='wind-finish'?'complete':kind==='wind-return'?'bump':kind==='wind-gate'?'collect':'dash',payload);else audio.event(kind==='source'?'burst':'letter-'+kind,payload);},onBook:showLetters});scene.add(letterController.group);
 voyage=createVoyageController({getState:()=>state,onMap:showMap,onStart:()=>{clearInput();focus='voyage';scatterTarget=0;scatter=0;flowerCycle.reset();flowerState=flowerCycle.state;setNight(false);$('context').hidden=true;document.body.classList.add('focus');$('caption').textContent='';if(state.voyage.stage==='complete'&&!state.ending)finishVoyage();},onExit:()=>{focus=null;document.body.classList.remove('focus');clearInput();viewRig.reset();travel.reset();save();caption('花庭仍在。你写下的信与走过的海岸，都已收好。',6);},onSave:save,onSound:(kind,payload)=>{audio.unlock();audio.event(kind,payload);},onComplete:finishVoyage,onPhoto:photo,onSettings:showSettings,onBook:showLetters});scene.add(voyage.group);
 atlas=createAtlasController({getState:()=>state,onStart:()=>{clearInput();focus='atlas';scatterTarget=scatter=dustView=0;flowerCycle.reset();setNight(false);document.body.classList.add('focus');$('context').hidden=true;const f=atlas.camera(camera.aspect);camera.position.fromArray(f.position);followLook.fromArray(f.target);camera.lookAt(followLook);},onExit:()=>{focus=null;document.body.classList.remove('focus');clearInput();viewRig.reset();travel.reset();save();caption('远方已经记在地图上。随时可以再去。',5);},onSave:save,onSound:(kind,payload)=>{audio.unlock();audio.event(kind,payload);},onContinue:continueToCoast,onMap:showMap,onPhoto:photo,onSettings:showSettings,onRead:note=>openModal('<small>驿路上的旧字迹</small><h2>'+note.title+'</h2><p>'+note.text+'</p>')});scene.add(atlas.group);
 resonance=createResonance({saved:readResonance()});scene.add(resonance.group);resonance.update(0,0,{player:state.player,progress:state,interactive:false});resonanceUI=mountResonanceUI({onAttempt:attemptResonance,onCancel:()=>{resonance.cancel();caption('这一程先收好。花巢一直在这里。',3);},onDash:v=>{touchDash=v;audio.unlock();}});cameraOcclusion=createCameraOcclusion(world.cameraOccluders);world.player.children.forEach(child=>child.visible=false);courier=createCourier();world.player.add(courier.group);landscape=createLandscape();scene.add(landscape.group);exploration=createExploration();scene.add(exploration.group);gestureField=createGestureField();scene.add(gestureField.group);delivery=createDelivery();scene.add(delivery.group);journeyGuide=createJourneyGuide($('world-guide'));scene.add(journeyGuide.group);weaver=createBridgeWeaver();scene.add(weaver.group);atmosphere=createAtmosphere();scene.add(atmosphere.object);heroWeather=createHeroWeather();scene.add(heroWeather.object);cinematic=createCinematicLayer();scene.add(cinematic.group);bouquet=createBouquet({seed:17,scale:1});flowerForm=bouquet.setForm(state.settings.flowerForm);scene.add(bouquet.group);world.group.traverse(o=>{if(o.isMesh&&o!==world.water&&!o.material?.transparent)o.castShadow=true;});bouquet.group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});bouquet.setBloom(.9);material=state.settings.flowerSeries;bouquet.setMaterial(material,'blush');syncSurface();const initialFlowerSamples=bouquet.sampleSurface(65536);flowerBounds=surfaceBounds(initialFlowerSamples);particles=createSurfaceParticles(renderer,initialFlowerSamples,{quality:'standard'});scene.add(particles.object);
 loadingScene.setStage('garden','正在铺开晨光与浅水');try{const hdr=await awaitRenderAsset(new HDRLoader().loadAsync(assetUrl('assets/environment/studio_small_09_1k.hdr')));const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromEquirectangular(hdr);scene.environment=environment.texture;hdr.dispose();pmrem.dispose();flags.environment=true;bouquet.group.traverse(o=>{if(o.material){o.material.envMap=environment.texture;o.material.needsUpdate=true;}});}catch(e){if(renderBlocked())throw e;errors.push('Environment: '+e.message);toast('棚光未载入，使用本地柔光继续。');}
 try{const hdr=await awaitRenderAsset(new HDRLoader().loadAsync(assetUrl('assets/environment/spruit_sunrise_1k.hdr')));const pmrem=new THREE.PMREMGenerator(renderer);outdoorEnvironment=pmrem.fromEquirectangular(hdr);scene.environment=outdoorEnvironment.texture;scene.environmentRotation.y=.65;hdr.dispose();pmrem.dispose();flags.outdoorEnvironment=true;}catch(e){if(renderBlocked())throw e;flags.outdoorEnvironment=false;errors.push('Morning environment: '+e.message);}
 const textureLoader=new THREE.TextureLoader();try{const [normal,roughness]=await awaitRenderAsset(Promise.all([textureLoader.loadAsync(assetUrl('assets/surfaces/white-plaster-02-normal.jpg')),textureLoader.loadAsync(assetUrl('assets/surfaces/white-plaster-02-roughness.jpg'))]));for(const t of [normal,roughness]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}world.setStoneTextures(normal,roughness);flags.stoneTextures=true;}catch(e){if(renderBlocked())throw e;flags.stoneTextures=false;toast('石材微纹理未载入，柔光石台仍可继续体验。');}
 try{const [normal,roughness]=await awaitRenderAsset(Promise.all([textureLoader.loadAsync(assetUrl('assets/surfaces/mossy-rock-normal.jpg')),textureLoader.loadAsync(assetUrl('assets/surfaces/mossy-rock-roughness.jpg'))]));for(const tex of [normal,roughness]){tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}landscape.setSurfaceTextures?.(normal,roughness);flags.landscapeTextures=true;}catch(e){if(renderBlocked())throw e;flags.landscapeTextures=false;}
 try{gardenSurfaces=await awaitRenderAsset(loadGardenSurfaces({world,landscape,renderer}));flags.gardenSurfaces=true;}catch(e){if(renderBlocked())throw e;flags.gardenSurfaces=false;errors.push(e.message);}
 storyDirector=createStoryDirector({getState:()=>state,audio,caption,toast,save,onReply:()=>world.respond(),getLightTargets:()=>cinematic.branchTargets.light,project:(x,y,z)=>{const v=new THREE.Vector3(x,y,z).project(camera);return {x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight};},onOpeningStart:()=>{clearInput();focus=null;orbit.enabled=false;mode='opening';document.body.classList.add('opening');$('context').hidden=true;$('nearby-branch').hidden=true;$('caption').style.opacity='0';world.player.position.set(0,.35,6);},onOpeningEnd:()=>{clearInput();mode='play';scatterTarget=0;document.body.classList.remove('opening');caption(state.p1.solved?'最初的春光，仍留在拾光册里。继续你的旅途吧。':'WASD 行走，镜头会跟着你。\n左岸的听雨春庭，留着第一封未回复的信。',9);updateUI();},onBranchStart:id=>{captionUntil=0;$('caption').textContent='';if(id==='rhythm')discoverSilently('table');if(id==='memory')discoverSilently('protocol');save();openFocus('branch');document.body.classList.add('branch-focus');$('nearby-branch').hidden=true;},onBranchEnd:()=>{}});
 fullscreen=bindFullscreen({buttons:all('[data-fullscreen]'),onChange:active=>{if(fullscreenWasActive&&!active)fullscreenExitedAt=performance.now();fullscreenWasActive=active;clearInput();hidden=document.hidden;lastTime=performance.now();resize();audio.pause(hidden||modalPaused||renderBlocked());},onUnavailable:toast});
 setupInput();syncSound();applyQuality();showCover();loadingScene.setStage('light','正在准备花瓣与水面的光泽');
 const warmupStartedAt=performance.now();
 waterReflection=createWaterReflection({renderer,scene,camera,water:world.water,exclude:[particles.object,heroWeather.object]});
 particles.update(.016,0,{bloom:1,dispersion:0,pointer:null,night:false,reducedMotion:false,opacity:0});
 // The first screen prepares only its selected material. Other series are
 // compiled on first request behind a short, accessible transition.
 await warmCurrentFlower();
 switchFlowerForm(state.settings.flowerForm);switchFlowerSeries(state.settings.flowerSeries);bouquet.setOpacity(1);
 particles.update(0,0,{bloom:displayBloom,dispersion:0,flow:0,opacity:0});
 syncSurface();
 // Render the complete initial cover pipeline while the loading veil is still visible.
 // dt=0 and scheduling disabled: this does not advance play or create a second RAF loop.
 lastTime=0;frame(0,false);renderer.info.reset();
 loadingTiming.warmupMs=performance.now()-warmupStartedAt;loadingTiming.totalMs=performance.now()-loadingStartedAt;
 ensureRenderAvailable();loadingScene.setStage('ready');loadingScene.complete().then(()=>{loadingTiming.overlayHiddenMs=performance.now()-loadingStartedAt;});
 // bindFullscreen performs an initial sync before asynchronous shader warmup.
 // The first animation frame establishes its own baseline; loading is reported separately.
 lastTime=0;requestAnimationFrame(()=>requestAnimationFrame(frame));
 // Read-only diagnostics: ordinary-input smoke tests never set gameplay progress.
 window.__SPRING__={snapshot(){return {render:renderDiagnostics(),state:JSON.parse(serialize(state)),mode,focus,galleryKind,displayBloom,scatter,material,flowerForm,flowerCycle:{...flowerState},travel:travel.state,night,dustView,opening:storyDirector.opening?.index??null,branch:storyDirector.branch,camera:camera.position.toArray(),fov:camera.fov,cameraLook:followLook.toArray(),view:viewRig.state,gesture:{active:gesture.active,position:gesture.position.toArray(),velocity:gesture.velocity.toArray(),strength:gesture.strength,motionEnergy:strokeMotion.value},penMode,weaver:weaver.context,depthPass:depthPass.enabled,delivery:delivery.context,carried:delivery.carried,exploration:exploration.context,outdoorEnvironment:flags.outdoorEnvironment,landscapeTextures:flags.landscapeTextures,stoneTextures:flags.stoneTextures,reflection:waterReflection?.enabled,presentation:{memoryBloom:storyDirector.presentation.memoryBloom,actor:world.player.position.toArray(),companionVisible:world.companion.visible},renderer:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,points:renderer.info.render.points,renderer:renderer.getContext().getParameter(renderer.getContext().RENDERER)},memory:{...renderer.info.memory,programs:renderer.info.programs?.length||0},audio:audio.getStats?.(),gardenSurfaces:gardenSurfaces?.snapshot(),resonance:resonance.snapshot(),letters:letterController.snapshot(),voyage:voyage.snapshot(),atlas:atlas.snapshot(),saveStatus:{temporary:storageBackend.temporary,status:saveService.read().status,lastResult:lastSaveResult?{ok:lastSaveResult.ok,code:lastSaveResult.code}:null},dash:{...dash.state},particles:particles.getStats(),environment:flags.environment,errors:[...errors],frameNumber,frameTiming:{...frameTiming},loadingTiming:{...loadingTiming},shaderPreparing,warmedSeries:[...warmedSeries],frameTimes:[...frameTimes]};},project(x,y,z){const v=new THREE.Vector3(x,y,z).project(camera);return {x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight};}};
 }catch(e){if(!renderBlocked()){console.error(e);errors.push(e.stack||String(e));showRenderFailure({message:e.message});}}}
init();


