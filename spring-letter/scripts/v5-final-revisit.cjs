const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const evidence=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5192';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,storageState:path.join(evidence,'v5-record-real-play-storage.json')});
 const page=await context.newPage(),errors=[],checks=[];let touchSend=null;page.on('pageerror',e=>errors.push(e.stack));
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 async function walk(x,z){let held=[];const start=Date.now();try{while(Date.now()-start<30000){const s=await snap(),p=s.state.player,dx=x-p.x,dz=z-p.z,a=s.view.azimuth;if(Math.hypot(dx,dz)<.2)return;const r=dx*Math.cos(a)-dz*Math.sin(a),f=-dx*Math.sin(a)-dz*Math.cos(a),wanted=[];if(Math.abs(r)>Math.abs(f)*.4142)wanted.push(r>0?'KeyD':'KeyA');if(Math.abs(f)>Math.abs(r)*.4142)wanted.push(f>0?'KeyW':'KeyS');for(const k of held)if(!wanted.includes(k))await page.keyboard.up(k);for(const k of wanted)if(!held.includes(k))await page.keyboard.down(k);held=wanted;await page.waitForTimeout(45);}throw Error('portrait walk did not arrive');}finally{for(const k of held)await page.keyboard.up(k);}}
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden'});await page.locator('#continue').tap();await page.waitForTimeout(900);
  assert.equal((await snap()).state.ending,'season+voyage');assert.deepEqual((await snap()).state.cores,['season','voyage']);checks.push('native recording save retains its two earned plantings and ending');
  await page.keyboard.press('KeyE');await page.locator('#review-letter').tap();assert.equal(await page.locator('#ending-rewind').isVisible(),true);checks.push('portrait continue opens the existing letter through the normal review entrance');
  await page.locator('#ending-rewind').tap();await page.keyboard.press('Escape');await walk(0,-50.25);
  const button=await page.locator('#focus-button').boundingBox();assert.ok(button,'visible touch hold button');
  const touch=await context.newCDPSession(page),touchStarted=Date.now();touchSend={input:'CDP Input.dispatchTouchEvent on the visible focus button',x:button.x+button.width/2,y:button.y+button.height/2};
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchSend.x,y:touchSend.y,id:1,radiusX:3,radiusY:3,force:1}]});
  try{await page.waitForFunction(()=>window.__SPRING__.snapshot().state.ending==='season+voyage',null,{timeout:10000});touchSend.completedBeforeRelease=true;}
  finally{touchSend.holdMs=Date.now()-touchStarted;await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();}
  await page.waitForTimeout(160);const afterRelease=await snap();touchSend.releaseFocus=afterRelease.focus;touchSend.releaseCamera=afterRelease.camera;touchSend.releaseEnding=afterRelease.state.ending;
  assert.equal(afterRelease.focus,null,'releasing the actual touch hold must preserve the farewell, not reopen finale');assert.equal(afterRelease.state.ending,'season+voyage');checks.push('touch hold commits the earned ending and release preserves the far-side farewell');
  await page.waitForTimeout(2400);assert.equal(await page.locator('#modal').evaluate(e=>e.open),false);
  const points=await page.evaluate(()=>[[-3,1,-46],[0,1,-48],[3,1,-46]].map(p=>window.__SPRING__.project(...p)));
  for(const p of points)assert.ok(p.x>12&&p.x<378&&p.y>40&&p.y<804);
  const camera=(await snap()).camera;assert.ok(camera[2]<-46);await page.screenshot({path:path.join(evidence,'v5-release-portrait-farewell.png')});checks.push('all three flower-bed centres remain inside the actual portrait far-side farewell before its modal');
  await page.waitForSelector('#ending-stay',{state:'visible',timeout:16000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(evidence,'v5-release-portrait-letter.png')});checks.push('portrait ending letter stays within the viewport width');
  await page.locator('#ending-stay').tap();await page.keyboard.press('KeyE');assert.equal(await page.locator('#review-letter').isVisible(),true);checks.push('after the repeated farewell, staying still permits a normal review');
  assert.deepEqual(errors,[]);assert.deepEqual((await snap()).errors,[]);
  const report={date:new Date().toISOString(),url,build:await page.locator('script[type=module]').getAttribute('src'),sourceSave:'v5-record-real-play-storage.json',sourceSaveSha256:createHash('sha256').update(fs.readFileSync(path.join(evidence,'v5-record-real-play-storage.json'))).digest('hex'),checks,errors,points,camera,touchSend,scope:'Existing native storage exported only after the uninterrupted ordinary-input recording succeeded. Portrait viewport; visible touch buttons plus keyboard movement. Sending uses a held CDP touchscreen contact on the visible focus button, followed by a real input release, not a forged DOM click. No invented progress or state setters. Projected centres do not alone prove absence of occlusion; actual screenshot is reviewed separately. Not a physical-phone test.'};
  fs.writeFileSync(path.join(evidence,'v5-final-revisit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }catch(error){await page.screenshot({path:path.join(evidence,'v5-final-revisit-failure.png')}).catch(()=>{});const state=await snap().catch(()=>null);if(state)delete state.frameTimes;fs.writeFileSync(path.join(evidence,'v5-final-revisit-failure.json'),JSON.stringify({date:new Date().toISOString(),url,build:await page.locator('script[type=module]').getAttribute('src').catch(()=>null),error:error.stack,checks,errors,touchSend,state},null,2));throw error;}
 finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
