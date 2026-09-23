"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariantsConfig,
} from "@workspace/ui/components/tabs"

import { VariantGrid } from "../variant-grid"

export function TabsDemo() {
  return (
    <VariantGrid
      variants={tabsListVariantsConfig.variants}
      caption={(props) => `<TabsList variant="${props.variant}" />`}
      snippet={(props) =>
        `<Tabs defaultValue="one">\n  <TabsList variant="${props.variant}">\n    <TabsTrigger value="one">One</TabsTrigger>\n    <TabsTrigger value="two">Two</TabsTrigger>\n  </TabsList>\n  <TabsContent value="one">One</TabsContent>\n  <TabsContent value="two">Two</TabsContent>\n</Tabs>`
      }
      render={(props) => (
        <Tabs defaultValue="one" className="w-full">
          <TabsList
            variant={
              props.variant as keyof typeof tabsListVariantsConfig.variants.variant
            }
          >
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
          <TabsContent value="two">Two</TabsContent>
        </Tabs>
      )}
    />
  )
}
