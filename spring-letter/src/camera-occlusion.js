import * as THREE from 'three';

/** Keep authored masonry, but make foreground blockers yield to the traveller. */
export function createCameraOcclusion(objects=[]){
 const ray=new THREE.Raycaster(),direction=new THREE.Vector3();
 const tracked=objects.map(object=>({object,material:object.material,opacity:1}));
 return {update(dt,camera,target,enabled=true,subjects=[]){
  const blocked=new Set();
  if(enabled)for(const subject of [target,...subjects]){
   direction.subVectors(camera.position,subject);const distance=direction.length();
   if(distance>.1){ray.set(subject,direction.normalize());ray.near=.25;ray.far=Math.max(.25,distance-.25);for(const hit of ray.intersectObjects(objects,false))blocked.add(hit.object);}
  }
  for(const item of tracked){const desired=blocked.has(item.object)?.16:1;item.opacity=THREE.MathUtils.lerp(item.opacity,desired,1-Math.exp(-Math.max(0,dt)*9));item.material.opacity=item.opacity;item.material.depthWrite=item.opacity>.98;}
  return tracked.filter(item=>item.opacity<.95).length;
 },reset(){for(const item of tracked){item.opacity=1;item.material.opacity=1;item.material.depthWrite=true;}}};
}
