import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import type { LinkItemType } from "@/components/layouts/nav-links"

export function NavDropdownItem({
  label,
  description,
  icon,
  href,
  className,
  onClick,
}: LinkItemType & {
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  const isExternal = href.startsWith("http")

  const content = (
    <>
      {icon && (
        <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-background [&_svg]:size-4">
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
    </>
  )

  const itemClassName = cn(
    "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted",
    className
  )

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClassName}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={itemClassName} onClick={onClick}>
      {content}
    </Link>
  )
}
