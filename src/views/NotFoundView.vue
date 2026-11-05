<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="container not-found">
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <RouterLink to="/">Back home</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: var(--section-gap) 1rem;
  text-align: center;
}

.not-found a {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
