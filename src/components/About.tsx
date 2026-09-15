import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'

export function About() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="section-head" data-reveal>
        <span className="section-index">01</span>
        <span className="section-label">About</span>
      </div>

      <h2 className="about-statement">
        {profile.aboutStatement.map((line) => (
          <span key={line} className="statement-line" data-reveal data-reveal-group="statement">
            {line}
          </span>
        ))}
      </h2>

      <div className="about-grid">
        <div className="about-copy" data-reveal>
          {profile.aboutBody.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="about-links">
            <Link to="/projects" className="link-arrow" data-cursor="hover">
              Selected work <span aria-hidden="true">→</span>
            </Link>
            <Link to="/experience" className="link-arrow" data-cursor="hover">
              Experience <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        <aside className="about-meta" data-reveal>
          <div className="meta-item">
            <span className="meta-label">Based in</span>
            <span className="meta-value">{profile.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Focus</span>
            <span className="meta-value">{profile.focus}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Currently</span>
            <span className="meta-value">{profile.availability}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
