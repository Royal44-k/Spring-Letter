// Run serially after the final build. Uses only real browser input and read-only
// diagnostics; the archive must have been earned by v9-full-play.cjs.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5195';
const source=path.resolve(root,process.env.EARNED||'evidence/v9/play-2026-11-21T07-18-10-153Z/earned-storage.json');
const sourceBytes=fs.readFileSync(source),sourceHash=crypto.createHash('sha256').update(sourceBytes).digest('hex'),original=JSON.parse(sourceBytes),earned=structuredClone(original);
assert.ok(earned.origins?.some(o=>o.localStorage?.some(v=>v.name==='spring-letter:archive:v1')),'EARNED must contain an existing authoritative archive');
for(const origin of earned.origins)origin.origin=new URL(url).origin;
for(let i=0;i<earned.origins.length;i++)assert.deepEqual(earned.origins[i].localStorage,original.origins[i].localStorage,'only origin may be changed');
assert.deepEqual(earned.cookies,original.cookies);
const out=path.join(root,'evidence/v9/input-boundaries-'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(out,{recursive:true});
const report={started:new Date().toISOString(),url,source,sourceSha256:sourceHash,passed:false,pages:[],scope:'Serial isolated Chromium: actual clicks, keyboard repeats and CDP touch contacts. Existing earned archive is replayed unchanged except origin. Readonly snapshot/project/localStorage reads, no state setters or progress injection. Not a blind playtest.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const point=(p,id)=>({x:p.x,y:p.y,id,radiusX:3,radiusY:3,force:1});

(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  for(const mode of (process.env.QA_MODE?[process.env.QA_MODE]:['desktop','touch'])){
   const viewport=mode==='desktop'?{width:1440,height:900}:{width:390,height:844};
   const context=await browser.newContext({viewport,hasTouch:mode==='touch',isMobile:mode==='touch',storageState:earned}),page=await context.newPage(),record={mode,viewport,checks:[],errors:[]};report.pages.push(record);
   const h=harness(page,{evidence:out,prefix:mode,width:viewport.width,height:viewport.height}),snap=h.snap,stage=async id=>(await snap()).letters.stages[id];
   page.on('pageerror',e=>record.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')record.errors.push(m.text());});
   const mark=name=>{record.checks.push(name);write();console.log('PASS '+mode+' '+name);};
   async function capture(name){await h.capture(name);fs.writeFileSync(path.join(out,mode+'-'+name+'.json'),JSON.stringify(await snap(),null,2));}
   async function click(selector){const locator=page.locator(selector);if(mode==='touch')await locator.tap();else await locator.click();}
   async function expand(){if(await page.locator('#moment-tools').isHidden()){await click('#moment-edit');await page.waitForTimeout(600);}}
   async function enter(id){
    if((await snap()).letters.activeId)await click('#moment-close');await click('#journal');await click('[data-travel-letter="'+id+'"]');await page.waitForTimeout(1050);await click('#moment-enter');await page.waitForTimeout(1600);assert.equal((await snap()).letters.activeId,id);await expand();
   }
   async function archiveJourney(){return page.evaluate(()=>{const archive=JSON.parse(localStorage.getItem('spring-letter:archive:v1'));return JSON.parse(archive.data.journey);});}
   async function center(selector){const locator=page.locator(selector);await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();assert.ok(box&&box.width&&box.height,'visible '+selector);const p={x:box.x+box.width/2,y:box.y+box.height/2};assert.ok(p.x>0&&p.x<viewport.width&&p.y>0&&p.y<viewport.height,'in viewport '+selector);return p;}
   async function pauseWind(){
    await click('#settings');await page.locator('#modal').waitFor({state:'visible'});const paused=await stage('wind');assert.equal(paused.flight.launched,false);assert.deepEqual(paused.input.held,[]);assert.equal(paused.input.dragging,false);
    await page.waitForTimeout(650);assert.deepEqual((await stage('wind')).draft,paused.draft,'modal cannot advance the paused flight');
    await click('#close-modal');await page.waitForTimeout(450);const resumed=await stage('wind');assert.equal(resumed.flight.launched,false,'closing settings cannot automatically relaunch');assert.equal(resumed.flight.distance,paused.flight.distance);assert.equal(resumed.flight.checkpoint,paused.flight.checkpoint);return paused;
   }
   async function earnFirstCheckpoint(){
    let w=await stage('wind');if(!w.flight.launched)await click('[data-m-action="launch"]');await page.waitForTimeout(120);w=await stage('wind');
    const first=w.gates.find(g=>g.id===w.currentGate),from=await h.project(...w.flight.world),to=await h.project(...first.controlWorld);await page.mouse.move(from.x,from.y);await page.mouse.down();
    try{await page.mouse.move(to.x,to.y,{steps:18});const start=Date.now();while((await stage('wind')).flight.gate<1&&Date.now()-start<18000)await page.waitForTimeout(100);assert.ok((await stage('wind')).flight.gate>=1,'ordinary dragging earns the first safety gate');}finally{await page.mouse.up();}
   }
   try{
    await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden'});record.entry=await page.locator('script[type=module][src]').last().getAttribute('src');if(process.env.EXPECTED_JS)assert.equal(record.entry,process.env.EXPECTED_JS);
    await click('#continue');await page.waitForTimeout(600);assert.equal((await snap()).state.moments.entries.wind.completed,true,'the source really contains a completed earned flight');
    await enter('wind');await click('[data-m-action="restart"]');await click('[data-m-action="launch"]');await page.waitForTimeout(150);
    if(mode==='desktop'){
     const start=(await stage('wind')).flight.x;await page.keyboard.down('KeyD');await page.waitForTimeout(420);let w=await stage('wind');assert.ok(w.flight.x>start+.12,'WASD steers immediately after the launch-button click');assert.ok(w.input.held.includes('KeyD'));await page.keyboard.up('KeyD');await page.waitForTimeout(70);assert.deepEqual((await stage('wind')).input.held,[],'keyup releases flight steering');mark('launch-button focus does not block WASD; keyup releases ownership');
     await page.keyboard.down('KeyA');await pauseWind();await page.keyboard.up('KeyA');mark('settings clears held steering, freezes flight and requires intentional resume');
     await earnFirstCheckpoint();const earnedCheckpoint=(await stage('wind')).flight.checkpoint;assert.ok(earnedCheckpoint>=1);const paused=await pauseWind();assert.equal(paused.flight.checkpoint,earnedCheckpoint);await capture('wind-paused-checkpoint');
     await click('#moment-close');const saved=await archiveJourney();assert.equal(saved.moments.entries.wind.draft.checkpoint,earnedCheckpoint);await enter('wind');const restored=await stage('wind'),safeDistance=paused.gates[earnedCheckpoint-1].distance+1;assert.equal(restored.flight.checkpoint,earnedCheckpoint);assert.equal(restored.flight.launched,false);assert.ok(Math.abs(restored.flight.distance-Math.max(paused.flight.distance,safeDistance))<.2,'resume may place the wing just beyond the earned gate, never erase it');mark('a genuinely earned checkpoint survives pause, archive save and re-entry');
     await enter('rain');await page.locator('#scene canvas').focus();await page.keyboard.press('Digit1');const before=await stage('rain'),x=before.draft.positions.tree.x,key=x<0?'ArrowRight':'ArrowLeft';await page.keyboard.down(key);await page.waitForTimeout(60);const once=(await stage('rain')).draft.positions.tree.x;
     for(let i=0;i<5;i++){await page.keyboard.down(key);await page.waitForTimeout(45);}await page.keyboard.up(key);await page.waitForTimeout(100);const repeated=await stage('rain');assert.ok(Math.abs(repeated.draft.positions.tree.x-x)>Math.abs(once-x)*2,'native repeated keydown events keep moving the selected flower pane');assert.deepEqual((await archiveJourney()).moments.entries.rain.draft.positions,repeated.draft.positions,'keyup saves the exact repeated-key arrangement');mark('rain keyboard repeats move repeatedly and keyup persists the arrangement');await capture('rain-key-repeat');
     await enter('tide');const allTargets=(await stage('tide')).targets.map(t=>({voice:t.voice,beat:t.beat}));assert.equal(allTargets.length,24);record.tideTargets=[];
     for(const cell of allTargets){
      await page.waitForTimeout(320);const before=await stage('tide'),target=before.targets.find(t=>t.voice===cell.voice&&t.beat===cell.beat),q=await h.project(...target.position);await page.mouse.click(q.x,q.y);await page.waitForTimeout(100);const changed=await stage('tide');assert.equal(changed.draft.notes[cell.voice][cell.beat],!before.draft.notes[cell.voice][cell.beat],'scene target '+cell.voice+':'+cell.beat+' toggles');assert.equal(changed.draft.notes.flat().filter((v,i)=>v!==before.draft.notes.flat()[i]).length,1,'one scene press changes one authored note');
      await page.locator('[data-m-action="undo"]').click();await page.waitForTimeout(100);assert.deepEqual((await stage('tide')).draft.notes,before.draft.notes,'undo restores the exact previous score');record.tideTargets.push(cell);
     }
     mark('all 24 authored instrument targets toggle individually and undo restores the score');await capture('tide-24-targets');await click('#moment-close');if((await snap()).state.settings.muted)await click('#sound');await click('#journal');
     const preview=page.locator('[data-replay-score]');assert.equal(await preview.count(),1);await preview.click();await page.waitForTimeout(250);assert.equal(await preview.getAttribute('aria-pressed'),'true');assert.equal((await snap()).audio.paused,false);await preview.click();await page.waitForTimeout(100);assert.equal((await snap()).audio.paused,true);const count=(await snap()).audio.eventCount;await page.waitForTimeout(1300);assert.equal((await snap()).audio.eventCount,count,'stopping the saved composition cancels future note timers');await preview.click();await page.waitForTimeout(150);await click('#close-modal');await page.waitForTimeout(200);assert.equal((await snap()).audio.paused,false);mark('saved-score audition stops its future notes and closing the book restores normal audio');
    }else{
     const cdp=await context.newCDPSession(page),touch=(type,points=[])=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});
     try{
      const right=await center('[data-m-action="right"]'),start=(await stage('wind')).flight.x;await touch('touchStart',[point(right,1)]);await page.waitForTimeout(350);const early=await stage('wind');assert.ok(early.input.held.includes('ArrowRight'));await page.waitForTimeout(550);const late=await stage('wind');assert.ok(late.flight.x>early.flight.x+.15&&late.flight.x>start+.4,'holding a touch button continues beyond a short click pulse');await touch('touchEnd');await page.waitForTimeout(100);assert.deepEqual((await stage('wind')).input.held,[],'touch release removes input; remaining physical inertia is permitted');mark('held touch direction continuously steers and release clears ownership');
      const left=await center('[data-m-action="left"]'),up=await center('[data-m-action="up"]');await touch('touchStart',[point(left,2)]);await page.waitForTimeout(80);await touch('touchStart',[point(left,2),point(up,3)]);await page.waitForTimeout(180);await touch('touchEnd',[point(left,2)]);await page.waitForTimeout(70);assert.deepEqual((await stage('wind')).input.held,['ArrowUp'],'the unreleased contact retains only its own direction');await touch('touchEnd');await page.waitForTimeout(100);assert.deepEqual((await stage('wind')).input.held,[],'overlapping fingers cannot leave a direction stuck after both lift');mark('two overlapping touch contacts release without a stranded direction');
      const arrow=await center('[data-m-action="right"]'),brake=await center('[data-m-action="brake"]'),brakeBefore=(await stage('wind')).input.brake;await touch('touchStart',[point(arrow,4)]);await touch('touchStart',[point(arrow,4),point(brake,5)]);await page.waitForTimeout(90);await touch('touchEnd',[point(brake,5)]);await page.waitForTimeout(150);
      // Some touch engines suppress a click from the non-primary finger. In
      // that case use a real mouse click while the touch direction stays held,
      // rather than falsely claiming that an unobserved brake change occurred.
      record.brakeChangeInput='second touch';if((await stage('wind')).input.brake===brakeBefore){record.brakeChangeInput='mouse click while touch direction remains held';await page.locator('[data-m-action="brake"]').click();await page.waitForTimeout(100);}assert.notEqual((await stage('wind')).input.brake,brakeBefore,'a real UI action changed brake state while a direction was held');await touch('touchEnd');await page.waitForTimeout(100);assert.deepEqual((await stage('wind')).input.held,[],'rebuilding controls after a brake toggle cannot strand pointer capture');mark('a brake control change during held touch does not strand steering after rebuild');
      await pauseWind();mark('touch flight pauses without automatic resume');await capture('touch-wind-released');
      await enter('tide');await click('[data-m-action="clear"]');await page.waitForTimeout(900);
      const score=()=>stage('tide'),cells=[[0,0],[1,3],[2,6]],positions=[];
      for(const [voice,beat]of cells){const target=(await score()).targets.find(t=>t.voice===voice&&t.beat===beat),p=await h.project(...target.position);assert.ok(p.x>0&&p.x<viewport.width&&p.y>0&&p.y<viewport.height,'touch note projects inside viewport');assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName,p),'CANVAS','touch note is not covered by UI');positions.push(p);}
      const [a,b,c]=positions;record.tideTouchTargets=cells.map(([voice,beat],i)=>({voice,beat,...positions[i]}));
      // This Chromium releases the explicitly listed contacts on touchEnd;
      // an empty list releases all. Verify the actual DOM IDs as well.
      await page.evaluate(()=>{window.__v9TouchTrace=[];for(const type of ['pointerdown','pointerup','pointercancel','click'])window.addEventListener(type,e=>window.__v9TouchTrace.push({type:e.type,id:e.pointerId,x:e.clientX,y:e.clientY,primary:e.isPrimary,tag:e.target.tagName,action:e.target.dataset?.mAction,prevented:e.defaultPrevented,connected:e.target.isConnected}),true);});
      await touch('touchStart',[point(a,11)]);await touch('touchStart',[point(a,11),point(b,22)]);await touch('touchMove',[point(a,11),point(c,22)]);await touch('touchEnd',[point(c,22)]);await page.waitForTimeout(120);
      let tide=await score();assert.equal(tide.noteCount,1,'a second finger cannot paint or close the first stroke');assert.equal(tide.draft.notes[0][0],true);
      await touch('touchMove',[point(b,11)]);await touch('touchMove',[point(a,11)]);await touch('touchEnd');await page.waitForTimeout(120);
      tide=await score();assert.equal(tide.noteCount,2);assert.equal(tide.draft.notes[1][3],true);assert.equal(tide.draft.notes[0][0],true,'revisiting a note does not toggle it twice within one stroke');const events=await page.evaluate(()=>window.__v9TouchTrace.splice(0));record.tidePointerEvents=events;const downs=events.filter(e=>e.type==='pointerdown'),ups=events.filter(e=>e.type==='pointerup');assert.equal(downs.length,2);assert.deepEqual(ups.map(e=>e.id),[downs[1].id,downs[0].id],'the second DOM pointer really releases before the owner');await click('[data-m-action="undo"]');await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.stages.tide.noteCount===0,null,{timeout:3000});assert.equal((await score()).noteCount,0,'one undo removes the owned stroke');mark('tide rejects secondary touch painting and release while preserving the first whole stroke');
      await touch('touchStart',[point(a,31)]);await touch('touchStart',[point(b,32),point(a,31)]);await touch('touchEnd',[point(a,31)]);await touch('touchMove',[point(c,32)]);await touch('touchEnd');await page.waitForTimeout(120);
      assert.equal((await score()).noteCount,1,'after the owner lifts, the remaining finger cannot continue its stroke');await click('[data-m-action="undo"]');await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.stages.tide.noteCount===0,null,{timeout:3000});assert.equal((await score()).noteCount,0);mark('tide owner release ends the stroke even when another finger remains on the canvas');
      await touch('touchStart',[point(a,41)]);await touch('touchCancel');await page.waitForTimeout(120);await touch('touchStart',[point(b,42)]);await touch('touchMove',[point(c,42)]);await touch('touchEnd');await page.waitForTimeout(120);
      assert.equal((await score()).noteCount,3,'global cancellation releases ownership for a new stroke');await click('[data-m-action="undo"]');await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.stages.tide.noteCount===1,null,{timeout:3000});tide=await score();assert.equal(tide.noteCount,1);assert.equal(tide.draft.notes[0][0],true,'undo of the new stroke preserves notes completed before cancel');mark('tide touch cancellation clears ownership and the next stroke remains independently undoable');await capture('touch-tide-owned-strokes');
     }finally{await touch('touchEnd').catch(()=>{});await cdp.detach();}
    }
    assert.deepEqual(record.errors,[]);record.final=await snap();delete record.final.frameTimes;record.captures=h.captures;record.passed=true;write();
   }catch(error){record.failure=error.stack;record.touchEvents=await page.evaluate(()=>window.__v9TouchTrace||[]).catch(()=>[]);record.final=await snap().catch(()=>null);await capture('failure').catch(()=>{});write();throw error;}finally{await page.keyboard.up('KeyA').catch(()=>{});await page.keyboard.up('KeyD').catch(()=>{});await context.close();}
  }
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),sourceHash,'the source earned archive remains untouched');report.passed=true;report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:true,out}));
 }catch(error){report.failure=error.stack;write();throw error;}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
