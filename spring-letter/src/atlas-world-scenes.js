import * as THREE from 'three';
import {ATLAS_LOCATIONS,CONSERVATORY_BEDS,ATLAS_STARS,STAR_ROUTE,CLOUD_ISLANDS,ATLAS_NOTES} from './atlas-content.js';
import {atlasGroundHeight} from './atlas-model.js';
import {CONSERVATORY_TREES,CONSERVATORY_EXIT_POSTS,OBSERVATORY_COLUMNS,OBSERVATORY_RUBBLE,ATLAS_SOLID_LANDMARKS} from './atlas-spatial.js';
import {TAU,bounded,finite,random,surface,transformed,combine,tube,blade,fernGeometry,broadLeafGeometry,orchidGeometry,cupFlowerGeometry,nightFlowerGeometry,plumeGeometry,makeBuilder,addFlora,makeSwayMaterial,erodedRock,brokenColumn,mountainRidge,mineralTextures} from './atlas-world-geometry.js';

// The actual model is the source of walkable elevation. Decorative cliff
// columns can extend beyond its bounded rectangle, where only the slope's end
// height is used; those columns are never registered as walking surfaces.
export const observatoryHeight=z=>atlasGroundHeight('observatory',0,z)??bounded((-z-10)/8)*1.8;
const box=(x,y,z,px,py,pz,ry=0)=>transformed(new THREE.BoxGeometry(x,y,z),px,py,pz,0,ry);
const cylinder=(r,h,x,y,z,sides=8)=>transformed(new THREE.CylinderGeometry(r,r,h,sides),x,y,z);
function terrainColors(geometry,base,other,field){
 const a=new THREE.Color(base),b=new THREE.Color(other),color=new THREE.Color(),values=[],p=geometry.attributes.position;
 for(let i=0;i<p.count;i++){color.copy(a).lerp(b,bounded(field(p.getX(i),p.getZ(i),p.getY(i))));values.push(color.r,color.g,color.b);}
 geometry.setAttribute('color',new THREE.Float32BufferAttribute(values,3));return geometry;
}
function noteSigns(b,stone,heightAt=()=>0){for(const note of ATLAS_NOTES[b.group.userData.location])b.label(note.title,note.x,heightAt(note.z),note.z,stone);}
function setShadowFocus(light,p){light.position.set(p.x-13,p.y+22,p.z+8);light.target.position.set(p.x,p.y,p.z-4);}
function lowCloudGeometry(seed=2){const rand=random(seed),parts=[];for(let i=0;i<8;i++)parts.push(transformed(new THREE.IcosahedronGeometry(1,2),(i-3.5)*.52,.2+rand()*.7,(rand()-.5)*1.4,0,rand()*TAU,0,.9+rand()*.6,.65+rand()*.55,.85+rand()*.45));return combine(parts);}

