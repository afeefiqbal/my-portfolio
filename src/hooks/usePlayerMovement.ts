import { useEffect } from 'react'
import { getUI, setNearby, setUI, sim, startJourney } from '../store/journey'
import { closestDestination, constrainPosition, isWalkable } from '../lib/road'
import { clamp, lerpAngle } from '../lib/math'
import type { DestinationId } from '../types'

const SPEED = 10

export function usePlayerMovement(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event)) return
      if (!isMoveKey(event.code, event.key)) return
      event.preventDefault()
      event.stopPropagation()

      // First WASD press always enters the journey — no silent overview spin.
      if (!getUI().started) startJourney()

      applyKeys(event.code, event.key, 1)
      sim.pointerDragging = false
      sim.cameraYaw = 0
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (!isMoveKey(event.code, event.key)) return
      applyKeys(event.code, event.key, 0)
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    window.addEventListener('keyup', onKeyUp, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      window.removeEventListener('keyup', onKeyUp, { capture: true })
    }
  }, [])
}

function isTyping(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function isMoveKey(code: string, key: string): boolean {
  const lower = key.toLowerCase()
  return (
    code === 'KeyW' ||
    code === 'KeyA' ||
    code === 'KeyS' ||
    code === 'KeyD' ||
    code === 'ArrowUp' ||
    code === 'ArrowDown' ||
    code === 'ArrowLeft' ||
    code === 'ArrowRight' ||
    lower === 'w' ||
    lower === 'a' ||
    lower === 's' ||
    lower === 'd'
  )
}

function applyKeys(code: string, key: string, value: 0 | 1): void {
  const lower = key.toLowerCase()
  if (code === 'KeyW' || code === 'ArrowUp' || lower === 'w') sim.keys.f = value
  if (code === 'KeyS' || code === 'ArrowDown' || lower === 's') sim.keys.b = value
  if (code === 'KeyA' || code === 'ArrowLeft' || lower === 'a') sim.keys.l = value
  if (code === 'KeyD' || code === 'ArrowRight' || lower === 'd') sim.keys.r = value
}

/**
 * Fixed map axes (never camera-relative):
 * W → -Z (into campus)   S → +Z
 * A → -X                 D → +X
 */
export function stepPlayer(dt: number): void {
  const ui = getUI()
  if (!ui.started || sim.frozen || ui.activePanel) {
    sim.velocity.x = 0
    sim.velocity.z = 0
    return
  }

  const capped = Math.min(dt, 0.05)

  if (ui.navigatingTo && sim.navPath.length > 0) {
    followPath(capped, ui.navigatingTo)
    return
  }

  const ix = sim.input.x + (sim.keys.r - sim.keys.l)
  const iz = sim.input.z + (sim.keys.f - sim.keys.b)
  const len = Math.hypot(ix, iz)

  if (len < 0.01) {
    sim.velocity.x = 0
    sim.velocity.z = 0
    sim.speed = 0
    setNearby(closestDestination(sim.position.x, sim.position.z))
    return
  }

  const nx = ix / len
  const nz = iz / len
  // World axes — W is always into the map.
  const dirX = nx
  const dirZ = -nz

  sim.velocity.x = dirX * SPEED
  sim.velocity.z = dirZ * SPEED
  sim.speed = SPEED

  // Face the pressed direction immediately (no lerp spin).
  sim.heading = Math.atan2(dirX, dirZ)

  const prevX = sim.position.x
  const prevZ = sim.position.z
  let nextX = prevX + sim.velocity.x * capped
  let nextZ = prevZ + sim.velocity.z * capped

  if (!isWalkable(nextX, nextZ)) {
    if (isWalkable(nextX, prevZ)) nextZ = prevZ
    else if (isWalkable(prevX, nextZ)) nextX = prevX
    else {
      sim.velocity.x = 0
      sim.velocity.z = 0
      sim.speed = 0
      setNearby(closestDestination(sim.position.x, sim.position.z))
      return
    }
  }

  sim.position.x = nextX
  sim.position.z = nextZ

  if (!ui.hasMoved) setUI({ hasMoved: true })
  setNearby(closestDestination(sim.position.x, sim.position.z))
}

function followPath(dt: number, destination: DestinationId): void {
  const point = sim.navPath[sim.navIndex]
  if (!point) {
    setUI({ navigatingTo: null })
    sim.navPath = []
    return
  }
  const dx = point.x - sim.position.x
  const dz = point.z - sim.position.z
  const dist = Math.hypot(dx, dz)
  if (dist < 0.55) {
    sim.navIndex += 1
    if (sim.navIndex >= sim.navPath.length) {
      sim.navPath = []
      setUI({ navigatingTo: null })
      setNearby(destination)
      return
    }
    return
  }
  const speed = clamp(dist * 2.2, 4.2, 9.5)
  sim.velocity.x = (dx / dist) * speed
  sim.velocity.z = (dz / dist) * speed
  sim.speed = speed
  sim.heading = lerpAngle(sim.heading, Math.atan2(dx, dz), 1 - Math.exp(-10 * dt))
  sim.position.x += sim.velocity.x * dt
  sim.position.z += sim.velocity.z * dt
  const constrained = constrainPosition(sim.position.x, sim.position.z)
  sim.position.x = constrained.x
  sim.position.z = constrained.z
}
