/**
 * Card: Groups a single subject in a fluid surface with optional media, an action and a footer.
 * Slots or React nodes: media, action, children, footer.
 * Motion: Linked cards lift on hover and can enter as part of a staggered list.
 * Catalog: card
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

export interface CardProps {
  /** Heading and accessible name of the linked card. */
  title: string;
  /** Optional supporting description. */
  description?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Turns the entire card into one link. Omit interactive slots in this mode. */
  href?: string;
  /** Emphasizes the surface. */
  highlighted?: boolean;
  /** Marks the card as current. */
  selected?: boolean;
  /** Text shown when this card is selected. */
  selectedLabel?: string;
  /** Preserves a skeleton while content loads. */
  loading?: boolean;
  /** Accessible loading message. */
  loadingLabel?: string;
  /** Optional media region. */
  media?: ReactNode;
  /** Header action for a card without href. */
  action?: ReactNode;
  /** Main content. */
  children?: ReactNode;
  /** Optional footer. */
  footer?: ReactNode;
  /** Mark the card for a staggered list reveal. */
  reveal?: boolean;
  /** Additional classes on the root element. */
  className?: string;
}

/** Groups a single subject in a fluid surface with optional media, an action and a footer. */
export function Card({
  title,
  description,
  headingLevel = 3,
  href,
  highlighted = false,
  selected = false,
  selectedLabel = "Selected",
  loading = false,
  loadingLabel = "Loading",
  media,
  action,
  children,
  footer,
  reveal = false,
  className,
}: CardProps) {
  const Heading = `h${headingLevel}` as "h3";
  return (
    <article
      data-df-reveal={reveal ? "up" : undefined}
      aria-busy={loading || undefined}
      data-selected={selected || undefined}
      className={cn(
        "@container relative min-w-0 rounded-xl border border-border bg-card text-card-foreground",
        href && !loading && "df-lift",
        highlighted && "bg-primary/5",
        selected && "border-primary",
        className,
      )}
    >
      {loading ? (
        <div
          data-df-loop
          className="grid gap-3 p-4 hover:[&>*]:[animation-play-state:paused] focus-within:[&>*]:[animation-play-state:paused] @sm:p-6"
        >
          <span className="sr-only" role="status">
            {loadingLabel}
          </span>
          <span
            aria-hidden="true"
            className="df-shimmer block h-5 w-3/5 rounded bg-muted"
          />
          <span
            aria-hidden="true"
            className="df-shimmer block h-4 w-4/5 rounded bg-muted"
          />
          <span
            aria-hidden="true"
            className="df-shimmer block h-12 w-full rounded bg-muted"
          />
        </div>
      ) : (
        <div>
          {media && (
            <div className="overflow-hidden rounded-t-[inherit]">{media}</div>
          )}
          <div className="grid gap-4 p-4 @sm:p-6">
            <header className="grid min-w-0 items-start gap-2 @sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <Heading className="text-title font-semibold">
                  {href ? (
                    <a
                      href={href}
                      aria-current={selected ? "true" : undefined}
                      className="after:absolute after:inset-0 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
                    >
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </Heading>
                {description && (
                  <p className="mt-2 break-words text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
                {selected && (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {selectedLabel}
                  </p>
                )}
              </div>
              {!href && action && <div>{action}</div>}
            </header>
            {children && <div className="min-w-0 break-words">{children}</div>}
            {footer && (
              <footer className="min-w-0 border-t border-border pt-4">
                {footer}
              </footer>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