export function createConservatory(){
 const b=makeBuilder('conservatory'),rand=random(6119);
 const earth=b.material('conservatory-damp-earth','#ffffff',{roughness:1,vertexColors:true,...mineralTextures(b,'soil')});
 const paving=b.material('conservatory-worn-ochre-stone','#a6a58b',{roughness:.96,...mineralTextures(b,'limestone')});
 const bronze=b.material('conservatory-aged-brass','#91784f',{metalness:.38,roughness:.68});
 const dark=b.material('conservatory-aged-timber','#4a4435',{roughness:.95});
 const moss=b.material('conservatory-deep-fern','#426f58',{side:THREE.DoubleSide,roughness:.87,emissive:'#294f3b',emissiveIntensity:.065});
 const bright=b.material('conservatory-new-leaves','#7a9f70',{side:THREE.DoubleSide,emissive:'#3a5c3a',emissiveIntensity:.035});
 const warm=b.material('conservatory-amber-nectar','#f4ce85',{emissive:'#deb46f',emissiveIntensity:.18});
 const sun=b.lights('#fff0d2','#c7e0cc','#355847',2.45);
 const floor=surface(92,68,(u,v)=>[(1-v*2)*17,0,15-u*46]);
 terrainColors(floor,'#45654f','#98a286',(x,z)=>{
  const center=Math.sin((z-8)*.15)*1.2,trail=1-bounded((Math.abs(x-center)-.5)/1.4);
  let branch=0;for(const bed of CONSERVATORY_BEDS)if(x*bed.x>0&&Math.abs(x)<Math.abs(bed.x)+.5)branch=Math.max(branch,1-bounded(Math.abs(z-bed.z-1.2)/.9));
  return .12+.17*Math.sin(x*.71+z*.37)*Math.cos(z*.83)+Math.max(trail,branch)*.64;
 });
 b.walk(b.mesh(floor,earth,'conservatory-continuous-earth'));
 const banks=[box(34,.8,1,0,-.4,15.4),box(34,.8,1,0,-.4,-31.4),box(1,.8,46,-17.4,-.4,-8),box(1,.8,46,17.4,-.4,-8)];b.batch(banks,dark,'conservatory-earth-foundation');
 // A single surrounding terrain mesh seats the exterior forest. These three
 // adjoining strips leave an exact hole for the original playable rectangle:
 // no coplanar overdraw, no vertical enclosure, and no new movement support.
 const outerStrip=(minX,maxX,minZ,maxZ,rows,columns)=>surface(rows,columns,(u,v)=>{
  const x=maxX-v*(maxX-minX),z=maxZ-u*(maxZ-minZ),distance=Math.hypot(Math.max(0,Math.abs(x)-17),Math.max(0,-31-z,z-15));
  const blend=bounded(distance/8),height=blend*(.11+.07*Math.sin(x*.16+z*.05)+.08*Math.cos(z*.13-x*.08));
  return[x,height,z];
 });
 const forestFloor=combine([outerStrip(-62,62,-100,-31,24,40),outerStrip(-45,-17,-31,15,16,10),outerStrip(17,45,-31,15,16,10)]);
 const outerUV=forestFloor.attributes.uv,outerPositions=forestFloor.attributes.position;
 for(let i=0;i<outerUV.count;i++)outerUV.setXY(i,(17-outerPositions.getX(i))/34,(15-outerPositions.getZ(i))/46);
 terrainColors(forestFloor,'#45654f','#839a7c',(x,z)=>.14+.18*Math.sin(x*.71+z*.37)*Math.cos(z*.83)+.10*(1-bounded(Math.abs(x)/4)));
 b.mesh(forestFloor,earth,'conservatory-outer-forest-floor').castShadow=false;
 const path=[];
 for(let i=0;i<14;i++){const z=11-i*2.9,x=Math.sin((z-8)*.15)*1.2+(rand()-.5)*.45;path.push(transformed(erodedRock(i,1),x,.012,z,0,rand()*TAU,0,.65+rand()*.28,.045,.45+rand()*.25));}
 for(const bed of CONSERVATORY_BEDS)for(let i=1;i<=2;i++){const x=bed.x*i/3,z=bed.z+1.2;path.push(transformed(erodedRock(i+4),x,.015,z,0,.5,0,.53,.035,.36));}
 b.batch(path,paving,'conservatory-winding-walkway');

 const entrance=b.landmark('conservatory-amber-ribbed-hall'),ribs=[],rails=[],glassParts=[];
 for(let i=0;i<9;i++){
  const z=10-i*4.9,points=[];
  for(let j=0;j<=20;j++){const angle=j/20*Math.PI;points.push([Math.cos(angle)*12,.25+Math.sin(angle)*8.3,z]);}
  ribs.push(tube(points,.085,32,6));
  for(const side of [-1,1]){ribs.push(cylinder(.15,.16,side*12,.08,z,10));rails.push(box(.13,1.2,.12,side*12,.6,z));}
  if(i%3===1)for(const side of [-1,1])glassParts.push(surface(4,6,(u,v)=>{const a=.48+u*.55;return [side*Math.cos(a)*11.94,Math.sin(a)*8.24+.25,z-v*3.3];}));
 }
 for(const x of [-12,12])rails.push(box(.12,.14,40,x,2.1,-9.5));
 for(const a of [.55,1.05,Math.PI/2,2.09,2.59])rails.push(box(.07,.07,39.3,Math.cos(a)*12,.25+Math.sin(a)*8.3,-9.6));
 b.batch(ribs,bronze,'conservatory-main-ribs',entrance);b.batch(rails,bronze,'conservatory-glazing-mullions',entrance);
 // The greenhouse is embedded in a forest, not on an isolated beige display
 // floor. All new trunks and their crowns stand beyond the walkable rectangle.
 // Three physical depth bands pick up the scene fog at different distances.
 const forest=b.landmark('conservatory-rainforest-depth'),forestTrunks=[];
 const forestBands=[
  {name:'near',color:'#28574b',z:-40,height:8,count:7,width:48,size:3.1},
  {name:'middle',color:'#447768',z:-56,height:12,count:9,width:72,size:4.1},
  {name:'far',color:'#71968a',z:-77,height:17,count:11,width:112,size:5.3}
 ];
 for(const [layer,band]of forestBands.entries()){
  const crowns=[],sites=[];
  for(let i=0;i<band.count;i++)sites.push({x:(i/(band.count-1)-.5)*band.width+(rand()-.5)*2,z:band.z+(rand()-.5)*3,h:band.height+rand()*2.5});
  if(layer===0)for(const side of [-1,1])for(const z of [8,-6,-20,-32])sites.push({x:side*26,z,h:8+rand()*2.5});
  for(const [i,site]of sites.entries()){
   const {x,z,h}=site,lean=(rand()-.5)*.7;
   forestTrunks.push(tube([[x,-.2,z],[x+lean,h*.55,z+.2],[x+lean*.6,h,z]],.23+rand()*.15,14,6));
   for(const direction of [-1,1])forestTrunks.push(tube([[x+lean,h*.55,z],[x+direction*1.3,h*.78,z+.2],[x+direction*2.2,h-.15,z-.2]],.09,9,5));
   for(let lobe=0;lobe<4;lobe++){
    const a=lobe*2.3+i,spread=band.size;
    crowns.push(transformed(erodedRock(layer*43+i*7+lobe),x+Math.cos(a)*spread*.6,h+Math.sin(lobe*1.7)*.7,z+Math.sin(a)*spread*.45,0,rand()*TAU,0,spread*(.75+rand()*.2),1.2+rand()*1.1,spread*(.65+rand()*.2)));
   }
  }
  const material=b.material(`conservatory-${band.name}-forest-canopy`,band.color,{roughness:1,emissive:band.color,emissiveIntensity:.025});
  const crown=b.batch(crowns,material,`conservatory-${band.name}-forest-crowns`,forest);crown.castShadow=layer===0;
 }
 b.batch(forestTrunks,dark,'conservatory-forest-trunks-and-branches',forest);
 const exitGate=b.landmark('conservatory-forest-post-gate'),exitWood=[];
 for(const post of CONSERVATORY_EXIT_POSTS)exitWood.push(box(.27,3.5,.30,post.x,1.75,post.z));
 exitWood.push(box(7.25,.19,.30,0,3.47,-29.6));
 for(let i=0;i<9;i++)exitWood.push(box(.72,.075,1.45,(i-4)*.79,3.75+Math.cos((i-4)*.18)*.28,-29.75));
 b.batch(exitWood,dark,'conservatory-forest-post-gate-timber',exitGate);
 const exitCloth=b.material('conservatory-exit-letter-cloth','#e3d6ad',{side:THREE.DoubleSide,roughness:1});
 const exitBanner=b.mesh(surface(12,7,(u,v)=>[(v-.5)*1.18,3.4-u*1.15,.08+Math.sin(u*5+v)*.1]),exitCloth,'conservatory-forest-post-letter-banner',[0,0,-29.5],exitGate);
 const postSeal=b.mesh(new THREE.CylinderGeometry(.16,.16,.025,12),bronze,'conservatory-forest-postmark',[0,2.76,-29.30],exitGate);postSeal.rotation.x=Math.PI/2;
 b.label('沿林间小径 · 往星台去',2.2,0,-28.6,bronze);
 const glass=b.material('conservatory-remaining-amber-glazing','#dfc996',{transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide,roughness:.3,metalness:.1});glass.forceSinglePass=true;
 const panes=b.batch(glassParts,glass,'conservatory-broken-roof-panes',entrance);panes.castShadow=false;
 const gate=b.landmark('conservatory-entrance-portal');const gateParts=[];
 for(const side of [-1,1]){gateParts.push(box(.4,2.9,.45,side*3.3,1.45,12));gateParts.push(box(2.1,.3,.45,side*4.55,2.8,12));}
 gateParts.push(tube([[-3.3,2.8,12],[-2,4.2,12],[0,4.6,12],[2,4.2,12],[3.3,2.8,12]],.13,24,8));b.batch(gateParts,bronze,'conservatory-door-crown',gate);
 gate.position.set(-11,0,-17); // Salvaged gate sits at the west wall, clear of arrival.

 const fern=b.landmark('conservatory-giant-tree-ferns'),trunks=[],fronds=[],broad=[];
 for(const {x,z,height:h,scale:s}of CONSERVATORY_TREES){
  trunks.push(tube([[x,0,z],[x-.12,h*.45,z+.1],[x+.1,h,z]],.18,12,8));
  for(let j=0;j<8;j++)fronds.push({x:x+.1,y:h,z,ry:j*TAU/8+.12,rx:-.18+Math.sin(j*1.8)*.28,s:s*(.8+rand()*.3)});
 }
 b.batch(trunks,dark,'conservatory-fern-trunks',fern);
 const fernMesh=b.instances(fernGeometry(),moss,fronds,'conservatory-crown-fronds');fern.add(fernMesh);
 const understory=[];
 for(let i=0;i<190;i++){
  const side=i%2?-1:1,x=side*(5.5+rand()*10.3),z=12-rand()*41,h=.38+rand()*.9;
  if(CONSERVATORY_BEDS.some(bed=>Math.hypot(x-bed.x,z-bed.z)<2.7))continue;
  understory.push({x,y:.03,z,ry:rand()*TAU,rx:-.15+rand()*.35,s:h});
  if(i<135)for(let j=0;j<2;j++)broad.push({x:x-side*.15,y:.08,z,ry:j*2.3+rand(),rx:-.45-rand()*.45,s:.4+rand()*.58});
 }
 const lowFerns=b.instances(fernGeometry(),bright,understory,'conservatory-understory-ferns'),broadLeaves=b.instances(broadLeafGeometry(),moss,broad,'conservatory-broad-tropical-leaves');
 const vineParts=[];
 const hangingLeaves=[];
 for(let i=0;i<42;i++){const side=i%2?-1:1,x=side*(8.8+rand()*2.5),z=9-rand()*37,y=3.9+rand()*2.8;vineParts.push(tube([[x,y,z],[x+.25,y-.8,z+.08],[x-.15,y-1.9,z+.31],[x+.12,y-2.9,z+.4]],.018+rand()*.013,18,4));for(let n=0;n<3;n++)hangingLeaves.push({x:x+.15,y:y-.5-n*.65,z:z+.2,rx:1.6,ry:rand()*TAU,s:.17+rand()*.14});}
 b.batch(vineParts,dark,'conservatory-hanging-roots');b.instances(broadLeafGeometry(),bright,hangingLeaves,'conservatory-hanging-vine-leaves');
 const nursery=b.landmark('conservatory-timber-nursery-shelves'),shelves=[],pots=[],seedlings=[];
 for(const [x,z]of [[-12,-9],[12,-20]]){
  for(const dx of [-1.5,1.5])for(const dz of [-.5,.5])shelves.push(box(.09,1.8,.09,x+dx,.9,z+dz));
  for(const y of [.55,1.25])for(let n=0;n<4;n++)shelves.push(box(3.2,.075,.22,x,y,z+(n-1.5)*.25));
  for(let n=0;n<7;n++){const px=x-1.2+(n%4)*.75,pz=z+(n%2?-.2:.2),py=n<4?.6:1.3;pots.push(transformed(new THREE.CylinderGeometry(.17,.12,.26,9),px,py+.13,pz));for(let l=0;l<3;l++)seedlings.push({x:px,y:py+.25,z:pz,rx:-.8,ry:l*2.1,s:.14});}
 }b.batch(shelves,dark,'conservatory-handmade-wood-shelving',nursery);b.batch(pots,b.material('conservatory-clay-pots','#a98568',{roughness:1}),'conservatory-terracotta-nursery-pots',nursery);const starts=b.instances(broadLeafGeometry(),bright,seedlings,'conservatory-young-potted-plants');nursery.add(starts);

 const beds=[];
 for(const [i,bed]of CONSERVATORY_BEDS.entries()){
  const root=b.landmark(`conservatory-orchid-bed-${bed.id}`),bedParts=[];root.position.set(bed.x,0,bed.z);
  for(const x of [-1.4,1.4])bedParts.push(box(.12,.24,3.5,x,.12,0));for(const z of [-1.75,1.75])bedParts.push(box(2.9,.24,.12,0,.12,z));
  b.batch(bedParts,dark,`conservatory-${bed.id}-raised-edge`,root);
  b.mesh(new THREE.BoxGeometry(2.7,.12,3.3),earth,`conservatory-${bed.id}-soil`,[0,.04,0],root);
  const bloomMat=b.material(`conservatory-${bed.id}-orchid-petals`,bed.color,{side:THREE.DoubleSide,roughness:.65,emissive:bed.color,emissiveIntensity:.04});
  const flowers=[];for(let n=0;n<16;n++)flowers.push({x:(rand()-.5)*2.3,y:.12,z:(rand()-.5)*2.7,ry:rand()*TAU,s:.65+rand()*.65});
  const set=addFlora(b,orchidGeometry(i),flowers,{petals:bloomMat,green:bright,heart:warm},`conservatory-${bed.id}-orchids`);
  const bloomGroup=new THREE.Group();root.add(bloomGroup);for(const object of Object.values(set))bloomGroup.add(object);beds.push({root:bloomGroup,material:bloomMat});
  b.label(bed.name,bed.x+2,0,bed.z+.7,bronze);
 }
 const bench=b.landmark('conservatory-last-gardeners-bench'),benchParts=[];
 for(let i=0;i<4;i++)benchParts.push(box(2.8,.1,.19,10,.67,-24+(i-1.5)*.22));for(const x of [8.9,11.1])benchParts.push(box(.12,.65,.7,x,.32,-24));benchParts.push(box(2.8,.25,.1,10,1.16,-24.5));b.batch(benchParts,dark,'conservatory-slatted-bench',bench);
 const fountain=b.landmark('conservatory-rain-catcher');b.mesh(new THREE.CylinderGeometry(1.15,.8,.5,20,1,true),bronze,'conservatory-copper-rain-basin',[4,.25,-29],fountain);b.mesh(new THREE.CircleGeometry(1.08,32).rotateX(-Math.PI/2),b.material('conservatory-collected-rain','#71876c',{roughness:.19,metalness:.3}),'conservatory-rain-water',[4,.49,-29],fountain);
 noteSigns(b,bronze);

 const swarm=b.landmark('conservatory-butterflies'),wingMat=b.material('conservatory-moth-amber-wings','#e8bb72',{side:THREE.DoubleSide,emissive:'#b18b44',emissiveIntensity:.12,roughness:.65});
 const wing=surface(8,5,(u,v)=>{const a=u*Math.PI,r=.012+v*.13;return [Math.sin(a)*r,Math.cos(a)*r*.67,.008*Math.sin(v*Math.PI)];});
 const wings=new THREE.InstancedMesh(wing,wingMat,18);wings.name='conservatory-living-moth-wings';swarm.add(wings);const dummy=new THREE.Object3D();
 const mothBodies=new THREE.InstancedMesh(new THREE.CylinderGeometry(.009,.013,.09,6),dark,9);mothBodies.name='conservatory-moth-bodies';swarm.add(mothBodies);
 const rainCount=360,rainPositions=new Float32Array(rainCount*6),rainBase=[];
 for(let i=0;i<rainCount;i++){const x=(rand()-.5)*30,z=12-rand()*42,y=rand()*10;rainBase.push([x,y,z]);rainPositions.set([x,y,z,x-.018,y+.21,z],i*6);}
 const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));const rainMat=new THREE.LineBasicMaterial({color:'#f7e7be',transparent:true,opacity:.29,depthWrite:false});b.materials.add(rainMat);const rain=new THREE.LineSegments(rainGeo,rainMat);rain.name='conservatory-rain-drops';b.group.add(rain);
 const ambientDust=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:'#e8c779',size:.055,transparent:true,opacity:.55,depthWrite:false}));
 const dustPos=[];for(let i=0;i<65;i++)dustPos.push((rand()-.5)*24,.4+rand()*5,8-rand()*35);ambientDust.geometry.setAttribute('position',new THREE.Float32BufferAttribute(dustPos,3));ambientDust.name='conservatory-pollen';b.materials.add(ambientDust.material);b.group.add(ambientDust);
 return{...b,update(t,dt,state,p){
  const motion=state.settings?.reducedMotion!==true,light=state.settings?.quality==='light'||state.quality==='light';setShadowFocus(sun,p);
  const butterfly=state.butterfly||{};swarm.position.set(finite(butterfly.x,0),finite(butterfly.y,1.1),finite(butterfly.z,6));wingMat.emissiveIntensity=.05+bounded(butterfly.trust)*.16;
  lowFerns.count=light?Math.floor(understory.length*.58):understory.length;broadLeaves.count=light?Math.floor(broad.length*.6):broad.length;
  for(let i=0;i<9;i++)for(let side=0;side<2;side++){
   const phase=i*2.4,a=phase+(motion?t*.22:0);dummy.position.set(Math.sin(a)*(.42+i*.065),Math.cos(a*1.7)*.22,Math.cos(a)*.53);dummy.rotation.set(0,side?Math.PI:0,(side?1:-1)*(motion?Math.sin(t*13+phase)*.7:.45));dummy.scale.setScalar(.65+i%3*.15);dummy.updateMatrix();wings.setMatrixAt(i*2+side,dummy.matrix);
   if(side===0){dummy.rotation.set(0,0,0);dummy.updateMatrix();mothBodies.setMatrixAt(i,dummy.matrix);}
  }wings.instanceMatrix.needsUpdate=true;wings.computeBoundingSphere();mothBodies.instanceMatrix.needsUpdate=true;mothBodies.computeBoundingSphere();
  beds.forEach((bed,i)=>{const value=bounded(state.blooms?.[i]);bed.root.scale.setScalar(.65+value*.35);bed.material.emissiveIntensity=.025+value*.13;});
  if(motion){for(let i=0;i<rainCount;i++){const [x,y,z]=rainBase[i],height=((y-t*3.2)%10+10)%10;rainPositions.set([x,height,z,x-.018,height+.21,z],i*6);}rainGeo.attributes.position.needsUpdate=true;}
  rainGeo.setDrawRange(0,(light?180:rainCount)*2);rainMat.opacity=motion?.29:.10;ambientDust.visible=!light;
 }};
}

