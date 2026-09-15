import "server-only";

import type { QueryParams } from "next-sanity";

import type { CacheTag } from "./cache-tags";
import { client } from "./client";

type NextFetchOptions = {
  revalidate?: number | false;
  cache?: "force-cache" | "no-store";
};

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as CacheTag[];
const FETCH_OPTIONS: NextFetchOptions = {
  revalidate: false, // Use on-demand revalidation via webhook only
};

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
  options = FETCH_OPTIONS,
}: {
  query: string;
  params?: QueryParams;
  tags?: CacheTag[];
  options?: NextFetchOptions;
}): Promise<QueryResponse> {
  return client
    .withConfig({ useCdn: false })
    .fetch<QueryResponse>(query, params, {
      ...(options.cache && {
        cache: options.cache,
      }),
      next: {
        revalidate: options.revalidate,
        tags,
      },
    });
}

/**
 * Client-side fetch utility for Sanity queries.
 * Use this for client-side data fetching (e.g., with TanStack Query).
 */
export async function clientFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params, {
    perspective: "published",
    useCdn: true,
    // Disable cache for client-side fetching since TanStack Query handles caching
    cache: "no-store",
  });
}
