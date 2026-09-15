# Afeef Iqbal — Portfolio

A cinematic, editorial-style developer portfolio focused on real, deployed work.
Dark, typography-driven, with a restrained Three.js particle globe in the hero and
case-study pages for each project.

Built with React 19, TypeScript, Vite, React Router, GSAP (ScrollTrigger), and React Three Fiber.

Ships with dark (default) and light themes. The toggle in the navigation persists
the choice to `localStorage`, an inline script in `index.html` applies it before
first paint, and the Three.js globe re-tints per theme. Theme palettes live in
`src/index.css` (`:root` for dark, `html[data-theme='light']` for light).

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (type-checks first)
npm run lint     # oxlint
```

## Routes

- `/` — main portfolio (hero, about, what I build, selected work, numbers, capabilities, experience, hiring CTA, contact)
- `/about`, `/projects`, `/experience`, `/contact` — same page, scrolled to the matching section
- `/projects/:id` — case-study page per published project (e.g. `/projects/billfree`)

Direct loads of those URLs need an SPA fallback (already included for Netlify `_redirects`, Vercel `vercel.json`, and GitHub Pages `404.html` generated at build). The production build also writes unique `<title>` / Open Graph tags into `dist/about/index.html`, `dist/projects/billfree/index.html`, and the other public routes so crawlers that do not execute JavaScript still see the correct metadata.

## Editing content

All user-facing content lives in `src/data/`:

- `src/data/projects.ts` — **the project showcase.** Ten flagship slots are scaffolded;
  only entries with `featured: true` and `status` other than `coming-soon` appear publicly.
  Each project supports id, title, category, filter, description, year, role, technologies,
  image, secondaryImages, liveUrl, githubUrl, caseStudyUrl, featured, status
  (`live` | `development` | `coming-soon`), and case-study fields
  (overview / problem / solution / role / features / design / development / challenges / result).
  Empty or `[EDIT]` case-study fields are hidden on the page.
- `src/data/site.ts` — "By the numbers" stats. Use `'—'` for unconfirmed values;
  never invent numbers.
- `src/data/portfolio.ts` — profile, hero copy, about, what-I-build list, capability groups,
  education, hiring CTA, contact copy and details. Do not invent companies, stats, or links.
- `src/data/seo.ts` — site origin, titles, descriptions, canonicals, Open Graph, JSON-LD, sitemap.
  Set `VITE_SITE_URL` in `.env` to the live domain (never localhost).
- `src/data/experience.ts` — experience timeline.
- `src/data/skills.ts` — flat skill list used by the résumé download.

### Publishing a project

1. Add screenshots using the naming convention:
   - `public/projects/<id>-01.webp` (primary, ~16:10)
   - `public/projects/<id>-02.webp`, `-03.webp`… (case-study gallery)
   - `.png` / `.jpg` also work — match the paths in `projects.ts`
2. Replace the `[EDIT]` placeholders with real content.
3. Set `featured: true`.

Until a screenshot exists, the site shows an honest
"PROJECT PREVIEW — screenshot coming soon" state instead of a fake image.

### Portrait

Drop your photo at `public/portrait.jpg` (roughly 3:4 portrait crop). It loads
automatically with cinematic grain/contrast treatment and subtle cursor parallax.
Until then, a minimal editorial placeholder renders.

## Structure

- `src/pages/Home.tsx`, `src/pages/CaseStudy.tsx` — routes
- `src/components/` — one component per section plus `Nav`, `Cursor`, `ProjectMedia`
  (screenshot-with-honest-fallback), and the `HeroCanvas` Three.js backdrop
- `src/hooks/useReveal.ts` — shared GSAP scroll-reveal hook (respects `prefers-reduced-motion`)
- `src/lib/resume.ts` — plain-text résumé generator for the "Download CV" button

## Performance notes

- The Three.js scene is lazy-loaded, pauses rendering when off-screen or when the
  tab is hidden, and renders a static frame under `prefers-reduced-motion`
- Project images are lazy-loaded; the custom cursor is disabled on touch devices
