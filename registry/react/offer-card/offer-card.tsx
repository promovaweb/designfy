"use client";

/** Presents an offer with an optional deadline and capacity. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";
import { useEffect, useRef } from "react";
import { bindDeadline } from "./deadline";

export interface OfferCardProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Supporting line below the title. */
  supporting: string;
  /** Absolute ISO instant, readable fallback, and expired copy. */
  deadline?: {
    iso: string;
    label: string;
    closedMessage: string;
    units?: [string, string, string, string];
  };
  /** Capacity value and its meaning. */
  capacity?: { value: string; label: string };
  /** Primary link. */
  action: { href: string; label: string };
  /** Opaque tinted surface or dark stage card. */
  variant?: "tinted" | "stage";
  /** Additional root classes. */
  className?: string;
}

/** Presents an offer with an optional deadline and capacity. */
export function OfferCard({
  title,
  headingLevel = 2,
  supporting,
  deadline,
  capacity,
  action,
  variant = "tinted",
  className,
}: OfferCardProps) {
  const Heading = `h${headingLevel}` as "h2";
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return bindDeadline(root.current);
  }, [deadline?.iso, deadline?.label, deadline?.closedMessage]);
  return (
    <article
      data-df-reveal="up"
      className={cn(
        "grid min-w-0 gap-5 rounded-2xl border p-6 sm:p-8",
        variant === "stage"
          ? "dark border-border bg-card text-card-foreground"
          : "border-primary/25 bg-accent text-accent-foreground",
        className,
      )}
    >
      <Heading className="font-heading text-title font-semibold tracking-tight">
        {title}
      </Heading>
      <p>{supporting}</p>
      {deadline && (
        <div ref={root} data-deadline={deadline.iso} className="block">
          <time dateTime={deadline.iso}>{deadline.label}</time>
          <p hidden data-closed>
            {deadline.closedMessage}
          </p>
          <div
            hidden
            data-clock
            role="timer"
            aria-live="off"
            className="mt-3 grid grid-cols-4 gap-1 [&[hidden]]:hidden!"
          >
            {(deadline.units ?? ["Days", "Hours", "Minutes", "Seconds"]).map(
              (unit, i) => (
                <span
                  key={i}
                  className="flex min-w-0 flex-col rounded-lg bg-background px-1 py-2 text-center text-foreground"
                >
                  <b data-digit className="text-xl tabular-nums"></b>
                  <span className="break-words text-xs">{unit}</span>
                </span>
              ),
            )}
          </div>
        </div>
      )}
      {capacity && (
        <p className="flex flex-wrap items-baseline gap-2 border-t border-current/20 pt-4">
          <strong className="text-headline tabular-nums">
            {capacity.value}
          </strong>
          {capacity.label}
        </p>
      )}
      <a
        href={action.href}
        className="df-press inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {action.label}
      </a>
    </article>
  );
}
