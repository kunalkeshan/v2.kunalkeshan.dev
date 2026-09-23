import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const cardSnippet = `<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description.</CardDescription>
  </CardHeader>
  <CardContent>Card content.</CardContent>
</Card>`

export function CardDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>size=&quot;default&quot;</CardDescription>
        </CardHeader>
        <CardContent>Card content.</CardContent>
      </Card>
      <Card size="sm" className="w-64">
        <CardHeader>
          <CardTitle>Small</CardTitle>
          <CardDescription>size=&quot;sm&quot;</CardDescription>
        </CardHeader>
        <CardContent>Card content.</CardContent>
      </Card>
    </div>
  )
}
