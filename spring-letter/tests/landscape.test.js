import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createLandscape, LANDSCAPE_TARGETS, LANDSCAPE_ROUTES } from '../src/landscape.js';
import { supportAt as originalSupport } from '../src/layout.js';

const open = { p1: { solved: true }, wind: { solved: true }, bridge: { solved: false, structure: 'none' } };
const freeze = value => { if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze); } return value; };

test('all five route centerlines are walkable, graded, and connect to existing legal ground', () => {
  const land = createLandscape();
  try {
    for (const route of LANDSCAPE_ROUTES) {
      let previous = null;
      for (let i = 1; i < route.points.length; i++) {
        const a = route.points[i - 1], b = route.points[i], count = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / .05);
        for (let j = 0; j <= count; j++) {
          const f = j / count, x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
          const support = originalSupport(x, z, open) || land.supportAt(x, z, open);
          assert.ok(support, `${route.id}: no floor at ${x}, ${z}`);
          if (previous) assert.ok(Math.abs(support.height - previous.height) < .17, `${route.id}: abrupt height change at ${x}, ${z}`);
          previous = support;
        }
      }
    }
    for (const id of ['rain-out', 'wind-out', 'tide-out']) {
      const start = LANDSCAPE_ROUTES.find(route => route.id === id).points[0];
      assert.ok(originalSupport(start.x, start.z, open), `${id} must join the old world`);
    }
  } finally { land.dispose(); }
});

test('all three interaction courts remain flat across a 4.2 metre disc', () => {
  const land = createLandscape();
  try {
    for (const target of LANDSCAPE_TARGETS) for (let r = 0; r <= target.radius; r += .15) for (let a = 0; a < Math.PI * 2; a += .17) {
      const floor = land.supportAt(target.x + Math.cos(a) * r, target.z + Math.sin(a) * r, open);
      assert.ok(floor);
      assert.ok(Math.abs(floor.height - target.height) < 1e-6, `${target.id} is uneven under an interaction`);
    }
  } finally { land.dispose(); }
});

test('support comes from the visible triangle surface, including clipped coasts', () => {
  const land = createLandscape();
  try {
    land.group.updateMatrixWorld(true);
    const floors = land.group.children.filter(object => object.userData.walkableTerrain);
    const ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0);
    let checked = 0;
    for (let x = -17; x < 18; x += .39) for (let z = -34; z < 5; z += .43) {
      const floor = land.supportAt(x, z, open);
      ray.set(new THREE.Vector3(x, 20, z), down);
      const visible = ray.intersectObjects(floors, false).find(hit => hit.faceIndex * 3 < hit.object.userData.topIndexCount);
      assert.equal(Boolean(floor), Boolean(visible), `visible/support disagreement at ${x},${z}`);
      if (floor) { checked++; assert.ok(Math.abs(floor.height - visible.point.y) < 2e-5, `triangle height mismatch at ${x},${z}`); }
    }
    assert.ok(checked > 900);
  } finally { land.dispose(); }
});

test('optional terrain respects both main gates and never reaches locked pool bridges', () => {
  const land = createLandscape();
  try {
    const closed = { p1: { solved: false }, wind: { solved: false }, bridge: { structure: 'none' } };
    assert.ok(land.supportAt(-12, -1, closed));
    assert.equal(land.supportAt(12, -16, closed), null);
    assert.equal(land.supportAt(-12, -29, closed), null);
    assert.ok(land.supportAt(12, -16, { ...closed, p1: { solved: true } }));
    assert.equal(land.supportAt(-12, -29, { ...closed, p1: { solved: true } }), null);
    const tide = land.supportAt(-12, -29, open);
    assert.equal(tide.safe, 'pool'); assert.equal(tide.platform, 'R');
    for (let x = -3.4; x <= 2; x += .13) for (let z = -40; z <= -26; z += .13) {
      assert.equal(land.supportAt(x, z, open), null, 'optional ground bypassed a pool bridge');
    }
    for (const [x, z] of [[NaN, 0], [0, Infinity], [1000, -1000], [0, -8]]) assert.equal(land.supportAt(x, z, open), null);
  } finally { land.dispose(); }
});

test('rewards restore independently without mutating game state or target positions', () => {
  const land = createLandscape();
  const state = freeze({ ...open, exploration: { rain: { done: true }, wind: { done: false }, tide: { done: true } }, settings: { reducedMotion: true } });
  try {
    const targets = structuredClone(land.targets);
    land.update(1, .016, state); land.update(NaN, Infinity, state);
    assert.equal(land.group.getObjectByName('rain-restored-flowers').visible, true);
    assert.equal(land.group.getObjectByName('wind-restored-flowers').visible, false);
    assert.equal(land.group.getObjectByName('tide-restored-flowers').visible, true);
    assert.deepEqual(land.targets, targets);
    land.group.traverse(object => {
      assert.ok([...object.position.toArray(), ...object.scale.toArray(), ...object.quaternion.toArray()].every(Number.isFinite));
      if (object.geometry) assert.ok(object.geometry.getAttribute('position').array.every(Number.isFinite));
    });
  } finally { land.dispose(); }
});

test('all scenery stays below the draw-call budget and owns disposable resources', () => {
  const a = createLandscape(), b = createLandscape();
  const resources = new Set(); let meshCount = 0;
  a.group.traverse(object => {
    if (object.isMesh) meshCount++;
    if (object.geometry) resources.add(object.geometry);
    if (object.material) resources.add(object.material);
    if (object.customDepthMaterial) resources.add(object.customDepthMaterial);
  });
  assert.ok(meshCount < 35, `${meshCount} exceeds landscape budget`);
  b.group.traverse(object => {
    if (object.geometry) assert.equal(resources.has(object.geometry), false);
    if (object.material) assert.equal(resources.has(object.material), false);
  });
  let releases = 0; for (const resource of resources) resource.addEventListener('dispose', () => releases++);
  a.dispose(); a.dispose(); b.dispose();
  assert.equal(releases, resources.size);
  assert.equal(a.supportAt(-12, -1, open), null);
  assert.doesNotThrow(() => a.update(1, .016, {}));
});

test('shared surface textures have complete UVs and remain owned by their caller', () => {
  const a = createLandscape(), b = createLandscape();
  const normal = new THREE.Texture(), roughness = new THREE.Texture();
  normal.repeat.set(3, 4); let released = 0;
  normal.addEventListener('dispose', () => released++); roughness.addEventListener('dispose', () => released++);
  a.setSurfaceTextures(normal, roughness); b.setSurfaceTextures(normal, roughness);
  let surfaces = 0;
  a.group.traverse(object => {
    if (object.material?.normalMap) {
      surfaces++;
      assert.equal(object.material.normalMap, normal);
      assert.equal(object.material.roughnessMap, roughness);
      const uv = object.geometry.getAttribute('uv');
      assert.equal(uv.count, object.geometry.getAttribute('position').count);
      assert.ok(uv.array.every(Number.isFinite));
      assert.ok(object.material.normalScale.x > 0 && object.material.normalScale.x <= .28);
    }
  });
  assert.ok(surfaces >= 6);
  assert.deepEqual(normal.repeat.toArray(), [3, 4]);
  a.dispose(); b.dispose(); assert.equal(released, 0);
  normal.dispose(); roughness.dispose(); assert.equal(released, 2);
});
