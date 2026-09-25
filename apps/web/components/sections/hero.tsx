"use client"

import { useEffect, useState } from "react"
import { Briefcase, MailIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"

import { useRevealGroup } from "@/hooks/use-reveal"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { Reveal } from "@/components/reveal"

const ROLE_INTERVAL_MS = 2600

interface HeroProps {
  name: string
  roles: string[]
  imageUrl: string
  imageAlt: string
}

const Hero = ({ name, roles, imageUrl, imageAlt }: HeroProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const { ref, state, Provider } = useRevealGroup<HTMLDivElement>("mount")

  useEffect(() => {
    if (prefersReducedMotion || roles.length <= 1) return

    const id = setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length)
    }, ROLE_INTERVAL_MS)

    return () => clearInterval(id)
  }, [prefersReducedMotion, roles.length])

  const activeRole = prefersReducedMotion ? roles[0] : roles[roleIndex]

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <Provider state={state}>
          <div ref={ref} className="grid gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-6 md:sticky md:top-28 md:self-start">
              <Reveal delay={0}>
                <div>
                  <h1 className="font-heading text-5xl leading-tight font-black sm:text-6xl md:text-7xl">
                    <span className="bg-primary px-1 text-primary-foreground">
                      {name}
                    </span>
                  </h1>

                  <div className="mt-2">
                    <span
                      key={activeRole}
                      aria-hidden="true"
                      className="animate-role-fade-in inline-block font-heading text-2xl font-bold text-foreground md:text-3xl"
                    >
                      {activeRole}
                    </span>
                    <span className="sr-only">{roles[0]}</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="max-w-lg text-base leading-relaxed text-body-foreground md:text-lg">
                  I build products with a focus on clean design and systems
                  that hold up over time — currently as a{" "}
                  <span className="bg-secondary px-1 text-secondary-foreground">
                    software engineer
                  </span>
                  , and independently through freelance and consulting work
                  on the side.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col gap-3 md:flex-row">
                  <Button
                    size="lg"
                    className="w-full md:w-1/2"
                    render={<Link href="/contact" />}
                    nativeButton={false}
                  >
                    <MailIcon data-icon="inline-start" />
                    Get in touch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full md:w-1/2"
                    render={<Link href="/projects" />}
                    nativeButton={false}
                  >
                    <Briefcase data-icon="inline-start" />
                    View my work
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal
              delay={0.4}
              className="flex h-fit max-h-130 w-full max-w-lg items-center justify-center overflow-hidden rounded-lg border-3 border-border shadow-xl transition-shadow duration-press ease-snap hover:shadow-2xl md:mx-auto"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={1433}
                height={1956}
                priority
                className="h-auto w-full object-cover"
              />
            </Reveal>
          </div>
        </Provider>
      </Container>
    </section>
  )
}

export default Hero
