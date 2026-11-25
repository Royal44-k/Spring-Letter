import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {EventEmitter} from 'node:events';
const require=createRequire(import.meta.url);
const {newFrameSamples,stats,auditResourceHistory}=require('../scripts/v6-soak.cjs');
const {observeErrors}=require('../scripts/v6-interface.cjs');

test('soak cannot count old RAF history when animation freezes or counter resets',()=>{
 const before={frameNumber:300},times=Array(300).fill(16.7);
 assert.throws(()=>newFrameSamples(before,{frameNumber:300,frameTimes:times},{minimum:41}),/0 new frames/);
 assert.throws(()=>newFrameSamples(before,{frameNumber:12,frameTimes:times}),/-288 new frames/);
 assert.throws(()=>newFrameSamples(before,{frameNumber:340,frameTimes:times},{minimum:41}),/40 new frames/);
});
test('soak statistics use only newly rendered finite samples',()=>{
 const values=newFrameSamples({frameNumber:300},{frameNumber:350,frameTimes:[...Array(100).fill(999),...Array(50).fill(16)]},{minimum:41});
 assert.equal(values.count,50);assert.equal(stats(values.values).maxMs,16);
 assert.throws(()=>newFrameSamples({frameNumber:1},{frameNumber:43,frameTimes:Array(42).fill(NaN)},{minimum:41}),/invalid frame/);
 assert.throws(()=>stats([]),/actual finite/);
});
const rows=(values,form='lily',name='silver')=>values.map((value,i)=>({round:i+1,form,name,memory:{geometries:value,textures:20,programs:8}}));
test('warm resource audit permits a fixed plateau and bounded returning variation',()=>{
 const result=auditResourceHistory([...rows([90,100,101,100]),...rows([2,3,3,3],'saved','roaming')]);
 assert.equal(result.comparisons.length,6);assert.equal(result.comparisons[0].baseline,100);
 assert.equal(result.comparisons[0].baselineRound,2);
});
test('resource audit rejects both slow cumulative leaks and within-tolerance rising trends',()=>{
 assert.throws(()=>auditResourceHistory(rows(Array.from({length:12},(_,i)=>100+i))),/fixed warm baseline/);
 assert.throws(()=>auditResourceHistory(rows([99,100,101,102])),/upward trend/);
 assert.throws(()=>auditResourceHistory(rows([99,100,101,101,102])),/upward trend/);
});
test('resource audit requires matched repeated states and valid counters',()=>{
 assert.throws(()=>auditResourceHistory([]),/no resource/);
 assert.throws(()=>auditResourceHistory(rows([100,100,100])),/three matched/);
 const sample=rows([100,100,100,100]);sample[2].memory.textures=undefined;
 assert.throws(()=>auditResourceHistory(sample),/invalid textures/);
});
test('interface observers include shader console errors on every page',()=>{
 const errors=[],first=new EventEmitter(),second=new EventEmitter();
 observeErrors(first,errors);observeErrors(second,errors);
 first.emit('console',{type:()=> 'error',text:()=> 'THREE shader compile failure'});
 second.emit('pageerror',new Error('touch context failure'));
 first.emit('console',{type:()=> 'warning',text:()=> 'not a test failure'});
 assert.equal(errors.length,2);assert.match(errors[0],/shader compile/);assert.match(errors[1],/touch context/);
});
