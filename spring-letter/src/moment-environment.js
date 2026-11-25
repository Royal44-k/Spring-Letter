import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const noRaycast=()=>{};
const finite=value=>Number.isFinite(value)?value:0;
const surfaceVertex=`varying vec3 vLocal;varying vec3 vWorld;varying vec2 vUv;
void main(){vLocal=position;vUv=uv;vec4 world=modelMatrix*vec4(position,1.0);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
const distanceFragment=`uniform vec3 uBottom;uniform vec3 uTop;uniform vec3 uGlow;uniform float uTime;
varying vec2 vUv;
void main(){
 vec2 p=vUv;float haze=.5+.5*sin(p.x*8.0+p.y*3.4+uTime*.025);
 vec3 color=mix(uBottom,uTop,smoothstep(.02,.90,p.y));
 float light=exp(-length((p-vec2(.38,.38))*vec2(4.0,2.9))*2.7);
 color+=uGlow*(light*.11+haze*.012);
 float alpha=smoothstep(0.0,.17,p.x)*smoothstep(0.0,.17,1.0-p.x)*smoothstep(0.0,.22,1.0-p.y);
 gl_FragColor=vec4(color,alpha*.97);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const waterFragment=`uniform float uTime;uniform vec3 uDeep;uniform vec3 uMist;uniform vec3 uAccent;
varying vec3 vLocal;varying vec3 vWorld;
void main(){
 vec2 p=vLocal.xz;float t=uTime*.23;
 float a=sin(p.x*1.8+p.y*.82+t)+.42*sin(p.x*4.1-p.y*2.2-t*.8);
 float b=cos(p.y*1.5-p.x*.65-t*.7)+.30*sin(p.y*5.0+p.x*1.4+t);
 vec3 n=normalize(vec3(a*.034,1.0,b*.045));
 vec3 eye=normalize(cameraPosition-vWorld),light=normalize(vec3(-.35,1.0,.45));
 float shine=pow(max(dot(reflect(-light,n),eye),0.0),42.0);
 float horizon=pow(1.0-clamp(dot(n,eye),0.0,1.0),2.6);
 vec3 color=mix(uDeep,uMist,horizon*.66+smoothstep(4.0,35.0,-p.y)*.25);
 float broken=pow(.5+.5*sin(p.y*7.8+a*2.3+t),8.0);
 float reflectionDistance=(p.x+p.y*.10-1.2+a*.08)/.7;
 float reflection=exp(-reflectionDistance*reflectionDistance);
 color+=vec3(.12,.19,.21)*shine+vec3(.08,.13,.15)*reflection*broken*.35;
 float veins=pow(.5+.5*sin(p.x*4.7+p.y*3.3+a),12.0)*pow(.5+.5*cos(p.y*2.7-p.x+b),5.0);
 color+=uAccent*veins*.026;
 float d=length((p-vec2(-5.6,-2.8))*vec2(1.0,.85));
 color+=vec3(.012,.024,.026)*sin(d*9.0-t*1.8)*exp(-d*.22);
 gl_FragColor=vec4(max(color,vec3(0.0)),1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const glowVertex=`varying vec2 vUv;void main(){vUv=uv;vec4 p=vec4(position,1.0);
 #ifdef USE_INSTANCING
 p=instanceMatrix*p;
 #endif
 gl_Position=projectionMatrix*modelViewMatrix*p;}`;
const glowFragment=`uniform vec3 uColor;varying vec2 vUv;
void main(){float r=length((vUv-.5)*2.0);float light=exp(-r*r*5.6)*(1.0-smoothstep(.72,1.0,r));gl_FragColor=vec4(uColor,light*.24);}`;

function merged(parts){const geometry=mergeGeometries(parts,false);for(const part of parts)part.dispose();return geometry;}
function leafGeometry(width=.18,length=.44){
 const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-width,length*.16,-width*.85,length*.75,0,length);shape.bezierCurveTo(width*.85,length*.75,width,length*.16,0,0);
 const geometry=new THREE.ShapeGeometry(shape,10),position=geometry.attributes.position;
 for(let i=0;i<position.count;i++){const x=position.getX(i),y=position.getY(i);position.setZ(i,Math.sin(y/length*Math.PI)*.055+x*x*.5);}geometry.computeVertexNormals();return geometry;
}
function roundedSlab(width,depth,height){
 const shape=new THREE.Shape(),x=-width/2,z=-depth/2,r=.14;
 shape.moveTo(x+r,z);shape.lineTo(x+width-r,z);shape.quadraticCurveTo(x+width,z,x+width,z+r);shape.lineTo(x+width,z+depth-r);shape.quadraticCurveTo(x+width,z+depth,x+width-r,z+depth);shape.lineTo(x+r,z+depth);shape.quadraticCurveTo(x,z+depth,x,z+depth-r);shape.lineTo(x,z+r);shape.quadraticCurveTo(x,z,x+r,z);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSize:.025,bevelThickness:.015,bevelSegments:2,curveSegments:8});geometry.rotateX(-Math.PI/2);return geometry;
}
function tube(points,radius=.012){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),12,radius,5,false);}
function boxAt(x,y,z,width,height,depth){const geometry=new THREE.BoxGeometry(width,height,depth);geometry.translate(x,y,z);return geometry;}
function barBetween(a,b,width=.05,depth=width){
 const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from),geometry=new THREE.BoxGeometry(width,delta.length(),depth);
 geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));geometry.translate(...from.add(to).multiplyScalar(.5).toArray());return geometry;
}

/** Focus-only scenery; no bounds, interaction handlers, state or external assets. */
export function createMomentEnvironment(id){
 const group=new THREE.Group();group.name='moment-environment-'+id;group.visible=false;group.userData.environment=true;
 const supported=id==='rain'||id==='tide',geometries=new Set(),materials=new Set(),instances=new Set(),motions=[],clocks=[],accentTargets=[];
 const dummy=new THREE.Object3D(),color=new THREE.Color(),paletteColor=new THREE.Color('#c4cbbb');let disposed=false;
 const ownG=geometry=>(geometries.add(geometry),geometry),ownM=material=>(materials.add(material),material);
 const standard=(tone,options={})=>ownM(new THREE.MeshStandardMaterial({color:tone,roughness:.72,...options}));
 const add=(geometry,material,name)=>{const object=new THREE.Mesh(ownG(geometry),material);object.name=name;object.raycast=noRaycast;group.add(object);return object;};
 const instanced=(geometry,material,count,name)=>{const object=new THREE.InstancedMesh(ownG(geometry),material,count);object.name=name;object.raycast=noRaycast;object.frustumCulled=false;instances.add(object);group.add(object);return object;};
 function at(object,index,position,rotation=[0,0,0],scale=[1,1,1]){dummy.position.set(...position);dummy.rotation.set(...rotation);dummy.scale.set(...scale);dummy.updateMatrix();object.setMatrixAt(index,dummy.matrix);}
 function distantAtmosphere(){
  const radius=id==='rain'?22:30,height=id==='rain'?13:15,geometry=new THREE.PlaneGeometry(radius*2,height,40,14),position=geometry.attributes.position;
  for(let i=0;i<position.count;i++){const angle=position.getX(i)/radius*1.12;position.setXYZ(i,Math.sin(angle)*radius,position.getY(i)+height*.45,-Math.cos(angle)*radius-3);}position.needsUpdate=true;geometry.computeVertexNormals();
  const uniforms={uBottom:{value:new THREE.Color(id==='rain'?'#344c4b':'#345366')},uTop:{value:new THREE.Color(id==='rain'?'#526865':'#486779')},uGlow:{value:new THREE.Color(id==='rain'?'#e4d3a8':'#98bcc4')},uTime:{value:0}};
  const material=ownM(new THREE.ShaderMaterial({uniforms,vertexShader:surfaceVertex,fragmentShader:distanceFragment,transparent:true,depthWrite:false,side:THREE.DoubleSide,forceSinglePass:true}));clocks.push(uniforms.uTime);
  const object=add(geometry,material,'environment-distant-atmosphere');object.renderOrder=-4;
 }
 function motes(count,spread){
  const positions=new Float32Array(count*3);for(let i=0;i<count;i++){const side=i%2?-1:1;positions[i*3]=side*(3.4+(i%11)*spread);positions[i*3+1]=id==='rain'?.7+(i%17)*.18:-.04+(i%5)*.035;positions[i*3+2]=-8+(i%19)*.72;}
  const geometry=ownG(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material=ownM(new THREE.PointsMaterial({color:id==='rain'?'#d7ceb1':'#a6cbd1',size:id==='rain'?.016:.024,transparent:true,opacity:.25,depthWrite:false}));
  const points=new THREE.Points(geometry,material);points.name='environment-air-glints';points.raycast=noRaycast;group.add(points);return points;
 }
 if(supported)distantAtmosphere();
 if(id==='rain'){
  const wood=standard('#6f6757',{roughness:.81,metalness:.04});wood.name='environment-oiled-wood';
  wood.onBeforeCompile=shader=>{
   shader.vertexShader='varying vec3 vGardenPosition;\n'+shader.vertexShader;
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 gardenPosition=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\ngardenPosition=instanceMatrix*gardenPosition;\n#endif\nvGardenPosition=gardenPosition.xyz;');
   shader.fragmentShader='varying vec3 vGardenPosition;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat grain=sin(vGardenPosition.x*124.0+sin(vGardenPosition.z*.82)*2.8)+.4*sin(vGardenPosition.x*287.0+vGardenPosition.z*.7);\nvec2 wornOffset=vec2(vGardenPosition.x/3.2,(vGardenPosition.z+2.0)/10.0);\nfloat worn=exp(-dot(wornOffset,wornOffset));\ndiffuseColor.rgb*=.88+grain*.055+worn*.10;\ndiffuseColor.rgb+=vec3(.04,.029,.012)*worn;');
  };wood.customProgramCacheKey=()=> 'moment-environment-wood-v1';
  const floor=instanced(new THREE.BoxGeometry(.56,.10,3.78),wood,40*10,'environment-wooden-floor');floor.receiveShadow=true;
  for(let row=0;row<10;row++)for(let column=0;column<40;column++){const index=row*40+column;at(floor,index,[(column-19.5)*.58,-.48,(row-7)*3.82]);color.setScalar(.86+((index*17)%13)/60);floor.setColorAt(index,color);}
  const stone=standard('#667573',{roughness:.86,metalness:.07}),plinth=add(roundedSlab(5.5,2.65,.16),stone,'environment-stone-foundation');plinth.position.set(0,-.42,.08);plinth.receiveShadow=true;
  const benches=[];for(const side of [-1,1]){benches.push(boxAt(side*4.45,-.08,-3.3,1.05,.26,8.4));for(const z of [.25,-3.1,-6.45])benches.push(boxAt(side*4.45,-.31,z,.42,.40,.38));}add(merged(benches),stone,'environment-side-benches');
  const frame=standard('#405652',{metalness:.42,roughness:.53}),frameParts=[];
  for(const z of [2.8,-2.3,-7.4,-12.5]){
   for(const side of [-1,1]){frameParts.push(boxAt(side*4.5,2.37,z,.075,5.55,.09));frameParts.push(barBetween([side*4.5,5.14,z],[0,6.35,z],.055,.075));}
   frameParts.push(boxAt(0,5.12,z,9.05,.065,.075));
  }
  for(const x of [-4.5,0,4.5])frameParts.push(boxAt(x,x===0?6.35:5.12,-4.85,.06,.07,15.4));
  add(merged(frameParts),frame,'environment-greenhouse-frame');
  const vine=standard('#536c4e',{roughness:.91,side:THREE.DoubleSide}),leaf=instanced(leafGeometry(.15,.40),vine,144,'environment-hanging-leaves'),branches=[];
  for(let chain=0;chain<12;chain++){
   const side=chain%2?1:-1,z=1.7-Math.floor(chain/2)*2.25,x=side*(4.20+.12*Math.sin(chain)),length=2.5+(chain%3)*.5;
   branches.push(tube([[x,5.04,z],[x+side*.12,4,z-.08],[x-side*.15,3.1,z+.09],[x,5.04-length,z+.03]],.012));
   for(let i=0;i<12;i++){const index=chain*12+i,position=[x+Math.sin(i*.8)*.11,4.95-i*length/12,z+.06*Math.sin(i*1.7)],rotation=[.25*Math.sin(i),side*.40,side*(i%2?1.12:-.90)];at(leaf,index,position,rotation,[.75+(i%4)*.08,1,1]);leaf.setColorAt(index,color.setHSL(.20+(chain%3)*.015,.18,.37+(i%4)*.025));motions.push({object:leaf,index,position,rotation,scale:[.75+(i%4)*.08,1,1],phase:index*.77,amount:.032});}
  }
  add(merged(branches),standard('#665d44',{roughness:.95}),'environment-vine-stems');
  const pots=instanced(new THREE.CylinderGeometry(.28,.20,.42,16),standard('#88796a',{roughness:.95}),8,'environment-pottery');
  for(let i=0;i<8;i++)at(pots,i,[(i%2?1:-1)*4.43,.25,.10-Math.floor(i/2)*2.35]);
  const copper=standard('#a58a62',{metalness:.82,roughness:.27}),lampParts=[],lampSites=[[-3.7,.65],[3.7,.65],[-4.3,-6],[4.3,-6]];
  const glass=ownM(new THREE.MeshPhysicalMaterial({color:'#ffe2ae',roughness:.24,metalness:0,transparent:true,opacity:.62,depthWrite:false,emissive:'#e8c48c',emissiveIntensity:.32,clearcoat:.8}));
  const lanterns=instanced(new THREE.CylinderGeometry(.10,.105,.28,14),glass,4,'environment-lantern-glass');
  const glowMaterial=ownM(new THREE.ShaderMaterial({uniforms:{uColor:{value:new THREE.Color('#ffe2af')}},vertexShader:glowVertex,fragmentShader:glowFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  const halos=instanced(new THREE.PlaneGeometry(.95,.95),glowMaterial,4,'environment-lantern-light');
  for(let i=0;i<lampSites.length;i++){
   const [x,z]=lampSites[i];lampParts.push(boxAt(x,.33,z,.035,1.48,.035));
   for(const y of [.96,1.32]){const cap=new THREE.CylinderGeometry(.15,.16,.035,14);cap.translate(x,y,z);lampParts.push(cap);}
   for(const sx of [-1,1])for(const sz of [-1,1])lampParts.push(boxAt(x+sx*.10,1.14,z+sz*.10,.012,.35,.012));
   at(lanterns,i,[x,1.14,z]);at(halos,i,[x,1.14,z+.13]);
  }
  add(merged(lampParts),copper,'environment-copper-lanterns');motes(56,.18);
 }else if(id==='tide'){
  const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color('#274c5c')},uMist:{value:new THREE.Color('#4a6979')},uAccent:{value:new THREE.Color('#bedcda')}};
  clocks.push(uniforms.uTime);accentTargets.push(uniforms.uAccent.value);
  const waterMaterial=ownM(new THREE.ShaderMaterial({uniforms,vertexShader:surfaceVertex,fragmentShader:waterFragment}));
  const waterGeometry=new THREE.CircleGeometry(42,80);waterGeometry.rotateX(-Math.PI/2);const water=add(waterGeometry,waterMaterial,'environment-water-garden');water.position.set(0,-.24,-8);water.receiveShadow=false;
  const padShape=new THREE.Shape();padShape.moveTo(0,0);padShape.lineTo(Math.cos(.12),Math.sin(.12));padShape.absarc(0,0,1,.12,Math.PI*2-.12,false);padShape.lineTo(0,0);
  const padGeometry=new THREE.ShapeGeometry(padShape,28);padGeometry.rotateX(-Math.PI/2);const pp=padGeometry.attributes.position;
  for(let i=0;i<pp.count;i++){const x=pp.getX(i),z=pp.getZ(i),r=Math.hypot(x,z);pp.setY(i,.045*r*r+.008*Math.sin(Math.atan2(z,x)*5));}padGeometry.computeVertexNormals();
  const padMaterial=standard('#587a67',{roughness:.40,metalness:.13,side:THREE.DoubleSide});
  const pads=instanced(padGeometry,padMaterial,30,'environment-lotus-leaves'),flowerSites=[];
  for(let i=0;i<30;i++){
   const side=i%2?1:-1,x=side*(4.65+(i%5)*.69+.15*Math.sin(i*2.1)),z=-5.2+(Math.floor(i/2)%10)*1.07,scale=.39+(i%4)*.11;
   at(pads,i,[x,-.17,z],[.015*Math.sin(i),i*2.39,0],[scale,1,scale]);pads.setColorAt(i,color.setHSL(.35+(i%4)*.012,.18,.34+(i%3)*.025));
   if(i<6)flowerSites.push([x,-.075,z]);
  }
  const petals=instanced(leafGeometry(.095,.31),ownM(new THREE.MeshPhysicalMaterial({color:'#dcc2c8',roughness:.57,metalness:.03,clearcoat:.25,side:THREE.DoubleSide})),flowerSites.length*10,'environment-water-blossoms');
  accentTargets.push(petals.material.color);
  flowerSites.forEach(([x,y,z],f)=>{for(let i=0;i<10;i++){const angle=i*Math.PI/5;at(petals,f*10+i,[x,y,z],[-.95,angle,0],[1,1,1]);}});
  const stems=[],blades=instanced(leafGeometry(.023,.66),standard('#4b675d',{roughness:.86,side:THREE.DoubleSide}),70,'environment-reed-blades');
  for(let clump=0;clump<14;clump++){
   const side=clump%2?1:-1,x=side*(5.0+(clump%3)*1.5),z=-5.8+Math.floor(clump/2)*1.4,height=.45+(clump%5)*.16;
   for(let i=0;i<3;i++)stems.push(tube([[x+i*.09,-.22,z],[x+i*.07,.15,z+.02],[x+.10*Math.sin(i),height,z-.12]],.008));
   for(let i=0;i<5;i++){const index=clump*5+i,position=[x+(i-2)*.055,-.16,z],rotation=[.20*Math.sin(i+clump),i*1.8,(i-2)*.09];at(blades,index,position,rotation,[1,.75+(i%3)*.14,1]);motions.push({object:blades,index,position,rotation,scale:[1,.75+(i%3)*.14,1],phase:index*1.3,amount:.025});}
  }
  add(merged(stems),standard('#526457',{roughness:.91}),'environment-reed-stems');
  const rocks=instanced(new THREE.IcosahedronGeometry(1,1),standard('#52686c',{roughness:.55,metalness:.19}),12,'environment-low-shore-stones');
  for(let i=0;i<12;i++)at(rocks,i,[(i%2?1:-1)*(4.7+(i%3)*.7),-.29,-3.9+Math.floor(i/2)*1.35],[0,i*.71,0],[.36+(i%3)*.10,.15,.26+(i%4)*.06]);
  motes(64,.28);
 }
 for(const instance of instances){instance.instanceMatrix.needsUpdate=true;if(instance.instanceColor)instance.instanceColor.needsUpdate=true;}
 const movingInstances=new Set(motions.map(motion=>motion.object));
 function update(time,dt,{active=false,reducedMotion=false,palette}={}){
  if(disposed)return;group.visible=supported&&!!active;if(!group.visible)return;
  const clock=reducedMotion?0:finite(time);for(const uniform of clocks)uniform.value=clock;
  for(const motion of motions){dummy.position.fromArray(motion.position);dummy.rotation.set(motion.rotation[0],motion.rotation[1],motion.rotation[2]+(reducedMotion?0:Math.sin(clock*.44+motion.phase)*motion.amount));dummy.scale.fromArray(motion.scale);dummy.updateMatrix();motion.object.setMatrixAt(motion.index,dummy.matrix);}
  for(const instance of movingInstances)instance.instanceMatrix.needsUpdate=true;
  const supplied=Array.isArray(palette)?palette[0]:palette?.pollen??palette?.accent??palette?.high??palette?.primary??palette?.color;
  if(supplied?.isColor&&[supplied.r,supplied.g,supplied.b].every(Number.isFinite)||typeof supplied==='number'&&Number.isFinite(supplied)||typeof supplied==='string'&&/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(supplied)){
   paletteColor.set(supplied);for(const target of accentTargets)target.copy(paletteColor).lerp(color.set('#bed1cc'),.80);
  }
 }
 function dispose(){if(disposed)return;disposed=true;group.visible=false;for(const instance of instances)instance.dispose();for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();group.clear();}
 return {group,update,dispose};
}
