import * as THREE from 'three';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
export const WIND_GATES=Object.freeze([
 Object.freeze({id:'petal',name:'初绽花环',distance:12,x:-1.05,y:1.55,rx:1,ry:1.05,kind:'petal'}),
 Object.freeze({id:'lift',name:'高处的风铃',distance:28,x:.8,y:3.1,rx:1.05,ry:.92,kind:'spiral'}),
 Object.freeze({id:'weave',name:'斜风纸窗',distance:43,x:-1.2,y:2.45,rx:1.05,ry:1.06,kind:'diamond'}),
 Object.freeze({id:'shelter',name:'低处的帆影',distance:58,x:1.15,y:1.3,rx:1.12,ry:.82,kind:'sail'}),
 Object.freeze({id:'harbour',name:'渡口的回光',distance:72,x:0,y:2.05,rx:1.3,ry:1.15,kind:'harbour'}),
]);
export const WIND_LIMITS=Object.freeze({minX:-2.65,maxX:2.65,minY:.55,maxY:4.05,speed:2.4,planeZ:1.05});
export function createWindState(){return {version:1,distance:0,x:0,y:1.65,vx:0,vy:0,gate:0,checkpoint:0,launched:false,completed:false,misses:0,elapsed:0,recover:0,lastMiss:null};}
function safePoint(gate){const previous=WIND_GATES[gate-1];return previous?{distance:previous.distance+1,x:previous.x,y:previous.y}:{distance:0,x:0,y:1.65};}
export function restoreWindState(data){
 const s=createWindState();if(!data||data.version!==1)return s;
 const gate=Number.isInteger(data.gate)?clamp(data.gate,0,WIND_GATES.length):0,checkpoint=safePoint(gate);
 s.gate=gate;s.checkpoint=gate;s.completed=gate===WIND_GATES.length&&data.completed===true;
 if(gate===WIND_GATES.length&&!s.completed){s.gate=WIND_GATES.length-1;s.checkpoint=s.gate;}
 const home=safePoint(s.gate),next=WIND_GATES[s.gate];
 s.distance=s.completed?WIND_GATES.at(-1).distance+1:clamp(finite(data.distance,home.distance),home.distance,(next?.distance??72)-.12);
 s.x=clamp(finite(data.x,home.x),WIND_LIMITS.minX,WIND_LIMITS.maxX);s.y=clamp(finite(data.y,home.y),WIND_LIMITS.minY,WIND_LIMITS.maxY);
 s.misses=Math.floor(clamp(finite(data.misses),0,9999));s.elapsed=clamp(finite(data.elapsed),0,86400);s.lastMiss=WIND_GATES.some(g=>g.id===data.lastMiss)?data.lastMiss:null;
 // A restored flight waits for an intentional launch, with no old velocity or drag.
 return s;
}
export function windCommand(state,command){
 const s={...state};
 if(command==='restart')return createWindState();
 if(command==='launch'&&!s.completed){s.launched=true;s.recover=0;s.lastMiss=null;}
 if(command==='land')Object.assign(s,safePoint(s.gate),{launched:false,vx:0,vy:0,recover:0,lastMiss:null});
 return s;
}
export function windField(distance,elapsed,x){
 const lift=distance>=16&&distance<29?Math.max(0,1-Math.abs(x-.8)/1.35):0;
 const cross=distance>=32&&distance<49?.7:distance>=49&&distance<63?-.48:0;
 return {x:cross+Math.sin(elapsed*.78)*.12,y:lift*1.9,lift};
}
/** Deterministic flight; the renderer never awards a gate. No death or wall timer. */
export function stepWindFlight(state,dt,input={}){
 const s={...state},events=[],delta=clamp(finite(dt),0,.05);
 if(!s.launched||s.completed||!delta)return {state:s,events};
 s.elapsed=clamp(s.elapsed+delta,0,86400);
 if(s.recover>0){s.recover=Math.max(0,s.recover-delta);return {state:s,events};}
 const field=windField(s.distance,s.elapsed,s.x),target=input.target;
 const tx=target&&Number.isFinite(target.x)&&Number.isFinite(target.y)?clamp(target.x,WIND_LIMITS.minX,WIND_LIMITS.maxX):null;
 const ty=tx!==null?clamp(target.y,WIND_LIMITS.minY,WIND_LIMITS.maxY):null;
 const axisX=clamp(finite(input.x),-1,1),axisY=clamp(finite(input.y),-1,1);
 const ax=(tx===null?axisX*8:(tx-s.x)*19)-s.vx*6+field.x;
 const ay=(ty===null?axisY*7:(ty-s.y)*19)-s.vy*6+field.y;
 s.vx=clamp(s.vx+ax*delta,-2.8,2.8);s.vy=clamp(s.vy+ay*delta,-2.5,2.5);
 const oldX=s.x,oldY=s.y;s.x=clamp(s.x+s.vx*delta,WIND_LIMITS.minX,WIND_LIMITS.maxX);s.y=clamp(s.y+s.vy*delta,WIND_LIMITS.minY,WIND_LIMITS.maxY);
 if(s.x===oldX&&Math.abs(s.vx)>.01)s.vx=0;if(s.y===oldY&&Math.abs(s.vy)>.01)s.vy=0;
 s.distance+=delta*WIND_LIMITS.speed*(input.brake?.3:1);
 const gate=WIND_GATES[s.gate];
 if(gate&&s.distance>=gate.distance){
  const dx=(s.x-gate.x)/gate.rx,dy=(s.y-gate.y)/gate.ry;
  // A diamond really has diamond-shaped clearance; the other openings are ellipses.
  const fits=gate.kind==='diamond'?Math.abs(dx)+Math.abs(dy)<=1:dx*dx+dy*dy<=1;
  if(fits){s.gate++;s.checkpoint=s.gate;s.lastMiss=null;events.push({type:'gate',id:gate.id,index:s.gate});
   if(s.gate===WIND_GATES.length){s.completed=true;s.launched=false;s.distance=gate.distance+1;s.vx=s.vy=0;events.push({type:'finish'});}
  }else{Object.assign(s,safePoint(s.gate),{vx:0,vy:0,recover:1.15,lastMiss:gate.id});s.misses++;events.push({type:'miss',id:gate.id,index:s.gate});}
 }
 return {state:s,events};
}

