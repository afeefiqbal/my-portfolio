import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

type PrerenderPage = {
  path: string
  title: string
  description: string
}

/** Keep in sync with src/data/seo.ts public routes. */
const PRERENDER_PAGES: PrerenderPage[] = [
  {
    path: '/',
    title: 'Afeef Iqbal | Full Stack Developer & AI Developer',
    description:
      'Portfolio of Afeef Iqbal, a full stack developer in Kerala building modern web applications, AI-powered products, APIs, and custom digital experiences.',
  },
  {
    path: '/about',
    title: 'About Afeef Iqbal | Full Stack Developer',
    description:
      'Afeef Iqbal is a full stack developer in Kochi, Kerala, building web applications, AI-powered features, APIs, and WordPress sites.',
  },
  {
    path: '/projects',
    title: 'Selected Work | Afeef Iqbal — Full Stack Developer',
    description:
      'Selected work by Afeef Iqbal — web applications, WordPress products, and interactive experiences designed, built, and deployed.',
  },
  {
    path: '/experience',
    title: 'Experience | Afeef Iqbal — Full Stack Developer',
    description:
      'Professional experience of Afeef Iqbal, a full stack developer based in Kerala, India.',
  },
  {
    path: '/contact',
    title: 'Contact Afeef Iqbal | Full Stack Developer',
    description:
      'Contact Afeef Iqbal to discuss freelance or full-time full-stack web development, AI-powered applications, and custom digital platforms.',
  },
  {
    path: '/projects/billfree',
    title: 'Afeef Iqbal | BillFree — Fintech Web Application',
    description:
      'BillFree is a fintech web application by Afeef Iqbal for tracking, paying, and managing household and business bills in one place.',
  },
  {
    path: '/projects/wpvibe',
    title: 'Afeef Iqbal | WPVibe — WordPress CMS Development',
    description:
      'WPVibe is a WordPress product by Afeef Iqbal exploring modern editorial theming, custom blocks, and a faster authoring workflow.',
  },
  {
    path: '/projects/portfolio',
    title: 'Afeef Iqbal | Personal Portfolio — React & Three.js',
    description:
      'Editorial developer portfolio for Afeef Iqbal, built with React, TypeScript, and a restrained Three.js scene to present real shipped work.',
  },
]

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function replaceAttr(html: string, attr: string, key: string, value: string) {
  const pattern = new RegExp(`(<meta[^>]*${attr}="${key}"[^>]*content=")([^"]*)(")`, 'i')
  if (pattern.test(html)) return html.replace(pattern, `$1${escapeHtml(value)}$3`)
  return html
}

function applyPageHead(html: string, page: PrerenderPage, siteUrl: string) {
  const url = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const image = `${siteUrl}/og-image.jpg`
  let next = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
  next = replaceAttr(next, 'name', 'description', page.description)
  next = replaceAttr(next, 'property', 'og:title', page.title)
  next = replaceAttr(next, 'property', 'og:description', page.description)
  next = replaceAttr(next, 'property', 'og:url', url)
  next = replaceAttr(next, 'property', 'og:image', image)
  next = replaceAttr(next, 'name', 'twitter:title', page.title)
  next = replaceAttr(next, 'name', 'twitter:description', page.description)
  next = replaceAttr(next, 'name', 'twitter:image', image)
  next = next.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
  return next
}

function seoPrerender(siteUrl: string): Plugin {
  return {
    name: 'portfolio-seo',
    closeBundle() {
      const distDir = path.resolve('dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const indexHtml = fs.readFileSync(indexPath, 'utf8')
      fs.writeFileSync(path.join(distDir, '404.html'), indexHtml)

      for (const page of PRERENDER_PAGES) {
        const html = applyPageHead(indexHtml, page, siteUrl)
        if (page.path === '/') {
          fs.writeFileSync(indexPath, html)
          continue
        }
        const outDir = path.join(distDir, page.path.replace(/^\//, ''))
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://afeefiqbal.com').replace(/\/$/, '')

  return {
    plugins: [react(), seoPrerender(siteUrl)],
  }
})
