import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * An optional secret that may be genuinely absent (undefined) OR present but
 * blank (`KEY=` in an env file, e.g. a placeholder left for someone to fill
 * in later) — both should validate as "not set" rather than failing with a
 * "too small" error. Plain `z.string().min(1).optional()` only tolerates the
 * former; a blank string from an `env.sample`-style placeholder still fails
 * `.min(1)`. The empty-string branch normalizes to `undefined` so consumers
 * only ever see a real value or nothing.
 */
const optionalSecret = () =>
  z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined));

export const env = createEnv({
  server: {
    SANITY_WEBHOOK_SECRET: optionalSecret(),

    // Viewer-role read token for the Live Content API / draft-mode preview
    // (next-sanity's defineLive + the /api/draft-mode/enable route). Optional
    // here so builds/typecheck don't fail where it's unset; packages/sanity's
    // getSanityReadToken() returns undefined at call time instead, and only
    // the draft-mode enable route (requireSanityReadToken()) throws on its
    // absence, since that's the only place a missing token is fatal.
    SANITY_API_READ_TOKEN: optionalSecret(),

    // Nodemailer (Gmail SMTP) — sends the /contact form notification email.
    NODEMAILER_EMAIL: z.email(),
    NODEMAILER_PASSWORD: z.string().min(1),

    // Cloudflare Turnstile — optional until a widget/domain exists. The
    // contact API route skips server-side verification entirely while this
    // is unset, so leaving it out never blocks submissions.
    TURNSTILE_SECRET_KEY: optionalSecret(),

    // Optional GitHub token (fine-grained PAT, public read-only) for the
    // /changelog page's GitHub Releases fetch (@workspace/version's
    // getAppReleases). Raises the API rate limit from 60/hr to 5,000/hr;
    // while unset, the fetch runs unauthenticated.
    GITHUB_RELEASES_TOKEN: optionalSecret(),
  },
  experimental__runtimeEnv: {
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    GITHUB_RELEASES_TOKEN: process.env.GITHUB_RELEASES_TOKEN,
  },
});
