'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { showcase as shots } from '@/data/showcase'
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery'
import Toolkit from './Toolkit'
import s from './EventDesign.module.css'

/*
 * Pinned showcase: the big "Event Design" title sits in the middle of a sticky stage, and as the
 * page scrolls one brand collage at a time rises into the centre, holds, and lifts away.
 */

// One collage at a time, centred, as large as the screen allows (by width and by height).
const MAX_W = { desktop: 90, mobile: 94 } // vw
const MAX_H = { desktop: 82, mobile: 62 } // vh
const START = 0.16 // the title animates and fills before the first collage arrives
const FILL_END = 0.14 // the title is fully filled by this point of the scroll
const TOOLKIT_EXIT = 0.06 // the toolkit row has lifted away by this point
const STEP = (1 - START) / shots.length

const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeIn = (x: number) => x ** 3
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

// Title letters, indexed across both words so the rise-in staggers left to right, top to bottom.
const TITLE_WORDS = (() => {
  let n = 0
  return ['Event', 'Design'].map((word) => [...word].map((ch) => ({ ch, i: n++ })))
})()

const sectionHeight = `${120 + shots.length * 95}vh`

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')

export default function EventDesign() {
  const section = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [titleIn, setTitleIn] = useState(false)
  const isMobile = useMediaQuery('(max-width: 719.98px)')
  const pinned = !useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = section.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      // Letters rise in once the section's top reaches the lower part of the screen.
      if (top < window.innerHeight * 0.75) setTitleIn(true)
      const distance = el.offsetHeight - window.innerHeight
      setProgress(distance > 0 ? clamp01(-top / distance) : 0)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [pinned])

  // The toolkit row greets you at the top of the frame, then lifts away before the first image.
  const toolkitOut = Math.min(1, progress / TOOLKIT_EXIT)
  const toolkitStyle: CSSProperties = {
    opacity: 1 - toolkitOut,
    transform: `translate3d(0, ${(-toolkitOut * 60).toFixed(1)}px, 0)`,
    visibility: toolkitOut >= 1 ? 'hidden' : undefined,
  }

  // Title sits below the toolkit at first, settles into the centre as the toolkit leaves, fills
  // left to right, and fades out once the last image has passed.
  const fill = clamp01((progress - TOOLKIT_EXIT * 0.5) / (FILL_END - TOOLKIT_EXIT * 0.5))
  const titleStyle = {
    transform: `translate3d(0, ${((1 - toolkitOut) * (isMobile ? 70 : 90)).toFixed(1)}px, 0) scale(${(0.92 + Math.min(1, progress / START) * 0.08).toFixed(3)})`,
    opacity: progress > 0.92 ? Math.max(0, 1 - (progress - 0.92) / 0.08) : 1,
    '--fill': `${(fill * 100).toFixed(1)}%`,
  } as CSSProperties

  /*
   * Within its slice a collage rises from below into the centre (0–30%), holds there while it
   * slowly grows (30–70%), then lifts out through the top (70–100%) as the next one rises.
   */
  const placed = shots.map((shot, i) => {
    const raw = (progress - (START + i * STEP)) / STEP
    const t = clamp01(raw)

    let y: number // vh offset from the centre of the screen
    if (t < 0.3) y = 105 * (1 - easeOut(t / 0.3))
    else if (t < 0.7) y = 0
    else y = -115 * easeIn((t - 0.7) / 0.3)

    const w = isMobile ? MAX_W.mobile : MAX_W.desktop
    const h = isMobile ? MAX_H.mobile : MAX_H.desktop
    const ratio = shot.src.width / shot.src.height

    return {
      shot,
      visible: raw > -0.05 && raw < 1.05,
      style: {
        left: '50%',
        width: `min(${w}vw, ${(h * ratio).toFixed(2)}vh)`,
        opacity: clamp01(raw * 8),
        transform: `translate3d(-50%, calc(-50% + ${y.toFixed(2)}vh), 0) scale(${(0.88 + 0.16 * t).toFixed(3)})`,
        zIndex: 10 + i,
      } as CSSProperties,
    }
  })

  const counter = Math.min(shots.length, Math.max(1, Math.ceil(progress * shots.length)))

  return (
    <section
      id="event-design"
      ref={section}
      className={cx(s.event, pinned && s['event--pinned'])}
      style={pinned ? { height: sectionHeight } : undefined}
    >
      <div className={s.event__stage}>
        <div className={s.event__toolkit} style={pinned ? toolkitStyle : undefined}>
          <Toolkit />
        </div>

        <h2
          className={cx(s.event__title, titleIn && s['event__title--in'])}
          style={pinned ? titleStyle : ({ '--fill': '100%' } as CSSProperties)}
          aria-label="Event Design"
        >
          {/* Faded base layer, plus a bright copy revealed left to right as you scroll. */}
          {(['base', 'fill'] as const).map((layer) => (
            <span
              key={layer}
              className={cx(s['event__title-layer'], s[`event__title-layer--${layer}`])}
              aria-hidden="true"
            >
              {TITLE_WORDS.map((word, w) => (
                <span key={w} className={s.event__word}>
                  {word.map((l) => (
                    <span
                      key={l.i}
                      className={s.event__letter}
                      style={{ '--i': l.i } as CSSProperties}
                    >
                      {l.ch}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h2>

        {pinned ? (
          <>
            {placed.map(({ shot, visible, style }) => (
              <Link
                key={shot.slug}
                href={`/work/${shot.slug}`}
                className={s.shot}
                style={visible ? style : { ...style, display: 'none' }}
              >
                <Image
                  src={shot.src}
                  alt={`${shot.brand} event design`}
                  sizes="(max-width: 720px) 94vw, 90vw"
                  loading="eager"
                />
                <span className={s.shot__caption}>{shot.brand} — view project →</span>
              </Link>
            ))}

            <p className={s.event__meta}>
              Stage design · Entry arches · Registration desks · Photobooths
              <span>
                {String(counter).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
              </span>
            </p>
          </>
        ) : (
          // Reduced motion: a plain grid under the title.
          <div className={s.event__grid}>
            {shots.map((shot) => (
              <Link
                key={shot.slug}
                href={`/work/${shot.slug}`}
                className={cx(s.shot, s['shot--static'])}
              >
                <Image
                  src={shot.src}
                  alt={`${shot.brand} event design`}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <span className={s.shot__caption}>{shot.brand} — view project →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
