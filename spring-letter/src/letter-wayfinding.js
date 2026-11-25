import { letterById, letterUnlocked } from './letter-model.js';
import { LANDSCAPE_ROUTES, LANDSCAPE_TARGETS } from './landscape.js';
import { distanceToSegment, PLATFORMS } from './layout.js';

const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const position = ({ x, z }) => ({ x, z });
const graphs = new Map();
const structures = new Set(['bridge_am', 'bridge_mf', 'shield_rm']);

// A conservative navigation footprint inside the real terrain, with a margin
// at shorelines. No render meshes, player movement, or persistent route cursor
// are needed. The terrain integration tests check every recommended segment.
function navigationGraph(progress) {
  const p1 = progress.p1?.solved === true, wind = progress.wind?.solved === true;
  const finale = progress.bridge?.solved === true;
  const structure = structures.has(progress.bridge?.structure) ? progress.bridge.structure : 'none';
  const key = `${p1}:${wind}:${finale}:${structure}`;
  if (graphs.has(key)) return graphs.get(key);
  const state = { p1: { solved: p1 }, wind: { solved: wind } };
  const discs = [{ x: 0, z: 0, radius: 6.8 }], paths = [], nodes = [];
  const addNode = (point, label) => {
    let index = nodes.findIndex(node => distance(node, point) < .001);
    if (index < 0) { index = nodes.length; nodes.push({ ...position(point), label }); }
    return index;
  };
  const path = (a, b, width) => paths.push({ a, b, width });
  addNode({ x: 0, z: -6 }, '沿主庭北侧小径');
  if (p1) {
    discs.push({ x: 0, z: -16, radius: 6 });
    path({ x: 0, z: -6 }, { x: 0, z: -11 }, 1.17);
    addNode({ x: 0, z: -11 }, '沿风廊南侧小径');
    addNode({ x: 0, z: -16 }, '穿过风廊');
  }
  if (wind) {
    for (const point of Object.values(PLATFORMS)) discs.push({ ...point, radius: 1.25 });
    path({ x: 0, z: -21 }, PLATFORMS.A, 1.07);
    path(PLATFORMS.A, PLATFORMS.R, .77);
    addNode({ x: 0, z: -21 }, '沿风廊北侧小径');
    for (const [id, point] of Object.entries(PLATFORMS)) addNode(point, id === 'R' ? '走向西侧石台' : '沿水庭石台前行');
    if (structure === 'bridge_am') path(PLATFORMS.A, PLATFORMS.M, .70);
    if (structure === 'bridge_mf') path(PLATFORMS.M, PLATFORMS.F, .70);
    if (structure === 'shield_rm') path(PLATFORMS.R, PLATFORMS.M, .70);
  }
  if (finale) {
    discs.push({ x: 0, z: -46, radius: 6 });
    path(PLATFORMS.F, { x: 0, z: -42 }, 1.07);
    addNode({ x: 0, z: -42 }, '回到水庭石台');
  }
  const destinations = {};
  if(wind)destinations.bridge=addNode(PLATFORMS.A,'回到借桥的旧石台');
  for (const target of LANDSCAPE_TARGETS) {
    if (!letterUnlocked(letterById(target.key), state)) continue;
    discs.push({ ...position(target), radius: 3 });
    for (const route of LANDSCAPE_ROUTES.filter(route => route.target === target.id)) {
      for (const point of route.points) addNode(point, `沿${target.title}小径`);
      for (let i = 1; i < route.points.length; i++) path(route.points[i - 1], route.points[i], .88);
    }
    destinations[target.key] = addNode(target, target.title);
  }
  const walkable = point => discs.some(disc => distance(point, disc) <= disc.radius)
    || paths.some(route => distanceToSegment(point.x, point.z, route.a, route.b) <= route.width);
  // Intersect the entire segment with discs/capsules and merge the covered
  // intervals. Sampling alone can miss a small gap at two touching shorelines
  // and leave the next frame stranded between navigation regions.
  const circles = [...discs], strips = [];
  for (const route of paths) {
    circles.push({ ...route.a, radius: route.width }, { ...route.b, radius: route.width });
    const length = distance(route.a, route.b);
    strips.push({ ...route, length, ux: (route.b.x - route.a.x) / length, uz: (route.b.z - route.a.z) / length });
  }
  const visible = (a, b) => {
    const dx = b.x - a.x, dz = b.z - a.z, lengthSquared = dx * dx + dz * dz;
    if (lengthSquared < 1e-12) return walkable(a);
    const intervals = [];
    const interval = (lo, hi) => {
      lo = Math.max(0, lo); hi = Math.min(1, hi);
      if (lo <= hi) intervals.push([lo, hi]);
    };
    for (const circle of circles) {
      const x = a.x - circle.x, z = a.z - circle.z, dot = x * dx + z * dz;
      const discriminant = dot * dot - lengthSquared * (x * x + z * z - circle.radius * circle.radius);
      if (discriminant < 0) continue;
      const root = Math.sqrt(discriminant);
      interval((-dot - root) / lengthSquared, (-dot + root) / lengthSquared);
    }
    for (const strip of strips) {
      const x = a.x - strip.a.x, z = a.z - strip.a.z;
      let lo = 0, hi = 1;
      for (const [start, change, min, max] of [
        [x * strip.ux + z * strip.uz, dx * strip.ux + dz * strip.uz, 0, strip.length],
        [-x * strip.uz + z * strip.ux, -dx * strip.uz + dz * strip.ux, -strip.width, strip.width],
      ]) {
        if (Math.abs(change) < 1e-12) { if (start < min || start > max) hi = -1; }
        else {
          const first = (min - start) / change, last = (max - start) / change;
          lo = Math.max(lo, Math.min(first, last)); hi = Math.min(hi, Math.max(first, last));
        }
      }
      interval(lo, hi);
    }
    intervals.sort((a, b) => a[0] - b[0]);
    let covered = 0;
    for (const [lo, hi] of intervals) {
      if (lo > covered + 1e-9) return false;
      covered = Math.max(covered, hi);
      if (covered >= 1 - 1e-9) return true;
    }
    return false;
  };
  const edges = nodes.map(() => []);
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
    if (!visible(nodes[a], nodes[b])) continue;
    const length = distance(nodes[a], nodes[b]);
    edges[a].push({ index: b, length }); edges[b].push({ index: a, length });
  }
  // Reverse Dijkstra tables make each frame a few visibility checks, rather
  // than a new graph search. Equal costs prefer the node nearer the destination
  // so reaching a bend cannot repeatedly select the node under the player's feet.
  const remaining = {};
  for (const [id, end] of Object.entries(destinations)) {
    const costs = nodes.map(() => Infinity), visited = new Set(); costs[end] = 0;
    while (visited.size < nodes.length) {
      let current = -1;
      for (let i = 0; i < nodes.length; i++) {
        if (!visited.has(i) && Number.isFinite(costs[i]) && (current < 0 || costs[i] < costs[current])) current = i;
      }
      if (current < 0) break;
      visited.add(current);
      for (const edge of edges[current]) costs[edge.index] = Math.min(costs[edge.index], costs[current] + edge.length);
    }
    remaining[id] = costs;
  }
  const graph = { nodes, walkable, visible, destinations, remaining };
  graphs.set(key, graph);
  return graph;
}

