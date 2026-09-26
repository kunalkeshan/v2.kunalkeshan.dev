import type {
  EDUCATION_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
} from "@workspace/sanity/types"

export type Role = EXPERIENCES_QUERY_RESULT[number]
export type Education = EDUCATION_QUERY_RESULT[number]
type OrganizationLogo = NonNullable<Role["organization"]>["logo"]

export type OrganizationGroup = {
  key: string
  name: string | null
  website: string | null
  description: string | null
  logo: OrganizationLogo
  roles: Array<Role | Education>
}

/**
 * Collapses consecutive roles at the same organization into one group.
 *
 * Consecutive rather than global, so the Studio's drag order stays the source
 * of truth — moving a role away from its siblings splits the group rather
 * than silently teleporting it back.
 *
 * Lives outside `components/sections/experience.tsx` (a `"use client"`
 * module) specifically so it stays callable from a Server Component — a
 * plain function can't be invoked directly across the server/client
 * boundary once its module is marked `"use client"`, only rendered as JSX.
 * `experience.tsx` re-exports this for its own (client) call sites; the
 * `/work/preview/dense` variant, which stays a Server Component to match
 * the live page, imports it from here directly.
 */
export function groupByOrganization(
  roles: Array<Role | Education>
): OrganizationGroup[] {
  return roles.reduce<OrganizationGroup[]>((groups, role) => {
    const previous = groups[groups.length - 1]
    const orgId = role.organization?._id

    if (previous && orgId && previous.key === orgId) {
      previous.roles.push(role)
      return groups
    }

    groups.push({
      key: orgId ?? role._id,
      name: role.organization?.name ?? null,
      website: role.organization?.website ?? null,
      description:
        role.organization && "description" in role.organization
          ? role.organization.description
          : null,
      logo: role.organization?.logo ?? null,
      roles: [role],
    })
    return groups
  }, [])
}
