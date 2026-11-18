'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import s from './SplitText.module.css'

/**
 * Heading whose words rise one after another out of a mask the first time it scrolls into view.
 * Pass plain text; use `\n` for a line break and wrap words in *asterisks* to italicise them.
 * Screen readers get the plain sentence via aria-label.
 */
export default function SplitText({
  text,
  as: Tag = 'h2',
  className,
  stagger = 70,
}: {
  text: string
  as?: ElementType
  className?: string
  /** Delay between words, ms. */
  stagger?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen at load: play straight away; otherwise wait until it scrolls in.
    el.classList.add(s.ready!)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.add(s.in!)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let n = 0
  const lines = text.split('\n')
  const content: ReactNode[] = lines.map((line, li) => (
    <span key={li} className={s.line}>
      {line
        .split(' ')
        .filter(Boolean)
        .map((word, wi) => {
          const italic = word.startsWith('*') && word.endsWith('*')
          const clean = italic ? word.slice(1, -1) : word
          const i = n++
          return (
            <span key={wi} className={s.mask}>
              <span
                className={s.word}
                style={{ '--i': i, '--stagger': `${stagger}ms` } as CSSProperties}
              >
                {italic ? <em>{clean}</em> : clean}
              </span>{' '}
            </span>
          )
        })}
    </span>
  ))

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\*/g, '').replace(/\n/g, ' ')}>
      <span aria-hidden="true">{content}</span>
    </Tag>
  )
}
