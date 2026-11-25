// Sustained real GPU/UI exercise. No state setters or synthetic save progress.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../evidence');
const minutes=Number(process.env.SPRING_SOAK_MINUTES||45);
const url=process.env.SPRING_URL||'http://127.0.0.1:5192';
const report={date:new Date().toISOString(),url,requestedMinutes:minutes,phases:[],errors:[],checks:[],scope:'One isolated Edge headless browser; ordinary UI switching, drawing, rotation, quality, mute and pause. Frame intervals are not GPU queries. This is one integrated AMD device, not a multi-device guarantee.'};
const write=()=>fs.writeFileSync(path.join(dir,'v5-soak.json'),JSON.stringify(report,null,2));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>{report.errors.push(e.stack);write();});
 page.on('console',m=>{if(m.type()==='error'){report.errors.push(m.text());write();}});
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 async function phase(name,round,wait=15000){
  await page.waitForTimeout(1200);const before=await snap();await page.waitForTimeout(wait);const s=await snap();
  const intervals=s.frameTimes.slice(-Math.min(s.frameNumber-before.frameNumber,s.frameTimes.length)).sort((a,b)=>a-b);
  assert.ok(intervals.length>100,'animation must continue');assert.deepEqual(s.errors,[]);
  const m={name,round,elapsedMs:Date.now()-report.startedMs,frames:intervals.length,averageMs:intervals.reduce((a,b)=>a+b,0)/intervals.length,p95Ms:intervals[Math.floor(intervals.length*.95)],p99Ms:intervals[Math.floor(intervals.length*.99)],maxMs:intervals.at(-1),memory:s.memory,audio:s.audio,frameTiming:s.frameTiming,renderer:s.renderer,particles:s.particles};
  report.phases.push(m);write();console.log(JSON.stringify({round,name,minutes:(m.elapsedMs/60000).toFixed(1),average:m.averageMs.toFixed(2),memory:m.memory}));
 }
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:60000});
  report.build=await page.locator('script[type=module]').getAttribute('src');
  report.device=await page.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.locator('#home').click();await page.locator('#gallery').click();
  report.startedMs=Date.now();let round=0;
  while(Date.now()-report.startedMs<minutes*60000){
   round++;
   await page.locator('[data-gallery=flower]').click();await page.locator('[data-material=silver]').click();
   await phase('silver',round);
   await page.mouse.move(670,420);await page.mouse.down();await page.mouse.move(945,470,{steps:28});await page.mouse.up();await page.mouse.wheel(0,100);await page.mouse.wheel(0,-100);
   await page.locator('[data-material=crystal]').click();await page.locator('#night').click();await phase('crystal-night',round);
   await page.locator('[data-material=lily]').click();await page.locator('#variant').click();await page.locator('#night').click();await phase('natural',round,10000);
   await page.locator('[data-gallery=dust]').click();
   await page.keyboard.down('Space');await page.mouse.move(610,300);await page.mouse.down();for(let j=0;j<4;j++)await page.mouse.move(j%2?600:900,j%2?300:550,{steps:12});await page.mouse.up();await page.keyboard.up('Space');
   await page.waitForFunction(()=>window.__SPRING__.snapshot().scatter<.01);await phase('dust',round);
   await page.locator('#settings').click();await page.locator('#quality-choice').selectOption('light');await page.locator('#close-modal').click();await page.waitForTimeout(1000);
   assert.equal((await snap()).particles.activeCount,16384);await phase('dust-light',round,8000);
   await page.locator('#settings').click();await page.locator('#quality-choice').selectOption('balanced');await page.locator('#close-modal').click();
   assert.equal((await snap()).particles.activeCount,65536);
   await page.locator('#sound').click();assert.equal((await snap()).audio.muted,true);await page.locator('#sound').click();
   await page.locator('#settings').click();await page.waitForTimeout(400);const paused=await snap();assert.equal(paused.audio.paused,true);assert.equal(paused.audio.voices,0);await page.locator('#close-modal').click();
   await page.locator('#home').click();await page.locator('#continue').click();await phase('roaming',round,10000);await page.locator('#home').click();await page.locator('#gallery').click();
  }
  report.elapsedMs=Date.now()-report.startedMs;report.rounds=round;
  for(const name of ['silver','crystal-night','natural','dust','dust-light','roaming']){
   const recent=report.phases.filter(p=>p.name===name).slice(-4);assert.ok(recent.length>=3);
   for(const key of ['geometries','textures','programs']){const values=recent.map(p=>p.memory[key]);assert.ok(Math.max(...values)-Math.min(...values)<=2,`${name} ${key} should plateau: ${values}`);}
   assert.ok(recent.every(p=>p.audio.persistentNodes===14&&p.audio.persistentSources===4&&p.audio.voices<=10));
  }
  assert.deepEqual(report.errors,[]);report.checks=['animation remains live through the entire timed run','every round exercises real orbit, wind strokes, natural return and all three materials','every round lowers actual simulation to 16384 and restores 65536 particles','muting and settings pause clear audible foreground work','all six matched views plateau in geometry, texture and program counts over the last four rounds','persistent audio resources stay at 14 nodes / 4 sources with at most 10 foreground voices','no page or console errors'];
  report.passed=true;write();await page.screenshot({path:path.join(dir,'v5-soak-final.png')});console.log(JSON.stringify({passed:true,minutes:report.elapsedMs/60000,rounds:report.rounds,phases:report.phases.length}));
 }catch(e){report.failure=e.stack;report.passed=false;write();throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
