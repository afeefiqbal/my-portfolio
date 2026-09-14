import { getDestination } from '../data/map'
import { buildNavigationPath } from '../lib/road'
import { getUI, setNavigatingTo, setUI, sim } from '../store/journey'
import type { DestinationId } from '../types'

export function exploreDestination(id: DestinationId): void {
  const dest = getDestination(id)
  const ui = getUI()
  sim.frozen = true
  sim.velocity.x = 0
  sim.velocity.z = 0
  sim.focus.x = dest.position[0]
  sim.focus.y = 2.4
  sim.focus.z = dest.position[2]
  const visited = ui.visited.includes(id) ? ui.visited : [...ui.visited, id]
  setUI({
    nearbyId: id,
    cameraMode: ui.started ? 'focus' : ui.cameraMode,
    dimmed: true,
    navigatingTo: null,
    visited,
  })
  sim.navPath = []

  const open = () => setUI({ activePanel: id })
  if (ui.reducedMotion || !ui.started) {
    open()
    return
  }
  window.setTimeout(() => {
    if (getUI().dimmed) open()
  }, 420)
}

export function navigateToDestination(id: DestinationId): void {
  const ui = getUI()
  if (!ui.started) {
    exploreDestination(id)
    return
  }
  const path = buildNavigationPath(sim.position.x, sim.position.z, id)
  sim.frozen = false
  setUI({ activePanel: null, dimmed: false, cameraMode: 'follow' })
  setNavigatingTo(id, path)
}

export function interactNearby(): void {
  const { nearbyId, activePanel } = getUI()
  if (activePanel) return
  if (nearbyId) exploreDestination(nearbyId)
}
