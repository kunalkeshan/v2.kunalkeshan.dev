"use client"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { useDelayedUnmount } from "@/hooks/use-delayed-unmount"

const EXIT_DURATION_MS = 180

export interface FilterClearButtonProps {
  show: boolean
  onClick: () => void
  children?: React.ReactNode
}

/**
 * Fade + slight slide, mirroring the site's other reveal transitions — the
 * same enter/exit language already used site-wide for content appearing,
 * rather than a new one just for this link. `useDelayedUnmount` keeps the
 * node mounted long enough for the exit transition to actually play (CSS has
 * no declarative way to animate an unmount).
 */
export function FilterClearButton({
  show,
  onClick,
  children = "Clear filters",
}: FilterClearButtonProps) {
  const { shouldRender, dataState } = useDelayedUnmount(show, EXIT_DURATION_MS)

  if (!shouldRender) return null

  return (
    <div
      data-transition-state={dataState}
      style={
        {
          "--transition-duration": `${EXIT_DURATION_MS}ms`,
          transition: `opacity ${EXIT_DURATION_MS}ms var(--ease-snap), transform ${EXIT_DURATION_MS}ms var(--ease-snap)`,
        } as React.CSSProperties
      }
      className={cn(
        "mt-3",
        dataState === "visible" ? "translate-y-0" : "-translate-y-1.5"
      )}
    >
      <Button
        variant="link"
        size="xs"
        className="text-muted-foreground hover:text-foreground"
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}
