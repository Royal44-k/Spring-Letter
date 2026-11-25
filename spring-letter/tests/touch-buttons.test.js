import test from 'node:test';
import assert from 'node:assert/strict';
import {createTouchButtonActivator} from '../src/touch-buttons.js';

function button(dataset={mAction:'undo'}){const b={dataset,disabled:false,isConnected:true,getBoundingClientRect:()=>({left:0,top:0,right:100,bottom:40}),closest:selector=>selector==='button'?b:null};return b;}
function event(target,extra={}){return {target,pointerType:'touch',pointerId:1,isPrimary:true,button:0,clientX:30,clientY:20,...extra};}
function fixture(){let clock=100;const calls=[],handler=createTouchButtonActivator({activate:(b,e)=>calls.push({b,e}),now:()=>clock});return {handler,calls,advance:ms=>clock+=ms};}

test('touch release activates once without cancelling native pointer behavior, then deduplicates its touch click',()=>{
 const f=fixture(),b=button(),down=event(b,{preventDefault(){throw Error('must not suppress scrolling');},setPointerCapture(){throw Error('must not capture');}});
 f.handler.pointer('down',down);assert.equal(f.calls.length,0);assert.equal(f.handler.pointer('up',event(b)),true);assert.equal(f.calls.length,1);
 assert.equal(f.handler.shouldSuppressClick(event(b,{detail:1})),true);assert.equal(f.calls.length,1);
 assert.equal(f.handler.shouldSuppressClick(event(b,{detail:0})),false,'keyboard activation remains native');
});

test('moving twelve pixels cancels the tap even when the finger returns before release',()=>{
 for(const delta of [12,40]){const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.pointer('move',event(b,{clientX:30+delta}));f.handler.pointer('move',event(b));assert.equal(f.handler.pointer('up',event(b)),false);assert.equal(f.calls.length,0);}
 const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.pointer('move',event(b,{clientX:41}));assert.equal(f.handler.pointer('up',event(b,{clientX:41})),true);
});

test('release must remain inside the same connected enabled button and preserve its action',()=>{
 for(const change of [(b,e)=>{e.target=button();},(b,e)=>{e.clientY=45;},b=>{b.disabled=true;},b=>{b.isConnected=false;},b=>{b.dataset.mAction='clear';}]){
  const f=fixture(),b=button(),up=event(b);f.handler.pointer('down',event(b));change(b,up);assert.equal(f.handler.pointer('up',up),false);assert.equal(f.calls.length,0);
 }
});

test('direction controls, disabled buttons, ordinary buttons, mouse and non-primary touches are excluded',()=>{
 for(const [b,extra]of [[button({mAction:'left'}),{}],[button({mAction:'right'}),{}],[button({mAction:'up'}),{}],[button({mAction:'down'}),{}],[button({}),{}],[Object.assign(button(),{disabled:true}),{}],[button(),{pointerType:'mouse'}],[button(),{isPrimary:false}]]){
  const f=fixture();f.handler.pointer('down',event(b,extra));assert.equal(f.handler.pointer('up',event(b,extra)),false);assert.equal(f.calls.length,0);
 }
 const f=fixture(),b=button({commit:'new'});f.handler.pointer('down',event(b));f.handler.pointer('up',event(b));assert.equal(f.calls.length,1);
});

test('another pointer cannot release or move the owning contact',()=>{
 const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.pointer('move',event(b,{pointerId:2,clientX:90}));assert.equal(f.handler.pointer('up',event(b,{pointerId:2})),false);assert.equal(f.handler.pointer('up',event(b)),true);assert.equal(f.calls.length,1);
});

test('pointer cancellation and controller cancellation clear contacts but retain an already-used click guard',()=>{
 const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.pointer('cancel',event(b));assert.equal(f.handler.pointer('up',event(b)),false);
 f.handler.pointer('down',event(b));f.handler.cancel();assert.equal(f.handler.pointer('up',event(b)),false);
 f.handler.pointer('down',event(b));f.handler.pointer('up',event(b));f.handler.cancel();assert.equal(f.handler.shouldSuppressClick(event(b,{detail:1})),true);assert.equal(f.calls.length,1);
});

test('genuine mouse clicks and keyboard clicks are never consumed after a touch activation',()=>{
 const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.pointer('up',event(b));
 assert.equal(f.handler.shouldSuppressClick(event(b,{pointerType:'mouse',detail:1})),false);assert.equal(f.handler.shouldSuppressClick(event(b,{pointerType:undefined,detail:0})),false);
 f.handler.pointer('down',event(b,{pointerType:'mouse'}));assert.equal(f.handler.shouldSuppressClick(event(b,{pointerType:undefined,detail:1})),false,'real mouse pointerdown distinguishes an older MouseEvent click');
});

test('compatibility clicks survive a same-action DOM redraw, but other actions and expired clicks remain native',()=>{
 const f=fixture(),b=button({mAction:'select',value:'tree'});f.handler.pointer('down',event(b));f.handler.pointer('up',event(b));b.isConnected=false;
 assert.equal(f.handler.shouldSuppressClick(event(button({mAction:'select',value:'shoot'}),{detail:1})),false);
 assert.equal(f.handler.shouldSuppressClick(event(button({mAction:'select',value:'tree'}),{detail:1})),true);
 f.handler.pointer('down',event(button()));const current=button();f.handler.reset();f.handler.pointer('down',event(current));f.handler.pointer('up',event(current));f.advance(901);assert.equal(f.handler.shouldSuppressClick(event(current,{detail:1})),false);
});

test('reset and dispose clear all contacts and deferred-click guards',()=>{
 const f=fixture(),b=button();f.handler.pointer('down',event(b));f.handler.reset();assert.equal(f.handler.pointer('up',event(b)),false);
 f.handler.pointer('down',event(b));f.handler.pointer('up',event(b));f.handler.reset();assert.equal(f.handler.shouldSuppressClick(event(b,{detail:1})),false);
 f.handler.pointer('down',event(b));f.handler.dispose();assert.equal(f.handler.pointer('up',event(b)),false);assert.equal(f.handler.pointer('down',event(b)),false);assert.equal(f.calls.length,1);
});
