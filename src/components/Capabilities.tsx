import { capabilityGroups } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'

export function Capabilities() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="capabilities" className="capabilities section" ref={ref}>
      <div className="section-head" data-reveal>
        <span className="section-index">05</span>
        <span className="section-label">Capabilities</span>
      </div>

      <h2 className="section-title" data-reveal>
        Full stack
        <br />
        <span className="title-outline">Development</span>
      </h2>

      <p className="work-intro" data-reveal>
        A full-stack developer who also builds modern AI-powered applications — frontend,
        backend, and the systems in between.
      </p>

      <ul className="capability-groups">
        {capabilityGroups.map((group) => (
          <li key={group.id} className="capability-group" data-reveal data-reveal-group="capabilities">
            <span className="capability-group-label" data-cursor="hover">
              {group.label}
            </span>
            <span className="capability-group-items">{group.items.join(' · ')}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
