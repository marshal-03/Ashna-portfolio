<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile, socials } from '@/data/portfolio'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import heroBg from '@/assets/images/hero-bg.webp'
import portrait from '@/assets/images/portrait.webp'

const [roleTop, roleBottom] = profile.role.split(' ')
const followLinks = socials.filter((s) => s.kind !== 'artstation')

/*
 * Subtle depth: titles and portrait drift a few pixels with the mouse, in opposite directions.
 * Only on devices with a fine pointer, and never when reduced motion is requested.
 */
const hero = ref<HTMLElement>()
let frame = 0
let target = { x: 0, y: 0 }

function onPointerMove(e: PointerEvent) {
  const el = hero.value
  if (!el) return
  const r = el.getBoundingClientRect()
  target = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
  if (!frame) {
    frame = requestAnimationFrame(() => {
      frame = 0
      el.style.setProperty('--px', target.x.toFixed(3))
      el.style.setProperty('--py', target.y.toFixed(3))
    })
  }
}

const canParallax = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (canParallax()) hero.value?.addEventListener('pointermove', onPointerMove)
})
onBeforeUnmount(() => {
  hero.value?.removeEventListener('pointermove', onPointerMove)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section id="hero" ref="hero" class="hero" :style="{ '--hero-bg': `url(${heroBg})` }">
    <img
      class="hero__portrait"
      :src="portrait"
      :alt="`Portrait of ${profile.name}`"
      fetchpriority="high"
    />

    <!-- Each line slides up from behind a mask; the big words carry a slow light sheen. -->
    <h1 class="hero__hello">
      <span class="line"><span class="line__in hero__hi" style="--d: 0.35s">Hi I’m</span></span>
      <span class="line"
        ><span class="line__in hero__first sheen" style="--d: 0.5s">{{
          profile.firstName
        }}</span></span
      >
    </h1>

    <p class="hero__role" :aria-label="profile.role">
      <span class="line"
        ><span class="line__in hero__role-top" style="--d: 0.6s">{{ roleTop }}</span></span
      >
      <span class="line"
        ><span class="line__in hero__role-bottom sheen" style="--d: 0.75s">{{
          roleBottom
        }}</span></span
      >
    </p>

    <div class="hero__intro">
      <p>{{ profile.intro }}</p>
      <a :href="profile.resumeUrl" class="btn" download>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 7v8m0 0-3.2-3.2M12 15l3.2-3.2M7.5 4.6A9 9 0 1 0 16.5 4.6"
          />
        </svg>
        Download My CV
      </a>
    </div>

    <div class="hero__follow">
      <span>Follow:</span>
      <a
        v-for="s in followLinks"
        :key="s.kind"
        :href="s.url"
        target="_blank"
        rel="noopener"
        :aria-label="s.label"
        class="hero__social"
      >
        <SocialIcon :kind="s.kind" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --px: 0;
  --py: 0;
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background:
    var(--hero-bg) left top / cover no-repeat,
    #000;
  display: grid;
  grid-template-columns: 1fr minmax(0, 1.25fr) 1fr;
  grid-template-rows: 1fr auto auto;
  padding: 7rem var(--gutter) 2.5rem;
  isolation: isolate;
}

.hero__portrait {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: min(84svh, 64vw);
  width: auto;
  max-width: none;
  z-index: -1;
  filter: drop-shadow(0 0 60px rgba(0, 0, 0, 0.55));
  animation: rise 1.1s var(--ease) both;
  translate: calc(var(--px) * 12px) calc(var(--py) * 8px);
  transition: translate 0.6s var(--ease);
}

.hero__hello,
.hero__role {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-self: center;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  translate: calc(var(--px) * -22px) calc(var(--py) * -14px);
  transition: translate 0.6s var(--ease);
}

/* Masked line reveal */
.line {
  display: block;
  overflow: hidden;
  padding: 0.04em 0.06em 0.1em;
  margin: -0.04em -0.06em -0.1em;
}

.line__in {
  display: inline-block;
  animation: line-up 1.2s var(--ease) var(--d, 0s) both;
}

@keyframes line-up {
  from {
    transform: translateY(110%) skewY(7deg);
    letter-spacing: 0.18em;
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
}

/* Light sheen sweeping across the big words every few seconds */
.sheen {
  color: transparent;
  background: linear-gradient(
    110deg,
    #fff 0%,
    #fff 40%,
    #b7aaff 46%,
    #fff 50%,
    #b7aaff 54%,
    #fff 60%,
    #fff 100%
  );
  background-size: 260% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.45));
  animation:
    line-up 1.2s var(--ease) var(--d, 0s) both,
    sheen 6.5s ease-in-out calc(var(--d, 0s) + 1.1s) infinite;
}

@keyframes sheen {
  0% {
    background-position: 100% 0;
  }
  45%,
  100% {
    background-position: 0% 0;
  }
}

.hero__hello {
  grid-column: 1;
  grid-row: 1;
  align-items: center;
}

.hero__role {
  grid-column: 3;
  grid-row: 1;
  align-items: center;
}

.hero__hi,
.hero__role-top {
  font-size: clamp(3rem, 6.2vw, 6.25rem);
  font-weight: 500;
}

.hero__first,
.hero__role-bottom {
  font-size: clamp(3rem, 6.4vw, 6.5rem);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin-top: 0.15em;
}

.hero__role-bottom {
  font-weight: 600;
}

.hero__intro {
  grid-column: 1;
  grid-row: 3;
  align-self: end;
  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: 1.6;
  max-width: 24rem;
  animation: fade 1s 0.5s var(--ease) both;
}

.hero__intro .btn {
  margin-top: 1.75rem;
}

.hero__follow {
  grid-column: 3;
  grid-row: 3;
  align-self: end;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.3rem;
  animation: fade 1s 0.6s var(--ease) both;
}

.hero__social {
  width: 2.8rem;
  height: 2.8rem;
  transition: transform 0.2s var(--ease);
}

.hero__social:hover {
  transform: translateY(-3px) scale(1.06);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translate(-50%, 6%);
  }
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .line__in,
  .sheen {
    animation: none;
  }
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    padding-top: 6rem;
    min-height: 0;
    /* Fit the whole "PORTFOLIO" word across the screen; a little vertical stretch suits the
       tall condensed letters and puts the word behind the titles and portrait. */
    background-size: 100% clamp(300px, 50vh, 480px);
    background-position: center top;
  }
  .hero__hello {
    grid-column: 1;
    grid-row: 1;
    align-items: flex-start;
  }
  .hero__role {
    grid-column: 2;
    grid-row: 1;
    align-items: flex-end;
    text-align: right;
  }
  .hero__hi,
  .hero__role-top {
    font-size: clamp(2.2rem, 9vw, 4rem);
  }
  .hero__first,
  .hero__role-bottom {
    font-size: clamp(2rem, 8.5vw, 4rem);
  }
  .hero__portrait {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    grid-column: 1 / -1;
    grid-row: 2;
    justify-self: center;
    width: min(100%, 560px);
    height: auto;
    margin-top: 1.5rem;
    z-index: 0;
    animation-name: fade;
    mask-image: linear-gradient(180deg, #000 80%, transparent);
  }
  .hero__intro {
    grid-column: 1 / -1;
    grid-row: 3;
    max-width: none;
    margin-top: 1rem;
  }
  .hero__follow {
    grid-column: 1 / -1;
    grid-row: 4;
    justify-self: start;
    margin-top: 2rem;
    font-size: 1rem;
  }
}
</style>
