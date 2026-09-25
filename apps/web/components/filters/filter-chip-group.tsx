"use client"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

export interface FilterChipOption {
  value: string
  label: string
}

export interface FilterChipGroupProps {
  options: FilterChipOption[]
  /**
   * "single" behaves like a radio group (clicking the active chip clears it,
   * matching the previous tag-filter behaviour on /blog and /journal).
   * "multiple" behaves like a checkbox group (projects' kind/tech facets,
   * skills' category facet).
   */
  selectionMode: "single" | "multiple"
  value: string[]
  onChange: (next: string[]) => void
  "aria-label": string
}

/**
 * Chips press into their own shadow on toggle — the same `duration-press` /
 * `ease-snap` micro-interaction already used for hover states elsewhere
 * (project links, skill chips, card lift), rather than a new spring-based
 * motion language for what is still a small, frequent, low-stakes control.
 * `active:scale-96` is a plain CSS `:active` rule (was previously a
 * `motion.div` wrapper's `whileTap`), gated by `motion-reduce:` the same way
 * `cardLift` is elsewhere in this codebase.
 */
export function FilterChipGroup({
  options,
  selectionMode,
  value,
  onChange,
  ...props
}: FilterChipGroupProps) {
  function toggle(option: string) {
    if (selectionMode === "single") {
      onChange(value.includes(option) ? [] : [option])
      return
    }

    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option]
    )
  }

  return (
    <div
      role="group"
      aria-label={props["aria-label"]}
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((option) => {
        const isActive = value.includes(option.value)

        return (
          <Badge
            key={option.value}
            onClick={() => toggle(option.value)}
            aria-pressed={isActive}
            className={cn(
              "h-auto cursor-pointer rounded-lg border-2 border-border px-3 py-1.5 text-xs normal-case",
              "shadow-sm transition-[translate,transform,box-shadow,background-color,color] duration-press ease-snap",
              "hover:translate-x-px hover:translate-y-px hover:shadow-none",
              "active:scale-96 motion-reduce:active:scale-100",
              isActive
                ? "translate-x-px translate-y-px bg-primary text-primary-foreground shadow-none"
                : "bg-card text-foreground"
            )}
          >
            {option.label}
          </Badge>
        )
      })}
    </div>
  )
}
