/** Communicates a failure, with recovery controls and optional support code. Motion: region fades in; retry presses and shows progress. Catalog: error-state. */
import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

export interface ErrorStateProps {
  /** Plain statement of what failed. */
  title: string;
  /** Explanation and recovery instructions. */
  description: string;
  /** Level of the displayed heading. */
  headingLevel?: 1 | 2 | 3 | 4;
  /** Move focus announcements to the message after an action. */
  announce?: boolean;
  /** Inline region or full page. */
  variant?: "inline" | "page";
  /** Optional support reference. */
  code?: string;
  /** Either a retry or a way back. */
  action?: ReactNode;
  /** Additional classes. */
  className?: string;
}

/** Renders the same recovery content in a region or page. */
export function ErrorState({ title, description, headingLevel = 2, announce, variant = "inline", code, action, className }: ErrorStateProps) {
  const Heading = `h${headingLevel}` as const;
  return <section className={cn("grid justify-items-center gap-3 px-4 py-10 text-center motion-safe:animate-df-fade-in sm:py-14", variant === "page" && "min-h-[65svh] content-center", className)}>
    <TriangleAlert aria-hidden size={26} className="mb-2 text-destructive" />
    <div role={announce ? "alert" : undefined} className="space-y-2">
      <Heading className="font-heading text-title font-semibold">{title}</Heading>
      <p className="max-w-[44ch] text-sm text-muted-foreground">{description}</p>
    </div>
    {code && <p className="font-mono text-xs text-muted-foreground">Support code: {code}</p>}
    {action && <div className="mt-2">{action}</div>}
  </section>;
}
