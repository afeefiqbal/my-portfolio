import { useEffect } from 'react'
import { absoluteUrl, ogImageUrl, type PageSeo } from '../data/seo'

function upsertMeta(selector: string, attributes: Record<string, string>) {
  const head = document.head
  let el = head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value)
  }
}

function upsertLink(rel: string, href: string) {
  const head = document.head
  let el = head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(blocks: unknown[]) {
  document.querySelectorAll('script[data-seo-jsonld]').forEach((node) => node.remove())
  blocks.forEach((block) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seoJsonld = 'true'
    script.text = JSON.stringify(block).replace(/</g, '\\u003c')
    document.head.appendChild(script)
  })
}

export function Seo({ title, description, path, image, robots, jsonLd }: PageSeo) {
  useEffect(() => {
    const url = absoluteUrl(path)
    const imageUrl = ogImageUrl(image)

    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Afeef Iqbal' })
    upsertLink('canonical', url)

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: title })
    upsertMeta('meta[property="og:image:width"]', {
      property: 'og:image:width',
      content: String(1280),
    })
    upsertMeta('meta[property="og:image:height"]', {
      property: 'og:image:height',
      content: String(720),
    })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Afeef Iqbal' })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })

    setJsonLd(jsonLd)
  }, [title, description, path, image, robots, jsonLd])

  return null
}
