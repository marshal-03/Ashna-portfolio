<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { findWork, works } from '@/data/works'
import ImageLightbox from '@/components/ui/ImageLightbox.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import type { WorkItem } from '@/types'

const props = defineProps<{ slug: string }>()

const work = computed(() => findWork(props.slug))
const position = computed(() => works.findIndex((w) => w.slug === props.slug))
const next = computed(() => works[(position.value + 1) % works.length]!)

// Flat list so the lightbox can step through every image on the page.
const allItems = computed<WorkItem[]>(() => work.value?.zones.flatMap((z) => z.items) ?? [])
const lightbox = ref<number | null>(null)
const open = (item: WorkItem) => (lightbox.value = allItems.value.indexOf(item))

watch(
  () => props.slug,
  () => {
    lightbox.value = null
    if (work.value) document.title = `${work.value.name} | Ashna Mary`
  },
  { immediate: true },
)

const renders = (items: WorkItem[]) => items.filter((i) => i.kind === 'render')
const graphics = (items: WorkItem[]) => items.filter((i) => i.kind === 'graphic')
</script>

<template>
  <NotFoundView v-if="!work" />
  <article v-else class="work">
    <header class="work__hero" :style="{ backgroundImage: `url(${work.cover})` }">
      <div class="container work__hero-inner">
        <RouterLink :to="{ path: '/', hash: '#event-design' }" class="work__back"
          >← All works</RouterLink
        >
        <p class="eyebrow">
          {{ String(position + 1).padStart(2, '0') }} / {{ String(works.length).padStart(2, '0') }}
        </p>
        <h1 class="work__title">{{ work.name }}</h1>
        <p class="work__subtitle">{{ work.subtitle }}</p>
        <nav class="work__zones" aria-label="Sections">
          <a v-for="z in work.zones" :key="z.slug" :href="`#${z.slug}`">{{ z.name }}</a>
        </nav>
      </div>
    </header>

    <section v-for="zone in work.zones" :id="zone.slug" :key="zone.slug" class="zone">
      <div class="container">
        <h2 class="zone__title">
          {{ zone.name }}
          <span>{{ zone.items.length }}</span>
        </h2>

        <div v-if="renders(zone.items).length" class="zone__renders">
          <button
            v-for="item in renders(zone.items)"
            :key="item.src"
            type="button"
            class="shot"
            @click="open(item)"
          >
            <img
              :src="item.thumb"
              :alt="item.title"
              :width="item.width"
              :height="item.height"
              loading="lazy"
            />
            <span class="shot__label">{{ item.title }}</span>
          </button>
        </div>

        <template v-if="graphics(zone.items).length">
          <p class="zone__sub">Print-ready graphics</p>
          <div class="zone__graphics">
            <button
              v-for="item in graphics(zone.items)"
              :key="item.src"
              type="button"
              class="shot shot--graphic"
              @click="open(item)"
            >
              <img
                :src="item.thumb"
                :alt="item.title"
                :width="item.width"
                :height="item.height"
                loading="lazy"
              />
              <span class="shot__label">{{ item.title }}</span>
            </button>
          </div>
        </template>
      </div>
    </section>

    <RouterLink :to="{ name: 'work', params: { slug: next.slug } }" class="work__next">
      <div class="container">
        <p class="eyebrow">Next project</p>
        <p class="work__next-name">{{ next.name }} →</p>
      </div>
    </RouterLink>

    <ImageLightbox
      v-if="lightbox !== null"
      v-model:index="lightbox"
      :items="allItems"
      @close="lightbox = null"
    />
  </article>
</template>

<style scoped>
.work__hero {
  position: relative;
  min-height: 78svh;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
  padding: 8rem 0 3rem;
}

.work__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(5, 4, 12, 0.35),
    rgba(5, 4, 12, 0.55) 45%,
    var(--color-bg)
  );
}

.work__hero-inner {
  position: relative;
}

.work__back {
  display: inline-block;
  color: var(--color-muted);
  margin-bottom: 2rem;
}

.work__back:hover {
  color: #fff;
}

.work__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.6rem, 8vw, 6rem);
  line-height: 1.05;
  margin-top: 0.5rem;
}

.work__subtitle {
  color: var(--color-muted);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.work__zones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.work__zones a {
  padding: 0.4rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  font-size: 0.85rem;
  background: rgba(5, 4, 12, 0.35);
  backdrop-filter: blur(6px);
}

.work__zones a:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.zone {
  padding: clamp(2.5rem, 6vw, 4.5rem) 0;
  scroll-margin-top: 70px;
}

.zone__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.zone__title span {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-muted);
}

.zone__renders {
  columns: 2 420px;
  column-gap: 1rem;
}

.zone__renders .shot {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.zone__sub {
  margin: 2rem 0 1rem;
  color: var(--color-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.zone__graphics {
  columns: 4 220px;
  column-gap: 1rem;
}

.shot {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: zoom-in;
  overflow: hidden;
  background: var(--color-surface);
  color: inherit;
  text-align: left;
}

.zone__renders .shot img {
  width: 100%;
  height: auto;
  transition: transform 0.7s var(--ease);
}

.shot--graphic {
  break-inside: avoid;
  margin-bottom: 1rem;
  background: #0b0a18;
}

.shot--graphic img {
  width: 100%;
  height: auto;
  transition: transform 0.7s var(--ease);
}

.shot:hover img {
  transform: scale(1.04);
}

.shot__label {
  position: absolute;
  inset: auto 0 0;
  padding: 2rem 0.9rem 0.7rem;
  font-size: 0.8rem;
  background: linear-gradient(180deg, transparent, rgba(5, 4, 12, 0.85));
  opacity: 0;
  transition: opacity 0.3s;
}

.shot:hover .shot__label,
.shot:focus-visible .shot__label {
  opacity: 1;
}

.work__next {
  display: block;
  padding: var(--section-gap) 0;
  border-top: 1px solid var(--color-border);
  background: radial-gradient(
    ellipse 60% 80% at 50% 120%,
    rgba(91, 69, 217, 0.35),
    transparent 70%
  );
}

.work__next-name {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  line-height: 1.1;
  margin-top: 0.5rem;
  transition: transform 0.4s var(--ease);
}

.work__next:hover .work__next-name {
  transform: translateX(12px);
}
</style>
