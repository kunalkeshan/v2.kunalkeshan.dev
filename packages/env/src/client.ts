import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * `z.url()` validates but does not normalize — a trailing slash (e.g.
 * `https://kunalkeshan.dev/` instead of `https://kunalkeshan.dev`) passes
 * through unchanged. Every consumer of these vars builds URLs by string
 * concatenation (`` `${env.NEXT_PUBLIC_SITE_URL}/path` ``, not `new URL()`),
 * so an un-stripped trailing slash silently produces double-slash URLs
 * (`https://kunalkeshan.dev//path`) in the sitemap, JSON-LD `@id` fields,
 * robots.txt, llms.txt, and the shadcn registry instructions. Stripping it
 * once here means every call site gets a clean value for free.
 */
const urlNoTrailingSlash = () => z.url().transform((value) => value.replace(/\/+$/, ""));

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
    NEXT_PUBLIC_SANITY_STUDIO_URL: urlNoTrailingSlash(),

    // The site's own base URL (e.g. https://kunalkeshan.dev in production,
    // http://localhost:3000 in dev). Client-readable so components rendered
    // in the browser (e.g. the /style-guide registry instructions) can build
    // absolute URLs without prop-drilling from a Server Component. Server
    // code prefers Vercel's auto-injected VERCEL_PROJECT_PRODUCTION_URL over
    // this when present — see apps/web/config/site.ts's SITE_CONFIG.URL.
    NEXT_PUBLIC_SITE_URL: urlNoTrailingSlash(),

    // Cloudflare Turnstile — optional until a widget/domain exists. The
    // contact form renders no widget at all while this is unset.
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),

    // Google Analytics 4 — optional. While unset, GoogleAnalyticsScript
    // renders nothing (see apps/web/components/analytics/google-analytics.tsx).
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).optional(),

    // Microsoft Clarity — optional. While unset, ClarityScript renders
    // nothing; even when set, it only initializes in production (see
    // apps/web/components/analytics/clarity.tsx).
    NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION:
      process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_CLARITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  },
});
