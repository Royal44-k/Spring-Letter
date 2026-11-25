import test from 'node:test';
import assert from 'node:assert/strict';

const module=await import('../src/playtest-feedback.js').catch(()=>({}));
const answers=()=>({familiarity:'sometimes',continueInterest:'unsure',favorite:'light-collage',clarity:3,notes:'叠出花窗以后，想再留下一个自己的构图。'});
const summary=()=>({version:'0.7.0',playedSeconds:123.8,letters:['rain'],chapter:1,ending:null,quality:'balanced',viewport:{width:1440,height:900}});

test('a voluntary local playtest record contains only the stated answers and whitelisted game summary',()=>{
 assert.equal(typeof module.buildFeedback,'function','the local feedback builder must exist');
 const result=module.buildFeedback(answers(),summary());assert.equal(result.ok,true);assert.equal(result.data.answers.continueInterest,'unsure');assert.equal(result.data.session.playedSeconds,123);assert.deepEqual(result.data.session.letters,['rain']);
});

test('unknown fields, identity, browser identifiers and save contents never leak into the exported record',()=>{
 const a={...answers(),name:'PRIVATE_NAME',email:'PRIVATE_EMAIL',userAgent:'PRIVATE_UA'},s={...summary(),ip:'PRIVATE_IP',rawSave:'PRIVATE_SAVE',localStorage:{secret:'PRIVATE_STORAGE'},identity:'PRIVATE_ID',timestamp:'PRIVATE_TIME',viewport:{width:1440,height:900,userAgent:'PRIVATE_NESTED'},letters:['rain','PRIVATE_LETTER','rain',{},'wind']};
 const before=JSON.stringify([a,s]),result=module.buildFeedback(a,s),serialized=JSON.stringify(result.data);
 assert.equal(result.ok,true);assert.ok(!serialized.includes('PRIVATE_'));assert.deepEqual(Object.keys(result.data),['format','schemaVersion','answers','session']);assert.deepEqual(Object.keys(result.data.answers),['familiarity','continueInterest','favorite','clarity','notes']);
 assert.deepEqual(Object.keys(result.data.session),['version','playedSeconds','letters','chapter','ending','quality','viewport']);assert.deepEqual(result.data.session.viewport,{width:1440,height:900});assert.deepEqual(result.data.session.letters,['rain','wind']);assert.equal(JSON.stringify([a,s]),before);
});

test('blank or unknown subjective choices are rejected instead of being replaced with positive defaults',()=>{
 for(const field of ['familiarity','continueInterest','favorite'])for(const value of ['',undefined,'__proto__','constructor','other-value']){
  const result=module.buildFeedback({...answers(),[field]:value},summary());assert.equal(result.ok,false,field+' '+String(value));assert.equal(result.field,field);
 }
 assert.equal(module.buildFeedback({...answers(),continueInterest:'no',favorite:'none'},summary()).ok,true);
});

test('clarity requires an explicit integer from one through five',()=>{
 for(const value of [undefined,null,'3',0,6,2.5,NaN,Infinity])assert.equal(module.buildFeedback({...answers(),clarity:value},summary()).ok,false);
 for(const clarity of [1,2,3,4,5])assert.equal(module.buildFeedback({...answers(),clarity},summary()).data.answers.clarity,clarity);
});

test('notes can be omitted or blank, retain text literally, and cannot exceed 800 Unicode characters',()=>{
 for(const notes of [undefined,'','   '])assert.equal(module.buildFeedback({...answers(),notes},summary()).data.answers.notes,'');
 const content='<img src=x onerror=alert(1)>\n这是原样保留的文字。';assert.equal(module.buildFeedback({...answers(),notes:content},summary()).data.answers.notes,content);
 assert.equal(module.buildFeedback({...answers(),notes:'春'.repeat(800)},summary()).ok,true);assert.equal(module.buildFeedback({...answers(),notes:'春'.repeat(801)},summary()).ok,false);
 assert.equal(module.buildFeedback({...answers(),notes:'🌸'.repeat(800)},summary()).ok,true);assert.equal(module.buildFeedback({...answers(),notes:{}},summary()).ok,false);
});

test('invalid summary values fail explicitly rather than being invented as measured player behavior',()=>{
 const patches=[{version:'name@example.com'},{version:'0.6'},{playedSeconds:NaN},{playedSeconds:-1},{chapter:5},{chapter:'1'},{quality:'ultra'},{letters:null},{ending:'everybody-won'},{viewport:{width:0,height:900}},{viewport:{width:1440,height:Infinity}}];
 for(const patch of patches){const result=module.buildFeedback(answers(),{...summary(),...patch});assert.equal(result.ok,false,JSON.stringify(patch));assert.equal(result.field,'summary');}
 assert.equal(module.buildFeedback(answers(),null).ok,false);assert.equal(module.buildFeedback(null,summary()).ok,false);
});
