"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@workspace/ui/components/button"

export interface FilterClearButtonProps {
  show: boolean
  onClick: () => void
  children?: React.ReactNode
}

/**
 * Fade + slight slide, mirroring `sectionReveal`/`heroReveal` in
 * `lib/motion.ts` — the same enter/exit language already used site-wide for
 * content appearing, rather than a new one just for this link.
 */
export function FilterClearButton({
  show,
  onClick,
  children = "Clear filters",
}: FilterClearButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const offset = prefersReducedMotion ? 0 : -6

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: offset }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          className="mt-3"
        >
          <Button
            variant="link"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClick}
          >
            {children}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
