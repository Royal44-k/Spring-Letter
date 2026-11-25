/** Record the shipped game's mixed output, using only ordinary UI inputs.
 * Run serially with the other GPU checks. This is a capture, not a listening verdict.
 * SPRING_URL=http://127.0.0.1:5199 EXPECTED_JS=index-….js node scripts/v7-audio-capture.cjs
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),base=path.join(root,'evidence','v7-audio');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const out=path.join(base,'captures',stamp);
const url=process.env.SPRING_URL||'http://127.0.0.1:5199';
const executablePath=process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
fs.mkdirSync(out,{recursive:true});

(async()=>{
 const report={generatedAt:new Date().toISOString(),url,expectedJs:process.env.EXPECTED_JS||null,passed:false,
  scope:{method:'AudioNode.connect destination tap + MediaRecorder; shipped application; ordinary UI only',
   stateInjection:false,storageSeeded:false,audioApiInvokedByTest:false,listeningPerformed:false,
   recordingOrigin:'start() wall clock, not page load; timeline marks include absolute performance and AudioContext clocks',
   clockCaveat:'Recorder packet timestamps may advance differently while AudioContext is suspended. Compare chunk timecodes, context clocks and decoded media before mapping a mute/pause window to PCM samples.',
   resultMeaning:'passed only establishes completed input route, recording bytes and observed state checks; it does not certify perceived sound quality or a mastering target.'},
  errors:[],consoleErrors:[],requestFailures:[],checks:[],steps:[],assets:[],files:[]};
 let browser,context,page,h,recording=false;
 const check=(ok,label)=>{report.checks.push({label,passed:!!ok});assert.ok(ok,label);};
 try{
  browser=await chromium.launch({executablePath,headless:true});
  report.browser={version:browser.version(),executablePath,headless:true};
  context=await browser.newContext({viewport:{width:1440,height:900}});
  page=await context.newPage();h=harness(page,{evidence:out,prefix:'audio'});
  page.on('pageerror',e=>report.errors.push(e.stack||String(e)));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText}));
  await page.addInitScript(()=>{
   const nativeConnect=AudioNode.prototype.connect,contexts=[],byContext=new WeakMap(),nodeIds=new WeakMap();
   const events=[],errors=[],marks=[],samples=[];let nextId=1,connections=0,recorder=null,chunks=[],timer=null,start=null;
   const nodeId=node=>{if(!nodeIds.has(node))nodeIds.set(node,nextId++);return nodeIds.get(node);};
   const clock=c=>({currentTime:c.currentTime,state:c.state,sampleRate:c.sampleRate,
    outputTimestamp:typeof c.getOutputTimestamp==='function'?c.getOutputTimestamp():null});
   const clocks=()=>contexts.map(c=>({id:c.id,...clock(c.context),tappedSources:[...c.sources]}));
   function observe(label,extra={}){
    const s=window.__SPRING__?.snapshot();
    return {label,iso:new Date().toISOString(),wallMs:Date.now(),performanceMs:performance.now(),
     recordingWallSeconds:start?(performance.now()-start.performanceMs)/1000:null,contexts:clocks(),
     audio:s?.audio||null,mode:s?.mode,focus:s?.focus,flowerPhase:s?.flowerCycle?.phase,
     player:s?.state?.player,resonance:s?.resonance?{active:s.resonance.active,context:s.resonance.context,run:s.resonance.run}:null,
     dash:s?.dash,...extra};
   }
   AudioNode.prototype.connect=function(destination,...args){
    const result=nativeConnect.call(this,destination,...args);connections++;nodeId(this);nodeId(destination);
    if(destination===this.context.destination){
     try{
      let entry=byContext.get(this.context);
      if(!entry){const tap=this.context.createMediaStreamDestination();entry={id:contexts.length+1,context:this.context,tap,sources:new Set()};byContext.set(this.context,entry);contexts.push(entry);}
      const id=nodeId(this);
      if(!entry.sources.has(id)){nativeConnect.call(this,entry.tap,args[0]||0,0);entry.sources.add(id);events.push({type:'output-tapped',node:id,context:entry.id,performanceMs:performance.now(),audioTime:this.context.currentTime});}
     }catch(e){errors.push({type:'tap',error:String(e)});}
    }
    return result;
   };
   window.__V7_AUDIO_CAPTURE__={
    mark(label,extra){const m=observe(label,extra);marks.push(m);return m;},
    start(){
     if(recorder)throw Error('Recorder already started');
     if(contexts.length!==1)throw Error('Expected exactly one game AudioContext; found '+contexts.length);
     if(!window.MediaRecorder)throw Error('MediaRecorder unavailable');
     const mime=['audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
     if(!mime)throw Error('WebM audio recording unsupported');
     recorder=new MediaRecorder(contexts[0].tap.stream,{mimeType:mime,audioBitsPerSecond:192000});
     recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);events.push({type:'chunk',bytes:e.data.size,timecode:e.timecode,performanceMs:performance.now(),contexts:clocks()});};
     recorder.onerror=e=>errors.push({type:'recorder',error:String(e.error||e)});
     start=observe('recording-origin');recorder.start(1000);
     marks.push(observe('recording-start'));timer=setInterval(()=>samples.push(observe('sample')),250);
     return {mimeType:recorder.mimeType,start};
    },
    async stop(){
     if(!recorder)throw Error('Recorder never started');clearInterval(timer);marks.push(observe('recording-stop-request'));
     if(recorder.state!=='inactive')await new Promise(resolve=>{recorder.addEventListener('stop',resolve,{once:true});recorder.stop();});
     const stopped=observe('recording-stopped'),blob=new Blob(chunks,{type:recorder.mimeType});
     const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});
     return {base64:String(dataUrl).split(',')[1],mimeType:recorder.mimeType,bytes:blob.size,start,stopped,marks,samples,events,errors,
      instrumentation:{contexts:contexts.length,uniqueObservedNodes:nextId-1,connectCalls:connections,
       note:'Observed nodes are cumulative endpoints of connect calls, not an active-node/leak count. Engine audio.persistentNodes/voices/queuedNotes are sampled separately; one capture sink is outside the engine budget.'}};
    }
   };
  });
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});
  check(response?.ok(),'page responds successfully');
  report.documentSha256=sha256(await response.body());
  await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});
  await page.waitForSelector('#loading',{state:'hidden',timeout:120000});
  report.assets=await page.locator('script[src],link[rel="stylesheet"][href]').evaluateAll(nodes=>nodes.map(n=>({kind:n.tagName==='SCRIPT'?'script':'style',url:n.src||n.href})));
  for(const asset of report.assets){const r=await page.request.get(asset.url);asset.status=r.status();asset.sha256=sha256(await r.body());}
  if(report.expectedJs){const expected=report.expectedJs;check(report.assets.some(a=>a.kind==='script'&&(a.sha256===expected||a.url.endsWith('/'+expected)||a.url.endsWith(expected))),'EXPECTED_JS matches loaded script filename/path or SHA-256');}
  report.steps.push('Fresh browser context; no save/progress injection.');
  await page.locator('#begin').click();
  await page.locator('#opening-skip').click();
  await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.loadedSamples?.length===7,null,{timeout:30000});
  const initial=await h.snap();check(initial.audio.state==='running','user gesture unlocks the real AudioContext');
  check(initial.audio.loadErrors.length===0,'all seven instrument samples decoded without error');
  report.recording=await page.evaluate(()=>window.__V7_AUDIO_CAPTURE__.start());recording=true;
  const mark=(label,extra={})=>page.evaluate(({label,extra})=>window.__V7_AUDIO_CAPTURE__.mark(label,extra),{label,extra});
  await mark('garden-stationary-start');await page.waitForTimeout(18000);
  await mark('garden-footsteps-start');await h.walk(3,4);await page.waitForTimeout(1500);await mark('garden-footsteps-end');
  await h.act();check((await h.snap()).resonance.active,'ordinary walk and E begin dawn challenge');
  await mark('challenge-start');await page.waitForTimeout(4000);
  for(const id of [0,6,1,2]){
   const n=(await h.snap()).resonance.nodes.find(n=>n.id===id);check(!!n,'challenge remains active before route node '+id);
   await mark('challenge-approach-'+id,{requiresDash:n.requiresDash});
   await page.keyboard.down('ShiftLeft');
   try{await h.walk(n.x,n.z);}finally{await page.keyboard.up('ShiftLeft');}
   await page.waitForTimeout(200);await mark('challenge-node-'+id);
  }
  const collected=(await h.snap()).resonance.run?.collected?.length||0;
  check(collected>=2,'ordinary movement collects at least two flower spirits');
  await page.waitForTimeout(4000);await page.locator('.run-cancel').click();await mark('challenge-cancelled');
  await page.locator('#home').click();await page.locator('#gallery').click();
  await page.waitForTimeout(2500);await mark('flower-solid');
  await page.keyboard.press('KeyF');await page.waitForTimeout(400);await mark('flower-burst');
  check((await h.snap()).flowerCycle.phase!=='solid','F releases the flower through the normal input handler');
  await page.mouse.move(600,430);await page.mouse.down();
  try{for(let i=0;i<35;i++){await page.mouse.move(650+Math.cos(i*.3)*160,420+Math.sin(i*.3)*100);await page.waitForTimeout(110);}}
  finally{await page.mouse.up();}
  await mark('flower-wind-release');await page.waitForTimeout(12000);await mark('flower-rest');
  await mark('mute-request-before-click');await page.locator('#sound').click();
  await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.muted===true);await mark('mute-active');
  await page.waitForTimeout(4000);await mark('unmute-request-before-click');await page.locator('#sound').click();
  await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.muted===false);await mark('unmute-active');await page.waitForTimeout(8000);
  await mark('pause-request-before-settings');await page.locator('#settings').click();
  await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.paused===true);await mark('pause-active');
  await page.waitForTimeout(3500);await page.locator('#close-modal').click();
  await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.paused===false);await mark('pause-ended');await page.waitForTimeout(8000);
  await h.capture('final');report.route=h.route;report.captures=h.captures;
  report.final=await h.snap();delete report.final.frameTimes;
  report.steps.push('Garden theme and footsteps; dawn challenge with Shift and collection; UI cancellation; gallery F burst and wind dragging; global mute/unmute; settings pause/resume.');
  check(report.errors.length===0,'no page errors during capture');
 }catch(error){report.error=error.stack||String(error);if(page)await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
 finally{
  if(page&&recording){try{
   const capture=await page.evaluate(()=>window.__V7_AUDIO_CAPTURE__.stop());const bytes=Buffer.from(capture.base64,'base64');delete capture.base64;
   fs.writeFileSync(path.join(out,'game-output.webm'),bytes);report.capture=capture;
   report.files.push({file:'game-output.webm',bytes:bytes.length,sha256:sha256(bytes)});
   const states=capture.samples.map(s=>s.audio).filter(Boolean);
   report.observed={persistentNodeCounts:[...new Set(states.map(s=>s.persistentNodes))],persistentSourceCounts:[...new Set(states.map(s=>s.persistentSources))],
    maximumVoices:Math.max(0,...states.map(s=>s.voices||0)),maximumQueuedNotes:Math.max(0,...states.map(s=>s.queuedNotes||0)),
    muteMarks:capture.marks.filter(m=>/mute/.test(m.label)),pauseMarks:capture.marks.filter(m=>/pause/.test(m.label))};
   check(bytes.length>10000,'actual MediaRecorder output contains audio packets');
   check(capture.errors.length===0,'destination tap and MediaRecorder report no errors');
  }catch(error){report.recordingError=error.stack||String(error);}}
  if(context)await context.close().catch(e=>report.errors.push(String(e)));
  if(browser)await browser.close().catch(e=>report.errors.push(String(e)));
  report.passed=!report.error&&!report.recordingError&&!!report.capture&&report.errors.length===0&&report.checks.every(c=>c.passed);
  fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(base,'latest-capture.json'),JSON.stringify({directory:out,passed:report.passed,generatedAt:report.generatedAt},null,2)+'\n');
 }
 console.log((report.passed?'PASS':'FAIL')+' real game audio capture: '+out);
 console.log('This is a recording artifact; decoded loudness/clipping and listening review remain separate.');
 if(!report.passed){console.error(report.error||report.recordingError||'Capture checks failed');process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1;});
