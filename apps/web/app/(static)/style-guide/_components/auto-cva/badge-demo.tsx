import { Badge, badgeVariantsConfig } from "@workspace/ui/components/badge"

import { VariantGrid } from "../variant-grid"

export function BadgeDemo() {
  return (
    <VariantGrid
      variants={badgeVariantsConfig.variants}
      caption={(props) => `variant="${props.variant}"`}
      snippet={(props) => `<Badge variant="${props.variant}">Badge</Badge>`}
      render={(props) => (
        <Badge
          variant={
            props.variant as keyof typeof badgeVariantsConfig.variants.variant
          }
        >
          Badge
        </Badge>
      )}
    />
  )
}
