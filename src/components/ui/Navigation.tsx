import { NAV_ITEMS } from '../../data/map'
import { exploreDestination } from '../../hooks/useInteraction'
import { useJourney } from '../../store/journey'
import type { DestinationId } from '../../types'

export function Navigation() {
  const { activePanel } = useJourney()

  return (
    <nav id="portfolio-nav" className="top-nav" aria-label="Portfolio sections">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activePanel === item.id ? 'is-active' : undefined}
          onClick={() => exploreDestination(item.id as DestinationId)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
