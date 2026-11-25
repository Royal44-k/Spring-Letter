/**
 * SERIAL GPU CHECK — does not start a server. Use only after the earned coastal
 * playthrough has passed. Fixtures are immutable storageState files; only origin
 * URLs are retargeted. All actions use browser input, never progress injection.
 * Required: EARNED_DIR. Optional: SPRING_URL, EXPECTED_JS, EXPECTED_CSS.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {inspectCanvas,assessPixels,summarizeRgba,classifyConsole}=require('./v10-pixel-validation.cjs');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5193/';
const out=path.join(root,'evidence/v11/layout-'+new Date().toISOString().replace(/[:.]/g,'-'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const archiveKey='spring-letter:archive:v1',fixtures={};
const views=[{name:'desktop',width:1440,height:900,hasTouch:false},{name:'portrait-touch',width:390,height:844,hasTouch:true},{name:'landscape-touch',width:844,height:390,hasTouch:true}];
const stages=['writing','rigging','sailing','complete'];
const report={started:new Date().toISOString(),url,passed:false,scope:'Isolated headless Edge, 12 resumed earned stage/view cases. Native keyboard, mouse and CDP touch input. Readonly DOM and game snapshots plus actual canvas pixels. Scrollable-paper descendants may start outside their scrollport; actionability is proved after scrolling. Not physical-phone testing, not a blind usability trial, and not a replacement for the complete fresh journey.',limitations:['Touch is Chromium emulation; mobile OS keyboards, browser chrome and physical device GPU behavior are not covered.','The saved stage fixtures are earned by the separately passing playthrough, rather than constructed by this layout audit.','Screenshots and pixel statistics detect rendering failures and support review; they do not independently certify artistic quality.'],fixtures:{},cases:[],errors:[]};
fs.mkdirSync(out,{recursive:true});
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const snap=page=>page.evaluate(()=>window.__SPRING__.snapshot());
const voyage=async page=>(await snap(page)).voyage;
const exactRect=(r,w,h)=>r&&r.width>0&&r.height>0&&r.x>=-.6&&r.y>=-.6&&r.x+r.width<=w+.6&&r.y+r.height<=h+.6;

// This is read-only. Offscreen descendants of explicitly scrollable paper are
// reported separately; they are NOT falsely counted as visible usable controls.
function observeLayout(){
 const viewport={width:innerWidth,height:innerHeight},r=el=>{const v=el.getBoundingClientRect();return {x:v.x,y:v.y,width:v.width,height:v.height,right:v.right,bottom:v.bottom};};
 const visible=el=>el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})&&!el.closest('[hidden]');
 const candidates=[...document.querySelectorAll('#voyage-ui button,#voyage-ui input,#voyage-ui textarea,#voyage-ui summary,header button')];
 const controls=candidates.filter(visible).map(el=>{
  const box=r(el),scrollParent=el.closest('#voyage-editor,#voyage-old-letter,#voyage-bag-panel,#voyage-ending'),parentBox=scrollParent?r(scrollParent):null;
  const inert=!!el.closest('[inert]'),center={x:box.x+box.width/2,y:box.y+box.height/2};
  const hit=document.elementFromPoint(center.x,center.y),inViewport=box.x>=-.6&&box.y>=-.6&&box.right<=innerWidth+.6&&box.bottom<=innerHeight+.6;
  const inScrollport=!parentBox||(box.y>=parentBox.y-.6&&box.bottom<=parentBox.bottom+.6);
  return {id:el.id||el.getAttribute('aria-label')||el.dataset.vHold||el.textContent.trim().slice(0,45),tag:el.tagName,text:el.textContent.trim().slice(0,90),rect:box,disabled:!!el.disabled,inert,inViewport,inScrollport,centerHit:!!hit&&(hit===el||el.contains(hit)),hit:hit?.id||hit?.className||hit?.tagName,scrollParent:scrollParent?.id||null,parentRect:parentBox,parentScrollable:!!scrollParent&&scrollParent.scrollHeight>scrollParent.clientHeight+1};
 });
 const panels=[...document.querySelectorAll('#voyage-editor,#voyage-old-letter,#voyage-bag-panel,#voyage-ending')].filter(visible).map(el=>({id:el.id,rect:r(el),scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollTop:el.scrollTop}));
 return {viewport,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,controls,panels,activeElement:document.activeElement?.id||document.activeElement?.tagName};
}

function validateLayout(metrics){
 assert.ok(metrics.documentWidth<=metrics.viewport.width+1&&metrics.bodyWidth<=metrics.viewport.width+1,'page has no horizontal overflow');
 for(const p of metrics.panels){assert.ok(exactRect(p.rect,metrics.viewport.width,metrics.viewport.height),p.id+' outer scrollport fits viewport');assert.ok(p.scrollWidth<=p.clientWidth+1,p.id+' has no horizontal text overflow');}
 for(const c of metrics.controls){
  if(c.inert)continue;
  const horizontal=c.rect.x>=-.6&&c.rect.right<=metrics.viewport.width+.6;
  assert.ok(horizontal,'control extends horizontally outside viewport: '+JSON.stringify(c));
  if(c.scrollParent){assert.ok(c.rect.x>=c.parentRect.x-.6&&c.rect.right<=c.parentRect.right+.6,'paper control overflows its scrollport width: '+JSON.stringify(c));}
  else assert.ok(c.inViewport,'fixed control is clipped by viewport: '+JSON.stringify(c));
  if(!c.disabled&&c.inViewport&&c.inScrollport)assert.ok(c.centerHit,'visible control center is occluded: '+JSON.stringify(c));
 }
}

async function fixtureInventory(){
 assert.ok(process.env.EARNED_DIR,'EARNED_DIR must identify an actually passed full/coastal playthrough directory');
 const dir=path.resolve(root,process.env.EARNED_DIR),proofBytes=fs.readFileSync(path.join(dir,'report.json')),proof=JSON.parse(proofBytes);
 assert.equal(proof.passed,true,'fixture playthrough report must have passed');
 report.earnedProof={path:path.join(dir,'report.json'),sha256:sha(proofBytes),entry:proof.entry||null,finished:proof.finished||null};
 for(const name of ['writing','old-letter','island','rigging','sailing','dawn','complete']){
  const file=path.join(dir,'earned-'+name+'.json'),bytes=fs.readFileSync(file),storage=JSON.parse(bytes),origins=storage.origins.filter(o=>o.localStorage.some(e=>e.name===archiveKey));
  assert.equal(origins.length,1,name+' has one authoritative archive origin');
  const origin=origins[0],archive=JSON.parse(origin.localStorage.find(e=>e.name===archiveKey).value),state=JSON.parse(archive.data.journey);
  assert.ok(state.started&&state.bridge.solved,name+' is earned after the existing journey');
  assert.equal(state.voyage.stage,name==='old-letter'?'tide':name,name+' stage matches its fixture');
  assert.ok(state.voyage.letter.sealed&&state.voyage.letter.body.trim(),name+' contains the earned personal letter');
  if(name!=='writing')assert.ok(state.voyage.predecessor,name+' contains the collected predecessor letter');
  fixtures[name]={bytes,storage,state,origin};report.fixtures[name]={path:file,sha256:sha(bytes),origin:origin.origin,stage:state.voyage.stage,distance:state.voyage.distance};
 }
 write();
}

async function runCase(browser,viewport,stage){
 const record={name:viewport.name+'-'+stage,viewport,stage,passed:false,checks:[],screenshots:[],samples:[],layouts:[],errors:[],console:[]};report.cases.push(record);write();
 let context,page,cdp;
 const check=text=>{record.checks.push(text);write();};
 try{
  const fixture=fixtures[stage],storage=structuredClone(fixture.storage),origin=storage.origins.find(o=>o.localStorage.some(e=>e.name===archiveKey));origin.origin=new URL(url).origin;
  assert.deepEqual(origin.localStorage,fixture.origin.localStorage,'only fixture origin can change');
  context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},hasTouch:viewport.hasTouch,isMobile:false,deviceScaleFactor:1,storageState:storage,acceptDownloads:true});
  page=await context.newPage();page.setDefaultTimeout(20000);cdp=viewport.hasTouch?await context.newCDPSession(page):null;
  await page.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()});
  page.on('pageerror',e=>record.errors.push(String(e)));page.on('console',m=>{if(['error','warning'].includes(m.type()))record.console.push({type:m.type(),text:m.text()});});
  page.on('dialog',d=>{record.errors.push('Unexpected dialog: '+d.message());d.dismiss().catch(()=>{});});
  const prefix=record.name;
  async function capture(label,{layout=true}={}){
   const s=await snap(page),pixels=await page.evaluate(inspectCanvas),pixelCheck=assessPixels(pixels),name=prefix+'-'+label;
   record.samples.push({name,stage:s.voyage.stage,frame:s.frameNumber,pixels,pixelCheck});delete s.frameTimes;
   fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(s,null,2));await page.screenshot({path:path.join(out,name+'.jpg')});record.screenshots.push(name+'.jpg');write();
   assert.ok(pixelCheck.valid,name+': '+pixelCheck.reasons.join('; '));
   assert.ok(!s.render.blocked&&s.voyage.active,name+' still shows active rendered voyage');
   if(layout){const metrics=await page.evaluate(observeLayout);record.layouts.push({name,...metrics});write();validateLayout(metrics);}
  }
  async function accessible(selector){
   const locator=page.locator(selector);await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();assert.ok(exactRect(box,viewport.width,viewport.height),selector+' is accessible after browser scrolling');
   assert.equal(await locator.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===el||el.contains(hit);}),true,selector+' is not occluded at its action point');return locator;
  }
  async function click(selector){const l=await accessible(selector);if(viewport.hasTouch)await l.tap();else await l.click();}
  async function touch(type,x,y){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:['touchEnd','touchCancel'].includes(type)?[]:[{x,y,id:7,radiusX:5,radiusY:5,force:.75}]});}
  async function down(x,y){if(cdp)await touch('touchStart',x,y);else{await page.mouse.move(x,y);await page.mouse.down();}}
  async function move(x,y){if(cdp)await touch('touchMove',x,y);else await page.mouse.move(x,y);}
  async function up(cancel=false){if(cdp)await touch(cancel?'touchCancel':'touchEnd');else await page.mouse.up();}
  async function drag(from,to){await down(from.x,from.y);try{for(let i=1;i<=12;i++){await move(from.x+(to.x-from.x)*i/12,from.y+(to.y-from.y)*i/12);await page.waitForTimeout(14);}}finally{await up();}}
  async function bagPause(){
   await click('#voyage-bag');await page.locator('#voyage-bag-panel').waitFor({state:'visible'});
   const before=(await voyage(page)).state;await page.keyboard.press('KeyW');await page.keyboard.press('KeyF');
   for(let i=0;i<4;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('#voyage-bag-panel')),true,'bag keyboard focus stays inside dialog');}
   await page.waitForTimeout(500);const after=await voyage(page);assert.equal(after.state.distance,before.distance);assert.deepEqual(after.state.player,before.player);assert.deepEqual(after.held,[]);assert.deepEqual(after.touchHeld,[]);
   await capture('bag-paused');await click('#voyage-bag-close');assert.equal((await voyage(page)).bagOpen,false);check('信袋暂停移动且键盘焦点不逸出；收信不丢失进度');
  }
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  record.entry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.ok(record.entry);
  if(process.env.EXPECTED_JS)assert.equal(path.posix.basename(record.entry),path.posix.basename(process.env.EXPECTED_JS));
  record.style=await page.locator('link[rel=stylesheet][href]').last().getAttribute('href').catch(()=>null);
  if(process.env.EXPECTED_CSS)assert.equal(path.posix.basename(record.style),path.posix.basename(process.env.EXPECTED_CSS));
  const response=await page.request.get(new URL(record.entry,url).href);assert.ok(response.ok());record.entrySha256=sha(await response.body());
  for(const key of ['entry','entrySha256']){if(report[key])assert.equal(record[key],report[key],'all cases test identical entry bytes');else report[key]=record[key];}
  await click('#continue');await page.waitForFunction(expected=>window.__SPRING__.snapshot().voyage.active&&window.__SPRING__.snapshot().voyage.stage===expected,stage);await page.waitForTimeout(1100);
  assert.equal((await voyage(page)).state.letter.body,fixture.state.voyage.letter.body);await capture('resumed');
  if(stage==='writing'){
   assert.ok((await voyage(page)).state.letter.sealed);await click('#voyage-reopen');assert.equal((await voyage(page)).state.letter.sealed,false);
   await click('#voyage-recipient');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'voyage-body','native Tab reaches body from recipient');
   const recipient=fixture.state.voyage.letter.recipient,body=fixture.state.voyage.letter.body+'\n愿下一封信，也带着花香。';
   await page.locator('#voyage-recipient').fill(recipient);await page.locator('#voyage-body').fill(body);await page.locator('#voyage-body').press('End');await page.keyboard.press('KeyW');
   assert.equal((await voyage(page)).stage,'writing');assert.deepEqual((await voyage(page)).held,[],'typing movement letters does not move player');
   await page.locator('#voyage-body').fill(body);await accessible('#voyage-seal');await accessible('#voyage-envelope');
   let box=await page.locator('#voyage-seal').boundingBox(),start={x:box.x+box.width*.22,y:box.y+box.height*.5};
   await drag(start,{x:Math.max(5,box.x-60),y:Math.max(90,box.y-35)});await page.waitForTimeout(180);assert.equal((await voyage(page)).state.letter.sealed,false,'dropping outside envelope must not seal');check('花印拖到信封外不会误封缄');
   await accessible('#voyage-seal');box=await page.locator('#voyage-seal').boundingBox();const envelope=await page.locator('#voyage-envelope').boundingBox();assert.ok(exactRect(envelope,viewport.width,viewport.height),'envelope and seal can be reached in same scrollport');
   await drag({x:box.x+box.width*.22,y:box.y+box.height*.5},{x:envelope.x+envelope.width*.5,y:envelope.y+envelope.height*.5});
   await page.waitForFunction(()=>window.__SPRING__.snapshot().voyage.state.letter.sealed);await accessible('#voyage-reopen');await accessible('#voyage-leave-desk');await capture('sealed-by-drag');
   assert.equal((await voyage(page)).state.letter.body,body);check('亲笔输入、Tab 顺序、印章拖入封缄及滚动后的拆信和离桌按钮可用');
   await bagPause();await click('#voyage-leave-desk');await page.waitForFunction(()=>window.__SPRING__.snapshot().voyage.stage==='tide');await capture('left-writing');
  }else if(stage==='rigging'){
   const initial=(await voyage(page)).state;assert.ok(initial.sail>0&&initial.sail<.8,'earned rigging fixture leaves room to exercise real partial hoisting and cancellation');
   if(!viewport.hasTouch){
    const cameraBefore=(await snap(page)).camera;
    for(const [button,id]of [['right','rope-right'],['middle','halyard']]){const target=(await voyage(page)).interactables.find(t=>t.id===id),point=await page.evaluate(v=>window.__SPRING__.project(...v),target.position);const before=(await voyage(page)).state;await page.mouse.move(point.x,point.y);await page.mouse.down({button});await page.mouse.move(point.x+55,point.y+40,{steps:12});await page.mouse.up({button});await page.waitForTimeout(250);const after=(await voyage(page)).state;assert.deepEqual(after.ropes,before.ropes,'orbit must not untie ropes');assert.equal(after.sail,before.sail,'orbit must not raise sail');}
    const cameraAfter=(await snap(page)).camera;assert.ok(Math.hypot(...cameraAfter.map((v,i)=>v-cameraBefore[i]))>.1,'right drag actually orbits the rigging view');
    await click('#voyage-recenter');await page.waitForTimeout(1600);const target=(await voyage(page)).interactables.find(t=>t.id==='rope-right'),point=await page.evaluate(v=>window.__SPRING__.project(...v),target.position);assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.tagName,point),'CANVAS','recenter exposes the rope without DOM controls over it');await page.mouse.move(point.x,point.y);await page.mouse.down();assert.equal((await voyage(page)).drag?.object,'rope-right','primary down picks the visible rope');await page.mouse.move(point.x+50,point.y+20,{steps:12});await page.mouse.up();assert.equal((await voyage(page)).state.ropes[1],true,'primary drag still unties the actual rope');check('右键和中键环看不改变缆绳或船帆；左键场景拖动仍能解缆');
   }
   for(const [index,id]of [[0,'#voyage-rope-left'],[1,'#voyage-rope-right']])if(!(await voyage(page)).state.ropes[index])await click(id);
   assert.deepEqual((await voyage(page)).state.ropes,[true,true]);await accessible('#voyage-hoist');
   for(const cancel of [false,true]){
    const before=(await voyage(page)).state.sail,box=await page.locator('#voyage-hoist').boundingBox();await down(box.x+box.width*.5,box.y+box.height*.5);
    try{await page.waitForTimeout(320);await page.waitForFunction(start=>window.__SPRING__.snapshot().voyage.state.sail>start+.025,before,{timeout:7000});if(cancel&&!cdp)await move(5,Math.max(80,box.y-50));}finally{await up(cancel);}
    const released=(await voyage(page)).state.sail;await page.waitForTimeout(450);const stopped=await voyage(page);assert.equal(stopped.state.sail,released,'released/cancelled hoist must stop exactly');assert.deepEqual(stopped.touchHeld,[]);assert.deepEqual(stopped.held,[]);
   }
   await capture('hoist-released-and-cancelled');check('原存档缆绳续接，实际长按升帆、释放与触屏取消均不残留按住状态');await bagPause();
  }else if(stage==='sailing'){
   await accessible('#voyage-trim');await page.locator('#voyage-trim').focus();await page.keyboard.press('Home');assert.equal((await voyage(page)).state.trim,-1);await page.keyboard.press('End');assert.equal((await voyage(page)).state.trim,1);
   const range=await page.locator('#voyage-trim').boundingBox();await drag({x:range.x+range.width*.8,y:range.y+range.height*.5},{x:range.x+range.width*.25,y:range.y+range.height*.5});assert.ok((await voyage(page)).state.trim<0,'pointer/touch slider changes real trim');
   await capture('trim-inputs');check('帆角滑条接受键盘端点和实际指针/触屏拖动');
   await page.locator('#scene canvas').focus();await page.keyboard.down('KeyD');await page.waitForTimeout(200);await bagPause();await page.keyboard.up('KeyD');
   const after=await voyage(page);assert.deepEqual(after.held,[]);assert.deepEqual(after.touchHeld,[]);const heading=after.state.boat.heading;await page.waitForTimeout(400);assert.equal((await voyage(page)).state.boat.heading,heading,'opening bag cleared held steering');
   await capture('sailing-unblocked');
  }else{
   await page.locator('#voyage-ending').waitFor({state:'visible'});assert.equal(await page.locator('#voyage-end-body').innerText(),fixture.state.voyage.letter.body);
   for(const id of ['#voyage-download','#voyage-watch-sea','#voyage-end-photo','#voyage-end-return'])await accessible(id);
   await capture('ceremony-scrolled');await click('#voyage-watch-sea');assert.equal(await page.locator('#voyage-ending').isVisible(),false);const z=(await voyage(page)).world.boat[2];
   await page.waitForFunction(before=>window.__SPRING__.snapshot().voyage.world.boat[2]<before-.05,z,{timeout:10000});assert.equal((await voyage(page)).state.distance,150,'ending cinema does not change earned route length');
   await capture('open-sea-moving');await bagPause();await click('#voyage-show-ending');await page.locator('#voyage-ending').waitFor({state:'visible'});await capture('ceremony-reopened');check('终章文字与全部按钮可滚动抵达，退出仪式后船继续前行，且可重新打开仪式');
   await click('#voyage-end-return');await page.waitForTimeout(1500);assert.equal((await voyage(page)).active,false);assert.equal((await snap(page)).focus,null);assert.ok(assessPixels(await page.evaluate(inspectCanvas)).valid,'return to garden restores actual picture');await page.screenshot({path:path.join(out,record.name+'-returned-garden.jpg')});
   await page.locator('#scene canvas').focus();await page.keyboard.press('KeyM');await page.locator('#map-voyage').scrollIntoViewIfNeeded();assert.equal(await page.locator('.spring-itinerary li').count(),9);await page.locator('#map-voyage').click();await page.locator('#voyage-ending').waitFor({state:'visible'});await capture('return-to-coast');check('重访花庭恢复画面与输入，九段地图可回到既有终章');

  }
  assert.deepEqual(record.errors,[]);record.consoleReview=classifyConsole(record.console);assert.deepEqual(record.consoleReview.blocking,[],'no unreviewed WebGL/browser warnings');record.passed=true;console.log('PASS '+record.name);
 }catch(error){record.error=String(error.stack||error);console.error('FAIL '+record.name+': '+error.message);if(page){const file=record.name+'-failure.jpg';await page.screenshot({path:path.join(out,file)}).then(()=>record.screenshots.push(file)).catch(()=>{});record.final=await snap(page).catch(()=>null);if(record.final)delete record.final.frameTimes;}}
 finally{await context?.close();write();}
}

(async()=>{let browser;try{await fixtureInventory();browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});for(const viewport of views)for(const stage of stages)await runCase(browser,viewport,stage);report.passed=report.cases.length===12&&report.cases.every(c=>c.passed);assert.ok(report.passed,'one or more coastal layout/input cases failed');}catch(error){report.error=String(error.stack||error);process.exitCode=1;}finally{await browser?.close();report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:report.passed,out,cases:report.cases.length,entry:report.entry}));}})();
