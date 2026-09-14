import { future } from '../../data/portfolio'

export function Future() {
  return (
    <section className="section">
      <p className="lead">{future.intro}</p>
      <ul className="future-grid">
        {future.goals.map((goal) => (
          <li key={goal.title}>
            <h3>{goal.title}</h3>
            <p>{goal.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
