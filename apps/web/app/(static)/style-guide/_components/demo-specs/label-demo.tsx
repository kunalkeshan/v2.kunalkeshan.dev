import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export const labelSnippet = `<Label htmlFor="email">Email</Label>`

export function LabelDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="style-guide-label-input">Email</Label>
      <Input id="style-guide-label-input" placeholder="you@example.com" />
    </div>
  )
}
