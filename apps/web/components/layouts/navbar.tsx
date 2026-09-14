"use client"

import { motion, useReducedMotion } from "motion/react"
import { MailIcon } from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
import { Button } from "@workspace/ui/components/button"
import { useScroll } from "@workspace/ui/hooks/use-scroll"

import { DesktopNav } from "@/components/layouts/desktop-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { springTransition } from "@/lib/motion"

const navVariants = {
  enter: {
    opacity: 0,
    y: -20,
    borderRadius: "var(--radius-lg)",
    maxWidth: "48rem",
    top: 24,
    width: "96%",
    paddingInline: "1rem",
  },
  default: {
    opacity: 1,
    y: 0,
    borderRadius: "var(--radius-lg)",
    maxWidth: "48rem",
    top: 24,
    width: "96%",
    paddingInline: "1rem",
  },
  scrolled: {
    opacity: 1,
    y: 0,
    borderRadius: "var(--radius-lg)",
    maxWidth: "42rem",
    top: 16,
    width: "94%",
    paddingInline: "1rem",
  },
} as const

const Navbar = () => {
  const scrolled = useScroll(20)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.nav
      initial={prefersReducedMotion ? false : "enter"}
      animate={scrolled ? "scrolled" : "default"}
      variants={navVariants}
      transition={prefersReducedMotion ? { duration: 0 } : springTransition}
      className="fixed left-1/2 z-50 flex -translate-x-1/2 items-center justify-between border-3 border-border bg-card py-2 shadow-xl"
    >
      <Logo size="sm" priority />

      <DesktopNav />

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          aria-label="Contact"
          nativeButton={false}
          render={<a href="/contact" />}
          className="rounded-(--radius-lg) border-border bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
        >
          <MailIcon />
        </Button>
        <MobileNav />
      </div>
    </motion.nav>
  )
}

export default Navbar
