import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn, pressableShadow } from "@workspace/ui/lib/utils"

// Extracted to a named const (rather than inlined into the `cva()` call)
// so it can also be exported and read by the style-guide page, which
// iterates `buttonVariantsConfig.variants` to render every variant x size
// combination — see apps/web/app/(static)/style-guide. `cva()`'s returned
// function does not expose its own config at runtime, so this is the only
// way to keep that page from drifting when a variant/size is added here.
const buttonVariantsConfig = {
  variants: {
    variant: {
      default: "border-2 border-border bg-primary text-primary-foreground",
      outline: "border-2 border-border bg-background text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      secondary: "border-2 border-border bg-secondary text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      ghost:
        "border-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
      destructive: "border-2 border-border bg-destructive text-destructive-foreground",
      link: "border-transparent text-primary underline-offset-4 hover:underline",
    },
    size: {
      default:
        "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      xs: "h-6 gap-1 rounded-sm px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
      lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      icon: "size-8",
      "icon-xs":
        "size-6 rounded-sm in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
      "icon-sm":
        "size-7 rounded-md in-data-[slot=button-group]:rounded-lg",
      "icon-lg": "size-9",
    },
  },
  compoundVariants: [
    {
      variant: ["default", "outline", "secondary", "destructive"] as (
        | "default"
        | "outline"
        | "secondary"
        | "destructive"
      )[],
      class: cn(
        pressableShadow,
        "active:not-aria-[haspopup]:translate-x-1 active:not-aria-[haspopup]:translate-y-1 active:not-aria-[haspopup]:shadow-none"
      ),
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  } as const,
}

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  buttonVariantsConfig
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, buttonVariantsConfig }
