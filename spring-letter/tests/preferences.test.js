import test from 'node:test';
import assert from 'node:assert/strict';
import {PREFERENCES_KEY,normalizePreferences,readPreferences,writePreferences} from '../src/preferences.js';
const storage=()=>{const data=new Map();return{data,getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};};
test('preferences survive starting a new journey without replacing the journey itself',()=>{
 const s=storage();s.setItem('spring-letter:journey:v1','original-progress');
 writePreferences(s,{muted:true,autoCamera:false,flowerForm:'iris'});
 const p=readPreferences(s);assert.equal(p.muted,true);assert.equal(p.autoCamera,false);assert.equal(p.flowerForm,'iris');assert.equal(s.getItem('spring-letter:journey:v1'),'original-progress');
});
test('existing saved settings migrate, while an explicit preference takes precedence',()=>{
 const s=storage();s.setItem('spring-letter:journey:v1',JSON.stringify({settings:{reducedMotion:true,quality:'light'}}));assert.equal(readPreferences(s).reducedMotion,true);
 writePreferences(s,{quality:'delicate'});assert.equal(readPreferences(s).quality,'delicate');
});
test('bad settings and unavailable storage preserve safe motion defaults',()=>{
 const s=storage();s.setItem(PREFERENCES_KEY,'{bad');assert.equal(readPreferences(s,{reducedMotion:true}).reducedMotion,true);
 assert.equal(normalizePreferences({autoCamera:'false',quality:'broken'}).autoCamera,true);
 assert.equal(writePreferences({setItem(){throw Error('blocked');}},{}),false);
});
