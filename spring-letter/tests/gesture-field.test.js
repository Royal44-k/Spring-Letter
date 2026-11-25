import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createGestureField } from '../src/gesture-field.js';

const gestureAt = (x, y = 0, z = 0) => ({ active: true, position: new Vector3(x, y, z), velocity: new Vector3(1, 0, 0), strength: .8 });

test('wind trail is bounded and expires without a restore action', () => {
  const field = createGestureField({ maxPoints: 64, lifetime: 1 });
  for (let i = 0; i < 600; i++) field.update(1 / 60, i / 60, { gesture: gestureAt(i * .03, Math.sin(i * .03)) });
  const stats = field.getStats();
  assert.ok(stats.sampleCount <= 64 && stats.sampleCount > 2);
  assert.ok(stats.segmentCount <= stats.sampleCount - 1);
  assert.equal(stats.drawCalls, 2);
  for (const object of field.group.children) {
    assert.ok(object.geometry.getAttribute('position').array.every(Number.isFinite));
  }
  for (let i = 0; i < 80; i++) field.update(1 / 60, 10 + i / 60);
  assert.equal(field.getStats().sampleCount, 0);
  assert.equal(field.getStats().drawCalls, 0);
  assert.equal(field.group.visible, false);
  field.dispose();
});

test('separate gestures never draw a bridge between unrelated positions', () => {
  const field = createGestureField({ width: .05 });
  field.update(.016, 0, { gesture: gestureAt(0) });
  field.update(.016, .016, { gesture: gestureAt(.1) });
  const before = field.getStats();
  field.update(.016, .032, { gesture: { active: false } });
  field.update(.016, .048, { gesture: gestureAt(1.5) });
  assert.equal(field.getStats().segmentCount, before.segmentCount);
  assert.equal(field.getStats().sampleCount, before.sampleCount + 1);
  field.dispose();
});

test('low quality actually reduces trail work and omits the spark draw call', () => {
  const field = createGestureField({ maxPoints: 128 });
  for (let i = 0; i < 100; i++) field.update(.016, i * .016, { gesture: gestureAt(i * .02) });
  assert.ok(field.getStats().sampleCount > 48);
  field.setQuality('low');
  assert.equal(field.getStats().capacity, 48);
  assert.ok(field.getStats().sampleCount <= 48);
  assert.equal(field.getStats().drawCalls, 1);
  assert.equal(field.group.getObjectByName('WindSparks').geometry.drawRange.count, 0);
  assert.equal(field.group.getObjectByName('WindThread').geometry.drawRange.count, 47 * 12);
  field.dispose();
});

test('slow deliberate motion produces a line and malformed input releases it safely', () => {
  const field = createGestureField({ width: .05 });
  const source = gestureAt(0);
  field.update(.016, 0, { gesture: source });
  for (let i = 1; i <= 100; i++) field.update(.016, i * .016, { gesture: gestureAt(i * .001) });
  assert.ok(field.getStats().segmentCount >= 3);
  assert.equal(source.position.x, 0);
  field.update(.016, 2, { gesture: gestureAt(NaN) });
  field.update(.016, 2.1, { gesture: gestureAt(1e300) });
  for (const child of field.group.children) assert.ok(child.geometry.attributes.position.array.every(Number.isFinite));
  field.clear();
  assert.equal(field.getStats().drawCalls, 0);
  field.dispose(); field.dispose();
  field.update(.016, 3, { gesture: gestureAt(0) });
  assert.equal(field.getStats().disposed, true);
  assert.equal(field.group.children.length, 0);
});
