/** Assemble passing evidence after a separately rerun verifier; keep failures. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {validateV9Evidence}=require('./validation-v9.cjs'),root=path.resolve(__dirname,'..'),label=process.argv[2],playFile=process.argv[3],soakFile=process.argv[4];assert.match(label||'',/^[a-z0-9-]+$/);assert.ok(playFile&&soakFile);
const read=file=>JSON.parse(fs.readFileSync(path.resolve(root,file),'utf8')),relative=file=>path.relative(root,path.resolve(root,file)).replaceAll('\\','/'),priorFile='evidence/v9/verification-'+label+'.json',prior=read(priorFile);
assert.equal(prior.label,label);const proof={candidate:label,play:relative(playFile),units:'evidence/v9/units-'+label+'.txt'};
for(const name of ['input','onboarding','visual','audio','saves','static','keepsake','legacy']){const jobs=prior.jobs.filter(j=>j.name===name&&j.exit===0);assert.equal(jobs.length,1,'One passing completed job required: '+name);assert.equal(jobs[0].directories.length,1);proof[name]='evidence/v9/'+jobs[0].directories[0]+'/'+(name==='audio'?'capture.json':'report.json');}
proof.audioAnalysis=proof.audio.replace('/capture.json','/analysis.json');proof.soak=relative(soakFile);
const verified=validateV9Evidence(root,{proof,candidate:label});
fs.writeFileSync(path.join(root,'evidence/v9/release-evidence.json'),JSON.stringify(proof,null,2));
fs.writeFileSync(path.join(root,'evidence/v9/verification-'+label+'-complete.json'),JSON.stringify({passed:true,date:new Date().toISOString(),candidate:label,entry:verified.build.entry,proof,evidenceDigest:verified.evidenceDigest,previousRun:priorFile,previousRunFailure:prior.failure||null,rerunReason:'The sustained-run verifier originally checked button visibility before the operation panel finished rendering. It now waits for visible controls and selects restart from the readonly actual flight state. Runtime candidate unchanged; earlier failed reports are retained.'},null,2));
console.log(JSON.stringify({verified:true,entry:verified.build.entry,units:verified.total,proof}));
