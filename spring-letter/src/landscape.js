import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// A small, walkable landscape, not a backdrop. The rendered triangles are also
// the source of truth for supportAt; no invisible discs beneath sculpted hills.
const TAU = Math.PI * 2;
const STEP = .25;
const clamp = THREE.MathUtils.clamp;
const smooth = value => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };
// A rear grove, not a curtain between the player and the rain channels.
// The west-hand spring and both east-hand pools need an uninterrupted sky view.
const WILLOWS = [[-14.8, -3.35, 3.35, -2.45], [-12.55, -4.25, 3.05, -1.55], [-9.05, -3.8, 2.35, -.35]];

export const LANDSCAPE_TARGETS = Object.freeze([
  Object.freeze({ id: 'rain-grove', key: 'rain', title: '听雨春庭', x: -12, z: -1, height: 1.6, radius: 2.1, need: 0 }),
  Object.freeze({ id: 'wind-terrace', key: 'wind', title: '逆风春庭', x: 12, z: -16, height: 2.5, radius: 2.1, need: 1 }),
  Object.freeze({ id: 'tide-vault', key: 'tide', title: '回声春庭', x: -12, z: -29, height: 1.1, radius: 2.1, need: 2 }),
]);

const point = (x, z, height) => Object.freeze({ x, z, height });
export const LANDSCAPE_ROUTES = Object.freeze([
  Object.freeze({ id: 'rain-out', target: 'rain-grove', points: Object.freeze([
    point(-5, 1, .12), point(-7.5, 2, .25), point(-10, 2.2, 1.2), point(-12, -1, 1.6),
  ]) }),
  Object.freeze({ id: 'rain-back', target: 'rain-grove', points: Object.freeze([
    point(-12, -1, 1.6), point(-10.3, -4, 1.3), point(-7, -3, .28), point(-5, -2.5, .12),
  ]) }),
  Object.freeze({ id: 'wind-out', target: 'wind-terrace', points: Object.freeze([
    point(4.5, -15, .12), point(7, -12, .45), point(10, -12.7, 1.8), point(12, -16, 2.5),
  ]) }),
  Object.freeze({ id: 'wind-back', target: 'wind-terrace', points: Object.freeze([
    point(12, -16, 2.5), point(10.2, -19, 1.8), point(7, -20, .4), point(4.5, -18, .12),
  ]) }),
  Object.freeze({ id: 'tide-out', target: 'tide-vault', points: Object.freeze([
    point(-5, -29, .12), point(-7, -29, .3), point(-8.6, -31, .7), point(-12, -29, 1.1),
  ]) }),
]);

const PATCHES = [
  { ...LANDSCAPE_TARGETS[0], rx: 4.1, rz: 3.8, width: 1.22, safe: 'garden', bounds: [-17, -3, -6.5, 4.8], color: 0x436c5d },
  { ...LANDSCAPE_TARGETS[1], rx: 4.15, rz: 4.0, width: 1.28, safe: 'wind', bounds: [3, 17.5, -22, -10.2], color: 0x5b765e },
  { ...LANDSCAPE_TARGETS[2], rx: 3.8, rz: 3.3, width: 1.2, safe: 'pool', bounds: [-17, -3.5, -34, -25], color: 0x486c73 },
].map(patch => ({ ...patch, routes: LANDSCAPE_ROUTES.filter(route => route.target === patch.id) }));

function seeded(seed = 76193) {
  return () => { seed = Math.imul(seed ^ seed >>> 15, 1 | seed); seed ^= seed + Math.imul(seed ^ seed >>> 7, 61 | seed); return ((seed ^ seed >>> 14) >>> 0) / 4294967296; };
}

function nearestRoute(x, z, routes) {
  let closest = { distance: Infinity, height: .12, direction: 0 };
  for (const route of routes) for (let i = 1; i < route.points.length; i++) {
    const a = route.points[i - 1], b = route.points[i];
    const dx = b.x - a.x, dz = b.z - a.z;
    const t = clamp(((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz), 0, 1);
    const distance = Math.hypot(x - a.x - dx * t, z - a.z - dz * t);
    if (distance < closest.distance) closest = { distance, height: a.height + (b.height - a.height) * smooth(t), direction: Math.atan2(dx, dz) };
  }
  return closest;
}

function landSample(x, z, patch) {
  const dx = x - patch.x, dz = z - patch.z;
  const r = Math.hypot(dx, dz), angle = Math.atan2(dz, dx);
  const outer = 1 / Math.hypot(Math.cos(angle) / patch.rx, Math.sin(angle) / patch.rz)
    * (1 + .055 * Math.sin(angle * 3 + .7) + .025 * Math.sin(angle * 7));
  const islandField = outer - r;
  const route = nearestRoute(x, z, patch.routes);
  const routeField = patch.width - route.distance;
  const field = Math.max(islandField, routeField);
  const islandHeight = patch.height * (1 - smooth((r - patch.radius - .28) / (outer - patch.radius - .28)))
    - .14 * smooth((r - outer + .5) / .5);
  const routeHeight = route.height * (1 - smooth((route.distance - patch.width * .61) / (patch.width * .39)))
    - .14 * smooth((route.distance - patch.width + .3) / .3);
  // Extend both height fields through the shoreline. Switching to a sentinel
  // outside the footprint makes clipped triangle edges acquire sawtooth heights.
  let height = Math.max(islandHeight, routeHeight);
  if (r <= patch.radius + .18) height = patch.height;
  return { x, z, height, field, routeDistance: route.distance, r };
}

function clipTriangle(vertices) {
  const result = [];
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i], b = vertices[(i + 1) % vertices.length];
    if (a.field >= 0) result.push(a);
    if ((a.field >= 0) !== (b.field >= 0)) {
      const t = a.field / (a.field - b.field);
      result.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t,
        height: a.height + (b.height - a.height) * t, field: 0,
        routeDistance: a.routeDistance + (b.routeDistance - a.routeDistance) * t,
        r: a.r + (b.r - a.r) * t });
    }
  }
  return result;
}

