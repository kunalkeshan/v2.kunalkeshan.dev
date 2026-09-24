import { GoogleAnalytics } from "@next/third-parties/google"

import { env } from "@workspace/env/client"

/** Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */
export function GoogleAnalyticsScript() {
  if (!env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null

  return <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
}
