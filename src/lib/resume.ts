import { profile, education } from '../data/portfolio'
import { experience } from '../data/experience'
import { featuredProjects } from '../data/projects'
import { skills } from '../data/skills'

export function buildResumeText(): string {
  const skillLine = skills.join(', ')

  const edu = education
    .map((item) => {
      const line = `${item.program} — ${item.school} (${item.period})`
      return item.details ? `${line}\n${item.details}` : line
    })
    .join('\n\n')

  const jobs = experience
    .map((item) => {
      const parts = [`${item.role}, ${item.company}`, `${item.period} · ${item.location}`]
      if (item.summary) parts.push(item.summary)
      if (item.highlights?.length) {
        parts.push(item.highlights.map((h) => `  - ${h}`).join('\n'))
      }
      return parts.join('\n')
    })
    .join('\n\n')

  const work = featuredProjects
    .map(
      (item) =>
        `${item.title} — ${item.category}\n${item.description}\nTech: ${item.technologies.join(', ')}`,
    )
    .join('\n\n')

  return [
    `${profile.name}`,
    profile.title,
    `${profile.location} · ${profile.email} · ${profile.phone}`,
    profile.links.linkedin,
    profile.availability,
    '',
    'SUMMARY',
    profile.heroCopy,
    `Focus: ${profile.positioning}`,
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
