const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),label=process.argv[2];
if(!label||!/^[a-z0-9-]+$/.test(label))throw Error('Supply a unique lowercase candidate label.');
const parent=path.join(root,'.qa-v6'),outDir=path.resolve(parent,label);
if(!outDir.startsWith(parent+path.sep)||fs.existsSync(outDir))throw Error('Candidate path must be new and inside .qa-v6.');
function files(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(folder,e.name)):[path.join(folder,e.name)]);}
function digest(file){return createHash('sha256').update(fs.readFileSync(file)).digest('hex');}
function sources(){return [...files(path.join(root,'src')),...files(path.join(root,'public')),path.join(root,'index.html'),path.join(root,'package.json'),path.join(root,'package-lock.json')].sort().map(file=>({path:path.relative(root,file).replaceAll('\\','/'),sha256:digest(file)}));}
(async()=>{
 const before=sources();
 const {build}=await import(pathToFileURL(path.resolve(root,'../node_modules/vite/dist/node/index.js')).href);
 await build({root,build:{outDir,emptyOutDir:false}});
 const after=sources();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Source changed during candidate build; do not test this candidate.');
 const html=fs.readFileSync(path.join(outDir,'index.html'),'utf8'),entry=html.match(/src="([^" ]+\.js)"/)?.[1];
 if(!entry)throw Error('No bundled entry found');
 const report={date:new Date().toISOString(),label,root,outDir,entry,sources:after,dist:files(outDir).map(file=>({path:path.relative(outDir,file).replaceAll('\\','/'),bytes:fs.statSync(file).size,sha256:digest(file)}))};
 fs.writeFileSync(path.join(root,'evidence',`v6-build-${label}.json`),JSON.stringify(report,null,2));
 console.log(JSON.stringify({label,entry,files:report.dist.length,sourceFiles:after.length,outDir}));
})().catch(error=>{console.error(error);process.exitCode=1;});
