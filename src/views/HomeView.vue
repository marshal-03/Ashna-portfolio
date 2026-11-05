<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import EventDesignSection from '@/components/sections/EventDesignSection.vue'
import ArtSection from '@/components/sections/ArtSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

onMounted(() => (document.title = 'Ashna Mary | 2D Designer'))
</script>

<template>
  <HeroSection />
  <AboutSection />
  <EventDesignSection />
  <ArtSection />
  <ContactSection />
</template>
