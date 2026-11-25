import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// These cases use real EventTarget events and pure size arithmetic; no GPU is
// needed to verify that a loss during asset loading cannot escape the guard.
import {bindRenderLifecycle,computeRenderSize} from '../src/render-lifecycle.js';

test('a context loss before any scene exists pauses and offers recovery',()=>{
 assert.equal(typeof bindRenderLifecycle,'function','the early render lifecycle guard must exist');
 const canvas=new EventTarget(),calls=[];
 const lifecycle=bindRenderLifecycle({canvas,onPause:()=>calls.push('pause'),onSave:()=>{calls.push('save');return {ok:true};},onFailure:status=>calls.push(status)});
 const event=new Event('webglcontextlost',{cancelable:true});Object.defineProperty(event,'statusMessage',{value:'GPU reset during HDR load'});canvas.dispatchEvent(event);
 assert.equal(event.defaultPrevented,true);assert.equal(lifecycle.blocked,true);assert.equal(lifecycle.contextLost,true);assert.equal(lifecycle.needsReload,true);
 assert.deepEqual(calls.slice(0,2),['pause','save']);assert.equal(calls[2].phase,'lost');assert.equal(calls[2].statusMessage,'GPU reset during HDR load');assert.equal(calls[2].saveSucceeded,true);
 lifecycle.dispose();
});

test('restoring the WebGL context never silently resumes stale render targets',()=>{
 const canvas=new EventTarget(),calls=[];
 const lifecycle=bindRenderLifecycle({canvas,onRestored:status=>calls.push(status)});
 canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));canvas.dispatchEvent(new Event('webglcontextrestored'));
 assert.equal(lifecycle.contextLost,false);assert.equal(lifecycle.blocked,true);assert.equal(lifecycle.needsReload,true);assert.equal(calls.length,1);assert.equal(calls[0].phase,'restored');
 lifecycle.dispose();
});

test('an unsolicited restored event does not freeze a healthy page',()=>{
 const canvas=new EventTarget(),calls=[];const lifecycle=bindRenderLifecycle({canvas,onRestored:()=>calls.push('restored')});
 canvas.dispatchEvent(new Event('webglcontextrestored'));assert.equal(lifecycle.blocked,false);assert.equal(calls.length,0);lifecycle.dispose();
});

test('pause or save exceptions cannot hide the recovery entrance',()=>{
 const canvas=new EventTarget(),seen=[];
 const lifecycle=bindRenderLifecycle({canvas,onPause:()=>{throw Error('audio not ready');},onSave:()=>{throw Error('storage unavailable');},onFailure:status=>seen.push(status)});
 canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
 assert.equal(seen.length,1);assert.equal(seen[0].saveAttempted,true);assert.equal(seen[0].saveSucceeded,false);
 assert.deepEqual(seen[0].callbackErrors,[{callback:'onPause',message:'audio not ready'},{callback:'onSave',message:'storage unavailable'}]);
 assert.equal(lifecycle.blocked,true);lifecycle.dispose();
});

test('failed save results are recorded without claiming successful preservation',()=>{
 const canvas=new EventTarget(),seen=[];const lifecycle=bindRenderLifecycle({canvas,onSave:()=>({ok:false,code:'quota'}),onFailure:status=>seen.push(status)});
 canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));assert.equal(seen[0].saveAttempted,true);assert.equal(seen[0].saveSucceeded,false);lifecycle.dispose();
});

test('duplicate loss notifications do not repeatedly save a broken session',()=>{
 const canvas=new EventTarget();let saves=0;const lifecycle=bindRenderLifecycle({canvas,onSave:()=>{saves++;}});
 for(let i=0;i<3;i++)canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
 assert.equal(saves,1);assert.equal(lifecycle.snapshot().lossCount,1);
 canvas.dispatchEvent(new Event('webglcontextrestored'));canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
 assert.equal(saves,2);assert.equal(lifecycle.snapshot().lossCount,2);lifecycle.dispose();
});

