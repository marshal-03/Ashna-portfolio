import Image from 'next/image'
import { profile } from '@/data/portfolio'
import designerPill from '@/assets/images/designer-pill.webp'
import brandsStrip from '@/assets/images/brands-strip.webp'
import s from './About.module.css'

// Split the bio so the illustration sits inline right before "2D Designer", like the mock-up.
const marker = '2D designer'
const at = profile.bio.indexOf(marker)
const [before, after] =
  at === -1 ? [profile.bio, ''] : [profile.bio.slice(0, at), profile.bio.slice(at)]

const brandNames =
  'Coca-Cola, Google, Apollo, SolarWinds, Tata Elxsi, Britannia, CSG, Gamechange Solar'

export default function About() {
  return (
    <section id="about" className={s.about}>
      <div className="container">
        <p className={s.about__bio}>
          {before}
          <Image src={designerPill} alt="" className={s.about__pill} />
          {after}
        </p>
      </div>

      <div className={s.brands}>
        <h2 className={s.brands__title}>Working Brands</h2>
        <div className={s.brands__marquee} aria-label="Brands I have worked with">
          <div className={s.brands__track}>
            <Image src={brandsStrip} alt={brandNames} />
            <Image src={brandsStrip} alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
