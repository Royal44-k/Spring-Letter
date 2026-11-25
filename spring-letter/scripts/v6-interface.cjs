const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),evidence=path.join(root,'evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5194';
const report={date:new Date().toISOString(),url,checks:[],captures:[],observations:[],errors:[],scope:'Isolated desktop Edge and Chromium touch emulation, ordinary UI, key, mouse and actual CDP touch input. Readonly snapshots. No physical-phone, OS fullscreen, or driver-cold-cache guarantee.'};
const write=()=>fs.writeFileSync(path.join(evidence,'v6-interface.json'),JSON.stringify(report,null,2));
function observeErrors(page,errors){
 page.on('pageerror',error=>errors.push(error.stack||String(error)));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
}
async function runInterface(){
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 let context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const observe=()=>observeErrors(page,report.errors);observe();
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const ready=async()=>{await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden'});};
 const capture=async name=>{const file='v6-interface-'+name+'.png';await page.screenshot({path:path.join(evidence,file)});report.captures.push(file);};
 const check=(name)=>{report.checks.push(name);write();console.log('PASS '+name);};
 try{
  await page.goto(url);await page.waitForTimeout(700);await capture('00-loading');await ready();
  report.build={entry:await page.locator('script[type=module]').getAttribute('src'),styleBuild:await page.locator('link[rel=stylesheet]').getAttribute('href')};assert.match(report.build.entry,/^\/assets\//);
  const prepared=await snap();report.loading=prepared.loadingTiming;assert.ok(prepared.environment&&prepared.outdoorEnvironment&&prepared.stoneTextures&&prepared.landscapeTextures);assert.equal(prepared.depthPass,true);assert.equal(prepared.reflection,true);check('actual cover keeps local HDR, surface maps, contact depth and water reflection active');await capture('01-cover');
  await page.locator('#gallery').click();await page.waitForTimeout(1200);await capture('02-silver');
  const first=await snap(),started=Date.now();await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');
  assert.equal(await page.locator('#flower-cycle-label').textContent(),'逐风而行');assert.equal(await page.locator('#flower-burst').isDisabled(),true);await capture('03-first-drift');
  await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:18000});
  const returned=await snap(),frames=returned.frameTimes.slice(-Math.min(returned.frameNumber-first.frameNumber,returned.frameTimes.length));
  report.observations.push({kind:'first automatic cycle',seconds:(Date.now()-started)/1000,frames:frames.length,maxIntervalMs:Math.max(...frames)});
  assert.equal(await page.locator('#flower-cycle-label').textContent(),'花的形体');check('first gallery burst, phase hint, disabled action and automatic return stay synchronized');
  for(const material of ['crystal','lily','amber','celadon']){
   await page.locator(`[data-material=${material}]`).click();await page.waitForTimeout(850);await capture('solid-'+material);
   await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');await page.waitForTimeout(1300);await capture('dust-'+material);
   await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:18000});
  }
  check('five series rendered as solids and corresponding source-coloured dust in the full game');
  for(const form of ['lotus','iris','dahlia']){await page.locator(`[data-form=${form}]`).click();await page.waitForTimeout(900);await capture('form-'+form);assert.equal((await snap()).flowerForm,form);}
  check('all four actual flower forms remain selectable in the full game');
  await page.locator('[data-material=amber]').click();await page.reload();await ready();await page.locator('#gallery').click();
  assert.equal((await snap()).flowerForm,'dahlia');assert.equal((await snap()).material,'amber');check('direct gallery reload restores saved flower and series without starting a journey');
  await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');await page.locator('#settings').click();
  await page.waitForTimeout(250);const paused=await snap();await page.waitForTimeout(1800);assert.equal((await snap()).flowerCycle.age,paused.flowerCycle.age);assert.equal((await snap()).audio.voices,0);await page.locator('#close-modal').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:18000});check('settings pauses the real flower lifecycle and audio; it resumes and returns afterwards');
  await page.locator('#fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement);assert.equal(await page.locator('#fullscreen').getAttribute('aria-pressed'),'true');await page.locator('#fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement);check('visible fullscreen button enters and exits the actual browser Fullscreen API');
  await page.locator('#home').click();await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(350);
  const before=await snap();await page.keyboard.down('KeyD');await page.waitForTimeout(1100);await page.keyboard.up('KeyD');const after=await snap();assert.ok(after.state.player.x-before.state.player.x>2.5);assert.ok(Math.abs(after.state.player.z-before.state.player.z)<.15);assert.ok(Math.abs(after.view.azimuth-before.view.azimuth)>.2);await capture('follow-camera');report.observations.push({kind:'continuous travel',before:before.state.player,after:after.state.player,yawBefore:before.view.azimuth,yawAfter:after.view.azimuth});check('continuous travel stays straight while automatic camera yaw follows behind the moving character');
  const storage=await context.storageState();await context.close();context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,storageState:storage});page=await context.newPage();observe();await page.goto(url);await ready();await page.locator('#gallery').tap();await page.waitForTimeout(1300);await capture('portrait-default');
  const boxes=await page.evaluate(()=>['context','gallery-tabs','controls'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {id,left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));assert.ok(boxes.every(b=>b.left>=0&&b.right<=390));
  assert.ok(boxes[0].bottom+4<boxes[1].top&&boxes[1].bottom+4<boxes[2].top);check('portrait flower panel, gallery tabs and footer have distinct nonoverlapping vertical spaces');
  const cdp=await context.newCDPSession(page),touchBefore=await snap();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:120,y:170,id:1},{x:240,y:170,id:2}]});
  for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120+i*2,y:170+i,id:1},{x:240+i*6,y:170+i,id:2}]});await page.waitForTimeout(35);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(900);
  const touchAfter=await snap();assert.ok(Math.abs(touchAfter.view.azimuth-touchBefore.view.azimuth)>.1);assert.ok(touchAfter.view.radius/touchAfter.view.fittedRadius<.9);assert.equal(touchAfter.flowerCycle.cycles,touchBefore.flowerCycle.cycles);assert.equal(touchAfter.gesture.active,false);check('two real touch points orbit and zoom without accidental bursting or stuck wind input');await capture('portrait-orbit');
  await page.locator('#flower-burst').tap();await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');await capture('portrait-drift');assert.equal(await page.locator('#flower-cycle-label').textContent(),'逐风而行');check('touch burst remains reachable after pinch and updates its live label');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(report.errors,[]);assert.deepEqual((await snap()).errors,[]);
  const finalEntry=await page.locator('script[type=module]').getAttribute('src'),finalStyle=await page.locator('link[rel=stylesheet]').getAttribute('href');assert.equal(finalEntry,report.build.entry);assert.equal(finalStyle,report.build.styleBuild);report.build.finalEntry=finalEntry;report.build.finalStyleBuild=finalStyle;
  report.build.sha256=crypto.createHash('sha256').update(await (await page.request.get(url+finalEntry)).body()).digest('hex');report.passed=true;write();console.log('COMPLETE '+report.checks.length+' checks');
 }catch(error){report.failure=error.stack;report.passed=false;await capture('failure').catch(()=>{});write();throw error;}finally{await context.close();await browser.close();}
}
if(require.main===module)runInterface().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={observeErrors};
