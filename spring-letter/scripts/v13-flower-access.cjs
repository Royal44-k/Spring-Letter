/** Run serially in the root's GPU slot, against an already built preview.
 * Fresh journeys use visible controls only. The coastal case loads an unchanged,
 * previously earned Playwright storage archive (origin remapped to the preview).
 * Read-only diagnostics measure state, layout, pixels and exact JS/CSS identity.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {bindStyleIdentity}=require('./v12-style-identity.cjs');
const {inspectCanvas,assessPixels,summarizeRgba,classifyConsole}=require('./v10-pixel-validation.cjs');
const ROOT=path.resolve(__dirname,'..');
const VIEWS=[{name:'desktop',width:1440,height:900,touch:false},{name:'portrait-touch',width:390,height:844,touch:true},{name:'landscape-touch',width:844,height:390,touch:true}];
const FORMS=['lily','lotus','iris','dahlia'],SERIES=['silver','crystal','lily','amber','celadon'];
const PLACES=['conservatory','observatory','meadow'];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fits=(r,w,h)=>!!r&&r.width>0&&r.height>0&&r.x>=-.75&&r.y>=-.75&&r.x+r.width<=w+.75&&r.y+r.height<=h+.75;

function retainedJourney(snapshot){
 const s=snapshot.state,a=s.atlas,v=s.voyage;
 return {started:s.started,ending:s.ending,cores:s.cores,letters:s.letters,moments:s.moments,lettersSent:s.lettersSent,
  gardenPlayer:s.player,atlas:{location:a.location,visited:a.visited,completed:a.completed,blooms:a.blooms,stars:a.stars,notes:a.notes,meadowCheckpoint:a.meadowCheckpoint,recoveries:a.recoveries},
  voyage:{stage:v.stage,letter:v.letter,predecessor:v.predecessor,oldRead:v.oldRead,ropes:v.ropes,sail:v.sail,distance:v.distance}};
}
function accessibleMetrics(el){
 const box=el.getBoundingClientRect(),r={x:box.x,y:box.y,width:box.width,height:box.height};
 const hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2),scrollParents=[];
 for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const css=getComputedStyle(p);if(/auto|scroll/.test(css.overflowY)&&p.scrollHeight>p.clientHeight+1){const b=p.getBoundingClientRect();scrollParents.push({id:p.id,top:b.top,bottom:b.bottom,scrollTop:p.scrollTop});}}
 return {rect:r,visible:el.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})&&!el.closest('[hidden]'),centerHit:hit===el||el.contains(hit),scrollParents,inScrollport:scrollParents.every(p=>r.y>=p.top-.75&&r.y+r.height<=p.bottom+.75)};
}

async function runCase(browser,view,{coast=false,url,out,report,write}){
 const item={name:view.name+(coast?'-earned-coast':'-fresh'),view,passed:false,checks:[],screenshots:[],samples:[],controls:[],errors:[],console:[]};
 report.cases.push(item);write();let context,page;
 try{
  let storageState;
  if(coast){
   const source=path.resolve(ROOT,process.env.EARNED_WRITING||'evidence/v12/full-2026-11-23T04-53-23-576Z/earned-writing.json');
   assert.ok(source.startsWith(ROOT+path.sep));const bytes=fs.readFileSync(source),original=JSON.parse(bytes);
   assert.equal(original.origins.length,1,'the earned archive must have a single game origin');
   storageState={...original,origins:original.origins.map(o=>({...o,origin:new URL(url).origin}))};
   assert.deepEqual(storageState.origins[0].localStorage,original.origins[0].localStorage,'earned values are not edited');
   item.earnedArchive={file:path.relative(ROOT,source).replaceAll('\\','/'),sha256:sha(bytes),originalOrigin:original.origins[0].origin,previewOrigin:new URL(url).origin,valuesUnchanged:true};
  }
  context=await browser.newContext({viewport:{width:view.width,height:view.height},deviceScaleFactor:1,hasTouch:view.touch,isMobile:false,...(storageState?{storageState}:{} )});
  page=await context.newPage();page.setDefaultTimeout(20000);
  await page.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()});
  page.on('pageerror',e=>item.errors.push(String(e)));
  page.on('console',m=>{if(['error','warning'].includes(m.type()))item.console.push({type:m.type(),text:m.text()});});
  page.on('dialog',d=>{item.errors.push('Unexpected dialog: '+d.message());d.dismiss().catch(()=>{});});
  const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
  const mark=label=>{item.checks.push(label);write();console.log('PASS '+item.name+': '+label);};
  async function identity(){
   const entry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.ok(entry);
   if(process.env.EXPECTED_JS)assert.equal(entry,process.env.EXPECTED_JS);
   const response=await page.request.get(new URL(entry,url).href);assert.ok(response.ok());const entrySha256=sha(await response.body());
   if(process.env.EXPECTED_ENTRY_SHA256)assert.equal(entrySha256,process.env.EXPECTED_ENTRY_SHA256);
   if(item.entry){assert.equal(entry,item.entry);assert.equal(entrySha256,item.entrySha256);}else Object.assign(item,{entry,entrySha256});
   await bindStyleIdentity(page,item,url);
   for(const key of ['entry','entrySha256','style','styleSha256']){if(report[key])assert.equal(item[key],report[key]);else report[key]=item[key];}
  }
  async function ready(){await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});await identity();}
  async function reachable(selector){
   const node=page.locator(selector);await node.waitFor({state:'visible'});await node.scrollIntoViewIfNeeded();
   const m=await node.evaluate(accessibleMetrics);item.controls.push({selector,...m});
   assert.ok(m.visible&&fits(m.rect,view.width,view.height)&&m.inScrollport&&m.centerHit,'reachable unoccluded control '+selector+': '+JSON.stringify(m));
   return node;
  }
  async function click(selector){const node=await reachable(selector);if(view.touch)await node.tap();else await node.click();}
  async function capture(label){
   const name=item.name+'-'+label,s=await snap(),pixels=await page.evaluate(inspectCanvas),pixelCheck=assessPixels(pixels);delete s.frameTimes;
   const dom=await page.evaluate(()=>({bodyClasses:document.body.className,modeButtons:[...document.querySelectorAll('[data-gallery]')].map(n=>({kind:n.dataset.gallery,visible:n.checkVisibility(),pressed:n.getAttribute('aria-pressed')})),workbenchOpen:document.getElementById('flower-workbench')?.open,contextVisible:document.getElementById('context')?.checkVisibility(),pageWidth:document.documentElement.scrollWidth,viewport:innerWidth}));
   item.samples.push({name,frame:s.frameNumber,pixels,pixelCheck,dom});fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify({snapshot:s,dom,pixels,pixelCheck},null,2));
   await page.screenshot({path:path.join(out,name+'.jpg')});item.screenshots.push(name+'.jpg');write();
   assert.ok(pixelCheck.valid,name+': '+pixelCheck.reasons.join('; '));assert.deepEqual(s.errors,[]);assert.equal(s.render.blocked,false);assert.ok(dom.pageWidth<=dom.viewport+1,'no page horizontal overflow');return s;
  }
  async function waitGallery(kind='flower'){
   await page.waitForFunction(k=>{const s=window.__SPRING__.snapshot();return s.mode==='gallery'&&s.focus==='flower'&&s.galleryKind===k&&!s.shaderPreparing;},kind,{timeout:120000});
   await page.locator('#context').waitFor({state:'visible'});assert.equal(await page.locator('#flower-workbench').getAttribute('open')!==null,true,'flower choices expanded');
   assert.equal(await page.locator('#flower-controls #gallery-tabs').count(),1,'mode switch belongs to the flower panel');
  }
  async function chooseForm(id){await click('[data-form="'+id+'"]');await page.waitForFunction(id=>window.__SPRING__.snapshot().flowerForm===id,id);assert.equal(await page.locator('[data-form="'+id+'"]').getAttribute('aria-pressed'),'true');}
  async function chooseSeries(id){await click('[data-material="'+id+'"]');await page.waitForFunction(id=>{const s=window.__SPRING__.snapshot();return s.material===id&&!s.shaderPreparing;},id,{timeout:120000});assert.equal(await page.locator('[data-material="'+id+'"]').getAttribute('aria-pressed'),'true');}
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await ready();
  if(coast){
   await click('#continue');await page.waitForFunction(()=>window.__SPRING__.snapshot().voyage.active);await page.waitForTimeout(700);
   const before=await capture('writing-before');assert.equal(before.state.voyage.stage,'writing');
   await click('#flower-studio');await waitGallery();await capture('studio-from-writing');await chooseForm('iris');await chooseSeries('amber');
   await click('#gallery-back');await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.mode==='play'&&s.voyage.active&&s.state.voyage.stage==='writing';});
   const after=await capture('writing-return');assert.deepEqual(retainedJourney(after),retainedJourney(before),'earned coast, letters and all map completions survive studio visit');mark('Earned writing desk resumes with its actual letters and complete map progress unchanged');
  }else{
   assert.equal((await snap()).state.started,false,'fresh case starts without injected journey progress');
   await click('#gallery');await waitGallery();await capture('home-studio');
   for(const id of view.name==='desktop'?FORMS:['lotus','iris']){await chooseForm(id);await capture('form-'+id);}
   for(const id of view.name==='desktop'?SERIES:['amber','celadon']){await chooseSeries(id);await capture('series-'+id);}
   mark('Visible flower shapes and palette buttons change real renderer selections');
   await click('[data-gallery="dust"]');await waitGallery('dust');await page.waitForFunction(()=>window.__SPRING__.snapshot().dustView>.94,null,{timeout:12000});await capture('dust');
   await chooseSeries('amber');await click('[data-gallery="flower"]');await waitGallery('flower');await page.waitForFunction(()=>window.__SPRING__.snapshot().dustView<.04,null,{timeout:12000});await capture('flower-again');mark('Dust and flower tabs remain visible and render both modes');
   if(view.name==='desktop'){
    const cycles=(await snap()).flowerCycle.cycles;await click('#flower-burst');await page.waitForFunction(n=>window.__SPRING__.snapshot().flowerCycle.cycles>n,cycles);await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting',null,{timeout:12000});await capture('burst-drift');
    await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='returning',null,{timeout:25000});await capture('returning');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid'&&window.__SPRING__.snapshot().scatter<.08,null,{timeout:20000});await capture('naturally-restored');mark('A real burst drifts then slowly returns without a restore button');
   }
   await chooseForm('dahlia');await chooseSeries('celadon');await click('#gallery-back');await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='cover');
   assert.equal((await snap()).state.started,false,'home studio does not start a journey');await page.reload({waitUntil:'domcontentloaded'});await ready();await click('#gallery');await waitGallery();
   let s=await capture('persisted-selection');assert.equal(s.flowerForm,'dahlia');assert.equal(s.material,'celadon');assert.equal(s.state.settings.flowerForm,'dahlia');assert.equal(s.state.settings.flowerSeries,'celadon');mark('Home return and reload preserve the chosen flower and palette');
   await click('[data-gallery="dust"]');await waitGallery('dust');await click('#map');await page.locator('#modal[open]').waitFor();await click('#map-flower-studio');await waitGallery('flower');
   assert.equal(await page.locator('#modal').evaluate(el=>el.open),false,'nested studio entry closes the map dialog');
   const resumedFrame=(await snap()).frameNumber;await page.waitForFunction(n=>window.__SPRING__.snapshot().frameNumber>n+2,resumedFrame,{timeout:15000});await capture('nested-map-studio');
   await click('#gallery-back');await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='cover');mark('Gallery → map → studio closes the overlay, resumes rendering and retains the original cover return');
   if(view.name==='desktop'){
    for(const place of PLACES){
     await click('#cover-atlas');await click('[data-atlas-location="'+place+'"]');await page.waitForFunction(id=>{const s=window.__SPRING__.snapshot();return s.atlas.active&&s.atlas.state.location===id;},place);await page.waitForTimeout(500);
     await page.locator('#scene canvas').focus();await page.keyboard.down('KeyW');await page.waitForTimeout(240);await page.keyboard.up('KeyW');await page.waitForTimeout(250);
     const before=await capture(place+'-before');assert.deepEqual(before.atlas.held,[]);
     if(place==='conservatory'){await click('#atlas-map');await click('#map-flower-studio');}else await click('#flower-studio');
     await waitGallery();await capture(place+'-studio');await click('[data-gallery="dust"]');await waitGallery('dust');await click('#gallery-back');
     await page.waitForFunction(id=>{const s=window.__SPRING__.snapshot();return s.mode==='play'&&s.atlas.active&&s.atlas.state.location===id;},place);await page.waitForTimeout(250);
     const after=await capture(place+'-return');assert.deepEqual(retainedJourney(after),retainedJourney(before),'studio leaves map and earned progress intact');
     for(const axis of ['x','y','z'])assert.ok(Math.abs(after.atlas.state.player[axis]-before.atlas.state.player[axis])<.025,'studio restores '+place+' player '+axis);assert.deepEqual(after.atlas.held,[]);assert.deepEqual(after.atlas.touch,[]);
     mark(place+': global/map studio entry restores original position and progress');await click('#home');await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='cover');
    }
    await click('#gallery');await waitGallery();const beforeGarden=await snap();await click('#map');await click('#map-garden');
    await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.mode==='play'&&!s.atlas.active&&!s.voyage.active&&s.focus===null;});
    const actualGarden=await capture('gallery-map-real-garden');assert.equal(await page.locator('#modal').evaluate(el=>el.open),false);
    for(const key of ['completed','blooms','stars','meadowCheckpoint','notes'])assert.deepEqual(actualGarden.state.atlas[key],beforeGarden.state.atlas[key],'return to old garden retains '+key);
    assert.deepEqual(actualGarden.state.voyage.letter,beforeGarden.state.voyage.letter);mark('Gallery → map → old garden enters actual roaming without losing earned map progress');
   }else{
    await click('#cover-atlas');await click('[data-atlas-location="conservatory"]');await page.waitForFunction(()=>window.__SPRING__.snapshot().atlas.active);await click('#flower-studio');await waitGallery();
    for(const selector of ['[data-gallery="flower"]','[data-gallery="dust"]','[data-form="lily"]','[data-form="dahlia"]','[data-material="silver"]','[data-material="celadon"]','#flower-burst','#gallery-back'])await reachable(selector);
    await capture('touch-controls-reachable');await click('#gallery-back');await page.waitForFunction(()=>window.__SPRING__.snapshot().atlas.active);mark('Touch studio entry, scrollable controls and return to the map are reachable');
   }
  }
  await identity();assert.deepEqual(item.errors,[]);item.consoleReview=classifyConsole(item.console);assert.deepEqual(item.consoleReview.blocking,[]);item.passed=true;
  const saved=path.join(out,item.name+'-earned-storage.json');await context.storageState({path:saved});item.storage={file:path.basename(saved),sha256:sha(fs.readFileSync(saved))};
 }catch(error){item.error=String(error.stack||error);if(page){await page.screenshot({path:path.join(out,item.name+'-failure.jpg')}).catch(()=>{});item.final=await page.evaluate(()=>window.__SPRING__?.snapshot()).catch(()=>null);if(item.final)delete item.final.frameTimes;}console.error('FAIL '+item.name+': '+error.message);}
 finally{await context?.close().catch(e=>{item.passed=false;item.cleanupError=String(e);});write();}
}

async function main(){
 const url=process.env.SPRING_URL||'http://127.0.0.1:5193/',out=path.join(ROOT,'evidence/v13/flower-access-'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(out,{recursive:true});
 const report={started:new Date().toISOString(),url,passed:false,cases:[],scope:'Four isolated Edge cases. Real click/tap/key input, native local persistence and read-only game/DOM/pixel observation. Three fresh viewports and one unchanged previously earned coastal archive.',limitations:['Touch is emulated Chromium input, not physical mobile certification.','The coastal fixture was earned by the preceding complete playthrough; its storage values are copied unchanged and only its localhost origin is remapped.']};
 const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));let browser;
 try{browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});for(const view of VIEWS)await runCase(browser,view,{url,out,report,write});await runCase(browser,VIEWS[0],{coast:true,url,out,report,write});report.passed=report.cases.length===4&&report.cases.every(c=>c.passed);assert.ok(report.passed,'flower access regression failed');}
 catch(error){report.error=String(error.stack||error);process.exitCode=1;}
 finally{await browser?.close().catch(e=>{report.passed=false;report.cleanupError=String(e);process.exitCode=1;});report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:report.passed,out,entry:report.entry,entrySha256:report.entrySha256,style:report.style,styleSha256:report.styleSha256,cases:report.cases.length}));}
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={retainedJourney,fits,accessibleMetrics};
