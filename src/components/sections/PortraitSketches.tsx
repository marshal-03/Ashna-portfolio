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

// The first sketch is already on the table; the others arrive one per slice of the scroll.
function arrivals(progress: number, n: number) {
  const slice = 1 / (n - 1)
  return Array.from({ length: n }, (_, i) =>
    i === 0 ? 1 : easeOut(clamp01((progress - (i - 1) * slice) / slice)),
  )
}

function cardStyle(i: number, arr: number[]): CSSProperties {
  const a = arr[i]!
  // How many sketches have landed on top of this one (pushes it back a little).
  const covered = arr.reduce((sum, v, j) => (j > i ? sum + v : sum), 0)
  return {
    opacity: a > 0 ? 1 : 0,
    transform:
      `translate(-50%, -50%) translate3d(0, ${((1 - a) * 110).toFixed(2)}vh, 0) ` +
      `rotate(${(TILT[i % TILT.length]! * a + (1 - a) * 8).toFixed(2)}deg) ` +
      `scale(${(1 - Math.min(covered, 3) * 0.04).toFixed(3)})`,
    filter: `brightness(${(1 - Math.min(covered, 3) * 0.12).toFixed(2)})`,
  }
}

const topmost = (arr: number[]) => arr.reduce((count, a, i) => (a > 0.5 ? i : count), 0)

export default function PortraitSketches() {
  const section = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [landed, setLanded] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const pinned = !useReducedMotion()
  const n = portraits.length

  // Scrolling rewrites each card's style directly; React only re-renders when the top card changes.
  useEffect(() => {
    const el = section.current
    if (!el || !pinned) return
    let frame = 0
    let last = -1
    const update = () => {
      frame = 0
      const distance = el.offsetHeight - window.innerHeight
      const progress = distance > 0 ? clamp01(-el.getBoundingClientRect().top / distance) : 0
      if (progress === last) return
      last = progress
      const arr = arrivals(progress, n)
      arr.forEach((a, i) => {
        const card = cardRefs.current[i]
        if (!card) return
        const st = cardStyle(i, arr)
        card.style.opacity = String(st.opacity)
        card.style.transform = String(st.transform)
        card.style.filter = String(st.filter)
        card.tabIndex = a > 0.5 ? 0 : -1
      })
      setLanded(topmost(arr))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) window.addEventListener('scroll', schedule, { passive: true })
        else window.removeEventListener('scroll', schedule)
        schedule()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(el)
    schedule()
    window.addEventListener('resize', schedule)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [pinned, n])

  const initial = arrivals(0, n)
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
              const style: CSSProperties = {
                aspectRatio: `${p.width} / ${p.height}`,
                zIndex: i + 1,
                ...cardStyle(i, initial),
              }
              return (
                <button
                  key={p.src}
                  type="button"
                  ref={(node) => {
                    cardRefs.current[i] = node
                  }}
                  className={s.card}
                  style={style}
                  onClick={() => setOpen(i)}
                  aria-label={`Open ${p.title}`}
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
