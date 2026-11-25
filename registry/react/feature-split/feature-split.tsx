/**
 * FeatureSplit: Sets a feature explanation beside a large visual or a scrolling sequence of visuals.
 * Slots or React nodes: visual.
 * Motion: Visuals enter through a mask as they reach the viewport.
 * Catalog: feature-split
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

type Action = { label: string; href: string };
type Image = { src: string; alt: string; width: number; height: number };

export interface FeatureSplitProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Supporting bullets. */
  points?: string[];
  /** Link to learn or act. */
  action?: Action;
  /** Custom visual. Supply text alternatives for informative content. */
  visual?: ReactNode;
  /** Visual sequence. Multiple images enable sticky copy. */
  images?: Image[];
  /** Desktop placement of the visual. */
  visualSide?: "start" | "end";
  /** Additional classes on the root element. */
  className?: string;
}

/** Sets a feature explanation beside a large visual or a scrolling sequence of visuals. */
export function FeatureSplit({
  title,
  lead,
  headingLevel = 2,
  points,
  action,
  visual,
  images,
  visualSide = "end",
  className,
}: FeatureSplitProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section className={cn("df-section border-t border-border", className)}>
      <div className="df-container grid items-start gap-10 md:grid-cols-2 lg:gap-16">
        <div
          data-df-reveal="up"
          className={cn(
            "min-w-0 self-center",
            visualSide === "start" && "md:order-2",
            (images?.length ?? 0) > 1 && "md:sticky md:top-24 md:self-start",
          )}
        >
          <Heading className="font-heading text-headline font-semibold">
            {title}
          </Heading>
          {lead && (
            <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
              {lead}
            </p>
          )}
          {!!points?.length && (
            <ul className="mt-6 list-disc space-y-2 ps-5 marker:text-primary">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
          {action && (
            <a
              href={action.href}
              className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline mt-5 w-fit"
            >
              {action.label}
            </a>
          )}
        </div>
        {visual && (
          <div
            data-df-reveal="mask"
            className="min-w-0 overflow-hidden rounded-2xl bg-muted"
          >
            {visual}
          </div>
        )}
        {!!images?.length && (
          <div className="grid min-w-0 gap-4">
            {images.map((image) => (
              <img
                key={image.src}
                data-df-reveal="mask"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                className="h-auto w-full rounded-2xl bg-muted"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
