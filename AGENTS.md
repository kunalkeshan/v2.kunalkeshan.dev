# v2.kunalkeshan.dev — Repo Conventions

Personal portfolio site. Turborepo monorepo using pnpm workspaces and shadcn/ui's monorepo scaffold. It is currently a solo project (`apps/web` + `apps/studio`) but may grow additional apps/sub-projects over time — conventions here should scale to that, not assume a single app forever.

This is the single canonical conventions file for the repo. `CLAUDE.md` at the root is a one-line `@AGENTS.md` import — Claude Code reads that file and expands this one into context automatically; other AGENTS.md-aware tooling reads this file directly. Don't split content back across both files.

## Structure

```
apps/
  web/       Next.js 16 site — the actual portfolio (public-facing)
  studio/    Standalone Sanity Studio — content authoring, deployed independently
packages/
  ui/        Shared shadcn/ui primitives + fonts + global Tailwind styles
  sanity/    Shared Sanity client/queries/generated types — consumed by apps/web only
  env/       Shared, validated env vars (@t3-oss/env-nextjs + zod)
  eslint-config/, typescript-config/   Shared tooling config
```

`apps/studio` is **not** embedded in `apps/web` — there is no `/cms` route. It is its own deployable app with its own `package.json`, `.env`, and its own Sanity project/schema ownership. `apps/web` only ever talks to Sanity as a read client via `@workspace/sanity`.

This repo may grow beyond `apps/web` (other portfolio sub-projects, experiments, etc.) — treat `packages/*` as genuinely shared, not "web's stuff living one level up."

See `docs/architecture.md` for the fuller walkthrough of this layout and the package-boundary rules (what belongs in `packages/ui` vs `packages/sanity` vs `packages/env`).

### New package checklist

Every new workspace under `apps/` or `packages/` must ship, or `pnpm lint` breaks
workspace-wide (`turbo lint` aborts on the first failing task):

1. `"@workspace/eslint-config": "workspace:*"` in `devDependencies` — a config file alone does not resolve.
2. A `"lint": "eslint"` script.
3. An `eslint.config.js` re-exporting the right shared config (`base` for non-React TS, `react-internal` for React, `next-js` for a Next app) — **`eslint.config.mjs` if the package has no `"type": "module"`**, otherwise the `import` is parsed as CommonJS and throws.

Full details, including what to ignore and why lint is currently non-blocking: `docs/runbooks/linting.md`.

## Sanity: schema, types, and the propagation rule

**Ownership split:**

- `apps/studio` owns content modeling: `schemaTypes/*.ts`, `structure.ts`, `sanity.config.ts`.
- `packages/sanity/src/query.ts` owns GROQ queries, written with `defineQuery`.
- `packages/sanity/src/sanity.types.ts` is **generated** — it is produced by running typegen from `apps/studio`, but the file itself lives in `packages/sanity` so `apps/web` can import it as `@workspace/sanity/types`.

**The rule (strict, blocking — see Definition of Done below):** any change to a schema field (`apps/studio/schemaTypes/**`) or a GROQ query (`packages/sanity/src/query.ts`) requires regenerating types before the change is done:

```bash
pnpm --filter studio extract   # schema.json
pnpm --filter studio type      # writes packages/sanity/src/sanity.types.ts
```

Then update every consumer in `apps/web` that destructures fields from the affected query result type — the compiler will point them out via `pnpm typecheck`, since the generated types are strict. Never hand-edit `sanity.types.ts`; it will be silently overwritten on the next `type` run.

Full walkthrough: `docs/runbooks/sanity-workflow.md`.

**Deployment:** Studio deploys independently of the web app, to Sanity's own hosting (`sanity deploy`), currently at https://kunalkeshan.sanity.studio. It does not deploy through Vercel and has no relationship to `apps/web`'s deploy pipeline.

## Environment variables

Each app owns its own env file — there is no shared root `.env`:

- `apps/web/.env.local` — `NEXT_PUBLIC_SANITY_*`, `SITE_URL`, `SANITY_WEBHOOK_SECRET`
- `apps/studio/.env` — `SANITY_STUDIO_*` (no `NEXT_PUBLIC_` prefix; Studio is not Next.js)

`packages/env` validates the `apps/web` variables with zod via `@t3-oss/env-nextjs` (`@workspace/env/client`, `@workspace/env/server`). `apps/studio`'s env is consumed directly via `process.env` in `sanity.cli.ts`/`sanity.config.ts` since the Sanity CLI config loader runs outside Next.js.

Every app/package with env vars ships an `env.sample` (or `apps/studio/env.sample`) documenting the shape — these are tracked in git; the real `.env`/`.env.local` files are not (`.gitignore` has a blanket `.env*` rule).

## Fonts and shared UI

Fonts are defined once in `packages/ui/src/lib/fonts.ts`, exporting `rootBodyClassName`. Consuming apps import it and apply it to the root `<html>`/`<body>` element — never load `next/font/google` directly inside an app's `layout.tsx`. This mirrors the same pattern used across other repos in this workspace (e.g. `merchantbanker.in`).

