/** Shared terminal-cell spacing for the shell, cards and screen layouts. */
import type { Layout } from "./screen.ts";

const roomy = { pageX: 3, pageY: 1, cardPadX: 1, cardPadY: 0, gapX: 2, gapY: 1, labelGap: 3 } as const;
const compact = { pageX: 1, pageY: 0, cardPadX: 1, cardPadY: 0, gapX: 1, gapY: 0, labelGap: 2 } as const;

/** Width thresholds shared by the shell and visual components. */
export const MEDIUM_WIDTH = 80;
export const WIDE_WIDTH = 110;
export const SHORT_HEIGHT = 32;

/** Chooses the layout class from the terminal width. */
export function widthLayout(width: number): Layout {
  return width >= WIDE_WIDTH ? "wide" : width >= MEDIUM_WIDTH ? "medium" : "compact";
}

/** Returns the spacing tokens for the current terminal width class. */
export function spacing(layout: Layout) {
  return layout === "compact" ? compact : roomy;
}

/** Resolves component spacing from a renderer's current width. */
export function spacingFor(width: number) {
  return spacing(widthLayout(width));
}

/** Fixed spacing for inline controls and modal content. */
export const controlSpacing = { gap: 2, modalX: 2, modalY: 1 } as const;
