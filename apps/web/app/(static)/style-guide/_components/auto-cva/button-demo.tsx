import { Button, buttonVariantsConfig } from "@workspace/ui/components/button"

import { VariantGrid } from "../variant-grid"

export function ButtonDemo() {
  return (
    <VariantGrid
      variants={buttonVariantsConfig.variants}
      caption={(props) => `variant="${props.variant}" size="${props.size}"`}
      snippet={(props) =>
        `<Button variant="${props.variant}" size="${props.size}">Button</Button>`
      }
      render={(props) => (
        <Button
          variant={props.variant as keyof typeof buttonVariantsConfig.variants.variant}
          size={props.size as keyof typeof buttonVariantsConfig.variants.size}
        >
          Button
        </Button>
      )}
    />
  )
}
