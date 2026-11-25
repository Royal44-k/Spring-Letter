/** Pure malformed-proof checks. No browser, build, release, package or writes. */
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const g=require('./release-v12.cjs');
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'),h='a'.repeat(64),entry='./assets/index-verified.js';
const row=file=>({file,bytes:1,sha256:h});
const build={format:'spring-letter-candidate',manifestVersion:1,version:'0.9.0',label:'candidate-final',status:'built',passed:true,entry,entrySha256:h,style:'./assets/index-verified.css',styleSha256:h,htmlSha256:h,sources:[row('src/main.js')],tests:[row('tests/example.test.js')],scripts:[row('scripts/build-v12.cjs')],files:[row('index.html'),row('assets/index-verified.js'),row('assets/index-verified.css')],testRun:{command:['node','--test'],files:1,total:1,passed:1,failed:0,log:'evidence/v12/build-candidate-final.test.log',logSha256:h}};
build.sourceAll=[...build.sources,...build.tests,...build.scripts];build.sourceDigest=digest(build.sourceAll);
const proof={version:'0.9.0',candidate:build.label,entry,entrySha256:h,style:build.style,styleSha256:h,reports:Object.fromEntries(['full','layout','audio','stress'].map(n=>[n,'evidence/v12/'+n+'/report.json']))};
const pix={pixels:{canvas:true,width:1440,height:900,samplePixels:6144,mean:[100,120,140],sd:[30,25,20],opaque:1,allZero:0,dominantFraction:.2,magenta:0,contextLost:false,glError:0,failure:false,loading:false},pixelCheck:{valid:true,reasons:[]}};
const base=()=>({passed:true,entry,entrySha256:h,style:build.style,styleSha256:h,errors:[]}),places=['conservatory','observatory','meadow'];
const final={state:{ending:'memory+season',voyage:{stage:'complete',predecessor:true,oldRead:true,letter:{sealed:true,recipient:'远方',body:'春信'},distance:150,ropes:[true,true],sail:1},atlas:{completed:places,blooms:[1,1,1],stars:[0,1,2,3,4,0,5,2],meadowCheckpoint:4}}};
const sample=(time,silent=false)=>({time,rms:silent?0:.1,peak:silent?0:.2,mean:0,nonfinite:0,clipped:0,state:'running'});
const reports={
 full:{...base(),version:'0.9.0',primaryActions:12,coreChecks:Object.fromEntries(['rain','wind','tide','bridges','cores',...places,'writing','tidalLetter','rigging','sailing'].map(n=>[n,true])),checks:Array(12).fill('earned action'),final,samples:Array.from({length:9},(_,i)=>({...pix,location:places[i%3]}))},
 layout:{...base(),cases:['desktop','portrait-touch','landscape-touch'].flatMap(v=>places.map(p=>({...base(),name:v+'-'+p,reloadEntrySha256:h,reloadStyle:build.style,reloadStyleSha256:h,checks:Array(5).fill('native input'),samples:Array(4).fill(pix),consoleReview:{blocking:[]},video:'videos/view.webm',storage:{file:'earned-storage.json',sha256:h},screenshots:['entry.jpg','input.jpg','map.jpg','resume.jpg'],...(p==='observatory'?{projectedStars:[0,1,2,3,4,5].map(id=>({id,x:150,y:200,inViewport:true,hitTag:'CANVAS'}))}:{})})))},
 audio:{...base(),cases:places.map(location=>({...base(),location,initial:{loaded:true,loadErrors:[],scene:{atlas:location}},recording:{contexts:1},phases:['default-mix','music-only','muted','restored-music'].map(name=>({name,seconds:22,assessment:{valid:true},samples:[0,.25,.5].map(t=>sample(t,name==='muted')),audio:{scene:{atlas:location},mix:{music:.6,sfx:0,ambience:0}}})),pixels:Array(4).fill(pix),final:{muted:false,paused:false,persistentSources:3,loadErrors:[]},consoleReview:{blocking:[]},audioFile:{file:'native.webm',bytes:4000,sha256:h}}))},
 stress:{...base(),cases:places.flatMap(location=>['light','balanced','delicate'].map(quality=>({...base(),location,quality,...pix,resourcesBefore:{geometries:10,textures:2,programs:3},resourcesAfter:{geometries:10,textures:2,programs:3},worldBefore:{objects:90},worldAfter:{objects:90},...(quality==='balanced'?{contextRecovery:true,recoveredPixels:pix,recoveredIdentity:base()}:{})}))),cycles:[0,1,2].map(cycle=>({cycle,memory:{geometries:10,textures:2,programs:3},objects:90})),returnToGarden:pix}
};
reports.render={...base(),observations:Array.from({length:100},()=>({...pix.pixels,pixelCheck:pix.pixelCheck,...base()})),pageErrors:[],invalidObservations:[],failedRequests:[],consoleValidation:{blocking:[]}};
reports.context={...base(),cases:['early','opening','dust','material'].map(phase=>({...base(),phase,lost:{render:{blocked:true}},restored:{render:{lifecycle:{needsReload:true}}},reopened:{render:{blocked:false}},stateAfterReload:{glError:0},reloadedStyle:{style:build.style,styleSha256:h}}))};
const log='# tests 1\n# pass 1\n# fail 0\n# cancelled 0\n# skipped 0\n# todo 0\n';let positive=0,negative=0;
const pass=fn=>{fn();positive++;},reject=(label,fn)=>{assert.throws(fn,undefined,label+' must fail closed');negative++;};
const malformed=(name,change,label)=>{const r=structuredClone(reports[name]);change(r);reject(name+': '+label,()=>g.validateReport(name,r,build));};
pass(()=>g.validateProof(proof));pass(()=>g.validateBuild(proof,build));pass(()=>g.validateCpu(log,build.testRun));
for(const [name,r]of Object.entries(reports)){
 pass(()=>g.validateReport(name,r,build));
 for(const [key,value]of [['passed',false],['entry','./assets/stale.js'],['entrySha256','b'.repeat(64)],['style','./assets/stale.css'],['styleSha256','b'.repeat(64)],['error','retained failure']])malformed(name,r=>{r[key]=value;},key);
 for(const key of ['passed','entry','entrySha256','style','styleSha256'])malformed(name,r=>delete r[key],'missing '+key);
 if(r.cases){
  malformed(name,r=>r.cases.pop(),'missing case');
  malformed(name,r=>{r.cases[1]=structuredClone(r.cases[0]);},'duplicate replaces coverage');
  for(const key of ['passed','entry','entrySha256','style','styleSha256','errors'])malformed(name,r=>delete r.cases[0][key],'missing case '+key);
  malformed(name,r=>{r.cases[0].entrySha256='b'.repeat(64);},'stale case bytes');
  malformed(name,r=>{r.cases[0].style='./assets/stale.css';},'same JS with stale case CSS path');
  malformed(name,r=>{r.cases[0].styleSha256='b'.repeat(64);},'same JS/path with changed case CSS bytes');
 }
}
malformed('full',r=>{r.coreChecks.meadow=false;},'unearned action');
malformed('full',r=>{r.final.state.atlas.completed.pop();},'missing completed map');
malformed('full',r=>{r.final.state.atlas.stars=[];},'unfinished constellation');
malformed('full',r=>{r.final.state.voyage.letter.body='';},'empty own letter');
malformed('full',r=>{r.samples[0].pixels.opaque=0;},'raw pixels contradict pass');
malformed('layout',r=>{r.cases[0].reloadEntrySha256='b'.repeat(64);},'reload switched build');
malformed('layout',r=>delete r.cases[0].video,'missing actual video');
pass(()=>{const r=structuredClone(reports.layout);for(const c of r.cases){delete c.video;c.videoCapture={enabled:false,status:'unavailable',reason:'Screenshots only; QA_VIDEO is not enabled'};}g.validateReport('layout',r,build);});
malformed('layout',r=>{delete r.cases[0].video;r.cases[0].videoCapture={enabled:true,status:'unavailable',reason:'Failed capture'};},'requested video failed');
malformed('layout',r=>{delete r.cases[0].video;r.cases[0].videoCapture={enabled:false,status:'unavailable',reason:''};},'undisclosed video limitation');
malformed('layout',r=>{r.cases[0].storage.file='../other.json';},'escaped archive');
malformed('layout',r=>{r.cases[0].reloadStyleSha256='b'.repeat(64);},'reload CSS changed with same JS');
malformed('stress',r=>{r.cases[1].recoveredIdentity.styleSha256='b'.repeat(64);},'recovered map has old CSS');
malformed('render',r=>{r.observations[0].styleSha256='b'.repeat(64);},'render observation has old CSS');
malformed('context',r=>{r.cases[0].reloadedStyle.styleSha256='b'.repeat(64);},'context reload has old CSS');
malformed('layout',r=>{r.cases[1].projectedStars[0].hitTag='BUTTON';},'UI obscured world star');
malformed('layout',r=>{r.cases[1].projectedStars[0].inViewport=false;},'world star outside viewport');
malformed('audio',r=>{r.cases[0].phases[2].samples[0].peak=.2;},'muted output audible');
malformed('audio',r=>{r.cases[0].phases[1].audio.mix.ambience=.5;},'ambience masks missing music');
malformed('audio',r=>{r.cases[0].phases[1].seconds=1;},'short sample misses written rests');
malformed('audio',r=>{r.cases[0].phases[0].samples=Array(3).fill(sample(0));},'stalled native clock');
malformed('stress',r=>{r.cases[1].contextRecovery=false;},'missing recovery');
malformed('stress',r=>{r.cycles[2].memory.textures++;},'persistent resource growth');
malformed('stress',r=>{r.returnToGarden.pixels.glError=1280;},'broken return render');
for(const [label,change]of [['version',p=>p.version='0.8.0'],['path traversal',p=>p.candidate='../old'],['missing report',p=>delete p.reports.audio],['escaped report',p=>p.reports.full='../full.json'],['missing hash',p=>delete p.entrySha256],['missing CSS',p=>delete p.style],['missing CSS hash',p=>delete p.styleSha256]]){const p=structuredClone(proof);change(p);reject(label,()=>g.validateProof(p));}
for(const [label,change]of [['failed build',b=>b.passed=false],['wrong label',b=>b.label='candidate-old'],['missing source',b=>b.sourceAll=[]],['wrong input digest',b=>b.sourceDigest='b'.repeat(64)],['entry absent',b=>b.files=b.files.filter(f=>!f.file.endsWith('.js'))],['case collision',b=>b.files.push({...b.files[0],file:'INDEX.HTML'})],['CPU log other build',b=>b.testRun.log='evidence/v12/build-old.test.log'],['CPU count mismatch',b=>b.testRun.passed=0]]){const b=structuredClone(build);change(b);reject(label,()=>g.validateBuild(proof,b));}
for(const key of ['fail','cancelled','skipped','todo'])reject('CPU '+key,()=>g.validateCpu(log.replace('# '+key+' 0','# '+key+' 1'),build.testRun));
reject('concatenated logs',()=>g.validateCpu(log+log,build.testRun));reject('missing summary',()=>g.validateCpu(log.replace('# skipped 0\n',''),build.testRun));reject('stale total',()=>g.validateCpu(log.replace('# tests 1','# tests 2'),build.testRun));
// CLI mistakes must fail before verification, copying or promotion is invoked.
pass(()=>assert.equal(g.parseArgs([]),'promote'));
pass(()=>assert.equal(g.parseArgs(['--verify-only']),'verify'));
for(const args of [['--help'],['--verifyonly'],['--verify-only','--help'],['--verify-only','--verify-only'],['candidate-final']]){
 reject('unknown/ambiguous CLI '+args.join(' '),()=>g.parseArgs(args));
 let touched=false;reject('CLI rejected before any work',()=>g.main(args,{verify(){touched=true;},promote(){touched=true;}},()=>{}));assert.equal(touched,false);
}
const html=Buffer.from('<!doctype html><script type="module" crossorigin src="'+entry+'"></script>');
const htmlBuild={...build,htmlSha256:crypto.createHash('sha256').update(html).digest('hex')};
pass(()=>g.validateStagedHtml(html,htmlBuild));
reject('staged HTML changed after verify',()=>g.validateStagedHtml(Buffer.concat([html,Buffer.from('changed')]),htmlBuild));
for(const content of ['<script type="module" src="./assets/other.js"></script>','<script src="'+entry+'"></script>','<script type="module" src="'+entry+'"></script><script type="module" src="'+entry+'"></script>']){
 const bytes=Buffer.from(content);reject('wrong/missing/duplicate parsed entry',()=>g.validateStagedHtml(bytes,{...htmlBuild,htmlSha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
}
const runtimeFiles=['scripts/serve.cjs','启动春信.cmd','THIRD_PARTY_LICENSES.txt','ASSET_SOURCES.md','README.md','FINAL_QA.md'].map(file=>({file,bytes:html.length,sha256:htmlBuild.htmlSha256}));
let renamed=false;
const ioFor=readFileSync=>({readFileSync,renameSync(){renamed=true;}});
pass(()=>{renamed=false;g.installStagedEntry('stage','entry',htmlBuild,runtimeFiles,ioFor(()=>html));assert.equal(renamed,true);});
for(const [label,read]of [
 ['changed staged bytes',file=>file==='stage'?Buffer.from('changed'):html],
 ['runtime changed after verify',file=>String(file).endsWith('启动春信.cmd')?Buffer.from('changed'):html],
 ['runtime missing after verify',file=>{if(String(file).endsWith('启动春信.cmd'))throw Error('ENOENT');return html;}],
 ['QA changed after verify',file=>String(file).endsWith('FINAL_QA.md')?Buffer.from('changed'):html]
]){renamed=false;reject(label,()=>g.installStagedEntry('stage','entry',htmlBuild,runtimeFiles,ioFor(read)));assert.equal(renamed,false,label+' must not replace the entry');}
reject('missing launcher inventory',()=>g.validateRuntimeFiles(runtimeFiles.filter(f=>f.file!=='启动春信.cmd'),ioFor(()=>html)));
console.log(JSON.stringify({passed:true,positiveChecks:positive,negativeChecks:negative,filesystemWrites:0,browserLaunched:false,promotionExecuted:false}));
