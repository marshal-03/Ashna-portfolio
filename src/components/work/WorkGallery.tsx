'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { WorkItem, WorkZone } from '@/types'
import ImageLightbox from './ImageLightbox'
import s from './WorkGallery.module.css'

export default function WorkGallery({ zones }: { zones: WorkZone[] }) {
  // Flat list so the lightbox can step through every image on the page.
  const allItems = zones.flatMap((z) => z.items)
  const [open, setOpen] = useState<number | null>(null)

  const shot = (item: WorkItem, graphic = false) => (
    <button
      key={item.src}
      type="button"
      className={graphic ? `${s.shot} ${s['shot--graphic']}` : s.shot}
      onClick={() => setOpen(allItems.indexOf(item))}
    >
      <Image
        src={item.thumb}
        alt={item.title}
        width={item.width}
        height={item.height}
        sizes={graphic ? '(max-width: 720px) 50vw, 25vw' : '(max-width: 900px) 100vw, 50vw'}
      />
      <span className={s.shot__label}>{item.title}</span>
    </button>
  )

  return (
    <>
      {zones.map((zone) => {
        const renders = zone.items.filter((i) => i.kind === 'render')
        const graphics = zone.items.filter((i) => i.kind === 'graphic')
        return (
          <section key={zone.slug} id={zone.slug} className={s.zone}>
            <div className="container">
              <h2 className={s.zone__title}>
                {zone.name}
                <span>{zone.items.length}</span>
              </h2>

              {renders.length > 0 && (
                <div className={s.zone__renders}>{renders.map((item) => shot(item))}</div>
              )}

              {graphics.length > 0 && (
                <>
                  <p className={s.zone__sub}>Print-ready graphics</p>
                  <div className={s.zone__graphics}>{graphics.map((item) => shot(item, true))}</div>
                </>
              )}
            </div>
          </section>
        )
      })}

      {open !== null && (
        <ImageLightbox
          items={allItems}
          index={open}
          onIndexChange={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}
