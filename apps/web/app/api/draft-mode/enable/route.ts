import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@workspace/sanity/client";
import { getSanityReadToken } from "@workspace/sanity/token";

// Called by the Presentation Tool (`previewUrl.previewMode.enable` in
// apps/studio/sanity.config.ts). Verifies Sanity's own preview secret
// internally, then turns on Next.js Draft Mode via `client.withConfig`.
//
// `defineEnableDraftMode` needs the configured client synchronously at
// module scope (it returns the `GET` handler directly), and this module is
// evaluated during Next.js's build-time route collection — so this must
// never throw here. If `SANITY_API_READ_TOKEN` is unset, `getSanityReadToken()`
// returns `undefined` and the resulting client has no token; the route still
// builds fine, and only fails at request time (a normal Sanity API auth
// error) if this route is actually hit without a token configured.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: getSanityReadToken() }),
});
