import { tools } from '@/data/portfolio'
import Marquee from '@/components/ui/Marquee'
import s from './Toolkit.module.css'

// Rendered inside the Event Design frame so both share one background.
// The row drifts left to right on its own and can be swiped by hand (see Marquee).
export default function Toolkit() {
  return (
    <div id="toolkit" className={s.toolkit}>
      <h2 className={s.toolkit__title}>My Creative Toolkit</h2>

      <Marquee copies={4} secondsPerCopy={30} direction="right" label="Software I use">
        <ul className={s.toolkit__list}>
          {tools.map((tool) => (
            <li key={tool.short} className={s.tool}>
              <span className={s.tool__mark}>{tool.short}</span>
              <span className={s.tool__name}>{tool.name}</span>
            </li>
          ))}
        </ul>
      </Marquee>
    </div>
  )
}
