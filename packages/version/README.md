# `@workspace/version`

Small, pure helpers for the per-app release/versioning convention (see `docs/runbooks/releases.md`). Each app in `apps/*` is released independently, tagged as `<app-dir>-vX.Y.Z` (e.g. `web-v1.0.0`), and displays its own version in its UI (e.g. `apps/web`'s footer).

This package deliberately does **not** read any app's `package.json` itself — Turborepo keeps workspace boundaries strict, and a shared package reaching into a specific app's files would be fragile and ambiguous about which app it means. Instead, it exports pure functions that take a version string and/or app prefix as arguments; each consuming app imports its own `package.json` locally (one line, e.g. `apps/web/config/version.ts`) and passes that value in.

`getAppReleases(appPrefix, options)` extends the same idea to full release data: it fetches this repo's GitHub Releases and filters them to one app's `<appPrefix>-vX.Y.Z` tags, for building an in-app changelog page (see `apps/web/app/(static)/changelog/page.tsx`). It takes the app prefix and an optional token/revalidate window as arguments rather than reading env vars itself, same as the URL helpers above — any app wanting its own changelog page reuses this one function with its own prefix.

See the Sanity/version fields in the root `AGENTS.md` and `docs/runbooks/releases.md` for the full release flow this supports.
