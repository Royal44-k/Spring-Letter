/**
 * Install immediately after creating the renderer, before loading HDRs or
 * allocating offscreen effects. Restoration alone does not reconstruct our
 * generated PMREM/simulation textures: keep the app stopped until the user
 * explicitly reopens it. This module never reloads or writes to storage itself.
 */
export function bindRenderLifecycle({canvas,onPause,onSave,onFailure,onRestored}){
 let phase='ready',contextLost=false,needsReload=false,lossCount=0,statusMessage='',saveAttempted=false,saveSucceeded=null;
 const callbackErrors=[];
 const snapshot=()=>({phase,blocked:phase!=='ready',contextLost,needsReload,lossCount,statusMessage,saveAttempted,saveSucceeded,callbackErrors:callbackErrors.map(error=>({...error}))});
 function call(name,callback){
  if(typeof callback!=='function')return;
  try{return callback(snapshot());}
  catch(error){callbackErrors.push({callback:name,message:String(error?.message??error).slice(0,240)});return {ok:false};}
 }
 function lost(event){
  if(phase==='disposed')return;
  event.preventDefault?.();
  if(contextLost)return;
  phase='lost';contextLost=true;needsReload=true;lossCount++;
  statusMessage=typeof event.statusMessage==='string'?event.statusMessage.slice(0,500):'';
  saveAttempted=false;saveSucceeded=null;
  call('onPause',onPause);
  if(typeof onSave==='function'){
   saveAttempted=true;const result=call('onSave',onSave);
   saveSucceeded=typeof result?.ok==='boolean'?result.ok:null;
  }
  call('onFailure',onFailure);
 }
 function restored(){
  if(phase==='disposed'||!contextLost)return;
  contextLost=false;phase='restored';
  // A recovered GL context has empty generated targets. Never resume against
  // them just because the browser emitted a success event.
  call('onRestored',onRestored);
 }
 canvas.addEventListener('webglcontextlost',lost);
 canvas.addEventListener('webglcontextrestored',restored);
 return {
  get blocked(){return phase!=='ready';},get contextLost(){return contextLost;},get needsReload(){return needsReload;},snapshot,
  dispose(){if(phase==='disposed')return;canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);phase='disposed';},
 };
}

const positive=(value,fallback)=>Number.isFinite(value)&&value>0?value:fallback;
const dimension=value=>Math.max(1,Math.min(Number.MAX_SAFE_INTEGER,Math.floor(positive(value,1))));

/**
 * Keep the CSS viewport and camera aspect unchanged. Only drawing density is
 * reduced when full-screen/high-DPI would exceed the offscreen-buffer budget.
 * Budgets are per target, not a claim about total GPU memory consumption.
 */
export function computeRenderSize({width,height,devicePixelRatio=1,quality='balanced',maxDimension=4096,maxPixels}={}){
 width=dimension(width);height=dimension(height);
 const cap=quality==='light'?1:quality==='delicate'?2:1.5;
 const requested=Math.min(positive(devicePixelRatio,1),cap);
 const limit=dimension(positive(maxDimension,4096));
 const defaultBudget=quality==='light'?2097152:quality==='delicate'?6291456:4194304;
 const budget=Math.max(1,Math.floor(positive(maxPixels,defaultBudget)));
 const pixelRatio=Math.min(requested,limit/width,limit/height,Math.sqrt(budget/width/height));
 return {width,height,pixelRatio,bufferWidth:Math.max(1,Math.floor(width*pixelRatio)),bufferHeight:Math.max(1,Math.floor(height*pixelRatio)),limited:pixelRatio<requested};
}
