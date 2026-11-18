'use client'

import { useEffect, useRef } from 'react'

/** Number that counts up from 0 the first time it scrolls into view (instantly for reduced motion). */
export default function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    el.textContent = `0${suffix}`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400)
          el.textContent = `${Math.round(to * (1 - (1 - p) ** 3))}${suffix}`
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, suffix])

  // Server HTML shows the final number, so it reads correctly without scripts.
  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  )
}
