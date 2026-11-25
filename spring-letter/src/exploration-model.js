// Original, deterministic garden interactions. No rendering, clocks, DOM or storage.
export const EXPLORATION_ANCHORS = Object.freeze({
  rain: Object.freeze({ id: 'rain-grove', title: '雨留庭', x: -12, y: 1.6, z: -1, need: 0 }),
  wind: Object.freeze({ id: 'wind-terrace', title: '风过庭', x: 12, y: 2.5, z: -16, need: 1 }),
  tide: Object.freeze({ id: 'tide-vault', title: '潮生庭', x: -12, y: 1.1, z: -29, need: 2 }),
});
export const SEED_START = Object.freeze({ x: -1.18, z: 1.05 });
export const SEED_GATES = Object.freeze([
  Object.freeze({ x: -1.28, z: -.42 }),
  Object.freeze({ x: -.22, z: -1.3 }),
  Object.freeze({ x: 1.12, z: -.83 }),
]);
export const ECHO_SITES = Object.freeze([
  Object.freeze({ x: -1.08, z: .7, text: '岑的旧记录：风暴里，合拢的花替我们保住了雨声。' }),
  Object.freeze({ x: .98, z: .65, text: '无名回信：我想在这里，等一场新的雨。' }),
  Object.freeze({ x: .03, z: -1.22, text: '给后来者：种核只有两枚。那第三个愿望，也请记得。' }),
]);
const TAU = Math.PI * 2;
const finite = (n, fallback = 0) => Number.isFinite(n) ? n : fallback;
const clamp = (n, min, max) => Math.max(min, Math.min(max, finite(n, min)));
const int = (n, max = 1000000) => Math.floor(clamp(n, 0, max));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const bits = n => { let count = 0; for (let i = 0; i < 12; i++) count += (n >> i) & 1; return count; };
const rainTraceComplete = state => bits(state.mask) >= 11 && state.travel >= 5.15;
const seed = (p = SEED_START) => ({ x: p.x, z: p.z, vx: 0, vz: 0 });
const rain = () => ({ done: false, rounds: 0, mask: 0, travel: 0, lastAngle: null, gap: 0, clock: 0, best: 0, flash: 0 });
const wind = () => ({ done: false, rounds: 0, stage: 0, seed: seed(), touched: false, catching: false, hold: 0, rest: 0, bumps: 0, clock: 0, best: 0, flash: 0 });
const tide = () => ({ done: false, rounds: 0, index: 0, hold: 0, lastX: null, lastZ: null, pulse: 0, clock: 0, flash: 0 });

export function createExplorationState() {
  return { version: 1, rain: rain(), wind: wind(), tide: tide(), seen: [] };
}

export function restoreExplorationState(value) {
  const state = createExplorationState();
  if (!value || typeof value !== 'object') return state;
  for (const key of ['rain', 'wind', 'tide']) {
    const source = value[key];
    if (!source || typeof source !== 'object') continue;
    const target = state[key];
    target.done = source.done === true;
    target.rounds = Math.max(target.done ? 1 : 0, int(source.rounds));
    target.clock = clamp(source.clock, 0, 86400);
    target.flash = 0;
    if ('best' in target) target.best = clamp(source.best, 0, 86400);
  }
  state.rain.mask = int(value.rain?.mask, 4095);
  state.rain.travel = clamp(value.rain?.travel, 0, TAU);
  // A qualifying trace is consumed and cleared in the very same simulation
  // step. Such a saved transient is impossible, even during an earned reprise.
  // Drop only that attempt; never manufacture or erase a permanent reward.
  if (rainTraceComplete(state.rain)) {
    state.rain.mask = 0; state.rain.travel = 0; state.rain.clock = 0;
  }
  state.wind.stage = int(value.wind?.stage, 3);
  state.wind.bumps = int(value.wind?.bumps);
  state.wind.touched = state.wind.stage > 0;
  // Never revive a half-integrated velocity or a seed outside the playable garden.
  state.wind.seed = seed(state.wind.stage ? SEED_GATES[state.wind.stage - 1] : SEED_START);
  if (state.wind.stage === 3 && state.wind.done) state.wind.hold = 1;
  state.tide.index = int(value.tide?.index, 3);
  if (state.tide.index === 3 && !state.tide.done) state.tide.index = 2;
  state.seen = [...new Set(Array.isArray(value.seen) ? value.seen.filter(x => ['rain', 'wind', 'tide'].includes(x)) : [])];
  return state;
}

