"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Loader2Icon, SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupClear,
  InputGroupIcon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

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
    <InputGroup className="max-w-sm">
      <InputGroupIcon>
        <AnimatePresence initial={false} mode="wait">
          {isPending ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="block"
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
              className="block"
            >
              <SearchIcon className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </InputGroupIcon>
      <InputGroupInput
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={props["aria-label"]}
      />
      {value.length > 0 && (
        <InputGroupClear aria-label="Clear search" onClick={() => onChange("")} />
      )}
    </InputGroup>
  )
}
