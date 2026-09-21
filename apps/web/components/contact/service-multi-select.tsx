"use client"

import {
  Cloud,
  Code2,
  Database,
  FileCode,
  Globe,
  Layers,
  Rocket,
  Search,
  Server,
  Sparkles,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxContent,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxValue,
} from "@workspace/ui/components/combobox"
import type { SERVICES_QUERY_RESULT } from "@workspace/sanity/types"

/**
 * Maps the `service.icon` string stored in Sanity to an actual component.
 * Keep in sync with the dropdown list in
 * apps/studio/schemaTypes/serviceType.ts — that file's description points
 * back here.
 */
const PLATFORM_ICONS: Record<string, LucideIcon> = {
  Code2,
  Database,
  Search,
  Cloud,
  Wrench,
  Rocket,
  Server,
  FileCode,
  Globe,
  Sparkles,
  Layers,
  Terminal,
}

type Service = NonNullable<SERVICES_QUERY_RESULT>[number]

interface ServiceOption {
  id: string
  label: string
}

interface ServiceMultiSelectProps {
  services: SERVICES_QUERY_RESULT
  value: string[]
  onValueChange: (value: string[]) => void
}

const OTHER_OPTION: ServiceOption = { id: "other", label: "Other" }

function ServiceIcon({ service }: { service: Service }) {
  const Icon = service.icon ? PLATFORM_ICONS[service.icon] : undefined
  if (!Icon) return null
  return <Icon className="size-3.5" />
}

export function ServiceMultiSelect({
  services,
  value,
  onValueChange,
}: ServiceMultiSelectProps) {
  const options: ServiceOption[] = [
    ...(services ?? []).map((service) => ({
      id: service._id,
      label: service.name ?? "",
    })),
    OTHER_OPTION,
  ]

  const selected = options.filter((option) => value.includes(option.id))

  return (
    <Combobox
      items={options}
      multiple
      value={selected}
      onValueChange={(next) => onValueChange(next.map((option) => option.id))}
      itemToStringLabel={(option) => option.label}
      isItemEqualToValue={(a, b) => a.id === b.id}
    >
      <ComboboxInputGroup>
        <ComboboxValue>
          {(items: ServiceOption[]) => (
            <ComboboxChips aria-label={items.length > 0 ? "Selected services" : undefined}>
              {items.map((option) => {
                const service = services?.find((s) => s._id === option.id)
                return (
                  <ComboboxChip key={option.id} aria-label={option.label}>
                    {service ? <ServiceIcon service={service} /> : null}
                    {option.label}
                    <ComboboxChipRemove aria-label={`Remove ${option.label}`} />
                  </ComboboxChip>
                )
              })}
              <ComboboxInput
                placeholder={items.length > 0 ? "" : "Select what you're looking for"}
              />
            </ComboboxChips>
          )}
        </ComboboxValue>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <ComboboxClear />
          <ComboboxIcon />
        </div>
      </ComboboxInputGroup>
      <ComboboxContent>
        {(option: ServiceOption) => {
          const service = services?.find((s) => s._id === option.id)
          return (
            <ComboboxItem key={option.id} value={option}>
              {service ? <ServiceIcon service={service} /> : null}
              <span>{option.label}</span>
            </ComboboxItem>
          )
        }}
      </ComboboxContent>
    </Combobox>
  )
}
