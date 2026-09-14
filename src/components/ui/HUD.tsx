import { profile } from '../../data/portfolio'
import { useSystemHealth } from '../../hooks/useJourneyLifecycle'
import { useJourney } from '../../store/journey'
import { InteractionPrompt } from './InteractionPrompt'
import { Minimap } from './Minimap'
import { Navigation } from './Navigation'

export function HUD() {
  const ui = useJourney()
  const health = useSystemHealth()

  return (
    <div className={`hud${ui.started ? ' is-started' : ''}`}>
      <div className="hud-top">
        <div className="hud-brand">
          <strong>{profile.name}</strong>
          <span>{profile.title}</span>
        </div>
        <Navigation />
        <div className="hud-status">
          <p>
            <i className="online-dot" /> Online
          </p>
          <small>System {health}%</small>
          {ui.started ? <Minimap /> : null}
        </div>
      </div>
      <InteractionPrompt />
      <ControlsHint />
    </div>
  )
}

function ControlsHint() {
  const { isTouch, started } = useJourney()
  if (!started || isTouch) return null
  return (
    <aside className="controls-hint" aria-hidden="true">
      <p>
        <b>WASD</b>
        <span>Move</span>
      </p>
      <p>
        <b>Mouse</b>
        <span>Look</span>
      </p>
      <p>
        <b>E</b>
        <span>Interact</span>
      </p>
    </aside>
  )
}
