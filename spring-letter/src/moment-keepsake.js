// Personal letter illustrations. Only validated numeric/boolean artwork enters
// the SVG; all words, colours, element names and attributes are authored here.
// No DOM, network, audio, IDs, external references or mutable global state.
const CHOICES=Object.freeze({rain:['tree','shoot'],wind:['lamp','sail'],tide:['old','new']});
const PANE_NAMES=['tree','window','bloom'];
const WIND_ROUTE=Object.freeze([
 {id:'petal',distance:12,x:-1.05,y:1.55,kind:'petal'},
 {id:'lift',distance:28,x:.8,y:3.1,kind:'spiral'},
 {id:'weave',distance:43,x:-1.2,y:2.45,kind:'diamond'},
 {id:'shelter',distance:58,x:1.15,y:1.3,kind:'sail'},
 {id:'harbour',distance:72,x:0,y:2.05,kind:'harbour'},
]);
const INK='#41615c',MUTED='#81928a',LINE='#a7b7a7',GOLD='#b19a71',ROSE='#b88394',SEA='#80aaa6';
const num=v=>Number(Math.abs(v)<.0005?0:v.toFixed(3)).toString();
const safe=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finite=(value,min,max)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
const text=(value,x,y,size=13,color=INK,extra='')=>`<text x="${num(x)}" y="${num(y)}" font-size="${size}" fill="${color}" ${extra}>${safe(value)}</text>`;
const line=(x1,y1,x2,y2,color=LINE,width=1,extra='')=>`<path d="M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const path=(d,color=INK,width=1,fill='none',extra='')=>`<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill='none',stroke=LINE,extra='')=>`<ellipse cx="${num(x)}" cy="${num(y)}" rx="${num(rx)}" ry="${num(ry)}" fill="${fill}" stroke="${stroke}" ${extra}/>`;

function validArtwork(id,entry){
 if(!Object.hasOwn(CHOICES,id)||entry?.edition!==2||!CHOICES[id].includes(entry.choice))return null;
 const art=entry.artwork;if(!art||art.version!==1||typeof art!=='object')return null;
 if(id==='rain'){
  if(!PANE_NAMES.every(key=>finite(art.positions?.[key]?.x,-1.85,1.85)&&finite(art.positions?.[key]?.y,.63,2.86)))return null;
  return {choice:entry.choice,positions:Object.fromEntries(PANE_NAMES.map(key=>[key,{x:art.positions[key].x,y:art.positions[key].y}]))};
 }
 if(id==='wind'){
  if(!Number.isInteger(art.gate)||art.gate<0||art.gate>5||!finite(art.distance,0,73)||!finite(art.x,-2.65,2.65)||!finite(art.y,.55,4.05))return null;
  return {choice:entry.choice,gate:art.gate,distance:art.distance,x:art.x,y:art.y};
 }
 if(!Array.isArray(art.notes)||art.notes.length!==3||!art.notes.every(row=>Array.isArray(row)&&row.length===8&&row.every(v=>typeof v==='boolean')))return null;
 return {choice:entry.choice,notes:art.notes.map(row=>row.slice())};
}

