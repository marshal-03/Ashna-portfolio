<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/data/portfolio'
import designerPill from '@/assets/images/designer-pill.webp'
import brandsStrip from '@/assets/images/brands-strip.webp'

// Split the bio so the illustration sits inline right before "2D Designer", like the mock-up.
const parts = computed(() => {
  const marker = '2D designer'
  const i = profile.bio.indexOf(marker)
  return i === -1 ? [profile.bio, ''] : [profile.bio.slice(0, i), profile.bio.slice(i)]
})
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <p class="about__bio">
        {{ parts[0] }}<img :src="designerPill" alt="" class="about__pill" />{{ parts[1] }}
      </p>
    </div>

    <div class="brands">
      <h2 class="brands__title">Working Brands</h2>
      <div class="brands__marquee" aria-label="Brands I have worked with">
        <div class="brands__track">
          <img
            :src="brandsStrip"
            alt="Coca-Cola, Google, Apollo, SolarWinds, Tata Elxsi, Britannia, CSG, Gamechange Solar"
          />
          <img :src="brandsStrip" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  padding: var(--section-gap) 0;
  background:
    radial-gradient(ellipse 70% 60% at 85% 80%, rgba(58, 45, 143, 0.55), transparent 70%),
    var(--color-bg);
  scroll-margin-top: 70px;
}

.about__bio {
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
  text-transform: capitalize;
  font-size: clamp(1.15rem, 2.4vw, 2.1rem);
  line-height: 1.85;
  font-weight: 300;
}

.about__pill {
  display: inline-block;
  height: 2.4em;
  width: auto;
  vertical-align: middle;
  margin: -0.6em 0.3em -0.3em;
}

.brands {
  margin-top: clamp(4rem, 10vw, 8rem);
  text-align: center;
}

.brands__title {
  font-weight: 300;
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  letter-spacing: -0.02em;
  margin-bottom: 2.5rem;
}

.brands__marquee {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.brands__track {
  display: flex;
  width: max-content;
  animation: marquee 32s linear infinite;
}

.brands__track img {
  height: clamp(2.6rem, 5vw, 4.2rem);
  width: auto;
  max-width: none;
  padding-right: 4rem;
}

.brands__marquee:hover .brands__track {
  animation-play-state: paused;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