function copyState(state) {
  return { ...state, rain: { ...state.rain }, wind: { ...state.wind, seed: { ...state.wind.seed } }, tide: { ...state.tide }, seen: [...state.seen] };
}

export function cancelExplorationGuidance(previous) {
  const state=copyState(previous);
  state.wind.catching=false;
  if(state.wind.hold<1)state.wind.hold=0;
  state.wind.seed.vx=state.wind.seed.vz=0;
  return state;
}

export function restartExploration(state, id) {
  const key = Object.keys(EXPLORATION_ANCHORS).find(key => key === id || EXPLORATION_ANCHORS[key].id === id);
  const next = copyState(state);
  if (!key) return next;
  next[key] = ({ rain, wind, tide })[key]();
  next[key].done = state[key].done;
  next[key].rounds = state[key].rounds;
  if ('best' in next[key]) next[key].best = state[key].best;
  return next;
}

function unlocked(key, progress) {
  return key === 'rain' || (key === 'wind' ? progress?.p1?.solved === true : progress?.wind?.solved === true);
}

export function explorationContext(state, input = {}, anchors = EXPLORATION_ANCHORS) {
  const player = input.player || { x: 0, z: 0 };
  const key = ['rain', 'wind', 'tide'].find(key => unlocked(key, input.progress) && distance(player, anchors[key]) < 4.1);
  const completed = ['rain', 'wind', 'tide'].filter(key => state[key].done).length;
  const base = { nearTarget: key ? anchors[key].id : null, key: key || null, title: key ? anchors[key].title : '', completed, total: 3, progress: 0, objective: '为三座失联春庭递出春信', hint: '岔路上的悬花与风铃，正等一位愿意绕远的送信人。', touchHint: '用屏幕方向键走向岔路，关闭风笔时可单指环看。' };
  if (key === 'rain') return { ...base, progress: state.rain.done && !state.rain.mask ? 1 : Math.min(1, bits(state.rain.mask) / 11, state.rain.travel / 5.15), objective: '用一圈风，缝回雨留庭的春天', hint: state.rain.done ? '花庭已醒。沿悬花继续画圈，听不同方向的风如何和鸣。' : '按住空格＋拖动风笔，沿悬花缓缓画一圈；短暂停笔，可以接着画。', touchHint: state.rain.done ? '花庭已醒。开启「风笔」，可再写一圈春风。' : '开启底部「风笔」，沿悬花缓缓画一圈。抬手后可以接着画。' };
  if (key === 'wind') return { ...base, progress: state.wind.stage / 3 * .8 + Math.min(1, state.wind.hold) * .2, objective: state.wind.hold >= 1 ? '种子已经在花巢扎根' : '牵着种子，走过三道亮门', hint: state.wind.hold >= 1 ? '沿途的花为这封信开了。想再试一次，可以选择「再送一程」。' : state.wind.stage === 3 ? '花巢已经打开。松开风笔，让种子落下。' : '按住空格拖动风笔，把种子牵到笔尖。沿花粉走向下一道亮门；停笔时，它也会慢下来。', touchHint: state.wind.hold >= 1 ? '种子已经扎根。想再试一次，可以选择「再送一程」。' : state.wind.stage === 3 ? '花巢已经打开。抬起手指，让种子落下。' : '开启「风笔」，按住拖动，把种子牵到笔尖。沿花粉穿过亮门。' };
  if (key === 'tide') return { ...base, progress: Math.min(1, (state.tide.index + state.tide.hold) / 3), objective: '循着花铃，听完三段无名来信', hint: state.tide.index === 3 ? '来信已经完整。离庭再回来，潮声仍会讲给你听。' : '走近正在发光的回声花，松开风笔，停步静听；下一句藏在另一朵花里。', touchHint: state.tide.index === 3 ? '来信已经完整。离庭再回来，潮声仍会讲给你听。' : '用方向键走近发光的回声花，抬起手指，停步静听。' };
  return base;
}

