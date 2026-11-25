const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=file=>JSON.parse(fs.readFileSync(path.resolve(root,file),'utf8')),sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root,file))).digest('hex');
const candidate='v10-final-e',build=read('evidence/v9/build-'+candidate+'.json');
const proof={candidate,units:'evidence/v9/units-v10-final-e.txt',play:'evidence/v9/play-2026-11-21T11-47-50-746Z/report.json',input:'evidence/v9/input-boundaries-2026-11-21T11-50-58-345Z/report.json',onboarding:'evidence/v9/onboarding-2026-11-21T11-52-13-743Z/report.json',audio:'evidence/v9/audio-2026-11-21T11-53-46-872Z/capture.json',audioAnalysis:'evidence/v9/audio-2026-11-21T11-53-46-872Z/analysis.json',saves:'evidence/v9/save-ui-2026-11-21T11-54-26-482Z/report.json'};
function newestFinal(prefix){
 const dirs=fs.readdirSync(path.join(root,'evidence/v9')).filter(n=>n.startsWith(prefix)).sort().reverse();
 for(const name of dirs){const file='evidence/v9/'+name+'/report.json';if(!fs.existsSync(path.join(root,file)))continue;const r=read(file);if(r.passed&&(r.entry===build.entry||r.pages?.length&&r.pages.every(p=>p.entry===build.entry)))return file;}
 throw Error('Missing successful final-style '+prefix+' report');
}
for(const [key,prefix]of Object.entries({visual:'visual-',static:'static-',keepsake:'keepsake-',legacy:'legacy-',soak:'soak-'}))proof[key]=newestFinal(prefix);
for(const [key,file]of Object.entries(proof))if(key!=='candidate'&&key!=='units')assert.equal(read(file).passed,true,key);assert.match(fs.readFileSync(path.join(root,proof.units),'utf8'),/fail\s+0(?:\s|$)/);
const graphics=read('evidence/v10/graphics-proof.json');graphics.candidate=candidate;graphics.presentationPatch='evidence/v10/presentation-patch.json';
const linked=file=>({file,sha256:sha(file)}),reusedKinds=['play','input','onboarding','audio','audioAnalysis','saves'];
const reusedEvidence=[...reusedKinds.map(kind=>({kind,...linked(proof[kind])})),...Object.entries(graphics.reports).map(([key,file])=>({kind:'graphics:'+key,...linked(file)}))];
const beforeFile='evidence/v10/presentation-before/resonance-ui.css',before=fs.readFileSync(path.join(root,beforeFile),'utf8'),after=fs.readFileSync(path.join(root,'src/resonance-ui.css'),'utf8');assert.ok(after.startsWith(before));
const baselineFile='evidence/v10/terminal-layout-2026-11-21T12-00-27-480Z/report.json',finalFile='evidence/v10/terminal-layout-2026-11-21T12-03-38-859Z/report.json';assert.equal(read(baselineFile).passed,false);assert.equal(read(finalFile).passed,true);
const patch={kind:'css-only-append',passed:true,candidate,baselineCandidate:'v10-final-c',baselineBuild:linked('evidence/v9/build-v10-final-c.json'),source:{file:'src/resonance-ui.css',before:linked(beforeFile),append:after.slice(before.length)},reusedEvidence,reports:{baselineLayout:linked(baselineFile),finalLayout:linked(finalFile)}};
for(const [file,value]of [['evidence/v10/release-evidence.json',proof],['evidence/v10/graphics-proof.json',graphics],['evidence/v10/presentation-patch.json',patch]])fs.writeFileSync(path.join(root,file),JSON.stringify(value,null,2));console.log(JSON.stringify({candidate,proof,reusedEvidence:reusedEvidence.length,entry:build.entry,style:build.style}));
