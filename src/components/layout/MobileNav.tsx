'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import s from './MobileNav.module.css'

// Phone-only bottom bar mirroring the header menu, as icons. The section you're in is highlighted.
const items: { label: string; href: string; ids: string[]; icon: ReactNode }[] = [
  {
    label: 'Works',
    href: '/#event-design',
    ids: ['event-design'],
    icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  },
  {
    label: 'Weddings',
    href: '/#weddings',
    ids: ['weddings', 'weddings-gallery'],
    icon: (
      <>
        <circle cx="9" cy="14" r="5.5" />
        <circle cx="15" cy="14" r="5.5" />
        <path d="M7.5 5.5 9 3h6l1.5 2.5L12 8.5z" />
      </>
    ),
  },
  {
    label: 'Sketches',
    href: '/#portraits',
    ids: ['portraits', 'portraits-gallery'],
    icon: (
      <>
        <path d="M4 20l1.2-4.6L15.6 5a2.1 2.1 0 0 1 3 0l.4.4a2.1 2.1 0 0 1 0 3L8.6 18.8z" />
        <path d="M13.8 6.8l3.4 3.4M4 20h6" />
      </>
    ),
  },
  {
    label: 'Animations',
    href: '/#art',
    ids: ['art', 'art-gallery'],
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'About',
    href: '/#about',
    ids: ['about'],
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.8" />
        <path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" />
      </>
    ),
  },
]

export default function MobileNav() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // The section whose top has passed 40% of the screen is the one being read.
      const line = window.innerHeight * 0.4
      let current: string | null = null
      let best = -Infinity
      for (const item of items) {
        for (const id of item.ids) {
          const top = document.getElementById(id)?.getBoundingClientRect().top
          if (top !== undefined && top <= line && top > best) {
            best = top
            current = item.label
          }
        }
      }
      // Past Contact / before Works nothing is highlighted.
      const contact = document.getElementById('contact')?.getBoundingClientRect().top
      if (contact !== undefined && contact <= line) current = null
      setActive(current)
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
  }, [])

  return (
    <nav className={s.bar} aria-label="Sections">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={active === item.label ? `${s.item} ${s['item--active']}` : s.item}
          aria-label={item.label}
          aria-current={active === item.label ? 'location' : undefined}
          title={item.label}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {item.icon}
          </svg>
        </Link>
      ))}
    </nav>
  )
}
