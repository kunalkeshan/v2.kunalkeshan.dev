# Releases & app versioning

Each app under `apps/*` is versioned and released independently — there is no single repo-wide version. This mirrors the pattern used in the sibling `keeping-it-sou` repo, adapted for a Turborepo monorepo with multiple apps.

## The flow

1. A human (not CI) publishes a **GitHub Release** through the GitHub UI or `gh release create`, tagged `<app-dir>-vX.Y.Z` — e.g. `web-v1.2.3` for a release of `apps/web`. Write real release notes; GitHub Releases *are* the changelog here — there is no separate `CHANGELOG.md` file to maintain.
2. Publishing the release fires `.github/workflows/sync-version.yml` (`on: release: published`). It:
   - Parses the tag into `<app-prefix>` and `<version>`.
   - Runs `pnpm --filter <app-prefix> version <version> --no-git-tag-version --allow-same-version`, which bumps `apps/<app-prefix>/package.json`'s `"version"` field.
   - Opens a PR (`chore/version-<tag>`) with that one-line change and enables `--auto --squash` merge.
3. The PR auto-merges once required checks pass — in practice, Vercel's own PR check (it's connected to this repo and posts a build/preview status on every PR) is what gates the merge. There's no separate custom CI workflow for this; see `docs/infra/deployment.md`.
4. The app's UI reads its own bumped version at build time and displays it (see below). The next deploy of that app then shows the new version.

The workflow can also be run manually via `workflow_dispatch` with an explicit `tag` input (useful for backfilling or re-running), or with no input, in which case it falls back to whatever the GitHub API reports as the latest published release.

## Tag convention

`<app-dir>-vX.Y.Z`, where `<app-dir>` is the literal directory name under `apps/` (e.g. `web`, and a hypothetical future app would be `project` for `apps/project`). The workflow derives the prefix mechanically from the tag — there is no lookup table to maintain, and **no workflow change is needed to onboard a new app** to this pattern.

**Requirement for any new app that wants this**: the app's `package.json` `"name"` field must exactly equal its `apps/<name>` directory name (this already holds for both `apps/web` → `"name": "web"` and `apps/studio` → `"name": "studio"`), because the workflow bumps the version via `pnpm --filter <app-prefix> version ...`, and `pnpm --filter` resolves by package name.

Only the `apps/*` package versions are tracked this way — the root workspace `package.json` version is never touched (it isn't a deployable artifact), and `packages/*` are never versioned/released independently.

## Displaying the version in an app's UI

Each app that wants to show its version:

1. Adds a small local file that imports its own `package.json` as a JSON module and re-exports the version, e.g. `apps/web/config/version.ts`:
   ```ts
   import packageJson from "@/package.json";
   export const APP_VERSION: string = packageJson.version;
   ```
   This works because the shared `@workspace/typescript-config/base.json` already sets `resolveJsonModule: true`, and each app's `tsconfig.json` maps `@/*` to its own root.
2. Formats/links the version using the shared `@workspace/version` package (`packages/version`), which exports pure helpers — `formatVersion(version)`, `getReleasesUrl()`, `getReleaseTagUrl(appPrefix, version)` — that take primitives as arguments rather than reading any `package.json` themselves. This package intentionally has no knowledge of any specific app; it only builds URLs/strings from what it's given.

`apps/web`'s footer (`apps/web/components/layouts/footer.tsx`) is the first consumer: it shows `v{APP_VERSION}` linked to `getReleasesUrl()` (the repo's `/releases/latest` page) in the bottom copyright line.

## Starting point

`apps/web` was set to `1.0.0` as the first tracked release of the already-live site (previous `0.0.1` was unused scaffolding, not a tracked history). The first real GitHub Release should be tagged `web-v1.0.0` to match.
