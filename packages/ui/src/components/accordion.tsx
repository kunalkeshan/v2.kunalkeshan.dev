import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cardLift, cn } from "@workspace/ui/lib/utils"
import { PlusIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        // `cardLift` covers the hover lift/shadow (ported from v1's FaqCard
        // `hover:-translate-y-1 hover:shadow-3d`); `data-open:shadow-lg`
        // layers on top so an expanded item stays visibly lifted even
        // without the pointer over it.
        "not-last:mb-4 rounded-lg border-3 border-border bg-card px-4 shadow-none data-open:shadow-lg",
        cardLift,
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // `gap-4`: `justify-between` + the icon's own `ml-auto` only push
          // the icon to the far edge — neither guarantees a minimum
          // distance from the text. Without an explicit gap, a question
          // long enough to nearly fill the row (common on narrow mobile
          // widths) leaves the icon crowding the text with no buffer.
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 rounded-md border-2 border-transparent py-3.5 text-left font-heading text-sm font-black outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4",
          className
        )}
        {...props}
      >
        {children}
        {/* A plus that rotates 45° into an X on open — v1's FaqCard treatment,
         * reused here instead of shadcn's default chevron swap. One icon,
         * animated, rather than two icons toggled by visibility. */}
        <PlusIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 rounded-md border-2 border-border bg-card p-0.5 text-foreground transition-transform duration-press ease-snap group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-primary-foreground"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
