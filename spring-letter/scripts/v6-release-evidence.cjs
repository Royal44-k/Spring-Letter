// Shared CPU-only identity and chronology checks for release documentation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const sha256=data=>crypto.createHash('sha256').update(data).digest('hex');
function buildWorkWindow(now=Date.now()){
 const startedAt='2026-11-19T06:44:55.000Z',firstEnd='2026-11-19T09:49:45.000Z',resumedAt='2026-11-19T11:18:23.000Z';
 assert.ok(Number.isFinite(now)&&now>=Date.parse(startedAt),'invalid work-window end');
 const intervals=[['initial',startedAt,firstEnd],['resumed',resumedAt,new Date(now).toISOString()]];
 const workIntervals=intervals.filter(([,start])=>Date.parse(start)<now).map(([id,start,end])=>{
  const endedAt=new Date(Math.min(now,Date.parse(end))).toISOString();
  return {id,startedAt:start,endedAt,durationMs:Date.parse(endedAt)-Date.parse(start)};
 });
 const wallClockElapsedMs=now-Date.parse(startedAt),activeWorkMs=workIntervals.reduce((n,v)=>n+v.durationMs,0);
 return {startedAt,endedAt:new Date(now).toISOString(),elapsedMs:wallClockElapsedMs,wallClockElapsedMs,
  elapsedMsMeaning:'Legacy alias of wallClockElapsedMs; includes interruption and is not active work.',activeWorkMs,
  uncountedMs:wallClockElapsedMs-activeWorkMs,workIntervals,
  interruption:{reportedStart:'2026-11-19T09:50:00.000Z',resumedAt,excludedFrom:firstEnd,reason:'Interruption and handoff gaps are excluded conservatively.'},
  scope:'Recorded task-session intervals, not a keyboard-activity measurement. Only these intervals count toward the requested work window.'};
}
function assertWorkWindow(window){
 assert.ok(window&&Number.isFinite(Date.parse(window.endedAt)),'missing explicit work intervals');
 assert.deepEqual(window,buildWorkWindow(Date.parse(window.endedAt)),'work chronology differs from recorded intervals');
 assert.ok(window.activeWorkMs>=3*60*60*1000,'three hours of recorded work required');
}
function assertReportIdentity(report,manifest,label='report'){
 const entry=typeof report.build==='string'?report.build:report.build?.entry;
 const style=report.styleBuild||report.build?.styleBuild||report.build?.style;
 assert.equal(entry,manifest.build,`${label}: different or missing JS build`);
 assert.equal(style,manifest.styleBuild,`${label}: different or missing CSS build`);
 for(const value of [report.finalEntry,report.build?.finalEntry].filter(v=>v!==undefined))assert.equal(value,manifest.build,`${label}: changed final JS build`);
 for(const value of [report.finalStyleBuild,report.build?.finalStyleBuild].filter(v=>v!==undefined))assert.equal(value,manifest.styleBuild,`${label}: changed final CSS build`);
}
function boundReport(root,manifest,file){
 const bytes=fs.readFileSync(path.join(root,'evidence',file)),entry=manifest.evidence.find(v=>v.file===file);
 assert.ok(entry,`${file}: absent from release evidence`);assert.equal(sha256(bytes),entry.sha256,`${file}: changed after release verification`);
 const report=JSON.parse(bytes);assertReportIdentity(report,manifest,file);return report;
}
function within(root,relative){
 assert.ok(typeof relative==='string'&&relative&&!path.isAbsolute(relative),'expected relative release file');
 const result=path.resolve(root,relative),prefix=path.resolve(root)+path.sep;
 assert.ok(result.startsWith(prefix),'release file escapes its root');return result;
}
function assertCaptures(report,files){
 for(const file of files)assert.ok(report.captures?.includes(file),`${file}: not captured by this bound report`);
}
function assertPublishedArtifacts(root,manifest,{pack,media,record,served}){
 const manifestSha=sha256(fs.readFileSync(path.join(root,'evidence/release-manifest-v6.json')));
 for(const [name,report] of Object.entries({pack,media,record,...(served?{served}:{})}))assertReportIdentity(report,manifest,name);
 assert.equal(record.success,true);assert.equal(record.uncut,true);assert.equal(record.audioRecorded,false);
 assert.equal(media.passed,true);assert.equal(media.audioStreams,0);assert.equal(media.timestampsStrictlyIncreasing,true);
 assert.equal(media.file,record.file);assert.equal(manifest.recording.file,record.file);
 assert.equal(media.recordingReportSha256,sha256(fs.readFileSync(path.join(root,'evidence/v6-recording-verification.json'))));
 assert.equal(record.fileSha256,media.sha256);
 assert.equal(media.sha256,manifest.recording.sha256);assert.equal(media.bytes,record.fileBytes);assert.equal(media.bytes,manifest.recording.bytes);
 const video=within(path.join(root,'evidence'),record.file);assert.equal(fs.statSync(video).size,media.bytes);assert.equal(sha256(fs.readFileSync(video)),media.sha256);
 assert.equal(pack.crcVerified,true);assert.equal(pack.extractedRuntime?.passed,true);assert.equal(pack.extractedRuntime.matchesCurrentRelease,true);
 assertReportIdentity(pack.extractedRuntime,manifest,'extracted package');assert.equal(pack.extractedRuntime.releaseManifestSha256,manifestSha);
 const archive=within(root,pack.file);assert.equal(fs.statSync(archive).size,pack.bytes);assert.equal(sha256(fs.readFileSync(archive)),pack.sha256);
 assert.equal(pack.extractedRuntime.filesVerified,manifest.dist.length);assert.equal(pack.extractedRuntime.runtimeFilesVerified,manifest.runtimeFiles.length);
 if(served){assert.equal(served.passed,true);assert.equal(served.manifestSha256,manifestSha);assert.equal(served.files.length,manifest.dist.length);}
}
module.exports={buildWorkWindow,assertWorkWindow,assertReportIdentity,boundReport,assertPublishedArtifacts,assertCaptures,within,sha256};
