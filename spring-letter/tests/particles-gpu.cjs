const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.stack));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 try {
  await page.goto((process.env.SPRING_URL||'http://127.0.0.1:5194')+'/tests/particles-gpu.html');
  await page.waitForFunction(()=>window.particleHarness);
  const report=await page.evaluate(()=>{
   const h=window.particleHarness,{particles,field,center,extent,THREE}=h;
   h.step(120,{gesture:null});
   const original=h.read();
   const brush=center.clone().add(new THREE.Vector3(extent*.14,extent*.1,0));
   const gesture={active:true,position:brush,velocity:new THREE.Vector3(extent*.75,extent*.14,0),strength:1,mode:'weave'};
   h.step(90,{gesture});const moved=h.read();const heated=h.read('velocity');
   let nearDelta=0,farDelta=0,nearCount=0,farCount=0,maxHeat=0;
   for(let i=0;i<particles.getStats().activeCount;i++){
    const j=i*4;const distance=Math.hypot(original[j]-brush.x,original[j+1]-brush.y,original[j+2]-brush.z);
    const displacement=Math.hypot(moved[j]-original[j],moved[j+1]-original[j+1],moved[j+2]-original[j+2]);
    if(distance<extent*.25){nearDelta+=displacement;nearCount++;}
    if(distance>extent*.55){farDelta+=displacement;farCount++;}
    maxHeat=Math.max(maxHeat,heated[j+3]);
   }
   nearDelta/=Math.max(nearCount,1);farDelta/=Math.max(farCount,1);
   h.step(240,{gesture:null});const returned=h.read();const cooled=h.read('velocity');
   let returnError=0,heatAfterRelease=0,finite=true;
   for(let i=0;i<particles.getStats().activeCount;i++){
    const j=i*4;returnError+=Math.hypot(returned[j]-original[j],returned[j+1]-original[j+1],returned[j+2]-original[j+2]);
    heatAfterRelease=Math.max(heatAfterRelease,cooled[j+3]);
    for(let a=0;a<4;a++)finite&&=Number.isFinite(returned[j+a])&&Number.isFinite(cooled[j+a]);
   }
   returnError/=particles.getStats().activeCount;
   h.step(240,{dispersion:1,gesture:null});const dispersed=h.read();let maxRadius=0;
   for(let i=0;i<particles.getStats().activeCount;i++){const j=i*4;maxRadius=Math.max(maxRadius,Math.hypot(dispersed[j]-center.x,dispersed[j+1]-center.y,dispersed[j+2]-center.z));for(let a=0;a<4;a++)finite&&=Number.isFinite(dispersed[j+a]);}
   // Exercise both wind-brush shaders with a curved stroke.
   for(let i=0;i<45;i++){gesture.position.set(center.x+Math.sin(i*.09)*extent*.3,center.y+Math.cos(i*.09)*extent*.2,center.z);h.step(1,{gesture});}
   const trail=field.getStats();
   const gl=h.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
   return {backend:particles.getStats().backend,count:particles.getStats().activeCount,extent,nearCount,farCount,nearDelta,farDelta,maxHeat,returnError,heatAfterRelease,maxRadius,finite,trail,device:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)};
  });
  await page.screenshot({path:path.resolve(__dirname,'../evidence/v5-particles-gpu-weave.png')});
  assert.equal(report.backend,'gpu-spring');assert.equal(report.count,65536);assert.equal(report.finite,true);
  assert.ok(report.nearCount>100);assert.ok(report.nearDelta>report.extent*.015,'wind brush must measurably move nearby samples');
  assert.ok(report.farDelta<report.nearDelta*.1,'unaffected material must remain legible');
  assert.ok(report.returnError<report.extent*.002,'release must recover the original surface');
  assert.ok(report.maxHeat>.3);assert.ok(report.heatAfterRelease<.005);
  assert.ok(report.maxRadius<report.extent*1.3,'ribbons must stay bounded');assert.equal(report.trail.drawCalls,2);
  const low=await page.evaluate(()=>{
   const h=window.particleHarness;const before=h.read(),velocity=h.read('velocity');
   h.particles.setQuality('low');h.field.setQuality('low');
   const smaller=h.read(),slower=h.read('velocity');let positionError=0,velocityError=0;
   for(let i=0;i<smaller.length;i++){positionError=Math.max(positionError,Math.abs(smaller[i]-before[i]));velocityError=Math.max(velocityError,Math.abs(slower[i]-velocity[i]));}
   h.particles.setQuality('standard');const larger=h.read();let upsizeError=0,finite=true;
   for(let i=0;i<larger.length;i++){finite&&=Number.isFinite(larger[i]);if(i<smaller.length)upsizeError=Math.max(upsizeError,Math.abs(larger[i]-smaller[i]));}
   h.particles.setQuality('low');h.step(60,{gesture:null});
   const memoryBefore=h.renderer.info.memory.textures;
   for(let i=0;i<4;i++){h.particles.setQuality('standard');h.particles.setQuality('low');h.step(1);}
   return {particles:h.particles.getStats(),trail:h.field.getStats(),positionError,velocityError,upsizeError,finite,memoryBefore,memoryAfter:h.renderer.info.memory.textures};
  });
  assert.equal(low.particles.activeCount,16384);assert.equal(low.particles.simulationTexels,16384);assert.ok(low.trail.drawCalls<=1);
  assert.equal(low.positionError,0);assert.equal(low.velocityError,0);assert.equal(low.upsizeError,0);assert.equal(low.finite,true);assert.equal(low.memoryAfter,low.memoryBefore);
  const fallback=await page.evaluate(()=>{
   const h=window.particleHarness;
   const unsupported={capabilities:{isWebGL2:false},extensions:{has:()=>false},getPixelRatio:()=>1,getDrawingBufferSize:target=>h.renderer.getDrawingBufferSize(target)};
   const particles=h.createSurfaceParticles(unsupported,h.samples,{quality:'low'});
   h.scene.remove(h.particles.object);h.scene.add(particles.object);
   particles.update(1/60,20,{dispersion:.6,bloom:.7,reducedMotion:true,night:true,gesture:{active:true,position:h.center,velocity:new h.THREE.Vector3(2,0,0),strength:1}});
   h.renderer.render(h.scene,h.camera);const result=particles.getStats();particles.dispose();return result;
  });
  assert.equal(fallback.backend,'analytic-fallback');assert.equal(fallback.activeCount,16384);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.resolve(__dirname,'../evidence/v5-particles-gpu-verification.json'),JSON.stringify({date:new Date().toISOString(),report,low,fallback,errors},null,2));
  console.log(JSON.stringify({report,low,fallback,errors},null,2));
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
