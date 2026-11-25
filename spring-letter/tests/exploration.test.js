import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPLORATION_ANCHORS as A, SEED_START, SEED_GATES, ECHO_SITES, createExplorationState, restoreExplorationState, restartExploration, stepExploration } from '../src/exploration-model.js';
import { createExploration } from '../src/exploration.js';
import { createState, serialize, restore } from '../src/game-model.js';

const progress = { p1: { solved: true }, wind: { solved: true } };
const dt = 1 / 60;
function input(key, overrides = {}) { return { player: { x: A[key].x, z: A[key].z }, progress, ...overrides }; }
function brush(key, x, z, active = true) { return { active, strength: 1, position: { x: A[key].x + x, y: A[key].y + .3, z: A[key].z + z } }; }
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze); } return value; }
function run(state, frames, options) { let signals = []; for (let i = 0; i < frames; i++) { const result = stepExploration(state, typeof options === 'function' ? options(i, state) : options, dt); state = result.state; signals.push(...result.signals); } return { state, signals }; }

test('wind brush trace requires spatial travel, survives a short release and completes in either direction', () => {
  for (const direction of [1, -1]) {
    let state = createExplorationState();
    state = run(state, 180, input('rain', { gesture: brush('rain', 1.28, 0) })).state;
    assert.equal(state.rain.done, false, 'stationary hold cannot draw a circle');
    let completion = [];
    for (let i = 0; i <= 160; i++) {
      if (i === 70) state = run(state, 35, input('rain', { gesture: { active: false } })).state;
      const angle = direction * i / 160 * Math.PI * 2;
      const result = stepExploration(state, input('rain', { gesture: brush('rain', Math.cos(angle) * 1.28, Math.sin(angle) * 1.28) }), dt);
      state = result.state; completion.push(...result.signals.filter(x => x.type === 'complete'));
    }
    assert.equal(state.rain.done, true);
    assert.equal(completion.length, 1);
    assert.equal(completion[0].first, true);
  }
});

test('clicking, pointer jumps, remote gestures and paused/locked scenes cannot auto-complete a garden', () => {
  let state = createExplorationState();
  state = run(state, 120, i => input('rain', { gesture: brush('rain', Math.cos(i * Math.PI) * 1.28, Math.sin(i * Math.PI) * 1.28) })).state;
  assert.equal(state.rain.done, false);
  state = run(state, 120, i => input('rain', { interactive: false, gesture: brush('rain', Math.cos(i * .1) * 1.28, Math.sin(i * .1) * 1.28) })).state;
  assert.equal(state.rain.done, false);
  const locked = run(createExplorationState(), 120, input('wind', { progress: {}, gesture: brush('wind', SEED_GATES[0].x, SEED_GATES[0].z) })).state;
  assert.deepEqual(locked.wind.seed, { ...SEED_START, vx: 0, vz: 0 });
  const remote = run(createExplorationState(), 120, input('rain', { player: { x: 30, z: 30 }, gesture: brush('rain', 1.28, 0) })).state;
  assert.deepEqual(remote.seen, []);
});

test('a seed follows three ordered gates, needs a deliberate release, and only replays after an explicit request', () => {
  let state = createExplorationState(), elapsed = 0, allSignals = [];
  for (let gate = 0; gate < 3; gate++) {
    for (let frame = 0; frame < 900 && state.wind.stage <= gate; frame++) {
      const p = SEED_GATES[gate]; elapsed += dt;
      const result = stepExploration(state, input('wind', { time: elapsed, gesture: brush('wind', p.x, p.z) }), dt);
      state = result.state; allSignals.push(...result.signals);
    }
    assert.equal(state.wind.stage, gate + 1, `reachable gate ${gate + 1}`);
  }
  state = run(state, 180, input('wind', { gesture: brush('wind', SEED_GATES[2].x, SEED_GATES[2].z) })).state;
  assert.equal(state.wind.done, false, 'gripping the seed does not count as delivery');
  const released = run(state, 180, input('wind', { gesture: { active: false, released:true }, time: elapsed })); state = released.state;
  assert.equal(state.wind.done, true);
  assert.equal(state.wind.hold, 1);
  assert.equal(released.signals.filter(x => x.type === 'complete').length, 1);
  assert.equal(allSignals.filter(x => x.type === 'checkpoint').length, 3);
  state = run(state, 45, input('wind', { gesture: brush('wind', SEED_START.x, SEED_START.z) })).state;
  assert.equal(state.wind.stage, 3, 'hovering or holding at the start must not silently reset');
  state=restartExploration(state,'wind');
  assert.equal(state.wind.stage,0);
  assert.equal(state.wind.done, true, 'reprise preserves the permanently restored garden');
});

