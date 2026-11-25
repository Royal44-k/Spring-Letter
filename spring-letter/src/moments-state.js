export const createMoments=()=>({version:1,entries:Object.fromEntries(['rain','wind','tide'].map(id=>[id,{draft:null,completed:false}]))});
export function safeArtwork(data){try{const text=JSON.stringify(data);return text&&text.length<24000?JSON.parse(text):null;}catch{return null;}}
export function restoreMoments(data){const clean=createMoments();if(data?.version!==1)return clean;for(const id of Object.keys(clean.entries)){const e=data.entries?.[id];if(e&&typeof e==='object')clean.entries[id]={draft:safeArtwork(e.draft),completed:e.completed===true};}return clean;}
const texts={
 rain:{title:'把故乡放进光里',sender:'禾 · 种花的人',note:'离开那天，窗上的花影还没拼好。能替我把三张花笺放回光里吗？我想记住的不是房子的样子，是有人在窗边等春天。',rule:'抓住半透明花笺，移动到后方留影。树、窗和花在光里相遇，沉睡的花园才会显影。',reward:'光路照亮前程；踏风之后，气息恢复得更快。',goals:[{id:'tree',title:'留住窗前的树影',detail:'把重逢的位置留给等待的人'},{id:'shoot',title:'让窗里开出新花',detail:'把一束新的春光留给后来的人'}],replies:{tree:'致禾：树影已经回到窗边。我留了一片空白，等你回来坐。——弥',shoot:'致禾：我把花笺挪进了光里。窗里开出新花，这次的春天有了自己的样子。——弥'}},
 wind:{title:'把信折成翅膀',sender:'阿渡 · 修帆学徒',note:'有些话，走路送不到。风廊尽头的渡口今夜会亮灯。替我折一只纸翼吧，让它自己去摸一摸上升的风。',rule:'起航后拖住纸翼，或用方向键控制左右与升降。穿过风门，借上升气流；空格收翼缓行。',reward:'纸翼记住来路；信册可以往返已回信的庭院。',goals:[{id:'lamp',title:'将信送到迎客灯下',detail:'留一道光，给夜里靠岸的人'},{id:'sail',title:'将风留在护种帆上',detail:'让未发芽的生命平稳过夜'}],replies:{lamp:'致阿渡：纸翼穿过了风廊。我把信留在灯下，晚到的人会看见它。——弥',sail:'致阿渡：我把纸翼里的风留给了帆。种子睡得很稳，信也到了。——弥'}},
 tide:{title:'写一段没有旧稿的春声',sender:'岑的旧录音 / 游絮的此刻',note:'旧杯声唱到这里就停下了。游絮没有接着模仿，它在空白里等你。留下几声，也留下停顿，让这封信有自己的呼吸。',rule:'选择声音，在八拍花瓣上落下音符；再按播放，听完自己的完整回应。空拍也可以成为作品。',reward:'回声照亮花冠的开放节拍；你的作品会随春信保存。',goals:[{id:'old',title:'让新声陪伴旧曲',detail:'把自己的回应留在故乡的水面'},{id:'new',title:'把这段声音寄向远方',detail:'让陌生的人也听见这一刻'}],replies:{old:'我留下的声音没有替代旧曲。它们挨在一起，像两个人慢慢学会对话。——弥',new:'我把这段没有旧稿的春声寄了出去。它不必像谁，远方也会听见我们的停顿。——弥'}}
};
export function momentLetter(letter,entry){return entry?.edition===2||!entry?.choice?{...letter,...texts[letter.id]}:letter;}
export const momentText=id=>texts[id];
