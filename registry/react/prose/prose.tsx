/**
 * Prose: the wrapper of long-form text.
 *
 * Applies @tailwindcss/typography with the theme roles (through
 * designfy-prose.css), a 68ch measure and a 1.7 line height. It owns no
 * structure of its own: headings, lists, quotes, tables, code and figures
 * arrive as children and keep their own components inside.
 *
 * Motion: none in the text. Anchors scroll smoothly through the theme and the
 * targeted heading flashes once.
 *
 * Catalog: prose
 */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

const SIZE = {
  default: "prose-sm sm:prose-base",
  lg: "prose-base sm:prose-lg",
  compact: "prose-sm",
} as const;

export interface ProseProps {
  /** The article body: paragraphs, headings, lists, tables, figures. */
  children: ReactNode;
  /** Type size. "lg" reads essays, "compact" reads reference docs. Default "default". */
  size?: "default" | "lg" | "compact";
  /** HTML tag of the wrapper. Default "div". */
  as?: "div" | "article" | "section";
  className?: string;
}

/** Sets long-form text with the shared measure and rhythm. */
export function Prose({ children, size = "default", as = "div", className }: ProseProps) {
  const Tag = as;
  return <Tag className={cn("prose df-prose df-measure min-w-0", SIZE[size], className)}>{children}</Tag>;
}
