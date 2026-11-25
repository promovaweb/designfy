"use client";

/**
 * PixelStage: places a decorative theme-driven canvas and a readable veil behind children.
 * Motion: snapped pixels drift in a bounded frame loop, with reduced motion and independent pause.
 */
import { cn } from "@designfy/components/lib/cn";
import { bindPixelStage } from "@designfy/components/pixel-stage/pixel-stage-runtime";
import { useEffect, useRef, type ReactNode } from "react";

export interface PixelStageProps {
  /** Accessible toggle label, kept stable when the pressed state changes. */
  pauseLabel: string;
  /** Stage content, which determines its height. */
  children: ReactNode;
  /** Additional classes on the stage. */
  className?: string;
}

/** Places decorative, pausable motion behind the supplied content. */
export function PixelStage({
  pauseLabel,
  children,
  className,
}: PixelStageProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return bindPixelStage(root.current);
  }, []);

  return (
    <div
      ref={root}
      data-df-pixel-stage
      className={cn(
        "relative isolate overflow-clip bg-background text-foreground [--df-pixel-accent:var(--accent-foreground)] [--df-pixel-detail:var(--foreground)] [--df-pixel-highlight:var(--muted-foreground)] [--df-pixel-primary:var(--primary)]",
        className,
      )}
    >
      <canvas
        width={1}
        height={1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 size-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background via-background/95 to-background/40 lg:bg-linear-to-r lg:via-background/90 lg:to-background/30"
      />
      {children}
      <button
        type="button"
        data-df-pixel-control
        aria-pressed="false"
        hidden
        className="df-press absolute -start-[999rem] top-2 z-10 min-h-11 min-w-11 rounded-lg border border-border bg-background px-4 text-sm hover:bg-muted focus-visible:start-2 [&[hidden]]:hidden"
      >
        {pauseLabel}
      </button>
    </div>
  );
}
