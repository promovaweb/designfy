"use client";

/** Metric with delta, sparkline or goal and feedback states. Motion: value spring, delta fade and one-time line reveal. Catalog: stat-card. */
import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ArrowUpRight as OpenDetail } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@designfy/components/lib/cn";

export interface StatCardProps {
  /** Metric label. */
  label: string;
  /** Metric value. Null means no data. */
  value: number | null;
  /** Formats both the displayed and final accessible value. */
  format?: (value: number) => string;
  /** Signed change and accompanying comparison text. */
  change?: { value: number; text: string };
  /** Samples for a decorative sparkline. */
  trend?: readonly number[];
  /** Optional target and its description. */
  goal?: { value: number; label: string };
  /** Alternative decorative icon. */
  icon?: ReactNode;
  /** Link to the metric detail. */
  detail?: { href: string; label: string };
  /** Loading placeholder. */
  loading?: boolean;
  /** Error message for this metric. */
  error?: string;
  /** Additional classes. */
  className?: string;
}

function Count({ value, format = (number) => Math.round(number).toLocaleString() }: { value: number; format?: StatCardProps["format"] }) {
  const reduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 120, damping: 24 });
  const [display, setDisplay] = useState(value);
  useMotionValueEvent(spring, "change", setDisplay);
  useEffect(() => { if (reduced) spring.jump(value); else spring.set(value); }, [reduced, spring, value]);
  return <><span aria-hidden>{format(reduced ? value : display)}</span><span className="sr-only">{format(value)}</span></>;
}

/** Shows a metric and the context needed to read it. */
export function StatCard({ label, value, format, change, trend, goal, icon, detail, loading, error, className }: StatCardProps) {
  const span = trend?.length ? Math.max(1, Math.max(...trend) - Math.min(...trend)) : 1;
  const points = trend?.map((sample, index) => `${2 + index * 96 / Math.max(1, trend.length - 1)},${27 - (sample - Math.min(...trend)) * 22 / span}`).join(" ");
  return <article aria-busy={loading || undefined} className={cn("@container flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
    <dl className="min-w-0">
      <dt className="flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground">{label}{icon && <span aria-hidden className="text-primary">{icon}</span>}</dt>
      <dd className="relative mt-3 flex min-h-9 flex-wrap items-end justify-between gap-x-2 font-heading text-3xl font-semibold tracking-tight tabular-nums">
        {loading ? <><Skeleton className="h-8 w-24 animate-none" /><span className="sr-only">Loading</span></>
          : error ? <span className="text-sm font-medium tracking-normal text-destructive">{error}</span>
          : value === null ? <><span aria-hidden>—</span><span className="sr-only">No data</span></>
          : <><span className={cn("min-w-0 wrap-anywhere", points && "@min-[10rem]:pe-20")}><Count value={value} format={format} /></span>
            {points && <svg className="invisible absolute end-0 bottom-0 h-7 w-18 text-primary @min-[10rem]:visible motion-safe:animate-df-mask-up" aria-hidden viewBox="0 0 100 30"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></svg>}</>}
      </dd>
    </dl>
    {loading ? <Skeleton className="h-4 w-28 animate-none" /> : !error && value !== null && <>
      {change && <div key={change.value} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs motion-safe:animate-df-fade-in">
        <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium tabular-nums", change.value > 0 ? "bg-success/10 text-success" : change.value < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>
          {change.value > 0 ? <ArrowUpRight aria-hidden size={13} /> : change.value < 0 ? <ArrowDownRight aria-hidden size={13} /> : null}{change.value > 0 ? "+" : ""}{change.value}%
        </span>
        <span className="text-muted-foreground">{change.text}</span>
      </div>}
      {goal && goal.value > 0 && <label className="grid gap-1 text-xs text-muted-foreground">{goal.label}<progress className="h-2 w-full accent-primary" max={goal.value} value={Math.max(0, Math.min(value, goal.value))} /></label>}
    </>}
    {detail && <a href={detail.href} className="df-press mt-auto inline-flex min-h-11 items-center gap-1 self-start text-xs font-medium text-primary hover:underline">{detail.label}<OpenDetail aria-hidden size={13} /></a>}
  </article>;
}
