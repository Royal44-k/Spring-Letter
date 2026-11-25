const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = path.resolve(__dirname, '..'), evidence = path.join(base, 'evidence');
const url = process.env.SPRING_URL || 'http://127.0.0.1:5193';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const errors = [], shots = [], states = [];
  async function openNativeSave(file) {
    const storage = JSON.parse(fs.readFileSync(path.join(evidence, file)));
    storage.origins = storage.origins.map(origin => ({ ...origin, origin: url }));
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, storageState: storage });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.stack));
    await page.goto(url); await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 });
    await page.waitForSelector('#loading', { state: 'hidden', timeout: 90000 });
    await page.locator('#continue').click(); await page.waitForTimeout(700);
    return { context, page };
  }
  async function capture(page, name) {
    const file = `v6-world-polish-${name}.png`; await page.screenshot({ path: path.join(evidence, file) }); shots.push(file);
    const state = await page.evaluate(() => window.__SPRING__.snapshot()); delete state.frameTimes; states.push({ name, state });
  }
  async function walk(page, x, z) {
    const start = Date.now();
    while (Date.now() - start < 35000) {
      const state = await page.evaluate(() => window.__SPRING__.snapshot()), p = state.state.player;
      const dx = x - p.x, dz = z - p.z, azimuth = state.view.azimuth;
      if (Math.hypot(dx, dz) < .25) return;
      const right = dx * Math.cos(azimuth) - dz * Math.sin(azimuth), forward = -dx * Math.sin(azimuth) - dz * Math.cos(azimuth), keys = [];
      if (Math.abs(right) > Math.abs(forward) * .4142) keys.push(right > 0 ? 'KeyD' : 'KeyA');
      if (Math.abs(forward) > Math.abs(right) * .4142) keys.push(forward > 0 ? 'KeyW' : 'KeyS');
      for (const key of keys) await page.keyboard.down(key);
      await page.waitForTimeout(Math.hypot(dx, dz) < .6 ? 50 : 130);
      for (const key of keys) await page.keyboard.up(key);
      await page.waitForTimeout(30);
    }
    await capture(page, 'walk-failure');
    const state = await page.evaluate(() => window.__SPRING__.snapshot()); delete state.frameTimes;
    fs.writeFileSync(path.join(evidence, 'v6-world-polish-walk-failure.json'), JSON.stringify({ x, z, state }, null, 2));
    throw new Error(`Walk did not reach ${x}, ${z}`);
  }
  try {
    if (!process.env.SPRING_WIND_ONLY) {
    const finale = await openNativeSave('v5-record-real-play-storage.json');
    await finale.page.keyboard.press('KeyE'); await finale.page.locator('#review-letter').click();
    await finale.page.locator('#ending-rewind').click(); await finale.page.waitForTimeout(1000);
    await capture(finale.page, '01-entry');
    await finale.page.mouse.move(1050, 470); await finale.page.mouse.down({ button: 'right' });
    await finale.page.mouse.move(422, 470, { steps: 30 }); await finale.page.mouse.up({ button: 'right' });
    await finale.page.waitForTimeout(1200); await capture(finale.page, '02-return-view');
    await finale.page.setViewportSize({ width: 390, height: 844 }); await finale.page.waitForTimeout(1200);
    await capture(finale.page, '03-return-portrait');
    await finale.context.close();
    }

    const wind = await openNativeSave('v6-seeds-flow-native-storage.json');
    await capture(wind.page, 'wind-continued');
    const restoredPlayer = (await wind.page.evaluate(() => window.__SPRING__.snapshot())).state.player;
    // Restoration may place an outdoor saved traveller at the documented safe
    // entrance. The native save's raw coordinates are not the resumed position.
    if (restoredPlayer.x > 7) for (const [x, z] of [[10, -12.7], [7, -12], [4.5, -15], [3.4, -17.4]]) await walk(wind.page, x, z);
    await wind.page.keyboard.press('KeyE'); await wind.page.waitForTimeout(1300);
    await capture(wind.page, '04-wind'); await wind.context.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(evidence, 'v6-world-polish-review.json'), JSON.stringify({ date: new Date().toISOString(), url, shots, errors, states,
      scope: 'Actual WebGL renders with ordinary UI, walking and orbit input. Existing earned saves are restored intact; only origin is remapped. Screenshots support a visual review, not an unqualified AAA or player-tested claim.' }, null, 2));
    console.log(JSON.stringify({ shots, errors, renders: states.map(({ name, state }) => ({ name, renderer: state.renderer, frameTiming: state.frameTiming })) }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
