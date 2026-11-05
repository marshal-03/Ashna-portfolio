// Event Design scroll showcase: one curated collage per brand, in display order.
// Source collages were trimmed of their empty bottom strip; gaps between panels stay transparent.
import type { StaticImageData } from 'next/image'
import cocaCola from '@/assets/images/showcase/coca-cola.webp'
import darkFantasy from '@/assets/images/showcase/dark-fantasy.webp'
import tataTea from '@/assets/images/showcase/tata-tea.webp'
import borderlessAccess from '@/assets/images/showcase/borderless-access.webp'
import henkel from '@/assets/images/showcase/henkel.webp'

export interface ShowcaseShot {
  src: StaticImageData
  brand: string
  /** Brand page this collage links to (/work/:slug). */
  slug: string
}

export const showcase: ShowcaseShot[] = [
  { src: cocaCola, brand: 'Coca-Cola', slug: 'coca-cola' },
  { src: darkFantasy, brand: 'Sunfeast Dark Fantasy', slug: 'dark-fantasy' },
  { src: tataTea, brand: 'Tata Tea Premium', slug: 'tata-tea' },
  { src: borderlessAccess, brand: 'Borderless Access', slug: 'borderless-access' },
  { src: henkel, brand: 'Henkel', slug: 'henkel' },
]
