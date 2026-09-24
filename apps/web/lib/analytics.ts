/**
 * Single entry point for custom click/interaction tracking. Every call fires
 * to both GA4 (via sendGAEvent) and Microsoft Clarity (via event + setTag).
 * Components must call these helpers — never call sendGAEvent or clarity
 * directly — so event names/params stay consistent across the app.
 */
"use client"

import { sendGAEvent } from "@next/third-parties/google"
import clarity from "@microsoft/clarity"

export type LinkPlacement =
  | "hero"
  | "footer"
  | "contact_socials"
  | "contact_copy_email"
  | "command_menu"
  | "resume_cta"
  | "blog_share"
  | "project_detail"
  | "publications"
  | "certifications"
  | "testimonials"
  | "experience"

export type LinkPosition = "primary" | "secondary"

interface TrackLinkClickParams {
  platform: string
  url: string
  placement: LinkPlacement
  position?: LinkPosition
}

interface TrackFormEventParams {
  formName: string
  status: "submit" | "success" | "error"
  errorMessage?: string
}

interface TrackUiEventParams {
  name: string
  placement: LinkPlacement | "global"
  [key: string]: string | undefined
}

function safeCall(fn: () => void) {
  try {
    fn()
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics]", error)
    }
  }
}

/** Fires for any outbound/external link click (social, footer credit, share, etc). */
export function trackLinkClick({
  platform,
  url,
  placement,
  position,
}: TrackLinkClickParams): void {
  safeCall(() =>
    sendGAEvent("event", "link_click", {
      platform,
      placement,
      link_url: url,
      ...(position && { position }),
    })
  )

  safeCall(() => {
    clarity.setTag("last_link_platform", platform)
    clarity.setTag("last_link_placement", placement)
    clarity.event("link_click")
  })
}

/** Fires for a named form's lifecycle (submit attempt, success, or error). */
export function trackFormEvent({
  formName,
  status,
  errorMessage,
}: TrackFormEventParams): void {
  const eventName = `${formName}_${status}` // e.g. contact_form_submit

  safeCall(() =>
    sendGAEvent("event", eventName, {
      form_name: formName,
      ...(errorMessage && { error_message: errorMessage }),
    })
  )

  safeCall(() => {
    clarity.setTag("last_form_event", eventName)
    clarity.event(eventName)
  })
}

/** Fires for any other named interaction that isn't a link click or form event. */
export function trackUiEvent({
  name,
  placement,
  ...rest
}: TrackUiEventParams): void {
  safeCall(() => sendGAEvent("event", name, { placement, ...rest }))

  safeCall(() => {
    clarity.setTag("last_ui_event", name)
    clarity.event(name)
  })
}