test('disposing removes both listeners and leaves a blocked old renderer',()=>{
 const canvas=new EventTarget(),calls=[];const lifecycle=bindRenderLifecycle({canvas,onPause:()=>calls.push('pause'),onRestored:()=>calls.push('restore')});
 lifecycle.dispose();lifecycle.dispose();canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));canvas.dispatchEvent(new Event('webglcontextrestored'));
 assert.deepEqual(calls,[]);assert.equal(lifecycle.blocked,true);assert.equal(lifecycle.snapshot().phase,'disposed');
});

test('diagnostic snapshots cannot mutate lifecycle state',()=>{
 const canvas=new EventTarget();const lifecycle=bindRenderLifecycle({canvas,onFailure:()=>{throw Error('view failed');}});
 canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));const copy=lifecycle.snapshot();copy.callbackErrors[0].message='changed';copy.callbackErrors.length=0;copy.blocked=false;
 assert.equal(lifecycle.blocked,true);assert.equal(lifecycle.snapshot().callbackErrors[0].message,'view failed');lifecycle.dispose();
});

test('ordinary desktop sizing keeps the complete view at the requested density',()=>{
 assert.equal(typeof computeRenderSize,'function','safe render sizing must exist');
 const s=computeRenderSize({width:1440,height:900,devicePixelRatio:2,quality:'balanced'});
 assert.deepEqual(s,{width:1440,height:900,pixelRatio:1.5,bufferWidth:2160,bufferHeight:1350,limited:false});
});

test('zero, missing or non-finite dimensions never reach projection or framebuffer arithmetic',()=>{
 for(const dimensions of [{width:0,height:0},{width:NaN,height:Infinity},{width:-8,height:-2},{}]){
  const s=computeRenderSize(dimensions);assert.equal(s.width,1);assert.equal(s.height,1);assert.equal(s.bufferWidth,1);assert.equal(s.bufferHeight,1);assert.ok(Number.isFinite(s.width/s.height));
 }
});

test('full-screen high-DPI sizing keeps CSS aspect and fits the pixel budget',()=>{
 const s=computeRenderSize({width:3840,height:2160,devicePixelRatio:3,quality:'delicate'});
 assert.equal(s.width,3840);assert.equal(s.height,2160);assert.equal(s.width/s.height,16/9);assert.ok(s.pixelRatio<1);assert.ok(s.bufferWidth*s.bufferHeight<=6291456);assert.equal(s.limited,true);
});

test('an unusually wide viewport respects the GPU dimension limit without cropping CSS',()=>{
 const s=computeRenderSize({width:12000,height:1600,devicePixelRatio:2,quality:'delicate',maxDimension:4096,maxPixels:16000000});
 assert.equal(s.width,12000);assert.equal(s.height,1600);assert.ok(s.bufferWidth<=4096);assert.ok(s.bufferHeight<=4096);assert.ok(Math.abs(s.bufferWidth/s.bufferHeight-7.5)<.02);
});

test('device limits and area bounds remain finite for malformed capability inputs',()=>{
 for(const value of [NaN,Infinity,0,-1]){
  const s=computeRenderSize({width:1920,height:1080,devicePixelRatio:value,quality:'invalid',maxDimension:value,maxPixels:value});
  assert.ok(s.pixelRatio>0&&Number.isFinite(s.pixelRatio));assert.ok(s.bufferWidth>0&&s.bufferHeight>0);assert.ok(s.bufferWidth*s.bufferHeight<=4194304);
 }
});

test('light mode uses one device pixel per CSS pixel unless hardware or area requires less',()=>{
 const s=computeRenderSize({width:1280,height:720,devicePixelRatio:3,quality:'light'});assert.equal(s.pixelRatio,1);assert.equal(s.limited,false);
 const constrained=computeRenderSize({width:1280,height:720,quality:'light',maxDimension:512});assert.equal(constrained.width,1280);assert.equal(constrained.bufferWidth,512);assert.equal(constrained.limited,true);
});

