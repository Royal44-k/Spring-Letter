/* Touch/keyboard accessibility check using browser input, never game-state setters. */
const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const evidence = path.resolve(__dirname, '../evidence');
const url = process.env.SPRING_URL || 'http://127.0.0.1:5192';
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage(), cdp = await context.newCDPSession(page);
  const checks = [], errors = [], captures = [], routes = [];
  let build = null;
  page.on('pageerror', e => errors.push(e.stack));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  const snap = () => page.evaluate(() => window.__SPRING__.snapshot());
  const point = (x, y, id = 1) => ({ x, y, id, radiusX: 4, radiusY: 4, force: .5 });
  const touch = (type, points = []) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  const project = (x, y, z) => page.evaluate(p => window.__SPRING__.project(...p), [x, y, z]);
  async function check(name, fn) { await fn(); checks.push(name); console.log('PASS ' + name); }
  async function capture(name) { const file = `v5-access-${name}.png`; await page.screenshot({ path: path.join(evidence, file) }); captures.push(file); }
  async function walkTo(x, z) {
    let pressed = '', start = Date.now();
    try {
      while (Date.now() - start < 80000) {
        const s = await snap(), p = s.state.player, a = s.view.azimuth;
        const dx = x - p.x, dz = z - p.z;
        if (Math.hypot(dx, dz) < .25) { routes.push([x, z]); console.log(`TOUCH WALK ${x}, ${z}`); return; }
        const right = dx * Math.cos(a) - dz * Math.sin(a), forward = -dx * Math.sin(a) - dz * Math.cos(a);
        const keys = [];
        if (Math.abs(right) > Math.abs(forward) * .4142) keys.push(right > 0 ? 'KeyD' : 'KeyA');
        if (Math.abs(forward) > Math.abs(right) * .4142) keys.push(forward > 0 ? 'KeyW' : 'KeyS');
        const wanted = keys.join(',');
        if (pressed !== wanted) {
          if (pressed) await touch('touchEnd');
          const points = [];
          for (let i = 0; i < keys.length; i++) {
            const box = await page.locator(`[data-move="${keys[i]}"]`).boundingBox();
            assert.ok(box, 'touch direction button is visible'); points.push(point(box.x + box.width / 2, box.y + box.height / 2, i + 1));
          }
          await touch('touchStart', points); pressed = wanted;
        }
        await page.waitForTimeout(50);
      }
      throw new Error(`Touch navigation stalled at ${JSON.stringify((await snap()).state.player)}, target ${x},${z}`);
    } finally { await touch('touchEnd').catch(() => {}); }
  }
  async function drawCircle() {
    const first = await project(-10.72, 1.9, -1);
    assert.ok(first.x > 0 && first.x < 390 && first.y > 0 && first.y < 844, 'trace start is on screen');
    await touch('touchStart', [point(first.x, first.y)]);
    for (let i = 1; i <= 140; i++) {
      const a = i / 140 * Math.PI * 2;
      const p = await project(-12 + Math.cos(a) * 1.28, 1.9, -1 + Math.sin(a) * 1.28);
      assert.ok(p.x > 0 && p.x < 390 && p.y > 0 && p.y < 844, 'whole trace fits in mobile framing');
      await touch('touchMove', [point(p.x, p.y)]); await page.waitForTimeout(40);
    }
    await touch('touchEnd'); await page.waitForTimeout(120);
  }
  async function pinch(scale) {
    await touch('touchStart', [point(125, 430, 1), point(265, 430, 2)]);
    for (let i = 1; i <= 15; i++) {
      const half = 70 * (1 + (scale - 1) * i / 15);
      await touch('touchMove', [point(195 - half, 430, 1), point(195 + half, 430, 2)]);
      await page.waitForTimeout(25);
      if (i === 10) assert.equal((await snap()).gesture.active, false, 'two fingers reserve input for zoom');
    }
    await touch('touchEnd'); await page.waitForTimeout(900);
  }
  try {
    await page.goto(url); await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 });
    build = await page.locator('script[type="module"]').first().getAttribute('src');
    await page.waitForSelector('#loading', { state: 'hidden', timeout: 30000 }); await capture('01-mobile-cover');
    await page.locator('#begin').tap(); await page.locator('#opening-skip').tap(); await page.waitForTimeout(1200);
    await check('mobile has no horizontal overflow and exposes real touch movement buttons', async () => { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); assert.equal(await page.locator('#touch-pad').isVisible(), true); assert.equal(await page.locator('[data-move]').count(), 4); });
    for (const p of [[-5, 1], [-7.5, 2], [-10, 2.2], [-12, -1]]) await walkTo(...p);
    await page.waitForTimeout(1100); await capture('02-mobile-rain-arrival');
    await check('touch direction pad physically reaches the elevated rain garden', async () => assert.equal((await snap()).exploration.nearTarget, 'rain-grove'));
    const beforeOrbit = await snap();
    await touch('touchStart', [point(115, 330)]); for (let i = 1; i <= 18; i++) { await touch('touchMove', [point(115 + i * 7, 330)]); await page.waitForTimeout(15); } await touch('touchEnd');
    await page.waitForTimeout(600);
    await check('one-finger drag with wind pen off rotates the camera without drawing', async () => { const s = await snap(); assert.ok(Math.abs(s.view.azimuth - beforeOrbit.view.azimuth) > .5); assert.equal(s.state.exploration.rain.mask, 0); });
    await touch('touchStart', [point(241, 330)]); for (let i = 1; i <= 18; i++) { await touch('touchMove', [point(241 - i * 7, 330)]); await page.waitForTimeout(15); } await touch('touchEnd'); await page.waitForTimeout(900);
    await page.locator('#wind-pen').tap();
    const radiusBeforePinch = (await snap()).view.radius;
    await pinch(1.15);
    await check('two-finger pinch zooms while the wind pen is on without writing or submitting', async () => { const s = await snap(); assert.ok(s.view.radius < radiusBeforePinch - .5); assert.equal(s.state.exploration.rain.mask, 0); assert.equal(s.state.exploration.rain.done, false); assert.equal(s.gesture.active, false); });
    await pinch(1 / 1.15);
    await drawCircle();
    await check('touch wind-pen toggle enables a real circle without a physical keyboard', async () => { const s = await snap(); assert.equal(s.penMode, true); assert.equal(s.state.exploration.rain.done, true); assert.equal(s.gesture.active, false); });
    await capture('03-mobile-rain-restored');
    await page.locator('#wind-pen').tap();
    const player = (await snap()).state.player; await page.keyboard.down('ArrowUp'); await page.waitForTimeout(220); await page.keyboard.up('ArrowUp');
    await check('arrow keys remain an equivalent movement alternative', async () => { const p = (await snap()).state.player; assert.ok(Math.hypot(p.x - player.x, p.z - player.z) > .15); });
    await walkTo(-12, -1);
    await page.locator('#settings').tap(); await page.locator('#reduce-motion').check(); await page.locator('#mute-setting').check(); await capture('04-mobile-access-settings'); await page.locator('#close-modal').tap();
    const rounds = (await snap()).state.exploration.rain.rounds;
    await page.locator('#wind-pen').tap(); await drawCircle(); await page.locator('#wind-pen').tap();
    await check('muted reduced-motion play retains visible tracing and equal completion rules', async () => { const s = (await snap()).state; assert.equal(s.settings.reducedMotion, true); assert.equal(s.settings.muted, true); assert.ok(s.exploration.rain.rounds > rounds); });
    await capture('05-mobile-muted-reduced');
    const layout = await page.evaluate(() => {
      const rect = id => { const r = document.getElementById(id).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
      return { hint: rect('exploration-hint'), pad: rect('touch-pad'), caption: rect('caption'), controls: rect('controls'), viewport: [innerWidth, innerHeight] };
    });
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(900);
    await page.locator('#wind-pen').tap(); await page.locator('#wind-pen').tap();
    await capture('06-mobile-landscape');
    const landscapeLayout = await page.evaluate(() => {
      const rect = id => { const r = document.getElementById(id).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
      return { hint: rect('exploration-hint'), pad: rect('touch-pad'), caption: rect('caption'), controls: rect('controls'), viewport: [innerWidth, innerHeight] };
    });
    await check('landscape touch layout keeps movement and wind-pen controls reachable without horizontal overflow', async () => { assert.equal(await page.locator('#touch-pad').isVisible(), true); assert.equal((await snap()).penMode, false); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); });
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(500);
    await page.waitForTimeout(5200); await page.reload(); await page.waitForFunction(() => window.__SPRING__); await page.locator('#continue').tap();
    await check('reload retains earned garden rewards and personal access settings', async () => { const s = (await snap()).state; assert.ok(s.exploration.rain.done); assert.ok(s.settings.muted && s.settings.reducedMotion); });
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(evidence, 'v5-exploration-access.json'), JSON.stringify({ date: new Date().toISOString(), url, build, checks, captures, routes, layout, landscapeLayout, errors, scope: 'Browser-protocol touch emulation, normal keys and UI settings. Not a physical-phone test. No state setters or save injection.', final: await snap() }, null, 2));
    console.log('COMPLETE ' + checks.length + ' accessibility checks');
  } catch (error) {
    await capture('failure').catch(() => {});
    fs.writeFileSync(path.join(evidence, 'v5-exploration-access-failure.json'), JSON.stringify({ error: error.stack, checks, routes, errors, snapshot: await snap().catch(() => null) }, null, 2));
    throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
