// Interactive explanation of the proposed ending. This is not game code or a gameplay prototype.
const purposeCopy={
 memory:{on:'两杯与旧雨的完整记录可以连续回放。',off:'静态杯影与零散声纹留下，完整片段不再持续回放。'},
 season:{on:'自然花与同伴开始新的生长、栖息循环。',off:'眼前的花与同伴继续存在，庭园停留在这一季。'},
 voyage:{on:'播种信号出发，远方新节点逐渐以自己的节奏回应。',off:'本次没有新的播种出发，已有远方节点仍运行。'}
};
const arrangements={
 home:{active:['memory','season'],title:'一个能记得，也能生活的家。',text:'旧杯声与游絮的新拍在庭园相遇。外送花帆暂时安静，远方已有节点仍然亮着。这一次，你把两份春天留在身边。'},
 signal:{active:['memory','voyage'],title:'近处有人守望，远处有人接续。',text:'灯亭保留完整的旧日时序，花帆寄出可生长的种子。庭园停在眼前这一季，游絮仍与你作伴；遥远的新回应越过沉默来到这里。'},
 growth:{active:['season','voyage'],title:'过去留下痕迹，新的节奏继续生长。',text:'完整回放停止了，杯子和记得的事实仍在。你可以亲手敲出那段节奏，游絮添上一拍；本地四季和远方花庭各自长出新的生活。'}
};
document.querySelectorAll('[data-choice]').forEach(button=>{
 button.addEventListener('click',()=>{
  const selected=arrangements[button.dataset.choice];
  document.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('[data-purpose]').forEach(el=>{
   const purpose=el.dataset.purpose;
   const active=selected.active.includes(purpose);
   el.classList.toggle('active',active);
   el.querySelector('.purpose-state').textContent=active?'持续运行':'本次暂停';
   el.querySelector('.purpose-detail').textContent=purposeCopy[purpose][active?'on':'off'];
  });
  document.getElementById('choice-title').textContent=selected.title;
  document.getElementById('choice-text').textContent=selected.text;
 });
});
