import { CopyButton } from "./copy-button"

interface VariantCellProps {
  caption: string
  snippet: string
  children: React.ReactNode
}

function VariantCell({ caption, snippet, children }: VariantCellProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-3 border-border bg-card p-4">
      <div className="flex min-h-12 items-center justify-center">
        {children}
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-mono text-xs text-muted-foreground">
          {caption}
        </p>
        <CopyButton value={snippet} label={caption} />
      </div>
    </div>
  )
}

interface VariantGridProps<Variants extends Record<string, string>> {
  /** e.g. buttonVariantsConfig.variants — one axis per key, cva variant-name -> class string. */
  variants: Record<keyof Variants, Record<string, string>>
  /** Renders one demo cell given the resolved prop combination, e.g. { variant: "outline", size: "sm" }. */
  render: (props: Record<string, string>) => React.ReactNode
  /** Builds the copy-ready JSX snippet for a given prop combination. */
  snippet: (props: Record<string, string>) => string
  /** Builds the caption shown under each cell. */
  caption: (props: Record<string, string>) => string
}

// Cartesian-products every axis in `variants` (e.g. Button's variant x size)
// and renders one cell per combination — this is the generic renderer for
// the 4 components that export a real cva config (button, badge, empty,
// tabs). See apps/web/lib/style-guide and each component's *VariantsConfig
// export for why this can read real variant lists instead of a hand-copied
// list that could drift.
export function VariantGrid<Variants extends Record<string, string>>({
  variants,
  render,
  snippet,
  caption,
}: VariantGridProps<Variants>) {
  const axes = Object.entries(variants) as [string, Record<string, string>][]

  let combinations: Record<string, string>[] = [{}]
  for (const [axisKey, axisValues] of axes) {
    const next: Record<string, string>[] = []
    for (const combo of combinations) {
      for (const value of Object.keys(axisValues)) {
        next.push({ ...combo, [axisKey]: value })
      }
    }
    combinations = next
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {combinations.map((combo) => {
        const key = Object.values(combo).join("-") || "default"
        return (
          <VariantCell
            key={key}
            caption={caption(combo)}
            snippet={snippet(combo)}
          >
            {render(combo)}
          </VariantCell>
        )
      })}
    </div>
  )
}
