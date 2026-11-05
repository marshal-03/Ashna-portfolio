'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import s from './SectionIntro.module.css'

/*
 * Full-screen pinned intro used before Event Design, Weddings and Animation: a big serif title on
 * the purple gradient that rises up from the bottom of the screen as you scroll, line by line.
 * An optional `top` slot (e.g. the toolkit row) greets you first and lifts away as the title rises.
 */
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeOut = (x: number) => 1 - (1 - x) ** 3

export default function SectionIntro({
  id,
  lines,
  top,
  meta,
}: {
  id?: string
  /** Title lines, e.g. ['Event', 'Design']. */
  lines: string[]
  /** Optional content pinned at the top of the frame before the title arrives. */
  top?: ReactNode
  /** Small uppercase line along the bottom of the frame. */
  meta?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const pinned = !useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = wrap.current
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

  // With a top slot it leaves first (0–25% of the scroll) while the title starts rising.
  const topOut = top ? clamp01(progress / 0.25) : 1
  const riseStart = top ? 0.12 : 0
  const RISE = 0.45 // share of the scroll each line takes to arrive
  const STAGGER = 0.1 // later lines start a little after earlier ones

  const lineStyle = (i: number): CSSProperties => {
    if (!pinned) return {}
    const t = clamp01((progress - riseStart - i * STAGGER) / RISE)
    return {
      transform: `translate3d(0, ${((1 - easeOut(t)) * 55).toFixed(2)}vh, 0)`,
      opacity: clamp01(t * 1.6),
    }
  }

  return (
    <div
      id={id}
      ref={wrap}
      className={pinned ? `${s.intro} ${s['intro--pinned']}` : s.intro}
      style={pinned ? { height: top ? '260vh' : '200vh' } : undefined}
    >
      <div className={s.stage}>
        {top && (
          <div
            className={s.top}
            style={
              pinned
                ? {
                    opacity: 1 - topOut,
                    transform: `translate3d(0, ${(-topOut * 60).toFixed(1)}px, 0)`,
                    visibility: topOut >= 1 ? 'hidden' : undefined,
                  }
                : undefined
            }
          >
            {top}
          </div>
        )}

        <h2 className={s.title} aria-label={lines.join(' ')}>
          {lines.map((line, i) => (
            <span key={line} className={s.line} style={lineStyle(i)} aria-hidden="true">
              {line}
            </span>
          ))}
        </h2>

        {meta && pinned && <p className={s.meta}>{meta}</p>}
      </div>
    </div>
  )
}
