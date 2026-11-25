import test from 'node:test';
import assert from 'node:assert/strict';
import validation from '../scripts/v10-pixel-validation.cjs';

const {summarizeRgba,assessPixels,classifyConsole,assessOpening}=validation;
const pixels=(count,color)=>Uint8Array.from(Array.from({length:count},(_,i)=>color(i)).flat());
const frame=bytes=>({canvas:true,width:1280,height:800,contextLost:false,glError:0,loading:false,failure:false,...summarizeRgba(bytes)});
const detailed=()=>frame(pixels(1024,i=>[i%256,(i*13)%256,(i*7)%256,255]));
const precision='THREE.WebGLProgram: Program Info Log: (210,91-147): warning X4122: sum of 0.996094 and -2.98545e-017 cannot be represented accurately in double precision\n(209,41-69): warning X4122: sum of 1 and -1.49272e-017 cannot be represented accurately in double precision';

test('GL_NO_ERROR and advancing gameplay cannot validate an all-zero RGBA buffer',()=>{
 const f={...frame(new Uint8Array(1024*4)),mode:'play',frame:2715};
 assert.equal(f.glError,0);assert.equal(f.mean[0],0);assert.equal(f.opaque,0);assert.equal(f.allZero,1);
 const result=assessPixels(f);assert.equal(result.valid,false);assert.ok(result.reasons.includes('RGBA zero buffer'));
});

test('opaque pink, black, white and near-flat output fail independently of the pink heuristic',()=>{
 for(const color of [[231,226,237,255],[0,0,0,255],[255,255,255,255]]){
  const f=frame(pixels(1024,()=>color));assert.equal(f.opaque,1);assert.equal(assessPixels(f).valid,false);
 }
 assert.equal(assessPixels(frame(pixels(1024,i=>[230+i%2,225+i%2,236+i%2,255]))).valid,false);
});

test('detailed colored scenes remain valid while partial transparency is detected',()=>{
 assert.equal(assessPixels(detailed()).valid,true);
 const f=frame(pixels(1024,i=>[i%256,(i*13)%256,(i*7)%256,i<40?0:255]));
 assert.equal(assessPixels(f).valid,false);assert.ok(assessPixels(f).reasons.includes('scene alpha is not opaque'));
});

test('almost solid images cannot borrow variance from a tiny hot pixel',()=>{
 const f=frame(pixels(4096,i=>i===0?[255,255,255,255]:[0,0,0,255]));
 assert.ok(Math.max(...f.sd)>1.5);assert.equal(assessPixels(f).valid,false);
 assert.ok(assessPixels(f).reasons.includes('almost one solid color'));
});

test('missing statistics, an empty sample, loss, GL errors and visible overlays fail closed',()=>{
 for(const change of [{opaque:undefined},{sd:[NaN,1,2]},{width:0},{contextLost:true},{glError:1282},{failure:true},{loading:true}])assert.equal(assessPixels({...detailed(),...change}).valid,false);
 assert.equal(assessPixels({canvas:false}).valid,false);
 assert.equal(assessPixels(frame(new Uint8Array())).valid,false);
});

test('only exact Three X4122 precision-only warning logs are nonblocking',()=>{
 const result=classifyConsole([{type:'warning',text:precision}]);assert.equal(result.benign.length,1);assert.equal(result.blocking.length,0);
 for(const entry of [
  {type:'error',text:precision},
  {type:'warning',text:precision+'\nERROR: shader failed'},
  {type:'warning',text:precision.replace('X4122','X3000')},
  {type:'warning',text:'WebGL: INVALID_OPERATION: drawElements'},
  {type:'warning',text:'Water reflection disabled after a rendering failure: invalid target'},
 ])assert.equal(classifyConsole([entry]).blocking.length,1);
});

function opening(){
 const frames=[];let number=1;
 for(let shot=0;shot<6;shot++)for(let n=0;n<3;n++)frames.push({mode:'opening',opening:shot,frame:number++,pixelCheck:{valid:true,reasons:[]},errors:[]});
 for(let n=0;n<5;n++)frames.push({mode:'play',opening:null,frame:number++,pixelCheck:{valid:true,reasons:[]},errors:[]});
 return frames;
}

test('opening acceptance requires useful imagery in every shot and first gameplay',()=>{
 assert.equal(assessOpening(opening()).valid,true);
 for(const shot of [0,1,2,3,4,5])assert.equal(assessOpening(opening().filter(f=>f.opening!==shot)).valid,false);
 assert.equal(assessOpening(opening().filter(f=>f.mode!=='play')).valid,false);
 const repeated=opening();repeated.filter(f=>f.opening===2).forEach(f=>{f.frame=1;});assert.equal(assessOpening(repeated).valid,false);
});

test('one bad image fails even when all shots have other good samples and play is reached',()=>{
 const samples=opening();samples.splice(1,0,{mode:'opening',opening:0,frame:99,pixelCheck:{valid:false,reasons:['RGBA zero buffer']}});
 const result=assessOpening(samples);assert.equal(result.valid,false);assert.equal(result.invalid.length,1);assert.equal(result.coverage[0].validSamples,3);
});

test('the old reflection-only report pattern cannot pass on RGB zero plus GL0',()=>{
 // These values were actually present in opening-1795259174646/report.json.
 // The old script ignored both zero RGB and the absence of alpha statistics.
 const old={mode:'play',opening:null,frame:2715,mean:[0,0,0],sd:[0,0,0],pink:0,glError:0,contextLost:false,failure:false,loading:false};
 assert.equal(assessPixels(old).valid,false);
});
