<script setup lang="ts">
import { tools } from '@/data/portfolio'

// Rendered inside the Event Design frame so both share one background.
// The row is repeated so the marquee can loop seamlessly; fill enough copies to cover wide screens.
const copies = 4
</script>

<template>
  <div id="toolkit" class="toolkit">
    <h2 class="toolkit__title">My Creative Toolkit</h2>

    <div class="toolkit__marquee">
      <ul class="toolkit__track">
        <template v-for="n in copies" :key="n">
          <li
            v-for="tool in tools"
            :key="`${n}-${tool.short}`"
            class="tool"
            :aria-hidden="n > 1 ? 'true' : undefined"
          >
            <span class="tool__mark">{{ tool.short }}</span>
            <span class="tool__name">{{ tool.name }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.toolkit {
  position: relative;
  z-index: 5;
  padding: 5.5rem 0 0;
  overflow: hidden;
}

.toolkit__title {
  text-align: center;
  font-weight: 300;
  font-size: clamp(2rem, 4.2vw, 3.4rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 var(--gutter) clamp(1.75rem, 3.5vw, 2.5rem);
}

.toolkit__marquee {
  overflow: hidden;
}

.toolkit__track {
  list-style: none;
  display: flex;
  width: max-content;
  animation: toolkit-scroll 30s linear infinite reverse;
}

.toolkit__marquee:hover .toolkit__track {
  animation-play-state: paused;
}

.tool {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-right: clamp(1.75rem, 3vw, 2.5rem);
  flex: none;
}

.tool__mark {
  display: grid;
  place-items: center;
  width: clamp(3.2rem, 4.4vw, 4rem);
  aspect-ratio: 1;
  background: #fff;
  color: #000;
  border-radius: 12px;
  font-weight: 600;
  font-size: clamp(1.4rem, 2.1vw, 1.9rem);
  letter-spacing: -0.02em;
  box-shadow: 0 6px 18px rgba(20, 12, 60, 0.25);
}

.tool__name {
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  font-weight: 500;
  white-space: nowrap;
}

/* One copy of the list is 1/copies of the track. */
@keyframes toolkit-scroll {
  to {
    transform: translateX(-25%);
  }
}
</style>
