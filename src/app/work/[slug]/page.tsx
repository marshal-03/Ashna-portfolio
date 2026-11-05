import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findWork, works } from '@/data/works'
import WorkGallery from '@/components/work/WorkGallery'
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

const pad = (n: number) => String(n).padStart(2, '0')

export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const work = findWork(slug)
  if (!work) notFound()

  const position = works.indexOf(work)
  const next = works[(position + 1) % works.length]!

  return (
    <article>
      <header className={s.work__hero} style={{ backgroundImage: `url(${work.cover})` }}>
        <div className={`container ${s['work__hero-inner']}`}>
          <Link href="/#event-design" className={s.work__back}>
            ← All works
          </Link>
          <p className="eyebrow">
            {pad(position + 1)} / {pad(works.length)}
          </p>
          <h1 className={s.work__title}>{work.name}</h1>
          <p className={s.work__subtitle}>{work.subtitle}</p>
          <nav className={s.work__zones} aria-label="Sections">
            {work.zones.map((z) => (
              <a key={z.slug} href={`#${z.slug}`}>
                {z.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <WorkGallery zones={work.zones} />

      <Link href={`/work/${next.slug}`} className={s.work__next}>
        <div className="container">
          <p className="eyebrow">Next project</p>
          <p className={s['work__next-name']}>{next.name} →</p>
        </div>
      </Link>
    </article>
  )
}
