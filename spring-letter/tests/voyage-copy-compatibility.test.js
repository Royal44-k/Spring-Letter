import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {restore} from '../src/game-model.js';
import {voyageStageInfo} from '../src/voyage-model.js';
import {VOYAGE_CHAPTERS} from '../src/voyage-content.js';

const source=readFileSync(new URL('../src/voyage-controller.js',import.meta.url),'utf8');
const start=source.indexOf(' function sync('),end=source.indexOf('\n function ',start+1),sync=source.slice(start,end);
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/v11-earned-archives.json',import.meta.url),'utf8'));
function render(game){
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,classList:{toggle(){}},style:{},focus(){}});return nodes.get(id);};
 const c={active:true,state:()=>game.voyage,getState:()=>game,lastStage:'',hint:'',voyageStageInfo,VOYAGE_CHAPTERS,roman:['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'],$:node,readOpen:false,endingOpen:false,readPanel:node('reading'),end:node('end'),touch:node('touch'),bag:{hidden:true},heading:node('heading'),tools:node('tools'),editor:node('editor'),actionPanel:node('action'),marker:node('marker'),root:node('root'),travel:{reset(){}},makeActions(){},document:{body:{dataset:{}}},orbitYaw:0,orbitPitch:0,manualCamera:0,departureAge:0};
 vm.createContext(c);vm.runInContext(sync,c);c.sync();return {node,c};
}
for(const mode of ['legacy','partial','complete'])test(`writing ${mode} introduction preserves the already sealed letter and native read-only controls`,()=>{
 const game=restore(fixtures['earned-writing'].archive.data.journey);
 if(mode==='legacy')delete game.atlas;else game.atlas.completed=mode==='partial'?['conservatory']:['conservatory','observatory','meadow'];
 const before=structuredClone(game),{node}=render(game);
 assert.deepEqual(game,before,'presentation must not write the player letter or earned progress');
 assert.equal(node('voyage-recipient').value,game.voyage.letter.recipient);assert.equal(node('voyage-body').value,game.voyage.letter.body);
 assert.equal(node('voyage-recipient').readOnly,true);assert.equal(node('voyage-body').readOnly,true);assert.equal(node('voyage-seal').disabled,true);assert.equal(node('voyage-reopen').hidden,false);
 assert.match(node('voyage-chapter').textContent,/^Ⅸ \/ Ⅻ/);
 if(mode==='complete')assert.match(node('voyage-paper-intro').textContent,/循星辨路/);else assert.doesNotMatch(node('voyage-paper-intro').textContent,/循星辨路/);
});

test('rendering the real v0.8 ending retains its exact recipient and body with no map completion requirement',()=>{
 const game=restore(fixtures['earned-complete'].archive.data.journey),before=structuredClone(game),{node,c}=render(game);
 assert.deepEqual(game,before);assert.equal(node('voyage-end-recipient').textContent,'收信人 · '+game.voyage.letter.recipient);assert.equal(node('voyage-end-body').textContent,game.voyage.letter.body);assert.equal(c.end.hidden,false);assert.deepEqual(game.atlas.completed,[]);
});
