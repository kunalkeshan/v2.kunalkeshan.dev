import "server-only"

/**
 * Star counts for public repos, fetched at build time.
 *
 * Deliberately batched: the caller collects every `githubRepo` on the page and
 * makes one call to this function, which resolves them in parallel and hands
 * back a lookup map. Calling it per-card would issue ~15 requests per render,
 * and GitHub's *unauthenticated* limit is 60 requests/hour for the whole build
 * machine — a handful of rebuilds would exhaust it and start returning 403s.
 *
 * Failure is always soft. A rate-limited or offline GitHub must never fail the
 * build or blank the page: every error path yields "no count for this repo",
 * and the badge simply doesn't render. That is also why this never throws.
 */

const GITHUB_API = "https://api.github.com/repos"

/** One day. Star counts are ambient signal, not something worth re-fetching. */
const REVALIDATE_SECONDS = 86_400

async function fetchOne(repo: string): Promise<[string, number] | null> {
  try {
    const response = await fetch(`${GITHUB_API}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        // GitHub asks for a UA; omitting it gets requests rejected outright.
        "User-Agent": "kunalkeshan.dev",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!response.ok) return null

    const data: unknown = await response.json()
    const stars = (data as { stargazers_count?: unknown })?.stargazers_count

    return typeof stars === "number" ? [repo, stars] : null
  } catch {
    return null
  }
}

/**
 * @param repos `owner/name` strings, as stored on the project documents.
 *   Blank/undefined entries are filtered out by the caller's `.filter(Boolean)`.
 * @returns repo -> star count, omitting anything that failed or isn't public.
 */
export async function fetchStars(
  repos: readonly string[]
): Promise<Map<string, number>> {
  const unique = [...new Set(repos.filter(Boolean))]
  if (unique.length === 0) return new Map()

  const settled = await Promise.all(unique.map(fetchOne))

  return new Map(settled.filter((entry): entry is [string, number] => entry !== null))
}
