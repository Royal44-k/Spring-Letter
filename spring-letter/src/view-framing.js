import {Vector3} from 'three';

// Fit the complete flower into the part of the canvas left by its controls.
// The asymmetric frustum calculation keeps touch targets and raycasts honest:
// this changes the real camera, rather than shifting a screenshot with CSS.
export function frameBounds(bounds,{direction,fov,width,height,rect,distance}={}){
 const min=new Vector3(...bounds.min),max=new Vector3(...bounds.max);
 const center=min.clone().add(max).multiplyScalar(.5);
 const back=new Vector3(direction.x,direction.y,direction.z).normalize();
 const right=new Vector3(0,1,0).cross(back).normalize();
 const up=back.clone().cross(right).normalize();
 const tanY=Math.tan(fov*Math.PI/360),tanX=tanY*width/height;
 const l=2*rect.left/width-1,r=2*rect.right/width-1;
 const b=1-2*rect.bottom/height,t=1-2*rect.top/height;
 const cx=(l+r)/2,cy=(b+t)/2;
 let fitted=2;
 for(const x of [min.x,max.x])for(const y of [min.y,max.y])for(const z of [min.z,max.z]){
  const p=new Vector3(x,y,z).sub(center),px=p.dot(right),py=p.dot(up),pz=p.dot(back);
  fitted=Math.max(fitted,pz+.5,(px/tanX+r*pz)/(r-cx),(-px/tanX-l*pz)/(cx-l),(py/tanY+t*pz)/(t-cy),(-py/tanY-b*pz)/(cy-b));
 }
 const radius=distance??fitted;
 const target=center.addScaledVector(right,-cx*radius*tanX).addScaledVector(up,-cy*radius*tanY);
 return {radius:fitted,target,offset:back.multiplyScalar(radius)};
}

export function surfaceBounds(samples){
 const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(const array of [samples.closed,samples.open])for(let i=0;i<array.length;i+=3)for(let axis=0;axis<3;axis++){
  min[axis]=Math.min(min[axis],array[i+axis]);max[axis]=Math.max(max[axis],array[i+axis]);
 }
 return {min,max};
}
