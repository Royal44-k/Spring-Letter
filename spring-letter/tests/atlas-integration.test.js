import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createState,serialize,restore,SAVE_KEY} from '../src/game-model.js';
import {createSaveService,LEGACY_KEYS,ARCHIVE_KEY} from '../src/save-service.js';
import {atlasCommand,atlasComplete} from '../src/atlas-model.js';
import {voyageCommand} from '../src/voyage-model.js';
import {readPreferences} from '../src/preferences.js';
import {renderAtlasMap} from '../src/atlas-map.js';
import {ATLAS_LOCATIONS} from '../src/atlas-content.js';

const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
function productionFunction(name){const begin=source.indexOf('function '+name+'(');assert.ok(begin>=0);const end=source.indexOf('\nfunction ',begin+1);return source.slice(begin,end<0?undefined:end);}
const routes=['visitAtlas','continueToCoast','showMap','startGame','exitFocus','depart','showEnding'].map(productionFunction).join('\n');
const garden=()=>{const s=createState();s.started=true;s.story.introSeen=true;s.p1.solved=s.wind.solved=s.bridge.solved=true;s.cores=['memory','season'];return s;};
const completeAtlas=s=>{s.atlas.blooms=[1,1,1];s.atlas.stars=[0,1,2,3,4,0,5,2];s.atlas.meadowCheckpoint=4;s.atlas.completed=['conservatory','observatory','meadow'];};
const node=()=>({hidden:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){}});

function fixture({saved=null,empty=false,mode='play'}={}){
 const store=new Map(),storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value)),removeItem:key=>store.delete(key)},service=createSaveService(storage);
 const initial=saved||garden();if(!empty)service.commit({journey:JSON.stringify(initial)});else service.read();
 const nodes=new Map(),calls=[],failures=[];let mapButtons=[];
 const c={state:empty?createState():restore(JSON.stringify(initial)),mode,focus:null,createState,serialize,restore,SAVE_KEY,saveService:service,readPreferences,atlasComplete,renderAtlasMap,structuredClone,
  lastSaveResult:null,autoFlowerEntered:false,lastChapter:-1,displayBloom:0,endingRevealAt:0,autoRotate:false,scatterTarget:0,
  storageGet:key=>{const field=Object.entries(LEGACY_KEYS).find(([,value])=>value===key)?.[0];return field?service.read().data?.[field]??null:storage.getItem(key);},
  renderBlocked:()=>false,readResonance:()=>null,syncStorageNotice(){},terrainAt:()=>null,
  resonance:{persist:()=>'{"version":1,"records":{}}',reset(){}},letterController:{reset(){},exit(){}},viewRig:{reset(){}},orbit:{enabled:false,autoRotate:false},
  delivery:{carried:null,restoreCarried(value){this.carried=value;}},world:{group:{visible:true},player:{visible:true}},bouquet:{group:{visible:true}},
  switchFlowerForm(){},switchFlowerSeries(){},setPenMode(){},syncSound(){},applyQuality(){},setNight(){},updateUI(){},clearInput(){},
  audio:{unlock(){},chime(){}},caption:text=>calls.push(['caption',text]),toast:text=>calls.push(['toast',text]),matchMedia:()=>({matches:false}),
  savePanel:{notifyFailure:error=>failures.push(error),show:()=>calls.push(['save-panel'])},document:{body:{classList:{add(){},remove(){}}}},
  $:id=>{if(id==='map-voyage'&&!nodes.has(id))return null;if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},all:selector=>selector==='[data-atlas-location]'?mapButtons:[],
  closeModal(){c.modalOpen=false;},openModal(html){c.modalOpen=true;c.modalHTML=html;mapButtons=[...html.matchAll(/data-atlas-location="([^"]+)"/g)].map(match=>({...node(),dataset:{atlasLocation:match[1]}}));nodes.set('map-garden',node());nodes.delete('map-voyage');if(html.includes('id="map-voyage"'))nodes.set('map-voyage',node());},
 };
 c.storyDirector={exitBranch(){},startOpening(){calls.push(['opening']);c.mode='opening';},cancelOpening(){calls.push(['cancel-opening']);}};
 c.atlas={active:false,start(id){id||=ATLAS_LOCATIONS.find(place=>!c.state.atlas.completed.includes(place.id))?.id||'conservatory';c.state.atlas=atlasCommand(c.state.atlas,'enter',{id}).state;this.active=true;c.focus='atlas';calls.push(['atlas',id]);return true;},stop({preserveLocation=false}={}){this.active=false;if(!preserveLocation)c.state.atlas=atlasCommand(c.state.atlas,'leave').state;}};
 c.voyage={active:false,start(){this.active=true;c.focus='voyage';if(c.state.voyage.stage==='idle')c.state.voyage=voyageCommand(c.state.voyage,'begin').state;calls.push(['voyage']);},stop(){this.active=false;}};
 c.resetPresentation=()=>{c.atlas.stop({preserveLocation:true});c.voyage.stop();c.focus=null;};
 c.save=()=>service.commit({journey:serialize(c.state),preferences:JSON.stringify(c.state.settings)});
 vm.createContext(c);vm.runInContext(routes,c);
 return {c,calls,service,storage,nodes,failures,buttons:()=>mapButtons,scenes:()=>calls.filter(call=>['atlas','voyage','opening'].includes(call[0]))};
}

