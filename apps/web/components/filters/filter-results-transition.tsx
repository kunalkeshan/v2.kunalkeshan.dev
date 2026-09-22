"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

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
 */
export function FilterResultsTransition({
  resultsKey,
  children,
}: FilterResultsTransitionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={resultsKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
