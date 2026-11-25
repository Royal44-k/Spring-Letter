/** Fullscreen is user initiated; the browser remains the authority on state. */
export function bindFullscreen({buttons,onChange=()=>{},onUnavailable=()=>{}}){
 const root=document.documentElement;
 const element=()=>document.fullscreenElement||document.webkitFullscreenElement||null;
 const sync=()=>{const active=!!element();for(const b of buttons){b.setAttribute('aria-pressed',String(active));b.textContent=active?'退出全屏':'全屏体验';b.title=active?'退出全屏 · Esc':'全屏体验 · Alt+Enter';}onChange(active);};
 async function toggle(){
  try{
   if(element()){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}
   else{const request=root.requestFullscreen||root.webkitRequestFullscreen;if(!request){onUnavailable('此浏览器未提供页面全屏；可继续窗口体验，或使用浏览器的全屏菜单。');return;}await request.call(root);}
  }catch{onUnavailable('浏览器没有允许本次全屏请求，窗口体验仍可继续。');}
  sync();
 }
 for(const b of buttons)b.addEventListener('click',toggle);
 document.addEventListener('fullscreenchange',sync);document.addEventListener('webkitfullscreenchange',sync);sync();
 return {toggle,isActive:()=>!!element(),dispose(){for(const b of buttons)b.removeEventListener('click',toggle);document.removeEventListener('fullscreenchange',sync);document.removeEventListener('webkitfullscreenchange',sync);}};
}
