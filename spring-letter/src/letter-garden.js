import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { LETTERS, createLetters, evaluateLetter, letterUnlocked, tilePorts } from './letter-model.js';

// A letter is a small piece of worked landscape. Coordinates share the rule
// model's grid: N is -Z and a clockwise model turn is a negative Y rotation.
export const LETTER_LAYOUT = Object.freeze({ spacing: .86, radius: .39, surface: .12, flow: .085 });
const SOURCE_CYCLE = Object.freeze({ unfurl: 1.1, dissolve: 2.6, return: 7.8, whole: 10.6 });
const SOURCE_FORMS = Object.freeze({ lily: 6, lotus: 18, iris: 6, dahlia: 24 });
const SOURCE_HEIGHT = .37, SOURCE_DETAIL = 14, DUST_CAPACITY = 1024;
const TAU = Math.PI * 2, HALF_PI = Math.PI / 2;
const mix = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp;
const GLYPHS = {
  a: [[[0,0],[.5,1],[1,0]],[[.23,.43],[.77,.43]]],
  b: [[[0,0],[0,1],[.7,1],[1,.77],[.7,.52],[0,.52]],[[.7,.52],[1,.25],[.7,0],[0,0]]],
  c: [[[1,.91],[.7,1],[0,.78],[0,.22],[.7,0],[1,.09]]],
  d: [[[0,0],[0,1],[.58,1],[1,.7],[1,.3],[.58,0],[0,0]]],
  e: [[[1,1],[0,1],[0,0],[1,0]],[[0,.51],[.8,.51]]],
  f: [[[1,1],[0,1],[0,0]],[[0,.52],[.8,.52]]],
  g: [[[1,.91],[.7,1],[0,.78],[0,.22],[.7,0],[1,.2],[1,.49],[.58,.49]]],
  h: [[[0,0],[0,1]],[[1,0],[1,1]],[[0,.51],[1,.51]]],
  i: [[[0,1],[1,1]],[[.5,1],[.5,0]],[[0,0],[1,0]]],
  j: [[[0,1],[1,1],[1,.21],[.65,0],[.15,.15]]],
  k: [[[0,0],[0,1]],[[1,1],[0,.48],[1,0]]],
};
const localX = (letter, c) => (c - (letter.cols - 1) / 2) * LETTER_LAYOUT.spacing;
const localZ = (letter, r) => (r - (letter.rows - 1) / 2) * LETTER_LAYOUT.spacing;
const resolveCell = (letter, tile) => typeof tile === 'string' ? letter.tiles.find(t => t.id === tile) : tile;
export function letterTilePosition(letter, tile) {
  const t = resolveCell(letter, tile);
  return t ? { x: letter.x + localX(letter, t.c), y: letter.y + LETTER_LAYOUT.surface, z: letter.z + localZ(letter, t.r) } : null;
}
export function letterGoalPosition(letter, goal) {
  const g = typeof goal === 'string' ? letter.goals.find(item => item.id === goal) : goal;
  return g ? { x: letter.x + localX(letter, g.c), y: letter.y + .4, z: letter.z + localZ(letter, g.r) } : null;
}
export function letterSourcePosition(letter, source = 0) {
  const s = typeof source === 'number' ? letter.sources[source] : source;
  return s ? { x: letter.x + localX(letter, s.c), y: letter.y + SOURCE_HEIGHT, z: letter.z + localZ(letter, s.r) } : null;
}
export function letterBoardBounds(letter) {
  const min = { x: letter.x + localX(letter, -1) - .5, y: letter.y - .32, z: letter.z + localZ(letter, 0) - .55 };
  const max = { x: letter.x + localX(letter, letter.cols) + .55, y: letter.y + 1.4, z: letter.z + localZ(letter, letter.rows - 1) + .92 };
  return { min, max, center: { x: (min.x + max.x) / 2, y: letter.y + .18, z: (min.z + max.z) / 2 }, width: max.x - min.x, depth: max.z - min.z, height: max.y - min.y };
}