function triangleHeight(x, z, a, b, c) {
  const denominator = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
  if (Math.abs(denominator) < 1e-10) return null;
  const u = ((b.z - c.z) * (x - c.x) + (c.x - b.x) * (z - c.z)) / denominator;
  const v = ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / denominator;
  if (u < -1e-7 || v < -1e-7 || u + v > 1 + 1e-7) return null;
  return a.height * u + b.height * v + c.height * (1 - u - v);
}

function createTerrain(patch, material) {
  const [minX, maxX, minZ, maxZ] = patch.bounds;
  const columns = Math.ceil((maxX - minX) / STEP), rows = Math.ceil((maxZ - minZ) / STEP);
  const positions = [], colors = [], uv = [], indices = [], vertices = [], cache = new Map(), cells = new Map(), edges = new Map();
  const moss = new THREE.Color(patch.color), path = new THREE.Color(0xccb99b), rim = new THREE.Color(0x3f5865), stone = new THREE.Color(0x344a55);
  function vertex(v) {
    const key = `${v.x.toFixed(6)}:${v.z.toFixed(6)}`;
    if (cache.has(key)) return cache.get(key);
    const index = vertices.length;
    cache.set(key, index); vertices.push(v); positions.push(v.x, v.height, v.z); uv.push(v.x * .25, v.z * .25);
    const wear = (1 - smooth(v.routeDistance / .85)) * (1 - smooth((2.5 - v.r) / .5));
    const color = moss.clone().lerp(path, wear * .8).lerp(rim, 1 - smooth(v.field / .65));
    const broadVariation = Math.sin(v.x * .71 + v.z * .34) * Math.cos(v.z * .83 - v.x * .27) * .065;
    const shade = patch.need === 0 ? Math.max(...WILLOWS.map(([x, z]) => Math.exp(-((v.x - x) ** 2 + (v.z - z) ** 2) / 2.7))) * .22 : 0;
    color.multiplyScalar(.94 + broadVariation + Math.sin(v.x * 4.1 + v.z * 3.7) * Math.cos(v.z * 5.3) * .035 - shade);
    colors.push(color.r, color.g, color.b);
    return index;
  }
  for (let iz = 0; iz < rows; iz++) for (let ix = 0; ix < columns; ix++) {
    const x = minX + ix * STEP, z = minZ + iz * STEP;
    const p = [landSample(x, z, patch), landSample(x + STEP, z, patch), landSample(x + STEP, z + STEP, patch), landSample(x, z + STEP, patch)];
    const triangles = [];
    for (const source of [[p[0], p[3], p[1]], [p[1], p[3], p[2]]]) {
      const clipped = clipTriangle(source);
      for (let k = 1; k < clipped.length - 1; k++) {
        const tri = [clipped[0], clipped[k], clipped[k + 1]];
        if (Math.abs((tri[1].x - tri[0].x) * (tri[2].z - tri[0].z) - (tri[2].x - tri[0].x) * (tri[1].z - tri[0].z)) < 1e-8) continue;
        const ids = tri.map(vertex); indices.push(...ids); triangles.push(tri);
        for (let e = 0; e < 3; e++) {
          const a = ids[e], b = ids[(e + 1) % 3], key = a < b ? `${a}:${b}` : `${b}:${a}`;
          if (edges.has(key)) edges.delete(key); else edges.set(key, [a, b]);
        }
      }
    }
    if (triangles.length) cells.set(iz * columns + ix, triangles);
  }
  const topIndexCount = indices.length;
  for (const [a, b] of edges.values()) {
    const av = vertices[a], bv = vertices[b], index = positions.length / 3;
    const depth = -.64;
    positions.push(av.x, av.height, av.z, bv.x, bv.height, bv.z, av.x, depth, av.z, bv.x, depth, bv.z);
    uv.push(av.x * .25, av.height * .25, bv.x * .25, bv.height * .25, av.x * .25, depth * .25, bv.x * .25, depth * .25);
    for (let i = 0; i < 4; i++) {
      const c = i < 2 ? rim : stone;
      colors.push(c.r, c.g, c.b);
    }
    indices.push(index, index + 1, index + 2, index + 1, index + 3, index + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals(); geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `${patch.id}-ground`; mesh.receiveShadow = true;
  mesh.userData.walkableTerrain = true; mesh.userData.topIndexCount = topIndexCount;
  function heightAt(x, z) {
    const ix = Math.floor((x - minX) / STEP), iz = Math.floor((z - minZ) / STEP);
    if (ix < 0 || ix >= columns || iz < 0 || iz >= rows) return null;
    const triangles = cells.get(iz * columns + ix);
    if (!triangles) return null;
    for (const tri of triangles) {
      const height = triangleHeight(x, z, ...tri);
      if (height !== null) return height;
    }
    return null;
  }
  return { mesh, heightAt, patch };
}

function leafGeometry(length = .4, width = .07, segments = 6) {
  const positions = [], uv = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, w = Math.sin(Math.PI * t) * width;
    for (const side of [-1, 1]) {
      positions.push(side * w, t * length, Math.sin(t * Math.PI) * length * .13 + side * w * t * .35);
      uv.push(side < 0 ? 0 : 1, t);
    }
    if (i < segments) { const j = i * 2; indices.push(j, j + 1, j + 2, j + 1, j + 3, j + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(indices); g.computeVertexNormals();
  return g;
}

// A folded midrib gives these narrow leaves two light-catching faces. At this
// scale the taper and curl matter more than a broad, flat leaf billboard.
function willowLeafGeometry() {
  const positions = [], uv = [], indices = [], segments = 7;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, envelope = Math.pow(Math.sin(t * Math.PI), .85);
    for (let j = 0; j < 3; j++) {
      const side = j - 1;
      positions.push(side * envelope * .026, t * .235,
        Math.sin(t * Math.PI) * .021 + t * t * .038 + (1 - Math.abs(side)) * envelope * .012);
      uv.push(j / 2, t);
    }
    if (i < segments) for (let j = 0; j < 2; j++) {
      const a = i * 3 + j; indices.push(a, a + 1, a + 3, a + 1, a + 4, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}

function fernGeometry() {
  const parts = [];
  for (let f = 0; f < 5; f++) {
    const yaw = f * 2.39996, length = .26 + (f % 3) * .055;
    for (let i = 1; i < 7; i++) for (const side of [-1, 1]) {
      const t = i / 7, g = leafGeometry(.065 * Math.sin(t * Math.PI) + .025, .014, 3);
      g.rotateZ(side * 1.03); g.rotateX(.9);
      g.translate(side * .014, Math.sin(t * 2) * length * .52, t * length);
      g.rotateY(yaw); parts.push(g);
    }
  }
  const geometry = mergeGeometries(parts, false); parts.forEach(g => g.dispose()); return geometry;
}

function arcGeometry(rx, ry, thickness, depth, start, end) {
  const outer = [], inner = [], count = Math.max(8, Math.ceil((end - start) * 18));
  for (let i = 0; i <= count; i++) {
    const a = start + (end - start) * i / count;
    outer.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * ry));
    inner.push(new THREE.Vector2(Math.cos(a) * (rx - thickness), Math.sin(a) * (ry - thickness)));
  }
  const shape = new THREE.Shape(); shape.moveTo(outer[0].x, outer[0].y);
  for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i].x, outer[i].y);
  for (let i = inner.length - 1; i >= 0; i--) shape.lineTo(inner[i].x, inner[i].y);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .055, bevelThickness: .05, curveSegments: 20 });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function hullGeometry(length) {
  const positions = [], uv = [], indices = [], along = 28, across = 12;
  for (let i = 0; i <= along; i++) for (let j = 0; j <= across; j++) {
    const t = i / along, v = j / across * 2 - 1;
    const width = Math.pow(Math.sin(t * Math.PI), .75) * length * .16;
    const prow = Math.pow(Math.abs(t - .5) * 2, 3) * length * .075;
    positions.push((t - .5) * length, -.25 + prow + v * v * width * .33, v * width);
    uv.push(t, j / across);
    if (i < along && j < across) { const a = i * (across + 1) + j; indices.push(a, a + 1, a + across + 1, a + 1, a + across + 2, a + across + 1); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function grassClumpGeometry() {
  const parts = [];
  for (let i = 0; i < 6; i++) {
    const g = leafGeometry(.31 + i % 3 * .04, .012 + (i % 2) * .003, 3), a = i * 2.39996;
    g.rotateZ(Math.sin(a) * .24); g.rotateY(a); g.translate(Math.cos(a) * .05, 0, Math.sin(a) * .05); parts.push(g);
  }
  const merged = mergeGeometries(parts, false); for (const part of parts) part.dispose();
  return merged;
}

function cragGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 2), p = geometry.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const strata = 1 + .06 * Math.sin(y * 15 + x * 2) + .08 * Math.sin(x * 4 + z * 3);
    p.setXYZ(i, x * strata, y * (1 + .06 * Math.cos(x * 3 - z * 7)), z * strata);
  }
  const welded = mergeVertices(geometry, 1e-5); geometry.dispose();
  welded.computeVertexNormals(); return welded;
}

export function createLandscape() {
  const group = new THREE.Group(); group.name = 'walkable-spring-landscape';
  const materials = [], geometryBatches = new Map(), geometries = new Set(), rand = seeded();
  const timeUniform = { value: 0 }, windUniform = { value: 1 };
  const mat = (color, options = {}) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: .84, metalness: .035, ...options });
    materials.push(material); return material;
  };
  const groundMat = mat(0xffffff, { vertexColors: true });
  const limestone = mat(0xb39e80, { roughness: .76, vertexColors: true });
  const slate = mat(0x2d4654, { roughness: .92, vertexColors: true });
  const pebble = mat(0x81928c, { roughness: .96 });
  const wood = mat(0x59665e, { roughness: .94, vertexColors: true });
  const copper = mat(0xa9855d, { metalness: .65, roughness: .38, vertexColors: true });
  const silverLeaf = mat(0x799e8b, { side: THREE.DoubleSide, roughness: .52, metalness: .12 });
  const grassMat = mat(0x779982, { side: THREE.DoubleSide, roughness: .8 });
  const gauze = mat(0xc9bb9c, { side: THREE.DoubleSide, roughness: .68, transparent: true, opacity: .83 });
  gauze.forceSinglePass = true;
  const gold = mat(0xd9bc83, { emissive: 0xb88844, emissiveIntensity: .23, roughness: .4, metalness: .4 });
  const rewardMat = mat(0xe4cead, { emissive: 0xd9a775, emissiveIntensity: .65, roughness: .42, metalness: .22, side: THREE.DoubleSide });
  for (const material of [silverLeaf, grassMat, gauze]) {
    material.onBeforeCompile = shader => {
      shader.uniforms.landTime = timeUniform; shader.uniforms.landWind = windUniform;
      shader.vertexShader = `uniform float landTime; uniform float landWind;\n${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        float plantHeight = max(0.0, position.y);
        vec3 landAnchor = vec3(0.0);
        #ifdef USE_INSTANCING
          landAnchor = instanceMatrix[3].xyz;
        #endif
        float landPhase = landAnchor.x * .73 + landAnchor.z * .41;
        transformed.x += sin(landTime * 1.1 + landPhase + plantHeight * 1.5) * plantHeight * .08 * landWind;
        transformed.z += sin(landTime * .7 + landPhase * 1.7) * plantHeight * .045 * landWind;
      `);
    };
    material.customProgramCacheKey = () => 'spring-landscape-sway-1';
  }
  const terrain = PATCHES.map(patch => createTerrain(patch, groundMat));
  for (const item of terrain) { group.add(item.mesh); geometries.add(item.mesh.geometry); }
  const findHeight = (x, z) => {
    for (const item of terrain) { const h = item.heightAt(x, z); if (h !== null) return h; }
    return -.12;
  };
  const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), position = new THREE.Vector3();
  function batch(geometry, material, xyz = [0, 0, 0], rotation = [0, 0, 0], size = [1, 1, 1], tint = 0xffffff) {
    quaternion.setFromEuler(new THREE.Euler(...rotation)); position.set(...xyz); scale.set(...size); matrix.compose(position, quaternion, scale);
    const g = geometry.index ? geometry.toNonIndexed() : geometry.clone(); g.applyMatrix4(matrix);
    geometry.dispose();
    const color = new THREE.Color(tint), data = new Float32Array(g.getAttribute('position').count * 3);
    for (let i = 0; i < data.length; i += 3) { data[i] = color.r; data[i + 1] = color.g; data[i + 2] = color.b; }
    g.setAttribute('color', new THREE.BufferAttribute(data, 3));
    if (!geometryBatches.has(material)) geometryBatches.set(material, []);
    geometryBatches.get(material).push(g);
  }
  const tube = (points, radius, material, segments = 18, tint = 0xffffff) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    batch(new THREE.TubeGeometry(curve, segments, radius, 5, false), material, [0, 0, 0], [0, 0, 0], [1, 1, 1], tint);
  };
  const branch = (points, radius, tip, segments = 24, tint = 0xffffff, radialSegments = 7) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geometry = new THREE.TubeGeometry(curve, segments, radius, radialSegments, false), attr = geometry.getAttribute('position');
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, center = curve.getPointAt(t), ratio = 1 - smooth(t) * (1 - tip / radius);
      for (let j = 0; j <= radialSegments; j++) {
        const index = i * (radialSegments + 1) + j;
        attr.setXYZ(index, center.x + (attr.getX(index) - center.x) * ratio,
          center.y + (attr.getY(index) - center.y) * ratio, center.z + (attr.getZ(index) - center.z) * ratio);
      }
    }
    geometry.computeVertexNormals(); batch(geometry, wood, [0, 0, 0], [0, 0, 0], [1, 1, 1], tint); return curve;
  };
  function instanced(name, geometry, material, items) {
    const mesh = new THREE.InstancedMesh(geometry, material, items.length); mesh.name = name;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < items.length; i++) {
      const item = items[i]; dummy.position.set(...item.position); dummy.rotation.set(...(item.rotation || [0, 0, 0]));
      dummy.scale.set(...(item.scale || [1, 1, 1])); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      if (item.color) mesh.setColorAt(i, new THREE.Color(item.color));
    }
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere();
    mesh.castShadow = false; group.add(mesh); geometries.add(geometry); return mesh;
  }

  // Unequal, outward-growing crowns frame the back of the rain court. Leaves
  // are paired along curved twigs rather than distributed as large loose cards.
  const leaves = [], lanterns = [];
  for (const [x, z, h, angle] of WILLOWS) {
    const y = findHeight(x, z), bendX = Math.cos(angle) * .36, bendZ = Math.sin(angle) * .3;
    branch([[x, y, z], [x + .065, y + h * .28, z], [x + bendX * .5, y + h * .7, z + bendZ], [x + bendX, y + h, z + bendZ]], .075 + h * .018, .013, 28);
    for (let b = 0; b < 7; b++) {
      const a = angle + (b / 6 - .5) * 2.4 + (rand() - .5) * .28;
      const reach = (.68 + rand() * .78) * h / 3.1;
      const bx = x + bendX + Math.cos(a) * reach, bz = z + bendZ + Math.sin(a) * reach;
      const by = y + h * (.58 + rand() * .22);
      const fork = .46 + b / 7 * .3, crown = y + h * (.79 + rand() * .18);
      const twig = branch([[x + bendX * .5, y + h * fork, z + bendZ * .5], [x + bendX + Math.cos(a) * reach * .46, crown, z + bendZ + Math.sin(a) * reach * .55], [bx, by, bz]], .034 + h * .004, .003, 18, 0xb9c4b5);
      for (let l = 0; l < 13; l++) {
        const p = twig.getPointAt(.35 + l / 21), side = l % 2 ? 1 : -1;
        leaves.push({ position: [p.x, p.y, p.z], rotation: [1.9, a + side * .65, side * .58], scale: [.8, .72 + rand() * .2, .8], color: new THREE.Color(0x91af97) });
      }
      const strands = 4 + (b % 3 === 0 ? 1 : 0);
      for (let strand = 0; strand < strands; strand++) {
        const along = .42 + strand / (strands + 1) * .68, root = twig.getPointAt(along);
        const sx = root.x, sz = root.z, sy = root.y;
        const drop = (.48 + rand() * .73) * h / 3.1, sweep = .1 + rand() * .13;
        const spray = branch([[sx, sy, sz], [sx + Math.cos(a) * sweep, sy - drop * .42, sz + Math.sin(a) * sweep], [sx + Math.cos(a) * sweep * .65, sy - drop, sz + Math.sin(a) * sweep * .65]], .007, .0015, 9, 0xc1c4a9, 4);
        const leafCount = 9 + Math.floor(drop * 5);
        for (let l = 0; l < leafCount; l++) for (const side of [-1, 1]) {
          const f = .08 + l / leafCount * .88, p = spray.getPointAt(f);
          const leafScale = (.78 + rand() * .33) * (1 - f * .25);
          leaves.push({ position: [p.x, p.y - (side > 0 ? .025 : 0), p.z],
            rotation: [2.4 + rand() * .28, a + side * (.65 + rand() * .3), side * (.45 + rand() * .27)],
            scale: [leafScale, leafScale, leafScale], color: new THREE.Color().setHSL(.39 + rand() * .035, .16 + rand() * .12, .43 + rand() * .18) });
        }
        if (strand === strands - 1 && b % 3 === 0) {
          const end = spray.getPointAt(1); lanterns.push({ position: [end.x, end.y - .018, end.z], scale: [.018, .035, .018] });
        }
      }
    }
    for (let r = 0; r < 4; r++) {
      const a = angle + r * 1.5, rx = x + Math.cos(a) * .45, rz = z + Math.sin(a) * .4;
      tube([[rx, findHeight(rx, rz) + .015, rz], [x + Math.cos(a) * .2, y + .055, z + Math.sin(a) * .18], [x, y + .22, z]], .045, wood, 8);
    }
  }
  const willowLeaves = instanced('rain-willow-leaves', willowLeafGeometry(), silverLeaf, leaves);
  willowLeaves.castShadow = true;
  const foliageDepth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  foliageDepth.onBeforeCompile = silverLeaf.onBeforeCompile;
  foliageDepth.customProgramCacheKey = silverLeaf.customProgramCacheKey;
  materials.push(foliageDepth); willowLeaves.customDepthMaterial = foliageDepth;
  instanced('hanging-dew', new THREE.SphereGeometry(1, 6, 4), gold, lanterns);

  // A deliberately incomplete gateway on the high court. It is a silhouette
  // seen across the water and a threshold the player can actually walk behind.
  const windBase = findHeight(13, -19);
  batch(arcGeometry(2.65, 4.2, .38, .48, .1, 1.17), limestone, [12.9, windBase + .1, -19.05], [0, .2, 0], [1, 1, 1], 0xc2bdab);
  batch(arcGeometry(2.65, 4.2, .38, .48, 1.42, Math.PI - .02), limestone, [12.9, windBase + .1, -19.05], [0, .2, 0]);
  const outerFootX = 12.9 + Math.cos(.2) * 2.46 * Math.cos(.1);
  const outerFootZ = -19.05 - Math.sin(.2) * 2.46 * Math.cos(.1);
  const outerFootTop = windBase + .1 + Math.sin(.1) * 4.01;
  const outerFootBottom = Math.min(-.28, findHeight(outerFootX, outerFootZ));
  batch(new THREE.BoxGeometry(.78, outerFootTop - outerFootBottom + .09, .72), slate,
    [outerFootX, (outerFootTop + outerFootBottom) / 2, outerFootZ], [0, .2, 0], [1, 1, 1], 0xbbc6ba);
  batch(new THREE.BoxGeometry(1.08, .18, 1.05), limestone,
    [outerFootX, -.17, outerFootZ], [0, .27, .015], [1, 1, 1], 0x9cafa9);
  batch(new THREE.BoxGeometry(.7, .22, .85), slate, [10.3, findHeight(10.3, -18.5) + .12, -18.5], [0, .3, -.06]);
  batch(new THREE.BoxGeometry(.52, .85, .7), limestone, [14.6, findHeight(14.6, -18.4) + .3, -18.4], [0, .4, .18], [1, 1, 1], 0xa9b1a6);
  // Three reed-coloured wind vanes, each unique in height and orientation.
  const sails = [];
  for (const [x, z, h, angle] of [[14.8, -15.1, 3.7, -.3], [14.4, -13.8, 2.7, .2], [10.7, -12.1, 2.0, -.6]]) {
    const y = findHeight(x, z);
    tube([[x, y, z], [x + .15, y + h * .5, z], [x + .5, y + h, z + .1]], .026, copper, 13);
    sails.push({ position: [x + .18, y + h * .34, z], rotation: [0, angle, -.15], scale: [5.8, h * .55 / .4, 1] });
  }
  instanced('wind-court-sails', leafGeometry(.4, .09), gauze, sails);

  // The tidal court is reached from R only. Split archive ribs frame the water;
  // no bridge, slope or decorative ground crosses towards M or F.
  for (let i = 0; i < 3; i++) {
    const x = -13.4 - i * .22, z = -30.9 + i * .64, radius = 1.8 + i * .12, yaw = .8 + i * .07;
    const footX = x - Math.cos(yaw) * (radius - .12), footZ = z + Math.sin(yaw) * (radius - .12);
    const y = findHeight(footX, footZ);
    batch(arcGeometry(radius, 2.7 - i * .25, .24, .26, .24 + i * .12, Math.PI), limestone,
      [x, y + .02, z], [0, yaw, 0], [1, 1, 1], i % 2 ? 0xa4b3af : 0xc7c5b3);
    batch(new THREE.BoxGeometry(.46, .22, .5), limestone, [footX, y + .025, footZ], [0, yaw, .02], [1, 1, 1], 0x9cafa9);
  }
  for (let i = 0; i < 9; i++) {
    const x = -14.1 + rand() * 1.3, z = -27.5 + rand() * .7, y = findHeight(x, z);
    batch(new THREE.BoxGeometry(.58, .13 + rand() * .14, .32), slate, [x, y + .06, z], [0, -.3 + rand() * .6, .02], [1, 1, 1], 0xb5c3bc);
  }

  // Planting follows the same ground sampler. Thinly planted paths and dense
  // windward edges make route choice readable without luminous UI railings.
  const reeds = [], rocks = [], ferns = [], litter = [];
  for (const item of terrain) {
    const { patch } = item;
    const [minX, maxX, minZ, maxZ] = patch.bounds;
    let accepted = 0;
    for (let attempts = 0; attempts < 6000 && accepted < 290; attempts++) {
      const x = minX + rand() * (maxX - minX), z = minZ + rand() * (maxZ - minZ);
      const y = item.heightAt(x, z); if (y === null || y < -.04) continue;
      const sample = landSample(x, z, patch);
      if (sample.r < patch.radius + .2 || sample.routeDistance < .72 || sample.field < .18) continue;
      // Broad colonies leave patches of exposed earth between them. Random
      // blades alone read as a uniform ring around a mathematical mound.
      const colony = Math.sin(x * 2.1 + z * .62) * Math.sin(z * 1.83 - x * .38);
      if (rand() > .2 + Math.max(0, colony) * .95) continue;
      const edgeHeight = patch.need === 1 ? .57 : .29, h = .14 + rand() * edgeHeight;
      reeds.push({ position: [x, y + .015, z], rotation: [(rand() - .5) * .25, rand() * TAU, (rand() - .5) * .2], scale: [.8 + rand() * .9, h / .5, 1], color: new THREE.Color().setHSL(patch.need === 1 ? .15 : .38, .12 + rand() * .16, .33 + rand() * .25) });
      accepted++;
      if (accepted % 21 === 0 && patch.need !== 1) ferns.push({ position: [x, y + .025, z], rotation: [0, rand() * TAU, 0], scale: [.8, .72 + rand() * .4, .8], color: new THREE.Color(0x73917b) });
    }
    // Each shore has a few broken ledges, with companion chips below the main
    // stone. Their unequal groups interrupt the round bank without adding floor.
    for (let colony = 0; colony < 7; colony++) {
      const a = colony * 2.39996 + patch.need * .9;
      const radius = 1 / Math.hypot(Math.cos(a) / patch.rx, Math.sin(a) / patch.rz);
      const cx = patch.x + Math.cos(a) * radius * .92, cz = patch.z + Math.sin(a) * radius * .92;
      if (nearestRoute(cx, cz, patch.routes).distance < .9) continue;
      const count = 3 + colony % 3;
      for (let j = 0; j < count; j++) {
        const x = cx + (rand() - .5) * .8, z = cz + (rand() - .5) * .65, y = item.heightAt(x, z);
        if (y === null || nearestRoute(x, z, patch.routes).distance < .78) continue;
        const size = j === 0 ? .44 + rand() * .16 : .13 + rand() * .2;
        rocks.push({ position: [x, y - size * .08, z], rotation: [(rand() - .5) * .22, a + rand() * .5, (rand() - .5) * .18],
          scale: [size * 1.4, size * .37, size], color: new THREE.Color().setHSL(.44, .055, .38 + rand() * .14) });
      }
      if (patch.need !== 1) {
        const x = cx * .96 + patch.x * .04, z = cz * .96 + patch.z * .04, y = item.heightAt(x, z);
        if (y !== null) ferns.push({ position: [x, y + .02, z], rotation: [0, a, 0], scale: [1.15, .9, 1.15] });
      }
    }
  }
  instanced('shore-reeds', grassClumpGeometry(), grassMat, reeds);
  instanced('eroded-shore-stones', cragGeometry(), pebble, rocks);
  instanced('sheltered-shore-ferns', fernGeometry(), grassMat, ferns);

  // Small traces of a tended grove: curled leaf litter caught by tree roots and
  // a few fallen switches. Everything stays below the ankle and off the paths.
  for (const [x, z, , angle] of WILLOWS) {
    for (let i = 0; i < 25; i++) {
      const a = rand() * TAU, radius = .25 + rand() * .65;
      const lx = x + Math.cos(a) * radius, lz = z + Math.sin(a) * radius;
      const y = terrain[0].heightAt(lx, lz);
      if (y === null || nearestRoute(lx, lz, PATCHES[0].routes).distance < .7 || lz > -2.6) continue;
      litter.push({ position: [lx, y + .025, lz], rotation: [Math.PI / 2 + (rand() - .5) * .3, rand() * TAU, rand() * TAU],
        scale: [.75, .68 + rand() * .32, .65], color: new THREE.Color().setHSL(.13 + rand() * .05, .15, .4 + rand() * .15) });
    }
    const sx = x + Math.cos(angle + .8) * .6, sz = z + Math.sin(angle + .8) * .6;
    const ex = sx + Math.cos(angle) * .53, ez = sz + Math.sin(angle) * .53;
    const sy = terrain[0].heightAt(sx, sz), ey = terrain[0].heightAt(ex, ez);
    if (sy !== null && ey !== null) {
      tube([[sx, sy + .03, sz], [(sx + ex) / 2, (sy + ey) / 2 + .06, (sz + ez) / 2], [ex, ey + .025, ez]], .019, wood, 5, 0xaca995);
      tube([[(sx + ex) / 2, (sy + ey) / 2 + .06, (sz + ez) / 2], [ex + .14, ey + .03, ez - .1]], .009, wood, 3, 0xaca995);
    }
  }
  instanced('willow-root-leaf-litter', willowLeafGeometry(), silverLeaf, litter);

  // Only three low offshore masses, at unequal distances. They frame the
  // approach without repeating the small islands or obscuring their entrances.
  for (const [x, z, sx, sy, sz, angle] of [[9.8, 2.2, 1.7, 1.25, 2.2, -.3], [-17.9, 5.8, 1.4, 1.8, 2.0, .5], [-17.8, -24.8, 1.6, .9, 1.15, -.2]]) {
    batch(cragGeometry(), slate, [x, -.3, z], [0, angle, .13], [sx, sy, sz], 0x9cafab);
    batch(cragGeometry(), slate, [x + .8, -.55, z + .55], [0, angle + .8, -.18], [sx * .6, sy * .75, sz * .7], 0x7c9591);
  }

  // Unequal distant masses: a fallen seed vessel east, its smaller siblings
  // behind the western tide court. They stay clearly outside walkable terrain.
  function distantArk(x, z, length, yaw) {
    // Batched geometry is transformed directly; the virtual hull is an open,
    // asymmetrical seed, with visible ribs rather than another round pedestal.
    batch(hullGeometry(length), limestone, [x, 0, z], [0, yaw, 0], [1, 1, 1], 0x6d8b89);
    for (let i = 1; i < 6; i++) {
      const t = i / 6, lx = (t - .5) * length, radius = Math.pow(Math.sin(t * Math.PI), .75) * length * .16, ribPoints = [];
      for (let j = 0; j <= 10; j++) {
        const v = j / 5 - 1, p = new THREE.Vector3(lx, -.23 + Math.pow(Math.abs(t - .5) * 2, 3) * length * .075 + v * v * radius * .33, v * radius);
        p.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); ribPoints.push([x + p.x, p.y, z + p.z]);
      }
      tube(ribPoints, .035, copper, 14, 0x93ada4);
    }
    const points = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, v = new THREE.Vector3((t - .5) * length, -.22 + Math.pow(Math.abs(t - .5) * 2, 2) * .8, 0);
      v.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); points.push([x + v.x, v.y, z + v.z]);
    }
    tube(points, .1, wood, 22, 0x86a59d);
    for (let p = 0; p < 3; p++) {
      const local = new THREE.Vector3(length * .1 - p * .36, .12, p * .18).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      batch(leafGeometry(length * .36, length * .065), limestone, [x + local.x, local.y, z + local.z], [.1 + p * .18, yaw + .2, -.23 + p * .28], [1, 1, 1], 0x8fa7a0);
    }
  }
  distantArk(23, -30, 13, -.5); distantArk(-23, -39, 7.5, .2); distantArk(20, -49, 5.5, .6);

  // Warm flower accents are earned by the side-route interactions. Restoring a
  // save restores only the corresponding court, without changing progression.
  const rewards = {};
  for (const item of terrain) {
    const flowers = [];
    for (let i = 0; i < 36; i++) {
      const a = i * 2.39996, r = 2.5 + rand() * .68;
      const x = item.patch.x + Math.cos(a) * r, z = item.patch.z + Math.sin(a) * r;
      const y = item.heightAt(x, z); if (y === null) continue;
      for (let p = 0; p < 3; p++) flowers.push({ position: [x, y + .13, z], rotation: [.95, p * TAU / 3, 0], scale: [.6, .6, .6] });
    }
    const mesh = instanced(`${item.patch.key}-restored-flowers`, leafGeometry(.27, .085), rewardMat, flowers);
    mesh.visible = false; rewards[item.patch.key] = mesh;
  }
  for (const [material, parts] of geometryBatches) {
    const merged = mergeGeometries(parts, false);
    for (const part of parts) part.dispose();
    if (!merged) throw new Error('Landscape static geometry could not be merged.');
    const mesh = new THREE.Mesh(merged, material); mesh.name = 'landscape-architecture';
    mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); geometries.add(merged);
  }
  group.userData.expectedDrawCalls = 3 + 2 + 1 + 4 + 3 + geometryBatches.size;
  group.userData.targets = LANDSCAPE_TARGETS;
  let disposed = false, currentTime = 0;
  function supportAt(x, z, state = {}) {
    if (disposed || !Number.isFinite(x) || !Number.isFinite(z)) return null;
    for (const item of terrain) {
      if (item.patch.need === 1 && !state.p1?.solved) continue;
      if (item.patch.need === 2 && !state.wind?.solved) continue;
      const height = item.heightAt(x, z);
      if (height !== null) return { height, support: null, safe: item.patch.safe,
        ...(item.patch.safe === 'pool' ? { platform: 'R' } : {}), landmark: item.patch.id };
    }
    return null;
  }
  function update(time = 0, dt = 0, state = {}) {
    if (disposed) return;
    if (Number.isFinite(time)) currentTime = time;
    timeUniform.value = currentTime;
    windUniform.value = state.settings?.reducedMotion ? .2 : 1;
    for (const [key, mesh] of Object.entries(rewards)) mesh.visible = state.exploration?.[key]?.done === true;
  }
  // The caller owns these shared CC0 textures and their lifetime. Supplying or
  // replacing them must not mutate texture transforms used by another layer.
  function setSurfaceTextures(normal, roughness) {
    if (disposed) return;
    for (const [material, strength] of [[groundMat, .22], [pebble, .28], [slate, .26], [wood, .12]]) {
      material.normalMap = normal || null; material.roughnessMap = roughness || null;
      material.normalScale.set(strength, strength); material.needsUpdate = true;
    }
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    group.removeFromParent(); group.clear();
  }
  return { group, update, supportAt, targets: LANDSCAPE_TARGETS, routes: LANDSCAPE_ROUTES, setSurfaceTextures, dispose };
}
