/**
 * Fixed marketing facts about the brand — not sourced from Sanity, since
 * these rarely change and every template needs them synchronously.
 *
 * No `logoUrl`/`homeUrl` here: this package has no access to `SITE_URL` (that
 * lives in `@workspace/env/server`, an apps/web-only dependency) or to the
 * Sanity-hosted logo asset. Both are resolved by the caller (apps/web's send
 * code) and passed into `EmailHeader`/the template as props — see
 * `contact-notification.tsx`. When neither is available, `EmailHeader` falls
 * back to a plain text wordmark using `siteName` below.
 */
export const EMAIL_BRAND = {
  siteName: "Kunal Keshan",
} as const;
