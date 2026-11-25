/* V6 retained narrative branches, using only ordinary input.
 * Default: fresh journey. SPRING_STORAGE may explicitly restore an earned V6
 * before-wind checkpoint; only its origin is remapped, never progress fields.
 * Run only after the root assigns the sole WebGL window. */
const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const { harness } = require('./v6-input-helpers.cjs');
const evidence = path.resolve(process.env.SPRING_EVIDENCE || path.join(__dirname, '../evidence'));
const url = process.env.SPRING_URL || 'http://127.0.0.1:5194';
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const original = [1, 2, 0, 1, 0, 2], chosen = [2, 0, 1, 2, 0, 2];

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
  // Observes actual scheduled oscillator starts without changing audio or quests.
  await context.addInitScript(() => {
    window.__V6_CUP_OBSERVATIONS__ = [];
    const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return;
    const create = Audio.prototype.createOscillator;
    Audio.prototype.createOscillator = function (...args) {
      const oscillator = create.apply(this, args), audioContext = this, start = oscillator.start;
      const setFrequency = oscillator.frequency.setValueAtTime; let frequency = null;
      oscillator.frequency.setValueAtTime = function (value, when) { frequency = value; return setFrequency.call(this, value, when); };
      oscillator.start = function (...startArgs) {
        window.__V6_CUP_OBSERVATIONS__.push({ audioTime: audioContext.currentTime, frequency: frequency ?? oscillator.frequency.value });
        return start.apply(this, startArgs);
      };
      return oscillator;
    };
  });
  const page = await context.newPage(), checks = [], errors = [], observations = {};
  const h = harness(page, { evidence, prefix: 'v6-branches' }), { snap, aim, act, walk, routeTo, capture } = h;
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
  async function beats(values) { for (const value of values) { await page.keyboard.press('Digit' + value); await page.waitForTimeout(110); } }
  async function firstFlower() {
    // Stay outside the 3.9 m automatic close-up boundary until explicitly
    // entering it, so a walker never mistakes a legitimate focus transition
    // for a stalled route.
    await routeTo([[-3.7, 4.5], [0, 4.5], [0, 4]]); await act(); await page.waitForTimeout(650); assert.equal((await snap()).focus, 'flower');
    await page.keyboard.press('KeyF'); await page.waitForFunction(() => window.__SPRING__.snapshot().flowerCycle.phase === 'drifting', null, { timeout: 20000 });
    await page.mouse.move(550, 360); await page.mouse.down();
    for (let i = 0; i < 24; i++) { await page.mouse.move(550 + i * 14, 360 + Math.sin(i * .25) * 80); await page.waitForTimeout(35); }
    await page.mouse.up(); assert.ok((await snap()).state.p1.ink >= 1.2);
    await capture('02-first-wind');
    await act(); assert.equal((await snap()).focus, null, 'leave the near-view before automatic return');
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.p1.solved, null, { timeout: 25000 });
    assert.equal((await snap()).flowerCycle.phase, 'solid'); assert.equal((await snap()).focus, null);
    checks.push('first flower learns a real wind stroke and unlocks on natural return outside its near-view without reentry');
  }
  try {
    await page.goto(url); await ready(); build = await buildIdentity();
    if (storage) await page.locator('#continue').click();
    else { await page.locator('#begin').click(); await page.locator('#opening-skip').click(); }
    await page.waitForTimeout(600); const start = await snap(); observations.resumedPlayer = start.state.player; observations.initialLoadingTiming = start.loadingTiming;
    assert.deepEqual(start.state.story.branches, { rhythm: false, light: false, memory: false });
    assert.equal(start.state.wind.solved, false); assert.equal(start.state.bridge.solved, false); assert.equal(start.state.ending, null);
    if (storage) { assert.equal(start.state.p1.solved, true, 'checkpoint must be the earned before-wind state'); await routeTo([[0, -5], [0, 2]]); }
    else assert.equal(start.state.p1.solved, false);
    await routeTo([[-3.7, 4.5], [-3.7, 1.9]]); await act(); await page.waitForTimeout(800); assert.equal((await snap()).branch, 'rhythm');
    await beats([0, 0, 0, 0, 0, 0]); await page.locator('#branch-finish').click();
    await check('six silent beats cannot complete the cup composition', async () => assert.equal((await snap()).state.story.branches.rhythm, false));
    await page.locator('#motif-reset').click(); await beats(original); await page.locator('#branch-finish').click();
    await check('authored six-beat phrase is saved before a companion is required', async () => {
      const s = await snap(); assert.equal(s.state.story.branches.rhythm, true); assert.deepEqual(s.state.story.motif, original); assert.equal(s.state.companion.awakened, false);
    });
    await page.locator('#motif-rewrite').click(); await beats([2, 2]); await page.locator('#motif-cancel').click();
    assert.deepEqual((await snap()).state.story.motif, original);
    await page.locator('#motif-rewrite').click(); await beats([2]); await page.keyboard.press('Escape'); await act();
    await check('canceling or leaving an unfinished rewrite preserves the saved phrase', async () => assert.deepEqual((await snap()).state.story.motif, original));
    await page.locator('#motif-rewrite').click(); await beats(chosen); await page.locator('#branch-finish').click(); await page.waitForTimeout(2800);
    const beforePlayback = await page.evaluate(() => window.__V6_CUP_OBSERVATIONS__.length);
    await page.locator('#motif-play').click();
    await page.waitForFunction(before => {
      const events = window.__V6_CUP_OBSERVATIONS__.slice(before);
      return events.filter(event => [392, 523.25].some(f => Math.abs(event.frequency - f) < .02)
        && events.some(partial => Math.abs(partial.frequency - event.frequency * 2.76) < .1 && Math.abs(partial.audioTime - event.audioTime) < .02)).length >= 4;
    }, beforePlayback, { timeout: 20000 });
    await page.waitForTimeout(700);
    observations.cupPlayback = await page.evaluate(before => window.__V6_CUP_OBSERVATIONS__.slice(before), beforePlayback);
    await check('saved phrase replays real cup oscillators and its deliberate rests', async () => {
      assert.deepEqual((await snap()).state.story.motif, chosen);
      const events = observations.cupPlayback;
      const cups = events.filter(event => [392, 523.25].some(f => Math.abs(event.frequency - f) < .02)
        && events.some(partial => Math.abs(partial.frequency - event.frequency * 2.76) < .1 && Math.abs(partial.audioTime - event.audioTime) < .02));
      assert.deepEqual(cups.map(event => Math.round(event.frequency * 100) / 100), [523.25, 392, 523.25, 523.25]);
      assert.ok(cups[1].audioTime - cups[0].audioTime > 1.08); assert.ok(cups[3].audioTime - cups[2].audioTime > 1.08);
    });
    await capture('01-authored-cups'); await act();
    if (!(await snap()).state.p1.solved) await firstFlower();
    await routeTo([[0, 2], [0, -5], [0, -10.7], [0, -17], [-3.8, -17.5]]); await act();
    await page.waitForTimeout(850); assert.equal((await snap()).branch, 'light');
    await page.mouse.move(600, 250); await page.keyboard.press('Digit1');
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.story.lightFound[0], null, { timeout: 8000 });
    await page.locator('[data-inscription="1"]').click();
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.story.lightFound[1], null, { timeout: 8000 });
    await aim(-3.46, 1.109, -17.17);
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.story.lightFound[2], null, { timeout: 8000 });
    await check('keyboard, visible button and actual inscription pointer reveal all three traces', async () => {
      assert.deepEqual((await snap()).state.story.lightFound, [true, true, true]); assert.equal((await snap()).state.story.branches.light, true);
    });
    await capture('03-inscriptions'); await act(); await walk(0, -14); await act(); await page.waitForTimeout(850);
    assert.equal((await snap()).focus, 'wind'); await h.mainWindHeld(); assert.equal((await snap()).state.wind.solved, false);
    await page.mouse.up(); await page.waitForFunction(() => window.__SPRING__.snapshot().state.wind.solved, null, { timeout: 5000 });
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.companion.awakened, null, { timeout: 5000 });
    await check('held main-wind attraction completes only after release and awakens the companion', async () => assert.equal((await snap()).state.companion.awakened, true));
    await act(); await routeTo([[0, -21], [0, -26], [-5, -29]]); await act(); await page.waitForTimeout(850);
    assert.equal((await snap()).branch, 'memory'); await page.locator('#branch-finish').click(); assert.equal((await snap()).state.story.branches.memory, false);
    await page.locator('#memory-bloom').focus(); await page.keyboard.press('Home');
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.story.memorySeen.closed, null, { timeout: 8000 }); await capture('04-old-flower-closed');
    await page.keyboard.press('End'); await page.waitForFunction(() => window.__SPRING__.snapshot().state.story.memorySeen.open, null, { timeout: 8000 });
    await capture('05-old-flower-open'); await page.locator('#branch-finish').click(); assert.equal((await snap()).state.story.branches.memory, false);
    await page.locator('#memory-bloom').focus(); await page.keyboard.press('Home'); for (let i = 0; i < 4; i++) await page.keyboard.press('PageUp');
    await page.locator('#branch-finish').click();
    await check('old flower requires both endpoints and saves the chosen living middle pose', async () => {
      const s = (await snap()).state.story; assert.deepEqual(s.memorySeen, { closed: true, open: true }); assert.equal(s.branches.memory, true); assert.equal(s.memoryBloom, .4);
    });
    await capture('06-old-flower-chosen'); await act();
    await page.reload(); await ready(); await page.locator('#continue').click(); await page.waitForTimeout(500);
    await check('ordinary reload retains all three branches, authored phrase and memory pose', async () => {
      const s = (await snap()).state.story; assert.deepEqual(s.branches, { rhythm: true, light: true, memory: true }); assert.deepEqual(s.motif, chosen); assert.equal(s.memoryBloom, .4);
    });
    const final = await snap(); delete final.frameTimes; assert.deepEqual(final.errors, []); assert.deepEqual(errors, []); assert.deepEqual(await buildIdentity(), build);
    await context.storageState({ path: path.join(evidence, 'v6-branches-earned-storage.json') });
    fs.writeFileSync(path.join(evidence, 'v6-branches-play.json'), JSON.stringify({ date: new Date().toISOString(), url, build, sourceCheckpoint, checks, errors,
      route: h.route, captures: h.captures, observations, final, storageExport: 'v6-branches-earned-storage.json',
      scope: 'Ordinary keyboard, mouse and visible UI, readonly snapshot/project. Default fresh journey or explicitly named earned before-wind checkpoint with origin-only mapping. Audio instrumentation observes real oscillator scheduling; it does not prove speaker output or subjective musical quality. This covers retained branches, not the separately tested final-letter sequence.' }, null, 2));
    console.log('COMPLETE ' + checks.length + ' retained branch checks');
  } catch (error) {
    await page.mouse.up().catch(() => {}); await page.keyboard.up('Space').catch(() => {}); await capture('failure').catch(() => {});
    const state = await snap().catch(() => null); if (state) delete state.frameTimes;
    fs.writeFileSync(path.join(evidence, 'v6-branches-failure.json'), JSON.stringify({ date: new Date().toISOString(), url, build, sourceCheckpoint, error: error.stack,
      checks, errors, route: h.route, captures: h.captures, observations, state }, null, 2)); throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
