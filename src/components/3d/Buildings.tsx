import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { DESTINATIONS } from '../../data/map'
import { projects } from '../../data/projects'
import { skillBadges } from '../../data/skills'
import { makeLabelTexture } from '../../lib/canvasTexture'
import { getUI } from '../../store/journey'

const white = '#f5f7fa'
const warm = '#e8dcc8'
const glass = '#8bb8c8'
const ink = '#1f3348'
const accent = '#5b8fd4'
const stone = '#d8d2c6'
const roof = '#c4b8a4'

export function Buildings() {
  return (
    <group>
      <PersonalStudio position={pos('about')} />
      <University position={pos('education')} />
      <TechPlaza position={pos('skills')} />
      <DevCampus position={pos('projects')} />
      <OfficeTower position={pos('experience')} />
      <ArchiveHall position={pos('cv')} />
      <CommsCenter position={pos('contact')} />
      <LaunchTower position={pos('future')} />
    </group>
  )
}

function pos(id: (typeof DESTINATIONS)[number]['id']): [number, number, number] {
  const dest = DESTINATIONS.find((item) => item.id === id)!
  return [dest.position[0], 0.14, dest.position[2]]
}

function PersonalStudio({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box p={[0, 1.55, -0.2]} s={[5.2, 3.1, 3.6]} c={white} />
      <Box p={[2.6, 1.1, 0.6]} s={[2.8, 2.2, 2.6]} c={warm} />
      <Box p={[-1.8, 1.7, 1.82]} s={[3.4, 1.9, 0.1]} c={glass} o={0.48} />
      <Box p={[0, 3.2, -0.2]} s={[5.5, 0.18, 3.9]} c={roof} />
      <Box p={[-1.6, 3.45, 0.4]} s={[2.0, 0.22, 1.4]} c="#5f9a58" />
      <Box p={[2.4, 0.08, 2.2]} s={[2.2, 0.08, 1.6]} c="#b7d0c0" />
      <Box p={[-0.2, 0.08, 2.4]} s={[2.4, 0.06, 1.1]} c="#e4ebf2" />
      <WindowRow x={-1.2} y={1.2} z={1.85} count={4} />
      <WindowRow x={-1.2} y={2.2} z={1.85} count={4} />
      <Box p={[0.2, 0.55, 1.95]} s={[0.9, 1.1, 0.08]} c={ink} />
      <mesh position={[3.4, 0.55, 1.4]}>
        <cylinderGeometry args={[0.18, 0.22, 1.1, 8]} />
        <meshStandardMaterial color="#8f9aa8" />
      </mesh>
      <mesh position={[3.4, 1.25, 1.4]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#f0f4f8" emissive={accent} emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

function University({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box p={[-3.2, 2.0, 0]} s={[1.8, 4.0, 6.2]} c={white} />
      <Box p={[3.2, 1.7, 0.2]} s={[1.8, 3.4, 5.6]} c={white} />
      <Box p={[0, 1.4, -2.8]} s={[7.6, 2.8, 1.6]} c={warm} />
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[1.15, 1.3, 4.8, 12]} />
        <meshStandardMaterial color={glass} transparent opacity={0.4} roughness={0.14} metalness={0.22} />
      </mesh>
      <mesh position={[0, 5.0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.18, 12]} />
        <meshStandardMaterial color={white} />
      </mesh>
      <Box p={[0, 0.25, 1.8]} s={[3.6, 0.25, 2.0]} c="#e7eef5" />
      {[-2.2, -0.7, 0.8, 2.3].map((x, i) => (
        <mesh key={i} position={[x, 1.4, 1.95]}>
          <boxGeometry args={[0.22, 2.6, 0.22]} />
          <meshStandardMaterial color={stone} />
        </mesh>
      ))}
      <mesh position={[0, 5.45, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#fff6d8" emissive={accent} emissiveIntensity={0.28} />
      </mesh>
    </group>
  )
}

function TechPlaza({ position }: { position: [number, number, number] }) {
  const low = getUI().lowQuality
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.2, 4.7, 10]} />
        <meshStandardMaterial color="#e4ebe0" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.1, 2.4, 0.28, 10]} />
        <meshStandardMaterial color="#dfe8ef" />
      </mesh>
      <Box p={[0, 1.1, 0]} s={[2.4, 2.0, 2.4]} c={white} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.6, 2.0, Math.sin(a) * 2.6]}>
            <cylinderGeometry args={[0.16, 0.2, 3.6 + (i % 3) * 0.25, 6]} />
            <meshStandardMaterial color={white} metalness={0.12} roughness={0.32} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[1.9, 0.07, 8, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.22} metalness={0.25} />
      </mesh>
      {!low && <OrbitingBadges />}
    </group>
  )
}