test('missed seed routes cannot skip gates and a boundary return retains the last safe gate', () => {
  let state = createExplorationState();
  state.wind.seed = { ...SEED_GATES[2], vx: 0, vz: 0 };
  state = run(state, 120, input('wind', { gesture: { active: false } })).state;
  assert.equal(state.wind.stage, 0); assert.equal(state.wind.done, false);
  state.wind.stage = 1; state.wind.seed = { x: 5, z: 5, vx: 0, vz: 0 };
  const result = stepExploration(state, input('wind'), dt);
  assert.equal(result.state.wind.stage, 1);
  assert.equal(result.state.wind.seed.x, SEED_GATES[0].x);
  assert.equal(result.signals.some(x => x.type === 'soft-return' && x.reason === 'boundary'), true);
});

test('echo listening requires walking to each source and stillness with the brush put away', () => {
  let state = createExplorationState();
  const at = i => ({ x: A.tide.x + ECHO_SITES[i].x, z: A.tide.z + ECHO_SITES[i].z });
  state = run(state, 120, input('tide', { player: at(0), gesture: brush('tide', 0, 0) })).state;
  assert.equal(state.tide.index, 0, 'active wind disturbs the echo');
  const signals = [];
  for (let i = 0; i < 3; i++) {
    const result = run(state, 90, input('tide', { player: at(i), gesture: { active: false } }));
    state = result.state; signals.push(...result.signals);
    assert.equal(state.tide.index, i + 1);
    if (i < 2) { state = run(state, 100, input('tide', { player: at(i) })).state; assert.equal(state.tide.index, i + 1, 'must move to the next voice'); }
  }
  assert.equal(state.tide.done, true);
  assert.equal(signals.filter(s => s.type === 'memory').length, 3);
  assert.equal(signals.filter(s => s.type === 'complete').length, 1);
  assert.equal(signals.filter(s => s.type === 'memory').at(-1).text, signals.find(s => s.type === 'complete').text, 'completion must not overwrite the last letter with a different subtitle');
});

test('simulation is pure, bad frame values are harmless, and restoration safely supports old saves and reprises', () => {
  const state = freeze(createExplorationState()); const options = freeze(input('rain', { gesture: brush('rain', 1.28, 0) }));
  assert.doesNotThrow(() => stepExploration(state, options, dt));
  assert.deepEqual(state, createExplorationState());
  assert.deepEqual(restoreExplorationState(undefined), createExplorationState());
  const bad = restoreExplorationState({ rain: { mask: 999999, travel: Infinity }, wind: { done: true, stage: 500, seed: { x: Infinity } }, tide: { index: -8 }, seen: ['rain', 'rain', '__proto__'] });
  assert.equal(bad.wind.stage, 3); assert.equal(bad.wind.rounds, 1); assert.equal(bad.tide.index, 0); assert.deepEqual(bad.seen, ['rain']);
  assert.ok(Number.isFinite(bad.wind.seed.x));
  const restarted = restartExploration(bad, 'wind-terrace');
  assert.equal(restarted.wind.done, true); assert.equal(restarted.wind.stage, 0);
  const safe = stepExploration(bad, input('wind', { time: NaN, gesture: { active: true, position: { x: Infinity, z: NaN } } }), Infinity).state;
  function finiteNumbers(value) { if (typeof value === 'number') assert.ok(Number.isFinite(value)); else if (value && typeof value === 'object') Object.values(value).forEach(finiteNumbers); }
  finiteNumbers(safe);
});

