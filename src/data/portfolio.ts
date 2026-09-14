import type { Education } from '../types'

export const profile = {
  name: 'Afeef Iqbal',
  title: 'Full Stack Developer',
  location: 'Kerala, India',
  email: 'hello@afeefiqbal.dev',
  phone: '+91 90000 00000',
  availability: 'Open to remote and hybrid roles',
  headline: 'I design and build calm, precise product experiences for the web.',
  summary:
    'I am a full stack developer who cares about the space between a sketch and a shipped product. I like systems that stay readable, interfaces that feel inevitable, and tools that disappear once they work. This map is a tour of how I got here and where the road is heading next.',
  focus: ['Product engineering', 'Interface systems', 'API design', 'Performance'],
  links: {
    github: 'https://github.com/afeefiqbal',
    linkedin: 'https://www.linkedin.com/in/afeefiqbal',
    website: 'https://afeefiqbal.dev',
  },
  facts: [
    { label: 'Based in', value: 'Kerala, India' },
    { label: 'Building', value: 'Web products end to end' },
    { label: 'Currently', value: 'Open to thoughtful teams' },
    { label: 'Likes', value: 'Quiet UI, honest architecture' },
  ],
  aboutBody: [
    'I work across the stack, but I start from the user. If a flow is confusing, no amount of clever code will save it. If a system is unclear, the interface will eventually lie.',
    'Most of my days sit between React interfaces, typed APIs, and the small details that make software feel considered: motion, empty states, copy, and the way a page recovers from failure.',
    'Outside of shipping, I sketch product ideas, study spatial interfaces, and look for calmer ways to present complex work. This portfolio is one of those experiments.',
  ],
}

export const education: Education[] = [
  {
    id: 'btech',
    school: 'University Institute of Engineering',
    program: 'B.Tech in Computer Science',
    period: '2018 — 2022',
    details:
      'Focused on software engineering, databases, and human-computer interaction. Final-year project explored realtime collaboration on the web.',
  },
  {
    id: 'minor',
    school: 'Independent study',
    program: 'Product design and systems thinking',
    period: '2022 — present',
    details:
      'Ongoing practice in interface architecture, design systems, and the craft of shipping maintainable full stack software.',
  },
]

export const future = {
  title: "What's next?",
  intro:
    'The path does not end at contact. These are the directions I am actively walking toward.',
  goals: [
    {
      title: 'Deeper product ownership',
      copy: 'Work where engineering, design, and narrative sit in the same room from the first sketch.',
    },
    {
      title: 'Spatial and map-like interfaces',
      copy: 'Keep exploring how people find their way through complex information without feeling lost.',
    },
    {
      title: 'Craft at scale',
      copy: 'Build systems that stay elegant after the fifth team and the fiftieth feature.',
    },
    {
      title: 'Teaching in public',
      copy: 'Write and speak more about the quiet decisions that make software feel finished.',
    },
  ],
}
