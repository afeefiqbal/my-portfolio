import { useState } from 'react'
import { Link } from 'react-router-dom'
import { featuredProjects, projectIndex } from '../data/projects'
import { selectedWork } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { ProjectMedia } from './ProjectMedia'
import type { Project, ProjectFilterId } from '../types'

type FilterOption = { id: ProjectFilterId | 'all'; label: string }

const FILTERS: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'web-apps', label: 'Web Apps' },
  { id: 'websites', label: 'Websites' },
  { id: 'ai', label: 'AI' },
  { id: 'wordpress', label: 'WordPress' },
  { id: 'experimental', label: 'Experimental' },
]

function ProjectCase({ project }: { project: Project }) {
  return (
    <article className={`project project--${project.layout}`} data-reveal>
      <Link
        className="project-media"
        to={project.caseStudyUrl}
        data-cursor="view"
        aria-label={`View ${project.title} case study`}
      >
        <ProjectMedia
          src={project.image}
          alt={project.seo.imageAlt}
          width={project.imageWidth}
          height={project.imageHeight}
        />
      </Link>

      <div className="project-info">
        <div className="project-head">
          <span className="project-index">{projectIndex(project)}</span>
          <h3 className="project-name">{project.title}</h3>
          <p className="project-category">
            {project.category} · {project.year} · {project.role}
            {project.status === 'development' ? ' · In development' : ''}
          </p>
        </div>
        <div className="project-body">
          <p className="project-description">{project.description}</p>
          <ul className="project-tech" aria-label="Technologies">
            {project.technologies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="project-links">
            <Link to={project.caseStudyUrl} className="link-arrow" data-cursor="hover">
              View {project.title} case study <span aria-hidden="true">→</span>
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-arrow"
                data-cursor="hover"
              >
                Live site <span aria-hidden="true">→</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet"
                data-cursor="hover"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const ref = useReveal<HTMLElement>()
  const [filter, setFilter] = useState<FilterOption['id']>('all')

  // Only offer filters that actually contain published work.
  const available = FILTERS.filter(
    (option) => option.id === 'all' || featuredProjects.some((p) => p.filter === option.id),
  )

  const visible =
    filter === 'all'
      ? featuredProjects
      : featuredProjects.filter((project) => project.filter === filter)

  return (
    <section id="work" className="projects section" ref={ref}>
      <div className="section-head" data-reveal>
        <span className="section-index">03</span>
        <span className="section-label">Selected work</span>
      </div>

      <h2 className="section-title" data-reveal>
        {selectedWork.heading[0]}
        <br />
        <span className="title-outline">{selectedWork.heading[1]}</span>
      </h2>

      <p className="work-intro" data-reveal>
        {selectedWork.intro}
      </p>

      <div className="work-filters" data-reveal role="group" aria-label="Filter projects">
        {available.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`work-filter ${filter === option.id ? 'is-active' : ''}`}
            onClick={() => setFilter(option.id)}
            data-cursor="hover"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="projects-list">
        {visible.map((project) => (
          <ProjectCase key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
