const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {summarizeRgba,inspectCanvas,assessPixels,classifyConsole,assessOpening}=require('./v10-pixel-validation.cjs');
const {bindStyleIdentity}=require('./v12-style-identity.cjs');
const url=process.env.SPRING_URL||'http://127.0.0.1:5192/',out=path.resolve('evidence/v10/opening-'+Date.now());
fs.mkdirSync(out,{recursive:true});
const report={url,passed:false,frames:[],console:[],errors:[],scope:'Fresh isolated browser; automatic six-shot opening and first gameplay, real UI only. Each observation reads the actual canvas RGBA and the state synchronously. Sampling at approximately 180 ms, not a claim to inspect every rendered frame. Zero/transparent/flat images fail even when UI advances and GL reports no error.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1280,height:800},deviceScaleFactor:Number(process.env.TEST_DPR||1)});
  await p.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()+';window.__V10_READ_PIXELS__='+inspectCanvas.toString()+';'});
  p.on('console',m=>{if(['warning','error'].includes(m.type()))report.console.push({type:m.type(),text:m.text()});});
  p.on('pageerror',e=>report.errors.push(String(e)));
  await p.goto(url);await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.locator('#loading').waitFor({state:'hidden'});
  report.entry=await p.locator('script[type=module][src]').last().getAttribute('src');
  if(process.env.EXPECTED_JS)assert.equal(report.entry,process.env.EXPECTED_JS,'opening must use the expected bundle');
  const response=await p.request.get(new URL(report.entry,url).href);assert.ok(response.ok(),'entry request');
  report.entrySha256=crypto.createHash('sha256').update(await response.body()).digest('hex');await bindStyleIdentity(p,report,url);
  if(process.env.TEST_QUALITY){await p.locator('#settings').click();await p.locator('#quality-choice').selectOption(process.env.TEST_QUALITY);await p.locator('#close-modal').click();}
  report.actualQuality=await p.evaluate(()=>window.__SPRING__.snapshot().state.settings.quality);report.actualDevicePixelRatio=await p.evaluate(()=>devicePixelRatio);
  await p.locator('#begin').click();const seen=new Set(),capturedInvalid=new Set();let doneAt=0;
  for(let i=0;i<400;i++){
   const f=await p.evaluate(()=>{const s=window.__SPRING__.snapshot();return {...window.__V10_READ_PIXELS__(),at:performance.now(),mode:s.mode,opening:s.opening,frame:s.frameNumber,camera:s.camera,scatter:s.scatter,bloom:s.displayBloom,material:s.material,errors:s.errors};});
   Object.assign(f,{entry:report.entry,entrySha256:report.entrySha256,style:report.style,styleSha256:report.styleSha256});f.pixelCheck=assessPixels(f);report.frames.push(f);
   const key=f.mode==='opening'?f.opening:f.mode,first=!seen.has(key),invalid=!f.pixelCheck.valid&&!capturedInvalid.has(key);
   if(first||invalid){seen.add(key);if(invalid)capturedInvalid.add(key);const file=`frame-${i}-shot-${key}${invalid?'-invalid':''}.png`;await p.screenshot({path:path.join(out,file)});f.screenshot=file;console.log(JSON.stringify({shot:key,frame:f.frame,valid:f.pixelCheck.valid,reasons:f.pixelCheck.reasons,mean:f.mean,opaque:f.opaque,glError:f.glError}));}
   if(i%20===0)write();
   if(f.mode==='play'&&++doneAt>10)break;
   await p.waitForTimeout(180);
  }
  await bindStyleIdentity(p,report,url);report.seen=[...seen];report.pixelValidation=assessOpening(report.frames);report.consoleValidation=classifyConsole(report.console);
  report.passed=report.pixelValidation.valid&&report.errors.length===0&&report.consoleValidation.blocking.length===0;
  await p.screenshot({path:path.join(out,'first-play.png')});write();
  console.log(JSON.stringify({passed:report.passed,out,frames:report.frames.length,reasons:report.pixelValidation.reasons,blockingConsole:report.consoleValidation.blocking.length,benignPrecisionWarnings:report.consoleValidation.benign.length}));
  if(!report.passed)process.exitCode=1;
 }catch(e){report.failure=e.stack;write();throw e;}finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
