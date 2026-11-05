// Event Design scroll showcase: one curated collage per brand, in display order.
// Source collages were trimmed of their empty bottom strip; gaps between panels stay transparent.
import cocaCola from '@/assets/images/showcase/coca-cola.webp'
import darkFantasy from '@/assets/images/showcase/dark-fantasy.webp'
import tataTea from '@/assets/images/showcase/tata-tea.webp'
import borderlessAccess from '@/assets/images/showcase/borderless-access.webp'
import henkel from '@/assets/images/showcase/henkel.webp'

export interface ShowcaseShot {
  src: string
  brand: string
  /** Brand page this collage links to (/work/:slug). */
  slug: string
  /** Width ÷ height of the image, used to size it to the screen. */
  ratio: number
}

export const showcase: ShowcaseShot[] = [
  { src: cocaCola, brand: 'Coca-Cola', slug: 'coca-cola', ratio: 1800 / 1348 },
  { src: darkFantasy, brand: 'Sunfeast Dark Fantasy', slug: 'dark-fantasy', ratio: 1800 / 1436 },
  { src: tataTea, brand: 'Tata Tea Premium', slug: 'tata-tea', ratio: 1800 / 1179 },
  {
    src: borderlessAccess,
    brand: 'Borderless Access',
    slug: 'borderless-access',
    ratio: 1800 / 1336,
  },
  { src: henkel, brand: 'Henkel', slug: 'henkel', ratio: 1800 / 1469 },
]
