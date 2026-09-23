import { InboxIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  emptyMediaVariantsConfig,
} from "@workspace/ui/components/empty"

import { VariantGrid } from "../variant-grid"

export function EmptyDemo() {
  return (
    <VariantGrid
      variants={emptyMediaVariantsConfig.variants}
      caption={(props) => `<EmptyMedia variant="${props.variant}" />`}
      snippet={(props) =>
        `<Empty>\n  <EmptyHeader>\n    <EmptyMedia variant="${props.variant}">${
          props.variant === "icon" ? "<InboxIcon />" : ""
        }</EmptyMedia>\n    <EmptyTitle>No results</EmptyTitle>\n    <EmptyDescription>Try a different search.</EmptyDescription>\n  </EmptyHeader>\n</Empty>`
      }
      render={(props) => (
        <Empty className="w-full border-none p-0">
          <EmptyHeader>
            <EmptyMedia
              variant={
                props.variant as keyof typeof emptyMediaVariantsConfig.variants.variant
              }
            >
              {props.variant === "icon" ? (
                <InboxIcon aria-hidden="true" />
              ) : null}
            </EmptyMedia>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>Try a different search.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      )}
    />
  )
}
