import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedMesh, Object3D } from 'three'
import { ROAD_EDGES } from '../../data/map'
import { ROAD_WIDTH, edgePolylines, loopPoints, roadPoints, roadTangent, spurPoints } from '../../lib/road'
import { buildRibbonGeometry } from '../../lib/ribbon'
import { getUI } from '../../store/journey'

export function RoadNetwork() {
  const geos = useMemo(
    () =>
      edgePolylines.map((points) => ({
        sidewalk: buildRibbonGeometry(points, ROAD_WIDTH + 2.4, 0.08),
        curb: buildRibbonGeometry(points, ROAD_WIDTH + 0.35, 0.125),
        road: buildRibbonGeometry(points, ROAD_WIDTH, 0.14),
        guide: buildRibbonGeometry(points, 0.28, 0.155),
      })),
    [],
  )

  useEffect(() => {
    return () => {
      geos.forEach((geo) => {
        geo.sidewalk.dispose()
        geo.curb.dispose()
        geo.road.dispose()
        geo.guide.dispose()
      })
    }
  }, [geos])

  return (
    <group>
      {geos.map((geo, i) => (
        <group key={`${ROAD_EDGES[i].from}-${ROAD_EDGES[i].to}`}>
          <mesh geometry={geo.sidewalk} receiveShadow>
            <meshStandardMaterial color="#d6dce4" roughness={0.88} />
          </mesh>
          <mesh geometry={geo.curb}>
            <meshStandardMaterial color="#9aa7b5" roughness={0.55} metalness={0.05} />
          </mesh>
          <mesh geometry={geo.road} receiveShadow>
            <meshStandardMaterial color="#3f4a58" roughness={0.7} metalness={0.06} />
          </mesh>
          {/* Subtle blue center guide — accents the journey without flooding cyan */}
          <mesh geometry={geo.guide}>
            <meshStandardMaterial
              color="#cfe4f8"
              emissive="#5b8fd4"
              emissiveIntensity={0.28}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      <Dashes points={[...loopPoints, ...spurPoints]} />
      <EdgeAccents />
      <StreetLamps />
      <RoadSigns />
    </group>
  )
}

function EdgeAccents() {
  const accents = useMemo(() => {
    const list: Array<{ x: number; z: number; rot: number }> = []
    const source = loopPoints.length > 4 ? loopPoints : roadPoints
    for (let i = 3; i < source.length; i += 3) {
      const tangent = roadTangent(i, source)
      const rot = Math.atan2(tangent.x, tangent.z)
      const half = ROAD_WIDTH * 0.48
      list.push({
        x: source[i].x + -tangent.z * half,
        z: source[i].z + tangent.x * half,
        rot,
      })
      list.push({
        x: source[i].x - -tangent.z * half,
        z: source[i].z - tangent.x * half,
        rot,
      })
    }
    return list
  }, [])

  const meshRef = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new Object3D()
    accents.forEach((mark, i) => {
      dummy.position.set(mark.x, 0.148, mark.z)
      dummy.rotation.set(0, mark.rot, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [accents])

  if (!accents.length) return null
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, accents.length]}>
      <boxGeometry args={[0.08, 0.02, 0.85]} />
      <meshStandardMaterial color="#e8f3fc" emissive="#6aa3d8" emissiveIntensity={0.2} />
    </instancedMesh>
  )
}

function Dashes({ points }: { points: Array<{ x: number; z: number }> }) {
  const marks = useMemo(() => {
    const list: Array<{ x: number; z: number; rot: number }> = []
    for (let i = 2; i < points.length; i += 2) {
      const tangent = roadTangent(i, points)
      list.push({
        x: points[i].x,
        z: points[i].z,
        rot: Math.atan2(tangent.x, tangent.z),
      })
    }
    return list
  }, [points])

  const meshRef = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const dummy = new Object3D()
    marks.forEach((mark, i) => {
      dummy.position.set(mark.x, 0.152, mark.z)
      dummy.rotation.set(0, mark.rot, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [marks])

  if (marks.length === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, marks.length]}>
      <boxGeometry args={[0.18, 0.025, 1.05]} />
      <meshStandardMaterial color="#f7fafc" roughness={0.4} />
    </instancedMesh>
  )
}

function StreetLamps() {
  const lamps = useMemo(() => {
    const list: Array<{ x: number; z: number }> = []
    const source = loopPoints.length > 4 ? loopPoints : roadPoints
    for (let i = 5; i < source.length; i += 7) {
      const tangent = roadTangent(i, source)
      const side = i % 2 === 0 ? 1 : -1
      list.push({
        x: source[i].x + -tangent.z * 3.35 * side,
        z: source[i].z + tangent.x * 3.35 * side,
      })
    }
    return list
  }, [])

  const shown = getUI().lowQuality ? lamps.filter((_, i) => i % 2 === 0) : lamps
  const poleRef = useRef<InstancedMesh>(null)
  const bulbRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    shown.forEach((lamp, i) => {
      dummy.position.set(lamp.x, 1.35, lamp.z)
      dummy.scale.set(1, 1, 1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      poleRef.current?.setMatrixAt(i, dummy.matrix)
      dummy.position.set(lamp.x, 2.65, lamp.z)
      dummy.updateMatrix()
      bulbRef.current?.setMatrixAt(i, dummy.matrix)
    })
    if (poleRef.current) poleRef.current.instanceMatrix.needsUpdate = true
    if (bulbRef.current) bulbRef.current.instanceMatrix.needsUpdate = true
  }, [shown, dummy])

  if (!shown.length) return null

  return (
    <group>
      <instancedMesh ref={poleRef} args={[undefined, undefined, shown.length]}>
        <cylinderGeometry args={[0.055, 0.075, 2.6, 6]} />
        <meshStandardMaterial color="#e8eef5" roughness={0.35} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={bulbRef} args={[undefined, undefined, shown.length]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffe08a" emissiveIntensity={0.85} />
      </instancedMesh>
    </group>
  )
}

function RoadSigns() {
  const signs = useMemo(
    () => [
      { x: -4, z: 20, rot: 0.4 },
      { x: -18, z: 6, rot: -0.2 },
      { x: 4, z: -8, rot: 0.1 },
      { x: -12, z: -18, rot: 0.5 },
    ],
    [],
  )
  return (
    <group>
      {signs.map((sign, i) => (
        <group key={i} position={[sign.x, 0.12, sign.z]} rotation={[0, sign.rot, 0]}>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 1.7, 6]} />
            <meshStandardMaterial color="#d7dee8" metalness={0.15} />
          </mesh>
          <mesh position={[0, 1.75, 0.02]}>
            <boxGeometry args={[1.15, 0.42, 0.07]} />
            <meshStandardMaterial color="#16324f" />
          </mesh>
          <mesh position={[0, 1.75, 0.06]}>
            <boxGeometry args={[0.95, 0.08, 0.02]} />
            <meshStandardMaterial color="#cfe4f8" emissive="#5b8fd4" emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