/**
 * Return the next reachable walking landmark for a letter, or null when its
 * gate is closed / no continuous walking route exists. distance is the remaining
 * walking distance; arrived means inside the court's 2.1 m interaction disc.
 * Re-evaluate with the current player each frame. Neither argument is mutated.
 */
export function letterWaypoint(id, player, progress) {
  const bridge=id==='bridge',letter = bridge?{...PLATFORMS.A}:letterById(id);
  if (!letter || !player || !Number.isFinite(player.x) || !Number.isFinite(player.z)
    || !progress || typeof progress !== 'object' || Array.isArray(progress)
    || (bridge?!progress.wind?.solved||progress.bridge?.solved:!letterUnlocked(letter, progress))) return null;
  const graph = navigationGraph(progress);
  if (!graph.walkable(player)) return null;
  const destination = position(letter), arrived = distance(player, destination) <= (bridge?.8:2.1);
  const end = graph.destinations[id];
  if (arrived || graph.visible(player, destination)) {
    return { target: position(destination), destination, distance: distance(player, destination), label: graph.nodes[end].label, arrived };
  }
  let best = -1, bestCost = Infinity;
  const costs = graph.remaining[id];
  for (let i = 0; i < graph.nodes.length; i++) {
    const length = distance(player, graph.nodes[i]), total = length + costs[i];
    if (length < .05 || !Number.isFinite(total)) continue;
    if (total > bestCost + 1e-6 || (Math.abs(total - bestCost) <= 1e-6 && costs[i] >= costs[best])) continue;
    if (!graph.visible(player, graph.nodes[i])) continue;
    best = i; bestCost = total;
  }
  if (best < 0) return null;
  return { target: position(graph.nodes[best]), destination, distance: bestCost, label: graph.nodes[best].label, arrived: false };
}
