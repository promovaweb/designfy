"use client";

/** Composes a shadcn chart with period controls, summary, feedback and a tabular alternative. Motion: chart draws once and view changes fade. Catalog: chart-card. */
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Table2, ChartNoAxesCombined } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@designfy/components/lib/cn";

export interface ChartCardProps {
  /** Chart heading. */
  title: string;
  /** Supporting context. */
  description?: string;
  /** Heading level. */
  headingLevel?: 2 | 3 | 4;
  /** Text interpretation of the current data. */
  summary: string;
  /** shadcn series configuration. */
  config: ChartConfig;
  /** Key that changes when a new data revision should interpolate. Defaults to 0. */
  animationKey?: string | number;
  /** One compatible Recharts chart. Pass these animation options to its series. */
  chart: (animation: { isAnimationActive: boolean; animationDuration: number; onAnimationEnd: () => void }) => ComponentProps<typeof ChartContainer>["children"];
  /** Raw data represented in the visualization. */
  table: { columns: readonly string[]; rows: readonly (readonly (string | number)[])[] };
  /** Period or series controls. */
  period?: ReactNode;
  /** Legend content shown below the plot. */
  legend?: ReactNode;
  /** Data availability. */
  state?: "ready" | "loading" | "empty" | "error";
  /** Message for the current feedback state. */
  message?: string;
  /** Recovery button used in the error state. */
  recovery?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Presents a visualization with a text and table alternative. */
export function ChartCard({ title, description, headingLevel = 2, summary, config, animationKey = 0, chart, table, period, legend, state = "ready", message, recovery, className }: ChartCardProps) {
  const Heading = `h${headingLevel}` as const;
  const [tabular, setTabular] = useState(false);
  const [finished, setFinished] = useState<typeof animationKey>();
  const reduced = useReducedMotion();
  const titleId = useId();
  const summaryId = useId();
  return <section aria-labelledby={titleId} aria-busy={state === "loading" || undefined} className={cn("@container min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6", className)}>
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <Heading id={titleId} className="font-heading text-lg font-semibold">{title}</Heading>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {period}
        {state === "ready" && <button type="button" onClick={() => { setFinished(animationKey); setTabular(!tabular); }} aria-pressed={tabular} aria-label="View as table" className="df-press grid size-11 place-items-center rounded-lg border border-border hover:bg-muted aria-pressed:bg-accent">
          {tabular ? <ChartNoAxesCombined aria-hidden size={17} /> : <Table2 aria-hidden size={17} />}
        </button>}
      </div>
    </header>
    {state === "ready" ? <>
      <p id={summaryId} className="sr-only">{summary}</p>
      <div key={String(tabular)} className="mt-4 motion-safe:animate-df-fade-in">
        {tabular ? <div tabIndex={0} className="max-h-70 overflow-auto rounded-lg border border-border" role="region" aria-label={`${title} data`}>
          <table aria-describedby={summaryId} className="w-full text-sm">
            <thead className="sticky top-0 bg-muted"><tr>{table.columns.map((column) => <th scope="col" key={column} className="px-3 py-2 text-start">{column}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">{table.rows.map((row, index) => <tr key={index}>{row.map((value, cell) => cell === 0 ? <th key={cell} scope="row" className="px-3 py-2 text-start font-medium">{value}</th> : <td key={cell} className="px-3 py-2 tabular-nums">{value}</td>)}</tr>)}</tbody>
          </table>
        </div> : <div role="group" aria-labelledby={titleId} aria-describedby={summaryId}>
          <ChartContainer config={config} className="h-56 w-full @lg:h-64 [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground">{chart({ isAnimationActive: !reduced && finished !== animationKey, animationDuration: 600, onAnimationEnd: () => setFinished(animationKey) })}</ChartContainer>
          {legend && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">{legend}</div>}
        </div>}
      </div>
    </> : state === "loading" ? <Skeleton className="mt-5 h-56 animate-none @lg:h-64" /> : <div role={state === "error" ? "alert" : "status"} className="mt-4 grid h-56 place-content-center justify-items-center gap-3 rounded-lg bg-muted/50 px-4 text-center text-sm text-muted-foreground @lg:h-64">
      <p>{message ?? (state === "empty" ? "No chart data for this period." : "Could not load the chart.")}</p>{state === "error" && recovery}
    </div>}
  </section>;
}
