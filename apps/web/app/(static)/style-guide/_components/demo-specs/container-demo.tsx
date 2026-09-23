import { Container } from "@workspace/ui/components/container"

export const containerSnippet = `<Container>...</Container>`

export function ContainerDemo() {
  return (
    <div className="w-full border-2 border-dashed border-border bg-muted/30 py-4">
      <Container>
        <div className="rounded-md border-2 border-border bg-card p-3 text-center text-sm text-muted-foreground">
          max-w-7xl, centered, with side padding
        </div>
      </Container>
    </div>
  )
}
