import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Low, slow water vapour for the close flower study; the walking route stays clear. */
export function createHeroWeather(){
 const layers=[[-2,.23,1.8,11,3.8,.12],[2,.36,-.8,9,3,.27],[-.5,.16,4,10,2.5,-.18]];
 const pieces=layers.map(([x,y,z,w,h,angle])=>{const g=new THREE.PlaneGeometry(w,h,1,1).rotateX(-Math.PI/2).rotateY(angle).translate(x,y,z);return g;});
 const geometry=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
  uniforms:{uTime:{value:0},uOpacity:{value:0},uNight:{value:0},uPointer:{value:new THREE.Vector3()},uWind:{value:0}},
  vertexShader:`varying vec3 vWorld;varying vec2 vUv;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`,
  fragmentShader:`varying vec3 vWorld;varying vec2 vUv;uniform float uTime;uniform float uOpacity;uniform float uNight;uniform vec3 uPointer;uniform float uWind;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
   void main(){vec2 p=vWorld.xz*vec2(.8,1.8)+vec2(-uTime*.055,uTime*.025);float n=noise(p)*.58+noise(p*2.1)*.27+noise(p*4.3)*.15;
    float edge=pow(max(0.,sin(vUv.x*3.14159)*sin(vUv.y*3.14159)),1.8);float plume=smoothstep(.37,.76,n);float air=1.-exp(-dot(vWorld.xz-uPointer.xz,vWorld.xz-uPointer.xz)*.7)*uWind*.7;
    float alpha=edge*plume*uOpacity*air;gl_FragColor=vec4(mix(vec3(.72,.76,.83),vec3(.28,.26,.42),uNight),alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`
 });
 const object=new THREE.Mesh(geometry,material);object.name='breath-over-the-flower-water';object.renderOrder=3;object.frustumCulled=false;object.userData.excludeFromAO=true;
 let opacity=0;
 return {object,update(time,dt,{focused=false,night=0,scatter=0,gesture,reducedMotion=false}){opacity=THREE.MathUtils.lerp(opacity,focused?(1-scatter)*.34:0,1-Math.exp(-dt*2));material.uniforms.uOpacity.value=opacity;material.uniforms.uNight.value=night;material.uniforms.uTime.value=reducedMotion?0:time;if(gesture?.position)material.uniforms.uPointer.value.copy(gesture.position);material.uniforms.uWind.value=gesture?.active?1:0;object.visible=opacity>.003;},dispose(){geometry.dispose();material.dispose();}};
}
