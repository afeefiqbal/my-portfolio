import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '../hooks/useReveal'
import { useTheme, type Theme } from '../lib/theme'

/** Particle/wireframe palettes tuned per theme for contrast against the page. */
const PALETTES: Record<Theme, { accent: string; faint: string; wire: string }> = {
  dark: { accent: '#4d7cff', faint: '#4a5261', wire: '#232a36' },
  light: { accent: '#2f5fe0', faint: '#818893', wire: '#c8ccd3' },
}

/** Evenly distributed points on a sphere (Fibonacci lattice). */
function spherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    positions[i * 3] = Math.cos(theta) * r * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return positions
}

function Globe({ animate, theme }: { animate: boolean; theme: Theme }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const palette = PALETTES[theme]

  useEffect(() => {
    if (!animate) return
    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [animate])

  const points = useMemo(() => spherePoints(900, 2.1), [])
  const colors = useMemo(() => {
    const accent = new THREE.Color(palette.accent)
    const faint = new THREE.Color(palette.faint)
    const array = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i += 1) {
      // Deterministic sparse accent: roughly 1 in 16 points glows blue.
      const color = i % 16 === 3 ? accent : faint
      array[i * 3] = color.r
      array[i * 3 + 1] = color.g
      array[i * 3 + 2] = color.b
    }
    return array
  }, [palette])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    if (animate) {
      g.rotation.y += delta * 0.045
      // Subtle mouse parallax, eased toward the target.
      const targetX = pointer.current.y * 0.12
      const targetZ = pointer.current.x * 0.08
      g.rotation.x += (targetX - g.rotation.x) * 0.04
      g.rotation.z += (targetZ - g.rotation.z) * 0.04
    }
  })

  return (
    <group ref={group} rotation={[0.2, 0.6, 0]}>
      <points key={theme}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.55, 1)]} />
        <lineBasicMaterial color={palette.wire} transparent opacity={0.45} />
      </lineSegments>
    </group>
  )
}

/**
 * Subtle background globe for the hero. Rendering pauses when the hero is
 * off-screen or the tab is hidden; under prefers-reduced-motion a single
 * static frame is drawn.
 */
export function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [reduced] = useState(() => prefersReducedMotion())
  const theme = useTheme()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { threshold: 0.02 },
    )
    observer.observe(el)

    const onVisibility = () => setVisible((v) => (document.hidden ? false : v || !document.hidden))
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const animate = visible && !reduced

  return (
    <div ref={wrapRef} className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        frameloop={animate ? 'always' : 'demand'}
      >
        <Globe animate={animate} theme={theme} />
      </Canvas>
    </div>
  )
}
