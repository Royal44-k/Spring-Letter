import {
  Group, Mesh, BufferGeometry, Float32BufferAttribute, MeshPhysicalMaterial,
  Vector3, Matrix4, Quaternion, CatmullRomCurve3, TubeGeometry, CapsuleGeometry,
  DataTexture, RGBAFormat, UnsignedByteType, SRGBColorSpace, DoubleSide, Color,
  LinearFilter, LinearMipmapLinearFilter,
} from 'three';
import {FLOWER_FORMS, FLOWER_SERIES, getFlowerPalette} from './flower-presets.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const UP = new Vector3(0, 1, 0);
const TAU = Math.PI * 2;
const clamp01 = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const SURFACE_PRESETS = {
  silver: {iridescence: 0.82, thickness: 405, gloss: 0.85, radiance: 0.14},
  crystal: {iridescence: 0, thickness: 360, gloss: 1, radiance: 0},
  lily: {iridescence: 0, thickness: 360, gloss: 0.53 / 0.9, radiance: 0},
  amber: {iridescence: .12, thickness: 320, gloss: .82, radiance: .04},
  celadon: {iridescence: .08, thickness: 250, gloss: .72, radiance: .02},
};

function randomGenerator(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let n = state;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}

// A closed shell, rather than a flat card. Both endpoints retain identical
// topology; the visible morph and particle sampler consume these very arrays.
function curvedShell(evaluate, {rows = 48, columns = 12, thickness = 0.009} = {}) {
  const count = (rows + 1) * (columns + 1), closed = [], open = [], uv = [], indices = [];
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= columns; j++) {
        const u = i / rows, v = j / columns * 2 - 1;
        for (const [bloom, target] of [[0, closed], [1, open]]) {
          const p = evaluate(u, v, bloom);
          target.push(p[0], p[1] + (side ? -0.5 : 0.5) * thickness, p[2]);
        }
        uv.push(j / columns, u);
      }
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const a = i * (columns + 1) + j, b = a + columns + 1;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
      indices.push(a + count, b + count, a + 1 + count, b + count, b + 1 + count, a + 1 + count);
    }
  }
  // Bridge all four boundaries to give transmission a continuous thin volume.
  const edge = [];
  for (let j = 0; j <= columns; j++) edge.push(j);
  for (let i = 1; i <= rows; i++) edge.push(i * (columns + 1) + columns);
  for (let j = columns - 1; j >= 0; j--) edge.push(rows * (columns + 1) + j);
  for (let i = rows - 1; i > 0; i--) edge.push(i * (columns + 1));
  for (let i = 0; i < edge.length; i++) {
    const a = edge[i], b = edge[(i + 1) % edge.length];
    indices.push(a, a + count, b, b, a + count, b + count);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(closed, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const target = geometry.clone();
  target.setAttribute('position', new Float32BufferAttribute(open, 3));
  target.computeVertexNormals();
  geometry.morphAttributes.position = [target.attributes.position.clone()];
  geometry.morphAttributes.normal = [target.attributes.normal.clone()];
  geometry.morphTargetsRelative = false;
  target.dispose();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function petalGeometry(index, bud = false, form = 'lily') {
  if(form==='dahlia')return dahliaPetal(index,bud);
  if(form!=='lily')return sculptedPetal(index,bud,form);
  const inner = index % 2 === 0;
  // Alternating tepals form two staggered whorls, not six duplicated planes.
  const angle = index * TAU / 6 + (inner ? 0.035 : -0.02);
  const length = (inner ? 1.14 : 1.25) * (1 + Math.sin(index * 3.3) * 0.025);
  const width = inner ? 0.47 : 0.39;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  return curvedShell((u, v, endpoint) => {
    const bloom = bud ? 0.035 : endpoint;
    const sin = Math.max(0, Math.sin(Math.PI * u));
    const waist = Math.pow(sin, 0.78);
    const closedR = 0.025 + 0.17 * Math.pow(sin, 0.75) + 0.003 * u;
    const openR = 0.025 + length * (1.23 * Math.sin(u * 1.12) - 0.13 * Math.pow(u, 8));
    const radius = closedR + (openR - closedR) * bloom;
    const closedW = 0.008 * (1 - u) + 0.105 * waist;
    // Keep the closed bud's profile, but carry a fuller shoulder toward the
    // open tip. A broader continuous surface reflects a softer liquid ribbon.
    const openW = 0.008 * (1 - u) + width * Math.pow(sin, 0.62) * (0.79 + 0.21 * u);
    const tangent = v * (closedW + (openW - closedW) * bloom);
    const closedY = length * 1.12 * u;
    const openY = length * (1.25 * u - 1.17 * Math.pow(u, 3));
    const cup = 0.115 * length * v * v * sin;
    const midrib = 0.018 * length * (1 - v * v) * sin;
    const edge = 0.007 * v * v * Math.sin(u * 14 + index * 1.7) * sin;
    const y = closedY + (openY - closedY) * bloom + (cup + midrib + edge) * bloom;
    return [radius * ca - tangent * sa, y, radius * sa + tangent * ca];
  }, {thickness: bud ? 0.007 : 0.009});
}

// Distinct authored silhouettes, sharing closed/open endpoint topology.
function sculptedPetal(index,bud,form) {
  const lotus=form==='lotus', layer=lotus?Math.floor(index/6):0;
  const upright=!lotus&&index%2===0;
  const angle=(lotus?index%6:index)*TAU/6+(lotus?layer*.47:0)+Math.sin(index*2.7)*.021;
  const ca=Math.cos(angle),sa=Math.sin(angle);
  const length=(lotus?[1.34,1.13,.88][layer]:(upright?1.45:1.35))*(1+Math.sin(index*4.1)*.032);
  const width=(lotus?[.43,.39,.31][layer]:(upright?.17:.75))*(1+Math.cos(index*2.3)*.027);
  return curvedShell((u,v,endpoint)=>{
    const b=bud?.035:endpoint,sin=Math.max(0,Math.sin(Math.PI*u));
    const closedR=.025+.18*Math.pow(sin,.8),closedY=length*1.03*u;
    let openR,openY;
    if(lotus){
      openR=.025+length*Math.sin(u*(1.45-layer*.17));
      openY=length*(.15*u+.47*Math.pow(u,3))+(2-layer)*.025;
    }else if(upright){
      openR=.025+length*(.23*Math.sin(Math.PI*u*.78));
      openY=length*(1.07*u-.06*Math.pow(u,4));
    }else{
      openR=.025+length*(1.06*u-.25*Math.pow(u,5));
      openY=length*(.28*u-1.04*Math.pow(u,2.5));
    }
    const r=closedR+(openR-closedR)*b;
    const waviness=!lotus?.025*Math.sin(u*19+v*4+index):.006*Math.sin(u*13+index);
    const profile=lotus?Math.pow(sin,.59):upright?Math.pow(sin,.88):Math.pow(sin,.50)*(.3+.7*u);
    const w=(.006*(1-u)+(.10+(width-.10)*b)*profile);
    const t=v*w;
    const y=closedY+(openY-closedY)*b+(.09*v*v*sin+waviness*v*v*sin)*b;
    return [r*ca-t*sa,y,r*sa+t*ca];
  },{rows:lotus?36:48,columns:12,thickness:lotus?.018:.014});
}

function dahliaPetal(index,bud=false) {
  const layer=Math.floor(index/12),ray=index%12;
  const angle=ray*TAU/12+layer*.34+Math.sin(index*2.7)*.024,ca=Math.cos(angle),sa=Math.sin(angle);
  const length=[1.38,1.12,.82,.49][layer]*(1+Math.sin(index*3.3)*.027);
  const width=[.21,.20,.17,.13][layer],depth=[-.13,.04,.19,.29][layer];
  return curvedShell((u,v,endpoint)=>{
    const b=bud?.02:endpoint,sin=Math.max(0,Math.sin(Math.PI*u));
    const closedR=.02+.14*Math.pow(sin,.8),closedY=length*.95*u;
    const openR=.035+length*(1.04*u-.13*Math.pow(u,5));
    const openY=depth*u+length*(.15*Math.sin(Math.PI*u)-.21*Math.pow(u,5));
    const tube=(.03+(width-.03)*b)*Math.pow(sin,.65);
    const wrap=v*(.55+1.7*b)*(0.6+.4*u);
    const tangent=tube*Math.sin(wrap);
    const y=closedY+(openY-closedY)*b+tube*(1-Math.cos(wrap))*b;
    const radius=closedR+(openR-closedR)*b;
    return [radius*ca-tangent*sa,y,radius*sa+tangent*ca];
  },{rows:26,columns:10,thickness:.009});
}

function mergeOwned(parts) {
  const merged = mergeGeometries(parts, false);
  for (const part of parts) part.dispose();
  merged.computeBoundingBox(); merged.computeBoundingSphere();
  return merged;
}

function morphTube(closedPoints, openPoints, radius, segments = 18) {
  const geometry = new TubeGeometry(new CatmullRomCurve3(closedPoints), segments, radius, 6, false);
  const target = new TubeGeometry(new CatmullRomCurve3(openPoints), segments, radius, 6, false);
  geometry.morphAttributes.position = [target.attributes.position.clone()];
  geometry.morphAttributes.normal = [target.attributes.normal.clone()];
  target.dispose();
  geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  return geometry;
}

function morphAnther(closedPosition, openPosition, angle) {
  const geometry = new CapsuleGeometry(0.027, 0.105, 3, 8);
  geometry.rotateZ(0.9); geometry.rotateY(angle);
  const target = geometry.clone();
  geometry.translate(...closedPosition);
  target.translate(...openPosition);
  geometry.morphAttributes.position = [target.attributes.position.clone()];
  geometry.morphAttributes.normal = [target.attributes.normal.clone()];
  target.dispose();
  geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  return geometry;
}

function leafGeometry(length, width, angle, height, offset) {
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const geometry = curvedShell((u, v) => {
    const forward = length * u;
    const sideways = width * Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.85) * v;
    const y = height + length * (0.72 * u - 0.76 * u * u) + width * 0.28 * (1 - v * v) * Math.sin(Math.PI * u);
    return [offset[0] + forward * ca - sideways * sa, y, offset[1] + forward * sa + sideways * ca];
  }, {rows: 28, columns: 8, thickness: 0.005});
  // Leaves stay attached when petals close; only petals and stamens morph.
  geometry.morphAttributes = {};
  return geometry;
}

function waterLeafGeometry(index) {
  const angle=index*2.4+.35, cx=Math.cos(angle)*(.56+index*.025), cz=Math.sin(angle)*(.56+index*.025);
  const size=.62+(index%2)*.12, y=.12+index*.045;
  const geometry = curvedShell((u,v)=>{
    const theta=v*(Math.PI-.14)+angle, radius=u*size*(1+.018*Math.sin(v*27+index));
    const ripple=.022*Math.sin(theta*8)*Math.pow(u,3);
    return [cx+radius*Math.cos(theta),y+.08*Math.pow(u,2)+ripple,cz+radius*Math.sin(theta)];
  },{rows:18,columns:64,thickness:.007});
  geometry.morphAttributes={};
  return geometry;
}

function swordLeafGeometry(index) {
 const angle=index*2.25+.3,ca=Math.cos(angle),sa=Math.sin(angle),length=1.4+(index%4)*.30;
 const geometry = curvedShell((u,v)=>{
  const w=(.08+(index%2)*.025)*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.75);
  const r=.05+length*(.20*u+.08*u*u),y=.04+length*(1.03*u-.10*u*u);
  return [r*ca-w*v*sa,y+.025*(1-v*v)*Math.sin(Math.PI*u),r*sa+w*v*ca];
 },{rows:32,columns:8,thickness:.006});
  geometry.morphAttributes={};
  return geometry;
}
function dahliaLeafGeometry(index) {
 const pair=Math.floor(index/2),angle=(index%2)*Math.PI+pair*.8+.3,ca=Math.cos(angle),sa=Math.sin(angle);
 const length=.75+pair*.07,width=.24,height=.45+pair*.48;
 const geometry = curvedShell((u,v)=>{
  const edge=1+.085*Math.sin(u*TAU*7),w=width*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.74)*edge;
  const r=length*u,y=height+length*(.38*u-.40*u*u)+.075*(1-v*v)*Math.sin(Math.PI*u);
  return [r*ca-v*w*sa,y,r*sa+v*w*ca];
 },{rows:32,columns:10,thickness:.006});
  geometry.morphAttributes={};
  return geometry;
}

