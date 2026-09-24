# Runbook: Vercel Deployment

Deploying to Vercel is a deliberate, manually-triggered action — it is **not** part of the Definition of Done for every change, and should not be run automatically at the end of unrelated tasks. Only deploy when explicitly asked.

This repo may host more than one deployable app under `apps/*` over time (currently just `apps/web`; `apps/studio` deploys via the Sanity CLI instead, see `docs/runbooks/sanity-workflow.md`, not Vercel). Each deployable app under `apps/*` gets its **own** Vercel project, linked and configured the same way, described once below.

## One-time setup: linking a new app's Vercel project

**Confirmed limitation (tested 2026-07-08):** the Vercel CLI (`vercel link`, from either the repo root or the app subdirectory) always creates the project with **Root Directory = `.`** (repo root) — there is no CLI flag or `vercel.json` key to set Root Directory. `vercel project inspect <name>` was used to confirm this after linking both ways. Root Directory is a **dashboard-only** setting.

Steps for `apps/<name>`:

1. From inside `apps/<name>`, run:
   ```bash
   cd apps/<name>
   vercel link --project <project-name>
   ```
   This creates the Vercel project and `apps/<name>/.vercel/project.json` (gitignored).
2. Go to `vercel.com/<scope>/<project-name>/settings` (General tab) and set **Root Directory** to `apps/<name>`. Save.
3. Framework Preset, Build Command, Install Command, Output Directory can stay on their auto-detected defaults once Root Directory is correct — Vercel then reads `pnpm-lock.yaml`/`pnpm-workspace.yaml` from the true repo root and correctly detects the pnpm workspace, scoping the build to `apps/<name>` via `turbo build`.

Without step 2, the build fails: Vercel defaults to `npm install` at the repo root, which errors on pnpm's `workspace:*` protocol in `package.json` (`npm error code EUNSUPPORTEDPROTOCOL`).

### This project: `apps/web` → `v2-kunalkeshan-dev`

Linked, Root Directory set to `apps/web`, env vars configured, and promoted to production. **Live at https://v2-kunalkeshan-dev.vercel.app.**

## Environment variables

Set per-project in the Vercel dashboard (Project → Settings → Environment Variables) for Production (and Preview if desired). For `apps/web`, see `apps/web/env.sample` for the full list and `docs/infra/deployment.md` for what each one means:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL` — production value: `https://kunalkeshan.sanity.studio`
- `NEXT_PUBLIC_SITE_URL` — production value: `https://v2-kunalkeshan-dev.vercel.app`
- `SANITY_WEBHOOK_SECRET` — see `docs/infra/deployment.md`'s "Revalidation webhook" section for how it's registered
- `SANITY_API_READ_TOKEN` — Viewer-role token for Live Content API / draft-mode preview, see `apps/web/env.sample`

## Deploying

```bash
cd apps/<name>

# Preview deployment (safe default — does not touch production domain)
vercel

# Production deployment (only when explicitly requested)
vercel --prod
```

Run from inside the linked app's directory (or use `vercel [path-to-project]` from elsewhere), since that's where `.vercel/project.json` lives.

## Turborepo remote caching (optional)

Vercel Remote Caching for Turborepo is separate from deploying — it speeds up `turbo build`/`turbo typecheck` locally and in CI by sharing cache artifacts. To enable, from the **repo root**:

```bash
pnpm dlx turbo login
pnpm dlx turbo link
```

This is opt-in and not required for deployment to work.
