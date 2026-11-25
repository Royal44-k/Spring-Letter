const fs=require('node:fs');let s=fs.readFileSync('src/main.js','utf8');
const replace=(a,b)=>{if(!s.includes(a))throw Error('missing '+a.slice(0,60));s=s.replace(a,b);};
replace("exploration.group.visible=mode!=='cover'&&mode!=='gallery'&&dustView<.995", "exploration.group.visible=mode!=='cover'&&mode!=='gallery'&&focus!=='letter'&&dustView<.995");
replace("world.player.visible=(mode==='play'&&focus!=='branch')", "world.player.visible=(mode==='play'&&focus!=='branch'&&focus!=='letter')");
fs.writeFileSync('src/main.js',s);
