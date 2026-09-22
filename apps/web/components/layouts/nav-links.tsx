import {
  FolderKanbanIcon,
  HandshakeIcon,
  BadgeCheckIcon,
  NewspaperIcon,
  BookOpenIcon,
  HelpCircleIcon,
  RssIcon,
  LinkIcon,
  SparklesIcon,
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
  { label: "Experience", href: "/experience" },
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
  {
    label: "Feed",
    href: "/feed",
    description: "A running log of what I'm up to",
    icon: <RssIcon />,
  },
  {
    label: "Links",
    href: "/links",
    description: "Everywhere else you can find me",
    icon: <LinkIcon />,
  },
]
