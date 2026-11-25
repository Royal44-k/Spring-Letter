const fs=require('node:fs');const file='src/main.js';let s=fs.readFileSync(file,'utf8');function change(a,b){if(!s.includes(a))throw Error(a);s=s.replace(a,b);}
change("landscape.group.visible=mode!=='cover'&&mode!=='gallery'&&dustView<.995","landscape.group.visible=mode!=='cover'&&mode!=='gallery'&&focus!=='letter'&&dustView<.995");
change('world.group.visible=dustView<.995','world.group.visible=dustView<.995&&focus!==\'letter\'');
change('cinematic.group.visible=dustView<.995','cinematic.group.visible=dustView<.995&&focus!==\'letter\'');
change("const lightZ=mode==='play'?focus==='flower'?0:focus==='wind'?-16:focus==='finale'?-46:state.player.z:0;const lightX=mode==='play'&&!focus?state.player.x:0;","const lightZ=mode==='play'?focus==='letter'?letterById(letterController.activeId).z:focus==='flower'?0:focus==='wind'?-16:focus==='finale'?-46:state.player.z:0;const lightX=mode==='play'?(focus==='letter'?letterById(letterController.activeId).x:!focus?state.player.x:0):0;");
change("dash.refill(1);audio.event?.('letter-reply',{id,choice});world.respond();","dash.refill(1);audio.event?.('moment-reply',{id,choice});world.respond();");
fs.writeFileSync(file,s);
