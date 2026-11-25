const fs=require('node:fs'),assert=require('node:assert/strict');
const file='src/main.js';let s=fs.readFileSync(file,'utf8');
function once(from,to){assert.equal(s.split(from).length-1,1,'unique integration hook: '+from.slice(0,80));s=s.replace(from,to);}
once("import {createVoyageController}","import {createAtlasController} from './atlas-controller.js';\nimport {ATLAS_LOCATIONS} from './atlas-content.js';\nimport {atlasComplete} from './atlas-model.js';\nimport {renderAtlasMap,JOURNEY_CHAPTERS,ROMAN_CHAPTERS} from './atlas-map.js';\nimport {createVoyageController}");
once('let loadingScene,letterController,voyage,','let loadingScene,letterController,voyage,atlas,');
once('function clearInput(){voyage?.cancel();','function clearInput(){atlas?.cancel();voyage?.cancel();');
const mapStart=s.indexOf('function showMap(){'),mapEnd=s.indexOf('\nfunction ',mapStart+1);assert.ok(mapStart>0&&mapEnd>mapStart);
s=s.slice(0,mapStart)+`function visitAtlas(id){
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
 $('map-garden').onclick=()=>{closeModal();if(mode==='play')exitFocus();else if(mode==='cover')startGame(restore(storageGet(SAVE_KEY)).started);};
 if($('map-voyage'))$('map-voyage').onclick=continueToCoast;
}
`+s.slice(mapEnd);
once(" if(voyage?.active){voyage.primary();return;}"," if(atlas?.active){atlas.primary();return;}\n if(voyage?.active){voyage.primary();return;}");
once('function resetPresentation(){voyage?.stop();','function resetPresentation(){atlas?.stop({preserveLocation:true,silent:true});voyage?.stop();');
once("if(!state.story.introSeen)storyDirector.startOpening();else if(state.bridge.solved&&(state.ending||state.voyage.stage!=='idle'))voyage.start();", "if(state.atlas.location)atlas.start(state.atlas.location,{resume:true});else if(!state.story.introSeen)storyDirector.startOpening();else if(state.bridge.solved&&(state.ending||state.voyage.stage!=='idle'))voyage.start();");
once("function exitFocus(){if(focus==='voyage')", "function exitFocus(){if(focus==='atlas'){atlas.stop();focus=null;document.body.classList.remove('focus');return;}if(focus==='voyage')");
once('exitFocus();audio.chime();voyage.start();','exitFocus();audio.chime();continueToCoast();');
once("function showEnding(){endingRevealAt=0;if(state.bridge.solved&&state.cores.every(Boolean)){closeModal();exitFocus();voyage.start();}}","function showEnding(){endingRevealAt=0;if(state.bridge.solved&&state.cores.every(Boolean))continueToCoast();}");
once('candidate.settings={...state.settings};candidate.ending=null;','candidate.atlas=structuredClone(state.atlas);candidate.settings={...state.settings};candidate.ending=null;');
once("$('act-number').textContent=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ'][act];$('act-title').textContent=VOYAGE_CHAPTERS[act][0];$('act-eyebrow').textContent='LETTERS ON THE WAY · '+(act+1)+' / 9';", "const routeAct=act>=5?act+3:act;$('act-number').textContent=ROMAN_CHAPTERS[routeAct];$('act-title').textContent=JOURNEY_CHAPTERS[routeAct][0];$('act-eyebrow').textContent='LETTERS ON THE WAY · '+(routeAct+1)+' / 12';");
once("act/9*100","routeAct/12*100");
once("亲手安放两枚种核，再去海岸写自己的信。","亲手安放两枚种核，穿过温室、星台与云甸，再去海岸写自己的信。");
once("if(voyage?.active){if(voyage.handleKey(e))e.preventDefault();return;}","if(atlas?.active){if(atlas.handleKey(e))e.preventDefault();return;}\n  if(voyage?.active){if(voyage.handleKey(e))e.preventDefault();return;}");
once("if(voyage?.active){voyage.handleKey(e);return;}","if(atlas?.active){atlas.handleKey(e);return;}if(voyage?.active){voyage.handleKey(e);return;}");
once("e.preventDefault();if(voyage?.active){setPointer(e);canvas.focus", "e.preventDefault();if(atlas?.active){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();atlas.pointer('down',raycaster,e);return;}if(voyage?.active){setPointer(e);canvas.focus");
once("if(voyage?.active){setPointer(e);voyage.pointer('move',raycaster,e);return;}","if(atlas?.active){setPointer(e);atlas.pointer('move',raycaster,e);return;}\n  if(voyage?.active){setPointer(e);voyage.pointer('move',raycaster,e);return;}");
once("window.addEventListener('pointerup',e=>{if(voyage?.active)","window.addEventListener('pointerup',e=>{if(atlas?.active){setPointer(e);atlas.pointer('up',raycaster,e);return;}if(voyage?.active)");
once("canvas.addEventListener('wheel',e=>{if(voyage?.active)return;", "canvas.addEventListener('wheel',e=>{if(atlas?.active){e.preventDefault();atlas.zoom(e.deltaY);return;}if(voyage?.active)return;");
once("if(focus==='voyage'||focus==='flower'", "if(focus==='atlas'||focus==='voyage'||focus==='flower'");
once(" if(voyage?.active){const framed=voyage.camera(camera.aspect);", " if(atlas?.active){const framed=atlas.camera(camera.aspect);camera.far=framed.far;camera.fov=THREE.MathUtils.damp(camera.fov,framed.fov,5,dt);camera.updateProjectionMatrix();cameraGoal.fromArray(framed.position);lookGoal.fromArray(framed.target);const blend=1-Math.exp(-dt*7);camera.position.lerp(cameraGoal,blend);followLook.lerp(lookGoal,blend);camera.lookAt(followLook);orbit.enabled=false;return;}\n if(voyage?.active){const framed=voyage.camera(camera.aspect);");
once("ended:!!state.ending});", "ended:!!state.ending,...atlas?.musicState()});");
once(" if(mode==='play'||mode==='opening')storyDirector.update",` if(atlas?.active){
  state.playedSeconds=(state.playedSeconds||0)+dt;atlas.update(time,dt,{camera,interactive:mode==='play'});updateCamera(dt);
  for(const group of [world.group,cinematic.group,atmosphere.object,bouquet.group,particles.object,landscape.group,exploration.group,letterController.group,resonance.group,delivery.group,weaver.group,gestureField.group,journeyGuide.group,heroWeather.object,voyage.group])group.visible=false;
  const theme=atlas.theme();scene.background.set(theme.sky);scene.fog.color.set(theme.sky);scene.fog.density=theme.fog;scene.environmentIntensity=theme.id==='observatory'?.16:.45;
  ambient.intensity=keyLight.intensity=rimLight.intensity=0;chaseLight.visible=false;bloomPass.strength=theme.bloom;depthPass.enabled=false;waterReflection?.update(state.settings.quality,false);cameraOcclusion.update(dt,camera,followLook,false,[]);composer.render();return;
 }
 if(mode==='play'||mode==='opening')storyDirector.update`);
