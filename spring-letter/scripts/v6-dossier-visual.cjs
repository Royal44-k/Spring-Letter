// Run only AFTER the final dossier has been generated and the game GPU checks end.
// Own headless browser and ephemeral localhost server; never attach to user tabs.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const {boundReport,sha256,within}=require('./v6-release-evidence.cjs');
const root=path.resolve(__dirname,'..'),workspace=path.dirname(root),docs=path.join(workspace,'docs/blossom'),evidence=path.join(root,'evidence');
const reportPath=path.join(evidence,'v6-dossier-visual.json');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webm':'video/webm','.woff2':'font/woff2','.ico':'image/x-icon'};

function staticServer(serverErrors){
 return http.createServer((request,response)=>{
  try{
   if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return;}
   const url=new URL(request.url,'http://127.0.0.1'),decoded=decodeURIComponent(url.pathname);
   if(decoded==='/favicon.ico'){response.writeHead(204);response.end();return;}
   const file=within(workspace,'.'+decoded),stat=fs.statSync(file);
   if(!stat.isFile())throw Error('Not a file');
   let start=0,end=stat.size-1,status=200;
   if(request.headers.range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
    if(!match||(!match[1]&&!match[2])){response.writeHead(416,{'Content-Range':`bytes */${stat.size}`});response.end();return;}
    if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),end);}
    else start=Math.max(0,stat.size-Number(match[2]));
    if(start>end||start<0||start>=stat.size){response.writeHead(416,{'Content-Range':`bytes */${stat.size}`});response.end();return;}
    status=206;
   }
   const headers={'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-store'};
   if(status===206)headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
   response.writeHead(status,headers);
   if(request.method==='HEAD'){response.end();return;}
   const stream=fs.createReadStream(file,{start,end});response.on('close',()=>stream.destroy());stream.on('error',error=>{serverErrors.push(error.message);response.destroy();});stream.pipe(response);
  }catch(error){serverErrors.push({url:request.url,error:error.message});response.writeHead(404);response.end('Not found');}
 });
}

