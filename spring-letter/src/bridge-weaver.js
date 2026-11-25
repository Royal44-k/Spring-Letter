import * as THREE from 'three';
import { PLATFORMS, distanceToSegment } from './layout.js';

const NODE_RADIUS = .5;
const START_RADIUS = .75;
const PLATFORM_RADIUS = 1.2;
const PATH_RADIUS = .85;
const MAX_POINTER_STEP = 2.15;
const VISUAL_Y = .4;
const finitePoint = point => point && Number.isFinite(point.x) && Number.isFinite(point.z);
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

const definitions = [
  ['bridge_am', 'A', 'M', .28],
  ['bridge_mf', 'M', 'F', -.32],
  ['shield_rm', 'R', 'M', .24],
];
function routePoint(route, t) {
  const a = PLATFORMS[route.from], b = PLATFORMS[route.to];
  const dx = b.x - a.x, dz = b.z - a.z, length = Math.hypot(dx, dz);
  const curve = Math.sin(t * Math.PI) * route.curve;
  return {x:a.x + dx * t - dz / length * curve, y:VISUAL_Y, z:a.z + dz * t + dx / length * curve};
}
export const BRIDGE_WEAVE_ROUTES = Object.freeze(definitions.map(([shape, from, to, curve]) => {
  const route = {shape, from, to, curve};
  route.anchors = Object.freeze(Array.from({length:6}, (_, i) => Object.freeze(routePoint(route, i / 5))));
  return Object.freeze(route);
}));

function physicalPlatform(player, state) {
  if (!finitePoint(player)) return null;
  const name = state?.bridge?.platform;
  return PLATFORMS[name] && distance(player, PLATFORMS[name]) <= PLATFORM_RADIUS ? name : null;
}
function orderedRoute(route, origin) {
  return {shape:route.shape, target:route.from === origin ? route.to : route.from,
    anchors:route.from === origin ? route.anchors : [...route.anchors].reverse()};
}
function pathDistance(point, anchors) {
  let closest = Infinity;
  for (let i = 1; i < anchors.length; i++) closest = Math.min(closest, distanceToSegment(point.x, point.z, anchors[i - 1], anchors[i]));
  return closest;
}
function advanceNodes(route, next, from, to) {
  const dx = to.x - from.x, dz = to.z - from.z;
  const length2 = dx * dx + dz * dz;
  let previousT = -1;
  while (next < route.anchors.length) {
    const node = route.anchors[next];
    const t = length2 > 1e-10 ? clamp(((node.x - from.x) * dx + (node.z - from.z) * dz) / length2, 0, 1) : 0;
    if (t < previousT - .02 || Math.hypot(from.x + dx * t - node.x, from.z + dz * t - node.z) > NODE_RADIUS) break;
    previousT = t; next++;
  }
  return next;
}

/** Pure gesture recognizer: owns only its transient drawing session.
 * The game must still pass each construct signal to setStructure().
 * released:false distinguishes an interrupted input from an intentional release.
 */
