/** Pairs criteria for a good fit with criteria for a poor fit. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";

type Criteria = { title: string; items: string[] };
export interface AudienceFitProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Criteria for each side, with explicit group headings. */
  fits: Criteria;
  /** Criteria that indicate a poor fit. */
  excludes: Criteria;
  /** Optional note below both cards. */
  note?: string;
  /** Additional root classes. */
  className?: string;
}

/** Pairs criteria for a good fit with criteria for a poor fit. */
export function AudienceFit({
  title,
  headingLevel = 2,
  fits,
  excludes,
  note,
  className,
}: AudienceFitProps) {
  const Heading = `h${headingLevel}` as "h2";
  const Subheading = `h${Math.min(6, headingLevel + 1)}` as "h3";
  return (
    <section className={cn("@container space-y-6", className)}>
      <Heading className="font-heading text-title font-semibold tracking-tight">
        {title}
      </Heading>
      <div data-df-stagger className="grid gap-4 @2xl:grid-cols-2">
        {[fits, excludes].map((group, i) => (
          <article
            key={i}
            data-df-reveal="up"
            className={cn(
              "rounded-2xl border bg-card p-6 text-card-foreground",
              i === 0 ? "border-primary/50" : "border-border",
            )}
          >
            <Subheading className="font-heading text-xl font-semibold">
              {group.title}
            </Subheading>
            <ul role="list" className="mt-5 space-y-3">
              {group.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={
                      i === 0 ? "text-primary" : "text-muted-foreground"
                    }
                  >
                    {i === 0 ? "✓" : "×"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {note && <p className="df-measure text-muted-foreground">{note}</p>}
    </section>
  );
}
