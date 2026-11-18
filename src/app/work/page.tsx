import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { works } from '@/data/works'
import ShowcaseGrid from '@/components/work/ShowcaseGrid'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'All Works | Ashna Mary',
  description:
    'The full showcase — every event stage, entry arch, booth, wedding piece and graphic.',
}

const count = (w: (typeof works)[number]) => w.zones.reduce((n, z) => n + z.items.length, 0)

// Full showcase: one card per brand project, then every visual in a filterable grid.
export default function AllWorksPage() {
  const total = works.reduce((n, w) => n + count(w), 0)

  return (
    <article className={s.page}>
      <header className={`container ${s.head}`}>
        <Link href="/#event-design" className={`${s.back} fade-up`}>
          ← Back home
        </Link>
        <p className="eyebrow fade-up" style={{ '--d': '0.1s' } as CSSProperties}>
          Event &amp; Wedding Design
        </p>
        <SplitText as="h1" className={s.title} text="All Works" stagger={120} />
        <p className={`${s.lede} fade-up`} style={{ '--d': '0.35s' } as CSSProperties}>
          {works.length} projects · {total} visuals — stages, entry arches, registration desks,
          wedding stationery and the print graphics behind them.
        </p>
      </header>

      <section className={`container ${s.brands}`} aria-label="Projects">
        {works.map((w, i) => (
          <Reveal key={w.slug} delay={(i % 3) * 110}>
            <Link href={`/work/${w.slug}`} className={`${s.card} nudge`}>
              <div className={s.card__media}>
                <Image
                  src={w.coverThumb}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className={s.card__body}>
                <h2 className={s.card__name}>{w.name}</h2>
                <p className={s.card__meta}>
                  {w.subtitle} · {count(w)} visuals
                </p>
                <span className={s.card__cta}>
                  Open project <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <ShowcaseGrid works={works} />
    </article>
  )
}
