export const PREDECESSOR_LETTER = Object.freeze({
 recipient:'致下一位醒来的送春人',
 paragraphs:[
  '你读到这里时，潮水应该刚刚退下。木匣底下压着一枚旧邮戳，日期已经看不清了。',
  '那一年，我把花合拢，以为只要保存得足够完好，总有一天就能原样带回故乡。后来才知道，春天也会在等待里变老。',
  '船在潮脊尽头的小岛上。两根缆绳还拴着，帆我补好了大半。若它肯接住风，就把你的信也带上。',
  '这封信不催你回来，也不请你替我留下。起风的时候，去看看远方的人。若有人问起这里，就告诉他你亲眼看见的样子。'
 ],signature:'岑 · 留在退潮之后'
});
export const LETTER_BEGINNINGS = Object.freeze([
 '今天，我在一扇从未见过的窗前，认出了春天。',
 '有一段没有人写完的曲子，我给它留了一点自己的声音。',
 '等你读到这封信时，我也许还在海上。',
 '我放慢脚步，一群蝴蝶终于愿意与我同行。',
 '昨夜，星星给一封尚未写好的信画出了轮廓。',
 '原来风也会接住一个犹豫着迈出脚步的人。'
]);
export const VOYAGE_CHAPTERS = Object.freeze([
 ['花光暗房','把故乡重新放进光里'],['纸翼渡风','让一张纸真的抵达'],['回声织信','给旧曲留下一句新声'],
 ['借花为桥','让被守住的花成为道路'],['留下两处春天','出发也可以是一种照料'],
 ['写给未曾谋面的人','第一次，以自己的名字落款'],['潮汐留下的旧信','在退潮之后承接一份托付'],
 ['岸边的一叶舟','解缆，升帆，把两封信收好'],['一路繁花向海','把春天带到它未曾去过的地方']
]);
export function voyageLetterText(letter){
 const text=v=>typeof v==='string'?v:'';
 return ['花漾年华：待寄出的春信','',`致 ${text(letter?.recipient)}`,'',text(letter?.body),'','弥 与 游絮，途中','','—— 随船的另一封信 ——','',PREDECESSOR_LETTER.recipient,'',...PREDECESSOR_LETTER.paragraphs.map(p=>p+'\n'),PREDECESSOR_LETTER.signature].join('\n');
}
