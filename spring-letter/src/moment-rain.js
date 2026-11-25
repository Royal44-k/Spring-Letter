import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// The light sheets move continuously in a vertical plane. These authored
// locations join their three separate silhouettes into one garden window.
export const RAIN_PANES = Object.freeze([
  Object.freeze({id:'tree',name:'枝叶花笺',shape:'分叉的枝叶',z:.45,start:Object.freeze([-1.62,1.12]),target:Object.freeze([-.65,2.08])}),
  Object.freeze({id:'window',name:'窗影花笺',shape:'带拱顶的小窗',z:.60,start:Object.freeze([1.58,2.61]),target:Object.freeze([.52,1.77])}),
  Object.freeze({id:'bloom',name:'花冠花笺',shape:'六瓣的小花',z:.75,start:Object.freeze([1.31,.72]),target:Object.freeze([.08,1.14])}),
]);
export const RAIN_LIMITS = Object.freeze({minX:-1.85,maxX:1.85,minY:.63,maxY:2.86,tolerance:.17});
const clamp=THREE.MathUtils.clamp,finite=(v,f)=>Number.isFinite(v)?v:f;
const paneById=id=>RAIN_PANES.find(p=>p.id===id);
export const createRainDraft=()=>({version:1,positions:Object.fromEntries(RAIN_PANES.map(p=>[p.id,{x:p.start[0],y:p.start[1]}])),selected:'tree'});
export function restoreRainDraft(value){
  const draft=createRainDraft();if(value?.version!==1)return draft;
  for(const p of RAIN_PANES){const old=value.positions?.[p.id];if(!old)continue;draft.positions[p.id]={x:clamp(finite(old.x,p.start[0]),RAIN_LIMITS.minX,RAIN_LIMITS.maxX),y:clamp(finite(old.y,p.start[1]),RAIN_LIMITS.minY,RAIN_LIMITS.maxY)};}
  if(paneById(value.selected))draft.selected=value.selected;return draft;
}
export function evaluateRainDraft(draft){
  const entries=RAIN_PANES.map(p=>{const v=draft.positions[p.id],distance=Math.hypot(v.x-p.target[0],v.y-p.target[1]);return {id:p.id,distance,aligned:distance<=RAIN_LIMITS.tolerance,closeness:clamp(1-distance/.85,0,1)};});
  const aligned=entries.filter(p=>p.aligned).length;
  return {ready:aligned===3,aligned,progress:entries.reduce((n,p)=>n+(p.aligned?1:p.closeness*.7),0)/3,entries};
}
export function moveRainPane(draft,id,x,y){
  if(!paneById(id)||!Number.isFinite(x)||!Number.isFinite(y))return false;
  const position=draft.positions[id],nx=clamp(x,RAIN_LIMITS.minX,RAIN_LIMITS.maxX),ny=clamp(y,RAIN_LIMITS.minY,RAIN_LIMITS.maxY);
  if(Math.abs(nx-position.x)+Math.abs(ny-position.y)<1e-8)return false;
  position.x=nx;position.y=ny;draft.selected=id;return true;
}

