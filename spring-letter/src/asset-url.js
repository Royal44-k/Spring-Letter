/** Resolve bundled files beside the game's index, including nested iframe hosts.
 * No storage, identity or network access. A DOM-free test gets a relative URL;
 * actual play requires HTTP(S), not a file:// page.
 */
export function assetUrl(path,baseURI=globalThis.document?.baseURI){
 if(typeof path!=='string'||!path||!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(path)||path.split('/').some(part=>!part||part==='.'||part==='..'))throw new TypeError('Expected a bundled relative file path.');
 if(baseURI===undefined||baseURI===null)return './'+path;
 let base;try{base=new URL(baseURI);}catch{throw new TypeError('A valid HTTP(S) game URL is required.');}
 if(!['http:','https:'].includes(base.protocol))throw new TypeError('Open Spring Letter through HTTP(S); file:// play is not supported.');
 const directory=new URL('.',base),result=new URL(path,directory);
 if(result.origin!==directory.origin||!result.pathname.startsWith(directory.pathname))throw new TypeError('Bundled assets must stay within the game directory.');
 return result.href;
}