test('a damaged saved rain trace cannot grant a first reward or duplicate a reprise without input', () => {
  for (const done of [false, true]) for (const [mask, travel] of [[4095, 6.2], [2047, 5.15], [999999, 1000]]) {
    const save = createState(); save.started = true;
    const raw = JSON.parse(serialize(save));
    Object.assign(raw.exploration.rain, { done, rounds: done ? 3 : 0, best: done ? 2.4 : 0, mask, travel, clock: 12 });
    const restored = restore(JSON.stringify(raw)).exploration;
    const firstFrame = stepExploration(restored, input('rain'), dt);
    assert.equal(firstFrame.signals.some(signal => signal.type === 'complete'), false);
    assert.equal(firstFrame.state.rain.done, done);
    assert.equal(firstFrame.state.rain.rounds, done ? 3 : 0);
    assert.equal(firstFrame.state.rain.best, done ? 2.4 : 0);
    assert.equal(restored.rain.mask, 0); assert.equal(restored.rain.travel, 0);
    const idle = run(firstFrame.state, 180, input('rain'));
    assert.equal(idle.signals.some(signal => signal.type === 'complete'), false);
    assert.equal(idle.state.rain.rounds, done ? 3 : 0);
  }
});

test('legitimate partial circles and already-earned reprises retain their progress through restoration', () => {
  for (const [mask, travel] of [[2047, 5.14], [1023, 6.2]]) {
    const boundary = createExplorationState(); Object.assign(boundary.rain, { mask, travel });
    const restored = restoreExplorationState(JSON.parse(JSON.stringify(boundary)));
    assert.equal(restored.rain.mask, mask); assert.equal(restored.rain.travel, travel);
    assert.equal(stepExploration(restored, input('rain'), dt).signals.some(signal => signal.type === 'complete'), false);
  }
  function stroke(state, start, end) {
    return run(state, end - start + 1, i => {
      const angle = (start + i) / 160 * Math.PI * 2;
      return input('rain', { gesture: brush('rain', Math.cos(angle) * 1.28, Math.sin(angle) * 1.28) });
    });
  }
  const earned = stroke(createExplorationState(), 0, 160).state;
  assert.equal(earned.rain.done, true); assert.equal(earned.rain.rounds, 1);
  for (const prior of [createExplorationState(), restartExploration(earned, 'rain')]) {
    const partial = stroke(prior, 0, 70).state;
    assert.ok(partial.rain.mask > 0 && partial.rain.travel > 0);
    const restored = restoreExplorationState(JSON.parse(JSON.stringify(partial)));
    assert.equal(restored.rain.mask, partial.rain.mask); assert.equal(restored.rain.travel, partial.rain.travel);
    assert.equal(restored.rain.done, prior.rain.done); assert.equal(restored.rain.rounds, prior.rain.rounds);
    const idle = stepExploration(restored, input('rain'), dt);
    assert.equal(idle.signals.some(signal => signal.type === 'complete'), false);
    const finished = stroke(idle.state, 71, 160);
    const rewards = finished.signals.filter(signal => signal.type === 'complete');
    assert.equal(rewards.length, 1); assert.equal(rewards[0].first, !prior.rain.done);
    assert.equal(finished.state.rain.rounds, prior.rain.rounds + 1);
    assert.equal(finished.state.rain.done, true);
  }
});

test('render layer exposes discoverable targets, gates rewards and only changes the exploration slice', () => {
  const layer = createExploration();
  const state = createExplorationState();
  const main = freeze({ p1: { solved: true }, wind: { solved: true }, player: { x: -12, z: -1 } });
  try {
    layer.update(1, dt, { exploration: state, progress: main, player: main.player });
    assert.equal(layer.context.nearTarget, 'rain-grove');
    assert.equal(layer.targets.wind.y, 2.5);
    assert.equal(layer.group.getObjectByName('rain-reward-bloom').visible, false);
    state.rain.done = true;
    layer.update(2, dt, { exploration: state, progress: main, player: main.player });
    assert.equal(layer.group.getObjectByName('rain-reward-bloom').visible, true);
    assert.equal(layer.group.getObjectByName('wind-reward-bloom').visible, false);
    layer.update(NaN, Infinity, { exploration: state, progress: main, player: { x: NaN, z: Infinity }, reducedMotion: true });
    layer.group.traverse(o => { assert.ok([...o.position.toArray(), ...o.scale.toArray(), ...o.quaternion.toArray()].every(Number.isFinite)); if (o.isInstancedMesh) assert.ok([...o.instanceMatrix.array].every(Number.isFinite)); });
  } finally { layer.dispose(); }
});

