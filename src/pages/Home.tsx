import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { About } from '../components/About'
import { Capabilities } from '../components/Capabilities'
import { Contact } from '../components/Contact'
import { Experience } from '../components/Experience'
import { Hero } from '../components/Hero'
import { Hiring } from '../components/Hiring'
import { Numbers } from '../components/Numbers'
import { Projects } from '../components/Projects'
import { Seo } from '../components/Seo'
import { WhatIBuild } from '../components/WhatIBuild'
import { getPageSeo, sectionRoutes } from '../data/seo'

export function Home() {
  const location = useLocation()
  const seo = useMemo(() => getPageSeo(location.pathname), [location.pathname])

  useEffect(() => {
    const fromState = (location.state as { scrollTo?: string } | null)?.scrollTo
    const fromPath = sectionRoutes[location.pathname]
    const target = fromState || fromPath
    if (!target) return
    requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [location.pathname, location.state])

  return (
    <>
      <Seo {...seo} />
      <main id="main">
        <Hero />
        <About />
        <WhatIBuild />
        <Projects />
        <Numbers />
        <Capabilities />
        <Experience />
        <Hiring />
        <Contact />
      </main>
    </>
  )
}
