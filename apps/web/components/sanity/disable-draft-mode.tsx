"use client"

import { useIsPresentationTool } from "next-sanity/hooks"

/**
 * A visible way out of Draft Mode when a page is opened directly (outside
 * the Presentation Tool's iframe) — e.g. a draft link shared or bookmarked.
 * Hidden inside the Presentation Tool itself, since Studio already controls
 * draft mode there via its own preview/exit affordances.
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  if (isPresentationTool) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded-sm border-2 border-border bg-card px-3 py-2 text-xs font-bold shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      Disable Draft Mode
    </a>
  )
}
