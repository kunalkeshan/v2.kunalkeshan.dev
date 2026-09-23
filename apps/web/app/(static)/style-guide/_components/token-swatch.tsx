import { cn } from "@workspace/ui/lib/utils"

import type { TokenEntry } from "@/lib/style-guide/tokens"
import { CopyButton } from "./copy-button"

interface TokenSwatchProps {
  entry: TokenEntry
  /** How the swatch itself renders — a color chip, a shadow box, or a radius box. */
  kind: "color" | "shadow" | "radius"
}

export function TokenSwatch({ entry, kind }: TokenSwatchProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-3 border-border bg-card p-4">
      {kind === "color" ? (
        <div className="flex gap-2">
          <span
            className="h-16 flex-1 rounded-md border-2 border-border"
            style={{ backgroundColor: entry.light }}
            aria-hidden="true"
          />
          <span
            className="h-16 flex-1 rounded-md border-2 border-border"
            style={{ backgroundColor: entry.dark }}
            aria-hidden="true"
          />
        </div>
      ) : kind === "shadow" ? (
        <div className="flex h-16 items-center justify-center">
          <span
            className={cn(
              "size-12 rounded-md border-2 border-border bg-background"
            )}
            style={{ boxShadow: entry.light }}
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center">
          <span
            className="size-12 border-2 border-border bg-background"
            style={{ borderRadius: entry.light }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-black">
            {entry.label}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {entry.key}
          </p>
        </div>
        <CopyButton value={entry.key} label={entry.label} />
      </div>

      {kind === "color" ? (
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="truncate font-mono">{entry.light}</span>
          <span className="truncate font-mono">{entry.dark}</span>
        </div>
      ) : null}
    </div>
  )
}
