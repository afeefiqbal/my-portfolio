import { Link, useNavigate } from 'react-router-dom'
import { hiring, profile } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { downloadResume } from '../lib/resume'

export function Hiring() {
  const ref = useReveal<HTMLElement>()
  const navigate = useNavigate()

  const goToExperience = (event: React.MouseEvent) => {
    event.preventDefault()
    if (window.location.pathname === '/experience') {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById('experience')?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
      return
    }
    navigate('/experience')
  }

  return (
    <section id="hiring" className="hiring section" ref={ref} aria-label="Looking for a developer">
      <h2 className="hiring-kicker" data-reveal>
        {hiring.heading}
      </h2>
      <div className="hiring-row" data-reveal>
        <p className="hiring-copy">{hiring.copy}</p>
        <ul className="hiring-tags" aria-label="Availability">
          {hiring.available.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="hiring-actions" data-reveal>
        <Link to="/experience" className="link-arrow" onClick={goToExperience} data-cursor="hover">
          View experience <span aria-hidden="true">→</span>
        </Link>
        <button type="button" className="link-quiet" onClick={downloadResume} data-cursor="hover">
          Download CV
        </button>
        <a href={`mailto:${profile.email}`} className="link-quiet" data-cursor="hover">
          {profile.email}
        </a>
      </div>
    </section>
  )
}
