# Runbook: Vercel Deployment (apps/web)

Deploying to Vercel is a deliberate, manually-triggered action — it is **not** part of the Definition of Done for every change, and should not be run automatically at the end of unrelated tasks. Only deploy when explicitly asked.

## One-time setup: linking the project

Because this is a Turborepo monorepo, the Vercel project must be linked from inside `apps/web`, not the repo root — this is what sets Vercel's **Root Directory** to `apps/web` automatically.

```bash
cd apps/web
vercel link --project v2-kunalkeshan-dev
```

This creates `apps/web/.vercel/project.json` (gitignored) tying this local checkout to the Vercel project. Requires an active Vercel CLI login (`vercel login` — interactive, must be run by a human) under the correct account/scope.

Vercel auto-detects, for a linked Turborepo project:

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Build Command | `turbo build` (global `turbo`, auto-scoped to `web` via inferred root directory) |
| Install Command | auto-detected (pnpm, from `pnpm-lock.yaml`) |
| Output Directory | framework default (`.next`) |

No `vercel.json` is required unless overriding these defaults.

## Environment variables

Set these in the Vercel dashboard (Project → Settings → Environment Variables) for Production (and Preview if desired) — see `apps/web/env.sample` for the full list and `docs/infra/deployment.md` for what each one means:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL` — production value: `https://kunalkeshan.sanity.studio`
- `SITE_URL`
- `SANITY_WEBHOOK_SECRET`

## Deploying

```bash
cd apps/web

# Preview deployment (safe default — does not touch production domain)
vercel

# Production deployment (only when explicitly requested)
vercel --prod
```

Both commands must be run from `apps/web` (or anywhere, using `vercel [path-to-project]`) since that's where the project is linked.

## Turborepo remote caching (optional)

Vercel Remote Caching for Turborepo is separate from deploying — it speeds up `turbo build`/`turbo typecheck` locally and in CI by sharing cache artifacts. To enable, from the **repo root**:

```bash
pnpm dlx turbo login
pnpm dlx turbo link
```

This is opt-in and not required for deployment to work.
