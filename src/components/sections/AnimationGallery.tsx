'use client'

import { useEffect, useRef, useState } from 'react'
import { artPieces } from '@/data/portfolio'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import ArtCard from '@/components/ui/ArtCard'
import s from './AnimationGallery.module.css'

/*
 * Scroll-driven horizontal gallery: the section is made as tall as the track is wide, the stage
 * sticks to the viewport, and vertical scroll progress moves the track from right to left.
 */
export default function AnimationGallery() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [progress, setProgress] = useState(0)
  const pinned = !useReducedMotion()

  useEffect(() => {
    let frame = 0
    let travel = 0

    const update = () => {
      frame = 0
      const el = section.current
      if (!el || !travel) return setProgress(0)
      setProgress(Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel)))
    }
    const measure = () => {
      if (!track.current || !viewport.current) return
      travel = Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)
      setDistance(travel)
      update()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // ResizeObserver fires once on observe, which also does the initial measurement.
    const resizeObserver = new ResizeObserver(measure)
    if (track.current) resizeObserver.observe(track.current)
    if (viewport.current) resizeObserver.observe(viewport.current)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [pinned])

  return (
    <section
      id="art"
      ref={section}
      className={pinned ? `${s.art} ${s['art--pinned']}` : s.art}
      style={{ height: pinned ? `calc(100svh + ${distance}px)` : 'auto' }}
    >
      <div className={s.art__stage}>
        <div className={s.art__head}>
          <div>
            <p className="eyebrow">Maya · After Effects · Adobe Animate</p>
            <h2 className="section-title">3D &amp; 2D Animation</h2>
          </div>
        </div>

        <div ref={viewport} className={s.art__viewport}>
          <div
            ref={track}
            className={s.art__track}
            style={
              pinned ? { transform: `translate3d(${-progress * distance}px, 0, 0)` } : undefined
            }
          >
            {artPieces.map((piece) => (
              <ArtCard key={piece.url} piece={piece} />
            ))}
          </div>
        </div>

        {pinned && distance > 0 && (
          <div className={`container ${s.art__progress}`} aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
        )}
      </div>
    </section>
  )
}
