const fs=require('node:fs'),p=require('node:path').join(__dirname,'v8-full-play.cjs');let s=fs.readFileSync(p,'utf8');
function r(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,70));s=s.replace(a,b);}
r("assert.equal((await h.snap()).state.p1.solved,true);await p.locator('#letter-close').click();", "assert.equal((await h.snap()).state.p1.solved,true);await p.locator('#letter-continue').click();assert.equal((await h.snap()).focus,null);assert.equal((await h.snap()).letters.trackedId,'wind');");
r("await p.locator('#letter-close').click();await p.locator('#journal').click();", "await p.locator('#letter-continue').click();assert.equal((await h.snap()).letters.trackedId,'tide');await p.locator('#journal').click();");
r("await p.locator('#letter-close').click();await h.routeTo([[-8.6,-31]", "await p.locator('#letter-continue').click();assert.equal((await h.snap()).state.bridge.solved,false);await p.waitForTimeout(250);assert.match(await p.locator('#letter-target b').innerText(),/旧石台/);mark('all three next-step controls hand off to walking goals; final reply points along the shore to bridge writing');await h.routeTo([[-8.6,-31]");
fs.writeFileSync(p,s);
