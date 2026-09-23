import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"

export const collapsibleSnippet = `<Collapsible defaultOpen>
  <CollapsibleTrigger render={<Button variant="outline" />}>Show details</CollapsibleTrigger>
  <CollapsibleContent>Content appears when the section is expanded.</CollapsibleContent>
</Collapsible>`

export function CollapsibleDemo() {
  return (
    <Collapsible defaultOpen className="max-w-lg">
      <CollapsibleTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-between"
            aria-label="Toggle details"
          />
        }
      >
        Show details
        <ChevronDownIcon aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 rounded-md border-2 border-border bg-card p-4 text-sm text-body-foreground">
        Content appears when the section is expanded.
      </CollapsibleContent>
    </Collapsible>
  )
}
