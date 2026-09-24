# kunalkeshan.dev

Personal portfolio site. Turborepo monorepo using pnpm workspaces and shadcn/ui's monorepo scaffold.

Successor to [github.com/kunalkeshan/kunalkeshan.dev](https://github.com/kunalkeshan/kunalkeshan.dev) (now serving [v1.kunalkeshan.dev](https://v1.kunalkeshan.dev)). This repo is the live portfolio at [kunalkeshan.dev](https://kunalkeshan.dev).

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

`apps/studio` is not embedded in `apps/web` — it's its own deployable app with its own Sanity project/schema ownership, deployed independently to Sanity's own hosting.

See `AGENTS.md` for full repo conventions and `docs/README.md` for the documentation index.

## Common commands

```bash
pnpm install              # link workspace + install deps
pnpm dev                  # turbo dev — runs apps/web and apps/studio in parallel
pnpm build                # turbo build — builds every app/package
pnpm typecheck             # turbo typecheck — tsc --noEmit across the workspace
pnpm --filter web dev      # just the portfolio site (localhost:3000)
pnpm --filter studio dev   # just the Studio (localhost:3333)
```

## Adding shadcn/ui components

Run this at the repo root — the CLI auto-routes base components into `packages/ui`:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Import them from the `ui` package in app code:

```tsx
import { Button } from "@workspace/ui/components/button";
```
