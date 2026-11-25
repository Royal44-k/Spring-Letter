const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.goto(process.env.SPRING_URL||'http://127.0.0.1:5192');await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden'});await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.keyboard.press('KeyE');await page.waitForTimeout(1600);
  await page.evaluate(()=>{window.__BRUSH_TRACE__=[];window.__BRUSH_TRACING__=true;function read(t){if(!window.__BRUSH_TRACING__)return;const s=window.__SPRING__.snapshot();window.__BRUSH_TRACE__.push({t,active:s.gesture.active,speed:Math.hypot(...s.gesture.velocity),motionEnergy:s.gesture.motionEnergy??null,scatter:s.scatter,ink:document.body.classList.contains('ink-scene')});requestAnimationFrame(read);}requestAnimationFrame(read);});
  await page.mouse.move(560,400);await page.keyboard.down('Space');await page.mouse.down();
  for(let n=0;n<26;n++){await page.mouse.move(n%2?850:560,400,{steps:2});await page.waitForTimeout(25);}
  await page.mouse.up();await page.keyboard.up('Space');await page.waitForTimeout(1200);
  const trace=await page.evaluate(()=>{window.__BRUSH_TRACING__=false;return window.__BRUSH_TRACE__;});
  const active=trace.filter(t=>t.active),result={date:new Date().toISOString(),build:await page.locator('script[type=module]').getAttribute('src'),trace,summary:{activeFrames:active.length,zeroVelocityFrames:active.filter(t=>t.speed<.01).length,fastFrames:active.filter(t=>t.speed>5.5).length,peakScatter:Math.max(...trace.map(t=>t.scatter)),inkFrames:active.filter(t=>t.ink).length},scope:'Ordinary real pointer moves, sampled once per RAF using read-only snapshots. No state setters or generated measurements.'};
  fs.writeFileSync(path.resolve(__dirname,'../evidence',process.env.SPRING_BRUSH_REPORT||'v5-brush-trace-before.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result.summary));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