function sprig(x,y,scale=1,color=INK){
 return `<g transform="translate(${num(x)} ${num(y)}) scale(${num(scale)})">${path('M0 0C-4-15 5-35 2-56',color,1.2)}${path('M0-12C-16-13-22-24-19-29C-7-29-1-22 0-12Z',color,.8,'none')}${path('M1-26C15-27 22-37 18-43C7-40 3-34 1-26Z',color,.8)}${path('M2-40C-8-43-12-50-9-56C0-53 2-47 2-40Z',color,.8)}${path('M1-14L-16-27M2-28L17-41',color,.55)}</g>`;
}
function blossom(x,y,scale=1,color=ROSE){
 let petals='';for(let i=0;i<6;i++)petals+=`<g transform="rotate(${i*60})">${path('M0 0C-11-5-15-20-3-25C8-28 13-12 0 0Z',color,.8,color,'fill-opacity=".12"')}</g>`;
 return `<g transform="translate(${num(x)} ${num(y)}) scale(${num(scale)})">${petals}${ellipse(0,0,3,3,GOLD,GOLD)}</g>`;
}
function paneMotif(id){
 if(id==='tree')return sprig(0,22,.80,'#53766a');
 if(id==='window')return path('M-17 23V-7C-17-30 17-30 17-7V23ZM0-23V23M-17 1H17M-21 25H21','#9a8663',.9);
 return `${path('M0 23C-2 13 2 4 0-5',ROSE,.8)}${blossom(0,-5,.78,ROSE)}${path('M0 18C-12 17-14 8-10 7C-3 9-1 13 0 18Z',INK,.7)}`;
}
function rainArt(art){
 let out=`<rect x="35" y="79" width="318" height="181" rx="6" fill="#e3e7db" stroke="#a5b6aa"/>${path('M45 249V91H343V249',INK,.8)}${line(50,247,338,247,GOLD,.7)}`;
 out+=`<g opacity=".12">${sprig(181,216,1.25)}${path('M208 218V167C208 143 241 143 241 167V218Z',INK,1)}${blossom(216,214,.75)}</g>`;
 const colors=['#b0cbb7','#d7c49b','#d7b0bd'];
 for(let i=0;i<3;i++){
  const id=PANE_NAMES[i],p=art.positions[id],x=194+p.x*43,y=169-(p.y-1.745)*43;
  out+=`<g data-pane="${id}" data-x="${num(p.x)}" data-y="${num(p.y)}" transform="translate(${num(x)} ${num(y)})"><rect x="-22.15" y="-29.24" width="44.3" height="58.48" rx="4" fill="${colors[i]}" fill-opacity=".15" stroke="#a78f69" stroke-width=".7"/><path d="M-19 22V-23" stroke="#fffdf1" stroke-width="1" opacity=".85"/>${paneMotif(id)}</g>`;
 }
 out+=text('花笺在光中的真实摆放',194,278,10,MUTED,'text-anchor="middle" letter-spacing="1.2"');
 if(art.choice==='tree')out+=`${sprig(576,188,1.35)}${sprig(604,191,.62,MUTED)}${path('M521 193Q566 178 616 193',LINE,.7)}${text('留住窗前的树影',388,119,18)}${text('这一处，留给回来的人。',388,146,12,MUTED)}${text('空白里，还可以再坐一个春天。',388,236,12,MUTED)}`;
 else out+=`${path('M564 202Q556 176 566 159M598 202Q606 182 598 171',INK,1)}${blossom(566,159,.89)}${blossom(598,171,.57)}${text('让窗里开出新花',388,119,18)}${text('这一处，留给还未到来的春天。',388,146,12,MUTED)}${text('旧日的光，也能照见新的生长。',388,236,12,MUTED)}`;
 return out;
}
const windPosition=g=>({x:53+g.distance/73*610,y:195-(g.y-1.55)*35+g.x*4});
function windGate(g,x,y,passed){
 let shape='';const color=passed?INK:LINE;
 if(g.kind==='diamond')shape=path('M0-17L15 0 0 17-15 0Z',color,1.1);
 else if(g.kind==='sail')shape=`${ellipse(0,0,17,12,'none',color)}${path('M-22-19L-22 17M22-15V18M-22-17Q-11-4-22 7M22-14Q31-2 22 10',color,.8)}`;
 else{shape=ellipse(0,0,g.kind==='harbour'?18:15,g.kind==='spiral'?18:15,'none',color);if(g.kind==='harbour')shape+=ellipse(0,0,21,21,'none',color,'opacity=".38"');if(g.kind==='petal')for(let i=0;i<5;i++)shape+=`<g transform="rotate(${i*72})">${path('M0-14Q-7-22 0-25Q7-22 0-14',color,.8)}</g>`;if(g.kind==='spiral')shape+=path('M-12 16C-36-3-11-33 14-17C32-2 15 17 4 9',color,.75);}
 return `<g data-gate="${g.id}" data-passed="${passed}" transform="translate(${num(x)} ${num(y)})" opacity="${passed?1:.52}">${shape}${passed?path('M-5 29Q1 18 7 21Q6 28-5 29Z',SEA,.7,SEA):ellipse(0,27,1.7,1.7,'none',LINE)}</g>`;
}
function windArt(art){
 const points=WIND_ROUTE.map(windPosition),route=`M53 200 ${points.map((p,i)=>`Q${num((i?points[i-1].x:53)+20)} ${num(p.y-11)} ${num(p.x)} ${num(p.y)}`).join(' ')}`;
 let out=`${path('M31 229Q163 204 272 229T489 229T691 229',LINE,.7,'none','opacity=".36"')}${path('M28 238Q169 216 287 239T520 238T693 237',LINE,.6,'none','opacity=".25"')}${path(route,GOLD,1,'none','stroke-dasharray="3 6" opacity=".7"')}`;
 for(let i=0;i<WIND_ROUTE.length;i++)out+=windGate(WIND_ROUTE[i],points[i].x,points[i].y,i<art.gate);
 const plane=windPosition({distance:art.distance,x:art.x,y:art.y});
 out+=`<g data-wing="saved-position" data-distance="${num(art.distance)}" transform="translate(${num(plane.x)} ${num(plane.y)}) rotate(-13)">${path('M-14 7L19-12 2 11-1 3-14 7Z',INK,.9,'#f4ecd5')}${path('M19-12L-1 3 2 11',GOLD,.75)}</g>`;
 out+=text('沿途风门',35,96,18)+text('经过的地方，留下一枚花叶。',35,117,12,MUTED)+text(art.choice==='lamp'?'将信送到迎客灯下':'将风留在护种帆上',680,96,13,INK,'text-anchor="end"');
 out+=text('风廊留影 · 风门与抵达位置',35,276,10,MUTED,'letter-spacing="1.1"')+text('风记得抵达过的地方。',680,276,11,MUTED,'text-anchor="end"');
 return out;
}
function tideArt(art){
 let out=text(art.choice==='old'?'旧曲旁，一句新回应。':'这段春声，寄向远方。',35,98,18),colors=[GOLD,ROSE,SEA],labels=['杯声','弦声','风声'];
 out+=path('M48 203Q117 181 184 198T322 197T460 197T604 197T685 193',LINE,.7,'none','opacity=".45"');
 for(let beat=0;beat<8;beat++){
  const x=92+beat*77,y=166+Math.sin(beat*.85)*9;
  out+=`<g data-beat="${beat}" data-keepsake-beat="${beat}" transform="translate(${num(x)} ${num(y)})">`;
  for(let voice=0;voice<3;voice++){
   const on=art.notes[voice][beat],color=colors[voice];out+=`<g data-cell="${voice}:${beat}" data-on="${on}">`;
   for(const angle of [voice*60,voice*60+180])out+=`<g transform="rotate(${angle})">${path('M0 0C-10-7-12-20-2-25C7-28 13-10 0 0Z',color,on?.95:.7,on?color:'none',`fill-opacity=".35" opacity="${on?1:.24}"`)}</g>`;
   out+='</g>';
  }
  const hasNote=art.notes.some(row=>row[beat]);out+=ellipse(0,0,2.4,2.4,hasNote?INK:'none',hasNote?INK:LINE)+text(String(beat+1),0,48,10,MUTED,'text-anchor="middle"')+'</g>';
 }
 for(let voice=0;voice<3;voice++)out+=`${ellipse(45+voice*80,256,3,3,colors[voice],colors[voice])}${text(labels[voice],55+voice*80,260,11,MUTED)}`;
 out+=text('八拍花谱 · 留白也是一拍',680,260,11,MUTED,'text-anchor="end"');
 return out;
}

