"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Loader2Icon, SearchIcon } from "lucide-react"

import { Input } from "@workspace/ui/components/input"

export interface FilterSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  "aria-label": string
  /** Shown in place of the search icon while a debounced update is in flight. */
  isPending?: boolean
}

/**
 * The search icon swaps for a spinner while `isPending` is true, instead of
 * adding separate loading chrome (a skeleton, a toast, a border pulse) — the
 * one element already sitting where someone's attention is anyway.
 */
export function FilterSearchInput({
  value,
  onChange,
  placeholder,
  isPending,
  ...props
}: FilterSearchInputProps) {
  const prefersReducedMotion = useReducedMotion()
  const fadeTransition = { duration: prefersReducedMotion ? 0 : 0.15 }

  return (
    <div className="relative max-w-sm">
      <span className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2">
        <AnimatePresence initial={false} mode="wait">
          {isPending ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="block text-muted-foreground"
            >
              <Loader2Icon className="size-4 animate-spin" />
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="block text-muted-foreground"
            >
              <SearchIcon className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={props["aria-label"]}
        className="h-10 pl-8"
      />
    </div>
  )
}
