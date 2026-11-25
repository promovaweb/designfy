/**
 * StatsBand: Displays large metrics, with labels and optional sources, in a definition list.
 * Motion: Numbers count as the band comes into view.
 * Catalog: stats-band
 */
import { cn } from "@designfy/components/lib/cn";
import { Counter } from "@designfy/components/counter/counter";

type Action = { label: string; href: string };
type Metric = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  source?: Action;
  locale?: string;
};

export interface StatsBandProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** A list of two to four verified metrics. */
  items: Metric[];
  /** Layout and dividers on larger screens. */
  variant?: "inline" | "divided";
  /** Additional classes on the root element. */
  className?: string;
}

/** Displays large metrics, with labels and optional sources, in a definition list. */
export function StatsBand({
  title,
  lead,
  headingLevel = 2,
  items,
  variant = "divided",
  className,
}: StatsBandProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section className={cn("df-section border-y border-border", className)}>
      <div className="df-container">
        <header data-df-reveal="up" className="mb-10 md:mb-14">
          <Heading className="font-heading text-headline font-semibold">
            {title}
          </Heading>
          {lead && (
            <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
              {lead}
            </p>
          )}
        </header>
        <dl
          data-df-stagger
          className={cn(
            "grid grid-cols-2 gap-x-4 gap-y-8",
            variant === "inline"
              ? "md:flex md:flex-wrap md:gap-14"
              : "md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]",
          )}
        >
          {items.map((metric) => (
            <div
              key={metric.label}
              data-df-reveal="up"
              className={cn(
                "flex min-w-0 flex-col-reverse justify-end gap-2",
                variant === "divided" && "border-s border-border ps-4 md:ps-6",
              )}
            >
              <dt className="min-w-0 break-words text-sm font-medium text-muted-foreground">
                {metric.label}
                {metric.source && (
                  <a
                    href={metric.source.href}
                    className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline block w-fit"
                  >
                    {metric.source.label}
                  </a>
                )}
              </dt>
              <dd className="min-w-0 break-words text-headline font-semibold text-primary">
                <Counter
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  locale={metric.locale}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
