import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';

const MAX_COUNT = 65536;
const LOW_COUNT = 16384;
const clamp01 = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const seeded = id => { const n = Math.sin((id + 1) * 127.1) * 43758.5453; return n - Math.floor(n); };
const finiteVector = value => value && Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);

// Shared by the compute shaders and the analytic fallback: dispersion never
// changes the source ID, and blooming always interpolates the actual two poses.
const TARGET_GLSL = /* glsl */`
uniform float uBloom;
uniform float uDispersion;
uniform float uFlow;
uniform float uTime;
uniform float uReducedMotion;
uniform vec3 uCenter;
uniform float uExtent;
uniform vec3 uPointer;
uniform float uPointerStrength;
uniform float uPointerRadius;
uniform vec3 uGesturePosition;
uniform vec3 uGestureVelocity;
uniform float uGestureStrength;
uniform float uGestureMode;
uniform float uGestureRadius;

vec3 targetPosition(vec3 closedPosition, vec3 openPosition, float seed) {
  vec3 pose = mix(closedPosition, openPosition, uBloom);
  vec3 source = pose - uCenter;
  // Source-space angles carry the shape of the petals into the flow. The three
  // populations below are a scaffold, open sheets and connecting filaments;
  // they must not turn the flower into unrelated concentric orbit diagrams.
  float height = source.y / uExtent;
  float sourceAngle = atan(source.z, source.x + 0.00001);
  float sourceRadius = length(source.xz);
  float grain = fract(seed * 31.37) - 0.5;
  float time = uTime * mix(0.13, 0.014, uReducedMotion);
  float scaffoldAngle = sourceAngle + height * 0.48 + sin(time * 0.65) * 0.12;
  float scaffoldRadius = sourceRadius * (1.16 + sin(height * 4.0) * 0.04);
  vec3 scaffold = vec3(
    cos(scaffoldAngle) * scaffoldRadius,
    source.y * 1.06 + sin(sourceAngle * 2.0 + height * 7.0 + time) * uExtent * 0.022,
    sin(scaffoldAngle) * scaffoldRadius
  );
  float phase = sourceAngle + height * 2.25 + time * 0.48 + grain * 0.13;
  float radius = sourceRadius * 1.12 + uExtent * (0.16 + sin(sourceAngle * 3.0 + height * 3.0) * 0.055);
  vec3 sheet = vec3(
    cos(phase) * radius,
    source.y * 0.92 + sin(sourceAngle + height * 6.0 + time * 0.7) * uExtent * 0.13,
    sin(phase) * radius
  );
  sheet.y += grain * uExtent * 0.012;
  float filament = fract(seed * 13.71);
  vec3 bridge = mix(scaffold, sheet, filament);
  bridge += vec3(-sin(phase), 0.3, cos(phase)) * sin(filament * 3.141593) * uExtent * 0.045;
  vec3 flow = seed < 0.24 ? scaffold : seed < 0.74 ? sheet : bridge;
  // Drift grows from each petal's own angle and height, never a foreign cloud.
  // Smooth currents open negative space between the flower-derived ribbons.
  float journey = uFlow * (1.0 - uReducedMotion * 0.66);
  float stream = sourceAngle + height * 3.1 + time * 1.8 + grain * 0.48;
  vec3 current = vec3(
    cos(stream) * (sourceRadius * 1.25 + uExtent * (0.13 + grain * 0.09)),
    source.y * 0.80 + sin(stream * 1.35 + time) * uExtent * 0.14 + grain * uExtent * 0.08,
    sin(stream) * (sourceRadius * 1.16 + uExtent * 0.14)
  );
  flow = mix(flow, current, journey * (0.48 + 0.4 * sin(time * 0.53 + seed * 1.1) * sin(time * 0.53 + seed * 1.1)));
  return mix(pose, uCenter + flow, smoothstep(0.0, 1.0, uDispersion));
}

vec3 pointerDirection(vec3 position, float seed, out float influence) {
  vec3 offset = position - uPointer;
  float distanceToPointer = length(offset);
  influence = pow(max(0.0, 1.0 - distanceToPointer / uPointerRadius), 2.0) * uPointerStrength;
  // A finite direction even for a sample exactly beneath the pointer.
  return distanceToPointer > 0.0001 ? offset / distanceToPointer
    : normalize(vec3(cos(seed * 31.0), 0.37, sin(seed * 31.0)));
}

float gestureInfluence(vec3 position) {
  float radius = uGestureRadius * mix(1.0, 0.64, uGestureMode);
  float distanceToBrush = length(position - uGesturePosition) / max(radius, 0.001);
  float falloff = max(0.0, 1.0 - distanceToBrush * distanceToBrush);
  return falloff * falloff * uGestureStrength;
}

vec3 gestureForce(vec3 position, float seed, float influence) {
  vec3 offset = uGesturePosition - position;
  float distanceToBrush = length(offset);
  vec3 inward = offset / max(distanceToBrush, uExtent * 0.006);
  vec3 tangent = cross(vec3(0.0, 1.0, 0.0), inward);
  float motionScale = mix(1.0, 0.4, uReducedMotion);
  // Weave carries the local material with the hand; gather draws a soft knot.
  // Both are forces, never changes of sample IDs or teleports to the cursor.
  vec3 pull = offset * mix(8.0, 16.0, uGestureMode);
  vec3 carry = uGestureVelocity * mix(7.5, 2.2, uGestureMode);
  vec3 curl = tangent * uExtent * mix(5.8, 1.8, uGestureMode)
    * (0.8 + sin(seed * 12.0) * 0.2);
  return (pull + carry + curl) * influence * motionScale;
}
`;

