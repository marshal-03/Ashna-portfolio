// works.json is generated from the brand folders by scripts/build_works.py (see README).
import type { BrandWork, WorkItem } from '@/types'
import raw from './works.json'

/** Event mock-ups are rendered at ~16:9; flat print artwork rarely is. Used to order and pick covers. */
const isScene = (i: WorkItem) => {
  const ratio = i.width / i.height
  return i.kind === 'render' && ratio > 1.6 && ratio < 2 && i.width >= 1600
}

const rank = (i: WorkItem) => (isScene(i) ? 0 : i.kind === 'render' ? 1 : 2)

export const works: BrandWork[] = (raw as BrandWork[]).map((brand) => {
  const zones = brand.zones.map((zone) => {
    const items = [...zone.items]
      .sort((a, b) => rank(a) - rank(b))
      // File names are not presentable ("WhatsApp_Image…"), so label by zone + number.
      .map((item, n) => ({ ...item, title: `${zone.name} ${String(n + 1).padStart(2, '0')}` }))
    return { ...zone, items }
  })
  const cover = zones.flatMap((z) => z.items).find(isScene) ?? zones[0]!.items[0]!
  return { ...brand, zones, cover: cover.src, coverThumb: cover.thumb }
})

export const findWork = (slug: string) => works.find((w) => w.slug === slug)
