"use client"

import { cloneElement, type ReactElement } from "react"

import {
  trackLinkClick,
  type LinkPlacement,
  type LinkPosition,
} from "@/lib/analytics"

interface TrackedLinkProps {
  /** A server-rendered `<a>` element to wrap — its own onClick, if any, still runs. */
  children: ReactElement<{ onClick?: React.MouseEventHandler }>
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
 */
export function TrackedLink({
  children,
  platform,
  url,
  placement,
  position,
}: TrackedLinkProps) {
  return cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event)
      trackLinkClick({ platform, url, placement, position })
    },
  })
}
