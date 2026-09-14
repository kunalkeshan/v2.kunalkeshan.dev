"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

import { primaryLinks, workLinks, moreLinks } from "@/components/layouts/nav-links"
import { NavDropdownItem } from "@/components/layouts/nav-dropdown-item"

const listVariants = {
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  closed: {},
}

const itemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -8 },
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Toggle menu" />
          }
        >
          {open ? <XIcon /> : <MenuIcon />}
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <motion.nav
            initial="closed"
            animate={open ? "open" : "closed"}
            variants={listVariants}
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4"
          >
            {primaryLinks.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-(--radius-base) p-2 text-sm font-semibold hover:bg-muted"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <span className="mt-3 px-2 text-xs font-semibold text-muted-foreground">
              Work
            </span>
            {workLinks.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <NavDropdownItem {...item} />
              </motion.div>
            ))}

            <span className="mt-3 px-2 text-xs font-semibold text-muted-foreground">
              More
            </span>
            {moreLinks.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <NavDropdownItem {...item} />
              </motion.div>
            ))}
          </motion.nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
