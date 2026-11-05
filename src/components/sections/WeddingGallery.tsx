'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { weddingWorks as works } from '@/data/wedding'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import ImageLightbox from '@/components/work/ImageLightbox'
import SectionIntro from './SectionIntro'
import s from './WeddingGallery.module.css'

/*
 * Curved wedding gallery: the cards stand around a full ring and the viewer looks at its inside.
 * The camera sits towards the front of the ring, so the card in the middle is the furthest away
 * (small) and cards towards the edges come closer (large). Scrolling the pinned section turns the
 * ring one full revolution.
 */
const PERSPECTIVE = 850 // px
const PUSH_BACK = 0.3 // share of the radius the centre card sits behind the screen plane
const VISIBLE_DEG = 72 // cards further round than this are too close or behind the viewer, so hidden
const FADE_DEG = 16 // fade out over the last part of the visible arc

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function layout(vw: number, vh: number) {
  const mobile = vw < 720
  const cardH = mobile ? clamp(vh * 0.34, 200, 300) : clamp(vh * 0.44, 260, 440)
  const gap = cardH * 0.1
  const widths = works.map((w) => cardH * clamp(w.width / w.height, 0.72, 1.55))
  // Arc-length centre of each card, then close the loop with one more gap.
  const centres: number[] = []
  let run = 0
  widths.forEach((w, i) => {
    run += i === 0 ? w / 2 : widths[i - 1]! / 2 + gap + w / 2
    centres.push(run)
  })
  const circumference = run + widths[widths.length - 1]! / 2 + gap + widths[0]! / 2
  const radius = circumference / (2 * Math.PI)
  return { cardH, widths, centres, circumference, radius, scrollLength: circumference * 0.45 }
}

export default function WeddingGallery() {
  const section = useRef<HTMLElement>(null)
  const [size, setSize] = useState({ vw: 1440, vh: 900 })
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const pinned = !useReducedMotion()
  const { cardH, widths, centres, circumference, radius, scrollLength } = layout(size.vw, size.vh)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setSize((prev) =>
        prev.vw === window.innerWidth && prev.vh === window.innerHeight
          ? prev
          : { vw: window.innerWidth, vh: window.innerHeight },
      )
      const el = section.current
      if (!el) return
      const distance = el.offsetHeight - window.innerHeight
      setProgress(distance > 0 ? clamp(-el.getBoundingClientRect().top / distance, 0, 1) : 0)
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

  // Ring rotation in arc length: one full turn across the pinned scroll.
  const turned = progress * circumference

  // Angle of each card relative to the front, wrapped into -180..180 degrees.
  const angles = centres.map((c) => {
    const deg = (((c - turned) / radius) * 180) / Math.PI
    return ((((deg + 180) % 360) + 360) % 360) - 180
  })
  // The card facing the viewer gets its title shown under the ring.
  const activeIndex = angles.reduce(
    (best, deg, i) => (Math.abs(deg) < Math.abs(angles[best]!) ? i : best),
    0,
  )

  const cards = works.map((work, i) => {
    const deg = angles[i]!
    const visible = Math.abs(deg) < VISIBLE_DEG
    const opacity = clamp((VISIBLE_DEG - Math.abs(deg)) / FADE_DEG, 0, 1)
    const style: CSSProperties = {
      width: widths[i],
      height: cardH,
      opacity,
      visibility: visible ? 'visible' : 'hidden',
      transform:
        `translate(-50%, -50%) translateZ(${(radius * (1 - PUSH_BACK)).toFixed(1)}px) ` +
        `rotateY(${(-deg).toFixed(2)}deg) translateZ(${(-radius).toFixed(1)}px)`,
    }
    return { work, i, style }
  })

  if (!pinned) {
    // Reduced motion: a plain swipeable row.
    return (
      <>
        <SectionIntro id="weddings" lines={['Wedding', 'Designs']} />
        <section id="weddings-gallery" className={`${s.wedding} ${s['wedding--static']}`}>
          <div className={s.row}>
            {works.map((work, i) => (
              <button key={work.src} type="button" className={s.rowCard} onClick={() => setOpen(i)}>
                <Image
                  src={work.src}
                  alt={work.title}
                  width={work.width}
                  height={work.height}
                  sizes="320px"
                />
              </button>
            ))}
          </div>
          {open !== null && (
            <ImageLightbox
              items={works}
              index={open}
              onIndexChange={setOpen}
              onClose={() => setOpen(null)}
            />
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <SectionIntro id="weddings" lines={['Wedding', 'Designs']} />
      <section
        id="weddings-gallery"
        ref={section}
        className={s.wedding}
        style={{ height: `calc(100svh + ${Math.round(scrollLength)}px)` }}
      >
        <div className={s.stage} style={{ perspective: `${PERSPECTIVE}px` }}>
          <div className={s.ring}>
            {cards.map(({ work, i, style }) => (
              <button
                key={work.src}
                type="button"
                className={s.card}
                style={style}
                onClick={() => setOpen(i)}
                aria-label={`Open ${work.title}`}
                tabIndex={style.visibility === 'hidden' ? -1 : 0}
              >
                <Image
                  src={work.src}
                  alt={work.title}
                  width={work.width}
                  height={work.height}
                  sizes="(max-width: 720px) 60vw, 40vw"
                  loading="eager"
                />
              </button>
            ))}
          </div>

          <p className={s.caption} aria-live="polite">
            {works[activeIndex]!.title}
          </p>
        </div>

        {open !== null && (
          <ImageLightbox
            items={works}
            index={open}
            onIndexChange={setOpen}
            onClose={() => setOpen(null)}
          />
        )}
      </section>
    </>
  )
}
