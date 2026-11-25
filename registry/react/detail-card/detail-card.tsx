/** Explains a feature with paragraphs, a checklist and a footnote. Uses theme motion with a static reduced-motion state. */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

export interface DetailCardProps {
  /** Heading text. */
  title: string;
  /** Heading level in the surrounding document. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Decorative icon, provided through the icon slot in Astro. */
  icon?: ReactNode;
  /** Optional short label. */
  label?: string;
  /** Body paragraphs. */
  paragraphs: string[];
  /** Optional check list. */
  checks?: string[];
  /** Note after the list. */
  footnote?: string;
  /** Span two rows inside DetailCardGrid. */
  tall?: boolean;
  /** Surface treatment. */
  variant?: "neutral" | "tinted";
  /** Additional root classes. */
  className?: string;
}

/** Explains a feature with paragraphs, a checklist and a footnote. */
export function DetailCard({
  title,
  headingLevel = 2,
  icon,
  label,
  paragraphs,
  checks,
  footnote,
  tall,
  variant = "neutral",
  className,
}: DetailCardProps) {
  const Heading = `h${headingLevel}` as "h2";
  return (
    <article
      data-tall={tall || undefined}
      data-df-reveal="up"
      className={cn(
        "flex min-w-0 flex-col items-start gap-4 rounded-2xl border p-6 sm:p-8",
        variant === "tinted"
          ? "border-primary/25 bg-primary/5"
          : "border-border bg-card text-card-foreground",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5"
        >
          {icon}
        </span>
      )}
      {label && (
        <span className="text-sm font-semibold text-primary">{label}</span>
      )}
      <Heading className="font-heading text-title font-semibold tracking-tight">
        {title}
      </Heading>
      {paragraphs.map((text, i) => (
        <p key={i} className="leading-relaxed">
          {text}
        </p>
      ))}
      {Boolean(checks?.length) && (
        <ul role="list" className="space-y-2">
          {checks?.map((text, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-primary">
                ✓
              </span>
              {text}
            </li>
          ))}
        </ul>
      )}
      {footnote && (
        <p className="mt-auto pt-2 text-sm text-muted-foreground">{footnote}</p>
      )}
    </article>
  );
}
