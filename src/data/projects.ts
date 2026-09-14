import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'atlas-notes',
    name: 'Atlas Notes',
    tagline: 'A spatial notebook for product teams',
    description:
      'A collaborative writing surface that treats documents as places. Teams pin research, decisions, and sketches onto a shared map instead of a buried folder tree.',
    image: '/projects/atlas.svg',
    tech: ['React', 'TypeScript', 'Node', 'PostgreSQL', 'WebSocket'],
    liveUrl: 'https://github.com/afeefiqbal',
    githubUrl: 'https://github.com/afeefiqbal',
    year: '2025',
    role: 'Full stack',
    accent: '#2b6cff',
  },
  {
    id: 'lumen-desk',
    name: 'Lumen Desk',
    tagline: 'Support operations without the noise',
    description:
      'A calm ticket workspace for small product teams. Queues, SLAs, and customer context sit on one screen, with keyboard-first triage and honest empty states.',
    image: '/projects/lumen.svg',
    tech: ['React', 'Vite', 'Express', 'Prisma', 'Redis'],
    liveUrl: 'https://github.com/afeefiqbal',
    githubUrl: 'https://github.com/afeefiqbal',
    year: '2024',
    role: 'Lead engineer',
    accent: '#1aa37a',
  },
  {
    id: 'harbor',
    name: 'Harbor',
    tagline: 'Release checklists that people actually follow',
    description:
      'A lightweight launch ritual for web teams. Harbor turns deploys into a shared, auditable path: owners, gates, rollbacks, and a record of what changed.',
    image: '/projects/harbor.svg',
    tech: ['Next.js', 'TypeScript', 'tRPC', 'Tailwind'],
    liveUrl: 'https://github.com/afeefiqbal',
    githubUrl: 'https://github.com/afeefiqbal',
    year: '2024',
    role: 'Full stack',
    accent: '#d9892b',
  },
  {
    id: 'fieldguide',
    name: 'Fieldguide',
    tagline: 'Internal docs with a sense of place',
    description:
      'A documentation system for growing codebases. Pages are grouped as districts, search feels local, and stale guides surface before they mislead someone.',
    image: '/projects/fieldguide.svg',
    tech: ['React', 'MDX', 'Cloudflare Workers', 'D1'],
    liveUrl: 'https://github.com/afeefiqbal',
    githubUrl: 'https://github.com/afeefiqbal',
    year: '2023',
    role: 'Frontend + platform',
    accent: '#5b6ee1',
  },
]
