# Contact form: email, Turnstile, and env setup

The `/contact` page (`apps/web/app/(static)/contact/page.tsx`) sends a
notification email via `apps/web/app/api/contact/route.ts` — nodemailer over
Gmail SMTP, one email to `siteConfig.contactNotificationEmail` per
submission, no auto-reply to the submitter. Cloudflare Turnstile is wired in
but optional. There is currently no rate limiting — that was deliberately
dropped after an initial Upstash Redis implementation to keep the feature
dependency-free for now; revisit if abuse becomes a real problem.

## Required env vars (`apps/web/.env.local`)

```
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
```

`NODEMAILER_EMAIL` is the sending Gmail account. `NODEMAILER_PASSWORD` is a
**Google Account App Password**, not the account's normal login password —
Gmail requires 2FA enabled on that account before an App Password can be
generated. Create one at
[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords),
then paste it in as-is (including spaces, if Google shows them — nodemailer
accepts either form).

Both vars are required (`packages/env/src/server.ts`) — the build fails
loudly if either is missing, rather than silently sending no email.

## Optional: Cloudflare Turnstile

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Both are optional and independently gated:

- Client (`apps/web/components/contact/contact-form.tsx`): the Turnstile
  widget renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. No env
  var, no widget, no layout gap.
- Server (`apps/web/lib/turnstile.ts`): `verifyTurnstileToken` returns `true`
  immediately when `TURNSTILE_SECRET_KEY` is unset — verification is skipped
  entirely rather than blocking submissions.

To activate: create a Turnstile widget at the
[Cloudflare dashboard](https://dash.cloudflare.com) once the production
domain is finalized, add the site to it, then set both keys above (locally
and in Vercel's project env). No code change is needed — both ends start
enforcing the moment the keys exist.

## The `@workspace/emails` package

Email templates live in `packages/emails/src/`, structured like:

```
packages/emails/src/
  _components/   shared header/footer/Tailwind-root wrapper + EmailLayout
  _theme/        brand constants + a hex color palette mirrored from
                 packages/ui's design tokens (see note below)
  contact/       contact-notification.tsx — the one template that exists
  registry.ts    maps every template to its file id + preview props
  render-email.tsx   renderEmailTemplateHtml / renderEmailTemplatePlainText
```

Preview a template locally with the official react-email dev server:

```bash
pnpm --filter @workspace/emails email:dev
# opens http://localhost:8000
```

Adding a second template: create the `.tsx` file next to
`contact-notification.tsx`, export it the same way (a component +
`_FILE`/`_PREVIEW_PROPS` constants, wrapped with `Object.assign(...,
{ PreviewProps })`), then add one entry to `registry.ts`. No other file needs
to change.

Every template's top-level JSX should be
`<EmailLayout preview={...} logoUrl={...} logoAlt={...} siteName={...}>` from
`_components/email-layout.tsx`, wrapping just that template's own body
content — `EmailLayout` handles `EmailTailwindRoot`, `<Preview>`/`<Body>`/
`<Container>`, and bracketing the body with `EmailHeader`/`EmailFooter`, so a
new template only writes its content and passes branding props once (see
`contact-notification.tsx` for the pattern). `preview` must be a plain
`string`, not JSX — react-email's `<Preview>` only accepts
`string | string[]` children.

### Color token drift

`packages/emails/src/_theme/colors.ts` is a **hand-maintained** hex mirror of
the light-mode `:root` tokens in `packages/ui/src/styles/globals.css`. Email
clients can't read CSS custom properties, so this can't be automated — see
the note at the top of `colors.ts`, and the cross-reference in
`docs/ui/design-system.md`. If the design system's palette changes, check
whether `colors.ts` needs updating too.

## Services: resolving IDs to names

The client form (`apps/web/components/contact/service-multi-select.tsx`)
only keeps Sanity `service` document `_id`s in its committed form state —
the human-readable `name` shown in the combobox is discarded on submit
(`onValueChange` maps selections down to `.id` only). Trusting client state
for display text also means trusting whatever a raw API request claims, so
`route.ts` re-resolves the submitted IDs against Sanity itself via
`SERVICES_BY_IDS_QUERY` (`packages/sanity/src/query.ts`) before building the
email — the notification email always shows service names as Sanity
currently has them, never raw IDs and never client-supplied labels.
`otherService` bypasses this lookup entirely since it's already free text.

## Subject line and sender name

The outgoing email's subject is a fixed `New contact form submission:
{subject}` — the submitter's name is not in the subject (it's already the
first field in the body). The nodemailer `from` uses `siteConfig.title` as
the display name (falling back to `"Kunal Keshan — Software Engineer"`, the
same fallback `apps/web/app/(static)/layout.tsx` uses for `<title>`) paired
with `env.NODEMAILER_EMAIL` as the address — so the inbox shows a proper
sender name instead of a bare email address.

## The notification email's logo

`apps/web/app/api/contact/route.ts` fetches `siteConfig.logo` via
`SITE_CONFIG_QUERY` at send time and builds its URL with `logoUrlFor` (the
same helper the rest of the site uses for logo rendering). If no logo is set
in Sanity, `EmailHeader` falls back to a plain text wordmark — the email
never ships a broken `<img>` tag.

## Rate limiting: intentionally not implemented (yet)

An earlier draft of this feature used Upstash Redis (`@upstash/ratelimit` +
`@upstash/redis`) to cap submissions per IP. It was removed before shipping
to avoid a new external dependency/credential for a low-traffic portfolio
form. If abuse becomes real, the removed code is recoverable from git
history (`apps/web/lib/rate-limit.ts`, plus the `UPSTASH_REDIS_REST_URL`/
`UPSTASH_REDIS_REST_TOKEN` env vars); otherwise Turnstile is the only
protection layer once its keys are set.
