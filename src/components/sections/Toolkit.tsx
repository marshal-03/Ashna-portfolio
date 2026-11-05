import { Fragment } from 'react'
import { tools } from '@/data/portfolio'
import s from './Toolkit.module.css'

// Rendered inside the Event Design frame so both share one background.
// The row is repeated so the marquee can loop seamlessly; enough copies to cover wide screens.
const COPIES = 4

export default function Toolkit() {
  return (
    <div id="toolkit" className={s.toolkit}>
      <h2 className={s.toolkit__title}>My Creative Toolkit</h2>

      <div className={s.toolkit__marquee}>
        <ul className={s.toolkit__track}>
          {Array.from({ length: COPIES }, (_, n) => (
            <Fragment key={n}>
              {tools.map((tool) => (
                <li key={`${n}-${tool.short}`} className={s.tool} aria-hidden={n > 0 || undefined}>
                  <span className={s.tool__mark}>{tool.short}</span>
                  <span className={s.tool__name}>{tool.name}</span>
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}
