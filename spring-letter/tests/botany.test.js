import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3, Matrix4, Triangle, Box3 } from 'three';

// Missing exports produce a descriptive assertion before any geometry is built.
const module = await import('../src/botany.js').catch(() => null);
function bouquet(options) {
  assert.equal(typeof module?.createBouquet, 'function', 'createBouquet must be implemented');
  return module.createBouquet(options);
}
function meshes(group) { const result = []; group.traverse(o => { if (o.isMesh) result.push(o); }); return result; }
function triangles(group) {
  group.updateMatrixWorld(true);
  const inverse = group.matrixWorld.clone().invert(), result = [];
  for (const mesh of meshes(group)) {
    const transform = new Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
    const p = mesh.geometry.attributes.position, open = mesh.geometry.morphAttributes.position?.[0] ?? p;
    const idx = mesh.geometry.index;
    for (let j = 0; j < (idx?.count ?? p.count); j += 3) {
      const ids = [0, 1, 2].map(k => idx ? idx.getX(j + k) : j + k);
      const a = ids.map(i => new Vector3().fromBufferAttribute(p, i).applyMatrix4(transform));
      const b = ids.map(i => new Vector3().fromBufferAttribute(open, i).applyMatrix4(transform));
      result.push({ closed: new Triangle(...a), open: b });
    }
  }
  return result;
}

test('surface samples are deterministic, finite, exact length, and reject invalid counts', () => {
  const a = bouquet({ seed: 17 }), b = bouquet({ seed: 17 });
  try {
    const first = a.sampleSurface(257), second = b.sampleSurface(257);
    for (const key of ['closed', 'open', 'colors']) {
      assert.ok(first[key] instanceof Float32Array);
      assert.equal(first[key].length, 771);
      assert.deepEqual(first[key], second[key]);
      assert.ok(first[key].every(Number.isFinite));
    }
    assert.notDeepEqual(first.closed, first.open);
    a.setBloom(0.2); a.setMaterial('lily', 'golden'); a.setOpacity(0.1); a.update(20);
    const recolored=a.sampleSurface(257);
    assert.deepEqual(recolored.closed,first.closed);assert.deepEqual(recolored.open,first.open);
    assert.notDeepEqual(recolored.colors,first.colors,'v6 material changes must recolor the same source identities');
    assert.equal(a.sampleSurface(0).open.length, 0);
    assert.throws(() => a.sampleSurface(-1), RangeError);
    assert.throws(() => a.sampleSurface(1.4), RangeError);
  } finally { a.dispose(); b.dispose(); }
});

test('each sampled identity stays on the same real triangle through bloom', () => {
  const flower = bouquet({ seed: 41 });
  try {
    const sample = flower.sampleSurface(24), surface = triangles(flower.group);
    const point = new Vector3(), target = new Vector3(), nearest = new Vector3(), bary = new Vector3(), paired = new Vector3();
    for (let i = 0; i < 24; i++) {
      point.fromArray(sample.closed, i * 3); target.fromArray(sample.open, i * 3);
      const found = surface.some(({closed, open}) => {
        closed.closestPointToPoint(point, nearest);
        if (nearest.distanceToSquared(point) > 1e-11) return false;
        if (!closed.getBarycoord(point, bary)) return false;
        paired.copy(open[0]).multiplyScalar(bary.x).addScaledVector(open[1], bary.y).addScaledVector(open[2], bary.z);
        return paired.distanceToSquared(target) < 1e-9;
      });
      assert.ok(found, `particle ${i} must bind to the same triangle in both endpoint poses`);
    }
  } finally { flower.dispose(); }
});

test('bloom is reversible with fixed stem roots and unchanged geometry buffers', () => {
  const flower = bouquet();
  try {
    const all = meshes(flower.group), snapshots = all.map(m => m.geometry.attributes.position.array.slice());
    const stems = all.filter(m => m.userData.role === 'stem');
    assert.ok(stems.length > 0, 'the bouquet needs a persistent stem system');
    const ids = all.map(m => m.uuid);
    flower.setBloom(0); flower.setBloom(0.45);
    for (const mesh of all.filter(m => m.geometry.morphAttributes.position?.length)) {
      const p = mesh.geometry.attributes.position, q = mesh.geometry.morphAttributes.position[0];
      const index = Math.floor(p.count * 0.37), actual = mesh.getVertexPosition(index, new Vector3());
      const expected = new Vector3().fromBufferAttribute(p, index).lerp(new Vector3().fromBufferAttribute(q, index), 0.45);
      assert.ok(actual.distanceTo(expected) < 1e-6);
      assert.equal(mesh.geometry.morphAttributes.normal[0].count, p.count);
    }
    flower.setBloom(1); flower.setBloom(0); flower.update(200);
    all.forEach((m, i) => assert.deepEqual(m.geometry.attributes.position.array, snapshots[i]));
    assert.deepEqual(meshes(flower.group).map(m => m.uuid), ids);
    for (const stem of stems) assert.ok(!stem.geometry.morphAttributes.position?.length, 'stems never shrink with bloom');
  } finally { flower.dispose(); }
});

