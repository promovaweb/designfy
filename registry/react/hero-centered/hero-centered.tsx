/**
 * HeroCentered: Centers the page headline and action, with optional background, media and inline form.
 * Slots or React nodes: background, visual, form.
 * Motion: CSS entrance staggers headline, lead and actions before the optional media.
 * Catalog: hero-centered
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";
import type { CSSProperties } from "react";

type Action = { label: string; href: string };

export interface HeroCenteredProps {
  /** Page headline. */
  headline: string;
  /** One sentence that supports the headline. */
  lead: string;
  /** Heading level. Use level one for the page hero. */
  headingLevel?: 1 | 2;
  /** Main call to action; the form can take its place. */
  primaryAction?: Action;
  /** Secondary link. */
  secondaryAction?: Action;
  /** Decorative layer behind the hero. */
  background?: ReactNode;
  /** Supporting media below the text. */
  visual?: ReactNode;
  /** Inline form. */
  form?: ReactNode;
  /** Additional classes on the root element. */
  className?: string;
}

/** Centers the page headline and action, with optional background, media and inline form. */
export function HeroCentered({
  headline,
  lead,
  headingLevel = 1,
  primaryAction,
  secondaryAction,
  background,
  visual,
  form,
  className,
}: HeroCenteredProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      className={cn(
        "relative isolate overflow-clip border-b border-border",
        className,
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
      <div className="df-container flex flex-col items-center py-16 text-center md:py-24 lg:py-28">
        <Heading className="max-w-[17ch] font-heading text-display font-semibold">
          <span className="sr-only">{headline}</span>
          <span aria-hidden="true">
            {headline
              .split(/\s+/)
              .map((word, index) => (
                <span
                  key={index}
                  className="inline-block animate-df-fade-up [animation-delay:var(--word-delay)]"
                  style={{ "--word-delay": index * 20 + "ms" } as CSSProperties}
                >
                  {word}
                </span>
              ))
              .flatMap((word, index) => (index ? [" ", word] : [word]))}
          </span>
        </Heading>
        <p className="mt-6 max-w-[52ch] animate-df-fade-up text-lead text-muted-foreground [animation-delay:80ms]">
          {lead}
        </p>
        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex w-full animate-df-fade-up flex-col gap-3 [animation-delay:160ms] min-[480px]:w-auto min-[480px]:flex-row">
            {primaryAction && (
              <a
                href={primaryAction.href}
                className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 "
              >
                {primaryAction.label}
              </a>
            )}
            {secondaryAction && (
              <a
                href={secondaryAction.href}
                className="df-press inline-flex min-h-12 min-w-11 items-center justify-center rounded-lg border border-border bg-background px-5 py-2 text-center text-sm font-semibold hover:bg-muted "
              >
                {secondaryAction.label}
              </a>
            )}
          </div>
        )}
        {form && (
          <div className="mt-8 w-full max-w-xl animate-df-fade-up [animation-delay:180ms]">
            {form}
          </div>
        )}
        {visual && (
          <div className="mt-12 w-full max-w-5xl overflow-hidden rounded-2xl border border-border animate-df-fade-up [animation-delay:240ms]">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