function roundedRect(width,height,radius=.08){
  const s=new THREE.Shape(),x=-width/2,y=-height/2,w=width,h=height,r=radius;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function leafShape(width=.2,height=.47){const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(-width,height*.22,-width,height*.75,0,height);s.bezierCurveTo(width,height*.73,width,height*.20,0,0);return s;}
function petalShape(){const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(-.12,.08,-.22,.33,-.06,.39);s.bezierCurveTo(.15,.44,.20,.20,0,0);return s;}
function textureFromPixels(pixels,size){const texture=new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.needsUpdate=true;return texture;}
function linenTexture(size=256){
  const pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const u=x/(size-1),v=y/(size-1),r=Math.hypot((u-.48)*1.12,(v-.56)*.86),falloff=THREE.MathUtils.smoothstep(r,.14,.63),fibre=Math.sin(x*2.37)*1.4+Math.cos(y*2.11)*1.8+Math.sin(x*39.87+y*17.71)*1.1;
    const glow=Math.max(0,1-Math.hypot(u-.38,v-.73)*2)*6,offset=(y*size+x)*4;
    for(let c=0;c<3;c++){const center=[232,223,198][c],edge=[55,78,83][c];pixels[offset+c]=Math.max(0,Math.min(255,Math.round(center+(edge-center)*falloff*.90+fibre+glow)));}pixels[offset+3]=255;
  }
  return textureFromPixels(pixels,size);
}
function lightTexture(size=64){const pixels=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const r=Math.hypot((x+.5)/size-.5,(y+.5)/size-.5)*2,alpha=Math.max(0,Math.exp(-r*r*4.6)-Math.exp(-4.6));const i=(y*size+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=255;pixels[i+3]=Math.round(alpha*255);}return textureFromPixels(pixels,size);}
function curvedLeafGeometry(width=.13,length=.40,curl=.18){
  const geometry=new THREE.ShapeGeometry(leafShape(width,length),18),position=geometry.attributes.position;
  for(let i=0;i<position.count;i++){const x=position.getX(i),y=position.getY(i),t=y/length;position.setZ(i,Math.sin(t*Math.PI)*curl+Math.pow(Math.abs(x)/width,1.8)*.05);}
  geometry.computeVertexNormals();return geometry;
}
function flowerPetalGeometry(length=.32,width=.10,curl=.12){
  const geometry=new THREE.PlaneGeometry(width*2,length,10,16),position=geometry.attributes.position;
  for(let i=0;i<position.count;i++){const u=position.getX(i)/width,t=clamp(position.getY(i)/length+.5,0,1),span=Math.pow(Math.max(0,Math.sin(Math.PI*t)),.65)*(.65+.35*t);position.setXYZ(i,u*width*span,Math.sin(t*Math.PI)*curl+t*t*.025+u*u*.025,t*length);}
  geometry.computeVertexNormals();return geometry;
}
function batchMaterialChildren(group){
  const byMaterial=new Map();for(const child of group.children){if(!child.isMesh)continue;child.updateMatrix();const geometry=child.geometry.index?child.geometry.toNonIndexed():child.geometry.clone();geometry.applyMatrix4(child.matrix);child.geometry.dispose();const pieces=byMaterial.get(child.material)||[];pieces.push(geometry);byMaterial.set(child.material,pieces);}
  group.clear();for(const [material,pieces] of byMaterial){const merged=mergeGeometries(pieces);for(const geometry of pieces)geometry.dispose();group.add(new THREE.Mesh(merged,material));}
}
function motif(id,material,wire=false){
  const group=new THREE.Group();
  const meshShape=(shape,x=0,y=0,angle=0)=>{
    const geometry=wire?new THREE.BufferGeometry().setFromPoints(shape.getPoints(22).map(p=>new THREE.Vector3(p.x,p.y,0))):new THREE.ShapeGeometry(shape,20);
    const object=wire?new THREE.LineLoop(geometry,material):new THREE.Mesh(geometry,material);object.position.set(x,y,0);object.rotation.z=angle;group.add(object);return object;
  };
  const stroke=(points,width=.027)=>{
    if(wire){const o=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p,0))),material);group.add(o);return;}
    for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dy=b[1]-a[1];const o=new THREE.Mesh(new THREE.PlaneGeometry(width,Math.hypot(dx,dy)),material);o.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,0);o.rotation.z=-Math.atan2(dx,dy);group.add(o);}
  };
  if(id==='tree'){
    stroke([[0,-.59],[-.03,-.24],[.015,.03],[.10,.31],[.08,.64]],.020);
    stroke([[-.01,-.17],[-.22,.02],[-.40,.27]],.015);stroke([[.025,.06],[.24,.21],[.43,.37]],.014);
    stroke([[.075,.25],[-.10,.37],[-.24,.53]],.012);
    const leaves=[[-.33,.15,.64,.086,.25],[-.19,-.015,.85,.07,.24],[.20,.17,-.95,.085,.28],[.36,.31,-.70,.065,.25],[.09,.39,-.13,.08,.27],[-.17,.40,.55,.067,.24],[-.025,-.33,.92,.062,.23],[.01,-.15,-.8,.06,.20]];
    for(const [x,y,angle,width,height]of leaves){meshShape(leafShape(width,height),x,y,angle);if(wire){const end=[x-Math.sin(angle)*height*.92,y+Math.cos(angle)*height*.92];stroke([[x,y],end]);}}
  }else if(id==='window'){
    const arch=new THREE.Shape();arch.moveTo(-.40,-.51);arch.lineTo(-.40,.13);arch.bezierCurveTo(-.40,.61,.40,.61,.40,.13);arch.lineTo(.40,-.51);arch.closePath();
    if(!wire){const hole=new THREE.Path();hole.moveTo(-.374,-.48);hole.lineTo(.374,-.48);hole.lineTo(.374,.13);hole.bezierCurveTo(.374,.56,-.374,.56,-.374,.13);hole.closePath();arch.holes.push(hole);}
    meshShape(arch);stroke([[0,-.48],[0,.47]],.014);stroke([[-.38,-.02],[.38,-.02]],.014);
    stroke([[-.47,-.52],[.47,-.52]],.025);
    if(wire){stroke([[-.36,.11],[-.23,.29],[0,.39],[.23,.29],[.36,.11]]);stroke([[-.36,-.45],[-.36,-.10]]);stroke([[.36,-.45],[.36,-.10]]);}
  }else{
    for(let i=0;i<6;i++){const angle=i*Math.PI/3;meshShape(petalShape(),0,.03,angle);if(wire){const points=[[0,.06],[-.025,.18],[-.02,.33]].map(([x,y])=>[x*Math.cos(angle)-y*Math.sin(angle),.03+x*Math.sin(angle)+y*Math.cos(angle)]);stroke(points);}}
    meshShape(leafShape(.08,.30),-.03,-.46,-.6);stroke([[0,-.52],[0,.03]],.025);
    const disk=wire?new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0,0,.065,.065,0,Math.PI*2,false).getPoints(24).map(p=>new THREE.Vector3(p.x,p.y,0))),material):new THREE.Mesh(new THREE.CircleGeometry(.065,24),material);disk.position.y=.03;group.add(disk);
  }
  // All pieces in one silhouette share a material and depth. Batching avoids
  // dozens of extra draws per sheet while preserving the paper pick target.
  if(wire){
    const segments=[];
    for(const child of group.children){child.updateMatrix();const positions=child.geometry.attributes.position,from=new THREE.Vector3(),to=new THREE.Vector3();
      for(let i=1;i<positions.count;i++){from.fromBufferAttribute(positions,i-1).applyMatrix4(child.matrix);to.fromBufferAttribute(positions,i).applyMatrix4(child.matrix);segments.push(...from.toArray(),...to.toArray());}
      if(child.isLineLoop){from.fromBufferAttribute(positions,positions.count-1).applyMatrix4(child.matrix);to.fromBufferAttribute(positions,0).applyMatrix4(child.matrix);segments.push(...from.toArray(),...to.toArray());}
      child.geometry.dispose();
    }
    group.clear();const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(segments,3));group.add(new THREE.LineSegments(geometry,material));
  }else{
    const pieces=group.children.map(child=>{child.updateMatrix();const geometry=child.geometry.index?child.geometry.toNonIndexed():child.geometry.clone();geometry.applyMatrix4(child.matrix);child.geometry.dispose();return geometry;});
    const merged=mergeGeometries(pieces);for(const geometry of pieces)geometry.dispose();group.clear();group.add(new THREE.Mesh(merged,material));
  }
  return group;
}
function shadowTexture(id,size=128){
  const material=new THREE.MeshBasicMaterial(),source=motif(id,material),geometry=source.children[0].geometry,position=geometry.attributes.position,alpha=new Float32Array(size*size),pixels=new Uint8Array(size*size*4);
  const edge=(ax,ay,bx,by,x,y)=>(x-ax)*(by-ay)-(y-ay)*(bx-ax);
  for(let i=0;i<position.count;i+=3){const p=[0,1,2].map(k=>[(position.getX(i+k)+.58)/1.16*(size-1),(position.getY(i+k)+.76)/1.52*(size-1)]),minX=Math.max(0,Math.floor(Math.min(...p.map(v=>v[0])))),maxX=Math.min(size-1,Math.ceil(Math.max(...p.map(v=>v[0])))),minY=Math.max(0,Math.floor(Math.min(...p.map(v=>v[1])))),maxY=Math.min(size-1,Math.ceil(Math.max(...p.map(v=>v[1]))));
    for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const a=edge(...p[0],...p[1],x+.5,y+.5),b=edge(...p[1],...p[2],x+.5,y+.5),c=edge(...p[2],...p[0],x+.5,y+.5);if(a>=0&&b>=0&&c>=0||a<=0&&b<=0&&c<=0)alpha[y*size+x]=1;}
  }
  const blurred=new Float32Array(alpha.length),kernel=[1,4,6,4,1];for(let y=0;y<size;y++)for(let x=0;x<size;x++)for(let k=-2;k<=2;k++)blurred[y*size+x]+=alpha[y*size+Math.max(0,Math.min(size-1,x+k))]*kernel[k+2]/16;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){let a=0;for(let k=-2;k<=2;k++)a+=blurred[Math.max(0,Math.min(size-1,y+k))*size+x]*kernel[k+2]/16;const i=(y*size+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=255;pixels[i+3]=Math.round(a*255);}
  geometry.dispose();material.dispose();return textureFromPixels(pixels,size);
}

