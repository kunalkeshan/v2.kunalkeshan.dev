import { Marquee } from "@workspace/ui/components/marquee"
import type { FEATURED_SKILLS_QUERY_RESULT } from "@workspace/sanity/types"

interface SkillsMarqueeProps {
  skills: FEATURED_SKILLS_QUERY_RESULT
}

/**
 * The rotated band of technologies on /about.
 *
 * A Server Component on purpose — `<Marquee>` is CSS-only, so nothing here needs
 * to reach the client bundle.
 *
 * Ported from kunalkeshan.dev v1's `SkillsInText`, which mixed skills with
 * identity words ("Creator", "Leader"). This reads from the same
 * `FEATURED_SKILLS_QUERY` the home page uses, so the list is curated by toggling
 * `featured` in the Studio and the two surfaces can never drift apart.
 *
 * Text-only, though the query does carry `icon`: two dozen icons scrolling on a
 * rotated dark band is noise, and it would add that many image requests for
 * decoration. v1's per-item `title` tooltip is also dropped — it duplicated the
 * visible text, and it existed to compensate for clipping this version doesn't
 * have.
 */
export function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  if (!skills || skills.length === 0) return null

  return (
    // `overflow-x-clip`, NOT `overflow-hidden`: the latter creates a scroll
    // container, which would break the `lg:sticky` portrait in the story
    // section directly above this one.
    <section
      aria-label="Technologies I work with"
      className="w-full overflow-x-clip py-10 md:py-16"
    >
      {/*
        The band is the page's single `.on-inverted` surface (one per page is
        the working limit). It sits on the rotated wrapper rather than the outer
        section so the dark panel reads as laid over the page, rather than the
        page itself tilting.

        `w-[120%]` with a centered `-translate-x-[10%]` covers the triangular
        corner gaps the -8deg rotation would otherwise expose. v1 used a fixed
        `-translate-x-16`, which isn't centered and under-covers on wide
        viewports. Rotation stays here and never on the animated track inside —
        Tailwind v4 emits `rotate` separately from `transform`, and the track's
        keyframe owns `transform`.
      */}
      <div className="on-inverted w-[120%] -translate-x-[10%] -rotate-[8deg] border-y-3 border-border py-6 md:py-8">
        <Marquee
          durationSeconds={40}
          className="[--marquee-gap:3rem] md:[--marquee-gap:5rem]"
        >
          {skills.map((skill) => (
            <span key={skill._id} className="flex shrink-0 items-center gap-3">
              <span className="font-heading text-lg font-bold whitespace-nowrap md:text-2xl">
                {skill.name}
              </span>
              <span aria-hidden="true" className="text-primary">
                •
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default SkillsMarquee
