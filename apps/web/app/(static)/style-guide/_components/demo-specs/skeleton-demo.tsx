import { Skeleton } from "@workspace/ui/components/skeleton"

export const skeletonSnippet = `<Skeleton className="h-4 w-32" />`

export function SkeletonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  )
}
