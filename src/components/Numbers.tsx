import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '../data/site'
import { prefersReducedMotion, useReveal } from '../hooks/useReveal'

gsap.registerPlugin(ScrollTrigger)

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const match = value.match(/^(\d+)(.*)$/)
    if (!match) return
    const target = Number(match[1])
    const suffix = match[2]
    const pad = match[1].length

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = `${String(Math.round(counter.n)).padStart(pad, '0')}${suffix}`
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}

export function Numbers() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="numbers" className="numbers section" ref={ref} aria-label="By the numbers">
      <div className="section-head" data-reveal>
        <span className="section-index">04</span>
        <span className="section-label">By the numbers</span>
      </div>

      <div className="numbers-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="number-item" data-reveal data-reveal-group="numbers">
            <span className="number-value">
              <StatValue value={stat.value} />
            </span>
            <span className="number-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
