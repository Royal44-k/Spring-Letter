/** Async observation tests with stub HTTP/DOM reads, no browser or writes. */
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const {readStyleIdentity,bindStyleIdentity}=require('./v12-style-identity.cjs');
const css=Buffer.from('body{color:#faf6ed}'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function page({href='./assets/a.css',count=1,bytes=css,ok=true}={}){
 return{url:()=> 'http://127.0.0.1:5193/nested/',locator(selector){assert.equal(selector,'link[rel~="stylesheet"][href]');return{count:async()=>count,first:()=>({getAttribute:async attribute=>{assert.equal(attribute,'href');return href;}})};},request:{get:async url=>{assert.equal(url,new URL(href,'http://127.0.0.1:5193/nested/').href);return{ok:()=>ok,body:async()=>bytes};}}};
}
(async()=>{
 let positive=0,negative=0;
 const expected={style:'./assets/a.css',styleSha256:sha(css)};
 assert.deepEqual(await readStyleIdentity(page()),expected);positive++;
 const target={};assert.deepEqual(await bindStyleIdentity(page(),target),expected);assert.deepEqual(target,expected);positive++;
 assert.deepEqual(await bindStyleIdentity(page(),target,undefined,expected),expected);positive++;
 for(const args of [{count:0},{count:2},{href:''},{ok:false}]){await assert.rejects(()=>readStyleIdentity(page(args)));negative++;}
 for(const args of [{href:'./assets/old.css'},{bytes:Buffer.from('body{color:black}')}]){
  await assert.rejects(()=>bindStyleIdentity(page(args),{...expected}));negative++;
  await assert.rejects(()=>bindStyleIdentity(page(args),{},undefined,expected));negative++;
 }
 console.log(JSON.stringify({passed:true,positiveChecks:positive,negativeChecks:negative,filesystemWrites:0,browserLaunched:false,networkRequests:0}));
})().catch(error=>{console.error(error);process.exitCode=1;});
