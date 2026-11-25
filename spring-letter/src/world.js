import * as THREE from 'three';
import { mergeGeometries, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { createWorldPolish } from './world-polish.js';

// The world owns presentation only. Progression and the player's position belong
// to the controller. All geometry and audio-independent scenery are generated here.
const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const C = {
  pearl: 0xe7e2ed, stone: 0xa99eab, edge: 0x766e85, rose: 0xd8a1d7,
  blue: 0x91bfe8, gold: 0xd4b77b, ink: 0x494361, leaf: 0x638c8b,
};

function randomGenerator(seed = 16309) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

function surfaceGeometry(rows, columns, point) {
  const position = [], uv = [], indices = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= columns; c++) {
      const p = point(r / rows, c / columns);
      position.push(p[0], p[1], p[2]);
      uv.push(c / columns, r / rows);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const a = r * (columns + 1) + c, b = a + columns + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function tube(points, radius, segments = 56, radialSegments = 6) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curve, segments, radius, radialSegments, false);
}

function leafGeometry(length = 1, width = .28, bend = .35, rows = 18, columns = 6) {
  return surfaceGeometry(rows, columns, (u, v) => {
    const taper = Math.pow(Math.sin(Math.PI * u), .72);
    const across = (v * 2 - 1) * width * taper;
    return [across, bend * Math.sin(u * Math.PI * .8) + .12 * (1 - (v * 2 - 1) ** 2) * taper, u * length];
  });
}

