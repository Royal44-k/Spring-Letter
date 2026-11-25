/** Integrate unsigned, uncapped travel speed across gaps between input samples.
 * The caller establishes the first position and keeps directional velocity separate.
 * Regular 5 Hz input is near the response boundary; long or irregular gaps are
 * allowed to decay rather than being interpreted as a permanently held fast stroke.
 */
export function createStrokeMotion(){
 let energy=0;
 const reset=()=>{energy=0;};
 return {
  update(rawSpeed,dt,active=true){
   if(!active){reset();return energy;}
   if(!Number.isFinite(dt)||dt<=0)return energy;
   const speed=Number.isFinite(rawSpeed)?Math.max(0,rawSpeed):0;
   // Cap after integration: capping an event-sized impulse first loses travel.
   energy=Math.max(0,Math.min(18,energy+(speed-energy)*-Math.expm1(-8*dt)));
   return energy;
  },
  reset,
  get value(){return energy;},
 };
}
