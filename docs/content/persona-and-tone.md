# Content persona: student → working professional + freelancer

## Why this doc exists

The previous version of this portfolio (`kunalkeshan.dev` v1) was written
while Kunal was an Electronics & Communication Engineering student at
SRMIST. Its copy reflects that throughout — the sitewide meta description
opened with "As a 3rd-year Electronics & Communication Engineering student at
SRMIST," the homepage bio said "presently in my final year," project
write-ups leaned on hackathon/student-org origin stories, and the resume even
listed the degree itself as a dated "experience" entry ("(Tentative)").

That's no longer true. Kunal is now a working software engineer who also
freelances independently. This site (`v2.kunalkeshan.dev`) is being built
from scratch with no page content yet — as pages and sections get written
with AI assistance, they must not reintroduce the old student framing.

## Current persona (factual, structural)

- Present tense: employed as a software engineer, **and** independently
  freelancing — both are concurrently true today.
- No "student," "pursuing my degree," "in my Nth year," "aspiring
  developer," or internship/opportunity-seeking language in any present-tense
  copy.
- College/education and the "how I got into code" origin story can still
  appear, but strictly as **past-tense backstory** — history, not present
  identity or a framing device for current work.
- There is no fixed hierarchy between the employee and freelancer identity —
  which one leads depends on the specific page/section being written. If
  it's unclear which should be foregrounded for a given piece of copy, ask.
- Do not invent or assume a specific job title, employer name, or freelance
  brand/business name. This doc stays generic on purpose — real specifics are
  supplied by Kunal when actual content is written.

## The mandatory workflow rule

Before writing or editing any page/section copy where student-era framing
could plausibly apply — hero/intro text, bio/about copy, meta descriptions,
experience/resume entries, project origin or motivation write-ups, values or
services section intros, and similar — **ask the user whether/how to frame
it**, referencing what's about to be written, rather than silently applying
a reframe. Never assume the professional/freelancer framing on your own
judgment alone; confirm it first.

## Confirmed framing decisions (asked and answered)

Recorded so the same questions don't get re-litigated on every new section.
These were confirmed by Kunal directly; treat them as settled defaults, but
still ask before extending them to a *new* kind of copy.

- **Home page About section** (`apps/web/components/sections/about.tsx`,
  seeded into `siteConfig`'s About group): framed as a working software
  engineer **who also takes on freelance/consulting work** — with **no
  employer name, no "Codelance Devs", and no job title beyond "software
  engineer."** Public sources conflict on the current employer and LinkedIn is
  login-walled, so naming one would mean asserting something unverified. His
  GitHub profile README is the canonical current self-description and
  deliberately names no employer either.
- **Two different "since" years, never conflated**: building for the web since
  **2021**; working professionally as an engineer since **2025**. Any
  experience count must be derived from 2021 and worded as *building*, never
  as years of employment. The home page keeps `BUILDING_SINCE` as a constant
  in `apps/web/app/(static)/page.tsx` and substitutes it into the CMS string's
  `{years}` placeholder server-side.
- **Dropped**: v1's "Biology student turned tech freak" bullet. It may return
  on a future detailed `/about` page, but not in home page copy.

## What is explicitly OUT of scope for this rule

This doc governs factual/life-stage framing (student vs. working
professional) — it is **not** a general tone/voice overhaul. The following
carry forward unchanged and should not be second-guessed under this rule:

- **Personal values language** (grit, discipline, consistency, focus,
  responsibility, continuous learning, etc.) — this is personal identity,
  not student-coded. Don't touch, hedge, or reframe it.
- **Kaomoji/emoji** in copy — still allowed, used sparingly as personality
  accents (not a running gimmick).
- **The Rickroll footer easter egg** — still allowed; it's hidden/opt-in and
  doesn't affect the primary professional presentation.
- **Light anime/pop-culture references** (playful placeholders, joke copy on
  things like a 404 page) — still allowed.
- **Meme-image tooltips on headings** — not addressed by this doc at all;
  that decision is deferred to Kunal separately.

## Old-site framing to avoid reintroducing (reference only, not templates)

These are verbatim examples from the old site of the pattern to avoid as
*present-tense* claims. They're included so the AI can recognize the pattern,
not to be reused or paraphrased into the new site:

- "As a 3rd-year Electronics & Communication Engineering student at
  SRMIST..." — old sitewide meta description.
- "I am an Electronics and Communication Engineering Student at SRMIST,
  presently in my final year." — old homepage bio.
- The B.Tech degree itself listed as a dated "experience" entry with an
  end date of "(Tentative)."
- "During my third year of college, I was inspired by..." and "As a student
  who took all my classes online, I struggled with..." — project
  motivation write-ups anchored in being a current student.
