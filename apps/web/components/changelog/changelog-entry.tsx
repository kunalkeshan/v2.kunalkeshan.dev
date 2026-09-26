import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ExternalLinkIcon } from "lucide-react"

import type { AppRelease } from "@workspace/version"
import { Badge } from "@workspace/ui/components/badge"

import { changelogMarkdownComponents } from "@/components/changelog/changelog-markdown-components"

export interface ChangelogEntryProps {
  release: AppRelease
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function ChangelogEntry({ release }: ChangelogEntryProps) {
  const dateLabel = release.publishedAt
    ? DATE_FORMAT.format(new Date(release.publishedAt))
    : null

  return (
    <article className="rounded-lg border-3 border-border bg-card p-6 md:p-8">
      <header className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="font-mono">
          v{release.version}
        </Badge>
        {dateLabel && (
          <time
            dateTime={release.publishedAt ?? undefined}
            className="text-sm text-muted-foreground"
          >
            {dateLabel}
          </time>
        )}
        <a
          href={release.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          View on GitHub
          <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
        </a>
      </header>

      <h2 className="mt-3 font-heading text-xl font-bold text-foreground md:text-2xl">
        {release.name}
      </h2>

      {release.body ? (
        <div className="mt-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={changelogMarkdownComponents}
          >
            {release.body}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          No release notes were provided for this version.
        </p>
      )}
    </article>
  )
}