test('independent layers own mutable materials and disposal releases attached resources exactly once', () => {
  const a = createExploration(), b = createExploration();
  try {
    const resources = new Set(), bResources = new Set();
    function collect(layer, set) { layer.group.traverse(o => { if (o.geometry) set.add(o.geometry); for (const m of o.material ? [o.material].flat() : []) { set.add(m); for (const v of Object.values(m)) if (v?.isTexture) set.add(v); } }); }
    collect(a, resources); collect(b, bResources);
    for (const resource of resources) assert.equal(bResources.has(resource), false);
    let disposed = 0; for (const resource of resources) resource.addEventListener('dispose', () => disposed++);
    a.dispose(); a.dispose(); assert.equal(disposed, resources.size);
    assert.doesNotThrow(() => a.update(1, dt, {}));
  } finally { a.dispose(); b.dispose(); }
});

test('legacy main-game saves default new gardens safely, and a legitimate save retains all garden rewards', () => {
  const legacy = createState(); legacy.started = true; legacy.p1.solved = true;
  const oldRaw = JSON.parse(serialize(legacy)); delete oldRaw.exploration;
  const oldRestored = restore(JSON.stringify(oldRaw));
  assert.equal(oldRestored.started, true); assert.equal(oldRestored.p1.solved, true);
  assert.deepEqual(oldRestored.exploration, createExplorationState());
  const earned = createState(); earned.started = true; earned.p1.solved = true; earned.wind.solved = true;
  for (const key of ['rain', 'wind', 'tide']) { earned.exploration[key].done = true; earned.exploration[key].rounds = 2; }
  earned.exploration.wind.stage = 2; earned.exploration.wind.seed = { x: 1.5, z: -.8, vx: 2, vz: -1 };
  const saved = restore(serialize(earned));
  for (const key of ['rain', 'wind', 'tide']) { assert.equal(saved.exploration[key].done, true); assert.equal(saved.exploration[key].rounds, 2); }
  assert.equal(saved.bridge.solved, false); assert.equal(saved.exploration.wind.seed.vx, 0);
  assert.equal(saved.exploration.wind.seed.x, SEED_GATES[1].x);
});

test('reduced motion preserves the same task rules and keeps a steady visible echo guide', () => {
  const normal = run(createExplorationState(), 150, i => input('rain', { gesture: brush('rain', Math.cos(i / 149 * Math.PI * 2) * 1.28, Math.sin(i / 149 * Math.PI * 2) * 1.28) })).state;
  const reduced = run(createExplorationState(), 150, i => input('rain', { reducedMotion: true, gesture: brush('rain', Math.cos(i / 149 * Math.PI * 2) * 1.28, Math.sin(i / 149 * Math.PI * 2) * 1.28) })).state;
  assert.deepEqual(reduced, normal);
  const layer = createExploration();
  try {
    layer.update(1, dt, input('tide', { reducedMotion: true }));
    const cue = layer.group.getObjectByName('tide-echo-ripple-0');
    const scale = cue.scale.clone(), opacity = cue.material.opacity;
    layer.update(15, dt, input('tide', { reducedMotion: true }));
    assert.equal(cue.visible, true); assert.ok(opacity > .3); assert.equal(cue.material.opacity, opacity); assert.deepEqual(cue.scale, scale);
    assert.equal(layer.group.getObjectByName('wind-seed-wake').visible, false);
    assert.equal(layer.group.getObjectByName('rain-trace-guide').visible, true);
  } finally { layer.dispose(); }
});

test('a reserved gesture or modal cannot turn its inactive brush into an accidental delivery or echo', () => {
  let state = createExplorationState();
  state.wind.stage = 3; state.wind.touched = true; state.wind.seed = { ...SEED_GATES[2], vx: 0, vz: 0 };
  state = run(state, 180, input('wind', { interactive: false, gesture: { active: false } })).state;
  assert.equal(state.wind.hold, 0); assert.equal(state.wind.done, false);
  state = run(state, 180, input('wind', { interactive: true, gesture: { active: false, released:true } })).state;
  assert.equal(state.wind.done, true, 'a real release after the reserved action still delivers');
  const player = { x: A.tide.x + ECHO_SITES[0].x, z: A.tide.z + ECHO_SITES[0].z };
  state.tide.hold = .9;
  state = run(state, 180, input('tide', { player, interactive: false })).state;
  assert.equal(state.tide.index, 0); assert.equal(state.tide.hold, .9);
});
