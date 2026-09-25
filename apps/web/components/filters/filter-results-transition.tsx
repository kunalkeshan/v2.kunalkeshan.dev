"use client"

import { useEffect, useRef, useState } from "react"

const CROSSFADE_DURATION_MS = 150

export interface FilterResultsTransitionProps {
  /** Changes whenever the filtered result set changes, e.g. a join of visible ids. */
  resultsKey: string
  children: React.ReactNode
}

/**
 * Crossfades the whole results area when filters change, instead of
 * animating individual card enter/exit or FLIP-reordering survivors — a
 * grid can reflow from 3 columns to 1 row between queries, which makes
 * per-card position animation unreliable. One clean crossfade reads as
 * intentional without the edge cases of measuring layout shifts.
 *
 * Unlike `FilterClearButton`, there's no persistent DOM node to cross-fade —
 * `children` itself changes shape between keys, so this sequences a real
 * exit-then-enter (fade old content out, swap, fade new content in) rather
 * than keeping two nodes stacked. `resultsKey` changing schedules the fade
 * out; the actual child swap happens only once that fade has finished.
 */
export function FilterResultsTransition({
  resultsKey,
  children,
}: FilterResultsTransitionProps) {
  const [displayedKey, setDisplayedKey] = useState(resultsKey)
  const [displayedChildren, setDisplayedChildren] = useState(children)
  const [dataState, setDataState] = useState<"entering" | "visible" | "exiting">(
    "visible"
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // "Adjust state during rendering" (react.dev), not an effect: both branches
  // below react to a prop/state mismatch discovered mid-render, so setting
  // state here lets the correct output commit in this same render instead of
  // flashing a stale frame first.
  if (resultsKey === displayedKey) {
    // Same result set, content updated in place (e.g. a re-fetch of the same
    // key) — swap children immediately, no crossfade.
    if (children !== displayedChildren) {
      setDisplayedChildren(children)
    }
  } else if (dataState !== "exiting") {
    // `resultsKey` just changed — start the fade-out. The effect below only
    // owns scheduling the timer that completes the sequence.
    setDataState("exiting")
  }

  useEffect(() => {
    if (resultsKey === displayedKey) return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setDisplayedKey(resultsKey)
      setDisplayedChildren(children)
      setDataState("entering")
      requestAnimationFrame(() => setDataState("visible"))
    }, CROSSFADE_DURATION_MS)

    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only resultsKey should retrigger the crossfade; `children`/`displayedKey` are read, not depended on
  }, [resultsKey])

  return (
    <div
      data-transition-state={dataState}
      style={
        {
          "--transition-duration": `${CROSSFADE_DURATION_MS}ms`,
        } as React.CSSProperties
      }
    >
      {displayedChildren}
    </div>
  )
}
