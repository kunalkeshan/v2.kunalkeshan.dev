"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

/**
 * Carousel primitive, adapted from shadcn/ui's Embla wrapper.
 *
 * Restyled for this repo's language rather than taken verbatim: the stock
 * component ships rounded-full `outline` arrow buttons, which here would render
 * with a 2px border and no hard shadow. The arrows below go through `Button`
 * so they inherit `pressableShadow` from its compound variants, and the focus
 * ring comes from `Button` too.
 *
 * Note on why this is Embla and not a hand-rolled index swap: every slide is a
 * persistent DOM node laid out side by side and moved with one CSS transform,
 * so a slide's `<img>` is never re-pointed at a new `src`. v1's testimonial
 * section re-rendered a single card with new props, which repainted the text
 * synchronously while the browser decoded the new avatar asynchronously — the
 * text changed and the photo arrived late. That failure mode cannot occur here.
 *
 * `packages/ui`'s no-motion-dependency rule is intact: Embla animates with CSS
 * transforms and is not a motion library.
 */

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Let a focused text input or textarea keep its own caret movement.
      const target = event.target as HTMLElement | null
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      } else if (event.key === "Home") {
        event.preventDefault()
        scrollTo(0)
      } else if (event.key === "End") {
        event.preventDefault()
        scrollTo(scrollSnaps.length - 1)
      }
    },
    [scrollPrev, scrollNext, scrollTo, scrollSnaps.length]
  )

  /**
   * Horizontal wheel input: shift+wheel on a mouse, and a two-finger
   * horizontal swipe on a trackpad.
   *
   * Embla handles pointer drag but ignores the wheel entirely, so without this
   * the natural "scroll sideways" gesture does nothing on a carousel that is
   * visibly horizontal. Registered natively rather than via onWheel because
   * React's wheel listener is passive, and a passive listener cannot
   * preventDefault the browser's own horizontal scroll.
   */
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = rootRef.current
    if (!node || !api) return

    /*
     * One gesture must advance exactly one slide.
     *
     * A trackpad flick is not one event: it emits a burst of wheel events for
     * up to ~1s as momentum decays. A simple time debounce is the wrong tool —
     * too short and the decaying tail triggers a second advance (the carousel
     * "skips" a slide), too long and a deliberate second swipe is swallowed.
     *
     * So gate on the gesture rather than the clock: fire once when a burst
     * starts, then stay locked until the wheel has been quiet for `restMs`,
     * which is what actually marks the end of a fling. Deltas that keep
     * shrinking are momentum; a genuine new swipe arrives after a rest, or as
     * a sharp re-acceleration.
     */
    const restMs = 140
    const threshold = 8
    let locked = false
    let restTimer: ReturnType<typeof setTimeout> | undefined
    let lastMagnitude = 0

    const onWheel = (event: WheelEvent) => {
      // shift+wheel maps the mouse's vertical wheel to horizontal intent;
      // otherwise only a genuinely horizontal gesture counts.
      const delta = event.shiftKey
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : 0

      if (!delta) return

      // Claim the gesture so the page doesn't also pan sideways.
      event.preventDefault()

      const magnitude = Math.abs(delta)

      // Re-arm once the burst has gone quiet.
      clearTimeout(restTimer)
      restTimer = setTimeout(() => {
        locked = false
        lastMagnitude = 0
      }, restMs)

      if (locked) {
        // A sharp re-acceleration mid-burst is a real second swipe, not
        // decaying momentum — momentum only ever gets weaker.
        if (magnitude > lastMagnitude * 2 && magnitude > threshold * 4) {
          locked = false
        } else {
          lastMagnitude = Math.max(lastMagnitude, magnitude)
          return
        }
      }

      if (magnitude < threshold) return

      locked = true
      lastMagnitude = magnitude
      if (delta > 0) api.scrollNext()
      else api.scrollPrev()
    }

    node.addEventListener("wheel", onWheel, { passive: false })
    return () => {
      clearTimeout(restTimer)
      node.removeEventListener("wheel", onWheel)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return

    // One named handler for both the initial read and `reInit`, so it can
    // actually be detached on cleanup — the upstream version registers an
    // inline arrow for `reInit` and only ever removes `select`, which leaks a
    // listener (and a setState on an unmounted tree) every time a carousel
    // remounts.
    const syncSnapshot = () => {
      setScrollSnaps(api.scrollSnapList())
      onSelect(api)
    }

    syncSnapshot()
    api.on("reInit", syncSnapshot)
    api.on("select", onSelect)

    return () => {
      api.off("reInit", syncSnapshot)
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        ref={rootRef}
        onKeyDownCapture={handleKeyDown}
        // Focusable so the arrow keys work after a click or Tab onto the
        // carousel itself, not only while a nav button happens to hold focus.
        // `group` lets descendants style against that focus.
        tabIndex={0}
        className={cn(
          "group relative",
          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
          className
        )}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({
  className,
  viewportClassName,
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * Classes for the Embla viewport (the element that clips slides).
   *
   * Defaults to `overflow-hidden`. Pass `overflow-visible` when slide content
   * deliberately overhangs its slide — a portrait bleeding out of its card, for
   * instance — and clip further out instead, on the section. The reference
   * design this language is modelled on does exactly that
   * (`slider-mask overflow-visible` inside an `overflow-hidden` section).
   */
  viewportClassName?: string
}) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-hidden", viewportClassName)}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn("rounded-md", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn("rounded-md", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
