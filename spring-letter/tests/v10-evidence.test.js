import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import crypto from 'node:crypto';
import validation from '../scripts/validation-v10.cjs';
import pixels from '../scripts/v10-pixel-validation.cjs';

const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
function fixture(){
 const root=path.resolve('in-memory-v10-evidence'),files=new Map(),absolute=file=>path.resolve(root,file);
 const put=(file,value)=>files.set(absolute(file),typeof value==='string'?value:JSON.stringify(value));
 const text=file=>{assert.ok(files.has(absolute(file)),'Missing memory fixture '+file);return files.get(absolute(file));};
 const get=file=>JSON.parse(text(file)),entry='./assets/index-FIXTURE.js',assetHash=sha('bundle bytes');
 const proof={candidate:'fixture'},graphicsProof={candidate:'fixture',reports:{}};
 const sources=[{file:'src/fixture.js',sha256:sha('source bytes')}];
 put('.qa-v9/fixture/assets/index-FIXTURE.js','bundle bytes');put('src/fixture.js','source bytes');put('package.json',{version:'0.7.1'});
 put('evidence/v9/build-fixture.json',{label:'fixture',entry,style:'./assets/index-FIXTURE.css',outDir:absolute('.qa-v9/fixture'),sources,files:[{file:'assets/index-FIXTURE.js',sha256:assetHash}]});
 for(const name of ['play','visual','input','legacy','saves','static','keepsake','soak']){
  proof[name]='base/'+name+'.json';const record={passed:true,entry,entrySha256:assetHash,errors:[],checks:['synthetic ordinary-input observation']};
  if(['visual','input','static'].includes(name))record.pages=Array.from({length:name==='visual'?3:2},()=>({passed:true,entry,errors:[],checks:['synthetic page observation']}));
  if(name==='input')delete record.entry;
  if(name==='soak')Object.assign(record,{elapsedSeconds:500,cycles:6,samples:[{timing:{p95:20,max:80}}]});put(proof[name],record);
 }
 proof.onboarding='base/onboarding.json';put(proof.onboarding,{passed:true,entry:{src:entry,sha256:assetHash},pages:['desktop','portrait'].map(mode=>({mode,passed:true,frames:Array.from({length:6},(_,index)=>({index})),entries:[{src:entry,sha256:assetHash}]}))});
 proof.audio='base/capture.json';put(proof.audio,{passed:true,entry:{src:entry,sha256:assetHash},checks:[{passed:true}]});
 put('base/game-output.webm','captured bytes');proof.audioAnalysis='base/analysis.json';put(proof.audioAnalysis,{passed:true,checks:{sampleClippingAbsent:true},source:{entry:{sha256:assetHash},captureJsonSha256:sha(text(proof.audio)),file:absolute('base/game-output.webm'),sha256:sha('captured bytes')}});
 proof.units='base/units.txt';put(proof.units,'tests 459\npass 459\nfail 0\n');put('evidence/v10/release-evidence.json',proof);
 const rgba=Uint8Array.from(Array.from({length:1024},(_,i)=>[i%256,(i*13)%256,(i*7)%256,255]).flat());
 const image=bytes=>({canvas:true,width:1280,height:800,...pixels.summarizeRgba(bytes),glError:0,contextLost:false,loading:false,failure:false});
 const valid=image(rgba),invalid=image(new Uint8Array(4096));
 const soak=get(proof.soak);soak.samples[0].pixels=valid;soak.samples[0].pixelCheck={valid:true,reasons:[]};put(proof.soak,soak);
 const storeGraphics=(name,record)=>{graphicsProof.reports[name]='graphics/'+name+'.json';put(graphicsProof.reports[name],{passed:true,entry,...record});};
 for(const name of ['openingLight','openingBalanced','openingDelicate']){
  const frames=[];let number=1;for(let shot=0;shot<6;shot++)for(let n=0;n<3;n++)frames.push({...valid,mode:'opening',opening:shot,frame:number++});
  for(let n=0;n<5;n++)frames.push({...valid,mode:'play',opening:null,frame:number++});storeGraphics(name,{frames,console:[]});
 }
 storeGraphics('matrix',{observations:Array.from({length:100},(_,i)=>({...valid,label:'matrix-'+i}))});
 storeGraphics('context',{cases:['early','opening','dust','material'].map(phase=>({passed:true,phase,entry,errors:[]}))});
 storeGraphics('glTrace',{errors:[],logs:[]});
 storeGraphics('resize',{observations:Array.from({length:18},()=>({width:1280,height:800,pixels:valid,render:{blocked:false}})),redundantResizePreservesFrame:true});
 const shader={passed:true,sourceHashes:sources,reports:{}};
 for(const name of ['old','fixed','guard']){
  const file='diagnostics/'+name+'.json',firstInvalid=name==='fixed'?null:{object:'tide-blue-veil',invalidComponents:12};
  const report={probe:{status:'complete',checks:[{drawErrors:[],probeErrors:[]}],errors:[],firstInvalid,resolvedEnd:{invalidComponents:name==='fixed'?0:12,glErrors:[]}},pixels:name==='old'?invalid:valid,pixelCheck:{valid:name!=='old'},pageErrors:[],consoleMessages:[]};
  put(file,report);shader.reports[name]={file,sha256:sha(text(file))};
 }
 storeGraphics('shaderRegression',shader);put('evidence/v10/graphics-proof.json',graphicsProof);
 const mutate=(file,change)=>{const value=get(file);change(value);put(file,value);};
 const run=()=>validation.validateV10Evidence(root,{readText:text,hashFile:file=>sha(text(file))});
 return {root,files,put,get,text,proof,graphicsProof,entry,assetHash,mutate,run};
}

