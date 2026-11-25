const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'src/main.js');let s=fs.readFileSync(file,'utf8');
function edit(old,next){if(!s.includes(old))throw new Error('Missing integration anchor: '+old.slice(0,100));s=s.replace(old,next);}
edit("import {drawPostcard}","import {createVoyageController} from './voyage-controller.js';\nimport {VOYAGE_CHAPTERS} from './voyage-content.js';\nimport {drawPostcard}");
edit('let loadingScene,letterController,savePanel','let loadingScene,letterController,voyage,savePanel');
edit('function clearInput(){stopSavedScore();','function clearInput(){voyage?.cancel();stopSavedScore();');
edit("if(modalPaused||mode!=='play')return;\n if(focus==='letter')", "if(modalPaused||mode!=='play')return;\n if(voyage?.active){voyage.primary();return;}\n if(focus==='letter')");
edit('寄出这封春信 ↗','收好安排，去海岸写自己的信 →');
edit('这封春信，会去往……','出发以后，岸边仍有春天');
const departStart=s.indexOf('function depart(){'),departEnd=s.indexOf('function rewindLetter()',departStart);
if(departStart<0||departEnd<0)throw Error('depart missing');
s=s.slice(0,departStart)+`function depart(){
 if(!state.bridge.solved||state.cores.some(c=>!c))return;
 const before=serialize(state),saved=saveService.commit({journey:before,beforeLetter:before,preferences:JSON.stringify(state.settings),resonance:resonance.persist()});
 lastSaveResult=saved;if(!saved.ok){savePanel.notifyFailure(saved);savePanel.show();return;}
 exitFocus();audio.chime();voyage.start();
}
`+s.slice(departEnd);
const endStart=s.indexOf('function showEnding(){'),endEnd=s.indexOf('function updateUI(){',endStart);
if(endStart<0||endEnd<0)throw Error('ending missing');
s=s.slice(0,endStart)+`function showEnding(){endingRevealAt=0;if(state.bridge.solved&&state.cores.every(Boolean)){closeModal();exitFocus();voyage.start();}}
`+s.slice(endEnd);
const uiStart=s.indexOf('function updateUI(){'),uiEnd=s.indexOf('function photo(){',uiStart);
if(uiStart<0||uiEnd<0)throw Error('UI missing');
s=s.slice(0,uiStart)+`function updateUI(){
 if(mode!=='play')return;
 const v=state.voyage,act=v?.stage==='complete'||v?.stage==='dawn'||v?.stage==='sailing'?8:v?.stage==='rigging'||v?.stage==='island'?7:v?.stage==='tide'?6:v?.stage==='writing'?5:!state.moments.entries.rain.completed?0:!state.moments.entries.wind.completed?1:!state.moments.entries.tide.completed?2:!state.bridge.solved?3:4;
 if(act!==lastChapter){lastChapter=act;chapterNoticeUntil=time+9;}document.body.classList.toggle('chapter-notice',time<chapterNoticeUntil);
 $('act-number').textContent=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ'][act];$('act-title').textContent=VOYAGE_CHAPTERS[act][0];$('act-eyebrow').textContent='LETTERS ON THE WAY · '+(act+1)+' / 9';
 $('objective').textContent=['沿左岸花径去听雨春庭，给禾的花窗重新透进光。','带着第一封回信，穿过风廊，去右岸试飞一只纸翼。','沿风廊尽头走向旧台，去左岸为未完的曲子写下回应。','回到借桥的石台，沿光迹写路，跨过断开的花庭。','亲手安放两枚种核，再去海岸写自己的信。','在海岸留下自己的收信人、正文与花印。','观察涨退潮，去旧邮亭带上岑的信，再登小岛。','走到岛岸找到船，解开两根缆绳，亲手升帆。','把两封信带向晨光，让立体的花沿航迹开放。'][act];
 $('progress-fill').style.width=(v?.stage==='complete'?100:act/9*100)+'%';updateExplorationUI();fieldAction();if(focus==='pool')syncPool();if(focus==='wind')$('wind-reset').hidden=state.wind.solved;const nearby=focus?null:storyDirector?.nearby();$('nearby-branch').hidden=!nearby;if(nearby)$('nearby-branch').querySelector('span').textContent=(state.story.branches[nearby]?'重访 · ':'')+BRANCHES[nearby].title;
}
`+s.slice(uiEnd);
edit('function resetPresentation(){letterController?.reset();','function resetPresentation(){voyage?.stop();letterController?.reset();');
edit("if(!state.story.introSeen)storyDirector.startOpening();}","if(!state.story.introSeen)storyDirector.startOpening();else if(state.bridge.solved&&(state.ending||state.voyage.stage!=='idle'))voyage.start();}");
edit("function exitFocus(){if(focus==='letter')", "function exitFocus(){if(focus==='voyage'){voyage.stop();focus=null;document.body.classList.remove('focus');return;}if(focus==='letter')");
edit("if(e.code==='Space')spaceHeld=true;", "if(voyage?.active&&voyage.handleKey(e)){if(e.code!=='Tab')e.preventDefault();return;}\n  if(e.code==='Space')spaceHeld=true;");
edit("if(renderBlocked())return;letterController?.handleKey(e);keys.delete(e.code);", "if(renderBlocked())return;if(voyage?.active){voyage.handleKey(e);return;}letterController?.handleKey(e);keys.delete(e.code);");
edit("return;e.preventDefault();if(focus==='letter'){setPointer(e);", "return;e.preventDefault();if(voyage?.active){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();voyage.pointer('down',raycaster,e);return;}if(focus==='letter'){setPointer(e);");
edit("canvas.addEventListener('pointermove',e=>{\n  if(focus==='letter')", "canvas.addEventListener('pointermove',e=>{\n  if(voyage?.active){setPointer(e);voyage.pointer('move',raycaster,e);return;}\n  if(focus==='letter')");
edit("window.addEventListener('pointerup',e=>{if(focus==='letter')", "window.addEventListener('pointerup',e=>{if(voyage?.active){setPointer(e);voyage.pointer('up',raycaster,e);return;}if(focus==='letter')");
edit("canvas.addEventListener('wheel',e=>{if(mode==='cover'||mode==='opening')return;", "canvas.addEventListener('wheel',e=>{if(voyage?.active)return;if(mode==='cover'||mode==='opening')return;");
edit("if(focus==='flower'||focus==='wind'||focus==='branch'||focus==='letter'){dash.update", "if(focus==='voyage'||focus==='flower'||focus==='wind'||focus==='branch'||focus==='letter'){dash.update");
edit('function updateCamera(dt){\n const desiredFov=',`function updateCamera(dt){
 if(voyage?.active){const framed=voyage.camera(camera.aspect);camera.far=1800;camera.fov=THREE.MathUtils.damp(camera.fov,48,4,dt);camera.updateProjectionMatrix();cameraGoal.fromArray(framed.position);lookGoal.fromArray(framed.target);const t=1-Math.exp(-dt*5);camera.position.lerp(cameraGoal,t);followLook.lerp(lookGoal,t);camera.lookAt(followLook);orbit.enabled=false;return;}
 if(camera.far!==160){camera.far=160;camera.updateProjectionMatrix();}
 const desiredFov=`);
