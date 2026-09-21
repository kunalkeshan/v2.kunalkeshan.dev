import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
    SANITY_WEBHOOK_SECRET: z.string().min(1).optional(),

    // Nodemailer (Gmail SMTP) — sends the /contact form notification email.
    NODEMAILER_EMAIL: z.email(),
    NODEMAILER_PASSWORD: z.string().min(1),

    // Cloudflare Turnstile — optional until a widget/domain exists. The
    // contact API route skips server-side verification entirely while this
    // is unset, so leaving it out never blocks submissions.
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: {
    SITE_URL: process.env.SITE_URL,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  },
});
