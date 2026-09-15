export type ProjectFilterId = 'web-apps' | 'websites' | 'ai' | 'wordpress' | 'experimental'

export type ProjectStatus = 'live' | 'development' | 'coming-soon'

export type ProjectSchemaType = 'SoftwareApplication' | 'WebSite' | 'CreativeWork'

export type ProjectSeo = {
  title: string
  description: string
  imageAlt: string
  schema: ProjectSchemaType
  applicationCategory?: string
}

export type CaseStudyContent = {
  overview: string
  problem: string
  solution: string
  role: string
  features: string[]
  design: string
  development: string
  challenges: string
  result: string
}

export type Project = {
  id: string
  title: string
  /** Display category, e.g. "Fintech / SaaS" */
  category: string
  /** Which filter bucket the project belongs to */
  filter: ProjectFilterId
  description: string
  year: string
  role: string
  technologies: string[]
  /** Primary screenshot. If the file is missing, a labeled placeholder renders. */
  image: string
  /** Additional screenshots shown on the case-study page. */
  secondaryImages: string[]
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl: string
  /** Only featured, non-coming-soon projects are shown publicly. */
  featured: boolean
  status: ProjectStatus
  /** 'wide' spans the full grid, 'left'/'right' create the editorial offset rhythm */
  layout: 'wide' | 'left' | 'right'
  caseStudy: CaseStudyContent
  seo: ProjectSeo
  imageWidth?: number
  imageHeight?: number
}

export type Experience = {
  id: string
  company: string
  role: string
  period: string
  location: string
  summary?: string
  highlights?: string[]
  tech?: string[]
}

export type Education = {
  id: string
  school: string
  program: string
  period: string
  details?: string
}

export type ContactDetail = {
  label: string
  value: string
  href?: string
}

export type CapabilityGroup = {
  id: string
  label: string
  items: string[]
}

export type Stat = {
  id: string
  value: string
  label: string
}

export type NavItem = {
  id: string
  label: string
}
