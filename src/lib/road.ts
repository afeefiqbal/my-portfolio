import { DESTINATIONS, ISLANDS, ROAD_EDGES, type RoadNode } from '../data/map'
import type { DestinationId, Vec3 } from '../types'

export type Point2 = { x: number; z: number }

export const ROAD_WIDTH = 5.4
const ROAD_WALK = 6.2

export const CAMPUS_BOUNDS = {
  cx: 1,
  cz: -4,
  halfX: 38,
  halfZ: 43,
}

export const WATER_PONDS: Array<{ x: number; z: number; r: number }> = [
  { x: -7, z: -11, r: 2.4 },
  { x: 11, z: 5, r: 1.9 },
]

function catmull(p0: Point2, p1: Point2, p2: Point2, p3: Point2, t: number): Point2 {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    z:
      0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  }
}

function sampleEdge(controls: Vec3[], divisions = 56): Point2[] {
  const knots = controls.map((point) => ({ x: point[0], z: point[2] }))
  const dense: Point2[] = []
  for (let i = 0; i < knots.length - 1; i += 1) {
    const p0 = knots[i - 1] ?? knots[i]
    const p1 = knots[i]
    const p2 = knots[i + 1]
    const p3 = knots[i + 2] ?? p2
    for (let s = 0; s < 8; s += 1) dense.push(catmull(p0, p1, p2, p3, s / 8))
  }
  dense.push(knots[knots.length - 1])
  return resample(dense, divisions)
}

function resample(points: Point2[], count: number): Point2[] {
  if (points.length <= 1) return points
  const lengths = [0]
  for (let i = 1; i < points.length; i += 1) {
    lengths.push(
      lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z),
    )
  }
  const total = lengths[lengths.length - 1] || 1
  const result: Point2[] = []
  let j = 0
  for (let i = 0; i <= count; i += 1) {
    const target = (i / count) * total
    while (j < lengths.length - 2 && lengths[j + 1] < target) j += 1
    const span = lengths[j + 1] - lengths[j] || 1
    const t = (target - lengths[j]) / span
    result.push({
      x: points[j].x + (points[j + 1].x - points[j].x) * t,
      z: points[j].z + (points[j + 1].z - points[j].z) * t,
    })
  }
  return result
}

export const edgeSamples: Record<string, Point2[]> = {}
export const roadPoints: Point2[] = []
export const loopPoints: Point2[] = []
export const spurPoints: Point2[] = []
export const edgePolylines: Point2[][] = []

function edgeKey(from: RoadNode, to: RoadNode): string {
  return `${from}>${to}`
}

for (const edge of ROAD_EDGES) {
  const samples = sampleEdge(edge.controls, 56)
  edgePolylines.push(samples)
  edgeSamples[edgeKey(edge.from, edge.to)] = samples
  edgeSamples[edgeKey(edge.to, edge.from)] = [...samples].reverse()
  roadPoints.push(...samples)
}

for (const pair of [
  ['start', 'about'],
  ['about', 'education'],
  ['education', 'skills'],
  ['skills', 'experience'],
  ['experience', 'cv'],
  ['cv', 'contact'],
  ['contact', 'start'],
] as Array<[RoadNode, RoadNode]>) {
  const samples = edgeSamples[edgeKey(pair[0], pair[1])]
  if (samples) loopPoints.push(...samples)
}

spurPoints.push(
  ...(edgeSamples[edgeKey('skills', 'projects')] ?? []),
  ...(edgeSamples[edgeKey('projects', 'future')] ?? []),
)

const neighbors = new Map<RoadNode, RoadNode[]>()
function connect(a: RoadNode, b: RoadNode): void {
  const listA = neighbors.get(a) ?? []
  const listB = neighbors.get(b) ?? []
  if (!listA.includes(b)) listA.push(b)
  if (!listB.includes(a)) listB.push(a)
  neighbors.set(a, listA)
  neighbors.set(b, listB)
}
for (const edge of ROAD_EDGES) connect(edge.from, edge.to)

export function dedupePoints(points: Point2[]): Point2[] {
  const result: Point2[] = []
  for (const point of points) {
    const last = result[result.length - 1]
    if (!last || Math.hypot(last.x - point.x, last.z - point.z) > 0.12) {
      result.push(point)
    }
  }
  return result
}

export function isInsideIsland(x: number, z: number, padding = 0): boolean {
  for (const island of ISLANDS) {
    const dx = x - island.position[0]
    const dz = z - island.position[2]
    const cos = Math.cos(-island.rotation)
    const sin = Math.sin(-island.rotation)
    const lx = dx * cos - dz * sin
    const lz = dx * sin + dz * cos
    const nx = lx / (island.radiusX + padding)
    const nz = lz / (island.radiusZ + padding)
    if (nx * nx + nz * nz <= 1) return true
  }
  return false
}

