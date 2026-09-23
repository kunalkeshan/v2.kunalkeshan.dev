import { Logo } from "@workspace/ui/components/logo"

export const logoSnippet = `<Logo size="md" />`

export function LogoDemo() {
  return (
    <div className="flex items-center gap-4">
      <Logo size="sm" href="#style-guide" />
      <Logo size="md" href="#style-guide" />
      <Logo size="lg" href="#style-guide" />
    </div>
  )
}
