# Deployment

`apps/web` and `apps/studio` deploy completely independently — different targets, different pipelines, no shared *deploy* process. Each app is versioned and released independently too, via manually published GitHub Releases (`<app-dir>-vX.Y.Z` tags) that trigger a version-bump workflow — see [`docs/runbooks/releases.md`](../runbooks/releases.md). That's a release/versioning process, not a deploy pipeline: publishing a release doesn't itself deploy anything, it just bumps the app's `package.json` version ahead of that app's own next (manual/on-demand) deploy below.

## `apps/web` — Vercel

Deployed as a standard Next.js app on Vercel. Vercel Project ID: `v2-kunalkeshan-dev`. Build command runs from the monorepo root via Turborepo (`turbo build`, auto-scoped to `web` since the Vercel project's Root Directory is set to `apps/web`).

Live in production at **https://kunalkeshan.dev**. The underlying Vercel deployment URL, **https://v2-kunalkeshan-dev.vercel.app**, still works — both origins are registered as Sanity CORS origins (see below).

Deploying is manual/on-demand — see [`docs/runbooks/vercel-deployment.md`](../runbooks/vercel-deployment.md) for the exact linking and deploy commands. It is not part of every change's Definition of Done.

Production env vars, as set in the Vercel dashboard (see `apps/web/env.sample` for local dev defaults):

| Variable | Production value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `eqohkmfj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-01-08` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://kunalkeshan.sanity.studio` |
| `NEXT_PUBLIC_SITE_URL` | `https://kunalkeshan.dev` |
| `SANITY_WEBHOOK_SECRET` | set once the webhook below is registered — see `apps/web/env.sample` for how to generate it |
| `SANITY_API_READ_TOKEN` | Viewer-role token for Live Content API / draft-mode preview — see `apps/web/env.sample` for how to create it |

## `apps/studio` — Sanity-managed hosting

Deployed via the Sanity CLI, **not** Vercel:

```bash
pnpm --filter studio deploy
```

Live at **https://kunalkeshan.sanity.studio**. The app ID from the first deploy is pinned in `apps/studio/.env` (`SANITY_STUDIO_APP_ID`) so subsequent deploys target the same Studio instance instead of prompting to create a new one.

Full first-time setup and redeploy steps: [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md).

## Revalidation webhook

`apps/web/app/api/revalidate/route.ts` requires a Sanity webhook configured in [sanity.io/manage](https://sanity.io/manage) → project `eqohkmfj` → API → Webhooks, pointed at the deployed `/api/revalidate` URL (`https://kunalkeshan.dev/api/revalidate`, with `https://v2-kunalkeshan-dev.vercel.app/api/revalidate` also available), firing on Create/Update/Delete for all document types with no filter, signed with the same secret value as `SANITY_WEBHOOK_SECRET`. This is a manual, one-time setup step in the Sanity dashboard — it isn't something the app or its CI can register on its own.

## Live preview / Visual Editing

The Presentation Tool's preview and the draft-mode routes depend on the same production origin(s) as the webhook above — all are registered as Sanity CORS origins (`https://kunalkeshan.dev`, `https://v2-kunalkeshan-dev.vercel.app`, and the Studio's own `https://kunalkeshan.sanity.studio`). See `docs/feature/sanity-cms.md`'s "Live preview / Visual Editing" section and `docs/runbooks/sanity-workflow.md`'s Presentation Tool preview-origin note. Preview (per-PR/branch) deployments are intentionally out of scope — only production and localhost get webhook revalidation and Presentation Tool support.