// Both variables read the previous ping-pong textures. Computing the same next
// velocity here gives semi-implicit Euler without accidentally reading a new
// velocity texture while the position variable still reads the old position.
const INTEGRATE_GLSL = /* glsl */`
uniform sampler2D uClosed;
uniform sampler2D uOpen;
uniform float uStep;
${TARGET_GLSL}
vec3 nextVelocity(vec3 position, vec3 velocity, vec2 uv, float seed) {
  vec3 target = targetPosition(texture2D(uClosed, uv).xyz, texture2D(uOpen, uv).xyz, seed);
  float brush = gestureInfluence(position);
  vec3 force = (target - position) * mix(38.0, 15.0, uDispersion) * (1.0 - brush * 0.62);
  float influence;
  vec3 away = pointerDirection(position, seed, influence);
  force += (away + cross(vec3(0.0, 1.0, 0.0), away) * 0.15)
    * influence * uExtent * mix(34.0, 13.0, uReducedMotion);
  force += gestureForce(position, seed, brush);
  vec3 next = (velocity + force * uStep) * exp(-mix(7.4, 4.8, brush) * uStep);
  float speed = length(next);
  return next * min(1.0, uExtent * 3.0 / max(speed, 0.0001));
}
`;

const POSITION_GLSL = /* glsl */`
${INTEGRATE_GLSL}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 previous = texture2D(texturePosition, uv);
  vec3 velocity = texture2D(textureVelocity, uv).xyz;
  vec3 next = nextVelocity(previous.xyz, velocity, uv, previous.w);
  gl_FragColor = vec4(previous.xyz + next * uStep, previous.w);
}
`;

const VELOCITY_GLSL = /* glsl */`
${INTEGRATE_GLSL}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 position = texture2D(texturePosition, uv);
  vec4 previous = texture2D(textureVelocity, uv);
  vec3 next = nextVelocity(position.xyz, previous.xyz, uv, position.w);
  float brush = gestureInfluence(position.xyz);
  // Persistent heat makes the path of the hand legible after the hand leaves.
  float heat = max(previous.w * exp(-1.8 * uStep), brush * 0.9);
  gl_FragColor = vec4(next, heat);
}
`;

