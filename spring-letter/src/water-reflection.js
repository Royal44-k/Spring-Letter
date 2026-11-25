import * as THREE from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

/** A clipped mirror camera supplies the water shader, never a second floor. */
export function createWaterReflection({renderer,scene,camera,water,exclude=[]}){
 const mirror=new Reflector(new THREE.PlaneGeometry(140,140),{textureWidth:768,textureHeight:768,multisample:2,clipBias:.004});
 mirror.rotation.x=-Math.PI/2;mirror.position.copy(water.position);mirror.updateMatrixWorld(true);
 const worldProjection=new THREE.Matrix4(),inversePlane=mirror.matrixWorld.clone().invert();
 Object.assign(water.material.uniforms,{uReflection:{value:mirror.getRenderTarget().texture},uReflectionMatrix:{value:worldProjection},uReflectionAmount:{value:0}});
 let enabled=true,disposed=false,failed=false,lastSize=768;
 const savedViewport=new THREE.Vector4(),savedScissor=new THREE.Vector4();
 function update(quality='balanced',visible=true){
  enabled=quality!=='light'&&visible&&!disposed&&!failed;
  if(enabled&&renderer.shadowMap.enabled){
   // Reflector deliberately freezes shadow updates. On its very first draw,
   // Three r185 would otherwise bind a null shadow-map array fallback without
   // PCF comparison mode. Let the main RenderPass allocate the real maps first.
   scene.traverseVisible(object=>{if(object.isLight&&object.castShadow&&object.shadow&&!object.shadow.map)enabled=false;});
  }
  water.material.uniforms.uReflectionAmount.value=enabled?1:0;
  if(!enabled)return;
  const size=quality==='delicate'?1024:768;if(size!==lastSize){mirror.getRenderTarget().setSize(size,size);lastSize=size;}
  camera.updateMatrixWorld();scene.updateMatrixWorld();
  const hidden=[water,...exclude],previous=hidden.map(o=>o.visible);
  const previousTarget=renderer.getRenderTarget(),previousFace=renderer.getActiveCubeFace(),previousMip=renderer.getActiveMipmapLevel();
  const previousXr=renderer.xr.enabled,previousShadowAuto=renderer.shadowMap.autoUpdate,previousShadowNeeds=renderer.shadowMap.needsUpdate,previousAutoClear=renderer.autoClear;
  renderer.getViewport(savedViewport);renderer.getScissor(savedScissor);const previousScissorTest=renderer.getScissorTest();
  hidden.forEach(o=>{o.visible=false;});
  try{mirror.onBeforeRender(renderer,scene,camera);worldProjection.copy(mirror.material.uniforms.textureMatrix.value).multiply(inversePlane);}
  catch(error){failed=true;enabled=false;water.material.uniforms.uReflectionAmount.value=0;console.warn('Water reflection disabled after a rendering failure:',error.message);}
  finally{
   hidden.forEach((o,i)=>{o.visible=previous[i];});
   // Reflector restores these only on its success path. A failed optional
   // reflection must never leave the main scene drawing into its texture.
   renderer.xr.enabled=previousXr;renderer.shadowMap.autoUpdate=previousShadowAuto;renderer.shadowMap.needsUpdate=previousShadowNeeds;renderer.autoClear=previousAutoClear;
   renderer.setViewport(savedViewport);renderer.setScissor(savedScissor);renderer.setScissorTest(previousScissorTest);
   // Target selection must be last: non-default targets have their own pixel
   // viewport/scissor, distinct from the renderer's logical window rectangle.
   renderer.setRenderTarget(previousTarget,previousFace,previousMip);
  }
 }
 return {update,get enabled(){return enabled;},get failed(){return failed;},dispose(){if(disposed)return;disposed=true;mirror.dispose();mirror.geometry.dispose();}};
}