function createWater() {
  const waves = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -1000, 0));
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uNight: { value: 0 }, uDetail: { value: 0 }, uWaves: { value: waves },
      uWater: { value: new THREE.Color(0x204c4f) },
      uPearl: { value: new THREE.Color(0x75999f) },
      uReflection: { value: null },uReflectionMatrix: {value: new THREE.Matrix4()},uReflectionAmount: {value:0},
    },
    vertexShader: `
      uniform float uTime;
      uniform vec4 uWaves[8];
      uniform mat4 uReflectionMatrix;
      varying vec4 vReflection;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vLocal;
      float heightAt(vec2 p) {
        float h = sin(p.x * .48 + p.y * .23 + uTime * .58) * .025;
        h += sin(p.x * .19 - p.y * .51 - uTime * .39) * .018;
        h += sin(p.x * 1.13 + p.y * .83 + uTime * .24) * .007;
        for (int i = 0; i < 8; i++) {
          float age = uTime - uWaves[i].z;
          float dist = length(p - uWaves[i].xy);
          float ring = dist - age * 1.65;
          float gate = step(0., age) * (1. - step(7., age));
          h += sin(ring * 8.5) * exp(-ring * ring * .72) * exp(-age * .62)
            * uWaves[i].w * .065 * gate;
        }
        return h;
      }
      void main() {
        vec3 p = position;
        vec2 worldXZ = (modelMatrix * vec4(p, 1.)).xz;
        float h = heightAt(worldXZ);
        float hx = heightAt(worldXZ + vec2(.075, 0.));
        float hz = heightAt(worldXZ + vec2(0., .075));
        p.y += h;
        vNormal = normalize(vec3((h - hx) / .075, 1., (h - hz) / .075));
        vWorld = (modelMatrix * vec4(p, 1.)).xyz;
        vLocal = position.xz;
        vReflection = uReflectionMatrix * vec4(vWorld,1.);
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uNight;
      uniform float uDetail;
      uniform vec3 uWater;
      uniform vec3 uPearl;
      uniform sampler2D uReflection;
      uniform float uReflectionAmount;
      varying vec4 vReflection;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vLocal;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float fresnel = pow(1. - clamp(dot(n, viewDir), 0., 1.), 3.);
        vec2 q = vWorld.xz;
        // A warped interference field: high curvature gathers light into fine veins.
        vec2 w=q*mix(.9,2.2,uDetail)+vec2(sin(q.y*.71+uTime*.12),cos(q.x*.61-uTime*.1))*.8;
        float a=sin(dot(w,vec2(2.1,1.3))+sin(w.y*1.8+uTime*.16));
        float b=sin(dot(w,vec2(-1.4,2.7))+cos(w.x*1.1-uTime*.13));
        float c=sin(dot(w,vec2(3.2,-.8))+sin((w.x+w.y)*.7));
        float field=a+b*.75+c*.3;
        float caustic=pow(max(0.,1.-abs(field)*1.45),20.);
        caustic*=.5+.5*sin(w.x*.42+w.y*.57)*sin(w.y*.35-uTime*.08);
        vec3 color = mix(uWater, uPearl, fresnel * .45 + .08);
        float broadBands = sin(q.x * .24 + q.y * .17 + uTime * .09) * .5 + .5;
        color = mix(color, color * vec3(.87, .91, .99), broadBands * .24);
        // Fine, broken light gathers under the surface rather than tracing a
        // uniform bright diagram across the entire water plane.
        float shallows=exp(-length(q-vec2(0.,0.))*.15);
        shallows=max(shallows,exp(-length(q-vec2(0.,-16.))*.2));
        shallows=max(shallows,exp(-length(q-vec2(0.,-46.))*.2));
        float cloudShade=.93+.07*sin(q.x*.07+q.y*.05+uTime*.04);
        color=mix(color*vec3(.48,.75,.74),color,shallows*.5+.35)*cloudShade;
        color += vec3(.38,.46,.34)*caustic*(1.-fresnel)*(.045+.10*uDetail)*shallows;
        float broad = pow(max(dot(n, normalize(vec3(-.4, 1., .24))), 0.), 16.);
        vec3 halfDir = normalize(viewDir + normalize(vec3(-.4, 1., .24)));
        float shine = pow(max(dot(n, halfDir), 0.), 140.);
        color += vec3(.012, .022, .021) * broad + vec3(.32, .24, .2) * shine;
        vec3 nightColor = color * vec3(.22, .19, .37) + vec3(.014, .013, .035);
        color = mix(color, nightColor, uNight);
        if(uReflectionAmount>.0&&vReflection.w>.0){
          vec4 coords=vReflection;coords.xy+=n.xz*coords.w*.032;
          vec3 reflected=texture2DProj(uReflection,coords).rgb;
          // An invalid optional reflection sample must not contaminate HDR
          // bloom. Keep the authored water colour for that pixel instead.
          // Test IEEE exponent bits: ANGLE's fast-math compiler can fold an
          // isnan() test away even when a sampled float texture contains NaN.
          uvec3 exponent=floatBitsToUint(reflected)&uvec3(0x7f800000u);
          if(!any(equal(exponent,uvec3(0x7f800000u))))
            color=mix(color,reflected,(.12+fresnel*.46)*uReflectionAmount);
        }
        float edge = 1. - smoothstep(44., 69., length(vLocal * vec2(1., .88)));
        gl_FragColor = vec4(color, edge * .94);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
    fog: true,
  });
  // Finite tessellated water, not a sky-sized infinite floor. Lighting and caustics
  // are procedural approximations. An optional clipped mirror camera supplies
  // true planar scene reflection; light quality omits that extra render.
  material.vertexShader = material.vertexShader.replace('varying vec2 vLocal;', 'varying vec2 vLocal;\n#include <fog_pars_vertex>')
    .replace('gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.);',
      'vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);\ngl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>');
  material.fragmentShader = material.fragmentShader.replace('varying vec2 vLocal;', 'varying vec2 vLocal;\n#include <fog_pars_fragment>');
  Object.assign(material.uniforms, THREE.UniformsUtils.clone(THREE.UniformsLib.fog));
  const geometry = new THREE.PlaneGeometry(140, 140, 96, 96);
  geometry.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(geometry, material);
  water.position.set(0, -.18, -23);
  water.name = 'shallow-water';
  water.renderOrder = -1;
  water.userData.waveIndex = 0;
  return water;
}

export function createWorld() {
  const group = new THREE.Group();
  group.name = 'spring-letter-world';
  const rng = randomGenerator();
  const moving = [], glowMaterials = [], resources = new Set(), cameraOccluders = [];
  const mat = (color, options = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: .58, metalness: .1, ...options });
    resources.add(m);
    return m;
  };
  const pearl = mat(0xc9bea7, { roughness: .9, metalness: 0 });
  const groundMat = mat(0xc3baa1, { roughness: .95, metalness: 0, vertexColors: true });
  const archMat = mat(0xc7bbaa, { roughness: .91, metalness: 0 });
  const satin = mat(0xc5b8cd, { roughness: .52, side: THREE.DoubleSide });
  const silver = mat(0xd8ddeb, { roughness: .25, metalness: .76 });
  const gold = mat(C.gold, { roughness: .26, metalness: .66 });
  const edgeMat = mat(0x7e8071, { roughness: .96, metalness: 0 });
  const underMat = mat(0x647c70, { roughness: .94, metalness: 0 });
  pearl.name='garden-limestone';groundMat.name='garden-earth';archMat.name='garden-limestone';
  edgeMat.name='garden-shore-stone';underMat.name='garden-submerged-stone';
  const green = mat(C.leaf, { roughness: .36, side: THREE.DoubleSide });
  const rose = mat(C.rose, { roughness: .38, side: THREE.DoubleSide });
  const blue = mat(C.blue, { roughness: .3, side: THREE.DoubleSide });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xd5def0, roughness: .15,
    metalness: .05, transparent: true, opacity: .4, side: THREE.DoubleSide,
    depthWrite: false, iridescence: .6, iridescenceIOR: 1.25 });
  resources.add(glass);
  glass.forceSinglePass = true;
  const emissive = (color, intensity = .35) => {
    const material = mat(color, { emissive: color, emissiveIntensity: intensity, roughness: .32 });
    glowMaterials.push({ material, base: intensity });
    return material;
  };
  const glowBlue = emissive(0xa9d4f4, .44);
  const glowGold = emissive(0xf0d9a2, .4);
  const glowRose = emissive(0xecc2e8, .27);
  const worldPolish = createWorldPolish({ resources, leafGeometry, surfaceGeometry });
  group.add(worldPolish.group);
  // Original radial contact-occlusion map, generated without network assets or
  // DOM/canvas requirements. Dark contact centers fade before reaching the edge.
  const aoData = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const distance = Math.hypot((x - 31.5) / 31.5, (y - 31.5) / 31.5);
    const i = (y * 64 + x) * 4;
    aoData[i] = aoData[i + 1] = aoData[i + 2] = 255;
    aoData[i + 3] = Math.round(Math.pow(Math.max(0, 1 - distance), 2.3) * 190);
  }
  const aoTexture = new THREE.DataTexture(aoData, 64, 64);
  aoTexture.needsUpdate = true;
  aoTexture.magFilter = aoTexture.minFilter = THREE.LinearFilter;
  const aoMaterial = new THREE.MeshBasicMaterial({ color: 0x3b304b,
    map: aoTexture, transparent: true, opacity: .39, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -1, toneMapped: false });
  resources.add(aoMaterial);
  const aoGeometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);

  const mesh = (geometry, material, parent = group, position) => {
    const item = new THREE.Mesh(geometry, material);
    if (position) item.position.set(...position);
    item.receiveShadow = true;
    parent.add(item);
    return item;
  };
  const ring = (radius, thickness, material, parent, y = .1) => {
    const item = mesh(new THREE.TorusGeometry(radius, thickness, 6, 80), material, parent);
    item.rotation.x = -Math.PI / 2;
    item.position.y = y;
    return item;
  };
  const stem = (points, material, parent, radius = .025) => mesh(tube(points, radius, 28), material, parent);
  const contactShadow = (x, z, width, depth, parent = group, y = .072) => {
    const shadow = mesh(aoGeometry, aoMaterial, parent, [x, y, z]);
    shadow.scale.set(width, 1, depth);
    shadow.renderOrder = 1;
    return shadow;
  };

  function island(x, z, radius, variation = 0, basin = false, identity = '') {
    const land = new THREE.Group();
    land.position.set(x, 0, z);
    group.add(land);
    const top = surfaceGeometry(basin?36:identity?26:radius<=1.3?10:12, basin?100:radius<=1.3?48:72, (u, v) => {
      const a = -v * TAU;
      const outline = radius * (1 + variation * Math.sin(3 * a + .5) + variation * .35 * Math.cos(7 * a));
      const r = u * outline;
      // The first garden is a shallow basin with a walkable rim and a tiny
      // flower pedestal. Its visible interior lies below the water plane.
      const inside = basin ? -.39 + THREE.MathUtils.smoothstep(u, .78, .87) * .445 : .055;
      return [Math.cos(a) * r, inside - Math.pow(u, 24) * .035, Math.sin(a) * r];
    });
    const colors = [], floorPosition = top.getAttribute('position');
    const floorTint=new THREE.Color(),mossTint=new THREE.Color(.38,.48,.25);
    for (let i = 0; i < floorPosition.count; i++) {
      const px = floorPosition.getX(i), pz = floorPosition.getZ(i);
      const distance = Math.hypot(px, pz) / radius;
      const fine = Math.sin(px * 8.1 + pz * 5.7) * Math.cos(pz * 6.4 - px * 1.8) * .012;
      const value = .91 + Math.sin(distance * Math.PI) * .055 + fine;
      floorTint.setRGB(value,value*.978,value*.92);
      if(basin){
        // Growth collects around the existing meadow roots. The worn entry and
        // the player's original circular support boundary keep their shape.
        let growth=0;
        for(const [mx,mz] of [[5.8,1.7],[4.6,-4.4],[-4.4,-4.7],[-5.5,3.4]]){
          const d=Math.hypot((px-mx)/1.1,(pz-mz)/.8);
          growth=Math.max(growth,1-THREE.MathUtils.smoothstep(d,.15,1.6));
        }
        const brokenEdge=(.5+.5*Math.sin(px*2.4+Math.sin(pz*1.6))*Math.cos(pz*1.7));
        const wetMargin=THREE.MathUtils.smoothstep(distance,.88,.98)*(1-THREE.MathUtils.smoothstep(distance,.99,1.02));
        floorTint.lerp(mossTint,growth*.58+wetMargin*brokenEdge*.24);
      }
      colors.push(floorTint.r,floorTint.g,floorTint.b);
    }
    top.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    mesh(top, identity ? worldPolish.paintIsland(top, identity) : groundMat, land);
    const side = surfaceGeometry(8, 100, (u, v) => {
      const a = -v * TAU;
      const r = radius * (1 + variation * Math.sin(3 * a + .5) + variation * .35 * Math.cos(7 * a))
        * (1 - .11 * Math.sin(u * Math.PI * .7));
      return [Math.cos(a) * r, .02 - u * .72, Math.sin(a) * r];
    });
    mesh(side, edgeMat, land);
    const submerged = mesh(new THREE.SphereGeometry(radius, 48, 12), underMat, land, [0, -.92, 0]);
    submerged.scale.y = .065;
    // A subdued water-contact seam is useful on the smaller landings. The
    // opening shore reads through wet earth and stones, without a drawn rim.
    const contour = [];
    for (let i = 0; i <= 100; i++) {
      const a = i / 100 * TAU;
      const r = radius * (1 + variation * Math.sin(3 * a + .5) + variation * .35 * Math.cos(7 * a));
      contour.push([Math.cos(a) * r, .045, Math.sin(a) * r]);
    }
    if(!basin)mesh(tube(contour, .012, 150), edgeMat, land);
    return land;
  }

  const garden = island(0, 0, 6.8, .012, true);
  const windIsland = island(0, -16, 6, .015, false, 'wind');
  const finaleIsland = island(0, -46, 6, .012, false, 'finale');
  // A low turned foot grounds the hero stems without covering the water.
  mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0, -.37), new THREE.Vector2(.68, -.37),
    new THREE.Vector2(.71, -.19), new THREE.Vector2(.6, -.07),
    new THREE.Vector2(.4, .015), new THREE.Vector2(0, .025),
  ], 48), pearl, garden);
  ring(.59, .014, gold, garden, -.055);
  contactShadow(0, .08, 2.7, 2.15, garden, -.141);
  // Two flower cups and three old water marks make the opening rhythm visible.
  const gardenCupA = cup(-2.1, 1.25, .29, garden);
  const gardenCupB = cup(2.35, 1.75, .25, garden);
  gardenCupA.position.y = -.16;
  gardenCupB.position.y = -.19;
  contactShadow(-2.1, 1.25, 1.4, 1.1, garden, -.141);
  contactShadow(2.35, 1.75, 1.25, 1, garden, -.141);
  const oldWaterMarks = new THREE.Group();
  oldWaterMarks.position.set(0, -.14, .65);
  garden.add(oldWaterMarks);
  const watermarkMaterial = new THREE.MeshBasicMaterial({ color: 0x6b7e7c,
    transparent: true, opacity: .14, depthWrite: false });
  resources.add(watermarkMaterial);
  for (const [radius, length, turn, x, z] of [[1.02, Math.PI * 1.05, .2, -.12, .05], [1.55, Math.PI * .64, 2.35, .16, -.11]]) {
    const mark = mesh(new THREE.TorusGeometry(radius, .008, 4, 56, length), watermarkMaterial, oldWaterMarks, [x, 0, z]);
    mark.rotation.set(-Math.PI / 2, 0, turn);
  }
  const awakeningRings = [];
  for (let i = 0; i < 3; i++) {
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: i % 2 ? 0xbbe1ee : 0xe8d09d,
      transparent: true, opacity: 0, depthWrite: false });
    resources.add(pulseMaterial);
    const pulse = ring(.88 + i * .38, .025, pulseMaterial, oldWaterMarks, .013);
    pulse.name = `opening-awakening-${i}`;
    awakeningRings.push(pulse);
  }
  const anchors = { A: [0, -26], R: [-5, -29], M: [0, -32], F: [0, -38] };
  for (const [name, [x, z]] of Object.entries(anchors)) {
    const platform = island(x, z, 1.25);
    platform.name = `anchor-${name}`;
    ring(.96, .013, gold, platform, .075);
    ring(.82, .009, edgeMat, platform, .076);
    const marker = mesh(new THREE.OctahedronGeometry(.065), glowBlue, platform, [.82, .18, 0]);
    marker.rotation.z = Math.PI / 4;
  }

  // The flower foot is the garden's sole permanent gold circle. Transient
  // awakening rings above remain intact; the water no longer reads as a dial.

  function steppingPath(start, end, width, material = pearl, petal = false) {
    const path = new THREE.Group();
    group.add(path);
    const distance = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const count = Math.max(2, Math.ceil(distance / .65));
    const angle = Math.atan2(end[0] - start[0], end[1] - start[1]);
    const stepGeometry = petal ? leafGeometry(.87, width * .46, .045)
      : new THREE.CylinderGeometry(1, .94, .16, 32, 1);
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = THREE.MathUtils.lerp(start[0], end[0], t);
      const z = THREE.MathUtils.lerp(start[1], end[1], t);
      const stone = mesh(stepGeometry, material, path,
        [x, petal ? .055 : -.025, z]);
      if (petal) stone.rotation.y = angle + (i % 2 ? -.28 : .28);
      else { stone.scale.set(width * .51, 1, .48); stone.rotation.y = angle; }
      if (i % 2 === 0) {
        const pin = mesh(new THREE.SphereGeometry(.025, 8, 6), glowGold, path, [x, .075, z]);
        pin.scale.y = .45;
      }
    }
    return path;
  }

  const p1Path = steppingPath([0, -6], [0, -11], 2.6);
  const windPath = steppingPath([0, -21], [0, -26], 2.1);
  const sidePath = steppingPath(anchors.A, anchors.R, 1.45);
  const bridgeAM = steppingPath(anchors.A, anchors.M, 1.6, satin, true);
  const bridgeMF = steppingPath(anchors.M, anchors.F, 1.6, rose, true);
  const shieldRM = steppingPath(anchors.R, anchors.M, 1.5, green, true);
  const finalPath = steppingPath(anchors.F, [0, -41], 2);
  const bridgeReveals = [bridgeAM, bridgeMF, shieldRM].map(path => {
    const materials = new Map();
    path.traverse(object => {
      if (!object.isMesh) return;
      if (!materials.has(object.material)) {
        const copy = object.material.clone();
        copy.transparent = true;
        copy.opacity = .22;
        copy.forceSinglePass = true;
        materials.set(object.material, copy);
        resources.add(copy);
      }
      object.material = materials.get(object.material);
    });
    return { path, materials: [...materials.values()], start: -10 };
  });
  const bridgeTraces = new THREE.Group();
  group.add(bridgeTraces);
  const traceMaterial = new THREE.MeshBasicMaterial({ color: 0xc4b3d0,
    transparent: true, opacity: .25, depthWrite: false });
  resources.add(traceMaterial);
  for (const [a, b] of [[anchors.A, anchors.M], [anchors.M, anchors.F], [anchors.R, anchors.M]]) {
    mesh(tube([[a[0], .025, a[1]], [(a[0] + b[0]) / 2, .03, (a[1] + b[1]) / 2],
      [b[0], .025, b[1]]], .017, 24, 4), traceMaterial, bridgeTraces);
  }
  bridgeTraces.visible = false;
  // All three crossings remain low to the water. The former shield route's
  // vertical leaf sail occluded the courier and became an opaque green wall
  // when its shared bridge reveal material reached full opacity.
  for (const path of [p1Path, windPath, sidePath, bridgeAM, bridgeMF, shieldRM, finalPath]) path.visible = false;

  function arch(x, z, width, height, rotation = 0, material = archMat, profile = {}) {
    const frame = new THREE.Group();
    frame.position.set(x, 0, z);
    frame.rotation.y = rotation;
    group.add(frame);
    const points = [[-width / 2, -.2, 0], [-width / 2, height * .46, 0]];
    for (let i = 0; i <= 24; i++) {
      const a = Math.PI - i / 24 * Math.PI;
      points.push([Math.cos(a) * width / 2, height * .46 + Math.sin(a) * height * .54, 0]);
    }
    points.push([width / 2, -.2, 0]);
    // Masonry has a real rectangular section, a bevel and a visible intrados.
    const shape = new THREE.Shape(), half=width/2, spring=height*.46, rise=height*.54, band=profile.band ?? .32;
    shape.moveTo(-half-band,-.2);shape.lineTo(-half-band,spring);
    if (profile.fragment) {
      // Only the outer foot and a broken springing remain. The missing inner
      // column leaves the flower stem and its reflection unobstructed.
      const cut = 1.82;
      for (let i = 0; i <= 24; i++) {
        const a = Math.PI - i / 24 * (Math.PI - cut);
        shape.lineTo(Math.cos(a) * (half + band), spring + Math.sin(a) * (rise + band));
      }
      for (let i = 24; i >= 0; i--) {
        const a = Math.PI - i / 24 * (Math.PI - cut);
        shape.lineTo(Math.cos(a) * (half - band), spring + Math.sin(a) * (rise - band));
      }
      shape.lineTo(-half + band, -.2); shape.closePath();
    } else {
      shape.bezierCurveTo(-half-band,spring+rise*.56,-half*.55,height+band,0,height+band);
      shape.bezierCurveTo(half*.55,height+band,half+band,spring+rise*.56,half+band,spring);
      shape.lineTo(half+band,-.2);shape.lineTo(half-band,-.2);shape.lineTo(half-band,spring);
      shape.bezierCurveTo(half-band,spring+rise*.52,half*.52,height-band,0,height-band);
      shape.bezierCurveTo(-half*.52,height-band,-half+band,spring+rise*.52,-half+band,spring);
      shape.lineTo(-half+band,-.2);shape.closePath();
    }
    const depth = profile.depth ?? .48;
    let geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.04,curveSegments:24});geometry.translate(0,0,-depth/2);
    if (profile.opening) {
      const original = geometry; geometry = toCreasedNormals(geometry, Math.PI / 3);
      if (original !== geometry) original.dispose();
      worldPolish.paintOpeningStone(geometry);
    }
    const occluderMaterial=material.clone();occluderMaterial.transparent=true;resources.add(occluderMaterial);
    const outer = mesh(geometry, occluderMaterial, frame);outer.userData.cameraOccluder=true;cameraOccluders.push(outer);
    outer.castShadow = true;
    const trim = points.map(([px, py, pz]) => [px * .94, py, pz - .11]);
    if (profile.trim !== false) mesh(tube(trim, .018, 100, 5), gold, frame);
    for (const px of profile.feet === false ? [] : [-width / 2, width / 2]) {
      const foot = mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.32, -.3), new THREE.Vector2(.34, -.05),
        new THREE.Vector2(.27, .09), new THREE.Vector2(.18, .26),
      ], 24), pearl, frame, [px, 0, 0]);
      foot.castShadow = true;
      foot.scale.setScalar(profile.footScale ?? 1);
      contactShadow(px, 0, 1.25, .95, frame, -.14);
    }
    return frame;
  }

  // The authored three-quarter camera sees this colonnade on the right. Its
  // opening straddles the route; posts stay clear of the connecting paths.
  const openingArch = arch(-.6,-6.5,5.5,4.9,.2,worldPolish.openingStone,{band:.19,depth:.3,opening:true,trim:false,feet:false});
  openingArch.name = 'opening-path-arch';
  arch(1.1,-22.5,5.8,4.9,-.18);
  const finaleArch = arch(0,-49,9.8,5.6,0,worldPolish.stoneMaterials[0],{band:.2,depth:.32,footScale:.8});
  finaleArch.name = 'finale-shore-arch';
  // Fallen ribs retain a history of shelter without repeating a tunnel of hoops.
  for(const [x,z,length,turn] of [[-3.8,-10,2.8,.4],[4.5,-19,2.2,-.35],[-3.2,-35,2.9,-.5],[4.4,-41,2.5,.25]]){
    const wall=new THREE.Group();wall.position.set(x,0,z);wall.rotation.y=turn;group.add(wall);
    for(let j=0;j<4;j++){
      const block=mesh(new THREE.BoxGeometry(length/4-.045,.48+(j%3)*.15,.58),archMat,wall,[(j-1.5)*length/4,.22,0]);block.rotation.z=(j-1.5)*.025;block.castShadow=true;
    }
    mesh(tube([[-length/2,.5,0],[0,.75,.08],[length/2,.5,0]],.018,20,4),gold,wall);
  }
  const openingRib = arch(-3.4,-2.9,4.4,3.5,-.22,worldPolish.openingStone,{band:.17,depth:.28,opening:true,fragment:true,trim:false,feet:false});
  openingRib.name = 'opening-shore-rib';
  const drapeMaterial = mat(0xaeb7ac, { transparent: true, opacity: .38,
    side: THREE.DoubleSide, roughness: .82, depthWrite: false });
  drapeMaterial.forceSinglePass = true;
  const drape = mesh(surfaceGeometry(32, 24, (u, v) => {
    const x = (v - .5) * .56;
    const y = 2.8 - u * 1.95 - Math.sin(v * Math.PI) * .07;
    const z = Math.sin(v * TAU * 1.4 + u * .6) * (.025 + .04 * u) + .16 * u * u;
    return [x, y, z];
  }), drapeMaterial, group, [-4.85, 0, -3.4]);
  drape.rotation.y = -.22;
  moving.push({ kind: 'drape', object: drape, base: -.22 });

  // A remote crown of bowed ribs suggests the size of the ark without a second
  // playable map, keeping the chapter focused and the hero flower dominant.
  const crown = new THREE.Group();
  // Portrait farewell framing pulls the camera back past z=-63. Keep this
  // distant silhouette beyond that camera, so its ribs cannot cross the beds.
  crown.position.set(0, 0, -73);
  group.add(crown);
  for (let i = 0; i < 9; i++) {
    const a = (i / 8 - .5) * Math.PI * .87;
    const bx = Math.sin(a) * 13, bz = Math.cos(a) * -5;
    const points = [[bx, -.3, bz], [bx * 1.12, 4, bz - 1.4],
      [bx * .78, 10.8 - Math.abs(a) * 1.8, bz - 2.2], [bx * .12, 13, bz - 1.4]];
    mesh(tube(points, .11, 70, 8), satin, crown);
    mesh(tube(points.map(p => [p[0] + .1, p[1], p[2]]), .015, 70, 5), gold, crown);
  }
  const crownRing = ring(5.5, .028, silver, crown, 10.1);
  crownRing.rotation.x = -.25;

  function cup(x, z, radius = .38, parent = group) {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(x, .08, z);
    parent.add(cupGroup);
    const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(radius * .42, .03),
      new THREE.Vector2(radius * .62, .08), new THREE.Vector2(radius * .78, .32),
      new THREE.Vector2(radius, .6), new THREE.Vector2(radius * 1.02, .67)];
    mesh(new THREE.LatheGeometry(profile, 40), glass, cupGroup);
    ring(radius * 1.02, .014, gold, cupGroup, .67);
    ring(radius * .62, .018, silver, cupGroup, .08);
    return cupGroup;
  }
  const sourceCup = cup(-3, -14, .4);
  const goalCup = cup(3, -18, .4);
  contactShadow(-3, -14, 1.4, 1.1);
  contactShadow(3, -18, 1.4, 1.1);
  for (let i = 0; i < 3; i++) {
    const blade = mesh(leafGeometry(.44, .14, .25), green, goalCup, [0, .15, 0]);
    blade.rotation.y = i * TAU / 3;
  }
  const goalHalo = ring(.65, .016, glowGold, goalCup, .075);
  const sourceHalo = ring(.63, .012, glowBlue, sourceCup, .075);
  const obstacle = new THREE.Group();
  obstacle.position.set(0, .07, -16);
  group.add(obstacle);
  const obstacleBase = mesh(new THREE.SphereGeometry(.79, 32, 18), pearl, obstacle);
  obstacleBase.scale.set(1, .33, 1);
  ring(.8, .018, gold, obstacle, .08);
  const foldedLeaf = mesh(leafGeometry(1.8, .5, .9), satin, obstacle, [0, .06, -.65]);
  foldedLeaf.rotation.z = -.3;
  contactShadow(0, -16, 2.55, 2.4);

  const routeMaterial = new THREE.LineBasicMaterial({ color: 0xa9b9d2,
    transparent: true, opacity: .48, depthWrite: false });
  resources.add(routeMaterial);
  for (const side of [-1, 1]) {
    const points = [new THREE.Vector3(-3, .086, -14),
      new THREE.Vector3(-1.8, .086, -16 + side * 1.7),
      new THREE.Vector3(1.3, .086, -16 + side * 1.8), new THREE.Vector3(3, .086, -18)];
    const curve = new THREE.CatmullRomCurve3(points);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), routeMaterial);
    group.add(line);
    for (let i = 1; i < 5; i++) {
      const p = curve.getPoint(i / 5);
      const bead = mesh(new THREE.SphereGeometry(.026, 8, 6), glowBlue, group, [p.x, p.y + .02, p.z]);
      bead.scale.y = .35;
    }
  }
  const windLight = new THREE.Group();
  group.add(windLight);
  const lightCore = mesh(new THREE.IcosahedronGeometry(.13, 2), glowGold, windLight);
  const lightShell = mesh(new THREE.IcosahedronGeometry(.22, 1), glass, windLight);
  lightShell.rotation.z = .3;
  const orbitGeo = new THREE.TorusGeometry(.28, .008, 4, 36);
  const windOrbit = mesh(orbitGeo, glowBlue, windLight);
  windOrbit.rotation.x = .9;

  function discovery(x, z, kind) {
    const relic = new THREE.Group();
    relic.position.set(x, .08, z);
    group.add(relic);
    if (kind === 'table') {
      const pedestal = mesh(new THREE.LatheGeometry([
        new THREE.Vector2(.39, -.32), new THREE.Vector2(.25, .13),
        new THREE.Vector2(.17, .42), new THREE.Vector2(.54, .55),
        new THREE.Vector2(.57, .61), new THREE.Vector2(0, .64),
      ], 32), pearl, relic);
      pedestal.castShadow = true;
      const letter = mesh(leafGeometry(.48, .29, .025), satin, relic, [0, .66, -.22]);
      letter.rotation.y = .5;
      mesh(new THREE.SphereGeometry(.075, 16, 12), gold, relic, [.03, .72, .02]).scale.y = .25;
    } else if (kind === 'leaf') {
      mesh(leafGeometry(.92, .31, .28), silver, relic, [0, .04, -.4]).rotation.y = -.5;
      stem([[0, .03, -.4], [0, .2, 0], [.1, .22, .44]], gold, relic, .011);
    } else if (kind === 'echo') {
      for (let i = 0; i < 3; i++) {
        const bell = cup((i - 1) * .36, 0, .18 + i * .035, relic);
        bell.position.y = .12 + (i % 2) * .1;
      }
    } else {
      ring(.53, .022, silver, relic, .07);
      for (let i = 0; i < 3; i++) {
        const mark = mesh(new THREE.OctahedronGeometry(.09), gold, relic,
          [Math.cos(i * TAU / 3) * .32, .17, Math.sin(i * TAU / 3) * .32]);
        mark.scale.y = .45;
      }
    }
    const signal = mesh(new THREE.SphereGeometry(.035, 10, 8), glowGold, relic, [0, .92, 0]);
    contactShadow(0, 0, kind === 'table' ? 1.65 : 1.2, 1.1, relic,
      z === 3 || z === -3 ? -.22 : -.007);
    moving.push({ kind: 'signal', object: signal, base: .92, phase: x + z });
    return relic;
  }
  discovery(-3, 3, 'table');
  discovery(3, -3, 'leaf');
  discovery(-4, -16, 'echo');
  discovery(-5, -29, 'protocol');

  const player = new THREE.Group();
  player.name = 'player-seed';
  group.add(player);
  const seedCore = mesh(new THREE.SphereGeometry(.13, 20, 14), glowGold, player, [0, .28, 0]);
  seedCore.scale.set(.8, 1.35, .8);
  const playerBody = new THREE.Group();
  player.add(playerBody);
  for (let i = 0; i < 3; i++) {
    const petal = mesh(leafGeometry(.38, .12, .19), silver, playerBody, [0, .14, 0]);
    petal.rotation.y = i * TAU / 3;
    petal.rotation.x = -.7;
  }
  const seedRing = ring(.24, .009, gold, player, .16);
  const groundHalo = ring(.34, .013, glowBlue, player, .075);

  let companionReplyAt=-100;
  const companion = new THREE.Group();
  companion.name = 'companion-four-petal';
  companion.position.set(1.5, 1.3, 2.4);
  group.add(companion);
  const companionBody = new THREE.Group();
  companion.add(companionBody);
  const companionCore = mesh(new THREE.SphereGeometry(.065, 14, 10), glowGold, companionBody);
  const companionPetals = [];
  for (let i = 0; i < 4; i++) {
    const pivot = new THREE.Group();
    pivot.rotation.y = i * TAU / 4 + Math.PI / 4;
    companionBody.add(pivot);
    const petal = mesh(leafGeometry(.33, .12, .1), i % 2 ? blue : rose, pivot);
    companionPetals.push(petal);
  }

  const finalVessels = {};
  function finaleVessel(purpose, x, z, colorMaterial) {
    const vessel = new THREE.Group();
    vessel.position.set(x, .08, z);
    group.add(vessel);
    worldPolish.decorateVessel(purpose, vessel);
    contactShadow(0, 0, 1.8, 1.5, vessel, -.007);
    const center = mesh(new THREE.IcosahedronGeometry(.12, 2), colorMaterial, vessel, [0, .77, 0]);
    const petals = new THREE.Group();
    petals.position.y = .82;
    vessel.add(petals);
    for (let i = 0; i < 6; i++) {
      const blade = mesh(leafGeometry(.75, .23, .3), colorMaterial, petals);
      blade.rotation.y = i * TAU / 6;
      blade.rotation.x = -.24;
    }
    const halo = ring(.9, .018, colorMaterial, vessel, 1.24);
    halo.rotation.x = -.4;
    halo.visible = false;
    finalVessels[purpose] = { vessel, petals, halo, center };
  }
  finaleVessel('memory', -3, -46, glowBlue);
  finaleVessel('season', 0, -48, glowRose);
  finaleVessel('voyage', 3, -46, glowGold);

  const memoryArcs = new THREE.Group();
  memoryArcs.position.set(-3, 1.45, -46);
  group.add(memoryArcs);
  for (let i = 0; i < 3; i++) {
    const arc = mesh(new THREE.TorusGeometry(.95 + i * .14, .009, 4, 80, Math.PI * 1.65), glowBlue, memoryArcs);
    arc.rotation.set(.4 + i * .7, i * .8, i * .7);
  }
  memoryArcs.visible = false;

  const seasonPreview = new THREE.Group();
  seasonPreview.position.set(0, .075, -48);
  group.add(seasonPreview);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU;
    const sprig = new THREE.Group();
    sprig.position.set(Math.cos(a) * .95, 0, Math.sin(a) * .95);
    seasonPreview.add(sprig);
    stem([[0, 0, 0], [.03, .22, 0], [0, .38, .03]], green, sprig, .014);
    for (let j = 0; j < 3; j++) {
      const blade = mesh(leafGeometry(.27, .085, .12), green, sprig, [0, .08, 0]);
      blade.rotation.y = j * TAU / 3;
      const petal = mesh(leafGeometry(.19, .075, .08), rose, sprig, [0, .38, .03]);
      petal.rotation.y = j * TAU / 3;
    }
    mesh(new THREE.SphereGeometry(.035, 8, 6), glowGold, sprig, [0, .4, .03]);
  }
  seasonPreview.visible = false;
  const voyagePreview = new THREE.Group();
  voyagePreview.position.set(3, 1.25, -46);
  group.add(voyagePreview);
  const previewMaterial = new THREE.MeshBasicMaterial({ color: 0xcab9e6,
    transparent: true, opacity: .48, depthWrite: false });
  resources.add(previewMaterial);
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI / 3;
    const route = [];
    for (let j = 0; j <= 30; j++) {
      const t = j / 30 * Math.PI;
      route.push([Math.cos(t) * .68 * Math.cos(a), Math.sin(t) * .65,
        Math.cos(t) * .68 * Math.sin(a)]);
    }
    mesh(tube(route, .012, 36, 4), previewMaterial, voyagePreview);
  }
  const previewBead = mesh(new THREE.SphereGeometry(.05, 10, 6), glowGold, voyagePreview);
  voyagePreview.visible = false;

  // At the middle anchorage an old flower briefly closes while three contour
  // rings travel past it. This is a bounded memory, not another interactive mode.
  const memoryProjection = new THREE.Group();
  memoryProjection.position.set(0, .2, -32);
  group.add(memoryProjection);
  const projectionMaterial = new THREE.MeshBasicMaterial({ color: 0xc9dcef,
    transparent: true, opacity: .24, depthWrite: false, side: THREE.DoubleSide });
  projectionMaterial.forceSinglePass = true;
  resources.add(projectionMaterial);
  const projectionPetals = [];
  stem([[0, 0, 0], [-.04, .55, .02], [0, 1, 0]], projectionMaterial, memoryProjection, .016);
  for (let i = 0; i < 6; i++) {
    const pivot = new THREE.Group();
    pivot.position.y = 1;
    pivot.rotation.y = i * TAU / 6;
    memoryProjection.add(pivot);
    const petal = mesh(leafGeometry(.83, .23, .29), projectionMaterial, pivot);
    projectionPetals.push(petal);
  }
  const projectionRings = [];
  for (let i = 0; i < 3; i++) projectionRings.push(ring(.85, .009, projectionMaterial, memoryProjection, .25 + i * .5));
  memoryProjection.visible = false;

  // Seed flight is hidden until a committed ending contains 'voyage'. Previewing
  // a core allocation never emits anything or advances gameplay state.
  const flightCount = 34;
  const flyingSeeds = new THREE.InstancedMesh(new THREE.SphereGeometry(.045, 8, 6), glowGold, flightCount);
  flyingSeeds.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  flyingSeeds.visible = false;
  flyingSeeds.frustumCulled = false;
  group.add(flyingSeeds);
  const flightData = Array.from({ length: flightCount }, () => ({
    phase: rng(), angle: rng() * TAU, speed: .75 + rng() * .5, sway: rng() * .6,
  }));
  const dummy = new THREE.Object3D();

  // Sparse grass and fallen petals share geometry and draw calls. Their placement
  // is deterministic, confined to edge bands, and leaves navigation routes open.
  const grassGeo = worldPolish.bladeGeometry(1,.032,.2);
  const grass = new THREE.InstancedMesh(grassGeo, worldPolish.grassMaterial, 224);
  grass.name='opening-wild-grass';grass.customDepthMaterial=worldPolish.grassDepthMaterial;grass.receiveShadow=true;
  const petalGeo = leafGeometry(.31, .1, .018, 9, 3);
  const petalPosition = petalGeo.getAttribute('position');
  for (let i = 0; i < petalPosition.count; i++) petalPosition.setY(i, petalPosition.getY(i) * .13);
  petalGeo.computeVertexNormals();
  const fallenPetals = new THREE.InstancedMesh(petalGeo, mat(0x657b72,{roughness:.92,side:THREE.DoubleSide}), 18);
  fallenPetals.name = 'opening-waterline-petals';
  let gi = 0, pi = 0;
  for (const [cx, cz] of [[6,.1],[5.6,-2.7],[2.8,-5.6],[-2.5,-5.7],[-5.9,-1.7],[-5.7,2.4],[3.6,5.2]]) {
    let placed=0;
    for (let attempt=0;placed<32&&attempt<96;attempt++) {
      const a=rng()*TAU,r=Math.sqrt(rng())*.48;
      let x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
      const bound=Math.min(1,6.65/Math.hypot(x,z));x*=bound;z*=bound;
      if([[0,6,2.2],[-3.7,4.5,1.2],[-5,1,1.15]].some(([px,pz,radius])=>Math.hypot(x-px,z-pz)<radius))continue;
      const h=.23+rng()*.37;
      dummy.position.set(x, .055, z);
      dummy.rotation.set(-1.12-rng()*.36,rng()*TAU,rng()*.16-.08);
      dummy.scale.set(.7+rng()*.5,h,h);
      dummy.updateMatrix(); grass.setMatrixAt(gi,dummy.matrix);
      grass.setColorAt(gi++,worldPolish.grassTints[Math.floor(rng()*worldPolish.grassTints.length)]);placed++;
    }
  }
  grass.count=gi;
  for (let i = 0; i < 18; i++) {
    const backDrift = i < 11, u = backDrift ? i / 10 : (i - 11) / 6;
    const a = (backDrift ? 3.48 + u * .92 : .2 + u * .52) + (rng() - .5) * .075;
    const r = (backDrift ? 4.55 : 4.8) + Math.sin(u * Math.PI) * .35 + (rng() - .5) * .2;
    dummy.position.set(Math.cos(a) * r, -.172, Math.sin(a) * r);
    dummy.rotation.set(0, -a + .4 + rng() * .5, 0);
    dummy.scale.setScalar(.7 + rng() * .5);
    dummy.updateMatrix(); fallenPetals.setMatrixAt(pi++, dummy.matrix);
  }
  group.add(grass, fallenPetals);
  grass.instanceMatrix.needsUpdate = fallenPetals.instanceMatrix.needsUpdate = true;
  grass.computeBoundingSphere(); fallenPetals.computeBoundingSphere();

  const seasonFlowers = new THREE.Group();
  seasonFlowers.position.set(0, .06, -46);
  group.add(seasonFlowers);
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * TAU;
    const sprig = new THREE.Group();
    sprig.position.set(Math.cos(a) * (4.5 + rng() * .35), 0, Math.sin(a) * (4.5 + rng() * .35));
    seasonFlowers.add(sprig);
    const h = .25 + rng() * .35;
    stem([[0, 0, 0], [.03, h * .6, .03], [0, h, 0]], green, sprig, .014);
    for (let p = 0; p < 4; p++) {
      const petal = mesh(leafGeometry(.23, .09, .09), rose, sprig, [0, h, 0]);
      petal.rotation.y = p * TAU / 4;
    }
    mesh(new THREE.SphereGeometry(.035, 8, 6), glowGold, sprig, [0, h + .02, 0]);
  }
  seasonFlowers.visible = false;

  const water = createWater();
  group.add(water);
  const targets = [
    { id: 'hero', label: '初醒之花', x: 0, y: 2, z: 0, kind: 'flower' },
    { id: 'wind', label: '循风花杯', x: 0, y: .6, z: -16, kind: 'wind' },
    { id: 'pool', label: '归形之池', x: 0, y: 1, z: -32, kind: 'pool' },
    { id: 'finale', label: '春信花座', x: 0, y: 1, z: -46, kind: 'finale' },
    { id: 'discover-table', label: '未寄出的信', x: -3, y: .7, z: 3, kind: 'discovery' },
    { id: 'discover-leaf', label: '银叶里的旧春', x: 3, y: .25, z: -3, kind: 'discovery' },
    { id: 'discover-echo', label: '杯纹回声', x: -4, y: .65, z: -16, kind: 'discovery' },
    { id: 'discover-protocol', label: '方舟的约定', x: -5, y: .3, z: -29, kind: 'discovery' },
  ];
  // Batch static geometry in local coordinates. Progress-controlled groups and
  // independently animated objects are deliberately kept outside global batches.
  // Spatial bands preserve coarse culling instead of one map-wide megamesh.
  const removedGeometries = new Set();
  function batchStatic(root, excluded = new Set(), spatial = false) {
    group.updateMatrixWorld(true);
    const rootInverse = root.matrixWorld.clone().invert();
    const batches = new Map();
    function visit(object) {
      if (excluded.has(object)||object.userData.cameraOccluder) return;
      if (object.isMesh && !object.isInstancedMesh && !Array.isArray(object.material)) {
        const matrix = new THREE.Matrix4().multiplyMatrices(rootInverse, object.matrixWorld);
        const geometry = object.geometry.clone().applyMatrix4(matrix);
        geometry.computeBoundingSphere();
        const zone = spatial ? Math.floor((geometry.boundingSphere.center.z + 8) / 16) : 0;
        const key = `${object.material.uuid}:${zone}:${object.renderOrder}`;
        if (!batches.has(key)) batches.set(key, { material: object.material,
          geometry: [], objects: [], order: object.renderOrder, cast: false });
        const batch = batches.get(key);
        batch.geometry.push(geometry);
        batch.objects.push(object);
        batch.cast ||= object.castShadow;
      }
      for (const child of [...object.children]) visit(child);
    }
    for (const child of [...root.children]) visit(child);
    for (const batch of batches.values()) {
      let geometries = batch.geometry;
      if (geometries.some(g => !g.index) && geometries.some(g => g.index)) {
        geometries = geometries.map(g => {
          if (!g.index) return g;
          const plain = g.toNonIndexed(); g.dispose(); return plain;
        });
      }
      const merged = mergeGeometries(geometries, false);
      for (const geometry of geometries) geometry.dispose();
      if (!merged) continue;
      merged.computeBoundingSphere();
      const item = mesh(merged, batch.material, root);
      item.name = 'static-material-batch';
      item.renderOrder = batch.order;
      item.castShadow = batch.cast;
      for (const object of batch.objects) {
        removedGeometries.add(object.geometry);
        object.removeFromParent();
      }
    }
  }
  const pathGroups = [p1Path, windPath, sidePath, bridgeAM, bridgeMF, shieldRM, finalPath, bridgeTraces];
  for (const root of [...pathGroups, playerBody, memoryArcs, seasonPreview, seasonFlowers]) batchStatic(root);
  for (const item of Object.values(finalVessels)) batchStatic(item.petals);
  const dynamic = new Set([
    ...pathGroups, player, companion, windLight, sourceHalo, goalHalo,
    ...moving.map(item => item.object), ...awakeningRings,
    ...Object.values(finalVessels).flatMap(item => [item.petals, item.halo, item.center]),
    memoryArcs, seasonPreview, seasonFlowers, voyagePreview, memoryProjection,
    flyingSeeds, water, grass, fallenPetals, ...worldPolish.dynamic,
  ]);
  batchStatic(group, dynamic, true);
  const remainingGeometries = new Set();
  group.traverse(object => { if (object.geometry) remainingGeometries.add(object.geometry); });
  for (const geometry of removedGeometries) if (!remainingGeometries.has(geometry)) geometry.dispose();
  group.userData.staticBatches = true;

  const followTarget = new THREE.Vector3();
  let currentTime = 0, disposed = false, lastEnding = null, endingStart = 0;
  let lastP1 = false, p1SolvedAt = -100, lastWind = false, windSolvedAt = -100;
  let lastStructure = 'none', projectionStarted = -100, projectionArmed = true;

  function update(time = 0, dt = 0, state = {}) {
    if (disposed) return;
    currentTime = Number.isFinite(time) ? time : currentTime;
    const d = clamp(Number.isFinite(dt) ? dt : 0, 0, .1);
    const reducedMotion = state.settings?.reducedMotion === true;
    worldPolish.update(currentTime, reducedMotion, state.settings?.quality);
    const motion = reducedMotion ? .2 : 1;
    const t = currentTime * motion;
    p1Path.visible = !!state.p1?.solved;
    windPath.visible = sidePath.visible = !!state.wind?.solved;
    bridgeAM.visible = state.bridge?.structure === 'bridge_am';
    bridgeMF.visible = state.bridge?.structure === 'bridge_mf';
    shieldRM.visible = state.bridge?.structure === 'shield_rm';
    bridgeTraces.visible = !!state.wind?.solved;
    finalPath.visible = !!state.bridge?.solved;
    if (state.p1?.solved && !lastP1) p1SolvedAt = currentTime;
    lastP1 = !!state.p1?.solved;
    for (let i = 0; i < awakeningRings.length; i++) {
      const age = currentTime - p1SolvedAt - i * .68;
      const pulse = awakeningRings[i];
      pulse.visible = age >= 0 && age < 2.3;
      pulse.material.opacity = pulse.visible ? Math.sin(Math.min(1, age / 2.3) * Math.PI) * .68 : 0;
      pulse.scale.setScalar(1 + Math.max(0, age) * .18);
    }
    if (state.wind?.solved && !lastWind) windSolvedAt = currentTime;
    lastWind = !!state.wind?.solved;
    const structure = state.bridge?.structure || 'none';
    if (structure !== lastStructure) {
      for (const reveal of bridgeReveals) if (reveal.path.visible) reveal.start = currentTime;
      lastStructure = structure;
    }
    for (const reveal of bridgeReveals) {
      const progress = THREE.MathUtils.smoothstep(currentTime - reveal.start, 0, .7);
      for (const material of reveal.materials) material.opacity = .22 + progress * .78;
    }
    water.material.uniforms.uTime.value = currentTime;
    // The controller may also set this uniform directly for a smooth transition.
    if (typeof state.night === 'boolean' || typeof state.night === 'number') {
      const next = Number(state.night);
      water.material.uniforms.uNight.value += (next - water.material.uniforms.uNight.value) * (1 - Math.exp(-d * 3));
    }
    const windX = Number.isFinite(state.wind?.x) ? state.wind.x : -3;
    const windZ = Number.isFinite(state.wind?.z) ? state.wind.z : 2;
    windLight.position.set(windX, .72 + Math.sin(t * 1.9) * .045, windZ - 16);
    windOrbit.rotation.y = t * .5;
    lightShell.rotation.y = -t * .3;
    lightCore.scale.setScalar(1 + Math.sin(t * 2.1) * .07);
    goalHalo.scale.setScalar(state.wind?.solved ? 1.12 : 1);
    sourceHalo.visible = !state.wind?.solved;
    playerBody.rotation.y = t * .18;
    seedCore.position.y = .28 + Math.sin(t * 2) * .025;
    seedRing.rotation.z = Math.sin(t * .8) * .12;
    groundHalo.scale.setScalar(1 + Math.sin(t * 2) * .07);
    const awake = !!state.companion?.awakened;
    const radius = awake ? .65 : 1.35;
    followTarget.set(player.position.x + Math.cos(t * .35) * radius,
      player.position.y + (awake ? .9 : 1.3) + Math.sin(t * 1.5) * .11,
      player.position.z + Math.sin(t * .35) * radius + .35);
    companion.position.lerp(followTarget, 1 - Math.exp(-d * (awake ? 3 : 1.2)));
    companionBody.rotation.y = -t * .3;
    companionBody.rotation.z = Math.sin(t * 1.2) * .12;
    for (let i = 0; i < companionPetals.length; i++) {
      companionPetals[i].rotation.x = -.1 + Math.sin(t * 3.3 + i * .3) * .16;
    }
    // Three quiet pulses at the cup; the companion answers on the fourth beat.
    const replyAge = currentTime - windSolvedAt;
    if (replyAge >= 0 && replyAge < 2.72) {
      const beat = Math.floor(replyAge / .68);
      const pulse = Math.sin(replyAge % .68 / .68 * Math.PI);
      if (beat < 3) lightCore.scale.setScalar(1 + pulse * .55);
      companionCore.scale.setScalar(beat === 3 ? 1 + pulse * 1.25 : 1);
    } else companionCore.scale.setScalar(1);
    const farewellAge=currentTime-companionReplyAt;if(farewellAge>=0&&farewellAge<1.4)companionCore.scale.setScalar(1+Math.sin(farewellAge/1.4*Math.PI)*2);
    const poolDistance = Math.hypot(player.position.x, player.position.z + 32);
    if (poolDistance > 2.6) projectionArmed = true;
    if (poolDistance < 1.5 && projectionArmed && state.wind?.solved) {
      projectionStarted = currentTime;
      projectionArmed = false;
    }
    const projectionAge = currentTime - projectionStarted;
    memoryProjection.visible = projectionAge >= 0 && projectionAge < 7.5;
    if (memoryProjection.visible) {
      projectionMaterial.opacity = .29 * Math.min(1, projectionAge * 1.4)
        * Math.min(1, (7.5 - projectionAge) * 1.4);
      const closure = THREE.MathUtils.smoothstep(projectionAge, 1.3, 5.8);
      for (const petal of projectionPetals) petal.rotation.x = -.18 - closure * 1.03;
      for (let i = 0; i < projectionRings.length; i++) {
        projectionRings[i].position.y = ((projectionAge * .23 + i * .52) % 1.7);
        projectionRings[i].scale.setScalar(.85 + Math.sin(projectionAge * .4 + i) * .1);
      }
    }
    for (const entry of moving) {
      if (entry.kind === 'drape') entry.object.rotation.y = entry.base + Math.sin(t * .33) * .013;
      else entry.object.position.y = entry.base + Math.sin(t * 1.4 + entry.phase) * .045;
    }
    for (const { material, base } of glowMaterials) material.emissiveIntensity = base * (1 + Math.sin(t * .85) * .1);
    const cores = Array.isArray(state.cores) ? state.cores : [];
    for (const [purpose, item] of Object.entries(finalVessels)) {
      const active = cores.includes(purpose);
      const s = active ? 1 : .32;
      item.petals.scale.lerp(followTarget.set(s, s, s), 1 - Math.exp(-d * 5));
      item.center.visible = active;
      item.halo.visible = active;
      item.halo.rotation.y = t * .15;
    }
    const ending = typeof state.ending === 'string' ? state.ending : null;
    if (ending !== lastEnding) { lastEnding = ending; endingStart = currentTime; }
    // Preview can bloom the selected flower, but the world's final response is
    // only revealed after committing the letter.
    seasonPreview.visible = cores.includes('season');
    seasonFlowers.visible = !!ending?.includes('season');
    memoryArcs.visible = cores.includes('memory') || !!ending?.includes('memory');
    memoryArcs.scale.setScalar(ending?.includes('memory') ? 1.25 : .67);
    memoryArcs.rotation.y = t * .07;
    voyagePreview.visible = cores.includes('voyage') && !ending;
    const previewPhase = t * .8 % Math.PI;
    previewBead.position.set(Math.cos(previewPhase) * .68, Math.sin(previewPhase) * .65, 0);
    flyingSeeds.visible = !!ending?.includes('voyage');
    if (flyingSeeds.visible) {
      const elapsed = Math.max(0, currentTime - endingStart) * motion;
      for (let i = 0; i < flightCount; i++) {
        const f = flightData[i];
        const age = (elapsed * f.speed + f.phase * 9) % 12;
        const distance = age * .22;
        dummy.position.set(3 + Math.cos(f.angle + age * .22) * distance,
          1.1 + age * .7, -46 - age * .65 + Math.sin(f.angle) * distance);
        dummy.rotation.set(age, f.angle, .4);
        const size = Math.min(1, age * 2) * Math.min(1, (12 - age) * .6);
        dummy.scale.set(size, size * 1.6, size);
        dummy.updateMatrix(); flyingSeeds.setMatrixAt(i, dummy.matrix);
      }
      flyingSeeds.instanceMatrix.needsUpdate = true;
    }
  }

  function ripple(x, z, strength = 1) {
    if (disposed || !Number.isFinite(x + z + strength)) return;
    const i = water.userData.waveIndex;
    water.material.uniforms.uWaves.value[i].set(x, z, currentTime, clamp(strength, 0, 2));
    water.userData.waveIndex = (i + 1) % 8;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    const geometries = new Set(), materials = new Set(resources), textures = new Set();
    group.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    });
    for (const material of materials) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    }
    for (const geometry of geometries) geometry.dispose();
    for (const texture of textures) texture.dispose();
    group.removeFromParent();
    group.clear();
  }

  update(0, 0, {});
  function setStoneTextures(normal,roughness){for(const material of [pearl,groundMat,archMat,edgeMat,underMat,...worldPolish.stoneMaterials,...cameraOccluders.map(o=>o.material)]){material.normalMap=normal;material.normalScale.set(.12,.12);material.roughnessMap=roughness;material.needsUpdate=true;}}
  return { respond(){companionReplyAt=currentTime;}, cameraOccluders, group, flowers: [], targets, water, player, companion, update, ripple, dispose, setStoneTextures };
}