const mainSource=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
function sizeFixture(){
 const calls=[],gl={MAX_RENDERBUFFER_SIZE:1,getParameter:()=>8192};
 const renderer={capabilities:{maxTextureSize:8192},domElement:{width:1,height:1},getContext:()=>gl,setDrawingBufferSize(w,h,ratio){calls.push(['renderer',w,h,ratio]);this.domElement.width=Math.floor(w*ratio);this.domElement.height=Math.floor(h*ratio);}};
 const composer={setSize:(w,h)=>calls.push(['composer',w,h]),setPixelRatio:ratio=>calls.push(['ratio',ratio])};
 const context={renderer,composer,camera:{aspect:1,updateProjectionMatrix(){}},renderSize:null,renderBlocked:()=>false,computeRenderSize,innerWidth:1440,innerHeight:900,devicePixelRatio:2,state:{settings:{quality:'balanced'}}};
 vm.createContext(context);vm.runInContext(mainSource.slice(mainSource.indexOf('function resize('),mainSource.indexOf('function setPointer(')),context);return {context,calls};
}
test('the actual resize path avoids reallocating unchanged buffers on duplicate fullscreen/resize events',()=>{
 const {context,calls}=sizeFixture();context.resize();const count=calls.length;context.resize(new Event('resize'));assert.equal(calls.length,count);
 context.resize(true);assert.ok(calls.length>count,'a changed AO scale can deliberately resize its pass');
});
test('the actual resize path never allocates a zero backing dimension after viewport collapse',()=>{
 const {context}=sizeFixture();context.innerWidth=0;context.innerHeight=0;context.devicePixelRatio=.5;context.resize();
 assert.ok(context.renderer.domElement.width>=1&&context.renderer.domElement.height>=1);assert.equal(context.camera.aspect,1);
});
test('the actual resize path preserves camera aspect while bounding high-DPI offscreen targets',()=>{
 const {context}=sizeFixture();context.innerWidth=3840;context.innerHeight=2160;context.devicePixelRatio=3;context.state.settings.quality='delicate';context.resize();
 assert.equal(context.camera.aspect,16/9);assert.ok(context.renderer.domElement.width*context.renderer.domElement.height<=6291456);
 assert.equal(context.renderSize.bufferWidth,context.renderer.domElement.width);assert.ok(context.renderSize.pixelRatio<1);
});
test('the actual resize path performs no GPU operations while recovery is required',()=>{
 const {context,calls}=sizeFixture();context.renderBlocked=()=>true;context.resize(true);assert.equal(calls.length,0);
});
test('late HDR/texture completion is disposed instead of continuing a blocked startup',async()=>{
 const disposed=[],context={renderBlocked:()=>true,ensureRenderAvailable(){throw Error('context blocked');}};
 vm.createContext(context);vm.runInContext(mainSource.slice(mainSource.indexOf('async function awaitRenderAsset('),mainSource.indexOf('function renderDiagnostics(')),context);
 await assert.rejects(context.awaitRenderAsset(Promise.resolve([{dispose:()=>disposed.push('hdr')},{dispose:()=>disposed.push('normal')}])) ,/context blocked/);
 assert.deepEqual(disposed,['hdr','normal']);
});
test('healthy startup receives the original asynchronously loaded resource',async()=>{
 const asset={id:'environment'},context={renderBlocked:()=>false,ensureRenderAvailable(){throw Error('unexpected');}};
 vm.createContext(context);vm.runInContext(mainSource.slice(mainSource.indexOf('async function awaitRenderAsset('),mainSource.indexOf('function renderDiagnostics(')),context);
 assert.equal(await context.awaitRenderAsset(Promise.resolve(asset)),asset);
});
