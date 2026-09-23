import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { CarouselDots } from "@workspace/ui/components/carousel-dots"

export const carouselSnippet = `<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <div className="mt-4 flex items-center justify-between">
    <CarouselDots label="Go to slide" />
    <div className="flex gap-2">
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </div>
</Carousel>`


const SLIDES = ["Slide one", "Slide two", "Slide three"]

// Needs at least 2 slides — CarouselDots renders null with fewer than 2
// scroll snaps (see packages/ui/src/components/carousel-dots.tsx).
export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-32 items-center justify-center rounded-lg border-3 border-border bg-card font-heading text-lg font-black">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex items-center justify-between">
        <CarouselDots label="Go to slide" />
        <div className="flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  )
}
