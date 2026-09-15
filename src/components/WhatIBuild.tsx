import { whatIBuild } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'

export function WhatIBuild() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="what-i-build" className="whatibuild section" ref={ref} aria-label="What I build">
      <div className="section-head" data-reveal>
        <span className="section-index">02</span>
        <span className="section-label">What I build</span>
      </div>

      <h2 className="section-title" data-reveal>
        What I
        <br />
        <span className="title-outline">Build</span>
      </h2>

      <ul className="build-list">
        {whatIBuild.map((item, i) => (
          <li key={item} className="build-item" data-reveal data-reveal-group="build">
            <span className="build-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="build-label" data-cursor="hover">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
