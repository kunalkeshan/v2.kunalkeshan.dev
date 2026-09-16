import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu"

import { primaryLinks, workLinks, moreLinks } from "@/components/layouts/nav-links"
import { NavDropdownItem } from "@/components/layouts/nav-dropdown-item"

// Top-level nav row: flat text links, no surface. The shared primitives bake in a
// grey `bg-muted` hover/focus/open chip; this nav wants a pure text-color change
// (see docs/ui/design-system.md "Hover-color rules"), so each grey state is
// cancelled by name — `bg-transparent` alone only covers the rest state.
const navItemBase =
  "bg-transparent font-bold transition-colors duration-press ease-snap hover:bg-transparent focus:bg-transparent hover:text-secondary focus-visible:text-secondary"

const navLinkClassName = cn(
  navItemBase,
  "data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent"
)

const navTriggerClassName = cn(
  navItemBase,
  "data-popup-open:bg-transparent data-popup-open:hover:bg-transparent",
  "data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent",
  // open dropdown reads as blue text instead of a grey chip
  "data-popup-open:text-secondary data-open:text-secondary"
)

export function DesktopNav() {
  return (
    <NavigationMenu className={cn("hidden md:block")}>
      <NavigationMenuList className="gap-3">
        {primaryLinks.map((item) => (
          <NavigationMenuLink
            key={item.href}
            className={navLinkClassName}
            render={<Link href={item.href}>{item.label}</Link>}
          />
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navTriggerClassName}>
            Work
          </NavigationMenuTrigger>
          <NavigationMenuContent className="pr-1.5 pb-1.5">
            <div className="grid w-72 gap-2 rounded-lg border-3 border-border bg-card p-2 shadow-lg">
              {workLinks.map((item) => (
                <NavigationMenuLink
                  key={item.href}
                  render={<NavDropdownItem {...item} />}
                />
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navTriggerClassName}>
            More
          </NavigationMenuTrigger>
          <NavigationMenuContent className="pr-1.5 pb-1.5">
            <div className="grid w-72 gap-2 rounded-lg border-3 border-border bg-card p-2 shadow-lg">
              {moreLinks.map((item) => (
                <NavigationMenuLink
                  key={item.href}
                  render={<NavDropdownItem {...item} />}
                />
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
