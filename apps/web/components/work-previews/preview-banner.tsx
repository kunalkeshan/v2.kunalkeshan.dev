import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

/**
 * Shown at the top of every `/work/preview/*` route. These routes are a
 * throwaway comparison step (see the plan this was built from) — this banner
 * makes that unmistakable while reviewing, and disappears with the rest of
 * `components/work-previews/` once a variant is picked and the others are
 * deleted.
 */
export function PreviewBanner({ variant }: { variant: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border-3 border-border bg-primary px-4 py-3 text-primary-foreground">
      <p className="text-sm font-bold">
        Preview build — <span className="font-black">{variant}</span> layout.
        Not the live page.
      </p>
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-card px-3 py-1 text-xs font-bold text-card-foreground shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
        Back to live /work
      </Link>
    </div>
  )
}
