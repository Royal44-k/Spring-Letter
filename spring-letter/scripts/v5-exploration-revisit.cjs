/* Revisit a save earned by v5-exploration-play.cjs, without changing its data. */
const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const evidence = path.resolve(__dirname, '../evidence');
const url = process.env.SPRING_URL || 'http://127.0.0.1:5192';
const storageFile = path.join(evidence, 'v5-exploration-earned-storage.json');
const sourceProof = JSON.parse(fs.readFileSync(path.join(evidence, 'v5-exploration-play.json'), 'utf8'));
assert.equal(new URL(sourceProof.url).origin, new URL(url).origin, 'only reuse the actual earned save on its original origin');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, storageState: storageFile });
  const page = await context.newPage(), cdp = await context.newCDPSession(page);
  const checks = [], errors = [], captures = [];
  let build = null;
  page.on('pageerror', e => errors.push(e.stack));
  const snap = () => page.evaluate(() => window.__SPRING__.snapshot());
  const project = (x, y, z) => page.evaluate(p => window.__SPRING__.project(...p), [x, y, z]);
  const point = (x, y, id = 1) => ({ x, y, id, radiusX: 4, radiusY: 4, force: .5 });
  const touch = (type, points = []) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  async function check(name, fn) { await fn(); checks.push(name); console.log('PASS ' + name); }
  async function capture(name) { const file = `v5-revisit-${name}.png`; await page.waitForTimeout(450); await page.screenshot({ path: path.join(evidence, file) }); captures.push(file); }
  async function walkTo(x, z) {
    let pressed = '', start = Date.now();
    try {
      while (Date.now() - start < 80000) {
        const s = await snap(), p = s.state.player, a = s.view.azimuth, dx = x - p.x, dz = z - p.z;
        if (Math.hypot(dx, dz) < .23) { console.log(`REVISIT WALK ${x}, ${z}`); return; }
        const right = dx * Math.cos(a) - dz * Math.sin(a), forward = -dx * Math.sin(a) - dz * Math.cos(a), keys = [];
        if (Math.abs(right) > Math.abs(forward) * .4142) keys.push(right > 0 ? 'KeyD' : 'KeyA');
        if (Math.abs(forward) > Math.abs(right) * .4142) keys.push(forward > 0 ? 'KeyW' : 'KeyS');
        if (keys.join() !== pressed) {
          if (pressed) await touch('touchEnd');
          const touches = [];
          for (let i = 0; i < keys.length; i++) { const b = await page.locator(`[data-move="${keys[i]}"]`).boundingBox(); touches.push(point(b.x + b.width / 2, b.y + b.height / 2, i + 1)); }
          await touch('touchStart', touches); pressed = keys.join();
        }
        await page.waitForTimeout(50);
      }
      throw new Error(`Revisit route stalled at ${JSON.stringify((await snap()).state.player)} toward ${x},${z}`);
    } finally { await touch('touchEnd').catch(() => {}); }
  }
  try {
    await page.goto(url); await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 });
    await page.waitForSelector('#loading', { state: 'hidden' }); build = await page.locator('script[type="module"]').first().getAttribute('src');
    await page.locator('#continue').tap();
    await check('revisit loads only rewards already earned in the recorded normal-input run', async () => { const s = (await snap()).state; assert.ok(s.exploration.rain.done && s.exploration.wind.done && s.exploration.tide.done); assert.equal(s.bridge.solved, false); });
    await page.locator('#settings').tap(); await page.locator('#reduce-motion').check(); await page.locator('#mute-setting').check(); await page.locator('#close-modal').tap();
    for (const p of [[0, -26], [-5, -29], [-7, -29], [-8.6, -31], [-12, -29]]) await walkTo(...p);
    await page.waitForTimeout(900); await capture('01-muted-steady-echo');
    await check('quiet reduced-motion arrival shows an unfinished listening reprise', async () => { const s = await snap(); assert.ok(s.state.settings.muted && s.state.settings.reducedMotion); assert.equal(s.exploration.nearTarget, 'tide-vault'); assert.equal(s.state.exploration.tide.index, 0); });
    for (const [i, p] of [[-13.08, -28.3], [-11.02, -28.35], [-11.97, -30.22]].entries()) { await walkTo(...p); await page.waitForFunction(index => window.__SPRING__.snapshot().state.exploration.tide.index > index, i, { timeout: 12000 }); }
    await capture('02-muted-echo-complete');
    await check('three visual echo cues remain playable with audio muted and motion reduced', async () => assert.equal((await snap()).state.exploration.tide.index, 3));
    for (const p of [[-12, -29], [-8.6, -31], [-7, -29], [-5, -29], [0, -26], [0, -21], [0, -17], [4.5, -18], [7, -20], [10.2, -19], [12, -16]]) await walkTo(...p);
    await page.waitForTimeout(1000);
    const before = (await snap()).state.exploration.wind;
    assert.equal(before.stage, 0, 'recorded run left a fresh seed reprise');
    await page.locator('#wind-pen').tap();
    const gates = [[-1.28, -.42], [-.22, -1.3], [1.12, -.83]];
    let first = await project(12 + gates[0][0], 2.8, -16 + gates[0][1]);
    await touch('touchStart', [point(first.x, first.y)]);
    for (let i = 0; i < 3; i++) {
      first = await project(12 + gates[i][0], 2.8, -16 + gates[i][1]);
      await touch('touchMove', [point(first.x, first.y)]);
      await page.waitForFunction(index => window.__SPRING__.snapshot().state.exploration.wind.stage > index, i, { timeout: 25000 });
    }
    await page.waitForTimeout(900);
    assert.equal((await snap()).state.exploration.wind.rounds, before.rounds, 'one finger still holds the seed');
    const second = { x: Math.max(25, first.x - 80), y: Math.max(370, first.y - 50) };
    await touch('touchStart', [point(first.x, first.y, 1), point(second.x, second.y, 2)]);
    for (let i = 1; i <= 45; i++) { await touch('touchMove', [point(first.x, first.y, 1), point(second.x - Math.sin(i * .1) * 5, second.y, 2)]); await page.waitForTimeout(35); }
    await capture('03-two-fingers-at-seed-nest');
    await check('two fingers kept on screen cannot masquerade as releasing a seed into its nest', async () => { const s = await snap(); assert.equal(s.state.exploration.wind.rounds, before.rounds); assert.equal(s.state.exploration.wind.hold, 0); assert.equal(s.gesture.active, false); });
    await touch('touchEnd');
    await page.waitForFunction(rounds => window.__SPRING__.snapshot().state.exploration.wind.rounds > rounds, before.rounds, { timeout: 10000 });
    await check('a real release after zoom still allows the seed to settle', async () => assert.equal((await snap()).state.exploration.wind.hold, 1));
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(evidence, 'v5-exploration-revisit.json'), JSON.stringify({ date: new Date().toISOString(), url, build, sourceRun: { date: sourceProof.date, build: sourceProof.build }, checks, captures, errors, scope: 'Reused unchanged browser storage earned by the normal-input run; all revisit movement and gestures use real touch/normal UI.' }, null, 2));
    console.log('COMPLETE ' + checks.length + ' revisit checks');
  } catch (error) {
    await capture('failure').catch(() => {});
    fs.writeFileSync(path.join(evidence, 'v5-exploration-revisit-failure.json'), JSON.stringify({ error: error.stack, url, build, checks, captures, errors, snapshot: await snap().catch(() => null) }, null, 2));
    throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
