'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery'
import Toolkit from './Toolkit'
import s from './EventIntro.module.css'

/*
 * Pinned intro for the Event Design section: the toolkit row greets you at the top of the frame,
 * lifts away as you scroll, and the big "Event Design" title settles into the centre while its
 * bright layer fills in from the left. The case studies follow below.
 */
const INTRO_HEIGHT = '240vh' // scroll length of the pinned intro
const TOOLKIT_EXIT = 0.3 // toolkit row has lifted away by this share of the scroll
const FILL_START = 0.15
const FILL_END = 0.8 // title fully filled

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

// Title letters, indexed across both words so the rise-in staggers left to right, top to bottom.
const TITLE_WORDS = (() => {
  let n = 0
  return ['Event', 'Design'].map((word) => [...word].map((ch) => ({ ch, i: n++ })))
})()

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')

export default function EventIntro() {
  const wrap = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [titleIn, setTitleIn] = useState(false)
  const isMobile = useMediaQuery('(max-width: 719.98px)')
  const pinned = !useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = wrap.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      // Letters rise in once the intro's top reaches the lower part of the screen.
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

  const toolkitOut = Math.min(1, progress / TOOLKIT_EXIT)
  const toolkitStyle: CSSProperties = {
    opacity: 1 - toolkitOut,
    transform: `translate3d(0, ${(-toolkitOut * 60).toFixed(1)}px, 0)`,
    visibility: toolkitOut >= 1 ? 'hidden' : undefined,
  }

  const fill = clamp01((progress - FILL_START) / (FILL_END - FILL_START))
  const shift = (1 - toolkitOut) * (isMobile ? 70 : 90)
  const titleStyle = {
    transform: `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${(0.92 + Math.min(1, progress / TOOLKIT_EXIT) * 0.08).toFixed(3)})`,
    '--fill': `${(fill * 100).toFixed(1)}%`,
  } as CSSProperties

  return (
    <div
      ref={wrap}
      className={cx(s.intro, pinned && s['intro--pinned'])}
      style={pinned ? { height: INTRO_HEIGHT } : undefined}
    >
      <div className={s.intro__stage}>
        <div className={s.intro__toolkit} style={pinned ? toolkitStyle : undefined}>
          <Toolkit />
        </div>

        <h2
          className={cx(s.title, titleIn && s['title--in'])}
          style={pinned ? titleStyle : ({ '--fill': '100%' } as CSSProperties)}
          aria-label="Event Design"
        >
          {/* Faded base layer, plus a bright copy revealed left to right as you scroll. */}
          {(['base', 'fill'] as const).map((layer) => (
            <span
              key={layer}
              className={cx(s.title__layer, s[`title__layer--${layer}`])}
              aria-hidden="true"
            >
              {TITLE_WORDS.map((word, w) => (
                <span key={w} className={s.title__word}>
                  {word.map((l) => (
                    <span
                      key={l.i}
                      className={s.title__letter}
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

        {pinned && (
          <p className={s.intro__meta}>
            Stage design · Entry arches · Registration desks · Photobooths
          </p>
        )}
      </div>
    </div>
  )
}