export function createBridgeWeaveController() {
  let previousActive = false;
  let phase = 'idle';
  let origin = null;
  let selected = null;
  let candidates = [];
  let nextNode = 1;
  let progress = 0;
  let fadingTime = 0;
  let hint = '从脚下石台起笔，把悬光逐一连到彼岸。';
  let last = null;
  const points = [];
  let context = {available:false,origin:null,status:'idle',shape:null,target:null,progress:0,hint,anchors:[]};

  function cancel(reason = '风线散开了。回到脚下的光环，再轻轻起笔。') {
    if (phase === 'drawing' || phase === 'ready') {phase = 'fading'; fadingTime = 1.1; hint = reason;}
    previousActive = false;
  }
  function fail(reason) {
    phase = 'fading'; fadingTime = 1.1; hint = reason;
  }
  function update(dt, {player, gesture, state, interactive = true} = {}) {
    const signals = [];
    const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, .1);
    const platform = physicalPlatform(player, state);
    const unlocked = state?.wind?.solved === true;
    const occupied = !!state?.bridge?.support;
    const available = !!(interactive && unlocked && !occupied && platform);
    const active = !!(gesture?.active && finitePoint(gesture.position));
    const point = active ? gesture.position : null;
    if (phase === 'fading') {
      fadingTime -= delta; progress *= Math.exp(-3.4 * delta);
      if (fadingTime <= 0) {phase = 'idle'; selected = null; nextNode = 1; progress = 0; points.length = 0;}
    } else if (phase === 'committed') {
      fadingTime -= delta;
      if (fadingTime <= 0) {phase = 'idle'; selected = null; nextNode = 1; progress = 0; points.length = 0;}
    }

    if ((phase === 'drawing' || phase === 'ready') && (!available || platform !== origin)) {
      fail(occupied ? '先回到石台，才能收放承托你的花桥。' : '站稳在起笔的石台上，再把这一笔送出去。');
    }

    if (active && !previousActive) {
      if (!available) {
        hint = !unlocked ? '先让风廊的光抵达，池上的悬光才会醒来。' : occupied ? '先回到石台，才能收放承托你的花桥。' : '走到一座固定石台，再开始织桥。';
      } else if (distance(point, PLATFORMS[platform]) > START_RADIUS) {
        fail('从自己脚下的光环起笔，风线才知道从哪里出发。');
      } else {
        origin = platform;
        candidates = BRIDGE_WEAVE_ROUTES.filter(route => route.from === origin || route.to === origin).map(route => orderedRoute(route, origin));
        selected = candidates.length === 1 ? candidates[0] : null;
        nextNode = 1; progress = 0; phase = 'drawing';
        points.length = 0; points.push({x:point.x,y:VISUAL_Y + .018,z:point.z});
        last = {x:point.x,z:point.z};
        hint = '沿悬光慢慢写过去，让每一粒光都记住这一笔。';
      }
    } else if (active && (phase === 'drawing' || phase === 'ready')) {
      if (distance(point, last) > MAX_POINTER_STEP) {
        fail('这一笔跨得太远，风线断开了。沿悬光连续写过去。');
      } else {
        const routes = selected ? [selected] : candidates;
        if (Math.min(...routes.map(route => pathDistance(point, route.anchors))) > PATH_RADIUS) {
          fail('风线离开了悬光。松手，让它退回，再试一次。');
        } else {
          if (!selected) {
            let furthest = 1;
            for (const route of candidates) {
              const passed = advanceNodes(route, 1, last, point);
              if (passed > furthest) {selected = route; nextNode = passed; furthest = passed;}
            }
          } else nextNode = advanceNodes(selected, nextNode, last, point);
          if (selected) {
            progress = (nextNode - 1) / (selected.anchors.length - 1);
            if (nextNode >= selected.anchors.length) {
              phase = 'ready'; hint = '彼岸接住了。留在最后一粒光上，松手让花桥成形。';
            }
          }
          if (distance(point, last) > .035) {
            if (points.length >= 160) points.shift();
            points.push({x:point.x,y:VISUAL_Y + .018,z:point.z});
          }
          last.x = point.x; last.z = point.z;
        }
      }
    }

    if (!active && previousActive) {
      if (phase === 'ready' && !gesture?.active && available && platform === origin && gesture?.released !== false && !gesture?.cancelled &&
          distance(last, selected.anchors.at(-1)) <= START_RADIUS) {
        signals.push({type:'construct',shape:selected.shape});
        phase = 'committed'; progress = 1; fadingTime = 1.5;
        hint = '花尘接成了一条路。收起风笔，走到下一座石台。';
      } else if (phase === 'drawing' || phase === 'ready') {
        fail(gesture?.released === false || gesture?.cancelled ? '这一笔已收回。回到脚下的光环可以重新开始。' : '还差几粒悬光。风线会退回，等你重新起笔。');
      }
    }
    previousActive = active;
    const idle = phase === 'idle';
    if (idle) hint = available ? '从脚下光环起笔，沿悬光连到相邻石台，最后松手。'
      : !unlocked ? '先让风廊的光抵达，池上的悬光才会醒来。'
      : occupied ? '先回到石台，才能收放承托你的花桥。' : '走到一座固定石台，再开始织桥。';
    const visualRoute = selected || (available ? orderedRoute(BRIDGE_WEAVE_ROUTES.find(route => route.from === platform || route.to === platform), platform) : null);
    context = {
      available, origin:idle ? platform : origin, status:!available && idle ? 'blocked' : phase,
      shape:selected?.shape || null,target:selected?.target || null,progress,hint,
      fade:phase==='fading'?clamp(fadingTime/1.1,0,1):1,
      anchors:visualRoute ? visualRoute.anchors.map((anchor,i) => ({...anchor,passed:i < nextNode,next:i === nextNode})) : [],
    };
    return signals;
  }
  return {update,cancel,get context(){return context;},get preview(){return points;}};
}

