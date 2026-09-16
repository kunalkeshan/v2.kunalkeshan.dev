import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

interface MarqueeProps extends React.ComponentProps<"div"> {
  /** Seconds for one full loop. Higher is slower. */
  durationSeconds?: number
  /** Direction of travel. */
  direction?: "left" | "right"
  /** Pause while the pointer is over the band. */
  pauseOnHover?: boolean
}

/**
 * A continuously scrolling band of content.
 *
 * Deliberately CSS-only — no `"use client"`, no hooks, no event handlers — so it
 * stays a Server Component and adds nothing to the client bundle. `pauseOnHover`
 * is a CSS `:hover` rule rather than `onMouseEnter` for the same reason.
 * `packages/ui` also has no motion-package dependency (see
 * docs/ui/design-system.md), so a `motion/react` implementation would have
 * broken the package boundary.
 *
 * `children` are rendered TWICE. The keyframe translates the track by -50% of
 * its own width, so at the end of a cycle the second copy sits exactly where the
 * first began and the restart is invisible. Ported from kunalkeshan.dev v1's
 * `SkillsInText`, which rendered the content once and ran 0% -> -100% — the band
 * scrolled to empty and snapped back every cycle. The duplicate copy and the
 * -50% in globals.css are one mechanism; changing either alone reintroduces that
 * gap.
 *
 * `min-w-full` on each copy keeps the band full even when there are few items.
 *
 * Reduced motion is handled in `globals.css` rather than here, so every consumer
 * inherits it automatically.
 *
 * Accessibility: the second copy is `aria-hidden`, so assistive tech reads the
 * content once. Give the wrapping landmark an `aria-label` at the call site.
 */
function Marquee({
  children,
  durationSeconds = 30,
  direction = "left",
  pauseOnHover = true,
  className,
  style,
  ...props
}: MarqueeProps) {
  const track = cn(
    "flex min-w-full shrink-0 items-center justify-around",
    "gap-[var(--marquee-gap,3rem)]",
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
    pauseOnHover &&
      "group-hover/marquee:[animation-play-state:paused]"
  )

  return (
    <div
      data-slot="marquee"
      className={cn("group/marquee flex w-full overflow-hidden", className)}
      style={
        {
          "--marquee-duration": `${durationSeconds}s`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className={track}>{children}</div>
      <div className={track} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}

export { Marquee }
