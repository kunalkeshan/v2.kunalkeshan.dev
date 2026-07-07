import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
    SANITY_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: {
    SITE_URL: process.env.SITE_URL,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
  },
});
