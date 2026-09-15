import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export type HoverKind = 'cta' | 'project' | null

export type RobotPointer = {
  x: number
  y: number
  inside: boolean
  lastMove: number
  hoverX: number
  hoverY: number
  hoverKind: HoverKind
}

const HOVER_SELECTOR = [
  '.btn-primary',
  '.project',
  '.project-media',
  '[data-cursor="view"]',
  '[data-cursor="hover"]',
].join(',')

export function createPointer(): RobotPointer {
  return {
    x: 0,
    y: 0,
    inside: false,
    lastMove: 0,
    hoverX: 0,
    hoverY: 0,
    hoverKind: null,
  }
}

/**
 * Writes pointer state into a ref. Never triggers React renders.
 */
export function useRobotPointer(
  heroRef: RefObject<HTMLElement | null>,
  pointer: RefObject<RobotPointer>,
  enabled: boolean,
) {
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    if (!enabled) return
    const hero = heroRef.current
    if (!hero) return
    const state = pointer.current

    const onMove = (event: MouseEvent) => {
      if (!enabledRef.current) return
      const rect = hero.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      state.x = event.clientX - rect.left
      state.y = event.clientY - rect.top
      state.inside = inside
      state.lastMove = performance.now()

      const node = (event.target as HTMLElement | null)?.closest?.(HOVER_SELECTOR)
      if (node instanceof HTMLElement) {
        const box = node.getBoundingClientRect()
        state.hoverX = box.left + box.width / 2 - rect.left
        state.hoverY = box.top + box.height / 2 - rect.top
        state.hoverKind = node.classList.contains('btn-primary') ? 'cta' : 'project'
      } else {
        state.hoverKind = null
      }
    }

    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget && hero.contains(event.relatedTarget as Node)) return
      state.inside = false
      state.hoverKind = null
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, heroRef, pointer])
}
