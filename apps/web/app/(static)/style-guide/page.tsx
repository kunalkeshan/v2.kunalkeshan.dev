import type { Metadata } from "next"

import { Container } from "@workspace/ui/components/container"

import { HighlightText } from "@/components/highlight-text"
import { JsonLd } from "@/components/shared/json-ld"
import { getTokenGroups, BORDER_WIDTHS } from "@/lib/style-guide/tokens"
import { buildBreadcrumbListJsonLd, buildWebPageJsonLd } from "@/lib/structured-data"
import { ComponentsSection } from "./_components/components-section"
import { RegistryGuide } from "./_components/registry-guide"
import { StyleGuideLayout } from "./_components/style-guide-navigation"
import { TokenGrid } from "./_components/token-grid"
import { TypographySection } from "./_components/typography-section"

export const metadata: Metadata = {
  title: "Style Guide",
  description:
    "Colors, typography, shadows, and every component in this site's design system — rendered live from the real source.",
  alternates: { canonical: "/style-guide" },
}

export default function StyleGuidePage() {
  const [colors, shadows, radius] = getTokenGroups()

  return (
    <main className="pt-28 pb-16 md:pt-36 md:pb-24">
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Style Guide",
          description:
            "Colors, typography, shadows, and every component in this site's design system.",
          path: "/style-guide",
        })}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          { name: "Home", path: "/" },
          { name: "Style Guide", path: "/style-guide" },
        ])}
      />
      <Container>
        <StyleGuideLayout>
          <div className="space-y-16">
            <header id="overview" className="scroll-mt-32">
              <h1 className="font-heading text-4xl leading-tight font-black text-balance sm:text-5xl">
                The design system,{" "}
                <HighlightText variant="primary">rendered live</HighlightText>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body-foreground md:text-lg">
                Every color, shadow, radius, and component in{" "}
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">
                  @workspace/ui
                </code>
                , read from the real source rather than hand-copied — click any
                swatch or component to copy its token or usage snippet.
              </p>
            </header>

            <RegistryGuide />

            <section id="tokens" className="scroll-mt-32 space-y-16">
              <h2 className="font-heading text-2xl font-black sm:text-3xl">
                Tokens
              </h2>
              {colors ? <TokenGrid group={colors} kind="color" /> : null}

              <div className="space-y-4">
                <div>
                  <h3
                    id="typography"
                    className="scroll-mt-32 font-heading text-xl font-black"
                  >
                    Typography
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-body-foreground">
                    Nunito Sans (body) and Montserrat (headings), via{" "}
                    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
                      @workspace/ui/lib/fonts
                    </code>
                    .
                  </p>
                </div>
                <TypographySection />
              </div>

              {shadows ? <TokenGrid group={shadows} kind="shadow" /> : null}
              {radius ? <TokenGrid group={radius} kind="radius" /> : null}

              <div className="space-y-4">
                <div>
                  <h3
                    id="border-widths"
                    className="scroll-mt-32 font-heading text-xl font-black"
                  >
                    Border widths
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-body-foreground">
                    Bare <code className="font-mono">border</code> resolves to
                    2px for controls; containers use the explicit{" "}
                    <code className="font-mono">border-3</code>.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {BORDER_WIDTHS.map((width) => (
                    <div
                      key={width.className}
                      className="flex flex-col gap-3 rounded-lg border-3 border-border bg-card p-4"
                    >
                      <div className="flex h-16 items-center justify-center">
                        <span
                          className={`size-12 rounded-md border-border bg-background ${width.className}`}
                        />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-black">
                          {width.label}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {width.className}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {width.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="components" className="scroll-mt-32 space-y-4">
              <div>
                <h2 className="font-heading text-2xl font-black sm:text-3xl">
                  Components
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-body-foreground">
                  Every component in{" "}
                  <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
                    packages/ui/src/components
                  </code>
                  , with its variants where it has them.
                </p>
              </div>
              <ComponentsSection />
            </section>
          </div>
        </StyleGuideLayout>
      </Container>
    </main>
  )
}
