import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh } from 'three'
import { START_POSITION } from '../../data/map'
import { getUI, sim, useJourney } from '../../store/journey'

export function Player() {
  const group = useRef<Group>(null)
  const glow = useRef<Mesh>(null)
  const started = useJourney().started

  useFrame((state) => {
    const node = group.current
    if (!node) return
    const motion = getUI().reducedMotion ? 0 : 1
    const bob = Math.sin(state.clock.elapsedTime * 2.6) * 0.05 * motion
    node.position.set(sim.position.x, 0.42 + bob, sim.position.z)
    node.rotation.y = sim.heading
    if (glow.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.07 * motion
      glow.current.scale.set(pulse, 1, pulse)
    }
  })

  return (
    <group ref={group} position={[START_POSITION[0], 0.42, START_POSITION[2]]} scale={started ? 1 : 1.18}>
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.75, 1.05, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#5b8fd4" emissiveIntensity={started ? 0.55 : 0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.62, 24]} />
        <meshStandardMaterial color="#e8f1fa" emissive="#9ec8ff" emissiveIntensity={0.22} />
      </mesh>

      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.2, 0.36, 1.7]} />
        <meshStandardMaterial color="#f4f8fc" metalness={0.22} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.55, 0.1]} rotation={[0.16, 0, 0]} castShadow>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color="#6eb0d4" transparent opacity={0.52} roughness={0.1} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.22, -0.7]}>
        <boxGeometry args={[0.7, 0.14, 0.24]} />
        <meshStandardMaterial color="#16324f" />
      </mesh>
      <mesh position={[0, 0.22, 0.78]}>
        <boxGeometry args={[0.85, 0.12, 0.14]} />
        <meshStandardMaterial color="#5b8fd4" emissive="#5b8fd4" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.48, 0.14, -0.25]}>
        <boxGeometry args={[0.12, 0.12, 0.35]} />
        <meshStandardMaterial color="#24384d" />
      </mesh>
      <mesh position={[-0.48, 0.14, -0.25]}>
        <boxGeometry args={[0.12, 0.12, 0.35]} />
        <meshStandardMaterial color="#24384d" />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.1, 16]} />
        <meshStandardMaterial color="#cfe4f8" emissive="#5b8fd4" emissiveIntensity={0.28} />
      </mesh>

      {!started && (
        <mesh position={[0, 1.55, 0]}>
          <coneGeometry args={[0.18, 0.35, 4]} />
          <meshStandardMaterial color="#f7fbff" emissive="#d7b56a" emissiveIntensity={0.45} />
        </mesh>
      )}
    </group>
  )
}
