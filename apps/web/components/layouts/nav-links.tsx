import {
  FolderKanbanIcon,
  FileTextIcon,
  BadgeCheckIcon,
  NewspaperIcon,
  HeartHandshakeIcon,
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
    label: "Experience",
    href: "/experience",
    description: "Every role so far, and what I built in each one",
    icon: <FileTextIcon />,
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
