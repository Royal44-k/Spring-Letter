const fs=require('node:fs');
const file='D:/AI Game/spring-letter/src/main.js';let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Missing main marker: '+a.slice(0,110));s=s.replace(a,b);}
function fn(name,body){const start=s.indexOf('function '+name+'('),end=s.indexOf('\nfunction ',start+1);if(start<0||end<0)throw Error('Missing function '+name);s=s.slice(0,start)+body+s.slice(end);}
replace("import {createViewRig,movementVector} from './navigation.js';","import {createViewRig,createTravelController} from './navigation.js';\nimport {createFlowerCycle} from './flower-cycle.js';\nimport {FLOWER_FORMS,FLOWER_SERIES} from './flower-presets.js';\nimport {updateFlowerLesson,flowerLessonHint} from './flower-lesson.js';\nimport {createJourneyGuide} from './journey-guide.js';");
replace("import {createDelivery} from './delivery.js';","import {createDelivery,deliveryIntent,LETTER_BEDS} from './delivery.js';");
replace('const viewRig=createViewRig();','const viewRig=createViewRig(),travel=createTravelController(),flowerCycle=createFlowerCycle();\nlet flowerForm=\'lily\',flowerBurst=false,deliveryTrigger=false,journeyGuide,flowerState=flowerCycle.state,autoFlowerEntered=false;');
replace('function clearInput(){','function clearInput(){deliveryTrigger=false;flowerBurst=false;');
fn('fieldAction',`function fieldAction(){
 const bridge=weaver?.context,bridgeBlocked=state.wind.solved&&state.bridge.support&&gesture.active;
 const c=delivery.context||((bridge?.available||bridgeBlocked)?{title:bridgeBlocked?'脚下的路仍在托住你':bridge.status==='ready'?'松手，让花尘成为路':'用一阵风，借一段花桥',detail:bridge.hint,progress:bridge.progress}:null);
 const visible=mode==='play'&&!focus&&!!c;
 $('field-action').hidden=!visible;
 const action=delivery.context?.actionLabel;
 $('focus-button').innerHTML='<kbd>E</kbd> '+(action|| (focus?'回到花庭':'靠近 · 细看'));
 if(!visible)return;
 $('field-title').textContent=c.title;$('field-hint').textContent=c.detail;
 $('field-progress').parentElement.hidden=!!delivery.context;
 $('field-progress').style.width=Math.round((c.progress||0)*100)+'%';
}
function requestInteraction(){
 if(modalPaused||mode!=='play')return;
 const intent=!focus?deliveryIntent(state,state.player,delivery.carried):null;
 if(intent){deliveryTrigger=true;return;}
 interact();
}
function confirmLetter(){
 if(state.cores.some(c=>!c)||state.ending)return;
 const chosen=LETTER_BEDS.filter(b=>state.cores.includes(b.purpose)),left=LETTER_BEDS.find(b=>!state.cores.includes(b.purpose));
 openModal('<small>寄出之前</small><h2>这封春信，会去往……</h2><div class="letter-preview">'+chosen.map(b=>'<article><i>✦</i><div><h3>'+b.title+'</h3><p>'+b.detail+'。</p></div></article>').join('')+'</div><p class="muted">'+left.title+'暂不持续。它留下的记忆仍在，同行者也仍会陪着你。</p><div class="row"><button id="send-confirm" class="primary">寄出这封春信 ↗</button><button id="send-cancel">再想一想</button></div>');
 $('send-cancel').onclick=closeModal;$('send-confirm').onclick=()=>{closeModal();depart();};
}
function switchFlowerForm(id){
 flowerForm=bouquet.setForm(id);state.settings.flowerForm=flowerForm;
 particles.setSource(bouquet.sampleSurface(65536));
 all('[data-form]').forEach(b=>{b.classList.toggle('active',b.dataset.form===flowerForm);b.setAttribute('aria-pressed',String(b.dataset.form===flowerForm));});save();
}
function switchFlowerSeries(id){
 material=id;variant='blush';state.settings.flowerSeries=id;bouquet.setMaterial(id,variant);
 particles.setColors(bouquet.sampleSurface(65536).colors);syncSurface();
 all('[data-material]').forEach(b=>{b.classList.toggle('active',b.dataset.material===id);b.setAttribute('aria-pressed',String(b.dataset.material===id));});save();
}
function releaseFlower(){
 if(focus!=='flower'&&mode!=='gallery')return;
 if(flowerState.phase!=='solid')return;
 flowerBurst=true;audio.note(392,1.4,.16);world.ripple(0,0,.8);
}`);
replace('<label class="option">轻缓动态', '<label class="option">镜头随行<input type="checkbox" id="camera-follow" ${state.settings.autoCamera!==false?\'checked\':\'\'}></label><label class="option">轻缓动态');
replace("$('quality-choice').value=state.settings.quality;","$('camera-follow').onchange=e=>{state.settings.autoCamera=e.target.checked;save();};$('quality-choice').value=state.settings.quality;");
replace('拖动环看四周，滚轮拉近或远离。WASD 沿镜头方向行走，Shift 加快脚步。按住 Space 拖动，或开启风笔 R，沿场景写下一阵风；松手后花尘自然回流。近看花时，慢慢上下运笔可以开合花瓣，快速掠过会扬起花尘。Shift＋滚轮及滑杆也可控制花开。','WASD 行走，镜头会跟着你的脚步转向。拖动可以临时环看，C 回到身后，滚轮拉近或远离。近看花时，轻触花心或按 F 让它化作花尘，再按住拖动写风。花尘会漂游片刻，再缓慢归形。旅途中按住 Space 拖动，或开启风笔 R。种核靠近后点按 E 拾起、安放和取回。');
replace('function resetPresentation(){','function resetPresentation(){flowerCycle.reset();flowerState=flowerCycle.state;travel.reset();');
replace("state.started=true;viewRig.reset();", "state.started=true;delivery.restoreCarried(state.deliveryCarried,state);viewRig.reset();autoFlowerEntered=state.p1.solved;switchFlowerForm(state.settings.flowerForm);switchFlowerSeries(state.settings.flowerSeries);");
replace("'春信还在。未安放的种核，会在终庭入口等你。'","state.deliveryCarried!==null?'春信还在。那枚种核，仍在你的手中。':'春信还在。未安放的种核，在终庭入口等你。'");
replace("flower:mode==='gallery'?'观花 · 入尘':'第一幕 · 借一束半开的光'", "flower:mode==='gallery'?'一朵花的许多种生命':'第一幕 · 让春风经过'");
replace("$('flower-practice').textContent=matchMedia('(pointer:coarse)').matches?'开启下方风笔，慢慢上下带动花瓣。疾扫扬起花尘；松手，让它自己回流。':'按住 Space，慢慢上下运笔，花瓣随你开合。疾扫扬起花尘；松手，让它自己回流。';", "$('flower-practice').textContent=matchMedia('(pointer:coarse)').matches?'轻触花心，打散花瓣。按住拖动，给花尘一阵风；双指可以缩放。':'轻触花心或按 F，打散花瓣。按住拖动写风，右键环看。';");
replace("if(Math.hypot(p.x,p.z)<8)","if(Math.hypot(p.x,p.z)<8)");
replace("caption('三道旧水痕，等一束穿过花瓣的光。',5)","caption('花还记得风。轻轻碰一碰它。',4)");
replace("caption('光会顺着风走，也会避开你的手。',5)","caption('按住游光，把它引向远处的花杯。松手，它会慢慢停下。',5)");
fn('syncBloom',`function syncBloom(){
 const b=mode==='gallery'?displayBloom:state.bloom;$('bloom-value').textContent=Math.round(b*100)+'%';
 $('bloom-hint').textContent=mode==='gallery'?(flowerState.phase==='solid'?'轻触花心，让这一朵花换一种生命。':flowerState.phase==='returning'?'光正慢慢回到花瓣里。':'沿花尘拖动，试试轻推、盘旋，或留下一道风。'):flowerLessonHint(state,flowerState.phase);
 $('flower-cycle-label').textContent={solid:'花的形体',breaking:'破开',drifting:'逐风而行',returning:'缓缓归形'}[flowerState.phase];
 $('flower-burst').disabled=flowerState.phase!=='solid';
}`);
// Replace old two-core menu handlers with the one physical interaction path.
const hStart=s.indexOf("$('focus-button').onclick="),hEnd=s.indexOf("$('photo').onclick=",hStart);
if(hStart<0||hEnd<0)throw Error('input handlers absent');
s=s.slice(0,hStart)+"$('focus-button').onclick=requestInteraction;$('recenter-camera').onclick=()=>travel.recenter();$('flower-burst').onclick=releaseFlower;"+s.slice(hEnd);
replace(' let fieldPressWasHold=false;','');
const seriesStart=s.indexOf("all('[data-material]').forEach(b=>b.onclick="),seriesEnd=s.indexOf("$('wind-reset').onclick=",seriesStart);
if(seriesStart<0||seriesEnd<0)throw Error('series handlers absent');
s=s.slice(0,seriesStart)+"all('[data-material]').forEach(b=>b.onclick=()=>switchFlowerSeries(b.dataset.material));all('[data-form]').forEach(b=>b.onclick=()=>switchFlowerForm(b.dataset.form));"+s.slice(seriesEnd);
const coreStart=s.indexOf("all('[data-core]').forEach(b=>b.onclick="),coreEnd=s.indexOf("$('review-letter').onclick=showEnding;",coreStart);
if(coreStart<0||coreEnd<0)throw Error('core handlers absent');
s=s.slice(0,coreStart)+"$('depart').onclick=()=>{exitFocus();caption('带着种核走近花座，点按 E 安放。',5);};"+s.slice(coreEnd);
replace("keys.add(e.code);if(e.code==='KeyE'&&!(mode==='play'&&!focus&&!state.ending&&state.bridge.solved&&state.player.z<-40))interact();", "keys.add(e.code);if(e.code==='KeyE')requestInteraction();if(e.code==='KeyF')releaseFlower();if(e.code==='KeyC')travel.recenter();");
replace("orbiting=e.button===2||!(penMode||keys.has('Space')||keys.has('KeyQ'));", "orbiting=e.button===2||!(penMode||keys.has('Space')||keys.has('KeyQ')||focus==='flower'||focus==='wind'||mode==='gallery');");
replace('if(pointerDown&&orbiting){viewRig.drag(dx,dy);', 'if(pointerDown&&orbiting){travel.orbit();viewRig.drag(dx,dy);');
replace("if(pointerDown&&(penMode||keys.has('Space'))&&(focus==='flower'||mode==='gallery')&&Math.abs(dy)<24)", "if(pointerDown&&(penMode||keys.has('Space')||focus==='flower'||mode==='gallery')&&(focus==='flower'||mode==='gallery')&&flowerState.phase==='solid'&&Math.abs(dy)<24)");
replace("touchPoints.delete(e.pointerId);if(e.target===canvas&&!pointerMoved", "touchPoints.delete(e.pointerId);if(e.target===canvas&&!pointerMoved&&!hadPinch&&(focus==='flower'||mode==='gallery')){raycaster.setFromCamera(pointerNDC,camera);if(raycaster.intersectObjects(bouquet.group.children,true).length)releaseFlower();}if(e.target===canvas&&!pointerMoved");
replace("const direction=movementVector(right,forward,viewRig.state.azimuth??.495)", "const direction=travel.movement(right,forward,viewRig.state.azimuth??0)");
replace("const dx=direction.x*dt*speed,dz=direction.z*dt*speed,p=state.player;", "const dx=direction.x*dt*speed,dz=direction.z*dt*speed,p=state.player,oldX=p.x,oldZ=p.z;");
replace("const ground=terrainAt(p.x,p.z);if(ground?.platform", "travel.observe(p.x-oldX,p.z-oldZ,dt);\n const ground=terrainAt(p.x,p.z);if(ground?.platform");
replace("else{lookGoal.set(state.player.x,playerHeight+1.1,state.player.z);key='roam';offset={x:3.2,y:2.8,z:6.4};}", "else{const ahead=travel.state.movingTime>.2?.65:0,h=travel.state.heading;lookGoal.set(state.player.x-Math.sin(h)*ahead,playerHeight+1.12,state.player.z-Math.cos(h)*ahead);key='roam';offset={x:0,y:2.65,z:6.7};}");
replace("if(key){viewRig.select(key,offset);if(autoRotate)", "if(key){viewRig.select(key,offset);if(key==='roam')viewRig.orient(travel.turn(dt,{azimuth:viewRig.state.azimuth,enabled:state.settings.autoCamera!==false,blocked:orbiting||gesture.active,reducedMotion:state.settings.reducedMotion}));if(autoRotate)");
replace("pointerDown&&(penMode||keys.has('Space'))", "pointerDown&&(penMode||keys.has('Space')||focus==='flower'||focus==='wind'||mode==='gallery')");
replace("if(mode!=='opening')scatterTarget=(focus==='flower'||mode==='gallery')&&gesture.active?keys.has('KeyQ')?1:THREE.MathUtils.smoothstep(strokeMotion.value,1.1,5.5):0;", "if(mode!=='opening'){flowerState=flowerCycle.update(dt,{active:(focus==='flower'||mode==='gallery')&&gesture.active,energy:strokeMotion.value,burst:flowerBurst||keys.has('KeyQ'),reducedMotion:state.settings.reducedMotion});flowerBurst=false;scatterTarget=flowerState.dispersion;}");
const playStart=s.indexOf("if(focus==='flower'){const solved=state.p1.solved;"),playEnd=s.indexOf("\n if(focus==='wind'",playStart);
if(playStart<0||playEnd<0)throw Error('flower progression missing');
s=s.slice(0,playStart)+"if(focus==='flower'){if(updateFlowerLesson(state,{phase:flowerState.phase,active:gesture.active,energy:strokeMotion.value},dt)){audio.chime();caption('春风走过花尘。水下的路，也醒了。',7);discoverSilently('leaf');save();}syncBloom();}\n if(!focus&&!state.p1.solved&&!autoFlowerEntered&&Math.hypot(state.player.x,state.player.z)<3.9){autoFlowerEntered=true;openFocus('flower');caption('轻触花心。花会换一种方式，留在你身边。',6);}"+s.slice(playEnd);
replace("const p=pointerActive&&!orbiting&&!hadPinch&&touchPoints.size<2&&raycaster.ray.intersectPlane(waterPlane,hit)", "const p=gesture.active&&!orbiting&&!hadPinch&&touchPoints.size<2&&raycaster.ray.intersectPlane(waterPlane,hit)");
replace("caption('你松开手，游光才停了下来。\\n花杯亮起；另一簇花尘正慢慢靠近。',8)","caption('游光落进花杯，照亮了前方。\\n一小簇花尘，开始跟着你走。',8)");
replace("holding:keys.has('KeyE'),active:mode==='play'&&!focus", "trigger:deliveryTrigger,active:mode==='play'&&!focus");
replace("for(const request of deliveries){if(request.type==='carry')", "deliveryTrigger=false;\n for(const request of deliveries){if(request.type==='carry')");
replace("caption('花尘能够归形，种核却不能重造。\\n它只能在一处扎根；你还可以带着它，多走一会儿。',8);", "caption('一枚种核在你手中。\\n走近花座，再决定把它留在哪里。',5);state.deliveryCarried=delivery.persistCarried();save();");
replace("if(result.ok){audio.note(request.purpose?659:392,1.6,.16);save();}}else if(request.type==='send')depart();", "if(result.ok){audio.note(request.purpose?659:392,1.6,.16);state.deliveryCarried=delivery.persistCarried();save();}}else if(request.type==='preview-send')confirmLetter();else if(request.type==='guide')toast(request.text);");
replace("particles.update(dt,time,{bloom:displayBloom,dispersion:scatter,", "particles.update(dt,time,{flow:flowerState.flow,bloom:displayBloom,dispersion:scatter,");
replace("cameraOcclusion.update(dt,camera,followLook,mode==='play'||mode==='gallery');", "cameraOcclusion.update(dt,camera,followLook,mode==='play'||mode==='gallery');journeyGuide.update(time,dt,{state,mode,focus,camera,delivery,phase:flowerState.phase});");
replace("delivery=createDelivery();scene.add(delivery.group);", "delivery=createDelivery();scene.add(delivery.group);journeyGuide=createJourneyGuide($('world-guide'));scene.add(journeyGuide.group);");
replace("'拖动环看 · WASD 行走\\n靠近花，按 E 细看。'", "'WASD 行走，镜头会跟着你。\\n向眼前的花走近一些。'");
replace("'半开的故乡','风中的回信'", "'让春风经过','风中的回信'");
replace("'靠近眼前的花，按 E 细看。借一束半开的光，唤醒水下的路。'", "'走近眼前的花。让它化作光，再给花尘一阵风。'");
replace("'沿前方石径进入风廊。轻推游光，再给它一点自己停下的时间。'", "'沿石径走进风廊。按住引导游光，让它落进花杯。'");
replace("mode,focus,galleryKind,displayBloom,scatter,material,", "mode,focus,galleryKind,displayBloom,scatter,material,flowerForm,flowerCycle:{...flowerState},travel:travel.state,");
fs.writeFileSync(file,s);console.log('Integrated v6 main responsibilities.');
