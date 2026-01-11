import { assertValue } from "@/lib/utils";

export const SITE_CONFIG = {
  URL: assertValue(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.SITE_URL,
    "Missing environment variable: SITE_URL"
  ),
};