async function run(){
 const report={date:new Date().toISOString(),passed:false,checks:[],pages:[],captures:[],errors:[],serverErrors:[],
  scope:'Dedicated headless Edge; localhost serves the final document files read-only. Desktop 1440×900 and narrow 390×844 document layout, not the game or a physical phone. Screenshots require human art review; no claim of cinematic quality. Images are eagerly requested for completeness, so this is not a loading-performance test.'};
 const save=()=>fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 let browser,server,context,page;
 try{
  const manifestPath=path.join(evidence,'release-manifest-v6.json'),manifest=read(manifestPath);
  const media=boundReport(root,manifest,'v6-media-decoding.json'),record=boundReport(root,manifest,'v6-recording-verification.json');
  assert.equal(media.passed,true);assert.equal(record.success,true);assert.equal(media.file,record.file);assert.equal(media.sha256,manifest.recording.sha256);
  const videoPath=within(evidence,media.file);assert.equal(fs.statSync(videoPath).size,media.bytes);assert.equal(sha256(fs.readFileSync(videoPath)),media.sha256);
  report.build=manifest.build;report.styleBuild=manifest.styleBuild;report.releaseManifestSha256=sha256(fs.readFileSync(manifestPath));
  const pages=['index.html','README.html','v6-release-verification.html'];
  report.documentFiles=[...pages,'dossier.css'].map(file=>({file,sha256:sha256(fs.readFileSync(path.join(docs,file)))}));
  assert.ok(fs.readFileSync(path.join(docs,'index.html'),'utf8').includes('id="release"'),'Final release section is not generated');
  assert.ok(fs.readFileSync(path.join(docs,'README.html'),'utf8').includes('v6 / 0.4.0'),'README HTML still belongs to an older dossier');
  const qaHtml=fs.readFileSync(path.join(docs,'v6-release-verification.html'),'utf8');assert.ok(qaHtml.includes(manifest.build)&&qaHtml.includes(manifest.styleBuild),'QA HTML belongs to another build');
  const python=process.env.SPRING_PYTHON||'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1116-1210-0_26.1116.1210.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe';
  const links=spawnSync(python,[path.join(docs,'tools/check_v6_links.py')],{cwd:workspace,encoding:'utf8',windowsHide:true,timeout:30000,env:{...process.env,PYTHONIOENCODING:'utf-8'}});
  assert.equal(links.status,0,'Local link verification failed: '+(links.stderr||links.stdout||links.error));
  report.localLinks=read(path.join(docs,'v6-local-link-verification.json'));assert.equal(report.localLinks.passed,true);
  report.checks.push('fresh check_v6_links.py accepts all generated local href/src/poster targets');
  server=staticServer(report.serverErrors);await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin=`http://127.0.0.1:${server.address().port}`;report.server={origin,owned:true};
  browser=await chromium.launch({executablePath:process.env.SPRING_EDGE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
   await context.route('**/*',route=>{const url=route.request().url();if(url.startsWith(origin+'/'))return route.continue();report.errors.push('Unexpected external resource: '+url);return route.abort();});
   page=await context.newPage();page.on('pageerror',error=>report.errors.push(error.stack||String(error)));page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
   for(const file of pages){
    await page.goto(`${origin}/docs/blossom/${file}`,{waitUntil:'load',timeout:30000});
    await page.evaluate(async()=>{
     await document.fonts.ready;
     await Promise.all([...document.images].map(image=>new Promise((resolve,reject)=>{
      image.loading='eager';
      if(image.complete){image.naturalWidth?resolve():reject(Error('Broken image: '+image.src));return;}
      const timer=setTimeout(()=>reject(Error('Image timeout: '+image.src)),15000);
      image.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});image.addEventListener('error',()=>{clearTimeout(timer);reject(Error('Broken image: '+image.src));},{once:true});
     })));
    });
    const result=await page.evaluate(()=>({title:document.title,viewport:innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),height:document.documentElement.scrollHeight,images:[...document.images].map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight})),overflow:[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,id:e.id,className:typeof e.className==='string'?e.className:'',rect:e.getBoundingClientRect()})).filter(e=>e.rect.width>0&&(e.rect.left<-.5||e.rect.right>innerWidth+.5)).slice(0,20).map(e=>({...e,rect:{left:e.rect.left,right:e.rect.right,width:e.rect.width}}))}));
    report.pages.push({file,viewport,...result});save();
    assert.ok(result.scrollWidth<=viewport.width+1,`${file} at ${viewport.width}px has document horizontal overflow: ${result.scrollWidth}`);
    assert.ok(result.images.every(i=>i.naturalWidth>0&&i.naturalHeight>0),`${file}: broken image`);
    report.checks.push(`${file} ${viewport.width}×${viewport.height}: no document horizontal overflow; ${result.images.length} images decoded`);
    const capture=async suffix=>{const name=`v6-dossier-${viewport.width}-${suffix}.png`;await page.screenshot({path:path.join(evidence,name),fullPage:false});report.captures.push(name);};
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await capture(file==='index.html'?'home':file==='README.html'?'readme':'qa');
    if(file==='index.html'){
     await page.locator('[data-state=drift]').click();await page.waitForFunction(()=>!document.getElementById('state-drift').hidden);await page.locator('[data-state=solid]').click();
     const video=page.locator('#release video');assert.equal(await video.count(),1);
     const source=await video.locator('source').getAttribute('src');assert.equal(new URL(source,page.url()).href,`${origin}/spring-letter/evidence/${media.file}`,'Overview video points at another file');
     const metadata=await video.evaluate(element=>new Promise((resolve,reject)=>{
      const done=()=>resolve({width:element.videoWidth,height:element.videoHeight,duration:element.duration,readyState:element.readyState,currentSrc:element.currentSrc});
      if(element.readyState>=1){done();return;}
      const timer=setTimeout(()=>reject(Error('Video metadata timeout')),30000);
      element.addEventListener('loadedmetadata',()=>{clearTimeout(timer);done();},{once:true});element.addEventListener('error',()=>{clearTimeout(timer);reject(Error('Video error: '+element.error?.message));},{once:true});element.preload='metadata';element.load();
     }));
     report.pages.at(-1).video={source,...metadata,decodedFile:media.file,decodedSha256:media.sha256,decodedLastTimestampSeconds:media.lastTimestampSeconds};save();
     assert.deepEqual([metadata.width,metadata.height],media.dimensions,'Browser video dimensions differ from decoded file');
     assert.ok(Number.isFinite(metadata.duration)&&metadata.duration>0,'Browser must expose a finite playable recording duration');
     assert.ok(Math.abs(metadata.duration-media.lastTimestampSeconds)<1,'Browser duration differs from decoded timestamp range');
     assert.equal(metadata.currentSrc,`${origin}/spring-letter/evidence/${media.file}`);
     report.checks.push(`${viewport.width}px: release video source, file SHA, dimensions and browser duration match the decoded recording`);
     // Metadata alone can leave a spinner visible. Exercise the actual decoder
     // and range server before taking a readable preview of the flower scene.
     const seekTo=Math.min(90,metadata.duration/2);
     await video.evaluate(async(element,time)=>{element.muted=true;element.preload='auto';element.currentTime=time;await element.play();},seekTo);
     await page.waitForFunction(time=>{const v=document.querySelector('#release video');return v.readyState>=2&&v.currentTime>time+.25;},seekTo,{timeout:30000});
     const playback=await video.evaluate(element=>{element.pause();return {currentTime:element.currentTime,readyState:element.readyState,paused:element.paused,error:element.error?.message||null};});
     assert.equal(playback.error,null);assert.equal(playback.paused,true);report.pages.at(-1).video.playback=playback;
     report.checks.push(`${viewport.width}px: recording actually seeks and advances in the browser before pausing for the preview`);
     await page.locator('#release').evaluate(element=>window.scrollTo({top:element.getBoundingClientRect().top+scrollY-12,behavior:'instant'}));await capture('release');
    }
   }
   await context.close();context=null;page=null;
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.serverErrors,[]);
  for(const item of report.documentFiles)assert.equal(sha256(fs.readFileSync(path.join(docs,item.file))),item.sha256,'Document changed during browser review');
  assert.equal(sha256(fs.readFileSync(manifestPath)),report.releaseManifestSha256,'Release manifest changed during browser review');
  report.passed=true;
 }catch(error){
  report.failure=error.stack||String(error);
  if(page)try{const file='v6-dossier-failure.png';await page.screenshot({path:path.join(evidence,file),fullPage:false});report.captures.push(file);}catch{}
  throw error;
 }finally{
  if(context)await context.close().catch(()=>{});
  if(browser)await browser.close().catch(()=>{});
  if(server){server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve));if(report.server)report.server.closed=true;}
  report.completedAt=new Date().toISOString();save();
 }
 console.log(JSON.stringify({passed:report.passed,pages:report.pages.length,captures:report.captures,report:reportPath}));
}
if(require.main===module)run().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={staticServer};