test('bouquet remains within hero framing and has three distinct blossoms plus two buds', () => {
  const flower = bouquet();
  try {
    const heads = []; flower.group.traverse(o => { if (o.userData.botanicalHead) heads.push(o); });
    assert.equal(heads.filter(o => o.userData.botanicalHead === 'blossom').length, 3);
    assert.equal(heads.filter(o => o.userData.botanicalHead === 'bud').length, 2);
    const bounds = new Box3();
    for (const tri of triangles(flower.group)) for (const p of tri.open) bounds.expandByPoint(p);
    assert.ok(bounds.min.y >= -0.05 && bounds.min.y <= 0.05);
    assert.ok(bounds.max.y > 4.0 && bounds.max.y < 4.65, `${bounds.max.y} height`);
    assert.ok(bounds.max.x - bounds.min.x > 3.15 && bounds.max.x - bounds.min.x < 3.65, `${bounds.max.x - bounds.min.x} width must fit the 3.4-unit hero frame`);
    for (const mesh of meshes(flower.group)) {
      assert.ok(mesh.geometry.attributes.normal.array.every(Number.isFinite));
      for (const normal of mesh.geometry.morphAttributes.normal ?? []) assert.ok(normal.array.every(Number.isFinite));
    }
  } finally { flower.dispose(); }
});

test('physical materials are isolated between bouquets and natural foliage stays green', () => {
  const a = bouquet(), b = bouquet();
  try {
    const petals = f => meshes(f.group).find(m => m.userData.role === 'petal');
    const originalMetalness = petals(b).material.metalness;
    assert.ok(originalMetalness > 0.7);
    a.setMaterial('crystal', 'blush');
    assert.ok(petals(a).material.transmission > 0.7);
    assert.ok(petals(a).material.ior > 1);
    assert.ok(petals(a).material.thickness > 0);
    assert.equal(petals(b).material.metalness, originalMetalness);
    a.setMaterial('lily', 'golden');
    const stem = meshes(a.group).find(m => m.userData.role === 'stem');
    assert.ok(stem.material.color.g > stem.material.color.r);
    const anther = meshes(a.group).find(m => m.userData.role === 'anther');
    assert.ok(stem.material.roughness < anther.material.roughness, 'natural presets retain smoother stems and matte pollen before manual surface edits');
    assert.ok(petals(a).material.map?.isDataTexture, 'natural detail must work without a browser DOM');
    a.setMaterial('silver');
    assert.equal(petals(a).material.map, null, 'silver must not inherit painted natural color');
    assert.ok(petals(a).material.iridescence > 0);
  } finally { a.dispose(); b.dispose(); }
});

test('thin flower shells have outward normals on both sides for physical transmission', () => {
  const flower = bouquet();
  try {
    const petal = meshes(flower.group).find(m => m.userData.role === 'petal');
    const p = petal.geometry.morphAttributes.position[0], n = petal.geometry.morphAttributes.normal[0];
    const paired = new Map();
    for (let i = 0; i < p.count; i++) {
      const key = `${p.getX(i).toFixed(6)}:${p.getZ(i).toFixed(6)}`;
      if (!paired.has(key)) paired.set(key, []);
      paired.get(key).push(i);
    }
    let compared = 0, outward = 0;
    for (const ids of paired.values()) {
      if (ids.length !== 2) continue;
      const [a, b] = ids.sort((a, b) => p.getY(b) - p.getY(a));
      if (p.getY(a) - p.getY(b) < 0.005) continue;
      compared++;
      if (n.getY(a) > 0 && n.getY(b) < 0) outward++;
    }
    assert.ok(compared > 100);
    assert.ok(outward / compared > 0.9, `${outward}/${compared} shell normal pairs face outward`);
  } finally { flower.dispose(); }
});

test('opacity removes all solid parts continuously and restoring does not rebuild the bouquet', () => {
  const flower = bouquet();
  try {
    const all = meshes(flower.group), ids = all.map(o => o.uuid);
    flower.setOpacity(0.35);
    for (const mesh of all) { assert.equal(mesh.material.opacity, 0.35); assert.equal(mesh.material.depthWrite, false); }
    flower.setOpacity(0); assert.equal(flower.group.visible, false);
    flower.setOpacity(1); assert.equal(flower.group.visible, true);
    for (const mesh of all) assert.equal(mesh.material.opacity, 1);
    assert.deepEqual(meshes(flower.group).map(o => o.uuid), ids);
  } finally { flower.dispose(); }
});

