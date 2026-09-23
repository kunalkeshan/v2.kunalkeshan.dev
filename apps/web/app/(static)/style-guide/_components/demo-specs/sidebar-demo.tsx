"use client"

import { BlocksIcon, PaletteIcon, SettingsIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@workspace/ui/components/sidebar"

export const sidebarSnippet = `<SidebarProvider>
  <Sidebar collapsible="none" variant="floating">
    <SidebarHeader>Workspace</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Design</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive><PaletteIcon />Tokens</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`

export function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-64 gap-4 rounded-lg border-2 border-border bg-background p-3">
      <Sidebar
        collapsible="none"
        variant="floating"
        className="h-60 w-52 rounded-lg border-3 border-border bg-card p-2 text-foreground shadow-xl"
      >
        <SidebarHeader className="border-b-2 border-border px-2 pb-2">
          <p className="font-heading text-sm font-black">Workspace</p>
        </SidebarHeader>
        <SidebarContent className="pt-2">
          <SidebarGroup>
            <SidebarGroupLabel className="font-heading font-black text-foreground">
              Design
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  className="data-active:bg-primary data-active:text-primary-foreground"
                >
                  <PaletteIcon aria-hidden="true" />
                  <span>Tokens</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BlocksIcon aria-hidden="true" />
                  <span>Components</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SettingsIcon aria-hidden="true" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="hidden flex-1 items-center justify-center rounded-lg border-3 border-border bg-card p-6 text-center sm:flex">
        <div>
          <p className="font-heading font-black">Main content</p>
          <p className="mt-1 text-sm text-body-foreground">
            Place page content beside the sidebar.
          </p>
        </div>
      </div>
    </SidebarProvider>
  )
}
