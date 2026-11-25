const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {bindStyleIdentity}=require('./v12-style-identity.cjs');
const out=path.resolve('evidence/v10/context-'+Date.now());fs.mkdirSync(out,{recursive:true});
const url=process.env.SPRING_URL||'http://127.0.0.1:5192/';
const report={url,passed:false,cases:[],scope:'Real WEBGL_lose_context in disposable contexts: initial HDR wait, opening, ink gallery and material preparation; visible recovery/export/reload controls. No user save modified.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const lose=p=>p.evaluate(()=>{const gl=document.querySelector('#scene canvas').getContext('webgl2');window.__lossExtension=gl.getExtension('WEBGL_lose_context');if(!window.__lossExtension)throw Error('WEBGL_lose_context unavailable');window.__lossExtension.loseContext();});
async function status(p){return p.evaluate(()=>{const f=document.getElementById('failure'),s=getComputedStyle(f),render=window.__SPRING_RENDER__?.snapshot();return {failure:!f.hidden,loading:!document.getElementById('loading').hidden,preparing:!document.getElementById('material-preparing').hidden,text:document.getElementById('failure-detail').textContent,color:s.color,background:s.backgroundColor,zIndex:s.zIndex,frames:window.__SPRING__?.snapshot().frameNumber,render,focus:document.activeElement?.id,reloadText:document.querySelector('#failure button').textContent,exportVisible:!!document.querySelector('#failure-export:not([hidden])')};});}
async function ready(p){await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.locator('#loading').waitFor({state:'hidden'});await p.waitForTimeout(200);}
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 for(const phase of ['early','opening','dust','material']){
  const c=await b.newContext({viewport:{width:1280,height:800},acceptDownloads:true}),p=await c.newPage(),record={phase,errors:[]};report.cases.push(record);p.on('pageerror',e=>record.errors.push(String(e)));
  let release;const held=new Promise(r=>release=r);
  if(phase==='early')await p.route('**/spruit_sunrise_1k.hdr',async r=>{await held;await r.continue();});
  await p.goto(url,{waitUntil:'domcontentloaded'});record.entry=await p.locator('script[type=module][src]').last().getAttribute('src');if(process.env.EXPECTED_JS)assert.equal(record.entry,process.env.EXPECTED_JS);const entryResponse=await p.request.get(new URL(record.entry,url).href);assert.ok(entryResponse.ok());record.entrySha256=crypto.createHash('sha256').update(await entryResponse.body()).digest('hex');await bindStyleIdentity(p,record,url);for(const key of ['entry','entrySha256','style','styleSha256']){if(report[key])assert.equal(record[key],report[key]);else report[key]=record[key];}
  if(phase==='early'){await p.locator('#scene canvas').waitFor();await lose(p);await p.waitForTimeout(200);release();}
  else{
   await ready(p);
   if(phase==='opening'){await p.locator('#begin').click();await p.waitForTimeout(800);await lose(p);}
   else if(phase==='dust'){await p.locator('#gallery').click();await p.locator('[data-gallery=dust]').click();await p.waitForTimeout(1600);await lose(p);}
   else{await p.locator('#gallery').click();await p.evaluate(()=>{document.querySelector('[data-material=crystal]').click();const gl=document.querySelector('#scene canvas').getContext('webgl2');window.__lossExtension=gl.getExtension('WEBGL_lose_context');window.__lossExtension.loseContext();});}
  }
  await p.waitForTimeout(400);record.lost=await status(p);await p.screenshot({path:path.join(out,phase+'-lost.png')});
  assert.ok(record.lost.failure&&!record.lost.loading&&!record.lost.preparing,phase+' clear recovery surface');assert.ok(record.lost.render.blocked);assert.equal(record.lost.focus,'failure-reload');
  const frozen=record.lost.frames;await p.keyboard.press('KeyW');await p.waitForTimeout(250);assert.equal((await status(p)).frames,frozen,'input cannot restart rendering');
  const downloadPromise=p.waitForEvent('download');await p.locator('#failure-export').click();const download=await downloadPromise,file=path.join(out,phase+'-rescued.json');await download.saveAs(file);const exported=JSON.parse(fs.readFileSync(file,'utf8'));assert.ok(['spring-letter-archive','spring-letter-recovery-copy'].includes(exported.format));record.export={format:exported.format,bytes:fs.statSync(file).size,hasJourney:!!exported.data?.journey};if(phase==='opening')assert.ok(record.export.hasJourney,'opening progress rescued');
  const savedBefore=await p.evaluate(()=>localStorage.getItem('spring-letter:archive:v1'));
  await p.evaluate(()=>window.__lossExtension.restoreContext());await p.waitForTimeout(1200);record.restored=await status(p);await p.screenshot({path:path.join(out,phase+'-restored.png')});
  assert.ok(record.restored.failure&&record.restored.render.blocked&&record.restored.render.lifecycle.needsReload);assert.equal(record.restored.render.lifecycle.contextLost,false);assert.equal(record.restored.frames,frozen);
  await p.locator('#failure-reload').click();await ready(p);record.reloadedStyle=await bindStyleIdentity(p,record,url,report);record.reopened=await status(p);record.stateAfterReload=await p.evaluate(()=>({mode:window.__SPRING__.snapshot().mode,continue:!document.getElementById('continue').hidden,glError:document.querySelector('#scene canvas').getContext('webgl2').getError()}));
  assert.ok(!record.reopened.failure&&!record.reopened.render.blocked);assert.equal(record.stateAfterReload.glError,0);if(phase==='opening')assert.equal(record.stateAfterReload.continue,true);
  const savedAfter=await p.evaluate(()=>localStorage.getItem('spring-letter:archive:v1'));if(savedBefore&&savedAfter)assert.equal(JSON.parse(savedBefore).data.journey,JSON.parse(savedAfter).data.journey,'reopen preserves saved journey');
  await p.screenshot({path:path.join(out,phase+'-reopened.png')});assert.deepEqual(record.errors,[]);record.passed=true;write();console.log(JSON.stringify({phase,passed:true,entry:record.entry,export:record.export}));await c.close();
 }
 report.passed=report.cases.length===4&&report.cases.every(r=>r.passed);write();console.log(JSON.stringify({passed:report.passed,out}));
 }finally{await b.close();}})().catch(e=>{report.failure=e.stack;write();console.error(e);process.exitCode=1;});
