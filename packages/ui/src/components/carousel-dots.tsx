"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { useCarousel } from "@workspace/ui/components/carousel"

/**
 * Windowed dot indicator.
 *
 * A dot per slide is fine at ten and unusable at a hundred — the row outgrows
 * the viewport and the dots shrink to noise. This renders a fixed-size window
 * of dots that slides with the active index instead, so the control's width is
 * constant no matter how many slides exist, with the dots at a truncated edge
 * rendered progressively smaller to signal "more that way".
 *
 * Below `windowSize` slides there is nothing to truncate, so it degrades to a
 * plain dot row and the edge scaling never kicks in.
 */

/**
 * Bounds of the visible dot window, clamped so it never runs past either end
 * and always spans exactly `windowSize` when there are enough slides.
 *
 * Exported for testing: the clamping at the two ends is the part that is easy
 * to get subtly wrong.
 */
export function getDotWindow(
  selectedIndex: number,
  total: number,
  windowSize: number
): { start: number; end: number } {
  if (total <= windowSize) return { start: 0, end: total }

  const half = Math.floor(windowSize / 2)
  // Keep the active dot centred, then pull the window back inside the range.
  const start = Math.min(Math.max(selectedIndex - half, 0), total - windowSize)

  return { start, end: start + windowSize }
}

interface CarouselDotsProps extends React.ComponentProps<"div"> {
  /** How many dots to show at once. Odd numbers centre the active dot. */
  windowSize?: number
  /** Accessible label prefix, e.g. "Go to testimonial 3". */
  label?: string
}

function CarouselDots({
  className,
  windowSize = 5,
  label = "Go to slide",
  ...props
}: CarouselDotsProps) {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel()
  const total = scrollSnaps.length

  if (total <= 1) return null

  const { start, end } = getDotWindow(selectedIndex, total, windowSize)
  const visible = scrollSnaps.slice(start, end)

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="carousel-dots"
      {...props}
    >
      {visible.map((_, offset) => {
        const index = start + offset
        const isActive = index === selectedIndex
        // Distance from the window edge, but only on an edge that is actually
        // hiding slides — a flush end gets full-size dots.
        const fromStart = start > 0 ? offset : Infinity
        const fromEnd = end < total ? visible.length - 1 - offset : Infinity
        const edgeDistance = Math.min(fromStart, fromEnd)

        return (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`${label} ${index + 1}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full border-2 border-border transition-[width,height,background-color] duration-press ease-snap",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
              isActive ? "bg-primary" : "bg-card hover:bg-muted",
              // Shrink only the outermost dots of a truncated edge.
              edgeDistance === 0 && !isActive && "size-1.5",
              edgeDistance === 1 && !isActive && "size-2",
              (edgeDistance > 1 || isActive) && "size-3",
              "motion-reduce:transition-none"
            )}
          />
        )
      })}

      <span className="ml-1 text-xs tabular-nums text-body-foreground">
        {selectedIndex + 1} / {total}
      </span>
    </div>
  )
}

export { CarouselDots }
