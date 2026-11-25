/** Explicit temporary play never touches, clears or overwrites browser storage. */
export function createStorageBackend(getStorage){
 let memory=null;
 return {storage:{getItem:key=>memory?(memory.has(key)?memory.get(key):null):getStorage().getItem(key),setItem:(key,value)=>memory?memory.set(key,String(value)):getStorage().setItem(key,String(value)),removeItem:key=>memory?memory.delete(key):getStorage().removeItem(key)},
  get temporary(){return memory!==null;},
  enterTemporary(records={}){if(memory)return false;memory=new Map(Object.entries(records).filter(([,v])=>typeof v==='string'));return true;}
 };
}
