import type { ReactNode } from 'react'
import { services } from '@/data/portfolio'
import type { Service } from '@/types'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import s from './Services.module.css'

// Simple line icons, drawn on a 32×32 grid.
const icons: Record<Service['icon'], ReactNode> = {
  stage: (
    <>
      <rect x="4" y="6" width="24" height="13" rx="1.5" />
      <path d="M2 25h28M6 19v6M26 19v6M11 10h10M9 14h14" />
    </>
  ),
  arch: (
    <>
      <path d="M5 28V14a11 11 0 0 1 22 0v14" />
      <path d="M10 28V15a6 6 0 0 1 12 0v13M2 28h28" />
    </>
  ),
  desk: (
    <>
      <rect x="4" y="13" width="24" height="12" rx="1.5" />
      <path d="M8 13V6h16v7M4 19h24M9 25v3M23 25v3" />
    </>
  ),
  badge: (
    <>
      <path d="M12 3l4 6 4-6" />
      <rect x="8" y="9" width="16" height="20" rx="2" />
      <circle cx="16" cy="17" r="3" />
      <path d="M12 24h8" />
    </>
  ),
  wedding: (
    <>
      <circle cx="12" cy="19" r="7" />
      <circle cx="20" cy="19" r="7" />
      <path d="M13 6l3 4 3-4" />
    </>
  ),
  cube: (
    <>
      <path d="M16 3l11 6v14l-11 6-11-6V9z" />
      <path d="M5 9l11 6 11-6M16 15v14" />
    </>
  ),
}

// What clients can hire Ashna for: mainly 2D event design, with 3D mock-ups to present it.
export default function Services() {
  return (
    <section id="services" className={s.services}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">What I do</p>
        </Reveal>
        <SplitText
          className={s.title}
          text={'2D design for events & weddings,\n*shown* *in* *3D* before it’s built.'}
        />

        <ul className={s.grid}>
          {services.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={(i % 3) * 120} className={s.cardWrap}>
                <div className={s.card}>
                  <svg className={s.icon} viewBox="0 0 32 32" aria-hidden="true">
                    {icons[service.icon]}
                  </svg>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