export function isNearRoad(x: number, z: number, width = ROAD_WALK): boolean {
  const max = width * width
  for (let i = 0; i < roadPoints.length; i += 2) {
    const p = roadPoints[i]
    const dx = x - p.x
    const dz = z - p.z
    if (dx * dx + dz * dz <= max) return true
  }
  return false
}

export function isWalkable(x: number, z: number): boolean {
  for (const pond of WATER_PONDS) {
    const dx = x - pond.x
    const dz = z - pond.z
    if (dx * dx + dz * dz < pond.r * pond.r * 0.85) return false
  }
  if (isNearRoad(x, z, ROAD_WALK)) return true
  for (const dest of DESTINATIONS) {
    const dx = x - dest.position[0]
    const dz = z - dest.position[2]
    const radius = dest.plazaRadius + 2.5
    if (dx * dx + dz * dz <= radius * radius) return true
  }
  // Continuous rectangular campus walk surface.
  if (
    Math.abs(x - CAMPUS_BOUNDS.cx) <= CAMPUS_BOUNDS.halfX &&
    Math.abs(z - CAMPUS_BOUNDS.cz) <= CAMPUS_BOUNDS.halfZ
  ) {
    return true
  }
  return false
}

export function nearestWalkable(x: number, z: number): Point2 {
  if (isWalkable(x, z)) return { x, z }
  let best = roadPoints[0]
  let bestD = Infinity
  for (let i = 0; i < roadPoints.length; i += 2) {
    const p = roadPoints[i]
    const d = (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z)
    if (d < bestD) {
      bestD = d
      best = p
    }
  }
  for (const island of ISLANDS) {
    const d = Math.hypot(x - island.position[0], z - island.position[2])
    if (d < bestD) {
      bestD = d
      best = { x: island.position[0], z: island.position[2] }
    }
  }
  return { x: best.x, z: best.z }
}

export function constrainPosition(x: number, z: number): Point2 {
  if (isWalkable(x, z)) return { x, z }
  return nearestWalkable(x, z)
}

export function nearestNode(x: number, z: number): RoadNode {
  const nodes: RoadNode[] = ['start', ...DESTINATIONS.map((d) => d.id)]
  let best: RoadNode = 'start'
  let bestD = Infinity
  for (const node of nodes) {
    const dest =
      node === 'start'
        ? { x: 0, z: 26 }
        : {
            x: DESTINATIONS.find((d) => d.id === node)!.position[0],
            z: DESTINATIONS.find((d) => d.id === node)!.position[2],
          }
    const d = (dest.x - x) ** 2 + (dest.z - z) ** 2
    if (d < bestD) {
      bestD = d
      best = node
    }
  }
  return best
}

export function findNodePath(from: RoadNode, to: RoadNode): RoadNode[] {
  if (from === to) return [from]
  const queue: RoadNode[][] = [[from]]
  const seen = new Set<RoadNode>([from])
  while (queue.length) {
    const path = queue.shift()
    if (!path) break
    const current = path[path.length - 1]
    const nextNodes = neighbors.get(current) ?? []
    for (const next of nextNodes) {
      if (seen.has(next)) continue
      const nextPath = [...path, next]
      if (next === to) return nextPath
      seen.add(next)
      queue.push(nextPath)
    }
  }
  return [from, to]
}

export function buildNavigationPath(fromX: number, fromZ: number, to: DestinationId): Point2[] {
  const startNode = nearestNode(fromX, fromZ)
  const nodePath = findNodePath(startNode, to)
  const points: Point2[] = [{ x: fromX, z: fromZ }]
  for (let i = 0; i < nodePath.length - 1; i += 1) {
    const samples = edgeSamples[edgeKey(nodePath[i], nodePath[i + 1])]
    if (samples) points.push(...samples)
  }
  const dest = DESTINATIONS.find((d) => d.id === to)
  if (dest) points.push({ x: dest.position[0], z: dest.position[2] })
  return dedupePoints(points)
}

export function closestDestination(x: number, z: number, radius = 7.2): DestinationId | null {
  let best: DestinationId | null = null
  let bestD = radius * radius
  for (const dest of DESTINATIONS) {
    const dx = x - dest.position[0]
    const dz = z - dest.position[2]
    const d = dx * dx + dz * dz
    if (d <= bestD) {
      bestD = d
      best = dest.id
    }
  }
  return best
}

export function roadTangent(index: number, points: Point2[]): Point2 {
  const prev = points[Math.max(0, index - 1)]
  const next = points[Math.min(points.length - 1, index + 1)]
  const x = next.x - prev.x
  const z = next.z - prev.z
  const len = Math.hypot(x, z) || 1
  return { x: x / len, z: z / len }
}
