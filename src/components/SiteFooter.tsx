import { profile } from '../data/portfolio'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>Designed &amp; built by {profile.name}</span>
    </footer>
  )
}
