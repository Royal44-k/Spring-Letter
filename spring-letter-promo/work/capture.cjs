// Record the released game using its public controls. Later scenes resume earned saves.
const { createRequire } = require('node:module');
const { chromium } = createRequire(require.resolve('../../spring-letter/package.json'))('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { atlasHarness } = require('../../spring-letter/scripts/v12-atlas-helpers.cjs');
const root = path.resolve(__dirname, '../../spring-letter');
const raw = path.join(__dirname, 'rushes');
const base = 'http://127.0.0.1:5192/';
const archives = path.join(root, 'evidence/v12/full-2026-11-23T04-53-23-576Z');
const identity = JSON.parse(fs.readFileSync(path.join(root, 'evidence/v13/production-http.json')));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const size = {width: 960, height: 1280};
fs.mkdirSync(raw, {recursive: true});

function recorderSetup() {
  const connect = AudioNode.prototype.connect;
  let context, output, cameraRecorder, stream, chunks;
  const sources = new WeakSet();
  AudioNode.prototype.connect = function(destination, ...ports) {
    const result = connect.call(this, destination, ...ports);
    if (destination === this.context.destination && !sources.has(this)) {
      if (context !== this.context) {
        context = this.context;
        output = context.createMediaStreamDestination();
      }
      connect.call(this, output);
      sources.add(this);
    }
    return result;
  };
  window.filmRecorder = {
    ready: () => !!output && context.state === 'running',
    start() {
      const canvas = document.querySelector('#scene canvas');
      stream = canvas.captureStream(30);
      for (const track of output.stream.getAudioTracks()) stream.addTrack(track.clone());
      chunks = [];
      cameraRecorder = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp8,opus',videoBitsPerSecond:11500000,audioBitsPerSecond:192000});
      cameraRecorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      cameraRecorder.start(500);
      return {width:canvas.width, height:canvas.height, t:performance.now(), rate:context.sampleRate};
    },
    async stop() {
      await new Promise(resolve => {cameraRecorder.onstop=resolve; cameraRecorder.stop();});
      for (const track of stream.getTracks()) track.stop();
      const blob = new Blob(chunks, {type:cameraRecorder.mimeType});
      const reader = new FileReader();
      const result = new Promise(resolve => {reader.onload=() => resolve(reader.result.slice(reader.result.lastIndexOf(',')+1));});
      reader.readAsDataURL(blob);
      return result;
    }
  };
}

async function record(browser, id, save, run) {
  let storageState;
  if (save) {
    const saved = JSON.parse(fs.readFileSync(path.join(archives, 'earned-'+save+'.json')));
    storageState = {...saved,origins:saved.origins.map(o => ({...o,origin:new URL(base).origin}))};
  }
  const viewport = ['flower','palette'].includes(id) ? {width:1664,height:1152} : size;
  const ctx = await browser.newContext({viewport,deviceScaleFactor:1,storageState});
  const p = await ctx.newPage();
  p.setDefaultTimeout(22000);
  const log = {id,version:identity.version,source:save ? 'earned-'+save+'.json' : 'fresh',events:[],errors:[]};
  const snap=()=>p.evaluate(()=>window.__SPRING__.snapshot());
  const click=selector=>p.locator(selector).click();
  const wait=ms=>p.waitForTimeout(ms);
  let compositor=null, filmFrames=[],frameDir;
  async function mark(label) {
    const state=await snap();
    const t=await p.evaluate(()=>performance.now());
    log.events.push({label,sec:log.record ? (t-log.record.t)/1000 : null,frame:state.frameNumber,
      flower:state.flowerCycle.phase,material:state.material,form:state.flowerForm,
      map:state.atlas.state.location,stars:state.atlas.state.stars.length,checkpoint:state.atlas.state.meadowCheckpoint,
      coast:state.voyage.stage,distance:state.voyage.state.distance,flowers:state.voyage.state.flowers.length});
    console.log(id,label,log.events.at(-1).sec);
  }
  async function start() {
    await p.waitForFunction(()=>window.filmRecorder.ready(),null,{timeout:15000});
    log.record=await p.evaluate(()=>window.filmRecorder.start());
    if(id==='flower'){
      frameDir=path.join(raw,'flower-frames');fs.mkdirSync(frameDir,{recursive:true});
      compositor=await ctx.newCDPSession(p);
      log.captureEpoch=await p.evaluate(()=>performance.timeOrigin/1000);
      compositor.on('Page.screencastFrame',e=>{
        compositor.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});
        const file=String(filmFrames.length).padStart(5,'0')+'.jpg';
        filmFrames.push({file,t:e.metadata.timestamp});
        fs.writeFileSync(path.join(frameDir,file),Buffer.from(e.data,'base64'));
      });
      await compositor.send('Page.startScreencast',{format:'jpeg',quality:94,maxWidth:viewport.width,maxHeight:viewport.height,everyNthFrame:1});
    }
    await mark('start');
  }
  p.on('pageerror',e=>log.errors.push(e.message));
  await p.addInitScript(recorderSetup);
  try {
    await p.goto(base,{waitUntil:'domcontentloaded'});
    await p.locator('#loading').waitFor({state:'hidden',timeout:120000});
    const src=await p.locator('script[type=module][src]').last().getAttribute('src');
    log.entry=hash(await (await p.request.get(new URL(src,base).href)).body());
    assert.equal(log.entry,identity.entrySha256);
    if(save) {await click('#continue');await wait(1150);}
    await run({p,ctx,click,wait,mark,start,snap,log});
    await mark('end');
    if(compositor){await compositor.send('Page.stopScreencast');fs.writeFileSync(path.join(frameDir,'frames.json'),JSON.stringify(filmFrames));}
    const recording=Buffer.from(await p.evaluate(()=>window.filmRecorder.stop()),'base64');
    assert.equal(recording.readUInt32BE(0),0x1a45dfa3,'Expected a Matroska/WebM media header');
    assert.ok(recording.byteLength>16000,'Recorded video and audio payload is empty');
    fs.writeFileSync(path.join(raw,id+'.webm'),recording);
    assert.deepEqual(log.errors,[]);
    log.ok=true;
  } catch(e) {
    log.failure=e.message;
    await p.screenshot({path:path.join(raw,id+'-diagnostic.jpg')}).catch(()=>{});
    throw e;
  } finally {
    fs.writeFileSync(path.join(raw,id+'.json'),JSON.stringify(log,null,2));
    await ctx.close();
  }
}

