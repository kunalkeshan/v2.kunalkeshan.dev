const REPO_URL = "https://github.com/kunalkeshan/v2.kunalkeshan.dev";
const REPO_API_URL = "https://api.github.com/repos/kunalkeshan/v2.kunalkeshan.dev";

/**
 * The GitHub Releases index for this repo. GitHub Releases double as the
 * changelog here (see `docs/runbooks/releases.md`) — there is no separate
 * CHANGELOG.md.
 */
export function getReleasesUrl(): string {
  return `${REPO_URL}/releases/latest`;
}

/**
 * The GitHub Releases URL for one specific tagged release, following this
 * repo's `<app-dir>-vX.Y.Z` tag convention (e.g. `web-v1.0.0`).
 */
export function getReleaseTagUrl(appPrefix: string, version: string): string {
  return `${REPO_URL}/releases/tag/${appPrefix}-v${version}`;
}

/** Formats a raw semver string for display, e.g. `"1.0.0"` -> `"v1.0.0"`. */
export function formatVersion(version: string): string {
  return `v${version}`;
}

export interface AppRelease {
  tag: string;
  version: string;
  name: string;
  publishedAt: string | null;
  url: string;
  body: string;
}

export interface GetAppReleasesOptions {
  /** Raises the GitHub API rate limit from 60/hr to 5,000/hr when provided. */
  token?: string;
  /** Next.js `fetch` cache revalidation window, in seconds. */
  revalidate?: number;
}

interface GitHubReleaseApiResponse {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
}

/**
 * Fetches this repo's published GitHub Releases tagged for one app
 * (`<appPrefix>-vX.Y.Z`, e.g. "web" -> `web-v1.2.3`), newest first.
 *
 * GitHub's Releases API has no server-side "filter by tag prefix" — this
 * fetches the 100 most recent releases across every app in one call and
 * filters client-side. That comfortably covers this project's realistic
 * release volume; revisit only if a single app's release count needs true
 * multi-page GitHub fetching.
 */
export async function getAppReleases(
  appPrefix: string,
  { token, revalidate }: GetAppReleasesOptions = {}
): Promise<AppRelease[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${REPO_API_URL}/releases?per_page=100`, {
    headers,
    ...(revalidate !== undefined && { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub releases: ${response.status} ${response.statusText}`
    );
  }

  const releases: GitHubReleaseApiResponse[] = await response.json();
  const prefix = `${appPrefix}-v`;

  return releases
    .filter((release) => !release.draft && release.tag_name.startsWith(prefix))
    .map((release) => ({
      tag: release.tag_name,
      version: release.tag_name.slice(prefix.length),
      name: release.name || release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url,
      body: release.body ?? "",
    }));
}
