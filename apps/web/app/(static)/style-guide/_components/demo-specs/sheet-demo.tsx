import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

export const sheetSnippet = `<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open from right</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet title</SheetTitle>
      <SheetDescription>Sheet description.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`

const SIDES = ["top", "right", "bottom", "left"] as const

export function SheetDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <SheetDescription>side=&quot;{side}&quot;</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
