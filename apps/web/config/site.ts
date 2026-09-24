import { env } from "@workspace/env/client";

/**
 * The site's own base URL for server-side absolute-URL building (metadataBase,
 * sitemap/robots/llms.txt entries, JSON-LD). Prefers Vercel's auto-injected
 * `VERCEL_PROJECT_PRODUCTION_URL` (server-only, so this stays a raw
 * `process.env` read rather than going through `@workspace/env`) when present,
 * falling back to the validated `NEXT_PUBLIC_SITE_URL`. `env.NEXT_PUBLIC_SITE_URL`
 * already throws a descriptive error at import time if unset/invalid, so no
 * separate assertion is needed here.
 *
 * Client components that need the base URL (e.g. the /style-guide registry
 * instructions) should import `env` from `@workspace/env/client` directly
 * instead of this object, since `VERCEL_PROJECT_PRODUCTION_URL` isn't
 * available in the browser.
 */
export const SITE_CONFIG = {
  URL: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.NEXT_PUBLIC_SITE_URL,
};
