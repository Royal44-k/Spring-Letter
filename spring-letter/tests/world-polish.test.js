import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createWorld } from '../src/world.js';

test('shore scenery preserves gameplay anchors and keeps planting approaches clear', () => {
  const world = createWorld();
  try {
    for (const [purpose, x, z] of [['memory', -3, -46], ['season', 0, -48], ['voyage', 3, -46]]) {
      assert.deepEqual(world.group.getObjectByName(`spring-purpose-${purpose}`).position.toArray(), [x, .08, z]);
    }
    const arch = world.group.getObjectByName('finale-shore-arch');
    assert.equal(world.cameraOccluders.some(object => object.parent === arch), true,
      'rear arch must remain available to camera obstruction fading when approaching from either side');
    assert.ok(arch.position.z < -48, 'masonry sits behind the three uses when entering');
    const matrix = new THREE.Matrix4(), position = new THREE.Vector3();
    for (const name of ['shore-grass-clusters', 'shore-reed-stems', 'shore-water-worn-stones']) {
      const object = world.group.getObjectByName(name);
      assert.equal(object.isInstancedMesh, true);
      for (let i = 0; i < object.count; i++) {
        object.getMatrixAt(i, matrix); position.setFromMatrixPosition(matrix);
        const centerZ = position.z < -30 ? -46 : -16;
        assert.ok(Math.hypot(position.x, position.z - centerZ) <= 5.841, 'roots remain on the actual island');
        for (const [x, z] of [[-3, -46], [0, -48], [3, -46], [-3, -14], [3, -18], [-3.8, -17.5]]) {
          assert.ok(Math.hypot(position.x - x, position.z - z) > 1.5, 'interaction approaches stay clear');
        }
      }
    }
  } finally { world.dispose(); }
});

test('shore presentation remains finite and does not mutate delivery or quest state', () => {
  const world = createWorld();
  try {
    for (const cores of [[], ['memory'], ['season'], ['voyage'], ['memory', 'voyage']]) {
      const state = { cores, ending: cores.length === 2 ? 'memory-voyage' : null,
        settings: { reducedMotion: true }, player: { x: 1, z: -43 }, p1: { solved: true }, wind: { solved: true } };
      const before = structuredClone(state);
      for (let i = 0; i < 8; i++) world.update(i / 30, 1 / 30, state);
      assert.deepEqual(state, before);
    }
    world.update(NaN, Infinity, {});
    let meshCount = 0;
    const shoreSurfaces = [];
    world.group.traverse(object => {
      assert.ok([...object.position.toArray(), ...object.scale.toArray(), ...object.quaternion.toArray()].every(Number.isFinite));
      if (!object.isMesh) return;
      meshCount++;
      if (object.material.name === 'continuous-tide-worn-stone') shoreSurfaces.push(object);
      for (const attribute of Object.values(object.geometry.attributes)) assert.ok([...attribute.array].every(Number.isFinite));
    });
    assert.ok(meshCount < 160, 'shared materials, static batching and instances bound scene-object growth');
    assert.equal(shoreSurfaces.length, 2, 'both islands keep one opaque ground batch each, without extra soil overlay draws');
    for (const surface of shoreSurfaces) {
      assert.equal(surface.material.transparent, false);
      assert.equal(surface.material.vertexColors, true);
      assert.equal(surface.geometry.attributes.color.count, surface.geometry.attributes.position.count);
    }
  } finally { world.dispose(); }
});

test('new shore geometry and materials are owned by the world and disposed once', () => {
  const world = createWorld(), resources = new Set(), counts = new Map();
  world.group.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of object.material ? [object.material].flat() : []) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
  });
  for (const resource of resources) resource.addEventListener('dispose', () => counts.set(resource, (counts.get(resource) || 0) + 1));
  world.dispose(); world.dispose(); world.update(10, .016, {});
  assert.equal(counts.size, resources.size);
  for (const count of counts.values()) assert.equal(count, 1);
  assert.equal(world.group.children.length, 0);
});
