"use client";

/** Controlled workflow with step indicators and persistent caller-owned data. Motion: slide by direction and transform-based progress. Catalog: stepper. */
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@designfy/components/lib/cn";

export interface StepperProps {
  /** Ordered workflow; include a review step when required. */
  steps: readonly { id: string; label: string; error?: boolean }[];
  /** Active zero-based step. */
  current: number;
  /** Visible step content. Lift fields into parent state to keep their values. */
  children: ReactNode;
  /** Heading level for the active step. */
  headingLevel?: 2 | 3 | 4;
  /** Request to return to the previous step. */
  onBack: () => void;
  /** Validate and advance, or complete the workflow. */
  onNext: () => void;
  /** Optional label of the final action. */
  finishLabel?: string;
  /** Disable advancement during validation or completion. */
  busy?: boolean;
  /** Additional classes. */
  className?: string;
}

/** Shows the current workflow step and directional navigation. */
export function Stepper({ steps, current, children, headingLevel = 2, onBack, onNext, finishLabel = "Finish", busy, className }: StepperProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(current);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const from = previous.current;
    previous.current = current;
    if (from === current) return;
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const distance = current > from ? "1rem" : "-1rem";
    const transition = panel.current?.animate(
      [{ opacity: 0, transform: `translateX(${distance})` }, { opacity: 1, transform: "none" }],
      { duration: 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    return () => transition?.cancel();
  }, [current]);
  const step = steps[current];
  const Heading = `h${headingLevel}` as const;
  if (!step) return null;
  return <section aria-label="Workflow" className={cn("space-y-6", className)}>
    <ol aria-label="Steps" className="hidden flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card p-4 sm:flex">
      {steps.map((item, index) => <li key={item.id} aria-current={index === current ? "step" : undefined} className={cn("flex items-center gap-2 text-sm", index === current ? "font-semibold text-foreground" : "text-muted-foreground")}>
        <span aria-hidden className={cn("grid size-7 place-items-center rounded-full text-xs font-semibold", item.error ? "bg-destructive/10 text-destructive" : index <= current ? "bg-primary text-primary-foreground" : "bg-muted")}>
          {item.error ? <CircleAlert size={15} /> : index < current ? <Check size={15} /> : index + 1}
        </span>{item.label}{item.error ? <span className="sr-only">, needs attention</span> : index < current && <span className="sr-only">, complete</span>}
      </li>)}
    </ol>
    <div className="space-y-2 sm:hidden">
      <p className="text-sm font-medium text-muted-foreground">Step {current + 1} of {steps.length}</p>
      <div role="progressbar" aria-label="Workflow progress" aria-valuenow={current + 1} aria-valuemax={steps.length} aria-valuemin={0} className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full origin-left rounded-full bg-primary transition-transform duration-(--duration-base)" style={{ transform: `scaleX(${(current + 1) / steps.length})` }} />
      </div>
    </div>
    <div ref={panel} className="min-w-0 space-y-4 motion-safe:animate-df-fade-in">
      <Heading ref={heading} tabIndex={-1} className="font-heading text-title font-semibold">{step.label}</Heading>
      {children}
    </div>
    <div className="flex justify-between gap-3 border-t border-border pt-4">
      <Button type="button" variant="outline" disabled={!current || busy} onClick={onBack} className="df-press min-h-11"><ArrowLeft aria-hidden />Back</Button>
      <Button type="button" disabled={busy} onClick={onNext} className="df-press min-h-11">{current === steps.length - 1 ? finishLabel : "Continue"}<ArrowRight aria-hidden /></Button>
    </div>
  </section>;
}
