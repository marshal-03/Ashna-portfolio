<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { showcase as shots } from '@/data/showcase'
import ToolkitSection from '@/components/sections/ToolkitSection.vue'

/*
 * Pinned showcase: the big "Event Design" title sits in the middle of a sticky stage, and as the
 * page scrolls one brand collage at a time rises into the centre, holds, and lifts away.
 */
const section = ref<HTMLElement>()
const progress = ref(0)
const isMobile = ref(false)
const pinned = ref(true)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let frame = 0

// One collage at a time, centred, as large as the screen allows (by width and by height).
const MAX_W = { desktop: 90, mobile: 94 } // vw
const MAX_H = { desktop: 82, mobile: 62 } // vh
const START = 0.16 // the title animates and fills before the first collage arrives
const FILL_END = 0.14 // the title is fully filled by this point of the scroll
const step = (1 - START) / shots.length

const easeOut = (x: number) => 1 - (1 - x) ** 3
const easeIn = (x: number) => x ** 3
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/*
 * Within its slice a collage rises from below into the centre (0–30%), holds there while it
 * slowly grows (30–70%), then lifts out through the top (70–100%) as the next one rises.
 */
const placed = computed(() =>
  shots.map((shot, i) => {
    const raw = (progress.value - (START + i * step)) / step
    const t = clamp01(raw)

    let y: number // vh offset from the centre of the screen
    if (t < 0.3) y = 105 * (1 - easeOut(t / 0.3))
    else if (t < 0.7) y = 0
    else y = -115 * easeIn((t - 0.7) / 0.3)

    const scale = 0.88 + 0.16 * t
    const w = isMobile.value ? MAX_W.mobile : MAX_W.desktop
    const h = isMobile.value ? MAX_H.mobile : MAX_H.desktop
    const opacity = clamp01(raw * 8)

    return {
      ...shot,
      visible: raw > -0.05 && raw < 1.05,
      style: {
        left: '50%',
        width: `min(${w}vw, ${(h * shot.ratio).toFixed(2)}vh)`,
        opacity: opacity.toFixed(3),
        transform: `translate3d(-50%, calc(-50% + ${y.toFixed(2)}vh), 0) scale(${scale.toFixed(3)})`,
        zIndex: String(10 + i),
      },
    }
  }),
)

// The toolkit row greets you at the top of the frame, then lifts away before the first image.
const TOOLKIT_EXIT = 0.06
const toolkitOut = computed(() => Math.min(1, progress.value / TOOLKIT_EXIT))
const toolkitStyle = computed(() => ({
  opacity: (1 - toolkitOut.value).toFixed(3),
  transform: `translate3d(0, ${(-toolkitOut.value * 60).toFixed(1)}px, 0)`,
  visibility: toolkitOut.value >= 1 ? ('hidden' as const) : undefined,
}))

