import type { SkillGroup } from '../types'

export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'React', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'CSS / UI systems', level: 88 },
      { name: 'Three.js / R3F', level: 72 },
      { name: 'Accessibility', level: 80 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'Node.js', level: 86 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'REST & tRPC', level: 84 },
      { name: 'Auth & sessions', level: 78 },
      { name: 'Cloudflare Workers', level: 74 },
    ],
  },
  {
    id: 'craft',
    title: 'Craft & tools',
    items: [
      { name: 'Git & reviews', level: 90 },
      { name: 'Vite / tooling', level: 85 },
      { name: 'Design collaboration', level: 82 },
      { name: 'Testing', level: 76 },
      { name: 'Performance', level: 80 },
    ],
  },
]

export const skillBadges = ['React', 'TS', 'Node', 'SQL', 'CSS', 'R3F']
