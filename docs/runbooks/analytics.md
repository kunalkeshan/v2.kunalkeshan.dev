# Analytics: Google Analytics 4 + Microsoft Clarity

`apps/web` reports to Google Analytics 4 and Microsoft Clarity. Both are optional at the infra level — the site works identically with either or both unset — and neither is gated behind a consent banner.

## What's installed

- [`@next/third-parties`](https://www.npmjs.com/package/@next/third-parties) — Next's official wrapper around the GA4 gtag script, via its `google` subpath.
- [`@microsoft/clarity`](https://www.npmjs.com/package/@microsoft/clarity) — the official Clarity SDK.

Both scripts mount once, at the root, in `apps/web/app/layout.tsx`:

```tsx
<GoogleAnalyticsScript />
<ClarityScript />
```

- `apps/web/components/analytics/google-analytics.tsx` — server component, renders `<GoogleAnalytics gaId={...} />` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, otherwise renders `null`.
- `apps/web/components/analytics/clarity.tsx` — client component, calls `clarity.init(...)` in a `useEffect` when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set **and** `NODE_ENV === "production"`. It's production-only so local dev traffic never pollutes Clarity session recordings.

## Env vars

Both are optional client vars, validated in `packages/env/src/client.ts` (mirrors the existing `NEXT_PUBLIC_TURNSTILE_SITE_KEY` pattern — required to have `z.string().min(1)` shape but `.optional()` overall, so a missing var never breaks a build):

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # GA4 Measurement ID, e.g. G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=  # Clarity project ID
```

Documented in `apps/web/env.sample`. While either is unset, the corresponding script renders/initializes nothing — no network request, no console error.

## Why there's no consent gate

Google Analytics and Microsoft Clarity load unconditionally once their env vars are set — there is no cookie-consent banner or opt-in gate in this repo. This is a deliberate, currently-in-scope decision, not an oversight: this is a personal portfolio site (not a service processing sensitive user data at scale), and adding a consent-banner UI was explicitly scoped out when this feature was built. If the site's audience or legal exposure changes (e.g. EU traffic volume, GDPR concerns), revisit this — the two script components above are the only places that would need to change (wrap their render/init behind a consent check).

## Custom event wrapper

`apps/web/lib/analytics.ts` is the single entry point for custom interaction tracking — components must call these helpers rather than `sendGAEvent`/`clarity` directly, so event names and params stay consistent:

- `trackLinkClick({ platform, url, placement, position? })` — any outbound/external link click (socials, footer credits, share buttons, resume download, project/publication/certification/testimonial links).
- `trackFormEvent({ formName, status, errorMessage? })` — a form's lifecycle (`submit` / `success` / `error`). Fires as `${formName}_${status}`, e.g. `contact_form_submit`.
- `trackUiEvent({ name, placement, ...rest })` — any other named interaction (copy-to-clipboard, theme toggle, command-menu actions, rickroll toggle).

Every call dual-fires to GA4 (`sendGAEvent`) and Clarity (`clarity.event` + `clarity.setTag`), wrapped in a `safeCall` guard so a tracking failure never breaks the UI interaction it's attached to.

For server components that render a plain anchor and can't hold an `onClick` themselves without becoming a client component, use `apps/web/components/shared/tracked-link.tsx`'s `<TrackedLink>` wrapper — it clones the child `<a>` and attaches the tracking `onClick` without converting the whole parent section to client-rendered.

### Current call sites

| Component | Event(s) | Placement |
|---|---|---|
| `components/contact/contact-form.tsx` | `trackFormEvent` (submit/success/error) | — |
| `components/contact/copy-email-button.tsx` | `trackUiEvent` (`copy_email_click`) | `contact_copy_email` |
| `components/contact/socials-row.tsx` | `trackLinkClick` | `contact_socials` |
| `components/sections/resume-cta.tsx` | `trackLinkClick` (resume download) | `resume_cta` |
| `components/layouts/footer.tsx` | `trackLinkClick` (repo, Sanity Studio, Paperfolio/GitHub/Next.js credits), `trackUiEvent` (`rickroll_toggle`) | `footer` |
| `components/blog/share-buttons.tsx` | `trackLinkClick` (X/LinkedIn/WhatsApp), `trackUiEvent` (`copy_link_click`) | `blog_share` |
| `components/theme-provider.tsx` | `trackUiEvent` (`theme_toggle`, via the `D` hotkey) | `global` |
| `components/layouts/portfolio-command-menu.tsx` | `trackUiEvent` (`command_menu_<action-id>`, fired for every page/action dispatch via `runAction`) | `command_menu` |
| `components/sections/publications.tsx` | `trackLinkClick` (via `TrackedLink`) | `publications` |
| `components/sections/certifications.tsx` | `trackLinkClick` (via `TrackedLink`) | `certifications` |
| `components/sections/testimonials.tsx` | `trackLinkClick` (author website) | `testimonials` |
| `components/sections/experience.tsx` | `trackLinkClick` (role links, organization website ×2) | `experience` |
| `app/(static)/projects/[slug]/page.tsx` | `trackLinkClick` (primary + secondary links, via `TrackedLink`) | `project_detail` |

New interactive elements should extend this table — see the Definition of Done checklist item in `AGENTS.md`.
