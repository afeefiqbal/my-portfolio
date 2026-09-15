import type { CaseStudyContent, Project } from '../types'

/**
 * ==========================================================================
 * PROJECTS — the single source of truth for all project content.
 *
 * HOW TO PUBLISH A PROJECT
 *   1. Add screenshots:
 *        public/projects/<id>-01.webp   (primary, ~16:10)
 *        public/projects/<id>-02.webp   (case-study gallery)
 *   2. Replace empty / [EDIT] case-study fields with real content.
 *   3. Set status to 'live' or 'development' and featured: true.
 *
 * Coming-soon entries stay in this file for the 10-project library
 * but are not shown on the site. Do not invent screenshots or results.
 * ==========================================================================
 */

const unpublishedCase: CaseStudyContent = {
  overview: '',
  problem: '',
  solution: '',
  role: '',
  features: [],
  design: '',
  development: '',
  challenges: '',
  result: '',
}

function upcoming(
  project: Pick<Project, 'id' | 'title' | 'category' | 'filter' | 'description' | 'image' | 'layout'>,
): Project {
  return {
    year: '—',
    role: '—',
    technologies: [],
    secondaryImages: [],
    featured: false,
    status: 'coming-soon',
    caseStudyUrl: `/projects/${project.id}`,
    caseStudy: unpublishedCase,
    seo: {
      title: `Afeef Iqbal | ${project.title}`,
      description: project.description,
      imageAlt: `${project.title} product preview`,
      schema: 'CreativeWork',
    },
    ...project,
  }
}

