import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createLetterGarden, letterTilePosition, letterGoalPosition, letterSourcePosition, letterBoardBounds } from '../src/letter-garden.js';
import { LETTERS, createLetters, commitGardenLetter, evaluateLetter } from '../src/letter-model.js';

const progress = { p1: { solved: true }, wind: { solved: true } };

test('exported positions can be picked on every stone, including all quarter turns', () => {
  const garden = createLetterGarden(), letters = createLetters();
  try {
    for (const letter of LETTERS) {
      const bounds = letterBoardBounds(letter);
      for (let turn = 0; turn < 4; turn++) {
        for (const tile of letter.tiles) if (!tile.locked) letters.entries[letter.id].turns[tile.id] = turn;
        garden.update(1, 0, { letters, progress, activeId: letter.id, reducedMotion: true });
        for (const tile of letter.tiles) {
          const p = letterTilePosition(letter, tile);
          assert.ok(p.x >= bounds.min.x && p.x <= bounds.max.x && p.z >= bounds.min.z && p.z <= bounds.max.z);
          const ray = new THREE.Raycaster(new THREE.Vector3(p.x + .012, p.y + 3, p.z + .008), new THREE.Vector3(0, -1, 0));
          assert.deepEqual(garden.pick(ray), { letterId: letter.id, tileId: tile.id });
        }
      }
      for (const goal of letter.goals) {
        const p = letterGoalPosition(letter, goal);
        assert.ok(p.x >= bounds.min.x && p.x <= bounds.max.x && p.z >= bounds.min.z && p.z <= bounds.max.z);
      }
    }
    garden.update(2, 0, { letters, progress, activeId: null });
    assert.equal(garden.pick(new THREE.Raycaster(new THREE.Vector3(-12, 10, -1), new THREE.Vector3(0, -1, 0))), null);
  } finally { garden.dispose(); }
});

test('every committed choice has permanent growth after leaving and re-rotating', () => {
  const garden = createLetterGarden();
  try {
    for (const letter of LETTERS) for (const goal of letter.goals) {
      const letters = createLetters(); Object.assign(letters.entries[letter.id].turns, letter.solutions[goal.id]);
      garden.update(0, 0, { letters, progress, activeId: letter.id, reducedMotion: true });
      let snap = garden.snapshot();
      assert.ok(snap.drawCalls <= 40); assert.ok(snap.gardens.find(g => g.id === letter.id).ready.includes(goal.id));
      assert.equal(commitGardenLetter(letters, letter.id, goal.id).ok, true);
      letters.entries[letter.id].turns.b = (letters.entries[letter.id].turns.b + 1) % 4;
      garden.update(1, 0, { letters, progress, reducedMotion: true });
      snap = garden.snapshot();
      const court = snap.gardens.find(g => g.id === letter.id), growth = court.goals.find(g => g.id === goal.id);
      assert.equal(court.active, false); assert.equal(court.choice, goal.id);
      assert.equal(growth.kept, true); assert.equal(growth.opening, 1); assert.equal(court.particles, 0);
    }
  } finally { garden.dispose(); }
});

test('all frame-reused geometry, material and instance resources dispose exactly once', () => {
  const garden = createLetterGarden(), tracked = new Map();
  garden.group.traverse(object => {
    for (const resource of [object.geometry, object.material, object.isInstancedMesh ? object : null]) {
      if (!resource || tracked.has(resource)) continue;
      tracked.set(resource, 0); resource.addEventListener('dispose', () => tracked.set(resource, tracked.get(resource) + 1));
    }
  });
  const initialResources = garden.snapshot().resources, letters = createLetters();
  for (let i = 0; i < 30; i++) garden.update(i / 60, 1 / 60, { letters, progress, activeId: LETTERS[i % 3].id, palette: i % 2 ? '#e7a4b5' : { low: '#83b9aa', high: '#cdf0d0' } });
  assert.equal(garden.snapshot().resources, initialResources);
  garden.dispose(); garden.dispose(); garden.update(10, .1);
  for (const count of tracked.values()) assert.equal(count, 1);
  assert.equal(garden.group.children.length, 0); assert.equal(garden.snapshot().resources, 0);
});