once("voyage=createVoyageController({getState:()=>state,onStart:","voyage=createVoyageController({getState:()=>state,onMap:showMap,onStart:");
const hook="scene.add(voyage.group);";once(hook,hook+`
 atlas=createAtlasController({getState:()=>state,onStart:()=>{clearInput();focus='atlas';scatterTarget=scatter=dustView=0;flowerCycle.reset();setNight(false);document.body.classList.add('focus');$('context').hidden=true;const f=atlas.camera(camera.aspect);camera.position.fromArray(f.position);followLook.fromArray(f.target);camera.lookAt(followLook);},onExit:()=>{focus=null;document.body.classList.remove('focus');clearInput();viewRig.reset();travel.reset();save();caption('远方已经记在地图上。随时可以再去。',5);},onSave:save,onSound:(kind,payload)=>{audio.unlock();audio.event(kind,payload);},onContinue:continueToCoast,onMap:showMap,onPhoto:photo,onSettings:showSettings,onRead:note=>openModal('<small>驿路上的旧字迹</small><h2>'+note.title+'</h2><p>'+note.text+'</p>')});scene.add(atlas.group);`);
once("voyage:voyage.snapshot(),saveStatus:","voyage:voyage.snapshot(),atlas:atlas.snapshot(),saveStatus:");
once("$('recover').onclick=()=>{const p=nearestSafe(state);", "$('recover').onclick=()=>{if(atlas?.active){closeModal();atlas.recover();return;}const p=nearestSafe(state);");
once("$('begin').onclick=()=>savePanel.confirmNew", "$('cover-atlas').onclick=showMap;$('begin').onclick=()=>savePanel.confirmNew");
s=s.replaceAll("0.8.0","0.9.0").replace('九段主要旅程从花窗','十二段主要旅程从花窗').replace('潮汐 · 远航 · 两封信','雨林 · 星台 · 云海').replace('延伸到亲笔写信','穿过雨幕温室、沉星天文台与云海花甸，再延伸到亲笔写信');
fs.writeFileSync(file,s);
let html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('<div class="cover-actions">'));html=html.replace('</div>\n  <', '</div>\n  <');const action=html.indexOf('<div class="cover-actions">'),end=html.indexOf('</div>',action);html=html.slice(0,end+6)+'\n  <button id="cover-atlas">展开远方地图 · 三处新地点 ↗</button>'+html.slice(end+6);fs.writeFileSync('index.html',html);
let v=fs.readFileSync('src/voyage-controller.js','utf8');v=v.replace("const roman=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ'];","const roman=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'];");v=v.replace('onSettings,onBook})','onSettings,onBook,onMap})');v=v.replace("root.append(tools);","root.append(tools);const atlasMapButton=button('voyage-map','驿路地图');atlasMapButton.onclick=()=>onMap?.();tools.append(atlasMapButton);");v=v.replace("roman[chapter]+' / Ⅸ", "roman[chapter+3]+' / Ⅻ");fs.writeFileSync('src/voyage-controller.js',v);
for(const f of ['package.json','package-lock.json']){const j=JSON.parse(fs.readFileSync(f,'utf8'));j.version='0.9.0';if(j.packages?.[''])j.packages[''].version='0.9.0';fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n');}
console.log('Integrated atlas worlds, native map entry, archive resume and scene boundary.');
