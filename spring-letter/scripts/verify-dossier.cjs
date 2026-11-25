// Review the delivered local HTML in Chromium; no game tab is started.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const directory=path.resolve(__dirname,'../evidence'),dossier=path.resolve(__dirname,'../../docs/blossom');
 const errors=[],checks=[],views=[];
 try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const page=await browser.newPage({viewport});page.on('pageerror',error=>errors.push(error.stack));
   await page.goto(pathToFileURL(path.join(dossier,'index.html')).href);
   const pictures=page.locator('img');
   for(let index=0;index<await pictures.count();index++){
    const picture=pictures.nth(index);await picture.scrollIntoViewIfNeeded();
    await picture.evaluate(image=>image.decode());
    assert.ok(await picture.evaluate(image=>image.naturalWidth>0));
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   const video=page.locator('video');await video.scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
   const media=await video.evaluate(video=>({duration:video.duration,width:video.videoWidth,height:video.videoHeight}));
   assert.ok(media.duration>150&&media.width===1280&&media.height===720);
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(directory,`v5-dossier-${viewport.width}.png`)});
   views.push({viewport,images:await pictures.count(),media});
   checks.push(`${viewport.width}px local dossier images decode, video metadata loads, and page does not overflow`);
   await page.close();
  }
  assert.deepEqual(errors,[]);
  const result={date:new Date().toISOString(),checks,views,errors,scope:'Local file HTML, actual image decoding and embedded uncut-video metadata. Desktop and narrow viewport layout; no external research links fetched or gameplay run.'};
  fs.writeFileSync(path.join(directory,'v5-dossier-browser.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
