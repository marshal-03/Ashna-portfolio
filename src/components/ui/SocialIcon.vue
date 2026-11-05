<script setup lang="ts">
import type { SocialKind } from '@/types'

defineProps<{ kind: SocialKind }>()
</script>

<template>
  <svg v-if="kind === 'linkedin'" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#0a66c2" />
    <path
      fill="#fff"
      d="M15.5 19.5h4v13h-4zM17.5 13.3a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6M22 19.5h3.8v1.8h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.6 4.8 6.1v7.2h-4v-6.4c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4v6.5H22z"
    />
  </svg>
  <svg v-else-if="kind === 'instagram'" viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0" stop-color="#fdf497" />
        <stop offset="0.1" stop-color="#fdf497" />
        <stop offset="0.5" stop-color="#fd5949" />
        <stop offset="0.68" stop-color="#d6249f" />
        <stop offset="1" stop-color="#285aeb" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="24" fill="url(#ig-grad)" />
    <rect
      x="13"
      y="13"
      width="22"
      height="22"
      rx="6.5"
      fill="none"
      stroke="#fff"
      stroke-width="2.6"
    />
    <circle cx="24" cy="24" r="5.3" fill="none" stroke="#fff" stroke-width="2.6" />
    <circle cx="30.2" cy="17.8" r="1.6" fill="#fff" />
  </svg>
  <svg v-else viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#13aff0" />
    <path fill="#fff" d="M11 30.5l2.6 4.5h17l-2.6-4.5zM36.6 31.2L27 14.5h-5.3l9.6 16.7z" />
    <path fill="#fff" d="M24.3 19L18.6 28.9H30z" opacity=".85" />
  </svg>
</template>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
