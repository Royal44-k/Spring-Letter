import * as THREE from 'three';

const finiteVector = value => value && Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const TRIANGLE_CORNERS = [0, 1, 2, 2, 1, 3];

const THREAD_VERTEX = /* glsl */`
attribute float aBirth;
attribute float aEdge;
uniform float uClock;
uniform float uLifetime;
varying float vAge;
varying float vEdge;
void main() {
  vAge = clamp((uClock - aBirth) / uLifetime, 0.0, 1.0);
  vEdge = aEdge;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const THREAD_FRAGMENT = /* glsl */`
uniform vec3 uColor;
uniform float uOpacity;
varying float vAge;
varying float vEdge;
void main() {
  float fade = (1.0 - vAge) * (1.0 - vAge);
  float core = exp(-vEdge * vEdge * 6.0);
  vec3 color = mix(uColor * 1.1, vec3(1.7, 1.38, 1.18), core * 0.52);
  gl_FragColor = vec4(color, fade * (0.13 + core * 0.62) * uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
const SPARK_VERTEX = /* glsl */`
attribute float aBirth;
attribute float aSeed;
uniform float uClock;
uniform float uLifetime;
uniform float uWidth;
uniform float uReducedMotion;
varying float vAge;
void main() {
  float age = max(0.0, uClock - aBirth);
  vAge = clamp(age / uLifetime, 0.0, 1.0);
  vec3 drift = vec3(sin(aSeed * 41.7), 0.55 + aSeed, cos(aSeed * 29.3));
  vec3 point = position + drift * age * age * uWidth * 1.6 * (1.0 - uReducedMotion);
  vec4 mv = modelViewMatrix * vec4(point, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uWidth * 1500.0 / max(-mv.z, 0.2), 1.2, 5.0) * (1.0 - vAge * 0.65);
}
`;
const SPARK_FRAGMENT = /* glsl */`
uniform vec3 uColor;
uniform float uOpacity;
varying float vAge;
void main() {
  float radius = length(gl_PointCoord - 0.5) * 2.0;
  if (radius > 1.0) discard;
  float alpha = exp(-radius * radius * 4.0) * pow(1.0 - vAge, 1.5) * uOpacity * 0.7;
  gl_FragColor = vec4(mix(uColor, vec3(1.6, 1.35, 1.1), 0.52), alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Wind-brush feedback, in the same local coordinates as gesture.position.
 * Attach group to the bouquet for local input, or to the scene for world input.
 * Owns no DOM listeners or game state. No renderer, texture or remote asset needed.
 * At most two draw calls; low quality omits sparks and caps the trail at 48 samples.
 */
export function createGestureField({ maxPoints = 96, lifetime = 1.8, width = 0.035, color = 0xf5c7e8, quality = 'standard' } = {}) {
  const capacity = clamp(Number.isFinite(maxPoints) ? Math.floor(maxPoints) : 96, 8, 512);
  const duration = clamp(Number.isFinite(lifetime) ? lifetime : 1.8, 0.15, 8);
  const lineWidth = clamp(Number.isFinite(width) ? width : 0.035, 0.002, 1);
  const group = new THREE.Group();
  group.name = 'SpringLetterWindBrush';
  group.visible = false;

  // Ring storage never allocates as a gesture is drawn. Crossed strips keep the
  // thin thread visible when the player orbits through its first ribbon plane.
  const positions = new Float32Array(capacity * 3);
  const births = new Float64Array(capacity);
  const strokes = new Uint32Array(capacity);
  const pressures = new Float32Array(capacity);
  const threadPosition = new Float32Array((capacity - 1) * 12 * 3);
  const threadBirth = new Float32Array((capacity - 1) * 12);
  const threadEdge = new Float32Array((capacity - 1) * 12);
  const sparkPosition = new Float32Array(capacity * 3);
  const sparkBirth = new Float32Array(capacity);
  const sparkSeed = new Float32Array(capacity);
  const threadGeometry = new THREE.BufferGeometry();
  threadGeometry.setAttribute('position', new THREE.BufferAttribute(threadPosition, 3).setUsage(THREE.DynamicDrawUsage));
  threadGeometry.setAttribute('aBirth', new THREE.BufferAttribute(threadBirth, 1).setUsage(THREE.DynamicDrawUsage));
  threadGeometry.setAttribute('aEdge', new THREE.BufferAttribute(threadEdge, 1).setUsage(THREE.DynamicDrawUsage));
  threadGeometry.setDrawRange(0, 0);
  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPosition, 3).setUsage(THREE.DynamicDrawUsage));
  sparkGeometry.setAttribute('aBirth', new THREE.BufferAttribute(sparkBirth, 1).setUsage(THREE.DynamicDrawUsage));
  sparkGeometry.setAttribute('aSeed', new THREE.BufferAttribute(sparkSeed, 1).setUsage(THREE.DynamicDrawUsage));
  sparkGeometry.setDrawRange(0, 0);
  const threadAttributes = Object.values(threadGeometry.attributes);
  const sparkAttributes = Object.values(sparkGeometry.attributes);
  const uniforms = {
    uClock: { value: 0 }, uLifetime: { value: duration }, uWidth: { value: lineWidth },
    uColor: { value: new THREE.Color(color) }, uOpacity: { value: 1 }, uReducedMotion: { value: 0 },
  };
  const materialOptions = {
    uniforms, transparent: true, depthWrite: false, depthTest: true,
    blending: THREE.AdditiveBlending, toneMapped: true,
  };
  const threadMaterial = new THREE.ShaderMaterial({
    ...materialOptions, name: 'SpringLetterWindThread', side: THREE.DoubleSide,
    vertexShader: THREAD_VERTEX, fragmentShader: THREAD_FRAGMENT,
  });
  const sparkMaterial = new THREE.ShaderMaterial({
    ...materialOptions, name: 'SpringLetterWindSparks',
    vertexShader: SPARK_VERTEX, fragmentShader: SPARK_FRAGMENT,
  });
  const thread = new THREE.Mesh(threadGeometry, threadMaterial);
  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  thread.name = 'WindThread'; sparks.name = 'WindSparks';
  thread.frustumCulled = false; sparks.frustumCulled = false;
  thread.renderOrder = 20; sparks.renderOrder = 21;
  group.add(thread, sparks);

  let first = 0;
  let count = 0;
  let stroke = 0;
  let previousActive = false;
  let clock = 0;
  let segments = 0;
  let disposed = false;
  let selectedQuality;
  let activeLimit;
  const previous = new THREE.Vector3();
  const input = new THREE.Vector3();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const otherSide = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3(1, 0, 0);
  const sample = new THREE.Vector3();

  function setQuality(value) {
    if (disposed) return;
    selectedQuality = value === 'low' ? 'low' : 'standard';
    activeLimit = selectedQuality === 'low' ? Math.min(48, capacity) : capacity;
    while (count > activeLimit) { first = (first + 1) % capacity; count--; }
    sparks.visible = selectedQuality !== 'low';
    updateGeometry();
  }
  setQuality(quality);

  function append(point, birth, pressure) {
    if (count === activeLimit) { first = (first + 1) % capacity; count--; }
    const index = (first + count) % capacity;
    point.toArray(positions, index * 3);
    births[index] = birth; strokes[index] = stroke; pressures[index] = pressure;
    count++;
  }

  function updateGeometry() {
    let vertex = 0;
    segments = 0;
    for (let i = 0; i < count; i++) {
      const index = (first + i) % capacity;
      for (let axis = 0; axis < 3; axis++) sparkPosition[i * 3 + axis] = positions[index * 3 + axis];
      sparkBirth[i] = births[index];
      sparkSeed[i] = ((index * 73 + strokes[index] * 11) % 101) / 101;
      if (i === 0) continue;
      const before = (first + i - 1) % capacity;
      if (strokes[before] !== strokes[index]) continue;
      a.fromArray(positions, before * 3); b.fromArray(positions, index * 3);
      tangent.subVectors(b, a);
      if (tangent.lengthSq() < 1e-10) continue;
      tangent.normalize();
      side.crossVectors(tangent, Math.abs(tangent.y) > 0.92 ? right : up).normalize();
      otherSide.crossVectors(tangent, side).normalize();
      // Two crossing camera-independent ribbons share one material and draw call.
      for (let plane = 0; plane < 2; plane++) {
        const axis = plane === 0 ? side : otherSide;
        for (const corner of TRIANGLE_CORNERS) {
          const atEnd = corner >= 2;
          const edge = corner % 2 ? 1 : -1;
          const source = atEnd ? b : a;
          const ring = atEnd ? index : before;
          const halfWidth = lineWidth * (0.4 + pressures[ring] * 0.6);
          sample.copy(source).addScaledVector(axis, halfWidth * edge).toArray(threadPosition, vertex * 3);
          threadBirth[vertex] = births[ring];
          threadEdge[vertex] = edge;
          vertex++;
        }
      }
      segments++;
    }
    threadGeometry.setDrawRange(0, vertex);
    sparkGeometry.setDrawRange(0, selectedQuality === 'low' ? 0 : count);
    for (const attribute of threadAttributes) attribute.needsUpdate = true;
    for (const attribute of sparkAttributes) attribute.needsUpdate = true;
    group.visible = count > 0 && uniforms.uOpacity.value > 0;
  }

  function update(dt, time, { gesture, reducedMotion = false, opacity = 1, color } = {}) {
    if (disposed) return;
    const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.1);
    clock += delta;
    uniforms.uClock.value = clock;
    uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
    uniforms.uOpacity.value = clamp(Number.isFinite(opacity) ? opacity : 0, 0, 1);
    if (color) uniforms.uColor.value.set(color);
    while (count && clock - births[first] >= duration) { first = (first + 1) % capacity; count--; }
    const active = !!(gesture?.active && finiteVector(gesture.position));
    if (active) {
      // Prevent overflowing typed buffers if an external raycast goes invalid.
      input.set(clamp(gesture.position.x, -100000, 100000), clamp(gesture.position.y, -100000, 100000), clamp(gesture.position.z, -100000, 100000));
      const pressure = clamp(Number.isFinite(gesture.strength) ? gesture.strength : 1, 0, 1);
      const distance = input.distanceTo(previous);
      if (!previousActive || distance > Math.max(lineWidth * 120, 2)) {
        stroke++;
        append(input, clock, pressure);
        previous.copy(input);
      } else if (distance > lineWidth * 0.4) {
        // A bounded number of spatial samples prevents fast hands from producing
        // disconnected dots, and avoids unbounded work on a low-frame-rate device.
        const steps = Math.min(8, Math.ceil(distance / Math.max(lineWidth * 0.8, 0.01)));
        for (let i = 1; i <= steps; i++) {
          sample.lerpVectors(previous, input, i / steps);
          append(sample, clock - delta * (1 - i / steps), pressure);
        }
        previous.copy(input);
      } else if (count) {
        // A stationary hand keeps just the last glint alive; very slow motion
        // still accumulates against the last emitted sample rather than vanishing.
        births[(first + count - 1) % capacity] = clock;
      }
    }
    previousActive = active;
    updateGeometry();
  }

  function clear() {
    if (disposed) return;
    first = 0; count = 0; segments = 0; previousActive = false;
    threadGeometry.setDrawRange(0, 0); sparkGeometry.setDrawRange(0, 0);
    group.visible = false;
  }

  return {
    group, update, clear, setQuality,
    getStats: () => ({
      sampleCount: count, segmentCount: segments, capacity: activeLimit, quality: selectedQuality,
      drawCalls: group.visible ? (segments ? 1 : 0) + (sparks.visible && count ? 1 : 0) : 0,
      lifetime: duration, disposed,
    }),
    dispose() {
      if (disposed) return;
      clear(); disposed = true;
      threadGeometry.dispose(); sparkGeometry.dispose(); threadMaterial.dispose(); sparkMaterial.dispose();
      group.clear();
    },
  };
}
