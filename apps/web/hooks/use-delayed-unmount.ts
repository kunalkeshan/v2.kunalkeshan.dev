"use client"

import { useEffect, useRef, useState } from "react"

export type TransitionState = "entering" | "visible" | "exiting"

/**
 * CSS has no declarative way to animate an unmount — a `transition` only
 * fires while the element is still in the DOM. This hook is the one genuine
 * gap left by replacing `motion/react`'s `AnimatePresence`: it keeps the
 * outgoing element mounted for `durationMs` (the fade-out's own duration)
 * before telling the caller to stop rendering it, so the exit transition in
 * `[data-transition-state]` (`packages/ui/src/styles/globals.css`) has time
 * to actually play.
 *
 * Consumers: `apps/web/components/filters/filter-clear-button.tsx` and
 * `apps/web/components/filters/filter-results-transition.tsx`. See
 * `docs/ui/design-system.md` "Motion / animation conventions" for why the
 * other `AnimatePresence` usage (`filter-search-input.tsx`'s icon↔spinner
 * swap) doesn't need this — both icons can stay mounted and cross-fade via
 * opacity with nothing to ever unmount.
 */
export function useDelayedUnmount(show: boolean, durationMs: number) {
  const [shouldRender, setShouldRender] = useState(show)
  const [dataState, setDataState] = useState<TransitionState>(
    show ? "visible" : "exiting"
  )
  // Tracks the `show` value the two states above were last computed for —
  // the react.dev "store information from previous render" pattern (a
  // `useState` set during render, not a ref: refs can't be read/written
  // during render under this repo's `react-hooks` lint rules). Letting this
  // lag one render behind `show` is exactly the signal used to catch the
  // prop changing and adjust state before the render commits.
  const [prevShow, setPrevShow] = useState(show)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  if (show !== prevShow) {
    setPrevShow(show)
    if (show) {
      setShouldRender(true)
      setDataState("entering")
    } else {
      setDataState("exiting")
    }
  }

  // The one thing that genuinely belongs in an effect: starting the
  // "entering" -> "visible" flip, and the unmount timer while exiting.
  useEffect(() => {
    clearTimeout(timeoutRef.current)

    if (show) {
      // Double rAF, not one: see `apps/web/hooks/use-reveal.ts`'s mount-mode
      // comment for why a single `requestAnimationFrame` inside `useEffect`
      // can fire before the browser ever paints the "entering" frame, which
      // silently skips the transition entirely (this exact bug shipped once
      // already). The `setTimeout` alongside it is the same backgrounded-tab
      // fallback `useReveal` uses — rAF can starve indefinitely there.
      let innerFrame = 0
      const outerFrame = requestAnimationFrame(() => {
        innerFrame = requestAnimationFrame(() => setDataState("visible"))
      })
      const timeout = setTimeout(() => setDataState("visible"), 100)
      return () => {
        cancelAnimationFrame(outerFrame)
        cancelAnimationFrame(innerFrame)
        clearTimeout(timeout)
      }
    }

    timeoutRef.current = setTimeout(() => setShouldRender(false), durationMs)
    return () => clearTimeout(timeoutRef.current)
  }, [show, durationMs])

  return { shouldRender, dataState }
}
