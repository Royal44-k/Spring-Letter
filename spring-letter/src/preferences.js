export const PREFERENCES_KEY='spring-letter:preferences:v1';
const defaults={muted:false,quality:'balanced',reducedMotion:false,autoCamera:true,flowerForm:'lily',flowerSeries:'lily',musicVolume:.75,sfxVolume:.8,ambienceVolume:.55};
export function normalizePreferences(value={},fallback={}){
 const safe={...defaults,...fallback};
 for(const key of ['muted','reducedMotion','autoCamera'])if(typeof value?.[key]==='boolean')safe[key]=value[key];
 for(const [key,options] of Object.entries({quality:['light','balanced','delicate'],flowerForm:['lily','lotus','iris','dahlia'],flowerSeries:['silver','crystal','lily','amber','celadon']}))if(options.includes(value?.[key]))safe[key]=value[key];
 for(const key of ['musicVolume','sfxVolume','ambienceVolume'])if(Number.isFinite(value?.[key]))safe[key]=Math.max(0,Math.min(1,value[key]));
 return safe;
}
export function readPreferences(storage,fallback={}){
 try{
  const explicit=storage.getItem(PREFERENCES_KEY);
  if(explicit)return normalizePreferences(JSON.parse(explicit),fallback);
  const old=JSON.parse(storage.getItem('spring-letter:journey:v1')||'null');
  return normalizePreferences(old?.settings,fallback);
 }catch{return normalizePreferences({},fallback);}
}
export function writePreferences(storage,value){try{storage.setItem(PREFERENCES_KEY,JSON.stringify(normalizePreferences(value)));return true;}catch{return false;}}
