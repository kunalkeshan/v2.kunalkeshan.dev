import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"

export const checkboxSnippet = `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>`

export function CheckboxDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="style-guide-checkbox-unchecked" />
        <Label htmlFor="style-guide-checkbox-unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="style-guide-checkbox-checked" defaultChecked />
        <Label htmlFor="style-guide-checkbox-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="style-guide-checkbox-disabled" disabled />
        <Label htmlFor="style-guide-checkbox-disabled">Disabled</Label>
      </div>
    </div>
  )
}
