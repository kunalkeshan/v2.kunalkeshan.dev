import type { CSSProperties } from "react";
import { pixelBasedPreset } from "react-email";

import { emailColors } from "./colors";

/**
 * Tailwind config passed to react-email's `<Tailwind>` wrapper.
 *
 * `pixelBasedPreset` converts rem-based utilities to px, since most mail
 * clients ignore the root font size Tailwind's rem values depend on.
 */
export const emailTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        background: emailColors.background,
        foreground: emailColors.foreground,
        card: emailColors.card,
        primary: emailColors.primary,
        "primary-foreground": emailColors.primaryForeground,
        secondary: emailColors.secondary,
        "secondary-foreground": emailColors.secondaryForeground,
        muted: emailColors.muted,
        "muted-foreground": emailColors.mutedForeground,
        border: emailColors.border,
        "body-foreground": emailColors.bodyForeground,
      },
      borderRadius: {
        mail: "10px",
      },
    },
  },
} satisfies Record<string, unknown>;

export const colorSchemeMetaStyle: CSSProperties = { display: "none" };
