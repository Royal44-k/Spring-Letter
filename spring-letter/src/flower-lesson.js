// A forgiving first encounter: discover release, move the living dust, let it return.
export function updateFlowerLesson(state,{phase='solid',active=false,energy=0}={},dt=0){
 const p=state.p1;if(p.solved)return false;
 p.ink=Number.isFinite(p.ink)?Math.max(0,Math.min(1.2,p.ink)):0;
 if(phase==='breaking')p.broken=true;
 if(p.broken&&phase==='drifting'&&active&&Number.isFinite(energy)&&Number.isFinite(dt)&&dt>0){
  p.ink=Math.min(1.2,p.ink+Math.min(energy,5)*Math.min(dt,.05));
 }
 p.hold=p.broken?Math.min(.75,.24+p.ink*.4):0;
 if(p.broken&&p.ink>=1.2&&phase==='solid'){p.solved=true;p.hold=.8;return true;}
 return false;
}
export function flowerLessonHint(state,phase='solid'){
 if(state.p1.solved)return '水下的路醒了。还想玩一会儿，也不必急着离开。';
 if(phase==='solid'&&state.p1.broken&&(state.p1.ink||0)<1.2)return '花已归来。再触碰花心，随后按住拖动，给花尘留下一笔风。';
 if(!state.p1.broken||phase==='solid')return '轻触花心，让花瓣化作一阵光。也可以按 F。';
 if(phase==='breaking')return '花没有消失。它正换一种方式，留在你身边。';
 if((state.p1.ink||0)<1.2)return '在花尘里按住拖动，让这一阵风留下你的笔迹。';
 if(phase==='returning')return '花瓣正在归位。你留下的风，已经被水面记住。';
 return '可以继续拨动花尘，也可以松手，看它慢慢回到花里。';
}
