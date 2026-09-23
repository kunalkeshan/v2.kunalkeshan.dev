import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

export const textareaSnippet = `<Textarea placeholder="Tell us about your project" />`

export function TextareaDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="style-guide-textarea">Message</Label>
      <Textarea
        id="style-guide-textarea"
        placeholder="Tell us about your project"
      />
    </div>
  )
}
