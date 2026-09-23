import { Separator } from "@workspace/ui/components/separator"

export const separatorSnippet = `<Separator />
<Separator orientation="vertical" />`

export function SeparatorDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Above</p>
        <Separator className="my-2" />
        <p className="text-sm text-muted-foreground">Below</p>
      </div>
      <div className="flex h-8 items-center gap-3">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  )
}
