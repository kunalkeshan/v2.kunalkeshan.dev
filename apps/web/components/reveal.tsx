"use client"

import { useRevealContext } from "@/hooks/use-reveal"

export interface RevealProps {
  /**
   * Seconds of transition-delay once the parent `useRevealGroup` section
   * becomes visible. Fully arbitrary — 0, 0.2, 0.25, 0.3, whatever the
   * section's own stagger design calls for; there is no fixed step size.
   */
  delay: number
  children: React.ReactNode
  /**
   * Passed through to the wrapper element — most call sites don't need this,
   * but a `<Reveal>` around a grid/flex item occasionally needs to carry
   * layout classes itself (e.g. `md:sticky md:top-28`) rather than putting
   * them on a nested child, if the sticky/grid rules require it to live on
   * the immediate child of the grid/flex container.
   */
  className?: string
}

/**
 * One individually-delayed piece of a staggered section reveal. Must be
 * rendered somewhere inside a `useRevealGroup(...)`'s `<Provider>` — see
 * `apps/web/hooks/use-reveal.ts` for the full pattern and rationale, and
 * `docs/ui/design-system.md` "Motion / animation conventions" for the
 * worked example this mirrors (the home hero).
 *
 * Renders a plain `<div>` wrapper carrying `data-reveal` + an inline
 * `transitionDelay` — the same `[data-reveal]` CSS in
 * `packages/ui/src/styles/globals.css` used by the non-staggered
 * `useReveal`/`data-reveal={state}` pattern animates it; `Reveal` only adds
 * the per-instance delay on top.
 *
 * Falls back to `"hidden"` if rendered outside any `Provider` (`useContext`
 * returns `null` in that case) rather than throwing — a missing `Provider`
 * should read as "never reveals" during development, not crash the page.
 */
export function Reveal({ delay, children, className }: RevealProps) {
  const state = useRevealContext() ?? "hidden"

  return (
    <div
      data-reveal={state}
      style={{ transitionDelay: `${delay}s` }}
      className={className}
    >
      {children}
    </div>
  )
}
