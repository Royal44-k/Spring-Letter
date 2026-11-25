/**
 * Terminal guidance must remain readable beside the dash control.
 * Uses the genuine earned archive, then Continue -> E -> Review letter ->
 * Rewind through visible controls. No progress setters or storage mutations.
 * Run serially with all other GPU checks; this script does not start a server.
 * SPRING_URL, EARNED_STORAGE, EXPECTED_JS and EXPECTED_CSS are optional.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5192/';
const fixturePath=path.resolve(root,process.env.EARNED_STORAGE||'evidence/v9/play-2026-11-21T11-47-50-746Z/earned-storage.json');
const out=path.join(root,'evidence/v10/terminal-layout-'+new Date().toISOString().replace(/[:.]/g,'-'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const archiveKey='spring-letter:archive:v1';
const report={started:new Date().toISOString(),url,passed:false,pages:[],errors:[],scope:'Isolated headless Edge, three viewport sizes. A genuine earned save is resumed and rewound through native UI into the unsent terminal. Only origin remapping is applied to the fixture. No injected gameplay completion, state setter, forced click or localStorage write. Geometry and text line bounds are readonly DOM observations; this is not physical-phone testing.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const overlaps=(a,b)=>a&&b&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
const onScreen=(rect,viewport)=>rect&&rect.width>0&&rect.height>0&&rect.left>=-.5&&rect.top>=-.5&&rect.right<=viewport.width+.5&&rect.bottom<=viewport.height+.5;

(async()=>{
 let browser;
 fs.mkdirSync(out,{recursive:true});
 try{
  const fixtureBytes=fs.readFileSync(fixturePath),fixture=JSON.parse(fixtureBytes);
  const originalOrigin=fixture.origins.find(o=>o.localStorage.some(item=>item.name===archiveKey));
  assert.ok(originalOrigin,'fixture contains the authoritative earned archive');
  const archive=JSON.parse(originalOrigin.localStorage.find(item=>item.name===archiveKey).value);
  const earned=JSON.parse(archive.data.journey),before=JSON.parse(archive.data.beforeLetter||'null');
  assert.ok(earned.started&&earned.ending&&earned.bridge.solved,'fixture was genuinely completed');
  assert.ok(before?.bridge.solved&&!before.ending,'fixture contains the real pre-send checkpoint');
  report.fixture={path:fixturePath,sha256:sha(fixtureBytes),origin:originalOrigin.origin,ending:earned.ending,player:earned.player,checkpointPlayer:before.player};write();
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
   const label=viewport.width+'x'+viewport.height,record={viewport,passed:false,checks:[],errors:[],screenshots:[]};report.pages.push(record);
   let context,page,h;
   try{
    const storage=JSON.parse(fixtureBytes),origin=storage.origins.find(o=>o.localStorage.some(item=>item.name===archiveKey));
    origin.origin=new URL(url).origin;assert.deepEqual(origin.localStorage,originalOrigin.localStorage,'only the fixture origin may change');
    context=await browser.newContext({viewport,storageState:storage,acceptDownloads:true});page=await context.newPage();page.setDefaultTimeout(20000);
    page.on('pageerror',error=>record.errors.push(String(error)));
    page.on('console',message=>{if(message.type()==='error')record.errors.push(message.text());});
    page.on('dialog',dialog=>{record.errors.push('Unexpected dialog: '+dialog.message());dialog.dismiss().catch(()=>{});});
    h=harness(page,{evidence:out,prefix:label,width:viewport.width,height:viewport.height});
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
    record.entry=await page.locator('script[type=module][src]').last().getAttribute('src');
    record.style=await page.locator('link[rel=stylesheet][href]').last().getAttribute('href');
    assert.ok(record.entry&&record.style,'the built page exposes real entry and stylesheet URLs');
    if(process.env.EXPECTED_JS)assert.equal(path.posix.basename(record.entry),path.posix.basename(process.env.EXPECTED_JS));
    if(process.env.EXPECTED_CSS)assert.equal(path.posix.basename(record.style),path.posix.basename(process.env.EXPECTED_CSS));
    const entryResponse=await page.request.get(new URL(record.entry,url).href),styleResponse=await page.request.get(new URL(record.style,url).href);
    assert.ok(entryResponse.ok()&&styleResponse.ok(),'both tested assets are served');
    record.entrySha256=sha(await entryResponse.body());record.styleSha256=sha(await styleResponse.body());
    for(const key of ['entry','entrySha256','style','styleSha256']){if(report[key])assert.equal(record[key],report[key],'all viewports use the same '+key);else report[key]=record[key];}
    write();
    await page.locator('#continue').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play');
    let state=(await h.snap()).state;assert.equal(state.ending,earned.ending);assert.ok(state.player.z<-39,'continue restored the real terminal position');
    // The retained completed journey is beside the dock. If a compatible
    // restore places it farther away, walk there normally rather than teleport.
    if(Math.hypot(state.player.x,state.player.z+50.1)>.8){await page.locator('#scene canvas').focus();await h.walk(0,-50.1);}
    await page.locator('#scene canvas').focus();await page.keyboard.press('KeyE');
    await page.waitForFunction(()=>window.__SPRING__.snapshot().focus==='finale');
    await page.locator('#review-letter').click();await page.locator('#ending-rewind').waitFor({state:'visible'});await page.locator('#ending-rewind').click();
    await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.mode==='play'&&!s.focus&&!s.state.ending;});
    // Restore intentionally places the courier safely at the terminal entrance.
    await page.locator('#scene canvas').focus();await h.walk(0,-50.1);
    await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.delivery?.kind==='send'&&!document.getElementById('field-action').hidden;});
    await page.locator('#dash-control').waitFor({state:'visible'});
    state=(await h.snap()).state;
    assert.equal(state.ending,null);assert.deepEqual(state.cores,before.cores);assert.equal(await page.locator('#modal').evaluate(el=>el.open),false);
    record.checks.push('ordinary Continue, E, review and rewind restore the genuine unsent terminal without progress injection');
    record.route=h.route;record.state={player:state.player,cores:state.cores,ending:state.ending,focus:(await h.snap()).focus};
    const metrics=await page.evaluate(()=>{
     const rect=r=>({left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height});
     const view=selector=>{const el=document.querySelector(selector),css=getComputedStyle(el),r=el.getBoundingClientRect();return {visible:!el.hidden&&css.display!=='none'&&css.visibility!=='hidden'&&Number(css.opacity)>0&&r.width>0&&r.height>0,rect:rect(r),text:el.innerText.trim(),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight};};
     const text=selector=>{const el=document.querySelector(selector),css=getComputedStyle(el),range=document.createRange();range.selectNodeContents(el);return {text:el.innerText.trim(),rect:rect(el.getBoundingClientRect()),lines:[...range.getClientRects()].map(rect),display:css.display,visibility:css.visibility,opacity:Number(css.opacity)};};
     return {field:view('#field-action'),dash:view('#dash-control'),title:text('#field-title'),hint:text('#field-hint'),viewport:{width:innerWidth,height:innerHeight},render:window.__SPRING__.snapshot().render||null};
    });
    record.metrics=metrics;
    const screenshot=label+'-terminal-before-send.png';await page.screenshot({path:path.join(out,screenshot)});record.screenshots.push(screenshot);write();
    assert.ok(metrics.field.visible&&metrics.dash.visible,'both terminal guidance and dash are actually visible');
    assert.ok(onScreen(metrics.field.rect,viewport),'the entire guidance panel remains inside the viewport');
    assert.ok(onScreen(metrics.dash.rect,viewport),'the dash button remains inside the viewport');
    assert.ok(!overlaps(metrics.field.rect,metrics.dash.rect),'terminal guidance overlaps the dash control: '+JSON.stringify({field:metrics.field.rect,dash:metrics.dash.rect}));
    record.checks.push('visible terminal guidance and dash controls fit the viewport without intersection');
    for(const [name,text]of [['title',metrics.title],['hint',metrics.hint]]){
     assert.ok(text.text&&text.lines.length,name+' has rendered text lines');
     assert.ok(text.display!=='none'&&text.visibility!=='hidden'&&text.opacity>0,name+' is not styled away');
     assert.ok(onScreen(text.rect,viewport),name+' text block is fully in the viewport');
     for(const line of text.lines){assert.ok(onScreen(line,viewport),name+' line is not clipped by the viewport');assert.ok(!overlaps(line,metrics.dash.rect),name+' line is covered by the dash control');}
    }
    assert.ok(metrics.field.scrollWidth<=metrics.field.clientWidth+1&&metrics.field.scrollHeight<=metrics.field.clientHeight+1,'guidance text is not clipped inside its own panel');
    assert.equal(metrics.render?.blocked,false,'render recovery has not replaced the terminal');
    assert.equal(record.errors.length,0,'no captured browser errors');record.checks.push('heading and full instruction have visible, unclipped text lines outside the dash button');
    record.passed=true;console.log('PASS '+label);
   }catch(error){record.error=String(error.stack||error);console.error('FAIL '+label+': '+error.message);if(page){const file=label+'-failure.png';await page.screenshot({path:path.join(out,file)}).then(()=>record.screenshots.push(file)).catch(()=>{});}}
   finally{await context?.close();write();}
  }
  report.passed=report.pages.length===3&&report.pages.every(p=>p.passed);assert.ok(report.passed,'one or more terminal viewports failed; see '+out);
 }catch(error){report.error=String(error.stack||error);process.exitCode=1;}
 finally{await browser?.close();report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:report.passed,out,entry:report.entry,style:report.style}));}
})();
