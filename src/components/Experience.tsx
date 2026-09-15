import { experience } from '../data/experience'
import { education } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'

export function Experience() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="experience" className="experience section" ref={ref}>
      <div className="section-head" data-reveal>
        <span className="section-index">06</span>
        <span className="section-label">Experience</span>
      </div>

      <h2 className="section-title" data-reveal>
        Experience
      </h2>

      <ol className="timeline">
        {experience.map((item) => (
          <li key={item.id} className="timeline-item" data-reveal>
            <div className="timeline-period">{item.period}</div>
            <div className="timeline-body">
              <h3 className="timeline-role">{item.role}</h3>
              <p className="timeline-company">
                {item.company} — {item.location}
              </p>
              {item.summary ? <p className="timeline-summary">{item.summary}</p> : null}
              {item.highlights && item.highlights.length > 0 ? (
                <ul className="timeline-highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight.slice(0, 24)}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              {item.tech && item.tech.length > 0 ? (
                <ul className="project-tech" aria-label="Technologies">
                  {item.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="education" data-reveal>
        <h3 className="education-heading">Education</h3>
        <div className="education-grid">
          {education.map((item) => (
            <div key={item.id} className="education-item">
              <span className="meta-label">{item.period}</span>
              <p className="education-program">{item.program}</p>
              <p className="education-school">{item.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
