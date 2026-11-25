/** Shared geography: presentation and movement read the same places. */
export const ATLAS_LOCATIONS = Object.freeze([
 {id:'conservatory',title:'雨幕温室',eyebrow:'琥珀雨林 · 花香的来处',subtitle:'一场雨，把废弃的温室还给了森林。',description:'穿过铜色肋拱与巨蕨，慢下来，让蝶愿意跟你同行。',objective:'按住 Space 招蝶，带它们走近三丛兰花，停留到花朵舒展。',reward:'花香',sky:'#9bb3a4',fog:.012,bloom:.20,spawn:{x:0,y:0,z:10},exit:{x:0,z:-28},music:'conservatory',colors:['#cba976','#234c42','#ddaf7c','#efc6ad']},
 {id:'observatory',title:'沉星天文台',eyebrow:'蓝夜遗址 · 星路的来处',subtitle:'岑曾在这里，替看不见陆地的人辨认方向。',description:'沿月白石阶走到观星台，把散落的星光缝成一封信。',objective:'走近前方观星台，按 E 仰望；沿亮起的星点描绘星路。',reward:'星路',sky:'#131f3c',fog:.007,bloom:.32,spawn:{x:0,y:0,z:10},exit:{x:0,z:-24},music:'observatory',colors:['#182544','#a8b7df','#c5b07e','#b8acdb']},
 {id:'meadow',title:'云海花甸',eyebrow:'风中群岛 · 远风的来处',subtitle:'路在脚下停住，风却没有。',description:'跃向另一座花岛，展开花伞，让春风托住你。',objective:'WASD 移动，按 Space 起跳并持续按住展开花伞；依次抵达五座花岛。',reward:'远风',sky:'#b6d4df',fog:.005,bloom:.16,spawn:{x:0,y:0,z:7},exit:{x:0,z:-37},music:'meadow',colors:['#d99d9d','#d6e4cf','#85ac95','#e6c6a2']}
]);
export const atlasLocation=id=>ATLAS_LOCATIONS.find(x=>x.id===id)||ATLAS_LOCATIONS[0];
export const CONSERVATORY_BEDS=Object.freeze([
 {id:'amber',x:-7,z:0,color:'#edbd65',name:'灯笼兰'},
 {id:'rose',x:8,z:-12,color:'#d98db5',name:'雨蝶兰'},
 {id:'ivory',x:-5,z:-25,color:'#f0e9cb',name:'月白兰'}
]);
export const MOTH_HOME=Object.freeze({x:0,z:6});
export const OBSERVATORY_DAIS=Object.freeze({x:0,z:-18,radius:3.8});
export const ATLAS_STARS=Object.freeze([
 {id:0,x:-6,y:10,z:-29},{id:1,x:0,y:14,z:-31},{id:2,x:6,y:10,z:-29},
 {id:3,x:6,y:5,z:-29},{id:4,x:-6,y:5,z:-29},{id:5,x:0,y:8,z:-27}
]);
export const STAR_ROUTE=Object.freeze([0,1,2,3,4,0,5,2]);
export const CLOUD_ISLANDS=Object.freeze([
 {id:0,x:0,z:6,rx:6,rz:5,height:0,name:'出发的花丘'},
 {id:1,x:10,z:-3,rx:5,rz:4,height:1,name:'风旗岛'},
 {id:2,x:-2,z:-13,rx:5,rz:5,height:2,name:'白芒岛'},
 {id:3,x:10,z:-24,rx:5,rz:4,height:1.5,name:'听风岛'},
 {id:4,x:0,z:-36,rx:7,rz:6,height:2.8,name:'寄风花丘'}
]);
export const ATLAS_NOTES=Object.freeze({
 conservatory:[{id:'fern',x:-10,z:7,title:'一张褪色的植物标签',text:'“别催它开花。它愿意留下来的那一刻，你就知道了。”——岑'},{id:'bench',x:10,z:-24,title:'铜椅下的旧花签',text:'有一年，信迟到了整整一个雨季。收信的人说，花香还在。'}],
 observatory:[{id:'column',x:-12,z:1,title:'断柱上的刻痕',text:'“寄信的人不必知道所有答案。知道往哪里走，就已经很好。”'},{id:'moon',x:12,z:-16,title:'无名航海者的星图',text:'海上没有门牌。有人用同一片星空，记住彼此的方向。'}],
 meadow:[{id:'flag',x:10,z:-3,title:'缝补过的风旗',text:'每一个补丁，都是一次没有放弃的远行。'},{id:'tree',x:0,z:-36,title:'树梢的一句留言',text:'“等你到了海边，也替自己写一封信。”——岑'}]
});
