/** Serial GPU check. EARNED must be the real final ordinary-play storage file.
 * SPRING_URL and EXPECTED_JS select the release being checked. No progress
 * setters: fullscreen, photos, artwork and voluntary feedback use shipped UI.
 * Saved-score playback/cancellation is covered by v9-visual-check.cjs.
 */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),url=process.env.SPRING_URL||'http://127.0.0.1:5195',origin=new URL(url).origin;
const out=path.join(root,'evidence/v9/keepsake-'+new Date().toISOString().replace(/[:.]/g,'-'));
const ids=['rain','wind','tide'],names={rain:'花光暗房',wind:'纸翼渡风',tide:'回声织信'};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const report={started:new Date().toISOString(),url,passed:false,checks:[],errors:[],outbound:[],mutatingRequests:[],downloads:[],scope:'Isolated headless Edge using the final ordinary-input earned archive. Actual fullscreen buttons and keyboard, PNG and three SVG downloads, schema-2 voluntary feedback preview/edit/download. Readonly game snapshots; no injected completion. Feedback answers are explicitly synthetic QA data, not player research. Saved-score playback/cancellation remains in v9-visual-check.cjs.'};
const write=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const mark=name=>{report.checks.push(name);write();console.log('PASS '+name);};

(async()=>{
 let browser,context,page;
 fs.mkdirSync(out,{recursive:true});
 try{
  assert.ok(process.env.EARNED,'Set EARNED to the retained storage file produced by the final ordinary-input v9 full playthrough.');
  const fixturePath=path.resolve(root,process.env.EARNED),fixtureBytes=fs.readFileSync(fixturePath),earned=JSON.parse(fixtureBytes);
  const gameOrigin=earned.origins.find(item=>item.localStorage.some(entry=>entry.name==='spring-letter:archive:v1'));assert.ok(gameOrigin);
  const archive=JSON.parse(gameOrigin.localStorage.find(entry=>entry.name==='spring-letter:archive:v1').value),fixture=JSON.parse(archive.data.journey);
  assert.ok(fixture.ending,'earned fixture has reached a committed ending');
  for(const id of ids){assert.equal(fixture.moments.entries[id].completed,true);assert.equal(fixture.letters.entries[id].edition,2);assert.ok(fixture.letters.entries[id].artwork);assert.equal(fixture.lettersSent.entries[id].edition,2);}
  report.fixture={path:fixturePath,sha256:hash(fixtureBytes),sourceOrigin:gameOrigin.origin,ending:fixture.ending};gameOrigin.origin=origin;
  browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  context=await browser.newContext({viewport:{width:1440,height:900},storageState:earned,acceptDownloads:true});page=await context.newPage();page.setDefaultTimeout(20000);
  page.on('pageerror',error=>report.errors.push(String(error)));page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
  page.on('request',request=>{const target=new URL(request.url());if(!['data:','blob:'].includes(target.protocol)&&target.origin!==origin)report.outbound.push(request.url());if(!['GET','HEAD'].includes(request.method()))report.mutatingRequests.push({method:request.method(),url:request.url()});});
  const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
  async function capture(name){await page.screenshot({path:path.join(out,name+'.png')});}
  async function download(selector,name){const pending=page.waitForEvent('download');await page.locator(selector).click();const item=await pending,file=path.join(out,name);await item.saveAs(file);const bytes=fs.readFileSync(file);report.downloads.push({file:name,suggestedFilename:item.suggestedFilename(),bytes:bytes.length,sha256:hash(bytes)});return bytes;}
  function preserved(state,label){assert.deepEqual(state.letters,fixture.letters,label+' does not change current replies');assert.deepEqual(state.lettersSent,fixture.lettersSent,label+' does not change the sent ending');assert.deepEqual(state.moments,fixture.moments,label+' does not change artworks');}
  async function png(bytes,width,height){
   assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));assert.equal(bytes.subarray(bytes.length-8,bytes.length-4).toString(),'IEND');
   assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);
   // Decode the downloaded artifact in a detached canvas; do not alter the game.
   const decoded=await page.evaluate(async base64=>{const raw=Uint8Array.from(atob(base64),char=>char.charCodeAt(0)),bitmap=await createImageBitmap(new Blob([raw],{type:'image/png'}));const canvas=new OffscreenCanvas(96,64),ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0,96,64);const data=ctx.getImageData(0,0,96,64).data,colors=new Set();let low=255,high=0;for(let i=0;i<data.length;i+=4){colors.add(((data[i]>>4)<<8)|((data[i+1]>>4)<<4)|(data[i+2]>>4));const light=(data[i]+data[i+1]+data[i+2])/3;low=Math.min(low,light);high=Math.max(high,light);}const result={width:bitmap.width,height:bitmap.height,colors:colors.size,range:high-low};bitmap.close();return result;},bytes.toString('base64'));
   assert.equal(decoded.width,width);assert.equal(decoded.height,height);assert.ok(decoded.colors>=12&&decoded.range>24,'downloaded image contains a rendered scene, not an empty flat canvas');return decoded;
  }
  async function svgData(bytes){
   return page.evaluate(text=>{const doc=new DOMParser().parseFromString(text,'image/svg+xml'),root=doc.documentElement;return {parserErrors:doc.querySelectorAll('parsererror').length,tag:root.localName,namespace:root.namespaceURI,viewBox:root.getAttribute('viewBox'),title:doc.querySelector('title')?.textContent,desc:doc.querySelector('desc')?.textContent,graphics:doc.querySelectorAll('path,rect,ellipse,circle,polygon').length,unsafe:doc.querySelectorAll('script,foreignObject,image,iframe').length,unsafeAttributes:[...doc.querySelectorAll('*')].flatMap(el=>[...el.attributes].filter(a=>/^on/i.test(a.name)||['href','xlink:href'].includes(a.name)||/url\s*\(/i.test(a.value)).map(a=>a.name)),panes:[...doc.querySelectorAll('[data-pane]')].map(el=>({id:el.getAttribute('data-pane'),x:Number(el.getAttribute('data-x')),y:Number(el.getAttribute('data-y'))})),gates:[...doc.querySelectorAll('[data-gate]')].map(el=>({id:el.getAttribute('data-gate'),passed:el.getAttribute('data-passed')==='true'})),wing:doc.querySelector('[data-wing]')?{distance:Number(doc.querySelector('[data-wing]').getAttribute('data-distance')),transform:doc.querySelector('[data-wing]').getAttribute('transform')}:null,cells:[...doc.querySelectorAll('[data-cell]')].map(el=>({id:el.getAttribute('data-cell'),on:el.getAttribute('data-on')==='true'})),beats:doc.querySelectorAll('[data-beat]').length};},bytes.toString('utf8'));
  }

  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  report.entry=await page.locator('script[type=module][src]').last().getAttribute('src');if(process.env.EXPECTED_JS)assert.equal(path.posix.basename(report.entry),path.posix.basename(process.env.EXPECTED_JS));
  const entryResponse=await page.request.get(new URL(report.entry,url).href);assert.ok(entryResponse.ok());report.entrySha256=hash(await entryResponse.body());
  await page.locator('#cover-fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement,null,{timeout:8000});assert.equal(await page.locator('#fullscreen').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#cover-fullscreen').getAttribute('aria-pressed'),'true');
  await page.locator('#fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement,null,{timeout:8000});assert.equal(await page.locator('#fullscreen').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('#cover-fullscreen').getAttribute('aria-pressed'),'false');
  await page.locator('#continue').click();await page.waitForFunction(()=>window.__SPRING__.snapshot().mode==='play');await page.waitForTimeout(1000);preserved((await snap()).state,'resume');
  await page.keyboard.press('Alt+Enter');await page.waitForFunction(()=>!!document.fullscreenElement,null,{timeout:8000});await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.fullscreenElement,null,{timeout:8000});assert.equal(await page.locator('#modal').evaluate(element=>element.open),false);
  mark('real cover/header fullscreen buttons synchronize and toggle the browser; Alt+Enter/Escape also leave no stray modal');

  await page.waitForTimeout(350);const canvasSize=await page.locator('#scene canvas').evaluate(canvas=>({width:canvas.width,height:canvas.height}));
  await page.locator('#photo').click();await page.locator('#postcard-preview').waitFor();await capture('postcard-preview');
  report.postcard=await png(await download('#postcard-download','postcard.png'),1440,1040);report.landscape=await png(await download('#photo-download','landscape.png'),canvasSize.width,canvasSize.height);
  preserved((await snap()).state,'photo exports');await page.locator('#close-modal').click();mark('real postcard and landscape PNG downloads decode at their actual dimensions and contain varied scene pixels');

  await page.locator('#journal').click();assert.equal(await page.locator('.moment-keepsake').count(),3);const svgHashes=[];report.artwork={};
  for(const id of ids){
   const bytes=await download('[data-save-artwork="'+id+'"]','artwork-'+id+'.svg'),data=await svgData(bytes),art=fixture.letters.entries[id].artwork;
   assert.equal(data.parserErrors,0);assert.equal(data.tag,'svg');assert.equal(data.namespace,'http://www.w3.org/2000/svg');assert.equal(data.viewBox,'0 0 720 300');assert.ok(data.title.includes(names[id]));assert.ok(data.desc.length>15);assert.ok(data.graphics>=20);assert.equal(data.unsafe,0);assert.deepEqual(data.unsafeAttributes,[]);
   if(id==='rain'){assert.deepEqual(data.panes.map(pane=>pane.id),['tree','window','bloom']);for(const pane of data.panes){assert.ok(Math.abs(pane.x-art.positions[pane.id].x)<=.00051);assert.ok(Math.abs(pane.y-art.positions[pane.id].y)<=.00051);}}
   if(id==='wind'){assert.deepEqual(data.gates.map(gate=>gate.id),['petal','lift','weave','shelter','harbour']);assert.deepEqual(data.gates.map(gate=>gate.passed),data.gates.map((_,i)=>i<art.gate));assert.ok(Math.abs(data.wing.distance-art.distance)<=.00051);assert.match(data.wing.transform,/translate\(/);assert.match(data.desc,/不表示完整飞行轨迹/);}
   if(id==='tide'){assert.equal(data.beats,8);assert.equal(data.cells.length,24);for(let voice=0;voice<3;voice++)for(let beat=0;beat<8;beat++)assert.equal(data.cells.find(cell=>cell.id===voice+':'+beat)?.on,art.notes[voice][beat]);assert.ok(data.cells.filter(cell=>cell.on).length>=3);}
   svgHashes.push(hash(bytes));report.artwork[id]=data;
  }
  assert.equal(new Set(svgHashes).size,3,'three activities export distinct personal artwork');await capture('artwork-book');preserved((await snap()).state,'artwork exports');await page.locator('#close-modal').click();mark('three actual SVG downloads contain the earned flower positions, passed wind gates/distance and all 24 score cells, without placeholder or external content');

  await page.locator('#settings').click();await page.locator('#playtest-feedback').click();for(const id of ['familiarity','interest','favorite','clarity'])assert.equal(await page.locator('#feedback-'+id).inputValue(),'');
  const choices=await page.locator('#feedback-favorite option').evaluateAll(options=>options.map(option=>option.value));for(const id of ['light-collage','paper-flight','sound-composition'])assert.ok(choices.includes(id));assert.ok(!choices.includes('leaf-channels'));
  await page.locator('#feedback-form button[type=submit]').click();assert.ok(await page.locator('#feedback-form-error').innerText());
  const syntheticNotes='自动化功能验证样本，不代表真实玩家反馈。<script>no execution</script>';
  await page.locator('#feedback-familiarity').selectOption('sometimes');await page.locator('#feedback-interest').selectOption('unsure');await page.locator('#feedback-favorite').selectOption('sound-composition');await page.locator('#feedback-clarity').selectOption('3');await page.locator('#feedback-notes').fill(syntheticNotes);await page.locator('#feedback-form button[type=submit]').click();
  assert.equal(await page.locator('#feedback-preview-notes').innerText(),syntheticNotes);assert.equal(await page.locator('#feedback-preview-notes script').count(),0);
  await page.locator('#feedback-back').click();assert.equal(await page.locator('#feedback-interest').inputValue(),'unsure');assert.equal(await page.locator('#feedback-notes').inputValue(),syntheticNotes);await page.locator('#feedback-form button[type=submit]').click();
  await page.locator('#feedback-preview-view details summary').click();await page.locator('#feedback-preview-json').waitFor({state:'visible'});
  const preview=JSON.parse(await page.locator('#feedback-preview-json').textContent()),record=JSON.parse((await download('#feedback-download','synthetic-feedback.json')).toString('utf8'));
  assert.deepEqual(record,preview);assert.equal(record.format,'spring-letter-playtest');assert.equal(record.schemaVersion,2);assert.equal(record.session.version,'0.7.1');assert.equal(record.session.ending,fixture.ending);assert.deepEqual(record.session.letters,ids);assert.equal(record.answers.favorite,'sound-composition');assert.equal(record.answers.continueInterest,'unsure');assert.equal(record.answers.notes,syntheticNotes);
  assert.deepEqual(Object.keys(record).sort(),['answers','format','schemaVersion','session']);assert.deepEqual(Object.keys(record.answers).sort(),['clarity','continueInterest','familiarity','favorite','notes']);assert.deepEqual(Object.keys(record.session).sort(),['chapter','ending','letters','playedSeconds','quality','version','viewport']);assert.deepEqual(Object.keys(record.session.viewport).sort(),['height','width']);
  await capture('feedback-preview');await page.locator('#feedback-preview-cancel').click();assert.equal(await page.locator('#modal').evaluate(element=>element.open),false);preserved((await snap()).state,'feedback export');
  mark('schema-2 feedback starts blank, validates required answers, escapes notes, permits editing and downloads only the explicitly previewed privacy allowlist');
  assert.deepEqual(report.outbound,[]);assert.deepEqual(report.mutatingRequests,[]);assert.deepEqual(report.errors,[]);assert.equal(hash(fs.readFileSync(fixturePath)),report.fixture.sha256);
  report.passed=true;report.finished=new Date().toISOString();write();console.log(JSON.stringify({passed:true,out,checks:report.checks.length}));
 }catch(error){report.failure=error.stack;if(page&&!page.isClosed()){await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});report.final=await page.evaluate(()=>window.__SPRING__?.snapshot()).catch(()=>null);if(report.final)delete report.final.frameTimes;}write();throw error;}
 finally{await context?.close().catch(()=>{});await browser?.close().catch(()=>{});}
})().catch(error=>{console.error(error);process.exitCode=1;});
