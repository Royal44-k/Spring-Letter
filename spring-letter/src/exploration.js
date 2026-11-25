import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EXPLORATION_ANCHORS, SEED_START, SEED_GATES, ECHO_SITES, createExplorationState, stepExploration, explorationContext } from './exploration-model.js';

const TAU = Math.PI * 2;
const finite = (n, fallback = 0) => Number.isFinite(n) ? n : fallback;
const clamp = (n, a, b) => Math.max(a, Math.min(b, finite(n, a)));

function petalGeometry() {
  const vertices = [], indices = [], uv = [];
  const rows = 10, cols = 6;
  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    for (let c = 0; c <= cols; c++) {
      const u = c / cols * 2 - 1;
      const width = Math.pow(Math.sin(v * Math.PI), .7) * .32;
      vertices.push(u * width, Math.sin(v * Math.PI * .8) * .12 + u * u * v * .09, v);
      uv.push((u + 1) / 2, v);
      if (r < rows && c < cols) {
        const p = r * (cols + 1) + c;
        indices.push(p, p + cols + 1, p + 1, p + 1, p + cols + 1, p + cols + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function softTexture() {
  const size = 32, pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x / (size - 1) * 2 - 1, y / (size - 1) * 2 - 1);
    const i = (y * size + x) * 4;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
    pixels[i + 3] = Math.round(Math.pow(Math.max(0, 1 - d), 2) * 255);
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

/** Garden props and feedback. The pure simulation owns every gameplay decision. */
export function createExploration({ anchors = EXPLORATION_ANCHORS } = {}) {
  const group = new THREE.Group();
  group.name = 'three-lost-spring-gardens';
  const targets = Object.fromEntries(Object.entries(anchors).map(([key, a]) => [key, { ...a, radius: 2.1, y: a.y ?? a.height ?? 0 }]));
  const normalized = Object.fromEntries(Object.entries(targets).map(([key, a]) => [key, a]));
  const texture = softTexture();
  const ivory = new THREE.Color('#f5dbbd'), blue = new THREE.Color('#81bdcf'), rose = new THREE.Color('#f2aa9e'), dim = new THREE.Color('#a3a5bc');
  const stone = new THREE.MeshStandardMaterial({ color: '#746e81', roughness: .7, metalness: .12 });
  const brass = new THREE.MeshStandardMaterial({ color: '#c2a282', roughness: .44, metalness: .6 });
  const petalMaterial = new THREE.MeshPhysicalMaterial({ color: '#f2d8c5', roughness: .28, metalness: .05, side: THREE.DoubleSide, clearcoat: .6, iridescence: .3, transparent: true, opacity: .95 });
  const luminous = new THREE.MeshStandardMaterial({ color: '#d3d6ee', emissive: '#b6b9f2', emissiveIntensity: 1.4, roughness: .25 });
  const darkGlass = new THREE.MeshPhysicalMaterial({ color: '#1c3457', roughness: .2, metalness: .55, clearcoat: 1 });
  const guideMaterial = new THREE.PointsMaterial({ color: '#edcda8', size: .075, map: texture, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending });
  const flowerGeometry = petalGeometry();
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  let disposed = false;
  let lastTime = 0;
  let currentState = createExplorationState();
  let currentSignals = [];
  let context = explorationContext(currentState);
  const rainOpen = new Float32Array(12).fill(.18);
  const echoOpen = new Float32Array(3).fill(.2);
  let nestOpen = .35;
  const gardens = {};
  const ownedExtras = new Set([texture, guideMaterial]);

  function mesh(parent, name, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
    const object = new THREE.Mesh(geometry, material);
    object.name = name; object.position.set(...position); object.rotation.set(...rotation);
    parent.add(object); return object;
  }
  function batch(parent, name, parts, material) {
    const transformed = parts.map(({ geometry, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
      if (geometry.index) { const indexed = geometry; geometry = geometry.toNonIndexed(); indexed.dispose(); }
      dummy.position.set(...position); dummy.rotation.set(...rotation); dummy.scale.setScalar(1); dummy.updateMatrix();
      geometry.applyMatrix4(dummy.matrix); return geometry;
    });
    const geometry = mergeGeometries(transformed, false);
    transformed.forEach(g => g.dispose());
    return mesh(parent, name, geometry, material);
  }
  function ringGeometry(radius, thickness = .012, arc = TAU) { return new THREE.TorusGeometry(radius, thickness, 5, 48, arc); }
  function points(parent, name, positions, material = guideMaterial) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const object = new THREE.Points(geometry, material); object.name = name; parent.add(object); return object;
  }
  function flowerBatch(parent, name, count) {
    const flowers = new THREE.InstancedMesh(flowerGeometry, petalMaterial, count * 5);
    flowers.name = name; flowers.instanceMatrix.setUsage(THREE.DynamicDrawUsage); flowers.frustumCulled = false;
    parent.add(flowers); return flowers;
  }
  function putFlower(batch, flower, x, y, z, size, aperture, tint, rotation = 0) {
    for (let petal = 0; petal < 5; petal++) {
      dummy.position.set(x, y, z);
      dummy.rotation.set((1 - aperture) * -1.2, petal * TAU / 5 + rotation, 0, 'YXZ');
      dummy.scale.set(size * .95, size, size); dummy.updateMatrix();
      batch.setMatrixAt(flower * 5 + petal, dummy.matrix);
      batch.setColorAt(flower * 5 + petal, tint);
    }
  }
  function finishFlowers(batch) { batch.instanceMatrix.needsUpdate = true; if (batch.instanceColor) batch.instanceColor.needsUpdate = true; }

  for (const [key, a] of Object.entries(normalized)) {
    const site = new THREE.Group(); site.name = `${a.id}-interaction`; site.position.set(a.x, a.y, a.z); group.add(site);
    gardens[key] = { site, awake: 0 };
    const outline = mesh(site, `${key}-garden-rim`, ringGeometry(1.83, .016), brass, [0, .035, 0], [-Math.PI / 2, 0, 0]);
    outline.material = brass;
    // Only seed guidance needs a safety boundary. A second, larger circle in
    // the rain garden would invite tracing the wrong ring; echoes need no arena.
    outline.visible = key === 'wind';
    const motes = [];
    for (let i = 0; i < 48; i++) {
      const theta = i * 2.39996, radius = .5 + Math.sqrt(i / 48) * 1.1;
      motes.push(Math.cos(theta) * radius, .2 + (i % 7) * .11, Math.sin(theta) * radius);
    }
    const motesMaterial = guideMaterial.clone(); motesMaterial.color.copy(key === 'rain' ? rose : key === 'wind' ? ivory : blue);
    gardens[key].motes = points(site, `${key}-reward-motes`, motes, motesMaterial);
    gardens[key].motes.visible = false;
    const reward = flowerBatch(site, `${key}-reward-bloom`, 18);
    reward.visible = false;
    gardens[key].reward = reward;
  }

  const rainSite = gardens.rain.site;
  const stalks = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i + .5) / 12 * TAU;
    const x = Math.cos(angle) * 1.28, z = Math.sin(angle) * 1.28;
    stalks.push({ geometry: new THREE.CylinderGeometry(.008, .015, .35, 5), position: [x, .175, z], rotation: [.08 * Math.cos(angle), 0, -.1 * Math.sin(angle)] });
  }
  batch(rainSite, 'rain-twelve-letter-stems', stalks, brass);
  gardens.rain.petals = flowerBatch(rainSite, 'rain-trace-petals', 12);
  const ringPositions = [];
  for (let i = 0; i < 120; i++) { const a = i / 120 * TAU; ringPositions.push(Math.cos(a) * 1.28, .36, Math.sin(a) * 1.28); }
  gardens.rain.trace = points(rainSite, 'rain-trace-guide', ringPositions, guideMaterial.clone());
  const center = mesh(rainSite, 'rain-empty-envelope', new THREE.OctahedronGeometry(.14, 0), luminous, [0, .42, 0], [0, Math.PI / 4, Math.PI / 4]);
  gardens.rain.center = center;

  const windSite = gardens.wind.site;
  const stones = [
    { geometry: new THREE.DodecahedronGeometry(.37, 0), position: [0, .18, 0], rotation: [0, .4, .3] },
    { geometry: new THREE.CylinderGeometry(.34, .42, .06, 24), position: [SEED_START.x, .035, SEED_START.z] },
  ];
  batch(windSite, 'wind-eddy-and-postmark', stones, stone);
  const eddy = mesh(windSite, 'wind-eddy', ringGeometry(.47, .018, TAU * .8), darkGlass, [0, .31, 0], [-Math.PI / 2, .1, 0]);
  gardens.wind.eddy = eddy;
  gardens.wind.seed = mesh(windSite, 'wind-living-seed', new THREE.IcosahedronGeometry(.14, 1), luminous.clone(), [SEED_START.x, .31, SEED_START.z]);
  gardens.wind.seed.scale.set(.8, 1.4, .8);
  const seedHaloMaterial = new THREE.PointsMaterial({ color: '#fff0c9', size: .5, map: texture, transparent: true, opacity: .85, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  gardens.wind.halo = points(windSite, 'wind-seed-halo', [0, 0, 0], seedHaloMaterial);
  gardens.wind.halo.renderOrder = 3;
  gardens.wind.history = Array.from({ length: 28 }, () => ({ x: SEED_START.x, z: SEED_START.z }));
  const seedTrailMaterial = new THREE.PointsMaterial({ color: '#fce5a9', size: .07, map: texture, transparent: true, opacity: .7, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
  gardens.wind.trail = points(windSite, 'wind-seed-wake', new Array(28 * 3).fill(0), seedTrailMaterial);
  gardens.wind.trail.frustumCulled = false;
  const seedTrailColors = [];
  for (let i = 0; i < 28; i++) { const brightness = Math.pow(1 - i / 28, .8); seedTrailColors.push(brightness, brightness, brightness); }
  gardens.wind.trail.geometry.setAttribute('color', new THREE.Float32BufferAttribute(seedTrailColors, 3));
  gardens.wind.gates = SEED_GATES.map((gate, i) => {
    const mat = brass.clone();
    return mesh(windSite, `wind-gate-${i + 1}`, ringGeometry(.43, .024, Math.PI), mat, [gate.x, .1, gate.z], [0, i * .7 + .4, 0]);
  });
  const curve = new THREE.CatmullRomCurve3([SEED_START, ...SEED_GATES].map(p => new THREE.Vector3(p.x, .075, p.z)));
  gardens.wind.path = points(windSite, 'wind-current-path', curve.getPoints(60).flatMap(p => p.toArray()), guideMaterial.clone());
  gardens.wind.nest = flowerBatch(windSite, 'wind-receiving-flower', 1);
  gardens.wind.pointer = mesh(windSite, 'wind-next-gate', new THREE.OctahedronGeometry(.06), luminous.clone(), [SEED_GATES[0].x, .7, SEED_GATES[0].z]);
  const tetherGeometry = new THREE.BufferGeometry();
  tetherGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(27), 3));
  gardens.wind.tether = new THREE.Line(tetherGeometry, new THREE.LineBasicMaterial({color:'#f5ddb5',transparent:true,opacity:.65,depthWrite:false}));
  gardens.wind.tether.name = 'wind-held-connection'; gardens.wind.tether.frustumCulled = false; windSite.add(gardens.wind.tether);
  gardens.wind.catchRing = mesh(windSite, 'wind-release-catch', ringGeometry(.7,.013), guideMaterial.clone(), [SEED_GATES[2].x,.07,SEED_GATES[2].z],[-Math.PI/2,0,0]);


  const tideSite = gardens.tide.site;
  const chimes = [];
  ECHO_SITES.forEach((p, i) => {
    chimes.push({ geometry: new THREE.CylinderGeometry(.012, .018, .65 + i * .08, 6), position: [p.x, .32 + i * .04, p.z], rotation: [0, 0, (i - 1) * .1] });
    chimes.push({ geometry: ringGeometry(.22, .016), position: [p.x, .66 + i * .08, p.z], rotation: [-Math.PI / 2, 0, 0] });
  });
  batch(tideSite, 'tide-letter-chimes', chimes, brass);
  gardens.tide.petals = flowerBatch(tideSite, 'tide-echo-flowers', 3);
  gardens.tide.ripples = ECHO_SITES.map((p, i) => {
    const material = new THREE.MeshBasicMaterial({ color: '#9bd0d9', transparent: true, opacity: .4, depthWrite: false, blending: THREE.AdditiveBlending });
    return mesh(tideSite, `tide-echo-ripple-${i}`, ringGeometry(.35, .009), material, [p.x, .05, p.z], [-Math.PI / 2, 0, 0]);
  });

  function update(time, delta, input = {}) {
    if (disposed) return [];
    time = finite(time, lastTime); lastTime = time;
    const dt = clamp(delta, 0, .05);
    const source = input.exploration || currentState;
    const result = stepExploration(source, { ...input, time }, dt, normalized);
    currentState = result.state;
    if (input.exploration) Object.assign(input.exploration, currentState);
    currentSignals = result.signals; context = result.context;
    const calm = input.reducedMotion ? .15 : 1;
    const bloomEase = input.reducedMotion || dt === 0 ? 1 : 1 - Math.exp(-dt * 7);
    const gardenEase = input.reducedMotion || dt === 0 ? 1 : 1 - Math.exp(-dt * 3.5);
    for (const key of ['rain', 'wind', 'tide']) {
      const garden = gardens[key], state = currentState[key];
      garden.awake += ((state.done ? 1 : 0) - garden.awake) * gardenEase;
      const accessible = key === 'rain' || (key === 'wind' ? input.progress?.p1?.solved : input.progress?.wind?.solved);
      garden.site.visible = !!accessible;
      garden.motes.visible = state.done;
      garden.motes.rotation.y = time * .08 * calm;
      garden.motes.position.y = Math.sin(time * .4) * .06 * calm;
      garden.motes.material.opacity = .3 + state.flash * .45;
      garden.reward.visible = state.done;
      if (state.done) {
        for (let i = 0; i < 18; i++) {
          const angle = i / 18 * TAU, radius = 1.63 + Math.sin(i * 6.4) * .12;
          let x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
          if (key === 'wind') {
            // The seed's journey remains drawn in living flowers after delivery.
            const p = curve.getPoint(i / 17);
            x = p.x + Math.sin(i * 2.4) * .2; z = p.z + Math.cos(i * 2.4) * .2;
          } else if (key === 'tide') {
            const source = ECHO_SITES[Math.floor(i / 6)];
            x = source.x + Math.cos(i / 6 * TAU) * .43;
            z = source.z + Math.sin(i / 6 * TAU) * .43;
          }
          const growth = .05 + .95 * garden.awake;
          putFlower(garden.reward, i, x, .09 + Math.sin(time * .5 + i) * .018 * calm, z, (.2 + (i % 3) * .025) * growth, .15 + .75 * garden.awake, key === 'tide' ? blue : i % 2 ? ivory : rose, angle);
        }
        finishFlowers(garden.reward);
      }
    }
    const r = currentState.rain;
    for (let i = 0; i < 12; i++) {
      const theta = (i + .5) / 12 * TAU;
      const lit = !!(r.mask & (1 << i));
      color.copy(lit ? ivory : r.done ? rose : dim);
      const openness = lit ? .95 : r.done ? .7 : .18;
      rainOpen[i] += (openness - rainOpen[i]) * bloomEase;
      putFlower(gardens.rain.petals, i, Math.cos(theta) * 1.28, .36 + Math.sin(time * .8 + i) * .022 * calm, Math.sin(theta) * 1.28, .31, rainOpen[i], color, theta);
    }
    finishFlowers(gardens.rain.petals);
    gardens.rain.trace.material.opacity = context.key === 'rain' ? .6 : .25;
    gardens.rain.center.rotation.y = time * .3 * calm;
    gardens.rain.center.position.y = .42 + Math.sin(time) * .035 * calm;
    gardens.rain.center.scale.setScalar(1 + r.flash * .6);
    const w = currentState.wind;
    gardens.wind.seed.position.set(w.seed.x, .31 + Math.sin(time * 2.4) * .024 * calm, w.seed.z);
    gardens.wind.halo.position.copy(gardens.wind.seed.position);
    gardens.wind.halo.material.opacity = .6 + Math.sin(time * 2.4) * .12 * calm + w.flash * .2;
    if (dt > 0) { gardens.wind.history.pop(); gardens.wind.history.unshift({ x: w.seed.x, z: w.seed.z }); }
    const wake = gardens.wind.trail.geometry.getAttribute('position');
    gardens.wind.history.forEach((p, i) => wake.setXYZ(i, p.x, .3, p.z));
    wake.needsUpdate = true;
    gardens.wind.trail.visible = !input.reducedMotion;
    gardens.wind.seed.rotation.y = time * .9 * calm;
    const pen = input.gesture?.position, anchor = targets.wind;
    const penX = pen ? pen.x - anchor.x : 0, penZ = pen ? pen.z - anchor.z : 0;
    const tetherVisible = input.interactive !== false && input.gesture?.active && pen && w.hold < 1 && Math.hypot(penX-w.seed.x,penZ-w.seed.z)<2.65 && Math.hypot((input.player?.x??99)-anchor.x,(input.player?.z??99)-anchor.z)<4.1;
    gardens.wind.tether.visible = !!tetherVisible;
    if(tetherVisible){const position=gardens.wind.tether.geometry.getAttribute('position');for(let i=0;i<9;i++){const u=i/8;position.setXYZ(i,w.seed.x+(penX-w.seed.x)*u,.32+Math.sin(u*Math.PI)*.13,w.seed.z+(penZ-w.seed.z)*u);}position.needsUpdate=true;}
    gardens.wind.catchRing.visible=w.stage===3&&w.hold<1;
    gardens.wind.catchRing.material.opacity=.4+Math.sin(time*2)*.1*calm;

    gardens.wind.seed.material.emissiveIntensity = w.hold >= 1 ? 2.2 : 1.4;
    gardens.wind.eddy.rotation.z = time * .45 * calm;
    gardens.wind.gates.forEach((gate, i) => {
      gate.material.color.copy(i < w.stage ? blue : i === w.stage ? ivory : dim);
      gate.material.emissive.copy(i < w.stage ? blue : i === w.stage ? ivory : dim);
      gate.material.emissiveIntensity = i === w.stage ? .55 + .15 * Math.sin(time * 2) * calm : i < w.stage ? .3 : .04;
    });
    gardens.wind.pointer.visible = w.stage < 3;
    if (w.stage < 3) gardens.wind.pointer.position.set(SEED_GATES[w.stage].x, .63 + Math.sin(time * 2) * .06 * calm, SEED_GATES[w.stage].z);
    gardens.wind.pointer.rotation.y = time * calm;
    nestOpen += ((w.hold >= 1 ? 1 : .35) - nestOpen) * bloomEase;
    putFlower(gardens.wind.nest, 0, SEED_GATES[2].x, .06, SEED_GATES[2].z, .44, nestOpen, w.done ? ivory : blue);
    finishFlowers(gardens.wind.nest);
    const e = currentState.tide;
    ECHO_SITES.forEach((site, i) => {
      const active = e.index === i;
      const heard = i < e.index;
      const aperture = heard ? 1 : active ? .72 + Math.sin(time) * .08 * calm : .2;
      echoOpen[i] += (aperture - echoOpen[i]) * bloomEase;
      putFlower(gardens.tide.petals, i, site.x, .65 + i * .08, site.z, .31, echoOpen[i], heard ? ivory : active ? blue : dim, i * 1.7);
      const ripple = gardens.tide.ripples[i];
      const phase = (time * .6 + i * .21) % 1;
      ripple.visible = active || e.done;
      ripple.scale.setScalar(input.reducedMotion ? 1.6 : .8 + phase * 2.8);
      ripple.material.opacity = input.reducedMotion ? (active ? .55 : .16) : active ? (1 - phase) * (.4 + e.hold * .3) : .12;
    });
    finishFlowers(gardens.tide.petals);
    group.updateMatrixWorld(true);
    return currentSignals;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    const resources = new Set(ownedExtras);
    group.traverse(object => {
      if (object.geometry) resources.add(object.geometry);
      for (const material of object.material ? [object.material].flat() : []) {
        resources.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
      }
    });
    resources.forEach(resource => resource.dispose());
    group.clear();
  }

  // Seed matrices before the first render, including offscreen/locked gardens.
  update(0, 0, { interactive: false });
  return { group, targets, update, dispose, get signals() { return currentSignals; }, get context() { return context; }, get state() { return currentState; } };
}