// A quality change resizes the state atlas, but retains the first N stable IDs.
// Copy by source index rather than by normalized UV (which would shuffle IDs).
const RESIZE_STATE_GLSL = /* glsl */`
uniform sampler2D uPreviousPosition;
uniform sampler2D uPreviousVelocity;
uniform sampler2D uClosed;
uniform sampler2D uOpen;
uniform float uPreviousSide;
uniform float uPreviousCount;
uniform float uStateKind;
${TARGET_GLSL}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float index = cell.y * resolution.x + cell.x;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  if (index < uPreviousCount) {
    vec2 previousUv = (vec2(mod(index, uPreviousSide), floor(index / uPreviousSide)) + 0.5) / uPreviousSide;
    gl_FragColor = uStateKind < 0.5 ? texture2D(uPreviousPosition, previousUv) : texture2D(uPreviousVelocity, previousUv);
  } else {
    vec4 closed = texture2D(uClosed, uv);
    vec3 open = texture2D(uOpen, uv).xyz;
    gl_FragColor = uStateKind < 0.5 ? vec4(targetPosition(closed.xyz, open, closed.w), closed.w) : vec4(0.0);
  }
}
`;

const VERTEX_GLSL = /* glsl */`
attribute vec3 aClosed;
attribute vec3 aOpen;
attribute vec3 aTint;
attribute vec2 aStateUv;
attribute float aSeed;
uniform sampler2D uPosition;
uniform sampler2D uVelocity;
uniform float uViewportHeight;
uniform float uPixelRatio;
uniform float uGrainScale;
uniform vec2 uHeightRange;
varying vec3 vTint;
varying float vDepth;
varying float vSeed;
varying float vHeat;
varying float vFlowAlpha;
varying float vGlimmer;
${TARGET_GLSL}
void main() {
  vec3 localPosition;
  #ifdef USE_SIMULATION
    localPosition = texture2D(uPosition, aStateUv).xyz;
    vHeat = texture2D(uVelocity, aStateUv).w;
  #else
    localPosition = targetPosition(aClosed, aOpen, aSeed);
    float influence;
    vec3 away = pointerDirection(localPosition, aSeed, influence);
    localPosition += away * influence * uPointerRadius * mix(0.72, 0.3, uReducedMotion);
    float brush = gestureInfluence(localPosition);
    localPosition += gestureForce(localPosition, aSeed, brush) * 0.032;
    vHeat = brush;
  #endif
  vec4 mv = modelViewMatrix * vec4(localPosition, 1.0);
  gl_Position = projectionMatrix * mv;
  float modelScale = length(modelViewMatrix[0].xyz);
  float pointSize = uExtent * 0.0033 * modelScale * uViewportHeight * projectionMatrix[1][1] / max(-mv.z, 0.5);
  gl_PointSize = clamp(pointSize * uGrainScale * (0.76 + aSeed * 0.48) * (1.0 + vHeat * 0.22), uPixelRatio * 0.95, uPixelRatio * 4.1);
  float height = smoothstep(uHeightRange.x, uHeightRange.y, mix(aClosed.y, aOpen.y, uBloom));
  // Linear-space values stay deliberately below white; dense overlaps retain
  // the reference's lilac/blue material identity after output color conversion.
  vTint = aTint * (0.70 + 0.15 * height);
  vDepth = -mv.z;
  vSeed = aSeed;
  vFlowAlpha = mix(1.0, aSeed < 0.24 ? 0.65 : aSeed < 0.74 ? 0.88 : 0.60, uDispersion);
  vGlimmer = pow(0.5 + 0.5 * sin(uTime * 0.9 + aSeed * 101.0), 18.0)
    * step(0.96, aSeed) * vHeat * (1.0 - uReducedMotion * 0.8);
}
`;

