/** Promote only the exact 0.9.1 candidate bound to fresh v13 evidence.
 * --verify-only performs read-only validation. Importing exports never publishes.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {snapshotInputs}=require('./build-v13.cjs');
const {assessPixels}=require('./v10-pixel-validation.cjs');
const ROOT=path.resolve(__dirname,'..'),REQUIRED=['flower','render'],OPTIONAL=['full'];
const PLACES=['conservatory','observatory','meadow'];
const RUNTIME_FILES=['scripts/serve.cjs','启动春信.cmd','THIRD_PARTY_LICENSES.txt','ASSET_SOURCES.md','README.md','FINAL_QA.md'];
const hashBytes=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),hash=file=>hashBytes(fs.readFileSync(file));
const list=(v,label,min=0)=>{assert.ok(Array.isArray(v)&&v.length>=min,label+' incomplete');return v;};
const empty=(v,label)=>assert.equal(list(v,label).length,0,label+' must be empty');
const exact=(v,w,label)=>assert.deepEqual([...v].sort(),[...w].sort(),label+' coverage differs');
const hashString=(v,label)=>assert.match(v,/^[a-f0-9]{64}$/,label+' SHA-256 required');
function safeRelative(v,label){assert.equal(typeof v,'string',label);assert.ok(v&&!v.startsWith('/')&&!/[\\:]/.test(v)&&!v.split('/').some(p=>p==='..'||p==='.'||!p),label+' unsafe relative path');return v;}
function safeChild(base,relative){safeRelative(relative,'artifact');const target=path.resolve(base,relative);assert.ok(target.startsWith(path.resolve(base)+path.sep),'artifact escapes its directory');return target;}
function identity(report,build,label){assert.equal(report.entry,build.entry,label+' entry differs');assert.equal(report.entrySha256,build.entrySha256,label+' entry bytes differ');assert.equal(report.style,build.style,label+' stylesheet differs');assert.equal(report.styleSha256,build.styleSha256,label+' stylesheet bytes differ');}
function passed(report,label){assert.equal(report.passed,true,label+' must pass');for(const key of ['error','failure','cleanupError','recordingError'])assert.equal(report[key],undefined,label+' retained '+key);}
function pixels(record,label){assert.equal(record?.pixelCheck?.valid,true,label+' missing pixel pass');assert.equal(assessPixels(record.pixels).valid,true,label+' raw pixels contradict verdict');}
function resource(memory,label){for(const key of ['geometries','textures','programs'])assert.ok(Number.isInteger(memory?.[key])&&memory[key]>=0,label+' missing '+key);}
function validateProof(proof){
 assert.equal(proof.version,'0.9.1');assert.match(proof.candidate,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.match(proof.entry,/^\.\/assets\/[^/\\]+\.js$/);hashString(proof.entrySha256,'proof');assert.match(proof.style,/^\.\/assets\/[^/\\]+\.css$/);hashString(proof.styleSha256,'proof stylesheet');
 assert.ok(proof.reports&&typeof proof.reports==='object');for(const name of REQUIRED)safeRelative(proof.reports[name],name+' report');
 for(const [name,file]of Object.entries(proof.reports)){assert.ok([...REQUIRED,...OPTIONAL].includes(name),'unsupported evidence type '+name);assert.ok(safeRelative(file,name).startsWith('evidence/'),'reports must be local evidence');}
}
function validateBuild(proof,build){
 assert.equal(build.format,'spring-letter-candidate');assert.equal(build.manifestVersion,1);assert.equal(build.version,'0.9.1');assert.equal(build.label,proof.candidate);assert.equal(build.status,'built');passed(build,'candidate');identity(proof,build,'proof');
 for(const field of ['sources','tests','scripts','sourceAll','files'])list(build[field],'build '+field,1);
 for(const field of ['sourceAll','files']){assert.equal(new Set(build[field].map(f=>f.file.toLowerCase())).size,build[field].length,'duplicate/case-colliding '+field);for(const f of build[field]){hashString(f.sha256,f.file);assert.ok(Number.isInteger(f.bytes)&&f.bytes>=0);}}
 for(const f of build.files)safeRelative(f.file,'candidate file');
 for(const [entry,expected]of [[build.entry,build.entrySha256],[build.style,build.styleSha256],['./index.html',build.htmlSha256]]){assert.equal(typeof entry,'string');assert.ok(entry.startsWith('./'));const found=build.files.find(f=>f.file===entry.slice(2));assert.ok(found,'manifest entry missing: '+entry);assert.equal(found.sha256,expected,'manifest asset hash differs');}
 assert.equal(hashBytes(JSON.stringify(build.sourceAll)),build.sourceDigest,'frozen input digest differs');
 const run=build.testRun;assert.ok(run&&Array.isArray(run.command)&&run.command.includes('--test'),'real Node test run required');
 assert.equal(run.log,'evidence/v13/build-'+proof.candidate+'.test.log','CPU log belongs to this candidate');hashString(run.logSha256,'CPU log');
 assert.equal(run.files,build.tests.filter(f=>/\.test\.[cm]?js$/.test(f.file)).length);assert.ok(run.files>0&&run.total>=run.files);assert.equal(run.passed,run.total);assert.equal(run.failed,0);
}
function validateCpu(text,run){
 const counts={};for(const key of ['tests','pass','fail','cancelled','skipped','todo']){const rows=[...text.matchAll(new RegExp('^(?:ℹ\\s+|#\\s*)?'+key+' (\\d+)\\s*$','gm'))];assert.equal(rows.length,1,'exactly one complete CPU '+key+' summary required');counts[key]=Number(rows[0][1]);}
 assert.equal(counts.tests,run.total,'CPU total differs from frozen run');assert.equal(counts.pass,run.passed);assert.equal(counts.fail,run.failed);for(const key of ['fail','cancelled','skipped','todo'])assert.equal(counts[key],0,'CPU '+key+' must be zero');return counts.tests;
}
function validateReport(name,r,build){
 assert.ok([...REQUIRED,...OPTIONAL].includes(name),'unsupported report');passed(r,name);identity(r,build,name);if(r.errors!==undefined)empty(r.errors,name+' errors');
 if(name==='full'){
  empty(r.errors,'full errors');assert.equal(r.version,'0.9.1');assert.equal(r.primaryActions,12);
  exact(Object.keys(r.coreChecks||{}),['rain','wind','tide','bridges','cores',...PLACES,'writing','tidalLetter','rigging','sailing'],'twelve actions');assert.ok(Object.values(r.coreChecks).every(v=>v===true));list(r.checks,'full check descriptions',12);
  const s=r.final?.state,v=s?.voyage,a=s?.atlas;assert.equal(v?.stage,'complete');assert.ok(typeof s.ending==='string'&&s.ending);assert.equal(v.predecessor,true);assert.equal(v.oldRead,true);assert.equal(v.letter?.sealed,true);for(const key of ['recipient','body'])assert.ok(typeof v.letter[key]==='string'&&v.letter[key].trim());assert.ok(v.distance>=150);assert.deepEqual(v.ropes,[true,true]);assert.ok(v.sail>=.999);
  exact(a?.completed||[],PLACES,'earned maps');assert.deepEqual(a.blooms,[1,1,1]);assert.deepEqual(a.stars,[0,1,2,3,4,0,5,2]);assert.equal(a.meadowCheckpoint,4);
  for(const s of list(r.samples,'full pixel samples',9))pixels(s,'full sample');for(const id of PLACES)assert.ok(r.samples.some(s=>s.location===id),'missing map pixels '+id);

 }else if(name==='flower'){
  const cases=list(r.cases,'flower cases',4);exact(cases.map(c=>c.name),['desktop-fresh','portrait-touch-fresh','landscape-touch-fresh','desktop-earned-coast'],'flower regression cases');
  for(const c of cases){
   passed(c,'flower '+c.name);identity(c,build,'flower '+c.name);empty(c.errors,'flower errors');empty(c.consoleReview?.blocking,'flower console');
   list(c.checks,'flower actual checks',c.name==='desktop-earned-coast'?1:c.name==='desktop-fresh'?7:4);
   const samples=list(c.samples,'flower samples',c.name==='desktop-earned-coast'?3:10);for(const s of samples){pixels(s,'flower sample');assert.ok(Number.isInteger(s.frame)&&s.frame>0,'rendered frame');assert.ok(s.dom?.pageWidth<=s.dom?.viewport+1,'horizontal page overflow');}
   list(c.screenshots,'flower screenshots',samples.length);for(const shot of c.screenshots)safeRelative(shot,'flower screenshot');
   for(const m of list(c.controls,'reachable flower controls',5)){assert.equal(m.visible,true);assert.equal(m.centerHit,true);assert.equal(m.inScrollport,true);assert.ok(m.rect?.width>0&&m.rect?.height>0);}
   safeRelative(c.storage?.file,'saved flower archive');hashString(c.storage?.sha256,'saved flower archive');
   if(c.name==='desktop-earned-coast'){assert.equal(c.earnedArchive?.valuesUnchanged,true);safeRelative(c.earnedArchive?.file,'earned source');hashString(c.earnedArchive?.sha256,'earned source');}
  }
  const desktop=cases.find(c=>c.name==='desktop-fresh'),labels=desktop.samples.map(s=>s.name);
  const required=['home-studio','dust','flower-again','burst-drift','returning','naturally-restored','persisted-selection',...['lily','lotus','iris','dahlia'].map(x=>'form-'+x),...['silver','crystal','lily','amber','celadon'].map(x=>'series-'+x),...PLACES.flatMap(x=>[x+'-before',x+'-studio',x+'-return'])];
  for(const label of required)assert.ok(labels.includes('desktop-fresh-'+label),'missing actual flower observation '+label);
 }else if(name==='render'){
  assert.equal(list(r.observations,'render observations').length,100);for(const o of r.observations){identity(o,build,'render observation');pixels({pixels:o.pixels||o,pixelCheck:o.pixelCheck},'render matrix');empty(o.errors,'render observation errors');}empty(r.pageErrors,'render page errors');empty(r.invalidObservations,'render invalid observations');empty(r.failedRequests,'render requests');empty(r.consoleValidation?.blocking,'render console');
 }
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{assert.ok(!e.isSymbolicLink(),'no symlinks in release artifacts');const f=path.join(dir,e.name);return e.isDirectory()?walk(f):[f];}).sort();}
function validateArtifact(base,item,label){const file=safeChild(base,item.file);assert.equal(fs.statSync(file).size,item.bytes,label+' size');assert.equal(hash(file),item.sha256,label+' hash');return file;}
function parseArgs(args){assert.ok(Array.isArray(args),'CLI arguments must be an array');if(args.length===0)return'promote';assert.deepEqual(args,['--verify-only'],'Unknown or repeated arguments; expected no arguments or --verify-only');return'verify';}
function validateStagedHtml(bytes,build){
 assert.equal(hashBytes(bytes),build.htmlSha256,'staged HTML changed after verification');
 const modules=[...bytes.toString('utf8').matchAll(/<script\b([^>]*)>/gi)].map(([,attrs])=>({type:attrs.match(/\btype\s*=\s*(["'])(.*?)\1/i)?.[2],src:attrs.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2]})).filter(s=>s.type?.toLowerCase()==='module');
 assert.equal(modules.length,1,'staged HTML must contain exactly one module entry');assert.equal(modules[0].src,build.entry,'staged HTML module entry differs from verified build');
}
function validateRuntimeFiles(runtimeFiles,io=fs){
 exact(list(runtimeFiles,'verified runtime inventory',RUNTIME_FILES.length).map(f=>f.file),RUNTIME_FILES,'verified runtime inventory');
 for(const f of runtimeFiles){hashString(f.sha256,'runtime '+f.file);const bytes=io.readFileSync(safeChild(ROOT,f.file));assert.equal(bytes.length,f.bytes,'runtime changed size after verification: '+f.file);assert.equal(hashBytes(bytes),f.sha256,'runtime changed bytes after verification: '+f.file);}
}
function installStagedEntry(staged,target,build,runtimeFiles,io=fs){
 validateStagedHtml(io.readFileSync(staged),build);validateRuntimeFiles(runtimeFiles,io);io.renameSync(staged,target);
}
function verify(){
 const proofFile=path.join(ROOT,'evidence/v13/release-proof.json'),proof=JSON.parse(fs.readFileSync(proofFile));validateProof(proof);
 const buildFile=path.join(ROOT,'evidence/v13/build-'+proof.candidate+'.json'),build=JSON.parse(fs.readFileSync(buildFile));validateBuild(proof,build);
 assert.equal(path.resolve(build.outDir),path.join(ROOT,'.qa-v13',proof.candidate));assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'package.json'))).version,'0.9.1');
 assert.deepEqual(snapshotInputs().sourceAll,build.sourceAll,'source, public assets, tests, scripts or frozen docs changed since candidate');
 for(const f of build.files)validateArtifact(build.outDir,f,'candidate '+f.file);exact(walk(build.outDir).map(f=>path.relative(build.outDir,f).replaceAll('\\','/')),build.files.map(f=>f.file),'candidate file set');
 const cpuFile=safeChild(ROOT,build.testRun.log);assert.equal(hash(cpuFile),build.testRun.logSha256,'CPU log hash');const total=validateCpu(fs.readFileSync(cpuFile,'utf8'),build.testRun);
 const evidenceHashes={build:{file:path.relative(ROOT,buildFile).replaceAll('\\','/'),sha256:hash(buildFile)},proof:{file:path.relative(ROOT,proofFile).replaceAll('\\','/'),sha256:hash(proofFile)},cpu:{file:build.testRun.log,sha256:hash(cpuFile)}},reports={};
 for(const [name,relative]of Object.entries(proof.reports)){
  const file=safeChild(ROOT,relative),r=JSON.parse(fs.readFileSync(file));validateReport(name,r,build);reports[name]=r;evidenceHashes[name]={file:relative,sha256:hash(file)};
  const base=path.dirname(file);
  if(name==='flower')for(const c of r.cases){
   validateArtifact(base,{...c.storage,bytes:fs.statSync(safeChild(base,c.storage.file)).size},'saved archive');
   for(const shot of c.screenshots)assert.ok(fs.statSync(safeChild(base,shot)).size>1000,'flower screenshot missing');
   for(const sample of c.samples){const snapshot=JSON.parse(fs.readFileSync(safeChild(base,sample.name+'.json')));assert.deepEqual(snapshot.pixels,sample.pixels,'actual pixel evidence changed');assert.deepEqual(snapshot.pixelCheck,sample.pixelCheck);}
   if(c.earnedArchive)assert.equal(hash(safeChild(ROOT,c.earnedArchive.file)),c.earnedArchive.sha256,'earned coast archive changed');
  }
  if(name==='render')for(const o of r.observations)assert.ok(fs.statSync(safeChild(base,o.label+'.png')).size>1000,'render screenshot missing');
 }
 assert.equal(hash(path.join(ROOT,'ASSET_SOURCES.md')),hash(path.join(ROOT,'public/ASSET_SOURCES.md')),'source registries differ');
 const qa=fs.readFileSync(path.join(ROOT,'FINAL_QA.md'),'utf8');assert.ok(qa.startsWith('# 0.9.1')&&qa.includes(build.entry),'current QA must identify the exact candidate entry');
 const runtimeFiles=RUNTIME_FILES.map(file=>{const bytes=fs.readFileSync(safeChild(ROOT,file));return{file,bytes:bytes.length,sha256:hashBytes(bytes)};});
 for(const f of runtimeFiles.filter(f=>f.file!=='FINAL_QA.md'))assert.deepEqual(f,build.sourceAll.find(frozen=>frozen.file===f.file),'runtime must match its frozen build input: '+f.file);
 validateRuntimeFiles(runtimeFiles);return{proof,build,reports,evidenceHashes,total,runtimeFiles};
}
function promote(verified){
 assert.ok(!fs.existsSync(path.join(ROOT,'evidence/release-manifest-v13.json')),'Do not overwrite an existing 0.9.1 publication record');
 const {proof,build,reports,evidenceHashes,total,runtimeFiles}=verified,dist=path.join(ROOT,'dist'),archive=path.join(ROOT,'.history','dist-before-0.9.1-'+Date.now());
 validateRuntimeFiles(runtimeFiles);
 for(const target of [dist,archive])assert.ok(path.resolve(target).startsWith(ROOT+path.sep)&&target!==ROOT);
 if(fs.existsSync(dist)){const before=walk(dist).map(f=>({file:path.relative(dist,f),sha256:hash(f)}));fs.mkdirSync(path.dirname(archive),{recursive:true});fs.cpSync(dist,archive,{recursive:true,errorOnExist:true});for(const f of before)assert.equal(hash(path.join(archive,f.file)),f.sha256,'backup mismatch');}
 fs.mkdirSync(dist,{recursive:true});for(const f of build.files.filter(f=>f.file!=='index.html')){const target=safeChild(dist,f.file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(safeChild(build.outDir,f.file),target);assert.equal(hash(target),f.sha256);}
 const staged=path.join(dist,'.spring-index-0.9.1-upgrade.tmp');fs.copyFileSync(path.join(build.outDir,'index.html'),staged);installStagedEntry(staged,path.join(dist,'index.html'),build,runtimeFiles);
 const entries=build.files.map(f=>({...f,file:'dist/'+f.file}));for(const f of entries)validateArtifact(ROOT,f,'promoted file');
 const manifest={version:'0.9.1',date:new Date().toISOString(),build:build.entry,entrySha256:build.entrySha256,styleBuild:build.style,styleSha256:build.styleSha256,candidate:proof.candidate,dist:entries,runtimeFiles,sources:build.sourceAll,evidence:proof,evidenceHashes,checks:{units:total,flowerCases:4,renderObservations:100,fullJourneyCurrentBuild:!!reports.full,primaryActions:reports.full?12:null,optional:Object.keys(reports).filter(n=>OPTIONAL.includes(n))},previousDist:archive,retainedPreviousAssets:true,limitations:['Desktop Edge and emulated touch, not physical mobile certification.','Version 0.9.0 reports remain historical. Only exact 0.9.1 evidence is counted in checks; fullJourneyCurrentBuild states whether a new full run was supplied.','Object/pixel evidence does not independently establish artistic quality or commercial demand.']};
 fs.writeFileSync(path.join(ROOT,'evidence/release-manifest-v13.json'),JSON.stringify(manifest,null,2));return manifest;
}
function main(args=process.argv.slice(2),operations={verify,promote},print=console.log){const mode=parseArgs(args),result=operations.verify();if(mode==='verify')print(JSON.stringify({verified:true,candidate:result.proof.candidate,entry:result.build.entry,entrySha256:result.build.entrySha256,style:result.build.style,styleSha256:result.build.styleSha256,units:result.total,promotionExecuted:false}));else{const manifest=operations.promote(result);print(JSON.stringify({promoted:true,entry:manifest.build,entrySha256:manifest.entrySha256,files:manifest.dist.length,backup:manifest.previousDist}));}}
module.exports={validateProof,validateBuild,validateCpu,validateReport,safeRelative,verify,promote,parseArgs,validateStagedHtml,validateRuntimeFiles,installStagedEntry,main};
if(require.main===module){try{main();}catch(error){console.error(error);process.exitCode=1;}}
