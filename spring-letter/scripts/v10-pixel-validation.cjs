// Read-only QA helpers. DOM progress and a clean GL error queue do not prove
// that the browser received a usable, opaque scene image.
function summarizeRgba(bytes) {
 const n=bytes.length/4,mean=[0,0,0],squares=[0,0,0],bins=Object.create(null);
 let pink=0,magenta=0,opaque=0,transparent=0,allZero=0,alpha=0,hash=2166136261;
 for(let i=0;i<bytes.length;i+=4){
  const r=bytes[i],g=bytes[i+1],b=bytes[i+2],a=bytes[i+3];
  for(let j=0;j<3;j++){mean[j]+=bytes[i+j];squares[j]+=bytes[i+j]**2;}
  if(r>110&&b>90&&r>g*1.2&&b>g*1.15)pink++;
  if(r>180&&b>160&&g<80)magenta++;
  if(a>250)opaque++;if(a===0)transparent++;if(r===0&&g===0&&b===0&&a===0)allZero++;alpha+=a;
  const key=[r>>4,g>>4,b>>4].join(',');bins[key]=(bins[key]||0)+1;
  for(let j=0;j<4;j++)hash=Math.imul(hash^bytes[i+j],16777619)>>>0;
 }
 const averages=mean.map(v=>v/n),dominant=Object.entries(bins).sort((a,b)=>b[1]-a[1])[0]||null;
 return {samplePixels:n,mean:averages,sd:squares.map((v,j)=>Math.sqrt(Math.max(0,v/n-averages[j]**2))),pink:pink/n,magenta:magenta/n,opaque:opaque/n,transparent:transparent/n,allZero:allZero/n,alphaMean:alpha/n,dominant,dominantFraction:dominant?dominant[1]/n:NaN,pixelHash:hash.toString(16).padStart(8,'0')};
}

// The game's renderer clears alpha to 1 in all of these scenes. A nearly
// transparent buffer exposes the pink page background, even with GL_NO_ERROR.
function assessPixels(s) {
 const reasons=[];
 if(!s?.canvas)reasons.push('missing canvas');
 if(!(s?.width>0&&s?.height>0&&s?.samplePixels>0))reasons.push('empty drawing buffer or sample');
 const values=[...(s?.mean||[]),...(s?.sd||[]),s?.opaque,s?.allZero,s?.dominantFraction];
 if(s?.mean?.length!==3||s?.sd?.length!==3||values.some(v=>!Number.isFinite(v)))reasons.push('missing or nonfinite pixel statistics');
 if(s?.allZero>=.99)reasons.push('RGBA zero buffer');
 if(s?.opaque<.98)reasons.push('scene alpha is not opaque');
 if(s?.sd?.length===3&&Math.max(...s.sd)<1.5)reasons.push('flat scene image');
 if(s?.dominantFraction>=.997)reasons.push('almost one solid color');
 if(s?.magenta>=.9)reasons.push('full-screen magenta output');
 if(s?.contextLost)reasons.push('WebGL context lost');
 if(s?.glError!==0)reasons.push('WebGL error or unavailable context');
 if(s?.failure)reasons.push('failure panel is visible');
 if(s?.loading)reasons.push('loading overlay is still visible');
 return {valid:reasons.length===0,reasons};
}

function classifyConsole(entries) {
 const benign=[],blocking=[];
 for(const entry of entries){
  const text=String(entry.text||'').trim(),prefix='THREE.WebGLProgram: Program Info Log:';
  const lines=text.startsWith(prefix)?text.slice(prefix.length).trim().split(/\r?\n/).map(s=>s.trim()).filter(Boolean):[];
  const precisionOnly=entry.type==='warning'&&lines.length>0&&lines.every(line=>/^\(\d+,\d+(?:-\d+)?\): warning X4122: sum of [-+\d.eE]+ and [-+\d.eE]+ cannot be represented accurately in double precision$/.test(line));
  (precisionOnly?benign:blocking).push(entry);
 }
 return {benign,blocking};
}

function assessOpening(frames) {
 const reasons=[],coverage=[];
 for(const shot of [0,1,2,3,4,5]){
  const samples=frames.filter(f=>f.mode==='opening'&&f.opening===shot),valid=samples.filter(f=>f.pixelCheck?.valid===true);
  const distinctFrames=new Set(valid.map(f=>f.frame)).size;
  coverage.push({shot,samples:samples.length,validSamples:valid.length,distinctFrames});
  if(distinctFrames<3)reasons.push('shot '+shot+' lacks three distinct valid rendered samples');
 }
 const play=frames.filter(f=>f.mode==='play'),validPlay=play.filter(f=>f.pixelCheck?.valid===true),distinctPlay=new Set(validPlay.map(f=>f.frame)).size;
 if(distinctPlay<5)reasons.push('first gameplay lacks five distinct valid rendered samples');
 if(frames.at(-1)?.mode!=='play')reasons.push('opening did not reach gameplay');
 const invalid=frames.map((f,index)=>({index,...f.pixelCheck})).filter(f=>f.valid!==true);
 if(invalid.length)reasons.push(invalid.length+' sampled images failed pixel checks');
 if(frames.some(f=>f.errors?.length))reasons.push('application diagnostics contain errors');
 return {valid:reasons.length===0,reasons,coverage,firstPlay:{samples:play.length,validSamples:validPlay.length,distinctFrames:distinctPlay},invalid};
}

// Installed by Playwright as a read-only diagnostic, never by the application.
function inspectCanvas() {
 const canvas=document.querySelector('#scene canvas');if(!canvas)return {canvas:false};
 const copy=document.createElement('canvas');copy.width=96;copy.height=64;
 const ctx=copy.getContext('2d',{willReadFrequently:true});ctx.drawImage(canvas,0,0,96,64);
 const stats=window.__V10_RGBA_STATS__(ctx.getImageData(0,0,96,64).data),gl=canvas.getContext('webgl2'),ext=gl?.getExtension('WEBGL_debug_renderer_info');
 return {canvas:true,width:canvas.width,height:canvas.height,...stats,contextLost:gl?.isContextLost(),glError:gl?.getError(),gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl?.getParameter(gl.RENDERER),loading:!document.getElementById('loading').hidden,failure:!document.getElementById('failure').hidden,failureText:document.getElementById('failure-detail').textContent};
}

module.exports={summarizeRgba,assessPixels,classifyConsole,assessOpening,inspectCanvas};