test('v10 validates complete synthetic evidence without changing files and binds nested shader hashes',()=>{
 const f=fixture(),before=[...f.files],r=f.run();assert.equal(r.version,'0.7.1');assert.equal(r.total,459);assert.deepEqual([...f.files],before);
 for(const kind of ['releaseProof','graphicsProof','shader:old','shader:fixed','shader:guard','graphics:matrix'])assert.ok(r.evidenceHashes.some(e=>e.kind===kind));
 assert.match(r.evidenceDigest,/^[a-f0-9]{64}$/);
});

test('a passed graphics report from another bundle cannot be promoted',()=>{
 for(const name of ['openingLight','openingBalanced','openingDelicate','matrix','glTrace','resize']){
  const f=fixture();f.mutate(f.graphicsProof.reports[name],r=>{r.entry='./assets/index-OLD.js';});assert.throws(f.run,/different build/);
 }
 const f=fixture();f.mutate(f.graphicsProof.reports.context,r=>{r.cases[1].entry='./assets/index-OLD.js';});assert.throws(f.run,/different build/);
});

test('passed true cannot hide transparent opening frames or an incomplete context phase',()=>{
 const f=fixture();f.mutate(f.graphicsProof.reports.openingBalanced,r=>{r.frames[0].opaque=0;});assert.throws(f.run,/invalid or incomplete canvas coverage/);
 const c=fixture();c.mutate(c.graphicsProof.reports.context,r=>{r.cases[0].passed=false;});assert.throws(c.run,/incomplete/);
});

test('every soak sample needs valid pixels even when its stored verdict and timing pass',()=>{
 for(const change of [sample=>{delete sample.pixels;},sample=>{sample.pixels.opaque=0;},sample=>{sample.pixels.sd=[0,0,0];}]){
  const f=fixture();f.mutate(f.proof.soak,r=>{const bad=structuredClone(r.samples[0]);change(bad);r.samples.push(bad);});
  assert.throws(f.run,/Soak sample 1 invalid canvas/);
 }
});

