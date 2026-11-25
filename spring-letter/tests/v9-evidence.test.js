import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import validation from '../scripts/validation-v9.cjs';

const {validateV9Evidence}=validation,require=createRequire(import.meta.url);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');

// Every file below is a Map entry. No actual report, archive or candidate is read
// or written; source and captured-audio mutations remain synthetic test data.
function fixture(){
 const root=path.resolve('in-memory-v9-evidence'),files=new Map();
 const absolute=file=>path.resolve(root,file),put=(file,value)=>files.set(absolute(file),typeof value==='string'?value:JSON.stringify(value));
 const text=file=>{assert.ok(files.has(absolute(file)),'Missing memory fixture '+file);return files.get(absolute(file));};
 const get=file=>JSON.parse(text(file)),entry='./assets/index-FIXTURE.js',assetHash=sha('bundle bytes'),proof={candidate:'fixture'};
 put('.qa-v9/fixture/assets/index-FIXTURE.js','bundle bytes');put('src/fixture.js','source bytes');put('package.json',{version:'0.7.0'});
 put('evidence/v9/build-fixture.json',{label:'fixture',entry,style:'./assets/index-FIXTURE.css',outDir:absolute('.qa-v9/fixture'),sources:[{file:'src/fixture.js',sha256:sha('source bytes')}],files:[{file:'assets/index-FIXTURE.js',sha256:assetHash}]});
 for(const name of ['play','visual','input','legacy','saves','static','keepsake','soak']){
  proof[name]='reports/'+name+'.json';const record={passed:true,entry,entrySha256:assetHash,errors:[],checks:['synthetic ordinary-input observation']};
  if(['visual','input','static'].includes(name))record.pages=Array.from({length:name==='visual'?3:2},()=>({passed:true,entry,entryHash:assetHash,errors:[],failures:[],checks:['synthetic page observation']}));
  if(name==='soak')Object.assign(record,{elapsedSeconds:500,cycles:6,samples:[{timing:{p95:20,max:80}}]});
  put(proof[name],record);
 }
 proof.onboarding='reports/onboarding.json';put(proof.onboarding,{passed:true,entry:{src:entry,sha256:assetHash},errors:[],pages:['desktop','portrait'].map(mode=>({mode,passed:true,errors:[],frames:Array.from({length:6},(_,index)=>({index})),entries:[{src:entry,sha256:assetHash}]}))});
 proof.audio='reports/capture.json';put(proof.audio,{passed:true,entry:{src:entry,sha256:assetHash},checks:[{passed:true}],errors:[],consoleErrors:[],requestFailures:[]});
 put('reports/game-output.webm','captured bytes');proof.audioAnalysis='reports/analysis.json';put(proof.audioAnalysis,{passed:true,checks:{sampleClippingAbsent:true,fixedMuteInteriorPassed:true},source:{entry:{sha256:assetHash},captureJsonSha256:sha(text(proof.audio)),file:absolute('reports/game-output.webm'),sha256:sha('captured bytes')}});
 proof.units='reports/units.txt';put(proof.units,'tests 404\npass 404\nfail 0\n');
 const mutate=(name,change)=>{const value=get(proof[name]);change(value);put(proof[name],value);};
 const run=()=>validateV9Evidence(root,{proof,readText:text,hashFile:file=>sha(text(file))});
 return {root,files,put,get,text,proof,entry,assetHash,mutate,run};
}

test('complete matching evidence validates without FINAL_QA or modifying any source record',()=>{
 const f=fixture(),before=[...f.files],result=f.run();assert.equal(result.total,404);assert.equal(result.build.entry,f.entry);assert.equal(result.reports.onboarding.pages.length,2);assert.match(result.evidenceDigest,/^[a-f0-9]{64}$/);assert.deepEqual([...f.files],before);
});

test('a passed developer or old bundle report cannot be relabelled as the current candidate',()=>{
 for(const entry of ['/src/main.js?t=old','./assets/index-OLD.js']){const f=fixture();f.mutate('play',record=>record.entry=entry);assert.throws(f.run,/play used a different build/);}
});

test('one old nested page rejects an otherwise matching aggregate report',()=>{
 const f=fixture();f.mutate('visual',record=>record.pages[1].entry='./assets/index-OLD.js');assert.throws(f.run,/visual page 1 used a different build/);
});

test('both observed hash field names are checked at report and page level',()=>{
 for(const field of ['entryHash','entrySha256'])for(const nested of [false,true]){
  const f=fixture();f.mutate(nested?'static':'legacy',record=>(nested?record.pages[0]:record)[field]='0'.repeat(64));assert.throws(f.run,new RegExp(field+' differs from candidate'));
 }
});

