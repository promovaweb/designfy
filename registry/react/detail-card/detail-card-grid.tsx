/** Arranges detail cards in two columns with one tall card. Motion comes from the child cards. */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";

export interface DetailCardGridProps {
  /** Cards in reading order. */
  children: ReactNode;
  /** Additional root classes. */
  className?: string;
}

/** Arranges detail cards in two columns with one tall card. */
export function DetailCardGrid({ children, className }: DetailCardGridProps) {
  return (
    <div className={cn("@container", className)}>
      <div
        data-df-stagger
        className="grid gap-4 @2xl:grid-cols-2 @2xl:[&>[data-tall]]:row-span-2"
      >
        {children}
      </div>
    </div>
  );
}
