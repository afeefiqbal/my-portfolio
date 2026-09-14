import { useEffect } from 'react'
import type { PerspectiveCamera } from 'three'
import { START_POSITION } from '../data/map'
import { getUI, sim } from '../store/journey'
import { clamp, damp } from '../lib/math'

export function useCameraPointer(element: HTMLElement | null): void {
  useEffect(() => {
    if (!element) return

    let dragging = false
    let lastX = 0
    let lastY = 0

    const down = (event: PointerEvent) => {
      if (getUI().activePanel || !getUI().started) return
      if (event.button !== 0 && event.pointerType === 'mouse') return
      const target = event.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, summary, .dest-card, .joystick, .quick-nav, .minimap')) {
        return
      }
      dragging = true
      sim.pointerDragging = true
      lastX = event.clientX
      lastY = event.clientY
    }

    const move = (event: PointerEvent) => {
      if (!dragging) return
      if (sim.keys.f || sim.keys.b || sim.keys.l || sim.keys.r) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      sim.cameraYaw -= dx * 0.004
      sim.cameraPitch = clamp(sim.cameraPitch + dy * 0.0025, 0.28, 0.52)
    }

    const up = () => {
      dragging = false
      sim.pointerDragging = false
    }

    const wheel = (event: WheelEvent) => {
      if (getUI().activePanel) return
      event.preventDefault()
      sim.cameraDistance = clamp(sim.cameraDistance + event.deltaY * 0.018, 7, 18)
    }

    element.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    element.addEventListener('wheel', wheel, { passive: false })
    return () => {
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      element.removeEventListener('wheel', wheel)
    }
  }, [element])
}

export function stepCamera(camera: PerspectiveCamera, _elapsed: number, dt: number): void {
  const ui = getUI()
  const reduced = ui.reducedMotion

  // Pre-start: tight on the player at START
  if (!ui.started || ui.cameraMode === 'overview') {
    const lookX = START_POSITION[0]
    const lookY = 1.15
    const lookZ = START_POSITION[2]
    const distance = 7.2
    const pitch = 0.36
    const yaw = 0.18
    const height = Math.sin(pitch) * distance
    const flat = Math.cos(pitch) * distance
    const tx = lookX + Math.sin(yaw) * flat
    const ty = lookY + height
    const tz = lookZ + Math.cos(yaw) * flat
    camera.position.x = damp(camera.position.x, tx, reduced ? 4 : 2.4, dt)
    camera.position.y = damp(camera.position.y, ty, reduced ? 4 : 2.4, dt)
    camera.position.z = damp(camera.position.z, tz, reduced ? 4 : 2.4, dt)
    camera.lookAt(lookX, lookY, lookZ)
    return
  }

  const lookX = ui.cameraMode === 'focus' ? sim.focus.x : sim.position.x
  const lookY = ui.cameraMode === 'focus' ? sim.focus.y : 1.15
  const lookZ = ui.cameraMode === 'focus' ? sim.focus.z : sim.position.z

  const distance = ui.cameraMode === 'focus' ? Math.min(sim.cameraDistance, 9) : sim.cameraDistance
  const pitch = ui.cameraMode === 'focus' ? 0.38 : sim.cameraPitch
  const yaw = sim.cameraYaw
  const height = Math.sin(pitch) * distance
  const flat = Math.cos(pitch) * distance
  const cx = lookX + Math.sin(yaw) * flat
  const cy = lookY + height
  const cz = lookZ + Math.cos(yaw) * flat

  if (sim.cameraNeedsSnap) {
    camera.position.set(cx, cy, cz)
    sim.cameraNeedsSnap = false
  } else {
    const follow = reduced ? 12 : ui.cameraMode === 'focus' ? 5 : 9
    camera.position.x = damp(camera.position.x, cx, follow, dt)
    camera.position.y = damp(camera.position.y, cy, follow, dt)
    camera.position.z = damp(camera.position.z, cz, follow, dt)
  }
  camera.lookAt(lookX, lookY, lookZ)
}
