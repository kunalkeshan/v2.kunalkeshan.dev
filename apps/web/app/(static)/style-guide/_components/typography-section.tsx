import {
  BODY_SPECIMENS,
  DISPLAY_SPECIMENS,
  HEADING_SPECIMENS,
  MONO_SPECIMENS,
  type TypeSpecimen,
} from "@/lib/style-guide/typography"
import { CopyButton } from "./copy-button"

function Specimen({ specimen }: { specimen: TypeSpecimen }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-border py-6 first:pt-0 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className={specimen.className}>{specimen.sample}</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {specimen.meta}
        </p>
      </div>
      <CopyButton value={specimen.className} label={specimen.label} />
    </div>
  )
}

export function TypographySection() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-heading text-xl font-black">Display</h3>
        <div className="mt-4">
          {DISPLAY_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} specimen={specimen} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-xl font-black">Headings</h3>
        <div className="mt-4">
          {HEADING_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} specimen={specimen} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-xl font-black">Body</h3>
        <div className="mt-4">
          {BODY_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} specimen={specimen} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-xl font-black">Mono</h3>
        <div className="mt-4">
          {MONO_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} specimen={specimen} />
          ))}
        </div>
      </div>
    </div>
  )
}
