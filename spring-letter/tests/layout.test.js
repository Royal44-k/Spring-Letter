import test from 'node:test';
import assert from 'node:assert/strict';
import {supportAt,nearestSafe,ZONE} from '../src/layout.js';
import {createState} from '../src/game-model.js';
test('unopened first path cannot be traversed as water, while unlocked path connects gardens',()=>{
 const s=createState();assert.equal(supportAt(0,-8,s),null);s.p1.solved=true;assert.ok(supportAt(0,-8,s));assert.ok(supportAt(0,-16,s));
});
test('pool crossings exist only when their material supports them',()=>{
 const s=createState();s.p1.solved=s.wind.solved=true;
 assert.equal(supportAt(0,-29,s),null);s.bridge.structure='bridge_am';assert.equal(supportAt(0,-29,s).support,'bridge_am');
 s.bridge.structure='shield_rm';assert.equal(supportAt(-2.5,-30.5,s).support,'leaf_rm');assert.equal(supportAt(0,-29,s),null);
});
test('the second bridge joins M to F and finale route requires reaching F',()=>{
 const s=createState();s.p1.solved=s.wind.solved=true;s.bridge.structure='bridge_mf';
 assert.equal(supportAt(0,-35,s).support,'bridge_mf');assert.equal(supportAt(0,-40,s),null);
 s.bridge.solved=true;assert.ok(supportAt(0,-40,s));assert.equal(ZONE.finale.z,-46);
});
test('support rejects nonfinite/outside coordinates and provides a fixed recovery point',()=>{
 const s=createState();assert.equal(supportAt(NaN,0,s),null);assert.equal(supportAt(50,50,s),null);
 assert.deepEqual(nearestSafe(s),{x:0,z:6});s.p1.solved=s.wind.solved=true;s.player.safe='pool';s.bridge.platform='M';assert.deepEqual(nearestSafe(s),{x:0,z:-32});
});
