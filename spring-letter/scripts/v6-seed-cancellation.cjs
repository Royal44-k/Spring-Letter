/* Browser protocol cancellation regression, starting from an earned v6 checkpoint. */
const {chromium}=require('playwright');const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');const {harness}=require('./v6-input-helpers.cjs');
const evidence=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5194',source=path.join(evidence,'v6-main-before-wind-storage.json');
(async()=>{
 assert.ok(fs.existsSync(source),'run the fresh v6 main path first to earn this checkpoint');
 const storage=JSON.parse(fs.readFileSync(source));storage.origins=storage.origins.map(o=>({...o,origin:url}));
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});const context=await browser.newContext({viewport:{width:1440,height:900},hasTouch:true,storageState:storage});const page=await context.newPage(),cdp=await context.newCDPSession(page),h=harness(page,{evidence,prefix:'v6-seed-cancel'}),{snap,project,capture,routeTo}=h;
 const checks=[],errors=[],observations=[];let entry=null,styleBuild=null,lastPoint=null,held=false;
 page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const point=(p,id=1)=>({x:p.x,y:p.y,id,radiusX:4,radiusY:4,force:.6});
 const dispatch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
 async function startAt(x,y,z){lastPoint=await project(x,y,z);assert.ok(lastPoint.x>10&&lastPoint.x<1430&&lastPoint.y>10&&lastPoint.y<880);await dispatch('touchStart',[point(lastPoint)]);held=true;await page.waitForTimeout(100);}
 async function moveAt(x,y,z){lastPoint=await project(x,y,z);assert.ok(lastPoint.x>10&&lastPoint.x<1430&&lastPoint.y>10&&lastPoint.y<880);await dispatch('touchMove',[point(lastPoint)]);}
 async function release(){await dispatch('touchEnd',[]);held=false;}
 const current=async(kind)=>(await snap()).state[kind==='main'?'wind':'exploration'];
 async function guideMain(){
  const w=(await snap()).state.wind;await startAt(w.x,.5,w.z-16);
  for(const [x,z]of[[-3,2],[-1.5,2],[0,2],[1.5,1.8],[3,1],[3,-.5],[3,-2]]){const start=Date.now();while(Date.now()-start<10000){await moveAt(x,.5,z-16);await page.waitForTimeout(90);const w=(await snap()).state.wind;if(Math.hypot(w.x-x,w.z-z)<.2)break;}assert.ok(Math.hypot((await snap()).state.wind.x-x,(await snap()).state.wind.z-z)<.3);}
 }
 async function pinchCancel(kind){
  const p2={x:Math.max(50,lastPoint.x-90),y:Math.min(750,lastPoint.y+90)};
  await dispatch('touchStart',[point(lastPoint),point(p2,2)]);await page.waitForTimeout(900);
  let w=kind==='main'?(await snap()).state.wind:(await snap()).state.exploration.wind;
  assert.equal(kind==='main'?w.solved:w.done,false);assert.equal(w.hold,0);assert.equal(w.catching,false);
  await dispatch('touchEnd',[]);held=false;await page.waitForTimeout(1000);
  w=kind==='main'?(await snap()).state.wind:(await snap()).state.exploration.wind;
  assert.equal(kind==='main'?w.solved:w.done,false);assert.equal(w.hold,0);if(kind==='side')assert.equal(w.stage,3);
  observations.push({kind,event:'two fingers added and all lifted',state:w});checks.push(kind+' two-finger cancel never masquerades as the seed release');await capture(kind+'-pinch-cancelled');
 }
 async function resumeNearGoal(kind){
  const w=kind==='main'?(await snap()).state.wind:(await snap()).state.exploration.wind;
  if(kind==='main'){await startAt(w.x,.5,w.z-16);await moveAt(3,.5,-18);}
  else{await startAt(12+w.seed.x,2.8,-16+w.seed.z);await moveAt(13.12,2.8,-16.83);}
  await page.waitForTimeout(250);
 }
 async function modalCancel(kind){
  await resumeNearGoal(kind);await release();await page.waitForFunction(k=>{const s=window.__SPRING__.snapshot().state,w=k==='main'?s.wind:s.exploration.wind;return w.hold>0&&!('solved'in w?w.solved:w.done);},kind,{timeout:3000});
  await page.keyboard.press('KeyM');await page.waitForSelector('#modal[open]');await page.waitForTimeout(500);await page.locator('#close-modal').tap();await page.waitForTimeout(1000);
  const w=kind==='main'?(await snap()).state.wind:(await snap()).state.exploration.wind;
  assert.equal(kind==='main'?w.solved:w.done,false);assert.equal(w.hold,0);assert.equal(w.catching,false);if(kind==='side')assert.equal(w.stage,3);
  observations.push({kind,event:'visible map opened during catch then closed',state:w});checks.push(kind+' map interruption cancels an in-progress catch without resetting earned gates');await capture(kind+'-map-cancelled');
 }
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:90000});entry=await page.locator('script[type=module][src]').last().getAttribute('src');styleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.ok(entry.startsWith('/assets/'));await page.locator('#continue').tap();await page.waitForTimeout(500);const initial=await snap();assert.equal(initial.state.p1.solved,true);assert.equal(initial.state.wind.solved,false);
  await page.locator('#focus-button').tap();await page.waitForTimeout(750);assert.equal((await snap()).focus,'wind');await guideMain();assert.equal((await snap()).state.wind.solved,false);await capture('main-held-at-flower');await pinchCancel('main');await modalCancel('main');await resumeNearGoal('main');await release();await page.waitForFunction(()=>window.__SPRING__.snapshot().state.wind.solved,null,{timeout:5000});checks.push('main still completes after a fresh deliberate release following both cancellations');
  await page.locator('#focus-button').tap();await routeTo([[0,-11.2],[3.7,-14],[4.5,-15],[7,-12],[10,-12.7],[12,-16]]);await page.waitForTimeout(600);assert.equal((await snap()).exploration.key,'wind');await page.locator('#wind-pen').tap();await startAt(10.82,2.8,-14.95);
  for(const [i,x,z]of[[0,-1.28,-.42],[1,-.22,-1.3],[2,1.12,-.83]]){const start=Date.now();while(Date.now()-start<12000){await moveAt(12+x,2.8,-16+z);await page.waitForTimeout(90);if((await snap()).state.exploration.wind.stage>i)break;}assert.equal((await snap()).state.exploration.wind.stage,i+1);}
  await capture('side-held-at-flower');await pinchCancel('side');await modalCancel('side');await resumeNearGoal('side');await release();await page.waitForFunction(()=>window.__SPRING__.snapshot().state.exploration.wind.done,null,{timeout:5000});checks.push('side garden retains all gates and still catches a new deliberate release');
  assert.deepEqual(errors,[]);assert.deepEqual((await snap()).errors,[]);const finalEntry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.equal(finalEntry,entry);const finalStyleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.equal(finalStyleBuild,styleBuild);
  const report={date:new Date().toISOString(),url,build:{entry,finalEntry,styleBuild,finalStyleBuild},sourceSave:path.basename(source),sourceSaveSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),checks,observations,errors,captures:h.captures,scope:'Earned v6 first-flower checkpoint from fresh main test. Storage origin only remapped; progress untouched. Actual CDP touchscreen contacts, two simultaneous fingers, complete release, visible map modal and keyboard walking. No DOM blur dispatch or state writes. Not a physical phone test.'};fs.writeFileSync(path.join(evidence,'v6-seed-cancellation.json'),JSON.stringify(report,null,2));console.log('COMPLETE '+checks.length+' seed cancellation checks');
 }catch(error){if(held)await release().catch(()=>{});await capture('failure').catch(()=>{});const state=await snap().catch(()=>null);if(state)delete state.frameTimes;fs.writeFileSync(path.join(evidence,'v6-seed-cancellation-failure.json'),JSON.stringify({date:new Date().toISOString(),error:error.stack,entry,checks,errors,observations,state},null,2));throw error;}
 finally{await cdp.detach().catch(()=>{});await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
