import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import type { LinkItemType } from "@/components/layouts/nav-links"

export function NavDropdownItem({
  label,
  description,
  icon,
  href,
  className,
}: LinkItemType & { className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-(--radius-base) p-2 transition-colors hover:bg-muted",
        className
      )}
    >
      {icon && (
        <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-(--radius-sm) border-2 border-border bg-background [&_svg]:size-4">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-start justify-center">
        <span className="text-sm font-semibold">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </Link>
  )
}
