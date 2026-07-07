# Deployment

`apps/web` and `apps/studio` deploy completely independently — different targets, different pipelines, no shared release process.

## `apps/web` — Vercel

Deployed as a standard Next.js app on Vercel. Vercel Project ID: `v2-kunalkeshan-dev`. Build command runs from the monorepo root via Turborepo (`turbo build`, auto-scoped to `web` since the Vercel project's Root Directory is set to `apps/web`).

Deploying is manual/on-demand — see [`docs/runbooks/vercel-deployment.md`](../runbooks/vercel-deployment.md) for the exact linking and deploy commands. It is not part of every change's Definition of Done.

Required production env vars (see `apps/web/env.sample`):

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `eqohkmfj` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2026-01-08` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://kunalkeshan.sanity.studio` in production |
| `SITE_URL` | canonical site URL (falls back from `VERCEL_PROJECT_PRODUCTION_URL` if unset — see `apps/web/config/site.ts`) |
| `SANITY_WEBHOOK_SECRET` | shared secret configured in the Sanity webhook (see below) |

## `apps/studio` — Sanity-managed hosting

Deployed via the Sanity CLI, **not** Vercel:

```bash
pnpm --filter studio deploy
```

Live at **https://kunalkeshan.sanity.studio**. The app ID from the first deploy is pinned in `apps/studio/.env` (`SANITY_STUDIO_APP_ID`) so subsequent deploys target the same Studio instance instead of prompting to create a new one.

Full first-time setup and redeploy steps: [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md).

## Revalidation webhook

`apps/web/app/api/revalidate/route.ts` expects a Sanity webhook configured in [sanity.io/manage](https://sanity.io/manage) → project `eqohkmfj` → API → Webhooks, pointed at `https://<production-domain>/api/revalidate`, with the same secret value as `SANITY_WEBHOOK_SECRET`.
