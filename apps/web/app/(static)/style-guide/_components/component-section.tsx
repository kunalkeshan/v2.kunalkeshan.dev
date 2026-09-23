interface ComponentSectionProps {
  name: string
  children: React.ReactNode
}

export function ComponentSection({ name, children }: ComponentSectionProps) {
  return (
    <div
      id={name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
      className="scroll-mt-32 space-y-4 border-b-2 border-border pb-10 last:border-b-0"
    >
      <h3 className="font-heading text-xl font-black">{name}</h3>
      <div className="rounded-lg border-3 border-border bg-muted/30 p-6">
        {children}
      </div>
    </div>
  )
}
