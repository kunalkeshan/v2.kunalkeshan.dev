# Deployment

`apps/web` and `apps/studio` deploy completely independently — different targets, different pipelines, no shared release process.

## `apps/web` — Vercel

Deployed as a standard Next.js app on Vercel. Vercel Project ID: `v2-kunalkeshan-dev`. Build command runs from the monorepo root via Turborepo (`turbo build`, auto-scoped to `web` since the Vercel project's Root Directory is set to `apps/web`).

Live in production at **https://v2-kunalkeshan-dev.vercel.app** (the `.vercel.app` domain is the canonical production domain for now — no custom domain attached yet).

Deploying is manual/on-demand — see [`docs/runbooks/vercel-deployment.md`](../runbooks/vercel-deployment.md) for the exact linking and deploy commands. It is not part of every change's Definition of Done.

Production env vars, as set in the Vercel dashboard (see `apps/web/env.sample` for local dev defaults):

| Variable | Production value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `eqohkmfj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-01-08` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://kunalkeshan.sanity.studio` |
| `SITE_URL` | `https://v2-kunalkeshan-dev.vercel.app` |
| `SANITY_WEBHOOK_SECRET` | not yet configured — no webhook set up in Sanity yet (see below) |

## `apps/studio` — Sanity-managed hosting

Deployed via the Sanity CLI, **not** Vercel:

```bash
pnpm --filter studio deploy
```

Live at **https://kunalkeshan.sanity.studio**. The app ID from the first deploy is pinned in `apps/studio/.env` (`SANITY_STUDIO_APP_ID`) so subsequent deploys target the same Studio instance instead of prompting to create a new one.

Full first-time setup and redeploy steps: [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md).

## Revalidation webhook

`apps/web/app/api/revalidate/route.ts` expects a Sanity webhook configured in [sanity.io/manage](https://sanity.io/manage) → project `eqohkmfj` → API → Webhooks, pointed at `https://v2-kunalkeshan-dev.vercel.app/api/revalidate`, with the same secret value as `SANITY_WEBHOOK_SECRET`. Not yet set up — content changes in the Studio won't trigger on-demand revalidation until this webhook exists.