export const projects: Project[] = [
  {
    id: 'billfree',
    title: 'BillFree',
    category: 'Fintech / SaaS',
    filter: 'web-apps',
    description:
      'A modern bill payment and management platform designed around a simple, intuitive user experience.',
    year: '2025',
    role: 'Full stack developer',
    technologies: ['React', 'TypeScript', 'Node.js', 'REST API', 'PostgreSQL'],
    image: '/projects/billfree-01.webp',
    secondaryImages: ['/projects/billfree-02.webp', '/projects/billfree-03.webp'],
    liveUrl: undefined,
    githubUrl: undefined,
    caseStudyUrl: '/projects/billfree',
    featured: true,
    status: 'development',
    layout: 'wide',
    seo: {
      title: 'Afeef Iqbal | BillFree — Fintech Web Application',
      description:
        'BillFree is a fintech web application by Afeef Iqbal for tracking, paying, and managing household and business bills in one place.',
      imageAlt:
        'BillFree fintech dashboard showing billing and payment management interface',
      schema: 'SoftwareApplication',
      applicationCategory: 'FinanceApplication',
    },
    caseStudy: {
      overview:
        'BillFree is a bill payment and management platform focused on making recurring payments effortless — one place to track, pay, and understand household and business bills.',
      problem:
        'Households and small businesses often track bills across bank apps, email, and spreadsheets. Due dates are easy to miss, and it is hard to see what has already been paid versus what is still outstanding.',
      solution:
        'BillFree is a web application that brings recurring bills into a single workflow: record them, follow their status, and manage payment from one interface instead of a scatter of tools.',
      role: 'Full stack development — from the data model and API design to the interface implementation.',
      features: [
        'A shared place to track household and business bills',
        'Recurring payment management rather than one-off reminders',
        'A simple interface designed around what is due and what is paid',
      ],
      design:
        'The product is being designed around a straightforward billing workflow — less chrome, clearer status — so the interface stays readable when the list of bills grows.',
      development:
        'The application is being built as a full-stack web product: a React and TypeScript interface talking to a Node.js REST API, with PostgreSQL as the source of truth for accounts, bills, and payment state.',
      challenges:
        'The main challenge is modelling recurring bills cleanly — due dates, partial payments, and household versus business context — without turning the first version into an accounting suite.',
      result:
        'BillFree is in active development and is not publicly launched yet. This case study describes the product as it is being built, not invented launch metrics.',
    },
  },

  {
    id: 'wpvibe',
    title: 'WPVibe',
    category: 'WordPress / CMS',
    filter: 'wordpress',
    description:
      'A WordPress-focused product exploring modern editorial theming, custom blocks, and a faster authoring workflow for content-heavy sites.',
    year: '2024',
    role: 'Developer',
    technologies: ['WordPress', 'PHP', 'JavaScript', 'MySQL'],
    image: '/projects/wpvibe-01.webp',
    secondaryImages: ['/projects/wpvibe-02.webp'],
    liveUrl: undefined,
    githubUrl: undefined,
    caseStudyUrl: '/projects/wpvibe',
    featured: true,
    status: 'development',
    layout: 'left',
    seo: {
      title: 'Afeef Iqbal | WPVibe — WordPress CMS Development',
      description:
        'WPVibe is a WordPress product by Afeef Iqbal exploring modern editorial theming, custom blocks, and a faster authoring workflow.',
      imageAlt:
        'WPVibe WordPress editorial theme showing a content-focused authoring layout',
      schema: 'SoftwareApplication',
      applicationCategory: 'WebApplication',
    },
    caseStudy: {
      overview:
        'WPVibe explores what modern editorial publishing can feel like on WordPress — custom themes, block patterns, and an authoring workflow that stays fast on content-heavy sites.',
      problem:
        'Many WordPress sites still fight the editor: slow admin screens, generic themes, and block setups that are hard for authors to reuse. Content-heavy sites feel the cost first.',
      solution:
        'WPVibe is a WordPress-focused product: custom theming and block patterns aimed at a calmer authoring workflow, so editors can publish without fighting the CMS.',
      role: 'WordPress development — themes, custom blocks, and performance.',
      features: [
        'Custom WordPress theming for editorial sites',
        'Reusable block patterns for authors',
        'Attention to admin and front-end performance on content-heavy pages',
      ],
      design:
        'The design direction is editorial rather than decorative — type, spacing, and predictable content widths so long-form pages stay readable.',
      development:
        'Built on WordPress with PHP, JavaScript, and MySQL. The work sits in theme structure, custom blocks, and the authoring experience rather than a separate application stack.',
      challenges:
        'Keeping the editor fast while adding custom blocks, and making those blocks reusable enough that authors do not need a developer for every new page.',
      result:
        'WPVibe is in development and is not a public product yet. Details here reflect the work in progress, not a published launch.',
    },
  },

  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    category: 'Three.js / WebGL Experience',
    filter: 'experimental',
    description:
      'This site — a cinematic, typography-driven portfolio with a restrained layer of Three.js. Designed and engineered end to end.',
    year: '2026',
    role: 'Design + build',
    technologies: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Vite'],
    image: '/projects/portfolio-01.webp',
    secondaryImages: [],
    liveUrl: 'https://linktr.ee/iafeef',
    githubUrl: undefined,
    caseStudyUrl: '/projects/portfolio',
    featured: true,
    status: 'live',
    layout: 'right',
    imageWidth: 992,
    imageHeight: 612,
    seo: {
      title: 'Afeef Iqbal | Personal Portfolio — React & Three.js',
      description:
        'Editorial developer portfolio for Afeef Iqbal, built with React, TypeScript, and a restrained Three.js scene to present real shipped work.',
      imageAlt:
        'Afeef Iqbal portfolio homepage with editorial typography and selected work',
      schema: 'WebSite',
    },
    caseStudy: {
      overview:
        'An editorial developer portfolio built to present real products rather than decorate them. Typography leads, photography supports, and a subtle WebGL particle globe adds depth without stealing focus.',
      problem:
        'Most developer portfolios either drown the work in template UI or bury it under heavy 3D effects. The goal was a site where the projects are unmistakably the point.',
      solution:
        'An art-directed single page with case-study routes: oversized display typography, an asymmetric editorial grid, restrained GSAP motion, and a lazy-loaded Three.js scene that pauses when off-screen.',
      role: 'Everything — design direction, front-end architecture, motion, and deployment.',
      features: [
        'Editorial layout system with data-driven project case studies',
        'Subtle Three.js particle globe with cursor parallax, paused when not visible',
        'Custom cursor with contextual VIEW state over project media',
        'Scroll-triggered typography reveals that respect prefers-reduced-motion',
      ],
      design:
        'Dark and light editorial palettes, Archivo display type, and an asymmetric grid. The portrait and project images carry the photography; the rest of the page is type and space.',
      development:
        'React and TypeScript on Vite, React Router for case studies, GSAP ScrollTrigger for reveals, and React Three Fiber for the hero globe. Theme preference is stored locally and applied before first paint.',
      challenges:
        'Keeping the motion and WebGL layers cheap enough that the site stays fast on mobile — solved with lazy loading, IntersectionObserver-driven render pausing, and a capped device pixel ratio.',
      result:
        'This website is live — it is the portfolio you are reading. The Three.js layer is lazy-loaded and pauses when it leaves the viewport so the case studies and copy stay the priority.',
    },
  },

  upcoming({
    id: 'ai-saas',
    title: 'AI SaaS',
    category: 'AI / Full Stack',
    filter: 'ai',
    description: 'An AI-powered SaaS product. Publish once screenshots and details exist.',
    image: '/projects/ai-saas-01.webp',
    layout: 'left',
  }),

  upcoming({
    id: 'real-estate',
    title: 'Real Estate Platform',
    category: 'Web Application',
    filter: 'web-apps',
    description: 'A property listing and search platform.',
    image: '/projects/real-estate-01.webp',
    layout: 'right',
  }),

  upcoming({
    id: 'ecommerce',
    title: 'E-commerce',
    category: 'Ecommerce / Full Stack',
    filter: 'web-apps',
    description: 'A full e-commerce build: storefront, cart, checkout, admin.',
    image: '/projects/ecommerce-01.webp',
    layout: 'left',
  }),

  upcoming({
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    category: 'Data / Application',
    filter: 'web-apps',
    description: 'A data-dense analytics dashboard with honest, readable visualization.',
    image: '/projects/analytics-dashboard-01.webp',
    layout: 'right',
  }),

  upcoming({
    id: 'job-board',
    title: 'Job Board',
    category: 'Marketplace / Full Stack',
    filter: 'web-apps',
    description: 'A job listing platform with search, filters, and employer tooling.',
    image: '/projects/job-board-01.webp',
    layout: 'left',
  }),

  upcoming({
    id: 'service-marketplace',
    title: 'Service Marketplace',
    category: 'Full Stack / Platform',
    filter: 'web-apps',
    description: 'A two-sided marketplace connecting providers and customers.',
    image: '/projects/service-marketplace-01.webp',
    layout: 'right',
  }),

  upcoming({
    id: 'ai-customer-support',
    title: 'AI Customer Support',
    category: 'AI / Automation',
    filter: 'ai',
    description: 'An AI-assisted customer support product.',
    image: '/projects/ai-customer-support-01.webp',
    layout: 'left',
  }),
]

/** Published work only. Coming-soon library entries stay off the public site. */
export const featuredProjects = projects.filter(
  (project) => project.featured && project.status !== 'coming-soon',
)

export function projectIndex(project: Project): string {
  const inFeatured = featuredProjects.indexOf(project)
  const position = inFeatured >= 0 ? inFeatured : projects.indexOf(project)
  return String(position + 1).padStart(2, '0')
}

export function isFilled(value?: string): boolean {
  if (!value) return false
  const text = value.trim()
  return text.length > 0 && !text.startsWith('[EDIT]') && !text.startsWith('[PLANNED]')
}
