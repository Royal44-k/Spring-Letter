import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Original, tileable linen grain. Both maps are local data, with mipmaps so
// their fine weave settles into a soft surface at the travelling camera scale.
function wovenLinen(){
 const size=128,heights=new Float32Array(size*size),color=new Uint8Array(size*size*4),normal=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const warp=Math.cos(x*Math.PI/2),weft=Math.cos(y*Math.PI/2),over=(Math.floor(x/2)+Math.floor(y/2))%2;
  const slub=Math.sin(x*Math.PI/16+y*Math.PI/32)*Math.sin(y*Math.PI/16);
  heights[y*size+x]=(over?warp:weft)*.45+slub*.12;
  const shade=Math.round(239+slub*6+(warp+weft)*2),i=(y*size+x)*4;
  color[i]=color[i+1]=color[i+2]=shade;color[i+3]=255;
 }
 const height=(x,y)=>heights[((y+size)%size)*size+(x+size)%size];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const nx=(height(x-1,y)-height(x+1,y))*.28,ny=(height(x,y-1)-height(x,y+1))*.28,length=Math.hypot(nx,ny,1),i=(y*size+x)*4;
  normal[i]=Math.round((nx/length*.5+.5)*255);normal[i+1]=Math.round((ny/length*.5+.5)*255);normal[i+2]=Math.round((1/length*.5+.5)*255);normal[i+3]=255;
 }
 const map=new THREE.DataTexture(color,size,size),normalMap=new THREE.DataTexture(normal,size,size);
 map.colorSpace=THREE.SRGBColorSpace;
 for(const texture of [map,normalMap]){texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,3);texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=2;texture.needsUpdate=true;}
 map.name='courier-linen-grain';normalMap.name='courier-linen-weave';return {map,normalMap};
}

function sewnLine(points,radius=.003){
 return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),Math.max(4,points.length*2),radius,4,false);
}

