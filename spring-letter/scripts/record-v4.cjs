const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(__dirname,'../.tools/playwright');
const {chromium}=require('playwright');
const dir=path.resolve(__dirname,'../evidence');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:path.join(dir,'recordings'),size:{width:1280,height:720}}});
 const page=await context.newPage(),errors=[],shots=[];page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 try{
  await page.goto(process.env.SPRING_URL||'http://127.0.0.1:5193');await page.waitForFunction(()=>window.__SPRING__,null,{timeout:60000});await page.waitForTimeout(1000);
  await page.locator('#begin').click();const start=Date.now();
  for(let i=0;i<6;i++){
   await page.waitForFunction(index=>window.__SPRING__.snapshot().opening===index,i,{timeout:15000});await page.waitForTimeout(2500);
   const file=`v4-intro-${i+1}.png`;await page.screenshot({path:path.join(dir,file)});shots.push(file);
  }
  await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play',null,{timeout:15000});const elapsed=Date.now()-start;
  assert.ok(elapsed>=47000);assert.equal(await page.evaluate(()=>window.__SPRING__.snapshot().state.p1.solved),false);
  await page.locator('#home').click();await page.locator('#gallery').click();await page.waitForTimeout(3500);await page.screenshot({path:path.join(dir,'v4-final-silver.png')});
  await page.locator('#scatter').click();await page.waitForTimeout(2200);await page.mouse.move(620,360);await page.mouse.move(470,400,{steps:40});await page.waitForTimeout(1000);await page.locator('#scatter').click();await page.waitForTimeout(2200);
  await page.locator('[data-material="crystal"]').click();await page.waitForTimeout(1800);await page.screenshot({path:path.join(dir,'v4-final-crystal.png')});
  await page.locator('[data-material="lily"]').click();await page.waitForTimeout(1800);await page.screenshot({path:path.join(dir,'v4-final-natural.png')});
  await page.locator('[data-material="silver"]').click();await page.locator('[data-gallery="dust"]').click();await page.waitForTimeout(2500);await page.mouse.move(590,330);await page.mouse.move(740,450,{steps:35});await page.waitForTimeout(1800);await page.screenshot({path:path.join(dir,'v4-final-dust.png')});
  await page.locator('[data-gallery="flower"]').click();await page.waitForTimeout(3500);assert.deepEqual(errors,[]);
  const video=page.video();await context.close();await video.saveAs(path.join(dir,'spring-letter-v4.webm'));
  fs.writeFileSync(path.join(dir,'recording-verification.json'),JSON.stringify({date:new Date().toISOString(),openingElapsedMs:elapsed,shots,errors,file:'spring-letter-v4.webm',scope:'Uncut real local production build, ordinary UI input; six automatically advancing opening scenes, reversible scatter, three materials and flower/dust transition. Playwright video has no audio. Recording overhead excludes this run from performance measurements.'},null,2));
  console.log('Saved uncut opening and visual transition recording: '+elapsed+' ms opening.');
 }finally{await context.close().catch(()=>{});await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
