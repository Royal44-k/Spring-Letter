const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');

const root=path.resolve(__dirname,'..');
const sha256=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function walk(directory){
 return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  const file=path.join(directory,entry.name);
  assert.ok(!entry.isSymbolicLink(),'Frozen inputs and output must not follow symlinks: '+file);
  return entry.isDirectory()?walk(file):entry.isFile()?[file]:[];
 }).sort();
}
const record=file=>({file:path.relative(root,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,sha256:sha256(file)});
function snapshotInputs(){
 const sources=[...walk(path.join(root,'src')),...walk(path.join(root,'public')),...['index.html','package.json','package-lock.json','vite.config.js'].map(file=>path.join(root,file))].sort().map(record);
 const tests=walk(path.join(root,'tests')).map(record),scripts=walk(path.join(root,'scripts')).map(record);
 const supporting=[
  path.join(root,'../package.json'),path.join(root,'../package-lock.json'),
  path.join(root,'../docs/blossom/v12-design.md'),path.join(root,'../docs/superpowers/plans/2026-11-23-new-map-worlds.md'),
  ...['README.md','ASSET_SOURCES.md','THIRD_PARTY_LICENSES.txt','启动春信.cmd'].map(file=>path.join(root,file))
 ].filter(file=>fs.existsSync(file)&&fs.statSync(file).isFile()).map(record);
 const sourceAll=[...sources,...tests,...scripts,...supporting].sort((a,b)=>a.file.localeCompare(b.file));
 return {sources,tests,scripts,supporting,sourceAll};
}
function sameInputs(before){assert.deepEqual(snapshotInputs(),before,'Source, tests, scripts or supporting files changed during candidate verification');}
function assetPath(out,entry){
 assert.equal(typeof entry,'string');assert.ok(!/^(?:[a-z]+:|\/)/i.test(entry),'Expected a relative built asset');
 const file=path.resolve(out,entry.split(/[?#]/)[0]);assert.ok(file.startsWith(out+path.sep),'Built asset escaped candidate directory');assert.ok(fs.statSync(file).isFile());return file;
}

function buildCandidate(label=process.argv[2]||'candidate-a'){
 assert.match(label,/^[a-z0-9][a-z0-9-]*$/,'Use a simple immutable label such as candidate-a');
 const out=path.resolve(root,'.qa-v13',label),evidence=path.join(root,'evidence/v13');
 assert.equal(path.dirname(out),path.resolve(root,'.qa-v13'));
 const manifest=path.join(evidence,'build-'+label+'.json'),testLog=path.join(evidence,'build-'+label+'.test.log'),buildLog=path.join(evidence,'build-'+label+'.vite.log');
 for(const file of [out,manifest,testLog,buildLog])assert.ok(!fs.existsSync(file),'An immutable candidate must use a fresh label: '+file);
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));assert.equal(pkg.version,'0.9.1','The v13 candidate must identify itself as version 0.9.1');
 const vite=path.join(path.dirname(require.resolve('vite/package.json',{paths:[root]})),'bin/vite.js');
 const inputs=snapshotInputs(),testFiles=inputs.tests.map(entry=>entry.file).filter(file=>/\.test\.[cm]?js$/.test(file));assert.ok(testFiles.length,'No actual Node tests were found');
 fs.mkdirSync(evidence,{recursive:true});
 const result={format:'spring-letter-candidate',manifestVersion:1,version:pkg.version,started:new Date().toISOString(),label,outDir:out,status:'testing',passed:false,node:process.version,platform:process.platform,arch:process.arch,...inputs};
 fs.writeFileSync(manifest,JSON.stringify(result,null,2),{flag:'wx'});
 const write=()=>fs.writeFileSync(manifest,JSON.stringify(result,null,2));
 function run(args,log){
  try{
   const text=execFileSync(process.execPath,args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],windowsHide:true,maxBuffer:32*1024*1024});
   fs.writeFileSync(log,text,{flag:'wx'});return text;
  }catch(error){
   fs.writeFileSync(log,String(error.stdout||'')+String(error.stderr||'')+'\n'+String(error.stack||error),{flag:'wx'});throw error;
  }
 }
 try{
  const testStarted=Date.now(),testArgs=['--test','--test-reporter=tap',...testFiles];
  console.log('Testing '+testFiles.length+' files for '+label);
  const testOutput=run(testArgs,testLog);sameInputs(inputs);
  const total=Number(testOutput.match(/^# tests (\d+)$/m)?.[1]),passed=Number(testOutput.match(/^# pass (\d+)$/m)?.[1]),failed=Number(testOutput.match(/^# fail (\d+)$/m)?.[1]);
  assert.ok(total>0&&passed===total&&failed===0,'A candidate requires every test to pass');
  for(const key of ['cancelled','skipped','todo'])assert.equal(Number(testOutput.match(new RegExp('^# '+key+' (\\d+)$','m'))?.[1]),0,'No '+key+' tests in a candidate');
  result.testRun={command:[process.execPath,...testArgs],files:testFiles.length,total,passed,failed,durationMs:Date.now()-testStarted,log:path.relative(root,testLog).replaceAll('\\','/'),logSha256:sha256(testLog)};
  result.status='building';write();
  console.log('Building isolated candidate '+out);
  const buildStarted=Date.now();run([vite,'build','--outDir',out],buildLog);sameInputs(inputs);
  const html=fs.readFileSync(path.join(out,'index.html'),'utf8'),entry=html.match(/\bsrc=["']([^"']+\.js(?:\?[^"']*)?)["']/)?.[1],style=html.match(/\bhref=["']([^"']+\.css(?:\?[^"']*)?)["']/)?.[1];
  assert.ok(entry&&style,'The built HTML must identify its JS and CSS');
  result.entry=entry;result.style=style;result.entrySha256=sha256(assetPath(out,entry));result.styleSha256=sha256(assetPath(out,style));result.htmlSha256=sha256(path.join(out,'index.html'));
  result.files=walk(out).map(file=>({file:path.relative(out,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,sha256:sha256(file)}));
  result.buildRun={durationMs:Date.now()-buildStarted,log:path.relative(root,buildLog).replaceAll('\\','/'),logSha256:sha256(buildLog)};
  result.sourceDigest=crypto.createHash('sha256').update(JSON.stringify(result.sourceAll)).digest('hex');
  result.status='built';result.passed=true;result.finished=new Date().toISOString();write();
  console.log(JSON.stringify({version:result.version,label,outDir:out,manifest,entry,entrySha256:result.entrySha256,style,tests:total,files:result.files.length}));
  return result;
 }catch(error){result.status='failed';result.failure=String(error.stack||error);result.finished=new Date().toISOString();write();throw error;}
}

module.exports={buildCandidate,snapshotInputs};
if(require.main===module){try{buildCandidate();}catch(error){console.error(error);process.exitCode=1;}}
