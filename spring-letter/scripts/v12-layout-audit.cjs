/** SERIAL GPU AUDIT. Does not start a server or seed game progress.
 * SPRING_URL defaults to http://127.0.0.1:5193/. EXPECTED_JS, if supplied,
 * must match the loaded module entry. Run only in the root's GPU timeslot.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {readStyleIdentity,bindStyleIdentity,sameStyleIdentity}=require('./v12-style-identity.cjs');
const {inspectCanvas,assessPixels,summarizeRgba,classifyConsole}=require('./v10-pixel-validation.cjs');
const ROOT=path.resolve(__dirname,'..');
const LOCATIONS=['conservatory','observatory','meadow'];
const TITLES={conservatory:'雨幕温室',observatory:'沉星天文台',meadow:'云海花甸'};
const VIEWS=[{name:'desktop',width:1440,height:900,hasTouch:false},{name:'portrait-touch',width:390,height:844,hasTouch:true},{name:'landscape-touch',width:844,height:390,hasTouch:true}];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const VIDEO_ENABLED=process.env.QA_VIDEO==='1';
const fits=(r,w,h)=>!!r&&r.width>0&&r.height>0&&r.x>=-.6&&r.y>=-.6&&r.x+r.width<=w+.6&&r.y+r.height<=h+.6;
const intersects=(a,b)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>.8&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>.8;
function entryMatches(actual,expected,url){
 if(!expected)return true;
 const actualPath=new URL(actual,url).pathname;
 return /[/\\]/.test(expected)?actualPath===new URL(expected.replaceAll('\\','/'),url).pathname:path.posix.basename(actualPath)===expected;
}

// Read-only DOM observation. Offscreen modal descendants are measured but only
// declared reachable after Playwright scrolls the real scrollport to them.
function observeLayout(){
 const rect=el=>{const b=el.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};
 const visible=el=>el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})&&!el.closest('[hidden]');
 const modal=document.querySelector('#modal'),open=modal.open;
 const list=[...document.querySelectorAll(open?'#modal button,#modal summary,#modal input,#modal select':'#atlas-ui button,body>header button')].filter(visible);
 const controls=list.map(el=>{
  const box=rect(el),ancestors=[];
  for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const css=getComputedStyle(a);if(/auto|scroll/.test(css.overflowY)&&a.scrollHeight>a.clientHeight+1)ancestors.push({id:a.id||a.className,rect:rect(a),scrollTop:a.scrollTop,scrollHeight:a.scrollHeight,clientHeight:a.clientHeight});}
  const hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
  return{id:el.id||el.dataset.atlasLocation||el.textContent.trim().slice(0,45),rect:box,disabled:!!el.disabled,inert:!!el.closest('[inert]'),inViewport:box.x>=-.6&&box.y>=-.6&&box.x+box.width<=innerWidth+.6&&box.y+box.height<=innerHeight+.6,inScrollport:ancestors.every(a=>box.y>=a.rect.y-.6&&box.y+box.height<=a.rect.y+a.rect.height+.6),centerHit:hit===el||el.contains(hit),scrollParents:ancestors};
 });
 const titles=[...document.querySelectorAll(open?'#modal h2':'#atlas-title')].filter(visible).map(el=>{const range=document.createRange();range.selectNodeContents(el);const b=range.getBoundingClientRect();return{id:el.id||'modal-title',text:el.textContent,rect:{x:b.x,y:b.y,width:b.width,height:b.height}};});
 return{viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,modal:open?{rect:rect(modal),scrollWidth:modal.scrollWidth,clientWidth:modal.clientWidth,scrollHeight:modal.scrollHeight,clientHeight:modal.clientHeight,scrollTop:modal.scrollTop}:null,controls,titles};
}
function validateLayout(m){
 const {width,height}=m.viewport;
 assert.ok(m.documentWidth<=width+1&&m.bodyWidth<=width+1,'no horizontal page overflow');
 if(m.modal){assert.ok(fits(m.modal.rect,width,height),'map dialog scrollport fits viewport');assert.ok(m.modal.scrollWidth<=m.modal.clientWidth+1,'modal has no horizontal overflow');}
 const shown=m.controls.filter(c=>!c.inert&&c.inViewport&&c.inScrollport);
 for(const c of m.controls){
  if(c.inert)continue;
  assert.ok(c.rect.x>=-.6&&c.rect.x+c.rect.width<=width+.6,'control horizontally clipped: '+c.id);
  if(!c.scrollParents.length)assert.ok(c.inViewport,'fixed control clipped: '+JSON.stringify(c));
  if(!c.disabled&&c.inViewport&&c.inScrollport)assert.ok(c.centerHit,'control center occluded: '+c.id);
 }
 for(let i=0;i<shown.length;i++)for(let j=i+1;j<shown.length;j++)assert.ok(!intersects(shown[i].rect,shown[j].rect),'controls intersect: '+shown[i].id+' / '+shown[j].id);
 for(const title of m.titles){
  if(!m.modal)assert.ok(fits(title.rect,width,height),'location title clipped');
  if(fits(title.rect,width,height))for(const control of shown)assert.ok(!intersects(title.rect,control.rect),'title intersects control: '+title.id+' / '+control.id);
 }
}

async function runCase(browser,view,location,out,report,write,url){
 const item={name:view.name+'-'+location,viewport:view,location,passed:false,checks:[],screenshots:[],samples:[],layouts:[],inputs:[],errors:[],console:[],videoCapture:VIDEO_ENABLED?{enabled:true,status:'pending'}:{enabled:false,status:'unavailable',reason:'QA_VIDEO is not 1; this audit uses screenshots and measured UI/pixel evidence. No FFmpeg download is required.'}};
 report.cases.push(item);write();let context,page,cdp,video;
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const atlas=async()=>(await snap()).atlas;
 const check=label=>{item.checks.push(label);write();};
 try{
  context=await browser.newContext({viewport:{width:view.width,height:view.height},hasTouch:view.hasTouch,isMobile:false,deviceScaleFactor:1,...(VIDEO_ENABLED?{recordVideo:{dir:path.join(out,'videos'),size:{width:view.width,height:view.height}}}:{})});
  page=await context.newPage();video=page.video();page.setDefaultTimeout(20000);
  cdp=view.hasTouch?await context.newCDPSession(page):null;
  await page.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()});
  page.on('pageerror',e=>item.errors.push(String(e)));page.on('console',m=>{if(['warning','error'].includes(m.type()))item.console.push({type:m.type(),text:m.text()});});
  page.on('dialog',d=>{item.errors.push('Unexpected dialog: '+d.message());d.dismiss().catch(()=>{});});
  async function accessible(selector){
   const control=page.locator(selector);await control.scrollIntoViewIfNeeded();
   const box=await control.boundingBox();assert.ok(fits(box,view.width,view.height),'reachable control after scroll: '+selector);
   assert.equal(await control.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===el||el.contains(hit);}),true,'unoccluded action point: '+selector);
   return control;
  }
  async function click(selector){const control=await accessible(selector);if(cdp)await control.tap();else await control.click();}
  async function capture(label,{layout=true,active=true}={}){
   const name=item.name+'-'+label,s=await snap(),pixels=await page.evaluate(inspectCanvas),pixelCheck=assessPixels(pixels);
   item.samples.push({name,frame:s.frameNumber,location:s.atlas.state.location,pixels,pixelCheck});delete s.frameTimes;
   fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(s,null,2));await page.screenshot({path:path.join(out,name+'.jpg')});item.screenshots.push(name+'.jpg');write();
   assert.ok(pixelCheck.valid,name+': '+pixelCheck.reasons.join('; '));assert.ok(!s.render.blocked,name+' has no render failure');assert.deepEqual(s.errors,[]);
   if(active){assert.equal(s.atlas.active,true);assert.equal(s.atlas.state.location,location);assert.deepEqual(s.atlas.world.visibleLocations,[location]);}
   if(layout){const metrics=await page.evaluate(observeLayout);item.layouts.push({name,...metrics});write();validateLayout(metrics);}
  }
  async function touch(type,x,y){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:['touchEnd','touchCancel'].includes(type)?[]:[{id:7,x,y,radiusX:5,radiusY:5,force:.75}]});}
  async function down(selector){const b=await(await accessible(selector)).boundingBox(),point={x:b.x+b.width/2,y:b.y+b.height/2};if(cdp)await touch('touchStart',point.x,point.y);else{await page.mouse.move(point.x,point.y);await page.mouse.down();}return point;}
  async function release(cancel=false){if(cdp)await touch(cancel?'touchCancel':'touchEnd');else await page.mouse.up();}
  async function idle(){await page.waitForTimeout(220);const before=(await atlas()).state.player;await page.waitForTimeout(350);const after=await atlas();assert.deepEqual(after.held,[]);assert.deepEqual(after.touch,[]);assert.ok(Math.hypot(after.state.player.x-before.x,after.state.player.z-before.z)<.015,'released input does not keep walking');}
  async function mapReachable(){
   await page.locator('#modal[open]').waitFor();const count=await page.locator('[data-atlas-location]').count();assert.equal(count,3);
   item.mapScrolls??=[];
   for(const id of LOCATIONS){await accessible('[data-atlas-location="'+id+'"]');const m=await page.evaluate(observeLayout);validateLayout(m);item.mapScrolls.push({destination:id,modal:m.modal,control:m.controls.find(c=>c.id===id)||m.controls.find(c=>c.id.includes(id))||null});}
   if(view.height<500||view.width<500)assert.ok(item.mapScrolls.some(s=>s.modal.scrollHeight>s.modal.clientHeight+1),'small viewport map offers a genuine vertical scrollport');
  }
  async function walkToDais(){
   await click('#atlas-recenter');await page.locator('#scene canvas').focus();const began=Date.now();let keys=[];
   try{while(Date.now()-began<60000){
    const a=await atlas(),p=a.state.player,dx=-p.x,dz=-18-p.z,d=Math.hypot(dx,dz);if(d<1.2)return;
    const yaw=a.camera.yaw,r=dx*Math.cos(yaw)-dz*Math.sin(yaw),f=-dx*Math.sin(yaw)-dz*Math.cos(yaw);
    if(Math.abs(r)>Math.abs(f)*.4142)keys.push(r>0?'KeyD':'KeyA');if(Math.abs(f)>Math.abs(r)*.4142)keys.push(f>0?'KeyW':'KeyS');
    for(const key of keys)await page.keyboard.down(key);await page.waitForTimeout(d<2?100:190);for(const key of keys)await page.keyboard.up(key);keys=[];await page.waitForTimeout(35);
   }throw Error('Actual walk to observatory dais timed out: '+JSON.stringify((await atlas()).state.player));}
   finally{for(const key of keys)await page.keyboard.up(key);}
  }

  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  item.entry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.ok(item.entry);assert.ok(entryMatches(item.entry,process.env.EXPECTED_JS,url),'EXPECTED_JS does not match entry '+item.entry);
  const response=await page.request.get(new URL(item.entry,url).href);assert.ok(response.ok());item.entrySha256=sha(await response.body());
  await bindStyleIdentity(page,item,url);
  for(const key of ['entry','entrySha256','style','styleSha256']){if(report[key])assert.equal(item[key],report[key],'all cases test the same entry and stylesheet bytes');else report[key]=item[key];}
  await click('#cover-atlas');await mapReachable();await capture('cover-map',{layout:true,active:false});
  if(view.hasTouch)await click('[data-atlas-location="'+location+'"]');else{await page.locator('[data-atlas-location="'+location+'"]').focus();await page.keyboard.press('Enter');}await page.waitForFunction(id=>{const a=window.__SPRING__.snapshot().atlas;return a.active&&a.state.location===id;},location);await page.waitForTimeout(1300);
  assert.equal((await page.locator('#atlas-title').innerText()).trim(),TITLES[location]);await capture('entry');check('Cover map scrolls to every destination; actual button enters this independent rendered map');

  if(cdp){
   for(const direction of ['forward','back','left','right'])for(const cancel of [false,true]){
    const start=(await atlas()).state.player;await down('#atlas-move-'+direction);
    try{await page.waitForFunction(p=>{const a=window.__SPRING__.snapshot().atlas;return a.touch.length>0&&Math.hypot(a.state.player.x-p.x,a.state.player.z-p.z)>.02;},start,{timeout:8000});await page.waitForTimeout(120);}
    finally{await release(cancel);}
    await idle();item.inputs.push({kind:cancel?'touchCancel':'touchEnd',direction,after:await atlas()});
   }
   check('All four physical touch directions move; touchEnd and touchCancel both clear holds and stop horizontal motion');
  }else{
   const p=(await atlas()).state.player;
   await page.keyboard.down('KeyW');try{await page.waitForFunction(start=>{const p=window.__SPRING__.snapshot().atlas.state.player;return Math.hypot(p.x-start.x,p.z-start.z)>.03;},p);}finally{await page.keyboard.up('KeyW');}await idle();check('Native keyboard walking starts and releases without drift');
   await page.locator('#atlas-settings').focus();await page.keyboard.press('Enter');await page.locator('#close-modal').focus();await page.keyboard.press('Enter');const resumed=(await atlas()).state.player;await page.keyboard.down('KeyW');try{await page.waitForFunction(start=>{const p=window.__SPRING__.snapshot().atlas.state.player;return Math.hypot(p.x-start.x,p.z-start.z)>.03;},resumed,{timeout:8000});}finally{await page.keyboard.up('KeyW');}await idle();check('Keyboard-only map entry and settings return keep WASD usable without clicking the canvas');
  }
  if(location!=='observatory'){
   for(const cancel of cdp?[false,true]:[false]){
    await down('#atlas-special');try{await page.waitForFunction(()=>{const a=window.__SPRING__.snapshot().atlas;return a.touch.includes('action')&&(a.state.location==='meadow'?a.state.jumpHeld:a.state.calling);});await page.waitForTimeout(260);}finally{await release(cancel);}
    await page.waitForFunction(()=>{const a=window.__SPRING__.snapshot().atlas;return !a.touch.length&&!a.held.length&&!a.state.calling&&!a.state.jumpHeld;});
    if(location==='meadow')await page.waitForFunction(()=>window.__SPRING__.snapshot().atlas.state.player.grounded,null,{timeout:12000});
    assert.equal(await page.locator('#atlas-special').getAttribute('aria-pressed'),'false');
   }
   check('Actual special hold activates and releases; touch cancellation leaves no call or jump held');
  }
  const drag=await page.evaluate(()=>{
   for(const y of [.43,.53,.63])for(const x of [.55,.65,.75]){
    const start={x:innerWidth*x,y:innerHeight*y},end={x:start.x+Math.min(80,innerWidth*.15),y:start.y+18};
    if([0,.25,.5,.75,1].every(t=>document.elementFromPoint(start.x+(end.x-start.x)*t,start.y+(end.y-start.y)*t)?.tagName==='CANVAS'))return{start,end};
   }return null;
  });assert.ok(drag,'unobstructed canvas path available for actual orbit');
  const cameraBefore=(await atlas()).camera;
  if(cdp)await touch('touchStart',drag.start.x,drag.start.y);else{await page.mouse.move(drag.start.x,drag.start.y);await page.mouse.down({button:'right'});}
  try{for(let i=1;i<=12;i++){const x=drag.start.x+(drag.end.x-drag.start.x)*i/12,y=drag.start.y+(drag.end.y-drag.start.y)*i/12;if(cdp)await touch('touchMove',x,y);else await page.mouse.move(x,y);await page.waitForTimeout(15);}}
  finally{if(cdp)await touch('touchEnd');else await page.mouse.up({button:'right'});}
  const cameraAfter=(await atlas()).camera;assert.ok(Math.abs(cameraAfter.yaw-cameraBefore.yaw)>.08,'drag actually orbits camera');await click('#atlas-recenter');assert.equal((await atlas()).camera.yaw,0);await capture('input-and-orbit');check('Native canvas drag changes camera azimuth and visible recenter restores it');

  if(location==='observatory'){
   await walkToDais();const before=(await atlas()).state;assert.ok(Math.hypot(before.player.x,before.player.z+18)<3.8);
   await click('#atlas-primary');await page.waitForFunction(()=>window.__SPRING__.snapshot().atlas.state.stargazing);
   await page.locator('#atlas-star-tools').waitFor({state:'visible'});for(const id of ['atlas-star-0','atlas-star-1','atlas-star-2','atlas-star-3','atlas-star-4','atlas-star-5','atlas-undo','atlas-look-down'])await accessible('#'+id);
   await page.waitForTimeout(400);const {ATLAS_STARS}=await import(pathToFileURL(path.join(ROOT,'src/atlas-content.js')).href);
   item.projectedStars=await page.evaluate(stars=>stars.map(star=>{const p=window.__SPRING__.project(star.x,star.y,star.z),hit=document.elementFromPoint(p.x,p.y);return{id:star.id,world:{x:star.x,y:star.y,z:star.z},x:p.x,y:p.y,inViewport:Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.y>=0&&p.x<innerWidth&&p.y<innerHeight,hitTag:hit?.tagName||null,hitId:hit?.id||null};}),ATLAS_STARS);write();
   assert.equal(item.projectedStars.length,6);for(const star of item.projectedStars){assert.equal(star.inViewport,true,'world star '+star.id+' is inside viewport');assert.equal(star.hitTag,'CANVAS','world star '+star.id+' is not obscured by the toolbar or UI');}
   check('All six real world star projections fit the viewport and hit the canvas at their centers');
   await capture('real-study-controls');await click('#atlas-star-0');assert.deepEqual((await atlas()).state.stars,[0]);await click('#atlas-undo');assert.deepEqual((await atlas()).state.stars,[]);
   await click('#atlas-look-down');assert.equal((await atlas()).state.stargazing,false);check('Walked to dais, entered study via visible action, connected and undid one star through actual controls');
  }
  await click('#atlas-map');await mapReachable();await click('[data-atlas-location="'+location+'"]');await page.waitForTimeout(500);await idle();
  const beforeCover=(await atlas()).state;await click('#home');await page.locator('#cover').waitFor({state:'visible'});assert.equal((await atlas()).active,false);
  await click('#continue');await page.waitForFunction(id=>{const a=window.__SPRING__.snapshot().atlas;return a.active&&a.state.location===id;},location);await page.waitForTimeout(600);
  assert.deepEqual((await atlas()).state.completed,beforeCover.completed);check('Return to cover and Continue retain the visited place and its earned completion state');
  const storagePath=path.join(out,item.name+'-earned-storage.json');await context.storageState({path:storagePath});const storageBytes=fs.readFileSync(storagePath);item.storage={file:path.basename(storagePath),sha256:sha(storageBytes)};
  const stored=JSON.parse(storageBytes),archive=stored.origins.flatMap(o=>o.localStorage).find(e=>e.name==='spring-letter:archive:v1');assert.ok(archive,'UI actions wrote the actual archive');assert.equal(JSON.parse(JSON.parse(archive.value).data.journey).atlas.location,location);
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  const reloadEntry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.equal(reloadEntry,item.entry,'reload entry must stay bound to the same artifact');
  const reloadResponse=await page.request.get(new URL(reloadEntry,url).href);assert.ok(reloadResponse.ok());item.reloadEntrySha256=sha(await reloadResponse.body());assert.equal(item.reloadEntrySha256,item.entrySha256,'reload must not silently switch build bytes');const reloadStyle=await readStyleIdentity(page,url);item.reloadStyle=reloadStyle.style;item.reloadStyleSha256=reloadStyle.styleSha256;sameStyleIdentity(reloadStyle,item);await click('#continue');
  await page.waitForFunction(id=>{const a=window.__SPRING__.snapshot().atlas;return a.active&&a.state.location===id;},location);await page.waitForTimeout(900);await idle();await capture('continued-after-reload');check('Reload resumes from real persisted storage with no injected progress or stale held input');
  assert.deepEqual(item.errors,[]);item.consoleReview=classifyConsole(item.console);assert.deepEqual(item.consoleReview.blocking,[]);item.passed=true;console.log('PASS '+item.name);
 }catch(error){item.error=String(error.stack||error);console.error('FAIL '+item.name+': '+error.message);if(page){const file=item.name+'-failure.jpg';await page.screenshot({path:path.join(out,file)}).then(()=>item.screenshots.push(file)).catch(()=>{});item.final=await snap().catch(()=>null);if(item.final)delete item.final.frameTimes;}}
 finally{await context?.close().catch(e=>{item.passed=false;item.cleanupError=String(e);});if(video){item.video=await video.path().then(file=>path.relative(out,file).replaceAll('\\','/')).catch(()=>null);item.videoCapture.status=item.video?'captured':'unavailable';if(!item.video){item.passed=false;item.recordingError='Requested video was not captured';}}write();}
}

async function main(){
 const url=process.env.SPRING_URL||'http://127.0.0.1:5193/',out=path.join(ROOT,'evidence/v12/layout-'+new Date().toISOString().replace(/[:.]/g,'-'));
 fs.mkdirSync(out,{recursive:true});const report={started:new Date().toISOString(),url,expectedEntry:process.env.EXPECTED_JS||null,passed:false,scope:'Nine fresh isolated headless Edge cases; cover/map buttons, keyboard/mouse/CDP touch, real archive saves, read-only snapshots and pixels. No progress injection.',limitations:['Touch is Chromium emulation, not physical phone hardware.','Layout rectangles, pixels and captured video support review but do not certify artistic quality.','Study is entered after an actual walk; only one star and undo are exercised here. Full puzzle completion belongs to the separate playthrough.'],cases:[]};
 const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));let browser;
 try{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});for(const view of VIEWS)for(const location of LOCATIONS)await runCase(browser,view,location,out,report,write,url);report.passed=report.cases.length===9&&report.cases.every(c=>c.passed);assert.ok(report.passed,'one or more atlas layout/input cases failed');}
 catch(error){report.error=String(error.stack||error);process.exitCode=1;}
 finally{await browser?.close().catch(e=>{report.passed=false;report.cleanupError=String(e);process.exitCode=1;});report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:report.passed,out,cases:report.cases.length,entry:report.entry,entrySha256:report.entrySha256}));}
}
module.exports={entryMatches,fits,intersects,validateLayout};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
