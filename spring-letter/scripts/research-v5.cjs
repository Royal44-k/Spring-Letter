// Read-only inspection of public creative references. No account or paid service.
const {chromium}=require('playwright');const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const references=[['water-keeps','https://what-the-water-keeps.vercel.app/'],['starry-nightrider','https://starrynightrider.com/'],['bruno','https://bruno-simon.com/']];
 const dir=path.resolve(__dirname,'../../docs/blossom/research-v5-screens');fs.mkdirSync(dir,{recursive:true});const results=[];
 try{for(const [id,url]of references){const page=await browser.newPage({viewport:{width:1440,height:900}});try{const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});await page.waitForTimeout(5000);const item={id,url,status:response?.status(),title:await page.title(),body:(await page.locator('body').innerText()).slice(0,7000),buttons:await page.locator('button').allTextContents(),captured:new Date().toISOString()};await page.screenshot({path:path.join(dir,id+'.png')});results.push(item);console.log(JSON.stringify(item));}catch(error){results.push({id,url,error:error.message});console.log(id+': '+error.message);}finally{await page.close();}}}finally{await browser.close();fs.writeFileSync(path.join(dir,'observations.json'),JSON.stringify(results,null,2));}
})().catch(e=>{console.error(e);process.exit(1);});
