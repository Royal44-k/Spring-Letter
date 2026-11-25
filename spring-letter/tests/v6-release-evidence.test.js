import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {buildWorkWindow,assertWorkWindow,assertReportIdentity,boundReport,assertPublishedArtifacts,assertCaptures,within,sha256}=require('../scripts/v6-release-evidence.cjs');
const {renderIndex}=require('../scripts/update-v6-index.cjs');
test('interruption never counts as work and the legacy duration remains explicitly wall-clock',()=>{
 const a=buildWorkWindow(Date.parse('2026-11-19T11:18:23Z'));
 assert.equal(a.activeWorkMs,11090000);assert.equal(a.elapsedMs,a.wallClockElapsedMs);assert.equal(a.uncountedMs,5318000);assert.equal(a.workIntervals.length,1);assertWorkWindow(a);
 const b=buildWorkWindow(Date.parse('2026-11-19T11:19:23Z'));assert.equal(b.activeWorkMs,a.activeWorkMs+60000);assert.equal(b.uncountedMs,a.uncountedMs);assert.equal(b.workIntervals.length,2);
 assert.throws(()=>assertWorkWindow({...b,activeWorkMs:b.elapsedMs}),/chronology/);
 assert.throws(()=>assertWorkWindow({elapsedMs:b.elapsedMs}),/intervals/);
});
test('final report identity rejects old candidates, omitted CSS and changed final CSS',()=>{
 const m={build:'/assets/G.js',styleBuild:'/assets/G.css'};
 assertReportIdentity({build:{entry:m.build,style:m.styleBuild}},m);
 for(const r of [{build:'/assets/F.js',styleBuild:m.styleBuild},{build:m.build},{build:m.build,styleBuild:m.styleBuild,finalStyleBuild:'/assets/F.css'}])assert.throws(()=>assertReportIdentity(r,m));
 assert.throws(()=>assertCaptures({captures:['old.png']},['new.png']),/not captured/);
 assert.throws(()=>within(path.resolve('.'),'../outside.webm'),/escapes/);
});
test('bound evidence rejects post-gate changes even when the build filename stays the same',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'spring-release-evidence-'));
 t.after(()=>{assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(root,{recursive:true});});fs.mkdirSync(path.join(root,'evidence'));
 const r={build:'/assets/G.js',styleBuild:'/assets/G.css',checks:['pass']},bytes=JSON.stringify(r);fs.writeFileSync(path.join(root,'evidence/report.json'),bytes);
 const m={...r,evidence:[{file:'report.json',sha256:sha256(bytes)}]};assert.deepEqual(boundReport(root,m,'report.json'),r);
 fs.writeFileSync(path.join(root,'evidence/report.json'),JSON.stringify({...r,checks:['different']}));assert.throws(()=>boundReport(root,m,'report.json'),/changed after/);
});
test('video, decoder, ZIP and served reports all bind the exact current manifest',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'spring-release-artifacts-'));t.after(()=>{assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(root,{recursive:true});});fs.mkdirSync(path.join(root,'evidence'));fs.mkdirSync(path.join(root,'releases'));
 const identity={build:'/assets/G.js',styleBuild:'/assets/G.css'},video=Buffer.from('decoded video fixture'),zip=Buffer.from('zip fixture');
 const record={...identity,success:true,uncut:true,audioRecorded:false,file:'video.webm',fileBytes:video.length,fileSha256:sha256(video)};
 fs.writeFileSync(path.join(root,'evidence/video.webm'),video);const recordBytes=JSON.stringify(record);fs.writeFileSync(path.join(root,'evidence/v6-recording-verification.json'),recordBytes);fs.writeFileSync(path.join(root,'releases/game.zip'),zip);
 const manifest={...identity,recording:{file:record.file,bytes:video.length,sha256:record.fileSha256},dist:[{}],runtimeFiles:[{}]},manifestBytes=JSON.stringify(manifest);fs.writeFileSync(path.join(root,'evidence/release-manifest-v6.json'),manifestBytes);
 const media={...identity,passed:true,audioStreams:0,timestampsStrictlyIncreasing:true,file:record.file,bytes:video.length,sha256:record.fileSha256,recordingReportSha256:sha256(recordBytes)};
 const pack={...identity,crcVerified:true,file:'releases/game.zip',bytes:zip.length,sha256:sha256(zip),extractedRuntime:{...identity,passed:true,matchesCurrentRelease:true,releaseManifestSha256:sha256(manifestBytes),filesVerified:1,runtimeFilesVerified:1}};
 const served={...identity,passed:true,manifestSha256:sha256(manifestBytes),files:[{}]};const all={media,pack,record,served};assertPublishedArtifacts(root,manifest,all);
 for(const invalid of [{...all,media:{...media,file:'old.webm'}},{...all,media:{...media,recordingReportSha256:'old'}},{...all,record:{...record,fileSha256:'old'}},{...all,pack:{...pack,styleBuild:'/assets/F.css'}},{...all,served:{...served,manifestSha256:'old'}}])assert.throws(()=>assertPublishedArtifacts(root,manifest,invalid));
});
test('release overview regeneration is idempotent and uses final relative media/package links',()=>{
 const source=fs.readFileSync(new URL('../../docs/blossom/tools/v6-index.html',import.meta.url),'utf8');
 const context={manifest:{candidate:'candidate-g'},media:{file:'final.webm',lastTimestampSeconds:123},pack:{file:'releases/final.zip'}};
 const first=renderIndex(source,context),again=renderIndex(first,context);assert.equal(again,first);
 assert.equal((first.match(/id="release"/g)||[]).length,1);assert.ok(first.includes('src="../../spring-letter/evidence/final.webm"'));assert.ok(first.includes('href="../../spring-letter/releases/final.zip"'));assert.ok(first.includes('v6-build-candidate-g.json'));assert.ok(!first.includes('v6-candidate-b-gallery.png'));
});
