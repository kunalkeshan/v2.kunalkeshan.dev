import { PlusIcon } from "lucide-react"

import { Button, buttonVariantsConfig } from "@workspace/ui/components/button"

import { VariantGrid } from "../variant-grid"

export function ButtonDemo() {
  return (
    <VariantGrid
      variants={buttonVariantsConfig.variants}
      caption={(props) => `variant="${props.variant}" size="${props.size}"`}
      snippet={(props) => {
        const size = props.size ?? "default"
        return size.startsWith("icon")
          ? `import { PlusIcon } from "lucide-react"\n\n<Button variant="${props.variant}" size="${size}" aria-label="Add"><PlusIcon aria-hidden="true" /></Button>`
          : `<Button variant="${props.variant}" size="${size}">Button</Button>`
      }}
      render={(props) => (
        <Button
          variant={
            props.variant as keyof typeof buttonVariantsConfig.variants.variant
          }
          size={
            (props.size ??
              "default") as keyof typeof buttonVariantsConfig.variants.size
          }
          aria-label={props.size?.startsWith("icon") ? "Add" : undefined}
        >
          {props.size?.startsWith("icon") ? (
            <PlusIcon aria-hidden="true" />
          ) : (
            "Button"
          )}
        </Button>
      )}
    />
  )
}
