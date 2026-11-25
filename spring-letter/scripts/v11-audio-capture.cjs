/* Observe the actual audio destination. This is a signal/continuity test,
 * not a subjective listening verdict. No game audio APIs are called. */
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL,dir=process.env.EARNED_DIR;
assert.ok(url&&dir);const out=path.join(root,'evidence/v11/audio-'+Date.now());fs.mkdirSync(out,{recursive:true});
const report={url,passed:false,scope:'Native destination tap, real earned archives, visible UI controls. Signal and silence measurement only; no human listening verdict.',cases:[],errors:[]};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 for(const stage of ['writing','sailing','complete']){
  const saved=JSON.parse(fs.readFileSync(path.join(dir,'earned-'+stage+'.json'),'utf8'));saved.origins.forEach(o=>o.origin=new URL(url).origin);
  const c=await b.newContext({storageState:saved,viewport:{width:1280,height:800}}),p=await c.newPage();p.on('pageerror',e=>report.errors.push(String(e)));
  await p.addInitScript(()=>{const original=AudioNode.prototype.connect;let context,analyser,tap,recorder,chunks=[];
   AudioNode.prototype.connect=function(destination,...rest){const result=original.call(this,destination,...rest);if(destination===this.context.destination){context=this.context;analyser=context.createAnalyser();analyser.fftSize=2048;tap=context.createMediaStreamDestination();original.call(this,analyser);original.call(this,tap);}return result;};
   window.__ACTUAL_AUDIO__={sample(){const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);let ss=0,peak=0;for(const n of data){ss+=n*n;peak=Math.max(peak,Math.abs(n));}return {rms:Math.sqrt(ss/data.length),peak,time:context.currentTime,state:context.state};},start(){recorder=new MediaRecorder(tap.stream,{mimeType:'audio/webm;codecs=opus'});recorder.ondataavailable=e=>chunks.push(e.data);recorder.start();},async stop(){await new Promise(r=>{recorder.onstop=r;recorder.stop();});const bytes=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(const n of bytes)s+=String.fromCharCode(n);return btoa(s);}};
  });
  await p.goto(url);await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.locator('#loading').waitFor({state:'hidden'});const entry=await p.locator('script[type=module][src]').last().getAttribute('src');if(process.env.EXPECTED_JS)assert.equal(entry,process.env.EXPECTED_JS);
  await p.locator('#continue').click();await p.waitForTimeout(2000);await p.evaluate(()=>window.__ACTUAL_AUDIO__.start());const samples=[];
  for(let i=0;i<32;i++){await p.waitForTimeout(250);samples.push(await p.evaluate(()=>window.__ACTUAL_AUDIO__.sample()));if(i===12&&stage==='sailing')await p.locator('#voyage-scatter').click();}
  const audio=await p.evaluate(()=>window.__SPRING__.snapshot().audio);assert.equal(audio.scene.voyage,stage);assert.ok(audio.loaded);assert.deepEqual(audio.loadErrors,[]);assert.ok(samples.some(s=>s.rms>.00005),'actual signal present '+stage);assert.ok(samples.every(s=>s.peak<1),'no sampled hard clipping '+stage);
  if(stage==='complete')await p.locator('#voyage-watch-sea').click();await p.locator('#sound').click();await p.waitForTimeout(350);const muted=[];for(let i=0;i<5;i++){muted.push(await p.evaluate(()=>window.__ACTUAL_AUDIO__.sample()));await p.waitForTimeout(100);}assert.ok(muted.every(s=>s.peak<.00001),'mute reaches actual digital silence');await p.locator('#sound').click();const resumed=[];for(let i=0;i<15;i++){await p.waitForTimeout(100);resumed.push(await p.evaluate(()=>window.__ACTUAL_AUDIO__.sample()));}assert.ok(resumed.some(s=>s.rms>.00005),'unmute resumes actual sound');
  const bytes=Buffer.from(await p.evaluate(()=>window.__ACTUAL_AUDIO__.stop()),'base64');fs.writeFileSync(path.join(out,stage+'.webm'),bytes);
  const item={stage,entry,audio,samples,muted,resumed,bytes:bytes.length,passed:true};report.cases.push(item);write();await c.close();console.log('PASS actual audio '+stage);
 }
 assert.deepEqual(report.errors,[]);report.passed=true;write();console.log(JSON.stringify({passed:true,out}));
 }finally{await b.close();}})().catch(e=>{report.failure=e.stack;write();console.error(e);process.exitCode=1;});
