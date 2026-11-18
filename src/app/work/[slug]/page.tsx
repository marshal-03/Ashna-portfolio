import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findWork, works } from '@/data/works'
import WorkGallery from '@/components/work/WorkGallery'
import SplitText from '@/components/ui/SplitText'
import s from './page.module.css'

// Every brand page is prerendered at build time; unknown slugs fall through to notFound().
export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const work = findWork(slug)
  return work
    ? { title: `${work.name} | Ashna Mary`, description: `${work.name} — ${work.subtitle}` }
    : {}
}

export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const work = findWork(slug)
  if (!work) notFound()

  const position = works.indexOf(work)
  const next = works[(position + 1) % works.length]!

  return (
    <article>
      <header className={s.work__hero}>
        {/* Cover image on its own layer so it can settle from a slow zoom. */}
        <div className={s.work__bg} style={{ backgroundImage: `url(${work.cover})` }} />
        <div className={`container ${s['work__hero-inner']}`}>
          <Link href="/work" className={`${s.work__back} fade-up`}>
            ← All works
          </Link>
          <SplitText as="h1" className={s.work__title} text={work.name} stagger={90} />
          <p className={`${s.work__subtitle} fade-up`} style={{ '--d': '0.35s' } as CSSProperties}>
            {work.subtitle}
          </p>
          <nav className={s.work__zones} aria-label="Sections">
            {work.zones.map((z, i) => (
              <a
                key={z.slug}
                href={`#${z.slug}`}
                className="fade-up"
                style={{ '--d': `${0.5 + i * 0.07}s` } as CSSProperties}
              >
                {z.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <WorkGallery zones={work.zones} />

      <Link href={`/work/${next.slug}`} className={s.work__next}>
        <div className="container tile-in">
          <p className="eyebrow">Next project</p>
          <p className={s['work__next-name']}>{next.name} →</p>
        </div>
      </Link>
    </article>
  )
}
