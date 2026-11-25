import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createSurfaceParticles } from '../src/particles.js';

function fixture(count = 65536) {
  const closed = new Float32Array(count * 3);
  const open = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = i * 3;
    closed[j] = Math.sin(i) * .3; closed[j + 1] = i / count;
    open[j] = Math.sin(i) * 1.4; open[j + 1] = i / count + .3;
    open[j + 2] = Math.cos(i) * .6;
    colors[j] = .8; colors[j + 1] = .4; colors[j + 2] = .7;
  }
  return { closed, open, colors };
}
const unsupportedRenderer = {
  capabilities: { isWebGL2: true, maxVertexTextures: 16 },
  extensions: { has: () => false },
  getPixelRatio: () => 1,
  getDrawingBufferSize: target => target.set(1280, 720),
};

test('unsupported float target retains an honest, usable reduced-density fallback', () => {
  const samples = fixture();
  const before = samples.closed.slice();
  const particles = createSurfaceParticles(unsupportedRenderer, samples, { quality: 'low' });
  assert.equal(particles.getStats().backend, 'analytic-fallback');
  assert.equal(particles.getStats().activeCount, 16384);
  assert.equal(particles.object.geometry.drawRange.count, 16384);
  particles.update(100, 100, { bloom: .47, dispersion: .5, pointer: null, night: true });
  particles.setQuality('standard');
  assert.equal(particles.getStats().activeCount, 65536);
  assert.deepEqual(samples.closed, before);
  const ids = particles.object.geometry.getAttribute('aSourceId');
  assert.equal(ids.getX(16383), 16383);
  particles.setQuality('low');
  assert.equal(particles.object.geometry.getAttribute('aSourceId').getX(16383), 16383);
  particles.dispose();
  particles.dispose();
});

test('quality never invents source samples and malformed input fails clearly', () => {
  const particles = createSurfaceParticles(unsupportedRenderer, fixture(37), { quality: 'high' });
  assert.equal(particles.getStats().activeCount, 37);
  assert.equal(particles.object.geometry.drawRange.count, 37);
  particles.dispose();
  assert.throws(() => createSurfaceParticles(unsupportedRenderer, {
    closed: new Float32Array(3), open: new Float32Array(6), colors: new Float32Array(3),
  }), /same|matching|length/i);
});

test('wind brush accepts direct manipulation and decays continuously on release', () => {
  const particles = createSurfaceParticles(unsupportedRenderer, fixture(200));
  const position = new Vector3(.2, .6, 0);
  const velocity = new Vector3(2, .3, 0);
  const initialPosition = position.clone();
  const initialVelocity = velocity.clone();
  for (let i = 0; i < 30; i++) particles.update(1 / 60, i / 60, {
    gesture: { active: true, position, velocity, strength: .8, mode: 'gather' },
  });
  const active = particles.getStats();
  assert.equal(active.gestureActive, true);
  assert.equal(active.gestureMode, 'gather');
  assert.ok(active.gestureStrength > .79 && active.gestureStrength <= .8);
  const uniforms = particles.object.material.uniforms;
  assert.ok(uniforms.uGestureVelocity.value.length() > 0);
  particles.update(1 / 60, 1, { gesture: { active: false } });
  const released = particles.getStats().gestureStrength;
  assert.ok(released > 0 && released < active.gestureStrength, 'release must fade rather than snap');
  for (let i = 0; i < 180; i++) particles.update(1 / 60, 1 + i / 60);
  assert.ok(particles.getStats().gestureStrength < .00001);
  assert.ok(uniforms.uGestureVelocity.value.length() < .00001);
  assert.deepEqual(position, initialPosition);
  assert.deepEqual(velocity, initialVelocity);
  particles.dispose();
});

test('invalid or extreme brush input cannot poison GPU-bound state', () => {
  const particles = createSurfaceParticles(unsupportedRenderer, fixture(50));
  particles.update(.05, 1, {
    gesture: { active: true, position: new Vector3(1e300, -1e300, 0), velocity: new Vector3(1e300, 0, -1e300), strength: 100 },
  });
  const uniforms = particles.object.material.uniforms;
  assert.ok(uniforms.uGesturePosition.value.toArray().every(Number.isFinite));
  assert.ok(uniforms.uGestureVelocity.value.toArray().every(Number.isFinite));
  assert.ok(uniforms.uGestureVelocity.value.length() <= uniforms.uExtent.value * 3);
  particles.update(.05, 2, {
    gesture: { active: true, position: new Vector3(NaN, 0, 0), velocity: new Vector3(Infinity, 0, 0) },
  });
  assert.equal(particles.getStats().gestureActive, false);
  assert.ok(uniforms.uGesturePosition.value.toArray().every(Number.isFinite));
  particles.update(.05, 3, { pointer: new Vector3(1e300, -1e300, 0) });
  assert.ok(uniforms.uPointer.value.length() < uniforms.uExtent.value * 20);
  particles.dispose();
});


test('v6 source and palette updates preserve identities and reuse equal-size geometry',()=>{
 const particles=createSurfaceParticles(unsupportedRenderer,fixture(200));
 try{
  const geometry=particles.object.geometry,ids=geometry.attributes.aSourceId.array.slice(),replacement=fixture(200);
  replacement.open[0]=3;replacement.colors.fill(.2);
  particles.setSource(replacement);assert.equal(particles.object.geometry,geometry);assert.deepEqual(geometry.attributes.aSourceId.array,ids);
  assert.equal(geometry.attributes.aOpen.array[0],3);assert.equal(geometry.attributes.aTint.array[0],Math.fround(.2));
  const colors=new Float32Array(600).fill(.7);particles.setColors(colors);assert.equal(particles.object.geometry,geometry);assert.equal(geometry.attributes.aTint.array[0],Math.fround(.7));
  assert.throws(()=>particles.setColors(new Float32Array(3)),/match/);
  const invalid=fixture(200);invalid.open[4]=NaN;assert.throws(()=>particles.setSource(invalid),/finite/);assert.equal(geometry.attributes.aOpen.array[0],3);
  particles.setQuality('low');assert.equal(particles.getStats().activeCount,200);
  particles.setSource(fixture(37));assert.equal(particles.getStats().activeCount,37);assert.equal(particles.getStats().sourceCount,37);
 }finally{particles.dispose();}
});


test('v6 still pen gathers and moving pen carries without another mode button',()=>{
 const p=createSurfaceParticles(unsupportedRenderer,fixture(200));
 try{
  const position=new Vector3(.1,.5,0);for(let i=0;i<90;i++)p.update(1/60,i/60,{gesture:{active:true,position,velocity:new Vector3(),strength:.55}});
  assert.equal(p.getStats().gestureMode,'gather');
  for(let i=0;i<90;i++)p.update(1/60,2+i/60,{gesture:{active:true,position,velocity:new Vector3(3,1,0),strength:.8}});
  assert.equal(p.getStats().gestureMode,'weave');
 }finally{p.dispose();}
});
