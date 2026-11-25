/**
 * HeroPixel: opens a landing with a text promise, next actions, and an optional aside.
 * Motion: the aside enters above a pausable PixelStage. The headline paints immediately.
 */
import { cn } from "@designfy/components/lib/cn";
import { PixelStage } from "@designfy/components/pixel-stage/pixel-stage";
import type { ReactNode } from "react";

type Action = { label: string; href: string };

export interface HeroPixelProps {
  /** Main text of the page heading. */
  title: string;
  /** Optional final phrase highlighted within the same heading. */
  emphasis?: string;
  /** Supporting copy. */
  lead: string;
  /** Main link. */
  action: Action;
  /** Secondary link, when there is a distinct next step. */
  secondaryAction?: Action;
  /** Supporting note below the actions. */
  note?: string;
  /** Accessible label for the stage's pause control. */
  pauseLabel: string;
  /** Supplementary content such as an enrollment summary. */
  aside?: ReactNode;
  /** Additional classes on the section. */
  className?: string;
}

/** Opens a landing above a decorative mosaic. */
export function HeroPixel({
  title,
  emphasis,
  lead,
  action,
  secondaryAction,
  note,
  pauseLabel,
  aside,
  className,
}: HeroPixelProps) {
  return (
    <section className={cn("bg-background text-foreground", className)}>
      <PixelStage pauseLabel={pauseLabel}>
        <div
          className={cn(
            "df-container grid items-center gap-10 py-20 md:py-24 lg:py-32",
            aside &&
              "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16",
          )}
        >
          <div className="min-w-0">
            <h1 className="max-w-[22ch] text-balance font-heading text-display font-semibold [overflow-wrap:anywhere]">
              {title}
              {emphasis && (
                <>
                  {" "}
                  <strong className="font-semibold text-primary">
                    {emphasis}
                  </strong>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-prose text-lead text-muted-foreground">
              {lead}
            </p>
            <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row">
              <a
                className="df-press inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center font-semibold text-primary-foreground hover:bg-primary/90"
                href={action.href}
              >
                {action.label}
              </a>
              {secondaryAction && (
                <a
                  className="df-press inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center font-medium text-foreground hover:bg-muted"
                  href={secondaryAction.href}
                >
                  {secondaryAction.label}
                </a>
              )}
            </div>
            {note && (
              <p className="mt-4 max-w-prose text-sm text-muted-foreground">
                {note}
              </p>
            )}
          </div>
          {aside && (
            <div className="min-w-0 motion-safe:animate-df-fade-up focus-within:opacity-100!">
              {aside}
            </div>
          )}
        </div>
      </PixelStage>
    </section>
  );
}
