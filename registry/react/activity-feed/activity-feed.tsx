/** Single-column, reverse-chronological activity with older entries and loading/empty messages. Motion: new entries slide into place. Catalog: activity-feed. */
import type { ReactNode } from "react";
import { cn } from "@designfy/components/lib/cn";

export interface ActivityEntry {
  /** Stable event identifier. */
  id: string;
  /** ISO timestamp. */
  dateTime: string;
  /** Formatted timestamp. */
  time: string;
  /** Actor or source. */
  actor: string;
  /** Event description. */
  action: string;
  /** Optional detail or attachment. */
  detail?: ReactNode;
}
export interface ActivityFeedProps {
  /** Heading of the event list. */
  title: string;
  /** Heading level. */
  headingLevel?: 2 | 3 | 4;
  /** Events, sorted by date descending by the component. */
  entries: readonly ActivityEntry[];
  /** Indicates that events are being loaded. */
  loading?: boolean;
  /** Empty message. */
  emptyMessage?: string;
  /** Older entries control or link. */
  older?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Displays timestamped events in an ordered timeline. */
export function ActivityFeed({ title, headingLevel = 2, entries, loading, emptyMessage, older, className }: ActivityFeedProps) {
  const Heading = `h${headingLevel}` as const;
  const sorted = [...entries].sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime));
  return <section aria-busy={loading || undefined} className={cn("min-w-0 rounded-xl border border-border bg-card p-5 sm:p-6", className)}>
    <Heading className="mb-5 font-heading text-lg font-semibold">{title}</Heading>
    {entries.length ? <ol className="ms-1 border-s border-border">
      {sorted.map((item) => <li key={item.id} className="relative min-w-0 space-y-1 ps-5 pb-5 last:pb-1 motion-safe:animate-df-slide-in-right">
        <span aria-hidden className="absolute -start-1 top-1.5 size-2 rounded-full bg-primary ring-4 ring-card" />
        <time dateTime={item.dateTime} className="block text-xs tabular-nums text-muted-foreground">{item.time}</time>
        <p className="text-sm"><strong className="font-semibold">{item.actor}</strong> {item.action}</p>
        {item.detail && <div className="text-sm text-muted-foreground">{item.detail}</div>}
      </li>)}
    </ol> : <p className="rounded-lg bg-muted px-3 py-4 text-sm text-muted-foreground" role="status">{loading ? "Loading activity…" : emptyMessage ?? "No activity yet."}</p>}
    {older && <div className="mt-4">{older}</div>}
  </section>;
}
