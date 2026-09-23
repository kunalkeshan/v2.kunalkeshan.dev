# Documentation Index

This is the documentation root for `v2.kunalkeshan.dev`. See `CLAUDE.md`/`AGENTS.md` at the repo root for conventions and the Definition of Done.

## Guides

- [`architecture.md`](./architecture.md) — monorepo layout, apps/packages, how they relate
- [`seo.md`](./seo.md) — JSON-LD structured data, canonical URLs, the sitemap/robots/llms.txt setup, and per-document `noindex`

## Feature docs (`docs/feature/`)

Per-feature deep dives — what the feature does, where its code lives, and any non-obvious decisions.

- [`sanity-cms.md`](./feature/sanity-cms.md) — content modeling, the Studio app, and how `apps/web` consumes it
- [`command-menu.md`](./feature/command-menu.md) — keyboard shortcut, searchable destinations, and optional portfolio actions

## Content docs (`docs/content/`)

- [`persona-and-tone.md`](./content/persona-and-tone.md) — current professional/freelancer persona for page copy, and the old student-era framing to avoid reintroducing

## Infra docs (`docs/infra/`)

Deployment, hosting, and operational topology.

- [`deployment.md`](./infra/deployment.md) — how `apps/web` and `apps/studio` each deploy, independently

## UI docs (`docs/ui/`)

- [`font-stack.md`](./ui/font-stack.md) — shared font package convention
- [`design-system.md`](./ui/design-system.md) — token model, shadow/radius/motion scales, and the neobrutalism visual language
- [`style-guide.md`](./ui/style-guide.md) — the `/style-guide` page and the shadcn registry (`packages/ui/registry.json`)

## Runbooks (`docs/runbooks/`)

Operational how-tos for recurring or step-by-step tasks.

- [`linting.md`](./runbooks/linting.md) — ESLint flat-config layout, and what a new workspace package must ship to keep `pnpm lint` passing
- [`sanity-workflow.md`](./runbooks/sanity-workflow.md) — schema → typegen → types → consumer propagation, and Studio deploy steps
- [`vercel-deployment.md`](./runbooks/vercel-deployment.md) — linking and deploying `apps/web` to Vercel (manual, on-demand only — not part of every change's Definition of Done)
- [`contact-form.md`](./runbooks/contact-form.md) — `/contact` form env vars (nodemailer, Turnstile), the `@workspace/emails` package, and why rate limiting isn't implemented yet

This directory starts small on purpose — add a runbook when a real recurring task or incident happens, not speculatively.
