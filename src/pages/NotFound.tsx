import { Link, useLocation } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { SiteFooter } from '../components/SiteFooter'
import { getPageSeo } from '../data/seo'

export function NotFound() {
  const location = useLocation()
  const seo = { ...getPageSeo('/missing'), path: location.pathname }

  return (
    <>
      <Seo {...seo} />
      <main id="main" className="not-found">
        <div className="section-head">
          <span className="section-index">404</span>
          <span className="section-label">Error</span>
        </div>
        <h1 className="section-title">
          Page
          <br />
          <span className="title-outline">Not found</span>
        </h1>
        <Link to="/" className="link-arrow" data-cursor="hover">
          Back to home <span aria-hidden="true">→</span>
        </Link>
      </main>
      <div className="not-found-foot">
        <SiteFooter />
      </div>
    </>
  )
}
