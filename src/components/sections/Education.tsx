import { education } from '../../data/portfolio'

export function Education() {
  return (
    <section className="section">
      <ol className="timeline">
        {education.map((item) => (
          <li key={item.id}>
            <p className="muted">{item.period}</p>
            <h3>{item.program}</h3>
            <p className="place">{item.school}</p>
            <p>{item.details}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
