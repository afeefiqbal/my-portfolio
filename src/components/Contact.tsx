import { Link } from 'react-router-dom'
import { contact, contactDetails, profile } from '../data/portfolio'
import { SiteFooter } from './SiteFooter'
import { useReveal } from '../hooks/useReveal'
import { downloadResume } from '../lib/resume'

export function Contact() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="contact" className="contact section" ref={ref}>
      <div className="section-head" data-reveal>
        <span className="section-index">07</span>
        <span className="section-label">Contact</span>
      </div>

      <h2 className="contact-heading">
        {contact.heading.map((line, i) => (
          <span
            key={line}
            className={`statement-line ${i === contact.heading.length - 1 ? 'is-accent' : ''}`}
            data-reveal
            data-reveal-group="contact"
          >
            {line}
          </span>
        ))}
      </h2>

      <div className="contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="contact-prompt">{contact.prompt}</p>
          <p>{contact.copy}</p>
        </div>

        <div className="contact-actions" data-reveal>
          <a href={`mailto:${profile.email}`} className="btn-primary" data-cursor="hover">
            {contact.cta} <span aria-hidden="true">→</span>
          </a>
          <Link to="/projects" className="link-quiet" data-cursor="hover">
            Selected work
          </Link>
          <button type="button" className="link-quiet" onClick={downloadResume} data-cursor="hover">
            Download CV
          </button>
        </div>

        <ul className="contact-details" data-reveal>
          {contactDetails.map((item) => (
            <li key={item.label}>
              <span className="meta-label">{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  data-cursor="hover"
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </section>
  )
}
