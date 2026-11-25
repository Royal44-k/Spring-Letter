/** Verify the promoted local release, without touching the user's browser profile. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),url='http://127.0.0.1:5192/',origin=new URL(url).origin;
const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence/release-manifest-v8.json'),'utf8'));
const proof=manifest.evidence,out=path.join(root,'evidence/v8'),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const report={started:new Date().toISOString(),url,version:manifest.version,build:manifest.build,passed:false,files:[],checks:[],pages:[],scope:'Exact promoted HTTP bytes, fresh desktop launch and separately restored ordinary-play archive. Isolated Edge profiles; no user browser data accessed. No public deployment or physical-device claim.'};
const write=()=>fs.writeFileSync(path.join(out,'production.json'),JSON.stringify(report,null,2));
(async()=>{let browser;
 try{
  for(const file of manifest.dist){
   const route=file.file.slice(5),response=await fetch(new URL(route,url));assert.equal(response.status,200,route);
   const bytes=Buffer.from(await response.arrayBuffer());assert.equal(sha(bytes),file.sha256,route);assert.equal(bytes.length,file.bytes);
   report.files.push({file:route,bytes:bytes.length,sha256:sha(bytes)});
  }
  report.checks.push('all '+report.files.length+' promoted HTTP files match the frozen candidate byte for byte');write();
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const earned=JSON.parse(fs.readFileSync(path.join(path.dirname(path.resolve(root,proof.play)),'earned-storage.json'),'utf8'));
  earned.origins.forEach(o=>o.origin=origin);
  for(const kind of ['fresh','earned-resume']){
   const context=await browser.newContext({viewport:{width:1440,height:900},...(kind==='earned-resume'?{storageState:earned}:{})});
   const page=await context.newPage(),record={kind,errors:[],failures:[],external:[]};report.pages.push(record);
   page.on('pageerror',e=>record.errors.push(String(e)));
   page.on('console',m=>{if(m.type()==='error')record.errors.push(m.text());});
   page.on('requestfailed',r=>record.failures.push({url:r.url(),message:r.failure()?.errorText}));
   page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))record.external.push(r.url());});
   try{
    await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden'});
    record.entry=await page.locator('script[type=module][src]').getAttribute('src');assert.equal(record.entry,manifest.build);
    record.loading=await page.evaluate(()=>window.__SPRING__.snapshot().loadingTiming);
    if(kind==='fresh'){
     assert.equal(await page.locator('#continue').isVisible(),false);await page.screenshot({path:path.join(out,'production-cover.png')});
     await page.locator('#cover-fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement,null,{timeout:8000});
     await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.fullscreenElement,null,{timeout:8000});
     await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(1000);
     const before=await page.evaluate(()=>window.__SPRING__.snapshot().state.player);
     await page.keyboard.down('KeyW');await page.waitForTimeout(650);await page.keyboard.up('KeyW');await page.waitForTimeout(300);
     const after=await page.evaluate(()=>window.__SPRING__.snapshot().state.player);assert.ok(Math.hypot(after.x-before.x,after.z-before.z)>.4,'ordinary walking works');
     await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.loaded,null,{timeout:30000});
     const audio=await page.evaluate(()=>window.__SPRING__.snapshot().audio);assert.equal(audio.loadedSamples.length,7);assert.equal(audio.loadedFoley.length,9);assert.deepEqual(audio.loadErrors,[]);
     await page.locator('#settings').click();await page.locator('#about').click();assert.match(await page.locator('#modal').innerText(),/0\.6 来信之庭/);
     for(const label of ['ASSET_SOURCES.md','THIRD_PARTY_LICENSES.txt']){const href=await page.locator('#modal a[href$="'+label+'"]').getAttribute('href');assert.equal((await page.request.get(new URL(href,url).href)).status(),200);}
     await page.screenshot({path:path.join(out,'production-credits.png')});
     report.checks.push('fresh 5192 cover, visible fullscreen button, opening, walking, 16 decoded audio assets and 0.6 credits');
    }else{
     assert.equal(await page.locator('#continue').isVisible(),true);await page.locator('#continue').click();await page.waitForTimeout(1000);
     const snapshot=await page.evaluate(()=>window.__SPRING__.snapshot());assert.equal(snapshot.state.ending,'memory+season');
     const expected={rain:'shoot',wind:'lamp',tide:'new'};for(const [id,choice]of Object.entries(expected)){assert.equal(snapshot.state.letters.entries[id].choice,choice);assert.equal(snapshot.state.lettersSent.entries[id].choice,choice);}
     assert.equal(snapshot.focus,null);assert.equal(snapshot.saveStatus.lastResult.ok,true);
     await page.locator('#journal').click();await page.screenshot({path:path.join(out,'production-earned-letters.png')});
     report.checks.push('ordinary-play earned ending and three exact replies resume at the production origin');
    }
    assert.deepEqual(record.errors,[]);assert.deepEqual(record.failures,[]);assert.deepEqual(record.external,[]);record.passed=true;write();
   }finally{await context.close();}
  }
  report.passed=true;report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:true,files:report.files.length,build:report.build,checks:report.checks}));
 }catch(error){report.failure=error.stack;write();throw error;}finally{await browser?.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
