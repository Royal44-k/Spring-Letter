import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export const TAU=Math.PI*2;
export const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
export const bounded=(value,min=0,max=1)=>Math.max(min,Math.min(max,finite(value,min)));
export function random(seed=19073){return()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}

export function surface(rows,columns,point){
 const positions=[],uv=[],indices=[];
 for(let row=0;row<=rows;row++)for(let column=0;column<=columns;column++){
  positions.push(...point(row/rows,column/columns));uv.push(column/columns,row/rows);
 }
 for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
  const a=row*(columns+1)+column,b=a+columns+1;indices.push(a,b,a+1,b,b+1,a+1);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 // Curved leaf tips can converge at a pole. Their finite fallback avoids a zero
 // lighting normal without adding a second competing skin to the leaf.
 const normal=geometry.attributes.normal;
 for(let i=0;i<normal.count;i++)if(normal.getX(i)**2+normal.getY(i)**2+normal.getZ(i)**2<1e-12)normal.setXYZ(i,0,1,0);
 return geometry;
}

export function transformed(geometry,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=sx,sz=sx){
 geometry.scale(sx,sy,sz);geometry.rotateX(rx);geometry.rotateY(ry);geometry.rotateZ(rz);geometry.translate(x,y,z);return geometry;
}
export function combine(parts){
 if(!parts.length)return new THREE.BufferGeometry();
 // All local authors use position/normal/uv; strip accidental extras before
 // merging rather than silently dropping an entire architectural material.
 const normalized=parts.map(g=>{for(const k of Object.keys(g.attributes))if(!['position','normal','uv'].includes(k))g.deleteAttribute(k);return g.index?g.toNonIndexed():g;});
 const geometry=mergeGeometries(normalized,false);new Set([...parts,...normalized]).forEach(g=>g.dispose());geometry.computeBoundingSphere();return geometry;
}
export function tube(points,radius=.04,segments=20,sides=6){
 return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,radius,sides,false);
}
export function blade(length=1,width=.2,bend=.3,rows=10,columns=4,twist=0){
 return surface(rows,columns,(u,v)=>{
  const taper=Math.pow(Math.max(0,Math.sin(u*Math.PI)),.8),w=(v*2-1)*width*taper;
  return [w+twist*u*u,bend*u*u+.045*taper*(1-(v*2-1)**2),length*u];
 });
}
export function fernGeometry(){
 const parts=[tube([[0,0,0],[0,.2,.65],[0,.4,1.5],[0,.46,2.3]],.018,14,4)];
 for(let i=0;i<10;i++)for(const side of [-1,1]){
  const f=i/10,z=.2+f*1.9,length=.52*Math.sin((f*.83+.12)*Math.PI);
  parts.push(transformed(blade(length,.085,.06,5,2),0,.08+f*.4,z,-.14,side*(1.25-f*.25),0));
 }
 return combine(parts);
}
export function broadLeafGeometry(){
 return surface(14,8,(u,v)=>{
  const across=v*2-1,edge=Math.pow(Math.max(0,Math.sin(u*Math.PI)),.68),split=1-.17*Math.pow(Math.abs(across),5)*(.5+.5*Math.cos(u*55));
  return [across*.62*edge*split,.25*Math.sin(u*Math.PI)+.2*u*u-.15*Math.abs(across)*edge,u*2.6];
 });
}
export function orchidGeometry(kind=0){
 const petals=[],stem=[],heart=[];
 // Three long sepals, two rounded lateral wings and a folded lower lip give
 // each blossom an orchid silhouette, independent of the old sea flowers.
 for(let i=0;i<3;i++)petals.push(transformed(blade(.48,.10,.14,8,4),0,1,0,-.8,i*TAU/3+.35,0));
 for(const side of [-1,1])petals.push(transformed(blade(.42,.22,.2,9,5),0,1,.025,-.5,side*1.35,0));
 petals.push(transformed(surface(10,6,(u,v)=>{const w=(v*2-1)*(.05+Math.sin(u*Math.PI)*.15);return [w,1-.27*u+.12*u*u,.08+u*.37];}),0,0,0));
 stem.push(tube([[0,0,0],[.03,.5,-.04],[0,1,0]],.018,12,5));
 for(const side of [-1,1])stem.push(transformed(blade(.7,.15,.18,8,3),0,.08,0,-.3,side*1.1,0));
 heart.push(transformed(new THREE.SphereGeometry(.06,8,6),0,1.015,.11,0,0,0,1,.55,1.15));
 if(kind===1)for(const side of [-1,1])petals.push(transformed(blade(.25,.07,-.13,7,3),side*.1,1,.1,.4,side*.5,0));
 if(kind===2)petals.forEach(g=>g.scale(.85,1.1,.88));
 return {petals:combine(petals),green:combine(stem),heart:combine(heart)};
}
export function cupFlowerGeometry(){
 const petals=[],green=[],heart=[];
 for(let i=0;i<5;i++)petals.push(transformed(surface(6,4,(u,v)=>{const a=(v-.5)*1.23,r=.08+.26*u;return [Math.sin(a)*r,.76+u*.23+Math.sin(u*Math.PI)*.07,Math.cos(a)*r];}),0,0,0,0,i*TAU/5));
 green.push(tube([[0,0,0],[.02,.4,0],[0,.78,0]],.012,8,4));
 for(const side of [-1,1])green.push(transformed(blade(.43,.105,.1,6,3),0,.16,0,-.35,side*1.7));
 heart.push(transformed(new THREE.SphereGeometry(.085,6,4),0,.79,0,0,0,0,1,.4,1));
 return{petals:combine(petals),green:combine(green),heart:combine(heart)};
}
export function nightFlowerGeometry(){
 const petals=[],green=[],heart=[];
 green.push(tube([[0,0,0],[-.08,.7,0],[0,1.2,0]],.016,10,4));
 for(let i=0;i<6;i++)petals.push(transformed(blade(.4,.085,-.2,8,3),0,1.2,0,-.5,i*TAU/6));
 for(const y of [.15,.45])for(const side of [-1,1])green.push(transformed(blade(.65,.045,.3,7,2),0,y,0,-.6,side*1.6));
 heart.push(transformed(new THREE.SphereGeometry(.06,8,5),0,1.23,0));return{petals:combine(petals),green:combine(green),heart:combine(heart)};
}
export function plumeGeometry(){
 const green=[tube([[0,0,0],[.1,.65,0],[.25,1.5,0]],.008,8,4)],tips=[];
 // Dense, rounded seed heads read as soft grass at travel distance. The earlier
 // exposed side twigs looked like white ribs instead of a living inflorescence.
 for(let i=0;i<3;i++)tips.push(transformed(surface(9,7,(u,v)=>{const a=v*TAU,w=Math.sin(u*Math.PI)*.065*(1+.12*Math.sin(u*39));return [.12+u*.13+Math.cos(a)*w,.83+u*.65,Math.sin(a)*w*.7];}),i*.055,-i*.13,i*.025,0,0,(i-1)*.12));
 for(let i=0;i<3;i++)green.push(transformed(blade(.78,.04,.15,6,2),0,.05,0,-.9,i*2.3));return{green:combine(green),tips:combine(tips)};
}