function petalTexture(variant) {
  const width = 128, height = 256, data = new Uint8Array(width * height * 4);
  const rng = randomGenerator(812);
  const freckles = Array.from({length: 55}, () => ({x: 0.25 + rng() * 0.5, y: 0.16 + rng() * 0.43, radius: 0.003 + rng() * 0.007}));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1), v = y / (height - 1);
      const center = Math.exp(-Math.pow((u - 0.5) * 5, 2));
      const blush = center * (0.48 * Math.exp(-Math.pow((v - 0.23) * 3.8, 2)) + 0.62 * Math.pow(v, 7));
      const vein = (Math.sin((u - 0.5) * 110 + Math.sin(v * 8) * 0.4) * 0.5 + 0.5) * center * 0.022;
      let spot = 0;
      for (const f of freckles) {
        const distance = Math.hypot((u - f.x) * 0.55, v - f.y);
        if (distance < f.radius) spot = Math.max(spot, 0.55 * (1 - distance / f.radius));
      }
      const color = variant === 'golden'
        ? [0.97 - vein, 0.93 - blush * 0.40 - spot * 0.40, 0.79 - blush * .78 - spot * 0.65]
        : [0.96 - vein, 0.88 - blush * 0.62 - spot * 0.50, 0.87 - blush * 0.30 - spot * 0.30];
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(Math.max(0, Math.min(1, color[c])) * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter;
  texture.anisotropy = 2;
  texture.needsUpdate = true;
  texture.name = `Original lily ${variant} veins and freckles`;
  return texture;
}

