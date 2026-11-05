<script setup lang="ts">
import { profile } from '@/data/portfolio'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <span>© {{ year }} {{ profile.name }}</span>
      <span>{{ profile.role }} · Event &amp; Brand Visuals</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 1.75rem 0;
  color: var(--color-muted);
  font-size: 0.85rem;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
