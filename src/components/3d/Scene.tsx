import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { PCFShadowMap, type PerspectiveCamera } from 'three'
import { START_POSITION } from '../../data/map'
import { useCameraPointer } from '../../hooks/useCamera'
import { useUIFlag } from '../../store/journey'
import { World } from './World'

const DPR_HIGH: [number, number] = [1, 1.5]
const DPR_LOW: [number, number] = [1, 1]

export function Scene() {
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null)
  const lowQuality = useUIFlag('lowQuality')
  const dimmed = useUIFlag('dimmed')
  const started = useUIFlag('started')
  useCameraPointer(wrap)
  const gl = useMemo(
    () => ({ antialias: !lowQuality, powerPreference: 'high-performance' as const, alpha: false }),
    [lowQuality],
  )

  return (
    <div
      ref={setWrap}
      className={`scene-wrap${dimmed ? ' is-dimmed' : ''}${started ? ' is-live' : ''}`}
    >
      <Canvas
        shadows={!lowQuality}
        dpr={lowQuality ? DPR_LOW : DPR_HIGH}
        gl={gl}
        camera={{
          fov: 40,
          near: 0.1,
          far: 220,
          position: [START_POSITION[0] + 4, 8, START_POSITION[2] + 10],
        }}
        onCreated={({ camera, gl: renderer }) => {
          renderer.shadowMap.enabled = !lowQuality
          renderer.shadowMap.type = PCFShadowMap
          ;(camera as PerspectiveCamera).lookAt(START_POSITION[0], 1, START_POSITION[2])
        }}
      >
        <World key="campus-v3" />
      </Canvas>
    </div>
  )
}

export default Scene
