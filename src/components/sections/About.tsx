import { profile } from '../../data/portfolio'

export function About() {
  return (
    <section className="section about-section">
      <p className="lead">{profile.headline}</p>
      {profile.aboutBody.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
      <ul className="fact-grid">
        {profile.facts.map((fact) => (
          <li key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </li>
        ))}
      </ul>
      <div className="chip-row">
        {profile.focus.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  )
}
