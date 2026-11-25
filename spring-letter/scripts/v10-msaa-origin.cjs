// Diagnostic only: request the live Vite source, restore reflection MSAA in the
// intercepted response, and inspect its current color samples without changing
// the production files. The parent agent owns execution of this GPU probe.
const {chromium}=require('playwright');
const {summarizeRgba,inspectCanvas,assessPixels}=require('./v10-pixel-validation.cjs');
const fs=require('node:fs');
const path=require('node:path');

const startFrame=Math.max(1,Number(process.env.PROBE_START_FRAME)||90);
const url=process.env.PROBE_URL||'http://127.0.0.1:5193/';
const out=path.resolve('evidence/v10/msaa-origin-'+Date.now());

function installMsaaProbe(renderer,reflection,getState,startFrame){
 const gl=renderer.getContext();
 const report=window.__MSAA_ORIGIN__={status:'waiting',startFrame,originFrame:getState().frame,checks:[],firstInvalid:null,errors:[],limits:[
  'Each draw is inspected through an independent color-only MSAA resolve. The main reflection attachments are never overwritten or invalidated.',
  'A bad value after a draw identifies the first observed draw/resolve boundary; it does not distinguish invalid shader sample values from a driver resolve defect.',
  'This examines one opening frame. A null firstInvalid is not evidence that every opening frame is finite.',
 ]};
 let probeFramebuffer=null,probeTexture=null,probeWidth=0,probeHeight=0,selectedFrame=null,drawIndex=0,finished=false;
 const originalDraw=renderer.renderBufferDirect.bind(renderer);
 const originalUpdate=reflection.update.bind(reflection);

 function drainErrors(phase){
  const found=[];for(let i=0;i<16;i++){const value=gl.getError();if(value===gl.NO_ERROR)break;found.push(value);}
  if(found.length)report.errors.push({phase,frame:getState().frame,draw:drawIndex,values:found});return found;
 }
 function restoreBindings(read,draw,scissor){
  gl.bindFramebuffer(gl.READ_FRAMEBUFFER,read);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,draw);
  if(scissor)gl.enable(gl.SCISSOR_TEST);else gl.disable(gl.SCISSOR_TEST);
 }
 function allocate(width,height){
  if(probeFramebuffer&&probeWidth===width&&probeHeight===height)return;
  const oldRead=gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),oldDraw=gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
  const oldTexture=gl.getParameter(gl.TEXTURE_BINDING_2D);
  try{
   if(probeFramebuffer)gl.deleteFramebuffer(probeFramebuffer);if(probeTexture)gl.deleteTexture(probeTexture);
   probeWidth=width;probeHeight=height;probeFramebuffer=gl.createFramebuffer();probeTexture=gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D,probeTexture);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.HALF_FLOAT,null);
   gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,probeFramebuffer);
   gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,probeTexture,0);
   const status=gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
   if(status!==gl.FRAMEBUFFER_COMPLETE)throw Error('Diagnostic RGBA16F framebuffer incomplete: '+status);
  }finally{
   gl.bindTexture(gl.TEXTURE_2D,oldTexture);
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,oldRead);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,oldDraw);
  }
 }
 function summarize(data,width,height){
  let invalidComponents=0,nanComponents=0,infiniteComponents=0,invalidPixels=0;const points=[];
  for(let i=0;i<data.length;i+=4){let bad=false;for(let c=0;c<4;c++)if((data[i+c]&0x7c00)===0x7c00){bad=true;invalidComponents++;if((data[i+c]&0x03ff)!==0)nanComponents++;else infiniteComponents++;}
   if(bad){invalidPixels++;if(points.length<12)points.push({x:(i/4)%width,y:Math.floor(i/4/width),rgbaBits:Array.from(data.slice(i,i+4))});}
  }
  return {width,height,invalidComponents,nanComponents,infiniteComponents,invalidPixels,points};
 }
 function captureCurrentSamples(target,phase){
  drainErrors(phase+':before');allocate(target.width,target.height);
  const oldRead=gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),oldDraw=gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING),oldScissor=gl.isEnabled(gl.SCISSOR_TEST);
  const actualSamples=gl.getParameter(gl.SAMPLES),properties=renderer.properties.get(target);
  const sourceIsMsaaFramebuffer=oldDraw===properties.__webglMultisampledFramebuffer;
  const sourceIsResolvedFramebuffer=oldDraw===properties.__webglFramebuffer;
  const data=new Uint16Array(target.width*target.height*4);let statistics;
  try{
   gl.disable(gl.SCISSOR_TEST);
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,oldDraw);
   gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,probeFramebuffer);
   // Same-sized rectangles and COLOR only: no scaling, depth resolve,
   // attachment modification, or invalidation of the original framebuffer.
   gl.blitFramebuffer(0,0,target.width,target.height,0,0,target.width,target.height,gl.COLOR_BUFFER_BIT,gl.NEAREST);
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,probeFramebuffer);
   gl.readPixels(0,0,target.width,target.height,gl.RGBA,gl.HALF_FLOAT,data);
   statistics=summarize(data,target.width,target.height);
  }finally{restoreBindings(oldRead,oldDraw,oldScissor);}
  return {...statistics,requestedSamples:target.samples,actualSamples,sourceIsMsaaFramebuffer,sourceIsResolvedFramebuffer,glErrors:drainErrors(phase+':after')};
 }
 function captureResolvedTexture(target){
  const oldRead=gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),oldDraw=gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING),oldScissor=gl.isEnabled(gl.SCISSOR_TEST);
  const data=new Uint16Array(target.width*target.height*4);
  try{
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,renderer.properties.get(target).__webglFramebuffer);
   gl.readPixels(0,0,target.width,target.height,gl.RGBA,gl.HALF_FLOAT,data);
  }finally{restoreBindings(oldRead,oldDraw,oldScissor);}
  return {...summarize(data,target.width,target.height),glErrors:drainErrors('resolved-end')};
 }
 function drawInfo(args){
  const material=args[3],object=args[4],geometry=args[2];
  return {frame:getState().frame,draw:drawIndex,object:object.name,objectId:object.id,parent:object.parent?.name,
   material:material.name,materialId:material.id,type:material.type,transparent:material.transparent,opacity:material.opacity,
   side:material.side,color:material.color?.toArray(),roughness:material.roughness,metalness:material.metalness,
   transmission:material.transmission,vertexCount:geometry.attributes.position?.count,indexCount:geometry.index?.count};
 }
 function shaders(){
  const program=gl.getParameter(gl.CURRENT_PROGRAM);return program?gl.getAttachedShaders(program).map(shader=>({type:gl.getShaderParameter(shader,gl.SHADER_TYPE),source:gl.getShaderSource(shader)})):[];
 }
 function fail(error){report.probeError=String(error.stack||error);report.status='probe-error';finished=true;}
 renderer.renderBufferDirect=(...args)=>{
  const state=getState(),target=reflection.auditTarget;
  const eligible=!finished&&state.mode==='opening'&&state.frame===selectedFrame&&renderer.getRenderTarget()===target;
  if(eligible&&!report.beforeFirstDraw){
   try{report.beforeFirstDraw=captureCurrentSamples(target,'before-first-draw');
    if(report.beforeFirstDraw.invalidComponents)report.firstInvalid={phase:'before-first-draw',...report.beforeFirstDraw,object:null,reason:'Invalid samples existed before the first inspected scene draw; no object attribution is justified.'};
   }catch(error){fail(error);}
  }
  originalDraw(...args);
  if(!eligible||finished||report.firstInvalid)return;
  drawIndex++;
  try{
   const info=drawInfo(args),drawErrors=drainErrors('after-draw'),sample=captureCurrentSamples(target,'after-draw-resolve');
   report.checks.push({...info,invalidComponents:sample.invalidComponents,invalidPixels:sample.invalidPixels,drawErrors,probeErrors:sample.glErrors});
   if(sample.invalidComponents){report.firstInvalid={phase:'after-draw-color-resolve',...info,...sample,drawErrors,shaders:shaders()};}
  }catch(error){fail(error);}
 };
 reflection.update=(...args)=>{
  const state=getState();
  if(!finished&&selectedFrame===null&&state.mode==='opening'&&state.frame-report.originFrame>=startFrame){
   selectedFrame=state.frame;report.frame=selectedFrame;report.status='sampling';report.opening=state.opening;
  }
  try{return originalUpdate(...args);}
  finally{
   if(getState().frame===selectedFrame){
    try{if(!report.probeError){report.resolvedEnd=captureResolvedTexture(reflection.auditTarget);report.status=report.checks.length||report.beforeFirstDraw?'complete':'no-mirror-draw';}}
    catch(error){fail(error);}
    finished=true;renderer.renderBufferDirect=originalDraw;reflection.update=originalUpdate;
    if(probeFramebuffer)gl.deleteFramebuffer(probeFramebuffer);if(probeTexture)gl.deleteTexture(probeTexture);
   }
  }
 };
 const debug=gl.getExtension('WEBGL_debug_renderer_info');
 report.device={vendor:debug?gl.getParameter(debug.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),version:gl.getParameter(gl.VERSION),maxSamples:gl.getParameter(gl.MAX_SAMPLES)};
}

