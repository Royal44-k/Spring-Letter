import {momentLetter} from './moments-state.js';
import {LETTERS,restoreLetters} from './letter-model.js';

export function postcardLines(letters){
 const saved=restoreLetters(letters);
 return LETTERS.map(original=>{const l=momentLetter(original,saved.entries[original.id]);const g=l.goals.find(g=>g.id===saved.entries[l.id].choice);return {id:l.id,title:l.title,choice:g?.title||'还留着一处空白',detail:g?.detail||'下一次经过时，再慢慢写。',written:!!g};});
}
function lines(ctx,text,x,y,width,lineHeight,maxLines=2){let row='',count=0;for(const char of text){if(ctx.measureText(row+char).width>width&&row){ctx.fillText(row,x,y+count*lineHeight);row=char;if(++count>=maxLines)return;}else row+=char;}if(row&&count<maxLines)ctx.fillText(row,x,y+count*lineHeight);}

/** The card is rendered locally from the player's actual image and committed choices. */
export function drawPostcard(canvas,source,letters,{ended=false}={}){
 const ctx=canvas.getContext('2d');canvas.width=1440;canvas.height=1040;
 ctx.fillStyle='#eee9db';ctx.fillRect(0,0,1440,1040);
 const sw=source.width,sh=source.height,scale=Math.max(1360/sw,650/sh),dw=sw*scale,dh=sh*scale;
 ctx.save();ctx.beginPath();ctx.rect(40,40,1360,650);ctx.clip();ctx.drawImage(source,40+(1360-dw)/2,40+(650-dh)/2,dw,dh);ctx.restore();
 const fade=ctx.createLinearGradient(0,550,0,690);fade.addColorStop(0,'#123c3b00');fade.addColorStop(1,'#123c3bbb');ctx.fillStyle=fade;ctx.fillRect(40,550,1360,140);
 ctx.fillStyle='#f7f0df';ctx.font='31px "SimSun",serif';ctx.fillText('花漾年华：待寄出的春信',78,635);ctx.font='12px Georgia,serif';ctx.fillText('A SPRING WORTH SENDING',80,662);
 ctx.fillStyle='#315750';ctx.font='21px "SimSun",serif';ctx.fillText(ended?'春信已经寄出。这一程，我留下了……':'还在路上。这一程，我留下了……',65,742);
 const rows=postcardLines(letters),colors=['#557b67','#a17765','#607895'];
 rows.forEach((row,i)=>{const x=65+i*455;ctx.strokeStyle=colors[i];ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,769);ctx.lineTo(x+405,769);ctx.stroke();ctx.fillStyle=colors[i];ctx.font='12px Georgia,serif';ctx.fillText(['RAIN · 01','WIND · 02','TIDE · 03'][i],x,797);ctx.font='22px "SimSun",serif';ctx.fillText(row.title,x,834);ctx.fillStyle='#35554e';ctx.font='18px "SimSun",serif';ctx.fillText(row.choice,x,874);ctx.fillStyle='#6b776b';ctx.font='15px "SimSun",serif';lines(ctx,row.detail,x,908,395,24);});
 ctx.strokeStyle='#acb4a3';ctx.beginPath();ctx.moveTo(65,963);ctx.lineTo(1375,963);ctx.stroke();ctx.fillStyle='#7e8c7b';ctx.font='13px "SimSun",serif';ctx.fillText('给愿意停下来的人，留一处春天。',65,995);ctx.font='11px Georgia,serif';ctx.textAlign='right';ctx.fillText('SPRING LETTER / A PERSONAL KEEPSAKE',1375,995);ctx.textAlign='left';return canvas;
}
