import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const ANCHORS = Object.freeze({
  rhythm: Object.freeze({ x: -3.7, z: 1.9 }),
  light: Object.freeze({ x: -3.8, z: -17.5 }),
  memory: Object.freeze({ x: -5, z: -29 }),
});
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const saturate = value => THREE.MathUtils.clamp(finite(value), 0, 1);

// Every texture, shape and soundless visual cue here is procedural and original.
// This layer consumes a state snapshot; it never owns quest or navigation state.
export function createCinematicLayer() {
  const group = new THREE.Group();
  group.name = 'cinematic-story-layer';
  group.userData.anchors = ANCHORS;
  const branchTargets = {
    rhythm: { x: ANCHORS.rhythm.x, y: .94, z: ANCHORS.rhythm.z },
    light: [-.34, 0, .34].map(x => ({ x: ANCHORS.light.x + x, y: 1.109, z: ANCHORS.light.z + .33 })),
    memory: { x: ANCHORS.memory.x + .035, y: 1, z: ANCHORS.memory.z - .66 },
  };
  const stationary = new THREE.Group();
  group.add(stationary);
  let disposed = false;
  let lastTime = 0;

  const grainData = new Uint8Array(64 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const wave = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    const noise = wave - Math.floor(wave);
    const tone = Math.round(136 + noise * 50 + 12 * Math.sin(x * .7 + Math.sin(y * .11)));
    const i = (y * 64 + x) * 4;
    grainData[i] = grainData[i + 1] = grainData[i + 2] = tone;
    grainData[i + 3] = 255;
  }
  const grain = new THREE.DataTexture(grainData, 64, 64, THREE.RGBAFormat);
  grain.name = 'original-silt-and-paper-grain';
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.magFilter = grain.minFilter = THREE.LinearFilter;
  grain.needsUpdate = true;

  const stone = new THREE.MeshStandardMaterial({ color: 0xb5aab7, roughness: .86, bumpMap: grain, bumpScale: .035 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x938379, metalness: .62, roughness: .42 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xe6d9c9, roughness: .8, side: THREE.DoubleSide, bumpMap: grain, bumpScale: .012 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x646b7c, roughness: .72, metalness: .15 });
  const porcelain = new THREE.MeshPhysicalMaterial({ color: 0xc6c2d7, roughness: .26, metalness: .12, clearcoat: .65, iridescence: .35, iridescenceIOR: 1.3 });
  const newGreen = new THREE.MeshStandardMaterial({ color: 0x8dafa2, roughness: .5, side: THREE.DoubleSide });

  function mesh(geometry, material, parent, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.scale.set(...scale);
    object.castShadow = false;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent, material, size, position, rotation) {
    return mesh(new THREE.BoxGeometry(...size), material, parent, position, rotation);
  }
  function tube(parent, material, points, radius = .025, segments = 20) {
    return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, 5, false), material, parent);
  }
  function ring(parent, material, radius, thickness, position, rotation = [-Math.PI / 2, 0, 0]) {
    return mesh(new THREE.TorusGeometry(radius, thickness, 5, 32), material, parent, position, rotation);
  }
  function cylinder(parent, material, r1, r2, height, position) {
    return mesh(new THREE.CylinderGeometry(r1, r2, height, 20), material, parent, position);
  }
  function cup(parent, position, material = porcelain) {
    const shape = [[.07, 0], [.09, .015], [.1, .04], [.12, .17], [.115, .18], [.097, .17], [.079, .04], [.065, .035]];
    mesh(new THREE.LatheGeometry(shape.map(([x, y]) => new THREE.Vector2(x, y)), 18), material, parent, position);
    cylinder(parent, bronze, .077, .077, .006, [position[0], position[1] + .08, position[2]]);
    ring(parent, material, .15, .009, [position[0], position[1] + .004, position[2]]);
  }
  function foldedLetter(parent, width, depth, position, rotation = [0, 0, 0]) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
      -width / 2, 0, -depth / 2, 0, .065, -depth / 2, -width / 2, 0, depth / 2,
      -width / 2, 0, depth / 2, 0, .065, -depth / 2, 0, .065, depth / 2,
      0, .065, -depth / 2, width / 2, .01, -depth / 2, 0, .065, depth / 2,
      0, .065, depth / 2, width / 2, .01, -depth / 2, width / 2, .01, depth / 2,
    ], 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, .5, 0, 0, 1, 0, 1, .5, 0, .5, 1, .5, 0, 1, 0, .5, 1, .5, 1, 1, 0, 1, 1], 2));
    geometry.computeVertexNormals();
    return mesh(geometry, paper, parent, position, rotation);
  }
  function leaf(parent, material, position, scale, rotation = [0, 0, 0]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.bezierCurveTo(-.24, .28, -.2, .75, 0, 1);
    shape.bezierCurveTo(.2, .75, .24, .28, 0, 0);
    return mesh(new THREE.ShapeGeometry(shape, 12), material, parent, position, rotation, scale);
  }

  // Combine by material within a visibility boundary, including original UVs.
  function batch(parent, prefix) {
    parent.updateMatrixWorld(true);
    const inverse = parent.matrixWorld.clone().invert();
    const sets = new Map();
    const originals = [];
    parent.traverse(object => {
      if (!object.isMesh) return;
      let geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld));
      if (!geometry.getAttribute('uv')) geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geometry.getAttribute('position').count * 2), 2));
      if (!sets.has(object.material)) sets.set(object.material, []);
      sets.get(object.material).push(geometry);
      originals.push(object);
    });
    for (const object of originals) { object.removeFromParent(); object.geometry.dispose(); }
    let i = 0;
    for (const [material, geometries] of sets) {
      const combined = mergeGeometries(geometries, false);
      for (const geometry of geometries) geometry.dispose();
      if (!combined) throw new Error(`Cannot batch cinematic geometry: ${prefix}`);
      const object = mesh(combined, material, parent);
      object.name = `${prefix}-${i++}`;
    }
  }

  // A place was deliberately left at the table. Its absence is readable before
  // the rhythm quest is completed; the third cup is the consequence, not an icon.
  const table = new THREE.Group();
  table.position.set(ANCHORS.rhythm.x, .12, ANCHORS.rhythm.z);
  stationary.add(table);
  cylinder(table, stone, .68, .65, .085, [0, .62, 0]);
  cylinder(table, stone, .13, .21, .58, [0, .29, 0]);
  cylinder(table, stone, .37, .4, .075, [0, .035, 0]);
  ring(table, bronze, .62, .009, [0, .668, 0]);
  cup(table, [-.28, .67, -.17]);
  cup(table, [.27, .67, -.16]);
  ring(table, bronze, .15, .006, [.04, .671, .34]);
  foldedLetter(table, .24, .17, [-.2, .676, .25], [0, -.3, 0]);
  // Low stools stay inside the garden's reachable disc and clear the main route.
  for (const [x, z, angle] of [[-.85, -.3, .45], [.85, -.3, -.45], [.06, 1.03, 0]]) {
    box(table, stone, [.5, .065, .34], [x, .32, z], [0, angle, 0]);
    for (const offset of [-.15, .15]) box(table, bronze, [.038, .3, .21], [x + offset, .15, z], [0, angle, 0]);
  }
  const thirdCup = new THREE.Group();
  thirdCup.name = 'rhythm-third-cup';
  thirdCup.position.copy(table.position);
  thirdCup.visible = false;
  group.add(thirdCup);
  cup(thirdCup, [.04, .67, .34]);
  batch(thirdCup, 'restored-cup');

  // A pivoting paper solar dial, with a folded reply concealed under its rim.
  const desk = new THREE.Group();
  desk.position.set(ANCHORS.light.x, .12, ANCHORS.light.z);
  stationary.add(desk);
  cylinder(desk, stone, .43, .54, .13, [0, .065, 0]);
  cylinder(desk, bronze, .055, .1, .95, [0, .55, 0]);
  ring(desk, bronze, .43, .022, [0, .81, 0], [-.8, 0, 0]);
  box(desk, ink, [1.02, .035, .72], [0, .93, .09]);
  box(desk, paper, [1, .015, .2], [0, .98, .33]);
  for (const x of [-.17, .17]) box(desk, bronze, [.008, .006, .17], [x, .991, .33]);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * .7 + i * Math.PI * .23;
    cylinder(desk, porcelain, .018, .018, .03, [Math.cos(a) * .42, .16, Math.sin(a) * .42]);
  }
  const windDial = new THREE.Group();
  windDial.name = 'light-letter-dial';
  windDial.position.set(ANCHORS.light.x, 1.1, ANCHORS.light.z);
  group.add(windDial);
  foldedLetter(windDial, .5, .4, [0, 0, 0], [.16, 0, 0]);
  // The little cut-out motif reads as a recipient's flower seal, not body text.
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    mesh(new THREE.SphereGeometry(.025, 8, 6), bronze, windDial, [Math.sin(a) * .06, .061, Math.cos(a) * .06], [0, 0, 0], [1, .15, 1.5]);
  }
  batch(windDial, 'paper-dial');
  const reply = new THREE.Group();
  reply.name = 'light-return-letter';
  reply.position.set(ANCHORS.light.x + .3, .83, ANCHORS.light.z + .22);
  reply.visible = false;
  group.add(reply);
  foldedLetter(reply, .31, .22, [0, 0, 0], [.09, -.4, .1]);
  batch(reply, 'return-letter');

  // A pressed specimen kept intact, its archive label deliberately left blank.
  // Offset toward the rear edge leaves the R stepping-stone center walkable.
  const archive = new THREE.Group();
  archive.position.set(ANCHORS.memory.x, .12, ANCHORS.memory.z - .7);
  stationary.add(archive);
  cylinder(archive, stone, .46, .51, .12, [0, .06, 0]);
  for (const x of [-.34, .34]) box(archive, bronze, [.03, 1.13, .03], [x, .65, 0]);
  for (const y of [.21, 1.2]) box(archive, bronze, [.71, .035, .035], [0, y, 0]);
  box(archive, stone, [.61, .78, .028], [0, .73, -.025]);
  tube(archive, ink, [[-.13, .34, .01], [-.12, .59, .02], [.035, .9, .02]], .009, 12);
  leaf(archive, ink, [-.12, .49, .025], [.48, .25, .48], [0, 0, .7]);
  leaf(archive, ink, [-.1, .58, .025], [.45, .23, .45], [0, 0, -.85]);
  box(archive, paper, [.22, .09, .006], [.12, .35, .027]);
  // Etched year tracks join the existing static bronze batch, not a new draw.
  ring(archive, bronze, .35, .004, [.035, .88, .062], [0, 0, 0]);
  ring(archive, bronze, .123, .003, [.035, .88, .065], [0, 0, 0]);
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(-.42, .36, -.32, .85, 0, 1);
  petalShape.bezierCurveTo(.32, .85, .42, .36, 0, 0);
  const comparisonMaterial = porcelain.clone();
  comparisonMaterial.side = THREE.DoubleSide;
  const comparisonPetals = new THREE.InstancedMesh(new THREE.ShapeGeometry(petalShape, 12), comparisonMaterial, 5);
  comparisonPetals.name = 'memory-comparison-petals';
  comparisonPetals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  comparisonPetals.frustumCulled = false;
  group.add(comparisonPetals);
  // A living shape makes the archive's protection legible without another
  // caption. It is part of the old projection, distinct from the reward shoot.
  const protectedBud = new THREE.Group();
  protectedBud.name = 'memory-protected-bud';
  protectedBud.position.set(branchTargets.memory.x, branchTargets.memory.y - .025, branchTargets.memory.z + .115);
  group.add(protectedBud);
  tube(protectedBud, newGreen, [[0, -.065, 0], [-.006, .005, 0], [.004, .07, 0]], .008, 8);
  leaf(protectedBud, newGreen, [-.004, -.018, .004], [.19, .065, .19], [0, 0, .75]);
  leaf(protectedBud, newGreen, [.002, .01, .006], [.18, .058, .18], [0, 0, -.8]);
  mesh(new THREE.SphereGeometry(.021, 10, 6), newGreen, protectedBud, [.004, .073, .003], [0, 0, 0], [.7, 1.35, .7]);
  batch(protectedBud, 'protected-bud');
  // One instanced batch contains outer year ticks, the paused inner record,
  // and a broken/connected current. Static gaps also read in reduced motion.
  const outerYearCount = 36, innerYearCount = 20, currentCount = 24;
  const yearMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const yearMarks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), yearMaterial, outerYearCount + innerYearCount + currentCount);
  yearMarks.name = 'memory-year-and-current-marks';
  yearMarks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  yearMarks.frustumCulled = false;
  group.add(yearMarks);
  let memoryClock = 0;
  const shoot = new THREE.Group();
  shoot.name = 'memory-new-shoot';
  shoot.position.set(ANCHORS.memory.x + .28, .27, ANCHORS.memory.z - .42);
  shoot.visible = false;
  group.add(shoot);
  tube(shoot, newGreen, [[0, 0, 0], [-.025, .17, 0], [.025, .31, .015]], .014, 10);
  leaf(shoot, newGreen, [-.01, .12, 0], [.66, .22, .66], [-.3, .3, .8]);
  leaf(shoot, newGreen, [.012, .22, .01], [.6, .18, .6], [.25, -.3, -.75]);
  batch(shoot, 'living-shoot');

  // Three other inhabited vessels put the tiny delivery in a wider world.
  // Each silhouette has its own crown: open fan, tilted sail, narrow bud.
  const beacons = [[-16, 4.7, -20], [14, 6, -41], [-11, 7.1, -62]];
  for (let index = 0; index < 3; index++) {
    const [x, y, z] = beacons[index];
    const ark = new THREE.Group();
    ark.position.set(x, y - 3.2, z);
    ark.rotation.y = [-.25, .65, -.5][index];
    stationary.add(ark);
    const span = [3.5, 3, 2.6][index];
    tube(ark, stone, [[-span, .3, 0], [-span * .7, -.35, .16], [0, -.65, .28], [span * .7, -.35, .16], [span, .3, 0]], .14, 36);
    tube(ark, bronze, [[-span, .3, 0], [0, -.28, -.1], [span, .3, 0]], .032, 28);
    for (let rib = 0; rib < 5; rib++) {
      const side = (rib - 2) / 2;
      const peak = index === 0 ? 3.1 - Math.abs(side) * .7 : index === 1 ? 2.6 + side * .9 : 3.7 - Math.abs(side) * .5;
      const topX = index === 2 ? side * .38 : side * span * .8 + (index === 1 ? .6 : 0);
      tube(ark, bronze, [[side * span * .64, -.36, .15], [side * span * .98, peak * .5, -.2], [topX, peak, -.06]], .028, 24);
    }
    // Subtle pale woven panels stop these feeling like empty wireframes.
    for (const side of [-1, 1]) leaf(ark, stone, [side * .1, -.3, .05], [span * .42, index === 2 ? 2.5 : 2.1, 1], [.12, side * .12, -side * .4]);
    cylinder(ark, bronze, .12, .2, .2, [0, 3.1, 0]);
  }
  batch(stationary, 'story-set');

  // Three literal fragments of an original letter appear on the paper as the
  // player finds them. Browser text lives in a single atlas; Node needs no DOM.
  let letterAtlas;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 1152; canvas.height = 192;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#4c5369';
      context.font = '72px "Noto Serif SC", "Songti SC", SimSun, serif';
      context.textAlign = 'center'; context.textBaseline = 'middle';
      ['后来者', '有席', '此处'].forEach((word, i) => context.fillText(word, i * 384 + 192, 102));
      letterAtlas = new THREE.CanvasTexture(canvas);
    }
  }
  if (!letterAtlas) {
    letterAtlas = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
    letterAtlas.needsUpdate = true;
  }
  letterAtlas.name = 'original-letter-fragment-atlas';
  letterAtlas.colorSpace = THREE.SRGBColorSpace;
  const wordParts = branchTargets.light.map((point, i) => {
    const geometry = new THREE.PlaneGeometry(.31, .155);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(point.x, point.y, point.z);
    const uv = geometry.getAttribute('uv');
    for (let j = 0; j < uv.count; j++) uv.setX(j, (i + uv.getX(j)) / 3);
    geometry.setAttribute('aLabel', new THREE.Float32BufferAttribute(new Float32Array(4).fill(i), 1));
    return geometry;
  });
  const wordGeometry = mergeGeometries(wordParts, false);
  for (const geometry of wordParts) geometry.dispose();
  const wordMaterial = new THREE.MeshBasicMaterial({ map: letterAtlas, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  wordMaterial.userData.found = new THREE.Vector3();
  wordMaterial.onBeforeCompile = shader => {
    shader.uniforms.uFound = { value: wordMaterial.userData.found };
    shader.vertexShader = 'attribute float aLabel; varying float vLabel;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLabel = aLabel;');
    shader.fragmentShader = 'uniform vec3 uFound; varying float vLabel;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.a *= vLabel < .5 ? uFound.x : (vLabel < 1.5 ? uFound.y : uFound.z);');
  };
  wordMaterial.customProgramCacheKey = () => 'original-revealed-words-v1';
  const words = mesh(wordGeometry, wordMaterial, group);
  words.name = 'light-revealed-words';

  const beaconGeometry = new THREE.BufferGeometry();
  beaconGeometry.setAttribute('position', new THREE.Float32BufferAttribute(beacons.flat(), 3));
  beaconGeometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(9), 3));
  const beaconMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: .8, transparent: true, opacity: .75, vertexColors: true, depthWrite: false, blending: THREE.AdditiveBlending });
  beaconMaterial.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', 'float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; diffuseColor.a *= pow(1.0 - d, 2.2);\n#include <opaque_fragment>');
  };
  beaconMaterial.customProgramCacheKey = () => 'cinematic-soft-beacons-v1';
  const beaconPoints = new THREE.Points(beaconGeometry, beaconMaterial);
  beaconPoints.name = 'distant-reply-lights';
  beaconPoints.frustumCulled = false;
  group.add(beaconPoints);

  const guideGeometry = new THREE.BufferGeometry();
  guideGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    ANCHORS.rhythm.x + .04, 1.03, ANCHORS.rhythm.z + .34,
    ANCHORS.light.x, 1.43, ANCHORS.light.z,
    ANCHORS.memory.x, 1.47, ANCHORS.memory.z - .7,
    ANCHORS.rhythm.x - .28, .92, ANCHORS.rhythm.z - .17,
    ANCHORS.rhythm.x + .27, .92, ANCHORS.rhythm.z - .16,
    ANCHORS.light.x, 1.2, ANCHORS.light.z + .33,
    ANCHORS.memory.x - .22, .49, ANCHORS.memory.z - .66,
    ANCHORS.memory.x + .22, .49, ANCHORS.memory.z - .66,
  ], 3));
  guideGeometry.setAttribute('color', new THREE.Float32BufferAttribute([.76, .66, .5, .57, .68, .81, .64, .8, .72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 3));
  const guideMaterial = beaconMaterial.clone();
  guideMaterial.onBeforeCompile = beaconMaterial.onBeforeCompile;
  guideMaterial.customProgramCacheKey = beaconMaterial.customProgramCacheKey;
  guideMaterial.size = .14;
  guideMaterial.opacity = .55;
  const guidePoints = new THREE.Points(guideGeometry, guideMaterial);
  guidePoints.name = 'branch-guide-lights';
  group.add(guidePoints);

  // Sparse pollen, mostly beside the route: this preserves the reference's clear
  // water and leaves the dense avatar cloud to the main particle simulation.
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = [], dustSeeds = [];
  let seed = 4587;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 220; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    dustPositions.push(side * (2.5 + random() * 10), .3 + random() * 5.4, 5 - random() * 62);
    dustSeeds.push(random());
  }
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(dustSeeds, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uMotion: { value: 1 }, uNight: { value: 0 } },
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uMotion; varying float vSeed; varying float vDistance;
      void main(){vSeed=aSeed;vec3 p=position;p.x+=sin(uTime*.15+aSeed*21.)*.32*uMotion;p.y+=sin(uTime*.25+aSeed*41.)*.15*uMotion;
      vec4 mv=modelViewMatrix*vec4(p,1.);vDistance=-mv.z;gl_Position=projectionMatrix*mv;gl_PointSize=clamp((26.+aSeed*19.)/max(1.,-mv.z),1.,3.5);}`,
    fragmentShader: `uniform float uNight;varying float vSeed;varying float vDistance;
      void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float a=pow(1.-d,2.)*mix(.31,.5,uNight)*(1.-smoothstep(22.,60.,vDistance));
      gl_FragColor=vec4(mix(vec3(.63,.71,.87),vec3(.91,.74,.63),vSeed),a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  dust.name = 'quiet-airborne-pollen';
  group.add(dust);

  // Only during the opening: one short filament connects the repaired bloom
  // to the courier's seed case. It is an action in this place, not a star field.
  const filamentGeometry = new THREE.BufferGeometry();
  const filamentProgress = [];
  for (let i = 0; i < 64; i++) filamentProgress.push(i / 63);
  filamentGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(64 * 3), 3));
  filamentGeometry.setAttribute('aAlong', new THREE.Float32BufferAttribute(filamentProgress, 1));
  const filamentMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOpening: { value: 0 }, uMotion: { value: 1 }, uEnd: { value: new THREE.Vector3(0, .8, 6) } },
    vertexShader: `attribute float aAlong;uniform float uTime;uniform float uOpening;uniform float uMotion;uniform vec3 uEnd;varying float vAlpha;
      void main(){float p=aAlong;vec3 start=vec3(0.,2.,0.);vec3 end=uEnd;vec3 v=mix(start,end,p);v.y+=sin(p*3.14159)*.7;
      v.x+=sin(p*25.-uTime*2.)*.07*sin(p*3.14159)*uMotion;float head=clamp((uOpening-.35)/.24,0.,1.);
      vAlpha=(1.-smoothstep(.06,.2,abs(p-head)))*smoothstep(.35,.39,uOpening)*(1.-smoothstep(.59,.65,uOpening));
      vec4 mv=modelViewMatrix*vec4(v,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(50./max(1.,-mv.z),1.,6.);}`,
    fragmentShader: `varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.92,.71,.47,pow(1.-d,2.)*vAlpha*.72);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const filament = new THREE.Points(filamentGeometry, filamentMaterial);
  filament.name = 'opening-flower-to-seed-filament';
  filament.frustumCulled = false;
  filament.visible = false;
  group.add(filament);

  const hazeMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uMotion: { value: 1 }, uNight: { value: 0 } },
    vertexShader: `varying vec3 vWorld;varying vec2 vUv;void main(){vUv=uv;vec4 wp=modelMatrix*vec4(position,1.);vWorld=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader: `uniform float uTime;uniform float uMotion;uniform float uNight;varying vec3 vWorld;varying vec2 vUv;
      void main(){float t=uTime*.035*uMotion;float veil=sin(vWorld.x*.31+sin(vWorld.z*.21+t))*sin(vWorld.z*.17-t)*.5+.5;
      float edge=smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x)*smoothstep(0.,.1,vUv.y)*smoothstep(0.,.1,1.-vUv.y);
      float lane=smoothstep(5.,12.,abs(vWorld.x));float a=edge*lane*veil*mix(.038,.062,uNight);
      gl_FragColor=vec4(mix(vec3(.56,.53,.65),vec3(.19,.24,.38),uNight),a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const haze = mesh(new THREE.PlaneGeometry(68, 88), hazeMaterial, group, [0, .42, -29], [-Math.PI / 2, 0, 0]);
  haze.name = 'low-tide-haze';
  haze.renderOrder = 0;

  const beaconColor = new THREE.Color();
  const replyBaseY = reply.position.y;
  const shootBaseY = shoot.rotation.z;
  const petalTransform = new THREE.Object3D();
  const yearTransform = new THREE.Object3D(), yearColor = new THREE.Color();
  const petalZ = new THREE.Quaternion(), petalX = new THREE.Quaternion();
  const xAxis = new THREE.Vector3(1, 0, 0), zAxis = new THREE.Vector3(0, 0, 1);
  function update(time, dt, state = {}) {
    if (disposed) return;
    const t = finite(time, lastTime);
    lastTime = t;
    const motion = state.reducedMotion ? 0 : 1;
    const night = state.night ? 1 : 0;
    const progress = THREE.MathUtils.clamp(finite(state.progress), 0, 4);
    const opening = saturate(state.opening);
    const branches = state.branches || {};
    const field = key => state[key] ?? branches[key];
    const done = key => branches[key] === true || branches[key]?.done === true;
    thirdCup.visible = done('rhythm');
    reply.visible = done('light');
    shoot.visible = done('memory');
    const px = finite(state.player?.x), pz = finite(state.player?.z);
    const lightDistance = Math.hypot(px - ANCHORS.light.x, pz - ANCHORS.light.z);
    // A supplied alignment angle can make the prop follow the gameplay verb;
    // absent one, its restrained motion suggests that it can turn in the wind.
    const angle = finite(branches.lightAngle, NaN);
    const dialTarget = Number.isFinite(angle) ? angle : Math.sin(t * .18) * .18 * motion;
    const response = 1 - Math.exp(-Math.min(.1, Math.max(0, finite(dt))) * 5);
    windDial.rotation.y += (dialTarget - windDial.rotation.y) * response;
    if (!motion && !Number.isFinite(angle)) windDial.rotation.y = 0;
    windDial.rotation.z = motion * Math.sin(t * .42) * .018;
    reply.position.y = replyBaseY + motion * .018 * Math.sin(t * .65);
    shoot.rotation.z = shootBaseY + motion * Math.sin(t * .75) * .045;
    const memoryBloom = saturate(field('memoryBloom'));
    const connection = THREE.MathUtils.smoothstep(memoryBloom, .16, .84);
    memoryClock += Math.min(.1, Math.max(0, finite(dt))) * .11 * connection * motion;
    protectedBud.scale.setScalar(THREE.MathUtils.lerp(.76, 1.12, connection));
    for (let i = 0; i < 5; i++) {
      petalTransform.position.set(branchTargets.memory.x, branchTargets.memory.y, branchTargets.memory.z);
      petalZ.setFromAxisAngle(zAxis, i * Math.PI * 2 / 5);
      petalX.setFromAxisAngle(xAxis, THREE.MathUtils.lerp(1.3, .1, memoryBloom));
      petalTransform.quaternion.copy(petalZ).multiply(petalX);
      petalTransform.scale.set(.2 + memoryBloom * .15, .19 + memoryBloom * .06, .35);
      petalTransform.updateMatrix();
      comparisonPetals.setMatrixAt(i, petalTransform.matrix);
    }
    comparisonPetals.instanceMatrix.needsUpdate = true;
    // Closed: outside years pass while the centre is held in the same pose.
    // Open: the inner record advances and the current crosses the flower.
    const outerClock = t * .11 * motion;
    const innerClock = motion ? memoryClock : 0;
    for (let i = 0; i < yearMarks.count; i++) {
      let x, y, z = branchTargets.memory.z + .075, angle, sx, sy, strength;
      if (i < outerYearCount) {
        const p = i / outerYearCount;
        angle = p * Math.PI * 2 + outerClock;
        x = Math.cos(angle) * .35; y = Math.sin(angle) * .35;
        sx = i % 3 === 0 ? .027 : .017; sy = .006;
        strength = .65 + .35 * Math.pow(.5 + .5 * Math.sin(p * Math.PI * 2), 4);
        yearColor.setRGB(.5, .64, .82).multiplyScalar(strength);
        angle += Math.PI / 2;
      } else if (i < outerYearCount + innerYearCount) {
        const p = (i - outerYearCount) / innerYearCount;
        angle = p * Math.PI * 2 + innerClock;
        x = Math.cos(angle) * .123; y = Math.sin(angle) * .123;
        sx = .017; sy = .006;
        yearColor.setRGB(THREE.MathUtils.lerp(.53, .5, connection), THREE.MathUtils.lerp(.39, .81, connection), THREE.MathUtils.lerp(.27, .64, connection));
        angle += Math.PI / 2;
      } else {
        const p = (i - outerYearCount - innerYearCount + .5) / currentCount;
        x = -.45 + p * .9; y = -.018 + Math.sin(p * Math.PI * 2) * .023;
        angle = 0; sx = .024; sy = .007;
        // The shell intercepts the current at two visible edges. Even with
        // all motion disabled, an opening reconnects those missing segments.
        const blocked = Math.abs(x) < .185 && connection < .32;
        const head = motion ? (t * .14) % 1 : .62;
        const distance = Math.min(Math.abs(p - head), 1 - Math.abs(p - head));
        strength = .38 + .62 * (1 - THREE.MathUtils.smoothstep(distance, .025, .2));
        yearColor.setRGB(.49, .7 + connection * .16, .69).multiplyScalar(strength);
        if (blocked) sx = sy = 0;
        z += .01;
      }
      yearTransform.position.set(branchTargets.memory.x + x, branchTargets.memory.y + y, z);
      yearTransform.rotation.set(0, 0, angle);
      yearTransform.scale.set(sx, sy, .006);
      yearTransform.updateMatrix();
      yearMarks.setMatrixAt(i, yearTransform.matrix);
      yearMarks.setColorAt(i, yearColor);
    }
    yearMarks.instanceMatrix.needsUpdate = true;
    yearMarks.instanceColor.needsUpdate = true;
    const lightFound = field('lightFound') || [];
    wordMaterial.userData.found.set(lightFound[0] ? 1 : 0, lightFound[1] ? 1 : 0, lightFound[2] ? 1 : 0);
    const guideColors = guideGeometry.getAttribute('color');
    const beatValue = field('beatValue');
    const beatPulse = saturate(field('beatPulse'));
    const left = beatValue === 1 ? beatPulse : 0, right = beatValue === 2 ? beatPulse : 0;
    guideColors.setXYZ(3, left * 2.4, left * 1.7, left * .9);
    guideColors.setXYZ(4, right * 1.3, right * 1.9, right * 2.6);
    const sweep = field('lightSweep');
    const validSweep = sweep && [sweep.x, sweep.y, sweep.z].every(Number.isFinite);
    guideColors.setXYZ(5, validSweep ? 1.8 : 0, validSweep ? 1.5 : 0, validSweep ? .9 : 0);
    if (validSweep) { guideGeometry.getAttribute('position').setXYZ(5, sweep.x, sweep.y + .012, sweep.z); guideGeometry.getAttribute('position').needsUpdate = true; }
    const seen = field('memorySeen') || {};
    guideColors.setXYZ(6, seen.closed ? .8 : .08, seen.closed ? .62 : .07, seen.closed ? .42 : .08);
    guideColors.setXYZ(7, seen.open ? .51 : .08, seen.open ? .88 : .07, seen.open ? .68 : .08);
    guideColors.needsUpdate = true;
    filament.visible = opening > .35 && opening < .65;
    filamentMaterial.uniforms.uTime.value = t;
    filamentMaterial.uniforms.uOpening.value = opening;
    filamentMaterial.uniforms.uMotion.value = motion;
    filamentMaterial.uniforms.uEnd.value.set(px, .8, state.player ? pz : 6);
    for (const material of [dustMaterial, hazeMaterial]) {
      material.uniforms.uTime.value = t;
      material.uniforms.uMotion.value = motion;
      material.uniforms.uNight.value = night;
    }
    guideMaterial.opacity = (night ? .78 : .46) + Math.max(0, 1 - lightDistance / 4) * .12;
    const colors = beaconGeometry.getAttribute('color');
    for (let i = 0; i < 3; i++) {
      const answered = progress >= i + 1;
      const intro = Math.max(0, 1 - Math.abs(opening - (.23 + i * .22)) / .18);
      const strength = answered ? .8 + motion * .1 * Math.sin(t * .5 + i * 1.4) : .12 + intro * .45;
      beaconColor.setRGB(1, answered ? .69 : .72, answered ? .36 : .84).multiplyScalar(strength);
      colors.setXYZ(i, beaconColor.r, beaconColor.g, beaconColor.b);
    }
    colors.needsUpdate = true;
    beaconMaterial.opacity = night ? .94 : .72;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    const geometries = new Set(), materials = new Set(), textures = new Set([grain, letterAtlas]);
    group.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of object.material ? [object.material].flat() : []) materials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
  }
  update(0, 0, {});
  return { group, branchTargets, update, dispose };
}
