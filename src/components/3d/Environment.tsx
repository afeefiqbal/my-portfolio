import { useLayoutEffect, useMemo, useRef } from 'react'
import { DoubleSide, InstancedMesh, Object3D } from 'three'
import { DESTINATIONS, ISLANDS, START_POSITION } from '../../data/map'
import { WATER_PONDS, isNearRoad } from '../../lib/road'
import { seeded } from '../../lib/math'
import { getUI } from '../../store/journey'

const dummy = new Object3D()

export function Environment() {
  const low = getUI().lowQuality

  return (
    <group>
      <hemisphereLight args={['#e8f4ff', '#c5d4a8', 0.85]} />
      <directionalLight
        position={[32, 40, 18]}
        intensity={1.65}
        color="#fff4e0"
        castShadow={!low}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={110}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0007}
      />
      <directionalLight position={[-22, 14, -16]} intensity={0.35} color="#8eb8e0" />
      <ambientLight intensity={0.28} />

      <CampusGround />
      <Plazas />
      <Parks />
      <Ponds />
      <Trees />
      <Bushes />
      <CampusFurniture />
      <StartPad />
    </group>
  )
}

function CampusGround() {
  return (
    <group>
      {/* One continuous rectangular campus — not a floating disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, -4]} receiveShadow>
        <planeGeometry args={[78, 88]} />
        <meshStandardMaterial color="#6d965c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.015, -4]} receiveShadow>
        <planeGeometry args={[70, 80]} />
        <meshStandardMaterial color="#7aa766" roughness={0.92} />
      </mesh>
      {/* Soft soil edge band so the map feels grounded, not floating */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -0.04, -4]}>
        <planeGeometry args={[86, 96]} />
        <meshStandardMaterial color="#cbbfa8" roughness={1} />
      </mesh>
    </group>
  )
}

