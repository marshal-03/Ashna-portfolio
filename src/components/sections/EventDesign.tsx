import Image from 'next/image'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'
import { findWork } from '@/data/works'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import EventIntro from './EventIntro'
import CaseStudy from './CaseStudy'
import s from './EventDesign.module.css'

// The home page shows two case studies in full; the rest are cards leading to their project pages,
// which keeps the page short. Every visual is on /work.
const FEATURED = ['coca-cola', 'borderless-access']
const featured = caseStudies.filter((c) => FEATURED.includes(c.slug))
const more = caseStudies.filter((c) => !FEATURED.includes(c.slug))

export default function EventDesign() {
  return (
    <section id="event-design" className={s.event}>
      <EventIntro />
      <div className={s.cases}>
        {featured.map((study) => (
          <CaseStudy key={study.slug} study={study} />
        ))}

        <div className={s.more}>
          <SplitText as="h3" className={s.more__title} text="More events" />
          <ul className={s.more__grid}>
            {more.map((study, i) => {
              const work = findWork(study.slug)
              return (
                <li key={study.slug}>
                  <Reveal delay={i * 120}>
                    <Link href={`/work/${study.slug}`} className={`${s.card} nudge`}>
                      <div className={s.card__media}>
                        <Image
                          src={work?.coverThumb ?? study.hero.image.src}
                          alt={`${study.brand} ${study.hero.label}`}
                          fill
                          sizes="(max-width: 720px) 100vw, 33vw"
                        />
                      </div>
                      <div className={s.card__body}>
                        <span className={s.card__brand}>{study.brand}</span>
                        {study.event && <span className={s.card__event}>{study.event}</span>}
                        <span className={s.card__cta}>
                          View project <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>

        <div className={s.viewAll}>
          <p className="eyebrow">There&apos;s more</p>
          <Link href="/work" className="btn">
            View all works <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