export function erodedRock(seed=1,detail=1){
 const geometry=new THREE.IcosahedronGeometry(1,detail),positions=geometry.attributes.position;
 for(let i=0;i<positions.count;i++){
  const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i),r=1+.13*Math.sin(x*5+y*3+seed)*Math.cos(z*4-seed)+.07*Math.sin(y*11+x*2);
  positions.setXYZ(i,x*r,y*r,z*r);
 }geometry.computeVertexNormals();return geometry;
}

export function brokenColumn(radius,height,seed=1){
 const side=surface(7,16,(u,v)=>{const a=v*TAU,r=radius*(1-u*.09+.035*Math.sin(a*6+u*4));return [Math.cos(a)*r,u*height+Math.pow(u,8)*.22*Math.sin(a*3+seed),Math.sin(a)*r];});
 const top=surface(2,16,(u,v)=>{const a=-v*TAU,r=radius*.91*u;return[Math.cos(a)*r,height+u*.22*Math.sin(a*3+seed),Math.sin(a)*r];});
 return combine([side,top]);
}

export function mountainRidge(width=140,height=17,seed=1){
 return surface(12,64,(u,v)=>{
  const x=(v-.5)*width,crest=height*(.68+.19*Math.sin(v*9+seed)+.16*Math.sin(v*23+seed*.7)+.06*Math.sin(v*53));
  const ridge=Math.pow(Math.max(0,Math.sin(u*Math.PI)),1.3);
  return[x,-7+crest*ridge,-u*32+Math.sin(v*8+seed)*3];
 });
}

// Original local material grains. They provide real PBR surface variation, not
// image backdrops, and require no canvas, network assets or runtime downloads.
export function mineralTextures(builder,kind='soil'){
 const size=128,colorData=new Uint8Array(size*size*4),normalData=new Uint8Array(size*size*4),roughData=new Uint8Array(size*size*4);
 const field=(x,y)=>{const a=x/size*TAU,c=y/size*TAU;return Math.sin(a*3+Math.sin(c*2)*.7)*.42+Math.cos(c*5+a*2)*.26+Math.sin(a*13-c*9)*.17+Math.cos(a*31+c*27)*.09;};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const value=field(x,y),fine=((Math.imul(x+11,7349)^Math.imul(y+17,3151))>>>0)%41/40,index=(y*size+x)*4;
  const tone=Math.round(224+value*17+fine*12),rough=Math.round(207+fine*39),nx=(field(x+1,y)-field(x-1,y))*.8,ny=(field(x,y+1)-field(x,y-1))*.8,len=Math.hypot(nx,ny,1);
  colorData.set([tone,tone,tone,255],index);normalData.set([Math.round(127.5*(1-nx/len)),Math.round(127.5*(1-ny/len)),Math.round(127.5*(1+1/len)),255],index);roughData.set([rough,rough,rough,255],index);
 }
 const make=(data,name,srgb=false)=>{const map=new THREE.DataTexture(data,size,size);map.name=`atlas-${kind}-${name}`;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(kind==='soil'?11:5,kind==='soil'?15:6);map.magFilter=THREE.LinearFilter;map.minFilter=THREE.LinearMipmapLinearFilter;map.generateMipmaps=true;if(srgb)map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;builder.textures.add(map);return map;};
 return{map:make(colorData,'grain',true),normalMap:make(normalData,'normal'),roughnessMap:make(roughData,'roughness'),normalScale:new THREE.Vector2(kind==='soil'?.28:.24,kind==='soil'?.28:.24)};
}

