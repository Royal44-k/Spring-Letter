/**
 * Continue a real, ordinarily earned 0.6 journey in an isolated Edge context.
 * Run serially with the other GPU checks:
 *   SPRING_URL=http://127.0.0.1:5195 EXPECTED_JS=/assets/index-HASH.js node scripts/v9-legacy-check.cjs
 * EARNED_STORAGE may name another retained 0.6 earned-storage.json.
 * Only the fixture's origin is remapped. Gameplay data is never injected or
 * edited: visits, one unfinished flower-sheet edit, travel and export use UI.
 * __SPRING__.snapshot/project and localStorage reads are diagnostics only.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {harness}=require('./v6-input-helpers.cjs');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5195';
const fixturePath=path.resolve(root,process.env.EARNED_STORAGE||'evidence/v8/play-2026-11-21T03-02-53-815Z/earned-storage.json');
const out=path.join(root,'evidence/v9/legacy-'+new Date().toISOString().replace(/[:.]/g,'-'));
const archiveKey='spring-letter:archive:v1',ids=['rain','wind','tide'];
// Frozen pre-migration text, deliberately not imported from today's copy module.
const oldText={
 rain:{title:'一瓢水的去处',note:'我把最后一瓢雨留在石槽里。老树的根还在等，窗边的新芽也渴了。请你先照料一处；另一处，我回来以后再接手。',replies:{
  tree:'致禾：我先浇了老树。叶子舒展开了，树下还能坐两个人。窗边的新芽，我留了一块指路的石头，等你回来接手。——弥',
  shoot:'致禾：窗边绿了一点。我先把雨水留给了新芽。老树还在，杯子也在，等你回来一起照料。——弥'}},
 wind:{title:'夜渡之前',note:'今晚会有船靠岸。我只能先修好一件东西：裹住幼种的帆，或者渡口那盏迎客灯。先把漏风的旧井绕开，再替我选一个吧。',replies:{
  lamp:'致阿渡：我先接通了迎客灯。远处有一盏小灯回应了一下。等下一艘船靠岸，就一起把帆缝好吧。——弥',
  sail:'致阿渡：我先把风引进了护种帆。种子没再被吹翻。我在岸边留了一列花，今晚也能循着它们找到渡口。——弥'}},
 tide:{title:'留给下一声',note:'岑留下的杯声走在一条沟槽里，游絮的回声走在另一条。让它们相遇，再决定：今夜先听完旧曲，还是为新的那一声留出空白。',replies:{
  old:'游絮跟着旧曲唱完了最后一拍。它没有变成记录里的人。那一小会儿，它只是愿意陪你听完。',
  new:'游絮在空出来的一拍里停了停，才添上自己的声音。旧曲没有消失，从这里起，多了一条可以接下去的路。'}},
};
const oldEndings={
 'memory+season':['旧灯与新芽','旧日的声音仍有归处，新的季节在身边萌生。远方的航道，留待另一封春信。'],
 'memory+voyage':['把故乡寄给远方','灯仍亮着，种子已飞向陌生的星岸。这里的花庭，将耐心等候属于自己的下一季。'],
 'season+voyage':['春天不只一种形状','眼前开始生长，远方也收到种子。旧日没有被抹去，只是完整的重现，暂时留在了花里。'],
};
const report={started:new Date().toISOString(),url,passed:false,checks:[],errors:[],scope:'Isolated headless Edge. Genuine retained 0.6 earned archive, origin remapped only. Continue, book, travel, unfinished new flower-sheet keyboard edit, close, settings/export download, reload and walk back to the old ending all use native UI. No progress setters, injected completion, forced clicks or browser-state writes. Readonly diagnostics locate and verify the game.'};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const normal=text=>text.replace(/\s+/g,' ').trim();
function write(){fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));}
function mark(name){report.checks.push(name);write();console.log('PASS '+name);}

(async()=>{
 let browser,context,page,h;
 fs.mkdirSync(out,{recursive:true});
 try{
  const fixtureBytes=fs.readFileSync(fixturePath),earned=JSON.parse(fixtureBytes);
  const fixtureOrigin=earned.origins.find(origin=>origin.localStorage.some(item=>item.name===archiveKey));
  assert.ok(fixtureOrigin,'retained fixture contains the authoritative archive');
  const originalArchive=JSON.parse(fixtureOrigin.localStorage.find(item=>item.name===archiveKey).value);
  assert.equal(originalArchive.format,'spring-letter-archive');
  const baseline=JSON.parse(originalArchive.data.journey);
  assert.ok(baseline.started&&baseline.ending&&baseline.bridge.solved,'fixture is an actually completed old journey');
  assert.equal(baseline.moments,undefined,'fixture must predate the new moments model');
  for(const id of ids){assert.ok(oldText[id].replies[baseline.letters.entries[id].choice]);assert.equal(baseline.letters.entries[id].edition,undefined);assert.equal(baseline.lettersSent.entries[id].edition,undefined);}
  report.fixture={path:fixturePath,sha256:hash(fixtureBytes),origin:fixtureOrigin.origin,revision:originalArchive.revision,reason:originalArchive.reason,ending:baseline.ending,choices:Object.fromEntries(ids.map(id=>[id,baseline.letters.entries[id].choice]))};
  const preservedValues=fixtureOrigin.localStorage.map(item=>({name:item.name,value:item.value}));
  // Port remapping is necessary when checking the same earned save on a new build.
  // No serialized journey, preferences, archive metadata or progress is changed.
  fixtureOrigin.origin=new URL(url).origin;
  assert.deepEqual(fixtureOrigin.localStorage,preservedValues);

  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true,storageState:earned});
  page=await context.newPage();page.setDefaultTimeout(20000);
  h=harness(page,{evidence:out,prefix:'legacy'});
  page.on('pageerror',error=>report.errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
  page.on('dialog',dialog=>{report.errors.push('Unexpected native dialog: '+dialog.message());dialog.dismiss().catch(()=>{});});
  const snap=()=>h.snap();
  const readArchive=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),archiveKey);
  async function capture(name){await h.capture(name);const state=await snap();delete state.frameTimes;fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(state,null,2));}
  async function loaded(){
   await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});
   await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
   const entry=await page.locator('script[type=module][src]').last().getAttribute('src');
   if(process.env.EXPECTED_JS)assert.equal(path.posix.basename(entry),path.posix.basename(process.env.EXPECTED_JS),'tested bundle is the requested build');
   if(report.entry)assert.equal(entry,report.entry,'reload must keep the same build');else report.entry=entry;
  }
  async function continueJourney(){await page.locator('#continue').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play');}
  function historicalState(state,label){
   assert.deepEqual(state.letters,baseline.letters,label+': current legacy choices, rotations, moves and read flags');
   assert.deepEqual(state.lettersSent,baseline.lettersSent,label+': sent-letter snapshot');
   assert.equal(state.ending,baseline.ending,label+': ending');assert.deepEqual(state.cores,baseline.cores,label+': seed allocations');
   assert.equal(state.moments.version,1);for(const id of ids)assert.equal(state.moments.entries[id].completed,false,label+': old replies cannot complete new '+id+' gameplay');
  }
  async function legacyBook(){
   await page.locator('#journal').click();await page.locator('.letter-book').waitFor();
   assert.equal(await page.locator('.letter-book article').count(),3);
   for(const id of ids){
    const article=page.locator('.letter-book article').filter({has:page.locator('[data-track-letter="'+id+'"]')});
    assert.equal(normal(await article.locator('h3').innerText()).replace(/^✉\s*/,''),oldText[id].title);
    assert.equal(normal(await article.locator('p').first().innerText()),oldText[id].note);
    assert.equal(normal(await article.locator('blockquote').innerText()),oldText[id].replies[baseline.letters.entries[id].choice]);
   }
   assert.equal(await page.locator('.moment-keepsake').count(),0,'legacy replies do not acquire invented artwork');
   assert.equal(await page.locator('[data-replay-score]').count(),0,'legacy tide reply is not labelled as a newly authored score');
  }
  async function ending(){
   assert.ok((await snap()).state.player.z<-39,'walk to the terminal before reviewing the ending');
   await page.locator('#scene canvas').focus();await page.keyboard.press('KeyE');
   await page.waitForFunction(()=>window.__SPRING__.snapshot().focus==='finale');
   await page.locator('#review-letter').click();await page.locator('#ending-stay').waitFor();
   const content=normal(await page.locator('#modal-content').innerText()),[title,summary]=oldEndings[baseline.ending];
   assert.equal(normal(await page.locator('#modal-content h2').innerText()),title);assert.ok(content.includes(summary));
   for(const id of ids){assert.ok(content.includes(oldText[id].title));assert.ok(content.includes(oldText[id].replies[baseline.lettersSent.entries[id].choice]));}
   assert.equal(await page.locator('#modal-content .moment-keepsake').count(),0,'frozen old ending cannot gain new artwork');
   return content;
  }
  async function leaveEnding(){await page.locator('#ending-stay').click();await page.locator('#leave-focus').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().focus===null);}

  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await loaded();
  const entryResponse=await page.request.get(new URL(report.entry,url).href);assert.ok(entryResponse.ok());report.entrySha256=hash(await entryResponse.body());
  await continueJourney();let state=(await snap()).state;historicalState(state,'continue');
  for(const id of ids)assert.equal(state.moments.entries[id].draft,null,'new '+id+' has no falsely migrated draft');
  await capture('continued-old-journey');mark('real 0.6 completed journey resumes with all old choices and rotations preserved, and every new moment incomplete');

  const oldEndingText=await ending();await capture('old-ending-before');await leaveEnding();
  await legacyBook();await capture('legacy-letter-book');mark('book and ending still show the exact old letter titles, notes and replies, without invented artwork');
  await page.locator('[data-travel-letter="rain"]').click();
  await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.mode==='play'&&s.focus===null&&Math.hypot(s.state.player.x+12,s.state.player.z-1.5)<.25;});
  await page.locator('#moment-enter').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().letters.activeId==='rain');await page.waitForTimeout(1700);
  assert.match(await page.locator('#moment-kicker').innerText(),/花光暗房/);
  assert.notEqual(normal(await page.locator('#moment-title').innerText()),oldText.rain.title);
  let rain=(await snap()).letters.stages.rain;assert.deepEqual(rain.panes.map(pane=>pane.id),['tree','window','bloom']);assert.equal(rain.ready,false);
  assert.equal(await page.locator('[data-commit]').count(),0,'legacy reply does not bypass the new activity');
  await capture('new-flower-room-from-old-save');
  const originalX=rain.draft.positions.tree.x;
  await page.locator('#scene canvas').focus();await page.keyboard.press('Digit1');await page.keyboard.press('ArrowRight');
  await page.waitForFunction(x=>window.__SPRING__.snapshot().letters.stages.rain.draft.positions.tree.x!==x,originalX);
  assert.equal((await snap()).letters.stages.rain.ready,false,'one ordinary adjustment is an unfinished draft');
  await page.locator('#moment-close').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().focus===null);
  state=(await snap()).state;historicalState(state,'close new flower room');const newDraft=state.moments.entries.rain.draft;
  assert.ok(newDraft&&newDraft.positions.tree.x!==originalX);assert.equal((await snap()).saveStatus.lastResult.ok,true);
  await legacyBook();await page.locator('#close-modal').click();mark('normal travel opens new flower-sheet gameplay; a keyboard draft and close preserve all old reply history');

  await page.locator('#settings').click();await page.locator('#save-manager').click();await page.locator('#save-panel-view').waitFor();
  const pending=page.waitForEvent('download');await page.locator('#save-export').click();const download=await pending,exportPath=path.join(out,'legacy-plus-new-draft.json');await download.saveAs(exportPath);
  const bytes=fs.readFileSync(exportPath),exported=JSON.parse(bytes);assert.equal(exported.format,'spring-letter-archive');const exportedJourney=JSON.parse(exported.data.journey);
  historicalState(exportedJourney,'downloaded export');assert.deepEqual(exportedJourney.moments.entries.rain.draft,newDraft);
  const persisted=JSON.parse((await readArchive()).data.journey);historicalState(persisted,'persisted archive');assert.deepEqual(persisted.moments.entries.rain.draft,newDraft);
  report.export={file:path.basename(exportPath),suggestedFilename:download.suggestedFilename(),sha256:hash(bytes),rainDraft:newDraft};
  await capture('export-preserves-both-generations');await page.locator('#close-modal').click();mark('real UI download and persisted archive contain old letters plus the unfinished new artwork side by side');

  await page.reload({waitUntil:'domcontentloaded'});await loaded();await continueJourney();state=(await snap()).state;historicalState(state,'reload');assert.deepEqual(state.moments.entries.rain.draft,newDraft);
  await legacyBook();await page.locator('[data-travel-letter="tide"]').click();await page.waitForFunction(()=>{const s=window.__SPRING__.snapshot();return s.focus===null&&Math.hypot(s.state.player.x+12,s.state.player.z+26.5)<.25;});
  // Return along the established shore and weave the two ordinary bridge spans.
  // No teleport, progress setter or direct invocation of the ending function.
  await h.routeTo([[-12,-29],[-8.6,-31],[-7,-29],[-5,-29],[0,-26]]);
  await h.drawBridge('bridge_am');await h.walk(0,-32);await h.drawBridge('bridge_mf');await h.routeTo([[0,-38],[0,-43]]);
  const afterEndingText=await ending();assert.equal(afterEndingText,oldEndingText,'new unfinished activity must not rewrite the already-sent old ending');
  state=(await snap()).state;historicalState(state,'return to old ending');assert.deepEqual(state.moments.entries.rain.draft,newDraft);
  await capture('old-ending-after-new-draft');mark('reload retains both generations; returning on foot to the terminal shows the identical frozen old ending');
  assert.equal(hash(fs.readFileSync(fixturePath)),report.fixture.sha256,'source earned archive is untouched');
  assert.deepEqual(report.errors,[]);report.final=await snap();delete report.final.frameTimes;report.route=h.route;report.captures=h.captures;
  report.passed=true;report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:true,out,checks:report.checks.length}));
 }catch(error){
  report.failure=error.stack;report.final=page&&!page.isClosed()?await page.evaluate(()=>window.__SPRING__?.snapshot()).catch(()=>null):null;if(report.final)delete report.final.frameTimes;
  if(page&&!page.isClosed())await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});if(h){report.route=h.route;report.captures=h.captures;}write();throw error;
 }finally{await context?.close().catch(()=>{});await browser?.close().catch(()=>{});}
})().catch(error=>{console.error(error);process.exitCode=1;});
