// A held wind pen draws a seed toward it. Hovering is observation.
const finite=(n,f=0)=>Number.isFinite(n)?n:f;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const WIND_FLOW=Object.freeze({start:Object.freeze({x:-3,z:2}),goal:Object.freeze({x:3,z:-2}),catchRadius:1.05,contactRadius:2.65});
export function cancelSeedGuidance(state){
 const w=state?.wind;if(!w||w.solved)return;w.catching=false;w.hold=0;w.vx=w.vz=0;
}
export function stepWind(state,input={},delta=0){
 const dt=clamp(finite(delta),0,.05),w=state.wind;
 if(input.cancelled===true){cancelSeedGuidance(state);return;}
 if(!state.p1.solved||w.solved||!dt)return;
 w.time=finite(w.time)+dt;
 const reset=()=>Object.assign(w,{x:-3,z:2,vx:0,vz:0,touched:false,catching:false,hold:0,returns:finite(w.returns)+1});
 if(!Number.isFinite(w.x+w.z+w.vx+w.vz)||Math.abs(w.x)>4.8||Math.abs(w.z)>3.8){reset();return;}
 const p=input.pointer,held=!!p&&Number.isFinite(p.x)&&Number.isFinite(p.z);
 const close=held&&Math.hypot(p.x-w.x,p.z-w.z)<WIND_FLOW.contactRadius;
 if(close)w.touched=true;
 const distance=Math.hypot(w.x-3,w.z+2);
 // A visible flower catches an intentional release; no hidden speed threshold.
 if(held){w.catching=false;w.hold=0;}
 if(w.touched&&!held&&input.released===true&&distance<WIND_FLOW.catchRadius)w.catching=true;
 if(w.catching&&!held){
  const ease=1-Math.exp(-dt*5);
  w.x+=(3-w.x)*ease;w.z+=(-2-w.z)*ease;w.vx*=Math.exp(-dt*8);w.vz*=Math.exp(-dt*8);
  w.hold=Math.min(.7,w.hold+dt);
  if(w.hold>=.7)Object.assign(w,{x:3,z:-2,vx:0,vz:0,solved:true});
  return;
 }
 w.hold=0;
 let desiredX=0,desiredZ=0;
 if(close){const dx=p.x-w.x,dz=p.z-w.z,r=Math.hypot(dx,dz),speed=Math.min(1.85,r*3.5);if(r>.015){desiredX=dx/r*speed;desiredZ=dz/r*speed;}}
 const ease=1-Math.exp(-dt*(close?7:8));
 w.vx+=(desiredX-w.vx)*ease;w.vz+=(desiredZ-w.vz)*ease;
 w.x+=w.vx*dt;w.z+=w.vz*dt;
 const radius=Math.hypot(w.x,w.z);
 if(radius<.88){const nx=radius>.001?w.x/radius:-1,nz=radius>.001?w.z/radius:0;w.x=nx*.89;w.z=nz*.89;const inward=Math.min(0,w.vx*nx+w.vz*nz);w.vx-=nx*inward;w.vz-=nz*inward;}
 if(Math.abs(w.x)>4.8||Math.abs(w.z)>3.8)reset();
}
