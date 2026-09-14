import { useSyncExternalStore } from 'react'
import { START_POSITION } from '../data/map'
import type { CameraMode, DestinationId, JourneyUI } from '../types'

const listeners = new Set<() => void>()

const initialUI: JourneyUI = {
  started: false,
  activePanel: null,
  nearbyId: null,
  navigatingTo: null,
  cameraMode: 'overview',
  dimmed: false,
  isTouch: false,
  reducedMotion: false,
  lowQuality: false,
  hasMoved: false,
  systemHealth: 100,
  visited: [],
}

let ui: JourneyUI = initialUI

export const sim = {
  position: { x: START_POSITION[0], y: START_POSITION[1], z: START_POSITION[2] },
  heading: Math.PI,
  velocity: { x: 0, z: 0 },
  input: { x: 0, z: 0 },
  keys: { f: 0, b: 0, l: 0, r: 0 },
  speed: 0,
  cameraYaw: 0.2,
  cameraPitch: 0.38,
  cameraDistance: 7.5,
  focus: { x: 0, y: 2.2, z: -6 },
  frozen: false,
  pointerDragging: false,
  cameraNeedsSnap: false,
  navIndex: 0,
  navPath: [] as Array<{ x: number; z: number }>,
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getUI(): JourneyUI {
  return ui
}

export function setUI(patch: Partial<JourneyUI>): void {
  let changed = false
  const next = { ...ui }
  for (const key of Object.keys(patch) as (keyof JourneyUI)[]) {
    if (next[key] !== patch[key]) {
      changed = true
      ;(next as Record<string, unknown>)[key] = patch[key]
    }
  }
  if (!changed) return
  ui = next
  listeners.forEach((listener) => listener())
}

export function useJourney(): JourneyUI {
  return useSyncExternalStore(subscribe, getUI, getUI)
}

export function useUIFlag<K extends keyof JourneyUI>(key: K): JourneyUI[K] {
  return useSyncExternalStore(
    subscribe,
    () => getUI()[key],
    () => getUI()[key],
  )
}

export function startJourney(): void {
  if (ui.started && ui.cameraMode === 'follow') return
  sim.frozen = false
  document.body.classList.add('journey-live')
  sim.velocity.x = 0
  sim.velocity.z = 0
  sim.heading = Math.PI
  sim.cameraYaw = 0.12
  sim.cameraPitch = 0.38
  sim.cameraDistance = 11.5
  sim.cameraNeedsSnap = true
  setUI({
    started: true,
    cameraMode: 'follow',
    dimmed: false,
    activePanel: null,
  })
}

export function closePanel(): void {
  sim.frozen = false
  setUI({
    activePanel: null,
    dimmed: false,
    cameraMode: ui.started ? 'follow' : 'overview',
  })
}

export function resetPlayerToStart(): void {
  sim.position.x = START_POSITION[0]
  sim.position.y = START_POSITION[1]
  sim.position.z = START_POSITION[2]
  sim.heading = Math.PI
  sim.velocity.x = 0
  sim.velocity.z = 0
  sim.navPath = []
  setUI({ navigatingTo: null })
}

export function setCameraMode(mode: CameraMode): void {
  setUI({ cameraMode: mode })
}

export function setNearby(id: DestinationId | null): void {
  if (ui.nearbyId === id) return
  setUI({ nearbyId: id })
}

export function setNavigatingTo(id: DestinationId | null, path: Array<{ x: number; z: number }>): void {
  sim.navPath = path
  sim.navIndex = 0
  setUI({ navigatingTo: id })
}
