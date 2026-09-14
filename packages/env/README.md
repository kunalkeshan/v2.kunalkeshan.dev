# `@workspace/env`

Shared, validated environment variables for `apps/web`, via `@t3-oss/env-nextjs` and zod (`@workspace/env/client`, `@workspace/env/server`).

See the Environment Variables section of the root `AGENTS.md` for which vars live where and the `env.sample` convention. `apps/studio`'s env is separate and not validated through this package (its own `sanity.cli.ts`/`sanity.config.ts` read `process.env` directly).
