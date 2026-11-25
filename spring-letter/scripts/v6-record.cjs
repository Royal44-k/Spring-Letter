/* One fresh, uncut journey, bound to the intended immutable candidate. */
// recordVideo locates FFmpeg through Playwright's registry, not our metadata probe.
if(!process.env.PLAYWRIGHT_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=require('node:path').resolve(__dirname,'../.tools/playwright');
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),evidence=path.join(root,'evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5194';
const WIDTH=1440,HEIGHT=900,shaBytes=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),shaFile=file=>shaBytes(fs.readFileSync(file));
const runId=()=>new Date().toISOString().replace(/[:.]/g,'-')+'-'+crypto.randomBytes(4).toString('hex');
const relative=file=>path.relative(root,file).replaceAll('\\','/');
function loadRecordingRuntime(){
 const registry=require('playwright-core/lib/coreBundle').registry.registry,ffmpegPath=registry.findExecutable('ffmpeg').executablePathOrDie('javascript');
 assert.ok(fs.statSync(ffmpegPath).size>100000,'FFmpeg registry executable is missing or incomplete');
 const probe=spawnSync(ffmpegPath,['-version'],{encoding:'utf8',windowsHide:true,timeout:10000});assert.equal(probe.status,0,'FFmpeg registry executable cannot run');
 return{playwrightVersion:require('playwright/package.json').version,browsersPath:process.env.PLAYWRIGHT_BROWSERS_PATH,ffmpegPath,ffmpegSha256:shaFile(ffmpegPath),ffmpegVersion:probe.stdout.split(/\r?\n/)[0]};
}
function entryPaths(html){const entry=html.match(/<script\b[^>]*\bsrc="([^" ]+\.js)"[^>]*>/)?.[1],styleBuild=html.match(/<link\b[^>]*\bhref="([^" ]+\.css)"[^>]*>/)?.[1];assert.ok(entry&&styleBuild,'candidate HTML must declare JS and CSS');return{entry,styleBuild};}
function loadCandidateIdentity(){
 const manifestPath=path.join(evidence,'v6-build-candidate-g.json'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')),outDir=path.resolve(manifest.outDir);
 assert.equal(outDir,path.join(root,'.qa-v6','candidate-g'),'unexpected candidate directory');
 const html=fs.readFileSync(path.join(outDir,'index.html')),paths=entryPaths(html.toString('utf8'));assert.equal(paths.entry,manifest.entry);assert.equal(paths.entry,'/assets/index-BAJMaxNn.js','final G entry required');
 const identity={candidate:'candidate-g',manifestFile:relative(manifestPath),manifestSha256:shaFile(manifestPath),indexSha256:shaBytes(html),...paths};
 for(const [key,asset]of[['entrySha256',paths.entry],['styleSha256',paths.styleBuild]]){assert.match(asset,/^\/assets\/[a-zA-Z0-9_.-]+$/);const item=manifest.dist.find(v=>v.path===asset.slice(1));assert.ok(item,'asset missing from candidate manifest');const file=path.join(outDir,item.path);assert.equal(fs.statSync(file).size,item.bytes);assert.equal(shaFile(file),item.sha256);identity[key]=item.sha256;}
 return identity;
}
async function verifyServedCandidate(baseUrl,expected){
 const request=async file=>{const response=await fetch(new URL(file,baseUrl));assert.equal(response.status,200,'candidate asset unavailable');return Buffer.from(await response.arrayBuffer());};
 const html=await request('/');assert.equal(shaBytes(html),expected.indexSha256,'served HTML differs from candidate');assert.deepEqual(entryPaths(html.toString('utf8')),{entry:expected.entry,styleBuild:expected.styleBuild});
 for(const [asset,hash]of[[expected.entry,expected.entrySha256],[expected.styleBuild,expected.styleSha256]])assert.equal(shaBytes(await request(asset)),hash,'served candidate asset bytes differ');
}
function publishEvidenceCopies(runDirectory,destinationDirectory,names,{id,manifestName='v6-recording-copy-manifest.json'}={}){
 assert.ok(names.every(name=>typeof name==='string'&&name===path.basename(name)&&!name.includes('\\')&&!name.includes('/')&&name!=='.'&&name!=='..'),'only plain artifact filenames may be copied');
 assert.equal(new Set(names).size,names.length,'duplicate artifact names');
 const sources=names.map(file=>({file,source:path.join(runDirectory,file),bytes:fs.statSync(path.join(runDirectory,file)).size,sha256:shaFile(path.join(runDirectory,file))}));
 const previous=[];for(const file of [...names,manifestName]){const current=path.join(destinationDirectory,file);if(fs.existsSync(current)){const archived=path.join(runDirectory,'previous-canonical',file);fs.mkdirSync(path.dirname(archived),{recursive:true});fs.copyFileSync(current,archived,fs.constants.COPYFILE_EXCL);assert.equal(shaFile(archived),shaFile(current));previous.push({file,retained:relative(archived),bytes:fs.statSync(archived).size,sha256:shaFile(archived)});}}
 const copies=[];for(const item of sources){const dest=path.join(destinationDirectory,item.file);fs.copyFileSync(item.source,dest);assert.equal(fs.statSync(dest).size,item.bytes);assert.equal(shaFile(dest),item.sha256);copies.push({...item,source:relative(item.source),canonical:relative(dest)});}
 const result={date:new Date().toISOString(),runId:id,retainedDirectory:relative(runDirectory),copies,previous,scope:'Canonical artifacts are byte-for-byte copies of this independent retained recording attempt. Previously existing canonical artifacts are retained before replacement; no gameplay, video frames or reports are synthesized.'};
 const file=path.join(runDirectory,manifestName);fs.writeFileSync(file,JSON.stringify(result,null,2));fs.copyFileSync(file,path.join(destinationDirectory,manifestName));assert.equal(shaFile(file),shaFile(path.join(destinationDirectory,manifestName)));return result;
}
async function recordJourney(){
 const expected=loadCandidateIdentity(),recordingRuntime=loadRecordingRuntime(),id=runId(),runDirectory=path.join(evidence,'v6-record-runs',id),rawDirectory=path.join(runDirectory,'raw');fs.mkdirSync(rawDirectory,{recursive:true});
 const checks=[],milestones=[],errors=[],requestsFailed=[];let browser=null,context=null,page=null,video=null,h=null,completed=false,runError=null,exportError=null;
 let startedAt=Date.now(),entry=null,styleBuild=null,entrySha256=null,styleSha256=null,finalEntry=null,finalStyleBuild=null,openingElapsedMs=null,final=null;
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot()),capture=name=>h.capture(name),hashAsset=async asset=>{const r=await page.request.get(new URL(asset,url).href);assert.equal(r.status(),200);return shaBytes(await r.body());};
 async function mark(name){const s=await snap();milestones.push({name,wallMs:Date.now()-startedAt,mode:s.mode,focus:s.focus,opening:s.opening,flowerPhase:s.flowerCycle.phase,player:s.state.player,cores:s.state.cores,ending:s.state.ending});await capture(name);console.log('REC '+name);}
 try{
  await verifyServedCandidate(url,expected);
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});context=await browser.newContext({viewport:{width:WIDTH,height:HEIGHT},recordVideo:{dir:rawDirectory,size:{width:WIDTH,height:HEIGHT}}});
  page=await context.newPage();video=page.video();startedAt=Date.now();h=harness(page,{evidence:runDirectory,prefix:'v6-record',width:WIDTH,height:HEIGHT});
  const {act,walk,routeTo,drawBridge}=h;
  page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>requestsFailed.push({url:r.url(),reason:r.failure()?.errorText}));
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:90000});
  entry=await page.locator('script[type=module][src]').last().getAttribute('src');styleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.equal(entry,expected.entry,'record the intended candidate');assert.equal(styleBuild,expected.styleBuild,'record the intended stylesheet');
  entrySha256=await hashAsset(entry);styleSha256=await hashAsset(styleBuild);assert.equal(entrySha256,expected.entrySha256);assert.equal(styleSha256,expected.styleSha256);
  await page.waitForTimeout(1500);await mark('00-cover');await page.locator('#begin').click();
  const introStart=Date.now(),openingIndices=[];
  while(Date.now()-introStart<90000){const s=await snap();if(s.mode==='play')break;assert.equal(s.mode,'opening');if(!openingIndices.includes(s.opening)){openingIndices.push(s.opening);await mark('01-opening-'+(s.opening+1));}await page.waitForTimeout(250);}
  openingElapsedMs=Date.now()-introStart;assert.deepEqual(openingIndices,[0,1,2,3,4,5]);assert.equal((await snap()).mode,'play');assert.ok(openingElapsedMs>=47000,'six opening scenes advance without skip or next');
  assert.equal((await snap()).state.p1.solved,false);assert.deepEqual((await snap()).state.cores,[null,null]);checks.push('fresh save and all six automatically advancing opening scenes');
  await page.waitForTimeout(1500);await mark('02-first-garden');await act();await page.waitForTimeout(800);assert.equal((await snap()).focus,'flower');await mark('03-flower-close');
  await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting',null,{timeout:20000});
  await page.mouse.move(550,360);await page.mouse.down();for(let i=0;i<24;i++){await page.mouse.move(550+i*14,360+Math.sin(i*.25)*80);await page.waitForTimeout(35);}await page.mouse.up();
  const drift=await snap();assert.equal(drift.state.p1.solved,false);assert.equal(drift.flowerCycle.phase,'drifting');assert.ok(drift.state.p1.ink>=1.2);await mark('04-flower-wind');
  await page.waitForFunction(()=>window.__SPRING__.snapshot().state.p1.solved,null,{timeout:25000});assert.equal((await snap()).flowerCycle.phase,'solid');checks.push('flower burst, wind writing and automatic gradual restoration');await mark('05-flower-return');
  await act();await routeTo([[0,2],[0,-5],[0,-10.7]]);await act();await page.waitForTimeout(850);assert.equal((await snap()).focus,'wind');await mark('06-wind-entry');
  await h.mainWindHeld();assert.equal((await snap()).state.wind.solved,false);await page.mouse.up();await page.waitForFunction(()=>window.__SPRING__.snapshot().state.wind.solved,null,{timeout:5000});checks.push('seed follows held wind around stone and completes only after deliberate release');await mark('07-wind-arrival');
  await act();await routeTo([[0,-21],[0,-26]]);await page.waitForTimeout(500);assert.equal((await snap()).weaver.origin,'A');await drawBridge('bridge_am');assert.equal((await snap()).state.bridge.structure,'bridge_am');await mark('08-first-bridge');
  await walk(0,-29);assert.equal((await snap()).state.bridge.support,'bridge_am');await walk(0,-32);await drawBridge('bridge_mf');assert.equal((await snap()).state.bridge.structure,'bridge_mf');await mark('09-second-bridge');
  await routeTo([[0,-35],[0,-38],[0,-43]]);await page.waitForTimeout(300);assert.equal((await snap()).state.bridge.solved,true);assert.equal((await snap()).delivery.kind,'take');checks.push('two hand-drawn bridges and actual walking reach the terminal shore');await mark('10-terminal');
  await act();assert.equal((await snap()).carried,0);await walk(-3,-46);await page.locator('#focus-button').click();await page.waitForTimeout(350);assert.deepEqual((await snap()).state.cores,['memory',null]);await mark('11-memory-planted');
  await walk(0,-43);await act();assert.equal((await snap()).carried,1);await walk(0,-48);await act();assert.deepEqual((await snap()).state.cores,['memory','season']);checks.push('two individually carried seeds planted at two distinct futures');await mark('12-season-planted');
  await walk(0,-50.25);await act();assert.equal(await page.locator('#send-confirm').isVisible(),true);assert.equal((await snap()).state.ending,null);await mark('13-consequence-preview');await page.waitForTimeout(3500);
  await page.locator('#send-confirm').click();await page.waitForTimeout(1400);assert.equal((await snap()).state.ending,'memory+season');await mark('14-farewell');
  await page.waitForSelector('#ending-rewind',{timeout:18000});await mark('15-spring-letter');await page.waitForTimeout(4500);checks.push('explicit confirmation commits one complete ending and letter');
  final=await snap();delete final.frameTimes;assert.deepEqual(errors,[]);assert.deepEqual(final.errors,[]);assert.deepEqual(requestsFailed,[]);
  finalEntry=await page.locator('script[type=module][src]').last().getAttribute('src');finalStyleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.equal(finalEntry,entry);assert.equal(finalStyleBuild,styleBuild);assert.equal(await hashAsset(entry),entrySha256);assert.equal(await hashAsset(styleBuild),styleSha256);
  await context.storageState({path:path.join(runDirectory,'v6-record-real-play-storage.json')});completed=true;
 }catch(error){runError=error;if(page){await page.mouse.up().catch(()=>{});await page.keyboard.up('Space').catch(()=>{});await capture('failure').catch(()=>{});final=await snap().catch(()=>null);if(final)delete final.frameTimes;}}
 finally{
  const wallElapsedMs=Date.now()-startedAt;
  if(context)await context.close().catch(error=>{exportError=error;});
  const videoName=completed&&!runError?'spring-letter-v6-uncut-silent.webm':'v6-record-incomplete-silent.webm',destination=path.join(runDirectory,videoName);
  // Playwright Artifact.saveAs uses its channel: export before browser.close.
  if(video)try{await video.saveAs(destination);}catch(error){exportError=error;}
  if(browser)await browser.close().catch(error=>{exportError ||= error;});
  const hasVideo=fs.existsSync(destination),fileBytes=hasVideo?fs.statSync(destination).size:0,fileSha256=hasVideo?shaFile(destination):null;
  const success=completed&&!runError&&!exportError&&fileBytes>1000;
  if(!success&&!runError)runError=exportError||new Error('recording export is missing or too small');
  let mediaDurationSeconds=null;const ffmpeg=recordingRuntime.ffmpegPath;
  if(hasVideo&&fs.existsSync(ffmpeg)){const probe=spawnSync(ffmpeg,['-hide_banner','-i',destination],{encoding:'utf8',windowsHide:true});const duration=(probe.stderr||'').match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);if(duration)mediaDurationSeconds=Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]);}
  const report={date:new Date().toISOString(),url,success,runId:id,retainedDirectory:relative(runDirectory),candidate:expected,recordingRuntime,build:{entry,finalEntry,entrySha256,styleBuild,finalStyleBuild,styleSha256},viewport:[WIDTH,HEIGHT],file:hasVideo?videoName:null,fileBytes,fileSha256,audioRecorded:false,uncut:true,wallElapsedMs,mediaDurationSeconds,openingElapsedMs,checks,milestones,route:h?.route||[],captures:h?.captures||[],errors,requestsFailed,storageExport:success?'v6-record-real-play-storage.json':null,failure:runError?.stack||exportError?.stack||null,final,clockScope:'Milestones use elapsed wall time after page creation. WebM begins at browser capture and may use a different origin. No claim of exact video-to-milestone synchronization.',scope:'One fresh journey through ordinary visible keyboard/mouse/UI input. Read-only snapshot/project navigation. Complete six-scene automatic opening, flower natural cycle, main wind, two bridges, two seed identities and one confirmed ending. No progress writes or injected storage. Silent Playwright capture, uncut, no speed changes or replacement frames. Recording overhead is not a performance benchmark. Video SHA256 is computed immediately after export; an independent decoder must verify these same bytes.'};
  const reportName=success?'v6-recording-verification.json':'v6-recording-failure.json';fs.writeFileSync(path.join(runDirectory,reportName),JSON.stringify(report,null,2));
  if(success)publishEvidenceCopies(runDirectory,evidence,[videoName,reportName,report.storageExport,...report.captures],{id});
  console.log(JSON.stringify({success,runId:id,retainedDirectory:relative(runDirectory),file:report.file,fileBytes,fileSha256,report:relative(path.join(runDirectory,reportName))}));
 }
 if(runError)throw runError;
}
if(require.main===module)recordJourney().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={recordJourney,loadCandidateIdentity,loadRecordingRuntime,entryPaths,verifyServedCandidate,publishEvidenceCopies,shaFile};
