"use client"

import { useSyncExternalStore } from "react"

/**
 * Almost every reveal/animation's reduced-motion handling lives entirely in
 * CSS now (see `[data-reveal]` in `packages/ui/src/styles/globals.css`) and
 * needs no JS check at all. This hook exists only for the rare case where
 * *non-animation* JS behavior also needs to change under reduced motion —
 * e.g. `hero.tsx` stopping its role-text `setInterval` entirely, not just
 * skipping the crossfade's animation. Don't reach for this to gate a
 * `data-reveal`/`data-reveal-sweep` element; that's handled for free.
 *
 * Mirrors `packages/ui/src/hooks/use-mobile.ts`'s `useSyncExternalStore` +
 * `matchMedia` shape.
 */
function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  mediaQuery.addEventListener("change", callback)
  return () => mediaQuery.removeEventListener("change", callback)
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getServerSnapshot() {
  return false
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
