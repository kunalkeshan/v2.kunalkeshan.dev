"use client"

import { cn } from "@workspace/ui/lib/utils"

import { useReveal } from "@/hooks/use-reveal"

interface HighlightTextProps {
  children: React.ReactNode
  className?: string
  /** Tailwind background/foreground pair — defaults to the primary (orange) pairing. */
  variant?: "primary" | "secondary"
}

const variantClasses = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
} as const

const variantBg = {
  primary: "bg-primary",
  secondary: "bg-secondary",
} as const

/**
 * A highlighter-style animated text treatment for section headings.
 *
 * The colored background sweeps in left-to-right (like a real highlighter
 * stroke) once, the first time it scrolls into view — rather than fading in
 * as a solid block. Uses the same reveal timing (`[data-reveal-sweep]` in
 * `packages/ui/src/styles/globals.css`) as the heading's own scroll reveal so
 * it reads as part of the same reveal moment.
 *
 * Mandatory for every section heading that uses a highlight span — see
 * docs/ui/design-system.md "Highlight text sweep".
 */
export function HighlightText({
  children,
  className,
  variant = "primary",
}: HighlightTextProps) {
  const { ref, state } = useReveal<HTMLSpanElement>("in-view")

  return (
    <span className={cn("relative inline-block px-1", className)}>
      <span
        ref={ref}
        aria-hidden
        data-reveal-sweep={state}
        className={cn("absolute inset-0", variantBg[variant])}
      />
      <span className={cn("relative", variantClasses[variant])}>
        {children}
      </span>
    </span>
  )
}
