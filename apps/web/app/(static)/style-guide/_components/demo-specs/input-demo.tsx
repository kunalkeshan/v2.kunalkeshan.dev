import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export const inputSnippet = `<Input placeholder="you@example.com" />`

export function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="style-guide-input">Email</Label>
      <Input
        id="style-guide-input"
        type="email"
        placeholder="you@example.com"
      />
    </div>
  )
}
