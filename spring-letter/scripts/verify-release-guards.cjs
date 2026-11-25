// CPU/local HTTP checks only. Never launches a browser or changes real reports.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const get=url=>new Promise((resolve,reject)=>{
 const request=http.get(url,response=>{let body='';response.setEncoding('utf8');response.on('data',part=>body+=part);response.on('end',()=>resolve({status:response.statusCode,body}));response.on('error',reject);});
 request.setTimeout(5000,()=>request.destroy(new Error('HTTP timeout')));request.on('error',reject);
});
const runServer=port=>new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[path.join(__dirname,'serve.cjs'),'--port',String(port)],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
 let stdout='',stderr='',timedOut=false;
 child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
 child.stdout.on('data',part=>stdout+=part);child.stderr.on('data',part=>stderr+=part);
 const timer=setTimeout(()=>{timedOut=true;child.kill();},7000);
 child.on('error',error=>{clearTimeout(timer);reject(error);});
 child.on('close',(code,signal)=>{clearTimeout(timer);if(timedOut)reject(new Error('serve.cjs failed to exit: '+stdout+stderr));else resolve({code,signal,stdout,stderr});});
});
(async()=>{
 const source=fs.readFileSync(path.join(__dirname,'release-v5.cjs'),'utf8');
 const reportBuild=source.slice(source.indexOf('const reportBuild ='),source.indexOf('const html ='));
 const guard=source.slice(source.indexOf("for (const key of ['main', 'branches', 'boundary'"),source.indexOf('assert.ok(reports.soak.passed'));
 assert.ok(reportBuild.includes('reportBuild')&&guard.includes('mixed-build run'),'actual release guard could not be located');
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),build=html.match(/src="([^"]+\.js)"/)?.[1];assert.ok(build);
 const names=['main','branches','boundary','visual','recording','fullscreen','finalRevisit','mobileUI'];
 const fixture=()=>Object.fromEntries(names.map(name=>[name,{build}]));
 const homogeneous=fixture();homogeneous.branches.build={entry:build,finalEntry:build};
 vm.runInNewContext(reportBuild+guard,{reports:homogeneous,build,assert});
 const mixed=fixture();mixed.branches.build={entry:'/assets/index-OLD.js',finalEntry:build};
 let mixedError;try{vm.runInNewContext(reportBuild+guard,{reports:mixed,build,assert});}catch(error){mixedError=error;}
 assert.match(mixedError?.message||'',/branches\.entry is a mixed-build run/);
 const fakeHtml='<title>花漾年华：旧版</title><button id="begin"></button><script type="module" src="/assets/index-OLD.js"></script>';
 const fake=http.createServer((req,res)=>res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(fakeHtml));
 let oldService;
 await new Promise((resolve,reject)=>{fake.once('error',reject);fake.listen(0,'127.0.0.1',resolve);});
 try{
  const port=fake.address().port,url='http://127.0.0.1:'+port;
  const result=await runServer(port);assert.equal(result.code,1);assert.match(result.stderr,/不同版本使用/);
  const after=await get(url);assert.equal(after.status,200);assert.equal(after.body,fakeHtml);
  oldService={port,...result,originalServerStillAlive:true,originalResponseUnchanged:true};
 }finally{await new Promise(resolve=>fake.close(resolve));}
 const existingBefore=await get('http://127.0.0.1:5192');assert.equal(existingBefore.status,200);assert.equal(existingBefore.body,html,'5192 is not the local release HTML');
 const sameService=await runServer(5192);assert.equal(sameService.code,0);assert.match(sameService.stdout,/matching build/);
 const existingAfter=await get('http://127.0.0.1:5192');assert.equal(existingAfter.status,200);assert.equal(existingAfter.body,existingBefore.body);
 const report={date:new Date().toISOString(),build,passed:true,checks:[
  'actual release guard accepts homogeneous initial/final build entries',
  'actual release guard rejects an old initial branch build despite a final release entry',
  'launcher rejects a same-title old game on an occupied ephemeral port',
  'rejected launch leaves the existing old service and its response intact',
  'launcher reuses the identical release on 5192 with exit code zero',
  'matching existing service remains alive with unchanged response',
 ],mixedBuildRejection:mixedError.message,oldService,sameService:{...sameService,originalServerStillAlive:true,originalResponseUnchanged:true},sourceSha256:Object.fromEntries(['scripts/release-v5.cjs','scripts/serve.cjs','scripts/verify-release-guards.cjs','dist/index.html'].map(file=>[file,hash(path.join(root,file))])),scope:'CPU VM of the actual release guard and local HTTP child processes with --open omitted. Synthetic mixed-build reports exist only in memory. Only the temporary HTTP fixture owned by this check is closed. No real gameplay evidence is edited; no browser, GPU or build is started.'};
 fs.writeFileSync(path.join(root,'evidence/v5-release-guards.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
