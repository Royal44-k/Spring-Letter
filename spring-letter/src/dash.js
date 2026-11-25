const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createDash(){
 const state={energy:1,active:false,exhausted:false,speed:0,moving:false};let recovery=0;
 return {state,update(dt,{moving=false,held=false,enabled=true,recoveryRate=1}={}){
  dt=Number.isFinite(dt)?clamp(dt,0,.1):0;state.moving=moving&&enabled;
  if(!held&&state.energy>.22)state.exhausted=false;
  state.active=state.moving&&held&&!state.exhausted&&state.energy>0;
  if(state.active){state.energy=Math.max(0,state.energy-dt*.38);recovery=.45;if(!state.energy){state.active=false;state.exhausted=true;}}
  else{recovery=Math.max(0,recovery-dt);if(!recovery)state.energy=Math.min(1,state.energy+dt*.24*clamp(Number.isFinite(recoveryRate)?recoveryRate:1,1,2));}
  const target=state.moving?(state.active?6.7:3.15):0;
  state.speed+=(target-state.speed)*(1-Math.exp(-dt*(state.active?10:14)));return state;
 },refill(amount=.22){state.energy=clamp(state.energy+amount,0,1);if(state.energy>.22)state.exhausted=false;},reset(){Object.assign(state,{energy:1,active:false,exhausted:false,speed:0,moving:false});recovery=0;}};
}
