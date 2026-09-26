/**
 * Display labels and ordering for the project facets.
 *
 * Mirrors `lib/skill-categories.ts`: the Studio stores machine values, and the
 * web app owns how they read. Keys match the generated unions in
 * `@workspace/sanity/types` exactly — widening either list means regenerating
 * types first, then extending these maps.
 */

export const PROJECT_KIND_ORDER = [
  "professional",
  "freelance",
  "personal",
  "open-source",
  "research",
  "college",
] as const

export type ProjectKind = (typeof PROJECT_KIND_ORDER)[number]

export const PROJECT_KIND_LABELS: Record<string, string> = {
  professional: "Professional",
  freelance: "Freelance",
  personal: "Personal",
  "open-source": "Open source",
  research: "Research",
  college: "College",
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  live: "Live",
  "in-development": "In development",
  unlaunched: "Unlaunched",
  archived: "Archived",
}

/**
 * `employmentType` lives on the linked `experience` document, so a professional
 * project can say "Full-time at StejasSYS" / "Contract at Flookup" without the
 * employment type ever being retyped on the project itself.
 */
export const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
  volunteer: "Volunteer",
}

/**
 * The line under a project title on its page, e.g. "Full-time at StejasSYS".
 * Falls back to the organization alone when there's no linked role, and to
 * nothing at all for personal work with neither.
 */
export function attributionLine(
  employmentType: string | null | undefined,
  organizationName: string | null | undefined
): string | null {
  const employment = employmentType ? EMPLOYMENT_LABELS[employmentType] : null

  if (employment && organizationName) return `${employment} at ${organizationName}`
  return organizationName ?? null
}
