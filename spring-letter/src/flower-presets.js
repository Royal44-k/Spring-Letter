// Original art direction shared by the solid flower and its surface dust.
export const FLOWER_FORMS = Object.freeze([
  {id:'lily',label:'风中百合',description:'三朵反卷花与两枚未开的花苞'},
  {id:'lotus',label:'水上重莲',description:'三层叠瓣，低伏花杯与圆叶'},
  {id:'iris',label:'晴空鸢尾',description:'三面高旗与三片垂瓣，基部剑叶'},
  {id:'dahlia',label:'星瓣大丽',description:'四圈卷瓣向外放射，花盘如星'},
]);
export const FLOWER_SERIES = Object.freeze([
  {id:'silver',label:'月银',description:'冷银底色，视角流转的薄膜虹彩'},
  {id:'crystal',label:'流晶',description:'冰蓝晶体，清透内层与明亮折射边缘'},
  {id:'lily',label:'粉瓷',description:'粉白花面与梅粉花心，柔缎质感'},
  {id:'amber',label:'琥珀',description:'蜜金半透，花缘向朱橙过渡'},
  {id:'celadon',label:'青釉',description:'玉青釉面、浅金花心，温润反光'},
]);
const PALETTES = {
  silver: {low:'#618de8',high:'#dd74b6',accent:'#e4d1ef',stem:'#618de8',pollen:'#ead6ba'},
  crystal:{low:'#8277dc',high:'#97dbea',accent:'#f0c7ff',stem:'#587eb7',pollen:'#d7c2f4'},
  lily:   {low:'#dc719c',high:'#f5d2db',accent:'#fff0db',stem:'#71ac86',pollen:'#d8a368'},
  golden: {low:'#df743b',high:'#f2ce6b',accent:'#fff0b7',stem:'#80a85a',pollen:'#d6a84d'},
  amber:  {low:'#db6538',high:'#f2c46c',accent:'#ffe7ab',stem:'#b99358',pollen:'#f7d783'},
  celadon:{low:'#328f96',high:'#8ed3bc',accent:'#d4eed4',stem:'#4f9a8d',pollen:'#e3cc77'},
};
export function getFlowerPalette(kind='silver',variant='blush') {
  const key=kind==='lily'&&variant==='golden'?'golden':Object.hasOwn(PALETTES,kind)?kind:'silver';
  return {...PALETTES[key]};
}
