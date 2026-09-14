import { useEffect, useState } from 'react'
import { closePanel, setUI } from '../store/journey'
import { interactNearby } from './useInteraction'

export function useJourneyHotkeys(): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        closePanel()
        return
      }
      if (event.code === 'KeyE') {
        const target = event.target as HTMLElement | null
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
        event.preventDefault()
        interactNearby()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export function useDeviceProfile(): void {
  useEffect(() => {
    const sync = () => {
      const touch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const low = touch || window.innerWidth < 820
      setUI({
        isTouch: touch,
        reducedMotion: reduced,
        lowQuality: low,
      })
    }
    sync()
    window.addEventListener('resize', sync)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    motion.addEventListener('change', sync)
    return () => {
      window.removeEventListener('resize', sync)
      motion.removeEventListener('change', sync)
    }
  }, [])
}

export function useSystemHealth(): number {
  const [health, setHealth] = useState(100)
  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      frames += 1
      if (now - last >= 1000) {
        const fps = frames * (1000 / (now - last))
        setHealth(Math.max(62, Math.min(100, Math.round((fps / 60) * 100))))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return health
}
