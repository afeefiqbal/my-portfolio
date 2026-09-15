import type { CapabilityGroup, ContactDetail, Education, NavItem } from '../types'

/**
 * Central portfolio content.
 * Projects live in ./projects.ts. Stats live in ./site.ts.
 */

export const profile = {
  name: 'Afeef Iqbal',
  title: 'Full Stack Developer',
  positioning: 'AI-powered web & software development',
  location: 'Kochi, Kerala, India',
  email: 'afeefbinqbal@gmail.com',
  phone: '+91 73560 66287',
  phoneHref: 'tel:+917356066287',
  availability: 'Available for work',
  openTo: ['Full-time', 'Freelance', 'Remote'],
  eyebrow: 'Turning ideas into reality',
  heroLines: ['Full Stack', 'Developer'],
  heroCopy:
    'I design, build and deploy modern digital products — from full-stack web applications and business platforms to AI-powered tools and automation. Available for freelance web development projects and full-time roles.',
  heroCaps: ['Full stack', 'AI development', 'Web applications', 'API & automation'],
  aboutStatement: ['Engineering digital', 'experiences with', 'purpose.'],
  aboutBody: [
    'I am a full stack developer based in Kochi, Kerala. I work across the stack: frontend interfaces, backend services, APIs, and databases — then I ship them. WordPress and CMS work when the product needs an editorial system; custom applications when it needs its own architecture.',
    'I also build AI-powered features into real products: API integrations, automated workflows, and tools that sit on top of working web applications rather than existing as demos.',
    'The through-line is the same. Understand the problem, design the system, implement it carefully, and deploy something people can use. That includes freelance web application development, custom WordPress and CMS work, and AI-powered application development and integration.',
  ],
  focus: 'Full stack · AI-powered web',
  links: {
    linkedin: 'https://www.linkedin.com/in/afeef-iqbal',
    website: 'https://linktr.ee/iafeef',
  },
  /**
   * Portrait image. Drop your photo at public/portrait.jpg (roughly 3:4 crop).
   * If the file is missing, a minimal editorial placeholder renders instead.
   */
  portrait: '/portrait.jpg',
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
]

export const selectedWork = {
  heading: ['Selected', 'Work'],
  intro: 'Real products I have designed, built and deployed — with more in development.',
}

export const whatIBuild: string[] = [
  'Custom Web Applications',
  'SaaS Platforms',
  'AI-Powered Applications',
  'Business Websites',
  'E-commerce',
  'WordPress / CMS',
  'REST APIs',
  'Automation Systems',
  'Dashboards',
  'Interactive Web Experiences',
]

export const capabilityGroups: CapabilityGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'Vue', 'HTML', 'CSS'],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: ['Node.js', 'PHP', 'Laravel', 'REST APIs'],
  },
  {
    id: 'ai',
    label: 'AI',
    items: [
      'AI Application Development',
      'AI API Integration',
      'AI Agents',
      'Automation',
    ],
  },
  {
    id: 'cms',
    label: 'CMS',
    items: ['WordPress', 'CMS Development'],
  },
  {
    id: 'database',
    label: 'Database',
    items: ['MySQL', 'SQL', 'Database Architecture'],
  },
  {
    id: 'creative',
    label: 'Creative',
    items: ['Three.js', 'WebGL'],
  },
]

export const education: Education[] = [
  {
    id: 'jdt',
    school: 'JDT Islam Polytechnic College',
    program: 'Diploma in Computer Software Engineering',
    period: '2014 — 2017',
  },
]

export const hiring = {
  heading: 'Looking for a developer?',
  copy: 'Available for freelance web development projects, as well as full-time, remote, and contract roles.',
  available: ['Full-time', 'Freelance', 'Remote', 'Contract'],
}

export const contact = {
  heading: ["Let's build", 'something', 'great.'],
  prompt: 'Have a project in mind?',
  copy: 'I build websites, web applications, AI-powered products and custom digital platforms. Available for full-stack web application development, AI-powered application development and integration, and custom WordPress and CMS development.',
  cta: 'Start a project',
}

export const contactDetails: ContactDetail[] = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: 'linkedin.com/in/afeef-iqbal', href: profile.links.linkedin },
  { label: 'Phone', value: profile.phone, href: profile.phoneHref },
  { label: 'Location', value: profile.location },
]
