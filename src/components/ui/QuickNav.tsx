import { DESTINATIONS } from '../../data/map'
import { exploreDestination } from '../../hooks/useInteraction'
import { startJourney, useJourney } from '../../store/journey'

export function QuickNav() {
  const { isTouch, started } = useJourney()

  return (
    <div className={`quick-nav${isTouch ? ' is-mobile' : ''}`}>
      <details>
        <summary>Quick navigation</summary>
        <div className="quick-nav-list">
          {!started && (
            <button type="button" onClick={startJourney}>
              Enter the map
            </button>
          )}
          {DESTINATIONS.map((dest) => (
            <button key={dest.id} type="button" onClick={() => exploreDestination(dest.id)}>
              <span>{dest.index}</span>
              {dest.title}
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
