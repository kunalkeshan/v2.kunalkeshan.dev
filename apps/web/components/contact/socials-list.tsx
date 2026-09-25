"use client"

import {
  FaBlog,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa"

import type { SITE_CONFIG_QUERY_RESULT } from "@workspace/sanity/types"

import { trackLinkClick } from "@/lib/analytics"

type SocialMedia = NonNullable<SITE_CONFIG_QUERY_RESULT>["socialMedia"]

const PLATFORM_ICONS: Record<string, React.ComponentType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  blog: FaBlog,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  discord: FaDiscord,
  telegram: FaTelegram,
}

const PLATFORM_NAMES: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter (X)",
  instagram: "Instagram",
  youtube: "YouTube",
  blog: "Blog",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  discord: "Discord",
  telegram: "Telegram",
}

interface SocialsListProps {
  socialMedia: SocialMedia
}

/**
 * Detailed icon + title + description row list for the contact page's
 * sticky left column — a fuller alternative to the compact icon-only
 * `SocialsRow` (which stays as-is; the footer still uses that version).
 * Only platforms carrying a Sanity-authored `description` render here, so
 * a link added in Studio without one is silently skipped rather than
 * showing an empty subtitle.
 *
 * Not independently animated: this renders inside `ContactHero`'s own
 * `motion.section` (mount-entrance `heroReveal`), so wrapping it in a
 * second `motion` element here would just double up the same reveal.
 */
export function SocialsList({ socialMedia }: SocialsListProps) {
  const entries = (socialMedia ?? []).filter(
    (social) =>
      social.url && social.platform && social.description && PLATFORM_ICONS[social.platform]
  )

  if (entries.length === 0) return null

  return (
    <div className="w-full">
      <h2 className="font-heading text-lg font-black sm:text-xl">
        Where to find me (besides my inbox)
      </h2>

      <ul className="mt-4 overflow-hidden rounded-lg border-3 border-border shadow-lg">
        {entries.map((social) => {
          const Icon = PLATFORM_ICONS[social.platform!]
          if (!Icon) return null

          return (
            <li
              key={social.url}
              className="border-b-3 border-border last:border-b-0"
            >
              <a
                href={social.url!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkClick({
                    platform: social.platform ?? "unknown",
                    url: social.url ?? "",
                    placement: "contact_socials",
                    position: "primary",
                  })
                }
                className="group flex items-start gap-4 bg-card px-4 py-4 text-left transition-[background-color,box-shadow] duration-press ease-snap hover:bg-muted hover:shadow-[inset_5px_5px_0_-2px_var(--shadow-color)] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-md border-3 border-border bg-muted text-lg shadow-sm transition-[box-shadow,translate] duration-press ease-snap group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none motion-reduce:group-hover:translate-none"
                >
                  <Icon />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-heading text-base font-black">
                    {social.label ?? PLATFORM_NAMES[social.platform!]}
                  </span>
                  <span className="text-sm text-body-foreground">
                    {social.description}
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
