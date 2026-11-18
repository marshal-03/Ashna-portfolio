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
