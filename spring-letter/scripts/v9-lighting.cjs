const fs=require('node:fs');const file='src/main.js';let s=fs.readFileSync(file,'utf8');function change(a,b){if(!s.includes(a))throw Error(a);s=s.replace(a,b);}
change("let chaseLight,chasing=false,storyDirector,cinematic,fullscreen,dustView=0,nightBlend=0;","let chaseLight,chasing=false,storyDirector,cinematic,fullscreen,dustView=0,nightBlend=0,momentBlend=0;\nconst momentSky=new THREE.Color('#283c40'),momentSkyColors={rain:'#283c40',wind:'#36535b',tide:'#192e49'};");
change('scene.fog.color.copy(scene.background);scene.fog.density=lerp(.009,.42,dustView);',"momentBlend=lerp(momentBlend,focus==='letter'?1:0,1-Math.exp(-dt*3));if(focus==='letter')momentSky.set(momentSkyColors[letterController.activeId]);scene.background.lerp(momentSky,momentBlend*.8);scene.fog.color.copy(scene.background);scene.fog.density=lerp(.009,.42,dustView);");
change("depthPass.enabled=!depthPass.failed&&state.settings.quality!=='light'","depthPass.enabled=!depthPass.failed&&focus!=='letter'&&state.settings.quality!=='light'");
change("waterReflection?.update(state.settings.quality,dustView<.8)","waterReflection?.update(state.settings.quality,dustView<.8&&focus!=='letter')");
fs.writeFileSync(file,s);
