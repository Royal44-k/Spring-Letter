const crypto=require('crypto');const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});const page=await browser.newPage({viewport:{width:1200,height:800}});const errors=[],records=[];page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});const out=path.resolve(__dirname,'../evidence/v6-flower-lab');fs.mkdirSync(out,{recursive:true});try{
 await page.goto('http://127.0.0.1:5193/tests/v6-flower-lab.html');await page.waitForFunction(()=>window.labReady,{},{timeout:120000});
 for(const form of ['lily','lotus','iris','dahlia'])for(const series of ['silver','crystal','lily','amber','celadon']){
  await page.evaluate(async({form,series})=>flowerLab.select(form,series),{form,series});await page.screenshot({path:path.join(out,`${form}-${series}.png`)});
  const solid=await page.evaluate(()=>({...flowerLab.renderer.info.memory,triangles:flowerLab.renderer.info.render.triangles}));
  await page.evaluate(async({form,series})=>flowerLab.select(form,series,true,true),{form,series});await page.screenshot({path:path.join(out,`${form}-${series}-dust.png`)});
  const tint=await page.evaluate(()=>{const a=flowerLab.particles.object.geometry.attributes.aTint.array,c=[0,0,0];for(let i=0;i<a.length;i++)c[i%3]+=a[i];return c.map(v=>v/(a.length/3));});records.push({form,series,solid,tint});
 }
 for(const form of ['lily','lotus','iris','dahlia']){await page.evaluate(async f=>flowerLab.select(f,'crystal',true,false),form);await page.screenshot({path:path.join(out,`${form}-crystal-night.png`)});}
 const progression=[];
 await page.evaluate(async()=>{await flowerLab.select('lily','amber');flowerLab.particles.object.visible=true;flowerLab.cycle.reset();flowerLab.cycle.update(0,{burst:true});});
 let previous=0;
 for(const seconds of [.35,.8,2,5,7.5,9.5,12.9]){
  const snapshot=await page.evaluate(({frames})=>{const h=flowerLab;let c;for(let i=0;i<frames;i++){c=h.cycle.update(1/60);h.bouquet.setOpacity(1-h.T.MathUtils.smoothstep(c.dispersion,0,.65));h.scene.background.set('#cbc8d6').lerp(new h.T.Color('#100d20'),c.dispersion);h.step(1,{dispersion:c.dispersion,flow:c.flow,opacity:h.T.MathUtils.smoothstep(c.dispersion,0,.3),night:c.dispersion});}document.getElementById('label').textContent='AMBER / '+c.phase.toUpperCase();return c;},{frames:Math.round((seconds-previous)*60)});previous=seconds;
  progression.push({seconds,...snapshot});await page.screenshot({path:path.join(out,`cycle-${String(seconds).replace('.','_')}.png`)});
 }
 assert.equal(progression[2].phase,'drifting');assert.equal(progression.at(-1).phase,'solid');
 await page.evaluate(async()=>flowerLab.select('iris','celadon',true,true));
 for(const mode of ['drift','gather','weave','released']){
  const observation=await page.evaluate(mode=>{const h=flowerLab;for(let i=0;i<120;i++){const active=mode==='gather'||mode==='weave';h.step(1,{dispersion:1,flow:1,gesture:active?{active:true,mode:'auto',position:new h.T.Vector3(mode==='weave'?Math.sin(i*.04)*.8:.2,2.7+Math.cos(i*.025)*.15,0),velocity:mode==='weave'?new h.T.Vector3(2.2,.3,0):new h.T.Vector3(),strength:.9}:null});}return h.particles.getStats();},mode);
  await page.screenshot({path:path.join(out,`gesture-${mode}.png`)});progression.push({gesture:mode,...observation});
 }
 const gpu=await page.evaluate(()=>{
  const h=flowerLab;h.bouquet.setOpacity(1);h.particles.object.visible=true;h.bouquet.setForm('lily');h.bouquet.setMaterial('silver');h.particles.setSource(h.bouquet.sampleSurface(65536));h.step(60,{dispersion:1,flow:1,opacity:1});const before=h.read(),vBefore=h.read('velocity'),memoryBefore={...h.renderer.info.memory};
  h.bouquet.setMaterial('amber');h.particles.setColors(h.bouquet.sampleSurface(65536).colors);const recolored=h.read();let colorPositionError=0;for(let i=0;i<before.length;i++)colorPositionError=Math.max(colorPositionError,Math.abs(before[i]-recolored[i]));
  h.bouquet.setForm('iris');h.particles.setSource(h.bouquet.sampleSurface(65536));const changed=h.read(),vChanged=h.read('velocity');let sourcePositionError=0,sourceVelocityError=0;for(let i=0;i<before.length;i++){sourcePositionError=Math.max(sourcePositionError,Math.abs(before[i]-changed[i]));sourceVelocityError=Math.max(sourceVelocityError,Math.abs(vBefore[i]-vChanged[i]));}
  h.step(300,{dispersion:0,flow:0,pointer:null,gesture:null});const restored=h.read(),open=h.bouquet.sampleSurface(65536).open;let returnError=0,finite=true;for(let i=0;i<65536;i++){returnError+=Math.hypot(restored[i*4]-open[i*3],restored[i*4+1]-open[i*3+1],restored[i*4+2]-open[i*3+2]);for(let a=0;a<4;a++)finite&&=Number.isFinite(restored[i*4+a]);}returnError/=65536;
  const resources=[];for(let round=0;round<30;round++){h.bouquet.setForm(['lily','lotus','iris','dahlia'][round%4]);h.bouquet.setMaterial(['silver','crystal','lily','amber','celadon'][round%5]);h.particles.setSource(h.bouquet.sampleSurface(65536));h.particles.setQuality(round%2?'standard':'low');h.step(2,{dispersion:.8,flow:.6});resources.push({...h.renderer.info.memory});}
  h.particles.setQuality('standard');h.step(1);const memoryAfter={...h.renderer.info.memory};return {backend:h.particles.getStats().backend,colorPositionError,sourcePositionError,sourceVelocityError,returnError,finite,memoryBefore,memoryAfter,resources};
 });
 assert.equal(gpu.backend,'gpu-spring');assert.equal(gpu.colorPositionError,0);assert.equal(gpu.sourcePositionError,0);assert.equal(gpu.sourceVelocityError,0);assert.ok(gpu.returnError<.015);assert.equal(gpu.finite,true);assert.equal(gpu.resources[29].textures,gpu.resources[23].textures);assert.equal(gpu.resources[29].geometries,gpu.resources[23].geometries);assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({date:new Date().toISOString(),sourceHashes:Object.fromEntries(['botany.js','particles.js','flower-presets.js','flower-cycle.js'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../src',f))).digest('hex')])),scope:'Isolated optical/material/source-geometry fixture, not game playthrough or performance benchmark',records,progression,gpu,errors},null,2));console.log(JSON.stringify({images:55,gpu,errors}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
