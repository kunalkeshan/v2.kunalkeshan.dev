"use client"

import { motion, useReducedMotion } from "motion/react"
import { MailIcon } from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
import { Button } from "@workspace/ui/components/button"
import { useScroll } from "@workspace/ui/hooks/use-scroll"

import { DesktopNav } from "@/components/layouts/desktop-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { springTransition } from "@/lib/motion"

const ANIMATION_CONFIG = {
  scrolled: {
    borderRadius: "var(--radius-lg)",
    maxWidth: "42rem",
    top: 16,
    width: "94%",
    paddingInline: "1rem",
  },
  default: {
    borderRadius: "var(--radius-lg)",
    maxWidth: "48rem",
    top: 24,
    width: "96%",
    paddingInline: "1rem",
  },
  reduced: {
    duration: 0,
  },
} as const

const Navbar = () => {
  const scrolled = useScroll(20)
  const prefersReducedMotion = useReducedMotion()

  const animationProps = prefersReducedMotion
    ? {}
    : scrolled
      ? ANIMATION_CONFIG.scrolled
      : ANIMATION_CONFIG.default

  const transitionProps = prefersReducedMotion
    ? ANIMATION_CONFIG.reduced
    : springTransition

  return (
    <motion.nav
      initial={false}
      animate={animationProps}
      transition={transitionProps}
      className="fixed left-1/2 z-50 flex -translate-x-1/2 items-center justify-between border-3 border-border bg-card py-2 shadow-xl"
    >
      <Logo size="sm" priority />

      <DesktopNav />

      <div className="flex items-center gap-2">
        <MobileNav />
        <Button
          size="icon"
          aria-label="Contact"
          nativeButton={false}
          render={<a href="/contact" />}
          className="rounded-(--radius-lg) border-border bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
        >
          <MailIcon />
        </Button>
      </div>
    </motion.nav>
  )
}

export default Navbar
