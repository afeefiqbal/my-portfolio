import { profile, education } from '../../data/portfolio'
import { experience } from '../../data/experience'
import { skills } from '../../data/skills'
import { downloadResume, printResume } from '../../lib/resume'

export function CV() {
  return (
    <section className="section cv-section">
      <div className="cv-actions">
        <button type="button" onClick={downloadResume}>
          Download Resume
        </button>
        <button type="button" className="ghost" onClick={printResume}>
          Print / Save PDF
        </button>
      </div>
      <article className="resume-sheet">
        <header>
          <h3>{profile.name}</h3>
          <p>
            {profile.title} · {profile.email} · {profile.location}
          </p>
        </header>
        <p>{profile.summary}</p>
        <h4>Experience</h4>
        {experience.map((item) => (
          <p key={item.id}>
            <strong>
              {item.role}, {item.company}
            </strong>
            <br />
            {item.period} — {item.summary}
          </p>
        ))}
        <h4>Education</h4>
        {education.map((item) => (
          <p key={item.id}>
            <strong>{item.program}</strong> — {item.school} ({item.period})
          </p>
        ))}
        <h4>Skills</h4>
        <p>{skills.flatMap((group) => group.items.map((item) => item.name)).join(' · ')}</p>
      </article>
    </section>
  )
}
