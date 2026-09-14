import { profile } from '../../data/portfolio'
import { startJourney, useJourney } from '../../store/journey'

export function Hero() {
  const { started } = useJourney()
  if (started) return null

  return (
    <section className="hero-panel" aria-label="Introduction">
      <p className="hero-kicker">
        {profile.name}
        <span>{profile.title}</span>
      </p>
      <h1>
        My
        <em> Journey</em>
      </h1>
      <p className="hero-copy">Follow the road. Explore the work. Discover the journey.</p>
      <button type="button" className="hero-cta" onClick={startJourney}>
        Start Journey
        <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
