"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Briefcase, MailIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"

import { heroReveal, heroRevealTransition } from "@/lib/motion"

const roles = [
  "Building, steadily",
  "Clean design, practical decisions",
  "Curious, always learning",
  "Maintainable systems",
]

const ROLE_INTERVAL_MS = 2600

const Hero = () => {
  const prefersReducedMotion = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return

    const id = setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length)
    }, ROLE_INTERVAL_MS)

    return () => clearInterval(id)
  }, [prefersReducedMotion])

  const activeRole = prefersReducedMotion ? roles[0] : roles[roleIndex]

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={heroReveal}
          transition={
            prefersReducedMotion ? { duration: 0 } : heroRevealTransition
          }
          className="grid gap-10 md:grid-cols-2"
        >
          <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
            <div>
              <h1 className="font-heading text-5xl leading-tight font-black sm:text-6xl md:text-7xl">
                <span className="bg-primary px-1 text-primary-foreground">
                  Kunal Keshan
                </span>
              </h1>

              <div className="mt-2">
                <motion.span
                  key={activeRole}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  aria-hidden="true"
                  className="inline-block font-heading text-2xl font-bold text-foreground md:text-3xl"
                >
                  {activeRole}
                </motion.span>
                <span className="sr-only">{roles[0]}</span>
              </div>
            </div>

            <p className="max-w-lg text-base leading-relaxed text-body-foreground md:text-lg">
              I build products with a focus on clean design and systems that
              hold up over time — currently as a{" "}
              <span className="bg-secondary px-1 text-secondary-foreground">
                software engineer
              </span>
              , and independently through freelance and consulting work on
              the side.
            </p>

            <div className="flex flex-col gap-3 md:flex-row">
              <Button
                size="lg"
                className="w-full md:w-1/2"
                render={<a href="/contact" />}
                nativeButton={false}
              >
                <MailIcon data-icon="inline-start" />
                Get in touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-1/2"
                render={<a href="/projects" />}
                nativeButton={false}
              >
                <Briefcase data-icon="inline-start" />
                View my work
              </Button>
            </div>
          </div>

          <div className="flex h-fit max-h-[520px] w-full max-w-lg items-center justify-center overflow-hidden rounded-(--radius-lg) border-3 border-border shadow-xl transition-shadow duration-(--duration-press) ease-(--ease-snap) hover:shadow-[var(--shadow-2xl)] md:mx-auto">
            <Image
              src="/logo.jpg"
              alt="Illustration of Kunal Keshan working at a desk with dual monitors"
              width={1433}
              height={1956}
              loading="eager"
              className="h-auto w-full object-cover"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero
