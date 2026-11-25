/** Promote exact reviewed bytes. Keep previous hashed assets for already-open tabs. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),label=process.argv[2];assert.match(label||'',/^[a-z0-9-]+$/);
const read=f=>JSON.parse(fs.readFileSync(path.resolve(root,f),'utf8')),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),c=read('evidence/v8/build-'+label+'.json'),proof=read('evidence/v8/release-evidence.json');
const entry=path.posix.basename(c.entry),style=path.posix.basename(c.style),asset=c.files.find(f=>f.file==='assets/'+entry);assert.ok(asset);assert.equal(proof.candidate,label);
for(const s of c.sources)assert.equal(hash(path.join(root,s.file)),s.sha256,'Source changed '+s.file);for(const f of c.files)assert.equal(hash(path.join(c.outDir,f.file)),f.sha256,'Candidate changed '+f.file);
const reports={};for(const name of ['play','mobile','visual','soak','legacy','saves','static','keepsake']){
 const r=reports[name]=read(proof[name]);assert.equal(r.passed,true,name+' incomplete');assert.deepEqual(r.errors||[],[],name+' runtime errors');
 const recorded=r.entry||r.build?.entry||r.pages?.[0]?.entry||r.scenarios?.[0]?.entry||r.cases?.[0]?.entry;
 if(recorded)assert.equal(path.posix.basename(recorded),entry,name+' different build');
 else assert.ok(JSON.stringify(r).includes(entry),name+' does not identify the tested build');
 if(r.pages)for(const page of r.pages){assert.equal(page.passed,true);assert.deepEqual(page.errors,[]);assert.deepEqual(page.failures,[]);assert.equal(path.posix.basename(page.entry),entry);assert.equal(page.entryHash,asset.sha256);}
}
assert.ok(reports.soak.elapsedSeconds>=480&&reports.soak.cycles>=4);assert.equal(read('package.json').version,'0.6.0');
const capture=read(proof.audio),audioAsset=capture.assets.find(a=>a.kind==='script');assert.equal(capture.passed,true);assert.equal(path.posix.basename(new URL(audioAsset.url).pathname),entry);assert.equal(audioAsset.sha256,asset.sha256);
const analysis=read(proof.audioAnalysis);assert.ok(Object.values(analysis.checks).every(Boolean),'Decoded audio checks failed');assert.equal(analysis.source.expectedBundle,entry);
const units=fs.readFileSync(path.resolve(root,proof.units),'utf8');assert.match(units,/fail\s+0/);const total=Number(units.match(/tests\s+(\d+)/)?.[1]);assert.equal(Number(units.match(/pass\s+(\d+)/)?.[1]),total);
const qa=fs.readFileSync(path.join(root,'FINAL_QA.md'),'utf8');assert.ok(qa.startsWith('# 0.6.0')&&qa.includes(c.entry),'Final QA document does not match the candidate');
if(process.argv.includes('--verify-only')){console.log(JSON.stringify({verified:true,candidate:label,entry,units:total}));process.exit(0);}
const dist=path.resolve(root,'dist'),archive=path.resolve(root,'.history','dist-before-0.6-'+Date.now());for(const p of [dist,archive])assert.ok(p.startsWith(root+path.sep)&&p!==root);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]),oldFiles=fs.existsSync(dist)?walk(dist).map(f=>({file:path.relative(dist,f),sha256:hash(f)})):[];
fs.mkdirSync(path.dirname(archive),{recursive:true});if(oldFiles.length){fs.cpSync(dist,archive,{recursive:true,errorOnExist:true});for(const f of oldFiles)assert.equal(hash(path.join(archive,f.file)),f.sha256,'Backup differs '+f.file);}fs.mkdirSync(dist,{recursive:true});
for(const f of c.files.filter(f=>f.file!=='index.html')){const target=path.resolve(dist,f.file);assert.ok(target.startsWith(dist+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(c.outDir,f.file),target);assert.equal(hash(target),f.sha256);}
const staged=path.join(dist,'.spring-index-upgrade.tmp');fs.copyFileSync(path.join(c.outDir,'index.html'),staged);fs.renameSync(staged,path.join(dist,'index.html'));
const entries=c.files.map(f=>({file:'dist/'+f.file,bytes:f.bytes,sha256:f.sha256}));for(const e of entries)assert.equal(hash(path.join(root,e.file)),e.sha256);
const runtimeFiles=['scripts/serve.cjs','启动春信.cmd','THIRD_PARTY_LICENSES.txt','ASSET_SOURCES.md','README.md','FINAL_QA.md'].map(file=>({file,bytes:fs.statSync(path.join(root,file)).size,sha256:hash(path.join(root,file))}));
const manifest={version:'0.6.0',date:new Date().toISOString(),build:c.entry,styleBuild:c.style,candidate:label,dist:entries,runtimeFiles,sources:c.sources,evidence:proof,checks:{units:total,play:reports.play.checks.length,mobile:reports.mobile.checks.length,legacy:reports.legacy.checks.length,continuousSeconds:reports.soak.elapsedSeconds},previousDist:archive,retainedPreviousAssets:true,limitations:['Independent browser chapter; commercial demand and willingness to pay not yet validated.','Desktop Chromium and emulated touch verification, not physical-device certification.','Audio analysis is objective output verification, not human listening review.']};
fs.writeFileSync(path.join(root,'evidence/release-manifest-v8.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({promoted:true,build:c.entry,files:entries.length,backup:archive}));
