import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,serialize,restore} from '../src/game-model.js';
import {createVoyageState,voyageCommand} from '../src/voyage-model.js';
test('an old journey gains an empty voyage without changing the earned core',()=>{
 const old=createState();delete old.voyage;old.started=true;old.p1.solved=true;old.wind.solved=true;old.bridge.solved=true;old.cores=['memory','season'];old.ending='memory+season';
 const s=restore(JSON.stringify(old));assert.equal(s.ending,old.ending);assert.equal(s.voyage.stage,'idle');assert.equal(s.voyage.letter.body,'');
});
test('written coastal letter survives the normal journey serializer and restore',()=>{
 const s=createState();s.started=true;s.p1.solved=s.wind.solved=s.bridge.solved=true;
 let v=voyageCommand(createVoyageState(),'begin').state;v=voyageCommand(v,'write',{recipient:'一个未曾谋面的人',body:'窗前的花开了。\n明年，愿你也能看见。',sealKind:'iris'}).state;v=voyageCommand(v,'seal').state;s.voyage=v;
 const r=restore(serialize(s));assert.deepEqual(r.voyage.letter,v.letter);assert.equal(r.voyage.stage,'writing');assert.equal(r.ending,null);
});
test('unearned malformed coastal state cannot appear before the bridge',()=>{
 const s=createState();s.voyage={stage:'complete',distance:Infinity,letter:{body:'<script>alert(1)</script>'}};
 const r=restore(JSON.stringify(s));assert.equal(r.voyage.stage,'idle');assert.ok(Number.isFinite(r.voyage.distance));
});
