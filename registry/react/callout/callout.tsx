/**
 * Callout: sets a note, a tip, a warning or a danger apart from the text.
 *
 * The kind is written in the text, not only painted: the label ("Note", "Tip",
 * "Warning", "Danger") always appears next to the icon, and `label` replaces it
 * in another language. The optional `title` adds the specific subject above
 * the body. The block is an aside with role="note".
 *
 * Motion: none. The callout is part of the text and does not move.
 *
 * Catalog: callout
 */
import type { ReactNode } from "react";
import { Info, Lightbulb, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

type CalloutType = "note" | "tip" | "warning" | "danger";

const LABEL: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

const ICON: Record<CalloutType, LucideIcon> = {
  note: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: OctagonAlert,
};

const TONE: Record<CalloutType, { surface: string; border: string; text: string }> = {
  note: { surface: "bg-info/10", border: "border-info/30", text: "text-info" },
  tip: { surface: "bg-success/10", border: "border-success/30", text: "text-success" },
  warning: { surface: "bg-warning/10", border: "border-warning/30", text: "text-warning" },
  danger: { surface: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive" },
};

export interface CalloutProps {
  /** Kind of the callout; it sets the default label and the icon. Default "note". */
  type?: CalloutType;
  /** Replaces the default label, for another language or a more precise word. */
  label?: string;
  /** The specific subject of the callout. */
  title?: string;
  /** The text of the callout. */
  children: ReactNode;
  className?: string;
}

/** Marks information the reader should not miss. */
export function Callout({ type = "note", label, title, children, className }: CalloutProps) {
  const Icon = ICON[type];
  const tone = TONE[type];
  return (
    <aside
      role="note"
      data-df-callout={type}
      className={cn("not-prose rounded-lg border px-5 py-4", tone.surface, tone.border, className)}
    >
      <p className={cn("flex items-center gap-2 text-sm font-semibold", tone.text)}>
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <span>{label ?? LABEL[type]}</span>
      </p>
      {title ? <p className="mt-2 font-heading text-base font-semibold text-foreground">{title}</p> : null}
      <div className={cn("flex flex-col gap-2 text-sm leading-relaxed text-foreground/85", title ? "mt-1" : "mt-2")}>
        {children}
      </div>
    </aside>
  );
}
