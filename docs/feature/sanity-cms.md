# Sanity CMS

## What it does

Content for the portfolio site (site config, FAQs, legal documents) is authored in a standalone Sanity Studio (`apps/studio`) and consumed read-only by the Next.js site (`apps/web`) via `@workspace/sanity`.

## Schema (owned by `apps/studio`)

Defined in `apps/studio/schemaTypes/`:

- `siteConfig` — singleton: site title/description, OG/Twitter images, contact info, social links, footer legal links, and the downloadable `resumePdf` file
- `faqs` — singleton: FAQ list
- `legal` — document: legal pages (privacy policy, terms, etc.), rendered via `blockContent`
- `blockContent` — shared rich-text/portable-text array type used by `legal`
- `skill` / `service` — orderable documents powering the home strips and the `/skills` and `/services` pages
- `organization` — orderable document: a company, client, university, or student org. Its own type because organizations repeat across roles (StejasSYS, IEEE SRMIST, and Think-Digital each hold several sequential positions), so a logo or website change is a single edit.
- `experience` — orderable document: one position, referencing an `organization`. A `kind` field (`work` / `community` / `education`) covers all three shapes in one type, but the **rendering** keeps education in its own block — never interleaved into the work timeline (see `docs/content/persona-and-tone.md`).
- `publication` — orderable document: papers and patents, shown as a callout at the foot of `/resume`. Kept separate from `experience` because the fields genuinely differ (author list, DOI, venue) and a publication has no duration.
- `author`, `category`, `post` — defined but **not currently registered** in `apps/studio/schemaTypes/index.ts`'s `schema.types` array (a carry-over from an earlier blog-oriented design; not wired into the Studio UI or queried by `apps/web`)

`apps/studio/structure.ts` customizes the Studio's document list to surface the two singletons (`siteConfig`, `faqs`) at the top, followed by `legal`, then the orderable lists (`skill`, `service`, `experience`, `organization`, `publication`), followed by anything else.

**Ordering**: the orderable types use `@sanity/orderable-document-list` (`orderRankField` + `orderRankOrdering` in the schema, `orderableDocumentListDeskItem` in `structure.ts`, `| order(orderRank asc)` in GROQ). Drag order in the Studio **is** the order the site renders — for experience this is deliberately not a date sort, so professional roles can sit above community ones regardless of dates. Two gotchas: any new orderable type must also be added to the exclusion array at the bottom of `structure.ts` or it appears twice; and documents created outside the Studio (via MCP or the CLI) must set `orderRank` explicitly to a real LexoRank value, or drag-and-drop breaks for that document.

## Queries (owned by `packages/sanity/src/query.ts`)

- `SITE_CONFIG_QUERY` / `FOOTER_LEGAL_LINKS_QUERY`
- `FAQS_QUERY`
- `LEGAL_DOCUMENTS_QUERY` / `LEGAL_DOCUMENT_BY_SLUG_QUERY`
- `FEATURED_SKILLS_QUERY` / `SKILLS_QUERY`
- `SERVICES_QUERY`
- `FEATURED_EXPERIENCES_QUERY` — work roles flagged `featured`, projecting `summary` and **not** `highlights`; the home section shows one line per role
- `EXPERIENCES_QUERY` — work + community roles in Studio order, with `organization->`, dereferenced `skills[]->`, and structured `links[]`
- `EDUCATION_QUERY` — `kind == "education"` only, fetched separately so it renders as its own block
- `PUBLICATIONS_QUERY`

All written with `next-sanity`'s `defineQuery` for typegen support.

## Consumption in `apps/web`

- `app/(static)/layout.tsx` — fetches `SITE_CONFIG_QUERY` for metadata (title/description/OG images) and passes site config + footer legal links down to `Footer`.
- `app/(static)/page.tsx` — fetches site config, featured skills, services, and `FEATURED_EXPERIENCES_QUERY` in one `Promise.all`, rendering the condensed Experience section after About.
- `app/(static)/resume/page.tsx` — fetches site config (for `resumePdf`), `EXPERIENCES_QUERY`, `EDUCATION_QUERY`, and `PUBLICATIONS_QUERY`. Renders `ExperienceTimeline` (grouped by organization, education in its own block), `Publications`, and `ResumeCta`. The download banner renders nothing while `resumePdf` is empty, so the page can never ship a dead link.
- `components/sections/experience.tsx` — default-exports the home section; named-exports `ExperienceTimeline` for the standalone page (same split as `ServicesGrid` in `services.tsx`). Grouping is by *consecutive* organization so Studio drag order stays authoritative.
- `lib/dates.ts` — formats Sanity `date` strings in UTC (`formatDateRange`, `formatDuration`, `spanOf`). Sanity dates are `YYYY-MM-DD`; parsing them as local time renders the previous month in timezones behind UTC.
- `app/sitemap.ts` — fetches `LEGAL_DOCUMENTS_QUERY` to generate sitemap entries for legal pages, plus static entries for `/resume`, `/skills`, and `/services`.
- `app/api/revalidate/route.ts` — webhook endpoint; validates the Sanity webhook signature (`SANITY_WEBHOOK_SECRET`) and revalidates Next.js cache tags based on the changed document's `_type`.
- `components/sanity/portable-text-components.tsx` — renders `blockContent` (portable text) with the site's Tailwind theme classes, including a heading-level shift (schema `h1`→ rendered `h2`, etc.) so CMS content headings never collide with the page's own `h1`.

## Revalidation model

On-demand only — `useCdn: true` with `revalidate: false` by default in `sanityFetch`, invalidated via cache tags (`createCollectionTag`/`createDocumentTag` in `packages/sanity/src/cache-tags.ts`) when the Sanity webhook fires. There is no time-based ISR polling.

## Adding a new field or query

See [`docs/runbooks/sanity-workflow.md`](../runbooks/sanity-workflow.md) — this is a strict, blocking workflow (typegen must be regenerated and all consumers updated before the change is done).
