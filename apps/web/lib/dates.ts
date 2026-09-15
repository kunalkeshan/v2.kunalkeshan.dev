const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/**
 * Sanity `date` fields arrive as `YYYY-MM-DD` strings. Parsing them with
 * `new Date(str)` treats them as UTC midnight, so formatting in a timezone
 * behind UTC would render the previous month. Everything here pins to UTC.
 */
function parse(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatMonthYear(value: string | null): string | null {
  const date = parse(value)
  return date ? MONTH_YEAR.format(date) : null
}

/**
 * "Jan 2025 - Present", "Jul 2024 - Dec 2024", or just "Jan 2025" when there
 * is no end date and the role isn't flagged current.
 */
export function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean | null
): string {
  const start = formatMonthYear(startDate)
  const end = isCurrent ? "Present" : formatMonthYear(endDate)

  if (start && end) return `${start} - ${end}`
  return start ?? end ?? ""
}

/**
 * "1 yr 9 mos", "6 mos". Used for the tenure line when several roles are
 * grouped under one organization, matching how the same span reads on a CV.
 */
export function formatDuration(
  startDate: string | null,
  endDate: string | null,
  isCurrent: boolean | null
): string | null {
  const start = parse(startDate)
  if (!start) return null

  const end = isCurrent ? new Date() : parse(endDate)
  if (!end) return null

  // Inclusive of both endpoint months, which is how LinkedIn and CVs count.
  const months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth()) +
    1

  if (months <= 0) return null

  const years = Math.floor(months / 12)
  const remainder = months % 12

  const parts: string[] = []
  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`)
  if (remainder > 0) parts.push(`${remainder} mo${remainder === 1 ? "" : "s"}`)

  return parts.join(" ") || null
}

/**
 * The earliest start and latest end across a set of roles, for the combined
 * tenure shown beside an organization's name.
 */
export function spanOf(
  roles: Array<{
    startDate: string | null
    endDate: string | null
    isCurrent: boolean | null
  }>
): { startDate: string | null; endDate: string | null; isCurrent: boolean } {
  const starts = roles
    .map((role) => role.startDate)
    .filter((value): value is string => Boolean(value))
    .sort()

  const isCurrent = roles.some((role) => role.isCurrent)

  const ends = roles
    .map((role) => role.endDate)
    .filter((value): value is string => Boolean(value))
    .sort()

  return {
    startDate: starts[0] ?? null,
    endDate: isCurrent ? null : (ends[ends.length - 1] ?? null),
    isCurrent,
  }
}
