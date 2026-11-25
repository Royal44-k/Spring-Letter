import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { createCourier } from '../src/courier.js';

const reference = JSON.parse(readFileSync(new URL('./fixtures/courier-motion-v8.json', import.meta.url)));
const digest = array => createHash('sha256').update(Buffer.from(array.buffer, array.byteOffset, array.byteLength)).digest('hex');
const box = group => { group.updateMatrixWorld(true); return new THREE.Box3().setFromObject(group, true); };
const matrixValues = object => object.matrix.toArray().map(value => value === 0 ? 0 : value); // JSON reference normalizes -0.
function resources(courier) {
  const geometries = new Set(), materials = new Set(), textures = new Set(); let meshes = 0, triangles = 0;
  courier.group.traverse(object => {
    if (!object.isMesh) return;
    meshes++; geometries.add(object.geometry); materials.add(object.material);
    triangles += (object.geometry.index?.count ?? object.geometry.attributes.position.count) / 3;
    for (const texture of [object.material.map, object.material.normalMap]) if (texture) textures.add(texture);
  });
  return { geometries, materials, textures, meshes, triangles };
}

test('fabric detailing preserves the authored silhouette, root scale and standing bounds', () => {
  const courier = createCourier();
  try {
    const bounds = box(courier.group);
    assert.deepEqual(courier.group.position.toArray(), [0, 0, 0]);
    assert.deepEqual(courier.group.scale.toArray(), [1, 1, 1]);
    assert.deepEqual(bounds.min.toArray(), reference.initial.min);
    assert.deepEqual(bounds.max.toArray(), reference.initial.max);
    assert.equal(digest(courier.group.getObjectByName('courier-petal-cloak').geometry.attributes.position.array), reference.capePositions);
    assert.equal(digest(courier.group.getObjectByName('courier-seed-hood').geometry.attributes.position.array), reference.headPositions);
    assert.equal(courier.group.getObjectByName('courier-trailing-scarf').geometry.attributes.position.count, 45);
  } finally { courier.dispose(); }
});

test('secondary motion keeps the original feet and body trajectory and stays inside the old motion envelope', () => {
  const courier = createCourier(), position = new THREE.Vector3(), poses = new Map(reference.poses.map(pose => [pose.frame, pose]));
  const before = resources(courier), body = courier.group.getObjectByName('courier-body');
  try {
    for (let frame = 0; frame < 360; frame++) {
      const t = frame / 60; position.set(Math.sin(t) * 2, 0, t * 2);
      courier.update(t, 1 / 60, position, frame > 270, { dashing: frame > 120 && frame < 210 });
      const expected = poses.get(frame);
      if (expected) {
        const bounds = box(courier.group);
        assert.deepEqual(matrixValues(body), expected.body);
        for (let i = 0; i < 2; i++) assert.deepEqual(matrixValues(courier.group.getObjectByName(`courier-boot-${i}`)), expected.feet[i]);
        for (let i = 0; i < 3; i++) {
          assert.ok(bounds.min.getComponent(i) >= expected.bounds.min[i] - 1e-7, `frame ${frame} extends the lower motion boundary`);
          assert.ok(bounds.max.getComponent(i) <= expected.bounds.max[i] + 1e-7, `frame ${frame} extends the upper motion boundary`);
        }
      }
      const satchel = courier.group.getObjectByName('courier-mail-satchel');
      assert.ok(Math.abs(satchel.rotation.x) <= .035);
      assert.ok(Math.abs(satchel.rotation.z + .18) <= .025);
    }
    const after = resources(courier);
    assert.deepEqual(after.geometries, before.geometries);
    assert.deepEqual(after.materials, before.materials);
    assert.deepEqual(after.textures, before.textures);
  } finally { courier.dispose(); }
});

test('cloth is rough, non-emissive and UV-complete, with bounded local texture and draw budgets', () => {
  const courier = createCourier();
  try {
    const owned = resources(courier);
    assert.ok(owned.meshes <= 24); assert.ok(owned.triangles <= 6200);
    assert.ok(owned.materials.size <= 9); assert.equal(owned.textures.size, 2);
    assert.equal([...owned.textures].reduce((bytes, texture) => bytes + texture.image.data.byteLength, 0), 131072);
    courier.group.traverse(object => {
      if (!object.isMesh) return;
      assert.ok(object.geometry.attributes.position.array.every(Number.isFinite));
      if (object.material.map) {
        assert.ok(object.material.roughness >= .9); assert.equal(object.material.metalness, 0);
        assert.equal(object.material.emissive.getHex(), 0);
        assert.equal(object.geometry.attributes.uv.count, object.geometry.attributes.position.count);
        assert.ok(object.geometry.attributes.uv.array.every(Number.isFinite));
      }
      if (object.material.isMeshStandardMaterial) assert.ok(object.material.emissiveIntensity <= 1);
    });
    const pen = [...owned.materials].find(material => material.name === 'courier-pen-light');
    assert.equal(pen.emissiveIntensity, .12);
    const eyes = [...owned.materials].find(material => material.name === 'courier-warm-eyes'), eyeColor = eyes.color.getHex();
    courier.update(1, .016, new THREE.Vector3(), true);
    assert.equal(eyes.color.getHex(), eyeColor, 'writing feedback must not recolor the face');
  } finally { courier.dispose(); }
});

test('owned resources are isolated, invalid input does not poison motion, and disposal is idempotent', () => {
  const a = createCourier(), b = createCourier(), owned = resources(a), other = resources(b);
  const all = new Set([...owned.geometries, ...owned.materials, ...owned.textures]);
  for (const resource of [...other.geometries, ...other.materials, ...other.textures]) assert.equal(all.has(resource), false);
  a.update(0, .016, new THREE.Vector3());
  const body = a.group.getObjectByName('courier-body'), before = body.position.toArray();
  for (const input of [[NaN, .016, new THREE.Vector3()], [1, Infinity, new THREE.Vector3()], [1, -.1, new THREE.Vector3()], [1, .016, null], [1, .016, new THREE.Vector3(Infinity, 0, 0)]]) a.update(...input);
  assert.deepEqual(body.position.toArray(), before);
  const counts = new Map();
  for (const resource of all) resource.addEventListener('dispose', () => counts.set(resource, (counts.get(resource) || 0) + 1));
  a.dispose(); a.dispose(); b.dispose();
  assert.equal(counts.size, all.size); assert.ok([...counts.values()].every(value => value === 1));
  assert.doesNotThrow(() => a.update(1, .016, new THREE.Vector3()));
  assert.equal(a.group.children.length, 0);
});
