# `@workspace/version`

Small, pure helpers for the per-app release/versioning convention (see `docs/runbooks/releases.md`). Each app in `apps/*` is released independently, tagged as `<app-dir>-vX.Y.Z` (e.g. `web-v1.0.0`), and displays its own version in its UI (e.g. `apps/web`'s footer).

This package deliberately does **not** read any app's `package.json` itself — Turborepo keeps workspace boundaries strict, and a shared package reaching into a specific app's files would be fragile and ambiguous about which app it means. Instead, it exports pure functions that take a version string and/or app prefix as arguments; each consuming app imports its own `package.json` locally (one line, e.g. `apps/web/config/version.ts`) and passes that value in.

See the Sanity/version fields in the root `AGENTS.md` and `docs/runbooks/releases.md` for the full release flow this supports.
