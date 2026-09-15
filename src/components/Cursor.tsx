import { useEffect, useRef, useState } from 'react'

/**
 * Minimal custom cursor for fine pointers: a small dot with a trailing ring.
 * Elements can opt into behaviours via `data-cursor`:
 *   - data-cursor="hover" → ring expands
 *   - data-cursor="view"  → ring becomes a "VIEW" badge (project images)
 * Disabled on touch devices and under prefers-reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () =>
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let seen = false

    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      if (!seen) {
        seen = true
        rx = x
        ry = y
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      const mode = target?.dataset.cursor ?? ''
      ring.dataset.mode = mode
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      seen = false
    }

    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span>View</span>
      </div>
    </>
  )
}
