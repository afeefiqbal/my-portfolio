import type { Stat } from '../types'
import { featuredProjects } from './projects'
import { skills } from './skills'

/**
 * BY THE NUMBERS — only confirmed figures.
 * Use '—' for anything not yet confirmed. Never invent clients,
 * revenue, users, or deployments.
 */
export const stats: Stat[] = [
  { id: 'years', value: '07+', label: 'Years experience' },
  {
    id: 'projects',
    value: String(featuredProjects.length).padStart(2, '0'),
    label: 'Selected projects',
  },
  { id: 'technologies', value: String(skills.length), label: 'Technologies' },
  { id: 'deployments', value: '—', label: 'Deployments' },
]