test('a freshly completed garden saves its departure checkpoint and enters the first new map before the coast',()=>{
 const f=fixture(),before=serialize(f.c.state);f.c.depart();assert.deepEqual(f.scenes(),[['atlas','conservatory']]);assert.equal(f.c.state.voyage.stage,'idle');assert.equal(f.c.state.ending,null);assert.equal(f.service.read().data.beforeLetter,before);
});

test('the coast route always selects the first unfinished map until all three earned rewards are present',()=>{
 const f=fixture();f.c.continueToCoast();assert.deepEqual(f.scenes().at(-1),['atlas','conservatory']);
 f.c.state.atlas.blooms=[1,1,1];f.c.state.atlas.completed=['conservatory'];f.c.continueToCoast();assert.deepEqual(f.scenes().at(-1),['atlas','observatory']);
 f.c.state.atlas.stars=[0,1,2,3,4,0,5,2];f.c.state.atlas.completed.push('observatory');f.c.continueToCoast();assert.deepEqual(f.scenes().at(-1),['atlas','meadow']);
 completeAtlas(f.c.state);f.c.continueToCoast();assert.deepEqual(f.scenes().at(-1),['voyage']);assert.equal(f.c.state.atlas.location,null);assert.equal(f.c.state.voyage.stage,'writing');
});

test('finishing the three freely accessible maps cannot bypass missing garden seeds',()=>{
 const f=fixture({saved:createState()});completeAtlas(f.c.state);f.c.continueToCoast();assert.deepEqual(f.scenes(),[]);assert.equal(f.c.state.voyage.stage,'idle');assert.equal(f.c.state.ending,null);
});

test('legacy coastal progress and legacy endings can continue without fabricated atlas completion',()=>{
 for(const ended of [false,true]){const saved=garden();delete saved.atlas;saved.voyage.stage='writing';saved.voyage.letter={recipient:'你',body:'旧信仍在。',sealed:true,sealKind:'iris'};if(ended)saved.ending='memory+season';const f=fixture({saved});const letter={...f.c.state.voyage.letter};f.c.continueToCoast();assert.deepEqual(f.scenes(),[['voyage']]);assert.deepEqual(f.c.state.atlas.completed,[]);assert.deepEqual(f.c.state.voyage.letter,letter);assert.equal(f.c.state.ending,ended?'memory+season':null);}
});

test('an older ending without coastal data still continues to the coast instead of losing its ending',()=>{
 const saved=garden();delete saved.atlas;delete saved.voyage;saved.ending='memory+season';const f=fixture({saved});f.c.showEnding();assert.deepEqual(f.scenes(),[['voyage']]);assert.equal(f.c.state.ending,'memory+season');assert.deepEqual(f.c.state.atlas.completed,[]);
});

test('continue resumes the active atlas map before a retained voyage or ending',()=>{
 const saved=garden();saved.ending='memory+season';saved.voyage.stage='writing';saved.voyage.letter={recipient:'未来的我',body:'不要忘记这一天。',sealed:true,sealKind:'lily'};saved.atlas=atlasCommand(saved.atlas,'enter',{id:'observatory'}).state;saved.atlas.player={x:0,y:1.8,z:-18,vy:0,grounded:true,gliding:false};saved.atlas.stars=[0,1,2];
 const f=fixture({saved,mode:'cover'});f.c.startGame(true);assert.deepEqual(f.scenes(),[['atlas','observatory']]);assert.equal(f.c.state.atlas.player.z,-18);assert.deepEqual(f.c.state.atlas.stars,[0,1,2]);assert.equal(f.c.state.ending,'memory+season');assert.equal(f.c.state.voyage.letter.body,'不要忘记这一天。');
});

test('continue uses the old coastal scene when no atlas location was saved',()=>{
 const saved=garden();delete saved.atlas;saved.voyage.stage='writing';saved.voyage.letter.body='还没写完的一句';const f=fixture({saved,mode:'cover'});f.c.startGame(true);assert.deepEqual(f.scenes(),[['voyage']]);assert.equal(f.c.state.voyage.letter.body,'还没写完的一句');assert.deepEqual(f.c.state.atlas.visited,[]);
});

