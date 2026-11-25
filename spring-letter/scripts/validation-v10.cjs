/** Read-only 0.7.1 gates. No builds, browser launches, report rewrites or promotion.
 * validateV10Evidence(root, {candidate?, proofFile?, graphicsProofFile?,
 *   proof?, graphicsProof?, readText?, readJson?, hashFile?})
 * Defaults: evidence/v10/release-evidence.json (same keys as V9 proof) and
 * evidence/v10/graphics-proof.json:
 * {candidate, reports:{openingLight, openingBalanced, openingDelicate, matrix,
 *   context, glTrace, resize, shaderRegression}} — values are report paths.
 * shaderRegression: {passed:true, sourceHashes:[{file,sha256}],
 *   reports:{old:{file,sha256},fixed:{file,sha256},guard:{file,sha256}}}.
 * sourceHashes describe complete final build.sources, or the explicitly proved
 * CSS-only baseline sources when graphicsProof.presentationPatch is present.
 * presentationPatch names a JSON record: {kind:'css-only-append',passed:true,
 *   candidate,baselineCandidate,baselineBuild:{file,sha256},
 *   source:{file:'src/resonance-ui.css',before:{file,sha256},append},
 *   reusedEvidence:[{kind,file,sha256}],
 *   reports:{baselineLayout:{file,sha256},finalLayout:{file,sha256}}}.
 * Reused reports keep their original bytes and source provenance. Final visual,
 * static, keepsake, legacy, soak, layout and units are not in the reuse exception.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {validateV9Evidence}=require('./validation-v9.cjs');
const {assessPixels,assessOpening,classifyConsole}=require('./v10-pixel-validation.cjs');
const GRAPHICS=['openingLight','openingBalanced','openingDelicate','matrix','context','glTrace','resize','shaderRegression'];
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');

function validateV10Evidence(root,options={}){
 root=path.resolve(root);
 const readText=options.readText||((file)=>fs.readFileSync(path.resolve(root,file),'utf8'));
 const readJson=options.readJson||((file)=>JSON.parse(readText(file)));
 const hashFile=options.hashFile||((file)=>digest(fs.readFileSync(path.resolve(root,file))));
 const proofFile=options.proofFile||'evidence/v10/release-evidence.json';
 const graphicsProofFile=options.graphicsProofFile||'evidence/v10/graphics-proof.json';
 const proof=options.proof||readJson(proofFile),graphicsProof=options.graphicsProof||readJson(graphicsProofFile);
 const reusedBaseKinds=['play','input','onboarding','audio','audioAnalysis','saves'];
 const originalReused=new Map();let baseReadJson=readJson;
 if(graphicsProof.presentationPatch){
  const patch=readJson(graphicsProof.presentationPatch);assert.match(patch.baselineCandidate||'',/^[a-z0-9-]+$/);
  assert.equal(patch.baselineBuild?.file,'evidence/v9/build-'+patch.baselineCandidate+'.json');
  assert.equal(hashFile(path.resolve(root,patch.baselineBuild.file)),patch.baselineBuild.sha256,'Baseline build changed');
  const oldBuild=readJson(patch.baselineBuild.file),newBuild=readJson('evidence/v9/build-'+proof.candidate+'.json');
  const js=record=>record.files.find(f=>f.file===record.entry.replace(/^\.\//,''));
  assert.ok(js(oldBuild)&&js(newBuild),'Entry assets missing');
  assert.equal(js(oldBuild).sha256,js(newBuild).sha256,'Presentation exception changed JavaScript bytes');
  for(const b of [oldBuild,newBuild])assert.equal(hashFile(path.join(b.outDir,js(b).file)),js(b).sha256,'JavaScript bytes changed after build');
  const paths=new Map(reusedBaseKinds.map(kind=>[path.resolve(root,proof[kind]),kind]));
  // V9's single-entry checker receives an ephemeral identity view only after
  // validating the original baseline identity and byte-identical JavaScript.
  // Hashes always read original files; originals are restored in the returned
  // result, so no report is rewritten or presented as having run on new CSS.
  baseReadJson=file=>{
   const report=readJson(file),kind=paths.get(path.resolve(root,file));if(!kind)return report;
   originalReused.set(kind,report);const view=structuredClone(report);
   const entryObject=entry=>{assert.equal(entry?.src,oldBuild.entry,'Reused '+kind+' must identify baseline JavaScript');entry.src=newBuild.entry;};
   if(kind==='onboarding'){
    entryObject(view.entry);for(const page of view.pages||[])for(const entry of page.entries||[])entryObject(entry);
   }else if(kind==='audio')entryObject(view.entry);
   else if(kind==='audioAnalysis'){if(view.source?.entry?.src!==undefined)entryObject(view.source.entry);}
   else{
    if(view.entry!==undefined||!view.pages?.length){assert.equal(view.entry,oldBuild.entry,'Reused '+kind+' must identify baseline JavaScript');view.entry=newBuild.entry;}
    for(const page of view.pages||[]){assert.equal(page.entry,oldBuild.entry,'Reused '+kind+' page must identify baseline JavaScript');page.entry=newBuild.entry;}
   }
   return view;
  };
 }
 const base=validateV9Evidence(root,{...options,proof,readText,readJson:baseReadJson,hashFile,version:'0.7.1'});
 for(const [kind,report]of originalReused){if(kind==='audio')base.audio=report;else if(kind==='audioAnalysis')base.analysis=report;else base.reports[kind]=report;}
 for(const [index,sample]of base.reports.soak.samples.entries()){
  const verdict=assessPixels(sample.pixels);
  assert.equal(verdict.valid,true,'Soak sample '+index+' invalid canvas: '+verdict.reasons.join(', '));
  assert.equal(sample.pixelCheck?.valid,true,'Soak sample '+index+' stored pixel verdict incomplete');
 }
 const {build,asset}=base,candidate=proof.candidate;
 assert.equal(graphicsProof.candidate,candidate,'Graphics proof candidate mismatch');
 assert.deepEqual(Object.keys(graphicsProof.reports||{}).sort(),[...GRAPHICS].sort(),'Graphics proof must name all eight required reports');
 const evidenceHashes=[...base.evidenceHashes],graphics={},shaderReports={};
 function include(kind,file,expected,json=true){
  assert.equal(typeof file,'string',kind+' path missing');
  const absolute=path.resolve(root,file),relative=path.relative(root,absolute);
  assert.ok(relative&&!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative),kind+' must be inside the project');
  const sha256=hashFile(absolute);assert.match(sha256,/^[a-f0-9]{64}$/);
  if(expected!==undefined)assert.equal(sha256,expected,kind+' file changed');
  evidenceHashes.push({kind,file:relative.replaceAll('\\','/'),sha256});return json===null?null:json?readJson(absolute):readText(absolute);
 }
 assert.deepEqual(include('releaseProof',proofFile),proof,'Release proof object differs from its hashed file');
 assert.deepEqual(include('graphicsProof',graphicsProofFile),graphicsProof,'Graphics proof object differs from its hashed file');
 const clean=(record,name)=>{
  assert.equal(record?.passed,true,name+' incomplete');
  for(const field of ['errors','failures','pageErrors'])assert.deepEqual(record[field]||[],[],name+' '+field);
 };
 const identity=(record,name,expectedBuild=build)=>{
  assert.equal(record.entry,expectedBuild.entry,name+' used a different build');
  const expectedHash=expectedBuild.files.find(f=>f.file===expectedBuild.entry.replace(/^\.\//,''))?.sha256;
  for(const field of ['entryHash','entrySha256'])if(record[field]!==undefined)assert.equal(record[field],expectedHash,name+' '+field+' differs from candidate');
 };
 let presentationPatch=null,presentationBaseline=null,presentationLayouts=null;
 if(graphicsProof.presentationPatch){
  presentationPatch=include('presentationPatch',graphicsProof.presentationPatch);
  const patch=presentationPatch;assert.equal(patch.kind,'css-only-append');clean(patch,'Presentation patch');
  assert.equal(patch.candidate,candidate,'Presentation candidate mismatch');assert.notEqual(patch.baselineCandidate,candidate);assert.match(patch.baselineCandidate||'',/^[a-z0-9-]+$/);
  assert.match(patch.baselineBuild?.sha256||'',/^[a-f0-9]{64}$/,'Baseline build hash missing');
  assert.equal(patch.baselineBuild?.file,'evidence/v9/build-'+patch.baselineCandidate+'.json','Unexpected baseline build record');
  presentationBaseline=include('presentation:baselineBuild',patch.baselineBuild.file,patch.baselineBuild.sha256);
  const baseline=presentationBaseline;assert.equal(baseline.label,patch.baselineCandidate);
  const oldEntry=baseline.files.find(f=>f.file===baseline.entry.replace(/^\.\//,'')),newEntry=build.files.find(f=>f.file===build.entry.replace(/^\.\//,''));
  assert.ok(oldEntry&&newEntry);assert.equal(oldEntry.sha256,newEntry.sha256,'CSS-only patch changed JavaScript bytes');
  for(const file of baseline.files)assert.equal(hashFile(path.join(baseline.outDir,file.file)),file.sha256,'Baseline candidate changed '+file.file);
  const source=patch.source;assert.equal(source?.file,'src/resonance-ui.css','Presentation exception only permits resonance UI CSS');
  const beforeEntry=baseline.sources.find(s=>s.file===source.file),afterEntry=build.sources.find(s=>s.file===source.file);
  assert.ok(beforeEntry&&afterEntry,'CSS source missing in build record');assert.notEqual(beforeEntry.sha256,afterEntry.sha256,'Presentation patch has no CSS change');
  const withoutCss=list=>list.filter(s=>s.file!==source.file).map(s=>({file:s.file,sha256:s.sha256})).sort((a,b)=>a.file.localeCompare(b.file));
  assert.deepEqual(withoutCss(baseline.sources),withoutCss(build.sources),'Presentation exception changed other source/public bytes');
  assert.equal(source.before?.sha256,beforeEntry.sha256,'Baseline CSS snapshot hash mismatch');
  const before=include('presentation:sourceBefore',source.before.file,source.before.sha256,false);
  assert.equal(typeof source.append,'string');assert.ok(source.append.trim().length>0&&source.append.length<2000,'Append must be one small positioning rule');
  assert.match(source.append.trim(),/^@media[^{}]+\{\s*(?:body\.play\s+)?#field-action\s*\{[^{}]+\}\s*\}$/,'Append must contain exactly one media rule for field-action');
  assert.equal(readText(path.resolve(root,source.file)),before+source.append,'CSS must be exactly the baseline plus the declared append');
  const oldStyle=baseline.style.replace(/^\.\//,''),newStyle=build.style.replace(/^\.\//,'');assert.notEqual(oldStyle,newStyle,'Presentation CSS bundle must change');
  const unchangedFiles=(record,style)=>record.files.filter(f=>f.file!=='index.html'&&f.file!==style&&f.file!==record.entry.replace(/^\.\//,'')).map(f=>({file:f.file,sha256:f.sha256})).sort((a,b)=>a.file.localeCompare(b.file));
  assert.deepEqual(unchangedFiles(baseline,oldStyle),unchangedFiles(build,newStyle),'Presentation exception changed other distributed bytes');
  assert.ok(baseline.files.some(f=>f.file===oldStyle)&&build.files.some(f=>f.file===newStyle),'CSS bundles missing');
  const oldHtml=readText(path.join(baseline.outDir,'index.html')),newHtml=readText(path.join(build.outDir,'index.html'));
  assert.equal(oldHtml.split(baseline.style).length,2,'Baseline HTML must contain one stylesheet link');
  assert.equal(oldHtml.split(baseline.entry).length,2,'Baseline HTML must contain one JavaScript link');
  assert.equal(newHtml,oldHtml.replace(baseline.style,build.style).replace(baseline.entry,build.entry),'Built HTML changed beyond equivalent JavaScript and stylesheet links');
  const reused=['play','input','onboarding','audio','audioAnalysis','saves',...GRAPHICS.map(name=>'graphics:'+name)].sort();
  assert.ok(Array.isArray(patch.reusedEvidence),'Explicit reused evidence list required');
  assert.deepEqual(patch.reusedEvidence.map(e=>e.kind).sort(),reused,'Presentation reuse must identify exactly the permitted prior checks');
  for(const reused of patch.reusedEvidence){
   const expected=reused.kind.startsWith('graphics:')?graphicsProof.reports[reused.kind.slice(9)]:proof[reused.kind];
   assert.equal(reused.file,expected,'Reused evidence differs from selected proof '+reused.kind);
   assert.match(reused.sha256||'',/^[a-f0-9]{64}$/);include('presentation:reused:'+reused.kind,reused.file,reused.sha256);
  }
  assert.deepEqual(Object.keys(patch.reports||{}).sort(),['baselineLayout','finalLayout']);
  presentationLayouts={};for(const name of ['baselineLayout','finalLayout']){const link=patch.reports[name];assert.match(link?.sha256||'',/^[a-f0-9]{64}$/);presentationLayouts[name]=include('presentation:'+name,link.file,link.sha256);}
  const overlaps=(a,b)=>a&&b&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5;
  const onScreen=(r,v)=>r&&['left','top','right','bottom','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0&&r.left>=-.5&&r.top>=-.5&&r.right<=v.width+.5&&r.bottom<=v.height+.5;
  for(const name of ['baselineLayout','finalLayout']){
   const r=presentationLayouts[name],record=name==='baselineLayout'?baseline:build;
   const entryHash=record.files.find(f=>f.file===record.entry.replace(/^\.\//,''))?.sha256,styleHash=record.files.find(f=>f.file===record.style.replace(/^\.\//,''))?.sha256;
   assert.equal(r.entry,record.entry,name+' entry mismatch');assert.equal(r.entrySha256,entryHash,name+' JavaScript hash mismatch');
   assert.equal(r.style,record.style,name+' stylesheet mismatch');assert.equal(r.styleSha256,styleHash,name+' CSS hash mismatch');
   assert.deepEqual(r.errors||[],[],name+' browser errors');assert.equal(r.pages?.length,3,name+' requires three viewports');
   assert.deepEqual(r.pages.map(p=>p.viewport.width+'x'+p.viewport.height).sort(),['1440x900','390x844','844x390']);
   if(r.fixture?.path){assert.match(r.fixture.sha256||'',/^[a-f0-9]{64}$/);include('presentation:'+name+':fixture',r.fixture.path,r.fixture.sha256,null);}
   for(const [index,p]of r.pages.entries()){
    for(const key of ['entry','entrySha256','style','styleSha256'])assert.equal(p[key],r[key],name+' page '+index+' '+key+' mismatch');
    assert.deepEqual(p.errors||[],[],name+' page '+index+' browser errors');
    assert.ok(p.screenshots?.length>0,name+' page '+index+' screenshot missing');
    for(const [shot,file]of p.screenshots.entries())include('presentation:'+name+':page'+index+':image'+shot,path.join(path.dirname(patch.reports[name].file),file),undefined,null);
    if(name==='baselineLayout')continue;
    clean(p,'Final layout page '+index);assert.ok(!p.error&&!p.failure,'Final layout page still reports a failure');
    const m=p.metrics,v=p.viewport;assert.ok(m?.field?.visible&&m?.dash?.visible,'Final terminal controls not visible');
    assert.ok(onScreen(m.field.rect,v)&&onScreen(m.dash.rect,v),'Final terminal controls clipped');
    assert.ok(!overlaps(m.field.rect,m.dash.rect),'Final terminal controls overlap');
    for(const label of ['title','hint']){
     const t=m[label];assert.ok(t?.text&&t.lines?.length&&t.display!=='none'&&t.visibility!=='hidden'&&t.opacity>0,'Final terminal text not visible');
     assert.ok(onScreen(t.rect,v),'Final terminal text block clipped');for(const line of t.lines)assert.ok(onScreen(line,v)&&!overlaps(line,m.dash.rect),'Final terminal line clipped or covered');
    }
    assert.ok(m.field.scrollWidth<=m.field.clientWidth+1&&m.field.scrollHeight<=m.field.clientHeight+1,'Final terminal text clipped inside panel');
    assert.equal(m.render?.blocked,false,'Final terminal renderer blocked');
   }
  }
  const old=presentationLayouts.baselineLayout;assert.equal(old.passed,false,'Baseline layout must demonstrate the reported failure');
  assert.ok(old.pages.some(p=>p.passed===false&&overlaps(p.metrics?.field?.rect,p.metrics?.dash?.rect)),'Baseline lacks observed terminal/dash overlap');
  clean(presentationLayouts.finalLayout,'Final terminal layout');
 }
 for(const name of GRAPHICS){
  const report=graphics[name]=include('graphics:'+name,graphicsProof.reports[name]);clean(report,name);
  if(name!=='context'&&name!=='shaderRegression')identity(report,name,presentationBaseline||build);
 }
 for(const name of ['openingLight','openingBalanced','openingDelicate']){
  const r=graphics[name];assert.ok(Array.isArray(r.frames)&&r.frames.length>0,name+' sampled frames missing');
  const checked=r.frames.map(frame=>({...frame,pixelCheck:assessPixels(frame)}));
  assert.equal(assessOpening(checked).valid,true,name+' invalid or incomplete canvas coverage');
  assert.deepEqual(classifyConsole(r.console||[]).blocking,[],name+' console errors');
 }
 const matrix=graphics.matrix;assert.equal(matrix.observations?.length,100,'Matrix needs all 100 observations');
 assert.equal(new Set(matrix.observations.map(o=>o.label)).size,100,'Matrix labels must be unique');
 for(const observation of matrix.observations){assert.equal(assessPixels(observation).valid,true,'Matrix invalid pixels '+observation.label);assert.deepEqual(observation.errors||[],[],'Matrix application errors '+observation.label);}
 assert.deepEqual(matrix.invalidObservations||[],[],'Matrix invalid observations');
 assert.deepEqual(matrix.failedRequests||[],[],'Matrix request failures');
 assert.deepEqual(classifyConsole(matrix.console||[]).blocking,[],'Matrix console errors');
 const context=graphics.context;assert.equal(context.cases?.length,4,'Context recovery requires four phases');
 assert.deepEqual(context.cases.map(c=>c.phase).sort(),['dust','early','material','opening']);
 for(const c of context.cases){clean(c,'Context '+c.phase);identity(c,'Context '+c.phase,presentationBaseline||build);}
 const trace=graphics.glTrace;assert.deepEqual(trace.errors,[],'Initial GL draw errors');
 assert.deepEqual(classifyConsole((trace.logs||[]).map(text=>({type:'warning',text}))).blocking,[],'GL trace console output');
 const resize=graphics.resize;assert.equal(resize.observations?.length,18,'Resize requires six sizes in three qualities');
 assert.equal(resize.redundantResizePreservesFrame,true,'Repeated resize cleared frame');
 for(const observation of resize.observations){
  assert.equal(observation.pixels?.glError,0,'Resize GL error');assert.equal(observation.render?.blocked,false,'Resize blocked');
  if(observation.width>1&&observation.height>1)assert.equal(assessPixels(observation.pixels).valid,true,'Resize invalid restored scene');
 }
 assert.deepEqual(classifyConsole(resize.console||[]).blocking,[],'Resize console errors');
 const shader=graphics.shaderRegression;
 assert.ok(Array.isArray(shader.sourceHashes),'Shader source hashes missing');
 const sortedSources=list=>list.map(s=>({file:s.file.replaceAll('\\','/'),sha256:s.sha256})).sort((a,b)=>a.file.localeCompare(b.file));
 assert.deepEqual(sortedSources(shader.sourceHashes),sortedSources((presentationBaseline||build).sources),'Shader regression source identity differs from its verified source build');
 assert.deepEqual(Object.keys(shader.reports||{}).sort(),['fixed','guard','old'],'Shader controls incomplete');
 for(const name of ['old','fixed','guard']){
  const link=shader.reports[name];assert.match(link?.sha256||'',/^[a-f0-9]{64}$/,'Shader '+name+' hash missing');
  const report=shaderReports[name]=include('shader:'+name,link.file,link.sha256),probe=report.probe;
  assert.equal(probe?.status,'complete','Shader '+name+' probe incomplete');
  assert.deepEqual(report.pageErrors,[],'Shader '+name+' page errors');assert.deepEqual(probe.errors,[],'Shader '+name+' probe errors');
  assert.deepEqual(probe.resolvedEnd?.glErrors,[],'Shader '+name+' resolved GL errors');
  assert.ok(probe.checks?.length>0,'Shader '+name+' missing draw samples');
  for(const draw of probe.checks){assert.deepEqual(draw.drawErrors||[],[],'Shader '+name+' draw errors');assert.deepEqual(draw.probeErrors||[],[],'Shader '+name+' probe draw errors');}
  assert.deepEqual(classifyConsole(report.consoleMessages||[]).blocking,[],'Shader '+name+' console errors');
  const expectedValid=name!=='old';assert.equal(report.pixelCheck?.valid,expectedValid,'Shader '+name+' unexpected visual verdict');
  assert.equal(assessPixels(report.pixels).valid,expectedValid,'Shader '+name+' actual pixels disagree');
  if(name==='fixed'){
   assert.equal(probe.firstInvalid,null,'Fixed source still emits invalid pixels');assert.equal(probe.resolvedEnd.invalidComponents,0,'Fixed reflection still contains invalid pixels');
  }else{
   assert.equal(probe.firstInvalid?.object,'tide-blue-veil','Shader '+name+' has another failure source');
   assert.ok(probe.firstInvalid.invalidComponents>0&&probe.resolvedEnd.invalidComponents>0,'Shader '+name+' negative control did not generate invalid reflection pixels');
  }
 }
 evidenceHashes.sort((a,b)=>a.kind.localeCompare(b.kind));
 const evidenceDigest=digest(JSON.stringify({version:'0.7.1',candidate,build:hashFile(path.resolve(root,'evidence/v9/build-'+candidate+'.json')),evidenceHashes}));
 return {...base,version:'0.7.1',graphicsProof,graphics,shaderReports,presentationPatch,presentationBaseline,presentationLayouts,evidenceHashes,evidenceDigest};
}
module.exports={validateV10Evidence};
