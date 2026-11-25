/** Capture the shipped application's real mixed output. Run serially with GPU QA.
 * Required: SPRING_URL, EXPECTED_JS, EARNED=<ordinary-input earned-storage.json>.
 * Optional: EARNED_REPORT, BROWSER_EXECUTABLE, BOOK_REPLAY=0.
 * This restores an earned archive, then uses visible UI and physical scene clicks.
 * It never calls game audio/state setters. A recording is not a listening verdict.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL,expectedJs=process.env.EXPECTED_JS;
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.ok(url&&expectedJs&&process.env.EARNED,'Set SPRING_URL, EXPECTED_JS and EARNED before capture.');
const source=path.resolve(root,process.env.EARNED),sourceReport=path.resolve(root,process.env.EARNED_REPORT||path.join(path.dirname(source),'report.json'));
const sourceBytes=fs.readFileSync(source),earned=JSON.parse(sourceBytes),provenanceBytes=fs.readFileSync(sourceReport),provenance=JSON.parse(provenanceBytes);
assert.equal(provenance.passed,true,'EARNED must be accompanied by a passed ordinary-input journey report.');
assert.match(provenance.scope||'',/ordinary[- ]input|ordinary input|physical input/i,'EARNED report must describe ordinary-input provenance.');
assert.equal(earned.origins?.length,1,'Expected exactly one archived game origin.');
assert.ok(earned.origins[0].localStorage?.some(item=>item.name.startsWith('spring-letter:')),'EARNED contains no Spring Letter save.');
const originalOrigin=earned.origins[0].origin,targetOrigin=new URL(url).origin;
const seeded={...earned,origins:earned.origins.map(origin=>({...origin,origin:targetOrigin}))};
const executablePath=process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const includeBook=process.env.BOOK_REPLAY!=='0',stamp=new Date().toISOString().replace(/[:.]/g,'-');
const out=path.join(root,'evidence','v9','audio-'+stamp);fs.mkdirSync(out,{recursive:true});
const phrase=[[0,0],[1,1],[2,2],[0,4],[1,4],[1,6],[2,6],[0,7]];
const expectedNotes=Array.from({length:3},()=>Array(8).fill(false));phrase.forEach(([voice,beat])=>expectedNotes[voice][beat]=true);
const report={started:new Date().toISOString(),url,expectedJs,passed:false,scope:{
 method:'Native AudioNode.connect destination tap + MediaRecorder on the real mixed output; UI-only composition/playback/mute/commit.',
 archivedStateRestored:true,syntheticProgressInjected:false,gameAudioApiInvokedByTest:false,gameStateSettersInvoked:false,
 diagnosticReads:'__SPRING__.snapshot() and project() only; projected positions locate the 24 real scene objects.',
 listeningPerformed:false,pcmDecoded:false,perceptualVerdict:null,
 caveat:'passed means the input route, observed state checks and recording packets succeeded. It does not establish artistic sound quality, PCM loudness or clipping.',
 clockCaveat:'MediaRecorder packets can advance differently while AudioContext is suspended. Use marks, chunk timecodes and AudioContext clocks when decoding the mute/modal windows.'},
 provenance:{archive:source,sha256:sha256(sourceBytes),report:sourceReport,reportSha256:sha256(provenanceBytes),sourceEntry:provenance.entry||null,originalOrigin,targetOrigin,originRetargetedOnly:true},
 checks:[],errors:[],consoleErrors:[],requestFailures:[],assets:[],steps:[],clicks:[],segments:[],files:[],includeBook};
const check=(ok,label)=>{report.checks.push({label,passed:!!ok});assert.ok(ok,label);};
const write=()=>fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify(report,null,2)+'\n');

(async()=>{
 let browser,context,page,recording=false;const scriptResponses=[];
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const stage=async()=>((await snap()).letters.stages.tide);
 const mark=(label,extra={})=>page.evaluate(({label,extra})=>window.__V9_AUDIO_CAPTURE__.mark(label,extra),{label,extra});
 async function segment(label,action){const start=await mark(label+'-start');await action();const end=await mark(label+'-end');report.segments.push({label,startWallSeconds:start.recordingWallSeconds,endWallSeconds:end.recordingWallSeconds,startContexts:start.contexts,endContexts:end.contexts});}
 try{
  browser=await chromium.launch({executablePath,headless:true});report.browser={version:browser.version(),executablePath,headless:true};
  context=await browser.newContext({viewport:{width:1440,height:900},storageState:seeded});page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(error.stack||String(error)));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),error:request.failure()?.errorText}));
  page.on('response',response=>{if(response.request().resourceType()==='script')scriptResponses.push((async()=>{try{const bytes=await response.body();report.assets.push({url:response.url(),status:response.status(),bytes:bytes.length,sha256:sha256(bytes)});}catch(error){report.requestFailures.push({url:response.url(),error:String(error)});}})());});
  await page.addInitScript(()=>{
   const nativeConnect=AudioNode.prototype.connect,contexts=[],known=new WeakMap(),nodeIds=new WeakMap();
   const errors=[],events=[],marks=[],samples=[];let nextId=1,connectCalls=0,recorder=null,chunks=[],timer=null,start=null;
   const nodeId=node=>{if(!nodeIds.has(node))nodeIds.set(node,nextId++);return nodeIds.get(node);};
   const clocks=()=>contexts.map(entry=>({id:entry.id,currentTime:entry.context.currentTime,state:entry.context.state,sampleRate:entry.context.sampleRate,outputTimestamp:typeof entry.context.getOutputTimestamp==='function'?entry.context.getOutputTimestamp():null,tappedSources:[...entry.sources]}));
   function observe(label,extra={}){const snapshot=window.__SPRING__?.snapshot(),tide=snapshot?.letters?.stages?.tide;return {label,iso:new Date().toISOString(),performanceMs:performance.now(),recordingWallSeconds:start?(performance.now()-start.performanceMs)/1000:null,contexts:clocks(),audio:snapshot?.audio||null,mode:snapshot?.mode,focus:snapshot?.focus,tide:tide?{ready:tide.ready,playing:tide.playing,playhead:tide.playhead,noteCount:tide.noteCount,voiceCount:tide.voiceCount,draft:tide.draft}:null,...extra};}
   AudioNode.prototype.connect=function(destination,...args){
    const result=nativeConnect.call(this,destination,...args);connectCalls++;nodeId(this);
    if(destination===this.context.destination){try{
     let entry=known.get(this.context);if(!entry){entry={id:contexts.length+1,context:this.context,tap:this.context.createMediaStreamDestination(),sources:new Set()};known.set(this.context,entry);contexts.push(entry);}
     const id=nodeId(this);if(!entry.sources.has(id)){nativeConnect.call(this,entry.tap,args[0]||0,0);entry.sources.add(id);events.push({type:'destination-tapped',node:id,context:entry.id,performanceMs:performance.now(),audioTime:this.context.currentTime});}
    }catch(error){errors.push({type:'tap',message:String(error)});}}
    return result;
   };
   window.__V9_AUDIO_CAPTURE__={
    mark(label,extra){const observed=observe(label,extra);marks.push(observed);return observed;},
    start(){
     if(recorder)throw Error('Capture already started');if(contexts.length!==1)throw Error('Expected one real game AudioContext, found '+contexts.length);
     if(typeof MediaRecorder==='undefined')throw Error('MediaRecorder is unavailable');
     const mimeType=['audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported(type));if(!mimeType)throw Error('No supported WebM audio recorder');
     recorder=new MediaRecorder(contexts[0].tap.stream,{mimeType,audioBitsPerSecond:192000});
     recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);events.push({type:'chunk',bytes:event.data.size,timecode:event.timecode,performanceMs:performance.now(),contexts:clocks()});};
     recorder.onerror=event=>errors.push({type:'recorder',message:String(event.error||event)});
     start=observe('recording-origin');recorder.start(500);marks.push(observe('recording-start'));timer=setInterval(()=>samples.push(observe('sample')),250);
     return {mimeType:recorder.mimeType,start};
    },
    async stop(){
     if(!recorder)throw Error('Capture was not started');clearInterval(timer);marks.push(observe('recording-stop-request'));
     if(recorder.state!=='inactive')await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Recorder stop timed out')),7000);recorder.addEventListener('stop',()=>{clearTimeout(timeout);resolve();},{once:true});recorder.stop();});
     const stopped=observe('recording-stopped'),blob=new Blob(chunks,{type:recorder.mimeType});
     const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});
     return {base64,mimeType:recorder.mimeType,bytes:blob.size,start,stopped,marks,samples,events,errors,instrumentation:{contexts:contexts.length,connectCalls,observedSourceNodes:nextId-1,additionalCaptureSinks:contexts.length,note:'Observed connect endpoints are cumulative, not a live-node/leak count. Game node budgets come from snapshot.audio.'}};
    }
   };
  });
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});check(response?.ok(),'frozen page responds successfully');report.documentSha256=sha256(await response.body());
  await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  const entrySrc=await page.locator('script[type="module"][src]').last().getAttribute('src'),entryUrl=new URL(entrySrc,url).href;
  await Promise.all(scriptResponses);const entryAsset=report.assets.find(asset=>asset.url===entryUrl);check(!!entryAsset,'hash is available for the script response actually loaded by the page');
  report.entry={src:entrySrc,url:entryUrl,sha256:entryAsset.sha256,bytes:entryAsset.bytes,status:entryAsset.status};
  check(entryAsset.status===200&&(entryAsset.sha256===expectedJs||entrySrc===expectedJs||entryUrl.endsWith('/'+expectedJs.replace(/^\//,''))||path.posix.basename(new URL(entryUrl).pathname)===expectedJs),'EXPECTED_JS matches actual entry filename, path or SHA-256');
  await page.locator('#continue').click();await page.waitForTimeout(500);let initial=await snap();
  check(!!initial.state.letters.entries.wind.choice,'earned archive enables the existing book travel action');
  report.restored={ending:initial.state.ending,letters:initial.state.letters,completedMoments:initial.state.moments};
  if(initial.audio.muted){await page.locator('#sound').click();report.steps.push('Unmuted the restored preference using the visible sound control.');}
  await page.locator('#journal').click();await page.locator('[data-travel-letter="tide"]').click();await page.waitForTimeout(1000);
  await page.locator('#moment-enter').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.activeId==='tide');await page.waitForTimeout(1500);
  const edit=page.locator('#moment-edit');if(await edit.isVisible())await edit.click();
  await page.locator('[data-m-action="clear"]').waitFor({state:'visible'});if(await page.locator('[data-m-action="clear"]').isEnabled())await page.locator('[data-m-action="clear"]').click();
  await page.waitForTimeout(1100);let current=await stage();check(current.targets.length===24,'the real tide scene exposes all 24 authored objects');check(current.noteCount===0,'visible clear control removes the previous draft');
  report.beforeComposition=current.draft;
  for(const [voice,beat]of phrase){
   const target=(await stage()).targets.find(item=>item.voice===voice&&item.beat===beat);assert.ok(target,'note target exists');
   const projected=await page.evaluate(position=>window.__SPRING__.project(...position),target.position),panel=await page.locator('#letter-panel').boundingBox();
   check(projected.x>=8&&projected.x<=1432&&projected.y>=74&&projected.y<(panel?.y??900)-2,'scene object is visibly above the operation panel: '+voice+':'+beat);
   await page.mouse.click(projected.x,projected.y);await page.waitForTimeout(110);
   check((await stage()).targets.find(item=>item.voice===voice&&item.beat===beat).active,'ordinary mouse click places note '+voice+':'+beat);
   report.clicks.push({voice,beat,world:target.position,screen:projected});
  }
  current=await stage();assert.deepEqual(current.draft.notes,expectedNotes);check(current.voiceCount===3&&!current.ready,'a newly edited three-voice score must still be listened to');report.composed=current.draft;
  await page.waitForFunction(()=>{const a=window.__SPRING__.snapshot().audio;return a.loaded&&a.loadedSamples?.length===7;},null,{timeout:45000});
  initial=await snap();check(initial.audio.loadErrors.length===0,'all seven real instrument samples loaded without errors');check(initial.audio.state==='running'&&!initial.audio.muted&&!initial.audio.paused,'UI gestures unlocked unmuted real game audio');report.audioBefore=initial.audio;
  await page.screenshot({path:path.join(out,'composed.png')});report.recording=await page.evaluate(()=>window.__V9_AUDIO_CAPTURE__.start());recording=true;
  await segment('stage-listen-1',async()=>{
   const before=(await stage()).draft.playCount;await page.locator('[data-m-action="play"]').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.stages.tide.playing);
   await mark('stage-listen-1-active');await page.waitForFunction(count=>{const s=window.__SPRING__.snapshot().letters.stages.tide;return !s.playing&&s.draft.playCount>count&&s.ready;},before,{timeout:18000});await page.waitForTimeout(650);
  });
  check((await stage()).ready,'the exact composed score became ready after a complete actual playback');
  await mark('mute-request');await page.locator('#sound').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.muted===true);
  await segment('muted-three-seconds',()=>page.waitForTimeout(3000));
  await mark('unmute-request');await page.locator('#sound').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.muted===false);await mark('unmute-active');
  await segment('stage-listen-2',async()=>{
   const before=(await stage()).draft.playCount;await page.locator('[data-m-action="play"]').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.stages.tide.playing);
   await page.waitForFunction(count=>{const s=window.__SPRING__.snapshot().letters.stages.tide;return !s.playing&&s.draft.playCount>count;},before,{timeout:18000});await page.waitForTimeout(650);
  });
  report.afterListening=(await stage()).draft;assert.deepEqual(report.afterListening.notes,expectedNotes);
  if(includeBook){
   await mark('score-commit-request');await page.locator('[data-commit="new"]').click();await page.waitForTimeout(250);
   const saved=(await snap()).state.letters.entries.tide;check(saved.edition===2,'visible reply commits the new artwork edition');assert.deepEqual(saved.artwork.notes,expectedNotes);report.savedEntry=saved;
   await page.locator('#moment-close').click();await page.locator('#journal').click();
   const button=page.locator('[data-replay-score]');await button.waitFor({state:'visible'});
   await segment('book-saved-score-excerpt',async()=>{
    await button.click();await page.waitForFunction(()=>document.querySelector('[data-replay-score]')?.getAttribute('aria-pressed')==='true');check((await snap()).audio.paused===false,'book replay uses audible real audio while the game is paused');await page.waitForTimeout(1500);
    await page.screenshot({path:path.join(out,'book-replay.png')});
   });
   await mark('book-close-request');await page.locator('#close-modal').click();await page.waitForTimeout(250);
   const eventCount=(await snap()).audio.eventCount;
   await segment('book-close-cancel-observation',()=>page.waitForTimeout(1000));
   const closed=await snap();check(!(await page.locator('#modal').evaluate(element=>element.open)),'normal close dismisses the letter book');check(closed.audio.eventCount===eventCount,'no remaining saved-score note events fire after book close');check(!closed.letters.stages.tide.playing,'book close leaves no stage playback active');report.bookCancellation={eventCountAtClose:eventCount,eventCountAfter:closed.audio.eventCount};
  }
  report.final=await snap();delete report.final.frameTimes;
  report.steps.push('Restored genuine earned archive in an isolated context; continued via UI; travelled to tide through the book; expanded controls; cleared through UI; clicked eight notes among the 24 world objects; listened fully; muted for three seconds; unmuted and listened again.');
  if(includeBook)report.steps.push('Committed the new actual score using the reply button; heard a saved-score excerpt in the letter book; closed normally and observed cancellation.');
  check(report.errors.length===0,'no page errors');check(report.consoleErrors.length===0,'no console errors');check(report.requestFailures.length===0,'no failed asset requests');
 }catch(error){report.failure=error.stack||String(error);if(page){report.failureState=await snap().catch(()=>null);await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}}
 finally{
  if(page&&recording){try{
   const capture=await page.evaluate(()=>window.__V9_AUDIO_CAPTURE__.stop()),bytes=Buffer.from(capture.base64,'base64');delete capture.base64;
   fs.writeFileSync(path.join(out,'game-output.webm'),bytes);report.capture=capture;report.files.push({file:'game-output.webm',bytes:bytes.length,sha256:sha256(bytes)});
   const stats=capture.samples.map(sample=>sample.audio).filter(Boolean);
   report.observed={captureWallSeconds:capture.stopped.recordingWallSeconds,sampleCount:stats.length,loadedSampleCounts:[...new Set(stats.map(s=>s.loadedSamples?.length))],persistentNodeCounts:[...new Set(stats.map(s=>s.persistentNodes))],persistentSourceCounts:[...new Set(stats.map(s=>s.persistentSources))],maximumVoices:Math.max(0,...stats.map(s=>s.voices||0)),maximumQueuedNotes:Math.max(0,...stats.map(s=>s.queuedNotes||0)),mutedSamples:stats.filter(s=>s.muted).length,contextStates:[...new Set(capture.samples.flatMap(s=>s.contexts.map(c=>c.state)))]};
   check(bytes.length>10000,'MediaRecorder produced actual audio packets');check(capture.errors.length===0,'audio tap and recorder reported no errors');check(stats.length>0&&stats.every(s=>s.loadedSamples?.length===7&&s.loadErrors.length===0),'all observed samples retain seven loaded instruments and no load errors');check(stats.some(s=>s.muted)&&stats.some(s=>!s.muted),'capture contains both muted and unmuted observations');check(stats.every(s=>s.voices<=s.voiceLimit),'observed foreground voices stay within the engine budget');
  }catch(error){report.captureFailure=error.stack||String(error);}}
  if(context)await context.close().catch(error=>report.errors.push(String(error)));if(browser)await browser.close().catch(error=>report.errors.push(String(error)));
  report.finished=new Date().toISOString();report.passed=!report.failure&&!report.captureFailure&&!!report.capture&&report.errors.length===0&&report.checks.every(item=>item.passed);write();
 }
 console.log(JSON.stringify({passed:report.passed,directory:out,entry:report.entry,captureWallSeconds:report.observed?.captureWallSeconds,listeningPerformed:false,pcmDecoded:false}));
 if(!report.passed){console.error(report.failure||report.captureFailure||'Capture checks failed');process.exitCode=1;}
})().catch(error=>{report.failure=error.stack||String(error);write();console.error(error);process.exitCode=1;});
