'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMounted, usePhone, useReducedMotion } from '@/hooks/useMediaQuery'
import s from './SectionIntro.module.css'

/*
 * Full-screen pinned intro used before Event Design, Weddings and Animation: a big serif title on
 * the purple gradient that rises up from the bottom of the screen as you scroll, line by line.
 * An optional `top` slot (e.g. the toolkit row) greets you first and lifts away as the title rises.
 *
 * The scroll animation writes styles straight onto the elements (no React re-render per frame),
 * and does nothing while the intro is off screen.
 */
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeOut = (x: number) => 1 - (1 - x) ** 3
const RISE = 0.45 // share of the scroll each line takes to arrive
const STAGGER = 0.1 // later lines start a little after earlier ones

export default function SectionIntro({
  id,
  lines,
  top,
}: {
  id?: string
  /** Title lines, e.g. ['Event', 'Design']. */
  lines: string[]
  /** Optional content pinned at the top of the frame before the title arrives. */
  top?: ReactNode
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reduced = useReducedMotion()
  const phone = usePhone()
  // Phones skip the 2–2.6 screen pinned scroll (it left a lot of empty scrolling); the title just
  // rises into place once it comes into view.
  const mounted = useMounted()
  const pinned = mounted && !reduced && !phone
  const rise = mounted && !reduced && phone
  const hasTop = Boolean(top)

  useEffect(() => {
    const el = wrap.current
    if (!el || !rise) return
    // Clear anything the pinned animation wrote before the layout switched.
    const t = topRef.current
    if (t) {
      t.style.opacity = ''
      t.style.transform = ''
      t.style.visibility = ''
    }
    lineRefs.current.forEach((line) => {
      if (!line) return
      line.style.transform = ''
      line.style.opacity = ''
    })
    el.classList.remove(s['intro--in']!)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.add(s['intro--in']!)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rise])

  useEffect(() => {
    const el = wrap.current
    if (!el || !pinned) return
    let frame = 0
    let last = -1

    const update = () => {
      frame = 0
      const distance = el.offsetHeight - window.innerHeight
      const progress = distance > 0 ? clamp01(-el.getBoundingClientRect().top / distance) : 0
      if (progress === last) return
      last = progress

      // With a top slot it leaves first (0–25% of the scroll) while the title starts rising.
      const topOut = hasTop ? clamp01(progress / 0.25) : 1
      const riseStart = hasTop ? 0.12 : 0
      const t = topRef.current
      if (t) {
        t.style.opacity = String(1 - topOut)
        t.style.transform = `translate3d(0, ${(-topOut * 60).toFixed(1)}px, 0)`
        t.style.visibility = topOut >= 1 ? 'hidden' : ''
      }
      lineRefs.current.forEach((line, i) => {
        if (!line) return
        const p = clamp01((progress - riseStart - i * STAGGER) / RISE)
        line.style.transform = `translate3d(0, ${((1 - easeOut(p)) * 55).toFixed(2)}vh, 0)`
        line.style.opacity = String(clamp01(p * 1.6))
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // Only listen to scrolling while the intro is near the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.addEventListener('scroll', schedule, { passive: true })
          schedule()
        } else {
          window.removeEventListener('scroll', schedule)
          schedule() // settle on the final state once it has left
        }
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
  }, [pinned, hasTop])

  return (
    <div
      id={id}
      ref={wrap}
      className={[s.intro, pinned && s['intro--pinned'], rise && s['intro--rise']]
        .filter(Boolean)
        .join(' ')}
      // Kept short (users found the long pinned intros slow): about half a screen of scroll each.
      style={pinned ? { height: top ? '170vh' : '150vh' } : undefined}
    >
      <div className={s.stage}>
        {top && (
          <div ref={topRef} className={s.top}>
            {top}
          </div>
        )}

        <h2 className={s.title} aria-label={lines.join(' ')}>
          {lines.map((line, i) => (
            <span
              key={line}
              ref={(node) => {
                lineRefs.current[i] = node
              }}
              className={s.line}
              style={
                pinned
                  ? { transform: 'translate3d(0, 55vh, 0)', opacity: 0 }
                  : rise
                    ? { transitionDelay: `${i * 140}ms` }
                    : undefined
              }
              aria-hidden="true"
            >
              {line}
            </span>
          ))}
        </h2>
      </div>
    </div>
  )
}
