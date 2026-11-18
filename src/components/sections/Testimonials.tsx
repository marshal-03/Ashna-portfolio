import { testimonials } from '@/data/portfolio'
import Reveal from '@/components/ui/Reveal'
import s from './Testimonials.module.css'

// Client quotes. Renders nothing until real quotes are added in data/portfolio.ts.
export default function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section id="testimonials" className={s.testimonials}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">Kind words</p>
        </Reveal>
        <ul className={s.list}>
          {testimonials.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 120}>
                <figure className={s.card}>
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
