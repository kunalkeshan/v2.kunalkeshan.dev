import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

export const accordionSnippet = `<Accordion>
  <AccordionItem value="one">
    <AccordionTrigger>What is this?</AccordionTrigger>
    <AccordionContent>A neobrutalist accordion.</AccordionContent>
  </AccordionItem>
</Accordion>`

export function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem value="one">
        <AccordionTrigger>What is this?</AccordionTrigger>
        <AccordionContent>A neobrutalist accordion.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Does it open?</AccordionTrigger>
        <AccordionContent>Yes, one item at a time.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
