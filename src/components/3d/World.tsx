import { Buildings } from './Buildings'
import { CameraRig } from './Camera'
import { Destinations } from './Destination'
import { Environment } from './Environment'
import { Player } from './Player'
import { RoadNetwork } from './RoadNetwork'
import { Bridges, Traffic } from './WorldExtras'
import { START_POSITION } from '../../data/map'
import { useJourney } from '../../store/journey'

export function World() {
  return (
    <>
      <color attach="background" args={['#d6eaf4']} />
      <fog attach="fog" args={['#d6eaf4', 42, 95]} />
      <CameraRig />
      <Environment />
      <Bridges />
      <RoadNetwork />
      <Buildings />
      <Destinations />
      <Player />
      <Traffic />
      <StartMarker />
    </>
  )
}

function StartMarker() {
  const { started } = useJourney()
  if (started) return null
  return (
    <group position={[START_POSITION[0], 0.15, START_POSITION[2] + 3.2]}>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[2.6, 0.85, 0.12]} />
        <meshStandardMaterial color="#16324f" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.0, 6]} />
        <meshStandardMaterial color="#d7dee8" />
      </mesh>
    </group>
  )
}
