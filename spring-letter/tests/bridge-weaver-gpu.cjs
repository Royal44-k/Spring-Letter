const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:800}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto((process.env.SPRING_URL||'http://127.0.0.1:5194')+'/tests/bridge-weaver-gpu.html');await page.waitForFunction(()=>window.bridgeHarness);
  await page.screenshot({path:path.resolve(__dirname,'../evidence/v5-weaver-idle.png')});
  await page.evaluate(()=>{const h=window.bridgeHarness;for(const position of h.routes[0].anchors.slice(0,4))h.draw({active:true,position});});
  await page.screenshot({path:path.resolve(__dirname,'../evidence/v5-weaver-drawing.png')});
  const result=await page.evaluate(()=>{const h=window.bridgeHarness;for(const position of h.routes[0].anchors.slice(4))h.draw({active:true,position});const ready=h.weaver.context;const signals=h.draw({active:false,released:true});for(const signal of signals)h.setStructure(h.state,signal.shape);h.draw();return{ready,signals,after:h.weaver.context,structure:h.state.bridge.structure,renderObjects:h.weaver.group.children.length};});
  await page.screenshot({path:path.resolve(__dirname,'../evidence/v5-weaver-complete.png')});
  assert.equal(result.ready.status,'ready');assert.deepEqual(result.signals,[{type:'construct',shape:'bridge_am'}]);assert.equal(result.structure,'bridge_am');assert.equal(result.renderObjects,4);assert.deepEqual(errors,[]);
  fs.writeFileSync(path.resolve(__dirname,'../evidence/v5-weaver-gpu-verification.json'),JSON.stringify({date:new Date().toISOString(),result,errors},null,2));
  console.log(JSON.stringify({status:result.after.status,signals:result.signals,renderObjects:result.renderObjects,errors}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
