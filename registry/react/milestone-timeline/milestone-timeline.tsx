/**
 * MilestoneTimeline: shows dated milestones or phases, their current position and outcomes.
 * Motion: sequential reveals and a one-time drawing of the connector.
 */
import { cn } from "@designfy/components/lib/cn";
import type { CSSProperties } from "react";

type Milestone = {
  title: string;
  description: string;
  label?: string;
  dateTime?: string;
  outcome?: string;
};

export interface MilestoneTimelineProps {
  /** Section heading. */
  title: string;
  /** Supporting paragraph. */
  lead?: string;
  /** Milestones in chronological order. Dates are supplied by the caller. */
  items: Milestone[];
  /** Zero-based index of the current milestone, when known. */
  currentIndex?: number;
  /** Text for the current milestone badge. */
  currentLabel?: string;
  /** Summary or next step beneath the timeline. */
  summary?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Additional classes on the section. */
  className?: string;
}

/** Renders an ordered schedule and the current milestone when one is known. */
export function MilestoneTimeline({
  title,
  lead,
  items,
  currentIndex,
  currentLabel = "Current",
  summary,
  headingLevel = 2,
  className,
}: MilestoneTimelineProps) {
  if (!items.length) return null;

  const Heading = `h${headingLevel}` as "h2";
  const ItemHeading = `h${Math.min(6, headingLevel + 1)}` as "h3";
  const columns = Math.min(items.length, 4);
  return (
    <section
      className={cn("df-section bg-muted/60 text-foreground", className)}
    >
      <div className="df-container">
        <header data-df-reveal="up" className="mb-10">
          <Heading className="font-heading text-headline font-semibold [overflow-wrap:anywhere]">
            {title}
          </Heading>
          {lead && (
            <p className="mt-4 max-w-prose text-lead text-muted-foreground">
              {lead}
            </p>
          )}
        </header>
        <ol
          role="list"
          data-df-stagger
          style={{ "--milestone-columns": columns } as CSSProperties}
          className="grid gap-y-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-7 lg:grid-cols-[repeat(var(--milestone-columns),minmax(0,1fr))]"
        >
          {items.map(
            ({ title, description, label, dateTime, outcome }, index) => (
              <li
                key={index}
                data-df-reveal="up"
                aria-current={index === currentIndex ? "step" : undefined}
                className="group relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 sm:grid-cols-1 supports-[grid-template-rows:subgrid]:sm:row-span-4 supports-[grid-template-rows:subgrid]:sm:grid-rows-subgrid supports-[grid-template-rows:subgrid]:sm:gap-y-0"
              >
                {index + 1 < items.length && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute start-5 top-5 h-[calc(100%+1.25rem)] w-px origin-top bg-primary/35 sm:hidden",
                      (index + 1) % columns !== 0 &&
                        "lg:block lg:h-px lg:w-[calc(100%+1.5rem)] lg:origin-left motion-safe:lg:[.js_.group:not([data-df-visible])_&]:scale-x-0 motion-safe:lg:transition-transform motion-safe:lg:duration-(--duration-slower) motion-safe:lg:ease-out-expo",
                    )}
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative row-span-3 row-start-1 grid size-10 place-items-center self-start rounded-full border border-primary/50 bg-background font-mono text-sm font-semibold text-primary sm:col-start-1 sm:row-span-1 sm:mb-3",
                    index === currentIndex &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="col-start-2 row-start-1 mb-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground sm:col-start-1 sm:row-start-2 empty:hidden">
                  {dateTime ? (
                    <time dateTime={dateTime}>{label ?? dateTime}</time>
                  ) : (
                    label && <span>{label}</span>
                  )}
                  {index === currentIndex && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium text-foreground">
                      {currentLabel}
                    </span>
                  )}
                </div>
                <ItemHeading className="col-start-2 row-start-2 font-heading text-title font-semibold [overflow-wrap:anywhere] sm:col-start-1 sm:row-start-3">
                  {title}
                </ItemHeading>
                <div className="col-start-2 row-start-3 mt-2 min-w-0 [overflow-wrap:anywhere] sm:col-start-1 sm:row-start-4">
                  <p className="text-muted-foreground">{description}</p>
                  {outcome && (
                    <p className="mt-3 border-s-2 border-primary/40 ps-3 text-sm font-medium">
                      {outcome}
                    </p>
                  )}
                </div>
              </li>
            ),
          )}
        </ol>
        {summary && (
          <p
            data-df-reveal="up"
            className="mt-9 rounded-xl border border-border bg-card px-6 py-5 font-medium text-card-foreground"
          >
            {summary}
          </p>
        )}
      </div>
    </section>
  );
}
