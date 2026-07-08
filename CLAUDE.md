# v2.kunalkeshan.dev

Personal portfolio site. Turborepo monorepo using pnpm workspaces and shadcn/ui's monorepo scaffold.

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

## Sanity: schema, types, and the propagation rule

**Ownership split:**
- `apps/studio` owns content modeling: `schemaTypes/*.ts`, `structure.ts`, `sanity.config.ts`.
- `packages/sanity/src/query.ts` owns GROQ queries, written with `defineQuery`.
- `packages/sanity/src/sanity.types.ts` is **generated** — it is produced by running typegen from `apps/studio`, but the file itself lives in `packages/sanity` so `apps/web` can import it as `@workspace/sanity/types`.

**The rule (strict, blocking — see AGENTS.md Definition of Done):** any change to a schema field (`apps/studio/schemaTypes/**`) or a GROQ query (`packages/sanity/src/query.ts`) requires regenerating types before the change is done:

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

See `docs/README.md` for the full documentation index. Update the relevant doc whenever you add a workflow, feature, or architectural decision — see the Definition of Done in `AGENTS.md`.
