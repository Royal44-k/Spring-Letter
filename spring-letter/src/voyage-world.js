import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createCourier} from './courier.js';
import {TIDE_STONES,voyageGroundHeight,BOAT_MOORING,JETTY} from './voyage-model.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const TAU=Math.PI*2, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
function presentedBoat(view){
 const source=view.boat||{...BOAT_MOORING,heading:0,speed:0};
 if(view.stage!=='complete')return {...source};
 const age=clamp(view.departureAge,0,86400),drift=clamp(age*.5,0,20);
 return {...source,z:finite(source.z,-179)-drift,heading:finite(source.heading)*Math.exp(-age*.14),speed:age<40?.5:0};
}
// Mirrors OCEAN_VERTEX, including the ocean mesh's -200 Z translation.
function oceanHeight(x,z,t){z+=200;return Math.sin(x*.38+z*.22+t*.6)*.055+Math.sin(x*.12-z*.31-t*.44)*.09+Math.sin(x*.72+z*.8-t*.78)*.019;}
const FLORAL_MOODS={
 'memory+season':{colors:['#dec1cd','#e7e4d6','#a9b9cf','#d7caab'],kinds:['lotus','lily','iris','lotus','dahlia','iris']},
 'memory+voyage':{colors:['#d9ccd0','#ece4cd','#acbfd0','#dfc58e'],kinds:['lily','iris','dahlia','lily','lotus','iris']},
 'season+voyage':{colors:['#e2b8bb','#e9d8ba','#b0b5cd','#dfb878'],kinds:['lotus','dahlia','lily','lotus','iris','dahlia']},
};
function random(seed=31991){return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
function surface(rows,cols,point){
 const p=[],uv=[],ix=[];
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){p.push(...point(y/rows,x/cols));uv.push(x/cols,y/rows);}
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;ix.push(a,b,a+1,b,b+1,a+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;
}
function tube(points,radius=.025,segments=32){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segments,radius,5,false);}
function merge(parts){const g=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());return g;}
function transformed(g,x,y,z,rx=0,ry=0,rz=0,scale=1){g.scale(scale,scale,scale);g.rotateX(rx);g.rotateY(ry);g.rotateZ(rz);g.translate(x,y,z);return g;}
function grainTexture(kind){
 const size=128,data=new Uint8Array(size*size*4),rand=random(17);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let v;
  if(kind==='shore')v=233+Math.sin(x*.14+Math.sin(y*.09)*3)*2.5+Math.sin(y*.22+x*.04)*2+rand()*7;
  else if(kind==='wood')v=218+Math.sin(x*.41+Math.sin(y*.026)*1.4)*13+Math.sin(x*1.8+y*.021)*5+rand()*8;
  else v=237+Math.sin(x*Math.PI)*5+Math.sin(y*Math.PI)*5+rand()*4;
  const i=(y*size+x)*4;data[i]=v;data[i+1]=v;data[i+2]=v;data[i+3]=255;
 }
 const map=new THREE.DataTexture(data,size,size);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(kind==='shore'?9:kind==='wood'?3:4,kind==='shore'?9:kind==='wood'?1:5);map.generateMipmaps=true;map.minFilter=THREE.LinearMipmapLinearFilter;map.needsUpdate=true;return map;
}
// The sea flowers use one continuous curved membrane. At their small rendered
// scale, duplicated upper/lower faces were less reliable than a smooth sheet.
function petal(length,width,lift,tip,twist=0){
 const rows=18,columns=8,count=(rows+1)*(columns+1),p=[],uv=[],color=[],indices=[];
 for(let r=0;r<=rows;r++)for(let c=0;c<=columns;c++){
  const t=r/rows,u=c/columns,v=u*2-1,w=v*width*Math.pow(Math.max(0,Math.sin(Math.PI*t)),.7);
  const z=t*length,y=lift*Math.sin(t*Math.PI*.8)+tip*t*t+w*w/Math.max(.001,width)*.19;
  p.push(w+twist*t*t,y,z);uv.push(u,t);
  const vein=.985+Math.cos(v*18+t*4)*.015,shade=(.84+.16*Math.sin(t*Math.PI*.5))*vein;
  color.push(shade,shade*(.76+.24*t),shade*(.80+.20*t));
 }
 for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
  const a=r*(columns+1)+c,b=a+columns+1;
  indices.push(a,b,a+1,b,b+1,a+1);
 }
 const g=new THREE.BufferGeometry();g.userData.surface={rows,columns,vertices:count,layers:1};g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(color,3));g.setIndex(indices);g.computeVertexNormals();
 const normals=g.attributes.normal;
 // All columns meet at the two tips. Give these coincident vertices one
 // adjacent-row normal instead of letting a degenerate triangle go black.
 for(const row of [0,rows]){const source=(row===0?1:rows-1)*(columns+1)+columns/2;for(let c=0;c<=columns;c++)normals.setXYZ(row*(columns+1)+c,normals.getX(source),normals.getY(source),normals.getZ(source));}
 return g;
}
export const createVoyagePetalGeometry=petal;
function flowerGeometry(kind){
 const petals=[],stems=[],centers=[],leaves=[];
 if(kind==='lotus'){
  const rings=[{n:10,r:.17,l:.59,w:.17,y:.20,lift:.18,tilt:0},{n:9,r:.08,l:.45,w:.14,y:.33,lift:.27,tilt:-.11},{n:7,r:.035,l:.32,w:.105,y:.46,lift:.30,tilt:-.24}];
  for(let layer=0;layer<rings.length;layer++)for(let i=0;i<rings[layer].n;i++){
   const ring=rings[layer],angle=i/ring.n*TAU+layer*.31,g=petal(ring.l,ring.w,ring.lift,.02);g.translate(0,0,ring.r);
   petals.push(transformed(g,0,ring.y,0,ring.tilt,angle));
  }
  const seedpod=new THREE.SphereGeometry(.12,12,8);seedpod.scale(1,.35,1);centers.push(transformed(seedpod,0,.54,0));
  for(let i=0;i<8;i++)centers.push(transformed(new THREE.SphereGeometry(.013,6,4),Math.sin(i/8*TAU)*.07,.58,Math.cos(i/8*TAU)*.07));
  const pad=surface(8,24,(r,a)=>{a=a*TAU+.15;const radius=r*.7;return [Math.sin(a)*radius,.035+Math.cos(a*3)*.012*r,Math.cos(a)*radius];});leaves.push(pad);
 }else if(kind==='lily'){
  for(let i=0;i<6;i++)petals.push(transformed(petal(.62,.16,.35,-.31),0,.86,0,.12,i/6*TAU));
  for(let i=0;i<6;i++){const a=i/6*TAU;stems.push(tube([[0,.86,0],[Math.sin(a)*.1,1.08,Math.cos(a)*.1]],.008,5));centers.push(transformed(new THREE.SphereGeometry(.022,6,4),Math.sin(a)*.1,1.08,Math.cos(a)*.1,0,0,.4));}
  stems.push(tube([[0,.02,0],[.06,.45,.02],[0,.86,0]],.014,10));
  for(let i=0;i<3;i++)leaves.push(transformed(petal(.49,.07,.14,-.03),.03,.2+i*.15,0,-.3,i*2.5));
 }else if(kind==='iris'){
  for(let i=0;i<3;i++){
   const a=i/3*TAU;petals.push(transformed(petal(.52,.20,.31,-.37),0,.78,0,0,a));
   petals.push(transformed(petal(.43,.17,.32,.12),0,.8,0,-.52,a+.6));
   centers.push(transformed(petal(.22,.035,.06,-.02),0,.82,0,.12,a));
  }
  stems.push(tube([[0,.02,0],[-.04,.4,.03],[0,.78,0]],.014,10));
  for(let i=0;i<4;i++)leaves.push(transformed(petal(.72,.055,.5,0),0,.02,0,-.55,i*2.2));
 }else{
  for(let row=0;row<3;row++)for(let i=0;i<12;i++){const g=petal(.48-row*.1,.075-row*.01,.12+row*.04,-.07);g.translate(0,0,.065-row*.02);petals.push(transformed(g,0,.6+row*.075,0,-row*.2,i/12*TAU+row*.2));}
  centers.push(transformed(new THREE.SphereGeometry(.08,8,6),0,.82,0));
  stems.push(tube([[0,0,0],[.05,.3,0],[0,.6,0]],.012,8));
  for(let i=0;i<3;i++)leaves.push(transformed(petal(.32,.12,.09,0),0,.2+i*.12,0,0,i*2.1));
 }
 return {petals:merge(petals),stems:stems.length?merge(stems):null,centers:merge(centers),leaves:merge(leaves)};
}

