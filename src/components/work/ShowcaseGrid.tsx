'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { BrandWork, WorkItem } from '@/types'
import ImageLightbox from './ImageLightbox'
import SplitText from '@/components/ui/SplitText'
import s from './ShowcaseGrid.module.css'

/** Every visual from every brand in one masonry grid, filterable by brand, with a lightbox. */
export default function ShowcaseGrid({ works }: { works: BrandWork[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [open, setOpen] = useState<number | null>(null)

  // Label each item with its brand so the grid and lightbox say whose work it is.
  const all = useMemo(
    () =>
      works.flatMap((w) =>
        w.zones.flatMap((z) =>
          z.items.map((item) => ({
            brand: w.slug,
            item: { ...item, title: `${w.name} — ${item.title}` },
          })),
        ),
      ),
    [works],
  )
  const items: WorkItem[] = useMemo(
    () => all.filter((x) => filter === 'all' || x.brand === filter).map((x) => x.item),
    [all, filter],
  )

  const chips = [{ slug: 'all', name: 'All', n: all.length }].concat(
    works.map((w) => ({
      slug: w.slug,
      name: w.name,
      n: all.filter((x) => x.brand === w.slug).length,
    })),
  )

  return (
    <section className={`container ${s.wrap}`} aria-label="Every visual">
      <SplitText className={s.title} text="Every visual" />

      <div className={s.chips} role="group" aria-label="Filter by brand">
        {chips.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={filter === c.slug ? `${s.chip} ${s['chip--on']}` : s.chip}
            aria-pressed={filter === c.slug}
            onClick={() => setFilter(c.slug)}
          >
            {c.name}
            <span>{c.n}</span>
          </button>
        ))}
      </div>

      {/* Keyed by filter so the grid fades in afresh whenever a brand is picked. */}
      <div key={filter} className={s.grid}>
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            className={`${s.shot} tile-in`}
            onClick={() => setOpen(i)}
          >
            <Image
              src={item.thumb}
              alt={item.title}
              width={item.width}
              height={item.height}
              sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw"
            />
            <span className={s.shot__label}>{item.title}</span>
          </button>
        ))}
      </div>

      {open !== null && (
        <ImageLightbox
          items={items}
          index={open}
          onIndexChange={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
