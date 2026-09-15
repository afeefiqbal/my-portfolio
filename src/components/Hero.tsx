import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { profile } from '../data/portfolio'
import { prefersReducedMotion } from '../hooks/useReveal'
import { downloadResume } from '../lib/resume'

const HeroCanvas = lazy(() =>
  import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
)

function Portrait() {
  const [missing, setMissing] = useState(false)

  return (
    <figure className="hero-portrait" data-cursor="hover">
      {missing ? (
        <div className="portrait-placeholder">
          <span className="portrait-initials">AI</span>
          <span className="portrait-note">Portrait</span>
        </div>
      ) : (
        <img
          src={profile.portrait}
          alt={`Portrait of ${profile.name}, full stack developer in Kochi, Kerala`}
          width={900}
          height={1200}
          onError={() => setMissing(true)}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      )}
      <span className="portrait-grain" aria-hidden="true" />
      <figcaption className="portrait-caption">
        {profile.name} — {profile.location}
      </figcaption>
    </figure>
  )
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  // Page-load typography reveal.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-eyebrow', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.15)
        .fromTo(
          '.hero-line-inner',
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2, stagger: 0.12 },
          0.25,
        )
        .fromTo('.hero-copy', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.85)
        .fromTo('.hero-caps', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.95)
        .fromTo('.hero-actions', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 1)
        .fromTo(
          '.hero-meta',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1 },
          1.15,
        )
        .fromTo(
          '.hero-portrait',
          { clipPath: 'inset(100% 0 0 0)', autoAlpha: 0 },
          { clipPath: 'inset(0% 0 0 0)', autoAlpha: 1, duration: 1.4, ease: 'power4.out' },
          0.55,
        )
        .fromTo('.hero-scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.4)
    }, root)

    return () => ctx.revert()
  }, [])

  // Subtle portrait parallax that follows the cursor (fine pointers only).
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const portrait = root.querySelector<HTMLElement>('.hero-portrait')
    if (!portrait) return

    const xTo = gsap.quickTo(portrait, 'x', { duration: 0.9, ease: 'power3.out' })
    const yTo = gsap.quickTo(portrait, 'y', { duration: 0.9, ease: 'power3.out' })

    const onMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      xTo(nx * -8)
      yTo(ny * -6)
    }
    root.addEventListener('mousemove', onMove, { passive: true })
    return () => root.removeEventListener('mousemove', onMove)
  }, [])

  const goToProjects = (event: React.MouseEvent) => {
    event.preventDefault()
    if (window.location.pathname === '/projects') {
      const reduced = prefersReducedMotion()
      document.getElementById('work')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      return
    }
    navigate('/projects')
  }

  return (
    <section id="home" className="hero" ref={rootRef}>
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>

      <div className="hero-layout">
        <div className="hero-text">
          <p className="hero-eyebrow">{profile.eyebrow}</p>

          <p className="hero-name">
            <span className="hero-line">
              <span className="hero-line-inner">{profile.name}</span>
            </span>
          </p>
          <h1 className="hero-title">
            {profile.heroLines.map((line, i) => (
              <span key={line} className="hero-line">
                <span className={`hero-line-inner ${i === profile.heroLines.length - 1 ? 'is-outline' : ''}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-copy">{profile.heroCopy}</p>

          <ul className="hero-caps" aria-label="Focus">
            {profile.heroCaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="hero-actions">
            <a href="/projects" className="btn-primary" onClick={goToProjects} data-cursor="hover">
              View selected work <span aria-hidden="true">→</span>
            </a>
            <button type="button" className="link-quiet" onClick={downloadResume} data-cursor="hover">
              Download CV <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="hero-meta">
            <div className="meta-item">
              <span className="meta-label">Based in</span>
              <span className="meta-value">{profile.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Open to</span>
              <span className="meta-value">{profile.openTo.join(' / ')}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className="meta-value hero-status">
                <span className="status-dot" aria-hidden="true" />
                {profile.availability}
              </span>
            </div>
          </div>
        </div>

        <Portrait />
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
