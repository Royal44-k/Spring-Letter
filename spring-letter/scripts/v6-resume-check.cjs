const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence/v6-build-candidate-g.json')));
const mismatches=manifest.sources.filter(item=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,item.path))).digest('hex')!==item.sha256);
console.log(JSON.stringify({candidate:manifest.entry,sourceMismatches:mismatches.map(x=>x.path)}));
if(mismatches.length)process.exitCode=1;
Promise.all([5192,5194].map(async port=>{
 try{const r=await fetch('http://127.0.0.1:'+port,{signal:AbortSignal.timeout(2000)}),html=await r.text();console.log(JSON.stringify({port,status:r.status,entry:html.match(/src="([^" ]+\.js)"/)?.[1]}));}
 catch(error){console.log(JSON.stringify({port,error:error.message}));}
}));
