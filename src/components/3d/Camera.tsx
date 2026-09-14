import { useThree, useFrame } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { usePlayerMovement, stepPlayer } from '../../hooks/usePlayerMovement'
import { stepCamera } from '../../hooks/useCamera'

export function CameraRig() {
  const { camera } = useThree()
  usePlayerMovement()

  useFrame((state, dt) => {
    stepPlayer(dt)
    stepCamera(camera as PerspectiveCamera, state.clock.elapsedTime, dt)
  })

  return null
}
