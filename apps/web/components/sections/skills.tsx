"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRightIcon } from "lucide-react"

import { Container } from "@workspace/ui/components/container"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { urlFor } from "@workspace/sanity/image"
import type { FEATURED_SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

import { HighlightText } from "@/components/highlight-text"
import {
  sectionReveal,
  sectionRevealTransition,
  sectionRevealViewport,
} from "@/lib/motion"

type Skill = NonNullable<FEATURED_SKILLS_QUERY_RESULT>[number]

interface SkillsProps {
  skills: FEATURED_SKILLS_QUERY_RESULT
}

function SkillCell({ skill }: { skill: Skill }) {
  const iconUrl = skill.icon?.asset
    ? urlFor(skill.icon).width(64).height(64).url()
    : undefined

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border-2 border-border bg-card px-3 py-2.5",
        "shadow-sm transition-[translate,transform,box-shadow] duration-press ease-snap",
        "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
      )}
    >
      {iconUrl && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-white p-0.5">
          <Image
            src={iconUrl}
            alt={skill.icon?.alt ?? ""}
            width={20}
            height={20}
            className="size-full object-contain"
          />
        </span>
      )}
      <span className="whitespace-nowrap font-heading text-xs font-bold sm:text-sm">
        {skill.name}
      </span>
    </div>
  )
}

const Skills = ({ skills }: SkillsProps) => {
  if (!skills || skills.length === 0) return null

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="py-10 md:py-16"
    >
      <Container>
        <h2 className="mb-6 font-heading text-2xl font-black sm:text-3xl">
          A good workman never blames his tools
          {"—"}
          <HighlightText variant="secondary">
            but a great one collects them
          </HighlightText>
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillCell key={skill._id} skill={skill} />
          ))}
          <Button
            variant="outline"
            className="h-auto rounded-lg border-2 px-3 py-2.5 text-xs font-bold sm:text-sm"
            render={<Link href="/skills" />}
            nativeButton={false}
          >
            And more
            <ArrowRightIcon data-icon="inline-end" className="size-4" />
          </Button>
        </div>
      </Container>
    </motion.section>
  )
}

export default Skills
