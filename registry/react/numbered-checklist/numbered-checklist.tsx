/** Lists numbered inclusions with optional highlighted entries. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";

export interface NumberedChecklistProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** List entries with an optional visible highlight label. */
  items: { text: string; highlight?: string }[];
  /** Maximum number of columns. */
  columns?: 1 | 2;
  /** Additional root classes. */
  className?: string;
}

/** Lists numbered inclusions with optional highlighted entries. */
export function NumberedChecklist({
  title,
  headingLevel = 2,
  items,
  columns = 2,
  className,
}: NumberedChecklistProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section className={cn("@container space-y-6", className)}>
      <Heading className="font-heading text-title font-semibold tracking-tight">
        {title}
      </Heading>
      <ol
        role="list"
        className={cn("gap-x-8", columns === 2 && "@2xl:columns-2")}
      >
        {items.map((item, i) => (
          <li
            key={i}
            data-df-reveal="up"
            className={cn(
              "flex break-inside-avoid items-baseline gap-3 border-t py-4",
              item.highlight ? "border-primary" : "border-border",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-grid min-w-8 shrink-0 place-items-center rounded-md px-1 py-1 text-sm font-semibold tabular-nums",
                item.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              {item.highlight && (
                <strong className="me-2 text-primary">{item.highlight}</strong>
              )}
              {item.text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
