import fs from 'node:fs';
import {scoreBar,SAMPLE_BANK} from '../src/audio-score.js';
const sections=[['garden',{}],['wind',{zone:'wind',challengeActive:true}],['pool',{zone:'pool',night:1}],['finale',{zone:'finale',ended:true}]];
fs.writeFileSync(new URL('../.tools/v7-audio/score.json',import.meta.url),JSON.stringify({bank:SAMPLE_BANK,sections:sections.map(([name,scene])=>({name,scene,bars:Array.from({length:16},(_,i)=>scoreBar(i,scene))}))},null,2));
