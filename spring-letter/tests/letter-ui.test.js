import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {createState} from '../src/game-model.js';

// The UI's presentation stylesheet has no Node behavior. Exercise its actual
// next-step decisions without starting a browser or a GPU-backed scene.
const css=registerHooks({load(url,context,next){return url.endsWith('/letter-ui.css')?{format:'module',source:'',shortCircuit:true}:next(url,context);}});
const ui=await import('../src/letter-ui.js');css.deregister();

test('continuing is unavailable before a valid reply and never grants progress itself',()=>{
 assert.equal(typeof ui.letterNextStep,'function');
 const state=createState(),before=structuredClone(state);
 assert.equal(ui.letterNextStep(state,'rain'),null);assert.equal(ui.letterNextStep(state,'unknown'),null);assert.deepEqual(state,before);
 state.letters.entries.rain.choice='invented';assert.equal(ui.letterNextStep(state,'rain'),null);
});

test('a reply directs the player only to unlocked unfinished gardens',()=>{
 const state=createState();state.letters.entries.rain.choice='tree';
 assert.equal(ui.letterNextStep(state,'rain').target,'garden','the locked wind garden is not a destination');
 state.p1.solved=true;
 assert.equal(ui.letterNextStep(state,'rain').target,'wind');
 state.letters.entries.wind.choice='sail';assert.equal(ui.letterNextStep(state,'wind').target,'garden','the locked tide garden is not a destination');
 state.wind.solved=true;assert.equal(ui.letterNextStep(state,'rain').target,'tide');assert.equal(ui.letterNextStep(state,'wind').target,'tide');
});

test('out-of-order legacy journeys check later gardens before wrapping to earlier ones',()=>{
 const state=createState();state.p1.solved=true;state.wind.solved=true;state.letters.entries.wind.choice='sail';
 assert.equal(ui.letterNextStep(state,'wind').target,'tide','later unanswered tide takes priority over earlier rain');
 state.letters.entries.tide.choice='old';assert.equal(ui.letterNextStep(state,'wind').target,'rain');assert.equal(ui.letterNextStep(state,'tide').target,'rain');
 state.letters.entries.rain.choice='tree';state.letters.entries.wind.choice=null;assert.equal(ui.letterNextStep(state,'tide').target,'wind');
});

test('every completed garden returns to the old platform only once all replies are written',()=>{
 const state=createState();state.letters.entries.rain.choice='tree';state.letters.entries.wind.choice='sail';state.letters.entries.tide.choice='new';
 const before=structuredClone(state);for(const id of ['rain','wind','tide'])assert.equal(ui.letterNextStep(state,id).target,'bridge');assert.deepEqual(state,before);
 state.bridge.solved=true;for(const id of ['rain','wind','tide'])assert.equal(ui.letterNextStep(state,id).target,'garden');
});
