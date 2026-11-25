import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createWorld } from '../src/world.js';
import { supportAt, PLATFORMS } from '../src/layout.js';

const routes = [['bridge_am', 'A', 'M'], ['bridge_mf', 'M', 'F'], ['shield_rm', 'R', 'M']];

// Compare the actual scene before and after each build. Static batching must
// not hide a vertical decoration inside the same mesh as the walkable leaves.
function activeMeshes(group) {
  const found = new Set();
  group.traverseVisible(object => { if (object.isMesh) found.add(object); });
  return found;
}

for (const [shape, from, to] of routes) {
  test(`${shape} opens a low, unobstructed flower crossing after its reveal`, () => {
    const world = createWorld();
    const state = { p1: { solved: true }, wind: { solved: true }, bridge: { structure: 'none' } };
    try {
      world.update(1, .016, state);
      world.update(10, .016, state); // Let unrelated first-solve rings finish.
      const before = activeMeshes(world.group);
      state.bridge.structure = shape;
      world.update(11, .016, state);
      world.update(12, .016, state);
      world.group.updateMatrixWorld(true);
      const added = [...activeMeshes(world.group)].filter(object => !before.has(object));
      assert.ok(added.length > 0, 'construction exposes physical geometry');
      const bounds = new THREE.Box3(), point = new THREE.Vector3();
      for (const object of added) {
        const positions = object.geometry.getAttribute('position');
        for (let i = 0; i < positions.count; i++) {
          point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
          assert.ok(point.toArray().every(Number.isFinite));
          bounds.expandByPoint(point);
        }
      }
      assert.ok(bounds.max.y < .4,
        `${shape} rises to ${bounds.max.y.toFixed(3)}m: a crossing must not create a wall at courier eye height`);
      assert.ok(bounds.min.y > -.1, 'the crossing remains above the water');
      for (let i = 0; i <= 20; i++) {
        const t = i / 20, a = PLATFORMS[from], b = PLATFORMS[to];
        assert.ok(supportAt(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t, state),
          'removing decoration must preserve every walkable point on the route');
      }
      assert.equal(added.some(object => object.material.opacity < .9), false,
        'the supported route still becomes visible and substantial after the reveal');
    } finally { world.dispose(); }
  });
}