const PATH_VERTEX = /* glsl */`
attribute float aRoute;
attribute float aAlong;
varying float vRoute;
varying float vAlong;
void main(){vRoute=aRoute;vAlong=aAlong;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`;
const GUIDE_COLOR = /* glsl */`
uniform vec3 uAvailable;
uniform vec3 uProgress;
uniform vec3 uReverse;
uniform vec3 uBuilt;
uniform vec3 uNext;
uniform float uTime;
uniform float uOpacity;
float channel(vec3 value,float route){return route<0.5?value.x:route<1.5?value.y:value.z;}
vec4 pathColor(float route,float along){
 float available=channel(uAvailable,route),built=channel(uBuilt,route);
 float progress=channel(uProgress,route),reverse=channel(uReverse,route);
 float travel=mix(along,1.0-along,reverse);
 float passed=step(travel,progress)*step(0.001,progress);
 float nextGlow=(1.0-smoothstep(0.025,0.09,abs(travel-channel(uNext,route))))*available*(1.0-built);
 float pulse=pow(max(0.0,sin(travel*18.0-uTime*2.2)),6.0)*available;
 vec3 cool=vec3(0.27,0.53,0.7),warm=vec3(1.25,0.88,0.45);
 vec3 color=mix(cool,warm,max(passed,built)*0.86);
 color=mix(color,vec3(1.4,1.05,0.7),nextGlow*0.65);
 float alpha=(0.05+available*0.19+passed*0.5+built*0.18+pulse*0.16+nextGlow*0.2)*uOpacity;
 return vec4(color,alpha);
}
`;
const PATH_FRAGMENT = /* glsl */`
varying float vRoute;varying float vAlong;
${GUIDE_COLOR}
void main(){gl_FragColor=pathColor(vRoute,vAlong);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`;
const BEAD_VERTEX = /* glsl */`
attribute float aRoute;attribute float aAlong;
uniform float uTime;
varying float vRoute;varying float vAlong;
void main(){vRoute=aRoute;vAlong=aAlong;vec3 p=position;p.y+=sin(uTime*1.4+aAlong*8.0+aRoute)*0.035;
vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(230.0/max(-mv.z,0.2),5.0,20.0);}
`;
const BEAD_FRAGMENT = /* glsl */`
varying float vRoute;varying float vAlong;
${GUIDE_COLOR}
void main(){vec2 point=(gl_PointCoord-0.5)*2.0;float radius=length(point);if(radius>1.0)discard;vec4 color=pathColor(vRoute,vAlong);
float angle=atan(point.y,point.x+0.00001);float petal=0.68+0.25*cos(angle*4.0);
float flower=1.0-smoothstep(petal-0.16,petal,radius);float glow=exp(-radius*radius*4.5);
gl_FragColor=vec4(color.rgb*1.4,color.a*(glow*0.85+flower*0.35)*2.1);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`;

/** World-space bridge weaving presentation. Four draw calls at most.
 * update(time, dt, input) returns construct signals and never changes input.state.
 */
