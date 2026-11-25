/* Reproduce/verify finishing the learned flower lesson after leaving its close view. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const evidence=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5194';
const prefix=process.env.SPRING_EVIDENCE_PREFIX||'v6-flower-leave-before-return';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const errors=[],observations=[],captures=[];let build={};page.on('pageerror',e=>errors.push(e.stack));
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 async function mark(name){const s=await snap();delete s.frameTimes;observations.push({name,at:new Date().toISOString(),snapshot:s});const file=prefix+'-'+name+'.png';await page.screenshot({path:path.join(evidence,file)});captures.push(file);}
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:90000});
  build={entry:await page.locator('script[type=module][src]').last().getAttribute('src'),styleBuild:await page.locator('link[rel=stylesheet]').last().getAttribute('href')};assert.ok(build.entry.startsWith('/assets/'));
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(500);await page.keyboard.press('KeyE');await page.waitForTimeout(600);assert.equal((await snap()).focus,'flower');
  await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting',null,{timeout:20000});
  await page.mouse.move(550,360);await page.mouse.down();for(let i=0;i<24;i++){await page.mouse.move(550+i*14,360+Math.sin(i*.25)*80);await page.waitForTimeout(35);}await page.mouse.up();
  let s=await snap();assert.ok(s.state.p1.ink>=1.2);assert.equal(s.flowerCycle.phase,'drifting');assert.equal(s.state.p1.solved,false);await mark('01-learned-wind');
  await page.keyboard.press('KeyE');await page.waitForTimeout(150);assert.equal((await snap()).focus,null);await mark('02-left-before-return');
  await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:25000});await page.waitForTimeout(500);await mark('03-natural-return-outside-focus');
  const solvedWithoutReentry=(await snap()).state.p1.solved;
  if(!solvedWithoutReentry){await page.keyboard.press('KeyE');await page.waitForTimeout(350);await mark('04-reenter-unlocks');}
  s=await snap();assert.deepEqual(errors,[]);assert.deepEqual(s.errors,[]);build.finalEntry=await page.locator('script[type=module][src]').last().getAttribute('src');build.finalStyleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.equal(build.finalEntry,build.entry);assert.equal(build.finalStyleBuild,build.styleBuild);
  const report={date:new Date().toISOString(),url,build,status:solvedWithoutReentry?'regression passed':'bug reproduced',expected:'Once a first bloom has been broken and wind writing is learned, its natural return should finish the lesson without forcing the player to reopen close view.',solvedWithoutReentry,solvedAfterReentry:s.state.p1.solved,observations,captures,errors,scope:'Fresh save. Ordinary visible skip button, E close view, F burst and actual mouse stroke. E leaves during drift after ink>=1.2. Read-only snapshot. No progress writes or injected save. This is separate from the regular main journey.'};fs.writeFileSync(path.join(evidence,prefix+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,build,solvedWithoutReentry,solvedAfterReentry:s.state.p1.solved}));if(process.env.SPRING_EXPECT_FIXED==='1')assert.equal(solvedWithoutReentry,true,'learned flower must complete after leaving before natural return');
 }catch(error){await mark('failure').catch(()=>{});fs.writeFileSync(path.join(evidence,prefix+'-failure.json'),JSON.stringify({date:new Date().toISOString(),build,error:error.stack,errors,observations,captures},null,2));throw error;}
 finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
