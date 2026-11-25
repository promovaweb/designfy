/**
 * Section: the container of every top-level block of a page.
 *
 * Gives the block the shared width (df-container), gutters and vertical
 * rhythm (df-section), an optional header (title and lead) and an optional
 * tinted band. The heading level comes from `headingLevel`; there is no
 * label above the heading.
 *
 * Motion: none of its own. Wrap the children in Reveal, or pass
 * `reveal` to mark the header for the CSS reveal.
 */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

export interface SectionProps {
  children: ReactNode;
  /** Section heading. Rendered at `headingLevel`. */
  title?: ReactNode;
  /** One or two sentences under the heading. */
  lead?: ReactNode;
  /** Heading level of the title. Default 2. */
  headingLevel?: 2 | 3;
  /** Alignment of the header. Default "start". */
  align?: "start" | "center";
  /** Width of the content. "narrow" is the reading measure. Default "default". */
  width?: "narrow" | "default" | "wide";
  /** Surface of the band. "muted" tints the full-width band. Default "plain". */
  tone?: "plain" | "muted" | "card";
  /** Anchor id; the heading is linked to the section with aria-labelledby. */
  id?: string;
  /** Marks the header for the CSS reveal on scroll. Default true. */
  reveal?: boolean;
  /** Decorative layer rendered behind the content (a Background component). */
  background?: ReactNode;
  className?: string;
}

const WIDTH = { narrow: "max-w-3xl", default: "", wide: "max-w-none" } as const;
const TONE = { plain: "", muted: "bg-muted/60", card: "bg-card" } as const;

/** Wraps a page block with the shared container, rhythm and header. */
export function Section({
  children,
  title,
  lead,
  headingLevel = 2,
  align = "start",
  width = "default",
  tone = "plain",
  id,
  reveal = true,
  background,
  className,
}: SectionProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const headingId = id && title ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("relative isolate df-section", TONE[tone], className)}>
      {background ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {background}
        </div>
      ) : null}
      <div className={cn("df-container", WIDTH[width], width === "narrow" && "mx-auto")}>
        {title || lead ? (
          <header
            data-df-reveal={reveal ? "up" : undefined}
            className={cn("mb-10 flex flex-col gap-4 md:mb-14", align === "center" ? "items-center text-center" : "items-start")}
          >
            {title ? (
              <Heading id={headingId} className="max-w-[24ch] font-heading text-headline font-semibold text-foreground">
                {title}
              </Heading>
            ) : null}
            {lead ? <p className="max-w-[60ch] text-lead text-muted-foreground">{lead}</p> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}