test('shader diagnostics must match every final source hash and actual nested bytes',()=>{
 const f=fixture();f.mutate(f.graphicsProof.reports.shaderRegression,r=>{r.sourceHashes[0].sha256='0'.repeat(64);});assert.throws(f.run,/source identity differs/);
 const n=fixture();n.mutate('diagnostics/fixed.json',r=>{r.note='changed after diagnosis';});assert.throws(n.run,/file changed/);
});

test('negative control and guarded pixels cannot be relabelled as a root fix',()=>{
 for(const [name,change]of [
  ['old',r=>{r.pixelCheck.valid=true;}],
  ['fixed',r=>{r.probe.firstInvalid={object:'tide-blue-veil',invalidComponents:12};}],
  ['guard',r=>{r.probe.resolvedEnd.invalidComponents=0;}],
 ]){
  const f=fixture(),file='diagnostics/'+name+'.json';f.mutate(file,change);
  f.mutate(f.graphicsProof.reports.shaderRegression,r=>{r.reports[name].sha256=sha(f.text(file));});assert.throws(f.run);
 }
});

test('digest changes when retained diagnostic evidence changes without violating its expected result',()=>{
 const f=fixture(),before=f.run().evidenceDigest;f.mutate('diagnostics/fixed.json',r=>{r.note='additional true diagnostic detail';});
 f.mutate(f.graphicsProof.reports.shaderRegression,r=>{r.reports.fixed.sha256=sha(f.text('diagnostics/fixed.json'));});assert.notEqual(f.run().evidenceDigest,before);
});

test('v10 rejects missing graphics coverage, source changes and an old package version',()=>{
 const f=fixture();f.mutate('evidence/v10/graphics-proof.json',r=>{delete r.reports.resize;});assert.throws(f.run,/all eight/);
 const p=fixture();p.put('package.json',{version:'0.7.0'});assert.throws(p.run);
 const s=fixture();s.put('src/fixture.js','changed source');assert.throws(s.run,/Source changed/);
});