export function createObservatory(){
 const b=makeBuilder('observatory'),rand=random(91377);
 const basaltGrain=mineralTextures(b,'basalt');
 const basalt=b.material('observatory-blue-basalt','#ffffff',{roughness:.93,vertexColors:true,...basaltGrain});
 const basaltSolid=b.material('observatory-basalt-pillars','#45536b',{roughness:.94,...basaltGrain});
 const marble=b.material('observatory-lunar-limestone','#bec5cf',{roughness:.9,...mineralTextures(b,'moonstone')});
 const bronze=b.material('observatory-celestial-brass','#ad8c55',{metalness:.72,roughness:.38});
 const moss=b.material('observatory-silver-blue-foliage','#627c91',{side:THREE.DoubleSide,roughness:.9});
 const pale=b.material('observatory-night-flower','#d9dce5',{side:THREE.DoubleSide,emissive:'#8f9eb9',emissiveIntensity:.14,roughness:.68});
 const heart=b.material('observatory-flower-heart','#d9bd82',{emissive:'#b58c4c',emissiveIntensity:.13});
 const sun=b.lights('#c6d5ff','#9eafd2','#35435f',2.3);
 const floor=surface(86,68,(u,v)=>[(1-v*2)*17,observatoryHeight(15-u*43),15-u*43]);terrainColors(floor,'#34465f','#78849a',(x,z)=>.13+.26*(.5+.5*Math.sin(x*.44+z*.23)*Math.cos(z*.57))+.18*(1-bounded(Math.abs(x)/3)));
 b.walk(b.mesh(floor,basalt,'observatory-rising-stone-terrace'));
 const baseParts=[box(34,3.1,1,0,-1.55,15.4),box(34,4.9,1,0,-.65,-28.4),box(1,4,43,-17.4,-1,-6.5),box(1,4,43,17.4,-1,-6.5)];b.batch(baseParts,basaltSolid,'observatory-cliff-foundations');
 const path=[];for(let i=0;i<15;i++){const z=12-i*2.1;path.push(transformed(erodedRock(i+35),Math.sin(i*.67)*.26,observatoryHeight(z)+.03,z,0,rand()*TAU,0,.7+rand()*.32,.05,.5+rand()*.3));}b.batch(path,marble,'observatory-moonlit-approach');
 const ring=b.landmark('observatory-broken-horseshoe-colonnade'),pillars=[],caps=[],rubble=[];
 for(const {x,z,height:h,index:i}of OBSERVATORY_COLUMNS){
  const y=observatoryHeight(z);pillars.push(transformed(brokenColumn(.53,h,i),x,y,z));
  if(i%3!==0)caps.push(transformed(erodedRock(i+70),x,y+h+.04,z,0,.2,0,.72,.16,.72));
  caps.push(transformed(erodedRock(i+90),x,y+.1,z,0,.2,0,.78,.14,.78));
 }
 for(const {x,z}of OBSERVATORY_RUBBLE)rubble.push(transformed(brokenColumn(.49,2.1,7).translate(0,-1.05,0),x,observatoryHeight(z)+.47,z,0,.25,Math.PI/2));
 b.batch(pillars,marble,'observatory-fractured-moon-columns',ring);b.batch(caps,marble,'observatory-column-capitals',ring);b.batch(rubble,marble,'observatory-fallen-column-drums',ring);
 const basaltColumns=[];for(let i=0;i<54;i++){const side=i%2?-1:1,x=side*(16.1+rand()*5.3),z=12-rand()*43,y=observatoryHeight(z),h=1+rand()*3.7;basaltColumns.push(transformed(new THREE.CylinderGeometry(.48,.67,h,6),x,y-h/2+.35,z,0,rand()*TAU));}b.batch(basaltColumns,basaltSolid,'observatory-hexagonal-cliff-columns');
 const dais=b.landmark('observatory-star-reading-dais'),rings=[];
 for(const r of [3.1,3.75])rings.push(transformed(new THREE.TorusGeometry(r,.045,5,64,Math.PI*1.82),0,1.84,-18,Math.PI/2,0,.13));
 b.batch(rings,bronze,'observatory-inlaid-star-platform',dais);
 const marks=[];for(let i=0;i<16;i++){const a=i*TAU/16;marks.push(box(.055,.025,.32,Math.sin(a)*3.4,1.82,-18+Math.cos(a)*3.4,-a));}b.batch(marks,marble,'observatory-compass-marks',dais);
 const armillary=b.landmark('observatory-great-brass-armillary'),armillarySite=ATLAS_SOLID_LANDMARKS.armillary;armillary.position.set(armillarySite.x,observatoryHeight(armillarySite.z),armillarySite.z);
 const stand=[];for(const x of [-1.5,1.5])stand.push(tube([[x,0,0],[x*.7,1.3,0],[0,2.4,0]],.16,12,8));stand.push(cylinder(1.65,.25,0,.13,0,12));b.batch(stand,basaltSolid,'observatory-armillary-pedestal',armillary);
 const sphereRing=new THREE.Group();sphereRing.name='observatory-tilted-celestial-rings';sphereRing.position.y=4.4;armillary.add(sphereRing);
 for(const [i,angles]of [[.35,.1,0],[1.3,.4,.4],[.1,.6,1.1]].entries()){
  const torus=b.mesh(new THREE.TorusGeometry(3.55-i*.18,.065,6,96),bronze,`observatory-armillary-orbit-${i}`,[0,0,0],sphereRing);torus.rotation.set(...angles);
 }
 const equator=[];for(let i=0;i<24;i++){const a=i*TAU/24;equator.push(box(.055,.3,.055,Math.cos(a)*3.57,Math.sin(a)*3.57,0));}b.batch(equator,bronze,'observatory-celestial-degree-ticks',sphereRing);
 b.mesh(new THREE.SphereGeometry(.47,20,12),heart,'observatory-armillary-earth',[0,0,0],sphereRing);
 const moon=b.landmark('observatory-cratered-moon');moon.position.set(-17,24,-58);
 const moonMat=b.material('observatory-moon-porcelain','#e4e6d9',{emissive:'#b5bbcb',emissiveIntensity:.8,roughness:1});const moonBody=b.mesh(new THREE.SphereGeometry(5.8,32,20),moonMat,'observatory-solid-moon',[0,0,0],moon);moonBody.castShadow=false;
 const craterMat=b.material('observatory-lunar-maria','#bac5cb',{emissive:'#8b97a9',emissiveIntensity:.6,roughness:1}),craters=[];
 for(const [x,y,s]of [[-1.8,1.3,1.1],[1.3,-.9,1.5],[.8,2.2,.65],[-2.3,-1.8,.7]])craters.push({x,y,z:Math.sqrt(Math.max(.01,5.8**2-x*x-y*y))-.08,sx:s,sy:s*.8,sz:.12});const craterMesh=b.instances(new THREE.SphereGeometry(1,12,8),craterMat,craters,'observatory-moon-crater-relief');moon.add(craterMesh);
 const farMat=b.material('observatory-distant-mountain-blue','#354766',{roughness:1}),ridge=b.mesh(mountainRidge(155,19,7),farMat,'observatory-distant-mountains',[0,-2,-68]);ridge.castShadow=false;
 b.mesh(mountainRidge(180,23,13),b.material('observatory-remote-blue-ridge','#293b59',{roughness:1}),'observatory-second-mountain-ridge',[6,-1,-96]).castShadow=false;

 const flowers=[];for(let i=0;i<86;i++){const side=i%2?-1:1,x=side*(5+rand()*10),z=10-rand()*34;flowers.push({x,y:observatoryHeight(z),z,ry:rand()*TAU,s:.4+rand()*.4});}addFlora(b,nightFlowerGeometry(),flowers,{petals:pale,green:moss,heart},'observatory-six-point-night-flowers');
 const rosettes=[];for(let i=0;i<36;i++){const x=(i%2?-1:1)*(7+rand()*8),z=10-rand()*34;for(let j=0;j<5;j++)rosettes.push({x,y:observatoryHeight(z),z,rx:-.2,ry:j*TAU/5,s:.3+rand()*.15});}b.instances(broadLeafGeometry(),moss,rosettes,'observatory-silver-leaf-rosettes');noteSigns(b,bronze,observatoryHeight);

 const starRoot=b.landmark('observatory-envelope-constellation');
 const starMat=b.material('observatory-star-light','#f8e4b2',{emissive:'#ffe7ad',emissiveIntensity:2.5,roughness:.7});
 const nodes=b.instances(new THREE.SphereGeometry(.105,12,8),starMat,ATLAS_STARS.map(s=>({...s,s:1})),'observatory-real-star-nodes');starRoot.add(nodes);nodes.castShadow=false;nodes.receiveShadow=false;
 const linePositions=[];for(let i=1;i<STAR_ROUTE.length;i++)for(const id of [STAR_ROUTE[i-1],STAR_ROUTE[i]]){const s=ATLAS_STARS[id];linePositions.push(s.x,s.y,s.z);}
 const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));lineGeo.setDrawRange(0,0);const lineMat=new THREE.LineBasicMaterial({color:'#f2d397',transparent:true,opacity:.9});b.materials.add(lineMat);const line=new THREE.LineSegments(lineGeo,lineMat);line.name='observatory-traced-star-route';starRoot.add(line);
 const fieldPositions=[];for(let i=0;i<440;i++){const a=rand()*TAU,r=65+rand()*25,y=8+rand()*55;fieldPositions.push(Math.cos(a)*r,y,-24+Math.sin(a)*r);}const fieldGeo=new THREE.BufferGeometry();fieldGeo.setAttribute('position',new THREE.Float32BufferAttribute(fieldPositions,3));const fieldMat=new THREE.PointsMaterial({color:'#b8ccec',size:.09,transparent:true,opacity:.75,depthWrite:false});b.materials.add(fieldMat);const field=new THREE.Points(fieldGeo,fieldMat);field.name='observatory-distant-star-field';b.group.add(field);
 let tracedSegments=0;
 return{...b,get tracedSegments(){return tracedSegments;},update(t,dt,state,p){
  setShadowFocus(sun,p);const motion=state.settings?.reducedMotion!==true;sphereRing.rotation.y=motion?Math.sin(t*.07)*.06:0;
  const count=Array.isArray(state.stars)?state.stars.length:0;tracedSegments=Math.max(0,Math.min(STAR_ROUTE.length-1,count-1));lineGeo.setDrawRange(0,tracedSegments*2);
  starMat.emissiveIntensity=state.stargazing?2.1+(motion?Math.sin(t*1.3)*.22:0):1.2;fieldMat.opacity=state.stargazing?.85:.6;
 }};
}

