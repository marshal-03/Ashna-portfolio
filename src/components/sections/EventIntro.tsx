import SectionIntro from './SectionIntro'
import Toolkit from './Toolkit'

// Event Design intro: the toolkit row greets you, then "Event Design" rises from the bottom.
export default function EventIntro() {
  return <SectionIntro lines={['Event', 'Design']} top={<Toolkit />} />
}
