import {LETTERS,letterById,letterUnlocked,evaluateLetter,rotateLetter,commitGardenLetter,letterHint,completedLetters} from './letter-model.js';
import {createLetterGarden,letterTilePosition,letterBoardBounds} from './letter-garden.js';
import {mountLetterUI,letterNextStep} from './letter-ui.js';
import {letterWaypoint} from './letter-wayfinding.js';
import {Vector3} from 'three';

export function createLetterController({getState,onFocus,onExit,onSave,onReply,onSound,onBook,onContinue}){
 const garden=createLetterGarden();let activeId=null,selectedId=null,trackedId='rain',trackingRevisit=false,hint='',history=[],nearId=null,waypoint=null,wayAt=-1,wayId=null;
 const marker=document.createElement('div');marker.id='letter-target';marker.hidden=true;marker.innerHTML='<b></b><span></span>';document.body.append(marker);const markerPoint=new Vector3();
 const ui=mountLetterUI({onOpen:enter,onClose:exit,onRotate:rotate,onUndo:undo,onHint:showHint,onBook,onCommit:commit,onContinue:continueJourney,onSelect:id=>{selectedId=id;}});
 function enter(id){const s=getState(),l=letterById(id);if(!letterUnlocked(l,s)||Math.hypot(s.player.x-l.x,s.player.z-l.z)>4.3)return false;
  activeId=id;trackedId=id;trackingRevisit=false;selectedId=l.tiles.find(t=>!t.locked).id;history=[];hint='';s.letters.entries[id].read=true;onFocus(id);onSave();return true;
 }
 function exit(){activeId=null;selectedId=null;hint='';history=[];onExit();}
 function continueJourney(id){if(id!==activeId)return;const s=getState(),step=letterNextStep(s,id);if(!step)return;const next=letterById(step.target);if(next)trackedId=next.id;trackingRevisit=false;exit();wayAt=-1;onContinue?.(id,next?.id||null);}
 function rotate(delta=1){if(!activeId)return;const l=letterById(activeId),e=getState().letters.entries[activeId],ready=evaluateLetter(l,e).ready;const before={...e.turns};if(rotateLetter(getState().letters,activeId,selectedId,delta)){history.push(before);if(history.length>80)history.shift();hint='';onSound?.('turn',{id:activeId,tile:selectedId.charCodeAt(0)-97,pan:(l.tiles.find(t=>t.id===selectedId).c/(l.cols-1)-.5)*.7});if(evaluateLetter(l,e).ready.some(id=>!ready.includes(id)))onSound?.('connected',{id:activeId});onSave();}}
 function undo(){if(!activeId||!history.length)return;getState().letters.entries[activeId].turns=history.pop();hint='';onSound?.('turn');onSave();}
 function showHint(){if(!activeId)return;const l=letterById(activeId),e=getState().letters.entries[activeId];hint=letterHint(l,e);const stop=evaluateLetter(l,e).stops.find(s=>s.tile&&!l.tiles.find(t=>t.id===s.tile)?.locked);if(stop)selectedId=stop.tile;}
 function commit(choice){if(!activeId)return;const s=getState(),r=commitGardenLetter(s.letters,activeId,choice);if(!r.ok){hint=r.reason;return;}hint='你的回信已经留下。可以停一会儿，也可以继续上路。';onReply(activeId,choice,r);onSave();}
 function chooseDirection(dc,dr){const l=letterById(activeId),current=l.tiles.find(t=>t.id===selectedId);const candidates=l.tiles.filter(t=>!t.locked&&((dc&&(t.c-current.c)*dc>0)||(dr&&(t.r-current.r)*dr>0)));
  candidates.sort((a,b)=>{const score=t=>dc?Math.abs(t.r-current.r)*4+Math.abs(t.c-current.c):Math.abs(t.c-current.c)*4+Math.abs(t.r-current.r);return score(a)-score(b);});if(candidates[0])selectedId=candidates[0].id;
 }
 return {group:garden.group,get activeId(){return activeId;},get selectedId(){return selectedId;},get nearId(){return nearId;},get trackedId(){return trackedId;},
  enter,exit,rotate,undo,commit,
  musicState(){const l=letterById(activeId),e=l?getState().letters.entries[l.id]:null;return {letter:l?.id||null,letterChoice:e?.choice||null,letterConnected:!!l&&evaluateLetter(l,e).ready.length>0};},
  reset(){activeId=null;selectedId=null;history=[];hint='';nearId=null;trackingRevisit=false;trackedId=LETTERS.find(l=>!getState().letters.entries[l.id].choice)?.id||'rain';},
  track(id){if(letterById(id)){trackedId=id;trackingRevisit=true;wayAt=-1;}},
  pick(raycaster){const pick=garden.pick(raycaster);if(activeId&&pick?.letterId===activeId){selectedId=pick.tileId;rotate();return true;}if(activeId&&garden.pickSource(raycaster)===activeId)return this.burst();return false;},
  burst(){const ok=garden.burstSource(activeId);if(ok)onSound?.('source',{id:activeId});return ok;},
  handleKey(event){if(!activeId||event.target?.matches?.('input,select,textarea,button,summary'))return false;
   if(event.code==='Enter'||event.code==='Space'){if(!event.repeat)rotate();return true;}
   const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(directions[event.code]){chooseDirection(...directions[event.code]);return true;}
   if(event.code==='KeyZ'){undo();return true;}if(event.code==='KeyH'){showHint();return true;}return false;
  },
  bounds(){if(!activeId)return null;const b=letterBoardBounds(letterById(activeId));return {min:[b.min.x,b.min.y,b.min.z],max:[b.max.x,b.max.y,b.max.z]};},
  update(time,dt,{mode,focus,palette,reducedMotion,quality,challengeActive,camera,heightAt}){
   const s=getState();nearId=mode==='play'&&!focus&&!challengeActive?LETTERS.find(l=>letterUnlocked(l,s)&&Math.hypot(s.player.x-l.x,s.player.z-l.z)<3.9)?.id||null:null;
   if(!activeId&&!trackingRevisit&&s.letters.entries[trackedId]?.choice){const next=LETTERS.find(l=>letterUnlocked(l,s)&&!s.letters.entries[l.id].choice);if(next)trackedId=next.id;}
   garden.group.visible=mode==='play'||mode==='opening';garden.update(time,dt,{letters:s.letters,progress:s,activeId,selectedId,palette,reducedMotion,quality,flowerForm:s.settings.flowerForm});
   ui.update({state:s,mode,focus,activeId,selectedId,nearId,trackedId,hint,canUndo:history.length>0,challengeActive});
   const target=letterById(trackedId),bridgeLead=!trackingRevisit&&completedLetters(s.letters).length===3&&s.wind.solved&&!s.bridge.solved&&s.bridge.platform!=='M',guidanceId=bridgeLead?'bridge':trackedId,show=mode==='play'&&!focus&&!challengeActive&&(bridgeLead||target&&(trackingRevisit||!s.letters.entries[trackedId].choice)&&letterUnlocked(target,s));
   marker.hidden=!show;
   if(show&&camera){
    if(time-wayAt>.15||wayId!==guidanceId){waypoint=letterWaypoint(guidanceId,s.player,s);wayAt=time;wayId=guidanceId;}
    if(waypoint){const p=waypoint.target,h=heightAt?.(p.x,p.z)?.height??.12;markerPoint.set(p.x,h+1.15,p.z).project(camera);
     let x=(markerPoint.x*.5+.5)*innerWidth,y=(-markerPoint.y*.5+.5)*innerHeight;const behind=markerPoint.z>1,edge=behind||x<100||x>innerWidth-100||y<110||y>innerHeight-170;
     if(behind){x=x<innerWidth/2?innerWidth-90:90;y=innerHeight*.55;}x=Math.max(90,Math.min(innerWidth-90,x));y=Math.max(130,Math.min(innerHeight-180,y));
     const post=document.getElementById('letter-post')?.getBoundingClientRect();if(post&&x>post.left-100&&x<post.right+100&&y-55<post.bottom+8&&y>post.top)y=post.bottom+65;
     marker.style.left=x+'px';marker.style.top=y+'px';marker.classList.toggle('edge',edge);marker.querySelector('b').textContent=(edge?(x<innerWidth/2?'← ':'→ '):'')+({rain:'听雨春庭',wind:'逆风春庭',tide:'回声春庭',bridge:'借桥的旧石台'})[guidanceId];marker.querySelector('span').textContent=bridgeLead&&waypoint.arrived?'Space＋拖动 · 沿光迹织桥':!bridgeLead&&nearId===trackedId?'靠近信台 · E 读信':waypoint.label+' · '+Math.ceil(waypoint.distance)+' 步';
    }else marker.hidden=true;
   }
  },
  snapshot(){const s=getState();return {activeId,selectedId,nearId,trackedId,hint,history:history.length,completed:completedLetters(s.letters).map(l=>l.id),boards:LETTERS.map(l=>({id:l.id,unlocked:letterUnlocked(l,s),entry:structuredClone(s.letters.entries[l.id]),evaluation:evaluateLetter(l,s.letters.entries[l.id]),tiles:l.tiles.map(t=>({...t,position:letterTilePosition(l,t)}))})),visual:garden.snapshot()};},
  dispose(){garden.dispose();ui.dispose();marker.remove();}
 };
}
