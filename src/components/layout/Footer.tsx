import { profile } from '@/data/portfolio'
import s from './Footer.module.css'

export default async function Footer() {
  // Reading the current time during prerender needs a cache boundary with Cache Components.
  'use cache'
  const year = new Date().getFullYear()

  return (
    <footer className={s.footer}>
      <div className={`container ${s.footer__inner}`}>
        <span>
          © {year} {profile.name}
        </span>
        <span>{profile.role} · Event &amp; Brand Visuals</span>
      </div>
    </footer>
  )
}
