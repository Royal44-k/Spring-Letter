/** SERIAL GPU/AUDIO CHECK. Never calls game methods to manufacture sound.
 * Real cover/map/settings/mute controls; native AudioNode destination tap.
 * SPRING_URL defaults to 5193. EXPECTED_JS, if set, is a strict entry gate.
 * This script does not start a server. Root schedules its isolated Edge run.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {inspectCanvas,assessPixels,summarizeRgba,classifyConsole}=require('./v10-pixel-validation.cjs');
const {bindStyleIdentity}=require('./v12-style-identity.cjs');
const ROOT=path.resolve(__dirname,'..'),LOCATIONS=['conservatory','observatory','meadow'];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function entryMatches(actual,expected,url){
 if(!expected)return true;
 const actualPath=new URL(actual,url).pathname;
 return /[/\\]/.test(expected)?actualPath===new URL(expected.replaceAll('\\','/'),url).pathname:path.posix.basename(actualPath)===expected;
}
function assessSignal(samples,{silent=false}={}){
 const reasons=[];
 if(!samples.length)reasons.push('no native output samples');
 if(samples.some(s=>!s||[s.rms,s.peak,s.time,s.mean].some(v=>!Number.isFinite(v))||s.nonfinite!==0))reasons.push('missing or nonfinite native samples');
 if(samples.some(s=>s?.state!=='running'))reasons.push('audio context was not running during measurement');
 if(samples.some((s,i)=>i&&s?.time<=samples[i-1]?.time))reasons.push('audio clock did not advance');
 if(silent){if(samples.some(s=>s?.peak>=.00001))reasons.push('mute did not reach digital silence');}
 else{
  if(!samples.some(s=>s?.rms>.00005))reasons.push('no audible-level native signal in capture window');
  if(samples.some(s=>s?.peak>=.9995||s?.clipped>0))reasons.push('sampled hard clipping');
 }
 return{valid:reasons.length===0,reasons,frames:samples.length,activeFrames:samples.filter(s=>s?.rms>.00005).length,maxRms:Math.max(0,...samples.map(s=>s?.rms||0)),maxPeak:Math.max(0,...samples.map(s=>s?.peak||0))};
}

function installAudioTap(){
 const original=AudioNode.prototype.connect,byContext=new WeakMap(),contexts=[];
 let active=null,recorder=null,chunks=[];
 AudioNode.prototype.connect=function(destination,...rest){
  const result=original.call(this,destination,...rest);
  if(destination===this.context.destination){
   let item=byContext.get(this.context);
   if(!item){
    const context=this.context,analyser=context.createAnalyser(),tap=context.createMediaStreamDestination();
    analyser.fftSize=4096;analyser.smoothingTimeConstant=0;
    item={context,analyser,tap,sources:new WeakSet()};byContext.set(context,item);contexts.push(item);
   }
   if(!item.sources.has(this)){original.call(this,item.analyser);original.call(this,item.tap);item.sources.add(this);}
   active=item;
  }
  return result;
 };
 window.__ATLAS_NATIVE_AUDIO__={
  ready(){return !!active;},
  sample(){
   if(!active)return null;
   const {context,analyser}=active,data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);
   let ss=0,sum=0,peak=0,nonfinite=0,clipped=0;
   for(const n of data){if(!Number.isFinite(n)){nonfinite++;continue;}ss+=n*n;sum+=n;peak=Math.max(peak,Math.abs(n));if(Math.abs(n)>=.9995)clipped++;}
   return{rms:Math.sqrt(ss/data.length),peak,mean:sum/data.length,nonfinite,clipped,time:context.currentTime,state:context.state,sampleRate:context.sampleRate,windowSamples:data.length,contexts:contexts.length};
  },
  start(){
   if(!active)throw Error('Native destination tap not connected');
   if(recorder)throw Error('Recorder already started');
   const mime=['audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported(type));if(!mime)throw Error('No WebM audio recorder support');
   chunks=[];recorder=new MediaRecorder(active.tap.stream,{mimeType:mime});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.start(1000);return{mime,contexts:contexts.length,sampleRate:active.context.sampleRate};
  },
  async stop(){
   if(!recorder)return null;
   const current=recorder;if(current.state!=='inactive')await new Promise((resolve,reject)=>{current.onstop=resolve;current.onerror=e=>reject(Error(e.error?.message||'MediaRecorder failed'));current.stop();});
   const bytes=new Uint8Array(await new Blob(chunks,{type:current.mimeType}).arrayBuffer());let binary='';
   for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
   recorder=null;return{base64:btoa(binary),bytes:bytes.length,mime:current.mimeType};
  }
 };
}

async function runCase(browser,location,url,out,report,write){
 const item={location,passed:false,checks:[],screenshots:[],pixels:[],phases:[],errors:[],console:[]};report.cases.push(item);write();let context,page,recording=false;
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 try{
  context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});page=await context.newPage();page.setDefaultTimeout(20000);
  page.on('pageerror',e=>item.errors.push(String(e)));page.on('console',m=>{if(['warning','error'].includes(m.type()))item.console.push({type:m.type(),text:m.text()});});
  page.on('dialog',d=>{item.errors.push('Unexpected dialog: '+d.message());d.dismiss().catch(()=>{});});
  await page.addInitScript(installAudioTap);await page.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()});
  async function click(selector){const l=page.locator(selector);await l.scrollIntoViewIfNeeded();await l.click();}
  async function shot(label){
   const pixels=await page.evaluate(inspectCanvas),pixelCheck=assessPixels(pixels),file=location+'-'+label+'.jpg';
   await page.screenshot({path:path.join(out,file)});item.screenshots.push(file);item.pixels.push({label,pixels,pixelCheck});write();assert.ok(pixelCheck.valid,label+': '+pixelCheck.reasons.join('; '));
  }
  async function measure(name,seconds,{silent=false}={}){
   const samples=[],start=Date.now();
   while(Date.now()-start<seconds*1000){await page.waitForTimeout(250);samples.push(await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.sample()));}
   const assessment=assessSignal(samples,{silent}),state=await snap();
   const phase={name,seconds,samples,assessment,audio:state.audio,frame:state.frameNumber};item.phases.push(phase);write();
   assert.equal(state.atlas.active,true);assert.equal(state.atlas.state.location,location);assert.equal(state.audio.scene.atlas,location);
   assert.ok(assessment.valid,location+' '+name+': '+assessment.reasons.join('; '));return phase;
  }
  async function setVolume(selector,steps){
   const l=page.locator(selector);await l.scrollIntoViewIfNeeded();await l.focus();await page.keyboard.press('Home');
   for(let i=0;i<steps;i++)await page.keyboard.press('ArrowRight');
  }
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  item.entry=await page.locator('script[type=module][src]').last().getAttribute('src');assert.ok(item.entry);assert.ok(entryMatches(item.entry,process.env.EXPECTED_JS,url),'EXPECTED_JS does not match entry '+item.entry);
  const response=await page.request.get(new URL(item.entry,url).href);assert.ok(response.ok());item.entrySha256=sha(await response.body());
  await bindStyleIdentity(page,item,url);
  for(const key of ['entry','entrySha256','style','styleSha256']){if(report[key])assert.equal(item[key],report[key],'all recordings use identical entry and stylesheet bytes');else report[key]=item[key];}
  await click('#cover-atlas');await click('[data-atlas-location="'+location+'"]');
  await page.waitForFunction(id=>{const s=window.__SPRING__.snapshot();return s.atlas.active&&s.atlas.state.location===id&&s.audio.loaded;},location,{timeout:120000});
  await page.waitForFunction(()=>window.__ATLAS_NATIVE_AUDIO__?.ready());await page.waitForTimeout(1300);
  item.initial=(await snap()).audio;assert.equal(item.initial.scene.atlas,location);assert.deepEqual(item.initial.loadErrors,[]);assert.equal(item.initial.muted,false);
  item.recording=await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.start());recording=true;assert.equal(item.recording.contexts,1,'one live AudioContext');
  await shot('default-mix');await measure('default-mix',10);item.checks.push('Actual map destination emits finite unclipped signal with its default scene mix');

  // UI-only isolation prevents environmental loops from proving a missing score.
  // Twenty-two seconds cover the observatory's deliberately empty alternate bars.
  await click('#atlas-settings');await page.locator('#modal[open]').waitFor();
  const paused=await snap();assert.equal(paused.audio.paused,true);await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.state==='suspended');const pausedTime=await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.sample().time);await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.sample().time),pausedTime,'settings pause freezes the native audio clock');
  await setVolume('#ambience-volume',0);await setVolume('#sfx-volume',0);await setVolume('#music-volume',12);
  await click('#close-modal');await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.state==='running');await page.waitForTimeout(1500);
  const only=(await snap()).audio;assert.ok(Math.abs(only.mix.music-.6)<.001);assert.equal(only.mix.ambience,0);assert.equal(only.mix.sfx,0);
  await shot('music-only');await measure('music-only',22);item.checks.push('Visible settings isolate music; a full phrase including written rests still produces actual sampled output');

  await click('#sound');await page.waitForFunction(()=>window.__SPRING__.snapshot().audio.muted);await page.waitForTimeout(800);
  await shot('muted');await measure('muted',2,{silent:true});item.checks.push('Actual sound button reaches digital silence at the native output');
  await click('#sound');await page.waitForFunction(()=>!window.__SPRING__.snapshot().audio.muted);await page.waitForTimeout(250);
  await measure('restored-music',12);await shot('restored');
  item.final=(await snap()).audio;assert.deepEqual(item.final.mix,only.mix);assert.equal(item.final.paused,false);assert.equal(item.final.muted,false);assert.ok(item.final.voices<=item.final.voiceLimit);assert.equal(item.final.persistentSources,3);assert.deepEqual(item.final.loadErrors,[]);
  item.checks.push('Unmute restores actual music without changing the isolated user faders or adding ambient loops');
  const captured=await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.stop());recording=false;assert.ok(captured?.bytes>3000,'nonempty playable WebM recording');
  const bytes=Buffer.from(captured.base64,'base64'),file=location+'-native-output.webm';assert.equal(bytes.length,captured.bytes);fs.writeFileSync(path.join(out,file),bytes);item.audioFile={file,bytes:bytes.length,mime:captured.mime,sha256:sha(bytes)};
  assert.deepEqual(item.errors,[]);item.consoleReview=classifyConsole(item.console);assert.deepEqual(item.consoleReview.blocking,[]);item.passed=true;console.log('PASS native atlas audio '+location);
 }catch(error){
  item.error=String(error.stack||error);console.error('FAIL native atlas audio '+location+': '+error.message);
  if(page){const file=location+'-failure.jpg';await page.screenshot({path:path.join(out,file)}).then(()=>item.screenshots.push(file)).catch(()=>{});item.final=await snap().then(s=>s.audio).catch(()=>null);}
 }finally{
  if(recording&&page){try{const captured=await page.evaluate(()=>window.__ATLAS_NATIVE_AUDIO__.stop());if(captured?.bytes){const bytes=Buffer.from(captured.base64,'base64'),file=location+'-partial-native-output.webm';fs.writeFileSync(path.join(out,file),bytes);item.partialAudio={file,bytes:bytes.length,mime:captured.mime,sha256:sha(bytes)};}}catch(error){item.recordingError=String(error);}}
  await context?.close().catch(error=>{item.passed=false;item.cleanupError=String(error);});write();
 }
}

async function main(){
 const url=process.env.SPRING_URL||'http://127.0.0.1:5193/',out=path.join(ROOT,'evidence/v12/audio-'+new Date().toISOString().replace(/[:.]/g,'-'));
 fs.mkdirSync(out,{recursive:true});const report={started:new Date().toISOString(),url,expectedEntry:process.env.EXPECTED_JS||null,passed:false,scope:'Isolated headless Edge, three actual map entries, native AudioNode destination recordings, visible settings and mute controls. Only read-only game snapshots; no game audio API or progress injection.',limitations:['This measures signal, sampled clipping, silence, and restoration. It is not a subjective listening verdict.','The pure-music window includes the night score’s intentional whole-bar rests. Silence within a written phrase is not by itself a failure.','The tap records the graph feeding the browser destination, not physical loudspeaker or OS mixer output.'],cases:[]};
 const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));let browser;
 try{browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});for(const location of LOCATIONS)await runCase(browser,location,url,out,report,write);report.passed=report.cases.length===3&&report.cases.every(c=>c.passed);assert.ok(report.passed,'one or more native atlas audio captures failed');}
 catch(error){report.error=String(error.stack||error);process.exitCode=1;}
 finally{await browser?.close().catch(error=>{report.passed=false;report.cleanupError=String(error);process.exitCode=1;});report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:report.passed,out,cases:report.cases.length,entry:report.entry,entrySha256:report.entrySha256}));}
}
module.exports={entryMatches,assessSignal};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
