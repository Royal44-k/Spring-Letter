/* One uncut, ordinary-input journey. No injected game state, saved progress,
 * reference frames, timeline cuts, speed changes, or synthetic in-game events.
 * Playwright records silent WebM: the exported video does not contain audio.
 * Run only after the independent GPU soak has released the device.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(__dirname, '../.tools/playwright');
const { chromium } = require('playwright');

const URL = process.env.SPRING_URL || 'http://127.0.0.1:5192';
const WIDTH = 1280, HEIGHT = 720;
const directory = path.resolve(__dirname, '../evidence');
const recordingDirectory = path.join(directory, 'recordings-v5');
const videoName = 'spring-letter-v5-uncut-silent.webm';
const reportName = 'v5-recording-verification.json';
const storageName = 'v5-record-real-play-storage.json';
const platform = { A: { x: 0, z: -26 }, M: { x: 0, z: -32 }, F: { x: 0, z: -38 } };

function anchorsFor(shape) {
  const first = shape === 'bridge_am' ? 'A' : 'M';
  const last = shape === 'bridge_am' ? 'M' : 'F';
  const curve = shape === 'bridge_am' ? .28 : -.32;
  return Array.from({ length: 6 }, (_, index) => {
    const t = index / 5;
    return { x: Math.sin(t * Math.PI) * curve, z: platform[first].z + (platform[last].z - platform[first].z) * t };
  });
}

// This is only a real-mouse navigation aid, never a game-state writer. Unlike
// holding a constant strong push behind the seed, watching its existing speed
// lets the hand move ahead to brake before withdrawing inside the receiving cup.
function windGuidance(wind, goal, finalGoal) {
  const dx = goal[0] - wind.x, dz = goal[1] - wind.z, distance = Math.hypot(dx, dz);
  if (finalGoal && distance < .62 && Math.hypot(wind.vx, wind.vz) < .65) return { kind: 'withdraw' };
  const desiredSpeed = Math.min(.95, distance * .85);
  const ax = dx / Math.max(.001, distance) * desiredSpeed * 1.7 - wind.vx * .45;
  const az = dz / Math.max(.001, distance) * desiredSpeed * 1.7 - wind.vz * .45;
  const force = Math.hypot(ax, az);
  if (force < .035) return { kind: 'withdraw' };
  const offset = 1.9 * (1 - Math.sqrt(Math.min(5, force) / 11));
  return { kind: 'push', x: wind.x - ax / force * offset, z: wind.z - az / force * offset };
}

async function recordJourney() {
  fs.mkdirSync(recordingDirectory, { recursive: true });
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: { dir: recordingDirectory, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();
  const video = page.video();
  const startedAt = Date.now();
  const errors = [], requestsFailed = [], checks = [], milestones = [], route = [], heldActions = [], sweepSamples = [], windTrace = [];
  let entry = null, introStartedAt = 0, openingElapsedMs = 0, windSamples = 0, peakScatter = 0;
  let success = false;
  page.on('pageerror', error => errors.push(error.stack || String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => requestsFailed.push({ url: request.url(), reason: request.failure()?.errorText }));

  const snapshot = () => page.evaluate(() => window.__SPRING__.snapshot());
  const project = (x, y, z) => page.evaluate(point => window.__SPRING__.project(...point), [x, y, z]);
  const rest = milliseconds => page.waitForTimeout(milliseconds);
  async function mark(name) {
    const state = await snapshot();
    milestones.push({ name, wallMs: Date.now() - startedAt, mode: state.mode, focus: state.focus,
      player: { ...state.state.player }, bloom: state.displayBloom, scatter: state.scatter, camera: state.camera });
    console.log('SCENE ' + name);
  }
  function passed(name) { checks.push(name); console.log('PASS ' + name); }
  async function walkTo(x, z) {
    let down = [];
    const start = Date.now();
    try {
      while (Date.now() - start < 60000) {
        const state = await snapshot(), player = state.state.player;
        const dx = x - player.x, dz = z - player.z, azimuth = state.view.azimuth;
        if (Math.hypot(dx, dz) < .2) {
          route.push({ target: [x, z], actual: [player.x, player.z], support: state.state.bridge.support });
          return;
        }
        const right = dx * Math.cos(azimuth) - dz * Math.sin(azimuth);
        const forward = -dx * Math.sin(azimuth) - dz * Math.cos(azimuth);
        const wanted = [];
        if (Math.abs(right) > Math.abs(forward) * .4142) wanted.push(right > 0 ? 'KeyD' : 'KeyA');
        if (Math.abs(forward) > Math.abs(right) * .4142) wanted.push(forward > 0 ? 'KeyW' : 'KeyS');
        for (const key of down) if (!wanted.includes(key)) await page.keyboard.up(key);
        for (const key of wanted) if (!down.includes(key)) await page.keyboard.down(key);
        down = wanted;
        await rest(45);
      }
      throw new Error('Ordinary walking stalled: ' + JSON.stringify({ target: [x, z], player: (await snapshot()).state.player }));
    } finally { for (const key of down) await page.keyboard.up(key); }
  }
  async function aim(x, y, z) {
    const point = await project(x, y, z);
    assert.ok(point.x > 8 && point.x < WIDTH - 8 && point.y > 8 && point.y < HEIGHT - 8,
      'World target remains on screen: ' + JSON.stringify({ x, y, z, screen: point }));
    await page.mouse.move(point.x, point.y);
  }
  async function orbitBy(dx, dy = 0) {
    const before = (await snapshot()).view.azimuth;
    const x = WIDTH * .48, y = HEIGHT * .46;
    await page.mouse.move(x, y); await page.mouse.down();
    for (let i = 1; i <= 24; i++) { await page.mouse.move(x + dx * i / 24, y + dy * i / 24); await rest(35); }
    await page.mouse.up(); await rest(650);
    assert.ok(Math.abs((await snapshot()).view.azimuth - before) > .05, 'Default drag really orbits the camera');
  }
  async function drawBridge(shape) {
    const anchors = anchorsFor(shape);
    let allVisible = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      const points = await Promise.all(anchors.map(point => project(point.x, .4, point.z)));
      allVisible = points.every(point => point.x > 45 && point.x < WIDTH - 45 && point.y > 80 && point.y < HEIGHT - 90);
      if (allVisible) break;
      await page.mouse.move(WIDTH * .56, HEIGHT * .55); await page.mouse.wheel(0, 300); await rest(800);
    }
    assert.ok(allVisible, 'All six spatial bridge anchors can be seen');
    await rest(1600);
    await page.keyboard.down('Space'); await aim(anchors[0].x, .4, anchors[0].z); await page.mouse.down(); await rest(220);
    try {
      for (let i = 1; i < anchors.length; i++) {
        for (let j = 1; j <= 9; j++) {
          const t = j / 9;
          await aim(anchors[i - 1].x + (anchors[i].x - anchors[i - 1].x) * t, .4,
            anchors[i - 1].z + (anchors[i].z - anchors[i - 1].z) * t);
          await rest(65);
        }
      }
      assert.equal((await snapshot()).weaver.status, 'ready');
      await rest(350);
    } finally { await page.mouse.up(); await page.keyboard.up('Space'); }
    await rest(1300);
    assert.equal((await snapshot()).state.bridge.structure, shape);
    passed('Hand-drawn ordered anchors create ' + shape);
  }
  async function holdE() {
    const before = await snapshot();
    const signature = state => JSON.stringify([state.carried, state.state.cores, state.state.ending]);
    const start = Date.now();
    let changed = false;
    assert.ok(before.delivery?.duration, 'A real nearby delivery action is available');
    await page.keyboard.down('KeyE');
    try {
      while (Date.now() - start < 8000) {
        await rest(75);
        if (signature(await snapshot()) !== signature(before)) { changed = true; break; }
      }
      assert.ok(changed, 'Physical hold finishes one ' + before.delivery.kind + ' action');
    } finally {
      await page.keyboard.up('KeyE');
      heldActions.push({ kind: before.delivery.kind, wallMs: Date.now() - start, changed });
    }
    await rest(500);
  }

  try {
    await page.goto(URL);
    await page.waitForFunction(() => window.__SPRING__, null, { timeout: 90000 });
    await page.waitForSelector('#loading', { state: 'hidden', timeout: 30000 });
    entry = await page.locator('script[type="module"][src]').first().getAttribute('src');
    await rest(1800); await mark('cover');
    await page.locator('#begin').click(); introStartedAt = Date.now();
    const openingIndices = [];
    while (Date.now() - introStartedAt < 90000) {
      const state = await snapshot();
      if (state.mode === 'play') break;
      assert.equal(state.mode, 'opening');
      if (!openingIndices.includes(state.opening)) { openingIndices.push(state.opening); await mark('opening-' + (state.opening + 1)); }
      await rest(250);
    }
    openingElapsedMs = Date.now() - introStartedAt;
    assert.deepEqual(openingIndices, [0, 1, 2, 3, 4, 5]);
    assert.equal((await snapshot()).mode, 'play');
    assert.ok(openingElapsedMs >= 47000, 'All six eight-second opening scenes play without skip or next');
    assert.equal((await snapshot()).state.p1.solved, false);
    passed('Complete automatically advancing six-scene opening, without skipping');
    await rest(2500); await mark('first-garden');

    await orbitBy(110, -10); await rest(1800);
    passed('Default mouse drag orbits before any special tool is selected');
    await walkTo(0, 4); await page.keyboard.press('KeyE'); await rest(2200);
    assert.equal((await snapshot()).focus, 'flower'); await mark('flower-close');
    const brushX = WIDTH * .48, brushY = HEIGHT * .72;
    await page.keyboard.down('Space'); await page.mouse.move(brushX, brushY); await page.mouse.down();
    try { for (let i = 1; i <= 38; i++) { await page.mouse.move(brushX, brushY - i * 4); await rest(80); } }
    finally { await page.mouse.up(); await page.keyboard.up('Space'); }
    await page.waitForFunction(() => window.__SPRING__.snapshot().state.p1.solved, null, { timeout: 15000 });
    assert.ok((await snapshot()).scatter < .18); passed('A slow upward wind-brush movement opens the solid flower');
    await mark('slow-open-flower'); await rest(4200);

    const sweepLeft = WIDTH * .34, sweepRight = WIDTH * .62, sweepY = HEIGHT * .49;
    await page.keyboard.down('Space'); await page.mouse.move(sweepLeft, sweepY); await page.mouse.down();
    try {
      for (let i = 1; i <= 26; i++) {
        // A visible, deliberately quick hand motion. Per-small-step snapshots
        // slow protocol input enough to turn a nominal quick stroke into a slow one.
        await page.mouse.move(i % 2 ? sweepRight : sweepLeft, sweepY, { steps: 2 }); await rest(25);
        if (i % 4 === 0 || i === 26) {
          const state = await snapshot();
          sweepSamples.push({ stroke: i, wallMs: Date.now() - startedAt, scatter: state.scatter });
          peakScatter = Math.max(peakScatter, state.scatter);
        }
      }
      await mark('fast-wind-scatter');
    } finally { await page.mouse.up(); await page.keyboard.up('Space'); }
    await page.mouse.move(35, 85); await rest(4800);
    assert.ok(peakScatter > .2, 'A real quick sweep visibly disperses the flower');
    assert.ok((await snapshot()).scatter < .02, 'Release restores the same flower naturally');
    passed('Quick brush sweep and release produce dispersion and natural return');
    await mark('natural-return'); await rest(1800); await page.keyboard.press('Escape');

    await walkTo(0, -10); await rest(1200); await walkTo(0, -14);
    await page.keyboard.press('KeyE'); await rest(2600); assert.equal((await snapshot()).focus, 'wind');
    await mark('wind-letter');
    const goals = [[-1, 2.3], [3, 1.4], [3, -2]];
    let goalIndex = 0; const windStart = Date.now(); let previousWindSampleAt = windStart;
    while (Date.now() - windStart < 120000) {
      const wind = (await snapshot()).state.wind;
      if (wind.solved) break;
      const goal = goals[goalIndex], dx = goal[0] - wind.x, dz = goal[1] - wind.z, distance = Math.hypot(dx, dz);
      if (distance < .45 && goalIndex < goals.length - 1) { goalIndex++; continue; }
      const sampledAt = Date.now(), input = windGuidance(wind, goal, goalIndex === 2);
      const trace = { wallMs: sampledAt - startedAt, intervalMs: sampledAt - previousWindSampleAt,
        goalIndex, x: wind.x, z: wind.z, vx: wind.vx, vz: wind.vz, hold: wind.hold, input };
      previousWindSampleAt = sampledAt;
      if (input.kind === 'withdraw') await page.mouse.move(35, 85);
      else await aim(input.x, .5, input.z - 16);
      trace.inputElapsedMs = Date.now() - sampledAt; windTrace.push(trace);
      await rest(45); windSamples++;
    }
    assert.equal((await snapshot()).state.wind.solved, true);
    passed('Pointer pressure carries the real wind seed, then release lets it settle');
    await mark('wind-delivered'); await page.mouse.move(35, 85); await rest(6500); await page.keyboard.press('Escape');

    await walkTo(0, -21); await walkTo(0, -26); await rest(2600);
    assert.equal((await snapshot()).weaver.origin, 'A'); await mark('bridge-first-stone');
    await drawBridge('bridge_am'); await mark('first-woven-bridge'); await rest(1300);
    await walkTo(0, -29); assert.equal((await snapshot()).state.bridge.support, 'bridge_am');
    await walkTo(0, -32); await rest(1700);
    await drawBridge('bridge_mf'); await mark('second-woven-bridge'); await rest(1000);
    await walkTo(0, -35); await walkTo(0, -38);
    assert.equal((await snapshot()).state.bridge.solved, true);
    passed('The character walks across both hand-woven bridges');
    await rest(4200); await walkTo(0, -43); await rest(3500); await mark('two-living-seeds');

    await holdE(); assert.equal((await snapshot()).carried, 0);
    await walkTo(0, -48); await rest(1200); await holdE();
    assert.deepEqual((await snapshot()).state.cores, ['season', null]);
    await mark('season-seed-planted'); await rest(3600);
    await walkTo(0, -43); await rest(900); await holdE(); assert.equal((await snapshot()).carried, 1);
    await walkTo(3, -46); await rest(1200); await holdE();
    assert.deepEqual((await snapshot()).state.cores, ['season', 'voyage']);
    passed('Both seed cores are physically picked up, carried and planted');
    await mark('voyage-seed-planted'); await rest(4000);
    await walkTo(0, -50.25); await rest(3600); await mark('before-sending');
    await holdE(); assert.equal((await snapshot()).state.ending, 'season+voyage');
    await mark('far-side-farewell');
    await rest(1200);
    assert.ok((await snapshot()).camera[2] < -46, 'The farewell camera settles on the far side of the final garden');
    await page.waitForSelector('#ending-rewind', { state: 'visible', timeout: 18000 });
    passed('The far-side farewell plays continuously before the ending letter');
    await mark('ending-letter'); await rest(10000);
    await page.locator('#ending-stay').click(); await rest(2800); await page.keyboard.press('KeyE'); await rest(1200);
    assert.equal(await page.locator('#review-letter').isVisible(), true);
    await page.locator('#review-letter').click(); await rest(4200);
    passed('Staying in the garden preserves a working letter-review entrance');
    await mark('letter-revisited');
    assert.deepEqual(errors, []); assert.deepEqual(requestsFailed, []);
    await context.storageState({ path: path.join(directory, storageName) });
    success = true;
  } catch (error) {
    let state = await snapshot().catch(() => null);
    if (state) delete state.frameTimes;
    fs.writeFileSync(path.join(directory, 'v5-recording-failure.json'), JSON.stringify({
      date: new Date().toISOString(), url: URL, entry, error: error.stack, checks, milestones, sweepSamples, peakScatter, windTrace, errors, requestsFailed, state,
      scope: 'A failed uninterrupted recording is retained separately; this is not a completed gameplay demonstration.',
    }, null, 2));
    throw error;
  } finally {
    const wallElapsedMs = Date.now() - startedAt;
    await context.close().catch(() => {});
    const destination = path.join(directory, success ? videoName : 'spring-letter-v5-incomplete-silent.webm');
    await video.saveAs(destination).catch(error => console.error('Video export failed:', error.message));
    await browser.close();
    if (success) {
      assert.ok(fs.statSync(destination).size > 100000, 'A nonempty continuous WebM was exported');
      const ffmpeg = path.resolve(__dirname, '../.tools/playwright/ffmpeg-1013/ffmpeg-win64.exe');
      let mediaDurationSeconds = null;
      if (fs.existsSync(ffmpeg)) {
        // Metadata inspection only. No transcoding, trimming or replacement frames.
        const probe = spawnSync(ffmpeg, ['-hide_banner', '-i', destination], { encoding: 'utf8', windowsHide: true });
        const duration = (probe.stderr || '').match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
        if (duration) mediaDurationSeconds = Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]);
      }
      fs.writeFileSync(path.join(directory, reportName), JSON.stringify({
        date: new Date().toISOString(), url: URL, entry, viewport: [WIDTH, HEIGHT], file: videoName,
        fileBytes: fs.statSync(destination).size, audioRecorded: false, uncut: true,
        wallElapsedMs, mediaDurationSeconds, openingElapsedMs, targetDurationSeconds: [180, 300],
        durationWithinTarget: mediaDurationSeconds === null ? null : mediaDurationSeconds >= 180 && mediaDurationSeconds <= 300,
        checks, milestones, route, heldActions, windSamples, windTrace, sweepSamples, peakScatter, errors, requestsFailed, storageExport: storageName,
        clockScope: 'Milestones and sweep samples use a wall clock started after creating the page. WebM media starts with the browser capture and may have a different origin and duration. Wall samples locate candidate frames approximately; extracted frame timestamps are reported in the media clock and do not claim exact synchronization.',
        scope: 'One new-game browser recording, driven by ordinary mouse/keyboard/UI. Only read-only snapshot/project help navigation. No injected state or saves, no reference frames, no cuts, no speed changes. Full six-scene automatic opening and one complete ending. Playwright WebM contains no audio; recording overhead makes this unsuitable as a performance benchmark.',
      }, null, 2));
      console.log('SAVED ' + videoName + ' (' + (wallElapsedMs / 1000).toFixed(1) + ' s, silent and uncut)');
    }
  }
}

if (require.main === module) recordJourney().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { anchorsFor, windGuidance, recordJourney };
