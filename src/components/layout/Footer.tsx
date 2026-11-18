import Link from 'next/link'
import { profile, socials } from '@/data/portfolio'
import SocialIcon from '@/components/ui/SocialIcon'
import s from './Footer.module.css'

export default async function Footer() {
  // Reading the current time during prerender needs a cache boundary with Cache Components.
  'use cache'
  const year = new Date().getFullYear()
  return (
    <footer className={s.footer}>
      <div className={`container tile-in ${s.footer__inner}`}>
        <div className={s.footer__brand}>
          <span className={s.footer__name}>{profile.name}</span>
          <span>{profile.role} · Event, Brand &amp; Wedding Visuals · 3D Mock-ups</span>
        </div>

        <nav className={s.footer__links} aria-label="Footer">
          <Link href="/work">All works</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#contact">Contact</Link>
          <a href={profile.resumeUrl} download>
            CV
          </a>
        </nav>

        <div className={s.footer__contact}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className={s.footer__socials}>
            {socials.map((link) => (
              <a
                key={link.kind}
                href={link.url}
                target="_blank"
                rel="noopener"
                aria-label={link.label}
              >
                <SocialIcon kind={link.kind} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={`container ${s.footer__bottom}`}>
        <span>
          © {year} {profile.name}
        </span>
        <a href="#top" className={s.footer__top}>
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
