import { useEffect, useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectMedia } from '../components/ProjectMedia'
import { Seo } from '../components/Seo'
import { SiteFooter } from '../components/SiteFooter'
import { featuredProjects, isFilled, projectIndex, projects } from '../data/projects'
import { profile } from '../data/portfolio'
import { getPageSeo } from '../data/seo'
import { useReveal } from '../hooks/useReveal'

function CaseSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="case-section" data-reveal>
      <h2 className="case-label">{label}</h2>
      <div className="case-body">{children}</div>
    </section>
  )
}

export function CaseStudy() {
  const { id } = useParams()
  const project = projects.find((item) => item.id === id)
  const ref = useReveal<HTMLElement>()
  const published = project ? featuredProjects.includes(project) : false

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const seo = useMemo(
    () => (project && published ? getPageSeo(project.caseStudyUrl) : getPageSeo('/')),
    [project, published],
  )

  if (!project || !published) return <Navigate to="/" replace />

  const index = projectIndex(project)
  const gallery = [project.image, ...project.secondaryImages]
  const features = project.caseStudy.features.filter(isFilled)
  const study = project.caseStudy
  const related = featuredProjects.filter((item) => item.id !== project.id)

  return (
    <>
      <Seo {...seo} />
      <main id="main" className="case" ref={ref}>
        <div className="case-top" data-reveal>
          <nav className="case-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/" data-cursor="hover">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" data-cursor="hover">
                  Projects
                </Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>
          <span className="case-index-label">
            Project <span className="case-index">{index}</span>
          </span>
        </div>

        <header className="case-head">
          <h1 className="case-title" data-reveal>
            {project.title}
          </h1>
          <p className="case-meta" data-reveal>
            {project.category} · {project.year} · {project.role}
          </p>
        </header>

        <figure className="case-hero" data-reveal>
          <ProjectMedia
            src={project.image}
            alt={project.seo.imageAlt}
            width={project.imageWidth}
            height={project.imageHeight}
            priority
          />
        </figure>

        <div className="case-content">
          {isFilled(study.overview) && (
            <CaseSection label="Overview">
              <p>{study.overview}</p>
            </CaseSection>
          )}

          {isFilled(study.problem) && (
            <CaseSection label="The problem">
              <p>{study.problem}</p>
            </CaseSection>
          )}

          {isFilled(study.solution) && (
            <CaseSection label="The solution">
              <p>{study.solution}</p>
            </CaseSection>
          )}

          {isFilled(study.role) && (
            <CaseSection label="My role">
              <p>{study.role}</p>
            </CaseSection>
          )}

          {project.technologies.length > 0 && (
            <CaseSection label="Technology">
              <ul className="project-tech case-tech">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </CaseSection>
          )}

          {features.length > 0 && (
            <CaseSection label="Key features">
              <ul className="case-features">
                {features.map((feature) => (
                  <li key={feature.slice(0, 32)}>{feature}</li>
                ))}
              </ul>
            </CaseSection>
          )}

          {isFilled(study.design) && (
            <CaseSection label="Design">
              <p>{study.design}</p>
            </CaseSection>
          )}

          {isFilled(study.development) && (
            <CaseSection label="Implementation">
              <p>{study.development}</p>
            </CaseSection>
          )}

          <CaseSection label="Screenshots">
            <div className="case-gallery">
              {gallery.map((image, i) => (
                <figure className="case-gallery-item" key={image}>
                  <ProjectMedia
                    src={image}
                    alt={
                      i === 0
                        ? project.seo.imageAlt
                        : `${project.title} interface detail ${i + 1}`
                    }
                    width={project.imageWidth}
                    height={project.imageHeight}
                  />
                </figure>
              ))}
            </div>
          </CaseSection>

          {isFilled(study.challenges) && (
            <CaseSection label="Challenges">
              <p>{study.challenges}</p>
            </CaseSection>
          )}

          {isFilled(study.result) && (
            <CaseSection label="Result">
              <p>{study.result}</p>
            </CaseSection>
          )}

          <div className="case-links" data-reveal>
            <Link to="/projects" className="link-quiet" data-cursor="hover">
              ← All projects
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                data-cursor="hover"
              >
                Live project <span aria-hidden="true">→</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-arrow"
                data-cursor="hover"
              >
                GitHub <span aria-hidden="true">→</span>
              </a>
            )}
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent(`About ${project.title}`)}`} className="link-quiet" data-cursor="hover">
              Ask me about this project
            </a>
          </div>

          {related.length > 0 && (
            <section className="case-section case-related" data-reveal>
              <h2 className="case-label">Related work</h2>
              <div className="case-body">
                <ul className="case-related-list">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link to={item.caseStudyUrl} className="link-arrow" data-cursor="hover">
                        View {item.title} case study <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
