import { BufferAttribute, BufferGeometry } from 'three'
import type { Point2 } from './road'

export function buildRibbonGeometry(points: Point2[], width: number, y: number): BufferGeometry {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  let dist = 0

  for (let i = 0; i < points.length; i += 1) {
    const point = points[i]
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(points.length - 1, i + 1)]
    let dx = next.x - prev.x
    let dz = next.z - prev.z
    const len = Math.hypot(dx, dz) || 1
    dx /= len
    dz /= len
    const px = -dz
    const pz = dx
    const lx = point.x - px * (width / 2)
    const lz = point.z - pz * (width / 2)
    const rx = point.x + px * (width / 2)
    const rz = point.z + pz * (width / 2)
    positions.push(lx, y, lz, rx, y, rz)
    normals.push(0, 1, 0, 0, 1, 0)
    if (i > 0) dist += Math.hypot(point.x - points[i - 1].x, point.z - points[i - 1].z)
    uvs.push(0, dist * 0.22, 1, dist * 0.22)
    if (i < points.length - 1) {
      const a = i * 2
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()
  return geometry
}
