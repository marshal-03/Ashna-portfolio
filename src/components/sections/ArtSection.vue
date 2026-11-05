<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { artPieces } from '@/data/portfolio'
import ArtCard from '@/components/ui/ArtCard.vue'

/*
 * Scroll-driven horizontal gallery: the section is made as tall as the track is wide, the stage
 * sticks to the viewport, and vertical scroll progress moves the track from right to left.
 */
const section = ref<HTMLElement>()
const viewport = ref<HTMLElement>()
const track = ref<HTMLElement>()
const distance = ref(0)
const progress = ref(0)
const pinned = ref(true)

let frame = 0
let resizeObserver: ResizeObserver | undefined
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function measure() {
  pinned.value = !reducedMotion.matches
  if (!track.value || !viewport.value) return
  distance.value = Math.max(0, track.value.scrollWidth - viewport.value.clientWidth)
  update()
}

function update() {
  frame = 0
  if (!section.value || !distance.value) return (progress.value = 0)
  const top = section.value.getBoundingClientRect().top
  progress.value = Math.min(1, Math.max(0, -top / distance.value))
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  resizeObserver = new ResizeObserver(measure)
  if (track.value) resizeObserver.observe(track.value)
  if (viewport.value) resizeObserver.observe(viewport.value)
  reducedMotion.addEventListener('change', measure)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
  reducedMotion.removeEventListener('change', measure)
  cancelAnimationFrame(frame)
})

const sectionHeight = computed(() => (pinned.value ? `calc(100svh + ${distance.value}px)` : 'auto'))
const trackStyle = computed(() =>
  pinned.value ? { transform: `translate3d(${-progress.value * distance.value}px, 0, 0)` } : {},
)
</script>

<template>
  <section
    id="art"
    ref="section"
    class="art"
    :class="{ 'art--pinned': pinned }"
    :style="{ height: sectionHeight }"
  >
    <div class="art__stage">
      <div class="art__head">
        <div>
          <p class="eyebrow">Maya · After Effects · Adobe Animate</p>
          <h2 class="section-title">3D &amp; 2D Animation</h2>
        </div>
      </div>

      <div ref="viewport" class="art__viewport">
        <div ref="track" class="art__track" :style="trackStyle">
          <ArtCard v-for="piece in artPieces" :key="piece.url" :piece="piece" />
        </div>
      </div>

      <div v-if="pinned && distance" class="container art__progress" aria-hidden="true">
        <span :style="{ transform: `scaleX(${progress})` }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.art {
  position: relative;
  background: linear-gradient(180deg, var(--color-bg), var(--color-bg-soft) 50%, var(--color-bg));
  scroll-margin-top: 0;
}

.art__stage {
  display: flex;
  flex-direction: column;
  padding: 5.25rem 0 1.25rem;
}

.art--pinned .art__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}

.art__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  padding: 0 var(--gutter);
  margin-bottom: 1.25rem;
}

.art__head .eyebrow {
  margin-bottom: 0.4rem;
}

/* The cards take all remaining height of the screen. */
.art__viewport {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.art__track {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  width: max-content;
  padding: 0 var(--gutter);
  will-change: transform;
}

.art__progress {
  margin: 1rem var(--gutter) 0;
  height: 2px;
  background: var(--color-border);
}

.art__progress span {
  display: block;
  height: 100%;
  background: var(--color-primary-hover);
  transform-origin: left;
}

/* Reduced motion: no pinning, a normal swipeable row instead. */
.art:not(.art--pinned) .art__viewport {
  overflow-x: auto;
  height: 80vh;
  flex: none;
}

@media (max-width: 720px) {
  .art__stage {
    padding-top: 4.5rem;
  }
  .art__head {
    margin-bottom: 1rem;
  }
  .art__track {
    gap: 0.75rem;
  }
}
</style>
