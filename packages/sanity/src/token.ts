import "server-only";

/**
 * Viewer-role read token for the Live Content API / draft-mode preview.
 * Returns `undefined` when unset rather than throwing — both call sites
 * (`./live.ts`'s `defineLive`, and the `/api/draft-mode/enable` route's
 * `defineEnableDraftMode`) evaluate this at module scope, which Next.js
 * runs during build-time route collection for every route, including ones
 * that never touch draft mode (e.g. `sitemap.ts` imports `./live`). A
 * missing token must never fail module evaluation or a build — `defineLive`
 * simply serves published content with no live/draft capability without
 * one, and the draft-mode enable route just fails at request time (a normal
 * Sanity API auth error) if it's ever hit without a token configured.
 */
export function getSanityReadToken(): string | undefined {
  return process.env.SANITY_API_READ_TOKEN || undefined;
}
