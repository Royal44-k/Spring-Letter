/** Leaf-channel puzzles. Directions are N,E,S,W; rules never depend on a renderer. */
const tile=(id,c,r,kind,turn=0,locked=false)=>Object.freeze({id,c,r,kind,turn,locked});
const outlet=(id,c,r,side,title,detail)=>Object.freeze({id,c,r,side,title,detail});
const base={line:[1,3],bend:[0,1],fork:[0,1,3]};
export const DIRECTIONS=Object.freeze([[0,-1],[1,0],[0,1],[-1,0]]);
export const LETTERS=Object.freeze([
 Object.freeze({id:'rain',title:'一瓢水的去处',sender:'禾 · 远舟的苗圃照料者',need:0,x:-12,z:-1,y:1.9,cols:3,rows:3,
  note:'我把最后一瓢雨留在石槽里。老树的根还在等，窗边的新芽也渴了。请你先照料一处；另一处，我回来以后再接手。',
  rule:'转动三块叶脉石，让雨沿着相接的沟槽，流进一座花池。',reward:'雨庭留下的一片叶，能让踏风后的气息恢复得更快。',
  tiles:[tile('a',0,1,'line',0,true),tile('b',1,1,'bend',0),tile('c',1,0,'bend',0),tile('d',2,0,'line',0,true),tile('e',1,2,'bend',2),tile('f',2,2,'line',0,true)],
  sources:[{c:-1,r:1,dir:1}],goals:[outlet('tree',3,0,3,'先浇老树','让归来的人仍有一片树荫'),outlet('shoot',3,2,3,'先浇新芽','让窗边先长出这一年的叶')],requiredSources:1,
  solutions:{tree:{b:3,c:1},shoot:{b:2,e:0}},
  replies:{tree:'致禾：我先浇了老树。叶子舒展开了，树下还能坐两个人。窗边的新芽，我留了一块指路的石头，等你回来接手。——弥',shoot:'致禾：窗边绿了一点。我先把雨水留给了新芽。老树还在，杯子也在，等你回来一起照料。——弥'} }),
 Object.freeze({id:'wind',title:'夜渡之前',sender:'阿渡 · 修帆学徒',need:1,x:12,z:-16,y:2.8,cols:4,rows:4,
  note:'今晚会有船靠岸。我只能先修好一件东西：裹住幼种的帆，或者渡口那盏迎客灯。先把漏风的旧井绕开，再替我选一个吧。',
  rule:'叉形叶脉会分流。不要把风送进灰色旧井；让一条完整的路通到帆或灯。',reward:'这阵风记住了来路：在信册中，可以乘花尘往返已回信的春庭。',
  tiles:[tile('a',0,1,'line',0,true),tile('b',1,1,'fork',0),tile('c',1,0,'bend',3),tile('d',2,0,'line',1),tile('e',3,0,'bend',0),tile('f',3,1,'bend',2),tile('g',1,2,'line',0),tile('h',1,3,'bend',2),tile('i',2,3,'line',1),tile('j',3,3,'bend',1),tile('k',3,2,'bend',0)],
  sources:[{c:-1,r:1,dir:1}],leaks:[{c:2,r:1,side:3}],goals:[outlet('lamp',4,1,3,'先点迎客灯','让晚到的人看得见岸'),outlet('sail',4,2,3,'先修护种帆','让幼种平稳地度过这一夜')],requiredSources:1,
  solutions:{lamp:{b:3,c:1,d:0,e:2,f:0},sail:{b:3,g:1,h:0,i:0,j:3,k:1}},
  replies:{lamp:'致阿渡：我先接通了迎客灯。远处有一盏小灯回应了一下。等下一艘船靠岸，就一起把帆缝好吧。——弥',sail:'致阿渡：我先把风引进了护种帆。种子没再被吹翻。我在岸边留了一列花，今晚也能循着它们找到渡口。——弥'} }),
 Object.freeze({id:'tide',title:'留给下一声',sender:'岑的旧记录 / 游絮的此刻',need:2,x:-12,z:-29,y:1.4,cols:4,rows:3,
  note:'岑留下的杯声走在一条沟槽里，游絮的回声走在另一条。让它们相遇，再决定：今夜先听完旧曲，还是为新的那一声留出空白。',
  rule:'两处泉眼必须同时到达同一座花池。先把两路接进叉形叶脉，再接向你想留下的声音。',reward:'游絮学会提前回应：金色花灵闭合时，也能看见下一次开放的节拍。',
  tiles:[tile('a',0,0,'line',0,true),tile('b',1,0,'bend',0),tile('c',0,2,'line',0,true),tile('d',1,2,'bend',1),tile('e',1,1,'fork',0),tile('f',2,1,'bend',0),tile('g',2,0,'bend',3),tile('h',3,0,'line',0,true),tile('i',2,2,'bend',2),tile('j',3,2,'line',0,true)],
  sources:[{c:-1,r:0,dir:1},{c:-1,r:2,dir:1}],goals:[outlet('old',4,0,3,'今夜先听完旧曲','两种声音一同守住原来的旋律'),outlet('new',4,2,3,'给新的声音留一拍','旧曲托住一句尚未唱过的回应')],requiredSources:2,
  solutions:{old:{b:2,d:3,e:1,f:3,g:1},new:{b:2,d:3,e:1,f:2,i:0}},
  replies:{old:'游絮跟着旧曲唱完了最后一拍。它没有变成记录里的人。那一小会儿，它只是愿意陪你听完。',new:'游絮在空出来的一拍里停了停，才添上自己的声音。旧曲没有消失，从这里起，多了一条可以接下去的路。'} }),
]);
export const letterById=id=>LETTERS.find(l=>l.id===id);
export const letterUnlocked=(letter,progress)=>!!letter&&(letter.need===0||(letter.need===1?progress?.p1?.solved:progress?.wind?.solved)===true);
export const tilePorts=(tile,turn=tile.turn)=>(base[tile.kind]||[]).map(d=>(d+turn)%4);
const fresh=letter=>({turns:Object.fromEntries(letter.tiles.map(t=>[t.id,t.turn])),choice:null,moves:0,read:false});
export const createLetters=()=>({version:1,entries:Object.fromEntries(LETTERS.map(l=>[l.id,fresh(l)]))});
export function restoreLetters(value){
 const clean=createLetters();if(value?.version!==1)return clean;
 for(const l of LETTERS){const old=value.entries?.[l.id],entry=clean.entries[l.id];if(!old||typeof old!=='object')continue;
  for(const t of l.tiles){const n=old.turns?.[t.id];if(!t.locked&&Number.isInteger(n)&&n>=0&&n<4)entry.turns[t.id]=n;}
  entry.choice=l.goals.some(g=>g.id===old.choice)?old.choice:null;if(old.edition===2){entry.edition=2;try{const artifact=JSON.stringify(old.artwork);if(artifact&&artifact.length<24000)entry.artwork=JSON.parse(artifact);}catch{}}entry.read=old.read===true;entry.moves=Number.isFinite(old.moves)?Math.floor(Math.max(0,Math.min(99999,old.moves))):0;
 }return clean;
}
/** Propagate each source separately. Every state (tile, incoming side, source) is visited once. */
export function evaluateLetter(letter,entry){
 const tiles=new Map(letter.tiles.map(t=>[t.c+','+t.r,t])),powered={},edges=[],goalSources=Object.fromEntries(letter.goals.map(g=>[g.id,[]])),leaks=[],stops=[];
 for(let source=0;source<letter.sources.length;source++){
  const s=letter.sources[source],queue=[{c:s.c,r:s.r,dir:s.dir,depth:0}],seen=new Set();
  while(queue.length){const step=queue.shift(),[dc,dr]=DIRECTIONS[step.dir],c=step.c+dc,r=step.r+dr,incoming=(step.dir+2)%4,key=c+','+r;
   const goal=letter.goals.find(g=>g.c===c&&g.r===r&&g.side===incoming),leak=letter.leaks?.find(g=>g.c===c&&g.r===r&&g.side===incoming);
   const edge={from:[step.c,step.r],to:[c,r],source,depth:step.depth};
   if(goal){edges.push(edge);if(!goalSources[goal.id].includes(source))goalSources[goal.id].push(source);continue;}
   if(leak){edges.push(edge);leaks.push({...edge,c,r});continue;}
   const t=tiles.get(key),ports=t?tilePorts(t,entry.turns[t.id]):[];
   if(!t||!ports.includes(incoming)){if(!letter.sources.some(s=>s.c===c&&s.r===r))stops.push({...edge,tile:t?.id||null});continue;}
   const visit=t.id+':'+incoming;if(seen.has(visit))continue;seen.add(visit);edges.push(edge);
   if(!powered[t.id])powered[t.id]=[];if(!powered[t.id].includes(source))powered[t.id].push(source);
   for(const dir of ports)if(dir!==incoming)queue.push({c,r,dir,depth:step.depth+1});
  }
 }
 const ready=letter.goals.filter(g=>goalSources[g.id].length===letter.requiredSources&&!leaks.length).map(g=>g.id);
 return {powered,edges,goalSources,ready,leaks,stops};
}
export function rotateLetter(letters,id,tileId,delta=1){
 const l=letterById(id),t=l?.tiles.find(t=>t.id===tileId);if(!t||t.locked)return false;
 const e=letters.entries[id];e.turns[tileId]=((e.turns[tileId]+Math.sign(delta||1))%4+4)%4;e.moves++;e.read=true;return true;
}
export function commitGardenLetter(letters,id,choice){
 const l=letterById(id),e=letters.entries[id];if(!l||!e||!evaluateLetter(l,e).ready.includes(choice))return {ok:false,reason:'先让花尘完整到达这座花池，再留下你的照料。'};
 const first=!e.choice,changed=e.choice!==choice;e.choice=choice;e.read=true;return {ok:true,first,changed,text:l.replies[choice],reward:l.reward};
}
export function letterHint(letter,entry){
 const evaluation=evaluateLetter(letter,entry);
 if(evaluation.ready.length)return '花尘已经抵达。选择亮起的花池，留下这份照料；也可以继续试另一条路。';
 if(evaluation.leaks.length)return '灰色旧井正在漏风。转动入口后的叉形叶脉，让风朝上、下两路走。';
 const found=letter.goals.find(g=>evaluation.goalSources[g.id].length>0);
 if(found&&letter.requiredSources===2)return '这里只收到一种声音。沿另一处泉眼往前找，把两路接进同一块叉形叶脉。';
 const stop=evaluation.stops.find(s=>s.tile);if(stop)return '花尘停在一块叶脉石边。选中它，让沟槽的开口对着来水；另一端接向下一块石。';
 return letter.rule;
}
export const completedLetters=letters=>LETTERS.filter(l=>letters?.entries?.[l.id]?.choice);
