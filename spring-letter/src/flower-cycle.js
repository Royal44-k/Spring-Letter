// One action releases a living cloud; time, not another button, restores it.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
export function createFlowerCycle() {
  let phase='solid',age=0,elapsed=0,driftDuration=7,dispersion=0,cycles=0,armed=true,burstHeld=false,calm=0;
  const state=()=>({phase,dispersion,flow:phase==='solid'?0:(phase==='breaking'?ease(age/.7)*.22:phase==='drifting'?.22+.78*ease(age/4):1)*dispersion,
    age,remaining:phase==='drifting'?Math.max(0,driftDuration-age):phase==='returning'?Math.max(0,5-age):0,cycles});
  function reset(){phase='solid';age=0;elapsed=0;driftDuration=7;dispersion=0;armed=true;burstHeld=false;calm=0;}
  function update(dt,{active=false,energy=0,burst=false,paused=false,reducedMotion=false}={}){
    if(paused)return state();
    const delta=clamp(dt,0,.25), fast=active&&Number.isFinite(energy)&&energy>=8.5;
    const requested=!!burst&&!burstHeld;burstHeld=!!burst;
    if(!fast){calm+=delta;if(calm>=.35)armed=true;}else calm=0;
    if(phase==='solid'&&(requested||(fast&&armed))){phase='breaking';age=0;elapsed=0;driftDuration=7;cycles++;armed=false;}
    if(phase!=='solid'){age+=delta;elapsed+=delta;}
    if(phase==='breaking'){
      dispersion=ease(age/.7);
      if(age>=.7){phase='drifting';age-=.7;dispersion=1;}
    }
    if(phase==='drifting'){
      if(active&&energy>.15)driftDuration=Math.min(15,Math.max(driftDuration,age+2.5));
      dispersion=1;
      if(age>=driftDuration){phase='returning';age-=driftDuration;}
    }
    if(phase==='returning'){
      dispersion=1-ease(age/5);
      if(age>=5){phase='solid';age=0;dispersion=0;armed=false;calm=0;}
    }
    return state();
  }
  return {update,reset,get state(){return state();}};
}
