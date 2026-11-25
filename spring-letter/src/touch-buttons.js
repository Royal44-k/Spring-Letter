const DIRECTIONS=new Set(['left','right','up','down']),TAP_DISTANCE=12,CLICK_WINDOW=900;
const buttonOf=event=>event.target?.closest?.('button');
const identity=button=>[button.dataset?.mAction||'',button.dataset?.value||'',button.dataset?.commit||''].join('\0');
const point=event=>({x:event.clientX,y:event.clientY});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const eligible=button=>button&&button.isConnected!==false&&!button.disabled&&!button.matches?.(':disabled')&&(button.dataset?.mAction||button.dataset?.commit)&&!DIRECTIONS.has(button.dataset.mAction);

/** Touch taps use pointerup because some mobile gesture sequences omit click.
 * No default prevention or capture: scrolling and sustained direction controls
 * keep their browser/controller behavior. */
export function createTouchButtonActivator({activate,now=()=>performance.now()}={}){
 const contacts=new Map();let recent=[],disposed=false;
 const expire=()=>{const time=now();recent=recent.filter(item=>time-item.at<=CLICK_WINDOW);return time;};
 function pointer(type,event={}){
  if(disposed)return false;const button=buttonOf(event),id=event.pointerId??0;
  expire();
  if(event.pointerType!=='touch'){
   if(type==='down'&&button)recent=recent.filter(item=>item.key!==identity(button));
   return false;
  }
  if(type==='cancel'){contacts.delete(id);return false;}
  if(type==='down'){
   if(event.isPrimary===false||!eligible(button)||event.button!==undefined&&event.button!==0||contacts.has(id))return false;
   const origin=point(event);if(!Number.isFinite(origin.x)||!Number.isFinite(origin.y))return false;
   contacts.set(id,{button,key:identity(button),origin,moved:false});return false;
  }
  const contact=contacts.get(id);if(!contact)return false;
  const end=point(event);if(!Number.isFinite(end.x)||!Number.isFinite(end.y)||distance(contact.origin,end)>=TAP_DISTANCE)contact.moved=true;
  if(type==='move'){if(event.buttons===0)contacts.delete(id);return false;}
  if(type!=='up')return false;contacts.delete(id);
  if(contact.moved||button!==contact.button||!eligible(button)||identity(button)!==contact.key)return false;
  const rect=button.getBoundingClientRect();if(end.x<rect.left||end.x>rect.right||end.y<rect.top||end.y>rect.bottom)return false;
  recent.push({button,key:contact.key,id,at:now(),point:end});if(recent.length>12)recent.shift();
  activate?.(button,event);return true;
 }
 function shouldSuppressClick(event={}){
  if(disposed||event.detail===0)return false;expire();
  if(['mouse','pen'].includes(event.pointerType)&&event.sourceCapabilities?.firesTouchEvents!==true)return false;
  const button=buttonOf(event);if(!button)return false;
  const key=identity(button),where=point(event),index=recent.findIndex(item=>item.key===key&&distance(item.point,where)<TAP_DISTANCE&&(event.pointerType!=='touch'||event.pointerId===undefined||event.pointerId===item.id));
  if(index<0)return false;recent.splice(index,1);return true;
 }
 function cancel(){contacts.clear();}
 function reset(){cancel();recent=[];}
 return {pointer,shouldSuppressClick,cancel,reset,dispose(){reset();disposed=true;}};
}
