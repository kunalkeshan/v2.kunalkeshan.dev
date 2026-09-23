"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { CopyButton } from "./copy-button"

const registryUrl = "https://v2-kunalkeshan-dev.vercel.app/r/{name}.json"
const registryConfig = JSON.stringify(
  { registries: { "@kunalkeshan": registryUrl } },
  null,
  2
)

const packageManagers = {
  pnpm: "pnpm dlx shadcn@latest",
  npm: "npx shadcn@latest",
  yarn: "yarn dlx shadcn@latest",
  bun: "bunx --bun shadcn@latest",
}

const commands = [
  {
    label: "Configure this registry",
    command: "registry add @kunalkeshan=" + registryUrl,
  },
  { label: "List components", command: "list @kunalkeshan" },
  { label: "Search components", command: "search @kunalkeshan --query button" },
  { label: "View a component", command: "view @kunalkeshan/button" },
  { label: "Install a component", command: "add @kunalkeshan/button" },
  {
    label: "Install by direct URL",
    command: "add https://v2-kunalkeshan-dev.vercel.app/r/button.json",
  },
]

function CommandList({ manager }: { manager: keyof typeof packageManagers }) {
  const baseCommand = packageManagers[manager]

  return (
    <div className="grid gap-3">
      {commands.map(({ label, command }) => {
        const value = `${baseCommand} ${command}`
        return (
          <div
            key={label}
            className="flex min-w-0 items-center justify-between gap-3 rounded-md border-2 border-border bg-background px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">
                {label}
              </p>
              <code className="block overflow-x-auto font-mono text-xs text-foreground">
                {value}
              </code>
            </div>
            <CopyButton value={value} label={label} />
          </div>
        )
      })}
    </div>
  )
}

export function RegistryGuide() {
  return (
    <section
      aria-labelledby="registry-guide-title"
      className="scroll-mt-32 space-y-5 rounded-lg border-3 border-border bg-muted/30 p-5 shadow-lg sm:p-6"
    >
      <div>
        <h2
          id="registry-guide-title"
          className="font-heading text-2xl font-black sm:text-3xl"
        >
          Use this registry
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-body-foreground">
          Add the registry namespace to your project, then use the shadcn CLI to
          browse and install components. The registry index is available at{" "}
          <a
            href="https://v2-kunalkeshan-dev.vercel.app/r/registry.json"
            className="font-mono underline underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            /r/registry.json
          </a>
          .
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-black">
          1. Configure components.json
        </h3>
        <p className="text-sm text-body-foreground">
          Add the registry URL template to the top-level `registries` object.
        </p>
        <div className="flex items-start justify-between gap-3 rounded-md border-2 border-border bg-background p-3">
          <pre className="min-w-0 overflow-x-auto font-mono text-xs leading-relaxed">
            <code>{registryConfig}</code>
          </pre>
          <CopyButton value={registryConfig} label="registry configuration" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-base font-black">
          2. Browse and install
        </h3>
        <p className="text-sm text-body-foreground">
          Choose your package manager. The same commands work with each CLI.
        </p>
        <Tabs defaultValue="pnpm" className="gap-4">
          <TabsList className="w-full flex-wrap sm:w-fit">
            {Object.keys(packageManagers).map((manager) => (
              <TabsTrigger key={manager} value={manager} className="capitalize">
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(packageManagers).map((manager) => (
            <TabsContent key={manager} value={manager}>
              <CommandList manager={manager as keyof typeof packageManagers} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
