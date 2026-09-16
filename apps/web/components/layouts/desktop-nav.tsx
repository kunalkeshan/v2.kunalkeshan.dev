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

export function DesktopNav() {
  return (
    <NavigationMenu className={cn("hidden md:block")}>
      <NavigationMenuList className="gap-6">
        {primaryLinks.map((item) => (
          <NavigationMenuLink
            key={item.href}
            className="bg-transparent font-semibold hover:text-secondary focus:text-secondary"
            render={<Link href={item.href}>{item.label}</Link>}
          />
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent font-semibold hover:text-secondary">
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
          <NavigationMenuTrigger className="bg-transparent font-semibold hover:text-secondary">
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