function Plazas() {
  return (
    <group>
      {ISLANDS.map((island) => {
        const r = Math.min(island.radiusX, island.radiusZ) * 0.85
        return (
          <group key={island.id} position={island.position} rotation={[0, island.rotation, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
              <circleGeometry args={[r, 32]} />
              <meshStandardMaterial color="#e4ddd0" roughness={0.8} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
              <ringGeometry args={[r * 0.72, r, 32]} />
              <meshStandardMaterial color="#d2cbbd" roughness={0.84} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Parks() {
  const beds = useMemo(
    () => [
      { x: -6, z: 8, sx: 3.2, sz: 1.6, rot: 0.4 },
      { x: 8, z: -2, sx: 2.8, sz: 1.4, rot: -0.3 },
      { x: -4, z: -18, sx: 3.5, sz: 1.8, rot: 0.2 },
      { x: 12, z: -10, sx: 2.4, sz: 2.0, rot: 0.6 },
      { x: -14, z: -8, sx: 2.6, sz: 1.5, rot: -0.5 },
    ],
    [],
  )
  return (
    <group>
      {beds.map((bed, i) => (
        <group key={i} position={[bed.x, 0.12, bed.z]} rotation={[0, bed.rot, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[bed.sx, 0.12, bed.sz]} />
            <meshStandardMaterial color="#5d8f52" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[bed.sx * 0.85, 0.08, bed.sz * 0.7]} />
            <meshStandardMaterial color="#8bc478" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Ponds() {
  return (
    <group>
      {WATER_PONDS.map((pond, i) => (
        <group key={i} position={[pond.x, 0.06, pond.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[pond.r + 0.45, 28]} />
            <meshStandardMaterial color="#d7e4c8" roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[pond.r, 28]} />
            <meshStandardMaterial
              color="#5fa8bc"
              roughness={0.22}
              metalness={0.12}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.5, 8]} />
            <meshStandardMaterial color="#f0f4f8" />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial color="#d7e8f0" emissive="#5b8fd4" emissiveIntensity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

type TreeItem = { x: number; y: number; z: number; s: number; r: number; kind: number }

function Trees() {
  const low = getUI().lowQuality
  const items = useMemo(() => {
    const list: TreeItem[] = []
    let n = 2
    for (const island of ISLANDS) {
      const count = low ? 3 : 5
      for (let i = 0; i < count; i += 1) {
        n += 1
        const angle = seeded(n * 3.1) * Math.PI * 2
        const radius = 0.7 + seeded(n * 5.7) * 0.22
        const x = island.position[0] + Math.cos(angle) * island.radiusX * radius
        const z = island.position[2] + Math.sin(angle) * island.radiusZ * radius
        if (isNearRoad(x, z, 3.4)) continue
        if (tooCloseToPlace(x, z, 4.2)) continue
        list.push({
          x,
          y: 0.12,
          z,
          s: 0.85 + seeded(n * 8.2) * 0.55,
          r: angle,
          kind: Math.floor(seeded(n * 11.3) * 3),
        })
      }
    }
    for (let i = 0; i < (low ? 6 : 12); i += 1) {
      n += 1
      const x = (seeded(n * 2.2) - 0.5) * 48
      const z = (seeded(n * 4.4) - 0.5) * 56 - 4
      if (isNearRoad(x, z, 4)) continue
      if (tooCloseToPlace(x, z, 6)) continue
      if (Math.hypot(x, z + 4) > 32) continue
      list.push({
        x,
        y: 0.12,
        z,
        s: 0.8 + seeded(n * 7.1) * 0.6,
        r: seeded(n) * Math.PI * 2,
        kind: Math.floor(seeded(n * 9.1) * 3),
      })
    }
    return list
  }, [low])

  const pines = items.filter((t) => t.kind === 0)
  const rounds = items.filter((t) => t.kind === 1)
  const talls = items.filter((t) => t.kind === 2)

  return (
    <group>
      <TreeSet items={pines} shape="pine" cast={!low} />
      <TreeSet items={rounds} shape="round" cast={!low} />
      <TreeSet items={talls} shape="tall" cast={!low} />
    </group>
  )
}

function TreeSet({
  items,
  shape,
  cast,
}: {
  items: TreeItem[]
  shape: 'pine' | 'round' | 'tall'
  cast: boolean
}) {
  const trunkRef = useRef<InstancedMesh>(null)
  const crownRef = useRef<InstancedMesh>(null)
  const crown2Ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    items.forEach((item, i) => {
      dummy.position.set(item.x, item.y + 0.38 * item.s, item.z)
      dummy.scale.set(item.s, item.s, item.s)
      dummy.rotation.set(0, item.r, 0)
      dummy.updateMatrix()
      trunkRef.current?.setMatrixAt(i, dummy.matrix)

      const crownY =
        shape === 'pine' ? item.y + 1.2 * item.s : shape === 'round' ? item.y + 1.05 * item.s : item.y + 1.35 * item.s
      dummy.position.set(item.x, crownY, item.z)
      dummy.updateMatrix()
      crownRef.current?.setMatrixAt(i, dummy.matrix)

      if (shape === 'pine') {
        dummy.position.set(item.x, item.y + 1.7 * item.s, item.z)
        dummy.scale.set(item.s * 0.75, item.s * 0.75, item.s * 0.75)
        dummy.updateMatrix()
        crown2Ref.current?.setMatrixAt(i, dummy.matrix)
      }
    })
    if (trunkRef.current) trunkRef.current.instanceMatrix.needsUpdate = true
    if (crownRef.current) crownRef.current.instanceMatrix.needsUpdate = true
    if (crown2Ref.current) crown2Ref.current.instanceMatrix.needsUpdate = true
  }, [items, shape])

  if (items.length === 0) return null

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, items.length]} castShadow={cast}>
        <cylinderGeometry args={[0.08, 0.12, 0.75, 6]} />
        <meshStandardMaterial color="#8b6a4a" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, items.length]} castShadow={cast}>
        {shape === 'round' ? (
          <sphereGeometry args={[0.55, 8, 8]} />
        ) : shape === 'tall' ? (
          <coneGeometry args={[0.42, 1.5, 7]} />
        ) : (
          <coneGeometry args={[0.55, 1.1, 7]} />
        )}
        <meshStandardMaterial
          color={shape === 'round' ? '#4f8f4a' : shape === 'tall' ? '#3f7a48' : '#457d4d'}
          roughness={0.75}
        />
      </instancedMesh>
      {shape === 'pine' && (
        <instancedMesh ref={crown2Ref} args={[undefined, undefined, items.length]} castShadow={cast}>
          <coneGeometry args={[0.4, 0.9, 7]} />
          <meshStandardMaterial color="#3d7345" roughness={0.75} />
        </instancedMesh>
      )}
    </group>
  )
}

function Bushes() {
  const low = getUI().lowQuality
  const items = useMemo(() => {
    const list: Array<{ x: number; z: number; s: number }> = []
    let n = 50
    for (let i = 0; i < (low ? 8 : 16); i += 1) {
      n += 1
      const x = (seeded(n * 1.7) - 0.5) * 50
      const z = (seeded(n * 3.3) - 0.5) * 58 - 4
      if (isNearRoad(x, z, 2.5)) continue
      if (tooCloseToPlace(x, z, 4)) continue
      list.push({ x, z, s: 0.4 + seeded(n) * 0.5 })
    }
    return list
  }, [low])

  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    items.forEach((item, i) => {
      dummy.position.set(item.x, 0.25 * item.s, item.z)
      dummy.scale.set(item.s, item.s * 0.7, item.s)
      dummy.rotation.set(0, i, 0)
      dummy.updateMatrix()
      ref.current?.setMatrixAt(i, dummy.matrix)
    })
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
  }, [items])

  if (!items.length) return null
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]}>
      <sphereGeometry args={[0.45, 7, 7]} />
      <meshStandardMaterial color="#5a9a55" roughness={0.85} />
    </instancedMesh>
  )
}

function CampusFurniture() {
  const benches = useMemo(
    () =>
      DESTINATIONS.map((d, i) => ({
        x: d.position[0] + (i % 2 === 0 ? 3.1 : -3.0),
        z: d.position[2] + 2.4,
        r: i * 0.35,
      })),
    [],
  )

  return (
    <group>
      {benches.map((spot, i) => (
        <group key={i} position={[spot.x, 0.12, spot.z]} rotation={[0, spot.r, 0]}>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[1.05, 0.08, 0.34]} />
            <meshStandardMaterial color="#f4f7fa" roughness={0.4} />
          </mesh>
          <mesh position={[-0.42, 0.14, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.34]} />
            <meshStandardMaterial color="#c5ced8" />
          </mesh>
          <mesh position={[0.42, 0.14, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.34]} />
            <meshStandardMaterial color="#c5ced8" />
          </mesh>
          <mesh position={[0, 0.42, -0.12]}>
            <boxGeometry args={[1.05, 0.28, 0.06]} />
            <meshStandardMaterial color="#eef2f6" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function StartPad() {
  return (
    <group position={[START_POSITION[0], 0.12, START_POSITION[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.0, 36]} />
        <meshStandardMaterial color="#dfe8ef" roughness={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.2, 3.45, 36]} />
        <meshStandardMaterial color="#f7fbff" emissive="#5b8fd4" emissiveIntensity={0.2} side={DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.55, 1.75, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#d7b56a" emissiveIntensity={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.25, 28]} />
        <meshStandardMaterial color="#eef6ea" roughness={0.5} />
      </mesh>
    </group>
  )
}

function tooCloseToPlace(x: number, z: number, radius: number): boolean {
  if (Math.hypot(x - START_POSITION[0], z - START_POSITION[2]) < 3.4) return true
  return DESTINATIONS.some((dest) => {
    const dx = x - dest.position[0]
    const dz = z - dest.position[2]
    return dx * dx + dz * dz < radius * radius
  })
}
