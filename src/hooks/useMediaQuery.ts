'use client'

import { useSyncExternalStore } from 'react'

/**
 * Live `matchMedia` result. Returns `serverValue` during prerender/hydration, then the real value.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Phone-sized screens, where the long pinned scroll sections are swapped for compact versions. */
export const usePhone = () => useMediaQuery('(max-width: 720px)')

const noop = () => () => {}
/**
 * False in the server HTML and until the page's scripts have started, then true. Scroll-driven
 * layouts wait for this, so a slow phone shows the plain, fully visible version (not a hidden
 * title in an empty pinned frame) while the scripts are still loading.
 */
export const useMounted = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
