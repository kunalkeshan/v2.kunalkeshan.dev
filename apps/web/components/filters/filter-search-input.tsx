"use client"

import { Loader2Icon, SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupClear,
  InputGroupIcon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { cn } from "@workspace/ui/lib/utils"

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
 *
 * Both icons stay mounted, absolutely stacked, and cross-fade via opacity —
 * unlike `FilterClearButton`/`FilterResultsTransition`, this needs no
 * delayed-unmount timing (`apps/web/hooks/use-delayed-unmount.ts`) since
 * nothing ever actually unmounts.
 */
export function FilterSearchInput({
  value,
  onChange,
  placeholder,
  isPending,
  ...props
}: FilterSearchInputProps) {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupIcon className="relative size-4">
        <SearchIcon
          className={cn(
            "absolute inset-0 size-4 transition-opacity duration-150 ease-snap",
            isPending ? "opacity-0" : "opacity-100"
          )}
        />
        <Loader2Icon
          className={cn(
            "absolute inset-0 size-4 animate-spin transition-opacity duration-150 ease-snap",
            isPending ? "opacity-100" : "opacity-0"
          )}
        />
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
