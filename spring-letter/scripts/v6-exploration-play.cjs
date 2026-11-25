/* V6 retained rain/tide gardens through ordinary input only.
 * Fresh journey by default. SPRING_STORAGE can name an actual earned V6
 * before-wind checkpoint; origin remapping is the sole save adaptation.
 * SPRING_INCLUDE_WIND=1 also covers side-wind attraction/release. Its separate
 * V6 cancellation suite remains the authority for cancellation regressions.
 * Prepared for the root's exclusive GPU window; never run in parallel. */
const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const { harness } = require('./v6-input-helpers.cjs');
const evidence = path.resolve(process.env.SPRING_EVIDENCE || path.join(__dirname, '../evidence'));
const url = process.env.SPRING_URL || 'http://127.0.0.1:5194';
const includeWind = process.env.SPRING_INCLUDE_WIND === '1';
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  let storage, sourceCheckpoint = null;
  if (process.env.SPRING_STORAGE) {
    const source = path.resolve(process.env.SPRING_STORAGE), bytes = fs.readFileSync(source);
    storage = JSON.parse(bytes); sourceCheckpoint = { path: source, sha256: digest(bytes), adaptation: 'origin only' };
    storage.origins = storage.origins.map(origin => ({ ...origin, origin: url }));
  }
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...(storage ? { storageState: storage } : {}) });
  const page = await context.newPage(), checks = [], errors = [], observations = {};
  const h = harness(page, { evidence, prefix: 'v6-exploration' }), { snap, aim, walk, routeTo, capture, act } = h;
  let build = null;
  page.on('pageerror', error => errors.push(error.stack));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const check = async (name, fn) => { await fn(); checks.push(name); console.log('PASS ' + name); };
  const ready = async () => { await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 }); await page.waitForSelector('#loading', { state: 'hidden', timeout: 90000 }); };
  async function buildIdentity() {
    const entry = await page.locator('script[type=module][src]').last().getAttribute('src');
    assert.ok(entry.startsWith('/assets/'), 'run against an immutable built candidate, not Vite HMR');
    return { entry, sha256: digest(await (await page.request.get(new URL(entry, url).href)).body()), style: await page.locator('link[rel=stylesheet]').last().getAttribute('href') };
  }
  async function beginBrush(x, y, z) { await page.keyboard.down('Space'); await aim(x, y, z); await page.mouse.down(); }
  async function endBrush() { await page.mouse.up(); await page.keyboard.up('Space'); }
  async function firstFlower() {
    await walk(0, 4); await act(); await page.waitForTimeout(650); assert.equal((await snap()).focus, 'flower');
    await page.keyboard.press('KeyF'); await page.waitForFunction(() => window.__SPRING__.snapshot().flowerCycle.phase === 'drifting', null, { timeout: 20000 });
    await page.mouse.move(550, 360); await page.mouse.down();
    for (let i = 0; i < 24; i++) { await page.mouse.move(550 + i * 14, 360 + Math.sin(i * .25) * 80); await page.waitForTimeout(35); }
    await page.mouse.up(); assert.ok((await snap()).state.p1.ink >= 1.2);
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.p1.solved, null, { timeout: 25000 });
    assert.equal((await snap()).flowerCycle.phase, 'solid');
    checks.push('first flower opens its route after F, an ordinary wind stroke and natural return'); await act();
  }
  async function sideWind() {
    // Follow the actual north connection. Never cross directly from a checkpoint
    // assumed to still occupy its raw saved coordinates.
    await routeTo([[0, -11.2], [3.7, -14], [4.5, -15], [7, -12], [10, -12.7], [12, -16]]);
    await page.waitForTimeout(1000); assert.equal((await snap()).exploration.nearTarget, 'wind-terrace');
    await beginBrush(10.82, 2.8, -14.95);
    const gates = [[-1.28, -.42], [-.22, -1.3], [1.12, -.83]];
    for (let i = 0; i < gates.length; i++) {
      const began = Date.now();
      while (Date.now() - began < 15000 && (await snap()).state.exploration.wind.stage <= i) {
        await aim(12 + gates[i][0], 2.8, -16 + gates[i][1]); await page.waitForTimeout(80);
      }
      assert.ok((await snap()).state.exploration.wind.stage > i, 'held side seed reaches gate ' + (i + 1));
    }
    assert.equal((await snap()).state.exploration.wind.done, false, 'held seed cannot settle');
    await endBrush(); await page.waitForFunction(() => window.__SPRING__.snapshot().state.exploration.wind.done, null, { timeout: 10000 });
    await check('side seed follows explicit held attraction and settles after release', async () => assert.equal((await snap()).state.exploration.wind.hold, 1));
    await capture('05-optional-wind-delivered');
    await routeTo([[10, -12.7], [7, -12], [4.5, -15], [0, -15]]);
  }
  try {
    await page.goto(url); await ready(); build = await buildIdentity();
    if (storage) await page.locator('#continue').click();
    else { await page.locator('#begin').click(); await page.locator('#opening-skip').click(); }
    await page.waitForTimeout(600); const start = await snap(); observations.resumedPlayer = start.state.player; observations.initialLoadingTiming = start.loadingTiming;
    await check('all retained gardens start unfinished with later main gates locked', async () => {
      const s = start.state; assert.ok(!s.exploration.rain.done && !s.exploration.wind.done && !s.exploration.tide.done);
      assert.equal(s.wind.solved, false); assert.equal(s.bridge.solved, false); assert.equal(s.ending, null);
      if (storage) assert.equal(s.p1.solved, true, 'checkpoint must be the earned before-wind state'); else assert.equal(s.p1.solved, false);
    });
    if (storage) await routeTo([[0, -5], [0, 2]]);
    await routeTo([[-3.7, 4.5], [-5, 1], [-7.5, 2], [-10, 2.2], [-12, -1]]); await page.waitForTimeout(1100);
    await check('rain garden is reached by its physical sloped path', async () => {
      const s = await snap(); assert.equal(s.exploration.nearTarget, 'rain-grove'); assert.ok(s.presentation.actor[1] > 1.7);
      if (!storage) assert.equal(s.state.p1.solved, false, 'rain is explorable before the first flower lesson');
    });
    await capture('01-rain-arrival'); await beginBrush(-10.72, 1.9, -1); await page.waitForTimeout(1000);
    assert.equal((await snap()).state.exploration.rain.done, false, 'stationary held brush does not complete the circle');
    for (let i = 1; i <= 132; i++) {
      const angle = i / 132 * Math.PI * 2;
      await aim(-12 + Math.cos(angle) * 1.28, 1.9, -1 + Math.sin(angle) * 1.28); await page.waitForTimeout(35);
      if (i === 65) await capture('02-rain-half-trace');
    }
    await endBrush(); await page.waitForFunction(() => window.__SPRING__.snapshot().state.exploration.rain.done, null, { timeout: 6000 });
    await check('continuous world-space wind circle restores the rain flowers', async () => assert.equal((await snap()).state.exploration.rain.done, true));
    await capture('03-rain-restored');
    // Return around the perimeter before the intentional first-flower visit.
    // A direct diagonal crosses its automatic 3.9 m focus boundary mid-walk.
    await routeTo([[-10.3, -4], [-7, -3], [-5, -2.5], [-5, 1], [-4, 3.4], [-2, 4.5], [0, 4]]);
    if (!(await snap()).state.p1.solved) await firstFlower();
    await routeTo([[0, 2], [0, -5], [0, -10.7]]); await act(); await page.waitForTimeout(850); assert.equal((await snap()).focus, 'wind');
    await h.mainWindHeld(); assert.equal((await snap()).state.wind.solved, false, 'main seed remains unsettled while held');
    await page.mouse.up(); await page.waitForFunction(() => window.__SPRING__.snapshot().state.wind.solved, null, { timeout: 5000 });
    checks.push('main seed opens the onward route through explicit attraction then release'); await capture('04-main-wind-delivered'); await act();
    if (includeWind) await sideWind();
    await routeTo([[0, -21], [0, -26], [-5, -29], [-7, -29], [-8.6, -31], [-12, -29]]); await page.waitForTimeout(1100);
    await check('tide garden is reached from the real west branch before bridge completion', async () => {
      const s = await snap(); assert.equal(s.exploration.nearTarget, 'tide-vault'); assert.equal(s.state.bridge.solved, false);
    });
    await capture('06-tide-arrival');
    for (const point of [[-13.08, -28.3], [-11.02, -28.35], [-11.97, -30.22]]) {
      const before = (await snap()).state.exploration.tide.index;
      await walk(...point); await page.waitForFunction(index => window.__SPRING__.snapshot().state.exploration.tide.index > index, before, { timeout: 12000 });
    }
    await check('three echoes require separate walks and quiet listening', async () => {
      const e = (await snap()).state.exploration; assert.equal(e.tide.done, true); assert.equal(e.tide.index, 3); assert.equal(e.rain.done, true);
      assert.equal(e.wind.done, includeWind);
    });
    await capture('07-tide-complete'); await page.waitForTimeout(1000);
    await page.reload(); await ready(); await page.locator('#continue').click(); await page.waitForTimeout(500);
    await check('ordinary reload preserves earned gardens without unlocking the finale', async () => {
      const s = (await snap()).state; assert.equal(s.exploration.rain.done, true); assert.equal(s.exploration.tide.done, true);
      assert.equal(s.exploration.wind.done, includeWind); assert.equal(s.wind.solved, true); assert.equal(s.bridge.solved, false);
    });
    const final = await snap(); delete final.frameTimes; assert.deepEqual(final.errors, []); assert.deepEqual(errors, []); assert.deepEqual(await buildIdentity(), build);
    await context.storageState({ path: path.join(evidence, 'v6-exploration-earned-storage.json') });
    fs.writeFileSync(path.join(evidence, 'v6-exploration-play.json'), JSON.stringify({ date: new Date().toISOString(), url, build, sourceCheckpoint,
      includeWind, checks, errors, route: h.route, captures: h.captures, observations, final, storageExport: 'v6-exploration-earned-storage.json',
      scope: 'Ordinary keyboard, mouse and visible UI; readonly snapshot/project. Fresh journey by default or explicitly named earned before-wind checkpoint with origin-only mapping. Segmented directional input respects the follow-camera movement basis. Covers retained rain/tide gardens; side wind is optional and cancellation has a separate suite. This is not an independent player usability study.' }, null, 2));
    console.log('COMPLETE ' + checks.length + ' retained exploration checks');
  } catch (error) {
    await page.mouse.up().catch(() => {}); await page.keyboard.up('Space').catch(() => {}); await capture('failure').catch(() => {});
    const state = await snap().catch(() => null); if (state) delete state.frameTimes;
    fs.writeFileSync(path.join(evidence, 'v6-exploration-failure.json'), JSON.stringify({ date: new Date().toISOString(), url, build, sourceCheckpoint, includeWind,
      error: error.stack, checks, errors, route: h.route, captures: h.captures, observations, state }, null, 2)); throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
