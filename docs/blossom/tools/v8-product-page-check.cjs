/* Run only when the root agent grants the isolated browser slot. No game state is opened. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('D:/AI Game/node_modules/playwright');
const root=path.resolve(__dirname,'../../..');
const out=path.join(root,'docs/blossom/media/v8','product-check-'+new Date().toISOString().replace(/[:.]/g,'-'));
const report={scope:'Read-only static product-page review in an isolated Edge profile; not game QA, not human visual review. Actual pointer clicks start both native audio players. Download packages are checked with HEAD, not executed.',checks:[],views:[],errors:[],requests:[],captures:[]};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.mp3':'audio/mpeg','.md':'text/plain; charset=utf-8','.zip':'application/zip'};
let browser,server;
function ok(condition,message){if(!condition)throw new Error(message);report.checks.push(message);}
function staticServer(){return http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  const requestPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(root,'.'+requestPath);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  const size=fs.statSync(file).size,headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  let start=0,end=size-1,status=200;
  if(req.headers.range){const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!range){res.writeHead(416,{'Content-Range':'bytes */'+size});return res.end();}start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),size-1):size-1;if(start>end||start>=size){res.writeHead(416,{'Content-Range':'bytes */'+size});return res.end();}headers['Content-Range']=`bytes ${start}-${end}/${size}`;status=206;}
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD')return res.end();fs.createReadStream(file,{start,end}).pipe(res);
 }catch(error){res.writeHead(500);res.end();report.errors.push('server: '+error.message);}
 });}
async function nativeAudio(page,locator,label){
 await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();ok(!!box&&box.width>150&&box.height>30,label+' native controls are visible');
 await locator.click({position:{x:20,y:Math.min(27,box.height/2)}});
 await page.waitForFunction(element=>element.currentTime>.25&&!element.paused,await locator.elementHandle(),{timeout:12000});
 const start=await locator.evaluate(element=>({time:element.currentTime,duration:element.duration,readyState:element.readyState,paused:element.paused}));
 await page.waitForTimeout(700);const end=await locator.evaluate(element=>element.currentTime);ok(end>start.time+.2,label+' time advances after a real control click');
 await locator.click({position:{x:20,y:Math.min(27,box.height/2)}});await page.waitForFunction(element=>element.paused,await locator.elementHandle(),{timeout:3000});
 return {...start,advancedTo:end};
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});server=staticServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port,url=origin+'/docs/blossom/index.html';report.url=url;
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',args:['--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--autoplay-policy=user-gesture-required']});
 for(const [name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'}),page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(name+': '+error.message));page.on('requestfailed',request=>{if(request.failure()?.errorText!=='net::ERR_ABORTED')report.errors.push(name+': '+request.url()+' '+request.failure()?.errorText);});
  page.on('response',response=>{if(response.status()>=400&& !response.url().endsWith('favicon.ico'))report.errors.push(name+': HTTP '+response.status()+' '+response.url());});
  await page.goto(url,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  // Scroll lazy images into view through ordinary page movement, then return.
  for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await page.waitForFunction(el=>el.complete&&el.naturalWidth>0,await image.elementHandle());}
  // The document uses smooth anchor scrolling. Do not race that animation with
  // screenshot capture or mistake the #main anchor for the actual page top.
  await page.evaluate(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
  await page.waitForFunction(()=>scrollY===0);await page.waitForTimeout(200);
  ok(await page.evaluate(()=>scrollY===0),name+' first fold starts at exact scrollY zero');
  const view=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollY,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,images:[...document.images].map(img=>({src:img.currentSrc,width:img.naturalWidth,height:img.naturalHeight,complete:img.complete}))}));
  ok(view.scrollWidth<=width+1&&view.bodyWidth<=width+1,name+' has no horizontal overflow');ok(view.images.every(img=>img.complete&&img.width>0),name+' all local images decode');
  for(const type of ['first-fold','full-page']){const file=path.join(out,name+'-'+type+'.png');await page.screenshot({path:file,fullPage:type==='full-page'});report.captures.push(path.relative(root,file).replaceAll('\\','/'));}
  view.audio=[];view.audio.push(await nativeAudio(page,page.locator('.soundtrack audio'),name+' D audio'));
  const records=page.locator('#records');await records.scrollIntoViewIfNeeded();for(const detail of await records.locator('details').all()){await detail.locator('summary').click();ok(await detail.evaluate(element=>element.open),name+' archive section opens');}
  view.audio.push(await nativeAudio(page,page.locator('.archive-audio audio'),name+' archive audio'));
  const packages=await page.locator('a[href$="spring-letter-0.6.0-windows.zip"],a[href$="spring-letter-0.6.0-browser.zip"]').evaluateAll(links=>links.map(link=>({href:link.href,text:link.textContent})));
  ok(packages.length===2,name+' final Windows and browser links exist');view.packages=[];
  for(const item of packages){const response=await page.request.head(item.href);const bytes=Number(response.headers()['content-length']);ok(response.status()===200&&bytes>1000,name+' package is present: '+item.text.trim());view.packages.push({...item,status:response.status(),bytes});}
  await page.locator('.nav a[href="#gardens"]').click();await page.waitForTimeout(450);ok(await page.evaluate(()=>location.hash==='#gardens'),name+' garden anchor navigation works');
  const expanded=await page.evaluate(()=>document.documentElement.scrollWidth);ok(expanded<=width+1,name+' expanded archive has no horizontal overflow');
  report.views.push({name,...view});await context.close();
 }
 ok(report.errors.length===0,'no local page or resource errors');report.passed=true;
})().catch(error=>{report.passed=false;report.errors.push(error.stack||String(error));process.exitCode=1;}).finally(async()=>{
 if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
 report.finished=new Date().toISOString();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,errors:report.errors,out}));
});
