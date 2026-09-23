"use client"

import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"

export const sonnerSnippet = `toast.success("Message sent")`

// The <Toaster /> singleton is already mounted once in
// apps/web/app/(static)/layout.tsx, which this route inherits — no need to
// render a second one here.
export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Default toast")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Message sent")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Check your input")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.loading("Loading…")}
      >
        Loading
      </Button>
    </div>
  )
}
