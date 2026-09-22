/**
 * The footer line every post/journal entry carries. Reworded away from the
 * nadh.in reference's exact phrasing into this site's own dry-meme register
 * — same as "It works on my machine" (projects.tsx) and "Modern problems
 * require modern solutions" (services.tsx) — so it reads as this site's
 * voice rather than a lifted line. Not editable per-post: it's a standing
 * statement about how everything here is written and licensed, not
 * post-specific metadata.
 *
 * No registration is required for the CC BY-SA grant to take effect — it's
 * self-executing the moment this line and link are published alongside the
 * post (explained to Kunal directly during planning, not something this
 * component needs to account for).
 */
export function PostFooterLicense() {
  return (
    <footer className="mt-12 border-t-2 border-border pt-6 text-sm text-muted-foreground">
      <p>No AI ghostwriter. Just me, a keyboard, and too many em dashes.</p>
      <p className="mt-1">
        Steal it, remix it, just credit it —{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer license"
          className="underline underline-offset-4 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          CC BY-SA 4.0
        </a>
        .
      </p>
    </footer>
  )
}
