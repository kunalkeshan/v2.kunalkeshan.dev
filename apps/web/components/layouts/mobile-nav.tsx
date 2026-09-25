"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon, XIcon } from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
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

interface Props {
  logoSrc?: string
}

/**
 * Every link across the three groups (primary/work/more) shares one running
 * stagger index, so the whole list fans in as a single sequence rather than
 * restarting per group. Each link's `--stagger-index` custom property drives
 * `.animate-nav-item-in`'s `animation-delay` (see
 * `packages/ui/src/styles/globals.css`) — replaces the old
 * `staggerChildren`/`delayChildren` variants.
 */
function makeIndexer() {
  let i = 0
  return () => i++
}

export function MobileNav({ logoSrc }: Props) {
  const [open, setOpen] = React.useState(false)
  // `SheetContent` unmounts entirely when closed (Base UI's Dialog has no
  // `keepMounted`), so this list is freshly mounted every time the sheet
  // opens — the `.animate-nav-item-in` keyframe (applied unconditionally
  // below) naturally replays each time, same as the old
  // `initial="closed" animate="open"` did on first render.
  const nextIndex = makeIndexer()

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
        <SheetContent
          side="right"
          className="data-[side=right]:w-full data-[side=right]:sm:max-w-sm"
        >
          <SheetHeader className="flex-row items-center gap-3">
            <Logo size="sm" src={logoSrc} />
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
            {primaryLinks.map((item) => (
              <div
                key={item.href}
                className="animate-nav-item-in"
                style={{ "--stagger-index": nextIndex() } as React.CSSProperties}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md p-2 text-sm font-semibold hover:bg-muted"
                >
                  {item.label}
                </Link>
              </div>
            ))}

            <span className="mt-3 px-2 text-xs font-semibold text-muted-foreground">
              Work
            </span>
            {workLinks.map((item) => (
              <div
                key={item.href}
                className="animate-nav-item-in"
                style={{ "--stagger-index": nextIndex() } as React.CSSProperties}
              >
                <NavDropdownItem {...item} onClick={() => setOpen(false)} />
              </div>
            ))}

            <span className="mt-3 px-2 text-xs font-semibold text-muted-foreground">
              More
            </span>
            {moreLinks.map((item) => (
              <div
                key={item.href}
                className="animate-nav-item-in"
                style={{ "--stagger-index": nextIndex() } as React.CSSProperties}
              >
                <NavDropdownItem {...item} onClick={() => setOpen(false)} />
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
