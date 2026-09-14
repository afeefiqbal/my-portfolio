import { useState } from 'react'
import { projects } from '../../data/projects'

export function Projects() {
  const [openId, setOpenId] = useState(projects[0]?.id ?? '')
  const active = projects.find((item) => item.id === openId) ?? projects[0]

  return (
    <section className="section project-dash">
      <div className="project-list">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className={project.id === active.id ? 'is-active' : undefined}
            onClick={() => setOpenId(project.id)}
          >
            <img src={project.image} alt="" />
            <span>
              <b>{project.name}</b>
              <small>{project.year}</small>
            </span>
          </button>
        ))}
      </div>
      {active && (
        <article className="project-detail">
          <img src={active.image} alt={active.name} />
          <p className="muted">
            {active.year} · {active.role}
          </p>
          <h3>{active.name}</h3>
          <p className="tagline">{active.tagline}</p>
          <p>{active.description}</p>
          <div className="chip-row">
            {active.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="project-actions">
            <a href={active.liveUrl} target="_blank" rel="noreferrer">
              Live Demo
            </a>
            <a href={active.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </article>
      )}
    </section>
  )
}
