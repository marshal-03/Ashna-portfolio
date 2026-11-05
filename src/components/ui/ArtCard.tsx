'use client'

import { useEffect, useRef, useState } from 'react'
import type { ArtPiece } from '@/types'
import s from './ArtCard.module.css'

export default function ArtCard({ piece }: { piece: ArtPiece }) {
  const video = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  // Autoplay (muted) only while the card is on screen, so off-screen clips don't download or play.
  useEffect(() => {
    const v = video.current
    if (!v) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio > 0.5) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: [0, 0.5, 1] },
    )
    observer.observe(v)
    return () => observer.disconnect()
  }, [])

  const togglePlay = () => {
    const v = video.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) v.play().catch(() => {})
  }

  const fullscreen = () => {
    video.current?.requestFullscreen?.().catch(() => {})
  }

  return (
    <figure className={s.card} style={{ aspectRatio: `${piece.width} / ${piece.height}` }}>
      <video
        ref={video}
        src={piece.video}
        poster={piece.image}
        muted
        loop
        playsInline
        preload="none"
        className={s.card__media}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className={s.card__controls}>
        <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleSound}>
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 9v6h4l5 4V5L8 9zM16.5 9.5l5 5m0-5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9z" />
              <path
                d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          )}
        </button>
        <button type="button" aria-label="Full screen" onClick={fullscreen}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>

      <figcaption className={s.card__info}>
        <span className={s.card__cat}>{piece.category}</span>
        <h3>{piece.title}</h3>
        <p>{piece.description}</p>
      </figcaption>
    </figure>
  )
}