// Title sits below the toolkit at first, settles into the centre as the toolkit leaves,
// and fades out once the last image has passed.
const titleStyle = computed(() => {
  const p = progress.value
  const scale = 0.92 + Math.min(1, p / START) * 0.08
  const shift = (1 - toolkitOut.value) * (isMobile.value ? 70 : 90)
  const fade = p > 0.92 ? Math.max(0, 1 - (p - 0.92) / 0.08) : 1
  const fill = Math.min(1, Math.max(0, (p - TOOLKIT_EXIT * 0.5) / (FILL_END - TOOLKIT_EXIT * 0.5)))
  return {
    transform: `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
    opacity: fade.toFixed(3),
    '--fill': `${(fill * 100).toFixed(1)}%`,
  }
})

// Title letters, indexed across both words so the rise-in staggers left to right, top to bottom.
const titleWords = (() => {
  let n = 0
  return ['Event', 'Design'].map((word) => [...word].map((ch) => ({ ch, i: n++ })))
})()

// Letters rise in once the section's top reaches the lower part of the screen.
const titleIn = ref(false)

function update() {
  frame = 0
  const el = section.value
  if (!el) return
  const top = el.getBoundingClientRect().top
  if (!titleIn.value && top < window.innerHeight * 0.75) titleIn.value = true
  const distance = el.offsetHeight - window.innerHeight
  progress.value = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 0
}

function measure() {
  isMobile.value = window.innerWidth < 720
  pinned.value = !reducedMotion.matches
  update()
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update)
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure)
  reducedMotion.addEventListener('change', measure)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  reducedMotion.removeEventListener('change', measure)
  cancelAnimationFrame(frame)
})

const sectionHeight = computed(() => `${120 + shots.length * 95}vh`)
</script>

<template>
  <section
    id="event-design"
    ref="section"
    class="event"
    :class="{ 'event--pinned': pinned }"
    :style="pinned ? { height: sectionHeight } : undefined"
  >
    <div class="event__stage">
      <div class="event__toolkit" :style="pinned ? toolkitStyle : undefined">
        <ToolkitSection />
      </div>

      <h2
        class="event__title"
        :class="{ 'event__title--in': titleIn }"
        :style="pinned ? titleStyle : { '--fill': '100%' }"
        aria-label="Event Design"
      >
        <!-- Faded base layer, plus a bright copy revealed left to right as you scroll. -->
        <span
          v-for="layer in ['base', 'fill']"
          :key="layer"
          class="event__title-layer"
          :class="`event__title-layer--${layer}`"
          aria-hidden="true"
        >
          <span v-for="(word, w) in titleWords" :key="w" class="event__word">
            <span v-for="l in word" :key="l.i" class="event__letter" :style="{ '--i': l.i }">{{
              l.ch
            }}</span>
          </span>
        </span>
      </h2>

      <template v-if="pinned">
        <RouterLink
          v-for="shot in placed"
          v-show="shot.visible"
          :key="shot.src"
          :to="{ name: 'work', params: { slug: shot.slug } }"
          class="shot"
          :style="shot.style"
        >
          <img
            :src="shot.src"
            :alt="`${shot.brand} event design`"
            loading="eager"
            decoding="async"
          />
          <span class="shot__caption">{{ shot.brand }} — view project →</span>
        </RouterLink>

        <p class="event__meta">
          Stage design · Entry arches · Registration desks · Photobooths
          <span
            >{{
              String(
                Math.min(shots.length, Math.max(1, Math.ceil(progress * shots.length))),
              ).padStart(2, '0')
            }}
            / {{ String(shots.length).padStart(2, '0') }}</span
          >
        </p>
      </template>

      <!-- Reduced motion: a plain grid under the title. -->
      <div v-else class="event__grid">
        <RouterLink
          v-for="shot in shots"
          :key="shot.src"
          :to="{ name: 'work', params: { slug: shot.slug } }"
          class="shot shot--static"
        >
          <img :src="shot.src" :alt="`${shot.brand} event design`" loading="lazy" />
          <span class="shot__caption">{{ shot.brand }} — view project →</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event {
  position: relative;
  background: #181238;
}

.event__stage {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 45% 55% at 100% 0%, rgba(196, 190, 226, 0.95), transparent 70%),
    radial-gradient(ellipse 70% 60% at 40% 0%, #43379a, transparent 75%),
    linear-gradient(180deg, #2c2474 0%, #241d5c 55%, #181238 100%);
  padding: var(--section-gap) var(--gutter);
}

.event--pinned .event__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  padding: 0;
  display: grid;
  place-items: center;
}

/* Toolkit overlays the top of the frame so the title can stay centred once it leaves. */
.event--pinned .event__toolkit {
  position: absolute;
  inset: 0 0 auto;
  z-index: 5;
  will-change: transform, opacity;
}

.event__title {
  position: relative;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(4rem, min(13vw, 17vh), 12rem);
  line-height: 0.95;
  letter-spacing: -0.01em;
  text-align: center;
  user-select: none;
  will-change: transform, opacity;
}

.event__title-layer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event__title-layer--base {
  color: rgba(120, 108, 196, 0.45);
}

/* The bright copy sits exactly on top and is uncovered from the left as --fill grows. */
.event__title-layer--fill {
  position: absolute;
  inset: 0;
  color: #f1ecff;
  text-shadow: 0 0 40px rgba(170, 150, 255, 0.55);
  clip-path: inset(-10% calc(100% - var(--fill, 0%)) -10% 0);
}

.event__word {
  display: block;
  white-space: nowrap;
}

.event__letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.45em) rotate(4deg);
  filter: blur(8px);
}

.event__title--in .event__letter {
  animation: letter-in 0.9s var(--ease) both;
  animation-delay: calc(var(--i) * 55ms);
}

@keyframes letter-in {
  from {
    opacity: 0;
    transform: translateY(0.45em) rotate(4deg);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .event__letter {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.shot {
  position: absolute;
  top: 50%;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 40px 90px -24px rgba(8, 4, 30, 0.9),
    0 0 80px -10px rgba(120, 100, 230, 0.35);
  transform-origin: center;
  will-change: transform;
  transition: box-shadow 0.3s;
}

.shot img {
  width: 100%;
  height: auto;
}

.shot__caption {
  position: absolute;
  inset: auto 0 0;
  padding: 1.75rem 0.9rem 0.65rem;
  font-size: 0.85rem;
  background: linear-gradient(180deg, transparent, rgba(5, 4, 12, 0.85));
  opacity: 0;
  transition: opacity 0.3s;
}

.shot:hover .shot__caption,
.shot:focus-visible .shot__caption {
  opacity: 1;
}

.event__meta {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(220, 215, 245, 0.7);
  z-index: 50;
  pointer-events: none;
}

.event__meta span {
  font-variant-numeric: tabular-nums;
}

.event__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
  max-width: var(--max-width);
  margin: 3rem auto 0;
}

.shot--static {
  position: relative;
  top: auto;
}

@media (hover: none) {
  .shot__caption {
    opacity: 1;
  }
}

@media (max-width: 720px) {
  .event__meta {
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
  }
}
</style>
