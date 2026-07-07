# Font Stack

Fonts are defined once, in `packages/ui/src/lib/fonts.ts`:

```ts
export const fontSans = Nunito_Sans({ variable: "--font-sans", ... });
export const fontSerif = Montserrat({ variable: "--font-serif", ... });
export const fontMono = Space_Mono({ variable: "--font-mono", ... });

export const rootBodyClassName = `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased`;
```

Consumers import `rootBodyClassName` and apply it to the root `<html>` element — never load `next/font/google` directly inside an app's `layout.tsx`:

```tsx
// apps/web/app/layout.tsx
import { rootBodyClassName } from "@workspace/ui/lib/fonts";

<html lang="en" suppressHydrationWarning className={rootBodyClassName}>
```

## Why

- One source of truth for typography across every app in this monorepo, present or future.
- Matches the convention already used in sibling repos (e.g. `merchantbanker.in`'s `packages/ui/src/lib/fonts.ts`), so switching between projects doesn't require relearning where fonts live.
- `packages/ui`'s `exports` map already has a generic `"./lib/*": "./src/lib/*.ts"` glob, so no export-map change is needed when adding new files under `src/lib/`.

## Adding or changing a font

Edit `packages/ui/src/lib/fonts.ts` directly, then update the CSS variable references in `packages/ui/src/styles/globals.css` (`--font-sans`, `--font-serif`, `--font-mono` under `:root`/`@theme inline`) if the variable names change. No changes needed in consuming apps unless `rootBodyClassName`'s shape changes.
