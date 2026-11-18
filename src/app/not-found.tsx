import Link from 'next/link'
import s from './not-found.module.css'

export default function NotFound() {
  return (
    <section className={`container ${s['not-found']}`}>
      <h1 className={s.code} aria-label="404">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </h1>
      <p className={`${s.text} fade-up`}>This page doesn’t exist — but plenty of designs do.</p>
      <div className={`${s.links} fade-up`}>
        <Link href="/" className="btn">
          Back home
        </Link>
        <Link href="/work" className={`${s.secondary} nudge`}>
          See all works <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
