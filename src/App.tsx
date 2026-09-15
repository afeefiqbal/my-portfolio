import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { FloatContact } from './components/FloatContact'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'

const CaseStudy = lazy(() =>
  import('./pages/CaseStudy').then((module) => ({ default: module.CaseStudy })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound })),
)

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Cursor />
      <Nav />
      <FloatContact />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/experience" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/projects/:id" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
