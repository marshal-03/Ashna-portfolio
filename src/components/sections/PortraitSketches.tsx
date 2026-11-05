'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { portraits } from '@/data/portraits'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import ImageLightbox from '@/components/work/ImageLightbox'
import SectionIntro from './SectionIntro'
import s from './PortraitSketches.module.css'

/*
 * Portrait sketches pile up like drawings on a table: the section is pinned, and as you scroll each
 * sketch slides up from below and lands on top of the previous one at a slight angle, while the
 * ones underneath sink back a little. Scrolling up lifts them off again.
 */
const TILT = [-3, 2.5, -1.5, 3.5, -2.5] // resting angle of each card, degrees
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeOut = (x: number) => 1 - (1 - x) ** 3

export default function PortraitSketches() {
  const section = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const pinned = !useReducedMotion()
  const n = portraits.length

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = section.current
      if (!el) return
      const distance = el.offsetHeight - window.innerHeight
      setProgress(distance > 0 ? clamp01(-el.getBoundingClientRect().top / distance) : 0)
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

  // The first sketch is already on the table; the others arrive one per slice of the scroll.
  const slice = 1 / (n - 1)
  const arrival = (i: number) =>
    i === 0 ? 1 : easeOut(clamp01((progress - (i - 1) * slice) / slice))
  const landed = portraits.reduce((count, _, i) => (arrival(i) > 0.5 ? i : count), 0)
  const current = portraits[landed]!

  const lightbox =
    open !== null ? (
      <ImageLightbox
        items={portraits}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
      />
    ) : null

  if (!pinned) {
    return (
      <>
        <SectionIntro id="portraits" lines={['Portrait', 'Sketches']} />
        <section id="portraits-gallery" className={`${s.portraits} ${s['portraits--static']}`}>
          <div className={s.grid}>
            {portraits.map((p, i) => (
              <button key={p.src} type="button" className={s.gridCard} onClick={() => setOpen(i)}>
                <Image
                  src={p.src}
                  alt={p.title}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 720px) 90vw, 30vw"
                />
                <span>
                  {p.title} · {p.medium}
                </span>
              </button>
            ))}
          </div>
          {lightbox}
        </section>
      </>
    )
  }

  return (
    <>
      <SectionIntro id="portraits" lines={['Portrait', 'Sketches']} />
      <section
        id="portraits-gallery"
        ref={section}
        className={s.portraits}
        style={{ height: `${100 + (n - 1) * 80}svh` }}
      >
        <div className={s.stage}>
          <div className={s.pile}>
            {portraits.map((p, i) => {
              const a = arrival(i)
              // How many sketches have landed on top of this one (pushes it back a little).
              const covered = portraits.reduce((sum, _, j) => (j > i ? sum + arrival(j) : sum), 0)
              const style: CSSProperties = {
                aspectRatio: `${p.width} / ${p.height}`,
                zIndex: i + 1,
                opacity: a > 0 ? 1 : 0,
                transform:
                  `translate(-50%, -50%) translate3d(0, ${((1 - a) * 110).toFixed(2)}vh, 0) ` +
                  `rotate(${(TILT[i % TILT.length]! * a + (1 - a) * 8).toFixed(2)}deg) ` +
                  `scale(${(1 - Math.min(covered, 3) * 0.04).toFixed(3)})`,
                filter: `brightness(${(1 - Math.min(covered, 3) * 0.12).toFixed(2)})`,
              }
              return (
                <button
                  key={p.src}
                  type="button"
                  className={s.card}
                  style={style}
                  onClick={() => setOpen(i)}
                  aria-label={`Open ${p.title}`}
                  tabIndex={a > 0.5 ? 0 : -1}
                >
                  <Image
                    src={p.src}
                    alt={p.title}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 720px) 80vw, 40vw"
                    loading="eager"
                  />
                </button>
              )
            })}
          </div>

          <p className={s.caption} aria-live="polite">
            <span className={s.caption__title}>{current.title}</span>
            <span className={s.caption__medium}>{current.medium}</span>
          </p>
        </div>
        {lightbox}
      </section>
    </>
  )
}
