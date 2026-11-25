import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const recording=require('../scripts/v6-record.cjs');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fixtureRoot=path.join(root,'.qa-v6','recording-tool-fixtures');
fs.mkdirSync(fixtureRoot,{recursive:true});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function fixture(){const dir=fs.mkdtempSync(path.join(fixtureRoot,'case-')),source=path.join(dir,'source'),target=path.join(dir,'target');fs.mkdirSync(source);fs.mkdirSync(target);return{dir,source,target};}

test('recording candidate binds the exact G HTML, JavaScript and CSS bytes',()=>{
 const identity=recording.loadCandidateIdentity();
 assert.equal(identity.entry,'/assets/index-BAJMaxNn.js');
 assert.equal(identity.styleBuild,'/assets/index-B12KydA1.css');
 assert.match(identity.manifestSha256,/^[a-f0-9]{64}$/);
 assert.match(identity.entrySha256,/^[a-f0-9]{64}$/);
 assert.match(identity.styleSha256,/^[a-f0-9]{64}$/);
});

test('recording checks the actual Playwright FFmpeg registry executable',()=>{
 const runtime=recording.loadRecordingRuntime();
 assert.equal(path.resolve(runtime.ffmpegPath),path.join(root,'.tools','playwright','ffmpeg-1013','ffmpeg-win64.exe'));
 assert.match(runtime.ffmpegVersion,/playwright-build-1013/);
 assert.match(runtime.ffmpegSha256,/^[a-f0-9]{64}$/);
});

test('candidate parsing refuses missing JS or CSS rather than guessing a version',()=>{
 assert.throws(()=>recording.entryPaths('<script src="/assets/game.js"></script>'));
 assert.throws(()=>recording.entryPaths('<link href="/assets/style.css">'));
});

test('canonical publication keeps the exact original and previous canonical bytes',()=>{
 const {source,target}=fixture();fs.writeFileSync(path.join(source,'fixture.json'),'new fixture bytes');fs.writeFileSync(path.join(target,'fixture.json'),'previous fixture bytes');
 const manifest=recording.publishEvidenceCopies(source,target,['fixture.json'],{id:'fixture'});
 assert.equal(fs.readFileSync(path.join(source,'previous-canonical','fixture.json'),'utf8'),'previous fixture bytes');
 assert.equal(fs.readFileSync(path.join(target,'fixture.json'),'utf8'),'new fixture bytes');
 assert.equal(manifest.copies[0].sha256,recording.shaFile(path.join(source,'fixture.json')));
 assert.equal(recording.shaFile(path.join(source,'v6-recording-copy-manifest.json')),recording.shaFile(path.join(target,'v6-recording-copy-manifest.json')));
});

test('publication rejects traversal and duplicate artifact names before copying',()=>{
 const {source,target}=fixture();fs.writeFileSync(path.join(source,'fixture.json'),'fixture');
 assert.throws(()=>recording.publishEvidenceCopies(source,target,['../outside.json'],{id:'fixture'}));
 assert.throws(()=>recording.publishEvidenceCopies(source,target,['fixture.json','fixture.json'],{id:'fixture'}));
 assert.deepEqual(fs.readdirSync(target),[]);
});

test('a second publication cannot erase an already retained original',()=>{
 const {source,target}=fixture();fs.writeFileSync(path.join(source,'fixture.json'),'new');fs.writeFileSync(path.join(target,'fixture.json'),'old');
 recording.publishEvidenceCopies(source,target,['fixture.json'],{id:'fixture'});
 assert.throws(()=>recording.publishEvidenceCopies(source,target,['fixture.json'],{id:'fixture'}),/EEXIST/);
 assert.equal(fs.readFileSync(path.join(source,'previous-canonical','fixture.json'),'utf8'),'old');
});

test('served-candidate preflight rejects mismatched bytes even under the right asset name',async()=>{
 const html='<script type="module" src="/assets/game.js"></script><link rel="stylesheet" href="/assets/style.css">',js='fixture JS',css='fixture CSS';
 const responses={'/':html,'/assets/game.js':js,'/assets/style.css':css};
 const server=http.createServer((req,res)=>{res.statusCode=req.url in responses?200:404;res.end(responses[req.url]??'missing');});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port,expected={entry:'/assets/game.js',styleBuild:'/assets/style.css',indexSha256:hash(html),entrySha256:hash(js),styleSha256:hash(css)};
 try{await recording.verifyServedCandidate(url,expected);await assert.rejects(recording.verifyServedCandidate(url,{...expected,entrySha256:'0'.repeat(64)}),/bytes differ/);}
 finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
