"use client"

import { useEffect } from "react"
import clarity from "@microsoft/clarity"

import { env } from "@workspace/env/client"

/**
 * Renders nothing until NEXT_PUBLIC_CLARITY_PROJECT_ID is set. Even when set,
 * only initializes in production — this keeps local dev traffic out of
 * Clarity session recordings, matching the reference implementation this
 * setup was adapted from (keeping-it-sou).
 */
export function ClarityScript() {
  useEffect(() => {
    if (!env.NEXT_PUBLIC_CLARITY_PROJECT_ID) return
    if (process.env.NODE_ENV !== "production") return

    try {
      clarity.init(env.NEXT_PUBLIC_CLARITY_PROJECT_ID)
    } catch (error) {
      console.error("Failed to initialize Microsoft Clarity:", error)
    }
  }, [])

  return null
}
