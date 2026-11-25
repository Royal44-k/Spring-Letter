/** All GPU jobs are intentionally serial. No live source or progress mutation. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),label=process.argv[2],playPath=process.argv[3];assert.match(label||'',/^[a-z0-9-]+$/);assert.ok(playPath);
const read=f=>JSON.parse(fs.readFileSync(path.resolve(root,f),'utf8')),build=read('evidence/v9/build-'+label+'.json'),play=read(playPath);assert.equal(play.passed,true);assert.equal(play.entry,build.entry);
const earned=path.resolve(root,path.dirname(playPath),'earned-storage.json'),url=process.env.SPRING_URL;assert.ok(url);assert.ok(fs.existsSync(earned));
const evidence=path.join(root,'evidence/v9'),status={label,url,started:new Date().toISOString(),passed:false,jobs:[]},proof={candidate:label,play:playPath.replaceAll('\\','/'),units:'evidence/v9/units-'+label+'.txt'};
const relative=file=>path.relative(root,file).replaceAll('\\','/'),save=()=>fs.writeFileSync(path.join(evidence,'verification-'+label+'.json'),JSON.stringify(status,null,2));
function run(name,script,prefix,extraArgs=[],extraEnv={}){
 const before=new Set(fs.readdirSync(evidence)),started=Date.now();console.log('START '+name);save();
 const result=spawnSync(process.execPath,[path.join(root,'scripts',script),...extraArgs],{cwd:root,env:{...process.env,SPRING_URL:url,EXPECTED_JS:build.entry,EARNED:earned,...extraEnv},encoding:'utf8',windowsHide:true,maxBuffer:12*1024*1024});
 if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);
 const added=fs.readdirSync(evidence).filter(n=>!before.has(n)&&n.startsWith(prefix)),job={name,script,exit:result.status,elapsedSeconds:(Date.now()-started)/1000,directories:added};status.jobs.push(job);save();assert.equal(result.status,0,name+' failed');assert.equal(added.length,1,name+' must yield one unique evidence directory');
 const report=path.join(evidence,added[0],name==='audio'?'capture.json':'report.json');assert.equal(read(report).passed,true);proof[name]=relative(report);return path.dirname(report);
}
try{
 run('input','v9-input-boundaries.cjs','input-boundaries-');
 run('onboarding','v9-onboarding-check.cjs','onboarding-');
 run('visual','v9-visual-check.cjs','visual-');
 const recording=run('audio','v9-audio-capture.cjs','audio-');
 const py='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe';
 const analysis=spawnSync(py,['-X','utf8',path.join(root,'scripts/analyze-v9-actual-audio.py'),recording],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(analysis.stdout)process.stdout.write(analysis.stdout);if(analysis.stderr)process.stderr.write(analysis.stderr);assert.equal(analysis.status,0,'Actual audio analysis failed');proof.audioAnalysis=relative(path.join(recording,'analysis.json'));
 run('saves','v9-save-ui-check.cjs','save-ui-',[],{EARNED_STORAGE:earned});
 run('static','v9-subdirectory-check.cjs','static-',['--root',build.outDir]);
 run('keepsake','v9-keepsake-check.cjs','keepsake-');
 run('legacy','v9-legacy-check.cjs','legacy-',[],{EARNED_STORAGE:path.join(root,'evidence/v8/play-2026-11-21T03-02-53-815Z/earned-storage.json')});
 run('soak','v9-soak.cjs','soak-');
 status.passed=true;status.finished=new Date().toISOString();status.proof=proof;save();fs.writeFileSync(path.join(evidence,'release-evidence.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify({passed:true,proof}));
}catch(error){status.failure=error.stack;save();console.error(error);process.exitCode=1;}
