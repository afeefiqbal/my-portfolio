import { skills } from '../../data/skills'

export function Skills() {
  return (
    <section className="section skills-section">
      {skills.map((group) => (
        <div key={group.id} className="skill-group">
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item.name}>
                <div>
                  <span>{item.name}</span>
                  <small>{item.level}%</small>
                </div>
                <div className="meter" aria-hidden="true">
                  <i style={{ width: `${item.level}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