export function createMeadow(){
 const b=makeBuilder('meadow'),rand=random(38771);
 const grass=b.material('meadow-soft-upland-grass','#ffffff',{roughness:1,vertexColors:true,...mineralTextures(b,'soil')});
 const chalk=b.material('meadow-chalk-rooted-cliffs','#ffffff',{roughness:1,metalness:0,vertexColors:true,...mineralTextures(b,'chalk')});
 const stone=b.material('meadow-sun-bleached-stone','#ded8c9',{roughness:1,metalness:0,...mineralTextures(b,'upland-stone')});
 const wood=b.material('meadow-wind-sculpture-wood','#9e7860',{roughness:.84});
 const green=makeSwayMaterial(b,'meadow-living-green','#668a6a'),petal=b.material('meadow-coral-cup-petals','#e8aca8',{side:THREE.DoubleSide,roughness:.7}),ivory=b.material('meadow-white-cup-petals','#ede6d6',{side:THREE.DoubleSide,roughness:.7}),heart=b.material('meadow-pollen-gold','#b49359',{roughness:.8});
 const plumes=b.material('meadow-white-feather-plumes','#c4bba0',{side:THREE.DoubleSide,roughness:1});
 const sun=b.lights('#fff0d4','#c2e0e6','#668d7f',2.6);
 const coralFlowers=[],whiteFlowers=[],plumePlants=[],grassBlades=[],edgeRoots=[],buttresses=[],rosettes=[],windTrail=[];
 for(const island of CLOUD_ISLANDS){
  const root=b.landmark(`meadow-floating-island-${island.id}`);
  // The complete ellipse is the model's landing support. Its top is exactly
  // level; unlike a decorative fan of rocks, no invisible bridge fills a gap.
  const top=surface(15,80,(u,v)=>{const a=-v*TAU;return[island.x+Math.cos(a)*island.rx*u,island.height,island.z+Math.sin(a)*island.rz*u];});
  terrainColors(top,'#7ea287','#c5c19d',(x,z)=>.36+.19*Math.sin(x*.53+z*.29)*Math.cos(z*.55));
  b.walk(b.mesh(top,grass,`meadow-island-${island.id}-walkable-top`,[0,0,0],root));
  const layers=[[0,1],[.06,1],[.12,.90],[.25,.92],[.31,.79],[.44,.81],[.50,.69],[.65,.72],[.72,.55],[.84,.59],[.91,.43],[1,.40]];
  const side=surface(28,80,(u,v)=>{
   const a=-v*TAU,deep=5.2+island.id*.45+Math.sin(a*3+island.id)*.75;
   let level=layers.length-2;for(let i=0;i<layers.length-1;i++)if(u>=layers[i][0]&&u<=layers[i+1][0]){level=i;break;}
   const lo=layers[level],hi=layers[level+1],s=lo[1]+(hi[1]-lo[1])*(u-lo[0])/(hi[0]-lo[0]);
   const erosion=(.10*Math.sin(a*3+island.id)+.05*Math.sin(a*7-island.id)+.025*Math.cos(a*13))*Math.sin(Math.min(1,u*4)*Math.PI/2),scale=s*(1+erosion);
   return[island.x+Math.cos(a)*island.rx*scale+Math.sin(u*Math.PI)*Math.sin(island.id)*.55,island.height-u*deep+Math.sin(a*5)*Math.sin(u*Math.PI)*.12,island.z+Math.sin(a)*island.rz*scale];
  });terrainColors(side,'#9caaa0','#e5dfd0',(x,z,y)=>{
   const depth=island.height-y,band=.5+.5*Math.sin(depth*7+x*.16+z*.23);
   return bounded(.62+band*.22+Math.sin(x*.8+z*.5)*.1-(depth<.45?.28:0));
  });b.mesh(side,chalk,`meadow-island-${island.id}-eroded-layered-cliff`,[0,0,0],root);
  const edge=[];for(let i=0;i<11;i++){const a=(i+rand()*.4)*TAU/11;edge.push(transformed(erodedRock(i+island.id*41),island.x+Math.cos(a)*island.rx*.98,island.height-.15,island.z+Math.sin(a)*island.rz*.98,0,rand()*TAU,0,.35+rand()*.5,.23,.45+rand()*.45));}b.batch(edge,stone,`meadow-island-${island.id}-chalk-rim`,root);
  for(let i=0;i<7;i++){const a=i*TAU/7+.27,depth=1.2+rand()*3.5,r=.64+rand()*.2;buttresses.push(transformed(erodedRock(island.id*17+i),island.x+Math.cos(a)*island.rx*r,island.height-depth,island.z+Math.sin(a)*island.rz*r,0,rand()*TAU,0,.85+rand()*.6,.65+rand()*1.0,.65+rand()*.6));}
  for(let i=0;i<96;i++){
   const a=rand()*TAU,r=.42+Math.sqrt(rand())*.48,x=island.x+Math.cos(a)*island.rx*r,z=island.z+Math.sin(a)*island.rz*r;
   const place={x,y:island.height+.015,z,ry:rand()*TAU,s:.38+rand()*.45,order:i};(i%3?coralFlowers:whiteFlowers).push(place);
   if(i<11)plumePlants.push({...place,s:.6+rand()*.35});
   if(i<13)for(let j=0;j<4;j++)rosettes.push({...place,rx:-.15,ry:j*TAU/4,s:.15+rand()*.13});
   for(let j=0;j<2;j++)grassBlades.push({...place,rx:-1.1,ry:rand()*TAU,s:.7+rand()*.7});
  }
  for(let i=0;i<8;i++){const a=rand()*TAU,x=island.x+Math.cos(a)*island.rx*.97,z=island.z+Math.sin(a)*island.rz*.97;edgeRoots.push(tube([[x,island.height-.1,z],[x*.99,island.height-1.3,z+.2],[x+.4,island.height-2.9,z+.5]],.025,10,4));}
  const next=CLOUD_ISLANDS[island.id+1];if(next){const dx=next.x-island.x,dz=next.z-island.z,length=Math.hypot(dx,dz),nx=dx/length,nz=dz/length,edge=1/Math.hypot(nx/island.rx,nz/island.rz);for(let n=0;n<3;n++)windTrail.push(transformed(erodedRock(n+3),island.x+nx*edge*(.3+n*.14),island.height+.015,island.z+nz*edge*(.3+n*.14),0,n,0,.24,.035,.19));}
 }
 b.batch(edgeRoots,b.material('meadow-dark-trailing-roots','#4d6557',{roughness:1}),'meadow-trailing-island-roots');b.batch(buttresses,stone,'meadow-weathered-chalk-buttresses');
 b.instances(blade(1.8,.5,.2,7,4),green.material,rosettes,'meadow-rounded-basal-leaf-rosettes');b.batch(windTrail,stone,'meadow-next-island-pebble-trails');
 // Each density prefix samples all five islands. Truncating the original
 // island-by-island array would strip the later landing zones bare in light.
 for(const plants of [coralFlowers,whiteFlowers,plumePlants,grassBlades])plants.sort((a,b)=>a.order-b.order);
 const coralSet=addFlora(b,cupFlowerGeometry(),coralFlowers,{petals:petal,green:green.material,heart},'meadow-coral-cups'),whiteSet=addFlora(b,cupFlowerGeometry(),whiteFlowers,{petals:ivory,green:green.material,heart},'meadow-white-anemone-cups');
 const plumeSet=addFlora(b,plumeGeometry(),plumePlants,{green:green.material,tips:plumes},'meadow-feather-grass');
 const bladeMesh=b.instances(blade(.7,.045,.15,5,2),green.material,grassBlades,'meadow-low-wind-grass');
 const flags=[],flagParts=[],flagColors=['#cb9791','#d4b574','#e9ddc4','#87a69a','#bd8e9f'];
 for(const [j,island]of CLOUD_ISLANDS.entries()){
  const x=island.x-island.rx*.56,z=island.z-.5,y=island.height,h=j===4?4.8:3.1;
  flagParts.push(cylinder(.04,h,x,y+h/2,z,6));
  const flagMat=b.material(`meadow-repaired-cloth-${j}`,flagColors[j],{side:THREE.DoubleSide,roughness:.95}),flag=b.mesh(surface(16,6,(u,v)=>[v*(.8-u*.18),-u*1.7,.08+Math.sin(u*6+v*2)*(.05+u*.18)]),flagMat,`meadow-wayfinding-wind-flag-${j}`,[x,y+h,z]);
  const next=CLOUD_ISLANDS[j+1],heading=next?Math.atan2(island.z-next.z,next.x-island.x):-.4;flag.userData.windHeading=heading;flag.rotation.y=heading;
  const stitches=[];for(let k=0;k<=j;k++)stitches.push(surface(2,6,(u,v)=>{const t=.16+k*.14+u*.035;return[v*(.8-t*.18),-t*1.7,.092+Math.sin(t*6+v*2)*(.05+t*.18)];}));b.batch(stitches,ivory,`meadow-flag-${j}-sewn-waymarks`,flag);flags.push(flag);
 }
 b.batch(flagParts,wood,'meadow-flag-poles');
 const compass=b.landmark('meadow-flower-wind-sculpture'),sculptureSite=ATLAS_SOLID_LANDMARKS.windflower;compass.position.set(sculptureSite.x,1.5,sculptureSite.z);
 b.mesh(new THREE.CylinderGeometry(.10,.15,4.7,10),wood,'meadow-sculpture-mast',[0,2.35,0],compass);
 const rotor=new THREE.Group();rotor.name='meadow-windflower-rotor';rotor.position.y=4.5;compass.add(rotor);
 const rotorBlades=[];for(let i=0;i<7;i++)rotorBlades.push(transformed(blade(1.5,.22,.32,10,4),0,0,0,-Math.PI/2,0,i*TAU/7));b.batch(rotorBlades,ivory,'meadow-sculpted-windflower-blades',rotor);b.mesh(new THREE.SphereGeometry(.2,12,8),heart,'meadow-windflower-heart',[0,0,.05],rotor);
 const tree=b.landmark('meadow-letter-tree'),treeSite=ATLAS_SOLID_LANDMARKS.letterTree;tree.position.set(treeSite.x,2.8,treeSite.z);
 const trunkParts=[tube([[0,0,0],[.2,2.3,0],[-.05,4.2,0],[.8,6.2,-.15]],.19,20,8)];
 for(const [x,y,z]of [[-2,4.9,.3],[2.3,5,.1],[-1,6.1,-.4],[1.1,6.8,-.3]])trunkParts.push(tube([[0,2.7,0],[x*.45,y-1,z*.5],[x,y,z]],.075,12,6));b.batch(trunkParts,wood,'meadow-weathered-letter-tree-trunk',tree);
 const crown=[];for(let i=0;i<13;i++){const a=i*2.4,r=1+rand()*1.4;crown.push(transformed(new THREE.IcosahedronGeometry(1,1),Math.cos(a)*r,4.6+rand()*1.7,Math.sin(a)*r*.55,0,rand()*TAU,0,1.25,.5,1));}b.batch(crown,b.material('meadow-letter-tree-blossom','#e2b5aa',{roughness:.9}),'meadow-coral-tree-crown',tree);
 const letters=[];for(let i=0;i<9;i++){const a=i*2.4,r=.9+rand();letters.push(box(.23,.36,.018,Math.cos(a)*r,3.5+rand()*1.7,Math.sin(a)*r*.65,.25));}b.batch(letters,ivory,'meadow-hanging-paper-letters',tree);
 const finish=b.landmark('meadow-postmark-stone');b.mesh(new THREE.BoxGeometry(1.3,.5,1),stone,'meadow-last-post-rest',[0,3.05,-37],finish);
 for(const note of ATLAS_NOTES.meadow){const island=CLOUD_ISLANDS.find(i=>((note.x-i.x)/i.rx)**2+((note.z-i.z)/i.rz)**2<=1);b.label(note.title,note.x+(note.id==='tree'?1.8:1.4),island?.height??0,note.z+.7,wood);}
 const clouds=b.landmark('meadow-cloud-ocean'),cloudMat=b.material('meadow-low-solid-cloud','#ffffff',{roughness:1});
 const cloudPlaces=[];for(let i=0;i<22;i++)cloudPlaces.push({x:(rand()-.5)*115,y:-11-rand()*9,z:23-rand()*112,ry:rand()*TAU,sx:2.2+rand()*3.2,sy:1.7+rand()*1.7,sz:2+rand()*3,color:['#e0e7de','#d1dfdf','#e5e6db'][i%3]});const cloudMesh=b.instances(lowCloudGeometry(),cloudMat,cloudPlaces,'meadow-cloud-bank-volumes');clouds.add(cloudMesh);cloudMesh.receiveShadow=false;
 const peakMat=b.material('meadow-far-blue-peaks','#9db9bb',{roughness:1});b.mesh(mountainRidge(160,24,17),peakMat,'meadow-distant-mountain-peaks',[0,-5,-83]).castShadow=false;
 b.mesh(mountainRidge(190,28,28),b.material('meadow-far-lilac-ridge','#acb8bd',{roughness:1}),'meadow-far-cloud-mountain-ridge',[-12,-3,-115]).castShadow=false;
 return{...b,update(t,dt,state,p){
  const motion=state.settings?.reducedMotion!==true,light=state.settings?.quality==='light'||state.quality==='light';setShadowFocus(sun,p);green.time.value=t;green.motion.value=motion?1:0;
  rotor.rotation.z=motion?t*.23:0;flags.forEach((flag,i)=>{flag.rotation.y=flag.userData.windHeading+(motion?Math.sin(t*.85+i)*.12:0);});bladeMesh.count=light?Math.floor(grassBlades.length*.55):grassBlades.length;
  for(const [set,total]of [[coralSet,coralFlowers.length],[whiteSet,whiteFlowers.length],[plumeSet,plumePlants.length]])for(const object of Object.values(set))object.count=light?Math.floor(total*.55):total;
 }};
}
