"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6"
import { toast } from "sonner"

import { cn } from "@workspace/ui/lib/utils"

export interface ShareButtonsProps {
  url: string
  title: string
}

const iconButtonClass = cn(
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-card",
  "shadow-sm transition-[translate,transform,box-shadow,background-color] duration-press ease-snap",
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-muted hover:shadow-none",
  "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
)

/**
 * X, LinkedIn, WhatsApp share-intent links + a copy-to-clipboard button —
 * the four platforms confirmed during planning (the cagpt.in reference also
 * showed Telegram/Facebook/Reddit/email, which weren't picked).
 */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: FaXTwitter,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: FaLinkedin,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: FaWhatsapp,
    },
  ]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Unable to copy link")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-muted-foreground">Share:</span>
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={iconButtonClass}
        >
          <Icon className="size-4" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title="Click to copy"
        className={cn(iconButtonClass, copied && "text-success")}
      >
        {copied ? (
          <CheckIcon className="size-4" aria-hidden="true" />
        ) : (
          <CopyIcon className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
