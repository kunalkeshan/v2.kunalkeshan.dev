"use client"

import { motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

import { sectionRevealTransition, sectionRevealViewport } from "@/lib/motion"

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
 * as a solid block. Uses the same spring feel as `sectionReveal` so it reads
 * as part of the same reveal interaction.
 *
 * Mandatory for every section heading that uses a highlight span — see
 * docs/ui/design-system.md "Highlight text sweep".
 */
export function HighlightText({
  children,
  className,
  variant = "primary",
}: HighlightTextProps) {
  return (
    <span className={cn("relative inline-block px-1", className)}>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={sectionRevealViewport}
        transition={sectionRevealTransition}
        style={{ originX: 0 }}
        className={cn("absolute inset-0", variantBg[variant])}
      />
      <span className={cn("relative", variantClasses[variant])}>
        {children}
      </span>
    </span>
  )
}