function surface(rows, cols, point) {
  const p = [], uv = [], index = [];
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) {
    p.push(...point(r / rows, c / cols)); uv.push(c / cols, r / rows);
    if (r < rows && c < cols) { const i = r * (cols + 1) + c; index.push(i, i + cols + 1, i + 1, i + 1, i + cols + 1, i + cols + 2); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(index); geometry.computeVertexNormals(); return geometry;
}

// The channel is cut into the stone surface, including its outer lip. It is
// not a luminous stripe laid over an unbroken cylinder. Channel floors sit
// beneath the pale shoulders and continue through the gap to the next stone.
function carvedStone(kind) {
  const ports = tilePorts({ kind, turn: 0 }), points = [], indices = [], colors = [], rings = 16, slices = 96;
  function height(x, z, radius) {
    let distance = Math.hypot(x, z);
    for (const d of ports) {
      const dx = Math.sin(d * HALF_PI), dz = -Math.cos(d * HALF_PI), along = x * dx + z * dz;
      if (along >= 0) distance = Math.min(distance, Math.abs(x * dz - z * dx));
    }
    const cut = 1 - THREE.MathUtils.smoothstep(distance, .047, .082);
    const shoulder = .12 - .022 * Math.pow(radius / .39, 8);
    return mix(shoulder, .035, cut);
  }
  for (let r = 0; r <= rings; r++) for (let s = 0; s <= slices; s++) {
    const a = s / slices * TAU, radius = r / rings * .39, x = Math.sin(a) * radius, z = -Math.cos(a) * radius, y = height(x, z, radius);
    points.push(x, y, z);
    const mineral = .91 + .06 * Math.sin(x * 29 + z * 17) * Math.cos(z * 23 - x * 9), shadow = .64 + .36 * clamp((y - .035) / .07, 0, 1);
    colors.push(mineral * shadow, mineral * shadow, mineral * shadow);
    if (r < rings && s < slices) { const i = r * (slices + 1) + s; indices.push(i, i + 1, i + slices + 1, i + 1, i + slices + 2, i + slices + 1); }
  }
  const offset = points.length / 3;
  for (let s = 0; s <= slices; s++) {
    const a = s / slices * TAU, x = Math.sin(a) * .39, z = -Math.cos(a) * .39;
    points.push(x, height(x, z, .39), z, x * .92, -.30, z * .92); colors.push(.74, .76, .73, .49, .55, .49);
    if (s < slices) { const i = offset + s * 2; indices.push(i, i + 2, i + 1, i + 2, i + 3, i + 1); }
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}

function channelFloor(kind) {
  const parts = [], center = new THREE.CylinderGeometry(.054, .054, .009, 16); center.translate(0, .041, 0); parts.push(center);
  for (const d of tilePorts({ kind, turn: 0 })) {
    const strip = new THREE.BoxGeometry(.075, .009, .44); strip.translate(0, .041, -.22); strip.rotateY(-d * HALF_PI); parts.push(strip);
  }
  const merged = mergeGeometries(parts); for (const p of parts) p.dispose(); return merged;
}

function leaf(length = 1, width = .28) {
  return surface(14, 6, (u, v) => [(v * 2 - 1) * Math.sin(u * Math.PI) * width, Math.sin(u * Math.PI) * .14 - u * u * .06, u * length]);
}

function sourcePhase(time, cycling) {
  return !cycling ? 'whole' : time < SOURCE_CYCLE.unfurl ? 'unfurling' : time < SOURCE_CYCLE.dissolve ? 'dissolving' : time < SOURCE_CYCLE.return ? 'flowing' : 'returning';
}

// Build a small set of directed routes only when a stone changes. A fork can
// divide a flower's grains; no grain shortcuts a corner or invents an edge.
function sourceRoutes(letter, evaluation) {
  return letter.sources.map((source, index) => {
    const routes = [];
    function visit(c, r, depth, path) {
      const next = evaluation.edges.filter(edge => edge.source === index && edge.depth === depth && edge.from[0] === c && edge.from[1] === r);
      if (!next.length || depth >= 32) { if (path.length) routes.push(path); return; }
      for (const edge of next) { if (routes.length >= 16) break; visit(edge.to[0], edge.to[1], depth + 1, [...path, edge]); }
    }
    visit(source.c, source.r, 0, []); return routes;
  });
}

export function createLetterGarden() {
  const group = new THREE.Group(); group.name = 'letters-in-the-landscape';
  const resources = new Set(), courts = [], fallback = createLetters(); let disposed = false, activeId = null;
  const own = resource => { resources.add(resource); return resource; };
  const material = (color, options = {}) => own(new THREE.MeshStandardMaterial({ color, roughness: .8, metalness: .03, ...options }));
  const natural = material(0xffffff, { vertexColors: true, side: THREE.DoubleSide });
  const stoneMat = material(0xffffff, { vertexColors: true, roughness: .91 });
  const wet = material(0xffffff, { emissive: 0xffffff, emissiveIntensity: .11, roughness: .36, metalness: .13 });
  const brass = material(0xdec895, { roughness: .43, metalness: .42 });
  const selectedMat = material(0xfbe4a5, { emissive: 0xf5c878, emissiveIntensity: .7, metalness: .26, roughness: .36 });
  const petalMat = material(0xffffff, { side: THREE.DoubleSide, roughness: .51, metalness: .03, emissive: 0x664e46, emissiveIntensity: .06 });
  const dustMat = material(0xffffff, { emissive: 0xffffff, emissiveIntensity: .9, roughness: .6 });
  for (const mat of [wet, dustMat, petalMat]) {
    // Standard-material instancing colours tint diffuse light, but do not
    // tint emissive light automatically. Keep both tide sources identifiable
    // in the night scene while retaining the normal lighting/fog pipeline.
    mat.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= diffuseColor.rgb;');
    };
    mat.customProgramCacheKey = () => 'letter-instance-emission-1';
  }
  const color = new THREE.Color(), pale = new THREE.Color(), second = new THREE.Color(), low = new THREE.Color(), charcoal = new THREE.Color(0x3d5554), cream = new THREE.Color(0xffefdc), pollen = new THREE.Color(0xe5c489);
  const dummy = new THREE.Object3D();
  const sourceMatrix = new THREE.Matrix4(), sourceSample = new THREE.Vector3();
  const sourcePickSphere = new THREE.Sphere(new THREE.Vector3(), .43), sourcePickPoint = new THREE.Vector3();
  const geometries = {
    sphere: own(new THREE.SphereGeometry(1, 12, 8)), leaf: own(leaf()),
    petal: own(leaf(.37, .145)),
    dust: own(new THREE.IcosahedronGeometry(.025, 0)),
    ring: own(new THREE.TorusGeometry(.355, .009, 4, 48)),
    selection: own(new THREE.TorusGeometry(.416, .018, 5, 64)),
    marker: own(new THREE.BoxGeometry(.018, .018, .075)),
    stem: own(new THREE.CylinderGeometry(.010, .015, 1, 6)),
  };
  geometries.ring.rotateX(HALF_PI); geometries.selection.rotateX(HALF_PI);
  for (const kind of ['line', 'bend', 'fork']) { geometries[kind] = own(carvedStone(kind)); geometries[kind + 'Floor'] = own(channelFloor(kind)); }

  function put(mesh, index, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
    dummy.position.set(x, y, z); dummy.scale.set(sx, sy, sz); dummy.rotation.set(rx, ry, rz); dummy.updateMatrix(); mesh.setMatrixAt(index, dummy.matrix);
  }
  function instances(name, geometry, mat, count, parent) {
    const mesh = new THREE.InstancedMesh(geometry, mat, count); mesh.name = name; mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  // A single vertex-colour batch contains each court's paper, timber, clay,
  // seams and stonework. Temporary authoring geometries never escape here.
  function builder() {
    const parts = [];
    function add(geometry, tint, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
      dummy.position.set(...position); dummy.rotation.set(...rotation); dummy.scale.set(...scale); dummy.updateMatrix();
      const g = geometry.index ? geometry.toNonIndexed() : geometry.clone(); geometry.dispose(); g.applyMatrix4(dummy.matrix);
      const p = g.getAttribute('position'), c = new THREE.Color(tint), colors = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) { const stain = .93 + .07 * Math.sin(p.getX(i) * 8.2 + p.getZ(i) * 11.3 + p.getY(i) * 6.4); colors[i * 3] = c.r * stain; colors[i * 3 + 1] = c.g * stain; colors[i * 3 + 2] = c.b * stain; }
      // Authoring shapes differ in their UV presence; no textures are sampled.
      g.deleteAttribute('uv'); g.setAttribute('color', new THREE.BufferAttribute(colors, 3)); parts.push(g);
    }
    const sphere = (tint, p, s) => add(new THREE.SphereGeometry(1, 12, 8), tint, p, [0, 0, 0], s);
    const tube = (points, radius, tint, segments = 16) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, 6, false), tint);
    const disk = (r, h, tint, p, sides = 24) => add(new THREE.CylinderGeometry(r, r * .9, h, sides), tint, p);
    function finish(parent, name) {
      if (!parts.length) return null;
      const geometry = own(mergeGeometries(parts)); for (const part of parts) part.dispose();
      const mesh = new THREE.Mesh(geometry, natural); mesh.name = name; mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    return { add, sphere, tube, disk, finish };
  }

  for (const letter of LETTERS) {
    const court = new THREE.Group(); court.name = `letter-${letter.id}`; court.position.set(letter.x, letter.y, letter.z); group.add(court);
    const board = new THREE.Group(); board.name = `${letter.id}-leaf-channel-board`; board.visible = false; court.add(board);
    const fixed = builder(), goals = [], tileGroups = [], selection = new THREE.Mesh(geometries.selection, selectedMat);
    selection.position.y = .145; selection.visible = false; board.add(selection);
    const rings = instances(`${letter.id}-turnable-brass-rims`, geometries.ring, brass, letter.tiles.length, board);
    const markers = instances(`${letter.id}-rotor-registration-seams`, geometries.marker, brass, letter.tiles.length * 3, board);
    const petals = instances(`${letter.id}-opening-flower-corollas`, geometries.petal, petalMat, letter.goals.length * 12, court);
    const hearts = instances(`${letter.id}-flower-hearts`, geometries.sphere, brass, letter.goals.length, court);
    const stems = instances(`${letter.id}-living-flower-stems`, geometries.stem, wet, letter.goals.length, court);
    const dust = instances(`${letter.id}-channel-flower-dust`, geometries.dust, dustMat, DUST_CAPACITY, board); dust.count = 0;
    for (const kind of ['line', 'bend', 'fork']) {
      const tiles = letter.tiles.filter(t => t.kind === kind); if (!tiles.length) continue;
      const stones = instances(`${letter.id}-${kind}-carved-stones`, geometries[kind], stoneMat, tiles.length, board);
      const floors = instances(`${letter.id}-${kind}-wet-channel-floors`, geometries[kind + 'Floor'], wet, tiles.length, board);
      stones.userData.letterId = letter.id; stones.userData.tiles = tiles;
      tileGroups.push({ stones, floors, tiles });
    }
    // Small cut-metal letters match the keyboard list without a texture atlas
    // or a DOM/canvas dependency. They stay legible as their stone rotates.
    const labels = builder();
    for (const tile of letter.tiles) {
      const x = localX(letter, tile.c) + .15, z = localZ(letter, tile.r) + .26;
      for (const path of GLYPHS[tile.id] || []) {
        for (let i = 1; i < path.length; i++) labels.tube([
          [x + path[i - 1][0] * .07, .127, z - path[i - 1][1] * .105],
          [x + path[i][0] * .07, .127, z - path[i][1] * .105],
        ], .006, tile.locked ? 0x536957 : 0x5e684f, 1);
      }
    }
    labels.finish(board, `${letter.id}-stone-identification-letters`);

    // A modest writing stand sits at the near edge, outside all flow lanes.
    const standX = -.58, standZ = localZ(letter, letter.rows - 1) + .62;
    fixed.disk(.29, .24, 0x6e7d71, [standX, -.2, standZ]);
    fixed.tube([[standX, -.1, standZ], [standX + .025, .2, standZ], [standX, .43, standZ]], .052, 0x727c64);
    fixed.add(new THREE.BoxGeometry(.65, .075, .43), 0xa59170, [standX, .47, standZ], [-.23, -.1, 0]);
    fixed.add(new THREE.BoxGeometry(.56, .018, .35), 0xe8dabd, [standX, .52, standZ], [-.23, -.1, 0]);
    fixed.tube([[standX - .25, .56, standZ - .14], [standX, .53, standZ + .055], [standX + .25, .56, standZ - .14]], .007, 0xa98b67, 4);
    fixed.sphere(0xb68a77, [standX, .55, standZ + .055], [.055, .012, .05]);

    // The wells visibly pour from the board's west edge. The tide letter has
    // two equally sized wells; source colour is carried all the way to goal.
    const sourcePearls = instances(`${letter.id}-source-water`, geometries.sphere, wet, letter.sources.length * SOURCE_DETAIL, court);
    const sourcePetals = instances(`${letter.id}-source-flower-petals`, geometries.petal, petalMat, letter.sources.length * 24, court);
    sourcePetals.userData.letterId = sourcePearls.userData.letterId = letter.id;
    for (const [index, source] of letter.sources.entries()) {
      const x = localX(letter, source.c), z = localZ(letter, source.r);
      fixed.disk(.30, .32, 0x73877e, [x, -.12, z]); fixed.disk(.25, .08, 0xbdc7af, [x, .07, z]);
      fixed.add(new THREE.TorusGeometry(.22, .043, 8, 28), 0xbbb9a0, [x, .14, z], [HALF_PI, 0, 0]);
      fixed.tube([[x - .01, .13, z], [x - .018, .25, z + .008], [x, SOURCE_HEIGHT, z]], .018, 0x7c9e77);
      fixed.add(leaf(.22, .075), 0x92ac7c, [x - .01, .20, z], [-.3, -1.2, -.10]);
      fixed.add(leaf(.19, .07), 0x7ea88c, [x - .01, .23, z], [-.4, 1.5, .12]);
      fixed.add(new THREE.BoxGeometry(.40, .05, .12), 0x7f9384, [x + .24, .03, z]);
      put(sourcePearls, index * SOURCE_DETAIL, x, .13, z, .18, .025, .18);
    }
    sourcePearls.instanceMatrix.needsUpdate = true;

    for (const goal of letter.goals) {
      const x = localX(letter, goal.c), z = localZ(letter, goal.r), base = new THREE.Group();
      base.position.set(x, .12, z); court.add(base);
      fixed.disk(.39, .40, 0x778679, [x, -.15, z]); fixed.disk(.33, .06, 0x405a4e, [x, .08, z]);
      fixed.add(new THREE.TorusGeometry(.335, .027, 6, 32), 0xb9ab86, [x, .12, z], [HALF_PI, 0, 0]);
      fixed.add(new THREE.BoxGeometry(.35, .045, .105), 0x5e7868, [x - .22, .04, z]);
      const growth = builder(); let flowerHeight = .35, flowerOffsetX = 0;
      if (goal.id === 'tree') {
        fixed.tube([[x, .10, z], [x - .08, .4, z], [x + .025, .84, z - .015]], .065, 0x706b50);
        fixed.tube([[x - .035, .45, z], [x + .2, .69, z + .02], [x + .29, .85, z + .04]], .03, 0x706b50);
        fixed.tube([[x, .62, z], [x - .22, .82, z - .02]], .028, 0x706b50);
        for (let i = 0; i < 15; i++) {
          const a = i * 2.39996, r = .10 + .23 * Math.sqrt((i % 5) / 4), y = .64 + .18 * Math.sin(i * 1.91);
          growth.add(leaf(.34, .13), i % 3 ? 0x83a76b : 0xa4bd82, [Math.cos(a) * r, y, Math.sin(a) * r * .65], [-.4, a, -.25]);
        }
        flowerHeight = .92;
      } else if (goal.id === 'shoot') {
        growth.tube([[0, 0, 0], [-.035, .26, 0], [.01, .59, .015]], .024, 0x75965a);
        growth.add(leaf(.50, .18), 0xaac37c, [0, .26, 0], [-.55, -.85, -.25]);
        growth.add(leaf(.42, .17), 0x87ad6d, [0, .38, 0], [-.65, 2.0, .15]);
        flowerHeight = .73;
      } else if (goal.id === 'lamp') {
        fixed.disk(.18, .07, 0x9e8e67, [x, .18, z]);
        for (const dx of [-.18, .18]) for (const dz of [-.13, .13]) fixed.tube([[x + dx, .22, z + dz], [x + dx, .75, z + dz]], .016, 0xa88f66, 4);
        fixed.add(new THREE.ConeGeometry(.31, .20, 4), 0x627f70, [x, .85, z], [0, Math.PI / 4, 0]);
        fixed.tube([[x - .09, .91, z], [x - .09, 1.04, z], [x + .09, 1.04, z], [x + .09, .91, z]], .016, 0xb8a274, 10);
        growth.sphere(0xf4cc88, [0, .37, 0], [.09, .18, .09]);
        growth.add(new THREE.CylinderGeometry(.11, .15, .30, 8, 1, true), 0xe9d6a3, [0, .37, 0]);
        flowerHeight = .42;
      } else if (goal.id === 'sail') {
        fixed.tube([[x - .18, .12, z], [x - .19, .68, z], [x - .2, 1.23, z]], .025, 0x9a8865);
        fixed.add(surface(8, 16, (u, v) => { const a = v * 2 - 1; return [x + a * .37, .15 + (u * 2 - 1) ** 2 * .09 + Math.abs(a) ** 3 * .09, z + (u * 2 - 1) * .19 * Math.sqrt(Math.max(0, 1 - a * a))]; }), 0x9b9a76);
        growth.add(surface(16, 12, (u, v) => [-.2 + v * Math.sin(u * Math.PI * .78) * .61, 1.08 - u * .84, Math.sin(v * Math.PI) * .15 * Math.sin(u * Math.PI)]), 0xd9dfbb);
        growth.tube([[-.2, 1.08, .01], [-.10, .83, .09], [.23, .30, .035]], .009, 0xbb8b77);
        flowerHeight = .27; flowerOffsetX = .03;
      } else {
        // Old song is a small chorus of cupped stems; the new response grows
        // one fork with open space between its leaves. Both remain in world.
        const count = goal.id === 'old' ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const dx = (i - (count - 1) / 2) * .18, h = goal.id === 'old' ? .48 + (i % 2) * .19 : .67 + i * .18;
          growth.tube([[dx * .3, 0, 0], [dx, h * .55, .01], [dx, h, 0]], .018, 0x75a19a);
          growth.add(leaf(.30, .13), goal.id === 'old' ? 0xa6bcc0 : 0xa6cfb6, [dx, h * .43, 0], [-.55, i * Math.PI + .8, 0]);
          growth.add(new THREE.TorusGeometry(.085, .016, 6, 18, Math.PI * 1.8), 0xc1b79a, [dx, h, 0], [HALF_PI, 0, i * .2]);
        }
        flowerHeight = goal.id === 'old' ? .77 : .98;
      }
      const growthMesh = growth.finish(base, `${letter.id}-${goal.id}-lasting-growth`);
      goals.push({ id: goal.id, base, growth: growthMesh, opening: .04, x, z, flowerHeight, flowerOffsetX });
    }
    for (const leak of letter.leaks || []) {
      const x = localX(letter, leak.c), z = localZ(letter, leak.r);
      fixed.disk(.27, .27, 0x626a65, [x, -.13, z]); fixed.disk(.195, .04, 0x263c3d, [x, .022, z]);
      fixed.add(new THREE.TorusGeometry(.23, .045, 8, 24), 0x8c9282, [x, .04, z], [HALF_PI, 0, 0]);
      for (let i = 0; i < 3; i++) fixed.add(new THREE.BoxGeometry(.038, .025, .39), 0x4e5e57, [x + (i - 1) * .105, .055, z], [0, -.25, 0]);
    }
    fixed.finish(court, `${letter.id}-stone-paper-and-living-objects`);
    courts.push({ letter, court, board, goals, tileGroups, selection, rings, markers, petals, hearts, stems, dust, sourcePearls, sourcePetals,
      sourceTime: 0, sourcePhase: 'whole', sourceCycling: false, sourceForm: 'lily', sourceReducedMotion: false, sourceDustStart: 0, sourceDustCount: 0, routes: [],
      signature: '', flowStart: 0, evaluation: null, entry: null, unlocked: false, angles: Object.fromEntries(letter.tiles.map(t => [t.id, -t.turn * HALF_PI])) });
  }

  function update(time = 0, dt = 0, { letters = fallback, progress = {}, activeId: current = null, selectedId = null, palette = null, flowerForm = 'lily', reducedMotion = false, quality = 'balanced' } = {}) {
    if (disposed) return;
    activeId = current; const delta = Number.isFinite(dt) ? clamp(dt, 0, .1) : 0, clock = Number.isFinite(time) ? time : 0;
    color.set(palette?.high || (typeof palette === 'string' ? palette : '#e7abb5'));
    low.set(palette?.low || color);
    const chosenForm = typeof flowerForm === 'object' ? flowerForm?.flowerForm : flowerForm;
    const form = Object.hasOwn(SOURCE_FORMS, chosenForm) ? chosenForm : 'lily';
    // The second tide source keeps a cool identity even with an all-pink
    // flower palette. Source zero follows the player's chosen flower series.
    second.set(0x80c9c1); if (color.r < color.b && color.g > color.r) second.set(0xe7b0c4);
    for (const item of courts) {
      const { letter, board, tileGroups, selection, rings, markers, dust, goals, petals, hearts, stems } = item;
      const entry = letters?.entries?.[letter.id] || fallback.entries[letter.id];
      item.entry = entry; item.unlocked = letterUnlocked(letter, progress);
      // Locked future letters still exist as folded, unlit objects on the
      // shore; the complete mechanical board is exclusive to close viewing.
      const wasActive = board.visible;
      board.visible = current === letter.id && item.unlocked;
      item.sourceForm = form; item.sourceReducedMotion = reducedMotion;
      if (board.visible && !wasActive) { item.sourceTime = 0; item.sourceCycling = true; }
      else if (!board.visible) { item.sourceTime = 0; item.sourceCycling = false; }
      else if (item.sourceCycling) { item.sourceTime = Math.min(SOURCE_CYCLE.whole, item.sourceTime + delta); if (item.sourceTime >= SOURCE_CYCLE.whole) item.sourceCycling = false; }
      item.sourcePhase = sourcePhase(item.sourceTime, item.sourceCycling);
      const signature = letter.tiles.map(t => entry.turns[t.id]).join('') + ':' + entry.choice;
      if (signature !== item.signature || !item.evaluation) {
        item.evaluation = evaluateLetter(letter, entry); item.signature = signature; item.flowStart = clock;
        item.routes = sourceRoutes(letter, item.evaluation);
      }
      const evaluation = item.evaluation;

      if (board.visible) {
        for (const tile of letter.tiles) {
          const target = -entry.turns[tile.id] * HALF_PI, currentAngle = item.angles[tile.id];
          const difference = THREE.MathUtils.euclideanModulo(target - currentAngle + Math.PI, TAU) - Math.PI;
          item.angles[tile.id] = reducedMotion || !delta ? target : currentAngle + difference * (1 - Math.exp(-delta * 18));
        }
        for (const { stones, floors, tiles } of tileGroups) {
          for (const [i, tile] of tiles.entries()) {
            const x = localX(letter, tile.c), z = localZ(letter, tile.r), angle = item.angles[tile.id], powered = evaluation.powered[tile.id];
            put(stones, i, x, 0, z, 1, 1, 1, 0, angle, 0); put(floors, i, x, 0, z, 1, 1, 1, 0, angle, 0);
            stones.setColorAt(i, pale.set(tile.locked ? 0x81988a : tile.id === selectedId ? 0xdfdcc0 : 0xbdc7ae));
            if (powered?.length) { pale.copy(powered[0] ? second : color); if (powered.length > 1) pale.lerp(second, .5); } else pale.copy(charcoal);
            floors.setColorAt(i, pale);
          }
          stones.instanceMatrix.needsUpdate = floors.instanceMatrix.needsUpdate = true;
          stones.instanceColor.needsUpdate = floors.instanceColor.needsUpdate = true;
        }
        let markerCount = 0;
        for (const [i, tile] of letter.tiles.entries()) {
          const x = localX(letter, tile.c), z = localZ(letter, tile.r), angle = item.angles[tile.id];
          put(rings, i, x, .12, z, 1, 1, 1); rings.setColorAt(i, pale.set(tile.locked ? 0x607264 : 0xffffff));
          // Three fine notches give the hand something to read when a stone
          // turns. Locked stones have a single darker registration seam.
          for (let j = 0; j < (tile.locked ? 1 : 3); j++) {
            const a = angle + .58 + j * .12;
            put(markers, markerCount++, x + Math.sin(a) * .303, .134, z + Math.cos(a) * .303, 1, 1, 1, 0, a, 0);
          }
        }
        markers.count = markerCount; rings.instanceMatrix.needsUpdate = markers.instanceMatrix.needsUpdate = true; rings.instanceColor.needsUpdate = true;
        const selected = letter.tiles.find(t => t.id === selectedId);
        selection.visible = !!selected;
        if (selected) selection.position.set(localX(letter, selected.c), .146, localZ(letter, selected.r));

        let count = 0; const perEdge = quality === 'light' ? 2 : 4, travel = reducedMotion ? .37 : clock * .7;
        for (const edge of evaluation.edges) {
          if (!reducedMotion && clock - item.flowStart < edge.depth * .12) continue;
          const isLeak = evaluation.leaks.some(l => l.source === edge.source && l.from[0] === edge.from[0] && l.from[1] === edge.from[1] && l.to[0] === edge.to[0] && l.to[1] === edge.to[1]);
          for (let p = 0; p < perEdge && count < DUST_CAPACITY; p++) {
            const t = (travel + p / perEdge + edge.source * .13) % 1;
            const x = mix(localX(letter, edge.from[0]), localX(letter, edge.to[0]), t), z = mix(localZ(letter, edge.from[1]), localZ(letter, edge.to[1]), t);
            const shrink = isLeak ? Math.max(.06, 1 - t * .93) : 1;
            // No orbit, fountain, or random velocity: every grain remains
            // above a real propagated edge, with a gentle sink at a leak.
            const y = LETTER_LAYOUT.flow - (isLeak ? t * .065 : 0), s = (p % 2 ? .62 : .90) * shrink;
            put(dust, count, x, y, z, s, s, s); dust.setColorAt(count++, edge.source ? second : color);
          }
        }
        dust.count = count; dust.instanceMatrix.needsUpdate = true; if (dust.instanceColor) dust.instanceColor.needsUpdate = true;
      }

      // A whole flower unfolds, becomes a finite pulse travelling down the
      // actual channels, then returns to those same petal samples. This clock
      // uses dt exclusively: pausing the game cannot skip a lifecycle phase.
      const age = item.sourceTime, cycling = item.sourceCycling;
      const unfolding = cycling ? THREE.MathUtils.smoothstep(age, 0, SOURCE_CYCLE.unfurl) : 1;
      const dissolved = cycling ? THREE.MathUtils.smoothstep(age, SOURCE_CYCLE.unfurl, SOURCE_CYCLE.dissolve) * (1 - THREE.MathUtils.smoothstep(age, 8.65, SOURCE_CYCLE.whole)) : 0;
      const bloom = item.unlocked ? reducedMotion ? .87 : .30 + unfolding * .70 : .24;
      const petalBody = reducedMotion ? 1 - dissolved * .22 : 1 - dissolved;
      const samplesPerPetal = quality === 'light' ? 3 : 5, petalCount = SOURCE_FORMS[form];
      const hasSourceDust = board.visible && cycling && !reducedMotion && age >= SOURCE_CYCLE.unfurl && age < SOURCE_CYCLE.whole;
      item.sourceDustStart = board.visible ? dust.count : 0; item.sourceDustCount = 0;
      let sourcePetalIndex = 0, sourceDustIndex = item.sourceDustStart;
      for (const [sourceIndex, source] of letter.sources.entries()) {
        const sx = localX(letter, source.c), sz = localZ(letter, source.r), detailIndex = sourceIndex * SOURCE_DETAIL;
        const sourceColor = item.unlocked ? sourceIndex ? second : color : charcoal;
        item.sourcePearls.setColorAt(detailIndex, sourceColor);
        const centerSize = reducedMotion ? .84 : .22 + petalBody * .78;
        put(item.sourcePearls, detailIndex + 1, sx, SOURCE_HEIGHT + .023, sz, .074 * centerSize, .032 * centerSize, .074 * centerSize);
        item.sourcePearls.setColorAt(detailIndex + 1, pale.copy(pollen).lerp(sourceColor, .22));
        for (let stamen = 0; stamen < 6; stamen++) {
          const angle = stamen * TAU / 6 + .18, radius = .045 * centerSize, px = sx + Math.sin(angle) * radius, pz = sz + Math.cos(angle) * radius;
          put(item.sourcePearls, detailIndex + 2 + stamen * 2, px, SOURCE_HEIGHT + .055 * centerSize, pz, .006 * centerSize, .040 * centerSize, .006 * centerSize);
          put(item.sourcePearls, detailIndex + 3 + stamen * 2, px, SOURCE_HEIGHT + .092 * centerSize, pz, .014 * centerSize, .018 * centerSize, .014 * centerSize);
          item.sourcePearls.setColorAt(detailIndex + 2 + stamen * 2, cream);
          item.sourcePearls.setColorAt(detailIndex + 3 + stamen * 2, pollen);
        }
        for (let petal = 0; petal < petalCount; petal++) {
          let angle, width, length, fold;
          if (form === 'lotus') {
            const layer = Math.floor(petal / 6); angle = petal % 6 * TAU / 6 + layer * .28;
            width = 1.14 - layer * .22; length = 1.04 - layer * .20; fold = -.12 - layer * .26;
          } else if (form === 'iris') {
            const outer = petal < 3; angle = petal % 3 * TAU / 3 + (outer ? 0 : .6);
            width = outer ? .98 : .58; length = outer ? 1.13 : .83; fold = outer ? .42 : -1.01;
          } else if (form === 'dahlia') {
            const layer = Math.floor(petal / 8); angle = petal % 8 * TAU / 8 + layer * .26;
            width = .59 - layer * .11; length = .94 - layer * .22; fold = -.06 - layer * .29;
          } else {
            angle = petal * TAU / 6; width = .86; length = 1.1; fold = petal % 2 ? -.16 : -.05;
          }
          fold = mix(-1.29, fold, bloom);
          put(item.sourcePetals, sourcePetalIndex, sx, SOURCE_HEIGHT, sz, width * petalBody, petalBody, length * petalBody, fold, angle, 0);
          pale.copy(sourceColor).lerp(sourceIndex ? cream : low, .18 + petal % 3 * .07).lerp(cream, .14);
          item.sourcePetals.setColorAt(sourcePetalIndex++, pale);
          if (!hasSourceDust) continue;
          // Full-sized, unfolded samples survive the petal's dissolution.
          dummy.position.set(sx, SOURCE_HEIGHT, sz); dummy.scale.set(width, 1, length); dummy.rotation.set(fold, angle, 0); dummy.updateMatrix(); sourceMatrix.copy(dummy.matrix);
          for (let grain = 0; grain < samplesPerPetal && sourceDustIndex < DUST_CAPACITY; grain++) {
            const seed = (petal * samplesPerPetal + grain) / (petalCount * samplesPerPetal), u = .26 + grain / Math.max(1, samplesPerPetal - 1) * .68;
            const v = ((petal + grain) % 3 - 1) * .48;
            sourceSample.set(v * Math.sin(u * Math.PI) * .145, Math.sin(u * Math.PI) * .14 - u * u * .06, u * .37).applyMatrix4(sourceMatrix);
            const routes = item.routes[sourceIndex], route = routes?.length ? routes[(petal + grain) % routes.length] : null;
            const routeLength = route?.length || 0;
            const launch = age - SOURCE_CYCLE.unfurl - seed * .52;
            let distance = launch < .75 ? launch / .75 - 1 : ((launch - .75) * .95) % (routeLength + .65);
            let returning = 0;
            if (age >= SOURCE_CYCLE.return) {
              returning = THREE.MathUtils.smoothstep(age, SOURCE_CYCLE.return, SOURCE_CYCLE.whole);
              const atReturn = ((SOURCE_CYCLE.return - SOURCE_CYCLE.unfurl - seed * .52 - .75) * .95) % (routeLength + .65);
              distance = mix(Math.min(routeLength, atReturn), -1, returning);
            }
            let px, py, pz, size = .67;
            if (distance < 0) {
              const petalFraction = clamp(-distance, 0, 1);
              px = mix(sx, sourceSample.x, petalFraction); py = mix(LETTER_LAYOUT.flow, sourceSample.y, petalFraction); pz = mix(sz, sourceSample.z, petalFraction);
              size *= age < SOURCE_CYCLE.return ? THREE.MathUtils.smoothstep(launch, -.15, .2) : 1 - THREE.MathUtils.smoothstep(returning, .76, 1);
            } else if (routeLength && distance < routeLength) {
              const edge = route[Math.min(routeLength - 1, Math.floor(distance))], along = distance % 1;
              px = mix(localX(letter, edge.from[0]), localX(letter, edge.to[0]), along);
              pz = mix(localZ(letter, edge.from[1]), localZ(letter, edge.to[1]), along); py = LETTER_LAYOUT.flow;
              const leak = letter.leaks?.some(hole => hole.c === edge.to[0] && hole.r === edge.to[1]);
              if (leak) { py -= along * .065; size *= Math.max(.05, 1 - along * .94); }
              else size *= .55 + .45 * Math.min(1, distance * 4, (routeLength - distance) * 4);
            } else { px = sx; py = LETTER_LAYOUT.flow; pz = sz; size = 0; }
            put(dust, sourceDustIndex, px, py, pz, size, size, size); dust.setColorAt(sourceDustIndex++, pale.copy(sourceColor).lerp(cream, grain % 2 ? .10 : .02));
          }
        }
      }
      item.sourcePetals.count = sourcePetalIndex;
      item.sourcePetals.instanceMatrix.needsUpdate = item.sourcePearls.instanceMatrix.needsUpdate = true;
      item.sourcePetals.instanceColor.needsUpdate = item.sourcePearls.instanceColor.needsUpdate = true;
      item.sourceDustCount = sourceDustIndex - item.sourceDustStart;
      if (board.visible) { dust.count = sourceDustIndex; dust.instanceMatrix.needsUpdate = true; if (dust.instanceColor) dust.instanceColor.needsUpdate = true; }

      let petalIndex = 0;
      for (const [index, goal] of goals.entries()) {
        const committed = entry.choice === goal.id, preview = board.visible && evaluation.ready.includes(goal.id), target = committed ? 1 : preview ? .76 : .04;
        goal.opening = reducedMotion || !delta ? target : mix(goal.opening, target, 1 - Math.exp(-delta * 4));
        const open = goal.opening;
        // Growth remains after leaving the board and after later rotations.
        // A preview unfolds the flower; only a kept choice restores the object.
        const grown = committed ? 1 : preview ? .65 : goal.id === 'tree' ? .21 : .12;
        goal.growth.scale.set(grown, goal.id === 'lamp' ? Math.max(.10, grown) : grown, grown);
        const flowerX = goal.x + goal.flowerOffsetX, flowerY = .12 + goal.flowerHeight * (.48 + open * .52);
        for (let petal = 0; petal < 12; petal++) {
          const outer = petal >= 6, a = (petal % 6) * TAU / 6 + (outer ? .38 : 0), reach = .38 + open * .62, fold = mix(-1.36, -.12, open);
          put(petals, petalIndex, flowerX, flowerY, goal.z, reach * (outer ? 1 : .76), reach, reach * (outer ? 1 : .8), fold, a, 0);
          pale.copy(color).lerp(second, letter.id === 'tide' && petal % 2 ? .78 : 0).lerp(cream, outer ? .24 : .42);
          if (!committed && !preview) pale.lerp(charcoal, .52);
          petals.setColorAt(petalIndex++, pale);
        }
        put(hearts, index, flowerX, flowerY + .023, goal.z, .045 + open * .035, .024 + open * .012, .045 + open * .035);
        const stemHeight = flowerY - .12;
        put(stems, index, flowerX, .12 + stemHeight / 2, goal.z, 1, stemHeight, 1);
        stems.setColorAt(index, pale.set(0x719579));
      }
      petals.count = petalIndex; petals.instanceMatrix.needsUpdate = hearts.instanceMatrix.needsUpdate = stems.instanceMatrix.needsUpdate = true;
      petals.instanceColor.needsUpdate = stems.instanceColor.needsUpdate = true;
    }
    group.updateMatrixWorld(true);
  }

  function pick(raycaster) {
    if (disposed || !group.visible) return null;
    group.updateMatrixWorld(true);
    const objects = courts.filter(item => item.board.visible).flatMap(item => item.tileGroups.map(t => t.stones));
    const hits = raycaster.intersectObjects(objects, false);
    if (!hits.length) return null;
    const hit = hits[0], tile = hit.object.userData.tiles[hit.instanceId];
    return tile ? { letterId: hit.object.userData.letterId, tileId: tile.id } : null;
  }
  function burstSource(id = activeId) {
    if (disposed) return false;
    const item = courts.find(court => court.letter.id === id && court.board.visible && court.unlocked);
    if (!item) return false;
    item.sourceTime = 0; item.sourceCycling = true; item.sourcePhase = 'unfurling'; return true;
  }
  function pickSource(raycaster) {
    if (disposed || !group.visible) return null;
    // Keep the source clickable while its petals are temporarily in flight.
    // This fixed local hit volume owns no GPU geometry or render pass.
    group.updateMatrixWorld(true);
    let closest = Infinity, found = null;
    for (const item of courts) if (item.board.visible) for (const source of item.letter.sources) {
      sourcePickSphere.center.set(localX(item.letter, source.c), SOURCE_HEIGHT, localZ(item.letter, source.r)).applyMatrix4(item.court.matrixWorld);
      if (!raycaster.ray.intersectSphere(sourcePickSphere, sourcePickPoint)) continue;
      const distance = raycaster.ray.origin.distanceTo(sourcePickPoint);
      if (distance < closest && distance >= raycaster.near && distance <= raycaster.far) { closest = distance; found = item.letter.id; }
    }
    return found;
  }
  function snapshot() {
    let drawCalls = 0; group.traverseVisible(object => { if (object.isMesh && (!object.isInstancedMesh || object.count > 0)) drawCalls++; });
    const active = courts.find(item => item.board.visible);
    return { activeId, disposed, drawCalls, resources: resources.size, sourcePhase: active?.sourcePhase || 'whole', sourceTime: active?.sourceTime || 0,
      gardens: courts.map(item => ({ id: item.letter.id, active: item.board.visible, unlocked: item.unlocked, choice: item.entry?.choice || null,
        ready: [...(item.evaluation?.ready || [])], powered: Object.keys(item.evaluation?.powered || {}),
        edges: item.evaluation?.edges.length || 0, leaks: item.evaluation?.leaks.length || 0,
        particles: item.board.visible ? item.dust.count : 0,
        sourcePhase: item.sourcePhase, sourceTime: item.sourceTime, sourceForm: item.sourceForm, sourceReducedMotion: item.sourceReducedMotion,
        sourceDustStart: item.sourceDustStart, sourceDustCount: item.sourceDustCount,
        sources: item.letter.sources.map((source, index) => ({ index, ...letterSourcePosition(item.letter, source), petals: SOURCE_FORMS[item.sourceForm] })),
        tiles: item.letter.tiles.map(tile => ({ id: tile.id, ...letterTilePosition(item.letter, tile), locked: tile.locked })),
        goals: item.goals.map(goal => ({ id: goal.id, opening: goal.opening, kept: item.entry?.choice === goal.id })),
      })) };
  }
  function dispose() {
    if (disposed) return; disposed = true;
    // InstancedMesh owns GPU instance buffers independently of its geometry.
    group.traverse(object => { if (object.isInstancedMesh) object.dispose(); });
    for (const resource of resources) resource.dispose(); resources.clear(); group.clear(); group.removeFromParent();
  }
  update(0, 0);
  return { group, update, pick, pickSource, burstSource, snapshot, dispose };
}
