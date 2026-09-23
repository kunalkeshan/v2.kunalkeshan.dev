# Portfolio command menu

The public site has a searchable command menu available from the navbar and with
`⌘K` on Apple keyboards or `Ctrl+K` on other desktop keyboards. Arrow keys move
through results, Enter selects, and Escape closes. On small screens, open it
with the search button in the navbar.

The menu includes the main portfolio pages, the contact FAQ anchor, and useful
actions: switch light/dark mode, copy the email address when configured, copy
the primary or secondary CSS variable, download the resume when configured, and
toggle the optional Rickroll audio. Email, resume, and audio actions are omitted
when their existing `siteConfig` values are missing. Individual project, blog,
and journal records are not indexed.

The UI lives in `apps/web/components/layouts/portfolio-command-menu.tsx` and
uses `cmdk` with the shared dialog and button primitives. The Rickroll playback
controller is shared by the menu and footer through
`apps/web/providers/rickroll-audio-provider.tsx`.
