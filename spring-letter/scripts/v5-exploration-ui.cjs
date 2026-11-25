const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const evidence = path.resolve(__dirname, '../evidence'), url = process.env.SPRING_URL || 'http://127.0.0.1:5192';
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage(), cdp = await context.newCDPSession(page), checks = [], captures = [], errors = [];
  const snap = () => page.evaluate(() => window.__SPRING__.snapshot());
  const point = (x, y, id = 1) => ({ x, y, id, radiusX: 4, radiusY: 4, force: .5 });
  const touch = (type, points = []) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
  let build = null, portrait = null, landscape = null, slowMax = 0, fastMax = 0, pinchResult = null, fastCapture = null;
  const focusVisibility = { hiddenDuringFocus: false, restoredAfterLeaving: false };
  const fastSamples = [], stationarySamples = [];
  page.on('pageerror', e => errors.push(e.stack));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  async function check(name, fn) { await fn(); checks.push(name); console.log('PASS ' + name); }
  async function capture(name) { const file = `v5-ui-${name}.png`; await page.waitForTimeout(450); await page.screenshot({ path: path.join(evidence, file) }); captures.push(file); }
  const measure = () => page.evaluate(() => {
    const rect = id => { const r = document.getElementById(id).getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
    return { hint: rect('exploration-hint'), pad: rect('touch-pad'), caption: rect('caption'), controls: rect('controls'), hud: rect('hud'), viewport: [innerWidth, innerHeight], overflow: document.documentElement.scrollWidth > innerWidth };
  });
  const overlap = (a, b) => Math.min(a.right, b.right) > Math.max(a.x, b.x) + 1 && Math.min(a.bottom, b.bottom) > Math.max(a.y, b.y) + 1;
  async function pinch(scale, inspect = false) {
    const before = await snap();
    await touch('touchStart', [point(125, 430, 1), point(265, 430, 2)]);
    for (let i = 1; i <= 15; i++) {
      const half = 70 * (1 + (scale - 1) * i / 15);
      await touch('touchMove', [point(195 - half, 430 + i, 1), point(195 + half, 430 + i, 2)]);
      await page.waitForTimeout(25);
    }
    await page.waitForTimeout(80);
    const both = await snap();
    if (inspect) {
      await check('two-finger zoom and translation reserve the wind pen without drawing a rain trace', async () => {
        assert.ok(both.view.radius < before.view.radius - .3);
        assert.equal(both.gesture.active, false); assert.equal(both.gesture.motionEnergy, 0);
        assert.equal(both.state.exploration.rain.mask, before.state.exploration.rain.mask);
        assert.equal(both.state.exploration.rain.travel, before.state.exploration.rain.travel);
        assert.equal(both.state.exploration.rain.rounds, before.state.exploration.rain.rounds);
      });
      await touch('touchEnd', [point(195 - 70 * scale, 445, 1)]);
      for (let i = 1; i <= 8; i++) { await touch('touchMove', [point(195 - 70 * scale + i * 8, 445, 1)]); await page.waitForTimeout(20); }
      const remaining = await snap();
      await check('lifting one pinch finger does not turn the remaining finger into a wind stroke', async () => {
        assert.equal(remaining.gesture.active, false); assert.equal(remaining.gesture.motionEnergy, 0);
        assert.equal(remaining.state.exploration.rain.mask, before.state.exploration.rain.mask);
        assert.equal(remaining.state.exploration.rain.travel, before.state.exploration.rain.travel);
      });
      pinchResult = { beforeRadius: before.view.radius, afterRadius: both.view.radius, beforeRain: before.state.exploration.rain, bothGesture: both.gesture, remainingGesture: remaining.gesture, afterRain: remaining.state.exploration.rain };
      await capture('07-pinch-one-finger-remains');
    }
    await touch('touchEnd'); await page.waitForTimeout(650);
  }
  async function walkTo(x, z) {
    let pressed = '', start = Date.now();
    try {
      while (Date.now() - start < 60000) {
        const s = await snap(), p = s.state.player, a = s.view.azimuth, dx = x - p.x, dz = z - p.z;
        if (Math.hypot(dx, dz) < .23) return;
        const right = dx * Math.cos(a) - dz * Math.sin(a), forward = -dx * Math.sin(a) - dz * Math.cos(a), keys = [];
        if (Math.abs(right) > Math.abs(forward) * .4142) keys.push(right > 0 ? 'KeyD' : 'KeyA');
        if (Math.abs(forward) > Math.abs(right) * .4142) keys.push(forward > 0 ? 'KeyW' : 'KeyS');
        if (pressed !== keys.join()) {
          if (pressed) await touch('touchEnd');
          const touches = [];
          for (let i = 0; i < keys.length; i++) { const b = await page.locator(`[data-move="${keys[i]}"]`).boundingBox(); touches.push(point(b.x + b.width / 2, b.y + b.height / 2, i + 1)); }
          await touch('touchStart', touches); pressed = keys.join();
        }
        await page.waitForTimeout(50);
      }
      throw new Error('Touch route stalled: ' + JSON.stringify((await snap()).state.player));
    } finally { await touch('touchEnd').catch(() => {}); }
  }
  try {
    await page.goto(url); await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 }); await page.waitForSelector('#loading', { state: 'hidden' });
    build = await page.locator('script[type="module"]').first().getAttribute('src');
    await page.locator('#begin').tap(); await page.locator('#opening-skip').tap(); await page.waitForTimeout(900);
    for (const p of [[-5, 1], [-7.5, 2], [-10, 2.2], [-12, -1]]) await walkTo(...p);
    await page.waitForTimeout(700); portrait = await measure(); await capture('01-portrait-garden');
    await check('portrait garden guidance, subtitles and touch movement occupy separate areas', async () => { assert.equal(overlap(portrait.hint, portrait.pad), false); assert.equal(overlap(portrait.caption, portrait.pad), false); assert.ok(portrait.controls.height >= 38); assert.equal(portrait.overflow, false); });
    await page.locator('#wind-pen').tap();
    const toast = await page.locator('#toast').textContent();
    await check('touch wind-pen help refers to fingers rather than a right mouse button', async () => { assert.ok(!toast.includes('右键')); assert.ok(toast.includes('双指') || toast.includes('手指')); });
    await capture('02-touch-pen-help');
    await pinch(1.15, true); await pinch(1 / 1.15);
    await page.locator('#wind-pen').tap();
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(700); landscape = await measure(); await capture('03-landscape-garden');
    await check('landscape preserves touch target sizes and separates garden guidance from movement and chapter text', async () => { assert.equal(overlap(landscape.hint, landscape.pad), false); assert.equal(overlap(landscape.hint, landscape.hud), false); assert.ok(landscape.controls.height >= 38); assert.equal(landscape.overflow, false); });
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(600);
    for (const p of [[-10.3, -4], [-7, -3], [-5, -2.5], [0, 4]]) await walkTo(...p);
    await page.locator('#focus-button').tap(); await page.waitForTimeout(1200); assert.equal((await snap()).focus, 'flower');
    await page.locator('#wind-pen').tap();
    await touch('touchStart', [point(95, 480)]);
    await page.waitForTimeout(250);
    // The easing camera changes the world-space ray slightly even at a fixed
    // screen coordinate. Check the actual no-dispersion behavior, not float zero.
    await check('a fresh stationary touch after pinching stays well inside the no-dispersion range', async () => {
      assert.equal(await page.locator('#touch-pad').isVisible(), false, 'movement pad hides while the flower is being inspected'); focusVisibility.hiddenDuringFocus = true;
      for (let i = 0; i < 3; i++) {
        const s = await snap(); stationarySamples.push({ frame: s.frameNumber, motionEnergy: s.gesture.motionEnergy, scatter: s.scatter, camera: s.camera, look: s.cameraLook });
        assert.equal(s.gesture.active, true); assert.ok(s.gesture.motionEnergy < .1, `stationary motion energy ${s.gesture.motionEnergy}`); assert.ok(s.scatter < .03);
        await page.waitForTimeout(100);
      }
    });
    for (let i = 1; i <= 38; i++) { await touch('touchMove', [point(95, 480 - i * 4)]); await page.waitForTimeout(65); slowMax = Math.max(slowMax, (await snap()).scatter); }
    await capture('04-slow-brush');
    await check('a slow visible touch stroke opens the flower without scattering it', async () => { const s = await snap(); assert.ok(Math.abs(s.state.bloom - .5) < .015); assert.ok(slowMax < .03, `slow max dispersion ${slowMax}`); assert.equal(s.gesture.active, true); });
    const sweepStart = Date.now(), sweepXs = [185, 275, 185, 95]; let sweepIndex = 0, lastSweepX = 95, lastDispatchAt = sweepStart;
    const sample = s => ({ elapsedMs: Date.now() - sweepStart, frame: s.frameNumber, scatter: s.scatter, active: s.gesture.active, motionEnergy: s.gesture.motionEnergy });
    async function sweepFor(duration) {
      const until = Date.now() + duration;
      while (Date.now() < until) {
        const x = sweepXs[sweepIndex++ % sweepXs.length], dispatchedAt = Date.now(), distancePx = Math.abs(x - lastSweepX), dispatchGapMs = dispatchedAt - lastDispatchAt;
        await touch('touchMove', [point(x, 328)]); const dispatchCompletedAt = Date.now(); await page.waitForTimeout(18);
        const s = await snap(); fastMax = Math.max(fastMax, s.scatter);
        fastSamples.push({ ...sample(s), input: { x, y: 328, distancePx, dispatchElapsedMs: dispatchedAt - sweepStart, dispatchGapMs, dispatchDurationMs: dispatchCompletedAt - dispatchedAt }, worldPosition: s.gesture.position });
        lastSweepX = x; lastDispatchAt = dispatchedAt;
      }
    }
    await sweepFor(1500);
    // Keep the input running while the screenshot is being taken. A delayed
    // photograph after pausing the stroke cannot prove the active dust state.
    await Promise.all([sweepFor(1800), (async () => {
      const before = sample(await snap()), file = 'v5-ui-05-fast-brush.png';
      await page.screenshot({ path: path.join(evidence, file) }); captures.push(file);
      fastCapture = { file, before, after: sample(await snap()), ordinaryTouchContinuedDuringCapture: true };
    })()]);
    await check('sustained ordinary touch sweeps maintain dispersion beyond the old transient peak', async () => {
      const tail = fastSamples.filter(s => s.elapsedMs >= 1500);
      assert.ok(tail.length >= 5, 'multiple rendered samples cover sustained sweeping');
      const inputRate = tail.reduce((total, s) => total + s.input.distancePx, 0) / Math.max(.001, tail.reduce((total, s) => total + s.input.dispatchGapMs, 0) / 1000);
      assert.ok(inputRate > 600, `test actually supplied a fast touch path: ${inputRate.toFixed(1)} px/s`);
      assert.ok(tail.every(s => s.active));
      assert.ok(Math.min(...tail.map(s => s.scatter)) > .6, `sustained minimum dispersion ${Math.min(...tail.map(s => s.scatter))}`);
      assert.ok(fastCapture.before.scatter > .6 && fastCapture.after.scatter > .6, 'capture is bracketed by active high-dispersion samples');
    });
    const beforeRelease = (await snap()).scatter; await touch('touchEnd'); await page.waitForTimeout(1800);
    await capture('06-returned-flower');
    await check('lifting returns the flower and opens the route; leaving focus restores touch movement', async () => {
      const s = await snap(); assert.ok(s.scatter < beforeRelease * .25); assert.equal(s.state.p1.solved, true);
      assert.equal(await page.locator('#touch-pad').isVisible(), false);
      await page.locator('#leave-focus').tap(); await page.waitForTimeout(150);
      assert.equal((await snap()).focus, null); assert.equal(await page.locator('#touch-pad').isVisible(), true); focusVisibility.restoredAfterLeaving = true;
    });
    assert.deepEqual(errors, []); assert.deepEqual((await snap()).errors, []);
    fs.writeFileSync(path.join(evidence, 'v5-exploration-ui.json'), JSON.stringify({ date: new Date().toISOString(), url, build, checks, captures, portrait, landscape, focusVisibility, pinchResult, stationarySamples, slowMax, fastMax, fastSamples, fastCapture, errors, scope: 'Fresh game; browser-protocol touch emulation through normal controls, no physical-phone claim, state setter or save injection. Fast screenshot taken while ordinary touch strokes continue; numeric dispersion does not alone establish cinematic quality. The separate earned-save revisit, not this fresh rain-garden check, covers the wind seed at its final gate.' }, null, 2));
    console.log('COMPLETE ' + checks.length + ' targeted UI/gesture checks');
  } catch (error) {
    await capture('failure').catch(() => {});
    fs.writeFileSync(path.join(evidence, 'v5-exploration-ui-failure.json'), JSON.stringify({ error: error.stack, url, build, checks, portrait, landscape, focusVisibility, pinchResult, stationarySamples, slowMax, fastMax, fastSamples, fastCapture, errors, snapshot: await snap().catch(() => null) }, null, 2)); throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
