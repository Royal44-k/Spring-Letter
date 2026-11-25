/** Publish only the exact local candidate described by fresh V11 evidence. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),proofFile=path.join(root,'evidence/v11/release-proof.json');
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(path.resolve(root,f),'utf8'));
// Pure release guards are also exercised by verify-v11-release-guards.cjs.
const reportNames=['full','legacyCoast','layout','audio','openingLight','openingBalanced','openingDelicate','render','context','resize','seaContext'];
function list(value,name,min=0){assert.ok(Array.isArray(value),name+' array required');assert.ok(value.length>=min,name+' is incomplete');return value;}
function empty(value,name){assert.equal(list(value,name).length,0,name+' must be empty');}
function sameEntry(value,build,name){assert.equal(typeof value,'string',name+' entry required');assert.equal(value,build.entry,name+' entry differs');}
function exactSet(values,expected,name){assert.equal([...values].sort().join('|'),[...expected].sort().join('|'),name+' coverage differs');}
function validateProof(proof){
 assert.equal(proof.version,'0.8.0');assert.equal(typeof proof.candidate,'string');assert.match(proof.candidate,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert.equal(typeof proof.entry,'string');assert.equal(proof.units,'evidence/v11/units-'+proof.candidate+'.log','unit log must belong to this candidate');
 assert.ok(proof.reports&&typeof proof.reports==='object');for(const name of reportNames)assert.equal(typeof proof.reports[name],'string',name+' report path required');
}
function validateBuildIdentity(proof,build){
 assert.equal(build.label,proof.candidate,'build label differs');sameEntry(proof.entry,build,'proof');
 assert.match(build.entry,/^\.\/assets\/[^/\\]+\.js$/);list(build.sources,'build sources',1);list(build.files,'build files',1);
 assert.equal(new Set(build.files.map(f=>f.file)).size,build.files.length,'duplicate candidate file');
 const entry=build.files.find(f=>f.file===build.entry.slice(2));assert.ok(entry,'entry file missing from build manifest');assert.match(entry.sha256,/^[a-f0-9]{64}$/);
 assert.ok(build.files.some(f=>f.file==='index.html'),'index missing from build manifest');return entry.sha256;
}
function validateReport(name,report,build,entryHash){
 assert.equal(report.passed,true,name+' must pass');assert.equal(report.failure,undefined,name+' retained failure');assert.equal(report.error,undefined,name+' retained error');
 if(!['audio','context','seaContext'].includes(name))sameEntry(report.entry,build,name);
 if(!['context','seaContext','render'].includes(name))empty(report.errors,name+' errors');
 if(['layout','render','openingLight','openingBalanced','openingDelicate'].includes(name))assert.equal(report.entrySha256,entryHash,name+' tested entry bytes differ');
 if(['full','legacyCoast'].includes(name)){
  const checks=list(report.checks,name+' checks',name==='full'?12:1);assert.ok(checks.every(c=>typeof c==='string'&&c.trim()),name+' check names required');
  const state=report.final?.state,v=state?.voyage;assert.equal(v?.stage,'complete');assert.ok(typeof state.ending==='string'&&state.ending);assert.equal(v.predecessor,true);assert.equal(v.oldRead,true);
  assert.equal(v.letter?.sealed,true);assert.ok(typeof v.letter.recipient==='string'&&v.letter.recipient.trim());assert.ok(typeof v.letter.body==='string'&&v.letter.body.trim());
  assert.equal(v.distance,150);assert.equal(v.ropes?.length,2);assert.ok(v.ropes.every(r=>r===true));assert.ok(v.sail>=.999);
 }
 if(['layout','audio','context','seaContext'].includes(name)){
  const expected={layout:12,audio:3,context:4,seaContext:3}[name];assert.equal(list(report.cases,name+' cases').length,expected);
  for(const item of report.cases){sameEntry(item.entry,build,name+' case');assert.equal(item.passed,true,name+' case must pass');if(name!=='audio')empty(item.errors,name+' case errors');}
 }
 if(name==='layout'){
  exactSet(report.cases.map(c=>c.name),['desktop','portrait-touch','landscape-touch'].flatMap(view=>['writing','rigging','sailing','complete'].map(stage=>view+'-'+stage)),name);
  for(const c of report.cases){assert.equal(c.entrySha256,entryHash,'layout case entry bytes differ');list(c.checks,'layout case checks',1);assert.ok(list(c.samples,'layout samples',1).every(s=>s.pixelCheck?.valid===true));empty(c.consoleReview?.blocking,'layout console');}
 }
 if(name==='audio'){
  exactSet(report.cases.map(c=>c.stage),['writing','sailing','complete'],name);
  for(const c of report.cases){assert.equal(c.audio?.loaded,true);empty(c.audio.loadErrors,'audio loading errors');
   const samples=list(c.samples,'audio samples',1),muted=list(c.muted,'audio mute samples',1),resumed=list(c.resumed,'audio resumed samples',1);
   assert.ok(samples.every(s=>Number.isFinite(s.peak)&&s.peak>=0&&s.peak<1)&&samples.some(s=>Number.isFinite(s.rms)&&s.rms>.00005));
   assert.ok(muted.every(s=>Number.isFinite(s.peak)&&s.peak>=0&&s.peak<.00001)&&resumed.some(s=>Number.isFinite(s.rms)&&s.rms>.00005));
  }
 }
 if(name==='context'){
  exactSet(report.cases.map(c=>c.phase),['early','opening','dust','material'],name);
  for(const c of report.cases){assert.equal(c.lost?.render?.blocked,true);assert.equal(c.restored?.render?.lifecycle?.needsReload,true);assert.equal(c.reopened?.render?.blocked,false);assert.equal(c.stateAfterReload?.glError,0);}
 }
 if(name==='seaContext'){
  exactSet(report.cases.map(c=>c.stage),['writing','rigging','sailing'],name);
  for(const c of report.cases){assert.equal(c.before?.stage,c.stage);assert.equal(c.after?.stage,c.stage);assert.equal(c.pixelCheck?.valid,true);}
 }
 if(name.startsWith('opening')){
  assert.equal(report.actualQuality,name.slice(7).toLowerCase(),'opening quality differs');assert.ok(list(report.frames,name+' frames',23).every(f=>f.pixelCheck?.valid===true));
  assert.equal(report.pixelValidation?.valid,true);empty(report.pixelValidation.invalid,'opening invalid frames');empty(report.consoleValidation?.blocking,'opening console');
  const coverage=list(report.pixelValidation.coverage,'opening shot coverage');exactSet(coverage.map(c=>c.shot),[0,1,2,3,4,5],'opening shots');assert.ok(coverage.every(c=>c.distinctFrames>=3));assert.ok(report.pixelValidation.firstPlay?.distinctFrames>=5);
 }
 if(name==='render'){
  assert.equal(list(report.observations,'render observations').length,100);assert.ok(report.observations.every(o=>o.pixelCheck?.valid===true));
  empty(report.pageErrors,'render page errors');empty(report.invalidObservations,'invalid render observations');empty(report.failedRequests,'render failed requests');empty(report.consoleValidation?.blocking,'render console');
 }
 if(name==='resize'){
  assert.equal(list(report.observations,'resize observations').length,18);assert.ok(report.observations.every(o=>o.width===1||o.height===1||o.picture?.valid===true));
  assert.equal(report.redundantResizePreservesFrame,true);empty(report.consoleValidation?.blocking,'resize console');
 }
}
function validateUnitLog(text){
 const counts={};for(const key of ['tests','pass','fail']){const rows=[...text.matchAll(new RegExp('^(?:ℹ\\s+|#\\s*)?'+key+' (\\d+)\\s*$','gm'))];assert.equal(rows.length,1,'one complete '+key+' summary required');counts[key]=Number(rows[0][1]);}
 assert.ok(counts.tests>=548,'current candidate needs at least 548 tests');assert.equal(counts.pass,counts.tests);assert.equal(counts.fail,0);return counts.tests;
}
// End pure release guards.
const proof=read(proofFile);validateProof(proof);const build=read('evidence/v11/build-'+proof.candidate+'.json'),entryHash=validateBuildIdentity(proof,build);
assert.equal(path.resolve(build.outDir),path.join(root,'.qa-v11',proof.candidate),'candidate directory differs');
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,'0.8.0');
for(const source of build.sources)assert.equal(hash(path.join(root,source.file)),source.sha256,'source changed since build: '+source.file);
for(const file of build.files){assert.equal(hash(path.join(build.outDir,file.file)),file.sha256,'candidate bytes changed');assert.equal(fs.statSync(path.join(build.outDir,file.file)).size,file.bytes,'candidate size differs');}
const reports={},evidenceHashes={};
for(const name of reportNames){
 const file=proof.reports[name];assert.ok(file,name+' report required');const report=read(file);assert.equal(report.passed,true,name+' must pass');
 validateReport(name,report,build,entryHash);
 reports[name]=report;evidenceHashes[name]={file,sha256:hash(path.join(root,file))};
}
assert.equal(reports.full.final.state.voyage.stage,'complete');assert.ok(reports.full.final.state.ending);assert.ok(reports.full.final.state.voyage.predecessor);
assert.ok(reports.full.checks.length>=12);assert.equal(reports.layout.cases.length,12);assert.equal(reports.audio.cases.length,3);assert.equal(reports.context.cases.length,4);assert.equal(reports.seaContext.cases.length,3);
const unitText=fs.readFileSync(path.join(root,proof.units),'utf8'),total=validateUnitLog(unitText);
evidenceHashes.units={file:proof.units,sha256:hash(path.join(root,proof.units))};
const references=read('evidence/v11/reference-browser.json');assert.ok((Array.isArray(references)?references:references.tabs||references.references||[]).length>=7);
const qa=fs.readFileSync(path.join(root,'FINAL_QA.md'),'utf8');assert.ok(qa.startsWith('# 0.8.0')&&qa.includes(build.entry));
if(process.argv.includes('--verify-only')){console.log(JSON.stringify({verified:true,candidate:proof.candidate,entry:build.entry,units:total}));process.exit(0);}
const dist=path.resolve(root,'dist'),archive=path.resolve(root,'.history','dist-before-0.8.0-'+Date.now());
for(const target of [dist,archive])assert.ok(target!==root&&target.startsWith(root+path.sep));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
if(fs.existsSync(dist)){const old=walk(dist).map(f=>({file:path.relative(dist,f),sha256:hash(f)}));fs.mkdirSync(path.dirname(archive),{recursive:true});fs.cpSync(dist,archive,{recursive:true,errorOnExist:true});for(const f of old)assert.equal(hash(path.join(archive,f.file)),f.sha256);}
fs.mkdirSync(dist,{recursive:true});for(const f of build.files.filter(f=>f.file!=='index.html')){const target=path.resolve(dist,f.file);assert.ok(target.startsWith(dist+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(build.outDir,f.file),target);assert.equal(hash(target),f.sha256);}
const staged=path.join(dist,'.spring-index-upgrade.tmp');fs.copyFileSync(path.join(build.outDir,'index.html'),staged);fs.renameSync(staged,path.join(dist,'index.html'));
const entries=build.files.map(f=>({file:'dist/'+f.file,bytes:f.bytes,sha256:f.sha256}));for(const f of entries)assert.equal(hash(path.join(root,f.file)),f.sha256);
const runtimeFiles=['scripts/serve.cjs','启动春信.cmd','THIRD_PARTY_LICENSES.txt','ASSET_SOURCES.md','README.md','FINAL_QA.md'].map(file=>({file,bytes:fs.statSync(path.join(root,file)).size,sha256:hash(path.join(root,file))}));
const manifest={version:'0.8.0',date:new Date().toISOString(),build:build.entry,styleBuild:build.style,candidate:proof.candidate,dist:entries,runtimeFiles,sources:build.sources,evidence:proof,evidenceHashes,checks:{units:total,fullJourney:reports.full.checks.length,coastalLayouts:12,audioScenes:3,openingSamples:Object.fromEntries(['Light','Balanced','Delicate'].map(q=>[q,reports['opening'+q].frames.length])),renderObservations:reports.render.observations.length,contextRecovery:7,resizeObservations:reports.resize.observations.length},previousDist:archive,retainedPreviousAssets:true,limitations:['Desktop Chromium and emulated touch; not physical mobile-device certification.','Automation uses readonly object projections, not blind first-time playtesting.','Audio measurements are digital signal checks, not a human listening verdict.','Independent playable browser chapter; commercial demand and AAA production quality are not established.']};
fs.writeFileSync(path.join(root,'evidence/release-manifest-v11.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({promoted:true,entry:build.entry,files:entries.length,backup:archive}));
