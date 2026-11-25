/** Pairs a two-tone statement with stat notes. Follow with milestone-timeline for a dated rail. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";

export interface StatementStatsProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Emphasized second line. */
  emphasis: string;
  /** Values with their explanations. */
  stats: { value: string; description: string }[];
  /** Use the dark theme locally by default. */
  dark?: boolean;
  /** Additional root classes. */
  className?: string;
}

/** Pairs a two-tone statement with stat notes. Follow with milestone-timeline for a dated rail. */
export function StatementStats({
  title,
  headingLevel = 2,
  emphasis,
  stats,
  dark = true,
  className,
}: StatementStatsProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section
      className={cn(
        "@container rounded-2xl bg-background p-6 text-foreground sm:p-10",
        dark && "dark",
        className,
      )}
    >
      <div className="grid items-start gap-8 @3xl:grid-cols-[3fr_2fr]">
        <Heading
          data-df-reveal="up"
          className="font-heading text-headline font-semibold tracking-tight"
        >
          {title} <strong className="block text-primary">{emphasis}</strong>
        </Heading>
        <dl data-df-stagger className="divide-y divide-border">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-df-reveal="up"
              className="grid gap-2 py-4 first:pt-0"
            >
              <dt className="text-title font-semibold">{stat.value}</dt>
              <dd className="text-muted-foreground">{stat.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
