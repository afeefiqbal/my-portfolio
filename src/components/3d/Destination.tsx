import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CanvasTexture, LinearFilter, type Mesh } from 'three'
import { DESTINATIONS } from '../../data/map'
import { exploreDestination } from '../../hooks/useInteraction'
import { getUI, useJourney } from '../../store/journey'
import type { Destination } from '../../types'

export function Destinations() {
  return (
    <group>
      {DESTINATIONS.map((dest) => (
        <DestinationMarker key={dest.id} destination={dest} />
      ))}
    </group>
  )
}

function DestinationMarker({ destination }: { destination: Destination }) {
  const ring = useRef<Mesh>(null)
  const ui = useJourney()
  const active = ui.nearbyId === destination.id || ui.activePanel === destination.id
  const visited = ui.visited.includes(destination.id)
  const texture = useMemo(
    () => makeSignTexture(destination.index, destination.title, destination.subtitle, destination.accent),
    [destination],
  )

  useFrame((state) => {
    if (!ring.current) return
    const pulse = getUI().reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.05
    const scale = active ? 1.15 * pulse : pulse
    ring.current.scale.set(scale, 1, scale)
  })

  return (
    <group position={[destination.position[0], 0.14, destination.position[2]]}>
      <mesh
        ref={ring}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={(event) => {
          event.stopPropagation()
          exploreDestination(destination.id)
        }}
      >
        <ringGeometry args={[2.35, 2.6, 28]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={destination.accent}
          emissiveIntensity={active ? 0.45 : visited ? 0.22 : 0.12}
        />
      </mesh>

      {/* Physical roadside sign */}
      <group position={[2.6, 0, 1.4]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 1.7, 6]} />
          <meshStandardMaterial color="#d7dee8" metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh
          position={[0, 2.05, 0.04]}
          onClick={(event) => {
            event.stopPropagation()
            exploreDestination(destination.id)
          }}
        >
          <boxGeometry args={[1.7, 0.95, 0.08]} />
          <meshStandardMaterial map={texture} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.5, -0.02]}>
          <boxGeometry args={[0.12, 0.12, 0.16]} />
          <meshStandardMaterial color="#aeb8c4" />
        </mesh>
      </group>

      <mesh
        visible={false}
        position={[0, 1, 0]}
        onClick={(event) => {
          event.stopPropagation()
          exploreDestination(destination.id)
        }}
      >
        <sphereGeometry args={[2.6, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}

function makeSignTexture(index: string, title: string, subtitle: string, accent: string): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 288
  const ctx = canvas.getContext('2d')
  if (!ctx) return new CanvasTexture(canvas)

  ctx.fillStyle = '#16324f'
  roundRect(ctx, 0, 0, 512, 288, 28)
  ctx.fill()

  ctx.fillStyle = accent
  roundRect(ctx, 28, 28, 90, 90, 18)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 42px Sora, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(index, 73, 74)

  ctx.textAlign = 'left'
  ctx.font = '700 40px Sora, sans-serif'
  ctx.fillText(title.toUpperCase(), 140, 70)
  ctx.font = '500 26px Manrope, sans-serif'
  ctx.fillStyle = '#b7c7d8'
  ctx.fillText(subtitle.toUpperCase(), 140, 120)

  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  roundRect(ctx, 28, 200, 456, 4, 2)
  ctx.fill()
  ctx.fillStyle = accent
  roundRect(ctx, 28, 200, 180, 4, 2)
  ctx.fill()

  const texture = new CanvasTexture(canvas)
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  return texture
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export { Destinations as Destination }
