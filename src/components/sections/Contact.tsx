import { profile, socials } from '@/data/portfolio'
import SocialIcon from '@/components/ui/SocialIcon'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import EnquiryForm from './EnquiryForm'
import s from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={s.contact}>
      <div className={`container ${s.contact__inner}`}>
        <Reveal>
          <p className="eyebrow">Planning an event?</p>
        </Reveal>
        <SplitText className={s.contact__title} text="Let’s Talk" stagger={140} />
        <Reveal>
          <p className={s.contact__lede}>
            Tell me about your event and I’ll come back with ideas, sizes and a quote.
          </p>
        </Reveal>

        <div className={s.contact__grid}>
          <Reveal>
            <EnquiryForm />
          </Reveal>

          <Reveal delay={150}>
            <div className={s.contact__direct}>
              <p className={s.contact__label}>Or reach me directly</p>
              <a href={`mailto:${profile.email}`} className={s.contact__email}>
                {profile.email}
              </a>
              {profile.whatsapp ? (
                <a
                  href={`https://wa.me/${profile.whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className={s.contact__wa}
                >
                  WhatsApp +{profile.whatsapp}
                </a>
              ) : null}
              {profile.location ? <p className={s.contact__meta}>{profile.location}</p> : null}
              {profile.availability ? (
                <p className={s.contact__meta}>{profile.availability}</p>
              ) : null}
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
