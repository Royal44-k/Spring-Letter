const fs=require('node:fs');let s=fs.readFileSync('src/main.js','utf8');
s=s.replace("onSound:()=>audio.note(440,.3,.06,{kind:'cup'})", "onSound:(kind,payload)=>audio.event?.('letter-'+kind,payload)");
s=s.replace("dash.refill(1);audio.event?.('plant');audio.chime();world.respond();caption(result.text,9);", "dash.refill(1);audio.event?.('letter-reply',{id,choice});world.respond();caption(result.text,9);");
s=s.replace('audio.update(dt,{moving:', 'audio.update(dt,{...letterController.musicState(),moving:');
s=s.replace("function updatePlay(dt){movePlayer(dt);", "function updatePlay(dt){state.playedSeconds=(state.playedSeconds||0)+dt;movePlayer(dt);");
fs.writeFileSync('src/main.js',s);
