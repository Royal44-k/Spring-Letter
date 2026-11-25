const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const evidence=path.resolve(__dirname,'../evidence'),report={scope:'Independent AO shadow-pass comparison, ordinary controls, fresh contexts on one shared GPU. No final release claim or cleared driver-cache claim.',runs:[]},file=path.join(evidence,'v6-ao-benchmark.json');
const write=()=>fs.writeFileSync(file,JSON.stringify(report,null,2));
(async()=>{
 for(const [label,url] of [['f-original','http://127.0.0.1:5194'],['ao-fixed','http://127.0.0.1:5195'],['ao-fixed-repeat','http://127.0.0.1:5195']]){
  const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
  const row={label,url,phases:[],errors:[]};report.runs.push(row);const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());page.on('pageerror',e=>row.errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')row.errors.push(m.text());});
  try{
   await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await page.waitForSelector('#loading',{state:'hidden'});row.build=await page.locator('script[type=module]').getAttribute('src');row.loading=(await snap()).loadingTiming;
   await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.locator('#home').click();await page.locator('#gallery').click();
   for(const [form,material] of [['lily','silver'],['lotus','amber'],['dahlia','crystal'],['roam',null]]){
    if(form==='roam'){await page.locator('#home').click();await page.locator('#continue').click();}else{await page.locator(`[data-form=${form}]`).click();await page.locator(`[data-material=${material}]`).click();}
    await page.waitForTimeout(2500);const before=await snap();await page.waitForTimeout(7000);const after=await snap(),count=after.frameNumber-before.frameNumber,values=count>0?after.frameTimes.slice(-Math.min(count,after.frameTimes.length)):[],sorted=values.slice().sort((a,b)=>a-b);
    const metrics={form,material,frames:count,averageMs:values.reduce((a,b)=>a+b,0)/values.length,p95Ms:sorted[Math.floor(sorted.length*.95)],maxMs:Math.max(...values),memory:after.memory,renderer:after.renderer};row.phases.push(metrics);write();
    await page.screenshot({path:path.join(evidence,`v6-ao-${label}-${form}.png`)});console.log(JSON.stringify({label,...metrics}));
   }
  }catch(error){row.failure=error.stack;write();throw error;}finally{await context.close();await browser.close();}
 }
 write();
})().catch(e=>{console.error(e);process.exitCode=1;});
