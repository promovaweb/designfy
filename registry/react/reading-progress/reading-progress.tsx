/**
 * ReadingProgress: the thin bar on the top edge that shows how far the person
 * is in a long text.
 *
 * Decorative: the bar is aria-hidden and the same information is in the page
 * structure. The fill scales on the X axis from a scroll timeline, without a
 * script; browsers without scroll-driven animations and people with reduced
 * motion see no bar.
 *
 * Motion: transform scaleX tied to the scroll position.
 *
 * Catalog: reading-progress
 */
import { cn } from "@designfy/components/lib/cn";
import "./reading-progress.css";

export interface ReadingProgressProps {
  className?: string;
}

/** Draws the scroll position of the page as a line. */
export function ReadingProgress({ className }: ReadingProgressProps) {
  return (
    <div aria-hidden="true" className={cn("df-reading-progress", className)}>
      <div className="df-reading-progress-fill" />
    </div>
  );
}