/** Mi: a seed-born courier, wearing the first petal that sheltered them. */
export function createCourier(){
 const group=new THREE.Group();group.name='mi-the-spring-courier';
 const fabric=wovenLinen(),materials=new Set(),geometries=new Set();
 const material=(name,color,options={})=>{const m=new THREE.MeshStandardMaterial({name,color,roughness:.92,metalness:0,envMapIntensity:.3,...options});materials.add(m);return m;};
 const cloth=material('courier-oat-linen','#c4b79e',{...fabric,normalScale:new THREE.Vector2(.24,.24),side:THREE.DoubleSide});
 const cloak=cloth.clone();cloak.name='courier-pieced-cloak';cloak.vertexColors=true;materials.add(cloak);
 const rose=material('courier-dusty-mallow','#987786',{...fabric,normalScale:new THREE.Vector2(.2,.2),side:THREE.DoubleSide});
 const moss=material('courier-moss-canvas','#667c69',{...fabric,normalScale:new THREE.Vector2(.2,.2)});
 const ink=material('courier-quiet-face','#293b42',{roughness:.86});
 const gold=material('courier-worn-brass','#a18b60',{roughness:.67,metalness:.36,envMapIntensity:.55});
 const eyeMaterial=new THREE.MeshBasicMaterial({name:'courier-warm-eyes',color:'#cbbd98'});materials.add(eyeMaterial);
 const nibMaterial=material('courier-pen-light','#bd9d70',{roughness:.6,metalness:.15,emissive:'#ad8962',emissiveIntensity:.12});
 const add=(geometry,material,position,parent=group)=>{const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const merge=(parts,mat,parent,name)=>{const geometry=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());const mesh=add(geometry,mat,[0,0,0],parent);mesh.name=name;return mesh;};
 const body=new THREE.Group();body.name='courier-body';group.add(body);
 const bootMaterial=material('courier-soft-boots','#475c57',{roughness:.96});
 const feet=[-.105,.105].map((x,i)=>{const foot=add(new THREE.CapsuleGeometry(.045,.13,4,8),bootMaterial,[x,-.04,.035],body);foot.name=`courier-boot-${i}`;foot.rotation.x=.18;return foot;});
 const arms=[-1,1].map((side,i)=>{const arm=add(new THREE.CapsuleGeometry(.045,.24,4,8),cloth,[side*.19,.46,.035],body);arm.name=`courier-sleeve-${i}`;arm.rotation.z=side*.24;
  const cuff=add(new THREE.TorusGeometry(.042,.003,4,16),moss,[0,-.105,0],arm);cuff.rotation.x=Math.PI/2;cuff.name=`courier-cuff-${i}`;return arm;});
 const capeGeometry=new THREE.BufferGeometry(),positions=[],indices=[],uv=[],colors=[],cream=new THREE.Color(0xffffff),sage=new THREE.Color('#8daa94'),hem=new THREE.Color('#75836d'),shade=new THREE.Color();
 const capePoint=(t,a)=>{const r=.1+Math.pow(t,.85)*.28,fold=Math.sin(a*7)*.018*t;return [Math.sin(a)*(r+fold),.62-t*.6+Math.cos(a*3)*.04*t,Math.cos(a)*(r+fold)];};
 for(let y=0;y<=18;y++)for(let x=0;x<=36;x++){
  const t=y/18,a=.5+x/36*(Math.PI*2-1);
  positions.push(...capePoint(t,a));uv.push(x/36,y/18);
  const panel=Math.pow(Math.max(0,Math.cos(a-3.3)),7)*.65;
  shade.copy(cream).lerp(sage,panel).lerp(hem,THREE.MathUtils.smoothstep(t,.87,1)*.6);
  shade.multiplyScalar(.97+Math.cos(a*7)*.025*t);colors.push(shade.r,shade.g,shade.b);
  if(y<18&&x<36){const n=y*37+x;indices.push(n,n+37,n+1,n+1,n+37,n+38);}
 }
 capeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));capeGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));capeGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));capeGeometry.setIndex(indices);capeGeometry.computeVertexNormals();
 const cape=add(capeGeometry,cloak,[0,0,0],body);cape.name='courier-petal-cloak';
 const capeSeams=[];
 // Inset stitching follows the existing shell; the silhouette and hem vertices
 // are unchanged, and all small details share a single draw on this garment.
 for(const a of [.53,2.68,3.91,Math.PI*2-.53]){
  const points=[];for(let i=1;i<13;i++){const p=capePoint(i/13,a);p[0]*=1.003;p[2]*=1.003;points.push(p);}
  capeSeams.push(sewnLine(points,.002));
 }
 const hemLine=[];for(let i=0;i<=32;i++)hemLine.push(capePoint(.965,.52+i/32*(Math.PI*2-1.04)));
 capeSeams.push(sewnLine(hemLine,.003));merge(capeSeams,moss,cape,'courier-cloak-seams');
 const inner=add(new THREE.ConeGeometry(.18,.53,14),rose,[0,.29,0],body);
 const head=add(new THREE.SphereGeometry(.17,24,18),cloth,[0,.76,0],body);head.name='courier-seed-hood';head.scale.set(1,1.12,1);
 const face=add(new THREE.SphereGeometry(.133,20,14),ink,[0,.755,.09],body);face.scale.set(1,.93,.55);
 const eyes=[];for(const x of [-.047,.047]){const eye=add(new THREE.SphereGeometry(.012,8,6),eyeMaterial,[x,.77,.157],body);eye.scale.set(.6,1.25,.5);eyes.push(eye);}
 const bud=add(new THREE.ConeGeometry(.075,.25,12),cloth,[-.035,.98,-.015],body);bud.name='courier-folded-bud';bud.rotation.z=.32;
 const hoodEdge=[];for(let i=0;i<=24;i++){const a=.18+i/24*(Math.PI*2-.36);hoodEdge.push([Math.sin(a)*.14,.755+Math.cos(a)*.133,.111]);}
 const hoodStitch=merge([sewnLine(hoodEdge,.004)],moss,body,'courier-hood-binding');
 const sash=add(new THREE.TorusGeometry(.115,.017,5,24),gold,[0,.59,0],body);sash.rotation.x=Math.PI/2;
 const satchel=new THREE.Group();satchel.name='courier-mail-satchel';satchel.position.set(.04,.4,-.22);satchel.rotation.z=-.18;body.add(satchel);
 const letter=add(new THREE.BoxGeometry(.19,.24,.04),moss,[0,0,0],satchel);letter.name='courier-canvas-mailbag';
 const envelope=add(new THREE.BoxGeometry(.148,.13,.005),cloth,[-.008,.047,-.023],satchel);envelope.rotation.z=.055;envelope.name='courier-folded-letter';
 const seal=add(new THREE.SphereGeometry(.025,12,8),rose,[.003,.025,-.029],satchel);seal.scale.z=.2;
 const bagSeams=[sewnLine([[-.069,.092,-.027],[.003,.025,-.027],[.068,.088,-.027]],.002),sewnLine([[-.079,.005,-.023],[-.079,-.096,-.023],[.077,-.096,-.023],[.077,.005,-.023]],.0025)];
 merge(bagSeams,gold,satchel,'courier-letter-and-pocket-stitch');
 const strapPoints=[[.105,.57,-.066],[.078,.52,-.132],[.04,.48,-.218],[-.025,.35,-.237],[-.10,.28,-.19]];
 const strap=merge([sewnLine(strapPoints,.009)],rose,body,'courier-mailbag-strap');
 const staff=add(new THREE.CylinderGeometry(.012,.016,.7,8),gold,[.29,.36,.06],body);staff.rotation.z=-.15;
 const nib=add(new THREE.OctahedronGeometry(.045),nibMaterial,[.34,.72,.06],body);nib.scale.y=1.6;
 const scarfGeometry=new THREE.PlaneGeometry(.12,.75,2,14);scarfGeometry.translate(0,-.375,0);const scarfBase=scarfGeometry.attributes.position.array.slice();
 const scarf=add(scarfGeometry,rose,[-.12,.58,-.08],body);scarf.name='courier-trailing-scarf';scarf.rotation.x=1.2;scarf.rotation.z=-.25;
 group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});
 let yaw=0;const last=new THREE.Vector3();let initialized=false,disposed=false;
 return {group,update(t,dt,position,writing=false,{dashing=false}={}){
  if(disposed||!Number.isFinite(t)||!Number.isFinite(dt)||dt<0||!position||![position.x,position.y,position.z].every(Number.isFinite))return;
  if(!initialized){last.copy(position);initialized=true;}
  const dx=position.x-last.x,dz=position.z-last.z,speed=Math.min(1,Math.hypot(dx,dz)/Math.max(.001,dt)/3);
  if(speed>.02){const target=Math.atan2(dx,dz);yaw+=Math.atan2(Math.sin(target-yaw),Math.cos(target-yaw))*(1-Math.exp(-dt*12));}
  body.rotation.y=yaw;body.position.y=(dashing?.12:0)+Math.sin(t*(speed>.1?11:2))*(speed>.1?.045:.012);cape.rotation.z=Math.sin(t*8)*speed*.035;
  body.rotation.x=THREE.MathUtils.lerp(body.rotation.x,dashing?.16:speed*.055,1-Math.exp(-dt*9));
  feet.forEach((foot,i)=>{foot.position.z=.035+Math.sin(t*(dashing?15:10)+i*Math.PI)*speed*.12;foot.position.y=-.06+Math.max(0,Math.cos(t*10+i*Math.PI))*speed*.07;foot.rotation.x=Math.sin(t*10+i*Math.PI)*speed*.55;});
  arms.forEach((arm,i)=>{arm.rotation.x=Math.sin(t*10+i*Math.PI)*speed*.3;arm.rotation.z=(i?1:-1)*(dashing?.72:.22);});
  const blink=t%4.7>4.52?.13:1.25;eyes.forEach(eye=>eye.scale.y=blink);head.rotation.z=Math.sin(t*.85)*.028;
  // The carried letter and folded tip lag the step without altering the feet,
  // body bounce, cape swing or any scene-space support/placement coordinates.
  satchel.rotation.x=THREE.MathUtils.lerp(satchel.rotation.x,Math.sin(t*10-.8)*speed*.035,1-Math.exp(-dt*7));
  satchel.rotation.z=THREE.MathUtils.lerp(satchel.rotation.z,-.18+Math.sin(t*10-1.2)*speed*.025,1-Math.exp(-dt*7));
  bud.rotation.z=.32+(.5+.5*Math.sin(t*5-.6))*speed*.018;
  staff.rotation.z=writing?-.45+Math.sin(t*3)*.08:-.15;nib.material.color.set(writing?'#b98caa':'#bd9d70');
  const a=scarfGeometry.attributes.position.array;for(let i=0;i<a.length;i+=3){const along=-scarfBase[i+1]/.75;a[i+2]=Math.sin(along*5-t*3)*.05*along*(1+speed);a[i]=scarfBase[i]+Math.sin(along*3-t*2)*.035*along;}
  scarfGeometry.attributes.position.needsUpdate=true;last.copy(position);
 },dispose(){if(disposed)return;disposed=true;for(const geometry of geometries)geometry.dispose();for(const m of materials)m.dispose();fabric.map.dispose();fabric.normalMap.dispose();group.removeFromParent();group.clear();}};
}
