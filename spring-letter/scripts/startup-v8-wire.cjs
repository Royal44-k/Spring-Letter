const fs=require('node:fs'),p=require('node:path').join(__dirname,'../src/main.js');let s=fs.readFileSync(p,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,90));s=s.replace(a,b);}
replace("let loadingScene,letterController,savePanel,playtestFeedback,lastSaveResult=null;","let loadingScene,letterController,savePanel,playtestFeedback,lastSaveResult=null;\nlet shaderPreparing=false;const warmedSeries=new Set();");
replace("flowerForm=bouquet.setForm(id);state.settings.flowerForm=flowerForm;\n const samples=bouquet.sampleSurface(65536);flowerBounds=surfaceBounds(samples);particles.setSource(samples);","const changed=bouquet.form!==id;flowerForm=bouquet.setForm(id);state.settings.flowerForm=flowerForm;\n if(changed){const samples=bouquet.sampleSurface(65536);flowerBounds=surfaceBounds(samples);particles.setSource(samples);}");
replace("material=id;variant='blush';state.settings.flowerSeries=id;bouquet.setMaterial(id,variant);\n particles.setColors(bouquet.sampleSurface(65536).colors);syncSurface();","const changed=bouquet.series!==id||bouquet.variant!=='blush';material=id;variant='blush';state.settings.flowerSeries=id;bouquet.setMaterial(id,variant);\n if(changed)particles.setColors(bouquet.sampleColors(65536));syncSurface();");
replace("function releaseFlower(){",`function shaderFamily(id){return id==='celadon'?'amber':id;}
async function compileForComposer(){const previous=renderer.getRenderTarget();let pending;try{renderer.setRenderTarget(composer.readBuffer);pending=renderer.compileAsync(scene,camera);}finally{renderer.setRenderTarget(previous);}await pending;}
async function warmCurrentFlower(){
 bouquet.setOpacity(1);await compileForComposer();waterReflection.update(state.settings.quality,true);composer.render();
 bouquet.setOpacity(.42);particles.object.visible=true;particles.update(0,time,{bloom:displayBloom,dispersion:.75,flow:.5,opacity:.7});
 await compileForComposer();waterReflection.update(state.settings.quality,true);composer.render();bouquet.setOpacity(1);warmedSeries.add(shaderFamily(material));
}
async function prepareFlowerSeries(id){
 if(shaderPreparing||!FLOWER_SERIES.some(p=>p.id===id))return;
 if(warmedSeries.has(shaderFamily(id))){switchFlowerSeries(id);return;}
 shaderPreparing=true;clearInput();audio.pause(true);$('material-preparing').hidden=false;
 try{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));switchFlowerSeries(id);await warmCurrentFlower();}
 catch(e){errors.push('Flower light: '+e.message);toast('这一系列的光泽暂未准备完整，可以切回已有花色。');}
 finally{shaderPreparing=false;lastTime=0;$('material-preparing').hidden=true;audio.pause(hidden||modalPaused);}
}
function releaseFlower(){`);
replace("b.onclick=()=>switchFlowerSeries(b.dataset.material)","b.onclick=()=>prepareFlowerSeries(b.dataset.material)");
replace("if(hidden||modalPaused||flags.contextLost)return;","if(hidden||modalPaused||shaderPreparing||flags.contextLost)return;");
replace("bouquet=createBouquet({seed:17,scale:1});scene.add(bouquet.group);","bouquet=createBouquet({seed:17,scale:1});flowerForm=bouquet.setForm(state.settings.flowerForm);scene.add(bouquet.group);");
const a=s.indexOf(' // Match the actual composer target.'),b=s.indexOf(' switchFlowerForm(state.settings.flowerForm);switchFlowerSeries(state.settings.flowerSeries);bouquet.setOpacity(1);',a);if(a<0||b<a)throw Error('warmup block');
s=s.slice(0,a)+" // The first screen prepares only its selected material. Other series are\n // compiled on first request behind a short, accessible transition.\n await warmCurrentFlower();\n"+s.slice(b);
replace("loadingTiming:{...loadingTiming},frameTimes:","loadingTiming:{...loadingTiming},shaderPreparing,warmedSeries:[...warmedSeries],frameTimes:");
replace("$('continue').hidden=!restore(storageGet(SAVE_KEY)).started;setNight(false);}","const returning=restore(storageGet(SAVE_KEY)).started;$('continue').hidden=!returning;$('continue').classList.toggle('primary',returning);$('begin').classList.toggle('primary',!returning);$('begin').textContent=returning?'另起一封春信':'走进花庭 ↗';$('continue').style.order=returning?'-1':'';setNight(false);}");
fs.writeFileSync(p,s);
