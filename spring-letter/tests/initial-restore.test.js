import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,restore,serialize} from '../src/game-model.js';

test('empty and damaged saves settle immediately into one stable fresh-journey shape',()=>{
 for(const raw of [null,'not-json','null','[]','{}','{"version":2}']){
  const first=restore(raw),second=restore(serialize(first));
  assert.equal(serialize(first),serialize(second),String(raw));
  assert.deepEqual(first.p1,{solved:false,hold:0,broken:false,ink:0});
  assert.equal(first.deliveryCarried,null);assert.equal(first.ending,null);
 }
 assert.equal(serialize(createState()),serialize(restore(serialize(createState()))));
});
