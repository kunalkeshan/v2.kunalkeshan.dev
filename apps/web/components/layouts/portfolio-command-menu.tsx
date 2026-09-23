"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { Command as CommandPrimitive } from "cmdk"
import {
  BookOpenIcon,
  BriefcaseBusinessIcon,
  CopyIcon,
  DownloadIcon,
  FolderKanbanIcon,
  HandshakeIcon,
  HouseIcon,
  MailIcon,
  Music2Icon,
  MoonIcon,
  NewspaperIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
  UserRoundIcon,
  BadgeCheckIcon,
  CircleHelpIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"
import type { SITE_CONFIG_QUERY_RESULT } from "@workspace/sanity/types"

import { useRickrollAudio } from "@/providers/rickroll-audio-provider"

interface CommandAction {
  id: string
  label: string
  keywords: string[]
  icon: LucideIcon
  onSelect: () => void
}

interface CommandSection {
  id: string
  heading: string
  items: CommandAction[]
}

const pageDestinations = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: HouseIcon,
    keywords: ["start", "main"],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    icon: UserRoundIcon,
    keywords: ["bio", "profile"],
  },
  {
    id: "experience",
    label: "Experience",
    href: "/work",
    icon: BriefcaseBusinessIcon,
    keywords: ["work", "resume", "employment"],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    icon: FolderKanbanIcon,
    keywords: ["portfolio", "work"],
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
    icon: HandshakeIcon,
    keywords: ["freelance", "hire", "consulting"],
  },
  {
    id: "certifications",
    label: "Certifications",
    href: "/certifications",
    icon: BadgeCheckIcon,
    keywords: ["credentials", "courses"],
  },
  {
    id: "skills",
    label: "Skills",
    href: "/skills",
    icon: SparklesIcon,
    keywords: ["stack", "technologies"],
  },
  {
    id: "blog",
    label: "Blog",
    href: "/blog",
    icon: NewspaperIcon,
    keywords: ["writing", "articles", "posts"],
  },
  {
    id: "journal",
    label: "Journal",
    href: "/journal",
    icon: BookOpenIcon,
    keywords: ["notes", "personal"],
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    icon: MailIcon,
    keywords: ["email", "message", "reach"],
  },
  {
    id: "faqs",
    label: "FAQs",
    href: "/contact#faqs",
    icon: CircleHelpIcon,
    keywords: ["questions", "answers", "help"],
  },
]

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-sm border-2 border-border bg-muted px-1 font-mono text-[0.65rem] leading-none text-foreground">
      {children}
    </kbd>
  )
}

const subscribeToNoPlatformChanges = () => () => {}
const getServerShortcutModifier = () => "⌘"
const getClientShortcutModifier = () =>
  /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘" : "Ctrl"

function filterCommand(value: string, search: string, keywords: string[] = []) {
  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return 1

  const searchable = [value, ...keywords].join(" ").toLowerCase()
  return terms.every((term) => searchable.includes(term)) ? 1 : 0
}