function complete(signals, key, state, title, text) {
  const first = !state.done;
  state.done = true;
  state.rounds++;
  state.flash = 1;
  if ('best' in state && (!state.best || state.clock < state.best)) state.best = state.clock;
  signals.push({ type: 'complete', key, id: EXPLORATION_ANCHORS[key].id, title, text, first, rounds: state.rounds });
}

/** A pure simulation step. Inputs and prior state are never mutated. */
export function stepExploration(previous, input = {}, delta = 0, anchors = EXPLORATION_ANCHORS) {
  const state = input.interactive===false||input.cancelled===true?cancelExplorationGuidance(previous):copyState(previous);
  const signals = [];
  const dt = clamp(delta, 0, .05);
  const time = finite(input.time);
  const player = { x: finite(input.player?.x), z: finite(input.player?.z) };
  const gesture = input.gesture || {};
  const pos = gesture.position;
  const validBrush = !!pos && Number.isFinite(pos.x) && Number.isFinite(pos.z);
  const active = gesture.active === true && validBrush;
  const interactive = input.interactive !== false && input.cancelled !== true;
  for (const key of ['rain', 'wind', 'tide']) {
    state[key].flash = Math.max(0, state[key].flash - dt * .6);
    if (!interactive || !unlocked(key, input.progress) || distance(player, anchors[key]) > 4.1 || dt === 0) continue;
    if (!state.seen.includes(key)) {
      state.seen.push(key);
      signals.push({ type: 'discover', key, id: anchors[key].id, title: anchors[key].title });
    }
    const a = anchors[key];
    const brush = validBrush ? { x: pos.x - a.x, z: pos.z - a.z } : null;
    state[key].clock += dt;

    if (key === 'rain') {
      const r = state.rain;
      const radius = brush ? Math.hypot(brush.x, brush.z) : Infinity;
      if (active && radius > .9 && radius < 1.65) {
        const angle = Math.atan2(brush.z, brush.x);
        let movement = r.lastAngle === null ? 0 : Math.atan2(Math.sin(angle - r.lastAngle), Math.cos(angle - r.lastAngle));
        // A teleported pointer cannot fill petals across the missing arc.
        if (Math.abs(movement) > .7) movement = 0;
        if (Math.abs(movement) > .002) {
          const segment = Math.floor(((angle + TAU) % TAU) / TAU * 12);
          const old = r.mask;
          r.mask |= 1 << segment;
          r.travel += Math.abs(movement);
          if (r.mask !== old) signals.push({ type: 'checkpoint', key, id: a.id, step: bits(r.mask), total: 12 });
        }
        r.lastAngle = angle;
        r.gap = 0;
      } else {
        r.lastAngle = null;
        r.gap += dt;
        if (r.gap > 2.5) {
          r.travel = Math.max(0, r.travel - dt * 1.6);
          if (r.travel <= .01) r.mask = 0;
        }
      }
      if (rainTraceComplete(r)) {
        complete(signals, key, r, '雨留庭 · 写给旧日', '岑在花环背面留了一行小字：记住故乡，不必让每朵花都重复同一个春天。');
        r.mask = 0; r.travel = 0; r.lastAngle = null; r.clock = 0;
      }
    }

    if (key === 'wind') {
      const w = state.wind;
      if (w.hold >= 1) continue; // Another delivery is an explicit replay action.
      const s = w.seed, nest = SEED_GATES[2];
      const brushDistance = active ? distance(brush, s) : Infinity;
      const guiding = active && brushDistance < 2.65;
      if (guiding) w.touched = true;
      if(active){w.catching=false;w.hold=0;}
      if(w.stage===3&&w.touched&&!active&&gesture.released===true&&distance(s,nest)<.7)w.catching=true;
      if (w.catching && !active) {
        const ease = 1 - Math.exp(-dt * 5);
        s.x += (nest.x - s.x) * ease; s.z += (nest.z - s.z) * ease;
        s.vx *= Math.exp(-dt * 8); s.vz *= Math.exp(-dt * 8);
        w.hold = Math.min(1, w.hold + dt / .7);
        if (w.hold >= 1) complete(signals, key, w, '风过庭 · 写给远方', '船舷旧便笺：把种子送到避风处。余下的路，让它自己长。');
        continue;
      }
      w.hold = 0;
      let vx = 0, vz = 0;
      if (guiding && brushDistance > .015) {
        const speed = Math.min(1.35, brushDistance * 3.5);
        vx = (brush.x - s.x) / brushDistance * speed;
        vz = (brush.z - s.z) / brushDistance * speed;
      }
      const ease = 1 - Math.exp(-dt * (guiding ? 7 : 8));
      s.vx += (vx - s.vx) * ease; s.vz += (vz - s.vz) * ease;
      s.x += s.vx * dt; s.z += s.vz * dt;
      const centerDistance = Math.hypot(s.x, s.z);
      if (centerDistance < .43) {
        const nx = centerDistance > .001 ? s.x / centerDistance : -1;
        const nz = centerDistance > .001 ? s.z / centerDistance : 0;
        s.x = nx * .44; s.z = nz * .44;
        const inward = Math.min(0, s.vx * nx + s.vz * nz); s.vx -= nx * inward; s.vz -= nz * inward;
        if (w.flash < .1) { w.bumps++; w.flash = .7; signals.push({ type: 'soft-return', key, id: a.id, reason: 'eddy', text: '石心挡住了种子。沿花粉绕过去，亮起的风门会保留。' }); }
      }
      if (Math.hypot(s.x, s.z) > 2.05) {
        w.seed = seed(w.stage ? SEED_GATES[w.stage - 1] : SEED_START);
        w.bumps++; w.flash = .8;
        signals.push({ type: 'soft-return', key, id: a.id, reason: 'boundary', text: '种子回到上一道风门。把风笔靠近，再牵着它向亮门走。' });
      }
      if (w.touched && w.stage < 3 && distance(w.seed, SEED_GATES[w.stage]) < .43) {
        w.stage++;
        signals.push({ type: 'checkpoint', key, id: a.id, step: w.stage, total: 3 });
      }
    }

    if (key === 'tide') {
      const e = state.tide;
      if (e.index >= 3) {
        // Returning from the side path starts a listening reprise, without erasing its reward.
        if (distance(player, a) > 3.3) { e.index = 0; e.hold = 0; e.clock = 0; }
        continue;
      }
      const site = ECHO_SITES[e.index];
      const local = { x: player.x - a.x, z: player.z - a.z };
      const d = distance(local, site);
      const speed = e.lastX === null ? 0 : Math.hypot(player.x - e.lastX, player.z - e.lastZ) / dt;
      e.lastX = player.x; e.lastZ = player.z;
      e.pulse -= dt;
      if (e.pulse <= 0) {
        e.pulse = .8 + Math.min(d, 3) * .45;
        signals.push({ type: 'echo', key, id: a.id, step: e.index, proximity: clamp(1 - d / 4, 0, 1), x: a.x + site.x, z: a.z + site.z });
      }
      if (!active && d < .72 && speed < .35) e.hold = Math.min(1, e.hold + dt / 1.25);
      else e.hold = Math.max(0, e.hold - dt * 1.5);
      if (e.hold >= 1) {
        signals.push({ type: 'memory', key, id: a.id, step: e.index + 1, total: 3, text: site.text });
        e.index++; e.hold = 0; e.flash = 1;
        if (e.index >= 3) complete(signals, key, e, '潮生庭 · 写给眼前', ECHO_SITES[2].text);
      }
    }
  }
  return { state, signals, context: explorationContext(state, input, anchors) };
}
