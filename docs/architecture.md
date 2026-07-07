# Architecture

## Monorepo layout

`v2.kunalkeshan.dev` is a Turborepo + pnpm workspaces monorepo, scaffolded from shadcn/ui's official monorepo template (`pnpm dlx shadcn@latest init --monorepo`).

```
apps/
  web/       Next.js 16 — the public portfolio site
  studio/    Standalone Sanity Studio — content authoring
packages/
  ui/        Shared shadcn/ui primitives, fonts, global Tailwind styles
  sanity/    Shared Sanity client, GROQ queries, generated types
  env/       Shared validated env vars (@t3-oss/env-nextjs)
  eslint-config/       Shared ESLint config
  typescript-config/   Shared tsconfig bases
```

## Why Studio is a separate app

Sanity Studio was originally embedded in the Next.js app at `/cms` (via `next-sanity/studio`). It was pulled out into `apps/studio` so that:

1. The Studio can be deployed and versioned independently of the portfolio site (`sanity deploy` → Sanity's own hosting, not Vercel).
2. `apps/web`'s bundle doesn't carry Studio's dependencies (`sanity`, `@sanity/vision`, `styled-components`, etc.).
3. Schema/content-modeling ownership is explicit — `apps/studio` is the only place schema types are defined.

`apps/web` never imports from `apps/studio` directly. The only shared surface is `packages/sanity`, which exposes a read-only client, queries, and generated types.

## Data flow

```
apps/studio/schemaTypes/*.ts  ──sanity schema extract──▶  apps/studio/schema.json
                                                                    │
packages/sanity/src/query.ts ──sanity typegen generate────────────┤
                                                                    ▼
                                          packages/sanity/src/sanity.types.ts
                                                                    │
                                          apps/web imports as @workspace/sanity/types
```

See [`docs/runbooks/sanity-workflow.md`](./runbooks/sanity-workflow.md) for the exact commands and the propagation rule.

## Package boundaries

- **`packages/ui`** — anything visual and reusable: shadcn primitives (`src/components`), the font definitions (`src/lib/fonts.ts`), global Tailwind theme (`src/styles/globals.css`). No data-fetching, no app-specific logic.
- **`packages/sanity`** — anything Sanity-read-related that `apps/web` needs: `client.ts` (the Sanity client), `query.ts` (GROQ queries), `fetch.ts` (server/client fetch helpers), `cache-tags.ts` (revalidation tag helpers), `image.ts` (image URL builder), `sanity.types.ts` (generated). Nothing here should import from `apps/web` or `apps/studio`.
- **`packages/env`** — typed, validated env var access for `apps/web`. `apps/studio` reads `process.env` directly since its config loader (`sanity.cli.ts`) runs outside the Next.js/React environment this package assumes.