export function PortfolioCommandMenu({
  siteConfig,
}: {
  siteConfig: SITE_CONFIG_QUERY_RESULT
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const shortcutModifier = useSyncExternalStore(
    subscribeToNoPlatformChanges,
    getClientShortcutModifier,
    getServerShortcutModifier
  )
  const { toggleRickroll } = useRickrollAudio()
  const { resolvedTheme, setTheme } = useTheme()

  const resumeUrl = siteConfig?.resumePdf?.asset?.url ?? null
  const rickrollUrl = siteConfig?.rickrollAudio?.asset?.url ?? null
  const primaryEmail = siteConfig?.emails?.find((entry) => entry.email)?.email
  const isDarkMode = resolvedTheme === "dark"

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.key.toLowerCase() !== "k") return
      if (!event.metaKey && !event.ctrlKey) return

      event.preventDefault()
      setOpen((current) => !current)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const navigate = (href: string) => () => router.push(href)

  const copyToken = (name: "primary" | "secondary") => async () => {
    try {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${name}`)
        .trim()

      await navigator.clipboard.writeText(value)
      toast.success(
        `${name === "primary" ? "Primary" : "Secondary"} color copied`
      )
    } catch {
      toast.error("Unable to copy color")
    }
  }

  const copyEmail = async () => {
    if (!primaryEmail) return

    try {
      await navigator.clipboard.writeText(primaryEmail)
      toast.success("Email address copied")
    } catch {
      toast.error("Unable to copy email address")
    }
  }

  const actions: CommandAction[] = [
    ...(resumeUrl
      ? [
          {
            id: "download-resume",
            label: "Download resume",
            keywords: ["cv", "pdf", "work", "experience"],
            icon: DownloadIcon,
            onSelect: () => {
              const link = document.createElement("a")
              link.href = resumeUrl
              link.download = "Kunal Keshan - Resume.pdf"
              link.target = "_blank"
              link.rel = "noopener noreferrer"
              link.click()
            },
          },
        ]
      : []),
    ...(primaryEmail
      ? [
          {
            id: "copy-email",
            label: "Copy email address",
            keywords: ["contact", "clipboard", "email", primaryEmail],
            icon: MailIcon,
            onSelect: copyEmail,
          },
        ]
      : []),
    {
      id: "toggle-theme",
      label: `Switch to ${isDarkMode ? "light" : "dark"} mode`,
      keywords: ["theme", "appearance", "light", "dark", "mode"],
      icon: isDarkMode ? SunIcon : MoonIcon,
      onSelect: () => setTheme(isDarkMode ? "light" : "dark"),
    },
    {
      id: "copy-primary-color",
      label: "Copy primary color variable",
      keywords: ["orange", "brand", "css", "token", "color"],
      icon: CopyIcon,
      onSelect: copyToken("primary"),
    },
    {
      id: "copy-secondary-color",
      label: "Copy secondary color variable",
      keywords: ["blue", "brand", "css", "token", "color"],
      icon: CopyIcon,
      onSelect: copyToken("secondary"),
    },
    ...(rickrollUrl
      ? [
          {
            id: "rickroll",
            label: "Toggle a little surprise",
            keywords: [
              "rickroll",
              "music",
              "audio",
              "easter egg",
              "play",
              "stop",
            ],
            icon: Music2Icon,
            onSelect: toggleRickroll,
          },
        ]
      : []),
  ]

  const sections: CommandSection[] = [
    {
      id: "pages",
      heading: "Pages",
      items: pageDestinations.map((page) => ({
        ...page,
        onSelect: navigate(page.href),
      })),
    },
    { id: "actions", heading: "Actions", items: actions },
  ]

  const runAction = (action: CommandAction) => {
    setOpen(false)
    action.onSelect()
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden h-8 items-center gap-1 bg-transparent px-2 text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
        aria-label={`Open command menu (${shortcutModifier}+K)`}
        title={`Open command menu (${shortcutModifier}+K)`}
      >
        <span className="flex items-center gap-1" aria-hidden="true">
          <ShortcutKey>{shortcutModifier}</ShortcutKey>
          <ShortcutKey>K</ShortcutKey>
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Search pages and actions"
        title="Search pages and actions"
      >
        <SearchIcon aria-hidden="true" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-label="Command menu"
          showCloseButton={false}
          className={cn(
            "fixed top-4 left-1/2 z-[60] flex max-h-[calc(100svh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-0 flex-col overflow-hidden rounded-lg border-3 border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none",
            "sm:top-[10vh] sm:max-h-[min(70vh,36rem)] sm:max-w-[40rem]"
          )}
        >
          <DialogTitle className="sr-only">
            Search pages and actions
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search portfolio pages and actions. Use the arrow keys to move and
            Enter to select.
          </DialogDescription>

          <CommandPrimitive
            loop
            filter={filterCommand}
            className="flex min-h-0 flex-col bg-transparent"
          >
            <div className="flex min-h-14 items-center gap-3 border-b-3 border-border px-4">
              <SearchIcon
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <CommandPrimitive.Input
                autoFocus
                aria-label="Search pages and actions"
                placeholder="Search pages and actions…"
                className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
              />
              <DialogClose
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:hidden"
                aria-label="Close command menu"
              >
                Close
              </DialogClose>
              <span
                className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex"
                aria-hidden="true"
              >
                <ShortcutKey>esc</ShortcutKey>
              </span>
            </div>

            <CommandPrimitive.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]">
              <CommandPrimitive.Empty className="py-10 text-center text-sm text-muted-foreground">
                No matching pages or actions.
              </CommandPrimitive.Empty>

              {sections.map((section, index) => (
                <div key={section.id}>
                  {index > 0 && (
                    <CommandPrimitive.Separator className="my-2 h-px bg-border" />
                  )}
                  <CommandPrimitive.Group
                    heading={section.heading}
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-1 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:font-heading [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {section.items.map((action) => {
                      const Icon = action.icon
                      return (
                        <CommandPrimitive.Item
                          key={action.id}
                          value={action.label}
                          keywords={action.keywords}
                          onSelect={() => runAction(action)}
                          className="group/command-item flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm outline-none aria-selected:bg-primary aria-selected:text-primary-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                        >
                          <Icon
                            className="size-4 shrink-0 text-muted-foreground group-aria-selected/command-item:text-primary-foreground"
                            aria-hidden="true"
                          />
                          <span className="truncate">{action.label}</span>
                          {action.id === "copy-primary-color" && (
                            <span
                              className="ml-auto size-4 rounded-sm border-2 border-border bg-primary"
                              aria-hidden="true"
                            />
                          )}
                          {action.id === "copy-secondary-color" && (
                            <span
                              className="ml-auto size-4 rounded-sm border-2 border-border bg-secondary"
                              aria-hidden="true"
                            />
                          )}
                        </CommandPrimitive.Item>
                      )
                    })}
                  </CommandPrimitive.Group>
                </div>
              ))}
            </CommandPrimitive.List>

            <div className="hidden items-center gap-4 border-t-3 border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground sm:flex">
              <span className="flex items-center gap-1.5">
                <ShortcutKey>↑</ShortcutKey>
                <ShortcutKey>↓</ShortcutKey> Move
              </span>
              <span className="flex items-center gap-1.5">
                <ShortcutKey>↵</ShortcutKey> Open
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <XIcon className="size-3" aria-hidden="true" />
                Esc to close
              </span>
            </div>
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
    </>
  )
}
