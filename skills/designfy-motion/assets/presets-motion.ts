/**
 * Motion presets for motion/react that mirror the Designfy theme tokens.
 *
 * CSS reads the tokens directly; JavaScript animations need the numbers.
 * Keep these values equal to designfy-theme.css (--duration-*, --ease-*,
 * --stagger, --reveal-distance). Durations are in seconds.
 */
import type { Transition, Variants } from "motion/react";

/** Durations, equal to --duration-* in the theme. */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  base: 0.25,
  slow: 0.5,
  slower: 0.8,
} as const;

/** Cubic bezier curves, equal to --ease-* in the theme. */
export const ease = {
  outQuart: [0.25, 1, 0.5, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inQuart: [0.5, 0, 0.75, 0],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

/** Seconds between siblings of a staggered sequence (--stagger). */
export const stagger = 0.06;

/** Pixels an element travels when it enters (--reveal-distance). */
export const distance = 16;

/** Transitions by purpose. */
export const transition = {
  /** Hover, press and color changes. */
  response: { duration: duration.fast, ease: ease.outQuart },
  /** Open and close, tabs, menus. */
  change: { duration: duration.base, ease: ease.outQuart },
  /** Entrances and reveals. */
  arrival: { duration: duration.slow, ease: ease.outExpo },
  /** Large visuals and masks. */
  showcase: { duration: duration.slower, ease: ease.outExpo },
  /** Exits: shorter, accelerating out. */
  exit: { duration: duration.fast, ease: ease.inQuart },
  /** Shared-element and layout moves: a spring with no bounce. */
  layout: { type: "spring", duration: 0.35, bounce: 0 },
} satisfies Record<string, Transition>;

/** Entrance variants. Use with initial="hidden" and whileInView="shown". */
export const reveal = {
  up: { hidden: { opacity: 0, y: distance }, shown: { opacity: 1, y: 0, transition: transition.arrival } },
  down: { hidden: { opacity: 0, y: -distance }, shown: { opacity: 1, y: 0, transition: transition.arrival } },
  left: { hidden: { opacity: 0, x: -distance * 1.5 }, shown: { opacity: 1, x: 0, transition: transition.arrival } },
  right: { hidden: { opacity: 0, x: distance * 1.5 }, shown: { opacity: 1, x: 0, transition: transition.arrival } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, shown: { opacity: 1, scale: 1, transition: transition.arrival } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1, transition: transition.arrival } },
} satisfies Record<string, Variants>;

/** Parent variants that stagger children using the same state names. */
export function sequence(delayChildren = 0, each = stagger): Variants {
  return { hidden: {}, shown: { transition: { staggerChildren: each, delayChildren } } };
}

/** Presence variants for elements that enter and leave the DOM. */
export const presence = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: transition.change },
    exit: { opacity: 0, transition: transition.exit },
  },
  pop: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: transition.change },
    exit: { opacity: 0, scale: 0.98, transition: transition.exit },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: transition.change },
    exit: { opacity: 0, y: 4, transition: transition.exit },
  },
  drawerRight: {
    initial: { x: "100%" },
    animate: { x: 0, transition: { duration: 0.3, ease: ease.outExpo } },
    exit: { x: "100%", transition: { duration: 0.2, ease: ease.inQuart } },
  },
} as const;

/** Viewport options for reveals: once, when 20% is visible. */
export const viewport = { once: true, amount: 0.2 } as const;
