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

  /*
   * Subtle depth: titles and portrait drift a few pixels with the mouse, in opposite directions.
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
    let target = { x: 0, y: 0 }
    const onPointerMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          el.style.setProperty('--px', target.x.toFixed(3))
          el.style.setProperty('--py', target.y.toFixed(3))
        })
      }
    }

    el.addEventListener('pointermove', onPointerMove)
    return () => {
      el.removeEventListener('pointermove', onPointerMove)
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
        <p>{profile.intro}</p>
        <a href={profile.resumeUrl} className="btn" download>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7v8m0 0-3.2-3.2M12 15l3.2-3.2M7.5 4.6A9 9 0 1 0 16.5 4.6"
            />
          </svg>
          Download My CV
        </a>
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
