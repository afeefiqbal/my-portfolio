import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navItems, profile } from '../data/portfolio'
import { downloadResume } from '../lib/resume'
import { toggleTheme, useTheme } from '../lib/theme'

const HOME_PATHS = new Set(['/', '/about', '/projects', '/experience', '/contact'])

function hrefFor(id: string) {
  if (id === 'home') return '/'
  if (id === 'work') return '/projects'
  if (id === 'capabilities') return '/#capabilities'
  return `/${id}`
}

function ThemeToggle() {
  const theme = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      data-cursor="hover"
    >
      {theme === 'dark' ? (
        /* Sun — offers the light theme */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" />
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
        </svg>
      ) : (
        /* Moon — offers the dark theme */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.4 14.2A8.4 8.4 0 0 1 9.8 3.6a8.4 8.4 0 1 0 10.6 10.6Z" />
        </svg>
      )}
    </button>
  )
}

export function Nav() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const onPortfolio = HOME_PATHS.has(location.pathname)
  const onCaseStudy = /^\/projects\/.+/.test(location.pathname)
  const activeSection = onCaseStudy ? 'work' : onPortfolio ? active : ''

  useEffect(() => {
    if (!onPortfolio) return

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onPortfolio])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  const goTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    setMenuOpen(false)
    const path = hrefFor(id)
    const target = document.getElementById(id)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (target && (onPortfolio || id === 'capabilities')) {
      if (path.startsWith('/') && !path.startsWith('/#') && location.pathname !== path) {
        navigate(path)
        return
      }
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      return
    }

    if (path.startsWith('/#')) {
      navigate('/', { state: { scrollTo: id } })
      return
    }

    navigate(path)
  }

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} id="portfolio-nav">
      <a className="nav-name" href="/" onClick={goTo('home')} data-cursor="hover">
        {profile.name}
      </a>

      <nav className="nav-links" aria-label="Primary">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={hrefFor(item.id)}
            onClick={goTo(item.id)}
            className={activeSection === item.id ? 'is-active' : ''}
            aria-current={activeSection === item.id ? 'page' : undefined}
            data-cursor="hover"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-right">
        <div className="nav-status" aria-label="Availability">
          <span className="status-dot" aria-hidden="true" />
          <span>{profile.availability}</span>
        </div>

        <ThemeToggle />

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav-overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={hrefFor(item.id)}
              onClick={goTo(item.id)}
              className={activeSection === item.id ? 'is-active' : ''}
              aria-current={activeSection === item.id ? 'page' : undefined}
              style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : '0ms' }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="overlay-index">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-overlay-foot">
          <span className="status-dot" aria-hidden="true" />
          {profile.availability}
          <button
            type="button"
            className="link-quiet"
            onClick={() => {
              setMenuOpen(false)
              downloadResume()
            }}
          >
            Download CV
          </button>
        </div>
      </div>
    </header>
  )
}
