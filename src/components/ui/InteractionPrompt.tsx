import { getDestination } from '../../data/map'
import { exploreDestination } from '../../hooks/useInteraction'
import { useJourney } from '../../store/journey'

export function InteractionPrompt() {
  const { nearbyId, started, activePanel, isTouch } = useJourney()
  if (!started || !nearbyId || activePanel) return null
  const dest = getDestination(nearbyId)

  return (
    <div className="interact-prompt">
      <p>
        {dest.index} · {dest.title}
      </p>
      <button type="button" onClick={() => exploreDestination(nearbyId)}>
        {isTouch ? 'Tap to explore' : 'Press E to explore'}
      </button>
    </div>
  )
}
