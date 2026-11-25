import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene,PerspectiveCamera,Color} from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {GardenDepthPass} from '../src/depth-pass.js';

for(const [name,initial,throws] of [
 ['normal pass does not rebuild main-scene shadows',{autoUpdate:true,needsUpdate:false},false],
 ['explicit pending shadow request survives auxiliary drawing',{autoUpdate:false,needsUpdate:true},false],
 ['failed auxiliary drawing restores both shadow flags',{autoUpdate:true,needsUpdate:true},true],
])test(name,()=>{
 const pass=new GardenDepthPass(new Scene(),new PerspectiveCamera());
 const shadowMap={...initial},target={name:'previous target'},clear=new Color('#abcdef');let observed;
 const renderer={shadowMap,autoClear:true,getRenderTarget:()=>target,getClearColor:out=>out.copy(clear),getClearAlpha:()=>.7,setRenderTarget(){},setClearColor(){}};
 const original=GTAOPass.prototype.render,warning=console.warn;
 GTAOPass.prototype.render=function(){observed={...shadowMap};if(throws)throw Error('simulated optional AO failure');};console.warn=()=>{};
 try{
  pass.render(renderer,null,null,1/60,false);
  assert.deepEqual(observed,{autoUpdate:false,needsUpdate:false});assert.deepEqual(shadowMap,initial);
  assert.equal(!!pass.failed,throws);
 }finally{GTAOPass.prototype.render=original;console.warn=warning;pass.dispose();}
});