function presentationFixture(){
 const f=fixture(),before='#field-action{bottom:100px}\n',append='@media(min-width:701px) and (min-height:620px){#field-action{bottom:190px}}\n';
 const baselineFile='evidence/v9/build-fixture-c.json',finalFile='evidence/v9/build-fixture.json',build=f.get(finalFile);
 const oldStyle='./assets/index-BASE.css',newStyle='./assets/index-NEW.css',oldHtml='<link href="'+oldStyle+'"><script src="'+f.entry+'"></script>';
 const oldSources=[...build.sources,{file:'src/resonance-ui.css',sha256:sha(before)}];
 const baseline={...build,label:'fixture-c',outDir:path.join(f.root,'.qa-v9/fixture-c'),style:oldStyle,sources:oldSources,files:[...build.files,{file:'assets/index-BASE.css',sha256:sha('compiled old CSS')},{file:'index.html',sha256:sha(oldHtml)}]};
 f.put('.qa-v9/fixture-c/assets/index-FIXTURE.js','bundle bytes');f.put('.qa-v9/fixture-c/assets/index-BASE.css','compiled old CSS');f.put('.qa-v9/fixture-c/index.html',oldHtml);f.put(baselineFile,baseline);
 f.put('src/resonance-ui.css',before+append);f.put('presentation/before.css',before);
 build.style=newStyle;build.sources=[...build.sources,{file:'src/resonance-ui.css',sha256:sha(before+append)}];
 build.files.push({file:'assets/index-NEW.css',sha256:sha('compiled new CSS')},{file:'index.html',sha256:sha(oldHtml.replace(oldStyle,newStyle))});
 f.put('.qa-v9/fixture/assets/index-NEW.css','compiled new CSS');f.put('.qa-v9/fixture/index.html',oldHtml.replace(oldStyle,newStyle));f.put(finalFile,build);
 f.mutate(f.graphicsProof.reports.shaderRegression,r=>{r.sourceHashes=oldSources;});
 const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
 const layouts={};f.put('presentation/archive.json','genuinely earned fixture bytes');
 for(const name of ['baselineLayout','finalLayout']){
  const old=name==='baselineLayout',style=old?oldStyle:newStyle,styleSha256=sha(old?'compiled old CSS':'compiled new CSS');
  const identity={entry:f.entry,entrySha256:f.assetHash,style,styleSha256};
  const pages=[{width:1440,height:900},{width:390,height:844},{width:844,height:390}].map((viewport,i)=>{
   const fieldRect=rect(20,20,200,70),dashRect=old&&i===0?rect(150,50,100,60):rect(250,200,100,60),titleRect=rect(30,30,150,10),hintRect=rect(30,50,150,10);
   const text=r=>({text:'Visible instruction',rect:r,lines:[r],display:'block',visibility:'visible',opacity:1});
   const screenshot=name+'-'+i+'.png';f.put('presentation/'+screenshot,'image bytes '+name+i);
   return {...identity,viewport,passed:!old||i!==0,errors:[],checks:['ordinary terminal input'],screenshots:[screenshot],metrics:{field:{visible:true,rect:fieldRect,scrollWidth:200,clientWidth:200,scrollHeight:70,clientHeight:70},dash:{visible:true,rect:dashRect},title:text(titleRect),hint:text(hintRect),render:{blocked:false}}};
  });
  const file='presentation/'+name+'.json';f.put(file,{...identity,passed:!old,errors:[],pages,fixture:{path:'presentation/archive.json',sha256:sha('genuinely earned fixture bytes')}});layouts[name]={file,sha256:sha(f.text(file))};
 }
 const reuseKinds=['play','input','onboarding','audio','audioAnalysis','saves',...Object.keys(f.graphicsProof.reports).map(k=>'graphics:'+k)];
 const patch={kind:'css-only-append',passed:true,baselineCandidate:'fixture-c',candidate:'fixture',baselineBuild:{file:baselineFile,sha256:sha(f.text(baselineFile))},source:{file:'src/resonance-ui.css',before:{file:'presentation/before.css',sha256:sha(before)},append},reports:layouts,reusedEvidence:reuseKinds.map(kind=>{const file=kind.startsWith('graphics:')?f.graphicsProof.reports[kind.slice(9)]:f.proof[kind];return {kind,file,sha256:sha(f.text(file))};})};
 const patchFile='presentation/patch.json';f.put(patchFile,patch);f.graphicsProof.presentationPatch=patchFile;f.put('evidence/v10/graphics-proof.json',f.graphicsProof);
 const mutateLayout=(name,change)=>{const file=layouts[name].file;f.mutate(file,change);f.mutate(patchFile,p=>{p.reports[name].sha256=sha(f.text(file));});};
 return {...f,patch,patchFile,baselineFile,finalFile,mutateLayout};
}

test('an explicit CSS-only patch preserves old source provenance and binds all new layout artifacts',()=>{
 const f=presentationFixture(),before=[...f.files],r=f.run();assert.equal(r.presentationBaseline.label,'fixture-c');assert.equal(r.presentationPatch.reusedEvidence.length,14);
 assert.deepEqual(r.graphics.shaderRegression.sourceHashes,r.presentationBaseline.sources);assert.notDeepEqual(r.build.sources,r.presentationBaseline.sources);
 assert.ok(r.evidenceHashes.some(e=>e.kind==='presentation:finalLayout:page0:image0'));
 assert.ok(r.evidenceHashes.some(e=>e.kind==='presentation:sourceBefore'));assert.deepEqual([...f.files],before);
});

