# Sanity CMS

## What it does

Content for the portfolio site (site config, FAQs, legal documents) is authored in a standalone Sanity Studio (`apps/studio`) and consumed read-only by the Next.js site (`apps/web`) via `@workspace/sanity`.

## Schema (owned by `apps/studio`)

Defined in `apps/studio/schemaTypes/`:

- `siteConfig` — singleton: site title/description, OG/Twitter images, contact info, social links, footer legal links
- `faqs` — singleton: FAQ list
- `legal` — document: legal pages (privacy policy, terms, etc.), rendered via `blockContent`
- `blockContent` — shared rich-text/portable-text array type used by `legal`
- `author`, `category`, `post` — defined but **not currently registered** in `apps/studio/schemaTypes/index.ts`'s `schema.types` array (a carry-over from an earlier blog-oriented design; not wired into the Studio UI or queried by `apps/web`)

`apps/studio/structure.ts` customizes the Studio's document list to surface the two singletons (`siteConfig`, `faqs`) at the top, followed by `legal`, followed by anything else.

## Queries (owned by `packages/sanity/src/query.ts`)

- `SITE_CONFIG_QUERY` / `FOOTER_LEGAL_LINKS_QUERY`
- `FAQS_QUERY`
- `LEGAL_DOCUMENTS_QUERY` / `LEGAL_DOCUMENT_BY_SLUG_QUERY`

All written with `next-sanity`'s `defineQuery` for typegen support.

## Consumption in `apps/web`

- `app/(static)/layout.tsx` — fetches `SITE_CONFIG_QUERY` for metadata (title/description/OG images) and passes site config + footer legal links down to `Footer`.
- `app/sitemap.ts` — fetches `LEGAL_DOCUMENTS_QUERY` to generate sitemap entries for legal pages.
- `app/api/revalidate/route.ts` — webhook endpoint; validates the Sanity webhook signature (`SANITY_WEBHOOK_SECRET`) and revalidates Next.js cache tags based on the changed document's `_type`.
- `components/sanity/portable-text-components.tsx` — renders `blockContent` (portable text) with the site's Tailwind theme classes, including a heading-level shift (schema `h1`→ rendered `h2`, etc.) so CMS content headings never collide with the page's own `h1`.

## Revalidation model

On-demand only — `useCdn: true` with `revalidate: false` by default in `sanityFetch`, invalidated via cache tags (`createCollectionTag`/`createDocumentTag` in `packages/sanity/src/cache-tags.ts`) when the Sanity webhook fires. There is no time-based ISR polling.

## Adding a new field or query

See [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md) — this is a strict, blocking workflow (typegen must be regenerated and all consumers updated before the change is done).
