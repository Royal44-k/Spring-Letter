const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'src/audio.js');
const reportPath = path.join(root, 'evidence/audio-verification.json');
const url = process.env.SPRING_URL || 'http://127.0.0.1:5192';
const executablePath = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sha256 = value => createHash('sha256').update(value).digest('hex');

// Intentionally isolated: the original source module is injected into a blank
// same-origin document, then exercised on native browser AudioNodes. Wrappers
// only count nodes and observe scheduled pan values; no mock audio context is
// used. This checks the source graph, not main.js/bundle integration or sound.
(async () => {
 const source = fs.readFileSync(sourcePath, 'utf8');
 const report = {
  generatedAt: new Date().toISOString(),
  target: {url},
  source: {file: 'src/audio.js', sha256: sha256(source)},
  scope: {
   mode: 'isolated-source-injection-with-native-web-audio',
   module: 'Exact src/audio.js bytes identified by source.sha256, imported as a data URL.',
   instrumentation: 'Native AudioContext subclass; native node factories and disconnect calls are counted, pan scheduling is observed.',
   targetPage: 'The target server HTML is fetched and hashed, but its game scripts are not executed by this check.',
   bundleIntegrationTested: false,
   listeningPerformed: false,
   limitation: 'Passing graph/state checks does not establish audible balance, perceived quality, or main-loop integration.'
  },
  expectedChecks: 11,
  passed: false
 };
 let browser;
 try {
  browser = await chromium.launch({executablePath, headless: true, args: ['--autoplay-policy=no-user-gesture-required']});
  report.browser = {version: browser.version(), executablePath, headless: true};
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));
  const response = await page.request.get(url, {timeout: 15000});
  report.target.status = response.status();
  if (!response.ok()) throw new Error(`Target page returned ${response.status()}: ${url}`);
  report.target.documentSha256 = sha256(await response.body());
  const isolatedUrl = new URL('/__audio_verification__.html', url).href;
  await page.route(isolatedUrl, route => route.fulfill({
   contentType: 'text/html',
   body: '<!doctype html><html><head><meta charset="utf-8"><title>Isolated audio graph verification</title></head><body>Native Web Audio graph checks; no listening test.</body></html>'
  }));
  await page.goto(isolatedUrl);
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  const result = await page.evaluate(async moduleUrl => {
   const Native = window.AudioContext || window.webkitAudioContext;
   if (!Native) throw new Error('This browser does not expose Web Audio.');
   const graph = {active: new Set(), createdOsc: 0, created: 0, ctx: null, panCommands: [], maximumActive: 0};
   window.AudioContext = class extends Native {constructor() {super(); graph.ctx = this;}};
   for (const name of ['createGain', 'createOscillator', 'createStereoPanner', 'createBiquadFilter', 'createBufferSource']) {
    const original = Native.prototype[name];
    window.AudioContext.prototype[name] = function (...args) {
     const node = original.apply(this, args);
     graph.active.add(node); graph.created++;
     graph.maximumActive = Math.max(graph.maximumActive, graph.active.size);
     if (name === 'createOscillator') graph.createdOsc++;
     if (name === 'createStereoPanner') {
      const set = node.pan.setValueAtTime.bind(node.pan);
      node.pan.setValueAtTime = (value, time) => {graph.panCommands.push(value); return set(value, time);};
     }
     const disconnect = node.disconnect.bind(node);
     node.disconnect = (...values) => {graph.active.delete(node); return disconnect(...values);};
     return node;
    };
   }
   const {createAudio} = await import(moduleUrl);
   const audio = createAudio(), checks = [];
   let fixedNodes = null, failure = null;
   const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
   async function waitForState(expected) {
    const deadline = performance.now() + 2000;
    while (graph.ctx.state !== expected && performance.now() < deadline) await wait(20);
   }
   function check(condition, id, description) {
    checks.push({id, description, passed: !!condition});
    if (!condition) throw new Error(description);
   }
   try {
    audio.update(.016, {zone: 'garden'});
    check(graph.created === 0, 'no-nodes-before-unlock', 'Updating before user unlock creates no audio nodes.');
    audio.unlock(); await waitForState('running');
    check(graph.ctx.state === 'running', 'unlock', 'Unlock starts the native context.');
    audio.update(.016, {zone: 'garden'}); fixedNodes = graph.active.size;
    check(fixedNodes === 14, 'fixed-ambience-budget', 'The environment uses 14 fixed nodes.');
    audio.note(392, 1, .2, {pan: -.65, kind: 'cup'});
    check(graph.panCommands.includes(-.65), 'cup-pan', 'A cup note schedules its requested stereo position.');
    audio.chime(); audio.update(.02, {zone: 'garden'}); audio.pause(true);
    const pausedCount = graph.createdOsc;
    await waitForState('suspended'); await wait(100); audio.update(.1, {zone: 'wind'});
    check(graph.ctx.state === 'suspended' && graph.createdOsc === pausedCount, 'pause-clears-chime', 'Pause suspends the context and prevents pending chime notes.');
    audio.pause(false); await waitForState('running'); audio.update(.1, {zone: 'wind'});
    check(graph.createdOsc === pausedCount, 'resume-without-stale-cues', 'Resume does not replay an interrupted chime.');
    audio.chime(); audio.setMuted(true);
    const mutedCount = graph.createdOsc;
    await wait(40); audio.update(.1, {zone: 'pool'}); audio.setMuted(false); audio.update(.1, {zone: 'pool'});
    check(graph.createdOsc === mutedCount, 'mute-clears-chime', 'Muting clears queued chime notes across unmute.');
    for (let i = 0; i < 16; i++) {
     audio.chime();
     for (let j = 0; j < 6; j++) audio.update(.1, {zone: ['garden', 'wind', 'pool', 'finale'][i % 4], night: i % 2, branch: false, opening: false, ended: false});
    }
    check(graph.active.size <= fixedNodes + 30, 'bounded-foreground-voices', 'Repeated chimes stay within ten three-node foreground voices.');
    audio.pause(true); await waitForState('suspended');
    check(graph.active.size === fixedNodes, 'pause-releases-transients', 'Pause disconnects every transient voice node.');
    audio.dispose(); await waitForState('closed');
    check(graph.active.size === 0 && graph.ctx.state === 'closed', 'dispose', 'Dispose disconnects all owned nodes and closes the context.');
    audio.dispose(); audio.update(1, {zone: 'finale'});
    check(audio.unlock() === false, 'disposed-stays-closed', 'Disposed audio cannot reopen.');
   } catch (error) {
    failure = error.stack || String(error);
   } finally {
    audio.dispose(); window.AudioContext = Native;
   }
   return {checks, fixedNodes, nodesAfterDispose: graph.active.size, maximumActiveNodes: graph.maximumActive, error: failure};
  }, moduleUrl);
  Object.assign(report, result, {pageErrors});
  report.passed = !result.error && pageErrors.length === 0 && result.checks.length === report.expectedChecks && result.checks.every(check => check.passed);
 } catch (error) {
  report.error = error.stack || String(error);
 } finally {
  if (browser) await browser.close();
  fs.mkdirSync(path.dirname(reportPath), {recursive: true});
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
 }
 const count = report.checks?.filter(check => check.passed).length || 0;
 console.log(`${report.passed ? 'PASS' : 'FAIL'} audio graph checks ${count}/${report.expectedChecks}; src/audio.js SHA-256 ${report.source.sha256}`);
 console.log(`Report: ${reportPath}`);
 if (!report.passed) {console.error(report.error || 'One or more checks failed.'); process.exitCode = 1;}
})().catch(error => {console.error(error); process.exitCode = 1;});
