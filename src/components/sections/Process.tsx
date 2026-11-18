import { processSteps } from '@/data/portfolio'
import Reveal from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import s from './Process.module.css'

// How a project runs, in four numbered steps along a line.
export default function Process() {
  return (
    <section id="process" className={s.process}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">How I work</p>
        </Reveal>
        <SplitText className={s.title} text="From brief to print-ready files" />
        <ol className={s.steps}>
          {processSteps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 120}>
                <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
