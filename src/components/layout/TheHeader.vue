<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { profile } from '@/data/portfolio'

const scrolled = ref(false)
const hidden = ref(false)
let lastY = 0
let idleTimer: ReturnType<typeof setTimeout> | undefined

// Slide the header away while scrolling in either direction (so sections like Event Design fill
// the screen), and bring it back once scrolling pauses or the visitor is back at the top.
const SHOW_AFTER_IDLE_MS = 700

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40

  if (y <= 120) {
    hidden.value = false
  } else if (Math.abs(y - lastY) > 6) {
    hidden.value = true
  }
  lastY = y

  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => (hidden.value = false), SHOW_AFTER_IDLE_MS)
}

onMounted(() => {
  lastY = window.scrollY
  scrolled.value = lastY > 40
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(idleTimer)
})

const links = [
  { label: 'Works', hash: '#event-design' },
  { label: 'Animation', hash: '#art' },
  { label: 'About', hash: '#about' },
]
</script>

<template>
  <header class="header" :class="{ 'header--solid': scrolled, 'header--hidden': hidden }">
    <div class="header__inner">
      <nav class="header__nav" aria-label="Main">
        <RouterLink v-for="link in links" :key="link.hash" :to="{ path: '/', hash: link.hash }">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__right">
        <RouterLink to="/" class="header__id">
          <span class="header__name">{{ profile.name }}</span>
          <span class="header__since">[{{ profile.since }}]</span>
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#contact' }" class="btn btn--light header__cta">
          Let’s Talk
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  transition:
    transform 0.35s var(--ease),
    background 0.3s,
    backdrop-filter 0.3s;
}

.header--hidden {
  transform: translateY(-100%);
}

/* Keep it reachable for keyboard users. */
.header:focus-within {
  transform: none;
}

.header--solid {
  background: rgba(5, 4, 12, 0.78);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem var(--gutter);
  max-width: 1600px;
  margin: 0 auto;
}

.header__nav {
  display: flex;
  gap: 1.75rem;
  font-size: 0.95rem;
  color: var(--color-muted);
}

.header__nav a:hover {
  color: #fff;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header__id {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.3;
}

.header__name {
  font-size: 1.05rem;
}

.header__since {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.header__cta {
  padding: 0.75rem 1.8rem;
  font-size: 1.1rem;
}

@media (max-width: 720px) {
  .header__nav {
    display: none;
  }
  .header__inner {
    padding-block: 0.8rem;
  }
  .header__cta {
    padding: 0.55rem 1.1rem;
    font-size: 0.95rem;
  }
  .header__right {
    width: 100%;
    justify-content: space-between;
  }
  .header__id {
    align-items: flex-start;
  }
}
</style>
