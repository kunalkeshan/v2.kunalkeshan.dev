import type { TokenGroup } from "@/lib/style-guide/tokens"
import { TokenSwatch } from "./token-swatch"

interface TokenGridProps {
  group: TokenGroup
  kind: "color" | "shadow" | "radius"
}

export function TokenGrid({ group, kind }: TokenGridProps) {
  const id = group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  return (
    <div className="space-y-4">
      <div>
        <h3 id={id} className="scroll-mt-32 font-heading text-xl font-black">
          {group.title}
        </h3>
        {group.description ? (
          <p className="mt-1 max-w-2xl text-sm text-body-foreground">
            {group.description}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {group.entries.map((entry) => (
          <TokenSwatch key={entry.key} entry={entry} kind={kind} />
        ))}
      </div>
    </div>
  )
}
