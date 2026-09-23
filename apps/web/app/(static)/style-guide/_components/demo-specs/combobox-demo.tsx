"use client"

import { useState } from "react"

import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
} from "@workspace/ui/components/combobox"

interface FrameworkOption {
  id: string
  label: string
}

const OPTIONS: FrameworkOption[] = [
  { id: "next", label: "Next.js" },
  { id: "astro", label: "Astro" },
  { id: "remix", label: "Remix" },
]

export const comboboxSnippet = `<Combobox
  items={options}
  value={value}
  onValueChange={setValue}
  itemToStringLabel={(option) => option.label}
>
  <ComboboxInputGroup>
    <ComboboxInput placeholder="Select a framework" />
    <ComboboxClear />
    <ComboboxIcon />
  </ComboboxInputGroup>
  <ComboboxContent>
    {(option) => <ComboboxItem value={option}>{option.label}</ComboboxItem>}
  </ComboboxContent>
</Combobox>`

export function ComboboxDemo() {
  const [value, setValue] = useState<FrameworkOption | null>(null)

  return (
    <Combobox
      items={OPTIONS}
      value={value}
      onValueChange={setValue}
      itemToStringLabel={(option: FrameworkOption) => option.label}
      isItemEqualToValue={(a: FrameworkOption, b: FrameworkOption) =>
        a.id === b.id
      }
    >
      <ComboboxInputGroup className="w-64">
        <ComboboxInput placeholder="Select a framework" />
        <ComboboxClear />
        <ComboboxIcon />
      </ComboboxInputGroup>
      <ComboboxContent>
        {(option: FrameworkOption) => (
          <ComboboxItem key={option.id} value={option}>
            {option.label}
          </ComboboxItem>
        )}
      </ComboboxContent>
    </Combobox>
  )
}
