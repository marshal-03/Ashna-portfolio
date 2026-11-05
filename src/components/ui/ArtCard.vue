<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ArtPiece } from '@/types'

defineProps<{ piece: ArtPiece }>()

const videoEl = ref<HTMLVideoElement>()
const muted = ref(true)
const playing = ref(false)
let observer: IntersectionObserver | undefined

// Autoplay (muted) only while the card is on screen, so off-screen clips don't download or play.
onMounted(() => {
  if (!videoEl.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      const v = videoEl.value
      if (!v) return
      if (entry!.intersectionRatio > 0.5) v.play().catch(() => {})
      else v.pause()
    },
    { threshold: [0, 0.5, 1] },
  )
  observer.observe(videoEl.value)
})
onBeforeUnmount(() => observer?.disconnect())

function toggleSound() {
  const v = videoEl.value
  if (!v) return
  v.muted = !v.muted
  muted.value = v.muted
  if (v.paused) v.play().catch(() => {})
}

function togglePlay() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) v.play().catch(() => {})
  else v.pause()
}

function fullscreen() {
  videoEl.value?.requestFullscreen?.().catch(() => {})
}
</script>

<template>
  <figure class="art-card" :style="{ aspectRatio: `${piece.width} / ${piece.height}` }">
    <video
      ref="videoEl"
      :src="piece.video"
      :poster="piece.image"
      muted
      loop
      playsinline
      preload="none"
      class="art-card__media"
      @click="togglePlay"
      @play="playing = true"
      @pause="playing = false"
    />
    <div class="art-card__controls">
      <button type="button" :aria-label="playing ? 'Pause' : 'Play'" @click="togglePlay">
        <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
      </button>
      <button type="button" :aria-label="muted ? 'Unmute' : 'Mute'" @click="toggleSound">
        <svg v-if="muted" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 9v6h4l5 4V5L8 9zM16.5 9.5l5 5m0-5-5 5"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9z" />
          <path
            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      </button>
      <button type="button" aria-label="Full screen" @click="fullscreen">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      </button>
    </div>

    <figcaption class="art-card__info">
      <span class="art-card__cat">{{ piece.category }}</span>
      <h3>{{ piece.title }}</h3>
      <p>{{ piece.description }}</p>
      <a :href="piece.url" target="_blank" rel="noopener">ArtStation ↗</a>
    </figcaption>
  </figure>
</template>

<style scoped>
.art-card {
  position: relative;
  height: 100%;
  flex: none;
  overflow: hidden;
  background: var(--color-surface);
}

.art-card__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

video.art-card__media {
  cursor: pointer;
}

.art-card__controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.4rem;
}

.art-card__controls button {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 0;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(5, 4, 12, 0.6);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: background 0.2s;
}

.art-card__controls button:hover {
  background: var(--color-primary);
}

.art-card__controls svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: currentColor;
}

.art-card__info {
  position: absolute;
  inset: auto 0 0;
  padding: 4rem clamp(1rem, 2vw, 1.75rem) clamp(1rem, 2vw, 1.5rem);
  background: linear-gradient(180deg, transparent, rgba(5, 4, 12, 0.92));
  pointer-events: none;
}

.art-card__info a {
  pointer-events: auto;
}

.art-card__cat {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a99cff;
}

.art-card__info h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  font-weight: 500;
}

.art-card__info p {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.art-card__info a {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  border-bottom: 1px solid currentColor;
}

.art-card__info a:hover {
  color: #fff;
}

/* Phones: every card is one screen-width "reel"; full screen shows the whole frame. */
@media (max-width: 720px) {
  .art-card {
    aspect-ratio: auto !important;
    width: calc(100vw - 2 * var(--gutter));
  }
}
</style>