async function main(){
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const consoleMessages=[],pageErrors=[],routeChanges=[];
 try{
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  await page.addInitScript('window.__V10_RGBA_STATS__='+summarizeRgba.toString()+';window.__V10_READ_PIXELS__='+inspectCanvas.toString());
  if(process.env.UNCLAMP_VEIL==='1')await page.route('**/src/moment-tide.js*',async route=>{const response=await route.fetch(),before=await response.text();const after=before.replace('pow(clamp(p.y,0.0,1.0),.7)','pow(p.y,.7)');if(after===before)throw Error('Veil regression anchor absent');routeChanges.push({module:'moment-tide.js',change:'Deliberately restore unbounded fractional pow for negative control'});await route.fulfill({response,body:after});});
  if(process.env.DISABLE_REFLECTION_GUARD==='1')await page.route('**/src/world.js*',async route=>{const response=await route.fetch(),before=await response.text();const after=before.replace('if(!any(equal(exponent,uvec3(0x7f800000u))))','if(true)');if(after===before)throw Error('Guard anchor absent');routeChanges.push({module:'world.js',change:'Deliberately disable invalid reflection guard for negative control'});await route.fulfill({response,body:after});});
  page.on('console',m=>{if(m.type()==='warning'||m.type()==='error')consoleMessages.push({type:m.type(),text:m.text()});});
  page.on('pageerror',e=>pageErrors.push(String(e)));
  if(process.env.CLAMP_VEIL==='1')await page.route('**/src/moment-tide.js*',async route=>{const response=await route.fetch(),before=await response.text();const after=before.replace('pow(p.y,.7)','pow(clamp(p.y,0.,1.),.7)');if(after===before)throw Error('Veil clamp anchor absent');routeChanges.push({module:'moment-tide.js',change:'Clamp only the veil pow base to [0,1]'});await route.fulfill({response,body:after});});
  await page.route('**/src/water-reflection.js*',async route=>{
   const response=await route.fetch(),before=await response.text();
   if(!/multisample\s*:\s*[02]/.test(before)||!before.includes('return {update,'))throw Error('Reflection instrumentation anchors changed; refusing an unverified probe.');
   const after=before.replace(/multisample\s*:\s*[02]/,'multisample:2').replace('return {update,','return {auditTarget:mirror.getRenderTarget(),update,');
   routeChanges.push({module:'water-reflection.js',change:'Ensure original MSAA 2; add read-only target reference'});
   await route.fulfill({response,body:after});
  });
  await page.route('**/src/main.js*',async route=>{
   const response=await route.fetch(),before=await response.text(),anchor='window.__SPRING__={';
   if(!before.includes(anchor))throw Error('Main instrumentation anchor changed.');
   const hook='('+installMsaaProbe.toString()+')(renderer,waterReflection,()=>({mode,frame:frameNumber,opening:storyDirector.opening?.index}),'+startFrame+');\n';
   await route.fulfill({response,body:before.replace(anchor,hook+anchor)});
  });
  await page.goto(url);
  await page.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});
  await page.locator('#loading').waitFor({state:'hidden',timeout:120000});
  await page.locator('#begin').click();
  await page.waitForFunction(()=>['complete','probe-error','no-mirror-draw'].includes(window.__MSAA_ORIGIN__?.status),null,{timeout:120000});
  const probe=await page.evaluate(()=>window.__MSAA_ORIGIN__);
  await page.waitForTimeout(100);const pixels=await page.evaluate(()=>window.__V10_READ_PIXELS__());const pixelCheck=assessPixels(pixels);
  const report={url,routeChanges,probe,pixels,pixelCheck,consoleMessages,pageErrors};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
  await page.screenshot({path:path.join(out,'screen-after-probe.png')});
  console.log(JSON.stringify({out,status:probe.status,draws:probe.checks.length,first:probe.firstInvalid?{phase:probe.firstInvalid.phase,object:probe.firstInvalid.object,material:probe.firstInvalid.material,type:probe.firstInvalid.type,count:probe.firstInvalid.invalidComponents,actualSamples:probe.firstInvalid.actualSamples}:null,resolvedEnd:probe.resolvedEnd?.invalidComponents,glErrors:probe.errors,pageErrors,pixelCheck}));
 }catch(error){fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({error:String(error.stack||error),consoleMessages,pageErrors,routeChanges},null,2));throw error;}
 finally{await browser.close();}
}

if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
