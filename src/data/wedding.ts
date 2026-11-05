// Wedding design pieces for the curved scroll gallery, in display order.
// Images live in public/works/wedding (converted from the "wedding work" zip, max 1400px WebP).
import type { WorkItem } from '@/types'

const piece = (slug: string, title: string, width: number, height: number): WorkItem => ({
  title,
  kind: 'render',
  src: `/works/wedding/${slug}.webp`,
  thumb: `/works/wedding/${slug}.webp`,
  width,
  height,
})

export const weddingWorks: WorkItem[] = [
  piece('wedding-stage', 'Wedding Stage', 1400, 756),
  piece('welcome-board-mayra', 'Welcome Board — Mayra', 1045, 1400),
  piece('menu-cards', 'Menu Cards', 1400, 651),
  piece('gift-bag', 'Wedding Gift Bag', 933, 1400),
  piece('mehendi-welcome-board', 'Mehendi Welcome Board', 960, 1280),
  piece('invitation-folder', 'Invitation Folder', 1400, 933),
  piece('playing-cards', 'Wedding Playing Cards', 1280, 960),
  piece('petal-cone', 'Petal Cone', 1400, 1400),
  piece('sangeet-welcome-board', 'Sangeet Welcome Board', 1400, 1400),
  piece('invitation-suite', 'Invitation Suite', 1280, 834),
  piece('gift-tag', 'Gift Tag', 1400, 934),
  piece('wedding-timeline', 'Wedding Timeline', 1280, 947),
  piece('key-holder-jacket', 'Key Holder Card Jacket', 1400, 1370),
  piece('table-tent-green', 'Table Tent', 1400, 915),
  piece('menu-card-folder', 'Menu Card', 1280, 853),
  piece('table-tent-blue', 'Table Tent — Blue', 1400, 915),
]
