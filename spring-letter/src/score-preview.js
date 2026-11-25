import {restoreTideScore,TIDE_VOICES,TIDE_STEP_SECONDS} from './moment-tide.js';
const tones=[0,4,7,9,7,4,2,0];
export function scorePreviewEvents(entry){
 if(entry?.edition!==2||entry.artwork?.version!==1)return [];
 const score=restoreTideScore(entry.artwork),events=[];
 for(let beat=0;beat<8;beat++)for(let voice=0;voice<3;voice++)if(score.notes[voice][beat])events.push({at:beat*TIDE_STEP_SECONDS,beat,voice,instrument:TIDE_VOICES[voice].instrument,midi:TIDE_VOICES[voice].base+tones[beat],duration:voice===2?.58:1.05,gain:.16,pan:(beat-3.5)*.17});
 return events;
}
export function startScorePreview(events,{play,onBeat=()=>{},onEnd=()=>{},schedule=setTimeout,cancel=clearTimeout}={}){
 let stopped=false;const timers=[];
 const stop=()=>{if(stopped)return;stopped=true;timers.forEach(cancel);onBeat(-1);onEnd();};
 if(!events.length){stop();return stop;}
 for(let beat=0;beat<8;beat++)timers.push(schedule(()=>{if(stopped)return;onBeat(beat);events.filter(e=>e.beat===beat).forEach(e=>play({...e}));},beat*TIDE_STEP_SECONDS*1000));
 timers.push(schedule(stop,8*TIDE_STEP_SECONDS*1000+900));
 return stop;
}
