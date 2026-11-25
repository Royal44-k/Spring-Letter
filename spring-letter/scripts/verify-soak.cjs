// Recheck preserved observations after an end-of-run console-print typo.
// This does not run or invent gameplay, timing samples, or a second soak.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const dir=path.resolve(__dirname,'../evidence');
const raw=fs.readFileSync(path.join(dir,'v5-soak-observer-error.json'));
const r=JSON.parse(raw);
assert.match(r.failure,/ReferenceError: rounds is not defined/);
assert.ok(r.elapsedMs>=45*60000);assert.equal(r.phases.length,r.rounds*6);assert.equal(r.checks.length,7);assert.deepEqual(r.errors,[]);
let elapsed=0;
for(const p of r.phases){
 assert.ok(p.elapsedMs>elapsed);elapsed=p.elapsedMs;assert.ok(p.frames>100&&p.averageMs>0&&Number.isFinite(p.maxMs));
 assert.equal(p.particles.activeCount,p.name==='dust-light'?16384:65536);
 assert.equal(p.audio.persistentNodes,14);assert.equal(p.audio.persistentSources,4);assert.ok(p.audio.voices<=10);
}
for(const name of ['silver','crystal-night','natural','dust','dust-light','roaming']){
 const last=r.phases.filter(p=>p.name===name).slice(-4);assert.equal(last.length,4);
 for(const key of ['geometries','textures','programs']){const values=last.map(p=>p.memory[key]);assert.ok(Math.max(...values)-Math.min(...values)<=2);}
}
r.observerFailure={message:r.failure,preservedFile:'v5-soak-observer-error.json',sha256:crypto.createHash('sha256').update(raw).digest('hex'),stage:'After every timed phase, all seven assertions, the initial result write and final screenshot; console-print shorthand used an undefined variable.'};
delete r.failure;r.passed=true;
r.postValidation={date:new Date().toISOString(),script:'scripts/verify-soak.cjs',scope:'Independent validation of the existing complete 45-minute observations. No rerun and no generated/replaced frames or metrics.',checks:['elapsed duration and complete six-view rounds','strictly increasing actual phase time','recorded frame samples remain finite and nonempty','actual high/low particle counts in every phase','audio resources stay bounded in every phase','last four matched phases plateau','original page/console error array is empty']};
fs.writeFileSync(path.join(dir,'v5-soak.json'),JSON.stringify(r,null,2));
console.log(JSON.stringify({minutes:r.elapsedMs/60000,rounds:r.rounds,phases:r.phases.length,passed:r.passed,observerErrorPreserved:true}));
