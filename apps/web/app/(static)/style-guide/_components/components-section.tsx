import { AccordionDemo } from "./demo-specs/accordion-demo"
import { AvatarDemo } from "./demo-specs/avatar-demo"
import { BreadcrumbDemo } from "./demo-specs/breadcrumb-demo"
import { CardDemo } from "./demo-specs/card-demo"
import { CarouselDemo } from "./demo-specs/carousel-demo"
import { CheckboxDemo } from "./demo-specs/checkbox-demo"
import { ComboboxDemo } from "./demo-specs/combobox-demo"
import { ContainerDemo } from "./demo-specs/container-demo"
import { DialogDemo } from "./demo-specs/dialog-demo"
import { FormDemo } from "./demo-specs/form-demo"
import { InputDemo } from "./demo-specs/input-demo"
import { InputGroupDemo } from "./demo-specs/input-group-demo"
import { LabelDemo } from "./demo-specs/label-demo"
import { LogoDemo } from "./demo-specs/logo-demo"
import { MarqueeDemo } from "./demo-specs/marquee-demo"
import { NavigationMenuDemo } from "./demo-specs/navigation-menu-demo"
import { PaginationDemo } from "./demo-specs/pagination-demo"
import { SelectDemo } from "./demo-specs/select-demo"
import { SeparatorDemo } from "./demo-specs/separator-demo"
import { SheetDemo } from "./demo-specs/sheet-demo"
import { SkeletonDemo } from "./demo-specs/skeleton-demo"
import { SonnerDemo } from "./demo-specs/sonner-demo"
import { SpinnerDemo } from "./demo-specs/spinner-demo"
import { TextareaDemo } from "./demo-specs/textarea-demo"
import { TooltipDemo } from "./demo-specs/tooltip-demo"

import { ButtonDemo } from "./auto-cva/button-demo"
import { BadgeDemo } from "./auto-cva/badge-demo"
import { EmptyDemo } from "./auto-cva/empty-demo"
import { TabsDemo } from "./auto-cva/tabs-demo"

import { COMPONENT_CATALOG } from "./component-catalog"
import { ComponentSection } from "./component-section"

// One entry per COMPONENT_CATALOG name — kept as an explicit map rather than
// a dynamic import-by-string so every demo stays a normal statically
// analyzable import (tree-shaking, type-checking, "go to definition" all
// keep working). Adding a component means adding one line here AND one
// entry in component-catalog.ts.
const DEMOS: Record<string, React.ReactNode> = {
  Accordion: <AccordionDemo />,
  Avatar: <AvatarDemo />,
  Badge: <BadgeDemo />,
  Breadcrumb: <BreadcrumbDemo />,
  Button: <ButtonDemo />,
  Card: <CardDemo />,
  Carousel: <CarouselDemo />,
  Checkbox: <CheckboxDemo />,
  Combobox: <ComboboxDemo />,
  Container: <ContainerDemo />,
  Dialog: <DialogDemo />,
  Empty: <EmptyDemo />,
  Form: <FormDemo />,
  Input: <InputDemo />,
  "Input Group": <InputGroupDemo />,
  Label: <LabelDemo />,
  Logo: <LogoDemo />,
  Marquee: <MarqueeDemo />,
  "Navigation Menu": <NavigationMenuDemo />,
  Pagination: <PaginationDemo />,
  Select: <SelectDemo />,
  Separator: <SeparatorDemo />,
  Sheet: <SheetDemo />,
  Skeleton: <SkeletonDemo />,
  "Sonner (Toast)": <SonnerDemo />,
  Spinner: <SpinnerDemo />,
  Tabs: <TabsDemo />,
  Textarea: <TextareaDemo />,
  Tooltip: <TooltipDemo />,
}

export function ComponentsSection() {
  return (
    <div className="space-y-10">
      {COMPONENT_CATALOG.map((entry) => (
        <ComponentSection key={entry.name} name={entry.name}>
          {DEMOS[entry.name]}
        </ComponentSection>
      ))}
    </div>
  )
}
