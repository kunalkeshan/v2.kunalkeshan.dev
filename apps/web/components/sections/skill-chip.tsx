import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

type Skill = NonNullable<SKILLS_QUERY_RESULT>[number]

interface SkillChipProps {
  skill: Skill
}

export function SkillChip({ skill }: SkillChipProps) {
  const iconUrl = skill.icon?.asset
    ? urlFor(skill.icon).width(64).height(64).url()
    : undefined

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto gap-2 rounded-(--radius-lg) border-2 border-border bg-card px-3 py-1.5 text-xs normal-case",
        "shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-(--duration-press) ease-(--ease-snap)",
        "hover:translate-x-px hover:translate-y-px hover:shadow-none"
      )}
    >
      {iconUrl && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-white p-0.5">
          <Image
            src={iconUrl}
            alt={skill.icon?.alt ?? ""}
            width={20}
            height={20}
            className="size-full object-contain"
          />
        </span>
      )}
      {skill.name}
    </Badge>
  )
}
