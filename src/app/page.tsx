import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import EventDesign from '@/components/sections/EventDesign'
import WeddingGallery from '@/components/sections/WeddingGallery'
import AnimationGallery from '@/components/sections/AnimationGallery'
import PortraitSketches from '@/components/sections/PortraitSketches'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <EventDesign />
      <WeddingGallery />
      <PortraitSketches />
      <AnimationGallery />
      <Contact />
    </>
  )
}
