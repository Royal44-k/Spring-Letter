const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'../dist');
const arg=process.argv.indexOf('--port');const port=Number(arg>=0?process.argv[arg+1]:5192);
if(!Number.isInteger(port)||port<1024||port>65535){console.error('Invalid local port.');process.exit(1);}
const url=`http://127.0.0.1:${port}`;
function openBrowser(){if(process.argv.includes('--open')&&process.platform==='win32')spawn('cmd.exe',['/d','/c','start','',url],{windowsHide:true,stdio:'ignore'}).on('error',()=>console.log('Open the address above in your browser.'));}
function existingGarden(){return new Promise(resolve=>{const expected=fs.readFileSync(path.join(root,'index.html'),'utf8');const request=http.get(url,response=>{let body='';response.setEncoding('utf8');response.on('data',part=>{if(body.length<100000)body+=part;});response.on('end',()=>resolve(response.statusCode===200&&body===expected));});request.setTimeout(1500,()=>request.destroy());request.on('error',()=>resolve(false));});}
if(!fs.existsSync(path.join(root,'index.html'))){console.error('Please run npm run build first.');process.exit(1);}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.hdr':'application/octet-stream','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webm':'video/webm','.wav':'audio/wav','.mp3':'audio/mpeg'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400).end();return;}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=3600':'no-cache','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);});
}).listen(port,'127.0.0.1',()=>{console.log(`Spring Letter: ${url}`);openBrowser();}).on('error',async e=>{if(e.code==='EADDRINUSE'){if(await existingGarden()){console.log(`Existing Spring Letter: ${url} (matching build; the existing service remains running)`);openBrowser();return;}console.error(`端口 ${port} 正由其他页面或不同版本使用。请关闭旧版服务窗口后重试，或使用 --port 指定另一端口。现有服务未被关闭。`);}else console.error(e.message);process.exitCode=1;});