function OrbitingBadges() {
  const group = useRef<Group>(null)
  const textures = useMemo(
    () =>
      skillBadges.map((label, i) =>
        makeLabelTexture(label, ['#2b6cff', '#1aa37a', '#d9892b', '#5b6ee1', '#2b6cff', '#1aa37a'][i] ?? '#2b6cff'),
      ),
    [],
  )

  useFrame((_, dt) => {
    if (getUI().reducedMotion) return
    if (group.current) group.current.rotation.y += dt * 0.2
  })

  return (
    <group ref={group} position={[0, 2.6, 0]}>
      {textures.map((texture, i) => {
        const a = (i / textures.length) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.9, Math.sin(i) * 0.25, Math.sin(a) * 2.9]}>
            <boxGeometry args={[0.9, 0.9, 0.12]} />
            <meshStandardMaterial map={texture} roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

function DevCampus({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box p={[0, 2.0, -1.0]} s={[7.2, 4.0, 2.8]} c={white} />
      <Box p={[0, 4.15, -1.0]} s={[7.5, 0.18, 1.4]} c={roof} />
      <Box p={[0, 4.28, -1.0]} s={[6.8, 0.1, 0.5]} c={accent} />
      {projects.slice(0, 4).map((project, i) => (
        <group key={project.id} position={[-2.7 + i * 1.8, 0, 1.4]}>
          <Box p={[0, 1.7 + (i % 2) * 0.25, 0]} s={[1.5, 3.2 + (i % 2) * 0.5, 1.4]} c={warm} />
          <mesh position={[0, 1.7, 0.74]}>
            <planeGeometry args={[1.15, 2.0]} />
            <meshStandardMaterial
              color={project.accent}
              emissive={project.accent}
              emissiveIntensity={0.3}
              roughness={0.22}
            />
          </mesh>
          <Box p={[0, 0.08, 0.9]} s={[1.3, 0.06, 0.9]} c="#e4ebf2" />
        </group>
      ))}
      <WindowRow x={-2.4} y={1.4} z={0.42} count={5} />
      <WindowRow x={-2.4} y={2.6} z={0.42} count={5} />
    </group>
  )
}

function OfficeTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box p={[0, 3.4, 0]} s={[3.4, 6.8, 3.4]} c={white} />
      <Box p={[2.6, 1.9, 0.5]} s={[2.4, 3.8, 2.6]} c={warm} />
      <Box p={[-2.2, 1.2, 0.8]} s={[1.6, 2.4, 1.8]} c={stone} />
      {[-2.0, -0.8, 0.4, 1.6, 2.8, 4.0].map((y, i) => (
        <Box key={i} p={[0, 1.6 + y * 0.55, 1.74]} s={[2.9, 0.1, 0.08]} c={ink} />
      ))}
      {[-0.9, 0, 0.9].map((x, i) => (
        <Box key={`v-${i}`} p={[x, 3.4, 1.72]} s={[0.55, 5.8, 0.06]} c={glass} o={0.45} />
      ))}
      <Box p={[0, 6.95, 0]} s={[3.7, 0.2, 3.7]} c={white} />
      <mesh position={[0, 7.4, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.28} />
      </mesh>
      <Box p={[-2.2, 0.1, 2.2]} s={[1.8, 0.1, 1.8]} c="#dce8d4" />
      <mesh position={[2.8, 0.35, 2.0]}>
        <boxGeometry args={[1.2, 0.7, 0.9]} />
        <meshStandardMaterial color="#cfd6df" />
      </mesh>
    </group>
  )
}

function ArchiveHall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[2.4, 2.7, 0.35, 14]} />
        <meshStandardMaterial color="#e8efe4" />
      </mesh>
      <Box p={[0, 3.0, 0]} s={[1.5, 5.8, 3.2]} c={white} />
      <Box p={[0, 6.05, 0]} s={[1.9, 0.2, 3.6]} c="#d7b56a" />
      <mesh position={[0.95, 2.8, 0]} rotation={[0, 0.18, 0]}>
        <planeGeometry args={[2.0, 3.2]} />
        <meshStandardMaterial color="#f7fbff" emissive="#b9d6ff" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[-0.95, 2.8, 0]} rotation={[0, -0.18, 0]}>
        <planeGeometry args={[2.0, 3.2]} />
        <meshStandardMaterial color="#f7fbff" emissive="#b9d6ff" emissiveIntensity={0.16} />
      </mesh>
      {[-1.4, -0.5, 0.5, 1.4].map((z, i) => (
        <mesh key={i} position={[1.55, 1.4, z]}>
          <cylinderGeometry args={[0.12, 0.14, 2.8, 8]} />
          <meshStandardMaterial color={stone} />
        </mesh>
      ))}
      <Box p={[0, 0.15, 2.2]} s={[2.2, 0.12, 1.4]} c="#e4ebf2" />
    </group>
  )
}

