import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { EXPERIENCES_QUERY_RESULT } from "@workspace/sanity/types"

// Both callers (`experience.tsx`, `certifications.tsx`) dereference their
// `organization` reference identically (`organization-> { ... logo { asset->, hotspot, crop, alt } }`),
// so this shape — taken from one of them — matches either query result.
type Logo = NonNullable<
  EXPERIENCES_QUERY_RESULT[number]["organization"]
>["logo"]

function logoUrl(logo: Logo, size: number) {
  // `fit("crop")` so Sanity returns a square that fills the circular lockup,
  // rather than letterboxing a non-square source inside it.
  return logo?.asset
    ? urlFor(logo).width(size).height(size).fit("crop").url()
    : undefined
}

/**
 * The bordered circular logo lockup, carried over from v1 where it was the
 * recognisable mark of the resume cards. `shadow-xl` -> `shadow-2xl` on hover
 * is the design system's image-wrapper treatment, and this is a bordered image
 * wrapper — the one place that pairing is allowed.
 *
 * Shared between `experience.tsx` (organization logos) and
 * `certifications.tsx` (issuer logos) — both dereference an `organization`
 * document and want the identical circular lockup treatment.
 */
export function OrganizationLogoMark({
  logo,
  name,
  website,
  size = 64,
}: {
  logo: Logo
  name: string | null
  website: string | null
  size?: number
}) {
  const src = logoUrl(logo, 160)
  if (!src) return null

  const mark = (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-card",
        "border-2 border-border shadow-sm",
        website && "transition-shadow duration-press ease-snap hover:shadow"
      )}
      style={{ width: size, height: size }}
    >
      {/*
        `object-cover` rather than `contain`: several of these marks are
        wordmarks with generous built-in whitespace, which `contain` plus
        padding shrank to a stamp floating in a large circle. Cover fills the
        lockup edge to edge and crops the dead margin instead.
      */}
      <Image
        src={src}
        alt={logo?.alt ?? name ?? ""}
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-cover"
      />
    </span>
  )

  if (!website) return mark

  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      aria-label={`${name ?? "Organization"} website`}
    >
      {mark}
    </a>
  )
}
