// Registers every packages/ui component this page renders. Adding, removing,
// or renaming a component in packages/ui/src/components requires an update
// here — see docs/ui/style-guide.md and the Definition of Done in AGENTS.md.
//
// "auto-cva" entries render generically from the component's exported
// *VariantsConfig object (see e.g. buttonVariantsConfig in button.tsx) — only
// 4 of 31 components export one, since cva()'s returned function does not
// expose its own config at runtime. Every other component is a "demo-spec"
// entry: a small hand-written file in ./demo-specs that imports the real
// component and a matching copy-ready JSX snippet string.
export type CatalogEntry =
  | { name: string; kind: "auto-cva" }
  | { name: string; kind: "demo-spec" }

export const COMPONENT_CATALOG: CatalogEntry[] = [
  { name: "Accordion", kind: "demo-spec" },
  { name: "Avatar", kind: "demo-spec" },
  { name: "Badge", kind: "auto-cva" },
  { name: "Breadcrumb", kind: "demo-spec" },
  { name: "Button", kind: "auto-cva" },
  { name: "Card", kind: "demo-spec" },
  { name: "Carousel", kind: "demo-spec" },
  { name: "Checkbox", kind: "demo-spec" },
  { name: "Collapsible", kind: "demo-spec" },
  { name: "Combobox", kind: "demo-spec" },
  { name: "Container", kind: "demo-spec" },
  { name: "Dialog", kind: "demo-spec" },
  { name: "Empty", kind: "auto-cva" },
  { name: "Form", kind: "demo-spec" },
  { name: "Input", kind: "demo-spec" },
  { name: "Input Group", kind: "demo-spec" },
  { name: "Label", kind: "demo-spec" },
  { name: "Logo", kind: "demo-spec" },
  { name: "Marquee", kind: "demo-spec" },
  { name: "Navigation Menu", kind: "demo-spec" },
  { name: "Pagination", kind: "demo-spec" },
  { name: "Select", kind: "demo-spec" },
  { name: "Separator", kind: "demo-spec" },
  { name: "Sheet", kind: "demo-spec" },
  { name: "Sidebar", kind: "demo-spec" },
  { name: "Skeleton", kind: "demo-spec" },
  { name: "Sonner (Toast)", kind: "demo-spec" },
  { name: "Spinner", kind: "demo-spec" },
  { name: "Tabs", kind: "auto-cva" },
  { name: "Textarea", kind: "demo-spec" },
  { name: "Tooltip", kind: "demo-spec" },
]