test('scale affects samples once and owned GPU resources dispose once', () => {
  const a = bouquet({ scale: 1 }), b = bouquet({ scale: 2 });
  try {
    const one = a.sampleSurface(31), two = b.sampleSurface(31);
    one.open.forEach((v, i) => assert.ok(Math.abs(two.open[i] - v * 2) < 1e-6));
    const resources = new Set();
    for (const mesh of meshes(a.group)) { resources.add(mesh.geometry); resources.add(mesh.material); }
    let count = 0; for (const r of resources) r.addEventListener('dispose', () => count++);
    a.dispose(); a.dispose();
    assert.equal(count, resources.size);
  } finally { a.dispose(); b.dispose(); }
});

test('silver interference uses non-color thickness variation and preserves geometry identity', () => {
  const flower = bouquet();
  try {
    const petal = meshes(flower.group).find(m => m.userData.role === 'petal'), material = petal.material;
    const thicknessMap = material.iridescenceThicknessMap;
    assert.ok(thicknessMap?.isDataTexture, 'physical thin-film thickness needs a spatial data map');
    assert.equal(thicknessMap.colorSpace, '', 'thickness is linear non-color data');
    assert.equal(material.map, null, 'silver must not use a painted rainbow base color');
    const data = thicknessMap.image.data, values = new Set();
    for (let i = 0; i < data.length; i += 4) {
      assert.equal(data[i], data[i + 1]); assert.equal(data[i], data[i + 2]);
      values.add(data[i + 1]);
    }
    assert.ok(values.size > 64, 'thin film should vary smoothly over the surface');
    const samples = flower.sampleSurface(31), identity = meshes(flower.group).map(m => [m.uuid, m.material.uuid]);
    flower.setSurface({iridescence: 0.9, thickness: 550, gloss: 0.8, radiance: 0.3});
    assert.deepEqual(flower.sampleSurface(31), samples);
    assert.deepEqual(meshes(flower.group).map(m => [m.uuid, m.material.uuid]), identity);
  } finally { flower.dispose(); }
});

test('surface controls clamp zero and finite extremes, ignore invalid numbers, and reset with material presets', () => {
  const flower = bouquet();
  try {
    assert.equal(typeof flower.setSurface, 'function');
    const petal = meshes(flower.group).find(m => m.userData.role === 'petal');
    const initial = flower.setSurface();
    const zero = flower.setSurface({iridescence: 0, gloss: 0, radiance: 0, thickness: -1});
    assert.equal(zero.iridescence, 0); assert.equal(zero.thickness, 100);
    assert.equal(petal.material.iridescence, 0); assert.equal(petal.material.roughness, 1);
    assert.equal(petal.material.emissiveIntensity, 0);
    const high = flower.setSurface({iridescence: 9, gloss: 9, radiance: 9, thickness: 10000});
    assert.equal(high.iridescence, 1); assert.equal(high.thickness, 800);
    assert.ok(Math.abs(petal.material.roughness - 0.1) < 1e-8);
    assert.ok(petal.material.emissiveIntensity <= 0.12);
    assert.deepEqual(flower.setSurface({iridescence: NaN, thickness: Infinity, gloss: undefined, radiance: -Infinity}), high);
    flower.setMaterial('lily'); flower.setSurface({iridescence: 1, thickness: 800, gloss: 0.5, radiance: 1});
    assert.equal(petal.material.iridescence, 0); assert.equal(petal.material.iridescenceThicknessMap, null);
    assert.ok(Math.abs(petal.material.roughness - 0.55) < 1e-8);
    flower.setMaterial('silver'); assert.deepEqual(flower.setSurface(), initial);
  } finally { flower.dispose(); }
});


test('v6 forms have distinct real topology, finite normals and matched morph endpoints',()=>{
  const flower=bouquet(), signatures=[];
  try {
    for(const form of ['lily','lotus','iris','dahlia']){
      assert.equal(flower.setForm(form),form);flower.setBloom(.43);
      const samples=flower.sampleSurface(127);signatures.push(Array.from(samples.open.slice(0,36)));
      for(const key of ['closed','open','colors'])assert.ok(samples[key].every(Number.isFinite));
      for(const mesh of meshes(flower.group)){
        assert.ok(mesh.geometry.attributes.normal.array.every(Number.isFinite));
        if(mesh.geometry.morphAttributes.position?.length){
          assert.equal(mesh.geometry.attributes.position.count,mesh.geometry.morphAttributes.position[0].count);
          assert.equal(mesh.morphTargetInfluences[0],.43);
          assert.ok(mesh.geometry.morphAttributes.normal[0].array.every(Number.isFinite));
        }
      }
      const again=flower.sampleSurface(127);assert.deepEqual(again,samples);
    }
    for(let a=0;a<signatures.length;a++)for(let b=a+1;b<signatures.length;b++)assert.notDeepEqual(signatures[a],signatures[b]);
  }finally{flower.dispose();}
});

