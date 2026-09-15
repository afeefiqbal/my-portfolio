import { profile } from './portfolio'
import { featuredProjects } from './projects'
import { skills } from './skills'
import type { Project } from '../types'

/** Production origin. Override with VITE_SITE_URL. Never localhost. */
export const DEFAULT_SITE_URL = 'https://afeefiqbal.com'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/$/,
  '',
)

export const OG_IMAGE_PATH = '/og-image.jpg'
export const OG_IMAGE_WIDTH = 1280
export const OG_IMAGE_HEIGHT = 720

export type SeoRobots = 'index, follow' | 'noindex, follow' | 'noindex, nofollow'

export type PageSeo = {
  path: string
  title: string
  description: string
  image: string
  robots: SeoRobots
  jsonLd: unknown[]
}

export const sectionRoutes: Record<string, string> = {
  '/about': 'about',
  '/projects': 'work',
  '/experience': 'experience',
  '/contact': 'contact',
}

export const HOME_TITLE = 'Afeef Iqbal | Full Stack Developer & AI Developer'
export const HOME_DESCRIPTION =
  'Portfolio of Afeef Iqbal, a full stack developer in Kerala building modern web applications, AI-powered products, APIs, and custom digital experiences.'

const ABOUT_TITLE = 'About Afeef Iqbal | Full Stack Developer'
const ABOUT_DESCRIPTION =
  'Afeef Iqbal is a full stack developer in Kochi, Kerala, building web applications, AI-powered features, APIs, and WordPress sites.'

const WORK_TITLE = 'Selected Work | Afeef Iqbal — Full Stack Developer'
const WORK_DESCRIPTION =
  'Selected work by Afeef Iqbal — web applications, WordPress products, and interactive experiences designed, built, and deployed.'

const EXPERIENCE_TITLE = 'Experience | Afeef Iqbal — Full Stack Developer'
const EXPERIENCE_DESCRIPTION =
  'Professional experience of Afeef Iqbal, a full stack developer based in Kerala, India.'

const CONTACT_TITLE = 'Contact Afeef Iqbal | Full Stack Developer'
const CONTACT_DESCRIPTION =
  'Contact Afeef Iqbal to discuss freelance or full-time full-stack web development, AI-powered applications, and custom digital platforms.'

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized === '/' ? '/' : normalized}`
}

export function ogImageUrl(path?: string): string {
  return absoluteUrl(path || OG_IMAGE_PATH)
}

function personNode() {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: profile.name,
    url: SITE_URL,
    image: ogImageUrl(),
    jobTitle: profile.title,
    description: HOME_DESCRIPTION,
    email: `mailto:${profile.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    sameAs: [profile.links.linkedin, profile.links.website],
    knowsAbout: skills,
    worksFor: {
      '@type': 'Organization',
      name: 'Pixbit Solutions',
    },
  }
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${profile.name} — ${profile.title}`,
    url: SITE_URL,
    description: HOME_DESCRIPTION,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#person` },
  }
}

function webPageNode(path: string, title: string, description: string) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en',
  }
}

export function homeJsonLd(): unknown[] {
  return [
    {
      '@context': 'https://schema.org',
      '@graph': [personNode(), websiteNode(), webPageNode('/', HOME_TITLE, HOME_DESCRIPTION)],
    },
  ]
}

function sectionJsonLd(path: string, title: string, description: string): unknown[] {
  return [
    {
      '@context': 'https://schema.org',
      '@graph': [personNode(), websiteNode(), webPageNode(path, title, description)],
    },
  ]
}

