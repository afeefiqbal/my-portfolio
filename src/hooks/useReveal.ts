import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reveals `[data-reveal]` descendants with a slow, intentional rise as they
 * enter the viewport. Elements sharing the same `data-reveal-group` value
 * stagger together. Skipped entirely under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const singles = root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-group])')
      singles.forEach((target) => {
        gsap.fromTo(
          target,
          { y: 44, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: target, start: 'top 88%', once: true },
          },
        )
      })

      const grouped = root.querySelectorAll<HTMLElement>('[data-reveal][data-reveal-group]')
      const groups = new Map<string, HTMLElement[]>()
      grouped.forEach((target) => {
        const key = target.dataset.revealGroup ?? ''
        const list = groups.get(key) ?? []
        list.push(target)
        groups.set(key, list)
      })
      groups.forEach((targets) => {
        gsap.fromTo(
          targets,
          { y: 44, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: targets[0], start: 'top 88%', once: true },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return ref
}
