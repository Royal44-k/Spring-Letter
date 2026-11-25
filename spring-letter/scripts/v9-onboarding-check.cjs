// Run serially against a frozen build. This check deliberately starts without
// storageState/EARNED and never skips the opening or writes application state.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5192';
const out=path.join(root,'evidence/v9/onboarding-'+new Date().toISOString().replace(/[:.]/g,'-'));
const report={started:new Date().toISOString(),url,expectedEntry:process.env.EXPECTED_JS||null,passed:false,errors:[],pages:[],scope:'Serial fresh isolated Chromium contexts, no EARNED/storage import. Ordinary clicks/taps, Space, WASD and UI scrolling only. Read-only DOM, __SPRING__.snapshot and localStorage observations; no setters or injected progress. Desktop observes all six opening frames, first automatic transition after waiting eight wall-clock seconds, then real next/Space; portrait separately observes all six text layouts. This is a guided functional/geometry check, not a blind playtest, human reading/contrast judgement, physical-phone test, or complete loading-stage census.'};
fs.mkdirSync(out,{recursive:true});
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const compact=s=>{const copy=structuredClone(s);delete copy.frameTimes;return copy;};

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  for(const mode of ['desktop','portrait']){
   const viewport=mode==='desktop'?{width:1440,height:900}:{width:390,height:844};
   const context=await browser.newContext({viewport,hasTouch:mode==='portrait',isMobile:mode==='portrait'});
   const page=await context.newPage(),record={mode,viewport,freshContext:true,checks:[],errors:[],loading:[],frames:[],entries:[]};report.pages.push(record);
   const h=harness(page,{evidence:out,prefix:mode,width:viewport.width,height:viewport.height}),snap=h.snap,responses=new Map();
   page.on('pageerror',e=>record.errors.push({type:'pageerror',text:String(e)}));
   page.on('console',m=>{if(m.type()==='error')record.errors.push({type:'console',text:m.text()});});
   page.on('response',r=>{if(r.request().resourceType()==='script')responses.set(r.url(),r);});
   page.setDefaultTimeout(20000);
   const mark=name=>{record.checks.push(name);write();console.log('PASS '+mode+' '+name);};
   async function click(selector){if(mode==='portrait')await page.locator(selector).tap();else await page.locator(selector).click();}
   async function capture(name){await h.capture(name);const s=await snap().catch(()=>null);if(s)fs.writeFileSync(path.join(out,mode+'-'+name+'.json'),JSON.stringify(compact(s),null,2));}
   async function readLoading(){return page.evaluate(()=>{const el=document.getElementById('loading'),css=el&&getComputedStyle(el);return {observedAt:new Date().toISOString(),performanceMs:performance.now(),visible:!!el&&!el.hidden&&css.display!=='none'&&css.visibility!=='hidden',busy:el?.getAttribute('aria-busy')??null,status:el?.querySelector('#load-status')?.textContent||'',title:el?.querySelector('[data-load-title]')?.textContent||'',tip:el?.querySelector('[data-load-tip]')?.textContent||'',selectedPage:el?.querySelector('[data-load-page][aria-pressed="true"]')?.getAttribute('data-load-page')??null,steps:el?[...el.querySelectorAll('.spring-load-steps i')].map(n=>n.className):[],diagnosticsReady:!!window.__SPRING__,failureVisible:!document.getElementById('failure')?.hidden};});}
   async function load(label,reload=false){
    responses.clear();const started=Date.now();if(reload)await page.reload({waitUntil:'domcontentloaded',timeout:120000});else await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
    const observations=[],loadRecord={label,observations,coverage:'Only states observed after DOMContentLoaded are recorded. No throttling, forced loading stage, or claim that every carousel/progress step was visible.'};record.loading.push(loadRecord);let previous='',captured=false;
    while(Date.now()-started<180000){
     const observed=await readLoading();observed.elapsedWallMs=Date.now()-started;
     const signature=JSON.stringify([observed.visible,observed.status,observed.title,observed.tip,observed.steps,observed.diagnosticsReady]);
     if(signature!==previous){observations.push(observed);previous=signature;write();}
     assert.equal(observed.failureVisible,false,'loading cannot end in the visible failure screen');
     if(observed.visible&&!captured){captured=true;await h.capture(label+'-loading-observed');loadRecord.capture={file:h.captures.at(-1),before:observed,after:await readLoading(),note:'The screenshot interval may overlap a load transition; before/after observations are retained.'};}
     if(observed.diagnosticsReady&&!observed.visible)break;
     await page.waitForTimeout(350);
    }
    await page.waitForFunction(()=>!!window.__SPRING__&&document.getElementById('loading').hidden,null,{timeout:15000});
    const entry=await page.locator('script[type="module"][src]').last().getAttribute('src');if(process.env.EXPECTED_JS)assert.equal(entry,process.env.EXPECTED_JS,'checked build entry');
    const absolute=new URL(entry,page.url()).href;let response=responses.get(absolute),hashSource='initial script response';if(!response){response=await page.request.get(absolute);hashSource='same URL readback';}
    assert.ok(response.ok(),'entry script response must succeed');const bytes=await response.body();const entryInfo={src:entry,url:absolute,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,hashSource};record.entries.push({label,...entryInfo});
    if(!report.entry)report.entry=entryInfo;else assert.equal(entryInfo.sha256,report.entry.sha256,'all contexts and reload use the same entry bytes');
    loadRecord.completedElapsedWallMs=Date.now()-started;loadRecord.appTiming=(await snap()).loadingTiming;write();
   }
   async function layout(selector,blockers=[]){return page.locator(selector).evaluate((element,selectors)=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const visible=e=>{if(!e)return false;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>0;};
    const box=rect(element),range=document.createRange();range.selectNodeContents(element);const textRects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0).map(r=>({x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}));
    const overlap=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
    return {text:element.innerText,visible:visible(element),box,textRects,viewport:{width:innerWidth,height:innerHeight},knownOverlaps:selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(visible).filter(e=>overlap(box,rect(e))).map(e=>({selector,id:e.id,box:rect(e)}))),scrollHeight:element.scrollHeight,clientHeight:element.clientHeight};
   },blockers);}
   function assertInView(observation,label){
    assert.ok(observation.visible,label+' is visible');assert.ok(observation.text.trim(),label+' has actual text');
    for(const r of [observation.box,...observation.textRects])assert.ok(r.x>=-1&&r.y>=-1&&r.right<=viewport.width+1&&r.bottom<=viewport.height+1,label+' stays inside viewport: '+JSON.stringify(r));
    assert.deepEqual(observation.knownOverlaps,[],label+' does not overlap known foreground UI');
   }
   async function observeFrame(index){
    await page.waitForFunction(i=>window.__SPRING__.snapshot().opening===i,index,{timeout:15000});
    const state=await snap();assert.equal(state.mode,'opening');assert.equal(state.opening,index);assert.equal(state.state.story.introSeen,false,'opening is not completed before its last frame');
    const text=await layout('#opening-line',['.opening-actions','header button','#hud','#context','#controls','#touch-pad','#letter-post','#letter-target']);assertInView(text,'opening frame '+(index+1));
    const frame={index,observedAt:new Date().toISOString(),page:await page.locator('#opening-page').innerText(),speaker:await page.locator('#opening-speaker').innerText(),text:text.text,layout:text,nextLabel:await page.locator('#opening-next').innerText(),progress:await page.locator('#opening-progress').getAttribute('style'),snapshot:{mode:state.mode,opening:state.opening,camera:state.camera,scatter:state.scatter,displayBloom:state.displayBloom}};
    assert.match(frame.page,new RegExp('0'+(index+1)+'\\s*/\\s*06'));assert.ok(frame.speaker.trim());await capture('opening-'+String(index+1).padStart(2,'0'));frame.screenshot=h.captures.at(-1);assert.equal((await snap()).opening,index,'screenshot still belongs to the observed opening frame');record.frames.push(frame);write();return frame;
   }
   async function checkHelp(){
    await click('#settings');await page.locator('#modal').waitFor({state:'visible'});
    record.settingsText=await page.locator('#modal-content').innerText();for(const phrase of ['雨庭拖动花笺叠光','风庭用方向键或拖动控制纸翼','潮庭点触乐器写下自己的旋律'])assert.ok(record.settingsText.includes(phrase),'settings contains '+phrase);
    await page.locator('#modal-content p.muted').scrollIntoViewIfNeeded();record.settingsInstructionLayout=await layout('#modal-content p.muted');assertInView(record.settingsInstructionLayout,'settings instructions');await capture('settings-instructions');
    await click('#help-play');record.handbook=[];
    for(const title of ['花光暗房','纸翼渡风','回声织信']){
     const paragraph=page.locator('#modal-content p').filter({has:page.locator('b',{hasText:title})});assert.equal(await paragraph.count(),1,'one handbook paragraph for '+title);await paragraph.scrollIntoViewIfNeeded();
     const text=await paragraph.innerText(),box=await paragraph.boundingBox();assert.ok(box&&box.y>=-1&&box.y+box.height<=viewport.height+1,'handbook paragraph is readable in viewport');record.handbook.push({title,text,box});await capture('handbook-'+record.handbook.length);
    }
    await click('#close-modal');assert.equal((await snap()).mode,'play');mark('settings and handbook expose the three current interaction instructions');
   }
   try{
    await load('fresh');const initial=await snap();record.initial=compact(initial);assert.equal(initial.mode,'cover');assert.equal(initial.state.started,false);assert.equal(initial.state.story.introSeen,false);assert.equal(await page.locator('#continue').isVisible(),false);assert.ok(Object.values(initial.state.moments.entries).every(e=>!e.completed),'fresh context has no completed moments');
    await capture('fresh-cover');const started=Date.now();await click('#begin');await observeFrame(0);
    if(mode==='desktop'){
     await page.waitForTimeout(Math.max(0,8000-(Date.now()-started)));
     await page.waitForFunction(()=>window.__SPRING__.snapshot().opening===1,null,{timeout:45000});
     record.automaticFirstTransition={elapsedWallMs:Date.now()-started,previousIndex:0,observedIndex:1,input:'none after initial begin click',note:'Waited at least eight wall-clock seconds; animation/game time can advance more slowly on a busy renderer.'};record.frames[0].advance='automatic, no input';assert.ok(record.automaticFirstTransition.elapsedWallMs>=8000);mark('first opening frame advances automatically after an input-free eight-second observation');
    }else{await click('#opening-next');record.frames[0].advance='tap next';}
    for(let index=1;index<6;index++){
     const frame=await observeFrame(index);await page.waitForTimeout(300);
     if(mode==='desktop'&&index%2===1){frame.advance='Space';await page.keyboard.press('Space');}else{frame.advance=mode==='portrait'?'tap next':'click next';await click('#opening-next');}
    }
    await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play',null,{timeout:15000});assert.equal(await page.locator('#opening').isVisible(),false);
    const after=await snap();assert.equal(after.state.story.introSeen,true);assert.equal(after.opening,null);assert.equal(record.frames.length,6);assert.equal(new Set(record.frames.map(f=>f.text)).size,6,'all six authored passages were individually observed');
    const archived=await page.evaluate(()=>{const a=JSON.parse(localStorage.getItem('spring-letter:archive:v1'));return JSON.parse(a.data.journey);});assert.equal(archived.story.introSeen,true,'ordinary final next action persisted introSeen');
    await page.waitForFunction(()=>Number(getComputedStyle(document.getElementById('caption')).opacity)>.9,null,{timeout:5000});
    record.guidance={caption:await page.locator('#caption').innerText(),captionLayout:await layout('#caption'),post:await page.locator('#letter-post').innerText(),marker:await page.locator('#letter-target').innerText()};assert.match(record.guidance.caption,/第一封未回复的信/);assert.equal(record.guidance.captionLayout.visible,true,'first-letter caption is painted, not merely present');assert.match(record.guidance.marker,/花光暗房/);assert.equal(await page.locator('#letter-post').isVisible(),true);assert.equal(await page.locator('#letter-target').isVisible(),true);await capture('first-letter-guidance');mark('six opening frames finish without skipping; introSeen is saved and first-letter guidance appears');
    if(mode==='desktop'){
     const start={...after.state.player};record.movement=[];
     for(const [key,ms]of [['KeyW',700],['KeyA',250],['KeyS',180],['KeyD',500]]){
      const before=(await snap()).state.player;await page.keyboard.down(key);try{await page.waitForTimeout(ms);}finally{await page.keyboard.up(key);}await page.waitForTimeout(50);const current=(await snap()).state.player;const distance=Math.hypot(current.x-before.x,current.z-before.z);assert.ok(distance>.04,key+' moves the courier with ordinary keyboard input');record.movement.push({key,holdMs:ms,from:before,to:current,distance});
     }
     const current=(await snap()).state.player;assert.ok(Math.hypot(current.x-start.x,current.z-start.z)>.25,'WASD route leaves the initial spawn');await capture('walked-from-spawn');mark('W, A, S and D each move the courier and the route leaves spawn');await checkHelp();
     const beforeReload=await snap();record.beforeReload=compact(beforeReload);await load('reload',true);await page.locator('#continue').waitFor({state:'visible'});await click('#continue');await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play',null,{timeout:15000});await page.waitForTimeout(1100);
     const resumed=await snap();assert.equal(resumed.state.story.introSeen,true);assert.equal(resumed.opening,null);assert.equal(await page.locator('#opening').isVisible(),false);assert.ok(Math.hypot(resumed.state.player.x-beforeReload.state.player.x,resumed.state.player.z-beforeReload.state.player.z)<.15,'normal beforeunload save retains the walked position');await capture('continued-without-opening');mark('reload and Continue retain the journey without forcing the opening to replay');
    }else mark('all six portrait opening passages fit the viewport without known foreground UI overlaps');
    record.final=compact(await snap());assert.deepEqual(record.final.errors,[],'application diagnostics are clean');assert.deepEqual(record.errors,[],'browser runtime/console errors are absent');record.captures=h.captures;record.passed=true;write();
   }catch(error){record.failure=error.stack;record.final=await snap().then(compact).catch(()=>null);await capture('failure').catch(()=>{});record.captures=h.captures;report.errors.push({mode,error:error.message});write();throw error;}
   finally{for(const key of ['KeyW','KeyA','KeyS','KeyD'])await page.keyboard.up(key).catch(()=>{});await context.close();}
  }
  report.passed=true;report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:true,out}));
 }catch(error){report.failure=error.stack;write();throw error;}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
