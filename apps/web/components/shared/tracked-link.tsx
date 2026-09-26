"use client"

import type { ReactNode } from "react"

import {
  trackLinkClick,
  type LinkPlacement,
  type LinkPosition,
} from "@/lib/analytics"

interface TrackedLinkProps {
  /** A server-rendered `<a>` element to wrap — its own onClick, if any, still runs. */
  children: ReactNode
  platform: string
  url: string
  placement: LinkPlacement
  position?: LinkPosition
}

/**
 * Thin client boundary that adds click tracking to a server-rendered anchor
 * without converting the whole parent section to a client component. Use
 * this for external links inside server components (project detail,
 * publications, certifications, testimonials, experience); components that
 * are already client components should call `trackLinkClick` directly.
 *
 * Wraps rather than `cloneElement`s the child: a child element that crosses
 * the server→client boundary as `children` isn't a plain element `clone`
 * can safely re-type in this Next/Turbopack setup (it renders "Element type
 * is invalid ... undefined" for the child on every page that uses this
 * component). A `display: contents` wrapper adds a click handler via normal
 * event bubbling instead — no `cloneElement`, and no layout footprint since
 * `contents` removes the wrapper from the box tree entirely.
 */
export function TrackedLink({
  children,
  platform,
  url,
  placement,
  position,
}: TrackedLinkProps) {
  const handleClick = () => {
    trackLinkClick({ platform, url, placement, position })
  }

  return (
    <span onClick={handleClick} className="contents">
      {children}
    </span>
  )
}
