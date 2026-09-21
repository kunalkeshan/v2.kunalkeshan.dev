import "server-only"

import { env } from "@workspace/env/server"

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify"

/**
 * Vercel sets `x-forwarded-for` to a comma-separated list with the client
 * first; anything else (local dev, an unknown proxy) falls back to a fixed
 * placeholder rather than throwing, since Turnstile's `remoteip` is optional
 * — Cloudflare still validates the token without it.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim()
  return ip || "unknown"
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 *
 * Returns `true` when `TURNSTILE_SECRET_KEY` is unset — Turnstile keys aren't
 * provisioned yet (the domain isn't finalized), and the contact form ships
 * with no widget in that state, so there is nothing to verify. Once both
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set, this
 * starts enforcing automatically — no code change needed.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true
  }

  if (!token) {
    return false
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp,
      }),
    })

    const result = (await response.json()) as { success: boolean }
    return result.success
  } catch (err: unknown) {
    console.error("Turnstile verification error:", err)
    return false
  }
}
