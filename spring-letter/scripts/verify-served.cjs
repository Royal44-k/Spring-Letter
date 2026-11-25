// Compare the running local release with the built bytes, including every asset.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
(async()=>{
 const url=process.env.SPRING_URL||'http://127.0.0.1:5192',files=[];
 for(const file of walk(dist).sort()){
  const relative=path.relative(dist,file).replaceAll('\\','/');
  const response=await fetch(url+'/'+relative.split('/').map(encodeURIComponent).join('/'));
  assert.equal(response.status,200,relative);
  const actual=Buffer.from(await response.arrayBuffer()),expected=fs.readFileSync(file);
  assert.equal(actual.equals(expected),true,'served bytes differ: '+relative);
  files.push({file:relative,bytes:actual.length,sha256:sha(actual),contentType:response.headers.get('content-type')});
 }
 const result={date:new Date().toISOString(),url,passed:true,files,scope:'Actual HTTP responses are byte-identical to every local dist file. This does not replace UI interaction checks.'};
 fs.writeFileSync(path.join(root,'evidence/v5-served-files.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({passed:true,files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0)}));
})().catch(error=>{console.error(error);process.exitCode=1;});
