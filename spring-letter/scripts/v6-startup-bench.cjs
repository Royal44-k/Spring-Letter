// Isolated instrumented copy, not a release verification report.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const rows=[],file=path.resolve(__dirname,'../evidence/'+(process.env.SPRING_BENCH_REPORT||'v6-startup-experiment.json')),url=process.env.SPRING_BENCH_URL||'http://127.0.0.1:5195/';
(async()=>{
 for(const initialOnly of (process.env.SPRING_BENCH_FULL_ONLY?[false,false]:[false,true,true,false])){
  const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  try{
   await page.goto(url+(initialOnly?'?initialOnly':''));await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await page.waitForSelector('#loading',{state:'hidden'});
   const row=await page.evaluate(()=>({loading:window.__SPRING__.snapshot().loadingTiming,trace:window.__WARMUP_TRACE__,memory:window.__SPRING__.snapshot().memory}));
   row.initialOnly=initialOnly;row.url=url;row.entry=await page.locator('script[type=module]').getAttribute('src');row.errors=errors;rows.push(row);fs.writeFileSync(file,JSON.stringify({scope:'Instrumented independent source copy; fresh contexts on same driver, no cleared OS shader cache. Not final candidate evidence.',rows},null,2));
   await page.locator('#gallery').click();await page.waitForTimeout(800);let before=await page.evaluate(()=>window.__SPRING__.snapshot());await page.keyboard.press('KeyF');await page.waitForFunction(()=>window.__SPRING__.snapshot().flowerCycle.phase==='solid'&&window.__SPRING__.snapshot().flowerCycle.cycles===1,null,{timeout:25000});
   let after=await page.evaluate(()=>window.__SPRING__.snapshot());row.firstCycleMaxMs=Math.max(...after.frameTimes.slice(-(after.frameNumber-before.frameNumber)));
   before=after;await page.locator('[data-material=crystal]').click();await page.waitForTimeout(1800);after=await page.evaluate(()=>window.__SPRING__.snapshot());row.firstCrystalMaxMs=Math.max(...after.frameTimes.slice(-(after.frameNumber-before.frameNumber)));
   fs.writeFileSync(file,JSON.stringify({scope:'Instrumented independent source copy; fresh contexts on same driver, no cleared OS shader cache. Not final candidate evidence.',rows},null,2));console.log(JSON.stringify(row));
  }finally{await context.close();await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
