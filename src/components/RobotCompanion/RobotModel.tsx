import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'
import { useTheme } from '../../lib/theme'

export type PartRefs = {
  root: THREE.Group | null
  body: THREE.Group | null
  head: THREE.Group | null
  leftArm: THREE.Group | null
  rightArm: THREE.Group | null
  leftLeg: THREE.Group | null
  rightLeg: THREE.Group | null
}

const SHELL = '#f7f4ee'
const DARK = '#1a1d22'
const JOINT = '#2c3036'

export function createPartRefs(): PartRefs {
  return {
    root: null,
    body: null,
    head: null,
    leftArm: null,
    rightArm: null,
    leftLeg: null,
    rightLeg: null,
  }
}

function makeAiTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, 256, 128)
  ctx.fillStyle = '#1c1f24'
  ctx.font = '800 92px Arial, Helvetica, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('AI', 128, 72)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function makeEyeCurve() {
  return new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.048, 0, 0),
    new THREE.Vector3(0, 0.06, 0),
    new THREE.Vector3(0.048, 0, 0),
  )
}

function Eye({ position, material }: { position: [number, number, number]; material: THREE.Material }) {
  const curve = useMemo(makeEyeCurve, [])
  return (
    <mesh position={position} material={material}>
      <tubeGeometry args={[curve, 16, 0.016, 8, false]} />
    </mesh>
  )
}

export function RobotModel({ parts }: { parts: MutableRefObject<PartRefs> }) {
  const theme = useTheme()
  const accent = theme === 'light' ? '#3db4ff' : '#5ec4ff'
  const aiMap = useMemo(() => makeAiTexture(), [])
  const materials = useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({
        color: SHELL,
        roughness: 0.28,
        metalness: 0.12,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: DARK,
        roughness: 0.35,
        metalness: 0.18,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: JOINT,
        roughness: 0.4,
        metalness: 0.12,
      }),
      glow: new THREE.MeshBasicMaterial({ color: accent }),
      visor: new THREE.MeshStandardMaterial({
        color: '#16181c',
        roughness: 0.28,
        metalness: 0.35,
      }),
    }),
    [accent],
  )

  useEffect(() => {
    return () => {
      materials.shell.dispose()
      materials.dark.dispose()
      materials.joint.dispose()
      materials.glow.dispose()
      materials.visor.dispose()
      aiMap?.dispose()
    }
  }, [materials, aiMap])

  return (
    <group
      ref={(node) => {
        parts.current.root = node
      }}
      position={[0, -0.62, 0]}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.06]} renderOrder={-1}>
        <circleGeometry args={[0.48, 28]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <group
        ref={(node) => {
          parts.current.body = node
        }}
      >
        <mesh position={[0, 0.58, 0]} material={materials.shell} scale={[0.82, 0.9, 0.74]}>
          <sphereGeometry args={[0.3, 28, 22]} />
        </mesh>
        {aiMap ? (
          <mesh position={[0, 0.6, 0.23]}>
            <planeGeometry args={[0.2, 0.1]} />
            <meshBasicMaterial map={aiMap} transparent depthWrite={false} />
          </mesh>
        ) : null}

        <group
          ref={(node) => {
            parts.current.head = node
          }}
          position={[0, 1.08, 0]}
        >
          <mesh material={materials.shell} scale={[1.06, 1.0, 1.02]}>
            <sphereGeometry args={[0.34, 32, 24]} />
          </mesh>
          <mesh position={[0, 0.04, 0.22]} material={materials.visor} scale={[1.12, 0.46, 0.52]}>
            <sphereGeometry args={[0.24, 24, 16]} />
          </mesh>
          <Eye position={[-0.09, 0.048, 0.345]} material={materials.glow} />
          <Eye position={[0.09, 0.048, 0.345]} material={materials.glow} />

          <mesh position={[-0.36, 0.01, 0.02]} material={materials.shell} scale={[0.38, 0.78, 0.7]}>
            <sphereGeometry args={[0.2, 18, 14]} />
          </mesh>
          <mesh position={[0.36, 0.01, 0.02]} material={materials.shell} scale={[0.38, 0.78, 0.7]}>
            <sphereGeometry args={[0.2, 18, 14]} />
          </mesh>
          <mesh position={[-0.395, 0.01, 0.03]} material={materials.dark} scale={[0.16, 0.42, 0.36]}>
            <sphereGeometry args={[0.18, 14, 12]} />
          </mesh>
          <mesh position={[0.395, 0.01, 0.03]} material={materials.dark} scale={[0.16, 0.42, 0.36]}>
            <sphereGeometry args={[0.18, 14, 12]} />
          </mesh>

          <mesh position={[0, 0.38, 0]} material={materials.joint}>
            <cylinderGeometry args={[0.014, 0.014, 0.18, 8]} />
          </mesh>
          <mesh position={[0, 0.5, 0]} material={materials.glow}>
            <sphereGeometry args={[0.048, 16, 16]} />
          </mesh>
        </group>

        <group
          ref={(node) => {
            parts.current.leftArm = node
          }}
          position={[-0.3, 0.66, 0]}
          rotation={[0, 0, 0.28]}
        >
          <mesh position={[0, -0.16, 0]} material={materials.shell}>
            <capsuleGeometry args={[0.07, 0.22, 6, 12]} />
          </mesh>
        </group>
        <group
          ref={(node) => {
            parts.current.rightArm = node
          }}
          position={[0.3, 0.66, 0]}
          rotation={[0, 0, -0.28]}
        >
          <mesh position={[0, -0.16, 0]} material={materials.shell}>
            <capsuleGeometry args={[0.07, 0.22, 6, 12]} />
          </mesh>
        </group>

        <group
          ref={(node) => {
            parts.current.leftLeg = node
          }}
          position={[-0.11, 0.34, 0]}
        >
          <mesh position={[0, -0.14, 0]} material={materials.shell}>
            <capsuleGeometry args={[0.08, 0.16, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.26, 0.04]} material={materials.dark} scale={[1, 0.55, 1.25]}>
            <sphereGeometry args={[0.09, 14, 12]} />
          </mesh>
        </group>
        <group
          ref={(node) => {
            parts.current.rightLeg = node
          }}
          position={[0.11, 0.34, 0]}
        >
          <mesh position={[0, -0.14, 0]} material={materials.shell}>
            <capsuleGeometry args={[0.08, 0.16, 6, 12]} />
          </mesh>
          <mesh position={[0, -0.26, 0.04]} material={materials.dark} scale={[1, 0.55, 1.25]}>
            <sphereGeometry args={[0.09, 14, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export function usePartRefs() {
  return useRef<PartRefs>(createPartRefs())
}
