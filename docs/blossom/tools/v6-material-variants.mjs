// CPU inspection only: constructs authored geometry/materials, never a renderer.
// This is a feature-key comparison, not a measured GPU shader-cache report.
import fs from 'node:fs';
import {createBouquet} from '../../../spring-letter/src/botany.js';
const bouquet=createBouquet({seed:17,scale:1}),results={};
try{
 for(const series of ['silver','crystal','lily','amber','celadon']){
  bouquet.setMaterial(series,'blush');results[series]={};
  for(const opacity of [1,.42]){
   bouquet.setOpacity(opacity);const entries=new Map();
   bouquet.group.traverse(object=>{
    if(!object.isMesh)return;
    const material=object.material,geometry=object.geometry;
    const flags={role:object.userData.role,map:!!material.map,clearcoat:material.clearcoat>0,
     iridescence:material.iridescence>0,iridescenceThicknessMap:material.iridescence>0&&!!material.iridescenceThicknessMap,
     sheen:material.sheen>0,transmission:material.transmission>0,dispersion:material.dispersion>0,
     opaque:material.transparent===false&&material.blending===1&&material.alphaToCoverage===false,
     side:material.side,forceSinglePass:material.forceSinglePass,
     morphPosition:geometry.morphAttributes.position?.length||0,morphNormal:geometry.morphAttributes.normal?.length||0,
     uv:!!geometry.attributes.uv,normal:!!geometry.attributes.normal,color:!!geometry.attributes.color,
     toneMapped:material.toneMapped,alphaTest:material.alphaTest>0};
    const key=JSON.stringify(flags);entries.set(key,{...flags,meshes:(entries.get(key)?.meshes||0)+1});
   });results[series][opacity===1?'solid':'translucent']=[...entries.values()].sort((a,b)=>a.role.localeCompare(b.role)||a.morphPosition-b.morphPosition);
  }
 }
 const amberCeladonEqual=JSON.stringify(results.amber)===JSON.stringify(results.celadon);
 const report={date:new Date().toISOString(),scope:'CPU material/geometry feature comparison only. No WebGL renderer, canvas, GPU, or program compilation. Scene lighting/environment/target are held conceptually constant; actual GPU cache keys remain the renderer authority.',
  three:'0.185.0',amberCeladonEqual,results};
 const out=new URL('../v6-material-variants-cpu.json',import.meta.url);fs.writeFileSync(out,JSON.stringify(report,null,2));
 console.log(JSON.stringify({amberCeladonEqual,output:out.pathname,series:Object.keys(results)}));
}finally{bouquet.dispose();}
