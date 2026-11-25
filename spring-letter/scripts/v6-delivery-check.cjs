const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'..'),evidence=path.join(base,'evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5193';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const source=path.join(evidence,'v5-record-real-play-storage.json'),storage=JSON.parse(fs.readFileSync(source));
 storage.origins=storage.origins.map(o=>({...o,origin:url}));
 const context=await browser.newContext({viewport:{width:1440,height:900},storageState:storage});const page=await context.newPage();
 const errors=[],checks=[],captures=[],snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 page.on('pageerror',e=>errors.push(e.stack));
 const capture=async name=>{await page.screenshot({path:path.join(evidence,'v6-seeds-'+name+'.png')});captures.push('v6-seeds-'+name+'.png');};
 const ready=async()=>{await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:90000});};
 const press=async()=>{await page.keyboard.press('KeyE');await page.waitForTimeout(300);};
 async function walk(x,z){const start=Date.now();while(Date.now()-start<35000){const s=await snap(),p=s.state.player,dx=x-p.x,dz=z-p.z,a=s.view.azimuth;if(Math.hypot(dx,dz)<.22)return;const r=dx*Math.cos(a)-dz*Math.sin(a),f=-dx*Math.sin(a)-dz*Math.cos(a),wanted=[];if(Math.abs(r)>Math.abs(f)*.4142)wanted.push(r>0?'KeyD':'KeyA');if(Math.abs(f)>Math.abs(r)*.4142)wanted.push(f>0?'KeyW':'KeyS');for(const key of wanted)await page.keyboard.down(key);await page.waitForTimeout(Math.hypot(dx,dz)<.6?50:130);for(const key of wanted)await page.keyboard.up(key);await page.waitForTimeout(30);}throw Error('walk timeout '+JSON.stringify({x,z,s:await snap()}));}
 try{
  await page.goto(url);await ready();await capture('00-loaded');await page.locator('#continue').click();await page.waitForTimeout(700);
  assert.equal((await snap()).state.ending,'season+voyage');checks.push('unchanged native v5 earned save loads in v6, only origin remapped');
  await press();await page.locator('#review-letter').click();await page.locator('#ending-rewind').click();await page.waitForTimeout(350);assert.equal((await snap()).state.ending,null);await capture('01-rewound');
  await walk(0,-48);await press();assert.equal((await snap()).carried,0);assert.deepEqual((await snap()).state.cores,[null,'voyage']);checks.push('one E takes back the planted season core');await capture('02-carried');
  await page.reload();await ready();await page.locator('#continue').click();await page.waitForTimeout(500);assert.equal((await snap()).carried,0);assert.equal((await snap()).state.deliveryCarried,0);checks.push('reload retains carried identity without duplicating the source seed');await capture('03-restored-carry');
  await walk(-3,-46);await page.locator('#focus-button').click();await page.waitForTimeout(350);assert.deepEqual((await snap()).state.cores,['memory','voyage']);checks.push('single visible button click plants the held core at memory');await capture('04-planted');
  await walk(0,-50.25);await press();assert.equal(await page.locator('#send-confirm').isVisible(),true);assert.equal((await snap()).state.ending,null);await capture('05-preview');await page.locator('#send-cancel').click();assert.equal((await snap()).state.ending,null);checks.push('send opens explicit consequences, cancellation does not commit');
  await press();await page.locator('#send-confirm').click();await page.waitForTimeout(1400);assert.equal((await snap()).state.ending,'memory+voyage');assert.equal((await snap()).focus,null);await capture('06-farewell');checks.push('confirmation alone commits memory+voyage and preserves cinematic camera');
  await page.waitForSelector('#ending-stay',{timeout:18000});await capture('07-letter');await page.locator('#ending-stay').click();
  assert.deepEqual(errors,[]);assert.deepEqual((await snap()).errors,[]);
  const report={date:new Date().toISOString(),url,build:await page.locator('script[type=module]').last().getAttribute('src'),sourceSave:path.basename(source),sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),checks,captures,errors,scope:'Native v5 earned save compatibility and ordinary input revisiting ending. Storage origin alone remapped to development port; progress untouched. No setters, DOM forged events or invented completion. Source modules may be under active development; this is not a final release check.'};
  fs.writeFileSync(path.join(evidence,'v6-seeds-delivery.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }catch(error){await capture('failure').catch(()=>{});const state=await snap().catch(()=>null);if(state)delete state.frameTimes;fs.writeFileSync(path.join(evidence,'v6-seeds-delivery-failure.json'),JSON.stringify({date:new Date().toISOString(),error:error.stack,checks,errors,state},null,2));throw error;}
 finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
