import {
  FolderKanbanIcon,
  HandshakeIcon,
  BadgeCheckIcon,
  NewspaperIcon,
  BookOpenIcon,
  HelpCircleIcon,
  SparklesIcon,
  LayoutGridIcon,
  Rows3Icon,
  AlignLeftIcon,
  ListIcon,
} from "lucide-react"

export type LinkItemType = {
  label: string
  href: string
  icon?: React.ReactNode
  description?: string
}

export const primaryLinks: LinkItemType[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/work" },
]

export const workLinks: LinkItemType[] = [
  {
    label: "Projects",
    href: "/projects",
    description: "Things I've built, shipped, and broken along the way",
    icon: <FolderKanbanIcon />,
  },
  {
    label: "Services",
    href: "/services",
    description: "What I can help you build, from software to deployment.",
    icon: <HandshakeIcon />,
  },
  {
    label: "Certifications",
    href: "/certifications",
    description: "Courses and credentials I've picked up",
    icon: <BadgeCheckIcon />,
  },
  {
    label: "Skills",
    href: "/skills",
    description: "The full stack of tools and technologies I work with",
    icon: <SparklesIcon />,
  },
  // Temporary — /work redesign comparison. Remove these 4 entries (and the
  // "Work" dropdown's 2-column grid tweak in desktop-nav.tsx) once a variant
  // is picked and the losers are deleted. See the plan this was built from.
  {
    label: "Preview: Cards",
    href: "/work/preview/cards",
    description: "/work redesign preview — bordered card timeline",
    icon: <LayoutGridIcon />,
  },
  {
    label: "Preview: Blocks",
    href: "/work/preview/blocks",
    description: "/work redesign preview — heavier company blocks",
    icon: <Rows3Icon />,
  },
  {
    label: "Preview: Editorial",
    href: "/work/preview/editorial",
    description: "/work redesign preview — two-column editorial layout",
    icon: <AlignLeftIcon />,
  },
  {
    label: "Preview: Dense rail",
    href: "/work/preview/dense",
    description: "/work redesign preview — today's rail, denser styling",
    icon: <ListIcon />,
  },
]

export const moreLinks: LinkItemType[] = [
  {
    label: "Blogs",
    href: "/blog",
    description: "Notes and writing on things I'm learning",
    icon: <NewspaperIcon />,
  },
  {
    label: "Journal",
    href: "/journal",
    description: "A running, more personal log of what I'm up to",
    icon: <BookOpenIcon />,
  },
  {
    label: "FAQs",
    href: "/contact#faqs",
    description: "Answers to things people keep asking me",
    icon: <HelpCircleIcon />,
  },
]
