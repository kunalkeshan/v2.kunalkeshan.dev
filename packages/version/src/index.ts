const REPO_URL = "https://github.com/kunalkeshan/v2.kunalkeshan.dev";

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
