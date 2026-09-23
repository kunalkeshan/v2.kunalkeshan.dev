import { Spinner } from "@workspace/ui/components/spinner"

export const spinnerSnippet = `<Spinner />`

export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  )
}
