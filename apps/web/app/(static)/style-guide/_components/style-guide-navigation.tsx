"use client"

import * as React from "react"
import { ChevronDownIcon, ListTreeIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

import { COMPONENT_CATALOG } from "./component-catalog"

interface NavItem {
  id: string
  label: string
  children?: NavItem[]
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-")

const navigation: NavItem[] = [
  { id: "overview", label: "Overview" },
  {
    id: "tokens",
    label: "Tokens",
    children: [
      { id: "colors", label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "shadows", label: "Shadows" },
      { id: "radius", label: "Radius" },
      { id: "border-widths", label: "Border widths" },
    ],
  },
  {
    id: "components",
    label: "Components",
    children: COMPONENT_CATALOG.map((entry) => ({
      id: slug(entry.name),
      label: entry.name,
    })),
  },
]

const flatNavigation = navigation.flatMap((item) => [
  item,
  ...(item.children ?? []),
])

function useActiveSection() {
  const [activeId, setActiveId] = React.useState("overview")

  React.useEffect(() => {
    const targets = flatNavigation
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (!targets.length) return

    const updateActive = () => {
      const line = 150
      const candidates = targets.filter(
        (element) => element.getBoundingClientRect().top <= line
      )
      const current = candidates[candidates.length - 1] ?? targets[0]
      if (!current) return
      setActiveId(current.id)
    }

    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [])

  return [activeId, setActiveId] as const
}

interface NavigationTreeProps {
  activeId: string
  onSelect?: (id: string) => void
}

function NavigationTree({ activeId, onSelect }: NavigationTreeProps) {
  return (
    <nav aria-label="Style guide sections">
      <SidebarGroup className="p-0">
        <SidebarMenu>
          {navigation.map((item) =>
            item.children ? (
              <Collapsible key={item.id} defaultOpen>
                <SidebarMenuItem>
                  <div className="flex items-center gap-1">
                    <SidebarMenuButton
                      render={<a href={`#${item.id}`} />}
                      isActive={item.id === activeId}
                      aria-current={
                        activeId === item.id ? "location" : undefined
                      }
                      onClick={() => onSelect?.(item.id)}
                      className="min-w-0 flex-1 font-heading font-black focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-active:bg-primary data-active:text-primary-foreground"
                    >
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    <CollapsibleTrigger
                      render={
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="shrink-0 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={`Toggle ${item.label} sections`}
                        />
                      }
                    >
                      <ChevronDownIcon aria-hidden="true" />
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-sidebar-border">
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.id}>
                          <SidebarMenuSubButton
                            render={<a href={`#${child.id}`} />}
                            isActive={activeId === child.id}
                            aria-current={
                              activeId === child.id ? "location" : undefined
                            }
                            onClick={() => onSelect?.(child.id)}
                            className="focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-active:bg-primary data-active:text-primary-foreground"
                          >
                            <span>{child.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<a href={`#${item.id}`} />}
                  isActive={activeId === item.id}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={() => onSelect?.(item.id)}
                  className="font-heading font-black focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-active:bg-primary data-active:text-primary-foreground"
                >
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroup>
    </nav>
  )
}

export function StyleGuideNavigation() {
  const [activeId, setActiveId] = useActiveSection()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const activeLabel =
    flatNavigation.find((item) => item.id === activeId)?.label ?? "Overview"

  React.useEffect(() => {
    const activeLink = document.querySelector<HTMLAnchorElement>(
      `[data-style-guide-desktop-nav] a[href="#${activeId}"]`
    )
    const scrollArea = activeLink?.closest<HTMLElement>(
      '[data-sidebar="content"]'
    )
    if (!activeLink || !scrollArea) return

    const linkBounds = activeLink.getBoundingClientRect()
    const scrollBounds = scrollArea.getBoundingClientRect()
    if (linkBounds.top < scrollBounds.top) {
      scrollArea.scrollTop -= scrollBounds.top - linkBounds.top
    } else if (linkBounds.bottom > scrollBounds.bottom) {
      scrollArea.scrollTop += linkBounds.bottom - scrollBounds.bottom
    }
  }, [activeId])

  return (
    <>
      <aside className="sticky top-28 hidden h-[calc(100svh-8rem)] self-start lg:block">
        <Sidebar
          collapsible="none"
          variant="floating"
          aria-label="Style guide navigation"
          data-style-guide-desktop-nav
          className="h-full w-full rounded-lg border-3 border-border bg-card p-3 text-foreground shadow-xl"
        >
          <SidebarHeader className="border-b-2 border-border px-2 pb-3">
            <p className="font-heading text-sm font-black">On this page</p>
            <p className="text-xs text-muted-foreground">Jump to a section</p>
          </SidebarHeader>
          <SidebarContent className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
            <NavigationTree activeId={activeId} onSelect={setActiveId} />
          </SidebarContent>
        </Sidebar>
      </aside>

      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                variant="default"
                className="h-11 max-w-full rounded-lg border-3 border-border px-4 shadow-xl"
              />
            }
          >
            <ListTreeIcon aria-hidden="true" />
            <span className="max-w-56 truncate">{activeLabel}</span>
            <span className="sr-only">Open style guide navigation</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[70svh] max-h-[70svh] gap-0 rounded-t-lg border-x-3 border-border bg-card px-4 pt-2 pb-[env(safe-area-inset-bottom)]"
          >
            <SheetHeader className="border-b-2 border-border px-0 pb-3">
              <SheetTitle className="font-heading font-black">
                Style guide sections
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto py-3">
              <NavigationTree
                activeId={activeId}
                onSelect={(id) => {
                  setActiveId(id)
                  setMobileOpen(false)
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export function StyleGuideLayout({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <SidebarProvider
      className={cn(
        "grid min-h-0 w-full grid-cols-1 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10",
        className
      )}
    >
      <StyleGuideNavigation />
      <div className="min-w-0">{children}</div>
    </SidebarProvider>
  )
}
