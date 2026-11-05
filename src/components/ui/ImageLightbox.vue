<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { WorkItem } from '@/types'

const props = defineProps<{ items: WorkItem[]; index: number }>()
const emit = defineEmits<{ close: []; 'update:index': [value: number] }>()

const item = computed(() => props.items[props.index])
const go = (step: number) =>
  emit('update:index', (props.index + step + props.items.length) % props.items.length)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="item?.title"
      @click.self="emit('close')"
    >
      <button type="button" class="lightbox__close" aria-label="Close" @click="emit('close')">
        ✕
      </button>
      <button
        type="button"
        class="lightbox__nav lightbox__nav--prev"
        aria-label="Previous"
        @click="go(-1)"
      >
        ‹
      </button>
      <figure v-if="item" class="lightbox__figure">
        <img
          :key="item.src"
          :src="item.src"
          :alt="item.title"
          :width="item.width"
          :height="item.height"
        />
        <figcaption>
          {{ item.title }}
          <span>{{ index + 1 }} / {{ items.length }}</span>
        </figcaption>
      </figure>
      <button
        type="button"
        class="lightbox__nav lightbox__nav--next"
        aria-label="Next"
        @click="go(1)"
      >
        ›
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 3.5rem 4rem;
  background: rgba(3, 2, 8, 0.94);
  animation: in 0.25s ease both;
}

.lightbox__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  max-height: 100%;
}

.lightbox__figure img {
  max-width: 100%;
  max-height: calc(100svh - 9rem);
  width: auto;
  height: auto;
  object-fit: contain;
  animation: in 0.3s ease both;
}

figcaption {
  display: flex;
  gap: 1.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.lightbox__close,
.lightbox__nav {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 0;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 1.6rem;
  line-height: 1;
  display: grid;
  place-items: center;
}

.lightbox__close:hover,
.lightbox__nav:hover {
  background: var(--color-primary);
}

.lightbox__close {
  top: 1rem;
  right: 1rem;
  font-size: 1.1rem;
}

.lightbox__nav--prev {
  left: 1rem;
  top: 50%;
}

.lightbox__nav--next {
  right: 1rem;
  top: 50%;
}

@media (max-width: 720px) {
  .lightbox {
    padding: 4rem 0.5rem 5rem;
  }
  .lightbox__nav {
    top: auto;
    bottom: 1rem;
  }
  .lightbox__nav--prev {
    left: calc(50% - 3.5rem);
  }
  .lightbox__nav--next {
    right: calc(50% - 3.5rem);
  }
}

@keyframes in {
  from {
    opacity: 0;
  }
}
</style>
