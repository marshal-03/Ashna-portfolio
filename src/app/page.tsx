import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import EventDesign from '@/components/sections/EventDesign'
import WeddingGallery from '@/components/sections/WeddingGallery'
import Process from '@/components/sections/Process'
import Testimonials from '@/components/sections/Testimonials'
import AnimationGallery from '@/components/sections/AnimationGallery'
import PortraitSketches from '@/components/sections/PortraitSketches'
import Contact from '@/components/sections/Contact'

// Client work first (what Ashna is hired for), then how she works, then personal work.
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <EventDesign />
      <WeddingGallery />
      <Process />
      <Testimonials />
      <AnimationGallery />
      <PortraitSketches />
      <Contact />
    </>
  )
}
