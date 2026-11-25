import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createState } from '../src/game-model.js';
import { supportAt } from '../src/layout.js';
import { createLandscape } from '../src/landscape.js';
import { letterWaypoint } from '../src/letter-wayfinding.js';

const land = createLandscape();
after(() => land.dispose());
const open = () => {
  const state = createState();
  state.p1.solved = state.wind.solved = true;
  return state;
};
const floor = (point, state) => supportAt(point.x, point.z, state) || land.supportAt(point.x, point.z, state);
function assertWalkableSegment(a, b, state) {
  const steps = Math.max(1, Math.ceil(Math.hypot(a.x - b.x, a.z - b.z) / .025));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, point = { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    assert.ok(floor(point, state), `waypoint crosses water at ${point.x}, ${point.z}`);
  }
}
function walk(id, start, state, stride = .19) {
  let player = { ...start }, travelled = 0;
  for (let step = 0; step < 700; step++) {
    const waypoint = letterWaypoint(id, player, state);
    assert.ok(waypoint, `lost route to ${id} at ${player.x}, ${player.z}`);
    assertWalkableSegment(player, waypoint.target, state);
    assert.ok(Number.isFinite(waypoint.distance) && waypoint.distance >= 0);
    assert.equal(typeof waypoint.label, 'string');
    if (waypoint.arrived) {
      assert.ok(Math.hypot(player.x - waypoint.destination.x, player.z - waypoint.destination.z) < 3.9);
      return { player, travelled };
    }
    const d = Math.hypot(waypoint.target.x - player.x, waypoint.target.z - player.z);
    assert.ok(d > .001, 'arriving at a waypoint must advance to another waypoint');
    const amount = Math.min(stride, d);
    player.x += (waypoint.target.x - player.x) * amount / d;
    player.z += (waypoint.target.z - player.z) * amount / d;
    travelled += amount;
  }
  assert.fail(`route to ${id} oscillated or never arrived`);
}

test('new visitors reach rain on its walkable approach instead of crossing the water', () => {
  const state = createState(), first = letterWaypoint('rain', { x: 0, z: 6 }, state);
  assert.ok(first);
  assert.notDeepEqual(first.target, { x: -12, z: -1 });
  assert.deepEqual(first.destination, { x: -12, z: -1 });
  assert.equal(first.arrived, false);
  const { travelled } = walk('rain', { x: 0, z: 6 }, state);
  assert.ok(travelled > 8 && travelled < 30);
});

test('the last reply leads back along actual shore paths to the bridge writing platform',()=>{
 const state=open();const before=JSON.stringify(state);const route=walk('bridge',{x:-12,z:-29},state);
 assert.ok(Math.hypot(route.player.x,route.player.z+26)<=.8);assert.equal(JSON.stringify(state),before);
 assert.equal(letterWaypoint('bridge',{x:0,z:6},createState()),null);
 state.bridge.solved=true;assert.equal(letterWaypoint('bridge',{x:0,z:-26},state),null);
});

test('courtyard exits, main bridges, and the pool stepping stones connect all letter journeys', () => {
  const state = open();
  for (const [id, start] of [
    ['wind', { x: -12, z: -1 }], ['tide', { x: 12, z: -16 }],
    ['rain', { x: -12, z: -29 }], ['wind', { x: -12, z: -29 }],
    ['rain', { x: 12, z: -16 }], ['tide', { x: -12, z: -1 }],
  ]) {
    const { travelled } = walk(id, start, state);
    assert.ok(travelled < 90, 'a simple side-court journey must not loop');
  }
});

test('nearby waypoints advance for coarse steps and main-court visitors head directly to an exit', () => {
  const state = open();
  const next = letterWaypoint('rain', { x: -4.99, z: 1.01 }, state);
  assert.ok(next.target.x < -5.5, 'do not point backward at an already reached route node');
  const first = letterWaypoint('wind', { x: 0, z: 5 }, state);
  assert.ok(first.target.z <= -5, 'the main courtyard needs no trip through its center');
  assertWalkableSegment({ x: 0, z: 5 }, first.target, state);
  walk('tide', { x: -12, z: -1 }, state, .73);
  walk('rain', { x: -12, z: -29 }, state, .73);
});

test('arrival is local to the requested court and leaves game state and positions untouched', () => {
  const state = open(), before = structuredClone(state), player = Object.freeze({ x: -12, z: -1 });
  const result = letterWaypoint('rain', player, state);
  assert.equal(result.arrived, true);
  assert.equal(result.distance, 0);
  assert.deepEqual(result.target, { x: -12, z: -1 });
  assert.equal(letterWaypoint('wind', player, state).arrived, false);
  result.target.x = 1000;
  assert.equal(letterWaypoint('rain', player, state).target.x, -12);
  assert.deepEqual(state, before);
});

test('letter access follows p1 and wind gates and invalid requests return null', () => {
  const state = createState(), player = { x: 0, z: 6 };
  assert.ok(letterWaypoint('rain', player, state));
  assert.equal(letterWaypoint('wind', player, state), null);
  state.p1.solved = true;
  assert.ok(letterWaypoint('wind', player, state));
  assert.equal(letterWaypoint('tide', player, state), null);
  state.wind.solved = true;
  assert.ok(letterWaypoint('tide', player, state));
  for (const id of [null, 'unknown', {}, 0]) assert.equal(letterWaypoint(id, player, state), null);
  for (const invalid of [null, {}, { x: NaN, z: 0 }, { x: 0, z: Infinity }, { x: '0', z: 0 }, { x: 1000, z: 1000 }]) {
    assert.equal(letterWaypoint('rain', invalid, state), null);
  }
  for (const invalid of [null, undefined, [], true, 'open']) assert.equal(letterWaypoint('rain', player, invalid), null);
});

test('main island edges remain usable and optional bridges never invent a disconnected return route', () => {
  const state = open();
  for (const [id, start] of [
    ['rain', { x: 6.79, z: 0 }], ['tide', { x: -5.99, z: -16 }],
    ['wind', { x: -6.24, z: -29 }],
  ]) walk(id, start, state);
  assert.equal(letterWaypoint('rain', { x: 0, z: -32 }, state), null);
  state.bridge.structure = 'shield_rm';
  walk('rain', { x: 0, z: -32 }, state);
  state.bridge.structure = 'bridge_am';
  walk('rain', { x: 0, z: -32 }, state);
  state.bridge.structure = 'bridge_mf';
  state.bridge.solved = true;
  assert.equal(letterWaypoint('rain', { x: 0, z: -43 }, state), null);
});