const OCEAN_VERTEX=`uniform float uTime;varying vec3 vWorld;varying vec3 vNormal;
float wave(vec2 p){return sin(p.x*.38+p.y*.22+uTime*.6)*.055+sin(p.x*.12-p.y*.31-uTime*.44)*.09+sin(p.x*.72+p.y*.8-uTime*.78)*.019;}
void main(){vec3 p=position;p.y+=wave(p.xz);float e=.16;vNormal=normalize(vec3(wave(p.xz-vec2(e,0.0))-wave(p.xz+vec2(e,0.0)),e*2.0,wave(p.xz-vec2(0.0,e))-wave(p.xz+vec2(0.0,e))));vWorld=(modelMatrix*vec4(p,1.0)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.0);}`;
const OCEAN_FRAGMENT=`uniform float uTime;uniform float uDawn;uniform vec2 uBoat;uniform float uSpeed;
varying vec3 vWorld;varying vec3 vNormal;
void main(){vec2 p=vWorld.xz;vec3 eye=normalize(cameraPosition-vWorld),n=normalize(vNormal);
 float a=sin(p.x*.34+p.y*.18+uTime*.6),b=sin(p.x*.12-p.y*.31-uTime*.44),c=cos(p.x*.72+p.y*.8-uTime*.78);
 n=normalize(vec3(a*.035+b*.017+c*.013,1.0,a*.024-b*.042+c*.014));
 float detail=clamp(1.0-length(cameraPosition.xz-p)/70.0,0.0,1.0);
 n=normalize(n+vec3(sin(p.y*2.1+p.x*.7+a)*.009,0.0,cos(p.x*1.3-p.y*1.2+b)*.008)*detail);
 float fresnel=pow(clamp(1.0-dot(n,eye),0.0,1.0),3.2);
 vec3 deep=mix(vec3(.009,.057,.079),vec3(.025,.12,.14),uDawn),sky=mix(vec3(.16,.29,.34),vec3(.43,.38,.28),uDawn);
 vec3 color=mix(deep,sky,clamp(.18+fresnel*.8,0.0,1.0));
 vec3 sun=normalize(vec3(.05,.12,-1.0));float light=pow(max(dot(reflect(-sun,n),eye),0.0),145.0);
 color+=vec3(1.0,.72,.39)*light*(.3+uDawn*.8);
 float distanceToBoat=length(p-uBoat),behind=max(0.0,p.y-uBoat.y),wakeWidth=.4+behind*.28;
 float wake=exp(-abs(abs(p.x-uBoat.x)-wakeWidth)*7.0)*exp(-behind*.22)*step(0.1,behind)*min(1.0,uSpeed*.5);
 color+=vec3(.30,.39,.34)*wake*(.5+.5*sin(distanceToBoat*9.0-uTime*3.0));
 float ripple=(.5+.5*sin(p.x*.81+p.y*1.06+a*1.7+uTime))*(.5+.5*cos(p.y*1.22-p.x*.58+b*2.1-uTime*.3));
 color+=vec3(.012,.022,.021)*pow(clamp(ripple,0.0,1.0),5.0)*detail;
 float haze=1.0-exp(-length(cameraPosition.xz-p)*.0025);color=mix(color,sky,haze*.55);
 gl_FragColor=vec4(max(color,vec3(0.0)),1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const SKY_VERTEX=`varying vec3 vDirection;void main(){vDirection=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=p.xyww;}`;
const SKY_FRAGMENT=`uniform float uDawn;varying vec3 vDirection;
void main(){vec3 d=normalize(vDirection);float h=clamp(d.y,0.0,1.0);vec3 top=mix(vec3(.055,.14,.23),vec3(.11,.24,.34),uDawn),bottom=mix(vec3(.25,.36,.40),vec3(.74,.47,.24),uDawn);
 vec3 color=mix(bottom,top,smoothstep(0.0,.62,h));vec3 sun=normalize(vec3(.05,.05+uDawn*.055,-1.0));float separation=length(d-sun);float halo=exp(-separation*10.0)*(.13+uDawn*.21);color+=vec3(.8,.45,.17)*halo;
 float disc=1.0-smoothstep(.018,.021,separation);color=mix(color,vec3(1.0,.88,.61),disc*.98);
 float clouds=(sin(d.x*12.0+d.z*3.0)*.5+.5)*(sin(d.x*19.0-d.z*7.0)*.5+.5);color=mix(color,vec3(.56,.59,.57),clouds*.07*exp(-h*8.0));
 gl_FragColor=vec4(color,1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

/** Presentation only: state, earned progress, and collision are owned by the model. */
export function createVoyageWorld(){
 const group=new THREE.Group();group.name='the-shore-that-sends-spring';
 const materials=new Set(),textures=new Set(),rand=random(),matrix=new THREE.Matrix4(),dummy=new THREE.Object3D();
 const material=(color,options={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.79,...options});materials.add(m);return m;};
 const woodMap=grainTexture('wood'),linenMap=grainTexture('linen'),shoreMap=grainTexture('shore');textures.add(woodMap);textures.add(linenMap);textures.add(shoreMap);
 const mat={stone:material('#657671',{map:shoreMap}),lightStone:material('#a6a89d',{map:shoreMap}),sand:material('#b6ad95',{map:shoreMap,roughness:1}),grass:material('#536959'),leaf:material('#66796a',{side:THREE.DoubleSide}),wood:material('#74563b',{map:woodMap}),woodLight:material('#b19666',{map:woodMap}),woodDark:material('#493e31',{map:woodMap}),brass:material('#b7a36b',{metalness:.55,roughness:.38}),paper:material('#f3e7cf',{map:linenMap}),seal:material('#ad6c69',{roughness:.48}),rope:material('#aaa78b'),cloth:material('#c6bfa7',{map:linenMap,side:THREE.DoubleSide,roughness:.98,envMapIntensity:.18}),ink:material('#455f61'),petal:material('#edc9b6',{side:THREE.DoubleSide,roughness:.4}),white:material('#e4e6d4')};
 const roundedBox=(w,h,d)=>new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d)*.17);
 function mesh(g,m,x=0,y=0,z=0,parent=group,name='') {const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function batch(parts,m,parent=group,name=''){return mesh(merge(parts),m,0,0,0,parent,name);}
 const coast=new THREE.Group();coast.name='last-shore-and-letter-island';group.add(coast);
 // Shore land has an irregular, low silhouette; never an upright blocking plane.
 function island(x,z,rx,rz,height,parent=coast){
  const shape=surface(20,72,(r,a)=>{const ang=a*TAU,edge=1+Math.sin(ang*3+.4)*.055+Math.sin(ang*7)*.025;const drop=THREE.MathUtils.smoothstep(r,.97,1);const y=height*(1-drop)-.08;return [Math.sin(ang)*rx*r*edge,y,Math.cos(ang)*rz*r*edge];});
  const positions=shape.attributes.position,uv=shape.attributes.uv;for(let i=0;i<positions.count;i++)uv.setXY(i,positions.getX(i)/14+.5,positions.getZ(i)/14+.5);
  const land=mesh(shape,mat.sand,x,0,z,parent,'rounded-salt-island');
  const bank=surface(3,72,(r,a)=>{const ang=a*TAU,e=1+Math.sin(ang*3+.4)*.055+Math.sin(ang*7)*.025;return [Math.sin(ang)*rx*e*(1+r*.12),-.07-r*.85,Math.cos(ang)*rz*e*(1+r*.12)];});mesh(bank,mat.stone,x,0,z,parent,'island-bank');
  return land;
 }
 island(0,4.2,6.4,7.0,1.04);island(0,-26,6.4,6.4,1.04);
 const rocks=[];
 for(let i=0;i<80;i++){const side=i%2?-1:1,z=i<35?rand()*10-1:-22-rand()*9,x=side*(3.7+rand()*2.1),s=.2+rand()*.7;const g=new THREE.DodecahedronGeometry(s,0);g.scale(1,.42+rand()*.3,.8);g.rotateY(rand()*TAU);g.translate(x,-.15,z);rocks.push(g);}
 batch(rocks,mat.stone,coast,'shore-granite');
 // The exact stones can be replaced by setTideStones by a controller/model import.
 let tideLayout=TIDE_STONES;
 const tidal=new THREE.Group();coast.add(tidal);let stones=[];
 function setTideStones(layout){
  if(!Array.isArray(layout)||!layout.length)return;
  tideLayout=layout.map(s=>({...s,r:s.r??s.radius??1.05,high:!!(s.high||s.safe),height:s.height??(s.high?.95:.36)}));
  tidal.traverse(o=>o.geometry?.dispose());tidal.clear();stones=[];
  tideLayout.forEach((s,i)=>{
   const g=new THREE.CylinderGeometry(s.r*.94,s.r*1.06,s.height+.48,9);g.rotateY(i*.63);const o=mesh(g,mat.stone,s.x,(s.height-.48)/2,s.z,tidal,'tidal-stone-'+i);
   const top=mesh(new THREE.CylinderGeometry(s.r*.87,s.r*.93,.026,9),mat.lightStone,s.x,s.height+.013,s.z,tidal);top.rotation.y=i*.63;
   const shell=mesh(new THREE.TorusGeometry(s.r*.66,.012,4,36,Math.PI*.8),mat.paper,s.x,s.height+.032,s.z,tidal);shell.rotation.x=-Math.PI/2;shell.rotation.z=i*.7;stones.push({base:o,top,shell,high:s.high});
  });
 }
 setTideStones(tideLayout);
 // A weathered writing desk, its tools, and a real folded envelope.
 const desk=new THREE.Group();desk.position.set(0,.9,1);desk.rotation.y=-.1;desk.scale.y=.67;coast.add(desk);
 const deskParts=[];for(let i=0;i<5;i++)deskParts.push(transformed(roundedBox(2.1,.10,.224),0,1.08,(i-2)*.23));
 for(const x of [-.84,.84])for(const z of [-.41,.41])deskParts.push(transformed(roundedBox(.09,1.03,.09),x,.51,z));
 for(const x of [-.84,.84])deskParts.push(transformed(roundedBox(.055,.07,.83),x,.37,0));
 batch(deskParts,mat.wood,desk,'shore-writing-desk');
 mesh(new THREE.BoxGeometry(1.5,.012,.84),mat.paper,-.12,1.14,0,desk,'letter-paper');
 const envelope=mesh(new THREE.BoxGeometry(.67,.025,.43),mat.paper,.27,1.17,-.08,desk,'own-folded-envelope');
 const seams=[tube([[-.07,1.187,-.295],[.27,1.191,-.04],[.60,1.187,-.295]],.006,4),tube([[-.07,1.187,.135],[.15,1.187,-.04]],.004,3),tube([[.60,1.187,.135],[.39,1.187,-.04]],.004,3)];batch(seams,mat.woodLight,desk);
 const wax=mesh(new THREE.CylinderGeometry(.09,.09,.015,20),mat.seal,.27,1.195,-.04,desk,'wax-seal');
 const stamp=new THREE.Group();stamp.position.set(.79,1.14,.25);desk.add(stamp);mesh(new THREE.CylinderGeometry(.085,.09,.055,16),mat.brass,0,.03,0,stamp);mesh(new THREE.CylinderGeometry(.025,.04,.2,12),mat.woodDark,0,.145,0,stamp);mesh(new THREE.SphereGeometry(.052,12,8),mat.woodDark,0,.25,0,stamp);
 mesh(new THREE.CylinderGeometry(.08,.09,.10,16),mat.ink,-.79,1.19,.22,desk);mesh(tube([[-.69,1.17,-.2],[-.32,1.19,-.41]],.012,4),mat.woodLight,0,0,0,desk);
 const benchParts=[transformed(roundedBox(1.2,.1,.34),0,1.41,2.8),transformed(roundedBox(.11,.52,.3),-.47,1.15,2.8),transformed(roundedBox(.11,.52,.3),.47,1.15,2.8)];batch(benchParts,mat.wood,coast,'writing-bench');
 // Old courier shelter is deliberately open on all sides.
 const shelter=new THREE.Group();shelter.position.set(0,.95,-13);coast.add(shelter);
 const posts=[];for(const x of [-.97,.97])for(const z of [-.65,.65])posts.push(transformed(new THREE.CylinderGeometry(.045,.06,2.5,8),x,1.2,z));
 posts.push(tube([[-1.1,2.34,0],[0,2.65,0],[1.1,2.34,0]],.06,8));batch(posts,mat.wood,shelter,'old-mail-shelter-posts');
 const roof=surface(8,20,(t,u)=>{const x=(u*2-1)*1.23;return [x,2.68-Math.abs(x)*.3+Math.sin(t*Math.PI)*.03,(t-.5)*1.65];});mesh(roof,mat.cloth,0,0,0,shelter,'shelter-canvas');
 mesh(new THREE.BoxGeometry(.12,.63,.12),mat.woodDark,0,.31,0,shelter);mesh(new THREE.BoxGeometry(.7,.13,.55),mat.woodDark,0,.69,0,shelter,'predecessor-letter-box');mesh(new THREE.BoxGeometry(.62,.055,.47),mat.woodLight,0,.80,0,shelter);
 const oldLetter=mesh(new THREE.BoxGeometry(.43,.025,.29),mat.paper,0,.85,0,shelter,'cens-unposted-letter');oldLetter.rotation.y=.13;
 mesh(new THREE.CylinderGeometry(.045,.045,.008,16),mat.seal,0,.869,0,shelter);
 const lantern=new THREE.Group();lantern.position.set(-.65,1.65,0);shelter.add(lantern);
 mesh(new THREE.CylinderGeometry(.12,.14,.27,8),mat.paper,0,0,0,lantern);mesh(new THREE.CylinderGeometry(.145,.145,.02,8),mat.brass,0,.145,0,lantern);mesh(new THREE.CylinderGeometry(.145,.145,.02,8),mat.brass,0,-.145,0,lantern);
 mesh(tube([[0,.16,0],[0,.45,0]],.007,2),mat.brass,0,0,0,lantern);
 // Low, bent maritime pines frame the island; the player's route remains open.
 const trunks=[],needles=[],grasses=[];
 for(const [x,z,scale]of [[-3.6,-25,1.4],[3.4,-23.6,.92],[-3.9,5.4,1.3],[4.8,6.1,.8]]){
  trunks.push(tube([[x,.16,z],[x+.15,1.4*scale,z-.15],[x+.6,2.7*scale,z-.35]],.10*scale,12));
  for(let j=0;j<3;j++){const h=(1.6+j*.51)*scale;trunks.push(tube([[x+.1,h-.35,z],[x+(j%2?-1:1)*.8*scale,h,z-.2]],.035*scale,5));for(let k=0;k<5;k++){const a=k/5*TAU,g=new THREE.IcosahedronGeometry((.38+rand()*.12)*scale,1);g.scale(1.25,.47,1);g.rotateY(rand()*TAU);g.translate(x+(j%2?-.7:.6)*scale+Math.cos(a)*.45*scale,h+.12+rand()*.12,z-.25+Math.sin(a)*.35*scale);needles.push(g);}}
 }
 batch(trunks,mat.woodDark,coast,'salt-bent-pines').position.y=.72;batch(needles,mat.grass,coast,'open-pine-canopies').position.y=.72;
 for(let i=0;i<250;i++){
  const ang=rand()*TAU,r=2.5+rand()*2.0,x=Math.cos(ang)*r,z=(i%2?-26:4)+Math.sin(ang)*r;
  const h=.12+rand()*.35;for(let j=0;j<3;j++)grasses.push(surface(2,1,(t,u)=>[x+(u-.5)*.025*(1-t)+Math.sin(j*2)*t*t*.15,.17+t*h,z+Math.cos(j*2)*t*t*.15]));
 }
 batch(grasses,mat.leaf,coast,'wind-combed-shore-grass').position.y=.68;
 // A little jetty points into open water. Its low rails do not enclose the camera.
 const dockParts=[],jettyLength=JETTY.maxX-JETTY.minX,jettyWidth=JETTY.maxZ-JETTY.minZ,jettyZ=(JETTY.minZ+JETTY.maxZ)/2,plankStep=jettyLength/10;
 for(let i=0;i<10;i++)dockParts.push(transformed(new THREE.BoxGeometry(plankStep-.012,.08,jettyWidth),JETTY.minX+(i+.5)*plankStep,JETTY.height+.02,jettyZ));
 for(const x of [JETTY.minX+.2,JETTY.maxX-.15])for(const z of [JETTY.minZ+.07,JETTY.maxZ-.07])dockParts.push(transformed(new THREE.CylinderGeometry(.055,.075,1.35,8),x,.52,z));
 batch(dockParts,mat.woodLight,coast,'island-jetty');

 const boat=new THREE.Group();boat.name='cens-little-post-boat';boat.position.set(BOAT_MOORING.x,0,BOAT_MOORING.z);group.add(boat);
 const hullParts=[],ribs=[],railParts=[],deckParts=[];
 const halfWidth=z=>{const t=clamp((z+2.75)/5.25);return Math.max(.02,Math.sin(Math.PI*t)*.86*(.85+.15*t)+THREE.MathUtils.smoothstep(t,.62,1)*.31);};
 for(const side of [-1,1])for(let row=0;row<7;row++){
  const g=surface(32,2,(t,u)=>{const z=t*5.25-2.75,q=(row+u)/7,width=halfWidth(z)*(.25+.75*Math.sin(q*Math.PI*.5));return [side*width,-.20+q*.83+Math.pow(Math.abs((t-.5)*2),3)*.17,z];});hullParts.push(g);
  const line=[];for(let i=0;i<=24;i++){const t=i/24,z=t*5.25-2.75,q=(row+.96)/7;line.push([side*(halfWidth(z)*(.25+.75*Math.sin(q*Math.PI*.5))+.008),-.20+q*.83+Math.pow(Math.abs((t-.5)*2),3)*.17,z]);}railParts.push(tube(line,.009,24));
 }
 const hullMaterial=material('#8d7655',{map:woodMap,side:THREE.DoubleSide,roughness:.67});batch(hullParts,hullMaterial,boat,'seven-strake-carvel-hull');
 mesh(surface(8,8,(t,u)=>[(u*2-1)*(.08+t*.23),-.20+t*1.0,2.5]),hullMaterial,0,0,0,boat,'flat-stern-transom');
 for(let j=0;j<9;j++){
  const z=-2.3+j*.52,w=halfWidth(z)*.87;
  ribs.push(tube([[-w,.55,z],[-w*.6,.04,z],[0,-.10,z],[w*.6,.04,z],[w,.55,z]],.035,12));
 }
 for(const side of [-1,1]){const p=[];for(let i=0;i<=32;i++){const z=i/32*5.25-2.75;p.push([side*halfWidth(z),.65+Math.pow(Math.abs((i/32-.5)*2),3)*.17,z]);}railParts.push(tube(p,.035,32));}
 batch(ribs,mat.woodDark,boat,'boat-ribs');batch(railParts,mat.woodLight,boat,'boat-gunwales-and-plank-seams');
 for(let i=0;i<5;i++){const x=(i-2)*.18;deckParts.push(transformed(new THREE.BoxGeometry(.17,.045,3.3),x,.11,-.1));}
 for(const z of [-1.45,.3,1.45])deckParts.push(transformed(new THREE.BoxGeometry(halfWidth(z)*1.8,.08,.33),0,.46,z));
 batch(deckParts,mat.woodLight,boat,'benches-and-floorboards');
 mesh(tube([[0,-.18,-2.8],[0,.88,-2.7]],.06,6),mat.woodDark,0,0,0,boat,'bow-stem');
 mesh(new THREE.BoxGeometry(.1,.62,.55),mat.woodDark,0,.04,2.65,boat,'rudder');
 const tiller=mesh(new THREE.CylinderGeometry(.025,.035,.85,8),mat.woodLight,0,.46,2.1,boat,'tiller');tiller.rotation.x=Math.PI/2;
 const mast=mesh(new THREE.CylinderGeometry(.035,.066,4.7,12),mat.woodLight,0,2.48,-.7,boat,'mast');
 const mastRopes=[tube([[0,4.75,-.7],[-.75,.66,.8]],.009,2),tube([[0,4.75,-.7],[.75,.66,.8]],.009,2),tube([[0,4.75,-.7],[0,.82,-2.65]],.009,2)];batch(mastRopes,mat.rope,boat,'standing-rigging');
 const sailRig=new THREE.Group();sailRig.position.set(0,1.0,-.7);boat.add(sailRig);
 const sailGeometry=surface(30,18,(t,u)=>{const width=(1-t)*2.20;return [Math.sin(u*Math.PI)*Math.sin(t*Math.PI*.85)*.34,t*3.65,u*width];});
 const sailMesh=mesh(sailGeometry,mat.cloth,0,0,0,sailRig,'billowing-linen-mainsail'),sailBase=sailGeometry.attributes.position.array.slice();
 mesh(tube([[0,0,0],[0,0,2.27]],.028,4),mat.woodLight,0,0,0,sailRig,'boom');
 const sailSeams=[];for(let j=1;j<6;j++){const t=j/6,line=[];for(let i=0;i<=14;i++){const u=i/14;line.push([Math.sin(u*Math.PI)*Math.sin(t*Math.PI*.85)*.34+.006,t*3.65,u*(1-t)*2.2]);}sailSeams.push(tube(line,.0035,14));}batch(sailSeams,mat.rope,sailRig,'hand-sewn-sail-panels');
 // The sail bears an appliqué flower made from cloth, rather than a UI symbol.
 const applique=[];for(let i=0;i<6;i++){const g=petal(.35,.09,.01,0);g.rotateX(Math.PI/2);g.rotateY(i/6*TAU);g.rotateZ(Math.PI/2);g.translate(.29,1.3,.63);applique.push(g);}const emblem=batch(applique,mat.seal,sailRig,'stitched-spring-on-canvas');emblem.scale.set(.15,1,1);emblem.position.x=.24;
 const foresail=mesh(surface(20,12,(t,u)=>[Math.sin(u*Math.PI)*Math.sin(t*Math.PI)*-.15,.9+t*3.8,-.7-(1-t)*u*1.75]),mat.cloth,0,0,0,boat,'small-foresail');
 const riggingRopes=[[-.7,.68,1.6],[.7,.68,1.6]].map((p,i)=>mesh(tube([p,[p[0]*1.4,.35,2.05],[i?1.15:-1.15,.22,2.2]],.021,10),mat.rope,0,0,0,boat,'mooring-rope-'+i));
 const ropeCoils=[];for(let i=0;i<3;i++)ropeCoils.push(transformed(new THREE.TorusGeometry(.13+i*.017,.012,4,24),-.44,.19,1.35,Math.PI/2));batch(ropeCoils,mat.rope,boat,'coiled-hemp');
 const mailBag=new THREE.Group();mailBag.position.set(.32,.52,.45);boat.add(mailBag);mesh(new THREE.BoxGeometry(.39,.31,.18),mat.ink,0,0,0,mailBag);for(let i=0;i<2;i++){const e=mesh(new THREE.BoxGeometry(.27,.22,.025),mat.paper,(i-.5)*.09,.16,-.07-i*.025,mailBag);e.rotation.z=(i-.5)*.15;}mesh(new THREE.SphereGeometry(.025,10,6),mat.seal,0,.12,-.115,mailBag);
 const pennant=mesh(surface(12,2,(t,u)=>[Math.sin(t*6)*.05,t*.03+u*.18, t*.75]),mat.seal,0,4.77,-.7,boat,'mast-ribbon'),pennantBase=pennant.geometry.attributes.position.array.slice();
 const actor=createCourier();group.add(actor.group);const actorPosition=new THREE.Vector3();
 const companion=mesh(new THREE.IcosahedronGeometry(.08,1),material('#eedbb3',{emissive:'#dbb780',emissiveIntensity:.45}),0,1,0,group,'youxu-on-the-sea');

 const oceanUniforms={uTime:{value:0},uDawn:{value:0},uBoat:{value:new THREE.Vector2(BOAT_MOORING.x,BOAT_MOORING.z)},uSpeed:{value:0}};
 const oceanMaterial=new THREE.ShaderMaterial({vertexShader:OCEAN_VERTEX,fragmentShader:OCEAN_FRAGMENT,uniforms:oceanUniforms,side:THREE.FrontSide});materials.add(oceanMaterial);
 const oceanGeometry=new THREE.PlaneGeometry(1800,1800,180,180);oceanGeometry.rotateX(-Math.PI/2);const ocean=mesh(oceanGeometry,oceanMaterial,0,-.17,-200,group,'open-ocean');ocean.castShadow=false;ocean.receiveShadow=false;
 const skyMaterial=new THREE.ShaderMaterial({vertexShader:SKY_VERTEX,fragmentShader:SKY_FRAGMENT,uniforms:{uDawn:{value:0}},side:THREE.BackSide,depthWrite:false});materials.add(skyMaterial);
 const sky=mesh(new THREE.SphereGeometry(1300,48,24),skyMaterial,0,0,-100,group,'sea-and-dawn-sky');sky.castShadow=false;sky.receiveShadow=false;sky.renderOrder=-10;
 const sunLight=new THREE.DirectionalLight('#ffe2b2',2.6);sunLight.position.set(-12,22,-35);sunLight.target.position.set(0,0,-30);sunLight.castShadow=true;sunLight.shadow.mapSize.set(1024,1024);Object.assign(sunLight.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:70});sunLight.shadow.bias=-.00025;sunLight.shadow.normalBias=.025;sunLight.shadow.radius=3;group.add(sunLight,sunLight.target);const fill=new THREE.HemisphereLight('#a1c3d0','#535648',.48);group.add(fill);
 // Silhouettes become smaller and quieter, not an enclosing corridor.
 const far=new THREE.Group();group.add(far);
 for(const [x,z,s]of [[-42,-84,9],[55,-126,11],[-80,-222,19],[105,-310,24],[-35,-360,12]]){const g=new THREE.SphereGeometry(1,12,8);g.scale(s,s*.19,s*.58);const o=mesh(g,material('#75938c'),x,-.25,z,far,'distant-island');o.castShadow=false;}
 const birds=[];
 const birdGeometry=merge([tube([[-.45,-.02,0],[-.2,.08,.03],[0,0,0]],.012,5),tube([[0,0,0],[.2,.08,.03],[.45,-.02,0]],.012,5)]);
 for(let i=0;i<7;i++){const b=mesh(birdGeometry,mat.white,(i-3)*5,4+i%3,-50-i*12,group,'sea-bird');b.castShadow=false;birds.push(b);}
 const floralTypes=['lotus','lily','iris','dahlia'],flowerColors=['#e8b4c4','#eee5ca','#a5add3','#e4c086'],flowerMeshes=[],maxFlowers=360;
 const flowerRoot=new THREE.Group();group.add(flowerRoot);
 floralTypes.forEach((kind,k)=>{
  const geo=flowerGeometry(kind),petalMat=material(flowerColors[k],{roughness:.62,vertexColors:true,side:THREE.DoubleSide,envMapIntensity:.4,emissive:flowerColors[k],emissiveIntensity:.018});
  const set={kind,items:[],petalMaterial:petalMat};
  for(const [part,g]of Object.entries(geo)){if(!g)continue;const m=new THREE.InstancedMesh(g,part==='petals'?petalMat:part==='centers'?mat.brass:mat.leaf,maxFlowers);m.name='sea-'+kind+'-'+part;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.castShadow=false;m.receiveShadow=true;m.frustumCulled=false;flowerRoot.add(m);set.items.push(m);}
  flowerMeshes.push(set);
 });
 const fixedBlooms=[];
 for(let i=0;i<40;i++){const side=i%2?-1:1;fixedBlooms.push({x:side*(1.7+rand()*1.9),z:2+rand()*5,kind:floralTypes[i%4],scale:.28+rand()*.45,shore:true,seed:500+i});}
 for(let i=0;i<90;i++){const angle=rand()*TAU,r=2+rand()*2.6;fixedBlooms.push({x:Math.cos(angle)*r,z:-26+Math.sin(angle)*r,kind:floralTypes[i%4],scale:.22+rand()*.32,shore:true,seed:i});}
 for(let i=0;i<115;i++){const z=-40-rand()*165,side=i%2?-1:1,x=side*(4+rand()*7)+Math.sin(z*.065)*3;fixedBlooms.push({x,z,kind:floralTypes[i%4],scale:.65+rand()*.65,seed:100+i});}
 // Irregular little rafts of flowers, rather than a row of repeated single stems.
 const seaCenters=fixedBlooms.filter(b=>!b.shore);
 seaCenters.forEach((b,i)=>{if(i%3===0)return;for(let j=0;j<2;j++){const a=rand()*TAU,r=.38+rand()*.78;fixedBlooms.push({x:b.x+Math.cos(a)*r,z:b.z+Math.sin(a)*r,kind:floralTypes[(i+j+1)%4],scale:b.scale*(.40+rand()*.31),seed:2000+i*2+j});}});
 const glints= new THREE.BufferGeometry(),glintPos=new Float32Array(220*3);
 for(let i=0;i<220;i++){glintPos[i*3]=(rand()-.5)*30;glintPos[i*3+1]=.15+rand()*.5;glintPos[i*3+2]=-35-rand()*170;}glints.setAttribute('position',new THREE.BufferAttribute(glintPos,3));
 const glintMat=new THREE.PointsMaterial({color:'#f4ddab',size:.045,transparent:true,opacity:.48,depthWrite:false});materials.add(glintMat);const lights=new THREE.Points(glints,glintMat);group.add(lights);
 const interactables=[{id:'seal',position:[.78,1.83,1.25],radius:.35},{id:'old-letter',position:[0,1.81,-13],radius:.5},{id:'rope-left',position:[BOAT_MOORING.x-.7,.68,BOAT_MOORING.z+1.6],radius:.4},{id:'rope-right',position:[BOAT_MOORING.x+.7,.68,BOAT_MOORING.z+1.6],radius:.4},{id:'halyard',position:[BOAT_MOORING.x,2.4,BOAT_MOORING.z-.7],radius:.5}];
 let lastView={},lastTime=0,disposed=false,currentStage='writing',floralMood='';
 function applyFloralMood(purposes){
  const key=Array.isArray(purposes)?[...new Set(purposes.filter(p=>['memory','season','voyage'].includes(p)))].sort().join('+'):'';
  if(key===floralMood)return;
  floralMood=key;const mood=FLORAL_MOODS[key];
  flowerMeshes.forEach((set,k)=>{set.petalMaterial.color.set(mood?.colors[k]||flowerColors[k]);set.petalMaterial.emissive.copy(set.petalMaterial.color);});
 }
 function frameFlowers(t,view){
  const mood=FLORAL_MOODS[floralMood],fixed=mood?fixedBlooms.map((b,i)=>({...b,kind:mood.kinds[i%mood.kinds.length]})):fixedBlooms;
  const input=Array.isArray(view.blooms)?view.blooms:[],blooms=fixed.concat(input.slice(-440).map((b,i)=>({...b,kind:floralTypes.includes(b.kind)?b.kind:floralTypes[(Number(b.kind)||i)%4],scale:finite(b.scale,.8),seed:1000+i}))),counts=[0,0,0,0],light=view.quality==='light';
  const boatView=['sailing','dawn','complete','rigging'].includes(view.stage),referenceZ=boatView?finite(view.boat?.z,BOAT_MOORING.z):finite(view.player?.z,4),referenceX=boatView?finite(view.boat?.x,BOAT_MOORING.x):finite(view.player?.x);
  blooms.sort((a,b)=>Math.hypot(a.x-referenceX,a.z-referenceZ)-Math.hypot(b.x-referenceX,b.z-referenceZ));
  const costs=flowerMeshes.map(set=>set.items.reduce((sum,m)=>sum+(m.geometry.index?.count??m.geometry.attributes.position.count)/3,0)),budget=light?260000:view.quality==='delicate'?1100000:760000;let triangles=0;
  for(let i=0;i<blooms.length;i++){
   const b=blooms[i],kind=floralTypes.indexOf(b.kind),k=kind<0?0:kind,count=counts[k];if(count>=maxFlowers||(light&&b.seed%2&&!b.shore)||triangles+costs[k]>budget)continue;
   const distance=Math.hypot(b.x-referenceX,b.z-referenceZ);if(distance>48||(distance>26&&b.seed%2))continue;
   let grow=b.age===undefined?1:clamp(b.age/2.6);grow=grow*grow*(3-2*grow);const fade=clamp((48-distance)/9),scale=finite(b.scale,1)*Math.max(.002,grow*fade),wave=b.shore?0:oceanHeight(b.x,b.z,t);
   dummy.position.set(finite(b.x),b.shore?.91:wave+clamp(view.tide)*.58+.025,finite(b.z));dummy.rotation.set(b.shore?0:Math.sin(t*.7+b.seed)*.035,(b.seed||i)*2.4,Math.cos(t*.5+b.seed)*.025);dummy.scale.setScalar(scale);dummy.updateMatrix();for(const m of flowerMeshes[k].items)m.setMatrixAt(count,dummy.matrix);counts[k]++;triangles+=costs[k];
  }
  flowerMeshes.forEach((set,k)=>set.items.forEach(m=>{m.count=counts[k];m.instanceMatrix.needsUpdate=true;}));
 }
 function camera(view={},aspect=1.6){
  const stage=view.stage||'writing',p=view.player||{x:0,z:4},b=presentedBoat(view),portrait=aspect<.8;
  if(stage==='writing')return {position:portrait?[5.1,6.7,9]:[4.3,4.1,6.4],target:portrait?[-.1,1.9,1.1]:[.8,1.9,1.0]};
  if(stage==='rigging')return {position:portrait?[b.x+8.3,5.8,b.z+8.8]:[b.x+6.4,3.8,b.z+6.8],target:[b.x+(portrait?0:.6),2.1,b.z-.25]};
  if(['sailing','dawn','complete'].includes(stage)){
   const ending=stage==='dawn'||stage==='complete',pullback=stage==='complete'?(1-Math.exp(-clamp(view.departureAge,0,90)/13))*.9:0,wide=(ending?1.5:1)+pullback,heading=finite(b.heading),behind=portrait?10.6:8.2;
   // During the closing shot look toward the horizon, not down at the water.
   // A small lateral offset preserves the dawn disc inside portrait framing.
   if(ending)return {position:[b.x+(portrait?1.1:2.6)*wide,5.1+pullback*1.4,b.z+behind*wide],target:[b.x,1.1,b.z-7]};
   return {position:[b.x+(Math.sin(heading)*-behind+3.0)*wide,4.3*wide,b.z+Math.cos(heading)*behind*wide],target:[b.x,1.7,b.z-3.5]};
  }
  return {position:[finite(p.x)+(portrait?4.6:4.3),portrait?9.2:7.0,finite(p.z)+(portrait?11.3:8.1)],target:[finite(p.x),1,finite(p.z)-2.7]};
 }
 return {group,interactables,camera,setTideStones,
  update(t,dt,view={}){
   if(disposed)return;lastView=view;lastTime=finite(t);t=lastTime;currentStage=view.stage||'writing';
   const progress=clamp(view.progress),ending=['dawn','complete'].includes(currentStage),atSea=['sailing','dawn','complete'].includes(currentStage),boatState=presentedBoat(view),player=view.player||{x:0,z:4};
   const tide=clamp(view.tide),sail=clamp(view.sail),dawn=atSea?clamp(.15+progress*.8+(ending?.15:0)):.08;
   oceanUniforms.uTime.value=t;oceanUniforms.uDawn.value=dawn;oceanUniforms.uBoat.value.set(finite(boatState.x,BOAT_MOORING.x),finite(boatState.z,BOAT_MOORING.z));oceanUniforms.uSpeed.value=finite(boatState.speed);
   ocean.position.y=tide*.58;skyMaterial.uniforms.uDawn.value=dawn;sky.position.z=atSea?boatState.z:0;
   const lightTarget=atSea||currentStage==='rigging'?boatState:currentStage==='writing'?{x:0,z:1}:player;
   sunLight.color.set(ending?'#ffd3a0':'#ffe2b2');sunLight.position.set(lightTarget.x-9,14,lightTarget.z-8);sunLight.target.position.set(lightTarget.x,0,lightTarget.z);sunLight.castShadow=view.quality!=='light';
   wax.visible=!!view.sealed;envelope.visible=true;oldLetter.visible=!view.predecessor;stamp.position.y=view.sealed?1.14:1.14+Math.sin(t*.6)*.015;
   stones.forEach(s=>{s.top.visible=s.high||tide<.62;s.shell.visible=s.high||tide<.50;});
   boat.position.set(finite(boatState.x,BOAT_MOORING.x),tide*.58+.02+oceanHeight(finite(boatState.x,BOAT_MOORING.x),finite(boatState.z,BOAT_MOORING.z),t),finite(boatState.z,BOAT_MOORING.z));boat.rotation.set(Math.sin(t*.63)*.012,finite(boatState.heading),Math.sin(t*.86)*.022);
   sailRig.scale.y=.04+sail*.96;sailRig.position.y=1+(1-sail)*.05;foresail.scale.y=.07+sail*.93;sailRig.rotation.y=finite(view.trim,0)*.45;
   const pos=sailGeometry.attributes.position;for(let i=0;i<pos.array.length;i+=3){const y=sailBase[i+1],z=sailBase[i+2];pos.array[i]=sailBase[i]+Math.sin(y*2.5+z*1.9-t*2.1)*.024*(z/2.2);};pos.needsUpdate=true;
   const flag=pennant.geometry.attributes.position;for(let i=0;i<flag.count;i++){const z=pennantBase[i*3+2];flag.setX(i,pennantBase[i*3]+Math.sin(z*8-t*3)*z*.11);}flag.needsUpdate=true;
   for(let i=0;i<2;i++)riggingRopes[i].visible=!view.ropes?.[i]&&!atSea;
   tiller.rotation.z=-finite(boatState.heading)*.3;mailBag.visible=!!view.sealed;
   const ground=voyageGroundHeight(player);
   actorPosition.set(atSea||currentStage==='rigging'?boat.position.x:currentStage==='writing'?-.3:finite(player.x),atSea||currentStage==='rigging'?boat.position.y+.57:finite(player.y,ground+.07),atSea||currentStage==='rigging'?boat.position.z+1.15:currentStage==='writing'?1.95:finite(player.z,4));
   actor.group.position.copy(actorPosition);actor.update(t,clamp(dt,0,.1),actorPosition,currentStage==='writing');actor.group.rotation.y=atSea?boat.rotation.y:currentStage==='writing'?Math.PI:0;
   companion.position.set(actorPosition.x+.63+Math.cos(t)*.08,actorPosition.y+1.25+Math.sin(t*1.4)*.12,actorPosition.z-.3);companion.rotation.y=t*.4;
   boat.updateMatrixWorld(true);
   for(const [id,p]of [['rope-left',[-.7,.68,1.6]],['rope-right',[.7,.68,1.6]],['halyard',[.05,2.4,-.7]]]){const v=new THREE.Vector3(...p).applyMatrix4(boat.matrixWorld);interactables.find(o=>o.id===id).position=v.toArray();}
   birds.forEach((b,i)=>{b.position.x=Math.sin(t*.1+i*1.1)*12+(i-3)*6;b.position.z=(atSea?boat.position.z:0)-38-i*9+Math.sin(t*.08+i)*8;b.position.y=4+i%3+Math.sin(t*.7+i)*.25;b.rotation.z=Math.sin(t*3+i)*.12;});
   applyFloralMood(view.purposes);frameFlowers(t,{...view,boat:boatState});lights.material.opacity=view.reducedMotion?.23:.37+Math.sin(t*.4)*.08;
  },
  snapshot(){let meshes=0,triangles=0;group.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});return {stage:currentStage,time:lastTime,meshes,triangles,flowerSpecies:floralTypes.length,flowers:flowerMeshes.reduce((sum,set)=>sum+(set.items[0]?.count||0),0),palette:flowerMeshes.map(set=>set.petalMaterial.color.getHexString()),floralMood,boat:boat.position.toArray(),tideStones:tideLayout.map(s=>({x:s.x,z:s.z,r:s.r,high:s.high})),interactables:interactables.map(o=>({...o,position:[...o.position]}))};},
  dispose(){if(disposed)return;disposed=true;actor.dispose();const geometries=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());group.removeFromParent();group.clear();}
 };
}
