import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { XIcon } from "lucide-react"

import { cn, pressableShadow } from "@workspace/ui/lib/utils"

/**
 * Wrapper for a text input with leading/trailing icons (search icon, submit
 * button, clear button, …). The wrapper — not the inner `<input>` — owns the
 * border, shadow, `pressableShadow` press animation, and focus ring, so a
 * hover/press translate moves the icons along with the input box as one
 * rigid unit. Icons positioned `absolute` against a separate, stationary
 * ancestor instead of being flex children here is what causes icons to lag
 * behind the input's own hover/press motion — see
 * `packages/ui/src/components/combobox.tsx`'s `ComboboxInputGroup`, the
 * reference this mirrors.
 *
 * `asChild` renders as the passed child (e.g. a `<form>`) instead of a
 * `<div>`, for callers that need the group to submit.
 */
function InputGroup({
  className,
  asChild,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="input-group"
      className={cn(
        "flex h-10 w-full items-center gap-1.5 rounded-lg border-2 border-input bg-transparent px-2.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 focus-within:ring-offset-2 focus-within:ring-offset-background has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:bg-input/50 has-disabled:opacity-50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-disabled:bg-input/80",
        pressableShadow,
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input-group-input"
      className={cn(
        "h-6 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:pointer-events-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

function InputGroupIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-icon"
      className={cn("flex shrink-0 items-center justify-center text-muted-foreground", className)}
      {...props}
    />
  )
}

function InputGroupClear({
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "type" | "children">) {
  return (
    <button
      type="button"
      data-slot="input-group-clear"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      <XIcon className="size-3.5" />
    </button>
  )
}

export { InputGroup, InputGroupInput, InputGroupIcon, InputGroupClear }