test('failed or unfinished nested pages cannot borrow a passed parent result',()=>{
 for(const value of [false,undefined]){const f=fixture();f.mutate('input',record=>record.pages[0].passed=value);assert.throws(f.run,/input page 0 incomplete/);}
});

test('opening entry objects and every observed reload are bound to the candidate script and hash',()=>{
 for(const nested of [false,true])for(const field of ['src','sha256']){
  const f=fixture();f.mutate('onboarding',record=>(nested?record.pages[1].entries[0]:record.entry)[field]=field==='src'?'./assets/index-OLD.js':'0'.repeat(64));assert.throws(f.run,assert.AssertionError);
 }
});

test('opening evidence requires two completed pages with six frames and an observed entry each',()=>{
 for(const change of [record=>record.pages.pop(),record=>record.pages[0].passed=false,record=>record.pages[0].frames.pop(),record=>record.pages[1].entries=[]]){
  const f=fixture();f.mutate('onboarding',change);assert.throws(f.run,assert.AssertionError);
 }
});

test('audio analysis must describe the exact capture report rather than a different successful recording',()=>{
 const f=fixture();f.mutate('audioAnalysis',record=>record.source.captureJsonSha256='0'.repeat(64));assert.throws(f.run,/another capture report/);
});

test('recording bytes are verified independently from the capture and analysis success flags',()=>{
 const f=fixture();f.put('reports/game-output.webm','substituted recording');assert.throws(f.run,/Recorded audio changed/);
});

test('empty, false or merely truthy audio checks cannot produce a successful audio verdict',()=>{
 for(const checks of [{},{sampleClippingAbsent:false},{sampleClippingAbsent:'true'}]){const f=fixture();f.mutate('audioAnalysis',record=>record.checks=checks);assert.throws(f.run,/Audio analysis checks incomplete/);}
 const f=fixture();f.mutate('audio',record=>record.checks=[]);assert.throws(f.run,/Audio capture checks incomplete/);
});

test('changing source bytes or immutable candidate bytes invalidates the evidence before promotion',()=>{
 const source=fixture();source.put('src/fixture.js','changed source');assert.throws(source.run,/Source changed/);
 const candidate=fixture();candidate.put('.qa-v9/fixture/assets/index-FIXTURE.js','changed bundle');assert.throws(candidate.run,/Candidate changed/);
});

test('failed, incomplete or inconsistent unit output cannot be counted as a complete passing suite',()=>{
 for(const log of ['tests 404\npass 403\nfail 1\n','tests 403\npass 403\nfail 0\n','tests 404\npass 403\nfail 0\n']){const f=fixture();f.put(f.proof.units,log);assert.throws(f.run,assert.AssertionError);}
});

test('missing activity observations and incomplete soak duration are rejected rather than printed as coverage',()=>{
 const activity=fixture();activity.mutate('play',record=>record.checks=[]);assert.throws(activity.run,/play checks missing/);
 const soak=fixture();soak.mutate('soak',record=>record.elapsedSeconds=479);assert.throws(soak.run,/Incomplete sustained run/);
 const timing=fixture();timing.mutate('soak',record=>record.samples[0].timing.p95=null);assert.throws(timing.run,/Invalid soak p95/);
});

test('changing a report under the same build changes the fingerprint required by FINAL_QA',()=>{
 const f=fixture(),before=f.run().evidenceDigest;f.mutate('play',record=>record.checks.push('another actual observation in this synthetic fixture'));assert.notEqual(f.run().evidenceDigest,before);
});

test('actual report and promotion entrypoints reject mixed evidence through the shared gate before writing',()=>{
 for(const name of ['report-v9.cjs','release-v9.cjs']){
  const f=fixture();f.mutate('play',record=>record.entry='./assets/index-OLD.js');let calls=0,writes=0;
  const source=fs.readFileSync(new URL('../scripts/'+name,import.meta.url),'utf8');
  const context={__dirname:path.join(f.root,'scripts'),process:{argv:['node',name,'fixture']},console:{log(){}},require:id=>{
   if(id==='./validation-v9.cjs')return {validateV9Evidence:()=>{calls++;return f.run();}};
   if(id==='node:fs')return {readFileSync(){throw Error('Entrypoint read before validation');},writeFileSync(){writes++;throw Error('Entrypoint wrote before validation');}};
   return require(id);
  }};
  assert.throws(()=>vm.runInNewContext(source,context,{filename:name}),/play used a different build/);assert.equal(calls,1,name);assert.equal(writes,0,name);
 }
});
