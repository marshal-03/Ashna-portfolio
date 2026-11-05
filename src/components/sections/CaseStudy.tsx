import Image from 'next/image'
import Link from 'next/link'
import type { CaseShot, CaseStudy as CaseStudyData } from '@/data/caseStudies'
import s from './CaseStudy.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={`${s.sparkle} ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.6 6.6 2.8 9.4 12 12-9.2 2.6-11.4 5.4-12 12-.6-6.6-2.8-9.4-12-12C9.2 9.4 11.4 6.6 12 0Z" />
    </svg>
  )
}

// Hand-drawn style dashed arrow curving down towards the caption.
function DashedArrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 80 70" fill="none" aria-hidden="true">
      <path d="M8 4c-6 22 8 34 30 30s34 6 34 28" strokeDasharray="4 5" />
      <path d="M64 54l8 10 6-12" />
    </svg>
  )
}

function Shot({ shot, sizes, wide }: { shot: CaseShot; sizes: string; wide?: boolean }) {
  return (
    <figure className={wide ? `${s.shot} ${s['shot--wide']}` : s.shot}>
      <figcaption className={s.label}>{shot.label}</figcaption>
      <Image
        src={shot.image.src}
        width={shot.image.width}
        height={shot.image.height}
        alt={shot.label}
        sizes={sizes}
        className={s.img}
      />
      {shot.extra && (
        <div className={s.extra}>
          <Image
            src={shot.extra.image.src}
            width={shot.extra.image.width}
            height={shot.extra.image.height}
            alt=""
            sizes="(max-width: 720px) 55vw, 320px"
            className={s.img}
          />
          <div className={s.extra__note}>
            <DashedArrow />
            <p>{shot.extra.caption}</p>
          </div>
        </div>
      )}
    </figure>
  )
}

/** Overview paragraphs, highlights and deliverables, styled like the case-study boards. */
function TextBlock({ study, wide }: { study: CaseStudyData; wide?: boolean }) {
  return (
    <div className={wide ? `${s.text} ${s['text--wide']}` : s.text}>
      {study.overview?.length ? (
        <>
          <h4>Project Overview</h4>
          {study.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </>
      ) : null}
      {study.highlights?.length ? (
        <>
          <h4>Key Highlights</h4>
          <ul className={s.plain}>
            {study.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      ) : null}
      {study.deliverables?.length ? (
        <>
          <h4>Design Deliverables</h4>
          <ul>
            {study.deliverables.map((d) => (
              <li key={d.title}>
                {d.title}: {d.text}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}

export default function CaseStudy({
  study,
  index,
  total,
}: {
  study: CaseStudyData
  index: number
  total: number
}) {
  const hasText = Boolean(
    study.overview?.length || study.highlights?.length || study.deliverables?.length,
  )
  const below = study.textPlacement === 'below'
  // Text beside: the first shot sits next to the text and the rest form the grid.
  const besideShot = hasText && !below ? study.shots[0] : undefined
  const gridShots = besideShot ? study.shots.slice(1) : study.shots
  const decor = study.decor ?? []

  return (
    <article className={s.case} id={`case-${study.slug}`}>
      <header className={s.case__head}>
        <p className={s.case__index}>
          {pad(index + 1)} / {pad(total)}
        </p>
        <h3 className={s.case__brand}>
          {study.brand}
          {study.event && <span> · {study.event}</span>}
        </h3>
        <Link href={`/work/${study.slug}`} className={s.case__more}>
          View all visuals →
        </Link>
      </header>

      <Shot shot={study.hero} sizes="(max-width: 1280px) 100vw, 1200px" wide />

      {besideShot && (
        <div className={s.row}>
          <Shot shot={besideShot} sizes="(max-width: 900px) 100vw, 600px" />
          <div className={s.textWrap}>
            <span className={`${s.blob} ${s['blob--right']}`} aria-hidden="true" />
            <TextBlock study={study} />
            <Sparkle className={s['sparkle--text']} />
          </div>
        </div>
      )}

      {gridShots.length > 0 && (
        <div className={s.grid}>
          {gridShots.map((shot) => (
            <Shot key={shot.image.src} shot={shot} sizes="(max-width: 900px) 100vw, 600px" />
          ))}
        </div>
      )}

      {hasText && below && (
        <div className={s.belowWrap}>
          {decor.map((d) => (
            <div key={d.alt} className={`${s.decor} ${s[`decor--${d.side}`]}`}>
              <span className={s.blob} aria-hidden="true" />
              <Image src={d.image} alt={d.alt} sizes="(max-width: 720px) 45vw, 320px" />
            </div>
          ))}
          <TextBlock study={study} wide />
          <Sparkle className={s['sparkle--decor']} />
        </div>
      )}

      {study.outcome && (
        <div className={`${s.text} ${s.outcome}`}>
          <h4>Project Outcome</h4>
          <p>{study.outcome}</p>
        </div>
      )}

      <Sparkle className={s['sparkle--a']} />
      <Sparkle className={s['sparkle--b']} />
    </article>
  )
}
