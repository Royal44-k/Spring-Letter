import * as THREE from 'three';
import {assetUrl} from './asset-url.js';

// Original analytic sky. One background draw, no extra render targets or lights.
export function createGardenAtmosphere(){
 const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,
  uniforms:{uNight:{value:0},uDust:{value:0},uTime:{value:0}},
  vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`
   varying vec3 vDirection;uniform float uNight;uniform float uDust;uniform float uTime;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
   float cloud(vec2 p){return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.07)*.15;}
   void main(){
    vec3 d=normalize(vDirection);float h=pow(clamp((d.y+.035)/.87,0.,1.),.48);
    // These are scene-linear radiances, not display RGB. A bright near-white
    // horizon would consume the whole exposure range and flatten the garden.
    vec3 day=mix(vec3(.30,.45,.50),vec3(.055,.21,.42),h);
    vec3 sunDirection=normalize(vec3(-7.,8.,5.));
    float warm=pow(max(dot(d,sunDirection),0.),18.);
    day+=vec3(.19,.105,.025)*warm;
    float sun=pow(max(dot(d,sunDirection),0.),1900.);
    day+=vec3(1.5,1.18,.66)*sun;
    vec2 cp=d.xz/max(d.y+.22,.08)*1.4+vec2(uTime*.004,0.);
    float clouds=smoothstep(.51,.76,cloud(cp))*smoothstep(.02,.18,d.y)*(1.-smoothstep(.64,.95,d.y));
    day=mix(day,vec3(.62,.69,.69),clouds*.30);
    float az=atan(d.z,d.x);
    float farRidge=.018+sin(az*5.+.7)*.009+sin(az*13.)*.006+sin(az*27.)*.002;
    float nearRidge=-.012+sin(az*7.-.5)*.012+sin(az*18.)*.005;
    day=mix(day,vec3(.25,.38,.41),1.-smoothstep(farRidge-.008,farRidge+.008,d.y));
    day=mix(day,vec3(.16,.28,.30),1.-smoothstep(nearRidge-.007,nearRidge+.007,d.y));
    day=mix(day,vec3(.19,.32,.34),1.-smoothstep(-.30,-.10,d.y));
    vec3 night=mix(vec3(.065,.08,.14),vec3(.009,.019,.047),h);
    float stars=step(.9991,hash(floor(d.xz/max(abs(d.y),.1)*330.)))*smoothstep(.08,.4,d.y);
    night+=stars*vec3(.55,.68,1.)*(.32+.12*sin(uTime*.45+az*10.));
    vec3 color=mix(day,night,clamp(uNight,0.,1.));
    color=mix(color,vec3(.0025,.0015,.006),clamp(uDust,0.,1.));
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`});
 const object=new THREE.Mesh(new THREE.SphereGeometry(140,24,16),material);
 object.name='morning-air-and-distant-shores';object.renderOrder=-1000;object.frustumCulled=false;
 let disposed=false;
 return {object,update(time,camera,night=0,dust=0){if(disposed)return;object.position.copy(camera.position);material.uniforms.uTime.value=Number.isFinite(time)?time:0;material.uniforms.uNight.value=night;material.uniforms.uDust.value=dust;},dispose(){if(disposed)return;disposed=true;object.removeFromParent();object.geometry.dispose();material.dispose();}};
}