test('source lifecycle follows dt, pauses, finishes once, and safely restarts after leaving', () => {
  const garden = createLetterGarden(), letters = createLetters(), options = { letters, progress, activeId: 'rain' };
  const step = seconds => { for (let frame = 0; frame < Math.round(seconds * 10); frame++) garden.update(frame / 10, .1, options); };
  try {
    garden.update(0, 0, options);
    assert.equal(garden.snapshot().sourcePhase, 'unfurling');
    step(1.5); assert.equal(garden.snapshot().sourcePhase, 'dissolving');
    const before = garden.snapshot().sourceTime;
    garden.update(1000, 0, options); assert.equal(garden.snapshot().sourceTime, before);
    step(1.5); assert.equal(garden.snapshot().sourcePhase, 'flowing');
    step(5.1); assert.equal(garden.snapshot().sourcePhase, 'returning');
    step(2.7); assert.equal(garden.snapshot().sourcePhase, 'whole'); assert.equal(garden.snapshot().sourceTime, 10.6);
    step(2); assert.equal(garden.snapshot().sourceTime, 10.6);
    assert.equal(garden.burstSource(), true); assert.equal(garden.snapshot().sourcePhase, 'unfurling');
    assert.equal(garden.burstSource('wind'), false);
    step(3); garden.update(1003, .1, { ...options, activeId: null });
    assert.equal(garden.snapshot().sourcePhase, 'whole');
    assert.equal(garden.snapshot().gardens.find(g => g.id === 'rain').sourceDustCount, 0);
    assert.equal(garden.burstSource(), false);
    garden.update(1003, .1, options); assert.equal(garden.snapshot().sourceTime, 0); assert.equal(garden.snapshot().sourcePhase, 'unfurling');
  } finally { garden.dispose(); }
});

test('source grains remain on propagated edges during flow and both tide flowers can be picked', () => {
  const garden = createLetterGarden(), letters = createLetters(), letter = LETTERS.find(l => l.id === 'tide');
  Object.assign(letters.entries.tide.turns, letter.solutions.new);
  const options = { letters, progress, activeId: 'tide', flowerForm: 'dahlia' };
  try {
    garden.update(0, 0, options);
    for (let frame = 1; frame <= 40; frame++) garden.update(frame / 10, .1, options);
    const snap = garden.snapshot(), court = snap.gardens.find(g => g.id === 'tide'), edges = evaluateLetter(letter, letters.entries.tide).edges;
    assert.equal(court.sourcePhase, 'flowing'); assert.equal(court.sourceDustCount, 240); assert.ok(snap.drawCalls <= 40);
    const dust = garden.group.getObjectByName('tide-channel-flower-dust'), matrix = new THREE.Matrix4(), position = new THREE.Vector3(), scale = new THREE.Vector3();
    for (let index = court.sourceDustStart; index < court.sourceDustStart + court.sourceDustCount; index++) {
      dust.getMatrixAt(index, matrix); scale.setFromMatrixScale(matrix); if (scale.x < .0001) continue;
      position.setFromMatrixPosition(matrix); position.x += letter.x; position.z += letter.z;
      assert.ok(edges.some(edge => {
        const a = letterTilePosition(letter, { c: edge.from[0], r: edge.from[1] }), b = letterTilePosition(letter, { c: edge.to[0], r: edge.to[1] });
        const dx = b.x - a.x, dz = b.z - a.z, t = ((position.x - a.x) * dx + (position.z - a.z) * dz) / (dx * dx + dz * dz);
        return t >= -1e-5 && t <= 1 + 1e-5 && Math.hypot(position.x - a.x - t * dx, position.z - a.z - t * dz) < 1e-5;
      }));
    }
    for (let index = 0; index < 2; index++) {
      const p = letterSourcePosition(letter, index), ray = new THREE.Raycaster(new THREE.Vector3(p.x, p.y + 3, p.z), new THREE.Vector3(0, -1, 0));
      assert.equal(garden.pickSource(ray), 'tide');
      assert.equal(garden.pick(ray), null);
      garden.update(5, 0, { ...options, activeId: null }); assert.equal(garden.pickSource(ray), null);
      garden.update(5, 0, options);
    }
  } finally { garden.dispose(); }
});

test('four source flower forms share fixed resources and reduced motion omits detached grains', () => {
  const garden = createLetterGarden(), letters = createLetters(), resources = garden.snapshot().resources;
  try {
    for (const [flowerForm, petals] of Object.entries({ lily: 6, lotus: 18, iris: 6, dahlia: 24 })) {
      const options = { letters, progress, activeId: 'rain', flowerForm, reducedMotion: true };
      garden.update(0, 0, options); garden.burstSource();
      for (let frame = 0; frame < 50; frame++) garden.update(frame / 10, .1, options);
      const snap = garden.snapshot(), court = snap.gardens.find(g => g.id === 'rain');
      assert.equal(court.sourcePhase, 'flowing'); assert.equal(court.sources[0].petals, petals);
      assert.equal(court.sourceDustCount, 0); assert.equal(court.sourceReducedMotion, true); assert.equal(snap.resources, resources);
      assert.equal(garden.group.getObjectByName('rain-source-flower-petals').count, petals);
    }
  } finally { garden.dispose(); }
});
