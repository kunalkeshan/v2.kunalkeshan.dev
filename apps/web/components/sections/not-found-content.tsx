"use client"

import { HomeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"

import { useReveal } from "@/hooks/use-reveal"

const NotFoundContent = () => {
  const { ref, state } = useReveal<HTMLDivElement>("mount")

  return (
    <section className="flex min-h-[calc(100svh-7rem)] items-center py-16 md:py-24">
      <Container>
        <div
          ref={ref}
          data-reveal={state}
          className="relative flex flex-col items-center justify-center gap-10 text-center lg:flex-row lg:gap-16 lg:text-left"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-center font-heading text-[8rem] leading-none font-black text-foreground/10 select-none sm:text-[12rem] md:text-[15rem]"
          >
            404
          </span>

          <div className="w-full max-w-xs shrink-0 md:max-w-sm">
            <Image
              src="/404.svg"
              alt=""
              width={525}
              height={418}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-start">
            <h1 className="font-heading text-4xl leading-tight font-black sm:text-5xl">
              Oops! Page not found
            </h1>
            <p className="max-w-md text-base leading-relaxed text-body-foreground md:text-lg">
              A disturbance in the force has caused this page to disappear.
            </p>
            <Button
              size="lg"
              className="mt-2"
              render={<Link href="/" />}
              nativeButton={false}
            >
              <HomeIcon data-icon="inline-start" />
              Go back home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default NotFoundContent
