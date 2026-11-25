/** Groups short outcomes into responsive icon tiles. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

export interface OutcomeGridProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Outcomes with decorative icons (named slots in Astro). */
  items: { text: string; icon: ReactNode }[];
  /** Closing paragraph beneath the tiles. */
  closing?: string;
  /** Additional root classes. */
  className?: string;
}

/** Groups short outcomes into responsive icon tiles. */
export function OutcomeGrid({
  title,
  headingLevel = 2,
  items,
  closing,
  className,
}: OutcomeGridProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section className={cn("@container space-y-6", className)}>
      <Heading className="font-heading text-title font-semibold tracking-tight">
        {title}
      </Heading>
      <ul
        role="list"
        data-df-stagger
        className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5"
      >
        {items.map((item, i) => (
          <li
            key={i}
            data-df-reveal="up"
            className="min-w-0 space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <span
              aria-hidden="true"
              className="block text-xl text-primary [&_svg]:size-5"
            >
              {item.icon}
            </span>
            <p className="break-words font-medium">{item.text}</p>
          </li>
        ))}
      </ul>
      {closing && <p className="df-measure text-muted-foreground">{closing}</p>}
    </section>
  );
}
