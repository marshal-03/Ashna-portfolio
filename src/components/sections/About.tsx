import Image from 'next/image'
import { profile } from '@/data/portfolio'
import designerPill from '@/assets/images/designer-pill.webp'
import brandsStrip from '@/assets/images/brands-strip.webp'
import Marquee from '@/components/ui/Marquee'
import CountUp from '@/components/ui/CountUp'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import { works } from '@/data/works'
import s from './About.module.css'

// Split the bio so the illustration sits inline right before "2D Designer", like the mock-up.
const marker = '2D designer'
const at = profile.bio.indexOf(marker)
const [before, after] =
  at === -1 ? [profile.bio, ''] : [profile.bio.slice(0, at), profile.bio.slice(at)]

const brandNames =
  'Coca-Cola, Google, Apollo, SolarWinds, Tata Elxsi, Britannia, CSG, Gamechange Solar'

const brandCount = brandNames.split(',').length
// Every visual in the portfolio, rounded down to a tidy "100+"-style figure.
const designCount = works.reduce((n, w) => n + w.zones.reduce((m, z) => m + z.items.length, 0), 0)
const designsShown = Math.floor(designCount / 10) * 10

export default function About() {
  return (
    <section id="about" className={s.about}>
      <div className="container">
        <Reveal>
          <p className={s.about__bio}>
            {before}
            <Image src={designerPill} alt="" className={s.about__pill} />
            {after}
          </p>
        </Reveal>
      </div>

      <ul className={`container ${s.stats}`}>
        <li>
          <strong>
            <CountUp to={brandCount} suffix="+" />
          </strong>
          <span>Brands worked with</span>
        </li>
        <li>
          <strong>
            <CountUp to={designsShown} suffix="+" />
          </strong>
          <span>Event &amp; wedding designs</span>
        </li>
        <li>
          <strong>2D + 3D</strong>
          <span>Print artwork &amp; 3D mock-ups</span>
        </li>
      </ul>

      <div className={s.brands}>
        <SplitText className={s.brands__title} text="Working Brands" />
        <Marquee
          className={s.brands__marquee}
          copies={3}
          secondsPerCopy={32}
          label="Brands I have worked with"
        >
          <Image src={brandsStrip} alt={brandNames} className={s.brands__img} />
        </Marquee>
      </div>
    </section>
  )
}
