import { DESTINATIONS } from '../data/map'
import { profile, education } from '../data/portfolio'
import { experience } from '../data/experience'
import { projects } from '../data/projects'
import { skills } from '../data/skills'

export function buildResumeText(): string {
  const skillLine = skills
    .flatMap((group) => group.items.map((item) => item.name))
    .join(', ')

  const edu = education
    .map((item) => `${item.program} — ${item.school} (${item.period})\n${item.details}`)
    .join('\n\n')

  const jobs = experience
    .map((item) => {
      const highlights = item.highlights.map((h) => `  - ${h}`).join('\n')
      return `${item.role}, ${item.company}\n${item.period} · ${item.location}\n${item.summary}\n${highlights}`
    })
    .join('\n\n')

  const work = projects
    .map((item) => `${item.name} — ${item.tagline}\n${item.description}\nTech: ${item.tech.join(', ')}`)
    .join('\n\n')

  return [
    `${profile.name}`,
    profile.title,
    `${profile.location} · ${profile.email}`,
    profile.availability,
    '',
    'SUMMARY',
    profile.summary,
    '',
    'SKILLS',
    skillLine,
    '',
    'EXPERIENCE',
    jobs,
    '',
    'PROJECTS',
    work,
    '',
    'EDUCATION',
    edu,
  ].join('\n')
}

export function downloadResume(): void {
  const blob = new Blob([buildResumeText()], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Afeef_Iqbal_Resume.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function printResume(): void {
  const html = `<!doctype html><html><head><title>${profile.name} — Resume</title>
  <style>
    body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; color: #16324f; line-height: 1.5; }
    h1 { margin-bottom: 0; } .muted { color: #5b7390; }
    h2 { font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 28px; }
    pre { white-space: pre-wrap; font-family: inherit; }
  </style></head><body>
  <h1>${profile.name}</h1>
  <p class="muted">${profile.title} · ${profile.email}</p>
  <pre>${escapeHtml(buildResumeText())}</pre>
  </body></html>`
  const popup = window.open('', '_blank', 'noopener,noreferrer')
  if (!popup) return
  popup.document.write(html)
  popup.document.close()
  popup.focus()
  popup.print()
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function destinationLabel(id: string): string {
  return DESTINATIONS.find((item) => item.id === id)?.title ?? id
}
