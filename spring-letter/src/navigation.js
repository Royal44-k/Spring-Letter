/** Camera-relative walking and a persistent, unrestricted azimuth orbit. */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function movementVector(right,forward,azimuth){
  const length=Math.hypot(right,forward);
  if(!length)return {x:0,z:0};
  right/=length;forward/=length;
  return {x:right*Math.cos(azimuth)-forward*Math.sin(azimuth),z:-right*Math.sin(azimuth)-forward*Math.cos(azimuth)};
}
export function createViewRig(){
  const views=new Map();let current=null,key=null;
  return {
    select(next,offset){
      const previousKey=key;key=next;
      if(!views.has(next)){
        const radius=Math.hypot(offset.x,offset.y,offset.z);
        const azimuth=next.startsWith('roam')&&previousKey?.startsWith('roam')&&current?current.azimuth:Math.atan2(offset.x,offset.z);
        views.set(next,{azimuth,elevation:Math.asin(offset.y/radius),radius});
      }
      current=views.get(next);return current;
    },
    drag(dx,dy){if(!current)return;current.azimuth-=dx*.005;current.elevation=clamp(current.elevation+dy*.004,.09,1.36);},
    zoom(delta){if(current)current.radius=clamp(current.radius*Math.exp(delta*.0008),current.fittedRadius?current.fittedRadius*.45:3.2,current.fittedRadius?current.fittedRadius*2.4:key==='roam'?18:24);},
    rotate(amount){if(current)current.azimuth+=amount;},
    orient(azimuth){if(current&&Number.isFinite(azimuth))current.azimuth=azimuth;},
    fit(radius){if(!current||!Number.isFinite(radius)||radius<=0)return;current.radius=radius*(current.fittedRadius?current.radius/current.fittedRadius:1);current.fittedRadius=radius;},
    offset(){const c=current||{radius:10,azimuth:.495,elevation:.5};const flat=c.radius*Math.cos(c.elevation);return {x:Math.sin(c.azimuth)*flat,y:Math.sin(c.elevation)*c.radius,z:Math.cos(c.azimuth)*flat};},
    get state(){return {...current,key};},
    reset(){views.clear();current=null;key=null;}
  };
}

/** Keep the walking intention stable while a following camera changes its yaw. */
export function createTravelController(){
 let signature='',basis=0,rebase=false,heading=0,movingTime=0,manualRemaining=0,wantsCenter=false;
 const shortest=(a)=>Math.atan2(Math.sin(a),Math.cos(a));
 return {
  movement(right,forward,azimuth){
   const next=right+':'+forward;
   if(!right&&!forward){signature='';return {x:0,z:0};}
   if(next!==signature||rebase){basis=Number.isFinite(azimuth)?azimuth:0;signature=next;rebase=false;}
   return movementVector(right,forward,basis);
  },
  observe(dx,dz,dt){
   if(Number.isFinite(dx+dz+dt)&&dt>0&&Math.hypot(dx,dz)>.00003){heading=Math.atan2(-dx,-dz);movingTime+=Math.min(dt,.1);}
   else movingTime=0;
  },
  orbit(){manualRemaining=1.8;rebase=true;wantsCenter=false;},
  recenter(){manualRemaining=0;wantsCenter=true;},
  turn(dt,{azimuth,enabled=true,blocked=false,reducedMotion=false}={}){
   const d=Number.isFinite(dt)?clamp(dt,0,.1):0;
   manualRemaining=Math.max(0,manualRemaining-d);
   if(!Number.isFinite(azimuth))return 0;
   if(blocked||!d||(!wantsCenter&&(!enabled||manualRemaining>0||movingTime<.3)))return azimuth;
   const delta=shortest(heading-azimuth),speed=reducedMotion?.65:wantsCenter?1.4:1.05;
   const change=clamp(delta*(1-Math.exp(-d*2.7)),-speed*d,speed*d);
   if(Math.abs(delta)<.008)wantsCenter=false;
   return azimuth+change;
  },
  reset(){signature='';basis=heading=movingTime=manualRemaining=0;rebase=false;wantsCenter=false;},
  get state(){return {basis,heading,movingTime,manualRemaining,recentering:wantsCenter};},
 };
}
