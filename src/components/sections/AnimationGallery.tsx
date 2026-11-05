'use client'

import { useEffect, useRef, useState } from 'react'
import { artPieces } from '@/data/portfolio'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import ArtCard from '@/components/ui/ArtCard'
import SectionIntro from './SectionIntro'
import s from './AnimationGallery.module.css'

/*
 * Scroll-driven horizontal gallery: the section is made as tall as the track is wide, the stage
 * sticks to the viewport, and vertical scroll progress moves the track from right to left.
 */
export default function AnimationGallery() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)
  const pinned = !useReducedMotion()

  useEffect(() => {
    let frame = 0
    let travel = 0
    let last = -1

    // Scrolling moves the track by writing its transform directly (no React re-render per frame).
    const update = () => {
      frame = 0
      const el = section.current
      if (!el || !pinned) return
      const progress = travel
        ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel))
        : 0
      if (progress === last) return
      last = progress
      if (track.current)
        track.current.style.transform = `translate3d(${-progress * travel}px, 0, 0)`
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
    }
    const measure = () => {
      if (!track.current || !viewport.current) return
      travel = Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)
      setDistance(travel)
      last = -1
      update()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // ResizeObserver fires once on observe, which also does the initial measurement.
    const resizeObserver = new ResizeObserver(measure)
    if (track.current) resizeObserver.observe(track.current)
    if (viewport.current) resizeObserver.observe(viewport.current)
    // Only follow the scroll while the gallery is near the screen.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) window.addEventListener('scroll', schedule, { passive: true })
        else window.removeEventListener('scroll', schedule)
        schedule()
      },
      { rootMargin: '200px 0px' },
    )
    if (section.current) visibility.observe(section.current)
    return () => {
      visibility.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [pinned])

  return (
    <>
      <SectionIntro id="art" lines={['Animations']} />
      <section
        id="art-gallery"
        ref={section}
        className={pinned ? `${s.art} ${s['art--pinned']}` : s.art}
        style={{ height: pinned ? `calc(100svh + ${distance}px)` : 'auto' }}
      >
        <div className={s.art__stage}>
          <div ref={viewport} className={s.art__viewport}>
            <div ref={track} className={s.art__track}>
              {artPieces.map((piece) => (
                <ArtCard key={piece.url} piece={piece} />
              ))}
            </div>
          </div>

          {pinned && distance > 0 && (
            <div className={`container ${s.art__progress}`} aria-hidden="true">
              <span ref={bar} style={{ transform: 'scaleX(0)' }} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