test('v6 all optical series keep positions but supply distinct source colors',()=>{
  const flower=bouquet();
  try{
    const source=flower.sampleSurface(97),colors=[];
    for(const kind of ['silver','crystal','lily','amber','celadon']){
      flower.setMaterial(kind);const sample=flower.sampleSurface(97);
      assert.deepEqual(sample.closed,source.closed);assert.deepEqual(sample.open,source.open);colors.push(sample.colors);
      assert.ok(sample.colors.every(v=>v>=0&&v<=1));
    }
    for(let a=0;a<colors.length;a++)for(let b=a+1;b<colors.length;b++)assert.notDeepEqual(colors[a],colors[b]);
    flower.setMaterial('crystal');const petal=meshes(flower.group).find(m=>m.userData.role==='petal').material;
    assert.ok(petal.transmission>=.7&&petal.transmission<.9,'crystal retains a colored reflective surface');
    assert.ok(petal.thickness>=.4);assert.ok(petal.color.b>petal.color.g);
  }finally{flower.dispose();}
});

test('v6 changing form releases old geometries once and preserves material resources',()=>{
  const flower=bouquet();
  try{
    const old=meshes(flower.group),materials=new Set(old.map(m=>m.material)),counts=new Map();
    for(const mesh of old){counts.set(mesh.geometry,0);mesh.geometry.addEventListener('dispose',()=>counts.set(mesh.geometry,counts.get(mesh.geometry)+1));}
    flower.setOpacity(.4);flower.setBloom(.27);flower.setForm('lotus');
    for(const value of counts.values())assert.equal(value,1);
    for(const mesh of meshes(flower.group)){assert.ok(materials.has(mesh.material));assert.equal(mesh.material.opacity,.4);if(mesh.morphTargetInfluences)assert.equal(mesh.morphTargetInfluences[0],.27);}
    flower.dispose();for(const value of counts.values())assert.equal(value,1);
  }finally{flower.dispose();}
});


test('new forms sample the exact same real triangles at closed and open endpoints',()=>{
 const flower=bouquet({seed:93});
 try{for(const form of ['lotus','iris','dahlia']){
  flower.setForm(form);const sample=flower.sampleSurface(9),surface=triangles(flower.group);
  const point=new Vector3(),target=new Vector3(),nearest=new Vector3(),bary=new Vector3(),paired=new Vector3();
  for(let i=0;i<9;i++){
   point.fromArray(sample.closed,i*3);target.fromArray(sample.open,i*3);
   assert.ok(surface.some(({closed,open})=>{
    closed.closestPointToPoint(point,nearest);if(nearest.distanceToSquared(point)>1e-11||!closed.getBarycoord(point,bary))return false;
    paired.copy(open[0]).multiplyScalar(bary.x).addScaledVector(open[1],bary.y).addScaledVector(open[2],bary.z);return paired.distanceToSquared(target)<1e-9;
   }),`${form} sample ${i} follows one paired source face`);
  }
 }}finally{flower.dispose();}
});


test('dahlia rays and iris flags occupy different silhouettes at the same scale',()=>{
 const flower=bouquet(),shapes={};
 try{for(const form of ['lily','lotus','iris','dahlia']){
  flower.setForm(form);const all=meshes(flower.group),petal=all.find(m=>m.userData.role==='petal');
  const bounds=new Box3();for(const tri of triangles(flower.group))for(const p of tri.open)bounds.expandByPoint(p);
  shapes[form]={vertices:petal.geometry.attributes.position.count,width:bounds.max.x-bounds.min.x,height:bounds.max.y-bounds.min.y};
  assert.ok(bounds.max.y<4.8&&bounds.min.y>=-.05,`${form} fits vertical framing`);
  assert.ok(shapes[form].width<4.8,`${form} fits horizontal framing`);
 }
 assert.ok(shapes.dahlia.vertices>shapes.lily.vertices*2,'many rolled rays must be actual geometry');
 assert.ok(shapes.lotus.height<shapes.iris.height-.5,'lotus is a low cup rather than another tall lily');
 }finally{flower.dispose();}
});