// Tile physical surfaces in world metres. Triplanar colour avoids the radial
// UV stretching of the procedural islands and the coarse arch extrusion.
export function projectGardenTexture(material,texture,{scale=.32,strength=.6,normalTexture=null,roughnessTexture=null,weathering=false}={}){
 const previous=material.onBeforeCompile,previousKey=material.customProgramCacheKey;
 material.onBeforeCompile=function(shader,renderer){
  previous.call(this,shader,renderer);
  shader.uniforms.gardenAlbedo={value:texture};shader.uniforms.gardenScale={value:scale};shader.uniforms.gardenStrength={value:strength};
  shader.vertexShader='varying vec3 gardenPosition;varying vec3 gardenNormal;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`vec4 gardenLocal=vec4(transformed,1.);
   #ifdef USE_INSTANCING
    gardenLocal=instanceMatrix*gardenLocal;
   #endif
   gardenPosition=(modelMatrix*gardenLocal).xyz;
   gardenNormal=inverseTransformDirection(transformedNormal,viewMatrix);
   #include <project_vertex>`);
  shader.fragmentShader='uniform sampler2D gardenAlbedo;uniform float gardenScale;uniform float gardenStrength;varying vec3 gardenPosition;varying vec3 gardenNormal;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   vec3 gardenWeights=pow(abs(normalize(gardenNormal)),vec3(4.));gardenWeights/=max(dot(gardenWeights,vec3(1.)),.0001);
   vec3 gp=gardenPosition*gardenScale;
   vec3 gardenTex=texture2D(gardenAlbedo,gp.yz).rgb*gardenWeights.x+texture2D(gardenAlbedo,gp.xz).rgb*gardenWeights.y+texture2D(gardenAlbedo,gp.xy).rgb*gardenWeights.z;
   diffuseColor.rgb*=mix(vec3(1.),gardenTex,gardenStrength);
   ${weathering ? `
    // Broad mineral deposits and rising damp sit underneath the photographic
    // grain. Their scale is metres, so an arch is no longer one flat colour.
    float mineral=.5+.5*sin(gardenPosition.y*1.48+sin(gardenPosition.x*1.7+gardenPosition.z*.9)*1.7)*sin(gardenPosition.z*1.2+gardenPosition.x*.65);
    float sediment=smoothstep(.36,.82,mineral);
    float damp=(1.-smoothstep(-.18,.68+mineral*.28,gardenPosition.y))*(.4+mineral*.6);
    diffuseColor.rgb*=mix(vec3(.78,.73,.65),vec3(1.03,1.01,.96),sediment);
    diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.48,.59,.43),damp*.65);
   ` : ''}`);
  if(normalTexture&&roughnessTexture){
   shader.uniforms.gardenNormalMap={value:normalTexture};shader.uniforms.gardenRoughMap={value:roughnessTexture};
   shader.fragmentShader='uniform sampler2D gardenNormalMap;uniform sampler2D gardenRoughMap;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    float gardenRough=texture2D(gardenRoughMap,gp.yz).r*gardenWeights.x+texture2D(gardenRoughMap,gp.xz).r*gardenWeights.y+texture2D(gardenRoughMap,gp.xy).r*gardenWeights.z;
    roughnessFactor=mix(roughnessFactor,clamp(gardenRough,.45,1.),.65);`);
   shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
    vec3 gnX=texture2D(gardenNormalMap,gp.yz).xyz*2.-1.;vec3 gnY=texture2D(gardenNormalMap,gp.xz).xyz*2.-1.;vec3 gnZ=texture2D(gardenNormalMap,gp.xy).xyz*2.-1.;
    vec3 gnSign=sign(gardenNormal);
    vec3 gnWorld=vec3(gnX.z*gnSign.x,gnX.x,gnX.y)*gardenWeights.x+vec3(gnY.x,gnY.z*gnSign.y,gnY.y)*gardenWeights.y+vec3(gnZ.x,gnZ.y,gnZ.z*gnSign.z)*gardenWeights.z;
    normal=normalize(mix(normal,normalize(mat3(viewMatrix)*gnWorld),.38));`);
  }
 };
 material.customProgramCacheKey=()=>previousKey.call(material)+'-garden-triplanar-v7-'+Number(!!normalTexture)+'-'+Number(weathering);
 material.needsUpdate=true;
 return ()=>{material.onBeforeCompile=previous;material.customProgramCacheKey=previousKey;material.needsUpdate=true;};
}

export async function loadGardenSurfaces({world,landscape,renderer,loader=new THREE.TextureLoader()}={}){
 const urls=['plaster-color.jpg','rocky-trail-color.jpg','rocky-trail-normal.jpg','rocky-trail-roughness.jpg'];
 const settled=await Promise.allSettled(urls.map(file=>loader.loadAsync(assetUrl('assets/v7/'+file))));
 const textures=settled.filter(r=>r.status==='fulfilled').map(r=>r.value);
 if(settled.some(r=>r.status==='rejected')){textures.forEach(t=>t.dispose());throw Error('Garden colour surfaces did not load');}
 const [plaster,earth,normalTexture,roughnessTexture]=textures;
 for(const texture of textures){texture.colorSpace=(texture===plaster||texture===earth)?THREE.SRGBColorSpace:THREE.NoColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(8,renderer?.capabilities.getMaxAnisotropy()||1);}
 const restores=[],seen=new Set();let applied=0,disposed=false;
 const apply=(material,texture,options)=>{if(!material?.isMeshStandardMaterial||seen.has(material))return;seen.add(material);restores.push(projectGardenTexture(material,texture,options));applied++;};
 world?.group.traverse(o=>{for(const material of o.material?[o.material].flat():[]){
  if(['garden-limestone','opening-matte-limestone','garden-shore-stone','garden-submerged-stone','shore-mineral-stone'].includes(material.name))apply(material,plaster,{scale:.58,strength:.83,weathering:true,normalTexture:material.normalMap,roughnessTexture:material.roughnessMap});
  if(['garden-earth','continuous-tide-worn-stone'].includes(material.name))apply(material,earth,{scale:.5,strength:.77,normalTexture,roughnessTexture});
 }});
 landscape?.group.traverse(o=>{if(o.name.endsWith('-ground'))apply(o.material,earth,{scale:.38,strength:.5,normalTexture,roughnessTexture});});
 return {textures,applied,snapshot:()=>({loaded:!disposed,materials:applied,textures:textures.length}),dispose(){if(disposed)return;disposed=true;restores.forEach(f=>f());textures.forEach(t=>t.dispose());}};
}
