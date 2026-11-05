import { caseStudies } from '@/data/caseStudies'
import EventIntro from './EventIntro'
import CaseStudy from './CaseStudy'
import s from './EventDesign.module.css'

// Event Design: pinned toolkit + title intro, followed by one case study per brand.
export default function EventDesign() {
  return (
    <section id="event-design" className={s.event}>
      <EventIntro />
      <div className={s.cases}>
        {caseStudies.map((study) => (
          <CaseStudy key={study.slug} study={study} />
        ))}
      </div>
    </section>
  )
}
