/** Read-only gates shared by QA generation and promotion. No browser or writes. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const REPORTS=['play','visual','input','legacy','saves','static','keepsake','soak'];
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');

function validateV9Evidence(root,options={}){
 root=path.resolve(root);
 const readText=options.readText||((file)=>fs.readFileSync(path.resolve(root,file),'utf8'));
 const readJson=options.readJson||((file)=>JSON.parse(readText(file)));
 const hashFile=options.hashFile||((file)=>digest(fs.readFileSync(path.resolve(root,file))));
 const proof=options.proof||readJson('evidence/v9/release-evidence.json');
 const candidate=options.candidate||proof.candidate;assert.match(candidate||'',/^[a-z0-9-]+$/);assert.equal(proof.candidate,candidate,'Proof candidate mismatch');
 const buildFile='evidence/v9/build-'+candidate+'.json',build=readJson(buildFile);
 assert.equal(build.label,candidate,'Build label mismatch');assert.equal(readJson('package.json').version,options.version||'0.7.0');
 const entry=path.posix.basename(build.entry),asset=build.files.find(file=>file.file==='assets/'+entry);assert.ok(asset,'Candidate entry missing from manifest');
 for(const source of build.sources)assert.equal(hashFile(path.join(root,source.file)),source.sha256,'Source changed '+source.file);
 for(const file of build.files)assert.equal(hashFile(path.join(build.outDir,file.file)),file.sha256,'Candidate changed '+file.file);
 const clean=(record,name)=>{assert.equal(record?.passed,true,name+' incomplete');for(const field of ['errors','failures'])assert.deepEqual(record[field]||[],[],name+' '+field);};
 const identity=(record,name,required)=>{
  if(required||record.entry!==undefined){assert.equal(typeof record.entry,'string',name+' must identify its build');assert.equal(path.posix.basename(record.entry),entry,name+' used a different build');}
  for(const field of ['entryHash','entrySha256'])if(record[field]!==undefined)assert.equal(record[field],asset.sha256,name+' '+field+' differs from candidate');
 };
 const reports={};
 for(const name of REPORTS){
  const report=reports[name]=readJson(proof[name]);clean(report,name);
  const pages=report.pages||[];assert.ok(Array.isArray(pages),name+' pages must be an array');identity(report,name,!pages.length);
  for(const [index,page]of pages.entries()){clean(page,name+' page '+index);identity(page,name+' page '+index,true);}
 }
 for(const name of ['play','legacy','saves','static','keepsake'])assert.ok(Array.isArray(reports[name].checks)&&reports[name].checks.length>0,name+' checks missing');
 assert.equal(reports.visual.pages.length,3,'Visual evidence must cover all three viewports');
 assert.equal(reports.input.pages.length,2,'Input evidence must cover desktop and touch');
 assert.equal(reports.static.pages.length,2,'Static evidence must cover root and nested paths');
 for(const page of reports.input.pages)assert.ok(Array.isArray(page.checks)&&page.checks.length>0,'Input page checks missing');
 const onboarding=reports.onboarding=readJson(proof.onboarding);clean(onboarding,'onboarding');
 assert.equal(onboarding.entry?.src,build.entry);assert.equal(onboarding.entry.sha256,asset.sha256);
 assert.equal(onboarding.pages?.length,2,'Opening must cover desktop and portrait');
 for(const page of onboarding.pages){clean(page,'onboarding '+page.mode);assert.equal(page.frames?.length,6);assert.ok(page.entries?.length);for(const observed of page.entries){assert.equal(observed.src,build.entry);assert.equal(observed.sha256,asset.sha256);}}
 assert.ok(reports.soak.elapsedSeconds>=480&&reports.soak.cycles>=6,'Incomplete sustained run');
 assert.ok(Array.isArray(reports.soak.samples)&&reports.soak.samples.length>0,'Soak samples missing');
 for(const sample of reports.soak.samples)for(const key of ['p95','max'])assert.ok(Number.isFinite(sample.timing?.[key])&&sample.timing[key]>0,'Invalid soak '+key);
 const audio=readJson(proof.audio),analysis=readJson(proof.audioAnalysis);clean(audio,'audio');
 assert.deepEqual(audio.consoleErrors||[],[],'Audio console errors');assert.deepEqual(audio.requestFailures||[],[],'Audio request failures');
 assert.equal(audio.entry?.src,build.entry,'Audio used a different build');assert.equal(audio.entry.sha256,asset.sha256,'Audio entry hash mismatch');
 assert.ok(Array.isArray(audio.checks)&&audio.checks.length>0&&audio.checks.every(check=>check.passed===true),'Audio capture checks incomplete');
 assert.equal(analysis.passed,true,'Audio analysis incomplete');assert.ok(analysis.checks&&Object.keys(analysis.checks).length>0&&Object.values(analysis.checks).every(value=>value===true),'Audio analysis checks incomplete');
 assert.equal(analysis.source?.entry?.sha256,asset.sha256,'Audio analysis used a different build');
 assert.equal(analysis.source.captureJsonSha256,hashFile(path.resolve(root,proof.audio)),'Audio analysis describes another capture report');
 assert.equal(hashFile(analysis.source.file),analysis.source.sha256,'Recorded audio changed');
 const units=readText(proof.units);assert.match(units,/fail\s+0(?:\s|$)/);const total=Number(units.match(/tests\s+(\d+)/)?.[1]);assert.ok(total>=404,'Incomplete unit suite');assert.equal(Number(units.match(/pass\s+(\d+)/)?.[1]),total,'Unit result mismatch');
 const evidenceHashes=Object.entries(proof).filter(([key])=>key!=='candidate').sort(([a],[b])=>a.localeCompare(b)).map(([kind,file])=>({kind,file,sha256:hashFile(path.resolve(root,file))}));
 const evidenceDigest=digest(JSON.stringify({candidate,build:hashFile(path.resolve(root,buildFile)),evidenceHashes}));
 return {proof,build,reports,audio,analysis,entry,asset,total,evidenceHashes,evidenceDigest};
}
module.exports={validateV9Evidence};
