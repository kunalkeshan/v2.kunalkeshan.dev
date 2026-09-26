# Changelog page

`apps/web`'s `/changelog` route (`apps/web/app/(static)/changelog/page.tsx`) lists this app's own GitHub Releases, newest first — it does not introduce a new content type. See `docs/runbooks/releases.md` for the underlying convention this builds on: GitHub Releases already double as the changelog for this repo, tagged `<app-dir>-vX.Y.Z`.

## Data source

`getAppReleases(appPrefix, options)` in `@workspace/version` (`packages/version/src/index.ts`) fetches this repo's releases from the GitHub REST API and filters them to one app's tag prefix (`/changelog` calls it with `"web"`, so only `web-v*` tags ever appear on it). The function is written generically — a future app wanting its own changelog page reuses the same function with its own prefix; no page aggregates multiple apps' releases together.

GitHub's Releases API has no server-side "filter by tag prefix," so this fetches the 100 most recent releases across every app in one call (GitHub's per-request max) and filters in-app. That comfortably covers this project's realistic release volume; if a single app's release count ever needs true multi-page GitHub fetching, that's an isolated change inside `getAppReleases`.

## Caching

The fetch uses Next's `fetch` cache with a one-hour `revalidate` window (`RELEASES_REVALIDATE_SECONDS` in the page) — no webhook-driven on-demand revalidation. A newly published release shows up within an hour, which is more than adequate for a handful of releases a year.

A failed fetch (GitHub API rate limit, transient outage) is caught in the page component and degrades to a "couldn't load releases right now" empty state instead of a 500 — the GitHub API is out of this app's control, so a hiccup there shouldn't take down the whole page.

## Rate limiting

Unauthenticated GitHub API requests are capped at 60/hour per IP — comfortably enough given the hourly cache above, but an optional `GITHUB_RELEASES_TOKEN` server env var (a fine-grained PAT with public read-only "Contents" access) raises that to 5,000/hour. See `apps/web/env.sample`. While unset, the fetch simply runs unauthenticated.

## Pagination

Page-based via `?page=`, reusing `apps/web/lib/posts.ts`'s `pageSlice`/`pageCount`/`parsePage` helpers (already shared by `/blog`, `/journal`, and `/tags/[tag]`) against the in-memory filtered releases array instead of a GROQ range — the two are slice-compatible. No text/tag search filter: GitHub's API doesn't support full-text search over release notes, and adding one client-side would mean fetching every release anyway, defeating the point of paginating.

## Rendering

Each release's body (Markdown, as authored in the GitHub Release UI) is rendered with `react-markdown` + `remark-gfm` via `apps/web/components/changelog/changelog-markdown-components.tsx`. This repo has no `@tailwindcss/typography`/`.prose` dependency — Sanity content is rendered with hand-styled per-node components instead (see `apps/web/components/sanity/portable-text-components.tsx`), so the changelog's markdown components follow that same convention rather than introducing a blanket prose class.

Headings are demoted by two levels (markdown `h1` → rendered `<h3>`, down to `h5`/`h6` → bold paragraph) rather than the one-level shift used for Sanity content: the page's `<h1>` is the page title, and each entry's release name is already rendered as an `<h2>` (`apps/web/components/changelog/changelog-entry.tsx`), so release-body headings need to start a level further in to nest correctly under that `<h2>` instead of colliding with it.

## Discoverability

Linked from the footer's "Utility links" list and from the command menu (⌘K/Ctrl+K) — see `docs/feature/command-menu.md`. Included in `apps/web/app/sitemap.ts`'s `"static"` chunk (it has no per-item detail pages, so it isn't a new per-collection sitemap chunk).