test('CSS reuse rejects changed unrelated sources, a different append and missing reuse declarations',()=>{
 const f=presentationFixture();f.put('public/new-asset.txt','new unrelated asset');f.mutate(f.finalFile,b=>{b.sources.push({file:'public/new-asset.txt',sha256:sha('new unrelated asset')});});assert.throws(f.run,/changed other source/);
 const a=presentationFixture();a.mutate(a.patchFile,p=>{p.source.append=p.source.append.replace('190px','180px');});assert.throws(a.run,/exactly the baseline/);
 const m=presentationFixture();m.mutate(m.patchFile,p=>{p.reusedEvidence.pop();});assert.throws(m.run,/exactly the permitted/);
});

test('new layout evidence must identify new CSS and cannot pass with overlapping or clipped text',()=>{
 const old=presentationFixture();old.mutateLayout('finalLayout',r=>{r.style='./assets/index-BASE.css';});assert.throws(old.run,/stylesheet mismatch/);
 const overlap=presentationFixture();overlap.mutateLayout('finalLayout',r=>{r.pages[0].metrics.dash.rect={...r.pages[0].metrics.field.rect};});assert.throws(overlap.run,/controls overlap/);
 const clip=presentationFixture();clip.mutateLayout('finalLayout',r=>{r.pages[1].metrics.hint.lines[0].right=900;});assert.throws(clip.run,/line clipped/);
 const baseline=presentationFixture();baseline.mutateLayout('baselineLayout',r=>{r.passed=true;});assert.throws(baseline.run,/demonstrate the reported failure/);
});

function renamedPresentationFixture(){
 const f=presentationFixture(),newEntry='./assets/index-RENAMED.js',build=f.get(f.finalFile);
 const oldEntry=build.entry,oldFile=oldEntry.replace(/^\.\//,''),newFile=newEntry.replace(/^\.\//,'');
 build.entry=newEntry;build.files.find(file=>file.file===oldFile).file=newFile;
 f.put('.qa-v9/fixture/'+newFile,'bundle bytes');
 const htmlFile='.qa-v9/fixture/index.html',html=f.text(htmlFile).replace(oldEntry,newEntry);f.put(htmlFile,html);build.files.find(file=>file.file==='index.html').sha256=sha(html);f.put(f.finalFile,build);
 for(const name of ['visual','static','keepsake','legacy','soak'])f.mutate(f.proof[name],r=>{r.entry=newEntry;for(const page of r.pages||[])page.entry=newEntry;});
 f.mutateLayout('finalLayout',r=>{r.entry=newEntry;for(const page of r.pages)page.entry=newEntry;});
 return {...f,newEntry};
}

test('CSS may rename byte-identical JavaScript while every reused report keeps its baseline identity',()=>{
 const f=renamedPresentationFixture(),before=[...f.files],r=f.run();assert.equal(r.build.entry,f.newEntry);assert.equal(r.reports.play.entry,f.entry);assert.equal(r.reports.input.pages[0].entry,f.entry);
 assert.equal(r.audio.entry.src,f.entry);assert.equal(r.graphics.openingLight.entry,f.entry);assert.equal(r.reports.visual.entry,f.newEntry);
 assert.deepEqual([...f.files],before,'identity adaptation must not rewrite original evidence');
});

test('entry rename cannot conceal changed JavaScript or relabelled baseline reports',()=>{
 const changed=renamedPresentationFixture(),build=changed.get(changed.finalFile),file=build.entry.replace(/^\.\//,'');
 changed.put('.qa-v9/fixture/'+file,'different JavaScript');changed.mutate(changed.finalFile,r=>{r.files.find(f=>f.file===file).sha256=sha('different JavaScript');});assert.throws(changed.run,/changed JavaScript bytes/);
 const renamed=renamedPresentationFixture();renamed.mutate(renamed.proof.play,r=>{r.entry=renamed.newEntry;});renamed.mutate(renamed.patchFile,r=>{r.reusedEvidence.find(e=>e.kind==='play').sha256=sha(renamed.text(renamed.proof.play));});assert.throws(renamed.run,/must identify baseline JavaScript/);
});
