import { Marquee } from "@workspace/ui/components/marquee"

export const marqueeSnippet = `<Marquee aria-label="Skills" durationSeconds={20}>
  <span className="font-heading text-2xl font-black">TypeScript</span>
  <span className="font-heading text-2xl font-black">React</span>
  <span className="font-heading text-2xl font-black">Next.js</span>
</Marquee>`

const ITEMS = ["TypeScript", "React", "Next.js", "Node.js", "Sanity"]

export function MarqueeDemo() {
  return (
    <Marquee aria-label="Example skills" durationSeconds={20}>
      {ITEMS.map((item) => (
        <span key={item} className="font-heading text-2xl font-black">
          {item}
        </span>
      ))}
    </Marquee>
  )
}