export function createBridgeWeaver() {
  const group = new THREE.Group(); group.name = 'SpringLetterBridgeWeaver';
  const controller = createBridgeWeaveController();
  const uniforms = {
    uAvailable:{value:new THREE.Vector3()},uProgress:{value:new THREE.Vector3()},
    uReverse:{value:new THREE.Vector3()},uBuilt:{value:new THREE.Vector3()},
    uNext:{value:new THREE.Vector3(.2,.2,.2)},
    uTime:{value:0},uOpacity:{value:1},
  };
  const guidePositions=[],guideRoutes=[],guideAlong=[],beadPositions=[],beadRoutes=[],beadAlong=[];
  BRIDGE_WEAVE_ROUTES.forEach((route,index)=>{
    for(let i=0;i<32;i++)for(const t of [i/32,(i+1)/32]){
      const point=routePoint(route,t);guidePositions.push(point.x,point.y,point.z);guideRoutes.push(index);guideAlong.push(t);
    }
    route.anchors.forEach((point,i)=>{beadPositions.push(point.x,point.y+.045,point.z);beadRoutes.push(index);beadAlong.push(i/5);});
  });
  function geometry(positions,routes,along){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('aRoute',new THREE.Float32BufferAttribute(routes,1));g.setAttribute('aAlong',new THREE.Float32BufferAttribute(along,1));return g;}
  const guideGeometry=geometry(guidePositions,guideRoutes,guideAlong);
  const beadGeometry=geometry(beadPositions,beadRoutes,beadAlong);
  const guideMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:PATH_VERTEX,fragmentShader:PATH_FRAGMENT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const beadMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:BEAD_VERTEX,fragmentShader:BEAD_FRAGMENT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const guides=new THREE.LineSegments(guideGeometry,guideMaterial);guides.name='BridgeSuspendedPaths';
  const beads=new THREE.Points(beadGeometry,beadMaterial);beads.name='BridgeOrderedAnchors';
  const previewGeometry=new THREE.BufferGeometry();
  const previewPositions=new Float32Array(160*3);previewGeometry.setAttribute('position',new THREE.BufferAttribute(previewPositions,3).setUsage(THREE.DynamicDrawUsage));previewGeometry.setDrawRange(0,0);
  const previewMaterial=new THREE.LineBasicMaterial({color:0xffe7b6,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending});
  const preview=new THREE.Line(previewGeometry,previewMaterial);preview.name='BridgeLiveStroke';preview.frustumCulled=false;
  const ringGeometry=new THREE.RingGeometry(.38,.425,48);
  const ringMaterial=new THREE.MeshBasicMaterial({color:0xffd9a2,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  const ring=new THREE.Mesh(ringGeometry,ringMaterial);ring.rotation.x=-Math.PI/2;ring.name='BridgeStartRing';
  group.add(guides,beads,preview,ring);
  let disposed=false;
  const visualProgress=new THREE.Vector3();
  function update(time,dt,input={}){
    if(disposed)return [];
    const delta=clamp(Number.isFinite(dt)?dt:0,0,.1);
    const signals=controller.update(delta,input),context=controller.context;
    uniforms.uTime.value=Number.isFinite(time)?time:0;
    const nearby=finitePoint(input.player)&&Math.hypot(input.player.x,input.player.z+32)<17;
    group.visible=!!(input.state?.wind?.solved&&nearby&&input.interactive!==false);
    const origin=context.origin;
    BRIDGE_WEAVE_ROUTES.forEach((route,index)=>{
      const connected=origin&&(route.from===origin||route.to===origin);
      uniforms.uAvailable.value.setComponent(index,context.available&&connected?1:0);
      const target=context.shape===route.shape?context.progress:0;
      const smoothed=visualProgress.getComponent(index)+(target-visualProgress.getComponent(index))*(1-Math.exp(-delta*12));
      visualProgress.setComponent(index,smoothed);
      uniforms.uProgress.value.setComponent(index,smoothed);
      uniforms.uNext.value.setComponent(index,context.shape===route.shape?Math.min(1,context.progress+.2):.2);
      uniforms.uReverse.value.setComponent(index,origin===route.to?1:0);
      uniforms.uBuilt.value.setComponent(index,input.state?.bridge?.structure===route.shape?1:0);
    });
    ring.visible=!!(context.available&&origin);
    if(ring.visible){ring.position.set(PLATFORMS[origin].x,VISUAL_Y+.01,PLATFORMS[origin].z);ringMaterial.opacity=.5+Math.sin(uniforms.uTime.value*2)*.16;}
    const points=controller.preview;
    for(let i=0;i<points.length;i++){previewPositions[i*3]=points[i].x;previewPositions[i*3+1]=points[i].y;previewPositions[i*3+2]=points[i].z;}
    previewGeometry.attributes.position.needsUpdate=true;previewGeometry.setDrawRange(0,points.length);
    preview.visible=points.length>1;
    previewMaterial.opacity=context.status==='fading'?context.fade*.65:context.status==='committed'?.85:.65;
    return signals;
  }
  return {
    group,update,cancel:controller.cancel,get context(){return controller.context;},
    dispose(){if(disposed)return;disposed=true;group.clear();for(const resource of [guideGeometry,beadGeometry,previewGeometry,ringGeometry,guideMaterial,beadMaterial,previewMaterial,ringMaterial])resource.dispose();},
  };
}
