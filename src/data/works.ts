// works.json is generated from the brand folders by scripts/build_works.py (see README).
import type { BrandWork, WorkItem } from '@/types'
import raw from './works.json'
import { weddingWorks } from './wedding'

/** Event mock-ups are rendered at ~16:9; flat print artwork rarely is. Used to order and pick covers. */
const isScene = (i: WorkItem) => {
  const ratio = i.width / i.height
  return i.kind === 'render' && ratio > 1.6 && ratio < 2 && i.width >= 1600
}

const rank = (i: WorkItem) => (isScene(i) ? 0 : i.kind === 'render' ? 1 : 2)

export const works: BrandWork[] = (raw as BrandWork[]).map((brand) => {
  // Two source files can share a name once converted (bg-01.png / bg-01.jpg), leaving the same
  // image listed twice; keep only its first appearance.
  const seen = new Set<string>()
  const zones = brand.zones.map((zone) => {
    const items = zone.items
      .filter((i) => !seen.has(i.src) && seen.add(i.src))
      .sort((a, b) => rank(a) - rank(b))
      // File names are not presentable ("WhatsApp_Image…"), so label by zone + number.
      .map((item, n) => ({ ...item, title: `${zone.name} ${String(n + 1).padStart(2, '0')}` }))
    return { ...zone, items }
  })
  const cover = zones.flatMap((z) => z.items).find(isScene) ?? zones[0]!.items[0]!
  return { ...brand, zones, cover: cover.src, coverThumb: cover.thumb }
})

// Wedding pieces live in their own data file (curated from the "wedding work" zip); listing them
// here gives them a card on /work and a project page at /work/weddings.
const weddingStage = weddingWorks[0]!
works.push({
  slug: 'weddings',
  name: 'Wedding Design',
  subtitle: 'Invitations, signage & keepsakes',
  cover: weddingStage.src,
  coverThumb: weddingStage.thumb,
  zones: [{ name: 'Wedding Collection', slug: 'collection', items: weddingWorks }],
})

export const findWork = (slug: string) => works.find((w) => w.slug === slug)
