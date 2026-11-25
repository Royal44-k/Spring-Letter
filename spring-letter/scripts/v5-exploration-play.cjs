/* Real input acceptance. Diagnostics are read-only; no state setters or injected saves. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'evidence');
fs.mkdirSync(evidence, { recursive: true });
const url = process.env.SPRING_URL || 'http://127.0.0.1:5192';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let build = null;
  const errors = [], checks = [], route = [], captures = [];
  page.on('pageerror', e => errors.push(e.stack));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  const snap = () => page.evaluate(() => window.__SPRING__.snapshot());
  const project = (x, y, z) => page.evaluate(p => window.__SPRING__.project(...p), [x, y, z]);
  async function check(name, fn) { await fn(); checks.push(name); console.log('PASS ' + name); }
  async function capture(name) { const file = `v5-exploration-${name}.png`; await page.waitForTimeout(700); await page.screenshot({ path: path.join(evidence, file) }); captures.push(file); }
  async function walkTo(x, z) {
    const start = Date.now(); let down = [];
    try {
      while (Date.now() - start < 90000) {
        const s = await snap(), p = s.state.player, azimuth = s.view.azimuth;
        const dx = x - p.x, dz = z - p.z;
        if (Math.hypot(dx, dz) < .22) { route.push({ target: [x, z], actual: [p.x, p.z], elevation: s.presentation.actor[1] }); console.log(`WALK ${x}, ${z}`); return; }
        const right = dx * Math.cos(azimuth) - dz * Math.sin(azimuth);
        const forward = -dx * Math.sin(azimuth) - dz * Math.cos(azimuth);
        const wanted = [];
        // Choose the nearest of the eight actual keyboard directions. Merely
        // pressing both nonzero axes can steer outward on a narrow bridge.
        if (Math.abs(right) > Math.abs(forward) * .4142) wanted.push(right > 0 ? 'KeyD' : 'KeyA');
        if (Math.abs(forward) > Math.abs(right) * .4142) wanted.push(forward > 0 ? 'KeyW' : 'KeyS');
        for (const key of down) if (!wanted.includes(key)) await page.keyboard.up(key);
        for (const key of wanted) if (!down.includes(key)) await page.keyboard.down(key);
        down = wanted; await page.waitForTimeout(45);
      }
      throw new Error(`Walk stalled at ${JSON.stringify((await snap()).state.player)}, target ${x},${z}`);
    } finally { for (const key of down) await page.keyboard.up(key); }
  }
  async function routeTo(points) { for (const p of points) await walkTo(...p); }
  async function aim(x, y, z) { const p = await project(x, y, z); assert.ok(p.x > 0 && p.x < 1440 && p.y > 0 && p.y < 900, 'world target is visible'); await page.mouse.move(p.x, p.y); }
  async function beginBrush(x, y, z) { await page.keyboard.down('Space'); await aim(x, y, z); await page.mouse.down(); }
  async function endBrush() { await page.mouse.up(); await page.keyboard.up('Space'); }
  try {
    await page.goto(url); await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 });
    build = await page.locator('script[type="module"]').first().getAttribute('src');
    await page.waitForSelector('#loading', { state: 'hidden', timeout: 30000 });
    await page.locator('#begin').click(); await page.locator('#opening-skip').click(); await page.waitForTimeout(1200);
    await check('new game begins with all three gardens unfinished', async () => {
      const s = (await snap()).state.exploration; assert.ok(!s.rain.done && !s.wind.done && !s.tide.done);
    });
    await routeTo([[-5, 1], [-7.5, 2], [-10, 2.2], [-12, -1]]);
    await page.waitForTimeout(1300); await capture('01-rain-arrival');
    await check('rain side route is walkable before any main puzzle', async () => { const s = await snap(); assert.equal(s.exploration.nearTarget, 'rain-grove'); assert.equal(s.state.p1.solved, false); assert.ok(s.presentation.actor[1] > 1.7); });
    const beforeOrbit = await snap();
    await page.mouse.move(200, 360); await page.mouse.down(); await page.mouse.move(1300, 360, { steps: 44 }); await page.mouse.up();
    await page.mouse.move(200, 360); await page.mouse.down(); await page.mouse.move(400, 360, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(800);
    await check('ordinary left drag completes more than a full 360-degree orbit without drawing', async () => { const s = await snap(); assert.ok(Math.abs(s.view.azimuth - beforeOrbit.view.azimuth) > Math.PI * 2); assert.equal(s.state.exploration.rain.mask, 0); assert.equal(s.gesture.active, false); });
    await page.mouse.move(1300, 360); await page.mouse.down({ button: 'right' }); await page.mouse.move(200, 360, { steps: 44 }); await page.mouse.up({ button: 'right' });
    await page.mouse.move(400, 360); await page.mouse.down({ button: 'right' }); await page.mouse.move(200, 360, { steps: 8 }); await page.mouse.up({ button: 'right' }); await page.waitForTimeout(1100);
    await beginBrush(-10.72, 1.9, -1);
    await page.waitForTimeout(1000);
    assert.equal((await snap()).state.exploration.rain.done, false, 'holding a flower does not complete its trace');
    for (let i = 1; i <= 132; i++) {
      const a = i / 132 * Math.PI * 2;
      await aim(-12 + Math.cos(a) * 1.28, 1.9, -1 + Math.sin(a) * 1.28);
      await page.waitForTimeout(35);
      if (i === 65) await capture('02-rain-half-trace');
    }
    await endBrush(); await page.waitForTimeout(800);
    await check('visible world-space ring is completed by a continuous wind-brush circle', async () => assert.equal((await snap()).state.exploration.rain.done, true));
    await capture('03-rain-restored');
    await routeTo([[-10.3, -4], [-7, -3], [-5, -2.5], [0, 4]]);
    await page.keyboard.press('KeyE'); await page.waitForTimeout(1500);
    // The flower workbench is intentionally secondary. Open the first route by
    // an actual slow upward wind-brush stroke on the flower, not hidden controls.
    await page.keyboard.down('Space'); await page.mouse.move(640, 550); await page.mouse.down();
    await page.mouse.move(640, 398, { steps: 38 });
    await page.mouse.up(); await page.keyboard.up('Space');
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.p1.solved, null, { timeout: 20000 });
    await page.keyboard.press('Escape');
    await routeTo([[0, -10], [0, -14], [4.5, -15], [7, -12], [10, -12.7], [12, -16]]);
    await page.waitForTimeout(1300); await capture('04-wind-arrival');
    await check('wind terrace is reached along its sloped side route', async () => { const s = await snap(); assert.equal(s.exploration.nearTarget, 'wind-terrace'); assert.ok(s.presentation.actor[1] > 2.6); });
    await beginBrush(12, 2.8, -16); await page.waitForTimeout(6000);
    await check('central eddy gives a soft failure without erasing the garden reward', async () => { const s = (await snap()).state.exploration; assert.ok(s.wind.bumps > 0); assert.equal(s.rain.done, true); assert.equal(s.wind.done, false); });
    await capture('05-wind-soft-failure');
    const gates = [[-1.28, -.42], [-.22, -1.3], [1.12, -.83]];
    for (let i = 0; i < 3; i++) {
      await aim(12 + gates[i][0], 2.8, -16 + gates[i][1]);
      await page.waitForFunction(index => window.__SPRING__.snapshot().state.exploration.wind.stage > index, i, { timeout: 30000 });
    }
    await page.waitForTimeout(900); assert.equal((await snap()).state.exploration.wind.done, false);
    await endBrush(); await page.waitForFunction(() => window.__SPRING__.snapshot().state.exploration.wind.done, null, { timeout: 15000 });
    await check('seed retries after the eddy, passes gates in order and settles only after release', async () => assert.equal((await snap()).state.exploration.wind.hold, 1));
    await capture('06-wind-delivered');
    await beginBrush(12 - 1.18, 2.8, -16 + 1.05); await page.waitForTimeout(1000); await endBrush();
    await check('returning the brush to the postmark starts a reprise and retains the permanent reward', async () => { const w = (await snap()).state.exploration.wind; assert.equal(w.stage, 0); assert.equal(w.done, true); });
    await routeTo([[10.2, -19], [7, -20], [4.5, -18], [0, -15]]);
    await page.keyboard.press('KeyE'); await page.waitForTimeout(1500);
    assert.equal((await snap()).focus, 'wind');
    const waypoints = [[-1, 2.3], [3, 1.4], [3, -2]];
    let waypoint = 0, windStart = Date.now();
    while (Date.now() - windStart < 120000) {
      const w = (await snap()).state.wind; if (w.solved) break;
      const goal = waypoints[waypoint], dx = goal[0] - w.x, dz = goal[1] - w.z, d = Math.hypot(dx, dz);
      if (d < .45 && waypoint < 2) { waypoint++; continue; }
      if (waypoint === 2 && Math.hypot(w.x - 3, w.z + 2) < .6) { await page.mouse.move(40, 85); await page.waitForTimeout(80); continue; }
      await aim(w.x - dx / Math.max(.001, d) * .67, .5, w.z - dz / Math.max(.001, d) * .67 - 16);
      await page.waitForTimeout(45);
    }
    assert.equal((await snap()).state.wind.solved, true, 'main wind path opens by ordinary input');
    await page.keyboard.press('Escape');
    await routeTo([[0, -21], [0, -26], [-5, -29], [-7, -29], [-8.6, -31], [-12, -29]]);
    await page.waitForTimeout(1100); await capture('07-tide-arrival');
    await check('tide garden uses the physical west branch from platform R', async () => { const s = await snap(); assert.equal(s.exploration.nearTarget, 'tide-vault'); assert.equal(s.state.bridge.solved, false); });
    for (const point of [[-13.08, -28.3], [-11.02, -28.35], [-11.97, -30.22]]) {
      const index = (await snap()).state.exploration.tide.index;
      await walkTo(...point);
      await page.waitForFunction(before => window.__SPRING__.snapshot().state.exploration.tide.index > before, index, { timeout: 12000 });
    }
    await check('three spatial echoes require separate walks and quiet listening', async () => { const e = (await snap()).state.exploration; assert.equal(e.tide.done, true); assert.equal(e.tide.index, 3); assert.equal(e.rain.done, true); assert.equal(e.wind.done, true); });
    await capture('08-tide-complete');
    await page.waitForTimeout(5500); await page.reload(); await page.waitForFunction(() => window.__SPRING__); await page.locator('#continue').click();
    await check('ordinary reload preserves all three restored gardens and still-locked finale', async () => { const s = (await snap()).state; assert.ok(s.exploration.rain.done && s.exploration.wind.done && s.exploration.tide.done); assert.equal(s.bridge.solved, false); });
    assert.deepEqual(errors, []);
    await context.storageState({ path: path.join(evidence, 'v5-exploration-earned-storage.json') });
    fs.writeFileSync(path.join(evidence, 'v5-exploration-play.json'), JSON.stringify({ date: new Date().toISOString(), url, build, checks, route, captures, errors, scope: 'Normal keyboard, mouse and UI only. snapshot/project are read-only; no injected progress, save or state setters.', final: await snap() }, null, 2));
    console.log('COMPLETE ' + checks.length + ' exploration checks');
  } catch (error) {
    await capture('failure').catch(() => {});
    fs.writeFileSync(path.join(evidence, 'v5-exploration-failure.json'), JSON.stringify({ error: error.stack, checks, route, captures, errors, snapshot: await snap().catch(() => null) }, null, 2));
    throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
