// Querying with "sanityFetch" keeps content automatically updated and
// enables Visual Editing. Render "<SanityLive />" once in apps/web's
// (static) layout — see https://github.com/sanity-io/next-sanity#live-content-api
import { defineLive } from "next-sanity/live";

import { client } from "./client";
import { getSanityReadToken } from "./token";

const token = getSanityReadToken();

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