// Original thickness DATA, never a painted rainbow. Three's physical thin-film
// model derives wavelength-dependent reflection from this UV field, the surface
// normal, viewing angle and environment. The green channel carries thickness.
function thinFilmTexture() {
  const width = 128, height = 256, data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1) * 2 - 1;
      const folded = v * 2.4 + u * u * 0.38 + Math.sin(v * 8) * 0.09;
      const fine = Math.sin(TAU * (v * 1.05 - u * 0.28)) * 0.085;
      const thickness = clamp01(0.5 + Math.sin(TAU * folded) * 0.365 + fine);
      const i = (y * width + x) * 4, value = Math.round(thickness * 255);
      data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255;
    }
  }
  const texture = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType);
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter; texture.magFilter = LinearFilter;
  texture.anisotropy = 2; texture.needsUpdate = true;
  texture.name = 'Original lily thin-film thickness — linear scalar waves';
  return texture;
}

function createSurfaceTable(root) {
  root.updateMatrixWorld(true);
  const inverse = root.matrixWorld.clone().invert(), items = [], cumulative = [];
  let area = 0;
  const edgeA = new Vector3(), edgeB = new Vector3();
  root.traverse(mesh => {
    if (!mesh.isMesh) return;
    const transform = new Matrix4().multiplyMatrices(inverse, mesh.matrixWorld);
    const geometry = mesh.geometry, p = geometry.attributes.position, q = geometry.morphAttributes.position?.[0] ?? p;
    const closed = new Float32Array(p.count * 3), open = new Float32Array(q.count * 3), vertex = new Vector3();
    for (let i = 0; i < p.count; i++) {
      vertex.fromBufferAttribute(p, i).applyMatrix4(transform).toArray(closed, i * 3);
      vertex.fromBufferAttribute(q, i).applyMatrix4(transform).toArray(open, i * 3);
    }
    const indices = geometry.index;
    for (let i = 0; i < (indices?.count ?? p.count); i += 3) {
      const ids = [0, 1, 2].map(j => indices ? indices.getX(i + j) : i + j);
      const a = new Vector3().fromArray(open, ids[0] * 3), b = new Vector3().fromArray(open, ids[1] * 3), c = new Vector3().fromArray(open, ids[2] * 3);
      const faceArea = edgeA.subVectors(b, a).cross(edgeB.subVectors(c, a)).length() * 0.5;
      if (faceArea < 1e-12) continue;
      area += faceArea;
      items.push({closed, open, ids, role:mesh.userData.role, uv:geometry.attributes.uv}); cumulative.push(area);
    }
  });
  return {items, cumulative, area};
}

