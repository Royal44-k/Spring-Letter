// Bind every actual HTTP response to the current verified release manifest.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),manifestPath=path.join(root,'evidence/release-manifest-v6.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const manifest=JSON.parse(fs.readFileSync(manifestPath)),url=process.env.SPRING_URL||'http://127.0.0.1:5192',files=[];
 for(const item of manifest.dist){
  const relative=item.file.replace(/^dist\//,'');assert.ok(relative!==item.file);
  const response=await fetch(url+'/'+relative.split('/').map(encodeURIComponent).join('/'));assert.equal(response.status,200,relative);
  const bytes=Buffer.from(await response.arrayBuffer());assert.equal(hash(bytes),item.sha256,relative);assert.equal(bytes.length,item.bytes,relative);
  files.push({file:relative,bytes:bytes.length,sha256:hash(bytes),contentType:response.headers.get('content-type')});
 }
 const result={date:new Date().toISOString(),passed:true,url,version:manifest.version,build:manifest.build,styleBuild:manifest.styleBuild,manifestSha256:hash(fs.readFileSync(manifestPath)),files,scope:'All actual localhost release HTTP responses match the exact current verified manifest. Independent from the candidate browser checks.'};
 fs.writeFileSync(path.join(root,'evidence/v6-served-files.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({passed:true,files:files.length,build:manifest.build}));
})().catch(e=>{console.error(e);process.exitCode=1;});
