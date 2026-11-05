// Hand-drawn portrait sketches, in display order. Images live in public/works/portraits.
import type { WorkItem } from '@/types'

export interface Portrait extends WorkItem {
  /** Drawing medium shown under the title. */
  medium: string
}

const sketch = (
  slug: string,
  title: string,
  medium: string,
  width: number,
  height: number,
): Portrait => ({
  title,
  medium,
  kind: 'render',
  src: `/works/portraits/${slug}.webp`,
  thumb: `/works/portraits/${slug}.webp`,
  width,
  height,
})

export const portraits: Portrait[] = [
  sketch('graphite-elder', 'Smiling Elder', 'Graphite pencil', 1200, 1600),
  sketch('couple-warm-light', 'Couple in Warm Light', 'Colour pencil', 1279, 1600),
  sketch('couple-embrace', 'The Embrace', 'Colour pencil', 1122, 1600),
  sketch('football-tribute', 'Ronaldo Tribute', 'Colour pencil & watercolour', 844, 1248),
  sketch('seated-portrait', 'Seated Portrait', 'Colour pencil', 1097, 1600),
]
