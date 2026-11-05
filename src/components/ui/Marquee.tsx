'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import s from './Marquee.module.css'

/**
 * Endless strip that drifts on its own AND can be moved by hand.
 *
 * It's a real horizontal scroller (so touch swipes get native momentum), with the content repeated
 * `copies` times. A frame loop keeps it drifting and quietly jumps by one copy width near the ends,
 * so it never runs out.
 *
 * Only *sideways* input counts as manual: a horizontal swipe, a horizontal trackpad / shift+wheel
 * scroll, or a mouse drag. That pauses the drift until shortly after the visitor lets go. Scrolling
 * the page up or down over the strip (mouse wheel or finger) never stops it.
 * Reduced-motion visitors get no drift but can still scroll it.
 */
const RESUME_AFTER_MS = 1200

export default function Marquee({
  children,
  copies = 4,
  secondsPerCopy = 30,
  direction = 'left',
  className,
  label,
}: {
  /** One copy of the strip's content. */
  children: ReactNode
  copies?: number
  /** How long one copy takes to drift past. */
  secondsPerCopy?: number
  /** 'left': content moves right-to-left. 'right': left-to-right. */
  direction?: 'left' | 'right'
  className?: string
  label?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scroller.current
    const inner = track.current
    if (!el || !inner) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const copyWidth = () => inner.scrollWidth / copies
    let pos = copyWidth() // start one copy in, so there's room to move both ways
    el.scrollLeft = pos

    let manual = false // a sideways touch or mouse drag is in progress
    let resumeAt = 0
    const holdOff = () => (resumeAt = performance.now() + RESUME_AFTER_MS)

    let frame = 0
    let last = performance.now()
    let onScreen = false
    const tick = (now: number) => {
      if (!onScreen) {
        frame = 0 // sleep until the strip is visible again
        return
      }
      const dt = Math.min(64, now - last) / 1000
      last = now
      const drifting = !reduced && !manual && now >= resumeAt
      // `pos` keeps sub-pixel precision (browsers may round scrollLeft, which would stall a slow
      // drift); while the visitor moves it themselves, follow the real position instead.
      if (drifting) pos += (copyWidth() / secondsPerCopy) * dt * (direction === 'left' ? 1 : -1)
      else pos = el.scrollLeft

      // Stay within the middle copies so both ends are always "endless".
      const w = copyWidth()
      let jumped = false
      if (w && pos < w * 0.5) {
        pos += w
        jumped = true
      } else if (w && pos > w * (copies - 1.5)) {
        pos -= w
        jumped = true
      }
      if (drifting || jumped) el.scrollLeft = pos
      frame = requestAnimationFrame(tick)
    }
    // Only run the loop while the strip is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting)
      if (onScreen && !frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    observer.observe(el)

    // --- Touch: only a mostly-horizontal swipe takes over ---
    let tx = 0
    let ty = 0
    let touchDecided = false
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      tx = t.clientX
      ty = t.clientY
      touchDecided = false
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t || touchDecided) return
      const dx = Math.abs(t.clientX - tx)
      const dy = Math.abs(t.clientY - ty)
      if (dx < 6 && dy < 6) return
      touchDecided = true
      if (dx > dy) manual = true // sideways swipe: hand control to the finger
    }
    const onTouchEnd = () => {
      if (manual) {
        manual = false
        holdOff() // let the swipe's momentum settle before drifting again
      }
    }

    // --- Wheel / trackpad: only horizontal scrolling counts ---
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) holdOff()
    }

    // --- Mouse: click and drag sideways ---
    let dragging = false
    let dragX = 0
    let dragStart = 0
    let moved = false
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      moved = false
      manual = true
      dragX = e.clientX
      dragStart = el.scrollLeft
      el.classList.add(s.dragging)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - dragX
      if (Math.abs(dx) > 3) moved = true
      el.scrollLeft = dragStart - dx
    }
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      manual = false
      el.classList.remove(s.dragging)
      holdOff()
    }
    // A drag shouldn't also count as a click on whatever is under the cursor.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    const onDragStart = (e: DragEvent) => e.preventDefault() // no ghost-image dragging

    const onResize = () => {
      pos = copyWidth()
      el.scrollLeft = pos
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    el.addEventListener('click', onClick, true)
    el.addEventListener('dragstart', onDragStart)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('resize', onResize)
    }
  }, [copies, secondsPerCopy, direction])

  return (
    <div
      ref={scroller}
      className={className ? `${s.scroller} ${className}` : s.scroller}
      aria-label={label}
    >
      <div ref={track} className={s.track}>
        {Array.from({ length: copies }, (_, n) => (
          <div key={n} className={s.copy} aria-hidden={n > 0 || undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