export function createRainMoment({onSound=()=>{}}={}){
  const group=new THREE.Group();group.name='moment-rain-light-room';
  const bounds={min:[-2.55,-.32,-1.08],max:[2.55,3.76,1.4]},cameraOffset={x:1.3,y:1.25,z:6.7};
  let draft=createRainDraft(),history=[],drag=null,active=false,disposed=false,glowTime=0,lastPalette=null,committedChoice=null;
  const outcomeBlend={tree:0,shoot:0};
  const pickables=[],panes=new Map(),growth=[],paletteColor=new THREE.Color(0xe4b7bf),paperWhite=new THREE.Color(0xfff7eb),localRay=new THREE.Ray(),worldInverse=new THREE.Matrix4(),plane=new THREE.Plane(),planeNormal=new THREE.Vector3(0,0,1),point=new THREE.Vector3(),worldPoint=new THREE.Vector3();
  const linen=linenTexture(),softLight=lightTexture(),textures=new Set([linen,softLight]);
  const wood=new THREE.MeshStandardMaterial({color:0x314748,roughness:.64,metalness:.23});
  const edgeWood=new THREE.MeshStandardMaterial({color:0x667c78,roughness:.64,metalness:.17});
  const cream=new THREE.MeshStandardMaterial({color:0xffffff,map:linen,emissiveMap:linen,emissive:0xffedce,emissiveIntensity:.30,roughness:.93,side:THREE.DoubleSide});
  const dark=new THREE.MeshStandardMaterial({color:0x263c3e,roughness:.82});
  const warm=new THREE.MeshStandardMaterial({color:0xcebea0,roughness:.28,metalness:.75,emissive:0xd6aa6d,emissiveIntensity:.06});
  const addBox=(x,y,z,w,h,d,mat=wood)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
  addBox(0,-.14,0,4.85,.23,1.8,dark);addBox(0,.03,-.13,4.52,.09,1.55,edgeWood);
  // An upright workroom window, not a horizontal puzzle board.
  for(const x of [-2.18,2.18]){addBox(x,1.73,-.68,.085,3.48,.17);addBox(x,.03,.26,.30,.16,1.2);addBox(x,1.87,-.37,.035,3.08,.64,dark);}
  addBox(0,3.43,-.68,4.52,.10,.19);addBox(0,.32,-.68,4.52,.10,.19);addBox(0,3.56,-.55,4.76,.075,.47,edgeWood);
  addBox(0,1.86,-.84,4.30,3.05,.10,dark);
  const screenGeometry=new THREE.PlaneGeometry(4.2,2.95,30,24),screenPosition=screenGeometry.attributes.position;
  for(let i=0;i<screenPosition.count;i++){const x=screenPosition.getX(i),y=screenPosition.getY(i);screenPosition.setZ(i,Math.sin(x*7+y*.6)*.012+Math.cos(y*5)*.006);}
  screenGeometry.computeVertexNormals();const screen=new THREE.Mesh(screenGeometry,cream);screen.position.set(0,1.86,-.69);screen.name='light-room-linen-screen';group.add(screen);
  // The shadow plane and its stencil use the same coordinates as the sheets.
  // This is a parallel-light projection; its placement is continuous, never a
  // preset animation that plays after a button has silently solved the puzzle.
  const brass=new THREE.MeshStandardMaterial({color:0xc0ad86,roughness:.31,metalness:.78});
  for(const x of [-1.83,1.83]){addBox(x,3.3,-.51,.045,.16,.045,brass);}
  for(const x of [-2.115,2.115])addBox(x,1.86,-.65,.018,3.0,.03,brass);
  for(const y of [.35,3.38])addBox(0,y,-.65,4.25,.018,.03,brass);
  const sill=new THREE.Mesh(new THREE.BoxGeometry(4.42,.085,.37),edgeWood);sill.position.set(0,.37,-.43);group.add(sill);
  const beamMaterial=new THREE.MeshBasicMaterial({color:0xf3deb0,transparent:true,opacity:.018,depthWrite:false,side:THREE.DoubleSide});
  const beamCorners=[[-2.06,.40,-.61],[2.06,.40,-.61],[2.06,3.32,-.61],[-2.06,3.32,-.61]],beamVertices=[];
  for(let i=0;i<4;i++)beamVertices.push(0,.45,1.25,...beamCorners[i],...beamCorners[(i+1)%4]);
  const beamGeometry=new THREE.BufferGeometry();beamGeometry.setAttribute('position',new THREE.Float32BufferAttribute(beamVertices,3));
  const beam=new THREE.Mesh(beamGeometry,beamMaterial);beam.name='light-room-bounded-beam';group.add(beam);

  // A small optical lantern makes the depth and origin of the light legible.
  const lantern=new THREE.Group();lantern.position.set(0,.20,.94);group.add(lantern);
  const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.105,.125,.30,24),brass);barrel.rotation.x=Math.PI/2;barrel.position.y=.13;lantern.add(barrel);
  const lensMaterial=new THREE.MeshStandardMaterial({color:0xffecc7,emissive:0xffd694,emissiveIntensity:.95,roughness:.22,metalness:.18});
  const lens=new THREE.Mesh(new THREE.CircleGeometry(.087,32),lensMaterial);lens.position.set(0,.13,.153);lantern.add(lens);
  const lensGlow=new THREE.Mesh(new THREE.PlaneGeometry(.54,.54),new THREE.MeshBasicMaterial({color:0xffe3b7,map:softLight,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending}));lensGlow.position.set(0,.13,.159);lantern.add(lensGlow);
  addBox(0,.09,.94,.27,.05,.30,wood);

  const paneColors=[0xcbd9c8,0xe8ddc4,0xe6cfd5],shadowColors=[0x57796b,0x9a885e,0x9e7186];
  for(let i=0;i<RAIN_PANES.length;i++){
    const spec=RAIN_PANES[i],pane=new THREE.Group();pane.name='light-sheet-'+spec.id;
    const paperMaterial=new THREE.MeshPhysicalMaterial({color:paneColors[i],roughness:.105,metalness:0,transmission:.76,thickness:.025,ior:1.46,clearcoat:1,clearcoatRoughness:.075,envMapIntensity:1.15,attenuationColor:paneColors[i],attenuationDistance:1.8,transparent:true,opacity:.36,side:THREE.DoubleSide,depthWrite:false});
    const paper=new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(1.03,1.36,.10),24),paperMaterial);paper.name='grab-'+spec.id;paper.userData.rainPane=spec.id;pane.add(paper);pickables.push(paper);
    const frameShape=roundedRect(1.055,1.385,.108),hole=new THREE.Path();const holePoints=roundedRect(1.025,1.355,.095).getPoints(48).reverse();hole.moveTo(holePoints[0].x,holePoints[0].y);for(const p of holePoints.slice(1))hole.lineTo(p.x,p.y);frameShape.holes.push(hole);
    const frame=new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape,{depth:.018,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,steps:1,curveSegments:16}),brass);frame.position.z=.004;pane.add(frame);
    const outlineMaterial=new THREE.LineBasicMaterial({color:0xf0e8d4,transparent:true,opacity:.78});
    const outline=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(roundedRect(1.03,1.36,.10).getPoints(64).map(p=>new THREE.Vector3(p.x,p.y,.008))),outlineMaterial);pane.add(outline);
    const ink=new THREE.MeshBasicMaterial({color:shadowColors[i],transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});
    const image=motif(spec.id,ink);image.position.z=.012;pane.add(image);
    const etched=motif(spec.id,new THREE.LineBasicMaterial({color:0x526663,transparent:true,opacity:.88,depthWrite:false}),true);etched.position.z=.022;pane.add(etched);
    const sheen=new THREE.Mesh(new THREE.PlaneGeometry(.045,1.16),new THREE.MeshBasicMaterial({color:0xf3f7ee,transparent:true,opacity:.23,depthWrite:false}));sheen.position.set(-.42,.02,.024);sheen.rotation.z=-.035;pane.add(sheen);
    // Small bead handles repeat the silhouette count, aiding both selection
    // and non-colour identification, without adding a control panel in space.
    for(let b=0;b<=i;b++){const bead=new THREE.Mesh(new THREE.SphereGeometry(.027,10,8),warm);bead.position.set((b-i/2)*.10,-.59,.028);pane.add(bead);}
    group.add(pane);
    const shadowMap=shadowTexture(spec.id);textures.add(shadowMap);
    const shadowMaterial=new THREE.MeshBasicMaterial({color:shadowColors[i],map:shadowMap,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide});
    const projection=new THREE.Mesh(new THREE.PlaneGeometry(1.16,1.52),shadowMaterial);projection.name='light-shadow-'+spec.id;projection.position.z=-.644;group.add(projection);
    const projectionGlow=new THREE.Mesh(new THREE.PlaneGeometry(1.38,1.72),new THREE.MeshBasicMaterial({color:paneColors[i],map:softLight,transparent:true,opacity:.06,depthWrite:false,blending:THREE.AdditiveBlending}));projectionGlow.position.z=-.638;group.add(projectionGlow);
    const ghostMaterial=new THREE.LineBasicMaterial({color:0x60796b,transparent:true,opacity:.25,depthTest:true});
    const ghost=motif(spec.id,ghostMaterial,true);ghost.position.set(...spec.target,-.624);group.add(ghost);
    const haloMaterial=new THREE.LineBasicMaterial({color:0xf2e6ba,transparent:true,opacity:0});
    const halo=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(roundedRect(1.09,1.42,.12).getPoints(64).map(p=>new THREE.Vector3(p.x,p.y,.02))),haloMaterial);pane.add(halo);
    panes.set(spec.id,{spec,pane,paperMaterial,outlineMaterial,projection,projectionGlow,shadowMaterial,ghost,ghostMaterial,haloMaterial});
  }
  // Living silhouettes grow out of the lower edge after their sheet is placed.
  const stemMaterial=new THREE.MeshStandardMaterial({color:0x536e56,roughness:.79});
  const leafMaterial=new THREE.MeshStandardMaterial({color:0x9ab58a,roughness:.72,side:THREE.DoubleSide});
  const blossomMaterial=new THREE.MeshStandardMaterial({color:0xe9d4d5,roughness:.43,side:THREE.DoubleSide});
  const pollenMaterial=new THREE.MeshStandardMaterial({color:0xd1ba7b,roughness:.78});
  for(let i=0;i<3;i++){
    const plant=new THREE.Group();plant.position.set([-1.55,.78,.06][i],.38,[-.33,-.25,.10][i]);plant.name='light-growth-'+RAIN_PANES[i].id;group.add(plant);
    const height=[1.10,.68,.74][i],stem=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(-.045,height*.35,.02),new THREE.Vector3(.035,height*.72,-.025),new THREE.Vector3(.09,height,0)]),20,.012,8,false),stemMaterial);plant.add(stem);
    for(let k=0;k<(i===0?9:6);k++){const side=k%2?1:-1,mesh=new THREE.Mesh(curvedLeafGeometry(i===1?.065:.10,i===0?.34:.28,.055),leafMaterial);mesh.position.set(k%2?.022:-.022,.10+k*(i===0?.105:.082),Math.sin(k)*.025);mesh.rotation.set(.16+Math.sin(k*.6)*.19,k*.73,side*-.98);plant.add(mesh);}
    if(i===2){for(let f=0;f<3;f++){
      const x=[-.15,.09,.28][f],y=[.55,.84,.43][f],z=[.08,-.02,.03][f];
      const stalk=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,.12,0),new THREE.Vector3(x*.65,y*.58,z),new THREE.Vector3(x,y,z)]),14,.009,7,false),stemMaterial);plant.add(stalk);
      for(let ring=0;ring<2;ring++)for(let k=0;k<(ring?5:8);k++){const mesh=new THREE.Mesh(flowerPetalGeometry(ring?.155:.23,ring?.055:.075,ring?.10:.055),blossomMaterial);mesh.position.set(x,y+ring*.008,z);mesh.rotation.y=k*Math.PI*2/(ring?5:8)+ring*.35+f*.55;mesh.rotation.z=.10*(f-1);plant.add(mesh);}
      const heart=new THREE.Mesh(new THREE.SphereGeometry(.039,16,10),pollenMaterial);heart.scale.y=.50;heart.position.set(x,y+.025,z);plant.add(heart);
    }}
    batchMaterialChildren(plant);
    plant.visible=false;plant.scale.set(.65,.005,.65);growth.push({plant,amount:0,origin:plant.position.clone()});
  }
  const dustPositions=new Float32Array(144*3),dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
  const dustMaterial=new THREE.PointsMaterial({color:paletteColor,map:softLight,size:.034,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
  const dust=new THREE.Points(dustGeometry,dustMaterial);dust.name='light-room-pollen';dust.frustumCulled=false;group.add(dust);
  const copy=()=>restoreRainDraft(draft),samePositions=(a,b)=>RAIN_PANES.every(p=>a.positions[p.id].x===b.positions[p.id].x&&a.positions[p.id].y===b.positions[p.id].y);
  function remember(before){if(!samePositions(before,draft)){history.push(before);if(history.length>64)history.shift();return true;}return false;}
  function applyLivingOutcome(time=0,reducedMotion=false,animate=false){
    const tree=outcomeBlend.tree,shoot=outcomeBlend.shoot;
    const shapes=[{x:1+tree*.45-shoot*.18,y:1+tree*.55-shoot*.14,z:1+tree*.25},{x:1+tree*.14+shoot*.10,y:1+tree*.28+shoot*.14,z:1+shoot*.10},{x:1-tree*.48+shoot*.52,y:1-tree*.35+shoot*.35,z:1-tree*.35+shoot*.35}];
    for(let i=0;i<growth.length;i++){const g=growth[i],s=shapes[i],cross=.65+g.amount*.35;g.plant.scale.set(cross*s.x,Math.max(.005,g.amount)*s.y,cross*s.z);g.plant.position.copy(g.origin);if(i===1)g.plant.position.x+=-tree*1.3+shoot*.16;if(i===2)g.plant.position.x+=tree*.65+shoot*.10;if(reducedMotion)g.sway=0;else if(animate)g.sway=Math.sin(time*.65+i)*.035*g.amount;g.plant.rotation.z=(g.sway||0)+(i===0?-tree*.065:i===2?shoot*.035:0);}
    const evaluation=evaluateRainDraft(draft);for(const p of panes.values()){const result=evaluation.entries.find(e=>e.id===p.spec.id),emphasis=p.spec.id==='tree'?tree*.10-shoot*.06:p.spec.id==='bloom'?shoot*.10-tree*.06:0;p.shadowMaterial.opacity=clamp(.35+result.closeness*.30+emphasis,.1,.85);}
  }
  function sync(){
    const result=evaluateRainDraft(draft);
    for(const item of result.entries){const p=panes.get(item.id),position=draft.positions[item.id];p.pane.position.set(position.x,position.y,p.spec.z);p.projection.position.set(position.x,position.y,-.644);p.projectionGlow.position.set(position.x,position.y,-.638);p.projectionGlow.material.opacity=.025+item.closeness*.14;p.haloMaterial.opacity=draft.selected===item.id?(item.aligned?.87:.56):0;p.shadowMaterial.opacity=.35+item.closeness*.30;p.ghostMaterial.opacity=item.aligned?.18:draft.selected===item.id?.48:result.aligned>0?.30:.15;p.outlineMaterial.opacity=item.aligned?1:.72;}
    group.updateMatrixWorld(true);return result;
  }
  function change(id,x,y,{save=true}={}){
    const before=copy(),previous=evaluateRainDraft(draft);if(!moveRainPane(draft,id,x,y))return false;
    const now=sync();if(save)remember(before);
    const got=now.entries.find(p=>p.id===id),was=previous.entries.find(p=>p.id===id);
    if(got.aligned&&!was.aligned)onSound('light-place',{id,pan:clamp(x/2,-.7,.7),aligned:now.aligned});
    if(now.ready&&!previous.ready){glowTime=1;onSound('light-complete',{id:'rain'});}
    return true;
  }
  function cancelDrag(){if(!drag)return false;draft=drag.before;drag=null;sync();return true;}
  function finishDrag(){if(!drag)return false;const changed=remember(drag.before);drag=null;sync();return changed;}
  function localIntersection(raycaster,z){
    group.updateWorldMatrix(true,false);worldInverse.copy(group.matrixWorld).invert();localRay.copy(raycaster.ray).applyMatrix4(worldInverse);plane.set(planeNormal,-z);return localRay.intersectPlane(plane,point);
  }
  function pointer(type,raycaster,event={}){
    if(disposed)return false;
    if(type==='cancel'){cancelDrag();return true;}
    if(type==='up'){if(drag?.pointerId!==undefined&&event.pointerId!==undefined&&drag.pointerId!==event.pointerId)return false;const had=!!drag;finishDrag();return had;}
    if(!active||!raycaster?.ray)return false;
    if(type==='down'){
      if(event.button!==undefined&&event.button!==0)return false;
      if(drag?.pointerId!==undefined&&event.pointerId!==undefined&&drag.pointerId!==event.pointerId)return false;
      group.updateMatrixWorld(true);const hit=raycaster.intersectObjects(pickables,false)[0];if(!hit)return false;
      const id=hit.object.userData.rainPane,spec=paneById(id),p=localIntersection(raycaster,spec.z);if(!p)return false;
      if(drag)cancelDrag();draft.selected=id;drag={id,before:copy(),offsetX:draft.positions[id].x-p.x,offsetY:draft.positions[id].y-p.y,pointerId:event.pointerId};sync();onSound('light-pick',{id});return true;
    }
    if(type==='move'&&drag){if(drag.pointerId!==undefined&&event.pointerId!==undefined&&drag.pointerId!==event.pointerId)return false;const p=localIntersection(raycaster,paneById(drag.id).z);if(p)change(drag.id,p.x+drag.offsetX,p.y+drag.offsetY,{save:false});return true;}
    return false;
  }
  function action(id,value){
    if(disposed)return false;
    if(!active&&id!=='cancel')return false;
    if(id==='select'&&paneById(value)){finishDrag();draft.selected=value;sync();return true;}
    if(id==='cancel'){cancelDrag();return true;}
    if(id==='undo'){if(cancelDrag())return true;if(!history.length)return false;draft=history.pop();sync();onSound('light-undo',{});return true;}
    if(id==='reset'){cancelDrag();const before=copy();draft=createRainDraft();remember(before);sync();onSound('light-undo',{});return true;}
    const dirs={left:[-1,0],right:[1,0],up:[0,1],down:[0,-1]};if(dirs[id]){finishDrag();const d=dirs[id],p=draft.positions[draft.selected],step=value==='fine'?.025:.09;return change(draft.selected,p.x+d[0]*step,p.y+d[1]*step);}
    return false;
  }
  function key(event){
    if(!active||disposed||event.type==='keyup'||event.ctrlKey||event.metaKey||event.altKey)return false;
    const code=event.code||event.key;
    if(event.repeat&&!code?.startsWith('Arrow'))return /^(Digit[123]|[123]|KeyZ|KeyR|[zZrR])$/.test(code);
    if(/^Digit[123]$/.test(code))return action('select',RAIN_PANES[Number(code.slice(-1))-1].id);
    if(/^[123]$/.test(code))return action('select',RAIN_PANES[Number(code)-1].id);
    const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[code];if(direction){action(direction,event.shiftKey?'fine':undefined);return true;}
    if(code==='KeyZ'||code==='z'||code==='Z'){action('undo');return true;}if(code==='KeyR'||code==='r'||code==='R'){action('reset');return true;}return false;
  }
  sync();
  return {group,bounds,cameraOffset,pointer,key,action,
    update(time,delta,{active:enabled=false,reducedMotion=false,palette,choice,completed=false}={}){
      if(disposed)return;const wasActive=active;active=enabled===true;if(wasActive&&!active)cancelDrag();
      const dt=active?clamp(finite(delta,0),0,.05):0;
      committedChoice=completed===true&&(choice==='tree'||choice==='shoot')?choice:null;
      for(const key of ['tree','shoot'])outcomeBlend[key]=!active||reducedMotion?(committedChoice===key?1:0):THREE.MathUtils.damp(outcomeBlend[key],committedChoice===key?1:0,3.2,dt);
      if(dt<=0){applyLivingOutcome(finite(time,0),reducedMotion);return;}
      const evaluation=evaluateRainDraft(draft),t=finite(time,0);glowTime=Math.max(0,glowTime-dt*.20);
      const supplied=Array.isArray(palette)?palette[0]:palette?.pollen??palette?.accent??palette?.high??palette?.primary??palette?.color;if(supplied!==undefined&&supplied!==lastPalette){try{paletteColor.set(supplied);dustMaterial.color.copy(paletteColor);blossomMaterial.color.set(palette?.high??supplied).lerp(paperWhite,.48);lastPalette=supplied;}catch{}}
      for(let i=0;i<growth.length;i++){const g=growth[i],target=evaluation.entries[i].aligned?1:0;g.amount=THREE.MathUtils.damp(g.amount,target,2.8,dt);g.plant.visible=g.amount>.01;}
      applyLivingOutcome(t,reducedMotion,true);
      dustMaterial.opacity=evaluation.ready?.54:.08*evaluation.aligned;
      beamMaterial.opacity=.018+glowTime*.012;
      for(let i=0;i<144;i++){const index=i%3,aligned=evaluation.entries[index].aligned,target=RAIN_PANES[index].target,a=i*2.39996,u=(i*.61803+(reducedMotion?0:t*.035))%1,spread=aligned?.34:1.5;dustPositions[i*3]=(aligned?target[0]:0)+Math.sin(a+t*(reducedMotion?0:.13))*spread*(.3+u*.7);dustPositions[i*3+1]=aligned?target[1]-.45+u*.9:.45+u*2.65;dustPositions[i*3+2]=-.43+Math.cos(a)*.13+(aligned?u*.12:0);}
      dustGeometry.attributes.position.needsUpdate=true;
      for(const p of panes.values())if(draft.selected===p.spec.id)p.haloMaterial.opacity=(evaluation.entries.find(x=>x.id===p.spec.id).aligned?.8:.46)+(reducedMotion?0:Math.sin(t*2.1)*.06);
    },
    snapshot(){
      const result=evaluateRainDraft(draft),next=result.entries.find(p=>!p.aligned),selected=paneById(draft.selected),selectedResult=result.entries.find(p=>p.id===draft.selected),remaining=result.entries.filter(p=>!p.aligned).map(p=>paneById(p.id).name);
      const hint=result.ready?'三片花影合成了一扇春窗。枝叶已经长出纸面，留下你想照料的那一处。':result.aligned===0?`先看${selected.name}上的${selected.shape}，再看它投在幕上的影子。抓住花笺移动，让影子与细线重合；1 / 2 / 3 选片，方向键移动，Shift 可微调。`:result.aligned===1?`一片花影已经醒来。${remaining.join('与')}的轮廓仍在幕上等着它们，试着让这些影子在窗边相遇。`:`只剩${remaining[0]}。看影子与幕上细线的距离，稍稍挪近，让整扇春窗连起来。`;
      const status=result.ready?'窗里的春天已经醒来。看看你想把什么留在信里。':selectedResult.aligned?`${selected.name}已经显影。再选${remaining.join('或')}，接着布置这扇春窗。`:`${selected.name} · ${selectedResult.distance<.35?'轮廓快合拢了，轻轻挪近。':'拖住花笺，让影子靠近幕上的同形轮廓。'}`;
      group.updateWorldMatrix(true,true);
      return {ready:result.ready,progress:result.progress,aligned:result.aligned,phase:result.ready?'garden':result.aligned?'emerging':'discover',hint,status,selected:draft.selected,selectedLabel:selected.name,dragging:!!drag,undoCount:history.length,
        controls:[...RAIN_PANES.map(p=>({id:'select',value:p.id,label:p.name,selected:draft.selected===p.id})),{id:'left',label:'← 左移'},{id:'up',label:'↑ 上移'},{id:'down',label:'↓ 下移'},{id:'right',label:'右移 →'},{id:'undo',label:'撤回 Z',disabled:history.length===0&&!drag},{id:'reset',label:'重新布置 R'}],
        draft:copy(),next:next?.id??null,panes:RAIN_PANES.map((p,i)=>{worldPoint.set(draft.positions[p.id].x,draft.positions[p.id].y,p.z);group.localToWorld(worldPoint);const worldPosition=worldPoint.toArray();worldPoint.set(...p.target,p.z);group.localToWorld(worldPoint);return {id:p.id,name:p.name,shape:p.shape,position:[draft.positions[p.id].x,draft.positions[p.id].y,p.z],target:[...p.target,p.z],worldPosition,worldTarget:worldPoint.toArray(),aligned:result.entries[i].aligned,distance:result.entries[i].distance};}),growth:growth.map(g=>g.amount),outcome:{choice:committedChoice,blend:{...outcomeBlend},plants:growth.map(g=>({position:g.plant.position.toArray(),scale:g.plant.scale.toArray()}))},disposed};
    },
    restore(data){if(disposed)return;cancelDrag();draft=restoreRainDraft(data);history=[];glowTime=0;const evaluation=sync();for(let i=0;i<growth.length;i++){growth[i].amount=evaluation.entries[i].aligned?1:0;growth[i].plant.visible=growth[i].amount>0;growth[i].plant.scale.setScalar(Math.max(.005,growth[i].amount));}},
    dispose(){if(disposed)return;disposed=true;drag=null;history=[];const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list)if(m)materials.add(m);});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const texture of textures)texture.dispose();textures.clear();group.clear();panes.clear();pickables.length=0;}
  };
}