shadcn/ui primitives (button, form, accordion, etc.) live in `packages/ui/src/components` and are added via `pnpm dlx shadcn@latest add <name> -c apps/web` — the CLI auto-routes base components to `packages/ui`. App-specific composed components (layouts, page sections) stay in the consuming app.

**Design system:** `packages/ui`'s tokens and components implement a neobrutalist visual language (thick borders, hard offset shadows, press-into-shadow interaction) — see `docs/ui/design-system.md` for the full token model, and `docs/ui/font-stack.md` for the font pipeline. Component work in `packages/ui` should follow the conventions there rather than introducing new ad-hoc styling.

## Content voice & persona

This site's content reflects Kunal's current life stage — a working software engineer who also freelances independently — not the student persona from the previous portfolio version (`kunalkeshan.dev` v1, written while he was an ECE student at SRMIST). Any new or edited page/section copy must be checked against `docs/content/persona-and-tone.md` before being considered done, and the AI must ask the user before applying any student → professional reframing rather than assuming it silently. See the doc for what's in scope (factual/life-stage framing) versus explicitly out of scope (personal values language, existing personality touches like kaomoji or the footer easter egg).

## Common commands

```bash
pnpm install              # link workspace + install deps
pnpm dev                  # turbo dev — runs apps/web and apps/studio in parallel
pnpm build                # turbo build — builds every app/package
pnpm typecheck             # turbo typecheck — tsc --noEmit across the workspace
pnpm --filter web dev      # just the portfolio site (localhost:3000)
pnpm --filter studio dev   # just the Studio (localhost:3333)
```

## Docs

See `docs/README.md` for the full documentation index. Update the relevant doc whenever you add a workflow, feature, or architectural decision — see the Definition of Done below.

## Definition of Done Checklist

Before considering any change complete:

- [ ] `pnpm typecheck` passes for every affected package/app
- [ ] `pnpm build` succeeds for every affected app
- [ ] `pnpm lint` passes — and if a new workspace package was added, it ships the three items in the New package checklist above (`docs/runbooks/linting.md`)
- [ ] **If a Sanity schema field or GROQ query changed** (`apps/studio/schemaTypes/**`, `apps/studio/structure.ts`, or `packages/sanity/src/query.ts`): typegen was regenerated (`pnpm --filter studio extract && pnpm --filter studio type`) and every consumer of the changed type/query in `apps/web` was updated to match. This is a **strict, blocking rule** — never mark a task done with stale generated types. See `docs/runbooks/sanity-workflow.md`.
- [ ] **If new or edited page/section copy was written** (hero/intro, bio, meta descriptions, experience/resume entries, project write-ups, values or services copy): checked against `docs/content/persona-and-tone.md` and any student-era framing reframed only after asking the user — never applied silently. This is a **strict, blocking rule**, same severity as the Sanity typegen rule above.
- [ ] **If a component was added to, removed from, or given new variants in `packages/ui/src/components`**: `apps/web/app/(static)/style-guide/_components/component-catalog.ts` was updated to register it (and `packages/ui/registry.json` + `pnpm --filter ui registry:build` re-run if it should be externally installable via the shadcn registry). This is a **strict, blocking rule**, same severity as the Sanity typegen rule above. See `docs/ui/style-guide.md`.
- [ ] UI components reuse `@workspace/ui` primitives rather than redefining them locally
- [ ] New/restyled components in `packages/ui` follow the token model and conventions in `docs/ui/design-system.md` (border widths, shadow scale, radius scale, focus rings) rather than inventing ad-hoc values
- [ ] Fonts are sourced from `@workspace/ui/lib/fonts` (`rootBodyClassName`), never loaded inline in an app's `layout.tsx`
- [ ] New env vars are added to the relevant package's `env.sample`/`.env.example` and, if validated, to `packages/env/src/{client,server}.ts`
- [ ] Relevant `docs/` file updated for new workflows, features, or architectural changes (see `docs/README.md` for where things live)
- [ ] No secrets committed (`.env*` stays gitignored; only `env.sample` files are tracked)

## Production Gates (lightweight, portfolio-scoped)

Unlike a multi-tenant SaaS, this repo does not need enterprise-grade compliance gates (backward-compat shims, Sentry triage, dependency SBOM review). It does keep:

- **Security basics (OWASP-lite)**: no secrets in code, sanitize/validate any user input (e.g. webhook signature verification in `apps/web/app/api/revalidate/route.ts`), no `dangerouslySetInnerHTML` without justification, keep dependencies reasonably current.
- **Accessibility**: this is explicitly a bar to hold, not skip. Semantic HTML, labeled form fields (via `@workspace/ui/components/form`), sufficient color contrast in `packages/ui/src/styles/globals.css` theme tokens, keyboard-navigable interactive elements, `alt` text on all Sanity-sourced images.

If a change touches either area non-trivially, call it out explicitly when reporting the change as done.