/** Returns an inert, responsive SVG illustration of committed edition-2 art. */
export function renderMomentKeepsake(id,entry){
 try{
  const art=validArtwork(id,entry);if(!art)return '';
  const meta={rain:{index:'01',name:'花光暗房',caption:'三片花笺在光中的摆放，与写信时留下的照料。'},wind:{index:'02',name:'纸翼渡风',caption:'五扇沿途风门，已通过的标记与保存时的纸翼位置；不表示完整飞行轨迹。'},tide:{index:'03',name:'回声织信',caption:'真实三种声源与八拍音符组成的花谱。空白是未落下的声音；这是一幅静态作品摘要。'}}[id];
  const image=id==='rain'?rainArt(art):id==='wind'?windArt(art):tideArt(art);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="moment-keepsake" viewBox="0 0 720 300" width="100%" style="height:auto;display:block" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safe(meta.name+' · 我的春信留影')}" font-family="'Noto Serif SC','Songti SC',SimSun,serif"><title>${safe(meta.name+' · 我的春信留影')}</title><desc>${safe(meta.caption)}</desc><rect x="1" y="1" width="718" height="298" rx="12" fill="#f3f0e5" stroke="#c6cebb"/><rect x="10" y="10" width="700" height="280" rx="7" fill="none" stroke="#b5c2af" stroke-width=".6"/>${path('M25 61H695',LINE,.65)}${text('春信留影',35,39,19)}${text(meta.name,147,38,12,MUTED)}${text(meta.index+' / SPRING LETTER',680,37,10,MUTED,'text-anchor="end" letter-spacing="1.8"')}${image}</svg>`;
 }catch{return '';}
}
