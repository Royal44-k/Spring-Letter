import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {Color} from 'three';

/** Half-resolution contact depth; bright glass, sky and water keep their own optics. */
export class GardenDepthPass extends GTAOPass {
 constructor(scene,camera){
  super(scene,camera,640,400,undefined,{radius:.42,thickness:.6,scale:1.35,distanceExponent:1.5},{radius:5,lumaPhi:10,depthPhi:2,normalPhi:3});
  this.resolutionScale=.5;this.blendIntensity=.55;this.output=GTAOPass.OUTPUT.Default;this.name='garden-contact-depth';
 }
 setSize(width,height){const scale=this.resolutionScale??.5;super.setSize(Math.max(1,Math.round(width*scale)),Math.max(1,Math.round(height*scale)));}
 render(renderer,writeBuffer,readBuffer,dt,mask){
  const hidden=[];
  const shadowAutoUpdate=renderer.shadowMap.autoUpdate,shadowNeedsUpdate=renderer.shadowMap.needsUpdate;
  const target=renderer.getRenderTarget(),clearColor=renderer.getClearColor(new Color()),clearAlpha=renderer.getClearAlpha(),autoClear=renderer.autoClear,override=this.scene.overrideMaterial;
  this.scene.traverse(o=>{if(!o.visible||!o.isMesh)return;const materials=[o.material].flat();if(o.userData.excludeFromAO||materials.some(m=>m&&(m.transmission>.1||(m.transparent&&m.opacity<.7)||m.depthWrite===false))){hidden.push(o);o.visible=false;}});
  // RenderPass already drew the complete scene's shadows. The AO normal pass
  // hides transparent flowers and must never replace that shared shadow map.
  try{renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=false;super.render(renderer,writeBuffer,readBuffer,dt,mask);}
  catch(error){this.failed=true;this.enabled=false;console.warn('Contact depth disabled after a rendering failure:',error.message);}
  finally{
   renderer.shadowMap.autoUpdate=shadowAutoUpdate;renderer.shadowMap.needsUpdate=shadowNeedsUpdate;
   // GTAOPass can throw after temporarily hiding Points/Line or overriding a
   // material. Restore both layers so an optional effect never loses gameplay.
   this._restoreVisibility();this.scene.overrideMaterial=override;
   for(const o of hidden)o.visible=true;
   renderer.autoClear=autoClear;renderer.setRenderTarget(target);renderer.setClearColor(clearColor,clearAlpha);
  }
 }
}
