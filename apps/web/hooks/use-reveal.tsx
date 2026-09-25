"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

export type RevealState = "hidden" | "visible"

/**
 * Decides *when* a reveal fires — the CSS in `packages/ui/src/styles/globals.css`
 * (`[data-reveal]`) owns the actual animation. Replaces the trigger half of the
 * old `motion/react` `heroReveal`/`sectionReveal` variants; see
 * `docs/ui/design-system.md` "Motion / animation conventions" for why the
 * interpolation moved to CSS.
 *
 * - `"mount"` — flips to `"visible"` shortly after mount, mirroring the old
 *   `initial="hidden" animate="visible"`. The delay is required: if the
 *   element rendered with `data-reveal="visible"` on its very first paint, the
 *   CSS transition would have nothing to transition *from* and the content
 *   would just appear instantly with no animation.
 *
 *   This needs a **double** `requestAnimationFrame`, not one. A single rAF
 *   inside `useEffect` fires *before* the browser's next paint — so
 *   `useEffect` runs (commit with `"hidden"`), schedules one rAF, and that rAF
 *   callback can still land before the browser has ever actually painted the
 *   `"hidden"` frame. React then re-renders to `"visible"` and the browser
 *   paints that directly: `"hidden"` was scheduled but never shown, so there
 *   was nothing to transition from and the reveal silently no-ops (this
 *   exact bug shipped once already — the reveal API worked, `data-reveal`
 *   flipped correctly, but nothing ever visibly animated). Nesting a second
 *   rAF inside the first guarantees a real paint happened in between:
 *   the outer rAF runs before the next paint (still holding `"hidden"`), the
 *   browser paints, *then* the inner rAF (scheduled for the paint after that)
 *   flips to `"visible"`.
 *
 *   A `setTimeout` fallback runs alongside the rAF chain (whichever settles
 *   first wins; the other becomes a no-op against the already-`"visible"`
 *   state) — a backgrounded/non-visible tab can defer `requestAnimationFrame`
 *   indefinitely (browsers throttle/pause rAF and running CSS transitions in
 *   background tabs), which otherwise leaves the page stuck invisible at
 *   `data-reveal="hidden"` until the tab regains focus.
 * - `"in-view"` — a one-shot `IntersectionObserver`, mirroring
 *   `whileInView`/`viewport={{ once: true }}`: reveals the first time the
 *   element enters the viewport, then disconnects. No double-rAF needed here
 *   — the observer callback is inherently async relative to the initial
 *   commit/paint, so the `"hidden"` state always gets painted first.
 *
 * Reduced-motion is handled entirely in CSS (the `@media (prefers-reduced-motion:
 * reduce)` block alongside `[data-reveal]`), not here — every consumer inherits
 * it for free and can't forget to gate on it, the same convention the marquee
 * animation already used.
 */
export function useReveal<T extends HTMLElement>(mode: "mount" | "in-view") {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>("hidden")

  useEffect(() => {
    if (mode === "mount") {
      let innerFrame = 0
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setState("visible"))
      })
      const timeout = setTimeout(() => setState("visible"), 100)
      return () => {
        cancelAnimationFrame(outerFrame)
        cancelAnimationFrame(innerFrame)
        clearTimeout(timeout)
      }
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("visible")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [mode])

  return { ref, state }
}

/**
 * Distributes one section's reveal `state` down to any number of
 * `<Reveal delay={n}>` children (`apps/web/components/reveal.tsx`) without
 * threading it through props by hand. `null` (the default, outside any
 * `Provider`) is treated the same as `"hidden"` by `Reveal` — see that
 * component for why that fallback matters.
 */
export const RevealContext = createContext<RevealState | null>(null)

/**
 * The section-level entry point for a **staggered** reveal — one trigger
 * (mount or in-view, same as `useReveal`), fanned out to multiple
 * independently-delayed children via `<Reveal delay={n}>`.
 *
 * ```tsx
 * const { ref, state, Provider } = useRevealGroup("mount")
 * return (
 *   <Provider state={state}>
 *     <div ref={ref} className="grid gap-10 md:grid-cols-2">
 *       <Reveal delay={0}>{...}</Reveal>
 *       <Reveal delay={0.2}>{...}</Reveal>
 *       <Reveal delay={0.4}>{...}</Reveal>
 *     </div>
 *   </Provider>
 * )
 * ```
 *
 * `state` must be passed to `Provider` explicitly (not read from a closure
 * internally) — see `RevealGroupProvider`'s own doc comment for exactly why
 * that's load-bearing, not a style choice.
 *
 * The element `ref` is attached to is the trigger/layout host only — it does
 * **not** get `data-reveal` itself and has no animation of its own once its
 * children use `<Reveal>` (no whole-block fade *underneath* the per-child
 * stagger; see docs/ui/design-system.md "Motion / animation conventions" for
 * the reasoning). Sections that don't need per-child staggering should keep
 * using the plain `useReveal` + `data-reveal={state}` pattern instead — don't
 * reach for this every time a `<Reveal delay={0}>` alone would do.
 */
export function useRevealGroup<T extends HTMLElement>(mode: "mount" | "in-view") {
  const { ref, state } = useReveal<T>(mode)
  return { ref, state, Provider: RevealGroupProvider }
}

/**
 * The `Provider` returned by `useRevealGroup` — a single, module-level
 * component, always the same function reference, never redefined per call
 * or per render. This distinction matters a lot more than it looks: an
 * earlier version of `useRevealGroup` defined (or memoized-but-still-
 * per-call) a `Provider` function *inside the hook*, closing over `state`
 * directly so callers wouldn't need to pass it as a prop. That component
 * reference changes every time the hook re-runs (a new function, or a new
 * closure produced by a helper called fresh each render — both are "a new
 * component type" as far as React is concerned), and React remounts
 * (destroys + recreates) an entire subtree whenever the component type at a
 * given position changes.
 *
 * That remount is silently catastrophic here: any state update in the
 * section that isn't the reveal itself (`hero.tsx`'s `roleIndex`, ticking
 * every 2.6s) re-renders the section, which — with a per-render `Provider`
 * — forces a full subtree remount, which recreates every `<Reveal>` as a
 * brand-new DOM node carrying whatever `state` is current *at that later
 * moment*. Since the reveal has almost always already flipped to `"visible"`
 * by the time any such unrelated re-render happens, the new nodes are born
 * already visible, with no `"hidden"` phase to ever transition from — the
 * whole stagger silently no-ops, reading as "nothing animates at all" even
 * though `data-reveal`/the CSS are individually correct.
 *
 * The fix is this file-scoped, genuinely stable component reading `state` as
 * an ordinary prop instead: a changed prop value re-renders it in place
 * (fine, expected, does not remount children), where a changed component
 * *type* would not.
 */
function RevealGroupProvider({
  state,
  children,
}: {
  state: RevealState
  children: ReactNode
}) {
  return (
    <RevealContext.Provider value={state}>{children}</RevealContext.Provider>
  )
}

/**
 * The one place consumers should read a reveal state provided by
 * `useRevealGroup`'s `<Provider>`, rather than importing `RevealContext`
 * directly. Used by `apps/web/components/reveal.tsx`.
 */
export function useRevealContext() {
  return useContext(RevealContext)
}
