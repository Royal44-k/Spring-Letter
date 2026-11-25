/** Read the stylesheet named by the actual page, then hash its HTTP bytes.
 * No browser startup or mutation. Repeated binding rejects CSS-only changes.
 */
const assert=require('node:assert/strict'),crypto=require('node:crypto');
async function readStyleIdentity(page,url=page.url()){
 const links=page.locator('link[rel~="stylesheet"][href]');assert.equal(await links.count(),1,'exactly one built stylesheet is required');
 const style=await links.first().getAttribute('href');assert.ok(style,'actual HTML stylesheet href is required');
 if(process.env.EXPECTED_CSS)assert.equal(style,process.env.EXPECTED_CSS,'expected stylesheet differs');
 const response=await page.request.get(new URL(style,url).href);assert.ok(response.ok(),'actual stylesheet HTTP request failed');
 const styleSha256=crypto.createHash('sha256').update(await response.body()).digest('hex');
 if(process.env.EXPECTED_STYLE_SHA256)assert.equal(styleSha256,process.env.EXPECTED_STYLE_SHA256,'expected stylesheet bytes differ');
 return{style,styleSha256};
}
function sameStyleIdentity(actual,expected){for(const key of ['style','styleSha256'])assert.equal(actual[key],expected[key],'stylesheet identity changed: '+key);}
async function bindStyleIdentity(page,target,url=page.url(),baseline){
 const current=await readStyleIdentity(page,url);if(baseline)sameStyleIdentity(current,baseline);if(target.style!==undefined||target.styleSha256!==undefined)sameStyleIdentity(current,target);Object.assign(target,current);return current;
}
module.exports={readStyleIdentity,sameStyleIdentity,bindStyleIdentity};
