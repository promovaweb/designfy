/** Explains an empty region with optional decorative artwork and actions. Motion: soft entrance and one decorative rise. Catalog: empty-state. */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

export interface EmptyStateProps {
  /** Plain statement of what is empty. */
  title: string;
  /** Reason and next step. */
  description: string;
  /** Heading level within the parent region. */
  headingLevel?: 1 | 2 | 3 | 4;
  /** Decorative icon or illustration. */
  illustration?: ReactNode;
  /** Main next action. */
  primaryAction?: ReactNode;
  /** Optional secondary action. */
  secondaryAction?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Explains a first-use, permission or no-results state. */
export function EmptyState({ title, description, headingLevel = 2, illustration, primaryAction, secondaryAction, className }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return <section className={cn("grid justify-items-center gap-3 px-4 py-10 text-center motion-safe:animate-df-fade-in sm:py-14", className)}>
    {illustration && <div aria-hidden className="mb-2 text-primary motion-safe:animate-df-fade-up">{illustration}</div>}
    <Heading className="font-heading text-title font-semibold">{title}</Heading>
    <p className="max-w-[44ch] text-sm text-muted-foreground">{description}</p>
    {(primaryAction || secondaryAction) && <div className="mt-2 flex flex-wrap justify-center gap-2">{primaryAction}{secondaryAction}</div>}
  </section>;
}
