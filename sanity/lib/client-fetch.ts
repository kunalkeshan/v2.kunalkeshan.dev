import { client } from "./client";

/**
 * Client-side fetch utility for Sanity queries
 * Use this for client-side data fetching (e.g., with TanStack Query)
 *
 * @template T - The expected return type of the query
 * @param query - The GROQ query string
 * @param params - Query parameters
 * @returns Promise with the query result
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
