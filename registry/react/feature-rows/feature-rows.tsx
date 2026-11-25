/**
 * FeatureRows: lists benefits in numbered rows, with an optional desktop sticky introduction.
 * Motion: staged reveals and a press response on optional links.
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  detail?: string;
  href?: string;
};

export interface FeatureRowsProps {
  /** Section heading. */
  title: string;
  /** Supporting paragraph in the introduction. */
  lead?: string;
  /** Features in reading order. */
  items: Feature[];
  /** Number of the first entry. */
  start?: number;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Keep the intro beside the rows on desktop. */
  layout?: "stacked" | "split";
  /** Optional content beneath the introduction. */
  introActions?: ReactNode;
  /** Additional classes on the section. */
  className?: string;
}

/** Presents features as aligned rows with an optional sticky introduction. */
export function FeatureRows({
  title,
  lead,
  items,
  start = 1,
  headingLevel = 2,
  layout = "stacked",
  introActions,
  className,
}: FeatureRowsProps) {
  if (!items.length) return null;

  const Heading = `h${headingLevel}` as "h2";
  const ItemHeading = `h${Math.min(6, headingLevel + 1)}` as "h3";
  const split = layout === "split";

  return (
    <section
      className={cn("df-section bg-background text-foreground", className)}
    >
      <div
        className={cn(
          "df-container grid items-start gap-10",
          split && "xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-14",
        )}
      >
        <header
          className={cn(
            "min-w-0",
            split && "xl:sticky xl:top-[calc(var(--header-height)+1rem)]",
          )}
        >
          <div data-df-reveal="up" className="focus-within:opacity-100!">
            <Heading className="font-heading text-headline font-semibold [overflow-wrap:anywhere]">
              {title}
            </Heading>
            {lead && (
              <p className="mt-4 max-w-prose text-lead text-muted-foreground">
                {lead}
              </p>
            )}
            {introActions && <div className="mt-6">{introActions}</div>}
          </div>
        </header>
        <ol
          start={start}
          role="list"
          className="min-w-0 divide-y divide-border rounded-2xl border border-border bg-card text-card-foreground"
          data-df-stagger
        >
          {items.map(({ title, description, detail, href }, index) => (
            <li
              key={index}
              data-df-reveal="up"
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 px-5 py-6 focus-within:opacity-100! sm:px-7 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-x-8"
            >
              <span
                aria-hidden="true"
                className="font-mono text-lg font-semibold text-primary"
              >
                {String(start + index).padStart(2, "0")}
              </span>
              <ItemHeading className="min-w-0 font-heading text-title font-semibold [overflow-wrap:anywhere]">
                {href ? (
                  <a
                    href={href}
                    className="df-press inline-flex min-h-11 items-center rounded-sm underline decoration-border underline-offset-4 hover:decoration-current"
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </ItemHeading>
              <div className="col-start-2 min-w-0 [overflow-wrap:anywhere] lg:col-start-3">
                <p>{description}</p>
                {detail && (
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
