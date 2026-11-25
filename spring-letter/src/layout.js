export const ZONE={garden:{x:0,z:0},wind:{x:0,z:-16},pool:{x:0,z:-32},finale:{x:0,z:-46}};
export const PLATFORMS={A:{x:0,z:-26},R:{x:-5,z:-29},M:{x:0,z:-32},F:{x:0,z:-38}};
export function distanceToSegment(x,z,a,b){
 const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);
}
export function supportAt(x,z,state){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 const base={height:.12,support:null};
 if(Math.hypot(x,z)<=6.8)return {...base,safe:'garden'};
 if(state.p1.solved){
  if(Math.abs(x)<=1.25&&z<=-6&&z>=-11)return {...base,safe:'wind'};
  if(Math.hypot(x,z+16)<=6)return {...base,safe:'wind'};
 }
 if(state.wind.solved){
  for(const [platform,p] of Object.entries(PLATFORMS))if(Math.hypot(x-p.x,z-p.z)<=1.25)return {...base,safe:'pool',platform};
  if(Math.abs(x)<=1.15&&z<=-21&&z>=-26)return {...base,safe:'pool',platform:'A'};
  if(distanceToSegment(x,z,PLATFORMS.A,PLATFORMS.R)<=.85)return {...base,safe:'pool',platform:'R'};
  const shape=state.bridge.structure;
  if(shape==='bridge_am'&&distanceToSegment(x,z,PLATFORMS.A,PLATFORMS.M)<=.78)return {...base,safe:'pool',support:shape};
  if(shape==='bridge_mf'&&distanceToSegment(x,z,PLATFORMS.M,PLATFORMS.F)<=.78)return {...base,safe:'pool',support:shape};
  if(shape==='shield_rm'&&distanceToSegment(x,z,PLATFORMS.R,PLATFORMS.M)<=.78)return {...base,safe:'pool',support:'leaf_rm'};
 }
 if(state.bridge.solved&&(Math.hypot(x,z+46)<=6||(Math.abs(x)<=1.15&&z<=-38&&z>=-42)))return {...base,safe:'finale'};
 return null;
}
export function nearestSafe(state){
 if(state.player.safe==='pool'&&state.wind.solved)return {...(PLATFORMS[state.bridge.platform]||PLATFORMS.A)};
 if(state.player.safe==='finale'&&state.bridge.solved)return {x:0,z:-43};
 if(state.player.safe==='wind'&&state.p1.solved)return {x:0,z:-11};
 return {x:0,z:6};
}
