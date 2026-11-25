"use client";

/** Groups record attributes with inline actions and optional copy feedback. Motion: copy confirmation pops in. Catalog: description-list. */
import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

export interface DescriptionItem {
  /** Attribute label. */
  term: string;
  /** Value, or an accessible dash when omitted. */
  value?: ReactNode;
  /** Optional text to write to the clipboard. */
  copy?: string;
  /** Optional inline link. */
  action?: { href: string; label: string };
}
export interface DescriptionListProps {
  /** Optional grouping heading. */
  title?: string;
  /** Level for the grouping heading. */
  headingLevel?: 2 | 3 | 4;
  /** Attributes in reading order. */
  items: readonly DescriptionItem[];
  /** Inline labels, stacked labels, or a framed group. */
  variant?: "columns" | "stacked" | "card";
  /** Additional classes. */
  className?: string;
}

/** Renders semantic attribute pairs. */
export function DescriptionList({ title, headingLevel = 2, items, variant = "columns", className }: DescriptionListProps) {
  const Heading = `h${headingLevel}` as const;
  const [feedback, setFeedback] = useState<{ term: string; label: string; success: boolean }>();
  async function copy(item: DescriptionItem) {
    try {
      await navigator.clipboard.writeText(item.copy ?? "");
      setFeedback({ term: item.term, label: `Copied ${item.term}`, success: true });
    } catch {
      setFeedback({ term: item.term, label: `Could not copy ${item.term}`, success: false });
    }
  }

  return <section className={cn("min-w-0", variant === "card" && "rounded-xl border border-border bg-card p-5 sm:p-6", className)}>
    {title && <Heading className="mb-3 font-heading text-lg font-semibold">{title}</Heading>}
    <dl className="divide-y divide-border">
      {items.map((item) => <div key={item.term} className={cn("grid min-w-0 gap-1 py-3", variant !== "stacked" && "sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:items-baseline sm:gap-4")}>
        <dt className="text-sm text-muted-foreground">{item.term}</dt>
        <dd className="flex min-w-0 flex-wrap items-center gap-x-2 text-sm font-medium">
          <span className="min-w-0 wrap-anywhere">{item.value == null || item.value === "" ? <><span aria-hidden>—</span><span className="sr-only">No value</span></> : item.value}</span>
          {item.action && <a href={item.action.href} className="df-press inline-flex min-h-11 items-center rounded-md px-2 text-primary hover:bg-accent">{item.action.label}</a>}
          {item.copy !== undefined && <button type="button" aria-label={`Copy ${item.term}`} onClick={() => void copy(item)} className="df-press grid size-11 place-items-center rounded-md hover:bg-muted">
            {feedback?.term === item.term && feedback.success ? <Check aria-hidden size={16} className="motion-safe:animate-df-pop text-success" /> : <Copy aria-hidden size={16} />}
          </button>}
        </dd>
      </div>)}
    </dl>
    <span role="status" className="sr-only">{feedback?.label}</span>
  </section>;
}
