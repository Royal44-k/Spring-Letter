const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {summarizeRgba,inspectCanvas,assessPixels,classifyConsole}=require('./v10-pixel-validation.cjs');
const {bindStyleIdentity}=require('./v12-style-identity.cjs');
const url=process.env.SPRING_URL||'http://127.0.0.1:5192/';
const out=path.resolve('evidence/v10/render-'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(out,{recursive:true});
const report={url,passed:false,observations:[],console:[],pageErrors:[],requests:[],scope:'Isolated browser; real UI changes; actual opaque, nonflat canvas pixels and WebGL status, not only DOM or JS success. Three qualities, five series, four forms, scatter/reload and fullscreen/portrait/landscape. Screenshots accompany every observation; these samples do not claim continuous visual coverage.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
async function sample(p,label){
 // Resize and quality changes can clear the buffer until the next animation
 // frame. Observe a newly rendered frame, not a stale image or intermediate clear.
 const before=await p.evaluate(()=>window.__SPRING__.snapshot().frameNumber);
 await p.waitForFunction(previous=>window.__SPRING__.snapshot().frameNumber>previous,before,{timeout:10000});
 const record=await p.evaluate(()=>{const s=window.__SPRING__.snapshot();return {...window.__V10_READ_PIXELS__(),frame:s.frameNumber,quality:s.state?.settings?.quality,material:s.material,form:s.flowerForm,mode:s.mode,errors:s.errors};});
 Object.assign(record,await bindStyleIdentity(p,report,url));record.entry=report.entry;record.entrySha256=report.entrySha256;record.label=label;record.pixelCheck=assessPixels(record);report.observations.push(record);
 await p.screenshot({path:path.join(out,label+'.png')});write();
 console.log(label,JSON.stringify({valid:record.pixelCheck.valid,reasons:record.pixelCheck.reasons,opaque:record.opaque,sd:record.sd,glError:record.glError}));
}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const c=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1}),p=await c.newPage();
  await p.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()+';window.__V10_READ_PIXELS__='+inspectCanvas.toString()+';'});
  p.on('console',m=>{if(['error','warning'].includes(m.type()))report.console.push({type:m.type(),text:m.text()});});
  p.on('pageerror',e=>report.pageErrors.push(String(e)));p.on('requestfailed',r=>report.requests.push({url:r.url(),error:r.failure()}));
  await p.goto(url);await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.locator('#loading').waitFor({state:'hidden'});
  report.entry=await p.locator('script[type=module][src]').last().getAttribute('src');
  if(process.env.EXPECTED_JS)assert.equal(report.entry,process.env.EXPECTED_JS,'render audit must use the expected bundle');
  const response=await p.request.get(new URL(report.entry,url).href);assert.ok(response.ok(),'entry request');report.entrySha256=crypto.createHash('sha256').update(await response.body()).digest('hex');
  await sample(p,'fresh');
  for(const quality of ['light','balanced','delicate']){
   await p.locator('#settings').click();await p.locator('#quality-choice').selectOption(quality);await p.locator('#close-modal').click();await p.locator('#gallery').click();
   for(const series of ['silver','crystal','lily','amber','celadon']){
    await p.locator('[data-material='+series+']').click();await p.waitForFunction(()=>!window.__SPRING__.snapshot().shaderPreparing);await p.locator('#material-preparing').waitFor({state:'hidden'});
    for(const form of ['lily','lotus','iris','dahlia']){await p.locator('[data-form='+form+']').click();await p.waitForTimeout(220);await sample(p,quality+'-'+series+'-'+form);}
    await p.locator('#flower-burst').click();await p.waitForTimeout(600);await sample(p,quality+'-'+series+'-scatter');await p.locator('#home').click();await p.reload();await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.locator('#loading').waitFor({state:'hidden'});await sample(p,quality+'-'+series+'-reload');await p.locator('#gallery').click();
   }
   await p.locator('#home').click();await p.locator('#cover-fullscreen').click();await p.waitForTimeout(300);await sample(p,quality+'-fullscreen');
   if(await p.evaluate(()=>!!document.fullscreenElement))await p.keyboard.press('Escape');
   await p.setViewportSize({width:390,height:844});await sample(p,quality+'-portrait');await p.setViewportSize({width:844,height:390});await sample(p,quality+'-landscape');await p.setViewportSize({width:1280,height:800});
  }
  report.consoleValidation=classifyConsole(report.console);
  report.invalidObservations=report.observations.filter(x=>!x.pixelCheck.valid||x.errors?.length).map(x=>({label:x.label,reasons:x.pixelCheck.reasons,errors:x.errors}));
  report.failedRequests=report.requests.filter(x=>x.error?.errorText!=='net::ERR_ABORTED');
  report.passed=report.observations.length===100&&report.pageErrors.length===0&&report.consoleValidation.blocking.length===0&&report.failedRequests.length===0&&report.invalidObservations.length===0;
  write();console.log(JSON.stringify({passed:report.passed,out,observations:report.observations.length,invalid:report.invalidObservations.length,blockingConsole:report.consoleValidation.blocking.length,benignPrecisionWarnings:report.consoleValidation.benign.length}));
  if(!report.passed)process.exitCode=1;
 }catch(e){report.failure=e.stack;write();throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
