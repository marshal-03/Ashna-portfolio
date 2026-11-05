'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { WorkItem } from '@/types'
import s from './ImageLightbox.module.css'

interface Props {
  items: WorkItem[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export default function ImageLightbox({ items, index, onIndexChange, onClose }: Props) {
  const item = items[index]
  const go = (step: number) => onIndexChange((index + step + items.length) % items.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % items.length)
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length, onClose, onIndexChange])

  // Lock page scroll while open.
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return createPortal(
    <div
      className={s.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={item?.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button type="button" className={s.lightbox__close} aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <button
        type="button"
        className={`${s.lightbox__nav} ${s['lightbox__nav--prev']}`}
        aria-label="Previous"
        onClick={() => go(-1)}
      >
        ‹
      </button>
      {item && (
        <figure className={s.lightbox__figure}>
          <Image
            key={item.src}
            src={item.src}
            alt={item.title}
            width={item.width}
            height={item.height}
            sizes="100vw"
            loading="eager"
          />
          <figcaption>
            {item.title}
            <span>
              {index + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
      )}
      <button
        type="button"
        className={`${s.lightbox__nav} ${s['lightbox__nav--next']}`}
        aria-label="Next"
        onClick={() => go(1)}
      >
        ›
      </button>
    </div>,
    document.body,
  )
}
