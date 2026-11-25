// A release is tied to the exact immutable candidate that was played.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {buildWorkWindow,assertWorkWindow,assertReportIdentity}=require('./v6-release-evidence.cjs');
const root=path.resolve(__dirname,'..'),evidence=path.join(root,'evidence'),label=process.argv[2]||'candidate-g';
assert.match(label,/^[a-z0-9-]+$/);
const read=name=>JSON.parse(fs.readFileSync(path.join(evidence,name),'utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]).sort();
const rel=file=>path.relative(root,file).replaceAll('\\','/');
const candidate=read(`v6-build-${label}.json`),build=candidate.entry,html=fs.readFileSync(path.join(candidate.outDir,'index.html'),'utf8');
const styleBuild=html.match(/href="([^" ]+\.css)"/)?.[1];assert.ok(styleBuild);
const reportBuild=r=>typeof r.build==='string'?r.build:r.build?.entry;
const names=['v6-main-play.json','v6-seed-cancellation.json','v6-seeds-mobile-delivery.json','v6-branches-play.json','v6-exploration-play.json','v6-interface.json','v6-soak.json','v6-recording-verification.json'];
const reports=Object.fromEntries(names.map(name=>[name,read(name)]));
for(const [name,report] of Object.entries(reports)){
 assert.ok(report.checks?.length,`${name}: missing completed checks`);assert.ok(report.checks.every(c=>typeof c==='string'||c.passed===true),`${name}: incomplete assertion`);assert.ok(!report.failure&&report.passed!==false,`${name}: failed report`);
 assert.equal(report.errors?.length||0,0,`${name}: page errors`);assert.equal(reportBuild(report),build,`${name}: tested another build`);
 if(report.build?.finalEntry)assert.equal(report.build.finalEntry,build,`${name}: mixed initial/final build`);
 const css=report.styleBuild||report.build?.styleBuild||report.build?.style;assert.equal(css,styleBuild,`${name}: missing or different stylesheet`);
 if(report.build?.finalStyleBuild)assert.equal(report.build.finalStyleBuild,styleBuild,`${name}: mixed stylesheet`);
}
const soak=reports['v6-soak.json'];assert.ok(soak.passed&&soak.elapsedMs>=45*60000&&soak.rounds>=4,'45-minute repeated actual runtime required');
assert.equal(soak.finalStyleBuild,styleBuild,'soak: missing or changed final stylesheet');
const recording=reports['v6-recording-verification.json'];assert.equal(recording.success,true);assert.equal(recording.uncut,true);assert.equal(recording.audioRecorded,false);
assert.ok(recording.file&&!recording.file.includes('/')&&!recording.file.includes('\\'));const videoPath=path.join(evidence,recording.file);assert.equal(fs.statSync(videoPath).size,recording.fileBytes);assert.ok(recording.fileBytes>1000);
const decoded=read('v6-media-decoding.json');assert.equal(decoded.passed,true);assert.equal(decoded.sha256,hash(videoPath));assertReportIdentity(decoded,{build,styleBuild},'decoded recording');assert.ok(decoded.decodedFrames>1000&&decoded.timestampsStrictlyIncreasing&&decoded.audioStreams===0);
assert.equal(recording.fileSha256,hash(videoPath));assert.equal(decoded.file,recording.file);assert.equal(decoded.bytes,recording.fileBytes);assert.equal(decoded.recordingReportSha256,hash(path.join(evidence,'v6-recording-verification.json')));
for(const [asset,key] of [[build,'entrySha256'],[styleBuild,'styleSha256']]){
 const expected=candidate.dist.find(item=>'/'+item.path===asset)?.sha256;assert.ok(expected,`candidate missing ${asset}`);
 assert.equal(recording.build[key],expected,`recorded ${asset} bytes differ`);assert.equal(decoded.build[key],expected,`decoded ${asset} identity differs`);
}
const departure=read('v6-flower-leave-fixed.json');assert.equal(departure.status,'regression passed');assert.equal(departure.solvedWithoutReentry,true);assert.equal(departure.build.entry,build);assert.equal(departure.build.finalEntry,build);assert.equal(departure.build.styleBuild,styleBuild);assert.equal(departure.build.finalStyleBuild,styleBuild);assert.deepEqual(departure.errors,[]);
for(const item of candidate.sources)assert.equal(hash(path.join(root,item.path)),item.sha256,'source changed after candidate: '+item.path);
const dist=walk(path.join(root,'dist')).map(file=>({file:rel(file),bytes:fs.statSync(file).size,sha256:hash(file)}));
assert.equal(dist.length,candidate.dist.length,'release file set changed');
for(const item of candidate.dist){const found=dist.find(d=>d.file==='dist/'+item.path);assert.ok(found,'missing '+item.path);assert.equal(found.sha256,item.sha256,'candidate bytes changed '+item.path);}
const units=fs.readFileSync(path.join(evidence,'unit-verification-v6.txt'),'utf8'),tests=Number(units.match(/tests\s+(\d+)/)?.[1]),passed=Number(units.match(/pass\s+(\d+)/)?.[1]);assert.ok(tests>0&&tests===passed&&!/fail\s+[1-9]/.test(units));
const fuzzPath=path.resolve(root,'../docs/blossom/v6-restore-fuzz-evidence.json'),fuzz=JSON.parse(fs.readFileSync(fuzzPath,'utf8'));assert.equal(fuzz.passed,10000);assert.equal(fuzz.failed,0);assert.equal(fuzz.sourceSha256['game-model.js'],hash(path.join(root,'src/game-model.js')));
const workWindow=buildWorkWindow();assertWorkWindow(workWindow);
const runtimeFiles=['scripts/serve.cjs','启动春信.cmd','THIRD_PARTY_LICENSES.txt'].map(file=>({file,sha256:hash(path.join(root,file))}));
const manifest={version:JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,date:new Date().toISOString(),build,styleBuild,candidate:label,workWindow,dist,runtimeFiles,totalBytes:dist.reduce((n,f)=>n+f.bytes,0),checks:{units:tests,restoreProbes:fuzz.passed,...Object.fromEntries(Object.entries(reports).map(([name,r])=>[name,r.checks.length]))},sourceFiles:candidate.sources,evidence:names.map(file=>({file,sha256:hash(path.join(evidence,file)),build:reportBuild(reports[file]),scope:reports[file].scope})),limitations:['One integrated GPU and desktop Edge; touch emulation does not certify physical phones.','Reference videos informed form, material and motion; exact optical reproduction and a commercial AAA production scale are not claimed.','Video is silent; synthesized game audio is separate. RAF intervals and resource counters are not GPU timer queries or a GPU-memory leak proof.']};
manifest.recording={file:recording.file,bytes:recording.fileBytes,sha256:hash(videoPath)};
manifest.evidence.push(...['v6-media-decoding.json','v6-flower-leave-fixed.json'].map(file=>({file,sha256:hash(path.join(evidence,file)),build})));
fs.writeFileSync(path.join(evidence,'release-manifest-v6.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({passed:true,version:manifest.version,build,styleBuild,files:dist.length,checks:manifest.checks,wallClockHours:workWindow.wallClockElapsedMs/3600000,activeWorkHours:workWindow.activeWorkMs/3600000}));