/**
 * Original lily bouquet. scale is applied inside the returned root so sampled
 * coordinates include it exactly once; apply the same root transform to points.
 * setBloom is linear, matching particles' closed/open interpolation exactly.
 */
export function createBouquet({seed = 17, scale = 1} = {}) {
  if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('Bouquet scale must be positive and finite');
  const group = new Group(); group.name = 'Spring letter — three lilies and two promises';
  const content = new Group(); content.scale.setScalar(scale); group.add(content);
  const geometries = new Set(), materials = new Set(), textures = new Map(), morphs = [], renderMeshes = [];
  let opacity = 1, materialKind = 'silver', materialVariant='blush', currentForm='lily', currentBloom=1, disposed = false, surfaceTable, surfaceSamples;
  let surface = {...SURFACE_PRESETS.silver};
  const filmTexture = thinFilmTexture();
  textures.set('thin-film-data', filmTexture);
  const roles = {};
  for (const role of ['petal', 'bud', 'stem', 'leaf', 'filament', 'anther']) {
    roles[role] = new MeshPhysicalMaterial({color: 0xe1e4ec, metalness: 1, roughness: 0.18, side: DoubleSide});
    roles[role].name = `Lily ${role}`;
    roles[role].forceSinglePass = true;
    materials.add(roles[role]);
  }
  function addMesh(parent, geometry, role, name) {
    geometries.add(geometry);
    const mesh = new Mesh(geometry, roles[role]);
    mesh.name = name; mesh.userData.role = role;
    mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); renderMeshes.push(mesh);
    if (geometry.morphAttributes.position?.length) morphs.push(mesh);
    return mesh;
  }

  function buildForm(form) {
  const heads = [
    {p: [-0.34, 3.43, -0.17], size: 0.89, axis: [0.02, 1, 0.10], spin: 0.14},
    {p: [-0.23, 1.93, 0.40], size: 1.02, axis: [-0.08, 1, 0.40], spin: -0.20},
    {p: [0.75, 2.75, -0.06], size: 0.74, axis: [0.27, 1, 0.25], spin: 0.48},
    {p: [-1.02, 2.48, 0.01], size: 0.62, axis: [-0.20, 1, 0.04], spin: 0.22, bud: true},
    {p: [0.91, 3.25, -0.12], size: 0.64, axis: [0.09, 1, -0.04], spin: 0.35, bud: true},
  ];
  if(form==='lotus') {
    heads[0]={p:[-.15,2.45,-.25],size:1.15,axis:[0,1,.02],spin:.2};
    heads[1]={p:[-.78,1.34,.48],size:.72,axis:[-.12,1,.2],spin:-.3};
    heads[2]={p:[1.02,1.76,-.12],size:.76,axis:[.15,1,.1],spin:.6};
    heads[3].p=[-.91,2.19,-.25]; heads[3].size=.42;
    heads[4].p=[.75,2.66,-.22]; heads[4].size=.4;
  }
  if(form==='iris'){heads[0].p=[-.25,3.03,-.15];heads[0].size=.84;heads[0].axis=[0,1,0];heads[1].p=[-.55,1.87,.42];heads[1].size=.86;heads[1].axis=[-.12,1,.10];heads[2].p=[.85,2.46,-.14];heads[2].size=.73;heads[2].axis=[.07,1,.04];}
  if(form==='dahlia'){
    heads[0]={p:[-.12,3.28,-.35],size:.88,axis:[.25,.62,.74],spin:.15};
    heads[1]={p:[-.93,1.64,.35],size:.73,axis:[-.10,.59,.80],spin:-.12};
    heads[2]={p:[1.02,1.87,.04],size:.70,axis:[.55,.54,.63],spin:.38};
    heads[3].p=[-1.00,2.34,-.12];heads[3].size=.35;heads[4].p=[.79,3.08,-.3];heads[4].size=.34;
  }
  const stemParts = [];
  for (let h = 0; h < heads.length; h++) {
    const head = heads[h], flower = new Group();
    flower.name = head.bud ? `Unopened promise ${h - 2}` : `${form} ${h + 1}`;
    flower.userData.botanicalHead = head.bud ? 'bud' : 'blossom';
    flower.position.fromArray(head.p); flower.scale.setScalar(head.size);
    flower.quaternion.setFromUnitVectors(UP, new Vector3(...head.axis).normalize());
    flower.quaternion.multiply(new Quaternion().setFromAxisAngle(UP, head.spin));
    content.add(flower);
    const petals = Array.from({length: !head.bud?(form==='lotus'?18:form==='dahlia'?48:6):6}, (_, i) => petalGeometry(i, head.bud,form));
    const flowerGeometry = mergeOwned(petals);
    if (head.bud) flowerGeometry.morphAttributes = {};
    addMesh(flower, flowerGeometry, head.bud ? 'bud' : 'petal', head.bud ? 'Six-seamed closed bud' : 'Three inner petals and three recurved sepals');
    const p = new Vector3(...head.p);
    stemParts.push(new TubeGeometry(new CatmullRomCurve3([
      new Vector3((h - 2) * 0.035, 0.025, (h % 2) * 0.035),
      new Vector3(p.x * 0.28, p.y * 0.36, p.z * 0.36),
      new Vector3(p.x * 0.76, p.y * 0.78, p.z * 0.84), p,
    ]), 36, head.bud ? 0.017 : 0.024, 7, false));
    if (!head.bud) {
      const filaments = [], anthers = [];
      const stamenCount=form==='lotus'?18:form==='iris'?3:form==='dahlia'?12:6;
      for (let i = 0; i < stamenCount; i++) {
        const angle = i * TAU / stamenCount + 0.22, ca = Math.cos(angle), sa = Math.sin(angle);
        const closedTip = [ca * 0.075, 0.94 + (i % 2) * 0.05, sa * 0.075];
        const openRadius=form==='lotus'?.12+(i%3)*.06:form==='iris'?.16:form==='dahlia'?.06+(i%3)*.025:.25+(i%2)*.04;
        const openHeight=form==='lotus'?.32+(i%3)*.035:form==='iris'?.24:form==='dahlia'?.16+(i%2)*.02:.84+(i%2)*.08;
        const openTip = [ca*openRadius,openHeight,sa*openRadius];
        filaments.push(morphTube([
          new Vector3(ca * 0.018, 0.10, sa * 0.018), new Vector3(ca * 0.04, 0.56, sa * 0.04), new Vector3(...closedTip),
        ], [
          new Vector3(ca * 0.018, 0.10, sa * 0.018), new Vector3(ca * openRadius*.45, openHeight*.58, sa * openRadius*.45), new Vector3(...openTip),
        ], 0.009));
        const anther=morphAnther(closedTip, openTip, angle);
        if(form==='lotus'||form==='dahlia'||form==='iris'){
          // Uniformly scale around each endpoint to keep pollen on its filament.
          for(const [attribute,tip] of [[anther.attributes.position,closedTip],[anther.morphAttributes.position[0],openTip]])for(let j=0;j<attribute.count;j++)attribute.setXYZ(j,tip[0]+(attribute.getX(j)-tip[0])*.55,tip[1]+(attribute.getY(j)-tip[1])*.55,tip[2]+(attribute.getZ(j)-tip[2])*.55);
        }
        anthers.push(anther);
      }
      // A slightly taller central style prevents a mechanically empty center.
      filaments.push(morphTube([new Vector3(0, 0.10, 0), new Vector3(0.01, 0.6, 0), new Vector3(0.02, 1.01, 0)],
        [new Vector3(0, 0.10, 0), new Vector3(0.01, form==='lotus'?.21:form==='iris'?.15:form==='dahlia'?.08:.6, 0.015), new Vector3(0.035, form==='lotus'?.38:form==='iris'?.29:form==='dahlia'?.20:.99, 0.045)], 0.014));
      addMesh(flower, mergeOwned(filaments), 'filament', 'Six filaments and central style');
      addMesh(flower, mergeOwned(anthers), 'anther', 'Amber pollen anthers');
    }
  }
  addMesh(content, mergeOwned(stemParts), 'stem', 'Five slender persistent stems');
  const leaves = [];
  for (let i = 0; i < (form==='lotus'?4:form==='iris'?7:form==='dahlia'?6:11); i++) {
    if(form==='lotus'){leaves.push(waterLeafGeometry(i));continue;}
    if(form==='iris'){leaves.push(swordLeafGeometry(i));continue;}
    if(form==='dahlia'){leaves.push(dahliaLeafGeometry(i));continue;}
    const height = form==='lotus'?.14+i*.015:0.28 + i * 0.19;
    const angle = i * 2.33 + 0.6;
    const length = 0.68 + 0.17 * Math.sin(i * 1.8) + (i < 3 ? 0.12 : 0);
    leaves.push(leafGeometry(form==='lotus'?length*1.15:form==='iris'?length*1.2:length, form==='lotus'?.39:0.11 + (i % 3) * 0.018, angle, height, [-0.03 + 0.09 * Math.sin(i), 0.04]));
  }
  addMesh(content, mergeOwned(leaves), 'leaf', 'Original foliage with a raised midrib');
  }
  buildForm(currentForm);

  function setForm(id) {
    if(disposed)throw new Error('Cannot change a disposed bouquet');
    const next=FLOWER_FORMS.some(f=>f.id===id)?id:'lily';
    if(next===currentForm)return currentForm;
    for(const geometry of geometries)geometry.dispose();
    geometries.clear();content.clear();morphs.length=0;renderMeshes.length=0;surfaceTable=undefined;surfaceSamples=undefined;
    currentForm=next;buildForm(currentForm);setBloom(currentBloom);setOpacity(opacity);
    return currentForm;
  }

  function setBloom(value) {
    const bloom = currentBloom = clamp01(value);
    for (const mesh of morphs) mesh.morphTargetInfluences[0] = bloom;
  }
  function setOpacity(value) {
    opacity = clamp01(value);
    group.visible = opacity > 0.001;
    for (const material of materials) {
      const transparent = opacity < 0.999;
      if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
      material.opacity = opacity;
      material.depthWrite = opacity >= 0.999;
    }
  }
  function setMaterial(kind = 'silver', variant = 'blush') {
    materialKind = FLOWER_SERIES.some(s=>s.id===kind) ? kind : 'silver';
    variant = materialVariant = variant === 'golden' ? 'golden' : 'blush';
    surface = {...SURFACE_PRESETS[materialKind]};
    if (materialKind === 'lily' && !textures.has(variant)) textures.set(variant, petalTexture(variant));
    for (const [role, material] of Object.entries(roles)) {
      material.map = null; material.transmission = 0; material.thickness = 0;
      material.iridescence = 0; material.clearcoat = 0; material.sheen = 0; material.dispersion = 0;
      material.iridescenceThicknessMap = null; material.emissive.set(0x000000); material.emissiveIntensity = 0;
      material.ior = 1.45; material.envMapIntensity = 1.25;
      material.color.set(0xe1e4ec);
      if (materialKind === 'silver') {
        // A bright silver substrate and a slightly wider reflection lobe keep
        // the petals luminous without erasing their physical thin-film colour.
        material.color.set(0xd0d7e1); material.metalness = 0.83;
        material.roughness = role === 'petal' || role === 'bud' ? 0.235 : 0.28;
        material.iridescenceIOR = 1.7;
        material.iridescenceThicknessMap = filmTexture;
        material.clearcoat = 0.24; material.clearcoatRoughness = 0.19;
      } else if (materialKind === 'crystal') {
        material.color.set(role==='petal'||role==='bud'?0xd6e4f7:0xb4d1e8); material.metalness = 0; material.roughness = 0.08;
        material.transmission = role === 'anther' ? 0.78 : 0.87;
        material.thickness = role === 'petal' || role === 'bud' ? 0.72 : 0.24;
        material.dispersion = 0.24; material.clearcoat = 0.8; material.clearcoatRoughness = 0.065; material.ior=1.70;
        material.attenuationColor.set(0x9cbada); material.attenuationDistance = 1.25;
        material.iridescenceIOR = 1.45; material.iridescenceThicknessMap = filmTexture;
      } else if(materialKind==='amber'||materialKind==='celadon') {
        const amber=materialKind==='amber',petal=role==='petal'||role==='bud';
        material.color.set(petal?(amber?0xe9a54d:0x8ccab4):role==='anther'?(amber?0xd58932:0xc8ac57):(amber?0x997545:0x4a8e81));
        material.metalness=amber?.12:.04;material.roughness=amber?.24:.28;
        material.transmission=petal?(amber?.42:.13):0;material.thickness=petal?.52:.08;
        material.attenuationColor.set(amber?0xb34a1f:0x52a395);material.attenuationDistance=amber?.85:1.3;
        material.clearcoat=amber?.55:.9;material.clearcoatRoughness=.16;material.ior=amber?1.58:1.47;
        material.sheen=amber?.1:.24;material.sheenColor.set(amber?0xf5c477:0xc9e2cf);
        material.iridescenceIOR=1.3;material.iridescenceThicknessMap=filmTexture;
      } else {
        material.metalness = 0; material.roughness = 0.47; material.envMapIntensity = 0.8;
        if (role === 'petal' || role === 'bud') {
          material.color.set(0xffffff); material.map = textures.get(variant);
          material.sheen = 0.24; material.sheenColor.set(variant === 'golden' ? 0xf6dbb0 : 0xf1d0dc);
          material.sheenRoughness = 0.65; material.clearcoat = 0.07;
        } else if (role === 'stem' || role === 'leaf') {
          material.color.set(role === 'leaf' ? 0x427041 : 0x597b46); material.roughness = 0.45;
          material.sheen = 0.08; material.sheenColor.set(0xa8c780);
        } else if (role === 'anther') {
          material.color.set(variant === 'golden' ? 0xb87726 : 0x9b4f3e); material.roughness = 0.6;
        } else { material.color.set(0xc8d4a9); material.roughness = 0.43; }
      }
      material.needsUpdate = true;
    }
    // Preserve the distinct preset roughness of pollen, stems and petals until
    // the player explicitly edits gloss; querying setSurface() never changes it.
    applySurface(['iridescence', 'thickness', 'radiance']);
    setOpacity(opacity);
    return {...surface};
  }
  function setSurface(parameters = {}) {
    const changed = [];
    if (parameters && typeof parameters === 'object') {
      for (const key of ['iridescence', 'gloss', 'radiance']) {
        if (Number.isFinite(parameters[key])) { surface[key] = clamp01(parameters[key]); changed.push(key); }
      }
      if (Number.isFinite(parameters.thickness)) {
        surface.thickness = Math.max(100, Math.min(800, parameters.thickness)); changed.push('thickness');
      }
    }
    if (materialKind === 'lily') surface.iridescence = 0;
    if (changed.length) applySurface(changed);
    return {...surface};
  }
  function applySurface(changed) {
    const spread = Math.min(145, surface.thickness - 100, 800 - surface.thickness);
    for (const [role, material] of Object.entries(roles)) {
      const petal = role === 'petal' || role === 'bud';
      if (changed.includes('gloss')) material.roughness = 1 - surface.gloss * 0.9;
      if (materialKind !== 'lily') {
        material.iridescence = surface.iridescence * (petal ? 1 : 0.62);
        material.iridescenceThicknessRange[0] = surface.thickness - spread;
        material.iridescenceThicknessRange[1] = surface.thickness + spread;
      } else material.iridescence = 0;
      // Radiance mostly opens the reflected fill. Only a very small independent
      // emissive contribution is allowed, so full radiance retains petal detail.
      if (changed.includes('radiance')) {
        material.envMapIntensity = (materialKind === 'lily' ? 0.8 : materialKind === 'crystal' ? 1.2 : 1.25) + surface.radiance * 0.35;
        material.emissive.set(petal ? 0xd6d8ee : 0xa8b5c8);
        material.emissiveIntensity = surface.radiance * (materialKind === 'lily' ? 0.025 : 0.10) * (petal ? 1 : 0.4);
      }
    }
  }
  function sampledSurface(count) {
    if (!Number.isInteger(count) || count < 0) throw new RangeError('Particle count must be a non-negative integer');
    if (disposed) throw new Error('Cannot sample a disposed bouquet');
    if (surfaceSamples?.count === count) return surfaceSamples;
    // Exactly one count for the current form is retained. Grain and tint stay
    // Float64: rounding these to Float32 would subtly recolor existing samples.
    const closed = new Float32Array(count * 3), open = new Float32Array(count * 3);
    const roles = new Uint8Array(count), grains = new Float64Array(count), tints = new Float64Array(count), openY = new Float32Array(count);
    const samples = {count, closed, open, roles, grains, tints, openY};
    if (!count) return (surfaceSamples = samples);
    surfaceTable ??= createSurfaceTable(group);
    const {items, cumulative, area} = surfaceTable, rng = randomGenerator(seed);
    for (let i = 0; i < count; i++) {
      const target = rng() * area;
      let lo = 0, hi = cumulative.length - 1;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (cumulative[mid] < target) lo = mid + 1; else hi = mid; }
      const face = items[lo], root = Math.sqrt(rng()), second = rng();
      const weights = [1 - root, root * (1 - second), root * second];
      for (let c = 0; c < 3; c++) {
        const j = i * 3 + c;
        for (let k = 0; k < 3; k++) {
          closed[j] += face.closed[face.ids[k] * 3 + c] * weights[k];
          open[j] += face.open[face.ids[k] * 3 + c] * weights[k];
        }
      }
      const grain=rng();
      let uvY=0;for(let k=0;k<3;k++)uvY+=(face.uv?.getY(face.ids[k])??.5)*weights[k];
      const tint=clamp01(uvY*.7+grain*.3);
      roles[i] = face.role === 'stem' || face.role === 'leaf' ? 1 : face.role === 'anther' || face.role === 'filament' ? 2 : 0;
      grains[i] = grain; tints[i] = tint; openY[i] = open[i * 3 + 1];
    }
    return (surfaceSamples = samples);
  }
  function colorSamples(samples) {
    const {count, roles, grains, tints, openY} = samples, colors = new Float32Array(count * 3);
    const palette=getFlowerPalette(materialKind,materialVariant),low=new Color(palette.low),high=new Color(palette.high),accent=new Color(palette.accent),stem=new Color(palette.stem),pollen=new Color(palette.pollen),color=new Color();
    for (let i = 0; i < count; i++) {
      const grain = grains[i], tint = tints[i];
      if(materialKind==='silver') {
        // The silver's optical palette retains the reference's vertical pink/blue
        // interference family; other series keep their own petal/foliage colors.
        color.copy(low).lerp(high,clamp01((openY[i]/scale-.5)/3.7));
      }
      else if(roles[i]===1)color.copy(stem).lerp(low,grain*.18);
      else if(roles[i]===2)color.copy(pollen).lerp(accent,grain*.3);
      else color.copy(low).lerp(high,tint).lerp(accent,Math.pow(grain,7)*.42);
      color.toArray(colors,i*3);
    }
    return colors;
  }
  function sampleSurface(count) {
    const samples = sampledSurface(count);
    // Callers own their arrays, including the particle texture upload buffers.
    // Never expose the cached endpoints to mutation outside this bouquet.
    return {closed: samples.closed.slice(), open: samples.open.slice(), colors: colorSamples(samples)};
  }
  function sampleColors(count) {
    return colorSamples(sampledSurface(count));
  }
  function update(_time) {
    // Deliberately no CPU vertex animation: a hidden sway here would detach the
    // particles. The shared scene root owns any motion of the whole bouquet.
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures.values()) texture.dispose();
    surfaceTable = undefined; surfaceSamples = undefined;
  }
  setMaterial('silver'); setBloom(1);
  return {group, setBloom, setForm, setMaterial, setSurface, setOpacity, sampleSurface, sampleColors, update, dispose, get form(){return currentForm;},get series(){return materialKind;},get variant(){return materialVariant;},get palette(){return getFlowerPalette(materialKind,materialVariant);}};
}
