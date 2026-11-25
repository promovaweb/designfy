/**
 * BentoGrid: Arranges unequal capabilities in tiles with supporting illustrations.
 * Motion: Tiles reveal in order and each tile visual can supply its own focused motion.
 * Catalog: bento-grid
 */
import { cn } from "@designfy/components/lib/cn";

type Tile = {
  title: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  span?: "wide" | "tall";
};

export interface BentoGridProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Tiles in reading order, with a wide or tall span where needed. */
  items: Tile[];
  /** Number of columns at the widest breakpoint. */
  variant?: "two" | "three";
  /** Additional classes on the root element. */
  className?: string;
}

/** Arranges unequal capabilities in tiles with supporting illustrations. */
export function BentoGrid({
  title,
  lead,
  headingLevel = 2,
  items,
  variant = "three",
  className,
}: BentoGridProps) {
  const Heading = `h${headingLevel}` as "h2";
  const ItemHeading = `h${Math.min(6, headingLevel + 1)}` as "h3";
  return (
    <section className={cn("df-section", className)}>
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
        <ul
          data-df-stagger
          className={cn(
            "grid gap-4 sm:grid-cols-2",
            variant === "three" && "lg:grid-cols-3",
          )}
        >
          {items.map((item) => (
            <li
              key={item.title}
              data-df-reveal="up"
              className={cn(
                "group @container flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground",
                item.span === "wide" && "sm:col-span-2",
                item.span === "tall" && "sm:row-span-2",
              )}
            >
              <div
                className={cn(
                  "flex flex-1 items-center justify-center overflow-hidden bg-muted",
                  item.span === "tall"
                    ? "aspect-[4/3] sm:aspect-auto"
                    : "aspect-[16/9]",
                )}
              >
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  className="size-full object-contain motion-safe:transition-transform motion-safe:duration-(--duration-slow) motion-safe:group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 @md:p-7">
                <ItemHeading className="text-title font-semibold">
                  {item.title}
                </ItemHeading>
                <p className="mt-2 max-w-prose text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
