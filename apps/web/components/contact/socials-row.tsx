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

interface SocialsRowProps {
  socialMedia: SocialMedia
}

export function SocialsRow({ socialMedia }: SocialsRowProps) {
  if (!socialMedia || socialMedia.length === 0) return null

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 lg:justify-start">
      {socialMedia.map((social) => {
        if (!social.url || !social.platform) return null
        const Icon = PLATFORM_ICONS[social.platform]
        if (!Icon) return null

        return (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.label ?? social.platform}
            aria-label={social.label ?? social.platform}
            onClick={() =>
              trackLinkClick({
                platform: social.platform ?? "unknown",
                url: social.url ?? "",
                placement: "contact_socials",
              })
            }
            className="flex size-10 items-center justify-center rounded-full border-2 border-border bg-card text-lg shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
