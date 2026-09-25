"use client"

import { MailIcon } from "lucide-react"
import Link from "next/link"

import { Logo } from "@workspace/ui/components/logo"
import { Button } from "@workspace/ui/components/button"
import { useScroll } from "@workspace/ui/hooks/use-scroll"
import { urlFor } from "@workspace/sanity/image"
import type { SITE_CONFIG_QUERY_RESULT } from "@workspace/sanity/types"

import { DesktopNav } from "@/components/layouts/desktop-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { PortfolioCommandMenu } from "@/components/layouts/portfolio-command-menu"
import { useReveal } from "@/hooks/use-reveal"

interface Props {
  siteConfig: SITE_CONFIG_QUERY_RESULT
}

/**
 * Scroll-morph between `default` and `scrolled` shapes (`data-nav-state`, see
 * `packages/ui/src/styles/globals.css`) plus a mount-in reveal
 * (`useReveal("mount")`, fade-only — the nav is `fixed`, not `sticky`, so the
 * `[data-reveal]` translateY variant would work too, but fade-only reads
 * identically here and keeps one fewer property in flight during the very
 * first paint). `useScroll` is the same hysteresis hook as before — it
 * already returned a plain boolean, no motion dependency.
 */
const Navbar = ({ siteConfig }: Props) => {
  const scrolled = useScroll(20)
  const { ref, state } = useReveal<HTMLElement>("mount")
  const logoSrc = siteConfig?.logo?.asset
    ? urlFor(siteConfig.logo).width(112).height(112).url()
    : undefined

  return (
    <nav
      ref={ref}
      data-reveal={state}
      data-reveal-fade
      data-nav-state={scrolled ? "scrolled" : "default"}
      className="fixed left-1/2 z-50 flex -translate-x-1/2 items-center justify-between rounded-lg border-3 border-border bg-card px-4 py-2 shadow-xl"
    >
      <Logo size="sm" preload src={logoSrc} />

      <DesktopNav />

      <div className="flex items-center gap-2">
        <PortfolioCommandMenu siteConfig={siteConfig} />
        <Button
          size="icon"
          aria-label="Contact"
          nativeButton={false}
          render={<Link href="/contact" />}
          className="rounded-lg border-border bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
        >
          <MailIcon />
        </Button>
        <MobileNav logoSrc={logoSrc} />
      </div>
    </nav>
  )
}

export default Navbar
