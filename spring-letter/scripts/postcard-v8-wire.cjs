const fs=require('node:fs'),p=require('node:path').join(__dirname,'../src/main.js');let s=fs.readFileSync(p,'utf8');s="import {drawPostcard} from './postcard.js';\n"+s;const a=s.indexOf('function photo(){'),b=s.indexOf('\n',a);if(a<0)throw Error('photo');
s=s.slice(0,a)+`function photo(){
 try{composer.render();const source=document.createElement('canvas');source.width=renderer.domElement.width;source.height=renderer.domElement.height;source.getContext('2d').drawImage(renderer.domElement,0,0);
  openModal('<small>这一程，值得留下</small><h2>带走一张春信</h2><p>把这一帧春光和你亲手留下的照料，一起存成图片。只在本机制作。</p><canvas id="postcard-preview" aria-label="包含当前风景与三庭回信选择的春信明信片"></canvas><div class="row"><button id="postcard-download" class="primary">保存春信明信片</button><button id="photo-download">只保存风景</button></div>');
  const card=drawPostcard($('postcard-preview'),source,state.ending?state.lettersSent:state.letters,{ended:state.ending});
  const download=(canvas,name)=>canvas.toBlob(blob=>{if(!blob){toast('图片尚未生成，请稍后再试。');return;}const link=document.createElement('a'),url=URL.createObjectURL(blob);link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('春光已交给浏览器下载。');},'image/png');
  $('postcard-download').onclick=()=>download(card,'我的春信明信片.png');$('photo-download').onclick=()=>download(source,'我的一帧春光.png');
 }catch{toast('此浏览器无法导出画面，可以使用系统截图。');}
}`+s.slice(b);s=s.replace("if($('modal').open)return;","if($('modal').open)return;if(shaderPreparing){e.preventDefault();return;}");fs.writeFileSync(p,s);
