import test from 'node:test';
import assert from 'node:assert/strict';
import {loadGardenSurfaces} from '../src/atmosphere-garden.js';

const module=await import('../src/asset-url.js').catch(()=>({}));
test('bundled assets resolve within both nested static hosts and root local hosting',()=>{
 assert.equal(typeof module.assetUrl,'function','the local asset URL resolver must exist');
 assert.equal(module.assetUrl('assets/audio/harp.wav','https://host.example/games/spring/'),'https://host.example/games/spring/assets/audio/harp.wav');
 assert.equal(module.assetUrl('assets/environment/studio.hdr','http://127.0.0.1:5192/'),'http://127.0.0.1:5192/assets/environment/studio.hdr');
});

test('index filenames, query strings and fragments do not move asset or license paths',()=>{
 const base='https://host.example/games/spring/index.html?embed=1&token=private#opening';
 assert.equal(module.assetUrl('assets/v7/rocky-trail-color.jpg',base),'https://host.example/games/spring/assets/v7/rocky-trail-color.jpg');
 assert.equal(module.assetUrl('ASSET_SOURCES.md',base),'https://host.example/games/spring/ASSET_SOURCES.md');
 assert.equal(module.assetUrl('THIRD_PARTY_LICENSES.txt',base),'https://host.example/games/spring/THIRD_PARTY_LICENSES.txt');
});

test('external, root-absolute, traversal and encoded paths are rejected before resolution',()=>{
 for(const path of ['https://cdn.example/a.jpg','//cdn.example/a.jpg','/assets/a.jpg','../a.jpg','assets/../a.jpg','assets/./a.jpg','assets//a.jpg','assets/%2e%2e/a.jpg','assets/a%2fb.jpg','assets\\a.jpg','assets/a.jpg?token=x','assets/a.jpg#x','',' assets/a.jpg','assets/a\n.jpg',null,{}])assert.throws(()=>module.assetUrl(path,'https://host.example/games/spring/'),TypeError,String(path));
});

test('only HTTP(S) document origins are supported for actual play; file URLs are not silently accepted',()=>{
 for(const base of ['file:///D:/Spring/index.html','data:text/html,x','javascript:alert(1)','not-a-url'])assert.throws(()=>module.assetUrl('assets/a.jpg',base),TypeError,base);
 assert.equal(module.assetUrl('assets/a.jpg','https://host.example/'),'https://host.example/assets/a.jpg');
});

test('default resolution reads the current document base and has a DOM-free relative fallback for Node tests',()=>{
 const previous=globalThis.document;
 try{globalThis.document={baseURI:'https://host.example/iframe/spring/index.html'};assert.equal(module.assetUrl('assets/a.jpg'),'https://host.example/iframe/spring/assets/a.jpg');globalThis.document=undefined;assert.equal(module.assetUrl('assets/a.jpg'),'./assets/a.jpg');}
 finally{globalThis.document=previous;}
});

test('the actual garden surface loader requests all four local files under the embedded game directory',async()=>{
 const previous=globalThis.document,requests=[];globalThis.document={baseURI:'https://host.example/games/spring/index.html'};
 try{const loaded=await loadGardenSurfaces({loader:{loadAsync:async url=>{requests.push(url);return {dispose(){}};}}});assert.equal(requests.length,4);assert.ok(requests.every(url=>url.startsWith('https://host.example/games/spring/assets/v7/')));loaded.dispose();}
 finally{globalThis.document=previous;}
});