export function makeBuilder(id){
 const group=new THREE.Group();group.name=`atlas-${id}`;group.visible=false;group.userData.location=id;
 const materials=new Set(),textures=new Set(),landmarks=[],dynamic=[],quality=[];
 const material=(name,color,options={})=>{const m=new THREE.MeshStandardMaterial({name,color,roughness:.83,metalness:0,...options});materials.add(m);return m;};
 const mesh=(geometry,mat,name,position=[0,0,0],parent=group)=>{
  const object=new THREE.Mesh(geometry,mat);object.name=name;object.position.set(...position);object.castShadow=!mat.transparent;object.receiveShadow=true;parent.add(object);return object;
 };
 const batch=(parts,mat,name,parent=group)=>mesh(combine(parts),mat,name,[0,0,0],parent);
 const instances=(geometry,mat,placements,name)=>{
  const object=new THREE.InstancedMesh(geometry,mat,placements.length),dummy=new THREE.Object3D();
  for(const [i,p]of placements.entries()){
   dummy.position.set(p.x||0,p.y||0,p.z||0);dummy.rotation.set(p.rx||0,p.ry||0,p.rz||0);dummy.scale.set(p.sx??p.s??1,p.sy??p.s??1,p.sz??p.s??1);dummy.updateMatrix();object.setMatrixAt(i,dummy.matrix);if(p.color)object.setColorAt(i,new THREE.Color(p.color));
  }
  object.name=name;object.castShadow=false;object.receiveShadow=true;object.instanceMatrix.needsUpdate=true;object.computeBoundingSphere();group.add(object);return object;
 };
 const landmark=name=>{landmarks.push(name);const object=new THREE.Group();object.name=name;group.add(object);return object;};
 const walk=object=>{object.userData.atlasWalkSurface=true;object.userData.location=id;object.castShadow=false;return object;};
 const lights=(color,sky,ground,intensity=2)=>{
  const sun=new THREE.DirectionalLight(color,intensity);sun.name=`${id}-key-light`;sun.position.set(-13,22,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-13,right:13,top:13,bottom:-13,near:.5,far:65});sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;sun.shadow.radius=3;
  const fill=new THREE.HemisphereLight(sky,ground,.8);fill.name=`${id}-ambient-light`;group.add(sun,sun.target,fill);return sun;
 };
 const label=(title,x,y,z,mat)=>{
  const parent=landmark(`${id}-inscription-${title}`);parent.position.set(x,y,z);
  mesh(new THREE.BoxGeometry(.045,1.05,.045),mat,'label-post',[0,.52,0],parent);
  mesh(new THREE.BoxGeometry(.8,.38,.055),mat,'engraved-letter-plaque',[0,1.03,0],parent);
  // The actual note is accessible in the controller. A small canvas text sign
  // remains a real scene object; CPU construction needs no DOM or native canvas.
  if(typeof document!=='undefined'){
   const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const context=canvas.getContext('2d');
   if(context){context.fillStyle='#eadcc0';context.fillRect(0,0,512,192);context.fillStyle='#3c4b43';context.font='30px serif';context.textAlign='center';context.fillText(title,256,85);context.font='20px serif';context.fillText('岑 · 途中手记',256,132);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.add(map);const textMaterial=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide});materials.add(textMaterial);mesh(new THREE.PlaneGeometry(.73,.30),textMaterial,'readable-note',[0,1.03,.03],parent);}
  }
  return parent;
 };
 return{group,material,mesh,batch,instances,landmark,walk,lights,label,materials,textures,landmarks,dynamic,quality};
}

export function addFlora(builder,geometry,placements,palette,name){
 const result={};for(const [part,shape]of Object.entries(geometry)){
  result[part]=builder.instances(shape,palette[part]||palette.green,placements,`${name}-${part}`);
 }return result;
}

export function makeSwayMaterial(builder,name,color){
 const material=builder.material(name,color,{side:THREE.DoubleSide}),time={value:0},motion={value:1};
 const patch=shader=>{shader.uniforms.atlasTime=time;shader.uniforms.atlasMotion=motion;shader.vertexShader='uniform float atlasTime; uniform float atlasMotion;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  vec3 anchor=vec3(0.);
  #ifdef USE_INSTANCING
  anchor=instanceMatrix[3].xyz;
  #endif
  float tip=max(position.y,0.);transformed.x+=sin(atlasTime*1.1+anchor.x*.41+anchor.z*.22+tip)*tip*.045*atlasMotion;
 `);};
 material.onBeforeCompile=patch;material.customProgramCacheKey=()=>`atlas-botanical-sway-v1`;
 return{material,time,motion};
}
