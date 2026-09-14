import { experience } from '../../data/experience'

export function Experience() {
  return (
    <section className="section">
      <ol className="timeline jobs">
        {experience.map((item) => (
          <li key={item.id}>
            <p className="muted">
              {item.period} · {item.location}
            </p>
            <h3>{item.role}</h3>
            <p className="place">{item.company}</p>
            <p>{item.summary}</p>
            <ul className="bullets">
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className="chip-row">
              {item.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
