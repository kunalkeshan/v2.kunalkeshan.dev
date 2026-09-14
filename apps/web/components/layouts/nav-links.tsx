import {
  FolderKanbanIcon,
  FileTextIcon,
  BadgeCheckIcon,
  NewspaperIcon,
  HeartHandshakeIcon,
  HelpCircleIcon,
  RssIcon,
  LinkIcon,
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
  { label: "Services", href: "/#services" },
]

export const workLinks: LinkItemType[] = [
  {
    label: "Projects",
    href: "/projects",
    description: "Things I've built, shipped, and broken along the way",
    icon: <FolderKanbanIcon />,
  },
  {
    label: "Resume",
    href: "/resume",
    description: "My experience and background, in document form",
    icon: <FileTextIcon />,
  },
  {
    label: "Certifications",
    href: "/certifications",
    description: "Courses and credentials I've picked up",
    icon: <BadgeCheckIcon />,
  },
]

export const moreLinks: LinkItemType[] = [
  {
    label: "Blog",
    href: "https://blog.kunalkeshan.dev",
    description: "Notes and writing on things I'm learning",
    icon: <NewspaperIcon />,
  },
  {
    label: "Tributes",
    href: "/tributes",
    description: "People and things that shaped how I think",
    icon: <HeartHandshakeIcon />,
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