export function projectJsonLd(project: Project): unknown[] {
  const url = absoluteUrl(project.caseStudyUrl)
  const image = ogImageUrl(project.image)

  const work =
    project.seo.schema === 'SoftwareApplication'
      ? {
          '@type': 'SoftwareApplication',
          name: project.title,
          url,
          image,
          description: project.seo.description,
          applicationCategory: project.seo.applicationCategory ?? 'WebApplication',
          operatingSystem: 'Web',
          author: { '@id': `${SITE_URL}/#person` },
          creator: { '@id': `${SITE_URL}/#person` },
          inLanguage: 'en',
        }
      : {
          '@type': project.seo.schema,
          name: project.title,
          url,
          image,
          description: project.seo.description,
          author: { '@id': `${SITE_URL}/#person` },
          inLanguage: 'en',
        }

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: absoluteUrl('/projects') },
      { '@type': 'ListItem', position: 3, name: project.title, item: url },
    ],
  }

  return [
    {
      '@context': 'https://schema.org',
      '@graph': [personNode(), work, breadcrumbs],
    },
  ]
}

const pages: Record<string, Omit<PageSeo, 'jsonLd'> & { jsonLd: unknown[] }> = {
  '/': {
    path: '/',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    image: OG_IMAGE_PATH,
    robots: 'index, follow',
    jsonLd: homeJsonLd(),
  },
  '/about': {
    path: '/about',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    image: OG_IMAGE_PATH,
    robots: 'index, follow',
    jsonLd: sectionJsonLd('/about', ABOUT_TITLE, ABOUT_DESCRIPTION),
  },
  '/projects': {
    path: '/projects',
    title: WORK_TITLE,
    description: WORK_DESCRIPTION,
    image: OG_IMAGE_PATH,
    robots: 'index, follow',
    jsonLd: sectionJsonLd('/projects', WORK_TITLE, WORK_DESCRIPTION),
  },
  '/experience': {
    path: '/experience',
    title: EXPERIENCE_TITLE,
    description: EXPERIENCE_DESCRIPTION,
    image: OG_IMAGE_PATH,
    robots: 'index, follow',
    jsonLd: sectionJsonLd('/experience', EXPERIENCE_TITLE, EXPERIENCE_DESCRIPTION),
  },
  '/contact': {
    path: '/contact',
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    image: OG_IMAGE_PATH,
    robots: 'index, follow',
    jsonLd: sectionJsonLd('/contact', CONTACT_TITLE, CONTACT_DESCRIPTION),
  },
}

export function getProjectByPath(pathname: string): Project | undefined {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (!match) return undefined
  return featuredProjects.find((project) => project.id === match[1])
}

export function getPageSeo(pathname: string): PageSeo {
  const clean = pathname.replace(/\/$/, '') || '/'
  const staticPage = pages[clean]
  if (staticPage) return staticPage

  const project = getProjectByPath(clean)
  if (project) {
    return {
      path: project.caseStudyUrl,
      title: project.seo.title,
      description: project.seo.description,
      image: project.image,
      robots: 'index, follow',
      jsonLd: projectJsonLd(project),
    }
  }

  return {
    path: pathname,
    title: `Page not found | ${profile.name}`,
    description: `The page you requested was not found on ${profile.name}'s portfolio.`,
    image: OG_IMAGE_PATH,
    robots: 'noindex, nofollow',
    jsonLd: [],
  }
}

export function sitemapEntries(): { path: string; changefreq: string; priority: string }[] {
  return [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/projects', changefreq: 'weekly', priority: '0.9' },
    { path: '/experience', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.8' },
    ...featuredProjects.map((project) => ({
      path: project.caseStudyUrl,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]
}

export function buildSitemapXml(siteUrl = SITE_URL): string {
  const lastmod = '2026-09-15'
  const urls = sitemapEntries()
    .map((entry) => {
      const loc = `${siteUrl}${entry.path === '/' ? '/' : entry.path}`
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildRobotsTxt(siteUrl = SITE_URL): string {
  return `User-agent: *
Allow: /
Allow: /projects/
Allow: /projects/*

Sitemap: ${siteUrl}/sitemap.xml
`
}

export function prerenderRoutes(): string[] {
  return sitemapEntries().map((entry) => entry.path)
}
