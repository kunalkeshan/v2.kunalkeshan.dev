import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The neobrutalist "press into shadow" interaction: rest state carries the
 * full offset shadow; hover nudges 2px toward it and shrinks the shadow;
 * active/disabled/loading fully collapse the offset and shadow to zero.
 * Apply only to solid/bordered controls — never ghost/link variants.
 */
export const pressableShadow =
  "shadow-[var(--shadow-base)] transition-[transform,box-shadow] duration-(--duration-press) ease-(--ease-snap) " +
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[var(--shadow-sm)] " +
  "active:translate-x-1 active:translate-y-1 active:shadow-none " +
  "disabled:translate-x-1 disabled:translate-y-1 disabled:shadow-none disabled:pointer-events-none disabled:opacity-60 " +
  "aria-disabled:translate-x-1 aria-disabled:translate-y-1 aria-disabled:shadow-none"
