"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn, pressableShadow } from "@workspace/ui/lib/utils"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

const Combobox = ComboboxPrimitive.Root

const ComboboxValue = ComboboxPrimitive.Value

function ComboboxInputGroup({
  className,
  ...props
}: ComboboxPrimitive.InputGroup.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border-2 border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 focus-within:ring-offset-2 focus-within:ring-offset-background aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        pressableShadow,
        className
      )}
      {...props}
    />
  )
}

function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn("flex flex-1 flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  )
}

function ComboboxChip({ className, children, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full border-2 border-border bg-secondary pr-1 pl-2 font-heading text-[11px] font-black text-secondary-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipRemove({
  className,
  ...props
}: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full hover:bg-secondary-foreground/20",
        className
      )}
      {...props}
    >
      <XIcon className="size-3" />
    </ComboboxPrimitive.ChipRemove>
  )
}

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "h-6 min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxIcon({ className, ...props }: ComboboxPrimitive.Icon.Props) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn("shrink-0 text-muted-foreground", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </ComboboxPrimitive.Icon>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear selection"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      <XIcon className="size-3.5" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxContent({
  className,
  children,
  sideOffset = 4,
  ...props
}: Omit<ComboboxPrimitive.Popup.Props, "children"> &
  Pick<ComboboxPrimitive.Positioner.Props, "sideOffset"> &
  Pick<ComboboxPrimitive.List.Props, "children">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner sideOffset={sideOffset} className="isolate z-50">
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "max-h-(--available-height) w-(--anchor-width) min-w-48 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border-2 border-border bg-popover text-popover-foreground shadow-lg data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <ComboboxPrimitive.Empty className="px-2 py-4 text-center text-sm text-muted-foreground empty:m-0 empty:p-0" />
          <ComboboxPrimitive.List className="p-1">{children}</ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-primary data-highlighted:text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

export {
  Combobox,
  ComboboxValue,
  ComboboxInputGroup,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxInput,
  ComboboxIcon,
  ComboboxClear,
  ComboboxContent,
  ComboboxItem,
}