const shoots={
  flower:[null,async({p,click,wait,mark,start,snap})=>{
    await click('#gallery');
    await p.waitForFunction(()=>window.__SPRING__.snapshot().focus==='flower');
    await click('[data-form="dahlia"]');await click('[data-material="lily"]');
    await p.waitForFunction(()=>!window.__SPRING__.snapshot().shaderPreparing);
    await click('#night');await wait(2300);
    await start();await wait(1000);await click('#flower-burst');await mark('burst');
    await p.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');
    await mark('drift');await p.mouse.move(540,545);await p.mouse.down();
    for(const [x,y] of [[610,468],[704,420],[789,456],[810,514],[745,552],[666,597],[595,646]]) {
      await p.mouse.move(x,y,{steps:3});await wait(85);
    }
    await p.mouse.up();await mark('brush-release');
    await p.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='returning',null,{timeout:35000});await mark('returning');
    await p.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:35000});await mark('reformed');await wait(1200);
    assert.equal((await snap()).flowerForm,'dahlia');
  }],
  palette:[null,async({p,click,wait,mark,start})=>{
    await click('#gallery');await click('[data-form="iris"]');await click('[data-material="amber"]');
    await p.waitForFunction(()=>!window.__SPRING__.snapshot().shaderPreparing);
    await click('#auto-rotate');await wait(1900);await start();await wait(2200);
    await click('[data-form="lotus"]');await mark('lotus');await wait(500);
    await click('[data-material="celadon"]');
    await p.waitForFunction(()=>!window.__SPRING__.snapshot().shaderPreparing);
    await mark('celadon');await wait(2500);
  }],
  observatory:['stars',async({p,wait,mark,start,snap})=>{
    await p.locator('#scene canvas').focus();await start();await wait(850);
    if(!(await snap()).atlas.state.stargazing) await p.keyboard.press('KeyE');
    await p.waitForFunction(()=>window.__SPRING__.snapshot().atlas.state.stargazing);
    await wait(1700);await mark('sky');
    for(const point of [[6,5,-29],[-6,5,-29],[-6,10,-29],[0,8,-27],[6,10,-29]]){
      const pos=await p.evaluate(pt=>window.__SPRING__.project(...pt),point);
      await p.mouse.click(pos.x,pos.y);await wait(670);
    }
    assert.equal((await snap()).atlas.state.stars.length,8);await mark('constellation');await wait(600);
  }],
  stars:['stars',async({p,click,wait,mark,start,snap})=>{
    if (!(await snap()).atlas.state.stargazing) {await p.locator('#scene canvas').focus();await p.keyboard.press('KeyE');}
    await p.waitForFunction(()=>window.__SPRING__.snapshot().atlas.state.stargazing);await wait(1400);
    const points=[[-6,10,-29],[0,14,-31],[6,10,-29],[6,5,-29],[-6,5,-29],[0,8,-27]];
    const order=[0,1,2,3,4,0,5,2];
    const begin=(await snap()).atlas.state.stars.length;
    await start();await wait(650);
    for(const star of order.slice(begin)){
      const pos=await p.evaluate(pt=>window.__SPRING__.project(...pt),points[star]);
      await p.mouse.click(pos.x,pos.y);await mark('star-'+star);await wait(770);
    }
    assert.equal((await snap()).atlas.state.stars.length,8);await wait(1400);
  }],
  meadow:['clouds',async({p,ctx,wait,mark,start,snap})=>{
    const atlas=atlasHarness(p,ctx,raw,{});
    // Walk to the leeward edge of the island already reached in this save.
    await atlas.walk(1.2,-15.65);
    await start();await wait(400);
    await atlas.walk(10,-24,{jump:true,untilGrounded:true,limit:28000});
    await mark('landed');assert.ok((await snap()).atlas.state.meadowCheckpoint>=3);await wait(1400);
  }],
  writing:['three-maps',async({p,click,wait,mark,start,snap,ctx,log})=>{
    await click('#atlas-next');await p.locator('#voyage-recipient').waitFor();await wait(1200);
    await p.locator('#voyage-recipient').fill('下一个路过花庭的人');
    await p.locator('#voyage-body').fill('');await p.locator('#voyage-body').focus();
    const session=await ctx.newCDPSession(p);
    const dir=path.join(raw,'writing-frames');fs.mkdirSync(dir,{recursive:true});
    const frames=[];let live=true;
    session.on('Page.screencastFrame',e=>{
      session.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});
      if(!live)return;
      const idx=frames.length;const file=String(idx).padStart(5,'0')+'.jpg';
      frames.push({file,t:e.metadata.timestamp});
      fs.writeFileSync(path.join(dir,file),Buffer.from(e.data,'base64'));
    });
    await start();log.captureEpoch=await p.evaluate(()=>performance.timeOrigin/1000);
    await session.send('Page.startScreencast',{format:'jpeg',quality:93,maxWidth:size.width,maxHeight:size.height,everyNthFrame:1});
    await wait(400);
    for(const text of ['如果','你也','路过','这里，','请','替我','听听','海。']){await p.keyboard.insertText(text);await wait(330);}
    await wait(750);await click('#voyage-seal');await mark('sealed');
    assert.equal((await snap()).voyage.state.letter.sealed,true);await wait(1600);
    await session.send('Page.stopScreencast');live=false;
    fs.writeFileSync(path.join(dir,'frames.json'),JSON.stringify(frames));
    log.editor=await p.locator('#voyage-body').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  }],
  sea:['sailing',async({p,wait,mark,start,snap})=>{
    await p.locator('#scene canvas').focus();await wait(1100);
    await start();await wait(350);await p.keyboard.down('KeyA');await wait(700);await p.keyboard.up('KeyA');
    for(let i=0;i<6;i++){await p.keyboard.press('KeyF');await wait(580);}
    await mark('sowed-wake');await p.keyboard.down('KeyD');await wait(550);await p.keyboard.up('KeyD');await wait(4800);
    assert.ok((await snap()).voyage.state.flowers.length>=6);
  }]
};

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true,
    args:['--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
  const names=process.argv.slice(2);
  try{for(const id of names.length?names:Object.keys(shoots)){
    try{await record(browser,id,...shoots[id]);}catch(e){console.error(id,e.stack);process.exitCode=1;}
  }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
