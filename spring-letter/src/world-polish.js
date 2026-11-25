import * as THREE from 'three';

// Original, deliberately local scenery. It consumes no quest state and owns no
// navigation: the tide-worn surfaces remain on the existing walkable islands.
const TAU = Math.PI * 2;
const smooth = (a, b, value) => THREE.MathUtils.smoothstep(value, a, b);

export function createWorldPolish({ resources, leafGeometry, surfaceGeometry }) {
  const group = new THREE.Group();
  group.name = 'tide-worn-gardens';
  const dynamic = [];
  let seed = 471213;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const material = (color, properties = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: .86, metalness: .015, ...properties });
    resources.add(m); return m;
  };
  const stone = material(0xb0a994, { metalness: 0 });
  const darkStone = material(0x64705b, { roughness: .95, metalness: 0 });
  stone.name='shore-mineral-stone';darkStone.name='shore-mineral-stone';
  const bronze = material(0x9b8865, { roughness: .62, metalness: .38 });
  const paper = material(0xe0cfab, { side: THREE.DoubleSide, roughness: .91 });
  const green = material(0x4e6d39, { side: THREE.DoubleSide, roughness: .91, metalness: 0 });
  const paleGreen = material(0x7b9355, { side: THREE.DoubleSide, roughness: .86, metalness: 0 });
  const soil = material(0x485b4d);
  const ground = material(0xffffff, { vertexColors: true, roughness: .95 });
  ground.name = 'continuous-tide-worn-stone';
  const openingStone = material(0xd2c7b0, { vertexColors: true, roughness: .9, metalness: 0 });
  openingStone.name = 'opening-matte-limestone';
  const stoneMaterials = [stone, darkStone, ground, openingStone];
  const meadowTime={value:0},meadowMotion={value:1};
  const meadowGreen=material(0xffffff,{side:THREE.DoubleSide,roughness:.92,metalness:0,vertexColors:true});
  const meadowPetal=material(0xffffff,{side:THREE.DoubleSide,roughness:.88,metalness:0});
  const meadowCenter=material(0x9f7431,{roughness:.92,metalness:0});
  const grassTints=[0x617d3e,0x718a46,0x45612e,0x8d905b].map(c=>new THREE.Color(c));
  function bladeGeometry(length=1,width=.035,bend=.17){
    // Grass is a thin taper with a small central fold. The large .12-metre
    // midrib of the ornamental leaf geometry made short grass look inflated.
    const geometry=surfaceGeometry(8,2,(u,v)=>{
      const taper=Math.pow(1-u,.65),across=(v*2-1)*width*taper;
      return [across,bend*u*u+.008*(1-Math.abs(v*2-1))*Math.sin(u*Math.PI),u*length];
    });
    const colors=[];
    for(let row=0;row<=8;row++)for(let column=0;column<=2;column++){
      const value=.47+.53*Math.pow(row/8,.55);colors.push(value,value,value*.94);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return geometry;
  }
  const meadowSway=shader=>{
    shader.uniforms.meadowTime=meadowTime;shader.uniforms.meadowMotion=meadowMotion;
    shader.vertexShader='uniform float meadowTime;uniform float meadowMotion;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      vec3 meadowAnchor=vec3(0.);float meadowStem=max(0.,position.z);
      #ifdef USE_INSTANCING
       meadowAnchor=instanceMatrix[3].xyz;
      #endif
      transformed.x+=sin(meadowTime*1.3+meadowAnchor.x*.7+meadowAnchor.z*.8+position.z*3.)*meadowStem*.075*meadowMotion;`);
  };
  meadowGreen.onBeforeCompile=meadowSway;meadowGreen.customProgramCacheKey=()=> 'spring-meadow-sway-v7';
  const meadowDepth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
  meadowDepth.onBeforeCompile=meadowSway;meadowDepth.customProgramCacheKey=()=> 'spring-meadow-depth-v7';resources.add(meadowDepth);
  const mesh = (geometry, mat, parent = group, position = [0, 0, 0]) => {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(...position); object.receiveShadow = true;
    parent.add(object); return object;
  };
  const tube = (points, radius, mat, parent = group, segments = 24) => mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), segments, radius, 5, false), mat, parent);
  const disk = (radius, height, mat, parent, position, sides = 12) => mesh(
    new THREE.CylinderGeometry(radius, radius * .96, height, sides), mat, parent, position);

  function paintOpeningStone(geometry) {
    const position = geometry.getAttribute('position'), normal = geometry.getAttribute('normal'), colors = [];
    const lit = new THREE.Color(1, .97, .90), shade = new THREE.Color(.61, .65, .57), color = new THREE.Color();
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), y = position.getY(i);
      const inward = Math.max(0, -Math.sign(x) * normal.getX(i), -normal.getY(i));
      const wetFoot = 1 - smooth(-.1, .85, y);
      const mineral=.5+.5*Math.sin(x*3.4+y*1.3)*Math.cos(y*3.8-x*.7);
      color.copy(lit).lerp(shade, Math.min(.78, inward * .5 + wetFoot * .4)).multiplyScalar(.89+mineral*.11);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }

  function paintIsland(geometry, kind) {
    const positions = geometry.getAttribute('position'), colors = [];
    const base = new THREE.Color(kind === 'wind' ? 0xa49e88 : 0x929b8c);
    const worn = new THREE.Color(kind === 'wind' ? 0xc1b28e : 0xb7ad94);
    const moss = new THREE.Color(kind === 'wind' ? 0x67765d : 0x506f62);
    const color = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i), r = Math.hypot(x, z);
      // Foot-worn passage widens at the letter stand; damp growth collects on
      // irregular edge bands rather than a perfectly circular ornamental ring.
      const path = kind === 'wind'
        ? 1 - smooth(.5, 1.9, Math.abs(z + x * .55))
        : Math.max(1 - smooth(.6, 1.8, Math.abs(x)), .62 * (1 - smooth(.1, 1.1, Math.abs(z))));
      const edge = smooth(3.15, 5.75, r);
      const mottling = .5 + .5 * Math.sin(x * 1.2 + Math.sin(z * 1.6)) * Math.cos(z * .83 - x * .4);
      color.copy(base).lerp(worn, path * .6).lerp(moss, edge * (.28 + mottling * .42));
      // Damp earth is part of the same opaque island surface. Smooth elliptical
      // coverage removes the separate flat soil pads, their cut edges and any
      // risk of coplanar flicker; the planting bed still has its own dark soil.
      const centerZ = kind === 'wind' ? -16 : -46;
      for (const [cx, cz, , spread] of clusters) {
        if (Math.abs(cz - centerZ) > 8) continue;
        const radius = Math.hypot((x - cx) / (spread * .98), (z - cz + centerZ) / (spread * .74));
        color.lerp(soil.color, (1 - smooth(.12, 1.16, radius)) * .34);
      }
      color.multiplyScalar(.96 + .06 * Math.sin(x * 3.2 + z * .8) * Math.cos(z * 4.1));
      colors.push(color.r, color.g, color.b);
      const relief = Math.sin(x * 2.1 + Math.sin(z)) * Math.cos(z * 1.8) * .018;
      positions.setY(i, positions.getY(i) + relief * smooth(1.5, 4.2, r) * (1 - path * .75));
    }
    positions.needsUpdate = true;
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return ground;
  }

  // These three objects are recognizable before any seed is planted. Their
  // original petals/center/halo children are still supplied and owned by world.
  function decorateVessel(purpose, parent) {
    parent.name = `spring-purpose-${purpose}`;
    parent.userData.purpose = purpose;
    if (purpose === 'memory') {
      const foot = disk(.62, .14, darkStone, parent, [0, .07, 0], 8);
      foot.scale.z = .82;
      const base = disk(.47, .11, stone, parent, [0, .195, 0], 8);
      base.rotation.y = Math.PI / 8;
      // A salvaged lantern: empty panes, a shallow pitched roof and a handle.
      for (const x of [-.31, .31]) for (const z of [-.24, .24]) {
        tube([[x, .25, z], [x * .94, .91, z * .94], [x * .89, 1.39, z * .89]], .023, bronze, parent, 12);
      }
      mesh(surfaceGeometry(8, 12, (u, v) => {
        const x = (v * 2 - 1) * .48, z = (u * 2 - 1) * .38;
        return [x, 1.4 + (1 - Math.abs(v * 2 - 1)) * .2 + Math.abs(u * 2 - 1) * .035, z];
      }), darkStone, parent);
      tube([[-.13, 1.58, 0], [-.18, 1.82, 0], [0, 1.92, 0], [.18, 1.82, 0], [.13, 1.58, 0]], .023, bronze, parent, 22);
      for (const y of [.32, 1.36]) tube([[-.32, y, -.24], [.32, y, -.24], [.32, y, .24], [-.32, y, .24], [-.32, y, -.24]], .018, bronze, parent, 24);
      const backing = mesh(new THREE.PlaneGeometry(.52, .84), paper, parent, [0, .83, -.235]);
      backing.rotation.y = .08;
    } else if (purpose === 'season') {
      const bed = disk(.83, .17, darkStone, parent, [0, .085, 0], 10);
      bed.scale.z = .8; bed.rotation.y = .24;
      const earth = disk(.74, .025, soil, parent, [0, .183, 0], 10); earth.scale.z = .79;
      for (const [x, z, height, turn] of [[-.28, .04, .93, -.85], [.24, -.08, 1.22, .9]]) {
        tube([[x, .17, z], [x * .7, height * .55, z], [x * 1.4, height, z + .08]], .025, green, parent);
        const blade = mesh(leafGeometry(.94, .26, .18, 16, 5), paleGreen, parent, [x * .7, height * .43, z]);
        blade.rotation.set(-.86, turn, x < 0 ? .3 : -.28);
      }
      tube([[0, .2, 0], [-.05, .52, .01], [0, .82, 0]], .026, green, parent);
      // Broken mineral lips leave soil visible instead of another chalice.
      for (const [x, z, a] of [[-.64, -.15, -.3], [.48, -.42, .8], [.57, .38, -.6]]) {
        const lip = mesh(new THREE.BoxGeometry(.47, .11, .16), stone, parent, [x, .19, z]); lip.rotation.y = a;
      }
    } else {
      const foot = disk(.64, .12, darkStone, parent, [0, .06, 0], 8); foot.scale.set(1.4, 1, .68);
      // The canoe has an open, concave interior, pointed ends and a high bow.
      mesh(surfaceGeometry(12, 24, (u, v) => {
        const along = v * 2 - 1, across = u * 2 - 1;
        const taper = Math.pow(Math.max(0, 1 - along * along), .65);
        return [along * .94, .22 + across * across * .23 + Math.pow(Math.abs(along), 3) * .25, across * .34 * taper];
      }), bronze, parent);
      tube([[-.36, .35, -.04], [-.37, 1.1, -.04], [-.41, 1.98, -.04]], .026, bronze, parent);
      const sail = mesh(surfaceGeometry(18, 14, (u, v) => {
        const width = Math.sin(u * Math.PI * .84) * .98;
        return [-.4 + v * width, 1.88 - u * 1.25, -.07 + Math.sin(v * Math.PI) * .23 * Math.sin(u * Math.PI)];
      }), paper, parent);
      sail.name = 'letter-sail';
      tube([[-.4, 1.88, -.07], [-.18, 1.57, .03], [.49, .77, -.02]], .008, bronze, parent, 16);
      tube([[-.39, 1.92, -.07], [-.9, .57, .02]], .009, bronze, parent, 12);
    }
  }

  // Clusters, not evenly spaced individual tufts: the shore reads as one living
  // edge from the entry, while the center and every interaction radius stay open.
  const clusters = [
    [-5.15, -47.5, .8, 1.1], [-4.1, -50, .85, .75], [2.9, -50.65, .9, .8],
    [5.05, -47.7, .8, 1.1], [5.03, -44.4, .53, .8], [-4.8, -43.55, .46, .8],
    [-5.2, -14.8, .65, .85], [-3.5, -20.25, .74, .85], [.9, -21.1, .8, .95],
    [3.65, -12.05, .7, .75], [5.2, -16.6, .65, .9],
  ];
  const grassGeometry = bladeGeometry(1,.035,.20);
  const grasses = new THREE.InstancedMesh(grassGeometry, meadowGreen, clusters.length * 42);
  grasses.customDepthMaterial=meadowDepth;grasses.receiveShadow=true;
  grasses.name = 'shore-grass-clusters'; group.add(grasses);
  const reedGeometry = new THREE.CylinderGeometry(.007, .013, 1, 4, 1);
  const reeds = new THREE.InstancedMesh(reedGeometry, bronze, clusters.length * 7);
  reeds.name = 'shore-reed-stems'; group.add(reeds);
  const rockGeometry = new THREE.IcosahedronGeometry(1, 2);
  const rockPositions = rockGeometry.getAttribute('position');
  for (let i = 0; i < rockPositions.count; i++) {
    const x = rockPositions.getX(i), y = rockPositions.getY(i), z = rockPositions.getZ(i);
    const erosion = 1 + .14 * Math.sin(x * 7 + y * 4) * Math.cos(z * 5)+.05*Math.sin(z*11-x*4);
    rockPositions.setXYZ(i, x * erosion, y * erosion, z * erosion);
  }
  rockGeometry.computeVertexNormals();
  const rocks = new THREE.InstancedMesh(rockGeometry, darkStone, clusters.length * 5);
  rocks.name = 'shore-water-worn-stones'; group.add(rocks);
  const dummy = new THREE.Object3D(); let gi = 0, ri = 0, si = 0;
  function shoreline(x, z, limit = 5.84) {
    const centerZ = z < -30 ? -46 : -16, dz = z - centerZ;
    const r = Math.hypot(x, dz), scale = Math.min(1, limit / Math.max(r, .001));
    return [x * scale, centerZ + dz * scale];
  }
  for (const [clusterIndex,[cx, cz, height, spread]] of clusters.entries()) {
    for (let n = 0; n < 42; n++) {
      const a = random() * TAU, radius = Math.sqrt(random()) * spread;
      const [x, z] = shoreline(cx + Math.cos(a) * radius * .75, cz + Math.sin(a) * radius * .65);
      const low = .5 + random() * .5;
      dummy.position.set(x, .055, z); dummy.rotation.set(-1.12 - random() * .35, random()*TAU, -.08 + random() * .16);
      dummy.scale.set(.55+random()*.6, height * low, height * low);
      gi=n*clusters.length+clusterIndex;
      dummy.updateMatrix(); grasses.setMatrixAt(gi, dummy.matrix);grasses.setColorAt(gi,grassTints[Math.floor(random()*grassTints.length)]);
      if (n < 7) {
        const h = height * (.55 + random() * .5);
        dummy.position.set(x, .055 + h / 2, z); dummy.rotation.set(-.16, 0, -.13);
        dummy.scale.set(1, h, 1); dummy.updateMatrix(); reeds.setMatrixAt(ri++, dummy.matrix);
      }
      if (n < 5) {
        const scale = .12 + random() * .18;
        const [rx, rz] = shoreline(cx + (random() - .5) * spread * 1.5, cz + (random() - .5) * spread);
        dummy.position.set(rx, .045, rz);
        dummy.rotation.set(random() * .4, random() * TAU, random() * .2);
        dummy.scale.set(scale * 1.7, scale * .65, scale); dummy.updateMatrix(); rocks.setMatrixAt(si++, dummy.matrix);
      }
    }
  }
  for (const object of [grasses, reeds, rocks]) { object.instanceMatrix.needsUpdate = true; object.computeBoundingSphere(); }

  // A restrained, asymmetrical edge meadow in the first playable garden.
  // Root positions avoid the entry, flower, cups and west exploration path.
  const meadowClumps=[[5.8,1.7],[4.6,-4.4],[-4.4,-4.7],[-5.5,3.4]];
  const meadowGrass=new THREE.InstancedMesh(bladeGeometry(1,.034,.18),meadowGreen,192);
  meadowGrass.name='opening-meadow-grass';meadowGrass.customDepthMaterial=meadowDepth;group.add(meadowGrass);
  const petalShape=surfaceGeometry(5,4,(u,v)=>{const w=Math.sin(u*Math.PI)*.07;return [(v*2-1)*w,.025*Math.sin(u*Math.PI),u*.15];});
  const meadowBlooms=new THREE.InstancedMesh(petalShape,meadowPetal,240);
  meadowBlooms.name='opening-meadow-petals';group.add(meadowBlooms);
  const meadowHearts=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,6,4),meadowCenter,40);
  meadowHearts.name='opening-meadow-hearts';group.add(meadowHearts);
  const meadowStems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.006,.009,1,4),green,40);
  meadowStems.name='opening-meadow-stems';group.add(meadowStems);
  const openingRocks=new THREE.InstancedMesh(rockGeometry,stone,32);
  openingRocks.name='opening-shore-stones';openingRocks.receiveShadow=true;group.add(openingRocks);
  const flowerTints=[new THREE.Color(0xece0bf),new THREE.Color(0xd8d4ca),new THREE.Color(0xb5a3cd),new THREE.Color(0xc9a460)];
  let petalIndex=0,heartIndex=0,stoneIndex=0;
  for(const [clumpIndex,[cx,cz]] of meadowClumps.entries()){
    for(let i=0;i<48;i++){
      const angle=random()*TAU,r=Math.sqrt(random())*.62;
      let x=cx+Math.cos(angle)*r,z=cz+Math.sin(angle)*r;
      const bound=Math.min(1,6.65/Math.hypot(x,z));x*=bound;z*=bound;
      const h=.26+random()*.4;
      const bladeIndex=i*meadowClumps.length+clumpIndex;
      dummy.position.set(x,.05,z);dummy.rotation.set(-1.2-random()*.3,random()*TAU,0);dummy.scale.set(.65+random()*.55,h,h);dummy.updateMatrix();meadowGrass.setMatrixAt(bladeIndex,dummy.matrix);meadowGrass.setColorAt(bladeIndex,grassTints[Math.floor(random()*grassTints.length)]);
      if(i<10){
        const flowerY=.24+random()*.23,tint=flowerTints[Math.floor(random()*flowerTints.length)];
        dummy.position.set(x,(flowerY+.045)/2,z);dummy.rotation.set(0,0,0);dummy.scale.set(1,flowerY-.045,1);dummy.updateMatrix();meadowStems.setMatrixAt(heartIndex,dummy.matrix);
        dummy.position.set(x,flowerY,z);dummy.rotation.set(0,0,0);dummy.scale.setScalar(.8+random()*.5);dummy.updateMatrix();meadowHearts.setMatrixAt(heartIndex++,dummy.matrix);
        for(let petal=0;petal<6;petal++){dummy.position.set(x,flowerY-.005,z);dummy.rotation.set(.15,petal*TAU/6,0);dummy.scale.setScalar(.8+random()*.2);dummy.updateMatrix();meadowBlooms.setMatrixAt(petalIndex,dummy.matrix);meadowBlooms.setColorAt(petalIndex++,tint);}
      }
      if(i<8){
        const scale=.10+random()*.20;
        dummy.position.set(x,.018,z);dummy.rotation.set(random()*.3,random()*TAU,random()*.2);
        dummy.scale.set(scale*1.6,scale*.7,scale);dummy.updateMatrix();openingRocks.setMatrixAt(stoneIndex,dummy.matrix);
        openingRocks.setColorAt(stoneIndex++,new THREE.Color().setHSL(.12+random()*.05,.10+random()*.1,.65+random()*.17));
      }
    }
  }
  for(const object of [meadowGrass,meadowBlooms,meadowHearts,meadowStems,openingRocks]){object.instanceMatrix.needsUpdate=true;object.computeBoundingSphere();object.receiveShadow=true;}

  // Incomplete, weathered seams suggest a former landing, not a display plinth.
  for (const [cx, cz, a, length] of [[-3.7, -47.8, -.3, 1.35], [3.8, -48.8, .9, 1.3],
    [-3.9, -44.6, .6, .8], [4.1, -17.3, -.6, 1.0], [-2.1, -20.1, -.65, 1.15]]) {
    const rib = mesh(new THREE.BoxGeometry(length, .055, .14), stone, group, [cx, .063, cz]); rib.rotation.y = a;
  }
  const streamers = [];
  for (const [x, z, height, turn] of [[-4.8, -18.7, 1.55, -.3], [4.1, -12.25, 1.9, -.55]]) {
    const frame = new THREE.Group(); frame.position.set(x, .06, z); frame.rotation.y = turn; group.add(frame);
    tube([[0, 0, 0], [.02, height * .55, 0], [-.08, height, .04]], .025, bronze, frame, 16);
    const banner = mesh(surfaceGeometry(18, 8, (u, v) => [v * (.24 - u * .07), height - u * .85,
      .08 + Math.sin(u * 5.2 + v) * (.05 + u * .13) + u * .36]), paper, frame);
    banner.name = 'wind-worn-letter-cloth';
    streamers.push({ object: banner, phase: x }); dynamic.push(banner);
    const knot = mesh(new THREE.SphereGeometry(.065, 8, 6), bronze, frame, [0, height, .04]); knot.scale.y = .6;
  }
  function update(time, reducedMotion = false, quality = 'balanced') {
    const t = Number.isFinite(time) ? time : 0;
    meadowTime.value=t;meadowMotion.value=reducedMotion?0:1;
    const light=quality==='light';
    // Interleaved instance order retains every clump when reducing density.
    grasses.count=clusters.length*(light?21:42);meadowGrass.count=light?96:192;
    meadowBlooms.visible=meadowHearts.visible=meadowStems.visible=!light;
    for (const item of streamers) item.object.rotation.x = reducedMotion ? 0 : Math.sin(t * .65 + item.phase) * .025;
  }
  return { group, dynamic, stoneMaterials, openingStone, paintOpeningStone, paintIsland, decorateVessel, update,
    grassMaterial:meadowGreen,grassDepthMaterial:meadowDepth,bladeGeometry,grassTints };
}
