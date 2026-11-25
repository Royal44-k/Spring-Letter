/* Actual V5 branch and farewell regression. Navigation uses read-only diagnostics;
 * all gameplay is ordinary keyboard, mouse and visible UI. WebAudio wrappers only
 * log the real oscillator starts; they do not synthesize cues or alter scheduling.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const evidence=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5192';
fs.mkdirSync(evidence,{recursive:true});
const original=[1,2,0,1,0,2],chosen=[2,0,1,2,0,2];
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{
  window.__AUDIO_OBSERVATIONS__=[];
  window.__MODAL_OBSERVATIONS__=[];
  document.addEventListener('DOMContentLoaded',()=>{const modal=document.getElementById('modal');if(modal)new MutationObserver(()=>window.__MODAL_OBSERVATIONS__.push({wall:performance.now(),open:modal.open})).observe(modal,{attributes:true,attributeFilter:['open']});},{once:true});
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  const create=Audio.prototype.createOscillator;
  Audio.prototype.createOscillator=function(...args){
   const oscillator=create.apply(this,args),audioContext=this,start=oscillator.start,setFrequency=oscillator.frequency.setValueAtTime;
   let scheduledFrequency=null;
   oscillator.frequency.setValueAtTime=function(value,when){scheduledFrequency=value;return setFrequency.call(this,value,when);};
   oscillator.start=function(...startArgs){
    window.__AUDIO_OBSERVATIONS__.push({wall:performance.now(),audioTime:audioContext.currentTime,when:startArgs[0]??audioContext.currentTime,frequency:scheduledFrequency??oscillator.frequency.value,type:oscillator.type});
    return start.apply(this,startArgs);
   };
   return oscillator;
  };
 });
 const page=await context.newPage(),checks=[],captures=[],captureTimes=[],route=[],errors=[],observations={};let phasePrefix='',entry=null;
 page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const project=(x,y,z)=>page.evaluate(p=>window.__SPRING__.project(...p),[x,y,z]);
 const audio=()=>page.evaluate(()=>window.__AUDIO_OBSERVATIONS__);
 async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
 async function capture(name){const file='v5-branch-'+phasePrefix+name+'.png',start=Date.now();await page.screenshot({path:path.join(evidence,file)});captures.push(file);captureTimes.push({file,start,end:Date.now(),modalAfter:await page.locator('#modal').evaluate(e=>e.open)});}
 async function walkTo(x,z){
  let down=[];const started=Date.now();
  try{while(Date.now()-started<90000){
   const s=await snap(),p=s.state.player,dx=x-p.x,dz=z-p.z,a=s.view.azimuth;
   if(Math.hypot(dx,dz)<.2){route.push({target:[x,z],actual:[p.x,p.z],platform:s.state.bridge.platform,support:s.state.bridge.support});console.log('WALK '+x+','+z);return;}
   const right=dx*Math.cos(a)-dz*Math.sin(a),forward=-dx*Math.sin(a)-dz*Math.cos(a),wanted=[];
   if(Math.abs(right)>Math.abs(forward)*.4142)wanted.push(right>0?'KeyD':'KeyA');
   if(Math.abs(forward)>Math.abs(right)*.4142)wanted.push(forward>0?'KeyW':'KeyS');
   for(const key of down)if(!wanted.includes(key))await page.keyboard.up(key);
   for(const key of wanted)if(!down.includes(key))await page.keyboard.down(key);
   down=wanted;await page.waitForTimeout(40);
  }throw new Error('Walk stalled '+JSON.stringify((await snap()).state.player)+' target '+x+','+z);
  }finally{for(const key of down)await page.keyboard.up(key);}
 }
 async function aim(x,y,z){const p=await project(x,y,z);assert.ok(p.x>8&&p.x<1432&&p.y>8&&p.y<892,'target visible '+JSON.stringify({x,y,z,p}));await page.mouse.move(p.x,p.y);}
 async function holdE(){
  const before=await snap(),signature=s=>JSON.stringify([s.carried,s.state.cores,s.state.ending]),start=Date.now();
  await page.keyboard.down('KeyE');
  try{while(Date.now()-start<8000){await page.waitForTimeout(70);if(signature(await snap())!==signature(before))return;}throw new Error('E hold did not complete '+JSON.stringify((await snap()).delivery));}
  finally{await page.keyboard.up('KeyE');}
 }
 async function drawBridge(shape){
  const from=shape==='bridge_am'?{x:0,z:-26}:{x:0,z:-32},to={x:0,z:shape==='bridge_am'?-32:-38},curve=shape==='bridge_am'?.28:-.32;
  const anchors=Array.from({length:6},(_,i)=>({x:Math.sin(i/5*Math.PI)*curve,z:from.z+(to.z-from.z)*i/5}));
  for(let attempt=0;attempt<5;attempt++){
   const points=await Promise.all(anchors.map(p=>project(p.x,.4,p.z)));
   if(points.every(p=>p.x>50&&p.x<1390&&p.y>90&&p.y<760))break;
   await page.mouse.move(740,460);await page.mouse.wheel(0,380);await page.waitForTimeout(700);
  }
  await page.keyboard.down('Space');await aim(from.x,.4,from.z);await page.mouse.down();await page.waitForTimeout(100);
  for(let i=1;i<6;i++)for(let j=1;j<=7;j++){const t=j/7;await aim(anchors[i-1].x+(anchors[i].x-anchors[i-1].x)*t,.4,anchors[i-1].z+(anchors[i].z-anchors[i-1].z)*t);await page.waitForTimeout(45);}
  await page.mouse.up();await page.keyboard.up('Space');await page.waitForTimeout(200);assert.equal((await snap()).state.bridge.structure,shape);
 }
 async function beats(values){for(const n of values){await page.keyboard.press('Digit'+n);await page.waitForTimeout(110);}}
 function cups(events){return events.filter(e=>[392,523.25].some(f=>Math.abs(e.frequency-f)<.02)&&events.some(p=>Math.abs(p.frequency-e.frequency*2.76)<.1&&Math.abs(p.audioTime-e.audioTime)<.02));}
 async function farewell(){
  const audioBefore=(await audio()).length;await holdE();const sentAt=Date.now(),sentPerf=await page.evaluate(()=>performance.now());assert.equal((await snap()).state.ending,'season+voyage');
  const result={samples:[],captures:[]};let lastCapture=-1;const timings=[0,2200,4500,6000];
  while(Date.now()-sentAt<18000){
   const elapsed=Date.now()-sentAt,s=await snap(),modal=await page.locator('#modal').evaluate(e=>e.open);
   result.samples.push({wallMs:elapsed,modal,audio:s.audio,presentation:s.presentation,ending:s.state.ending});
   if(lastCapture<3&&elapsed>=timings[lastCapture+1]&&!modal){lastCapture++;await capture('07-farewell-'+timings[lastCapture]+'ms');const shot=captureTimes.at(-1);result.captures.push({...shot,startMs:shot.start-sentAt,endMs:shot.end-sentAt});assert.equal(shot.modalAfter,false,'farewell screenshot must finish before modal');}
   if(modal){result.modalDetectedMs=elapsed;break;}await page.waitForTimeout(65);
  }
  result.modalOpenedMs=await page.evaluate(start=>window.__MODAL_OBSERVATIONS__.filter(e=>e.open&&e.wall>=start).at(-1)?.wall-start,sentPerf);
  result.audio=(await audio()).slice(audioBefore);
  await check(phasePrefix+'authored cup phrase and distinct companion answer play before the ending modal',async()=>{
   const c=cups(result.audio);assert.deepEqual(c.map(e=>Math.round(e.frequency*100)/100),[523.25,392,523.25,523.25]);
   assert.ok(result.audio.find(e=>Math.abs(e.frequency-659.25)<.02&&e.audioTime>c.at(-1).audioTime+.4),'actual reply oscillator after the authored phrase, distinct from the opening chime');
   assert.ok(result.samples.some(s=>s.audio.state==='running'&&s.audio.voices>0));
  });
  await check(phasePrefix+'the world remains visible before the timed ending modal',async()=>{assert.ok(result.modalOpenedMs>=6800);assert.equal(lastCapture,3);assert.equal(await page.locator('#ending-rewind').isVisible(),true);});await capture('08-ending-letter');return result;
 }
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:30000});
  entry=await page.locator('script[type="module"][src]').first().getAttribute('src');
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(1000);
  await walkTo(-3.7,1.9);await page.keyboard.press('KeyE');await page.waitForTimeout(1400);assert.equal((await snap()).branch,'rhythm');
  await beats([0,0,0,0,0,0]);await page.locator('#branch-finish').click();
  await check('six silent beats cannot become a completed cup composition',async()=>assert.equal((await snap()).state.story.branches.rhythm,false));
  await page.locator('#motif-reset').click();await beats(original);await page.locator('#branch-finish').click();
  await check('six authored cup beats are committed without requiring a companion',async()=>{const s=await snap();assert.equal(s.state.story.branches.rhythm,true);assert.deepEqual(s.state.story.motif,original);assert.equal(s.state.companion.awakened,false);});
  await page.locator('#motif-rewrite').click();await beats([2,2]);await page.locator('#motif-cancel').click();
  await check('explicit rewrite cancellation preserves the committed cup composition',async()=>assert.deepEqual((await snap()).state.story.motif,original));
  await page.locator('#motif-rewrite').click();await beats([2]);await page.keyboard.press('Escape');await page.keyboard.press('KeyE');
  await check('leaving an uncommitted rewrite preserves the original',async()=>assert.deepEqual((await snap()).state.story.motif,original));
  await page.locator('#motif-rewrite').click();await beats(chosen);await page.locator('#branch-finish').click();await page.waitForTimeout(2800);
  const playbackStart=(await audio()).length;await page.locator('#motif-play').click();await page.waitForTimeout(4700);
  observations.branchPlayback=(await audio()).slice(playbackStart);
  await check('saved replacement replays its actual cup oscillator sequence including rests',async()=>{
   assert.deepEqual((await snap()).state.story.motif,chosen);const c=cups(observations.branchPlayback);
   assert.deepEqual(c.map(e=>Math.round(e.frequency*100)/100),[523.25,392,523.25,523.25]);
   assert.ok(c[1].audioTime-c[0].audioTime>1.08);assert.ok(c[3].audioTime-c[2].audioTime>1.08);
  });await capture('01-authored-cups');await page.keyboard.press('Escape');
  await walkTo(0,4);await page.keyboard.press('KeyE');await page.waitForTimeout(1400);
  await page.keyboard.down('Space');await page.mouse.move(680,560);await page.mouse.down();
  for(let i=1;i<=38;i++){await page.mouse.move(680,560-i*4);await page.waitForTimeout(65);}
  observations.slowBrush=await snap();delete observations.slowBrush.frameTimes;
  await page.mouse.up();await page.keyboard.up('Space');await page.waitForFunction(()=>window.__SPRING__.snapshot().state.p1.solved,null,{timeout:15000});
  await check('slow flower gesture keeps the solid form while opening the first path',async()=>{assert.ok(observations.slowBrush.scatter<.18);assert.equal((await snap()).state.p1.solved,true);});await page.keyboard.press('Escape');
  await walkTo(0,-10);await walkTo(0,-17);await walkTo(-3.8,-17.5);await page.keyboard.press('KeyE');await page.waitForTimeout(1500);assert.equal((await snap()).branch,'light');
  await page.mouse.move(600,250);await page.keyboard.press('Digit1');await page.waitForFunction(()=>window.__SPRING__.snapshot().state.story.lightFound[0]);
  await page.locator('[data-inscription="1"]').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().state.story.lightFound[1]);
  await aim(-3.46,1.109,-17.17);await page.waitForFunction(()=>window.__SPRING__.snapshot().state.story.lightFound[2],null,{timeout:8000});
  await check('keyboard, visible button and actual inscription pointer reveal all three traces',async()=>assert.deepEqual((await snap()).state.story.lightFound,[true,true,true]));await capture('02-three-inscriptions');await page.keyboard.press('Escape');
  await walkTo(0,-14);await page.keyboard.press('KeyE');await page.waitForTimeout(1400);assert.equal((await snap()).focus,'wind');
  const waypoints=[[-1,2.3],[3,1.4],[3,-2]];let index=0,start=Date.now();
  while(Date.now()-start<120000){const w=(await snap()).state.wind;if(w.solved)break;const g=waypoints[index],dx=g[0]-w.x,dz=g[1]-w.z,d=Math.hypot(dx,dz);if(d<.45&&index<2){index++;continue;}if(index===2&&Math.hypot(w.x-3,w.z+2)<.6){await page.mouse.move(40,85);await page.waitForTimeout(80);continue;}await aim(w.x-dx/Math.max(.001,d)*.67,.5,w.z-dz/Math.max(.001,d)*.67-16);await page.waitForTimeout(45);}
  assert.equal((await snap()).state.wind.solved,true);await page.waitForTimeout(1100);assert.equal((await snap()).state.companion.awakened,true);await page.keyboard.press('Escape');
  await walkTo(0,-21);await walkTo(0,-26);await walkTo(-5,-29);await page.keyboard.press('KeyE');await page.waitForTimeout(1500);assert.equal((await snap()).branch,'memory');
  await page.locator('#branch-finish').click();assert.equal((await snap()).state.story.branches.memory,false);
  await page.locator('#memory-bloom').focus();await page.keyboard.press('Home');await page.waitForFunction(()=>window.__SPRING__.snapshot().state.story.memorySeen.closed);await capture('03-old-flower-closed');
  await page.keyboard.press('End');await page.waitForFunction(()=>window.__SPRING__.snapshot().state.story.memorySeen.open);await capture('04-old-flower-open');
  await page.locator('#branch-finish').click();assert.equal((await snap()).state.story.branches.memory,false);
  await page.locator('#memory-bloom').focus();await page.keyboard.press('Home');for(let i=0;i<4;i++)await page.keyboard.press('PageUp');await page.locator('#branch-finish').click();
  await check('old flower requires both years and saves only a living middle pose',async()=>{const s=(await snap()).state.story;assert.deepEqual(s.memorySeen,{closed:true,open:true});assert.equal(s.branches.memory,true);assert.equal(s.memoryBloom,.4);});await capture('05-old-flower-chosen');await page.keyboard.press('Escape');
  await walkTo(0,-26);await drawBridge('bridge_am');await walkTo(0,-32);await drawBridge('bridge_mf');await walkTo(0,-38);await walkTo(0,-43);await page.waitForTimeout(300);
  await holdE();assert.equal((await snap()).carried,0);await walkTo(0,-48);await holdE();await walkTo(0,-43);await holdE();await walkTo(3,-46);await holdE();assert.deepEqual((await snap()).state.cores,['season','voyage']);
  await walkTo(0,-50.25);await page.waitForTimeout(2500);await capture('06-before-send');
  observations.farewell=await farewell();
  if(process.env.SPRING_WAIT_FOR_REVIEW_FIX==='1'){
   await page.locator('#ending-stay').click();await page.keyboard.press('KeyE');await page.waitForTimeout(900);
   observations.oldReview={focus:(await snap()).focus,reviewVisible:await page.locator('#review-letter').isVisible()};await capture('09-stay-review-before-fix');
   const oldEntry=await page.locator('script[type="module"][src]').first().getAttribute('src');observations.oldEntry=oldEntry;
   fs.writeFileSync(path.join(evidence,'v5-branches-checkpoint.json'),JSON.stringify({date:new Date().toISOString(),url,checks,observations},null,2));
   await page.goto('about:blank');console.log('READY_REVIEW_FIX '+oldEntry);const waitStart=Date.now();let nextEntry=null;
   while(Date.now()-waitStart<600000){const html=await fetch(url).then(r=>r.text());const entry=html.match(/<script[^>]+src="([^"]+\.js)"/)?.[1];if(entry&&entry!==oldEntry){nextEntry=entry;break;}await new Promise(r=>setTimeout(r,1500));}
   assert.ok(nextEntry,'new fixed package becomes available');observations.newEntry=nextEntry;phasePrefix='fixed-';
   await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden',timeout:30000});await page.locator('#continue').click();await page.waitForTimeout(1200);await page.keyboard.press('KeyE');await page.waitForTimeout(600);
   await check('after staying in the garden E opens the saved letter review',async()=>{assert.equal((await snap()).focus,'finale');assert.equal(await page.locator('#review-letter').isVisible(),true);});await page.locator('#review-letter').click();await page.locator('#ending-rewind').click();await page.keyboard.press('Escape');await page.waitForTimeout(1000);
   await walkTo(0,-50.25);observations.fixedFarewell=await farewell();await page.locator('#ending-stay').click();await page.keyboard.press('KeyE');
   await check('the new farewell also returns to an accessible review after staying',async()=>assert.equal(await page.locator('#review-letter').isVisible(),true));
  }
  if(process.env.SPRING_WAIT_FOR_REVIEW_FIX!=='1'){
   await page.locator('#ending-stay').click();await page.keyboard.press('KeyE');await page.waitForTimeout(600);
   await check('staying in the final garden leaves E and the saved letter review usable',async()=>{assert.equal((await snap()).focus,'finale');assert.equal(await page.locator('#review-letter').isVisible(),true);});
  }
  assert.deepEqual((await snap()).state.story.branches,{rhythm:true,light:true,memory:true});assert.deepEqual(errors,[]);
  await context.storageState({path:path.join(evidence,'v5-branches-real-play-storage.json')});
  fs.writeFileSync(path.join(evidence,'v5-branches-play.json'),JSON.stringify({date:new Date().toISOString(),url,build:{entry,finalEntry:await page.locator('script[type="module"][src]').first().getAttribute('src')},checks,captures,captureTimes,route,errors,observations,storageExport:'v5-branches-real-play-storage.json',scope:'Ordinary keyboard, mouse and UI; read-only navigation snapshots. Real WebAudio oscillator starts are observed without generating or changing sound. Storage is exported by the browser only after the actual journey succeeds. This verifies scheduled audio nodes and rests, not human listening quality.',limitations:['Headless audio-node evidence does not prove speaker output or subjective timbre.','Screenshots sample the farewell; they do not independently prove every intermediate animation frame.']},null,2));console.log('COMPLETE '+checks.length+' branch/farewell checks');
 }catch(error){await capture('failure').catch(()=>{});const s=await snap().catch(()=>null);if(s)delete s.frameTimes;fs.writeFileSync(path.join(evidence,'v5-branches-failure.json'),JSON.stringify({date:new Date().toISOString(),url,error:error.stack,checks,captures,route,errors,observations,snapshot:s},null,2));throw error;}
 finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
