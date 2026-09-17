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
- **The resume/experience surface is exempt from the no-employer rule.** The
  "no employer name, no job title beyond 'software engineer'" decision above is
  scoped to the **About blurb**, where naming an employer would have meant
  asserting something unverified. A resume section's entire purpose is naming
  where the work happened, so `experience` documents and the `/resume` page
  carry real employer names, real titles, dates, and locations. Sourced from
  Kunal's own master CV (`~/Desktop/kunalkeshan/resume/master-resume.md`) and
  his LinkedIn, so nothing here is inferred. This does **not** loosen the About
  section, which keeps its existing framing.
- **Testimonials are quoted material and are never edited (asked and answered).**
  A `testimonial`'s `quote` is a third party's own words. It is the one copy
  field in this dataset that the student → professional rule above does **not**
  apply to: quotes are migrated from v1's `data/tributes.ts` verbatim, and are
  never reworded, tightened, condensed, or reframed — not for tone, not for
  grammar, not for student-era framing. Only whitespace was normalised on
  migration (v1 stored several as template literals whose continuation lines
  carried source indentation); the words are byte-identical.

  Three migrated quotes mention student life — Yakub Mathew, GS Thina ("working
  with students", "a typical college student"), and Raman Shekhawat ("started
  college life"). These were reviewed with Kunal and **deliberately kept as
  written**: GS Thina's is a founder favourably contrasting Kunal against a
  student, and Raman's is past-tense backstory about how they met, which this
  document already permits. The `featured` boolean is the only lever for a quote
  that shouldn't lead the home page — never an edit to the text.

  **Attribution follows the resume exemption, not the About restriction.** A
  testimonial's credibility rests entirely on who said it, so the card shows the
  person's real name, position, employer, and company logo. Same reasoning as
  the resume bullet above; likewise it does not loosen the About section.
- **Club and community roles are written in a working-professional voice.**
  The underlying LinkedIn/CV bullets for the student-era club roles (IEEE
  SRMIST, Think-Digital, SRMpedia, CodeChef) were written at the time and read
  as student copy. They are reframed to describe the work and its outcomes
  (mentoring, leading a domain, shipping an internal platform) rather than the
  learning-in-progress framing. The roles themselves stay on the page as past
  history; they are ordered below the professional roles.
- **The `/about` page origin arc (asked and answered).** The detailed `/about` page
  is where the "Dropped" bullet above was cashed in: it tells the
  biology-expectation → ECE → web-development arc, but **present-tense work comes
  first and the backstory follows**, so the page opens on who Kunal is now rather
  than on where he studied. Every backstory sentence is past tense ("I chose",
  "I wrote", "I spent"). The family-of-doctors and biology details were explicitly
  approved. A third paragraph closes the arc forward — the PYNQ Z-series interface
  work and the resulting IEEE RAEEUCCI 2025 paper — framed as *still shapes what I
  find interesting, just isn't what I do every day*, so the electronics background
  reads as a live thread rather than nostalgia. Both facts were confirmed by Kunal
  directly, not inferred. The opening paragraph is near-verbatim from his GitHub
  profile README, and still names **no employer and no title beyond "software
  engineer"** — the About-blurb rule above holds on this page too.
- **The six values are ported verbatim from v1** (`data/values.ts`) into the `value`
  document type. They are covered by the "personal values language" exemption below —
  no rewording was applied, including to the noticeably longer Discipline entry.
- **Education is never a dated row in the work timeline.** It lives in its own
  block on `/resume`, via the `experience` schema's `kind` field. v1 listed the
  B.Tech as an experience entry ending "(Tentative)" — the anti-pattern this
  doc opens with. The correct end date is **May 2025** (CGPA 8.65), not v1's
  "July 2024 (Tentative)".

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
