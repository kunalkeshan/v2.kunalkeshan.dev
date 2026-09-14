import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

const sizeClasses = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
} as const

export interface LogoProps {
  size?: keyof typeof sizeClasses
  href?: string
  className?: string
  priority?: boolean
  /** Path to the logo image, resolved from the consuming app's /public. */
  src?: string
}

export function Logo({
  size = "md",
  href = "/",
  className,
  priority = false,
  src = "/logo.jpg",
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Home"
      className={cn(
        "block shrink-0 overflow-hidden rounded-full border-2 border-border bg-card",
        "transition-transform duration-(--duration-press) ease-(--ease-snap) hover:scale-95",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={src}
        alt=""
        width={112}
        height={112}
        priority={priority}
        className="size-full object-cover"
      />
    </Link>
  )
}