edit('audio.update(dt,{...letterController.musicState(),', 'audio.update(dt,{...letterController.musicState(),...voyage?.musicState(),');
edit("if(mode==='play')updatePlay(dt);else if(mode==='gallery')", "if(mode==='play')updatePlay(dt);voyage?.update(time,dt,{camera,interactive:mode==='play'&&!modalPaused&&!hidden});if(mode==='gallery')");
// The previous chain now has its own second if; opening/cover still mutually exclusive.
edit("cameraOcclusion.update(dt,camera,followLook,mode==='play'||mode==='gallery',", "cameraOcclusion.update(dt,camera,followLook,!voyage?.active&&(mode==='play'||mode==='gallery'),");
const renderOld="if(captionUntil&&time>captionUntil)$('caption').style.opacity='0';depthPass.enabled=!depthPass.failed&&focus!=='letter'&&state.settings.quality!=='light'&&dustView<.1&&scatter<.15;waterReflection?.update(state.settings.quality,dustView<.8&&focus!=='letter');composer.render();";
edit(renderOld,`if(captionUntil&&time>captionUntil)$('caption').style.opacity='0';
 if(voyage?.active){for(const group of [world.group,cinematic.group,atmosphere.object,bouquet.group,particles.object,landscape.group,exploration.group,letterController.group,resonance.group,delivery.group,weaver.group,gestureField.group,journeyGuide.group,heroWeather.object])group.visible=false;scene.background.set('#a4bbc4');scene.fog.color.set('#a4bbc4');scene.fog.density=.002;ambient.intensity=keyLight.intensity=rimLight.intensity=0;bloomPass.strength=.2;}
 depthPass.enabled=!voyage?.active&&!depthPass.failed&&focus!=='letter'&&state.settings.quality!=='light'&&dustView<.1&&scatter<.15;waterReflection?.update(state.settings.quality,!voyage?.active&&dustView<.8&&focus!=='letter');composer.render();`);
edit('scene.add(letterController.group);',`scene.add(letterController.group);
 voyage=createVoyageController({getState:()=>state,onStart:()=>{clearInput();focus='voyage';scatterTarget=0;scatter=0;flowerCycle.reset();flowerState=flowerCycle.state;setNight(false);$('context').hidden=true;document.body.classList.add('focus');$('caption').textContent='';},onExit:()=>{focus=null;document.body.classList.remove('focus');clearInput();viewRig.reset();travel.reset();save();caption('花庭仍在。你写下的信与走过的海岸，都已收好。',6);},onSave:save,onSound:(kind,payload)=>{audio.unlock();audio.event(kind,payload);},onComplete:()=>{if(!state.ending){const result=commitLetter(state);if(!result.ok)toast(result.reason);}save();},onPhoto:photo,onSettings:showSettings,onBook:showLetters});scene.add(voyage.group);`);
edit('letters:letterController.snapshot(),saveStatus:', 'letters:letterController.snapshot(),voyage:voyage.snapshot(),saveStatus:');
// New labels describe the same save-compatible leaf crossing.
s=s.replaceAll('0.7.1','0.8.0');
fs.writeFileSync(file,s);
let html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace('风屏 · 旧台 ↔ 中庭','叶渡 · 旧台 ↔ 中庭').replace('折光 · 渡风 · 织声','折光 · 织声 · 向海').replace('把故乡放进光里，把春信折成翅膀。<br>在旧曲停下的地方，写一段自己的春声。','把故乡放进光里，把自己的话写进信里。<br>带上前人的一封旧信，沿着繁花，驶向曙光。').replace('花光暗房 · 纸翼渡风 · 回声织信 <span>Ⅰ — Ⅳ</span>','九段春光 · 两封信 · 一程远航 <span>Ⅰ — Ⅸ</span>');fs.writeFileSync(path.join(root,'index.html'),html);
for(const name of ['package.json','package-lock.json']){const f=path.join(root,name),p=JSON.parse(fs.readFileSync(f,'utf8'));p.version='0.8.0';if(p.packages?.[''])p.packages[''].version='0.8.0';fs.writeFileSync(f,JSON.stringify(p,null,2)+'\n');}
console.log('Integrated coastal continuation, preserved original core and archive version.');