function CommsCenter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 3.0, 1.5, Math.sin(a) * 3.0]}>
            <cylinderGeometry args={[0.11, 0.14, 3.0, 6]} />
            <meshStandardMaterial color={white} />
          </mesh>
        )
      })}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 3.0, 24]} />
        <meshStandardMaterial color={glass} transparent opacity={0.38} roughness={0.12} metalness={0.24} />
      </mesh>
      <mesh position={[0, 3.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.05, 0.1, 8, 32]} />
        <meshStandardMaterial color={white} metalness={0.2} />
      </mesh>
      <mesh position={[0, 3.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.05, 0.035, 6, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} />
      </mesh>
      <Box p={[0, 0.2, 0]} s={[4.2, 0.25, 4.2]} c={stone} />
      <mesh position={[0, 4.3, 0]}>
        <sphereGeometry args={[0.3, 14, 14]} />
        <meshStandardMaterial color="#fff6d8" emissive={accent} emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function LaunchTower({ position }: { position: [number, number, number] }) {
  const ring = useRef<Group>(null)
  useFrame((_, dt) => {
    if (getUI().reducedMotion) return
    if (ring.current) ring.current.rotation.y += dt * 0.18
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[3.2, 3.6, 1.4, 12]} />
        <meshStandardMaterial color={warm} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[1.9, 2.3, 2.0, 12]} />
        <meshStandardMaterial color={white} />
      </mesh>
      <mesh position={[0, 5.4, 0]}>
        <cylinderGeometry args={[0.22, 0.36, 5.2, 10]} />
        <meshStandardMaterial color={white} metalness={0.28} roughness={0.26} />
      </mesh>
      <group ref={ring} position={[0, 5.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.7, 0.07, 8, 34]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.28} metalness={0.35} />
        </mesh>
      </group>
      <mesh position={[0, 8.2, 0]}>
        <coneGeometry args={[0.42, 1.0, 10]} />
        <meshStandardMaterial color="#f7fbff" emissive="#d7b56a" emissiveIntensity={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.4, 1.5, Math.sin(a) * 2.4]}>
            <boxGeometry args={[0.35, 1.8, 0.35]} />
            <meshStandardMaterial color={stone} />
          </mesh>
        )
      })}
    </group>
  )
}

function WindowRow({ x, y, z, count }: { x: number; y: number; z: number; count: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} p={[x + (i - (count - 1) / 2) * 0.9, y, z]} s={[0.6, 0.75, 0.05]} c={glass} o={0.52} />
      ))}
    </group>
  )
}

function Box({
  p,
  s,
  c,
  o = 1,
}: {
  p: [number, number, number]
  s: [number, number, number]
  c: string
  o?: number
}) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        transparent={o < 1}
        opacity={o}
        roughness={0.42}
        metalness={o < 1 ? 0.2 : 0.05}
      />
    </mesh>
  )
}
