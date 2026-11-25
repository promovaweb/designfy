/**
 * CtaBand: Repeats the primary action in a full-width or inset band with an optional form.
 * Slots or React nodes: form, background.
 * Motion: The band reveals as one unit. A supplied background can add a slow loop.
 * Catalog: cta-band
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

type Action = { label: string; href: string };

export interface CtaBandProps {
  /** Section heading. */
  title: string;
  /** Supporting sentence. */
  lead?: string;
  /** Heading level in the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Main action link. */
  action?: Action;
  /** Optional supporting action beside the main link. */
  secondaryAction?: Action;
  /** Full-width band or inset composition. */
  variant?: "full" | "inset";
  /** Inline alternative to the action link. */
  form?: ReactNode;
  /** Decorative pattern behind the content. */
  background?: ReactNode;
  /** Additional classes on the root element. */
  className?: string;
}

/** Repeats the primary action in a full-width or inset band with an optional form. */
export function CtaBand({
  title,
  lead,
  headingLevel = 2,
  action,
  secondaryAction,
  variant = "inset",
  form,
  background,
  className,
}: CtaBandProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <section
      className={cn(
        variant === "inset" ? "df-section df-container" : "bg-primary/10",
        className,
      )}
    >
      <div
        data-df-reveal="fade"
        className={cn(
          "relative isolate overflow-clip focus-within:opacity-100!",
          variant === "inset"
            ? "rounded-2xl bg-primary/10 p-6 sm:p-10 lg:p-14"
            : "df-section df-container",
        )}
      >
        {background && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            {background}
          </div>
        )}
        <div className="grid min-w-0 items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
          <div className="min-w-0">
            <Heading className="font-heading text-headline font-semibold">
              {title}
            </Heading>
            {lead && (
              <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
                {lead}
              </p>
            )}
          </div>
          {(action || secondaryAction) && (
            <div
              className={cn(
                "flex min-w-0 flex-col items-stretch gap-3",
                action &&
                  secondaryAction &&
                  "sm:flex-row sm:flex-wrap md:flex-col md:items-end",
              )}
            >
              {action && (
                <a
                  href={action.href}
                  className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm [overflow-wrap:anywhere] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {action.label}
                </a>
              )}
              {secondaryAction && (
                <a
                  href={secondaryAction.href}
                  className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm [overflow-wrap:anywhere] font-medium text-foreground hover:bg-muted"
                >
                  {secondaryAction.label}
                </a>
              )}
            </div>
          )}
        </div>
        {form && <div className="mt-6 max-w-xl">{form}</div>}
      </div>
    </section>
  );
}