function paperGeometry(){
 // Creased paper, wing tips and the lower keel are separate facets, not a sprite.
 const vertices=[[-.64,0,.2],[0,.06,-.66],[0,.06,.3],[.64,0,.2],[0,-.13,.08],[0,-.09,.42],[-.25,.09,.25],[.25,.09,.25]];
 const faces=[0,1,6,1,2,6,1,3,7,1,7,2,1,4,2,4,5,2,0,6,2,3,2,7];const g=new THREE.BufferGeometry(),colors=[];
 for(let i=0;i<faces.length;i++){const shade=[.98,.88,.94,.99,.69,.75,.84,.89][Math.floor(i/3)];colors.push(shade,shade*.99,shade*.95);}
 g.setAttribute('position',new THREE.Float32BufferAttribute(faces.flatMap(i=>vertices[i]),3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 g.setAttribute('uv',new THREE.Float32BufferAttribute(faces.flatMap(i=>[(vertices[i][0]+.64)/1.28,(vertices[i][2]+.66)/1.08]),2));g.computeVertexNormals();return g;
}
function petalGeometry(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,-.11,.2,.025,0,.45,.06,0,0,0,0,.45,.06,.11,.2,.025],3));g.computeVertexNormals();return g;}
function paperGrain(){const data=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const n=Math.sin(x*17.13+y*71.7)*43758.5453,grain=241+Math.floor((n-Math.floor(n))*14),i=(y*64+x)*4;data[i]=grain;data[i+1]=grain;data[i+2]=grain;data[i+3]=255;}const texture=new THREE.DataTexture(data,64,64);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2.2,2.2);texture.needsUpdate=true;return texture;}
function mountainGeometry(layer){
 const positions=[],colors=[],base=new THREE.Color(layer?'#38616a':'#6d9493');
 for(const side of [-1,1])for(let i=0;i<7;i++){const x=side*(2.6+i*.61),height=.9+(Math.sin(i*2.7+layer)*.5+.5)*1.85,y=-.1,z=-8.8+layer*2.2+(i%3)*.28,peak=[x+side*.26,height,z],a=[x-side*.57,y,z+.4],b=[x+side*.74,y,z+.3],fold=[x+side*.12,y,z+.88];
  for(const [j,tri]of [[a,peak,fold],[fold,peak,b]].entries()){positions.push(...tri.flat());for(let k=0;k<3;k++)colors.push(base.r*(j?.78:1.04),base.g*(j?.78:1.04),base.b*(j?.78:1.04));}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;
}
function diamondGeometry(){const positions=[];for(let i=0;i<4;i++){const a=i*Math.PI/2,b=(i+1)*Math.PI/2,innerA=[Math.sin(a),Math.cos(a),0],innerB=[Math.sin(b),Math.cos(b),0],outerA=[Math.sin(a)*1.065,Math.cos(a)*1.065,.03],outerB=[Math.sin(b)*1.065,Math.cos(b)*1.065,.03];positions.push(...innerA,...innerB,...outerA,...outerA,...innerB,...outerB);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();return g;}
function sailCanopyGeometry(){
 const positions=[],uv=[];for(const side of [-1,1])for(let i=0;i<5;i++){const a=i/5,b=(i+1)/5,point=(t,z)=>[side*t*2.35,3.9-t*.8+Math.sin(t*Math.PI*5)*.055+(z===-4.2?-.26:0),z],vertices=[point(a,-1.7),point(b,-1.7),point(a,-4.2),point(b,-1.7),point(b,-4.2),point(a,-4.2)];positions.push(...vertices.flat());uv.push(a,1,b,1,a,0,b,1,b,0,a,0);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
function localRay(raycaster,group,ray,matrix){group.updateWorldMatrix(true,false);matrix.copy(group.matrixWorld).invert();return ray.copy(raycaster.ray).applyMatrix4(matrix);}

export function createWindMoment({onSound}={}){
 const group=new THREE.Group();group.name='spring-paper-wing';
 // Frame the playable foreground. Distant scenery is deliberately excluded so
 // the camera never shrinks the paper wing to fit the length of the wind field.
 const bounds={min:[-3.3,.05,-3],max:[3.3,4.65,1.7]},cameraOffset={x:.25,y:2.05,z:8.5};
 const owned=new Set(),own=r=>(owned.add(r),r),meshes=[];
 const material=(color,extra={})=>own(new THREE.MeshStandardMaterial({color,roughness:.73,metalness:.06,...extra}));
 const grain=own(paperGrain()),paper=material('#f5ebd1',{side:THREE.DoubleSide,map:grain,bumpMap:grain,bumpScale:.016}),wingPaper=material('#fff3ce',{side:THREE.DoubleSide,map:grain,bumpMap:grain,bumpScale:.016,vertexColors:true,emissive:'#c6ab77',emissiveIntensity:.09}),rose=material('#c48c91'),teal=material('#61968d'),brass=material('#e8c88a',{metalness:.23,roughness:.53});
 const glow=material('#eee5c7',{emissive:'#bcd7bf',emissiveIntensity:.35,side:THREE.DoubleSide});
 const cloudMaterial=material('#d9e3db',{transparent:true,opacity:.23,depthWrite:false,flatShading:true});
 const mesh=(geo,mat,parent=group)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);meshes.push(m);return m;};
 const backdropGeometry=own(new THREE.PlaneGeometry(100,100,1,16)),backdropColors=[],backdropLow=new THREE.Color('#244854'),backdropHigh=new THREE.Color('#b7c8bc'),tint=new THREE.Color();
 for(let i=0;i<backdropGeometry.attributes.position.count;i++){const y=backdropGeometry.attributes.position.getY(i),k=.5+Math.tanh(y/12)*.5;tint.copy(backdropLow).lerp(backdropHigh,k*.83);backdropColors.push(tint.r,tint.g,tint.b);}backdropGeometry.setAttribute('color',new THREE.Float32BufferAttribute(backdropColors,3));
 const backdrop=mesh(backdropGeometry,own(new THREE.MeshBasicMaterial({vertexColors:true,fog:false})));backdrop.name='wind-horizon';backdrop.position.set(0,3,-11.2);
 const mountainMaterial=own(new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide})),mountains=[];for(let i=0;i<2;i++){const mountain=mesh(own(mountainGeometry(i)),mountainMaterial);mountain.name='paper-mountains-'+i;mountains.push(mountain);}
 const plane=new THREE.Group();group.add(plane);plane.name='paper-wing';mesh(own(paperGeometry()),wingPaper,plane);
 const seam=own(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.065,-.66),new THREE.Vector3(0,.065,.3),new THREE.Vector3(0,-.09,.42)]));
 plane.add(new THREE.Line(seam,own(new THREE.LineBasicMaterial({color:'#967b69'}))));
 const seal=mesh(own(new THREE.CylinderGeometry(.062,.062,.015,10)),rose,plane);seal.position.set(.12,.042,.11);seal.rotation.x=.07;
 const wingTips=own(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.64,.006,.2),new THREE.Vector3(-.3,.036,-.24),new THREE.Vector3(0,.06,-.66),new THREE.Vector3(.3,.036,-.24),new THREE.Vector3(.64,.006,.2)]));
 const edgeMaterial=own(new THREE.LineBasicMaterial({color:'#6faaa1'}));plane.add(new THREE.Line(wingTips,edgeMaterial));
 const creasePoints=[-.64,0,.2,-.25,.094,.25,-.25,.094,.25,0,.064,-.66,.64,0,.2,.25,.094,.25,.25,.094,.25,0,.064,-.66];
 const creases=new THREE.LineSegments(own(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(creasePoints,3))),own(new THREE.LineBasicMaterial({color:'#d8bf98',transparent:true,opacity:.66})));plane.add(creases);
 const gateGeometry=own(new THREE.TorusGeometry(1,.039,6,32)),petal=own(petalGeometry()),gates=[],gateDecorations=[],flags=[],instanceTransform=new THREE.Object3D();
 const instance=(geo,mat,count,parent=group)=>{const m=own(new THREE.InstancedMesh(geo,mat,count));m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;parent.add(m);meshes.push(m);return m;};
 for(let i=0;i<WIND_GATES.length;i++){
  const spec=WIND_GATES[i],g=new THREE.Group();g.name='wind-gate-'+spec.id;group.add(g);
  let count=0;
  if(spec.kind==='diamond'){
   mesh(own(diamondGeometry()),brass,g);count=4;
  }else{
   mesh(gateGeometry,i%2?teal:brass,g);
   count=spec.kind==='harbour'?12:spec.kind==='petal'?9:spec.kind==='spiral'?7:6;
   if(spec.kind==='harbour'){const second=mesh(gateGeometry,teal,g);second.scale.setScalar(1.13);second.position.z=-.18;}
   if(spec.kind==='spiral'){const points=[];for(let j=0;j<70;j++){const a=j/69*Math.PI*2.3;points.push(new THREE.Vector3(Math.sin(a)*1.19,Math.cos(a)*1.19,Math.sin(a*2)*.14));}g.add(new THREE.Line(own(new THREE.BufferGeometry().setFromPoints(points)),own(new THREE.LineBasicMaterial({color:'#b1e0cd',transparent:true,opacity:.8}))));}
  }
  const ornaments=instance(petal,i%2?paper:glow,count,g);ornaments.name='wind-ornaments-'+spec.id;gateDecorations.push({mesh:ornaments,count,kind:spec.kind});
  if(spec.kind==='sail'){
   for(let side of [-1,1]){const flag=mesh(own(new THREE.PlaneGeometry(side===1?.46:.35,side===1?1.7:1.4,2,6)),side===1?paper:teal,g);flag.position.set(side*1.42,side===1?0:.12,.04);flag.rotation.y=side*.3;flags.push({mesh:flag,side});}
  }
  g.scale.set(spec.rx,spec.ry,1);gates.push(g);
 }
 const cloudGeometry=own(new THREE.IcosahedronGeometry(.6,0)),clouds=instance(cloudGeometry,cloudMaterial,22);clouds.name='wind-cloud-banks';
 const streamArray=new Float32Array(12*12*2*3),streamColors=new Float32Array(streamArray.length),streamGeometry=own(new THREE.BufferGeometry());streamGeometry.setAttribute('position',new THREE.BufferAttribute(streamArray,3));streamGeometry.setAttribute('color',new THREE.BufferAttribute(streamColors,3));
 const streamMaterial=own(new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.43,depthWrite:false})),streams=new THREE.LineSegments(streamGeometry,streamMaterial);streams.name='wind-parallax-streams';streams.frustumCulled=false;group.add(streams);
 for(let i=0;i<streamColors.length/3;i++){const k=(i%24)/24,c=new THREE.Color(i%48<24?'#b9e6d7':'#edc5a0');c.multiplyScalar(.35+Math.sin(k*Math.PI)*.65);streamColors.set([c.r,c.g,c.b],i*3);}
 const thermal=new THREE.Group();group.add(thermal);
 for(let j=0;j<3;j++){
  const points=[];for(let i=0;i<80;i++){const h=i/79,a=h*Math.PI*5+j*2.094;points.push(new THREE.Vector3(Math.sin(a)*(.65-h*.18),h*3.65,Math.cos(a)*(.65-h*.18)));}
  thermal.add(new THREE.Line(own(new THREE.BufferGeometry().setFromPoints(points)),own(new THREE.LineBasicMaterial({color:'#9fdac2',transparent:true,opacity:.54}))));
 }
 const trailCount=72,trailArray=new Float32Array(trailCount*3),trailGeometry=own(new THREE.BufferGeometry());trailGeometry.setAttribute('position',new THREE.BufferAttribute(trailArray,3));
 const trail=new THREE.Line(trailGeometry,own(new THREE.LineBasicMaterial({color:'#e5a6a2',transparent:true,opacity:.68,depthWrite:false})));group.add(trail);trail.frustumCulled=false;
 const tracerGeometry=own(new THREE.BufferGeometry()),tracerPoints=new Float32Array(96*3);tracerGeometry.setAttribute('position',new THREE.BufferAttribute(tracerPoints,3));
 const tracer=new THREE.Points(tracerGeometry,own(new THREE.PointsMaterial({color:'#e8dbb4',size:.035,transparent:true,opacity:.7,depthWrite:false})));group.add(tracer);
 const aimGeo=own(new THREE.RingGeometry(.1,.12,24)),aim=mesh(aimGeo,own(new THREE.MeshBasicMaterial({color:'#fff5dc',transparent:true,opacity:.7,side:THREE.DoubleSide})));aim.visible=false;
 const responseMaterial=material('#f4dbb2',{transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),response=instance(petal,responseMaterial,20);response.name='wind-gate-response';response.visible=false;let responseAge=2,responseOrigin={x:0,y:0};
 // The reply becomes a small inhabited harbour: its two arrangements own real
 // objects, while the flight and the saved draft remain entirely unchanged.
 const harbour=new THREE.Group(),lampHarbour=new THREE.Group(),sailHarbour=new THREE.Group();harbour.name='wind-reply-harbour';lampHarbour.name='wind-reply-lamp';sailHarbour.name='wind-reply-sail';harbour.add(lampHarbour,sailHarbour);group.add(harbour);harbour.visible=false;
 const wood=material('#8d7460',{roughness:.92}),woodGeometry=own(new THREE.BoxGeometry(1,1,1)),dock=instance(woodGeometry,wood,9,harbour);dock.name='wind-dock-planks';
 for(let i=0;i<9;i++){instanceTransform.position.set(0,.28,-.9-i*.35);instanceTransform.rotation.set(0,0,0);instanceTransform.scale.set(3.4,.09,.30);instanceTransform.updateMatrix();dock.setMatrixAt(i,instanceTransform.matrix);}
 const poles=instance(woodGeometry,wood,2,lampHarbour),caps=instance(own(new THREE.ConeGeometry(.29,.16,6)),brass,2,lampHarbour),lampGlow=own(new THREE.MeshBasicMaterial({color:'#ffe0a0',toneMapped:false})),lanterns=instance(own(new THREE.SphereGeometry(.22,10,6)),lampGlow,2,lampHarbour);
 const beamMaterial=own(new THREE.MeshBasicMaterial({color:'#f2c884',transparent:true,opacity:.17,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending})),beams=instance(own(new THREE.CylinderGeometry(.06,.65,1.75,12,1,true)),beamMaterial,2,lampHarbour);
 const lampFrame=[];for(let i=0;i<2;i++){const x=i?1.72:-1.72;for(const [m,y,sx,sy,sz]of [[poles,1.12,.08,1.7,.08],[caps,2.34,1,1,1],[lanterns,2.1,.83,1.25,.83],[beams,1.18,1,1,1]]){instanceTransform.position.set(x,y,-2.6);instanceTransform.rotation.set(0,0,0);instanceTransform.scale.set(sx,sy,sz);instanceTransform.updateMatrix();m.setMatrixAt(i,instanceTransform.matrix);}for(let j=0;j<6;j++){const a=j/6*Math.PI*2,dx=Math.cos(a)*.21,dz=Math.sin(a)*.21;lampFrame.push(x+dx,1.86,-2.6+dz,x+dx,2.31,-2.6+dz);}}
 lampHarbour.add(new THREE.LineSegments(own(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(lampFrame,3))),own(new THREE.LineBasicMaterial({color:'#83684c'}))));
 const guideLights=instance(own(new THREE.IcosahedronGeometry(.065,0)),lampGlow,8,lampHarbour);for(let i=0;i<8;i++){instanceTransform.position.set(i%2?.95:-.95,.48,-1.5-Math.floor(i/2)*1.1);instanceTransform.rotation.set(0,0,0);instanceTransform.scale.setScalar(1);instanceTransform.updateMatrix();guideLights.setMatrixAt(i,instanceTransform.matrix);}
 const canopy=mesh(own(sailCanopyGeometry()),material('#e8e1c5',{map:grain,side:THREE.DoubleSide,roughness:.88}),sailHarbour);canopy.name='wind-protective-sail';
 const supports=instance(woodGeometry,wood,2,sailHarbour);for(let i=0;i<2;i++){instanceTransform.position.set(i?2.28:-2.28,1.68,-2.45);instanceTransform.rotation.set(0,0,i?-.08:.08);instanceTransform.scale.set(.055,2.8,.055);instanceTransform.updateMatrix();supports.setMatrixAt(i,instanceTransform.matrix);}
 const seedBed=mesh(own(new THREE.CylinderGeometry(1.05,1.18,.18,20)),teal,sailHarbour);seedBed.position.set(0,.43,-2.6);
 const seedlings=instance(own(new THREE.IcosahedronGeometry(.14,0)),brass,3,sailHarbour),newLeaves=instance(petal,teal,6,sailHarbour),leafShadows=instance(petal,own(new THREE.MeshBasicMaterial({color:'#193f44',transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false})),10,sailHarbour);
 for(let i=0;i<3;i++){instanceTransform.position.set((i-1)*.57,.66,-2.6+(i%2)*.15);instanceTransform.rotation.set(0,i*.5,0);instanceTransform.scale.set(.65,1.25,.65);instanceTransform.updateMatrix();seedlings.setMatrixAt(i,instanceTransform.matrix);for(let j=0;j<2;j++){instanceTransform.position.set((i-1)*.57,.72,-2.6+(i%2)*.15);instanceTransform.rotation.set(j?.15:-.15,0,(j?1:-1)*.68);instanceTransform.scale.setScalar(.5);instanceTransform.updateMatrix();newLeaves.setMatrixAt(i*2+j,instanceTransform.matrix);}}
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;instanceTransform.position.set(Math.sin(a)*.55,.535,-2.6+Math.cos(a)*.55);instanceTransform.rotation.set(-Math.PI/2,0,-a);instanceTransform.scale.set(.8,1.1,1);instanceTransform.updateMatrix();leafShadows.setMatrixAt(i,instanceTransform.matrix);}
 let displayedChoice=null,harbourReveal=0;
 let state=createWindState(),active=false,disposed=false,held=new Set(),pointerId=null,dragStart=null,dragPlaneStart=null,target=null,pulse={x:0,y:0,time:0},brakeToggle=false,toast='',toastTime=0,wasLift=false,liftCooldown=0,lastPalette=null;
 const inverse=new THREE.Matrix4(),ray=new THREE.Ray(),controlPlane=new THREE.Plane(new THREE.Vector3(0,0,1),-WIND_LIMITS.planeZ),hit=new THREE.Vector3(),worldPoint=new THREE.Vector3();
 function cancelInput(){held.clear();pointerId=null;dragStart=null;dragPlaneStart=null;target=null;pulse={x:0,y:0,time:0};brakeToggle=false;aim.visible=false;}
 function resetTrail(){for(let i=0;i<trailCount;i++){trailArray[i*3]=state.x;trailArray[i*3+1]=state.y;trailArray[i*3+2]=WIND_LIMITS.planeZ+.1+i*.014;}trailGeometry.attributes.position.needsUpdate=true;}
 function controlHit(raycaster){return localRay(raycaster,group,ray,inverse).intersectPlane(controlPlane,hit);}
 function world(x,y,z){group.updateWorldMatrix(true,false);return group.localToWorld(worldPoint.set(x,y,z)).toArray();}
 function action(id,value){
  if(disposed)return false;
  if(['launch','land','restart'].includes(id)){
   if(id==='launch'&&state.completed)return false;state=windCommand(state,id);cancelInput();resetTrail();toastTime=0;responseAge=2;
   if(id==='launch')onSound?.('wind-launch',{gate:state.gate});return true;
  }
  if(id==='brake'){brakeToggle=typeof value==='boolean'?value:!brakeToggle;return true;}
  const axis={left:[-1,0],right:[1,0],up:[0,1],down:[0,-1]}[id];if(!axis||!state.launched||state.completed)return false;
  if(typeof value==='boolean'){const code={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'}[id];value?held.add(code):held.delete(code);}else pulse={x:axis[0],y:axis[1],time:.55};target=null;return true;
 }
 function key(event){
  if(disposed||!active)return false;
  const code=event.code,movement=['KeyA','KeyD','KeyW','KeyS','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'];
  if(event.type==='keyup'){if(movement.includes(code)&&held.has(code)){held.delete(code);return true;}return false;}
  if(event.target?.matches?.('input,select,textarea')||event.target?.matches?.('button')&&['Enter','Space'].includes(code))return false;
  if(code==='Enter'){if(!event.repeat&&!state.launched&&!state.completed)action('launch');return true;}
  if(!movement.includes(code))return false;held.add(code);target=null;return true;
 }
 function pointer(type,raycaster,event={}){
  if(type==='cancel'){cancelInput();state.launched=false;return true;}
  if(disposed||!active||state.completed)return false;
  if(type==='down'){
   if(event.button!==undefined&&event.button!==0)return false;
   if(pointerId!==null&&pointerId!==(event.pointerId??0))return false;
   if(!state.launched||!controlHit(raycaster))return false;
   pointerId=event.pointerId??0;dragStart=hit.clone();dragPlaneStart={x:state.x,y:state.y};target={...dragPlaneStart};return true;
  }
  if(pointerId===null||(event.pointerId??0)!==pointerId)return false;
  if(type==='move'&&controlHit(raycaster)){
   target={x:clamp(dragPlaneStart.x+hit.x-dragStart.x,WIND_LIMITS.minX,WIND_LIMITS.maxX),y:clamp(dragPlaneStart.y+hit.y-dragStart.y,WIND_LIMITS.minY,WIND_LIMITS.maxY)};return true;
  }
  if(type==='up'){pointerId=null;dragStart=null;dragPlaneStart=null;target=null;return true;}
  return false;
 }
 function update(time,dt,{active:nextActive=false,reducedMotion=false,palette,choice=null,completed=false}={}){
  if(disposed)return;
  if(active&&!nextActive){cancelInput();state.launched=false;}active=!!nextActive;
  backdrop.visible=active;for(const mountain of mountains)mountain.visible=active;
  const delta=active?clamp(finite(dt),0,.05):0;
  pulse.time=Math.max(0,pulse.time-delta);toastTime=Math.max(0,toastTime-delta);liftCooldown=Math.max(0,liftCooldown-delta);
  const x=(held.has('KeyD')||held.has('ArrowRight')?1:0)-(held.has('KeyA')||held.has('ArrowLeft')?1:0)+(pulse.time?pulse.x:0),y=(held.has('KeyW')||held.has('ArrowUp')?1:0)-(held.has('KeyS')||held.has('ArrowDown')?1:0)+(pulse.time?pulse.y:0);
  const next=stepWindFlight(state,delta,{x,y,target,brake:brakeToggle||held.has('Space')});state=next.state;
  for(const event of next.events){
   if(event.type==='miss'){cancelInput();resetTrail();toast='错过了'+WIND_GATES[state.gate].name+'。风把你托回上一段；对准空心轮廓，再试一次。';toastTime=5;onSound?.('wind-return',{id:event.id});}
   if(event.type==='gate'){responseAge=0;responseOrigin={x:state.x,y:state.y};toast=event.index===WIND_GATES.length?'春信抵达了渡口。':'穿过'+WIND_GATES[event.index-1].name+'，这里会记住你的来路。';toastTime=2.6;onSound?.('wind-gate',{index:event.index,id:event.id});}
   if(event.type==='finish'){cancelInput();onSound?.('wind-finish',{});}
  }
  const field=windField(state.distance,state.elapsed,state.x),inLift=active&&state.launched&&field.lift>.3;
  if(inLift&&!wasLift&&!liftCooldown){onSound?.('wind-updraft',{});liftCooldown=1.8;}wasLift=inLift;
  const visualTime=reducedMotion?0:finite(time),braking=brakeToggle||held.has('Space');
  const nextChoice=state.completed&&completed&&['lamp','sail'].includes(choice)?choice:null;if(nextChoice!==displayedChoice)harbourReveal=0;displayedChoice=nextChoice;harbour.visible=!!displayedChoice;lampHarbour.visible=displayedChoice==='lamp';sailHarbour.visible=displayedChoice==='sail';
  harbourReveal=displayedChoice?Math.min(1,harbourReveal+delta*1.4):0;const reveal=reducedMotion||!active?1:Math.max(.02,harbourReveal);canopy.scale.x=reveal;
  beamMaterial.opacity=.14+(reducedMotion?0:Math.sin(visualTime*1.6)*.025);lampGlow.color.set('#ffe0a0').multiplyScalar(reducedMotion?1:1+Math.sin(visualTime*2.1)*.035);
  plane.position.set(state.x,state.y,WIND_LIMITS.planeZ);plane.rotation.set(.28-state.vy*.1+(braking?.12:0),0,-state.vx*(reducedMotion?.055:.13));
  plane.scale.setScalar(state.recover>0?.89:.98);
  if(delta&&state.launched&&!state.recover){
   for(let i=trailCount-1;i>0;i--){trailArray[i*3]=trailArray[(i-1)*3];trailArray[i*3+1]=trailArray[(i-1)*3+1];trailArray[i*3+2]=trailArray[(i-1)*3+2]+delta*.8;}
   trailArray[0]=state.x;trailArray[1]=state.y;trailArray[2]=WIND_LIMITS.planeZ+.25;trailGeometry.attributes.position.needsUpdate=true;
  }
  trail.visible=active&&(state.launched||state.completed);
  for(let i=0;i<gates.length;i++){
   const spec=WIND_GATES[i],g=gates[i],z=WIND_LIMITS.planeZ-(spec.distance-state.distance)*.28;
   g.position.set(spec.x,spec.y,z);g.visible=i>=state.gate&&z>-9.6&&z<2.1;
   const decoration=gateDecorations[i];
   for(let j=0;j<decoration.count;j++){const angle=j/decoration.count*Math.PI*2;instanceTransform.position.set(Math.sin(angle),Math.cos(angle),0);instanceTransform.rotation.set(Math.sin(visualTime*.8+j+i)*.15,0,-angle);instanceTransform.scale.setScalar(spec.kind==='petal'?1:spec.kind==='harbour'?.82:.65);instanceTransform.updateMatrix();decoration.mesh.setMatrixAt(j,instanceTransform.matrix);}decoration.mesh.instanceMatrix.needsUpdate=true;
  }
  thermal.position.set(.8,.25,WIND_LIMITS.planeZ-(23-state.distance)*.28);thermal.visible=thermal.position.z>-9&&thermal.position.z<2;
  thermal.rotation.y=visualTime*.35;
  for(let i=0;i<22;i++){instanceTransform.position.set((i%2?1:-1)*(2.8+(i%3)*.44),.25+(i%7)*.52,-9.3+((i*1.63+state.distance*.14)%10.5));instanceTransform.rotation.set(0,Math.sin(i*1.4)*.6,Math.sin(visualTime*.15+i)*.07);instanceTransform.scale.set(1.25+(i%3)*.32,.25+(i%3)*.09,.6);instanceTransform.updateMatrix();clouds.setMatrixAt(i,instanceTransform.matrix);}clouds.instanceMatrix.needsUpdate=true;
  for(let j=0;j<12;j++)for(let segment=0;segment<12;segment++)for(let end=0;end<2;end++){const t=(segment+end)/12,band=j%3,depth=-10+((j*1.73+state.distance*(.13+band*.11))%11),z=depth-t*(1.7+band*.36),index=(j*24+segment*2+end)*3;streamArray[index]=(j%2?1:-1)*(2.65+band*.16)+Math.sin(t*3.2+j+visualTime*.15)*(.08+band*.035);streamArray[index+1]=.45+(j%6)*.65+Math.sin(t*2.2+j)*.14;streamArray[index+2]=Math.max(-10.4,z);}streamGeometry.attributes.position.needsUpdate=true;
  for(const flag of flags){const p=flag.mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);p.setZ(i,Math.sin(y*4+visualTime*1.9+flag.side)*.055+(p.getX(i)*flag.side+.23)*Math.sin(visualTime*1.2)*.12);}p.needsUpdate=true;flag.mesh.geometry.computeVertexNormals();}
  responseAge=Math.min(2,responseAge+delta);response.visible=active&&responseAge<1.45;responseMaterial.opacity=response.visible?(1-responseAge/1.45)*.85:0;
  if(response.visible){for(let i=0;i<20;i++){const a=i/20*Math.PI*2,r=.28+responseAge*(reducedMotion?.34:1.1);instanceTransform.position.set(responseOrigin.x+Math.sin(a)*r,responseOrigin.y+Math.cos(a)*r*.65-responseAge*.12,WIND_LIMITS.planeZ+.08+responseAge*.25);instanceTransform.rotation.set(reducedMotion?0:responseAge*(i%2?1:-1),a*.3,-a+responseAge*.2);instanceTransform.scale.setScalar(.12+(i%3)*.045);instanceTransform.updateMatrix();response.setMatrixAt(i,instanceTransform.matrix);}response.instanceMatrix.needsUpdate=true;}
  for(let i=0;i<96;i++){const a=i*2.399963,x0=Math.sin(a)*(1.4+(i%4)*.5);tracerPoints[i*3]=x0+Math.sin(state.elapsed*.7+i)*.08;tracerPoints[i*3+1]=.35+(i%17)*.235;tracerPoints[i*3+2]=-9.4+((i*.713+state.distance*.5)%11.2);}tracerGeometry.attributes.position.needsUpdate=true;
  aim.visible=active&&!!target&&state.launched;if(target)aim.position.set(target.x,target.y,WIND_LIMITS.planeZ+.04);
  const paletteKey=palette?[palette.high,palette.low,palette.accent].join('|'):null;
  if(palette?.high&&paletteKey!==lastPalette){try{const high=new THREE.Color(palette.high),low=new THREE.Color(palette.low??'#61968d'),accent=new THREE.Color(palette.accent??palette.high);rose.color.set('#c48c91').lerp(high,.6);teal.color.set('#61968d').lerp(low,.25);edgeMaterial.color.set('#6faaa1').lerp(accent,.35);glow.color.set('#eee5c7').lerp(high,.18);glow.emissive.set('#bcd7bf').lerp(accent,.3);trail.material.color.set('#e5a6a2').lerp(high,.55);tracer.material.color.set('#e8dbb4').lerp(accent,.3);responseMaterial.color.set('#f4dbb2').lerp(high,.3);lastPalette=paletteKey;}catch{}}
 }
 function snapshot(){
  const gate=WIND_GATES[state.gate],stage=state.distance<16?'初风':state.distance<32?'上升气流':state.distance<49?'交错侧风':state.distance<63?'低帆回廊':'渡口';
  const hint=toastTime?toast:state.completed?'纸翼记住了这一路。现在可以决定，把渡口的春风先留给谁。':!state.launched?'按「折翼起航」或 Enter 出发。拖住纸翼引路，或用方向键 / WASD；Space 放缓速度。':state.recover>0?'上一段风正接住你。稍候继续，已通过的风门不会丢失。':state.distance>=16&&state.distance<29?'浅绿的螺旋风会托高纸翼；抬翼进入上方的风铃。':state.distance>=32&&state.distance<49?'侧风会把纸翼推向右边。留一点左舵，穿过菱形纸窗。':'下一处：'+gate.name+'。拖动调整左右和高度；Space 或「缓行」给自己更多时间。';
  const disabled=!state.launched||state.completed;
  return {ready:state.completed,progress:state.completed?1:state.distance/WIND_GATES.at(-1).distance,selected:null,status:state.completed?'春信抵岸':state.launched?stage+' · '+state.gate+' / '+WIND_GATES.length+' 道风门':'停在安全风段 · '+state.gate+' / '+WIND_GATES.length,hint,
   controls:[{id:state.completed?'restart':'launch',label:state.completed?'再飞一程':state.distance?'继续渡风':'折翼起航',disabled:state.launched},{id:'land',label:'落回安全风段',disabled:!state.launched},{id:'left',label:'← 向左',disabled},{id:'right',label:'向右 →',disabled},{id:'up',label:'↑ 抬翼',disabled},{id:'down',label:'↓ 俯冲',disabled},{id:'brake',label:brakeToggle?'恢复滑行':'缓行',active:brakeToggle,disabled}],
   draft:{...state},flight:{...state,world:world(state.x,state.y,WIND_LIMITS.planeZ)},currentGate:gate?.id??null,
   gates:WIND_GATES.map((g,i)=>({...g,passed:i<state.gate,world:world(g.x,g.y,WIND_LIMITS.planeZ-(g.distance-state.distance)*.28),controlWorld:world(g.x,g.y,WIND_LIMITS.planeZ)})),
   input:{dragging:pointerId!==null,held:[...held],brake:brakeToggle||held.has('Space')},presentation:{choice:displayedChoice,harbourVisible:harbour.visible,lampVisible:lampHarbour.visible,sailVisible:sailHarbour.visible},resources:{owned:owned.size,meshCount:meshes.length},disposed};
 }
 function restore(data){state=restoreWindState(data?.draft||data);cancelInput();resetTrail();toastTime=0;wasLift=false;liftCooldown=0;responseAge=2;harbourReveal=0;update(0,0,{active:false});}
 function dispose(){if(disposed)return;disposed=true;cancelInput();for(const r of owned)r.dispose();owned.clear();group.clear();group.removeFromParent();}
 resetTrail();update(0,0,{active:false});return {group,bounds,cameraOffset,update,pointer,key,action,snapshot,restore,dispose};
}
