// Uses Three's actual CPU program-key builder, never a WebGL renderer/context.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {FogExp2,Texture,CubeUVReflectionMapping,SRGBColorSpace,ACESFilmicToneMapping,PCFShadowMap} from 'three';
import {WebGLPrograms} from 'three/src/renderers/webgl/WebGLPrograms.js';
import {createBouquet} from '../../../spring-letter/src/botany.js';
const environment=new Texture({height:256});environment.mapping=CubeUVReflectionMapping;
const target={isXRRenderTarget:false};
const renderer={getRenderTarget:()=>target,state:{buffers:{depth:{getReversed:()=>false}}},shadowMap:{enabled:true,type:PCFShadowMap},outputColorSpace:SRGBColorSpace,toneMapping:ACESFilmicToneMapping};
const extensions={has:name=>name==='KHR_parallel_shader_compile'};
const capabilities={precision:'highp',getMaxPrecision:value=>value,logarithmicDepthBuffer:false};
const builder=WebGLPrograms(renderer,{get:()=>environment},extensions,capabilities,{}, {numPlanes:0,numIntersection:0});
const lights={directional:[{},{}],point:[],spot:[],spotLightMap:[],rectArea:[],hemi:[{}],directionalShadowMap:[{}],pointShadowMap:[],spotShadowMap:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};
const scene={environment,fog:new FogExp2('#e7e2ed',.012)};
const bouquet=createBouquet({seed:17,scale:1}),forms={},lilyKeys=new Set();
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const selected=['map','clearcoat','dispersion','iridescence','sheen','transmission','opaque','vertexNormals','vertexColors','vertexAlphas','vertexTangents','morphTargets','morphNormals','morphColors','morphTargetsCount','morphTextureStride','vertexUv1s','vertexUv2s','vertexUv3s','doubleSided','toneMapping','outputColorSpace'];
try{
 for(const form of ['lily','lotus','iris','dahlia']){
  bouquet.setForm(form);const variants=new Map();
  for(const series of ['silver','crystal','lily','amber','celadon']){
   bouquet.setMaterial(series,'blush');
   for(const opacity of [1,.42]){
    bouquet.setOpacity(opacity);
    bouquet.group.traverse(object=>{
     if(!object.isMesh)return;
     const parameters=builder.getParameters(object.material,lights,[{}],scene,object,[]);
     const key=builder.getProgramCacheKey(parameters),sha=hash(key);
     if(form==='lily')lilyKeys.add(sha);
     if(!variants.has(sha))variants.set(sha,{sha,parameters:Object.fromEntries(selected.map(name=>[name,parameters[name]])),examples:[]});
     const row=variants.get(sha),example=`${series}/${opacity===1?'solid':'translucent'}/${object.userData.role}`;
     if(!row.examples.includes(example))row.examples.push(example);
    });
   }
  }
  forms[form]={uniqueProgramKeys:variants.size,newKeysBeyondLily:[...variants.values()].filter(row=>!lilyKeys.has(row.sha)),variants:[...variants.values()]};
 }
 const report={date:new Date().toISOString(),scope:'CPU-only actual Three 0.185 WebGLPrograms.getParameters/getProgramCacheKey against authored meshes. Fixed hypothetical scene lighting, PMREM height and composer render-target context are identical across forms. No GL context, program compilation, driver cache or timing is observed. Compares whether shape/material attributes require additional Three cache keys, not driver performance.',forms};
 fs.writeFileSync(new URL('../v6-form-program-keys-cpu.json',import.meta.url),JSON.stringify(report,null,2));
 console.log(JSON.stringify(Object.fromEntries(Object.entries(forms).map(([form,value])=>[form,{uniqueProgramKeys:value.uniqueProgramKeys,newKeysBeyondLily:value.newKeysBeyondLily.length}]))));
}finally{bouquet.dispose();environment.dispose();}
