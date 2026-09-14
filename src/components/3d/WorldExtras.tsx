import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { WATER_PONDS, loopPoints, roadTangent, spurPoints } from '../../lib/road'
import { getUI } from '../../store/journey'

export function Traffic() {
  if (getUI().lowQuality) return null
  return (
    <group>
      <Shuttle points={loopPoints} offset={0.08} color="#f4f8fc" />
      <Shuttle points={loopPoints} offset={0.42} color="#e6dccb" />
      <Shuttle points={spurPoints} offset={0.22} color="#ffffff" reverse />
      <Bike points={loopPoints} offset={0.65} />
    </group>
  )
}

function Shuttle({
  points,
  offset,
  color,
  reverse = false,
}: {
  points: Array<{ x: number; z: number }>
  offset: number
  color: string
  reverse?: boolean
}) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current || points.length < 4) return
    const speed = getUI().reducedMotion ? 0.012 : 0.035
    const t = (offset + state.clock.elapsedTime * speed) % 1
    const u = reverse ? 1 - t : t
    const index = Math.floor(u * (points.length - 1))
    const point = points[index]
    const tangent = roadTangent(index, points)
    group.current.position.set(point.x, 0.28, point.z)
    group.current.rotation.y = Math.atan2(tangent.x, tangent.z)
  })

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[0.7, 0.28, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.18} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.16, 0.05]}>
        <boxGeometry args={[0.5, 0.16, 0.55]} />
        <meshStandardMaterial color="#7eb4cc" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function Bike({ points, offset }: { points: Array<{ x: number; z: number }>; offset: number }) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current || points.length < 4) return
    const t = (offset + state.clock.elapsedTime * 0.05) % 1
    const index = Math.floor(t * (points.length - 1))
    const point = points[index]
    const tangent = roadTangent(index, points)
    group.current.position.set(point.x - tangent.z * 3.1, 0.22, point.z + tangent.x * 3.1)
    group.current.rotation.y = Math.atan2(tangent.x, tangent.z)
  })
  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[0.2, 0.14, 0.5]} />
        <meshStandardMaterial color="#16324f" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 6]} />
        <meshStandardMaterial color="#d7dee8" />
      </mesh>
    </group>
  )
}

/** Short boardwalks over the two garden ponds — not lagoon bridges */
export function Bridges() {
  const decks = useMemo(
    () =>
      WATER_PONDS.map((pond, i) => ({
        x: pond.x,
        z: pond.z,
        rot: i === 0 ? 0.55 : -0.75,
        len: pond.r * 2.4,
      })),
    [],
  )

  return (
    <group>
      {decks.map((deck, i) => (
        <group key={i} position={[deck.x, 0.16, deck.z]} rotation={[0, deck.rot, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.12, deck.len]} />
            <meshStandardMaterial color="#cfd6df" roughness={0.55} />
          </mesh>
          <mesh position={[-0.72, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.28, deck.len]} />
            <meshStandardMaterial color="#f0f4f8" />
          </mesh>
          <mesh position={[0.72, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.28, deck.len]} />
            <meshStandardMaterial color="#f0f4f8" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