test('fresh cover map entry creates a valid new journey and cancels the opening before entering the requested map',()=>{
 const f=fixture({empty:true,mode:'cover'});f.c.showMap();assert.equal(f.buttons().length,3);f.buttons().find(button=>button.dataset.atlasLocation==='meadow').onclick();assert.equal(f.c.mode,'play');assert.equal(f.c.focus,'atlas');assert.deepEqual(f.scenes().at(-1),['atlas','meadow']);assert.equal(f.c.state.started,true);assert.equal(f.c.state.atlas.location,'meadow');assert.ok(f.calls.some(call=>call[0]==='cancel-opening'));assert.equal(f.service.read().ok,true);assert.equal(f.c.state.bridge.solved,false);
});

test('the cover map loads a legacy journey before visiting a new destination without changing its letter',()=>{
 const saved=garden();saved.voyage.stage='writing';saved.voyage.letter={recipient:'岑',body:'这一封会带到远方。',sealed:true,sealKind:'iris'};delete saved.atlas;const f=fixture({saved,mode:'cover'});f.c.showMap();f.buttons()[0].onclick();assert.equal(f.c.state.atlas.location,'conservatory');assert.equal(f.c.voyage.active,false);assert.equal(f.c.state.voyage.letter.body,'这一封会带到远方。');
});

test('a failed new-journey write from the cover never enters a map or silently overwrites the archive',()=>{
 const f=fixture({empty:true,mode:'cover'});f.storage.setItem=()=>{throw Error('quota');};f.c.visitAtlas('conservatory');assert.equal(f.c.mode,'cover');assert.equal(f.c.atlas.active,false);assert.deepEqual(f.scenes(),[]);assert.equal(f.failures[0].code,'write');assert.equal(f.storage.getItem(ARCHIVE_KEY),null);
});

test('the map coast button obeys the same new-map route gate rather than bypassing it',()=>{
 const f=fixture();f.c.showMap();assert.ok(f.nodes.get('map-voyage'));f.nodes.get('map-voyage').onclick();assert.deepEqual(f.scenes(),[['atlas','conservatory']]);assert.equal(f.c.state.voyage.stage,'idle');
});

test('return to the garden from a cover map does not accidentally reopen the saved atlas location',()=>{
 const saved=garden();saved.atlas=atlasCommand(saved.atlas,'enter',{id:'observatory'}).state;const f=fixture({saved,mode:'cover'});f.c.showMap();f.nodes.get('map-garden').onclick();assert.equal(f.c.mode,'play');assert.equal(f.c.focus,null);assert.equal(f.c.atlas.active,false);assert.equal(f.c.state.atlas.location,null);
});

test('a carried seed prevents map travel without discarding or moving that seed',()=>{
 const f=fixture();f.c.delivery.carried=0;const before=serialize(f.c.state);f.c.visitAtlas('conservatory');assert.deepEqual(f.scenes(),[]);assert.equal(f.c.delivery.carried,0);assert.equal(serialize(f.c.state),before);
});

const realLegacy=JSON.parse(readFileSync(new URL('./fixtures/v11-earned-archives.json',import.meta.url),'utf8'));
for(const [name,{archive}] of Object.entries(realLegacy))test(`${name}: main resumes the earned v0.8 coast and returns from an independent map without an atlas gate`,()=>{
 const saved=JSON.parse(archive.data.journey),f=fixture({saved,mode:'cover'}),letter=structuredClone(saved.voyage.letter);
 f.c.startGame(true);assert.deepEqual(f.scenes(),[['voyage']]);assert.equal(f.c.state.voyage.stage,saved.voyage.stage);assert.deepEqual(f.c.state.voyage.letter,letter);assert.equal(f.c.state.ending,saved.ending);
 f.c.showMap();f.buttons().find(button=>button.dataset.atlasLocation==='observatory').onclick();assert.equal(f.c.state.atlas.location,'observatory');
 const resumed=fixture({saved:JSON.parse(serialize(f.c.state)),mode:'cover'});resumed.c.startGame(true);assert.deepEqual(resumed.scenes(),[['atlas','observatory']]);
 resumed.c.continueToCoast();assert.deepEqual(resumed.scenes().at(-1),['voyage']);assert.equal(resumed.c.state.atlas.location,null);assert.deepEqual(resumed.c.state.atlas.completed,[]);assert.equal(resumed.c.state.voyage.stage,saved.voyage.stage);assert.deepEqual(resumed.c.state.voyage.letter,letter);assert.equal(resumed.c.state.ending,saved.ending);
});
