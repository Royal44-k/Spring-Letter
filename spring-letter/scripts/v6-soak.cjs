// One isolated browser exercises the real controls. No progress setters.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const evidence=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5194';
const minutes=Number(process.env.SPRING_SOAK_MINUTES||45);
const report={date:new Date().toISOString(),url,requestedMinutes:minutes,phases:[],transitions:[],errors:[],checks:[],scope:'Single isolated Edge on this computer, ordinary UI/key/mouse only. Frame intervals are RAF intervals, not GPU timer queries. Not a physical mobile or cross-device guarantee.'};
const write=()=>fs.writeFileSync(path.join(evidence,'v6-soak.json'),JSON.stringify(report,null,2));
function newFrameSamples(before,after,{minimum=1,label='phase'}={}){
 assert.ok(Number.isSafeInteger(before.frameNumber)&&Number.isSafeInteger(after.frameNumber),`${label}: invalid frame counter`);
 const count=after.frameNumber-before.frameNumber;
 assert.ok(count>=minimum,`${label}: only ${count} new frames; need ${minimum}`);
 assert.ok(Array.isArray(after.frameTimes),`${label}: missing frame samples`);
 // Never use slice(-0): that would return every OLD frame after a freeze.
 const values=count>0?after.frameTimes.slice(-Math.min(count,after.frameTimes.length)):[];
 assert.ok(values.length>=minimum,`${label}: insufficient retained new samples`);
 assert.ok(values.every(v=>Number.isFinite(v)&&v>0),`${label}: invalid frame interval`);
 return {count,values};
}
function stats(values){
 assert.ok(values.length&&values.every(v=>Number.isFinite(v)&&v>0),'statistics require actual finite frame samples');
 const sorted=values.slice().sort((a,b)=>a-b),totalMs=sorted.reduce((a,b)=>a+b,0);
 return {samples:sorted.length,totalMs,averageMs:totalMs/sorted.length,p95Ms:sorted[Math.floor(sorted.length*.95)],p99Ms:sorted[Math.floor(sorted.length*.99)],maxMs:sorted.at(-1)};
}
function auditResourceHistory(phases,{warmupRounds=1,tolerance=2}={}){
 const groups=new Map();
 for(const phase of phases){const key=`${phase.form}/${phase.name}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(phase);}
 assert.ok(groups.size,'no resource observations');const result=[];
 for(const [state,observations] of groups){
  const rows=observations.filter(p=>p.round>warmupRounds).sort((a,b)=>a.round-b.round);
  assert.ok(rows.length>=3,`${state}: need three matched observations after warmup`);
  assert.equal(new Set(rows.map(p=>p.round)).size,rows.length,`${state}: duplicate round`);
  for(const key of ['geometries','textures','programs']){
   const values=rows.map(p=>p.memory?.[key]);assert.ok(values.every(v=>Number.isSafeInteger(v)&&v>=0),`${state}: invalid ${key} counter`);
   const baseline=values[0],growth=Math.max(...values)-baseline;
   assert.ok(growth<=tolerance,`${state} ${key} exceeded fixed warm baseline ${baseline}: ${values}`);
   let rises=0;for(let i=1;i<values.length;i++)if(values[i]>values[i-1])rises++;
   const nondecreasing=values.every((v,i)=>i===0||v>=values[i-1]);
   assert.ok(!(nondecreasing&&rises>=2),`${state} ${key} has repeated upward trend: ${values}`);
   for(let i=2;i<values.length;i++)assert.ok(!(values[i]>values[i-1]&&values[i-1]>values[i-2]),`${state} ${key} increased in three consecutive matched rounds: ${values}`);
   result.push({state,counter:key,baselineRound:rows[0].round,baseline,rounds:rows.map(p=>p.round),values,maxGrowth:growth,tolerance});
  }
 }
 return {warmupRounds,tolerance,comparisons:result,scope:'Matched renderer counters after one complete warmup round; bounded counter growth and trend check, not a GPU-memory leak proof.'};
}
async function runSoak(){
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 page.on('pageerror',e=>{report.errors.push(e.stack);write();});page.on('console',m=>{if(m.type()==='error'){report.errors.push(m.text());write();}});
 async function phase(name,form,round,action,wait=5500){
  const before=await snap();if(action)await action();await page.waitForTimeout(1250);const settled=await snap();
  const transition=newFrameSamples(before,settled,{label:`${form}/${name} transition`});
  report.transitions.push({name,form,round,newFrames:transition.count,...stats(transition.values)});
  await page.waitForTimeout(wait);const after=await snap();
  if(after.frameNumber-settled.frameNumber<41){report.failureSample={name,form,round,before,settled,after};write();await page.screenshot({path:path.join(evidence,'v6-soak-failure.png')});}
  const sample=newFrameSamples(settled,after,{minimum:41,label:`${form}/${name} stable interval`});
  assert.deepEqual(after.errors,[]);
  const features={depthPass:after.depthPass,reflection:after.reflection,environment:after.environment,outdoorEnvironment:after.outdoorEnvironment,stoneTextures:after.stoneTextures,landscapeTextures:after.landscapeTextures};
  report.phases.push({name,form,round,elapsedMs:Date.now()-report.startedMs,newFrames:sample.count,...stats(sample.values),memory:after.memory,audio:after.audio,particles:after.particles,renderer:after.renderer,features});write();
  assert.ok(features.environment&&features.outdoorEnvironment&&features.stoneTextures&&features.landscapeTextures,'local lighting and surface resources remain active');
  if(['silver','crystal','lily','amber','celadon','roaming'].includes(name)){assert.equal(features.depthPass,true,'contact depth must not silently disable');assert.equal(features.reflection,true,'water reflection remains active for solid scenes');}
 }
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden'});
  report.build=await page.locator('script[type=module]').getAttribute('src');report.styleBuild=await page.locator('link[rel=stylesheet]').getAttribute('href');assert.match(report.build,/^\/assets\//);assert.match(report.styleBuild,/^\/assets\//);
  report.device=await page.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2'),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  report.loading=(await snap()).loadingTiming;
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.locator('#home').click();await page.locator('#gallery').click();
  report.startedMs=Date.now();let round=0;
  while(Date.now()-report.startedMs<minutes*60000){
   round++;
   for(const form of ['lily','lotus','iris','dahlia']){
    await page.locator('[data-gallery=flower]').click();await page.locator(`[data-form=${form}]`).click();
    for(const material of ['silver','crystal','lily','amber','celadon']){
     await phase(material,form,round,()=>page.locator(`[data-material=${material}]`).click());
    }
    await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='drifting');
    await page.mouse.move(500,400);await page.mouse.down();for(let i=0;i<20;i++){await page.mouse.move(500+i*14,400+Math.sin(i*.28)*75);await page.waitForTimeout(30);}await page.mouse.up();
    await phase('shaped-dust',form,round,null,2400);
    await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid',null,{timeout:18000});assert.equal((await snap()).scatter<.15,true);
    await page.mouse.move(650,450);await page.mouse.down({button:'right'});await page.mouse.move(690,460,{steps:8});await page.mouse.up({button:'right'});
    await page.mouse.wheel(0,70);await page.mouse.wheel(0,-70);
   }
   await page.locator('[data-gallery=dust]').click();await phase('breathing-dust','dahlia',round,null,6000);
   await page.locator('#settings').click();await page.locator('#quality-choice').selectOption('light');await page.locator('#close-modal').click();
   assert.equal((await snap()).particles.activeCount,16384);await phase('light','dahlia',round,null,4000);
   await page.locator('#settings').click();await page.locator('#quality-choice').selectOption('balanced');await page.locator('#close-modal').click();assert.equal((await snap()).particles.activeCount,65536);
   await page.locator('#sound').click();assert.equal((await snap()).audio.muted,true);await page.locator('#sound').click();
   await page.locator('#settings').click();await page.waitForTimeout(400);const paused=await snap();assert.equal(paused.audio.paused,true);assert.equal(paused.audio.voices,0);
   await page.waitForTimeout(350);assert.equal((await snap()).frameNumber,paused.frameNumber);await page.locator('#close-modal').click();
   await page.locator('#home').click();await page.locator('#continue').click();await phase('roaming','saved',round,null,4500);await page.locator('#home').click();await page.locator('#gallery').click();
   console.log(JSON.stringify({round,minutes:((Date.now()-report.startedMs)/60000).toFixed(1),phases:report.phases.length,errors:report.errors.length}));
  }
  report.elapsedMs=Date.now()-report.startedMs;report.rounds=round;assert.ok(round>=4,'need four matched repetitions, increase run duration');
  report.resourceAudit=auditResourceHistory(report.phases);
  assert.ok(report.phases.every(p=>p.audio.persistentNodes===14&&p.audio.persistentSources===4&&p.audio.voices<=10));assert.deepEqual(report.errors,[]);
  assert.equal(await page.locator('script[type=module]').getAttribute('src'),report.build);
  report.finalStyleBuild=await page.locator('link[rel=stylesheet]').getAttribute('href');assert.equal(report.finalStyleBuild,report.styleBuild);
  report.checks=['four forms × five material series exercised by ordinary controls every round','every form released, hand-shaped, and automatically restored each round','right-drag orbit and wheel zoom every form','real simulation quality changes 65536 → 16384 → 65536','modal freezes animation and clears voices; mute and continue controls remain usable','all matched states after a complete warmup round stay within two resources of their fixed baseline and show no repeated upward trend','every stable interval contains at least 41 newly rendered frames; old samples never count as resumed animation','persistent audio resources remain at 14 nodes / 4 sources with <=10 foreground voices','local HDR and surface resources stay loaded; contact depth and reflection remain active in every balanced solid-scene sample','immutable JS and stylesheet stay identical; no page or console errors'];
  report.passed=true;await page.screenshot({path:path.join(evidence,'v6-soak-final.png')});write();console.log(JSON.stringify({passed:true,minutes:report.elapsedMs/60000,rounds:round,phases:report.phases.length}));
 }catch(error){report.failure=error.stack;report.passed=false;write();throw error;}finally{await context.close();await browser.close();}
}
if(require.main===module)runSoak().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={newFrameSamples,stats,auditResourceHistory};
