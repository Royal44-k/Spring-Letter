const dtStep=dt=>Math.min(.05,Math.max(0,Number.isFinite(dt)?dt:0));
const validMotif=motif=>Array.isArray(motif)&&motif.length===6&&motif.every(n=>[0,1,2].includes(n))&&motif.some(n=>n!==0);
export function createStory(){
 return {introSeen:false,branches:{rhythm:false,light:false,memory:false},motif:[],lightFound:[false,false,false],lightHold:[0,0,0],memorySeen:{closed:false,open:false},memoryHold:{closed:0,open:0},memoryBloom:.5,seenChapters:[]};
}
export function restoreStory(data){
 const s=createStory();if(!data||typeof data!=='object'||Array.isArray(data))return s;
 s.introSeen=data.introSeen===true;
 if(Array.isArray(data.motif)&&data.motif.length<=6&&data.motif.every(n=>[0,1,2].includes(n)))s.motif=[...data.motif];
 s.branches.rhythm=data.branches?.rhythm===true&&validMotif(s.motif);
 if(Array.isArray(data.lightFound)&&data.lightFound.length===3)s.lightFound=data.lightFound.map(v=>v===true);
 s.branches.light=s.lightFound.every(Boolean);
 s.memorySeen={closed:data.memorySeen?.closed===true,open:data.memorySeen?.open===true};
 if(Number.isFinite(data.memoryBloom))s.memoryBloom=Math.min(1,Math.max(0,data.memoryBloom));
 s.branches.memory=data.branches?.memory===true&&s.memorySeen.closed&&s.memorySeen.open&&s.memoryBloom>=.35&&s.memoryBloom<=.65;
 if(Array.isArray(data.seenChapters))s.seenChapters=[...new Set(data.seenChapters.filter(n=>[1,2,3,4].includes(n)))];
 return s;
}
export function appendBeat(s,n){
 if(s.branches.rhythm)return {ok:false,reason:'这段杯声已经留下。可以重听，或继续旅途。'};
 if(![0,1,2].includes(n))return {ok:false,reason:'请选择左杯、右杯或留白。'};
 if(s.motif.length>=6)return {ok:false,reason:'六拍已满，可以试听、留存或重新编写。'};
 s.motif.push(n);return {ok:true};
}
export function commitMotif(s){
 if(!validMotif(s.motif))return {ok:false,reason:'写满六拍，并让其中至少一拍响起。其余节奏由你决定。'};
 s.branches.rhythm=true;return {ok:true};
}
export function scanInscription(s,index,dt){
 const target=[0,1,2].includes(index)?index:null;
 for(let i=0;i<3;i++)if(!s.lightFound[i]){
  s.lightHold[i]=i===target?s.lightHold[i]+dtStep(dt):0;
  if(s.lightHold[i]>=.65){s.lightFound[i]=true;s.lightHold[i]=.65;}
 }
 s.branches.light=s.lightFound.every(Boolean);return s.branches.light;
}
export function observeMemory(s,bloom,dt){
 if(!Number.isFinite(bloom))return;
 const current=bloom<.15?'closed':bloom>.85?'open':null;
 for(const key of ['closed','open'])if(!s.memorySeen[key]){
  s.memoryHold[key]=key===current?s.memoryHold[key]+dtStep(dt):0;
  if(s.memoryHold[key]>=.65)s.memorySeen[key]=true;
 }
}
export function commitMemory(s,bloom){
 if(!s.memorySeen.closed||!s.memorySeen.open)return {ok:false,reason:'先让旧花全合、全开各停留片刻，看看两段年份。'};
 if(!Number.isFinite(bloom)||bloom<.35||bloom>.65)return {ok:false,reason:'留一个仍能保护、也允许生长的中间姿态。'};
 s.memoryBloom=bloom;s.branches.memory=true;return {ok:true};
}
