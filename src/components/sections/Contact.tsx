import { profile, socials } from '@/data/portfolio'
import SocialIcon from '@/components/ui/SocialIcon'
import s from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={s.contact}>
      <div className={`container ${s.contact__inner}`}>
        <p className="eyebrow">Have an event in mind?</p>
        <h2 className={s.contact__title}>Let’s Talk</h2>
        <a href={`mailto:${profile.email}`} className={s.contact__email}>
          {profile.email}
        </a>
        <div className={s.contact__socials}>
          {socials.map((link) => (
            <a
              key={link.kind}
              href={link.url}
              target="_blank"
              rel="noopener"
              aria-label={link.label}
            >
              <SocialIcon kind={link.kind} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
