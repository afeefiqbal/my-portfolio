import { DESTINATIONS, getDestination } from '../../data/map'
import { closePanel, useJourney } from '../../store/journey'
import { About } from '../sections/About'
import { Education } from '../sections/Education'
import { Skills } from '../sections/Skills'
import { Projects } from '../sections/Projects'
import { Experience } from '../sections/Experience'
import { CV } from '../sections/CV'
import { Contact } from '../sections/Contact'
import { Future } from '../sections/Future'
import type { DestinationId } from '../../types'

export function PortfolioPanel() {
  const { activePanel } = useJourney()
  if (!activePanel) return null
  const dest = getDestination(activePanel)

  return (
    <div className="panel-layer">
      <button type="button" className="panel-scrim" aria-label="Close panel" onClick={closePanel} />
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header className="panel-head">
          <p>
            {dest.index}
            <span>{DESTINATIONS.find((d) => d.id === dest.id)?.subtitle}</span>
          </p>
          <h2 id="panel-title">{dest.title}</h2>
          <button type="button" className="panel-close" onClick={closePanel}>
            Close
            <small>ESC</small>
          </button>
        </header>
        <div className="panel-body">{renderSection(activePanel)}</div>
      </aside>
    </div>
  )
}

function renderSection(id: DestinationId) {
  switch (id) {
    case 'about':
      return <About />
    case 'education':
      return <Education />
    case 'skills':
      return <Skills />
    case 'projects':
      return <Projects />
    case 'experience':
      return <Experience />
    case 'cv':
      return <CV />
    case 'contact':
      return <Contact />
    case 'future':
      return <Future />
  }
}
