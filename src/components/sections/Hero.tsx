'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { profile, socials } from '@/data/portfolio'
import SocialIcon from '@/components/ui/SocialIcon'
import heroBg from '@/assets/images/hero-bg.webp'
import portrait from '@/assets/images/portrait.webp'
import s from './Hero.module.css'

const [roleTop, roleBottom] = profile.role.split(' ')
const followLinks = socials.filter((link) => link.kind !== 'artstation')

const delay = (d: string) => ({ '--d': d }) as CSSProperties

export default function Hero() {
  const hero = useRef<HTMLElement>(null)

  // The sheen repaints the big blurred-shadow text every frame, so only run it while the hero shows.
  useEffect(() => {
    const el = hero.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) =>
      el.classList.toggle(s['hero--away']!, !entry?.isIntersecting),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /*
   * Mouse depth: the "PORTFOLIO" backdrop, the portrait and the two titles each drift by a different
   * amount as the mouse moves, so the hero feels layered. A frame loop eases towards the pointer
   * (smoother than restarting a CSS transition on every mouse event) and stops once settled.
   * Only on devices with a fine pointer, and never when reduced motion is requested.
   */
  useEffect(() => {
    const el = hero.current
    if (!el) return
    const canParallax =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canParallax) return

    let frame = 0
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }

    const tick = () => {
      // Ease ~10% of the remaining distance per frame.
      current.x += (target.x - current.x) * 0.1
      current.y += (target.y - current.y) * 0.1
      el.style.setProperty('--px', current.x.toFixed(4))
      el.style.setProperty('--py', current.y.toFixed(4))
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width - 0.5
      target.y = (e.clientY - r.top) / r.height - 0.5
      start()
    }
    const onPointerLeave = () => {
      target.x = 0
      target.y = 0
      start()
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)
    return () => {
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="hero"
      ref={hero}
      className={s.hero}
      style={{ '--hero-bg': `url(${heroBg.src})` } as CSSProperties}
    >
      <Image
        className={s.hero__portrait}
        src={portrait}
        alt={`Portrait of ${profile.name}`}
        sizes="(max-width: 900px) 100vw, 64vw"
        preload
      />

      {/* Each line slides up from behind a mask; the big words carry a slow light sheen. */}
      <h1 className={s.hero__hello}>
        <span className={s.line}>
          <span className={`${s.line__in} ${s.hero__hi}`} style={delay('0.5s')}>
            Hi I’m
          </span>
        </span>
        <span className={s.line}>
          <span className={`${s.line__in} ${s.hero__first} ${s.sheen}`} style={delay('0.85s')}>
            {profile.firstName}
          </span>
        </span>
      </h1>

      <p className={s.hero__role} aria-label={profile.role}>
        <span className={s.line}>
          <span className={`${s.line__in} ${s['hero__role-top']}`} style={delay('1.1s')}>
            {roleTop}
          </span>
        </span>
        <span className={s.line}>
          <span
            className={`${s.line__in} ${s['hero__role-bottom']} ${s.sheen}`}
            style={delay('1.45s')}
          >
            {roleBottom}
          </span>
        </span>
      </p>

      <div className={s.hero__intro}>
        <p className={s.hero__tag}>Event · Brand · Wedding Design</p>
        <p>{profile.intro}</p>
        <div className={s.hero__ctas}>
          <a href="#contact" className="btn">
            Start a project
            <span aria-hidden="true">→</span>
          </a>
          <a href={profile.resumeUrl} className={s.hero__cv} download>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7v8m0 0-3.2-3.2M12 15l3.2-3.2M7.5 4.6A9 9 0 1 0 16.5 4.6"
              />
            </svg>
            Download CV
          </a>
        </div>
      </div>

      <div className={s.hero__follow}>
        <span>Follow:</span>
        {followLinks.map((link) => (
          <a
            key={link.kind}
            href={link.url}
            target="_blank"
            rel="noopener"
            aria-label={link.label}
            className={s.hero__social}
          >
            <SocialIcon kind={link.kind} />
          </a>
        ))}
      </div>
    </section>
  )
}
