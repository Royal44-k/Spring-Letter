import './resonance-ui.css';
export function mountResonanceUI({onAttempt,onCancel,onDash}){
 const element=document.createElement('section');element.id='wind-run';element.hidden=true;element.setAttribute('aria-label','追风送春');
 element.innerHTML='<div class="run-heading"><small>追风送春</small><strong></strong><button class="run-cancel" aria-label="结束这次追风">×</button></div><div class="run-body"><div><h3></h3><p></p><div class="run-numbers"><span class="run-count"></span><span class="run-time"></span><span class="run-score"></span></div></div><canvas width="120" height="120" aria-label="花灵与花巢的方位盘"></canvas></div><div class="run-action"><button class="run-attempt"></button><span class="run-best"></span></div>';
 document.body.append(element);
 const dash=document.createElement('button');dash.id='dash-control';dash.hidden=true;dash.setAttribute('aria-label','按住踏风加速');dash.innerHTML='<span>踏风 <kbd>Shift</kbd></span><i><b></b></i>';document.body.append(dash);
 const $=s=>element.querySelector(s),canvas=$('canvas'),ctx=canvas.getContext('2d');
 $('.run-attempt').onclick=onAttempt;$('.run-cancel').onclick=onCancel;
 dash.onpointerdown=e=>{e.preventDefault();dash.setPointerCapture(e.pointerId);onDash(true);};dash.onpointerup=dash.onpointercancel=()=>onDash(false);
 let cache='';
 return {update({context:c={},snapshot:s={},player,mode,focus,dash:wind,azimuth=0,deliveryAction=false,forecast=false}){
  const visible=mode==='play'&&!focus&&(c.active||(c.atStart&&!deliveryAction));element.hidden=!visible;dash.hidden=mode!=='play'||!!focus;document.body.classList.toggle('resonating',!!c.active&&mode==='play');
  dash.querySelector('b').style.width=Math.round(wind.energy*100)+'%';dash.classList.toggle('is-dashing',wind.active);dash.classList.toggle('is-tired',wind.exhausted);dash.setAttribute('aria-pressed',String(wind.active));
  if(!visible)return;
  const key=JSON.stringify([c.title,c.hint,c.objective,c.active,c.collected,c.goal,Math.ceil(c.remaining||0),c.combo,c.score,c.actionLabel,c.readyToBank,c.atStart,c.best]);
  if(key!==cache){cache=key;$('strong').textContent=c.title||'一阵风的来信';$('h3').textContent=c.objective||'把花灵送回花巢';$('p').textContent=c.hint||'按住 Shift 踏风。连续接住花灵，回到花巢按 E 送回。';$('.run-count').textContent=c.active?`${c.collected??0} / ${c.total??8} 花灵`:'';$('.run-time').textContent=c.active?`${Math.ceil(c.remaining||0)} 秒`:'';$('.run-score').textContent=c.active?`${c.score||0} · ×${c.combo||1}`:'';$('.run-attempt').textContent=c.atStart?(c.actionLabel||'开始追风')+'  E':'走近发光的花巢';$('.run-attempt').disabled=!c.atStart;$('.run-attempt').hidden=c.active&&(!c.atStart||!c.readyToBank);$('.run-cancel').hidden=!c.active;$('.run-best').textContent=c.best?`最好 ${typeof c.best==='object'?c.best.score||0:c.best}`:c.active?(c.movementRule==='escort'?'银灵等游絮 · 金灵可先行':c.movementRule==='slow-fast'?'银灵缓行 · 金灵踏风':'银灵走近 · 金灵踏风'):'允许重试，不影响旅途';}
  canvas.hidden=!c.active;if(!c.active)return;
  const nodes=s.nodes||s.run?.nodes||[],center=s.center||s.run?.center||c.center||{x:0,z:0};
  ctx.clearRect(0,0,120,120);ctx.strokeStyle='rgba(213,234,224,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(60,60,54,0,Math.PI*2);ctx.stroke();
  const project=p=>{const dx=p.x-player.x,dz=p.z-player.z,x=(dx*Math.cos(azimuth)-dz*Math.sin(azimuth))*7,y=(dx*Math.sin(azimuth)+dz*Math.cos(azimuth))*7,scale=Math.min(1,49/Math.max(.001,Math.hypot(x,y)));return {x:60+x*scale,y:60+y*scale};};
  for(const n of nodes){if(n.collected)continue;const p=project(n);ctx.fillStyle=n.open===false||n.available===false?'#858d85':n.requiresDash?'#f5c16d':'#d7ede1';ctx.beginPath();ctx.arc(p.x,p.y,n.open===false?1.7:2.5,0,7);ctx.fill();if(forecast&&n.open===false&&n.requiresDash){ctx.strokeStyle='#f5c16d';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(p.x,p.y,4.7,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-(n.untilOpen||0)/1.56));ctx.stroke();}}
  if(s.escort){const p=project(s.escort);ctx.strokeStyle='#9edfe7';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(60,60);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle='#ace9f3';ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,7);ctx.fill();}
  for(const h of s.hazards||[]){const p=project(h);ctx.strokeStyle='#e799a1';ctx.beginPath();ctx.arc(p.x,p.y,4,0,7);ctx.stroke();}
  const nest=s.start||c.start||center;if(nest){const p=project(nest);ctx.strokeStyle='#efac8f';ctx.strokeRect(p.x-4,p.y-4,8,8);}
  ctx.fillStyle='#fff9e7';ctx.beginPath();ctx.moveTo(60,54);ctx.lineTo(56,64);ctx.lineTo(64,64);ctx.closePath();ctx.fill();
 },dispose(){element.remove();dash.remove();}};
}
