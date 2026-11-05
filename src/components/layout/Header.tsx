'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { profile } from '@/data/portfolio'
import s from './Header.module.css'

const links = [
  { label: 'Works', href: '/#event-design' },
  { label: 'Weddings', href: '/#weddings' },
  { label: 'Sketches', href: '/#portraits' },
  { label: 'Animations', href: '/#art' },
  { label: 'About', href: '/#about' },
]

// Slide the header away while scrolling in either direction (so sections like Event Design fill
// the screen), and bring it back once scrolling pauses or the visitor is back at the top.
const SHOW_AFTER_IDLE_MS = 700

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let idleTimer: ReturnType<typeof setTimeout> | undefined

    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 40)
      if (y <= 120) setHidden(false)
      else if (Math.abs(y - lastY) > 6) setHidden(true)
      lastY = y

      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setHidden(false), SHOW_AFTER_IDLE_MS)
    }
    // At most once per frame, however many scroll events arrive.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // Pick up the initial position (e.g. after a reload part-way down the page).
    const first = requestAnimationFrame(() => setScrolled(window.scrollY > 40))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimer)
    }
  }, [])

  return (
    <header
      className={[s.header, scrolled && s['header--solid'], hidden && s['header--hidden']]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={s.header__inner}>
        <nav className={s.header__nav} aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={s.header__right}>
          <Link href="/" className={s.header__id}>
            <span className={s.header__name}>{profile.name}</span>
            <span className={s.header__since}>[{profile.since}]</span>
          </Link>
          <Link href="/#contact" className={`btn btn--light ${s.header__cta}`}>
            Let’s Talk
          </Link>
        </div>
      </div>
    </header>
  )
}
