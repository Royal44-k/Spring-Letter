const fs=require('node:fs'),root='D:/AI Game/spring-letter/';let s=fs.readFileSync(root+'src/main.js','utf8');
const old="for(const preset of ['crystal','lily','silver']){bouquet.setMaterial(preset,'blush');await renderer.compileAsync(scene,camera);waterReflection.update(state.settings.quality,true);composer.render();}";
if(!s.includes(old))throw Error('Warmup marker changed');
s=s.replace(old,`for(const preset of ['crystal','lily','amber','celadon','silver']){
  bouquet.setMaterial(preset,'blush');bouquet.setOpacity(1);
  await renderer.compileAsync(scene,camera);waterReflection.update(state.settings.quality,true);composer.render();
  // Render the real translucent/point combination under the loading scene.
  // dt=0 does not advance particle motion, a quest, or a playable flower cycle.
  bouquet.setOpacity(.42);particles.object.visible=true;
  particles.update(0,0,{bloom:displayBloom,dispersion:.75,flow:.5,opacity:.7});
  await renderer.compileAsync(scene,camera);waterReflection.update(state.settings.quality,true);composer.render();
 }
 bouquet.setMaterial(material,variant);bouquet.setOpacity(1);
 particles.setColors(bouquet.sampleSurface(65536).colors);
 particles.update(0,0,{bloom:displayBloom,dispersion:0,flow:0,opacity:0});`);
fs.writeFileSync(root+'src/main.js',s);
const p=JSON.parse(fs.readFileSync(root+'package.json','utf8'));p.version='0.4.0';fs.writeFileSync(root+'package.json',JSON.stringify(p,null,2)+'\n');
const l=JSON.parse(fs.readFileSync(root+'package-lock.json','utf8'));l.version='0.4.0';if(l.packages?.[''])l.packages[''].version='0.4.0';fs.writeFileSync(root+'package-lock.json',JSON.stringify(l,null,2)+'\n');
console.log('Actual translucent/particle warmup and version 0.4.0 applied.');
