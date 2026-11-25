/** Solid scenery shared by movement and the authored worlds. Plants remain
 * passable; only trunks, masonry and the two large sculptures obstruct feet. */
export const CONSERVATORY_TREES=Object.freeze([
 {x:-11,z:5,height:2.8,scale:1.6},{x:11,z:-6,height:3.4,scale:1.8},
 {x:-12,z:-19,height:3,scale:1.7},{x:9,z:-27,height:2.5,scale:1.5}
].map((tree,index)=>Object.freeze({...tree,id:`fern-trunk-${index}`,radius:.55})));
export const OBSERVATORY_COLUMNS=Object.freeze(Array.from({length:15},(_,index)=>{
 const angle=.13+index/14*Math.PI*1.73,rawX=Math.cos(angle)*13.8;
 return Object.freeze({id:`moon-column-${index}`,x:Math.sign(rawX||1)*Math.max(5.6,Math.abs(rawX)),z:-7-Math.sin(angle)*13.7,height:2.2+(index%4)*1.15,radius:.85,index});
}));
export const OBSERVATORY_RUBBLE=Object.freeze(OBSERVATORY_COLUMNS.filter(c=>c.index%3===0).map(c=>Object.freeze({id:`fallen-drum-${c.index}`,x:c.x+Math.sign(c.x)*1.35,z:c.z+.9,radius:1.3})));
export const ATLAS_SOLID_LANDMARKS=Object.freeze({
 armillary:Object.freeze({id:'armillary-base',x:8,z:-18,radius:1.8}),
 windflower:Object.freeze({id:'windflower-mast',x:13,z:-25.5,radius:.45}),
 letterTree:Object.freeze({id:'letter-tree-trunk',x:-2.9,z:-38,radius:.55})
});
export const CONSERVATORY_EXIT_POSTS=Object.freeze([-3.4,3.4].map((x,index)=>Object.freeze({id:`forest-post-gate-${index}`,x,z:-29.6,radius:.27})));
const circle=source=>Object.freeze({id:source.id,type:'circle',x:source.x,z:source.z,radius:source.radius});
const obstacles=Object.freeze({
 conservatory:Object.freeze([...CONSERVATORY_TREES,...CONSERVATORY_EXIT_POSTS].map(circle)),
 observatory:Object.freeze([...OBSERVATORY_COLUMNS,...OBSERVATORY_RUBBLE,ATLAS_SOLID_LANDMARKS.armillary].map(circle)),
 meadow:Object.freeze([ATLAS_SOLID_LANDMARKS.windflower,ATLAS_SOLID_LANDMARKS.letterTree].map(circle))
});
const empty=Object.freeze([]);
export const atlasObstacles=id=>obstacles[id]||empty;
