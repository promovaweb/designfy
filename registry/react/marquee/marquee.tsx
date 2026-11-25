"use client";

/**
 * Marquee: Scrolls short passive content with an accessible stop control when the content is meaningful.
 * Slots or React nodes: children.
 * Motion: Linear travel at a fixed pixel speed, pausing on hover, focus and when off screen.
 * Catalog: marquee
 */
import { cn } from "@designfy/components/lib/cn";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export interface MarqueeProps {
  /** Short passive text items. */
  items: string[];
  /** Direction, or two rows moving in opposite directions. */
  direction?: "left" | "right" | "opposed";
  /** Accent band with decorative diamond separators. */
  variant?: "default" | "accent";
  /** Travel speed in CSS pixels per second. */
  speed?: number;
  /** Label for the pause action. Supply for meaningful content. */
  pauseLabel?: string;
  /** Label for resuming the animation. */
  resumeLabel?: string;
  /** Passive items in place of text; never pass controls or links. */
  children?: ReactNode;
  /** Additional classes on the root element. */
  className?: string;
}

function bindMarquee(root: HTMLDivElement) {
  const abort = new AbortController();
  root.setAttribute("data-marquee-ready", "");
  const tracks = Array.from(
    root.querySelectorAll<HTMLElement>("[data-marquee-track]"),
  );
  const control = root.querySelector<HTMLButtonElement>("button");
  const speed = Math.max(1, Number(root.dataset.speed) || 42);

  function measure() {
    for (const track of tracks) {
      const segment = track.firstElementChild;
      if (!segment) continue;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.style.setProperty(
        "--df-marquee-duration",
        (segment.getBoundingClientRect().width + gap) / speed + "s",
      );
    }
  }

  const resize =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(measure)
      : undefined;
  for (const track of tracks)
    if (track.firstElementChild) resize?.observe(track.firstElementChild);

  const visibility =
    "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) =>
          root.toggleAttribute("data-df-paused", !entry.isIntersecting),
        )
      : undefined;
  visibility?.observe(root);
  measure();
  control?.addEventListener(
    "click",
    () => {
      const paused = root.toggleAttribute("data-user-paused");
      control.setAttribute("aria-pressed", String(paused));
      control.textContent =
        (paused ? control.dataset.resume : control.dataset.pause) ?? "";
    },
    { signal: abort.signal },
  );

  return () => {
    abort.abort();
    resize?.disconnect();
    visibility?.disconnect();
  };
}

/** Scrolls short passive content with an accessible stop control when the content is meaningful. */
export function Marquee({
  items,
  direction = "left",
  variant = "default",
  speed = 42,
  pauseLabel,
  resumeLabel,
  children,
  className,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    return bindMarquee(root.current);
  }, [speed, direction, items]);
  return (
    <div
      ref={root}
      data-site-marquee
      data-speed={speed}
      className={cn(
        "group min-w-0 max-w-full space-y-4",
        variant === "accent" && "bg-accent py-4 text-accent-foreground",
        className,
      )}
    >
      {(direction === "opposed" ? ["left", "right"] : [direction]).map(
        (side, row) => (
          <div
            key={side}
            data-marquee-track
            data-df-direction={side}
            className={cn(
              "df-marquee min-w-0 [--df-marquee-gap:2rem] group-[:not([data-marquee-ready])]:[mask-image:none] motion-reduce:[mask-image:none]",
              row > 0 &&
                "group-[:not([data-marquee-ready])]:hidden motion-reduce:hidden",
            )}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                role="list"
                aria-hidden={copy !== 0 || row !== 0 ? true : undefined}
                className="justify-around whitespace-nowrap group-[:not([data-marquee-ready])]:w-full group-[:not([data-marquee-ready])]:flex-wrap group-[:not([data-marquee-ready])]:justify-center group-[:not([data-marquee-ready])]:whitespace-normal group-[:not([data-marquee-ready])]:[animation-play-state:paused] group-[:not([data-marquee-ready])]:[&[aria-hidden=true]]:hidden group-data-user-paused:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:whitespace-normal motion-reduce:[&[aria-hidden=true]]:hidden"
              >
                {children}
                {items.map((text) => (
                  <li key={text}>
                    {variant === "accent" && (
                      <span
                        aria-hidden="true"
                        className="me-4 inline-block size-2 rotate-45 bg-current"
                      />
                    )}
                    {text}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ),
      )}
      {pauseLabel && (
        <button
          type="button"
          data-pause={pauseLabel}
          data-resume={resumeLabel ?? pauseLabel}
          aria-pressed="false"
          className="df-press mx-auto block min-h-11 min-w-11 rounded-lg border border-border px-4 text-sm group-[:not([data-marquee-ready])]:hidden motion-reduce:hidden"
        >
          {pauseLabel}
        </button>
      )}
    </div>
  );
}
