/**
 * ComparisonTable: Compares grouped features in an accessible table with localized horizontal scrolling.
 * Motion: The table reveals on scroll and highlights the active row on hover.
 * Catalog: comparison-table
 */
import { cn } from "@designfy/components/lib/cn";

type Group = {
  title: string;
  rows: Array<{ feature: string; cells: Array<string | boolean> }>;
};

export interface ComparisonTableProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Column headings for the options being compared. */
  options: string[];
  /** Feature groups; each row follows the options order. */
  groups: Group[];
  /** Header for the feature column. */
  featureLabel?: string;
  /** Text for included boolean cells. */
  includedLabel?: string;
  /** Text for excluded boolean cells. */
  excludedLabel?: string;
  /** Keep the header visible in the scroll region. */
  stickyHeader?: boolean;
  /** Keep the first column visible while scrolling. */
  stickyFirstColumn?: boolean;
  /** Additional classes on the root element. */
  className?: string;
}

/** Compares grouped features in an accessible table with localized horizontal scrolling. */
export function ComparisonTable({
  title,
  lead,
  headingLevel = 2,
  options,
  groups,
  featureLabel = "Feature",
  includedLabel = "Included",
  excludedLabel = "Not included",
  stickyHeader = true,
  stickyFirstColumn = true,
  className,
}: ComparisonTableProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section className={cn("df-section border-t border-border", className)}>
      <div className="df-container @container">
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
        <div
          data-df-reveal="up"
          role="region"
          aria-label={title}
          tabIndex={0}
          className="max-h-[36rem] overflow-auto rounded-xl border border-border"
        >
          <table className="w-full border-separate border-spacing-0 text-start text-sm">
            <caption className="sr-only">{title}</caption>
            <thead
              className={cn(
                "bg-muted text-foreground",
                stickyHeader &&
                  "sticky top-0 z-20 shadow-sm shadow-foreground/5",
              )}
            >
              <tr>
                <th
                  scope="col"
                  className={cn(
                    "min-w-32 bg-muted px-4 py-4 text-start @md:min-w-52",
                    stickyFirstColumn && "sticky start-0 z-10",
                  )}
                >
                  {featureLabel}
                </th>
                {options.map((option) => (
                  <th
                    key={option}
                    scope="col"
                    className="min-w-28 px-4 py-4 text-start"
                  >
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.title}>
                <tr>
                  <th
                    scope="rowgroup"
                    colSpan={options.length + 1}
                    className="bg-muted px-4 py-3 text-start font-semibold"
                  >
                    <span
                      className={cn(
                        "inline-block",
                        stickyFirstColumn && "sticky start-4",
                      )}
                    >
                      {group.title}
                    </span>
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.feature} className="group hover:bg-muted/60">
                    <th
                      scope="row"
                      className={cn(
                        "border-t border-border bg-background px-4 py-4 text-start font-medium group-hover:bg-muted",
                        stickyFirstColumn && "sticky start-0 z-10",
                      )}
                    >
                      {row.feature}
                    </th>
                    {options.map((option, index) => {
                      const cell = row.cells[index];
                      return (
                        <td
                          key={option}
                          className="border-t border-border px-4 py-4 text-muted-foreground"
                        >
                          {typeof cell === "boolean"
                            ? cell
                              ? includedLabel
                              : excludedLabel
                            : cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
