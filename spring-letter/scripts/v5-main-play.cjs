/* Main story acceptance through real keyboard, pointer and UI input only.
 * snapshot/project are read-only. No state setters, injected saves or forged progress.
 */
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const evidence=path.resolve(__dirname,'../evidence');fs.mkdirSync(evidence,{recursive:true});
const url=process.env.SPRING_URL||'http://127.0.0.1:5192';
const platforms={A:{x:0,z:-26},M:{x:0,z:-32},F:{x:0,z:-38},R:{x:-5,z:-29}};
function bridgeAnchors(shape){
 const [a,b,curve]=shape==='bridge_am'?['A','M',.28]:shape==='bridge_mf'?['M','F',-.32]:['R','M',.24];
 const from=platforms[a],to=platforms[b],dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz);
 return Array.from({length:6},(_,i)=>{const t=i/5,c=Math.sin(t*Math.PI)*curve;return{x:from.x+dx*t-dz/length*c,z:from.z+dz*t+dx/length*c};});
}

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage(),errors=[],checks=[],route=[],captures=[],holds=[];
 let entry=null;
 const limitations=['OS/window blur is not claimed by this headless run: background tabs remained focused/visible under Playwright focus emulation in prior attempts. Actual map-modal interruption and the recognizer cancellation tests cover clearInput without synthesizing blur.'];
 page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const project=(x,y,z)=>page.evaluate(p=>window.__SPRING__.project(...p),[x,y,z]);
 async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
 async function capture(name){const file='v5-main-'+name+'.png';await page.screenshot({path:path.join(evidence,file)});captures.push(file);}
 async function walkTo(x,z){
  let down=[];const started=Date.now();
  try{
   while(Date.now()-started<90000){
    const s=await snap(),p=s.state.player,dx=x-p.x,dz=z-p.z,a=s.view.azimuth;
    if(Math.hypot(dx,dz)<.2){route.push({target:[x,z],actual:[p.x,p.z],platform:s.state.bridge.platform,support:s.state.bridge.support});console.log('WALK '+x+','+z);return;}
    const right=dx*Math.cos(a)-dz*Math.sin(a),forward=-dx*Math.sin(a)-dz*Math.cos(a),wanted=[];
    if(Math.abs(right)>Math.abs(forward)*.4142)wanted.push(right>0?'KeyD':'KeyA');
    if(Math.abs(forward)>Math.abs(right)*.4142)wanted.push(forward>0?'KeyW':'KeyS');
    for(const key of down)if(!wanted.includes(key))await page.keyboard.up(key);
    for(const key of wanted)if(!down.includes(key))await page.keyboard.down(key);
    down=wanted;await page.waitForTimeout(40);
   }
   throw new Error('Walk stalled '+JSON.stringify((await snap()).state.player)+' target '+x+','+z);
  }finally{for(const key of down)await page.keyboard.up(key);}
 }
 async function routeTo(points){for(const point of points)await walkTo(...point);}
 async function aim(x,y,z){
  const point=await project(x,y,z);
  assert.ok(point.x>8&&point.x<1432&&point.y>8&&point.y<892,'world target visible '+JSON.stringify({x,y,z,point}));
  await page.mouse.move(point.x,point.y);
 }
 async function ensureVisible(points){
  for(let attempt=0;attempt<5;attempt++){
   const projected=await Promise.all(points.map(p=>project(p.x,.4,p.z)));
   if(projected.every(p=>p.x>50&&p.x<1390&&p.y>90&&p.y<760))return;
   await page.mouse.move(740,460);await page.mouse.wheel(0,380);await page.waitForTimeout(700);
  }
 }
 async function drawBridge(shape,{count=6,release=true}={}){
  const anchors=bridgeAnchors(shape);await ensureVisible(anchors.slice(0,count));
  await page.keyboard.down('Space');await aim(anchors[0].x,.4,anchors[0].z);await page.mouse.down();await page.waitForTimeout(100);
  for(let i=1;i<count;i++){
   for(let j=1;j<=7;j++){
    const t=j/7;await aim(anchors[i-1].x+(anchors[i].x-anchors[i-1].x)*t,.4,anchors[i-1].z+(anchors[i].z-anchors[i-1].z)*t);
    await page.waitForTimeout(45);
   }
  }
  if(release){await page.mouse.up();await page.keyboard.up('Space');await page.waitForTimeout(180);}
 }
 async function holdE(milliseconds){
  const before=await snap(),signature=s=>JSON.stringify([s.carried,s.state.cores,s.state.ending]);
  const complete=milliseconds>=800&&before.delivery?.duration,started=Date.now();let changed=false,peakProgress=0,last=before;
  await page.keyboard.down('KeyE');
  try{
   if(complete){
    while(Date.now()-started<8000){await page.waitForTimeout(70);last=await snap();peakProgress=Math.max(peakProgress,last.delivery?.progress||0);if(signature(last)!==signature(before)){changed=true;break;}}
    assert.ok(changed,'long hold must complete: '+JSON.stringify({kind:before.delivery.kind,peakProgress,last:last.delivery,focus:last.focus}));
   }else await page.waitForTimeout(milliseconds);
  }finally{await page.keyboard.up('KeyE');holds.push({kind:before.delivery?.kind,wallMs:Date.now()-started,complete:!!complete,changed,peakProgress});}
  await page.waitForTimeout(180);
 }
 async function sendLetter(expected){await walkTo(0,-50.25);await holdE(2350);await page.waitForSelector('#ending-rewind',{timeout:15000});assert.equal((await snap()).state.ending,expected);}
 async function rewind(){await page.locator('#ending-rewind').click();await page.keyboard.press('Escape');await page.waitForTimeout(1000);assert.equal((await snap()).state.ending,null);assert.equal((await snap()).focus,null);}
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:30000});
  entry=await page.locator('script[type="module"][src]').first().getAttribute('src');
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(1000);
  await check('fresh main journey has no solved puzzles or allocated cores',async()=>{const s=(await snap()).state;assert.equal(s.p1.solved,false);assert.equal(s.wind.solved,false);assert.equal(s.bridge.solved,false);assert.deepEqual(s.cores,[null,null]);});
  await walkTo(0,4);await page.keyboard.press('KeyE');await page.waitForTimeout(1300);
  // Q explicitly holds dispersion: ordinary slow brushing now keeps a solid flower.
  await page.keyboard.down('KeyQ');await page.keyboard.down('Space');await page.mouse.move(680,560);await page.mouse.down();
  for(let i=1;i<=38;i++){await page.mouse.move(680,560-i*4);await page.waitForTimeout(45);}
  await check('dispersed half-open petals do not accumulate the first light puzzle',async()=>{const s=await snap();assert.ok(s.scatter>=.18,'held wind brush is still dispersing');assert.equal(s.state.p1.solved,false);});
  await page.mouse.up();await page.keyboard.up('Space');await page.keyboard.up('KeyQ');
  await page.waitForFunction(()=>window.__SPRING__.snapshot().state.p1.solved,null,{timeout:15000});
  await check('slow upward wind brush opens the flower and unlocks the first path',async()=>{const s=await snap();assert.ok(s.state.bloom>=.45&&s.state.bloom<=.6);assert.equal(s.state.p1.solved,true);});await capture('01-hand-opened-flower');
  if(process.env.SPRING_STOP_AFTER_FLOWER==='1'){
   fs.writeFileSync(path.join(evidence,'v5-main-flower-gate.json'),JSON.stringify({date:new Date().toISOString(),url,build:{entry},checks,errors,scope:'Ordinary wind-brush opening with Q held: no credit while scatter >= .18; natural settling after release permits credit.'},null,2));
   console.log('COMPLETE flower-settling gate');return;
  }
  await page.keyboard.press('Escape');await routeTo([[0,-10],[0,-14]]);await page.keyboard.press('KeyE');await page.waitForTimeout(1400);assert.equal((await snap()).focus,'wind');
  const waypoints=[[-1,2.3],[3,1.4],[3,-2]];let index=0,start=Date.now(),windSamples=0;
  while(Date.now()-start<120000){
   const w=(await snap()).state.wind;if(w.solved)break;
   const goal=waypoints[index],dx=goal[0]-w.x,dz=goal[1]-w.z,d=Math.hypot(dx,dz);
   if(d<.45&&index<2){index++;continue;}
   if(index===2&&Math.hypot(w.x-3,w.z+2)<.6){await page.mouse.move(40,85);await page.waitForTimeout(80);continue;}
   await aim(w.x-dx/Math.max(.001,d)*.67,.5,w.z-dz/Math.max(.001,d)*.67-16);await page.waitForTimeout(45);windSamples++;
  }
  await check('main wind seed is delivered by pointer pressure and settles after the hand leaves',async()=>assert.equal((await snap()).state.wind.solved,true));await capture('02-wind-delivery');
  await page.keyboard.press('Escape');await routeTo([[0,-21],[0,-26]]);await page.waitForTimeout(1000);
  await check('third act exposes world-space anchors while freely roaming',async()=>{const s=await snap();assert.equal(s.focus,null);assert.equal(s.weaver.available,true);assert.equal(s.weaver.origin,'A');});
  await drawBridge('bridge_am',{count:3});
  await check('lifting the brush early fades the draft without creating a bridge',async()=>{const s=await snap();assert.equal(s.state.bridge.structure,'none');assert.equal(s.weaver.status,'fading');});await capture('03-weave-soft-return');
  await drawBridge('bridge_am',{release:false});await page.waitForFunction(()=>window.__SPRING__.snapshot().weaver.status==='ready');
  await page.keyboard.press('KeyM');await page.waitForSelector('#modal[open]');await page.mouse.up();await page.keyboard.up('Space');await page.locator('#close-modal').click();await page.waitForTimeout(200);
  await check('opening the map cancels a completed but unreleased drawing',async()=>assert.equal((await snap()).state.bridge.structure,'none'));
  await drawBridge('bridge_am');
  await check('ordered anchor stroke and release construct the first flower bridge',async()=>assert.equal((await snap()).state.bridge.structure,'bridge_am'));await capture('04-first-woven-bridge');
  await walkTo(0,-29);assert.equal((await snap()).state.bridge.support,'bridge_am');
  await drawBridge('bridge_mf');
  await check('drawing from an occupied bridge cannot replace its supporting structure',async()=>{const s=await snap();assert.equal(s.state.bridge.structure,'bridge_am');assert.equal(s.weaver.available,false);});
  await walkTo(0,-32);await page.waitForTimeout(600);
  await check('refused bridge change is not queued when the player reaches the middle stone',async()=>assert.equal((await snap()).state.bridge.structure,'bridge_am'));
  await drawBridge('bridge_mf');assert.equal((await snap()).state.bridge.structure,'bridge_mf');await capture('05-second-woven-bridge');
  await routeTo([[0,-35],[0,-38],[0,-43]]);await page.waitForTimeout(500);
  await check('both hand-woven bridges can be walked and unlock the final shore',async()=>{const s=await snap();assert.equal(s.state.bridge.solved,true);assert.equal(s.delivery.kind,'take');assert.equal(s.focus,null);});
  await holdE(850);assert.equal((await snap()).carried,0);await walkTo(-3,-46);await holdE(1150);
  await check('first seed is carried through space and planted at the memory bed',async()=>{const s=await snap();assert.deepEqual(s.state.cores,['memory',null]);assert.equal(s.carried,null);});await capture('06-memory-planted');
  await walkTo(0,-43);await holdE(850);assert.equal((await snap()).carried,1);await walkTo(-3,-46);await holdE(1100);
  await check('an occupied flower bed refuses the second seed without dropping it',async()=>{const s=await snap();assert.deepEqual(s.state.cores,['memory',null]);assert.equal(s.carried,1);assert.equal(s.delivery.kind,'full');});
  await walkTo(0,-48);await holdE(1150);assert.deepEqual((await snap()).state.cores,['memory','season']);
  await walkTo(0,-50.25);await holdE(500);
  await check('a short send gesture remains a reversible preview',async()=>assert.equal((await snap()).state.ending,null));await capture('07-letter-before-send');
  await sendLetter('memory+season');await capture('08-memory-season');
  await rewind();await walkTo(0,-48);await holdE(950);assert.equal((await snap()).carried,1);await walkTo(3,-46);await holdE(1150);await sendLetter('memory+voyage');await capture('09-memory-voyage');
  await rewind();await walkTo(-3,-46);await holdE(950);assert.equal((await snap()).carried,0);await walkTo(0,-48);await holdE(1150);await sendLetter('season+voyage');await capture('10-season-voyage');
  await check('all three endings are reached through legal rewind, lifting and replanting',async()=>{assert.equal((await snap()).state.ending,'season+voyage');assert.deepEqual((await snap()).state.cores,['season','voyage']);});
  assert.deepEqual(errors,[]);
  await context.storageState({path:path.join(evidence,'v5-main-real-play-storage.json')});
  const final=await snap();delete final.frameTimes;
  fs.writeFileSync(path.join(evidence,'v5-main-play.json'),JSON.stringify({date:new Date().toISOString(),url,build:{entry},checks,route,captures,holds,errors,limitations,windSamples,storageExport:'v5-main-real-play-storage.json',scope:'Ordinary keyboard, mouse and UI. Read-only snapshot/project for navigation. No injected game state or saves.',final},null,2));
  console.log('COMPLETE '+checks.length+' main-story checks');
 }catch(error){
  await capture('failure').catch(()=>{});const snapshot=await snap().catch(()=>null);if(snapshot)delete snapshot.frameTimes;
  fs.writeFileSync(path.join(evidence,'v5-main-failure.json'),JSON.stringify({date:new Date().toISOString(),url,build:{entry},error:error.stack,checks,route,captures,holds,errors,snapshot},null,2));throw error;
 }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
