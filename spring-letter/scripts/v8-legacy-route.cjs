/* Ordinary-input v8 legacy-route compatibility journey: every earned result comes from keyboard/mouse/UI. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'evidence/v8');
const url=process.env.SPRING_URL||'http://127.0.0.1:5197';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const cleanSnapshot=s=>{if(s)delete s.frameTimes;return s;};

function checkExpectedJS(entry,sha){
 const expected=process.env.EXPECTED_JS;
 if(expected){if(/^[a-f0-9]{64}$/i.test(expected))assert.equal(sha,expected.toLowerCase(),'EXPECTED_JS SHA differs');else assert.ok(entry===expected||path.posix.basename(entry)===path.posix.basename(expected),'EXPECTED_JS asset differs');}
 if(process.env.EXPECTED_JS_SHA256)assert.equal(sha,process.env.EXPECTED_JS_SHA256.toLowerCase(),'EXPECTED_JS_SHA256 differs');
}

async function runFullPlay(){
 fs.mkdirSync(output,{recursive:true});
 const runId=new Date().toISOString().replace(/[:.]/g,'-'),runDir=path.join(output,'legacy-'+runId);fs.mkdirSync(runDir,{recursive:true});
 const report={date:new Date().toISOString(),url,runId,retainedDirectory:path.relative(root,runDir).replaceAll('\\','/'),passed:false,checks:[],captures:[],audioSamples:[],nodeAttempts:[],errors:[],requestFailures:[],build:null,
  scope:'Fresh isolated desktop Edge. Only real WASD/Shift/E, mouse/UI and hand-drawn bridges change the game. Readonly snapshot/project guide navigation; no state setters, teleportation or injected storage. Opening is skipped by its visible control. Not a new-player blind test, an acoustic listening test, or a performance benchmark.'};
 const reportPath=path.join(runDir,'full-play.json'),write=()=>fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 const browser=await chromium.launch({executablePath:process.env.SPRING_EDGE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),h=harness(page,{evidence:runDir,prefix:'full'}),{snap,walk,routeTo,act,capture,drawBridge}=h;
 let audioBaseline=null;
 page.on('pageerror',error=>report.errors.push(error.stack||String(error)));page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});page.on('requestfailed',request=>report.requestFailures.push({url:request.url(),reason:request.failure()?.errorText}));
 async function mark(name){report.checks.push(name);report.captures=[...h.captures];write();console.log('PASS '+name);}
 async function audioSample(label,{paused=false,muted=false}={}){
  const audio=(await snap()).audio;assert.ok(audio,'audio diagnostics available');assert.equal(audio.loaded,true,label+' local samples loaded');assert.ok(audio.loadedSamples.length>=5,label+' instrument bank present');assert.deepEqual(audio.loadErrors,[],label+' sample errors');
  assert.ok(Number.isInteger(audio.voices)&&audio.voices>=0&&audio.voices<=audio.voiceLimit,label+' bounded real voices');assert.ok(Number.isInteger(audio.queuedNotes)&&audio.queuedNotes>=0&&audio.queuedNotes<=256,label+' bounded scheduled queue');
  assert.ok(Number.isFinite(audio.scheduledNotes)&&Number.isFinite(audio.eventCount)&&Number.isFinite(audio.missedSchedules),label+' finite scheduling counters');
  if(!audioBaseline)audioBaseline={nodes:audio.persistentNodes,sources:audio.persistentSources};assert.ok(audioBaseline.nodes>0&&audioBaseline.sources>0);assert.equal(audio.persistentNodes,audioBaseline.nodes,label+' persistent graph did not grow');assert.equal(audio.persistentSources,audioBaseline.sources,label+' environmental loops did not grow');
  if(paused||muted){assert.equal(audio.voices,0,label+' foreground voices cleared');assert.equal(audio.queuedNotes,0,label+' pending queue cleared');}else{assert.equal(audio.state,'running',label+' context running');assert.equal(audio.hasOutput,true,label+' sample output scheduled');}
  report.audioSamples.push({label,...audio});write();return audio;
 }
 async function terminalOverlap(){
  await walk(1.5,-42.5);const start=Date.now();
  while(Date.now()-start<12000){const s=await snap(),p=s.state.player;if(Math.hypot(p.x,p.z+43)<1.6&&Math.hypot(p.x-3,p.z+42)<1.65)return;
   const dx=1.5-p.x,dz=-42.5-p.z,a=s.view.azimuth,r=dx*Math.cos(a)-dz*Math.sin(a),f=-dx*Math.sin(a)-dz*Math.cos(a),key=Math.abs(r)>Math.abs(f)?(r>0?'KeyD':'KeyA'):(f>0?'KeyW':'KeyS');
   await page.keyboard.down(key);await page.waitForTimeout(12);await page.keyboard.up(key);await page.waitForTimeout(40);
  }throw Error('Unable to physically stand in the terminal overlap');
 }
 async function ensureRun(id){const s=await snap();assert.equal(s.focus,null,'challenge does not open flower/wind near-view');assert.equal(s.resonance.active,true,id+' remains active');assert.equal(s.resonance.run.id,id);assert.ok(s.resonance.context.remaining>0,id+' has remaining time');return s;}
 async function collectNode(routeId,nodeId){
  // Follow the read-only moving target with ordinary short walks. A closed crown
  // may require a second pass, and an exhausted dash is recovered by releasing it.
  for(let attempt=0;attempt<9;attempt++){
   let s=await ensureRun(routeId),node=s.resonance.nodes.find(n=>n.id===nodeId);assert.ok(node,'node exists');if(node.collected)return;
   if(node.requiresDash){
    await page.keyboard.up('ShiftLeft');
    if(s.dash.energy<.36||s.dash.exhausted)await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return !s.resonance.active||(!s.dash.exhausted&&s.dash.energy>=.52);},null,{timeout:7000});
    s=await ensureRun(routeId);node=s.resonance.nodes.find(n=>n.id===nodeId);
    // Do not spend the entire charge approaching a distant target: first walk
    // to a point on the inside of its orbit, then dash across the visible flower.
    const cz=routeId==='dawn'?0:routeId==='crosswind'?-16:-46;
    if(Math.hypot(node.x-s.state.player.x,node.z-s.state.player.z)>2){await walk(node.x*.77,cz+(node.z-cz)*.77);}
    if(node.open===false){await page.waitForFunction(id=>{const s=window.__SPRING__.snapshot();return !s.resonance.active||s.resonance.nodes.find(n=>n.id===id)?.open===true;},nodeId,{timeout:5500});}
    s=await ensureRun(routeId);node=s.resonance.nodes.find(n=>n.id===nodeId);if(node.collected)return;
    await page.keyboard.down('ShiftLeft');try{await walk(node.x,node.z);}finally{await page.keyboard.up('ShiftLeft');}
   }else{
    await page.keyboard.up('ShiftLeft');
    if(node.requiresEscort){
     assert.ok(s.resonance.escort,'second garden exposes its visible companion');
     if(!s.resonance.escort.near)await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return !s.resonance.active||s.resonance.escort?.near===true;},null,{timeout:7000});
     s=await ensureRun(routeId);node=s.resonance.nodes.find(n=>n.id===nodeId);if(node.collected)return;
    }
    // Walk at the character's ordinary pace: in the final garden an acute dash
    // closes silver flowers, and in the middle garden the companion must keep up.
    await walk(node.x,node.z);
   }
   await page.waitForTimeout(65);s=await ensureRun(routeId);const after=s.resonance.nodes.find(n=>n.id===nodeId);
   report.nodeAttempts.push({route:routeId,node:nodeId,attempt:attempt+1,collected:after.collected,open:after.open,requiresEscort:after.requiresEscort,requiresWalking:after.requiresWalking,blockedReason:after.blockedReason,escort:s.resonance.escort,energy:s.dash.energy,remaining:s.resonance.context.remaining});write();
   if(after.collected)return;
   // Step inward to allow another real crossing; standing on the crown is never
   // treated as a pickup and the test does not bypass that rule.
   const cz=routeId==='dawn'?0:routeId==='crosswind'?-16:-46;await walk(after.x*.76,cz+(after.z-cz)*.76);
  }
  throw Error(`${routeId} node ${nodeId} could not be collected through ordinary movement`);
 }
 async function allNodes(id,order){for(const node of order){await collectNode(id,node);console.log('NODE '+id+'/'+node+' '+(await snap()).resonance.context.collected);}}
 async function bank(id,start,mainField){
  const before=await ensureRun(id),recordBefore=before.resonance.records[id];assert.equal(before.resonance.context.collected,before.resonance.context.total,id+' full collection');assert.equal(before.resonance.context.readyToBank,true);assert.equal(recordBefore.completions,0,id+' collection alone is not a clear');if(mainField)assert.equal(before.state[mainField].solved,false);
  await capture(id+'-full-return');await walk(...start);await act();const after=await snap();assert.equal(after.resonance.active,false);assert.equal(after.resonance.records[id].completions,1);assert.equal(after.resonance.records[id].grade,3);assert.equal(after.resonance.records[id].most,before.resonance.context.total);assert.ok(after.resonance.records[id].best>0);if(mainField)assert.equal(after.state[mainField].solved,true);
  report[id]={before:before.resonance,after:after.resonance};await capture(id+'-banked');await audioSample(id+' banked');await mark(id+' all motes are physically collected and banked once; complete harmony and intended gate persist');return after;
 }
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.waitForSelector('#loading',{state:'hidden',timeout:120000});
  const entry=await page.locator('script[type=module][src]').last().getAttribute('src'),styleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.match(entry,/^(?:\.\/|\/)assets\/.+\.js$/,'immutable candidate required');assert.match(styleBuild,/^(?:\.\/|\/)assets\/.+\.css$/);
  const assetHash=async asset=>{const response=await page.request.get(new URL(asset,url).href);assert.equal(response.status(),200);return hash(await response.body());};
  report.build={entry,styleBuild,entrySha256:await assetHash(entry),styleSha256:await assetHash(styleBuild)};checkExpectedJS(entry,report.build.entrySha256);write();await capture('00-cover');
  await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(500);
  const fresh=await snap();assert.equal(fresh.state.p1.solved,false);assert.equal(fresh.state.wind.solved,false);assert.equal(fresh.state.bridge.solved,false);assert.deepEqual(fresh.state.cores,[null,null]);assert.ok(Object.values(fresh.resonance.records).every(r=>r.completions===0));await mark('fresh journey contains no injected wins, seeds, or resonance rewards');
  await page.waitForFunction(()=>{const a=window.__SPRING__.snapshot().audio;return a?.loaded&&a.hasOutput;},null,{timeout:30000});await audioSample('new journey');
  await walk(3,4);await act();await ensureRun('dawn');await collectNode('dawn',0);await page.locator('#wind-run .run-cancel').click();let s=await snap();assert.equal(s.resonance.active,false);assert.equal(s.resonance.records.dawn.completions,0);assert.equal(s.state.p1.solved,false);await mark('visible cancellation discards an unfinished run without manufacturing a reward or gate');
  await walk(3,4);await act();await ensureRun('dawn');await page.locator('#settings').click();await page.waitForTimeout(200);const paused=await snap();await page.waitForTimeout(950);assert.equal((await snap()).resonance.run.elapsed,paused.resonance.run.elapsed);assert.equal((await snap()).frameNumber,paused.frameNumber);await audioSample('settings pause',{paused:true});await page.locator('#close-modal').click();await page.waitForTimeout(300);await ensureRun('dawn');await mark('settings freeze the actual run and frames, clear audio voices, and resume without harvesting');
  await allNodes('dawn',[0,6,1,2,7,3,4,5]);await bank('dawn',[3,4],'p1');
  // E once more is a new run, not a second delivery of the old payload.
  const banked=JSON.stringify((await snap()).resonance.records.dawn);await act();await ensureRun('dawn');assert.equal((await snap()).resonance.context.collected,0);await page.locator('#wind-run .run-cancel').click();assert.equal(JSON.stringify((await snap()).resonance.records.dawn),banked);await mark('repeated E starts empty and canceling cannot duplicate the previous banked reward');
  await page.locator('#sound').click();await page.waitForTimeout(200);assert.equal((await snap()).audio.muted,true);await audioSample('mute',{muted:true});await page.locator('#sound').click();const notes=(await snap()).audio.scheduledNotes;await page.waitForFunction(n=>window.__SPRING__.snapshot().audio.scheduledNotes>n,notes,{timeout:6000});await audioSample('unmute');await mark('mute removes foreground sound and pending notes; unmute schedules fresh music');
  await routeTo([[3,2],[0,-5],[0,-10.7],[3,-12]]);await act();s=await ensureRun('crosswind');assert.ok(s.resonance.escort?.near);assert.ok(s.resonance.nodes.filter(n=>n.kind==='drift').every(n=>n.requiresEscort));assert.ok(s.resonance.nodes.filter(n=>n.kind==='swift').every(n=>n.requiresDash&&!n.requiresEscort));await capture('crosswind-start');
  await page.locator('#settings').click();await page.waitForTimeout(150);const escortPause=await snap();await page.waitForTimeout(550);s=await snap();assert.deepEqual(s.resonance.escort,escortPause.resonance.escort);assert.equal(s.resonance.run.elapsed,escortPause.resonance.run.elapsed);await page.locator('#close-modal').click();await mark('second garden exposes shared silver pickups and freezes the companion during pause');
  await allNodes('crosswind',[0,6,1,7,2,3,8,4,5,9]);await bank('crosswind',[3,-12],'wind');
  await routeTo([[0,-12],[0,-21],[0,-26]]);await page.waitForTimeout(300);assert.equal((await snap()).weaver.origin,'A');await drawBridge('bridge_am');assert.equal((await snap()).state.bridge.structure,'bridge_am');await capture('first-bridge');await walk(0,-29);assert.equal((await snap()).state.bridge.support,'bridge_am');await walk(0,-32);await drawBridge('bridge_mf');assert.equal((await snap()).state.bridge.structure,'bridge_mf');await routeTo([[0,-35],[0,-38],[0,-43]]);assert.equal((await snap()).state.bridge.solved,true);await capture('terminal-arrival');await mark('ordinary hand drawings and walking across both bridges reach the final shore');
  await walk(3,-42);await act();s=await ensureRun('homeward');assert.equal(s.resonance.escort,null);assert.ok(s.resonance.nodes.filter(n=>n.kind==='drift').every(n=>n.requiresWalking&&!n.requiresDash));assert.ok(s.resonance.nodes.filter(n=>n.kind==='swift').every(n=>n.requiresDash&&!n.requiresWalking));await capture('homeward-start');await allNodes('homeward',[0,5,1,6,2,7,3,4,8,9]);await bank('homeward',[3,-42]);await mark('final garden completes through ordinary walking for silver and timed dashes for golden flowers');
  const records=JSON.stringify((await snap()).resonance.records);await context.storageState({path:path.join(runDir,'full-play-before-seeds-storage.json')});
  await terminalOverlap();assert.equal((await snap()).delivery.kind,'take');assert.equal((await snap()).resonance.context.atStart,true);assert.equal(await page.locator('#wind-run').isVisible(),false);await act();assert.equal((await snap()).carried,0);assert.equal((await snap()).resonance.active,false);await mark('terminal overlap prioritizes the visible seed pickup instead of starting another trial');await walk(-3,-46);await page.locator('#focus-button').click();await page.waitForTimeout(250);assert.deepEqual((await snap()).state.cores,['memory',null]);await capture('memory-planted');
  await walk(0,-43);await act();assert.equal((await snap()).carried,1);await walk(0,-48);await act();assert.deepEqual((await snap()).state.cores,['memory','season']);assert.equal(JSON.stringify((await snap()).resonance.records),records);await mark('resonance records and terminal seed identities coexist; two distinct seeds are planted physically');
  await walk(0,-50.25);await act();await page.waitForSelector('#send-confirm');assert.equal((await snap()).state.ending,null);await capture('consequence-preview');await page.locator('#send-cancel').click();assert.equal((await snap()).state.ending,null);await act();await page.locator('#send-confirm').click();await page.waitForSelector('#ending-rewind',{timeout:20000});assert.equal((await snap()).state.ending,'memory+season');await capture('ending');await mark('canceling the preview is reversible and explicit confirmation reaches the actual ending');
  // Ending is a modal. Close it through the ordinary control before checking
  // live audio counters, then preserve a legitimately earned browser save.
  await page.locator('#close-modal').click();await page.waitForTimeout(500);await audioSample('after ending');
  await context.storageState({path:path.join(runDir,'full-play-earned-storage.json')});await page.reload();await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.waitForSelector('#loading',{state:'hidden',timeout:120000});await page.locator('#continue').click();await page.waitForTimeout(350);s=await snap();assert.equal(JSON.stringify(s.resonance.records),records);assert.equal(s.resonance.active,false);assert.equal(s.state.ending,'memory+season');await mark('ordinary reload retains all three earned records and the ending without resuming a half-run');
  report.final=cleanSnapshot(s);report.route=h.route;report.captures=h.captures;assert.deepEqual(report.errors,[]);assert.deepEqual(report.requestFailures,[]);assert.deepEqual(s.errors,[]);
  report.build.finalEntry=await page.locator('script[type=module][src]').last().getAttribute('src');report.build.finalStyleBuild=await page.locator('link[rel=stylesheet]').last().getAttribute('href');assert.equal(report.build.finalEntry,entry);assert.equal(report.build.finalStyleBuild,styleBuild);assert.equal(await assetHash(entry),report.build.entrySha256);assert.equal(await assetHash(styleBuild),report.build.styleSha256);
  report.passed=true;report.completedAt=new Date().toISOString();write();
  console.log(JSON.stringify({passed:true,checks:report.checks.length,runId,report:reportPath,build:entry}));
 }catch(error){await page.mouse.up().catch(()=>{});for(const key of ['KeyW','KeyA','KeyS','KeyD','ShiftLeft','Space'])await page.keyboard.up(key).catch(()=>{});await capture('failure').catch(()=>{});report.failure=error.stack||String(error);report.final=cleanSnapshot(await snap().catch(()=>null));report.route=h.route;report.captures=h.captures;report.completedAt=new Date().toISOString();write();console.error('Retained failed attempt: '+reportPath);throw error;}
 finally{await context.close();await browser.close();}
}
if(require.main===module)runFullPlay().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={checkExpectedJS};
