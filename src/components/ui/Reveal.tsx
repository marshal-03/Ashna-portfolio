'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import s from './Reveal.module.css'

/**
 * Animates its content in whenever it scrolls into view, in both directions:
 *  - scrolling down, it pops up from below;
 *  - scrolling up, it drops in from above.
 * Once a block is completely off screen it quietly resets, so the effect replays next time.
 *
 * Content is visible in the server HTML and is only hidden after mount, so nothing stays
 * invisible if scripts fail; reduced-motion users get no animation.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  /** Stagger in milliseconds, e.g. for side-by-side items. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Jump to a hidden state without animating (the block is off screen at this point).
    const hide = (from: 'below' | 'above') => {
      el.style.transition = 'none'
      el.classList.remove(s.in, s.pending, s['pending--above'])
      el.classList.add(from === 'below' ? s.pending : s['pending--above'])
      void el.offsetHeight
      el.style.transition = ''
    }
    const show = () => {
      el.classList.remove(s.pending, s['pending--above'])
      el.classList.add(s.in)
    }

    // Blocks already on screen at load stay put; the rest wait below.
    const r = el.getBoundingClientRect()
    if (r.top >= window.innerHeight) hide('below')
    else if (r.bottom <= 0) hide('above')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.intersectionRatio >= 0.12) {
          show()
        } else if (!entry.isIntersecting) {
          // Fully out of view: reset on the side it left from, ready to come back in.
          hide(entry.boundingClientRect.top > 0 ? 'below' : 'above')
        }
      },
      { threshold: [0, 0.12] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className ? `${s.reveal} ${className}` : s.reveal}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
