/** Exercise only the production pure guards in a VM. No release code or writes. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'release-v11.cjs'),'utf8'),start=source.indexOf('// Pure release guards'),end=source.indexOf('// End pure release guards.');
assert.ok(start>=0&&end>start);const c={assert};vm.createContext(c);vm.runInContext(source.slice(start,end),c);
const entry='./assets/index-verified.js',entryHash='a'.repeat(64),build={label:'candidate-f',entry,sources:[{file:'src/main.js',sha256:entryHash}],files:[{file:'assets/index-verified.js',sha256:entryHash},{file:'index.html',sha256:entryHash}]};
const caseBase=()=>({entry,passed:true,errors:[]}),base=()=>({entry,entrySha256:entryHash,passed:true,errors:[]}),complete={stage:'complete',predecessor:true,oldRead:true,letter:{sealed:true,recipient:'远方',body:'春信'},distance:150,ropes:[true,true],sail:1};
const reports={full:{...base(),checks:Array(12).fill('verified action'),final:{state:{voyage:complete,ending:'memory+season'}}},legacyCoast:{...base(),checks:['continued'],final:{state:{voyage:complete,ending:'memory+season'}}}};
reports.layout={...base(),cases:['desktop','portrait-touch','landscape-touch'].flatMap(view=>['writing','rigging','sailing','complete'].map(stage=>({...caseBase(),name:view+'-'+stage,entrySha256:entryHash,checks:['real input'],samples:[{pixelCheck:{valid:true}}],consoleReview:{blocking:[]}})))};
reports.audio={passed:true,errors:[],cases:['writing','sailing','complete'].map(stage=>({...caseBase(),stage,audio:{loaded:true,loadErrors:[]},samples:[{peak:.2,rms:.1}],muted:[{peak:0,rms:0}],resumed:[{peak:.2,rms:.1}]}))};
reports.context={passed:true,cases:['early','opening','dust','material'].map(phase=>({...caseBase(),phase,lost:{render:{blocked:true}},restored:{render:{lifecycle:{needsReload:true}}},reopened:{render:{blocked:false}},stateAfterReload:{glError:0}}))};
reports.seaContext={passed:true,cases:['writing','rigging','sailing'].map(stage=>({...caseBase(),stage,before:{stage},after:{stage},pixelCheck:{valid:true}}))};
for(const quality of ['light','balanced','delicate'])reports['opening'+quality[0].toUpperCase()+quality.slice(1)]={...base(),actualQuality:quality,frames:Array.from({length:23},()=>({pixelCheck:{valid:true}})),pixelValidation:{valid:true,invalid:[],coverage:[0,1,2,3,4,5].map(shot=>({shot,distinctFrames:3})),firstPlay:{distinctFrames:5}},consoleValidation:{blocking:[]}};
reports.render={...base(),observations:Array.from({length:100},()=>({pixelCheck:{valid:true}})),pageErrors:[],invalidObservations:[],failedRequests:[],consoleValidation:{blocking:[]}};
reports.resize={...base(),observations:Array.from({length:18},()=>({width:1280,height:800,picture:{valid:true}})),redundantResizePreservesFrame:true,consoleValidation:{blocking:[]}};
const proof={version:'0.8.0',candidate:'candidate-f',entry,units:'evidence/v11/units-candidate-f.log',reports:Object.fromEntries(Object.keys(reports).map(name=>[name,'evidence/v11/'+name+'/report.json']))};
const log='ℹ tests 548\nℹ pass 548\nℹ fail 0\n';let positives=0,negatives=0;
function pass(fn){fn();positives++;}
function reject(name,fn){assert.throws(fn,undefined,name+' must fail closed');negatives++;}
function malformed(name,mutate,label){const r=structuredClone(reports[name]);mutate(r);reject(name+': '+label,()=>c.validateReport(name,r,build,entryHash));}
pass(()=>c.validateProof(proof));pass(()=>assert.equal(c.validateBuildIdentity(proof,build),entryHash));pass(()=>assert.equal(c.validateUnitLog(log),548));
for(const [name,report]of Object.entries(reports)){
 pass(()=>c.validateReport(name,report,build,entryHash));
 malformed(name,r=>delete r.passed,'missing pass result');
 malformed(name,r=>{r.passed=false;},'failed report');
 if(report.cases){
  malformed(name,r=>delete r.cases,'missing cases');
  malformed(name,r=>delete r.cases[0].entry,'missing case entry');
  malformed(name,r=>delete r.cases[0].passed,'missing case pass');
  malformed(name,r=>{r.cases[0].entry='./assets/stale.js';},'stale case entry');
  if(name!=='audio')malformed(name,r=>delete r.cases[0].errors,'missing case errors');
 }
 if(!['audio','context','seaContext'].includes(name)){
  malformed(name,r=>delete r.entry,'missing top entry');
  malformed(name,r=>{r.entry='./assets/stale.js';},'stale top entry');
 }
 if(!['context','seaContext','render'].includes(name))malformed(name,r=>delete r.errors,'missing errors');
 if(['layout','render','openingLight','openingBalanced','openingDelicate'].includes(name)){
  malformed(name,r=>delete r.entrySha256,'missing tested byte hash');
  malformed(name,r=>{r.entrySha256='b'.repeat(64);},'tested byte mismatch');
 }
}
for(const name of ['openingLight','openingBalanced','openingDelicate']){
 malformed(name,r=>delete r.actualQuality,'missing quality');
 malformed(name,r=>{r.actualQuality='other';},'wrong quality');
 malformed(name,r=>delete r.frames,'missing frames');
 malformed(name,r=>delete r.pixelValidation.coverage,'missing shot coverage');
}
malformed('layout',r=>{r.cases[1].name=r.cases[0].name;},'duplicate layout replacing required view');
malformed('audio',r=>delete r.cases[0].audio.loadErrors,'missing audio loading result');
malformed('audio',r=>delete r.cases[0].muted,'missing mute observation');
malformed('render',r=>delete r.pageErrors,'missing browser errors');
malformed('render',r=>{r.observations=[];},'empty render observations');
malformed('resize',r=>delete r.redundantResizePreservesFrame,'missing resize assertion');
malformed('full',r=>{r.final.state.voyage.stage='sailing';},'unfinished voyage');
malformed('legacyCoast',r=>delete r.final.state.voyage.letter,'missing personal letter');
for(const [label,mutate]of [['unsafe candidate',p=>p.candidate='../old'],['stale units',p=>p.units='evidence/v11/units-candidate-a.log'],['missing entry',p=>delete p.entry],['wrong version',p=>p.version='0.7.1'],['missing report',p=>delete p.reports.layout]]){const p=structuredClone(proof);mutate(p);reject(label,()=>c.validateProof(p));}
reject('proof entry differs',()=>c.validateBuildIdentity({...proof,entry:'./assets/stale.js'},build));
reject('build label differs',()=>c.validateBuildIdentity(proof,{...build,label:'candidate-a'}));
reject('entry omitted from manifest',()=>c.validateBuildIdentity(proof,{...build,files:[build.files[1]]}));
reject('missing fail count',()=>c.validateUnitLog(log.replace('ℹ fail 0\n','')));
reject('nonzero failures',()=>c.validateUnitLog(log.replace('fail 0','fail 1')));
reject('old smaller suite',()=>c.validateUnitLog(log.replaceAll('548','534')));
reject('concatenated old logs',()=>c.validateUnitLog(log+log));
console.log(JSON.stringify({passed:true,positiveChecks:positives,negativeChecks:negatives,filesystemWrites:0,promotionExecuted:false}));
