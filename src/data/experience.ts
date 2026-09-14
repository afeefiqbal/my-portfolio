import type { Experience } from '../types'

export const experience: Experience[] = [
  {
    id: 'pixbit',
    company: 'Studio North',
    role: 'Full Stack Developer',
    period: '2023 — Present',
    location: 'Remote',
    summary:
      'Shaping product surfaces end to end: interface architecture, API contracts, and the details that make a release feel finished.',
    highlights: [
      'Led the rebuild of a customer workspace used daily by operations teams.',
      'Cut p95 page load on the main dashboard by restructuring data fetching and route-level code splitting.',
      'Partnered with design on a component system that stayed consistent across four product surfaces.',
    ],
    tech: ['React', 'TypeScript', 'Node', 'PostgreSQL', 'Cloudflare'],
  },
  {
    id: 'lumen',
    company: 'Brightline Labs',
    role: 'Frontend Engineer',
    period: '2022 — 2023',
    location: 'Hybrid',
    summary:
      'Built dense but readable interfaces for internal tools, with a focus on keyboard flows and trustworthy empty states.',
    highlights: [
      'Designed a table and filter pattern later reused across three tools.',
      'Introduced visual regression checks for the shared UI kit.',
      'Worked closely with backend engineers on typed client contracts.',
    ],
    tech: ['React', 'Vite', 'GraphQL', 'Storybook'],
  },
  {
    id: 'early',
    company: 'Independent',
    role: 'Web Developer',
    period: '2020 — 2022',
    location: 'Kerala',
    summary:
      'Shipped sites and small products for local teams, learning how to take a brief from conversation to production.',
    highlights: [
      'Delivered brochure and product sites with accessible, responsive layouts.',
      'Set up simple CMS and form workflows clients could maintain.',
      'Learned to estimate, communicate, and leave code someone else could inherit.',
    ],
    tech: ['JavaScript', 'React', 'Node', 'CSS'],
  },
]