const FRAGMENT_GLSL = /* glsl */`
uniform float uNight;
uniform float uDensityAlpha;
uniform float uOpacity;
varying vec3 vTint;
varying float vDepth;
varying float vSeed;
varying float vHeat;
varying float vFlowAlpha;
varying float vGlimmer;
void main() {
  float radius2 = dot(gl_PointCoord - 0.5, gl_PointCoord - 0.5) * 4.0;
  if (radius2 > 1.0) discard;
  float core = exp(-radius2 * 4.8);
  float halo = exp(-radius2 * 1.8) * 0.19;
  float depthFade = 0.62 + 0.38 * exp(-vDepth * 0.045);
  float alpha = (core + halo) * uDensityAlpha * uOpacity * depthFade * (1.0 + vHeat * 0.2) * vFlowAlpha;
  vec3 color = vTint * mix(0.82, 1.24, uNight) * (0.86 + vSeed * 0.28);
  // Heat lifts luminance without washing the source's pink/blue strata white.
  // Only sparse, slow glints approach a pale highlight along the recent stroke.
  vec3 heated = vTint * 1.6 + sqrt(max(vTint,vec3(0.0))) * 0.09;
  color = mix(color, heated, min(vHeat * 0.6, 0.6));
  color += sqrt(max(vTint,vec3(0.0))) * vGlimmer * .7;
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Stable surface particles in the bouquet's local coordinate system.
 * The caller owns object visibility and may fade object.material.uniforms.uOpacity.
 * This module owns no DOM events, gameplay state, or supplied sample buffers.
 */
export function createSurfaceParticles(renderer, samples, { quality = 'standard' } = {}) {
  if (!samples || !['closed', 'open', 'colors'].every(key => samples[key] instanceof Float32Array)) {
    throw new TypeError('Particle samples must be Float32Array closed/open/colors buffers.');
  }
  let length = samples.closed.length;
  if (length === 0 || length % 3 || samples.open.length !== length || samples.colors.length !== length) {
    throw new RangeError('Particle samples require nonempty matching xyz/rgb buffer lengths.');
  }
  // Validate once, not in the render loop. Bound source work to the actual budget.
  let available = Math.min(MAX_COUNT, length / 3);
  const bounds = new THREE.Box3();
  const probe = new THREE.Vector3();
  for (let i = 0; i < available * 3; i += 3) {
    for (const array of [samples.closed, samples.open, samples.colors]) {
      if (!Number.isFinite(array[i]) || !Number.isFinite(array[i + 1]) || !Number.isFinite(array[i + 2])) {
        throw new RangeError('Particle source samples must contain finite values.');
      }
    }
    bounds.expandByPoint(probe.fromArray(samples.closed, i));
    bounds.expandByPoint(probe.fromArray(samples.open, i));
  }
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  let extent = Math.max(size.x, size.y, size.z, 0.1);
  const viewport = new THREE.Vector2();
  const common = {
    uBloom: { value: 1 }, uDispersion: { value: 0 }, uFlow: {value: 0}, uTime: { value: 0 },
    uReducedMotion: { value: 0 }, uCenter: { value: center }, uExtent: { value: extent },
    uPointer: { value: new THREE.Vector3() }, uPointerStrength: { value: 0 },
    uPointerRadius: { value: extent * 0.31 },
    uGesturePosition: { value: new THREE.Vector3() }, uGestureVelocity: { value: new THREE.Vector3() },
    uGestureStrength: { value: 0 }, uGestureMode: { value: 0 },
    uGestureRadius: { value: extent * 0.39 },
  };
  const uniforms = {
    ...common,
    uPosition: { value: null }, uVelocity: { value: null }, uViewportHeight: { value: 720 }, uPixelRatio: { value: 1 }, uGrainScale: { value: 0.92 },
    uHeightRange: { value: new THREE.Vector2(bounds.min.y, Math.max(bounds.max.y, bounds.min.y + 0.01)) },
    uNight: { value: 0 }, uDensityAlpha: { value: 0.64 }, uOpacity: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    name: 'SpringLetterSurfaceParticles', uniforms,
    vertexShader: VERTEX_GLSL, fragmentShader: FRAGMENT_GLSL,
    transparent: true, depthWrite: false, depthTest: true,
    blending: THREE.NormalBlending, toneMapped: true,
  });
  const object = new THREE.Points(new THREE.BufferGeometry(), material);
  object.name = 'SpringLetterSurfaceParticles';
  object.frustumCulled = false;
  let compute = null;
  let positionVariable = null;
  let velocityVariable = null;
  let closedTexture = null;
  let openTexture = null;
  let activeCount = 0;
  let side = 0;
  let backend = 'analytic-fallback';
  let fallbackReason = null;
  let disposed = false;
  let selectedQuality = quality;
  let pointerEnvelope = 0;
  let gestureInitialized = false;
  let gestureActive = false;
  const gestureTarget = new THREE.Vector3();
  const velocityTarget = new THREE.Vector3();

  // Extension support alone does not guarantee a complete render target.
  function supportsFloatTargets() {
    if (!renderer.capabilities?.isWebGL2 || !renderer.extensions?.has('EXT_color_buffer_float') ||
        !renderer.capabilities.maxVertexTextures) {
      fallbackReason = 'WebGL2 float color target or vertex texture support is unavailable.';
      return false;
    }
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.FloatType, format: THREE.RGBAFormat, depthBuffer: false,
      minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
    });
    const previous = renderer.getRenderTarget();
    try {
      renderer.setRenderTarget(target);
      const gl = renderer.getContext();
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      if (!complete) fallbackReason = 'Float framebuffer is incomplete.';
      return complete;
    } catch (error) {
      fallbackReason = `Float framebuffer check failed: ${error.message}`;
      return false;
    } finally {
      renderer.setRenderTarget(previous);
      target.dispose();
    }
  }
  const canCompute = supportsFloatTargets();

  function releaseSimulation() {
    compute?.dispose();
    closedTexture?.dispose();
    openTexture?.dispose();
    compute = null; positionVariable = null; velocityVariable = null;
    closedTexture = null; openTexture = null;
    uniforms.uPosition.value = null;
    uniforms.uVelocity.value = null;
  }

  function rebuild(nextQuality, force=false) {
    if (disposed) return;
    selectedQuality = nextQuality === 'low' ? 'low' : nextQuality === 'high' ? 'high' : nextQuality === 'balanced' ? 'balanced' : 'standard';
    const nextCount = Math.min(available, selectedQuality === 'low' ? LOW_COUNT : MAX_COUNT);
    if (nextCount === activeCount && !force) return;
    const previousSimulation = compute ? {
      compute, closedTexture, openTexture, side, count: activeCount,
      position: compute.getCurrentRenderTarget(positionVariable).texture,
      velocity: compute.getCurrentRenderTarget(velocityVariable).texture,
    } : null;
    // Keep the previous atlas alive until the new renderer has copied its IDs.
    compute = null; positionVariable = null; velocityVariable = null;
    closedTexture = null; openTexture = null;
    uniforms.uPosition.value = null; uniforms.uVelocity.value = null;
    activeCount = nextCount;
    side = Math.ceil(Math.sqrt(activeCount));
    const closed = samples.closed.slice(0, activeCount * 3);
    const open = samples.open.slice(0, activeCount * 3);
    const colors = samples.colors.slice(0, activeCount * 3);
    const ids = new Float32Array(activeCount);
    const seeds = new Float32Array(activeCount);
    const stateUv = new Float32Array(activeCount * 2);
    for (let i = 0; i < activeCount; i++) {
      ids[i] = i; seeds[i] = seeded(i);
      stateUv[i * 2] = (i % side + 0.5) / side;
      stateUv[i * 2 + 1] = (Math.floor(i / side) + 0.5) / side;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(open.slice(), 3));
    geometry.setAttribute('aClosed', new THREE.BufferAttribute(closed, 3));
    geometry.setAttribute('aOpen', new THREE.BufferAttribute(open, 3));
    geometry.setAttribute('aTint', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute('aSourceId', new THREE.BufferAttribute(ids, 1));
    geometry.setAttribute('aStateUv', new THREE.BufferAttribute(stateUv, 2));
    geometry.setDrawRange(0, activeCount);
    object.geometry.dispose();
    object.geometry = geometry;
    backend = 'analytic-fallback';
    delete material.defines.USE_SIMULATION;

    if (canCompute) {
      try {
        compute = new GPUComputationRenderer(side, side, renderer);
        closedTexture = compute.createTexture();
        openTexture = compute.createTexture();
        const initialPosition = compute.createTexture();
        const initialVelocity = compute.createTexture();
        for (let i = 0; i < side * side; i++) {
          const source = Math.min(i, activeCount - 1);
          const si = source * 3;
          const ti = i * 4;
          for (let axis = 0; axis < 3; axis++) {
            closedTexture.image.data[ti + axis] = closed[si + axis];
            openTexture.image.data[ti + axis] = open[si + axis];
            initialPosition.image.data[ti + axis] = THREE.MathUtils.lerp(closed[si + axis], open[si + axis], common.uBloom.value);
          }
          closedTexture.image.data[ti + 3] = seeds[source];
          initialPosition.image.data[ti + 3] = seeds[source];
        }
        positionVariable = compute.addVariable('texturePosition', POSITION_GLSL, initialPosition);
        velocityVariable = compute.addVariable('textureVelocity', VELOCITY_GLSL, initialVelocity);
        compute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
        compute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
        for (const variable of [positionVariable, velocityVariable]) {
          Object.assign(variable.material.uniforms, common, {
            uClosed: { value: closedTexture }, uOpen: { value: openTexture }, uStep: { value: 0 },
          });
        }
        const error = compute.init();
        if (error) throw new Error(error);
        if (previousSimulation) {
          const resizeMaterial = compute.createShaderMaterial(RESIZE_STATE_GLSL, {
            ...common,
            uPreviousPosition: { value: previousSimulation.position },
            uPreviousVelocity: { value: previousSimulation.velocity },
            uPreviousSide: { value: previousSimulation.side },
            uPreviousCount: { value: previousSimulation.count },
            uClosed: { value: closedTexture }, uOpen: { value: openTexture },
            uStateKind: { value: 0 },
          });
          try {
            for (const variable of [positionVariable, velocityVariable]) {
              resizeMaterial.uniforms.uStateKind.value = variable === positionVariable ? 0 : 1;
              compute.doRenderTarget(resizeMaterial, compute.getCurrentRenderTarget(variable));
              compute.doRenderTarget(resizeMaterial, compute.getAlternateRenderTarget(variable));
            }
          } finally { resizeMaterial.dispose(); }
        }
        backend = 'gpu-spring'; fallbackReason = null;
        material.defines.USE_SIMULATION = 1;
        uniforms.uPosition.value = compute.getCurrentRenderTarget(positionVariable).texture;
        uniforms.uVelocity.value = compute.getCurrentRenderTarget(velocityVariable).texture;
      } catch (error) {
        fallbackReason = `GPU initialization failed: ${error.message}`;
        releaseSimulation();
      } finally {
        previousSimulation?.compute.dispose();
        previousSimulation?.closedTexture?.dispose();
        previousSimulation?.openTexture?.dispose();
      }
    }
    material.needsUpdate = true;
    // Low quality retains a clearly legible point silhouette at one-quarter cost.
    uniforms.uDensityAlpha.value = activeCount <= LOW_COUNT ? 0.83 : 0.62;
    uniforms.uGrainScale.value = activeCount <= LOW_COUNT ? 1 : 0.92;
  }

  rebuild(quality);

  function validateSource(next) {
    if(!next||!['closed','open','colors'].every(key=>next[key] instanceof Float32Array))throw new TypeError('Source requires Float32Array buffers');
    const n=next.closed.length;
    if(!n||n%3||next.open.length!==n||next.colors.length!==n)throw new RangeError('Source buffers must match');
    for(const array of [next.closed,next.open,next.colors]){
      for(let i=0;i<Math.min(n,MAX_COUNT*3);i++)if(!Number.isFinite(array[i]))throw new RangeError('Source must be finite');
    }
  }
  function setColors(colors) {
    if(disposed)return;
    if(!(colors instanceof Float32Array)||colors.length!==length)throw new RangeError('Color buffer must match source');
    for(let i=0;i<Math.min(length,MAX_COUNT*3);i++)if(!Number.isFinite(colors[i]))throw new RangeError('Colors must be finite');
    samples={...samples,colors};
    object.geometry.attributes.aTint.array.set(colors.subarray(0,activeCount*3));
    object.geometry.attributes.aTint.needsUpdate=true;
  }
  function setSource(next,{preserveMotion=true}={}) {
    if(disposed)return;
    validateSource(next);
    const oldAvailable=available;samples=next;length=next.closed.length;available=Math.min(MAX_COUNT,length/3);
    bounds.makeEmpty();
    for(let i=0;i<available*3;i+=3){bounds.expandByPoint(probe.fromArray(samples.closed,i));bounds.expandByPoint(probe.fromArray(samples.open,i));}
    bounds.getCenter(center);bounds.getSize(size);extent=Math.max(size.x,size.y,size.z,.1);
    common.uExtent.value=extent;common.uPointerRadius.value=extent*.31;common.uGestureRadius.value=extent*.39;
    uniforms.uHeightRange.value.set(bounds.min.y,Math.max(bounds.max.y,bounds.min.y+.01));
    if(!preserveMotion){releaseSimulation();activeCount=0;rebuild(selectedQuality,true);return;}
    if(oldAvailable!==available){rebuild(selectedQuality,true);return;}
    // Reuse the active geometry, render targets and IDs; only targets change.
    for(const [attribute,key] of [['position','open'],['aClosed','closed'],['aOpen','open'],['aTint','colors']]){
      object.geometry.attributes[attribute].array.set(samples[key].subarray(0,activeCount*3));
      object.geometry.attributes[attribute].needsUpdate=true;
    }
    if(compute){
      for(let i=0;i<side*side;i++){
        const source=Math.min(i,activeCount-1);
        for(let axis=0;axis<3;axis++){
          closedTexture.image.data[i*4+axis]=samples.closed[source*3+axis];
          openTexture.image.data[i*4+axis]=samples.open[source*3+axis];
        }
      }
      closedTexture.needsUpdate=true;openTexture.needsUpdate=true;
    }
  }


  function update(dt, time, state = {}) {
    if (disposed) return;
    const delta = Math.max(0, Math.min(0.05, Number.isFinite(dt) ? dt : 0));
    if (Number.isFinite(state.bloom)) common.uBloom.value = clamp01(state.bloom);
    if (Number.isFinite(state.dispersion)) common.uDispersion.value = clamp01(state.dispersion);
    common.uFlow.value=Number.isFinite(state.flow)?clamp01(state.flow):common.uDispersion.value*.7;
    if (Number.isFinite(state.opacity)) uniforms.uOpacity.value = clamp01(state.opacity);
    if (Number.isFinite(time)) common.uTime.value = time % 10000;
    common.uReducedMotion.value = state.reducedMotion ? 1 : 0;
    uniforms.uNight.value = typeof state.night === 'number' ? clamp01(state.night) : state.night ? 1 : 0;
    const pointer = state.pointer;
    const gesture = state.gesture;
    const validGesture = !!(gesture?.active && finiteVector(gesture.position));
    const desiredStrength = validGesture ? clamp01(gesture.strength ?? 1) : 0;
    const response = 1 - Math.exp(-22 * delta);
    if (validGesture) {
      // Finite but pathological external values must not overflow float textures.
      for (const axis of ['x', 'y', 'z']) {
        gestureTarget[axis] = THREE.MathUtils.clamp(gesture.position[axis], center[axis] - extent * 8, center[axis] + extent * 8);
        velocityTarget[axis] = finiteVector(gesture.velocity)
          ? THREE.MathUtils.clamp(gesture.velocity[axis], -extent * 3, extent * 3) : 0;
      }
      velocityTarget.clampLength(0, extent * 3);
      if (!gestureInitialized || (!gestureActive && common.uGestureStrength.value < 0.02)) {
        common.uGesturePosition.value.copy(gestureTarget);
        gestureInitialized = true;
      } else {
        common.uGesturePosition.value.lerp(gestureTarget, response);
      }
      common.uGestureVelocity.value.lerp(velocityTarget, response);
      const gathering=gesture.mode==='gather'||(gesture.mode!=='weave'&&common.uGestureVelocity.value.length()<extent*.08);
      common.uGestureMode.value += ((gathering ? 1 : 0) - common.uGestureMode.value) * response;
    } else {
      common.uGestureVelocity.value.multiplyScalar(Math.exp(-7 * delta));
    }
    // The tail of the force and the simulated velocity both survive release.
    // This permits a natural return without a click-to-restore state transition.
    common.uGestureStrength.value += (desiredStrength - common.uGestureStrength.value) *
      (1 - Math.exp(-(validGesture ? 18 : 6.5) * delta));
    gestureActive = validGesture;
    const validPointer = finiteVector(pointer) && !validGesture;
    if (validPointer) {
      for (const axis of ['x', 'y', 'z']) {
        common.uPointer.value[axis] = THREE.MathUtils.clamp(pointer[axis], center[axis] - extent * 8, center[axis] + extent * 8);
      }
    }
    if (backend === 'gpu-spring') {
      common.uPointerStrength.value = validPointer ? 1 : 0;
    } else {
      // Keep the last influence centre while decaying, so pointer exit returns
      // continuously even though fallback has no simulated per-point velocity.
      pointerEnvelope += ((validPointer ? 1 : 0) - pointerEnvelope) * (1 - Math.exp(-12 * delta));
      common.uPointerStrength.value = pointerEnvelope;
    }
    renderer.getDrawingBufferSize(viewport);
    uniforms.uViewportHeight.value = Math.max(1, viewport.y);
    uniforms.uPixelRatio.value = Math.min(3, Math.max(0.5, renderer.getPixelRatio()));
    if (compute && delta > 0) {
      const steps = Math.max(1, Math.ceil(delta / (1 / 60)));
      const step = delta / steps;
      positionVariable.material.uniforms.uStep.value = step;
      velocityVariable.material.uniforms.uStep.value = step;
      for (let i = 0; i < steps; i++) compute.compute();
      uniforms.uPosition.value = compute.getCurrentRenderTarget(positionVariable).texture;
      uniforms.uVelocity.value = compute.getCurrentRenderTarget(velocityVariable).texture;
    }
  }

  return {
    object, update, setSource, setColors,
    setQuality: rebuild,
    getStats: () => ({
      backend, activeCount, sourceCount: length / 3, quality: selectedQuality,
      simulationWidth: compute ? side : 0, simulationHeight: compute ? side : 0,
      simulationTexels: compute ? side * side : 0, fallbackReason, disposed,
      gestureActive, gestureStrength: common.uGestureStrength.value,
      gestureMode: common.uGestureMode.value > 0.5 ? 'gather' : 'weave',
      flowShape: 'petal-streams-drifting-filaments', flow:common.uFlow.value,
    }),
    dispose() {
      if (disposed) return;
      disposed = true;
      releaseSimulation();
      object.geometry.dispose();
      material.dispose();
    },
  };
}
