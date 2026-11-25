import * as THREE from 'three';
import {ATLAS_STARS} from './atlas-content.js';

/** Fit the actual perspective projections, including the numbered star labels. */
export function fitAtlasStarCamera(width,height,stars=ATLAS_STARS){
 width=Number.isFinite(width)&&width>0?width:1440;height=Number.isFinite(height)&&height>0?height:900;
 const compact=width<=151||height<=265,landscape=height<=500;
 // Window resizing may temporarily leave less space than the UI reservations.
 // Keep a finite, visible frame until the normal layout can fit again.
 const inset=compact?Math.min(27.5,width*.12,height*.12):27.5,side=compact?Math.min(48,width*.15):48;
 const bounds={left:side+inset,right:width-side-inset,top:(compact?height*.15:landscape?115:130)+inset,bottom:height-(compact?height*.15:landscape?95:200)-inset};
 const fov=48,nearZ=Math.max(...stars.map(s=>s.z)),farZ=Math.min(...stars.map(s=>s.z));
 const camera=new THREE.PerspectiveCamera(fov,width/height,.1,10000),point=new THREE.Vector3();
 // With parallel view/target axes, moving the camera in x/y translates each
 // star by its own perspective scale. Intersect those permitted translations.
 const fit=distance=>{
  camera.position.set(0,0,nearZ+distance);camera.lookAt(0,0,nearZ+distance-1);camera.updateMatrixWorld();
  let left=-Infinity,right=Infinity,bottom=-Infinity,top=Infinity;
  for(const star of stars){
   point.set(star.x,star.y,star.z).project(camera);
   const x=(point.x+1)*width/2,y=(1-point.y)*height/2;
   const scale=height/(2*Math.tan(THREE.MathUtils.degToRad(fov/2))*(camera.position.z-star.z));
   left=Math.max(left,(x-bounds.right)/scale);right=Math.min(right,(x-bounds.left)/scale);
   bottom=Math.max(bottom,(bounds.top-y)/scale);top=Math.min(top,(bounds.bottom-y)/scale);
  }
  return {fits:left<=right&&bottom<=top,x:(left+right)/2,y:(bottom+top)/2};
 };
 let low=.2,high=1;
 while(!fit(high).fits)high*=2;
 for(let i=0;i<40;i++){const mid=(low+high)/2;if(fit(mid).fits)high=mid;else low=mid;}
 const center=fit(high);
 return {position:[center.x,center.y,nearZ+high],target:[center.x,center.y,(nearZ+farZ)/2],fov,far:Math.max(360,high+nearZ-farZ+100)};
}
